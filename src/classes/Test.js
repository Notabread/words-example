import Service from "./Service";
import { Task } from "./Task";
import shuffle from "lodash/shuffle"

export default class Test {

    constructor() {
        this._service = new Service('./data.json');
        this._service.getTasks().then(data => this._createTasks(data));
        this._tasks = [];
        this._current = -1;
    }

    _createTasks(data) {
        this._tasks = shuffle(data).map(Task.create);
        this._tasks.forEach(task => {
            const checkFn = task.checkAnswer;
            const self = this;
            task.checkAnswer = function (answer) {
                let result = checkFn.call(task, answer);
                if (result) {
                    //нет ошибки
                } else {
                    //есть ошибка
                }
                if (task.isComplited) {
                    self._current++;
                }
                return result;
            }
        });
        this._current = 0;
    }

    get task() {
        if (this._current >= 0) {
            return this._tasks[this._current];
        }
        return null;
    }


}