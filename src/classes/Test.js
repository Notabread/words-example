import Service from "./Service";
import { Task } from "./Task";
import shuffle from "lodash/shuffle"

export default class Test {

    constructor() {
        this._service = new Service('./data.json');
        this._service.getTasks().then(data => this._createTasks(data));
        this._tasks = [];
        this._current = -1;
        this._mistakes = 0;
        this._time = 0;
    }

    _createTasks(data) {
        this._tasks = shuffle(data).map(Task.create);
        this._tasks.forEach(task => {
            const checkFn = task.checkAnswer;
            const self = this;
            task.checkAnswer = function (answer) {
                let result = checkFn.call(task, answer);
                if (self._time === 0) {
                    self.startTimer();
                }
                if (result) {
                    //нет ошибки
                    console.log('Нет ошибки');
                } else {
                    //есть ошибка
                    self._mistakes++;
                    console.log("Ошибка");
                }
                if (task.isComplited) {
                    self._current++;
                    //функция переключение задачи
                    console.log("След. задача");
                    return 'next';
                }
                return result;
            }
        });
        this._current = 0;
        this._boot();
    }

    startTimer() {
        const div = document.querySelector('#timer');
        const tik = () => {
            div.innerHTML = this._time;
        };
        tik();
        this._timer = setInterval(() => {
            this._time++;
            tik();
        }, 1000);
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

    clearField() {
        const infoBlock = document.querySelector("#question_info");
        const answerBlock = document.querySelector('#answer');
        const questionBlock = document.querySelector("#letters");
        infoBlock.innerHTML = '';
        answerBlock.innerHTML = '';
        questionBlock.innerHTML = '';
        let current = this._current;

        if (current === this._tasks.length) {
            let infoBlock = document.querySelector('#info');
            infoBlock.innerHTML = '';
            clearInterval(this._timer);
            answerBlock.innerHTML = `Тест окончен, количество ошибок: ${this._mistakes}<br> время выполнения: ${this._time} сек.`;
            return null;
        }

        current++;
        const currentBlock = document.querySelector("#current_question");
        currentBlock.innerHTML = current + '';
        this.expandQuestion();
    }

    expandQuestion() {
        const infoBlock = document.querySelector("#question_info");
        infoBlock.innerHTML = this.task.info;
        const questionBlock = document.querySelector("#letters");
        const answerBlock = document.querySelector('#answer');
        const self = this;
        switch (this.task._type) {
            case'word': {

                this.task.question.forEach(letter => {
                    let button = document.createElement('button');
                    button.className = 'btn btn-info elem';
                    button.id = `task_${letter}`;
                    button.innerHTML = letter;
                    questionBlock.append(button);
                    button.addEventListener('click', () => {
                        let result = this.task.checkAnswer(letter);
                        if (result === 'next') {
                            self.clearField();
                            return null;
                        }
                        if (result) {
                            //тут функция для скрытия верно нажатых кнопок и тд
                            button.style.display = 'none';
                            let right = document.createElement('button');
                            right.className = 'btn btn-success elem';
                            right.innerHTML = letter;
                            answerBlock.append(right);
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
            case'phrase': {

                this.task.question.forEach(word => {
                    let button = document.createElement('button');
                    button.className = 'btn btn-info elem';
                    button.id = `task_${word}`;
                    button.innerHTML = word;
                    questionBlock.append(button);
                    button.addEventListener('click', () => {
                        let result = this.task.checkAnswer(word);
                        if (result === 'next') {
                            //завершение задания и переход к следующему
                            self.clearField();
                            return null;
                        }
                        if (result) {
                            //тут функция для скрытия верно нажатых кнопок и тд
                            button.style.display = 'none';
                            let right = document.createElement('button');
                            right.className = 'btn btn-success elem';
                            right.innerHTML = word;
                            answerBlock.append(right);
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
                        self.clearField();
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

}