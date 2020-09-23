// 将版本【*.*.*】转换为数字
const convertVersionNum = function (versionName) {
    const numArr = versionName.split(".")
    const baseNumArr = [10000, 100, 1];
    const version = 0;
    numArr.forEach((num, index) => {
        version += num * baseNumArr[index];
    });
    return version;
}

// 比较 versionA - versionB
const compareVersion = function (versionA, versionB) {
    return convertVersionNum(versionA) - convertVersionNum(versionB);
}

// --============================================================================================--
// --================================= STRAT 修复在【iOS 14】上的卡顿问题 ===========================--

const isIOS14Device = cc.sys.os === cc.sys.OS_IOS && cc.sys.isBrowser && cc.sys.isMobile && /iPhone OS 14/.test(window.navigator.userAgent);
if (isIOS14Device) {
    cc.MeshBuffer.prototype.checkAndSwitchBuffer = function (vertexCount) {
        if (this.vertexOffset + vertexCount > 65535) {
            this.uploadData();
            this._batcher._flush();
        }
    };
    // 针对大于【2.2.0】的版本
    if (compareVersion(cc.ENGINE_VERSION, "2.2.0") >= 0) {
        cc.MeshBuffer.prototype.forwardIndiceStartToOffset = function () {
            this.uploadData();
            this.switchBuffer();
        };
    }
    // 针对【2.1.x】的版本
    else if (compareVersion(cc.ENGINE_VERSION, "2.1.0")) {
        const _flush = function () {
            let material = this.material,
                buffer = this._buffer,
                indiceStart = buffer.indiceStart,
                indiceOffset = buffer.indiceOffset,
                indiceCount = indiceOffset - indiceStart;
            if (!this.walking || !material || indiceCount <= 0) {
                return;
            }

            let effect = material.effect;
            if (!effect) return;

            // Generate ia
            let ia = this._iaPool.add();
            ia._vertexBuffer = buffer._vb;
            ia._indexBuffer = buffer._ib;
            ia._start = indiceStart;
            ia._count = indiceCount;

            // Generate model
            let model = this._modelPool.add();
            this._batchedModels.push(model);
            model.sortKey = this._sortKey++;
            model._cullingMask = this.cullingMask;
            model.setNode(this.node);
            model.setEffect(effect, this.customProperties);
            model.setInputAssembler(ia);

            this._renderScene.addModel(model);

            if (isIOS14Device) {
                buffer.uploadData();
                buffer.switchBuffer();
            }
            else {
                buffer.byteStart = buffer.byteOffset;
                buffer.indiceStart = buffer.indiceOffset;
                buffer.vertexStart = buffer.vertexOffset;
            }
        }
        cc.MeshBuffer.prototype.checkAndSwitchBuffer = function (vertexCount) {
            if (this.vertexOffset + vertexCount > 65535) {
                this.uploadData();
                this._batcher._flush = _flush;
                this._batcher._flush();
            }
        };
    }
}
// --================================= END 修复在【iOS 14】上的卡顿问题 ===========================--
// --==========================================================================================--
