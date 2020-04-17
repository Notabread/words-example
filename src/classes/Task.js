import shuffle from "lodash/shuffle"

export default class Task {
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

    constructor({ question, _taskProgress = 0 }) {
        super();
        this._type = "word";
        this.info = "Соберите слово по буквам";
        this._answer = question;
        this._current = _taskProgress;
        this.question = _taskProgress ? this.newProgress() : shuffle(question);
        this.isComplited = false;
    }

    newProgress() {
        let newQuestion = '';
        for (let i = this._current; i < this._answer.length ; i++) {
            newQuestion += this._answer[i];
        }
        return shuffle(newQuestion);
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

    constructor({ question, _taskProgress = 0  }) {
        super();
        this._type = "phrase";
        this.info = "Соберите фразу по словам";
        this._answer = question.split(" ");
        this._current = _taskProgress;
        this.question =  _taskProgress ? this.newProgress() : shuffle(this._answer);
        this.isComplited = false;
    }

    newProgress() {
        let newQuestion = [];
        for (let i = this._current; i < this._answer.length ; i++) {
            newQuestion.push(this._answer[i]);
        }
        return shuffle(newQuestion);
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
        this._type = "translate";
        this.info = "Напишите перевод слова";
        this.question = question;
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