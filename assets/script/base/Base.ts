import WxUtil from "./wx/WxUtil";
import Base64 from "./base64/Base64";
import HttpManager from "./network/HttpManager";
import AudioManager from "./audio/AudioMananger";
import SocketManager from "./network/SocketManager";
import LocalStorageManager from "./storage/StorageManager";
import BroadcastManager from "./broadcast/BroadcastManager";

/**
 * 工具类、管理类的整合
 */
export default class Base {

    /**
     *  WxUtil：微信相关工具类
     */
    public static readonly WxUtil: WxUtil = WxUtil.getInstance();

    /**
     *  Base64：Base64工具类
     */
    public static readonly Base64: Base64 = Base64.getInstance();

    /**
     * HttpManager：Http工具类
     */
    public static readonly Http: HttpManager = HttpManager.getInstance();

    /**
     *  AudioManager：音频播放管理类
     */
    public static readonly Audio: AudioManager = AudioManager.getInstance();

    /**
     *  SocketManager：socket连接管理类
     */
    public static readonly SocketManager: SocketManager = SocketManager.getInstance();

    /**
     *  LocalStorageManager：cc.sys.localStorage本存储管理类
     */
    public static readonly LocalStorageManager: LocalStorageManager = LocalStorageManager.getInstance();

    /**
     *  BroadcastManager：广播管理类。节点上不建议使用，还请使用BroadcastComponent
     */
    public static readonly BroadcastManager: BroadcastManager = BroadcastManager.getInstance();

}


