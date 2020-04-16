import TaskModule from "./ui/TaskModule";

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
                this._test.boot();
            }
            this._isLoaded = true;
        });
    }

    UIHandler(msg) {
        const handler = `_${msg}`;
        if (typeof this[handler] === 'function') {
            this[handler]();
        } else {
            console.warn(`There is no handler for ${msg}!`);
        }
    }

    ['_test:ready']() {
        if (this._isLoaded) {
            this._test.boot();
        }
    }

    ['_test:saved']() {
        //Отрисовка сообщения о незакоченном тесте
        TaskModule.create({ type: 'saved' });
    }

    ['_test:finished']() {
        //Отрисовка результатов
    }

    ['_task:change']() {
        //Смена задачи
        //Получить текущую задачу
        const { task }  = this._test;

        //Кинуть её отрисовщику
        console.log(task);
    }

    ['_answer:incorrect']() {
        //Ответ неправильный
    }

    ['_answer:correct']() {
        //Ответ верный
    }

}