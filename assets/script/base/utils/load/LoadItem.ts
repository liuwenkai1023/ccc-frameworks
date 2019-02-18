import { SuccessHandler, ErrorHandler, ProgressHandler } from "./Loader";

export default class LoaderItem {

    public urls: Array<string> = [];       // 加载项列表
    public type: typeof cc.Asset = null;   // 加载资源类型
    public resources: Object = {};         // 所有使用资源的reference id
    public isReleased: boolean = false;    // 是否已被释放

    constructor(urls, type) {
        this.type = type;
        this.urls = typeof urls == "string" ? [urls] : urls;
    }

    /**
     * 缓存已使用资源
     * @param resource   缓存单个资源的所有使用资源
     */
    private _cacheRes(resource: any) {
        let loader: any = cc.loader;
        this.resources[loader._getReferenceKey(resource)] = true;
        for (let key of loader.getDependsRecursively(resource)) {
            this.resources[key] = true;
        }
        // console.log(this);
    }

    /**
     * 开始加载资源
     * @param successHandler   加载成功回调
     * @param errorHandler     加载失败回调
     * @param progressHandler  加载进度回调
     */
    public load(successHandler: SuccessHandler, errorHandler: ErrorHandler, progressHandler: ProgressHandler) {
        let completedCallFunc = (error: Error, resources: any[]) => {
            if (!error) {
                for (let res of resources) {
                    this._cacheRes(res);
                }
                successHandler && successHandler(resources);
            } else {
                errorHandler && errorHandler(error);
            }
        }
        let callFuncArgs: any[] = [this.urls];
        this.type && callFuncArgs.push(this.type);
        progressHandler && callFuncArgs.push(progressHandler);
        callFuncArgs.push(completedCallFunc);
        cc.loader.loadResArray.apply(cc.loader, callFuncArgs);
    }

    /**
     * 释放资源
     */
    public release() {
        this.isReleased = true;
        let resources: string[] = Object.keys(this.resources);
        cc.loader.release(resources);
        this.resources = {};
    }

    /**
     * 释放资源
     * @param otherDepends  其它依赖项，释放资源会跳过这些资源
     */
    public releaseWithout(otherDepends: Object) {
        for (let reference in this.resources) {
            if (otherDepends[reference]) {
                delete this.resources[reference];
            }
        }
        this.release();
    }
}