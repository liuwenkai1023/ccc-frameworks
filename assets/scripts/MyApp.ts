export default class MyApp {

    private static _instance: MyApp;

    public static getInstance() {
        if (!this._instance) {
            this._instance = new MyApp();
        }
        return this._instance;
    }

   constructor() {
        this.init();
    }

    private async init() {
        console.log("在MyApp这里初始化参数配置等...");
    }

}

window[`APP`] = MyApp.getInstance();