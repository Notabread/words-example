import Test from "./classes/Test";
import { Task, WordTask, PhraseTask, TranslateTask} from "./classes/Task";
import Service from "./classes/Service";

window.addEventListener("load", function () {

    const app = new Test();

});

const taskData = [
    { type: "translate", question: "кот", answer: "cat" },
    { type: "word", question: "кот"},
];
const tasks = taskData.map(Task.create);
window.tasks = tasks;