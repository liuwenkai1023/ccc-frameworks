// var SpriteHook = {
// }
// 支持自定义Shader
const renderEngine = cc.renderer.renderEngine;
const SpriteMaterial = renderEngine.SpriteMaterial;
const GraySpriteMaterial = renderEngine.GraySpriteMaterial;
const STATE_CUSTOM = 101;

export class SpriteHook {
    static init() {
        let prototype: any = <any>cc.Sprite.prototype;
        // @ts-ignore
        cc.dynamicAtlasManager.enabled = false;
        // 取自定义材质
        prototype.getMaterial = function (name) {
            // console.log("prototype.getMaterial")
            if (this._materials) {
                return this._materials[name];
            } else {
                return undefined;
            }
        }

        // 设置自定义材质
        prototype.setMaterial = function (name, mat) {
            // console.log("prototype.setMaterial")
            if (!this._materials) {
                this._materials = {}
            }
            this._materials[name] = mat;
        }

        // 激活某个材质
        prototype.activateMaterial = function (name) {
            // console.log("prototype.activateMaterial", name)
            var mat = this.getMaterial(name);
            if (mat && mat !== this._currMaterial) {
                if (mat) {
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
                } else {
                    // console.error("activateMaterial - unknwon material: ", name);
                }
            }
        }

        // 取当前的材质
        prototype.getCurrMaterial = function () {
            // console.log("prototype.getCurrMaterial")
            if (this._state === STATE_CUSTOM) {
                return this._currMaterial;
            }
        }

        prototype._activateMaterial = function () {
            // console.log("prototype._activateMaterial")
            let spriteFrame = this._spriteFrame;
            // WebGL
            if (cc.game.renderType !== cc.game.RENDER_TYPE_CANVAS) {
                // Get material
                let material;
                if (this._state === (<any>cc.Sprite).State.GRAY) {
                    if (!this._graySpriteMaterial) {
                        this._graySpriteMaterial = new GraySpriteMaterial();
                        this.node._renderFlag |= (<any>cc).RenderFlow.FLAG_COLOR;
                    }
                    material = this._graySpriteMaterial;
                    this._currMaterial = null;
                }
                else if (this._state === STATE_CUSTOM) {
                    if (!this._currMaterial) {
                        // console.error("_activateMaterial: _currMaterial undefined!")
                        return;
                    }
                    material = this._currMaterial;
                }
                else {
                    if (!this._spriteMaterial) {
                        this._spriteMaterial = new SpriteMaterial();
                        this.node._renderFlag |= (<any>cc).RenderFlow.FLAG_COLOR;
                    }
                    material = this._spriteMaterial;
                    this._currMaterial = null;
                }
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
                    this.markForUpdateRenderData(true);
                    this.markForRender(true);
                }
                else {
                    this.disableRender();
                }
            }
        }
    }
}
