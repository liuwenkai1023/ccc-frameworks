import LZW from "./LZW";

export default class GIF {

    private _tab;
    private _view;
    private _frame;
    private _buffer;

    private _offset = 0;
    private _lastDisp = -1;
    private _lastCans = null;
    private _imageData;

    private sp;

    private _info: any = {
        header: '',
        frames: [],
        comment: ''
    };

    set buffer(buffer: ArrayBuffer) {
        let startTime = new Date().getTime();
        this.clear();
        this._buffer = buffer;
        this._view = new Uint8Array(buffer);
        this.init();
        let endTime = new Date().getTime();
        console.log(endTime - startTime);
    }

    get buffer() {
        return this._buffer;
    }

    constructor(buffer, sp) {
        this.sp = sp;
        if (!buffer) return;
        if (typeof buffer === "string") {
            this.buffer = this._utf2buffer(buffer);
            return;
        }
        // else if (buffer instanceof ArrayBuffer) {
        this.buffer = buffer;
        // }
    }


    _utf2buffer = function (utfstr) {
        var buf = new ArrayBuffer(utfstr.length * 2);
        var bufView = new Uint8Array(buf);
        for (var i = 0, strlen = utfstr.length; i < strlen; i++) {
            bufView[i] = utfstr.charCodeAt(i);
        }
        return buf;
    }

    private clear() {
        this._tab = null;
        this._view = null;
        this._frame = null;
        this._offset = 0;
        this._lastDisp = -1;
        this._lastCans = null;
        this._imageData = null;
        this._info = {
            header: '',
            frames: [],
            comment: ''
        };
    }

    private init() {
        this.getHeader();
        this.getScrDesc();
        this.getTexture();
    }

    private getTexture(): any {
        console.log(this._info);
        let dataUrls: Array<any> = [];

        let frame = this._info.frames[0];
        // this._info.frames.forEach(function (frame, index) {
            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');

            frame.img.m ? this._tab = frame.img.color_Tab : this._tab = this._info.color_Tab;
            canvas.width = this._info.w;
            canvas.height = this._info.h;

            this._imageData = context.getImageData(frame.img.x, frame.img.y, frame.img.w, frame.img.h);

            LZW.decode(frame.img.srcBuf, frame.img.codeSize).forEach(function (j, k) {
                this._imageData.data[k * 4] = this._tab[j * 3];
                this._imageData.data[k * 4 + 1] = this._tab[j * 3 + 1];
                this._imageData.data[k * 4 + 2] = this._tab[j * 3 + 2];
                this._imageData.data[k * 4 + 3] = 255;
                frame.ctrl.t ? (j == frame.ctrl.tranIndex ? this._imageData.data[k * 4 + 3] = 0 : 0) : 0;
            }.bind(this));

            context.putImageData(this._imageData, frame.img.x, frame.img.y, 0, 0, frame.img.w, frame.img.h);
            this._imageData = context.getImageData(0, 0, this._info.w, this._info.h);

            if (this._lastCans) {
                var lastData = this._lastCans.getContext('2d').getImageData(0, 0, this._info.w, this._info.h);
                for (let i = 0; i < this._imageData.data.length; i += 4) {
                    if (this._imageData.data[i + 3] == 0) {
                        this._imageData.data[i] = lastData.data[i];
                        this._imageData.data[i + 1] = lastData.data[i + 1];
                        this._imageData.data[i + 2] = lastData.data[i + 2];
                        this._imageData.data[i + 3] = lastData.data[i + 3];
                    }
                }
                context.putImageData(this._imageData, 0, 0);
            }
            this._lastDisp = frame.ctrl.disp;
            if (frame.ctrl.disp === 1 || frame.ctrl.disp === 0) {
                this._lastCans = canvas;
            }

            let dataUrl = canvas.toDataURL("image/png");
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
            dataUrls.push(data2SpriteFrame(dataUrl))
            // console.log(this.sp);
            // this.sp.spriteFrame = dataUrls[1];
            // console.log(dataUrls)
        // }.bind(this));
    }


    private read(len) {
        return this._view.slice(this._offset, this._offset += len);
    }

    /**
     * 获取文件头部分(Header)
     * GIF署名(Signature)和版本号(Version)
     */
    private getHeader() {
        this._info.header = '';
        this.read(6).forEach(function (e, i, arr) {
            this._info.header += String.fromCharCode(e);
        }.bind(this));
    }

    /**
     * 获取逻辑屏幕标识符(Logical Screen Descriptor)
     * GIF数据流部分(GIF Data Stream)
     */
    private getScrDesc() {
        var arr = this.read(7), i;
        this._info.w = arr[0] + (arr[1] << 8);
        this._info.h = arr[2] + (arr[3] << 8);
        this._info.m = 1 & arr[4] >> 7;
        this._info.cr = 7 & arr[4] >> 4;
        this._info.s = 1 & arr[4] >> 3;
        this._info.pixel = arr[4] & 0x07;
        this._info.bgColor = arr[5];
        this._info.radio = arr[6];
        if (this._info.m) {
            this._info.color_Tab = this.read((2 << this._info.pixel) * 3);
        }
        this.decode();
    }


    /**
     * 解析GIF数据流
     */
    private decode() {
        let srcBuf = [];
        let arr = this.read(1);

        switch (arr[0]) {
            case 33: //扩展块
                this.extension();
                break;
            case 44: //图象标识符
                arr = this.read(9);
                this._frame.img = {
                    x: arr[0] + (arr[1] << 8),
                    y: arr[2] + (arr[3] << 8),
                    w: arr[4] + (arr[5] << 8),
                    h: arr[6] + (arr[7] << 8),
                    color_Tab: 0
                };
                this._frame.img.m = 1 & arr[8] >> 7;
                this._frame.img.i = 1 & arr[8] >> 6;
                this._frame.img.s = 1 & arr[8] >> 5;
                this._frame.img.r = 3 & arr[8] >> 3;
                this._frame.img.pixel = arr[8] & 0x07;
                if (this._frame.img.m) {
                    this._frame.img.color_Tab = this.read((2 << this._frame.img.pixel) * 3);
                }
                this._frame.img.codeSize = this.read(1)[0];
                srcBuf = [];
                while (1) {
                    arr = this.read(1);
                    if (arr[0]) {
                        this.read(arr[0]).forEach(function (e, i, arr) {
                            srcBuf.push(e);
                        });
                    } else {
                        this._frame.img.srcBuf = srcBuf;
                        this.decode();
                        break;
                    }
                };
                break;
            case 59:
                console.log('The end.', this._offset, this.buffer.byteLength)
                break;
            default:
                console.log(arr);
                break;
        }
    }


    /**
     * 扩展块部分
     */
    private extension() {
        var arr = this.read(1), o, s;
        switch (arr[0]) {
            case 255: //应用程序扩展
                if (this.read(1)[0] == 11) {
                    this._info.appVersion = '';
                    this.read(11).forEach(function (e, i, arr) {
                        this._info.appVersion += String.fromCharCode(e);
                    }.bind(this));
                    while (1) {
                        arr = this.read(1);
                        if (arr[0]) {
                            this.read(arr[0]);
                        } else {
                            this.decode();
                            break;
                        }
                    };
                } else {
                    throw new Error('解析出错');
                }
                break;
            case 249: //图形控制扩展
                if (this.read(1)[0] == 4) {
                    arr = this.read(4);
                    this._frame = {};
                    this._frame.ctrl = {
                        disp: 7 & arr[0] >> 2,
                        i: 1 & arr[0] >> 1,
                        t: arr[0] & 0x01,
                        delay: arr[1] + (arr[2] << 8),
                        tranIndex: arr[3]
                    };
                    this._info.frames.push(this._frame);
                    if (this.read(1)[0] == 0) {
                        this.decode();
                    } else {
                        throw new Error('解析出错');
                    }
                } else {
                    throw new Error('解析出错');
                }
                break;
            case 254: //注释块
                arr = this.read(1);
                if (arr[0]) {
                    this.read(arr[0]).forEach(function (e, i, arr) {
                        this._info.comment += String.fromCharCode(e);
                    });
                    if (this.read(1)[0] == 0) {
                        this.decode();
                    };
                }
                break;
            default:
                console.log(arr);
                break;
        }
    }
}