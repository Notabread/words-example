import TaskModule from "./ui/TaskModule";
import PopModule from "./ui/PopModule";
import WordModule from "./ui/WordModule";
import PhraseModule from "./ui/PhraseModule";
import TranslateModule from "./ui/TranslateModule";

export default class UIController {

    constructor() {
        this._loadHandler();
        this._isLoaded = false;
    }

    setTest(test) {
        this._test = test;
    }

    _loadHandler() {
        window.addEventListener('load', () => {
            if (this._test.isReady) {
                //this._test.inputHandler('test:boot');
                TaskModule.create({type: 'pop', test: this._test, isNew: true});
            }
            if (this._test.isSaved) {
                TaskModule.create({type: 'pop', test: this._test});
            }
            this._isLoaded = true;
        });
    }

    UIHandler(msg, payload = {}) {
        const handler = `_${msg}`;
        if (typeof this[handler] === 'function') {
            this[handler](payload);
        } else {
            console.warn(`UI: There is no handler for ${msg}!`);
        }
    }

    ['_test:saved']() {
        //Отрисовка сообщения о незакоченном тесте
        if (this._isLoaded) {
            TaskModule.create({type: 'pop', test: this._test});
        }
    }

    ['_test:ready']() {
        if (this._isLoaded) {
            //Отрисовка сообщения о готовности начать новый тест
            TaskModule.create({ type: 'pop', test: this._test, isNew: true });
        }
    }

    ['_test:finished']() {
        //Отрисовка результатов
        console.log('ui: Тест закончен');
    }

    ['_task:change']() {
        //Смена задачи
        //Получить текущую задачу
        const { task }  = this._test;

        //Кинуть её отрисовщику
        this._currentTask = TaskModule.create({ type: task.type, test: this._test });
    }

    ['_answer:incorrect']() {
        //Ответ неправильный
        this._currentTask.incorrect();
    }

    ['_answer:correct']() {
        //Ответ верный
        this._currentTask.correct();
    }

    ['_counter:tick']({ time }) {
        document.querySelector('#timer').innerHTML = time;
    }

}