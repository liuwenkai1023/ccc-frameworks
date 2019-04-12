import Loader from "./utils/loader/Loader";
import Base64 from "./utils/base64/Base64";
import FileUtils from "./utils/storage/FileUtils";
import UIManager from "./mvc/UIManager";
import HttpManager from "./utils/net/HttpManager";
import AudioManager from "./utils/audio/AudioMananger";
import TimerManager from "./utils/timer/TimerManager";
import SocketManager from "./utils/net/SocketManager";
import ShaderManager from "./utils/shader/ShaderManager";
import EventManager from "./utils/event/EventManager";
import LocalStorageManager from "./utils/storage/StorageManager";

/**
 * 工具类、管理类的整合
 */
export default class BASE {

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
    public static readonly EventManager: EventManager = EventManager.instance();

    /**
     *  ShaderManager：Shader效果管理类
     */
    public static readonly ShaderManager: ShaderManager = ShaderManager.instance();
    
    /**
     *  UIManager: UIManager管理类适用于mvc模式中管理UI
     */
    public static readonly UIManager: UIManager = UIManager.instance();

    /**
     *  Loader管理
     */
    public static readonly Loader: Loader = Loader.instance();

}

(<any>window).BASE = BASE;