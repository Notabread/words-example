export default class TaskModule {

    constructor(data) {
        this._test = data.test;
        this.infoBlock = document.querySelector("#question_info");
        this.questionBlock = document.querySelector("#letters");
        this.answerBlock = document.querySelector('#answer');
        document.querySelector('#pop').style.display = 'none';
        document.querySelector('#new_test').style.display = 'none';
        this._render(data);
    }

    _render() {
        this._clearField();
        this._setCurrent();
    }

    _clearField() {
        this.questionBlock.innerHTML = '';
        this.infoBlock.innerHTML = '';
        this.answerBlock.innerHTML = '';
    }

    _setCurrent() {
        let { total, current } = this._test.state;
        this.totalBlock = document.querySelector("#total_questions");
        this.currentBlock = document.querySelector("#current_question");
        this.totalBlock.innerHTML = total;
        this.currentBlock.innerHTML = current + 1;
    }

    static create(data) {
        const constructor = TaskModule._modules[data.type];
        if (constructor) {
            return new constructor(data);
        }
        throw new Error(`UI: There is no constructor for ${data.type}!`);
    }

    static register(key, constructor) {
        if (TaskModule._modules[key]) {
            throw new Error(`UI: Module ${key} already registered!`);
        }
        TaskModule._modules[key] = constructor;
    }

}

TaskModule._modules = {};
