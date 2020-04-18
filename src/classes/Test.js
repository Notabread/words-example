import Task from "./Task";
import shuffle from "lodash/shuffle"

export default class Test {

    constructor({ service, ui }) {
        this._service = service;
        this._ui = ui;
        this._status = 'not ready';
        this._ui.setTest(this);
        this._tasks = [];
        this._savedData = this.getData();
        if (this._savedData) {
            this._continueTest();
        } else {
            this._newTest();
        }
    }

    _newTest() {
        this._service.saveTestState(null);
        this._current = 0;
        this._mistakes = [];
        this._time = [];
        this._time[0] = 0;
        this.taskProgress = 0;
        this._isNew = true;
        this._service.getTasks().then(data => {
            this._json = data;
            this._status = 'ready';
            this._ui.UIHandler('test:ready');
        });
    }

    _continueTest() {
        let data = this._savedData;
        this._current = data._current;
        this._mistakes = data._mistakes;
        this._time = data._time;
        this.taskProgress = data._taskProgress;
        this._json = data._json;
        this._status = 'saved';
        this._ui.UIHandler('test:saved');
    }

    inputHandler(msg, payload = {}) {
        const handler = `_${msg}`;
        if (typeof this[handler] === 'function') {
            this[handler](payload);
        } else {
            console.warn(`Test: There is no handler for ${msg}!`);
        }
    }

    ['_test:continue']() {
        console.log('Тест возобновлён');
        this['_test:boot']();
    }

    ['_test:new']() {
        console.log('Запрос нового теста');
        this._newTest();
    }

    ['_test:boot']() {
        console.log('Запуск теста');
        this._startTimer();
        this._createTasks(this._json);
        this._ui.UIHandler('task:change');
    }

    ['_answer:check']({ answer }) {
        this.task.checkAnswer(answer);
    }

    _createTasks(data) {
        if (this._isNew) {
            this._json = shuffle(data);
            this._tasks = this._json.map(Task.create);
        } else {
            this._json[this._current]._taskProgress = this.taskProgress;
            this._tasks = data.map(Task.create);
        }
        this._tasks.forEach(task => {
            const checkFn = task.checkAnswer;
            const self = this;
            task.checkAnswer = function (answer) {
                let result = checkFn.call(task, answer);
                if (result) {
                    //нет ошибки
                    self.taskProgress++;
                    console.log('Нет ошибки');
                    self._ui.UIHandler('answer:correct');
                } else {
                    //есть ошибка
                    self._mistakes[self._current] = self._mistakes[self._current] ? self._mistakes[self._current] + 1 : 1;
                    console.log("Ошибка");
                    self._ui.UIHandler('answer:incorrect');
                }
                if (task.isComplited) {
                    //функция переключение задачи
                    self._current++;
                    self.taskProgress = 0;
                    if (!self.task) {
                        clearInterval(self._timer);
                        self._service.saveTestState(null);
                        console.log("Тест окончен");
                        self._ui.UIHandler('test:finished', { tasks: self._json, mistakes: self._mistakes, timings: self._time });
                        return 0;
                    }
                    console.log("Смена задачи");
                    self._ui.UIHandler('task:change');
                    return 0;
                }
                return 0;
            }
        });
    }

    get task() {
        if (this._current >= 0) {
            return this._tasks[this._current];
        }
        return null;
    }

    get isReady() {
        return this._status === 'ready';
    }

    get state() {
        return {
            current: this._current,
            total: this._tasks.length,
        }
    }

    get isSaved() {
        return this._status === 'saved';
    }

    saveData() {
        let data = {};
        data._json = this._json;
        data._taskProgress = this.taskProgress;
        data._current = this._current;
        data._mistakes = this._mistakes;
        data._time = this._time;
        this._service.saveTestState(data);
    }

    getData() {
        return this._service.getTestState();
    }

    _startTimer() {
        let time = 0;
        this._time.forEach(task => {
            time += task;
        });
        const tik = () => {
            this.saveData();
            this._ui.UIHandler('counter:tick', { time: time });
        };
        tik();
        this._timer = setInterval(() => {
            time += 1;
            this._time[this._current] = this._time[this._current] ? this._time[this._current] + 1 : 1;
            tik();
        }, 1000);
    }

}