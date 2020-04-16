export default class TaskModule {

    constructor() {


    }

    static create(data) {
        const constructor = TaskModule._modules[data.type];
        if (constructor) {
            return new constructor(data);
        }
        throw new Error(`There is no constructor for ${data.type}!`);
    }

    static register(key, constructor) {
        if (TaskModule._modules[key]) {
            throw new Error(`Module ${key} already registered!`);
        }
        TaskModule._modules[key] = constructor;
    }

}

TaskModule._modules = {};