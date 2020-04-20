import Test from "./classes/Test";
import Service from "./classes/Service";
import UIController from "./classes/UIController";

window.test = new Test({
    service: new Service("./data.json"),
    ui: new UIController(),
});