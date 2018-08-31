export default class SocketManager {
    private url;
    private socket: WebSocket;
    private protocols;

    private constructor(url) {
        this.url;
        this.init();
    }

    private init() {
        this.socket = new WebSocket(this.url, this.protocols);
        this.socket.onopen(event){

        }
    }
}
