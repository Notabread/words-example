import { Task } from "./Task";
import shuffle from "lodash/shuffle"

export default class Test {

    constructor({ service, ui }) {
        this._service = service;
        this._ui = ui;
        this._ui.setTest(this);

        let data = this.getData();
        let self = this;
        const newTest = function () {
            self._service.getTasks().then(data => {
                self._json = data;
                self._createTasks(data)
            });
            self._tasks = [];
            self._current = 0;
            self._mistakes = [];
            self._time = [];
            self._time[0] = 0;
            self._taskProgress = 0;
            self.isNew = true;
        };
        if (data) {
            this._ui.UIHandler('test:saved');
            // acceptBtn.addEventListener('click', () => {
            //     this._current = data._current;
            //     this._mistakes = data._mistakes;
            //     this._time = data._time;
            //     const div = document.querySelector('#timer');
            //     let time = 0;
            //     this._time.forEach(task => {
            //         time += task;
            //     });
            //     this._taskProgress = data._taskProgress;
            //     div.innerHTML = time;
            //     this._json = data._json;
            //     this._createTasks(data._json);
            //     pop.style.display = 'none';
            //     self.startTimer();
            // });
            // declineBtn.addEventListener('click', () => {
            //     this._service.saveTestState(null);
            //     pop.style.display = 'none';
            //     newTest();
            // });
        } else {
            newTest();
        }

    }

    _createTasks(data) {
        if (this.isNew) {
            this._json = shuffle(data);
            this._tasks = this._json.map(Task.create);
        } else {
            this._json[this._current]._taskProgress = this._taskProgress;
            this._tasks = data.map(Task.create);
        }
        this._tasks.forEach(task => {
            const checkFn = task.checkAnswer;
            const self = this;
            task.checkAnswer = function (answer) {
                let result = checkFn.call(task, answer);
                if (!self._timer) {
                    //Старт таймера
                    self.startTimer();
                }
                if (result) {
                    //нет ошибки
                    self._taskProgress++;
                    console.log('Нет ошибки');
                } else {
                    //есть ошибка
                    self._mistakes[self._current] = self._mistakes[self._current] ? self._mistakes[self._current] + 1 : 1;
                    console.log(self._mistakes);
                    console.log("Ошибка");
                }
                if (task.isComplited) {
                    //функция переключение задачи
                    self._current++;
                    self._taskProgress = 0;
                    console.log("След. задача");
                    result = 'next';
                }
                self.saveData();
                return result;
            }
        });
        this.boot();
    }


    startTimer() {
        const div = document.querySelector('#timer');
        let time = 0;
        this._time.forEach(task => {
            time += task;
        });
        const tik = () => {
            div.innerHTML = Math.round(time/10) + '';
        };
        tik();
        this._timer = setInterval(() => {
            time += 1;
            this._time[this._current] = this._time[this._current] ? this._time[this._current] + 1 : 1;
            tik();
        }, 100);
    }


    boot() {

        const qCount = this._tasks.length;
        let current = this._current + 1;
        const counterBlock = document.querySelector("#total_questions");
        const currentBlock = document.querySelector("#current_question");
        currentBlock.innerHTML = current + '';
        counterBlock.innerHTML = qCount + '';
        this.expandQuestion();

    }

    changeField() {
        let current = this._current;
        const infoBlock = document.querySelector("#question_info");
        const answerBlock = document.querySelector('#answer');
        const questionBlock = document.querySelector("#letters");
        questionBlock.innerHTML = '';
        if (current === this._tasks.length) {
            let sucBlock = document.createElement('div');
            sucBlock.className = 'alert alert-primary';
            clearInterval(this._timer);
            let mistakes = 0, time = 0;
            this._mistakes.forEach((task) => {
                mistakes += task;
            });
            this._time.forEach(task => {
                time += task;
            });
            sucBlock.innerHTML = `Тест окончен, количество ошибок: ${ mistakes }<br>Время выполнения: ${ time/10 } сек.`;
            questionBlock.append(sucBlock);
            this.tableGenerate();
            this._service.saveTestState(null);
            return null;
        }
        current++;
        infoBlock.innerHTML = '';
        answerBlock.innerHTML = '';
        const currentBlock = document.querySelector("#current_question");
        currentBlock.innerHTML = current + '';
        this.expandQuestion();
    }

    tableGenerate() {

        let field = document.querySelector('#letters');
        let table = document.createElement('table');
        table.className = 'table table-hover';
        let thead = document.createElement('thead');
        table.append(thead);
        let tr = document.createElement('tr');
        thead.append(tr);
        let tbody = document.createElement('tbody');
        table.append(tbody);
        tr.innerHTML = '<th scope="col">#</th><th scope="col">Время выполнения задания</th><th scope="col">Допущено ошибок</th>';
        this._json.forEach((task, i) => {
            this._mistakes[i] = this._mistakes[i] ? this._mistakes[i] : 0;
            let tr = document.createElement('tr');
            tr.innerHTML = `<th scope="row">${i + 1} (${ this._json[i].question })</th><td>${this._time[i]/10} сек.</td><th>${this._mistakes[i]}</th>`;
            tbody.append(tr);
        });

        field.append(table);
        return null;
    }

    expandQuestion() {
        this._ui.UIHandler('task:change');
        const infoBlock = document.querySelector("#question_info");
        infoBlock.innerHTML = this.task.info;
        const questionBlock = document.querySelector("#letters");
        const answerBlock = document.querySelector('#answer');
        const self = this;
        switch (this.task._type) {
            case'word': {
                if (this._taskProgress > 0) {
                    for (let i = 0; i < this._taskProgress; i++) {
                        let button = document.createElement('button');
                        let letter = this.task._answer[i];
                        button.className = 'btn btn-success elem';
                        answerBlock.append(button);
                        button.innerHTML = letter;
                    }
                }
                this.task.question.forEach((letter) => {
                    let button = document.createElement('button');
                        button.className = 'btn btn-info elem';
                        questionBlock.append(button);
                        button.addEventListener('click', () => {
                            let result = this.task.checkAnswer(letter);
                            if (result) {
                                //тут функция для скрытия верно нажатых кнопок и тд
                                button.style.display = 'none';
                                let right = document.createElement('button');
                                right.className = 'btn btn-success elem';
                                right.innerHTML = letter;
                                answerBlock.append(right);
                                if (result === 'next') {
                                    self.changeField();
                                    return null;
                                }
                            } else {
                                //тут мы подсвечиваем красным неправильно нажатые кнопки
                                button.classList.add('btn-danger');
                                setTimeout(() => {
                                    button.classList.remove('btn-danger');
                                }, 300);
                            }
                        });
                    button.innerHTML = letter;
                });
                break;
            }
            case'phrase': {
                if (this._taskProgress > 0) {
                    for (let i = 0; i < this._taskProgress; i++) {
                        let button = document.createElement('button');
                        let word = this.task._answer[i];
                        button.className = 'btn btn-success elem';
                        answerBlock.append(button);
                        button.innerHTML = word;
                    }
                }
                this.task.question.forEach(word => {
                    let button = document.createElement('button');
                    button.className = 'btn btn-info elem';
                    button.innerHTML = word;
                    questionBlock.append(button);
                    button.addEventListener('click', () => {
                        let result = this.task.checkAnswer(word);
                        if (result) {
                            //тут функция для скрытия верно нажатых кнопок и тд
                            button.style.display = 'none';
                            let right = document.createElement('button');
                            right.className = 'btn btn-success elem';
                            right.innerHTML = word;
                            answerBlock.append(right);
                            if (result === 'next') {
                                //завершение задания и переход к следующему
                                self.changeField();
                                return null;
                            }
                        } else {
                            //тут мы подсвечиваем красным неправильно нажатые кнопки
                            button.classList.add('btn-danger');
                            setTimeout(() => {
                                button.classList.remove('btn-danger');
                            }, 300);
                        }
                    });
                });
                break;
            }
            case'translate': {
                questionBlock.innerHTML = this.task.question;
                let form = document.createElement('form');
                let div = document.createElement('div');
                let label = document.createElement('label');
                let input = document.createElement('input');
                let button = document.createElement('button');
                form.className = 'form-inline';
                form.id = 'translate';
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    let answer = input.value;
                    let result = this.task.checkAnswer(answer);
                    if (result) {
                        //завершение задания
                        self.changeField();
                        return null;
                    } else {
                        //тут вывод сообщения об ошибке
                        button.classList.add('btn-danger');
                        setTimeout(() => {
                            button.classList.remove('btn-danger');
                        }, 300);
                    }
                });
                div.className = 'form-group mb-2';
                label.className = 'sr-only';
                label.setAttribute('for', 'input_tr');
                input.className = 'form-control elem';
                input.id = 'input_tr';
                input.setAttribute('type', 'text');
                button.className = 'btn btn-primary mb-2';
                button.setAttribute('type', 'submit');
                button.innerHTML = 'Проверить';
                form.append(div);
                form.append(button);
                div.append(input);
                answerBlock.append(form);
                break;
            }
            default: {
                break;
            }
        }
    }

    get task() {
        if (this._current >= 0) {
            return this._tasks[this._current];
        }
        return null;
    }

    saveData() {

        let data = {};
        data._json = this._json;
        data._taskProgress = this._taskProgress;
        data._current = this._current;
        data._mistakes = this._mistakes;
        data._time = this._time;
        this._service.saveTestState(data);

    }

    getData() {
        return this._service.getTestState();
    }
}