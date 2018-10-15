export default class GIF2 {
    private _worker: Worker;
    private _buffer: any;
    private _handler: any;
    private _context: any;
    private _canvas: HTMLCanvasElement;
    private _lastData: any;
    private _spriteFrames: Array<cc.SpriteFrame> = [];
    private _frames: Array<any> = [];
    private _info: any;
    private _target: any;
    private _delays: Array<any> = [];

    constructor(target, buffer, handler) {
        this._target = target;
        this._buffer = buffer;
        this._handler = handler;
        this.init(buffer);
    }

    init(buffer) {
        function workerThread() {
            var view,
                offset = 0,
                lastDisp = -1,
                lastImageData = null,
                imgData, tab,
                info, frame;
            info = {
                frames: [],
                comment: ''
            }
            var _Gif =
                function (buffer) {
                    view = new Uint8Array(buffer)
                    // postMessage(info, "");

                    function read(len) {
                        return view.slice(offset, offset += len);
                    }

                    function getHeader() {
                        info.header = '';
                        read(6).forEach(function (e, i, arr) {
                            info.header += String.fromCharCode(e);
                        });
                    }

                    function getScrDesc() {
                        var arr = read(7), i;
                        info.w = arr[0] + (arr[1] << 8);
                        info.h = arr[2] + (arr[3] << 8);
                        info.m = 1 & arr[4] >> 7;
                        info.cr = 7 & arr[4] >> 4;
                        info.s = 1 & arr[4] >> 3;
                        info.pixel = arr[4] & 0x07;
                        info.bgColor = arr[5];
                        info.radio = arr[6];
                        if (info.m) {
                            info.colorTab = read((2 << info.pixel) * 3);
                        }
                        decode();
                        // console.log(info);
                    }

                    function decode() {
                        var arr = read(1),
                            s, codeSize, i, ss,
                            srcBuf = [];
                        switch (arr[0]) {
                            case 33: //扩展块
                                extension();
                                break;
                            case 44: //图像标识符
                                arr = read(9);
                                frame.img = {
                                    x: arr[0] + (arr[1] << 8),
                                    y: arr[2] + (arr[3] << 8),
                                    w: arr[4] + (arr[5] << 8),
                                    h: arr[6] + (arr[7] << 8),
                                    colorTab: 0
                                };
                                frame.img.m = 1 & arr[8] >> 7;
                                frame.img.i = 1 & arr[8] >> 6;
                                frame.img.s = 1 & arr[8] >> 5;
                                frame.img.r = 3 & arr[8] >> 3;
                                frame.img.pixel = arr[8] & 0x07;
                                if (frame.img.m) {
                                    frame.img.colorTab = read((2 << frame.img.pixel) * 3);
                                }
                                frame.img.codeSize = read(1)[0];
                                srcBuf = [];
                                while (1) {
                                    arr = read(1);
                                    if (arr[0]) {
                                        read(arr[0]).forEach(function (e, i, arr) {
                                            srcBuf.push(e);
                                        });
                                    } else {
                                        frame.img.srcBuf = srcBuf;
                                        decode();
                                        break;
                                    }
                                };
                                break;
                            case 59:
                                console.log('The end.', offset, buffer.byteLength)
                                break;
                            default:
                                console.log(arr);
                                break;
                        }
                    }

                    function extension() {
                        var arr = read(1), o, s;
                        switch (arr[0]) {
                            case 255: //应用程序扩展
                                if (read(1)[0] == 11) {
                                    info.appVersion = '';
                                    read(11).forEach(function (e, i, arr) {
                                        info.appVersion += String.fromCharCode(e);
                                    });
                                    while (1) {
                                        arr = read(1);
                                        if (arr[0]) {
                                            read(arr[0]);
                                        } else {
                                            decode();
                                            break;
                                        }
                                    };
                                } else {
                                    throw new Error('解析出错');
                                }
                                break;
                            case 249: //图形控制扩展
                                if (read(1)[0] == 4) {
                                    arr = read(4);
                                    frame = {};
                                    frame.ctrl = {
                                        disp: 7 & arr[0] >> 2,
                                        i: 1 & arr[0] >> 1,
                                        t: arr[0] & 0x01,
                                        delay: arr[1] + (arr[2] << 8),
                                        tranIndex: arr[3]
                                    };
                                    info.frames.push(frame);
                                    if (read(1)[0] == 0) {
                                        decode();
                                    } else {
                                        throw new Error('解析出错');
                                    }
                                } else {
                                    throw new Error('解析出错');
                                }
                                break;
                            case 254: //注释块
                                arr = read(1);
                                if (arr[0]) {
                                    read(arr[0]).forEach(function (e, i, arr) {
                                        info.comment += String.fromCharCode(e);
                                    });
                                    if (read(1)[0] == 0) {
                                        decode();
                                    };
                                }
                                break;
                            default:
                                console.log(arr);
                                break;
                        }
                    }
                    getHeader();
                    getScrDesc();
                    postMessage({ event: "START", data: info });
                    console.log(info);
                    _decode();
                }
            var lzw = function (arr, min) {
                var clearCode = 1 << min,
                    eofCode = clearCode + 1,
                    size = min + 1,
                    dict = [],
                    pos = 0;

                function clear() {
                    var i;
                    dict = [];
                    size = min + 1;
                    for (i = 0; i < clearCode; i++) {
                        dict[i] = [i];
                    }
                    dict[clearCode] = [];
                    dict[eofCode] = null;
                }
                function decode() {
                    var out = [],
                        code, last;
                    while (1) {
                        last = code;
                        code = read(size);
                        if (code == clearCode) {
                            clear();
                            continue;
                        }
                        if (code == eofCode) {
                            break;
                        }
                        if (code < dict.length) {
                            if (last !== clearCode) {
                                dict.push(dict[last].concat(dict[code][0]));
                            }
                        } else {
                            if (code !== dict.length) {
                                throw new Error('LZW解析出错');
                            }
                            dict.push(dict[last].concat(dict[last][0]));
                        }
                        out.push.apply(out, dict[code]);
                        if (dict.length === (1 << size) && size < 12) {
                            size++;
                        }
                    }
                    return out;
                }
                function read(size) {
                    var i, code = 0;
                    for (i = 0; i < size; i++) {
                        if (arr[pos >> 3] & 1 << (pos & 7)) {
                            code |= 1 << i;
                        }
                        pos++;
                    }
                    return code;
                }
                return {
                    decode: decode
                }
            }

            var _decode = function () {
                info.frames.forEach(function (frame, index) {
                    imgData = new ImageData(frame.img.w, frame.img.h);
                    frame.img.m ? tab = frame.img.colorTab : tab = info.colorTab;
                    lzw(frame.img.srcBuf, frame.img.codeSize).decode().forEach(function (j, k) {
                        imgData.data[k * 4] = tab[j * 3];
                        imgData.data[k * 4 + 1] = tab[j * 3 + 1];
                        imgData.data[k * 4 + 2] = tab[j * 3 + 2];
                        imgData.data[k * 4 + 3] = 255;
                        frame.ctrl.t ? (j == frame.ctrl.tranIndex ? imgData.data[k * 4 + 3] = 0 : 0) : 0;
                    });
                    frame.imageData = imgData;
                    postMessage({ event: "DECODE", data: { index: index, frame: frame } });
                });
                postMessage({ event: "END" });
            }
            self.onmessage = function (e) {
                _Gif(e.data.buffer);
            };
        }
        var blob = new Blob([workerThread.toString() + ";workerThread();"], { type: "text/javascript" });
        this._worker = new Worker(window.URL.createObjectURL(blob));
        this._worker.postMessage({ event: "START", buffer: buffer });
        this._worker.onmessage = function (event) {
            if (event.data.event == "DECODE") {
                this._frames.push(event.data.data.frame);
                if (event.data.data.index == 0) {
                    if (this._target) {
                        this._target.setDefaultSpriteFrame(this.getSpriteFrame(0));
                    }
                }
            }
            else if (event.data.event == "START") {
                this._info = event.data.data;
            }
            else if (event.data.event == "END") {
                this._worker.terminate();
                // if (this._frames.length == this._info.frames.length) {
                this._target._inited = false;
                // }
            }
        }.bind(this);
    }

    public getSpriteFrame(index) {
        if (this._spriteFrames[index]) return this._spriteFrames[index];
        let frame = this._frames[index];
        let delay = frame.ctrl.delay;
        let imageData = frame.imageData;
        if (!this._context) {
            this._canvas = document.createElement('canvas');
            this._context = this._canvas.getContext('2d');
            this._canvas.width = frame.img.w;
            this._canvas.height = frame.img.h;
        }
        this._context.putImageData(imageData, frame.img.x, frame.img.y, 0, 0, frame.img.w, frame.img.h);
        if (this._lastData) {
            imageData = this._context.getImageData(0, 0, this._canvas.width, this._canvas.height);
            for (var i = 0; i < imageData.data.length; i += 4) {
                if (imageData.data[i + 3] == 0) {
                    imageData.data[i] = this._lastData.data[i];
                    imageData.data[i + 1] = this._lastData.data[i + 1];
                    imageData.data[i + 2] = this._lastData.data[i + 2];
                    imageData.data[i + 3] = this._lastData.data[i + 3];
                }
            }
        }

        this._context.putImageData(imageData, 0, 0);
        this._lastData = imageData;
        let dataUrl = this._canvas.toDataURL("image/png");
        let data2SpriteFrame = function (dataUrl) {
            let texture = new cc.Texture2D();
            let spriteFrame = new cc.SpriteFrame();
            // 使用Image方式
            let image = new Image();
            image.src = dataUrl;
            texture.initWithElement(image);
            spriteFrame.setTexture(texture);
            return spriteFrame;
        }.bind(this);
        this._delays[index] = delay;
        this._spriteFrames[index] = data2SpriteFrame(dataUrl);
        if (this._info.frames.length == this._spriteFrames.length) {
            if (this._handler) this._handler(this._delays, this._spriteFrames);
            this.clear();
        }
        return this._spriteFrames[index];
    }

    private clear() {
        this._buffer = null;
        this._canvas = null;
        this._context = null;
        this._handler = null;
        this._info = null;
        this._lastData = null;
        this._worker = null;
    }
}