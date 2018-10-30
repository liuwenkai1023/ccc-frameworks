// import BaseComponent from "../BaseComponent";

// //注意:模板创建后的import路径可能不对,还请重新import一次

// const { ccclass, property, disallowMultiple, executeInEditMode, requireComponent } = cc._decorator;

// @ccclass
// @executeInEditMode
// @disallowMultiple
// @requireComponent(cc.Sprite)
// export default class ComponentName extends BaseComponent {

//     @property({ type: cc.SpriteFrame, visible: false })
//     defSpriteFrame: cc.SpriteFrame;

//     @property({ type: cc.Sprite, visible: false })
//     sprite: cc.Sprite;

//     @property
//     opacity: number = 0;

//     @property
//     _x: number = 0;

//     @property
//     _y: number = 0;

//     @property
//     _width: number = 0;

//     @property
//     _height: number = 0;

//     @property
//     get x() {
//         return this._x;
//     }
//     set x(v) {
//         this._x = v;
//         this.applayChanged();
//     }

//     @property
//     get y() {
//         return this._y;
//     }
//     set y(v) {
//         this._y = v;
//         this.applayChanged();
//     }

//     @property
//     get width() {
//         return this._width;
//     }
//     set width(v) {
//         this._width = v;
//         this.applayChanged();
//     }


//     @property
//     get height() {
//         return this._height;
//     }
//     set height(v) {
//         this._height = v;
//         this.applayChanged();
//     }


//     private applayChanged() {
//         if (this.sprite && this.opacity != null) {
//             this.setSpriteRectOpacity(this.sprite, new cc.Rect(this.x, this.y, this.width, this.height), this.opacity)
//         }
//     }


//     protected onLoad() {
//         super.onLoad();
//         this.sprite = this.node.getComponent(cc.Sprite);
//         this.defSpriteFrame = this.sprite.spriteFrame;
//     }


//     protected start() {
//         this.applayChanged();
//     }


//     public setSpriteRectOpacity(sprite: cc.Sprite, rect: cc.Rect, opacity: number) {
//         let texture = sprite.spriteFrame.getTexture();
//         let canvas = document.createElement('canvas');
//         let context = canvas.getContext('2d');
//         let rt = new cc.RenderTexture();
//         let sp;

//         // 取出对应精灵帧数据
//         rt.initWithSize(texture.width, texture.height);
//         (<any>rt).drawTextureAt(texture, 0, 0);

//         // 转换为canvas上坐标
//         rect = rect.clone();
//         rect.width = rect.width + rect.x > texture.width ? texture.width - rect.x : rect.width;
//         rect.height = rect.height + rect.y > texture.height ? texture.height - rect.y : rect.height;
//         rect.y = texture.height - (rect.y + rect.height);

//         // 设置canvas宽度
//         canvas.width = texture.width;
//         canvas.height = texture.height;

//         // 处理RGBA像素数据
//         let data = rt.readPixels(null, rect.x, rect.y, rect.width, rect.height);
//         for (let i = 0; i < data.length; i += 4) {
//             data[i + 3] = opacity;
//         }

//         // 将处理过后的数据绘制到canvas
//         context.putImageData(new ImageData(new Uint8ClampedArray(rt.readPixels()), texture.width, texture.height), 0, 0);
//         context.putImageData(new ImageData(new Uint8ClampedArray(data), rect.width, rect.height), rect.x, rect.y);

//         // 通过canvas创建纹理
//         let image = new Image();
//         image.src = canvas.toDataURL();
//         rt.initWithElement(image);
//         sp = sprite.spriteFrame.clone()
//         sp.setTexture(rt);
//         sprite.spriteFrame = sp;
//     }

// }
