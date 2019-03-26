class MyApp {

    private static _instance: MyApp;

    public static instance() {
        if (!this._instance) {
            this._instance = new MyApp();
        }
        return this._instance;
    }

    private constructor() {
        this.init();
    }

    private async init() {
        console.log("在MyApp这里初始化参数配置等...");
    }

}

export default MyApp.instance();