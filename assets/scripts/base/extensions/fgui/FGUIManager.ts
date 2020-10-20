import { BaseWindow } from "./BaseWindow";

export class FGUIManager {

    private static _uiList: Map<{ new() }, BaseWindow> = new Map<{ new() }, BaseWindow>();

    /**
     * 获取ui
     * @param uiClass
     */
    public static getUI<T extends BaseWindow>(uiClass: { new(): T }): T {
        if (!this._uiList.has(uiClass)) {
            let obj = new uiClass();
            this._uiList.set(uiClass, obj);
            return obj;
        }
        return <T>this._uiList.get(uiClass);
    }

    /**
     * 清空并销毁所有ui
     */
    public static clear() {
        this._uiList.forEach((dialog) => {
            if (dialog) {
                dialog.hide();
                dialog.dispose();
            }
        });
        this._uiList.clear();
    }

    /**
     * 隐藏所有ui
     */
    public static hideAll() {
        this._uiList.forEach((dialog) => {
            dialog && dialog.hide();
        });
    }

}
