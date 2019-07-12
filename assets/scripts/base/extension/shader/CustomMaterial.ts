/**
 * 自定义材质
 */

const renderEngine = cc.renderer.renderEngine;
const renderer = renderEngine.renderer;
const gfx = renderEngine.gfx;
const Material = renderEngine.Material;

export class ShaderCustomMaterial extends Material {

	public _params: any;
	public _defines: any;
	public _name: any;
	private _texIds: any;
	private _effect: any;
	private _texture: any;
	public _mainTech: any; // 不要删，会用到
	private _useColor: boolean = false;
	public _color: { r: number; g: number; b: number; a: number; };
	private _useTexture: boolean;
	private _useModel: boolean;
	private _use2DPos: boolean;

	constructor(name?: string | void, params?: any | void, defines?: any | void) {
		super();
		Material.call(this, false);
		let pass = new renderer.Pass(name);
		pass.setDepth(false, false);
		pass.setCullMode(gfx.CULL_NONE);
		pass.setBlend(
			gfx.BLEND_FUNC_ADD,
			gfx.BLEND_SRC_ALPHA,
			gfx.BLEND_ONE_MINUS_SRC_ALPHA,
			gfx.BLEND_FUNC_ADD,
			gfx.BLEND_SRC_ALPHA,
			gfx.BLEND_ONE_MINUS_SRC_ALPHA
		);

		let techParams = [
			{ name: 'texture', type: renderer.PARAM_TEXTURE_2D },
			{ name: 'color', type: renderer.PARAM_COLOR4 },
			{ name: 'time', type: renderer.PARAM_FLOAT },
		];

		if (params) techParams = techParams.concat(params);

		let mainTech = new renderer.Technique(
			['transparent'],
			techParams,
			[pass]
		);

		this._texture = null;
		this._color = { r: 1, g: 1, b: 1, a: 1 };
		this._effect = new renderer.Effect(
			[mainTech],
			{
				'color': this._color,
				'time': 0.0,
			},
			defines.concat([
				{ name: 'useTexture', value: true },
				{ name: 'useModel', value: false },
				{ name: 'alphaTest', value: false },
				{ name: 'use2DPos', value: true },
				{ name: 'useColor', value: true }
			])
		);

		this.name = name;
		this.params = params;
		this.defines = defines;
		this._mainTech = mainTech;
	}

	clone() {
		let copy: ShaderCustomMaterial = new ShaderCustomMaterial();
		copy.texture = this.texture;
		copy.color = this.color;
		copy.updateHash();
		return copy;
	}

	// 设置自定义参数的值
	setParamValue = function (name, value) {
		this._effect.setProperty(name, value);
		return this;
	};

	// 设置定义值
	setDefine = function (name, value) {
		this._effect.define(name, value);
		return this;
	};

	get effect() {
		return this._effect;
	}

	get texture() {
		return this._texture;
	}

	set texture(val) {
		if (this._texture !== val) {
			this._texture = val;
			this._effect.setProperty('texture', val.getImpl());
			this._texIds['texture'] = val.getId();
		}
	}

	get color() {
		return this._color;
	}

	set color(val) {
		let color = this._color;
		color.r = val.r / 255;
		color.g = val.g / 255;
		color.b = val.b / 255;
		color.a = val.a / 255;
		this._effect.setProperty('color', color);
	}

	get name() {
		return this._name;
	}

	set name(name) {
		this._name = name;
	}

	get params() {
		return this._params;
	}

	set params(params) {
		this._params = params;
	}

	get defines() {
		return this._defines;
	}

	set defines(define) {
		this._defines = define;
	}

	get useColor() {
		return this._useColor;
	}

	set useColor(value: boolean) {
		this._useColor = value;
		this.setDefine('useColor', value);
	}

	get useTexture() {
		return this._useTexture;
	}

	set useTexture(value: boolean) {
		this._useTexture = value;
		this.setDefine('useTexture', value);
	}

	get useModel() {
		return this._useModel;
	}

	set useModel(value: boolean) {
		this._useModel = value;
		this.setDefine('useModel', value);
	}

	get use2DPos() {
		return this._use2DPos;
	}

	set use2DPos(value: boolean) {
		this._use2DPos = value;
		this.setDefine('use2DPos', value);
	}

}

// if (Material)
// CustomMaterial.prototype = Object.create(Material && Material.prototype);
// CustomMaterial.prototype.constructor = CustomMaterial;
