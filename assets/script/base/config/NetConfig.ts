export default class NetConfig {
    static readonly HTTP_HOST = "http://localhost";
    static readonly SOCKET_HOST = "ws://127.0.0.1:8001";
    static readonly REGESTER_MSG = '{"action":"ACTION_REGISTER","data":"注册信息"}'
    static readonly HEARTBEAT_MSG = '{}';
}