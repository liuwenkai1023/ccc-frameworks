// var SpriteHook = {
// }
// 支持自定义Shader
const renderEngine = cc.renderer.renderEngine;
const SpriteMaterial = renderEngine.SpriteMaterial;
const GraySpriteMaterial = renderEngine.GraySpriteMaterial;
const STATE_CUSTOM = 101;

export class SpriteHook {

    static compareVersion() {
        let curVersion = cc.ENGINE_VERSION;
        let targetVersion = '2.0.10';
        return this.getVersionCode(curVersion) < this.getVersionCode(targetVersion);
    }

    static getVersionCode(versionA) {
        let versionNums = versionA.split(".");
        let versionCode = Number(versionNums[0]) * 1000 + Number(versionNums[1]) * 100 + Number(versionNums[2]);
        // console.log(versionCode);
        return versionCode;
    }

    static init() {
        let prototype: any = <any>cc.Sprite.prototype;
        // @ts-ignore
        cc.dynamicAtlasManager.enabled = false;
        prototype.oldVersion = SpriteHook.compareVersion();

        // 设置自定义材质
        prototype.setCustomMaterial = function (name, mat) {
            // console.log("prototype.setMaterial")
            if (!this._materials) {
                this._materials = {}
            }
            this._materials[name] = mat;
        }

        // 取自定义材质
        prototype.getCustomMaterial = function (name) {
            // console.log("prototype.setMaterial")
            if (this._materials) {
                return this._materials[name];
            }
        }

        // 取当前的材质
        prototype.getCurrMaterial = function () {
            // console.log("prototype.getCurrMaterial")
            if (this._state === STATE_CUSTOM) {
                return this._currMaterial;
            }
        }

        // 激活某个材质
        prototype.activateCustomMaterial = function (name) {
            var mat = this.getCustomMaterial(name);
            if (mat && mat !== this._currMaterial) {
                if (this.node) {
                    mat.color = this.node.color;
                }
                if (this.spriteFrame) {
                    mat.texture = this.spriteFrame.getTexture();
                }
                this.node._renderFlag |= (<any>cc).RenderFlow.FLAG_COLOR;
                this._currMaterial = mat;
                this._currMaterial.name = name;
                this._state = STATE_CUSTOM;
                this._activateMaterial();
            }
        }


        prototype._activateMaterial = function () {
            let spriteFrame = this._spriteFrame;
            // WebGL
            if (cc.game.renderType !== cc.game.RENDER_TYPE_CANVAS) {
                // Get material
                let material;
                if (this._state === cc.Sprite['State'].GRAY) {
                    if (!this._graySpriteMaterial) {
                        this._graySpriteMaterial = new GraySpriteMaterial();
                    }
                    material = this._graySpriteMaterial;
                    this._currMaterial = null;
                } else if (this._state === STATE_CUSTOM) {
                    if (!this._currMaterial) {
                        // console.error("_activateMaterial: _currMaterial undefined!")
                        return;
                    }
                    material = this._currMaterial;
                } else {
                    if (!this._spriteMaterial) {
                        this._spriteMaterial = new SpriteMaterial();
                    }
                    material = this._spriteMaterial;
                    this._currMaterial = null;
                }
                // For batch rendering, do not use uniform color.
                material.useColor = this.oldVersion;
                // Set texture
                if (spriteFrame && spriteFrame.textureLoaded()) {
                    let texture = spriteFrame.getTexture();
                    if (material.texture !== texture) {
                        material.texture = texture;
                        this._updateMaterial(material);
                    }
                    else if (material !== this._material) {
                        this._updateMaterial(material);
                    }
                    if (this._renderData) {
                        this._renderData.material = material;
                    }

                    this.node._renderFlag |= cc['RenderFlow'].FLAG_COLOR;
                    this.markForUpdateRenderData(true);
                    this.markForRender(true);
                }
                else {
                    this.disableRender();
                }
            }
            else {
                this.markForUpdateRenderData(true);
                this.markForRender(true);
            }
        }
    }
}
