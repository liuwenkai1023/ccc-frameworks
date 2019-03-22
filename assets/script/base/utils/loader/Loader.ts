import LoaderItem from "./LoadItem";

export default class Loader {
    private _parentLoader: Loader = null;
    private _subLoaders: Array<Loader> = [];
    private _loadItems: Array<LoaderItem> = [];
    private _released: boolean = false;

    /**
     * 获取到根管理器
     */
    get rootLoader(): Loader {
        let root: Loader = this;
        while (root._parentLoader) {
            root = root._parentLoader;
        }
        return root;
    }

    /**
     * 创建子管理器
     */
    public createSubLoader(): Loader {
        let loader = new Loader();
        loader._parentLoader = this;
        this._subLoaders.push(loader);
        return loader;
    }

    /**
     * 移除子管理器
     * @param loader  需移除的子管理器
     */
    private _removeSubLoader(loader: Loader) {
        let index: number = this._subLoaders.indexOf(loader);
        (index >= 0) && this._subLoaders.splice(index, 1);
    }

    /**
     * 释放管理器
     */
    public release() {
        this._released = true;
        this._parentLoader._removeSubLoader(this);
        // 释放当前加载的所有资源，需在当前Tick释放，以让后续的加载请求生效
        let allResouces: Object = this.rootLoader.getAllResources();
        this._releaseWithout(allResouces);
    }

    /**
     * 选择性释放资源
     * @param allResouces   不能被释放的资源
     */
    private _releaseWithout(allResouces: Object = null) {
        for (let item of this._loadItems) {
            item.releaseWithout(allResouces);
        }
        this._loadItems.length = 0;
        for (let loader of this._subLoaders) {
            loader._releaseWithout(allResouces);
        }
    }

    /**
    * 加载资源
    * @param urls            加载资源项
    * @param type            加载资源类型
    * @param successHandler  加载成功回调
    * @param errorHandler    加载失败回调
    * @param progressHandler 加载进度回调
    */
    public load(urls: string[] | string, type: typeof cc.Asset, successHandler?: SuccessHandler, errorHandler?: ErrorHandler, progressHandler?: ProgressHandler) {
        let item: LoaderItem = new LoaderItem(urls, type);
        item.load((res: any[]) => {
            if (this._released || item.isReleased) {
                // 释放刚加载的资源，需在下一Tick释放，保证其它加载成功
                return this.callInNextTick(() => {
                    item.releaseWithout(this.rootLoader.getAllResources());
                });
            }
            return successHandler && successHandler(res);
        }, (error: Error) => {
            if (this._released) return;
            errorHandler && errorHandler(error);
        }, progressHandler);
        this._loadItems.push(item);
    }

    /**
     * 得到当前Loader下所有依赖referenceId
     */
    public getAllResources(loader?: Loader): Object {
        let resources = {};
        for (const loadItem of this._loadItems) {
            for (const key in loadItem.resources) {
                if (!resources.hasOwnProperty(key)) {
                    resources[key] = loadItem.resources[key];
                }
            }
        }
        if (loader) {
            for (const subLoader of loader._subLoaders) {
                let subResources = this.getAllResources(subLoader);
                for (const key in subResources) {
                    if (!resources.hasOwnProperty(key)) {
                        resources[key] = subResources[key];
                    }
                }
            }
            this.getAllResources();
        }
        return resources;
    }

    callInNextTick(callback: Function, timeout?: number, ...args: any[]) {
        setTimeout(callback && callback(), timeout, args);
    }

}



export interface ErrorHandler { (err: Error) };
export interface SuccessHandler { (res: any[]) };
export interface ProgressHandler { (completedCount: number, totalCount: number, item: any) };