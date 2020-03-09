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
        this._boot();
    }

    get task() {
        if (this._current >= 0) {
            return this._tasks[this._current];
        }
        return null;
    }

    _boot() {

        const qCount = this._tasks.length;
        let current = this._current + 1;
        const counterBlock = document.querySelector("#total_questions");
        const currentBlock = document.querySelector("#current_question");
        currentBlock.innerHTML = current + '';
        counterBlock.innerHTML = qCount + '';
        this.expandQuestion();

    }

    expandQuestion() {
        const infoBlock = document.querySelector("#question_info");
        infoBlock.innerHTML = this.task.info;
        const questionBlock = document.querySelector("#letters");
        switch (this.task._type) {
            case'word': {

                this.task.question.forEach(letter => {

                    let div = document.createElement('button');
                    div.className = 'btn btn-info elem';
                    div.innerHTML = letter;
                    questionBlock.append(div);

                });


                break;
            }
            case'phrase': {




                break;
            }
            case'translate': {




                break;
            }
            default: {
                break;
            }

        }


    }

}