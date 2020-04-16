import TaskModule from "./TaskModule";

export default class SavedModule extends TaskModule {


        constructor() {
            super();
            this._render();
        }


    _render() {
        //Отрендерить сообщение о незаконченном тесте


        const pop = document.querySelector('#pop');
        pop.style.display = 'block';
        const acceptBtn = document.querySelector('#accept_continue');
        const declineBtn = document.querySelector('#decline_continue');


    }

}

TaskModule.register('saved', SavedModule);