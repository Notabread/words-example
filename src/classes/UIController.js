import TaskModule from "./ui/TaskModule";
import PopModule from "./ui/PopModule";
import TableModule from "./ui/TableModule";
import WordModule from "./ui/WordModule";
import PhraseModule from "./ui/PhraseModule";
import TranslateModule from "./ui/TranslateModule";

export default class UIController {

    /**
     * Запуск обработчика загрузки страницы
     *
     */
    constructor() {
        this._loadHandler();
        this._isLoaded = false;
    }

    /**
     * Получение экземпляра основного класса Test
     *
     * @param test
     */
    setTest(test) {
        this._test = test;
    }

    /**
     * Обработчик события load. Ждём, чтобы страница полностью загрузилась перед началом теста
     *
     * @private
     */
    _loadHandler() {
        window.addEventListener('load', () => {
            if (this._test.isReady) {
                TaskModule.create({type: 'pop', test: this._test, isNew: true});
            }
            if (this._test.isSaved) {
                TaskModule.create({type: 'pop', test: this._test});
            }
            this._isLoaded = true;
        });
    }

    /**
     * Обработчик сообщений от логического слоя
     *
     * @param msg
     * @param payload
     * @constructor
     */
    UIHandler(msg, payload = {}) {
        const handler = `_${msg}`;
        if (typeof this[handler] === 'function') {
            this[handler](payload);
        } else {
            console.warn(`UI: There is no handler for ${msg}!`);
        }
    }

    /**
     * Запрос на отрисовку сообщения о незаконченном тесте
     *
     * @private
     */
    ['_test:saved']() {
        if (this._isLoaded) {
            TaskModule.create({type: 'pop', test: this._test});
        }
    }

    /**
     * Запрос на отрисовку сообщения о готовности начать новый тест
     *
     * @private
     */
    ['_test:ready']() {
        if (this._isLoaded) {
            TaskModule.create({ type: 'pop', test: this._test, isNew: true });
        }
    }

    /**
     * Конец теста
     * Запрос на генерацию таблицы с результатами
     *
     * @param results
     * @private
     */
    ['_test:finished'](results) {
        this._currentTask = TaskModule.create({ type: 'table', test: this._test, results: results });
    }

    /**
     * Запрос на отрисовку новой задачи
     *
     * @private
     */
    ['_task:change']() {
        const { task }  = this._test;
        this._currentTask = TaskModule.create({ type: task.type, test: this._test });
    }

    /**
     * Запрос на реакцию о неверном ответе
     *
     * @private
     */
    ['_answer:incorrect']() {
        this._currentTask.incorrect();
    }

    /**
     * Запрос на реакцию о верном ответе
     *
     * @private
     */
    ['_answer:correct']() {
        this._currentTask.correct();
    }

    /**
     * Отрисовка количества прошедших секунд
     *
     * @param time
     * @private
     */
    ['_counter:tick']({ time }) {
        document.querySelector('#timer').innerHTML = time;
    }

}