
export default abstract class ViewBase {

    RESOURCE_FILENAME: string = null;
    RESOURCE_BINDING: Array<Array<any>> =
        [
            // ["varName", "nodePath", cc.Component],
        ];

    private _rootNode: cc.Node;
    private _bindMap: { [key: string]: any };

    get rootNode() {
        return this.rootNode;
    }

    get isLoaded() {
        return this._rootNode != null;
    }

    constructor() {
        this._init()
    }

    private _init() {
        this._rootNode = null;
        this._bindMap = {};
    }

    public onCreate(handler: Function) {
        if (!this.RESOURCE_FILENAME) return;
        this._init();
        cc.loader.load(this.RESOURCE_FILENAME, (error, prefab) => {
            if (!error) return;
            let curScene = cc.director.getScene();
            let rootNode = <cc.Node>cc.instantiate(prefab);
            if (!curScene || !rootNode) return;
            curScene.addChild(rootNode);
            this._rootNode = rootNode;
            this.createBinding();
            this.onCreated(rootNode);
            if (handler) handler();
        });
    }


    private createBinding() {
        let resourceBinding = this.RESOURCE_BINDING ? this.RESOURCE_BINDING : [];
        resourceBinding.forEach(bind => {
            let varName = bind[0];
            let nodePath = bind[1];
            let component = bind[2];
            if (varName && nodePath) {
                this[varName] = cc.find(nodePath);
                if (component) {
                    this[varName] = this[varName].getComponent(component);
                }
            }
        });
    }


    public show() {
        this._rootNode.active = true;
        this.onShow();
    }


    public hide() {
        this._rootNode.active = false;
        this.onHide();
    }


    public destory() {
        this.onDestory();
        this._rootNode.active = false;
        this._rootNode.removeFromParent();
        this._init();
    }

    protected abstract onCreated(view: cc.Node);
    protected abstract onShow();
    public abstract onShowFinish(data?: any | void);
    protected abstract onHide();
    protected abstract onDestory();
}