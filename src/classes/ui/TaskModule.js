export default class TaskModule {

    /**
     * Задаём основные общие параметры и вызываем метод отрисовки
     *
     * @param data
     */
    constructor(data) {
        this._test = data.test;
        this.infoBlock = document.querySelector("#question_info");
        this.questionBlock = document.querySelector("#letters");
        this.answerBlock = document.querySelector('#answer');
        this._render(data);
    }

    /**
     * Относительно общий метод отрисовки
     *
     * @private
     */
    _render() {
        document.querySelector('#pop').style.display = 'none';
        document.querySelector('#new_test').style.display = 'none';
        this._clearField();
        this._setCurrent();
    }

    /**
     * Функция очистки задач
     *
     * @private
     */
    _clearField() {
        this.questionBlock.innerHTML = '';
        this.infoBlock.innerHTML = '';
        this.answerBlock.innerHTML = '';
    }

    /**
     * Фкункция индикатора текущей задачи (меняет номер текущей задачи)
     *
     * @private
     */
    _setCurrent() {
        let { total, current } = this._test.state;
        this.totalBlock = document.querySelector("#total_questions");
        this.currentBlock = document.querySelector("#current_question");
        this.totalBlock.innerHTML = total;
        this.currentBlock.innerHTML = current + 1;
    }

    /**
     * Функция создания экземпляров по зарегистрированным ключам
     *
     * @param data
     */
    static create(data) {
        const constructor = TaskModule._modules[data.type];
        if (constructor) {
            return new constructor(data);
        }
        throw new Error(`UI: There is no constructor for ${data.type}!`);
    }

    /**
     * Функция регистрации новых модулей
     *
     * @param key
     * @param constructor
     */
    static register(key, constructor) {
        if (TaskModule._modules[key]) {
            throw new Error(`UI: Module ${key} already registered!`);
        }
        TaskModule._modules[key] = constructor;
    }

}

TaskModule._modules = {};
