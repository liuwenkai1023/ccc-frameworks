import LZW from "./LZW";
import { GIFMessage } from "../BaseGIFSprite";

/**
 * GIF解析
 */
export default class GIF {

    private _tab: any;
    private _view: Uint8Array;
    private _frame: any;
    private _buffer: ArrayBuffer;
    private _offset: number = 0;
    private _lastData: ImageData;
    private _info: any = {
        header: '',
        frames: [],
        comment: ''
    };

    private _message: GIFMessage = null;
    private _delays: Array<number> = [];
    private _spriteFrames: Array<cc.SpriteFrame> = [];
    private _canvas: HTMLCanvasElement = null;
    private _context: CanvasRenderingContext2D = null;

    set buffer(buffer: ArrayBuffer) {
        this.clear();
        this._buffer = buffer;
        this._view = new Uint8Array(buffer);
        this.init();

    }

    get buffer() {
        return this._buffer;
    }


    constructor(message: GIFMessage) {
        if (!message || !message.buffer) return;
        this._message = message;
        this.buffer = message.buffer;
    }


    /**
     * 初始化
     */
    private async init() {
        let sT = new Date().getTime();
        this.getHeader();
        this.getScrDesc();
        this.getTexture();
        let eT = new Date().getTime();
        console.log(`total time : ${eT - sT}ms`)
    }


    /**
     * 解析GIF得到所有的纹理
     */
    private async getTexture() {
        console.log(this._info)
        // await 0;
        // let index = 0;
        // let framePromises = this._info.frames.map(async frame => {
        //     const framePromise = await this.decodeFrame2Texture(frame, index++);
        //     return framePromise;
        // });
        // for (const framePromise of framePromises) {
        //     await framePromise;
        // }
        // let index = 0;
        // for (const frame of this._info.frames) {
        //     this.decodeFrame2Texture(frame, index++);
        // }
        this.getSpriteFrame(0);
    }

    /**
     * 得到对应索引的精灵帧
     * @param index 
     */
    public getSpriteFrame(index) {
        if (this._spriteFrames[index]) return this._spriteFrames[index];
        return this.decodeFrame2Texture(this._info.frames[index], index);
    }

    /**
     * 解析frame数据为ImageData
     * 最耗时的操作(80%耗时归究这里)
     * @param frame frame数据
     */
    private decodeFrame(frame) {
        // let imageData = this._context.getImageData(frame.img.x, frame.img.y, frame.img.w, frame.img.h)
        let imageData = new ImageData(frame.img.w, frame.img.h);
        frame.img.m ? this._tab = frame.img.colorTab : this._tab = this._info.colorTab;
        LZW.decode(frame.img.srcBuf, frame.img.codeSize).forEach(function (j, k) {
            imageData.data[k * 4] = this._tab[j * 3];
            imageData.data[k * 4 + 1] = this._tab[j * 3 + 1];
            imageData.data[k * 4 + 2] = this._tab[j * 3 + 2];
            imageData.data[k * 4 + 3] = 255;
            frame.ctrl.t ? (j == frame.ctrl.tranIndex ? imageData.data[k * 4 + 3] = 0 : 0) : 0;
        }.bind(this));
        return imageData;
    }


    /**
     * 合并ImageData数据
     * @param lastImageData 上一帧frame解析出来的ImageData
     * @param curImageData 当前的ImageData
     */
    private mergeFrames(lastImageData, curImageData) {
        let imageData = curImageData;
        if (lastImageData) {
            for (var i = 0; i < imageData.data.length; i += 4) {
                if (imageData.data[i + 3] == 0) {
                    imageData.data[i] = this._lastData.data[i];
                    imageData.data[i + 1] = this._lastData.data[i + 1];
                    imageData.data[i + 2] = this._lastData.data[i + 2];
                    imageData.data[i + 3] = this._lastData.data[i + 3];
                }
            }
        }
        return imageData;
    }


    /**
     * 将DataUrl的数据转换为cc.SpriteFrame
     * @param dataUrl 
     */
    private dataUrl2SpriteFrame(dataUrl) {
        let texture = new cc.Texture2D();
        let spriteFrame = new cc.SpriteFrame();
        let image = new Image();
        image.src = dataUrl;
        texture.initWithElement(image);
        spriteFrame.setTexture(texture);
        return spriteFrame;
    }


    /**
     * 将frame数据转化为cc.Texture
     * @param frame 当前frame的数据
     * @param index 当前frame的顺序
     */
    private async decodeFrame2Texture(frame, index) {
        // 1、初始化canvas的相关信息
        if (!this._context) {
            this._canvas = document.createElement('canvas');
            this._context = this._canvas.getContext('2d');
            this._canvas.width = frame.img.w;
            this._canvas.height = frame.img.h;
        }

        // 2、解析当前frame的ImageData数据（frame中存在的IamgeData数据）
        let imageData = this.decodeFrame(frame);

        // 3、将当前frame的ImageData设置到canvas上（必须,否则会因为ImageData的尺寸大小可能不一样造成拉伸等错乱现象）
        this._context.putImageData(imageData, frame.img.x, frame.img.y, 0, 0, frame.img.w, frame.img.h);

        // 4、把当前imageData和上一帧imageData合并（必须，因为GIF的当前帧可能只提供了像素发生变化位置的信息）
        let curImageData = this._context.getImageData(0, 0, this._canvas.width, this._canvas.height);
        let lastImageData = this._lastData;
        let finalImageData = this.mergeFrames(lastImageData, curImageData);

        // 5、把最终的ImageData设置到canvas上（形成合成之后的最终图像）
        this._context.putImageData(finalImageData, 0, 0);
        this._lastData = finalImageData;

        // 6、将图像转换为精灵帧
        let dataUrl = this._canvas.toDataURL("image/png");
        this._delays[index] = frame.ctrl.delay;
        this._spriteFrames[index] = this.dataUrl2SpriteFrame(dataUrl);

        if (this._spriteFrames.length == this._info.frames.length) {
            // 8、解析完所有帧时回调
            this._message.initFinishedFunc({ delays: this._delays, spriteFrames: this._spriteFrames, length: this._info.frames.length });
        } else {
            // 7、解析完每一帧回调
            this._message.initOneSpriteFrameFunc({ delays: this._delays, spriteFrames: this._spriteFrames, length: this._info.frames.length });
        }
        return this._spriteFrames[index];
    }


    /**
     * 读文件流
     * @param len 读取的长度
     */
    private read(len) {
        return this._view.slice(this._offset, this._offset += len);
    }

    /**
     * 获取文件头部分(Header)
     * GIF署名(Signature)和版本号(Version)
     */
    private async getHeader() {
        // await 0;
        this._info.header = '';
        this.read(6).forEach(function (e, i, arr) {
            this._info.header += String.fromCharCode(e);
        }.bind(this));
    }

    /**
     * 获取逻辑屏幕标识符(Logical Screen Descriptor)
     * GIF数据流部分(GIF Data Stream)
     */
    private async getScrDesc() {
        // await 0;
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
            this._info.colorTab = this.read((2 << this._info.pixel) * 3);
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
                    colorTab: 0
                };
                this._frame.img.m = 1 & arr[8] >> 7;
                this._frame.img.i = 1 & arr[8] >> 6;
                this._frame.img.s = 1 & arr[8] >> 5;
                this._frame.img.r = 3 & arr[8] >> 3;
                this._frame.img.pixel = arr[8] & 0x07;
                if (this._frame.img.m) {
                    this._frame.img.colorTab = this.read((2 << this._frame.img.pixel) * 3);
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


    /**
     * 初始化参数
     */
    private clear() {
        this._tab = null;
        this._view = null;
        this._frame = null;
        this._offset = 0;
        this._info = {
            header: '',
            frames: [],
            comment: ''
        };
        this._lastData = null;
        this._delays = [];
        this._spriteFrames = [];
        this._canvas = null;
        this._context = null;
    }

}