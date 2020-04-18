import TaskModule from "./TaskModule";

export default class WordModule extends TaskModule {

    /**
     * Отрисовка задачи на сбор слова по буквам (возможно стоило сделать общий класс для типов задач "word" и "phrase")
     *
     * @private
     */
    _render() {
        super._render();
        if (this._test.taskProgress > 0) {
            for (let i = 0; i < this._test.taskProgress; i++) {
                let button = document.createElement('button');
                let letter = this._test.task._answer[i];
                button.className = 'btn btn-success elem';
                this.answerBlock.append(button);
                button.innerHTML = letter;
            }
        }
        this._test.task.question.forEach((letter) => {
            let button = document.createElement('button');
            button.className = 'btn btn-info elem';
            button.innerHTML = letter;
            this.questionBlock.append(button);
            button.addEventListener('click', () => {
                this._currentBtn = button;
                this._test.inputHandler('answer:check', { answer: letter }); //Отправляем запрос на проверку ответа
            });
        });
    }

    /**
     * Функция реакции на верно нажатую букву
     *
     */
    correct() {
        let button = this._currentBtn;
        button.style.display = 'none';
        let right = document.createElement('button');
        right.className = 'btn btn-success elem';
        right.innerHTML = button.textContent;
        this.answerBlock.append(right);
    }

    /**
     * Функция реакции на неверно нажатую букву
     *
     */
    incorrect() {
        //тут мы подсвечиваем красным неправильно нажатые кнопки
        let button = this._currentBtn;
        button.classList.add('btn-danger');
        setTimeout(() => {
            button.classList.remove('btn-danger');
        }, 300);
    }

}

TaskModule.register('word', WordModule);