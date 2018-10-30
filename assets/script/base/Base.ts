import WxUtil from "./utils/wx/WxUtil";
import FileUtils from "./utils/storage/FileUtils";
import Base64 from "./utils/base64/Base64";
import TimerManager from "./utils/timer/TimerManager";
import HttpManager from "./net/HttpManager";
import AudioManager from "./utils/audio/AudioMananger";
import SocketManager from "./net/SocketManager";
import LocalStorageManager from "./utils/storage/StorageManager";
import BroadcastManager from "./utils/broadcast/BroadcastManager";
import ShaderManager from "./ui/shader/ShaderManager";
import UIManager from "./mvc/UIManager";

/**
 * 工具类、管理类的整合
 */
export default class BASE {

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
    *  TimerManager：TimerManager计时器工具类
    */
    public static readonly TimerManager: TimerManager = TimerManager.instance();

    /**
     *  HttpManager：Http工具类
     */
    public static readonly HttpManager: HttpManager = HttpManager.instance();

    /**
     *  AudioManager：音频播放管理类
     */
    public static readonly AudioManager: AudioManager = AudioManager.instance();

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
     *  ShaderManager：Shader效果管理类
     */
    public static readonly ShaderManager: ShaderManager = ShaderManager.instance();

    /**
     * UIManager: UIManager管理类适用于mvc模式中管理UI
     */
    public static readonly UIManager: UIManager = UIManager.instance();

}

(<any>window).BASE = BASE;