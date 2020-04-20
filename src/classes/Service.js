export default class Service {

    constructor(apiUrl) {
        this._url = apiUrl;
        this._storageKey = 'TEST_STATE';
    }

    getTasks() {
        return fetch(this._url).then(res => res.json());
    }

    getTestState() {
        const item = localStorage.getItem(this._storageKey);
        if (item) {
            return JSON.parse(item);
        }
        return null;
    }

    saveTestState(data) {
        localStorage.setItem(this._storageKey, JSON.stringify(data));
    }

}
