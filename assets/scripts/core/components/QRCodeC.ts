const { ccclass, property, requireComponent, executeInEditMode, menu } = cc._decorator;

const ModeData = ["-1", "numeric", "alphanumeric", "octet"];

const EcclevelData = ["-1", "L", "M", "Q", "H"];

export enum ModeType {
    DEFAULT,
    MODE_NUMERIC,
    MODE_ALPHANUMERIC,
    MODE_OCTET
}

export enum EcclevelType {
    DEFAULT,
    ECCLEVEL_L,
    ECCLEVEL_M,
    ECCLEVEL_Q,
    ECCLEVEL_H,
}

@ccclass
@requireComponent(cc.Graphics)
@executeInEditMode
@menu("扩展组件/QRCode")
export default class QRCodeC extends cc.Component {

    @property({ visible: false })
    _data: string = "二维码内容";

    @property({ visible: false })
    _padding: number = 10;

    @property({ visible: false })
    _background: cc.Color = cc.Color.WHITE;

    @property({ visible: false })
    _cell: cc.Color = cc.Color.BLACK;

    @property({ visible: false })
    _cellSize: number = 5;

    @property({ visible: false })
    _version: number = -1;

    @property({ min: -1, max: 8, step: 1 })
    _mask = -1;

    @property({ type: cc.Enum(ModeType), visible: false })
    _mode: ModeType = ModeType.DEFAULT;

    @property({ type: cc.Enum(EcclevelType), visible: false })
    _ecclevel: EcclevelType = EcclevelType.DEFAULT;

    graphics: cc.Graphics;


    @property({ displayName: "内容" })
    set data(data: string) {
        if (data != this.data) {
            this._data = data;
            this.applayChanged();
        }
    }
    get data() {
        return this._data;
    }


    @property({ displayName: "预览" })
    preview: boolean = false;


    @property({ displayName: "背景颜色" })
    set background(background: cc.Color) {
        this._background = background;
        this.applayChanged();
    }
    get background() {
        return this._background;
    }


    @property({ displayName: "块颜色" })
    set cell(cell: cc.Color) {
        this._cell = cell;
        this.applayChanged();
    }
    get cell() {
        return this._cell;
    }


    @property({ displayName: "块大小", step: 1 })
    set cellSize(cellSize: number) {
        if (cellSize != this.cellSize) {
            this._cellSize = cellSize;
            this.applayChanged();
        }
    }
    get cellSize() {
        return this._cellSize;
    }


    @property({ displayName: "边距", step: 1 })
    set padding(padding: number) {
        if (padding != this.padding) {
            this._padding = padding;
            this.applayChanged();
        }
    }
    get padding() {
        return this._padding;
    }


    @property({ step: 1 })
    set version(version: number) {
        if (version != this.version) {
            this._version = version;
            this.applayChanged();
        }
    }
    get version() {
        return this._version;
    }


    @property({ min: -1, max: 7, step: 1 })
    set mask(mask: number) {
        if (mask != this.mask) {
            this._mask = mask;
            this.applayChanged();
        }
    }
    get mask() {
        return this._mask;
    }


    @property({ type: cc.Enum(ModeType) })
    set mode(mode: ModeType) {
        if (mode != this.mode) {
            this._mode = mode;
            this.applayChanged();
        }
    }
    get mode() {
        return this._mode;
    }


    @property({ type: cc.Enum(EcclevelType) })
    set ecclevel(ecclevel: EcclevelType) {
        if (ecclevel != this.ecclevel) {
            this._ecclevel = ecclevel;
            this.applayChanged();
        }
    }
    get ecclevel() {
        return this._ecclevel;
    }


    onLoad() {
        this.graphics = this.node.getComponent(cc.Graphics);
    }


    start() {
        this.applayChanged();
    }


    async applayChanged() {
        await 0;
        if (CC_EDITOR && !this.preview) { return; }
        let options = {
            version: this.version,
            mask: this.mask,
            mode: this.mode == 0 ? null : ModeData[this.mode],
            ecclevel: this.ecclevel == 0 ? null : EcclevelData[this.ecclevel],
        };
        let dataArray = QRCode.generate(this.data, options);
        this.updateGraphics(dataArray);
    }


    async updateGraphics(dataArray: Array<Array<number>>) {
        // dataArray
        let size = dataArray.length * this.cellSize + this.padding * 2;
        this.graphics.clear();
        this.graphics.fillColor = this.background;
        this.graphics.rect(- size * this.node.anchorX, - size * this.node.anchorY, size, size);
        this.graphics.fill();
        this.graphics.fillColor = this.cell;
        for (let y = 0; y < dataArray.length; y++) {
            const dataLine = dataArray[y];
            for (let x = 0; x < dataLine.length; x++) {
                const dataBlock = dataLine[x];
                let y1 = dataArray.length - y - 1;
                dataBlock && this.graphics.rect(x * this.cellSize + this.padding - size * this.node.anchorX, y1 * this.cellSize + this.padding - size * this.node.anchorX, this.cellSize, this.cellSize);
                // dataBlock && this.graphics.stroke();
                dataBlock && this.graphics.fill();
            }
        }
        this.node.width = size;
        this.node.height = size;
    }

    // update (dt) {}
}
