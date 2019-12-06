const { ccclass, property, disallowMultiple } = cc._decorator;

@disallowMultiple
export abstract class BaseView extends App.BaseComponent {

    protected pkgName: string = "";
    protected resName: string = "";
    protected isReuse: boolean = false;
    protected closeButtonName: string = "closeButton";

    protected lastPage: BaseView;
    protected _rootView: fgui.GComponent;
    protected _closeButton: fgui.GObject;

    private __preShow: boolean;
    private __isLoading: boolean;

    get rootView() {
        return this._rootView;
    }


    protected onLoad() {
        if (this.__isLoading) {
            console.info("info:page is loading!");
            return;
        }
        this.__preShow = true;
        this.__isLoading = true;
        fgui.UIPackage.loadPackage(`UI/${this.pkgName}`, this.onUILoaded.bind(this));
        let onDestroy = this.onDestroy ? this.onDestroy.bind(this) : null;
        this.onCloseCallback = this.onCloseCallback.bind(this);
        this.onDestroy = () => {
            console.info("info: page is destroyed!");
            onDestroy && onDestroy();
            this.rootView.dispose();
        }
    }


    private onUILoaded() {
        this._rootView = fgui.UIPackage.createObject(`${this.pkgName}`, `${this.resName}`).asCom;
        fgui.GRoot.inst.addChild(this._rootView);
        this._rootView.makeFullScreen();
        this.onCreate(this._rootView);
        this._closeButton = this.findGObj(`${this.closeButtonName}`);
        if (this._closeButton) {
            this._closeButton.onClick(this.onCloseCallback, this);
        }
        // 加载完成后再显示
        this.__preShow && this.show();
    }


    protected doShowAnimation() {
        console.info("info: page show animation!");
        const width = this.rootView.node.width;
        this.rootView.node.position = this.rootView.node.position.add(cc.v2(width, 0));
        this.rootView.node.runAction(cc.sequence([
            cc.moveBy(0.25, cc.v2(-width, 0)),
            cc.callFunc(() => {
                this.lastPage.rootView.alpha = 0;
                this.showLastPage(false);
            })
        ]));
        this.onShown();
    }


    protected doCloseAnimation() {
        console.info("info: page hide animation!");
        this.showLastPage(true);
        if (this.isValid && this.lastPage.isValid) {
            const width = this.rootView.node.width;
            this.lastPage.rootView.alpha = 1;
            this.rootView.node.runAction(cc.sequence([
                cc.moveBy(0.2, cc.v2(width, 0)),
                cc.callFunc(() => {
                    console.info("info: page is closed!");
                    this.onClose();
                    this.isReuse || this.destroy();
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
        this.__preShow = true;
        // 如果存在根视图
        if (this.rootView) {
            // 且未添加到界面，则重新将跟视图显示到界面上
            if (!this.rootView.parent) {
                fgui.GRoot.inst.addChild(this.rootView);
            } else {
                console.warn("warn: page is aready show!");
            }
        } else {
            if (!this.__isLoading) {
                // 未加载则进行加载
                this.onLoad();
            }
            return;
        }
        // this.showLastPage(false);
        this.doShowAnimation();
    }


    protected close() {
        this.__preShow = false;
        if (this.rootView && this.rootView.parent) {
            this.doCloseAnimation();
        }
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