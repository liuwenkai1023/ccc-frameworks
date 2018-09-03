import HttpManager from "./network/HttpManager";
import AudioManager from "./audio/AudioMananger";
import SocketManager from "./network/SocketManager";
import BroadcastManager from "./broadcast/BroadcastManager";
import Base64 from "./base64/Base64";

/**
 * 工具类、管理类的整合
 */
export default class Utils {
    public static readonly _base64: Base64 = Base64.getInstance();
    public static readonly _httpManager: HttpManager = HttpManager;
    public static readonly _audioManager: AudioManager = AudioManager.getInstance();
    public static readonly _socketManager: SocketManager = SocketManager.getInstance(null);
    public static readonly _broadcastManager: BroadcastManager = BroadcastManager.getInstance();
}


