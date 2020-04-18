import TaskModule from "./TaskModule";

export default class PopModule extends TaskModule {

    _render({ isNew = false }) {
        super._render();
        if (isNew) {
            console.log('ui: Вывод сообщения о новом тесте');
            const pop = document.querySelector('#new_test');
            const acceptBtn = document.querySelector('#ready_for_new');
            pop.style.display = 'block';
            acceptBtn.addEventListener('click', () => {
                this._test.inputHandler('test:boot');
            });
        } else {
            console.log('ui: Вывод сообщения о незаконченном тесте');
            const pop = document.querySelector('#pop');
            const acceptBtn = document.querySelector('#accept_continue');
            const declineBtn = document.querySelector('#decline_continue');
            pop.style.display = 'block';
            acceptBtn.addEventListener('click', () => {
                this._test.inputHandler('test:continue');
            });
            declineBtn.addEventListener('click', () => {
                this._test.inputHandler('test:new');
            });
        }
    }

}

TaskModule.register('pop', PopModule);