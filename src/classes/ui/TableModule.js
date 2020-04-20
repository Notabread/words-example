import TaskModule from "./TaskModule";

export default class TableModule extends TaskModule {

    /**
     * Отрисовка таблицы резултатов и вывод общей информации
     *
     * @param tasks
     * @param mistakes
     * @param timings
     * @private
     */
    _render( { results: { tasks, mistakes, timings } } ) {

        //Блок вывода общей информации
        let sucBlock = document.createElement('div');
        sucBlock.className = 'alert alert-primary';
        let mst = 0, time = 0;
        mistakes.forEach((task) => {
            mst += task;
        });
        timings.forEach(task => {
            time += task;
        });
        sucBlock.innerHTML = `Тест окончен, количество ошибок: ${ mst }<br>Время выполнения: ${ time } сек.`;
        this.questionBlock.append(sucBlock);

        //Сама таблица
        let field = this.questionBlock;
        let table = document.createElement('table');
        table.className = 'table table-hover';
        let thead = document.createElement('thead');
        table.append(thead);
        let tr = document.createElement('tr');
        thead.append(tr);
        let tbody = document.createElement('tbody');
        table.append(tbody);
        tr.innerHTML = '<th scope="col">#</th><th scope="col">Время выполнения задания</th><th scope="col">Допущено ошибок</th>';
        tasks.forEach((task, i) => {
            mistakes[i] = mistakes[i] ? mistakes[i] : 0;
            let tr = document.createElement('tr');
            tr.innerHTML = `<th scope="row">${i + 1} (${ tasks[i].question })</th><td>${ timings[i] } сек.</td><th>${ mistakes[i] }</th>`;
            tbody.append(tr);
        });
        field.append(table);
    }

}

TaskModule.register('table', TableModule);