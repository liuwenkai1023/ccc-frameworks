import { AdapterInterface } from "../AdapterInterface";
import { SdkAdapterBase } from "../SdkAdapterBase";

export class DefaultAdapter extends SdkAdapterBase implements AdapterInterface {

    openUrl(url: string) {
        // throw new Error("Method not implemented.");
    }

    copyToClipboard(text: string): boolean {
        // throw new Error("Method not implemented.");
        return true;
    }

    showAdBanner(isShow: boolean) {
        // throw new Error("Method not implemented.");
    }

    showAdVideo(callback: (result: { code: number; data?: any; }) => void) {
        // throw new Error("Method not implemented.");
        callback && callback({ code: 0, data: null });
    }

}