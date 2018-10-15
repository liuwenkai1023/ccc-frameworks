import WxUtil from "./wx/WxUtil";
import Base64 from "./base64/Base64";
import HttpManager from "./network/HttpManager";
import AudioManager from "./audio/AudioMananger";
import SocketManager from "./network/SocketManager";
import LocalStorageManager from "./storage/StorageManager";
import BroadcastManager from "./broadcast/BroadcastManager";
import ShaderManager from "./shader/ShaderManager";
import FileUtils from "./storage/FileUtils";

/**
 * 工具类、管理类的整合
 */
export default class Base {

    /**
     *  全局模块window
     */
    public static window = <any>window;

    /**
     *  WxUtil：微信相关工具类
     */
    public static readonly WxUtil: WxUtil = WxUtil.instance();

    /**
     *  FileUtils：文件管理相关工具类
     */
    public static readonly FileUtils: FileUtils = FileUtils.instance();

    /**
     *  Base64：Base64工具类
     */
    public static readonly Base64: Base64 = Base64.instance();

    /**
     * HttpManager：Http工具类
     */
    public static readonly Http: HttpManager = HttpManager.instance();

    /**
     *  AudioManager：音频播放管理类
     */
    public static readonly Audio: AudioManager = AudioManager.instance();

    /**
     *  SocketManager：socket连接管理类
     */
    public static readonly SocketManager: SocketManager = SocketManager.instance();

    /**
     *  LocalStorageManager：cc.sys.localStorage本存储管理类
     */
    public static readonly LocalStorageManager: LocalStorageManager = LocalStorageManager.instance();

    /**
     *  BroadcastManager：广播管理类。节点脚本上不建议使用，还请使用BroadcastComponent
     */
    public static readonly BroadcastManager: BroadcastManager = BroadcastManager.instance();

    /**
     * ShaderManager：Shader效果管理类
     */
    public static readonly ShaderManager: ShaderManager = ShaderManager.instance();

}


