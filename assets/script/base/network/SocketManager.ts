import BroadcastManager from "../broadcast/BroadcastManager";
import NetConfig from "../config/NetConfig";

export default class SocketManager {

    private _url: string;
    private _protocols: any;
    private _socket: WebSocket;
    private _broadcstManager: BroadcastManager = BroadcastManager.getInstance();;

    private _sendDatas: Array<String> = [];
    private _registerMsg: string = '{"action":"ACTION_REGISTER","data":"注册信息"}';
    private _closeByUser: boolean = false;
    private _curReconnectTimes: number = 0;

    private static instance: SocketManager;
    private static DEFAULT_URL: string = NetConfig.SOCKET_HOST;
    private static MAX_RECONNECT_TIMES: number = 7;


    /**
     * 获取SocketManager单例
     * @param url socket连接地址
     */
    public static getInstance(url?: string | void) {
        if (SocketManager.instance == null) {
            SocketManager.instance = new SocketManager(url);
        }
        return SocketManager.instance;
    }


    /**
     * 构造方法
     * @param url socket地址
     */
    private constructor(url) {
        if (!url) return;
        this.setUrl(url);
        this.init();
    }


    /**
     * 初始化
     */
    private init() {
        this._closeByUser = false;
        this._socket = new WebSocket(this._url, this._protocols);
        this._socket.onopen = this.onOpen.bind(this);
        this._socket.onmessage = this.onMessage.bind(this);
        this._socket.onclose = this.onClose.bind(this);
        this._socket.onerror = this.onError.bind(this);
    }


    /**
     * 打开socket连接
     * @param url socket地址
     */
    public open(url?: string | void) {
        this.setUrl(url == null ? SocketManager.DEFAULT_URL : url)
        this.close()
        this.init()
    }


    /**
     * 关闭当前socket连接
     */
    public close() {
        if (this._socket != null) {
            this._socket.close()
            this._closeByUser = true;
        }
        this._sendDatas.pop();
        this._socket = null;
    }


    /**
     * 发送消息
     * @param data 消息内容
     */
    public send(data: string) {
        //1、socket存在,继续
        if (this._socket == null) {
            // console.warn("警告:socket不存在，消息未发送", data);
            return;
        }

        //2、缓存消息存到队列里
        if (data != null) this._sendDatas.push(data);

        //3、socket连接的状态为"OPEN",继续
        if (this._socket.readyState != WebSocket.OPEN) return;

        //4、把缓存队列里的消息全部发送
        while (this._sendDatas.length > 0) {
            let cData = <string>this._sendDatas.shift();
            this._socket.send(cData);
            // console.log("提示:socket发送消息", cData);
        }
    }


    /**
     * 断线重连
     */
    private reconnect() {
        if (this._curReconnectTimes == SocketManager.MAX_RECONNECT_TIMES) {
            this._broadcstManager.sendBroadcast("SOCKET_RECONNECT_FAILED")
            // console.warn("警告:socket断线重连失败,已重试%d/%d", this._curReconnectTimes, SocketManager.MAX_RECONNECT_TIMES)
            return;
        }
        this._broadcstManager.sendBroadcast("SOCKET_RECONNECTTING", this._curReconnectTimes++)
        // console.log("提示:socket断线，正在尝试重新连接%d/%d", this._curReconnectTimes, SocketManager.MAX_RECONNECT_TIMES)
        this.init()
    }


    /**
     * 身份认证消息
     */
    private sendRegisterMsg() {
        this._sendDatas.unshift(this._registerMsg)
        this.send(null);
    }


    /**
     * 打开socket时,回调
     * @param event 事件
     */
    private onOpen(event: Event) {
        // console.log("提示:socket连接已打开", event)
        this._curReconnectTimes = 0;
        this.sendRegisterMsg()
    }


    /**
     * 关闭socket时,回调
     * @param CloseEvent 事件
     */
    private onClose(event: CloseEvent) {
        // console.log("提示:socket连接已关闭", event)
        this._socket = null;
        if (!this._closeByUser) {
            this.reconnect()
        };
    }


    /**
     * 收到socket消息时,回调
     * @param CloseEvent 事件
     */
    private onMessage(event: MessageEvent) {
        // console.log("提示:socket收到消息", event.data)
        this._broadcstManager.sendBroadcast("SAY_HELLO_2", event.data)
    }


    /**
     * socket发生错误时,回调
     * @param CloseEvent 事件
     */
    private onError(event: Event) {
        // console.warn("警告:socket发生错误", event)
    }


    /**
     * 设置socket连接地址
     * @param url socket地址
     */
    private setUrl(url) {
        this._url = SocketManager.DEFAULT_URL;
        if (url != null) this._url = url;
    }

}
