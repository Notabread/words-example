import TaskModule from "./TaskModule";

export default class PopModule extends TaskModule {

    /**
     * Отрисовка технических сообщений о новом или незавершённом тесте
     *
     * @param isNew
     * @private
     */
    _render({ isNew = false }) {
        super._render();
        if (isNew) {
            console.log('ui: Вывод сообщения о новом тесте');
            const pop = document.querySelector('#new_test');
            const acceptBtn = document.querySelector('#ready_for_new');
            pop.style.display = 'block';
            acceptBtn.addEventListener('click', () => {
                this._test.inputHandler('test:boot'); //Отправляем запрос на подготовку нового теста
            });
        } else {
            console.log('ui: Вывод сообщения о незаконченном тесте');
            const pop = document.querySelector('#pop');
            const acceptBtn = document.querySelector('#accept_continue');
            const declineBtn = document.querySelector('#decline_continue');
            pop.style.display = 'block';
            acceptBtn.addEventListener('click', () => {
                this._test.inputHandler('test:continue'); //Отправляем запрос на продолжение теста
            });
            declineBtn.addEventListener('click', () => {
                this._test.inputHandler('test:new'); //Отправляем запрос на подготовку нового теста
            });
        }
    }

}

TaskModule.register('pop', PopModule);