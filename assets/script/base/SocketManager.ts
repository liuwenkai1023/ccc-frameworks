import BroadcastManager from "./broadcast/BroadcastManager";
import NetConfig from "./NetConfig";

export default class SocketManager {

    private _url: string;
    private _protocols: any;
    private _socket: WebSocket;
    private _broadcstManager: BroadcastManager;

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
    public static getInstance(url: string | void) {
        if (SocketManager.instance == null) {
            SocketManager.instance = new SocketManager(url == null ? this.DEFAULT_URL : url);
        }
        return SocketManager.instance;
    }


    /**
     * 构造方法
     * @param url socket地址
     */
    private constructor(url) {
        this.setUrl(url);
        this._broadcstManager = BroadcastManager.getInstance();
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
    public open(url) {
        this.setUrl(url)
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
        this._socket = null;
    }


    /**
     * 发送消息
     * @param data 消息内容
     */
    public send(data: string) {
        if (this._socket == null) return; //1、socket存在,继续
        if (data != null) this._sendDatas.push(data);//2、缓存消息存到队列里
        if (this._socket.readyState != WebSocket.OPEN) return;//3、socket连接的状态为"OPEN",继续
        while (this._sendDatas.length > 0) {//4、把缓存队列里的消息全部发送
            let cData = <string>this._sendDatas.shift();
            this._socket.send(cData);
            // console.log("[INFO][SOCKET_SEND]", cData);
        }
    }


    /**
     * 断线重连
     */
    private reconnect() {
        if (this._curReconnectTimes++ == SocketManager.MAX_RECONNECT_TIMES) {
            this._broadcstManager.sendBroadcast("SOCKET_RECONNECT_FAILED")
            // console.log("[INFO][SOCKET_RECONNECT_FAILED]")
            return;
        }
        this._broadcstManager.sendBroadcast("SOCKET_RECONNECTTING", this._curReconnectTimes)
        // console.log("[INFO][SOCKET_RECONNECTTING]", "curReConnTimes = " + this._curReconnectTimes + "/" + SocketManager.MAX_RECONNECT_TIMES)
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
        // console.log("[INFO][SOCKET_OPEN]", event)
        this._curReconnectTimes = 0;
        this.sendRegisterMsg()
    }


    /**
     * 关闭socket时,回调
     * @param CloseEvent 事件
     */
    private onClose(event: CloseEvent) {
        // console.log("[INFO][SOCKET_CLOSE]", event)
        if (this._closeByUser) return;
        this.reconnect()
    }


    /**
     * 收到socket消息时,回调
     * @param CloseEvent 事件
     */
    private onMessage(event: MessageEvent) {
        // console.log("[INFO][SOCKET_MESSAGE]", event.data)
        this._broadcstManager.sendBroadcast("SAY_HELLO_2", event.data)
    }


    /**
     * socket发生错误时,回调
     * @param CloseEvent 事件
     */
    private onError(event: Event) {
        // console.warn("[ERROR][SOCKET_ERROR]", event)
    }


    /**
     * 设置socket连接地址
     * @param url socket地址
     */
    private setUrl(url) {
        if (url != null) this._url = url;
        if (this._url == null) this._url = SocketManager.DEFAULT_URL;
    }

}
