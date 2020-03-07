import shuffle from "lodash/shuffle"

export class Task {
    //проверить ответ
    //подготовить задание
    /*
        data - объект в формате
        {
            type: "word",
            question: "apple",
            answer: "apple"
        }
     */
    constructor() {
        this._info = '';
        if (this.constructor === Task) {
            throw new Error("It's not possible to create an instance of abstract class");
        }
    }

    checkAnswer(answer) {
        throw new Error("checkAnswer should be implemented in subclass");
    }

    getDescription() {
        return this._info;
    }

    static create(data) {
        const constructor = Task._subclasses[data.type];
        if (constructor) {
            return new constructor(data);
        }
        throw new Error(`There is no constructor specified for type ${data.type}`);
    }

    static register(key, constructor) {
        if (Task._subclasses[key]) {
            throw new Error(`Constructor for type ${key} is already registered`)
        }
        Task._subclasses[key] = constructor;
    }

}

Task._subclasses = {};

export class WordTask extends Task {

    constructor({ question }) {
        super();
        this._info = "Соберите слово по буквам";
        this._question = shuffle(question);
        this._answer = question;
        this._current = 0;
        this.isComplited = false;
    }

    get currentLetter() {
        return this._answer[this._current];
    }

    checkAnswer(answer) {
        if (answer !== this.currentLetter) {
            return false;
        }
        this._current++;
        if (this._current >= this._answer.length) {
            this.isComplited = true;
        }
        return true;
    }

}

export class PhraseTask extends Task {

    constructor({ question }) {
        super();
        this._info = "Соберите фразу по словам";
        this._question = shuffle(question.split(" "));
        this._answer = question.split(" ");
        this._current = 0;
        this.isComplited = false;
    }

    get currentWord() {
        return this._answer[this._current];
    }

    checkAnswer(answer) {
        if (answer !== this.currentWord) {
            return false;
        }
        this._current++;
        if (this._current >= this._answer.length) {
            this.isComplited = true;
        }
        return true;
    }

}

export class TranslateTask extends Task {

    constructor({ question, answer }) {
        super();
        this._info = "Переведите слово";
        this._question = question;
        this._answer = answer.toLowerCase();
        this.isComplited = false;
    }

    checkAnswer(answer) {
        if (answer.toLowerCase() === this._answer) {
            this.isComplited = true;
            return true;
        }
        return false;
    }

}

Task.register("word", WordTask);
Task.register("phrase", PhraseTask);
Task.register("translate", TranslateTask);