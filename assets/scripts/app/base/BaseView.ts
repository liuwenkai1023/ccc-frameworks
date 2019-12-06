export abstract class BaseView extends App.BaseComponent {

    protected pkgName: string = "";
    protected resName: string = "";
    protected closeButtonName: string = "closeButton";

    protected _rootView: fgui.GComponent;
    protected _closeButton: fgui.GObject;
    protected lastPage: BaseView;

    get rootView() {
        return this._rootView;
    }


    protected onLoad() {
        fgui.UIPackage.loadPackage(`UI/${this.pkgName}`, this.onUILoaded.bind(this));
        let onDestroy = this.onDestroy ? this.onDestroy.bind(this) : null;
        this.onCloseCallback = this.onCloseCallback.bind(this);
        this.onDestroy = () => {
            onDestroy && onDestroy();
            this.rootView.dispose();
        }
    }


    private onUILoaded() {
        let rootView = fgui.UIPackage.createObject(`${this.pkgName}`, `${this.resName}`).asCom;
        fgui.GRoot.inst.addChild(rootView);
        rootView.makeFullScreen();
        this._rootView = rootView;
        this.onCreate(rootView);
        this._closeButton = this.findGObj(`${this.closeButtonName}`);
        this._closeButton && this._closeButton.onClick(this.onCloseCallback, this);
        // 加载完成后再显示
        rootView.alpha = 0;
        this.scheduleOnce(() => {
            this.show();
            rootView.alpha = 1;
        });
    }


    protected doShowAnimation() {
        const width = this.rootView.node.width;
        this.rootView.node.position = this.rootView.node.position.add(cc.v2(width, 0));
        this.rootView.node.runAction(cc.sequence([
            cc.moveBy(0.25, cc.v2(-width, 0)),
            cc.callFunc(() => {
                this.lastPage.rootView.alpha = 0;
            })
        ]));
        this.onShown();
    }


    protected doCloseAnimation() {
        if (this.isValid && this.lastPage.isValid) {
            const width = this.rootView.node.width;
            this.lastPage.rootView.alpha = 1;
            this.rootView.node.runAction(cc.sequence([
                cc.moveBy(0.2, cc.v2(width, 0)),
                cc.callFunc(() => {
                    this.onClose();
                    this.destroy();
                })
            ]));
        }
    }


    private showLastPage(isShow: boolean) {
        this.lastPage && this.lastPage.isValid && (this.lastPage.rootView.alpha = isShow ? 1 : 0);
    }


    protected onCloseCallback() {
        this.close();
    }


    private show() {
        this.showLastPage(false);
        this.doShowAnimation();
    }


    protected close() {
        this.showLastPage(true);
        this.doCloseAnimation();
    }


    abstract onClose();

    abstract onShown();

    abstract onCreate(view: fgui.GComponent);


    /**
     * 寻找fgui对象
     * @param sPath 路径
     * @param refrenceNode 相对组件
     */
    protected findGObj(sPath: string, refrenceNode: fgui.GComponent = this.rootView): fgui.GObject {
        let arr: Array<string> = sPath.split("/");
        let obj: fgui.GObject = null;
        for (let i = 0; i < arr.length; i++) {
            obj = obj ? obj.asCom.getChild(arr[i]) : refrenceNode.getChild(arr[i]);
        }
        return obj;
    }


    openPage<T extends BaseView>(viewclass: { new(): T }): T {
        let component = this.getComponent(viewclass);
        if (!component) {
            component = this.addComponent(viewclass);
            component.lastPage = this;
            return component;
        }
    }

}