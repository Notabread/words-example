import TaskModule from "./TaskModule";

export default class TranslateModule extends TaskModule {

    _render() {
        super._render();
        this.questionBlock.innerHTML = this._test.task.question;
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
            this._currentBtn = button;
            this._test.inputHandler('answer:check', { answer: answer });
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
        this.answerBlock.append(form);
    }

    correct() {
        return 0;
    }

    incorrect() {
        let button = this._currentBtn;
        button.classList.add('btn-danger');
        setTimeout(() => {
            button.classList.remove('btn-danger');
        }, 300);
    }

}

TaskModule.register('translate', TranslateModule);