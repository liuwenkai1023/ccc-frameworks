export class AudioManager {

    private _musicVolume: number = 1.0;

    private _effectVolume: number = 1.0;

    // private static _instance: AudioManager;

   constructor() {
        this.init();
    }

    
    // /**
    //  * 获取音频管理器
    //  */
    // static getInstance(): AudioManager {
    //     if (!AudioManager._instance) {
    //         AudioManager._instance = new AudioManager();
    //     }
    //     return this._instance;
    // }


    /**
     * 初始化参数
     */
    private init() {
        // 初始化音量值
        let musicVolume = cc.sys.localStorage.getItem("musicVolume");
        let effectVolume = cc.sys.localStorage.getItem("effectVolume");
        this.musicVolume = (musicVolume == null ? this.musicVolume : parseFloat(musicVolume));
        this.effectVolume = (effectVolume == null ? this.effectVolume : parseFloat(effectVolume));
        // 游戏进入后台时触发
        cc.game.on(cc.game.EVENT_HIDE, function () {
            this.pauseAll();
        }.bind(this));
        // 游戏进入前台时触发
        cc.game.on(cc.game.EVENT_SHOW, function () {
            this.resumeAll();
        }.bind(this));
    }


    /**
     * 获取音频地址URL
     * @param url 音频相对地址
     */
    private getAudioUrl(url) {
        return cc.url.raw("resources/sounds/" + url);
    }


    /**
     * 播放音效
     * @param url 音频地址
     */
    public playEffect(url) {
        let id;
        (<any>cc.AudioClip)._loadByUrl(this.getAudioUrl(url), function (err, clip) {
            if (clip) {
                id = cc.audioEngine.playEffect(clip, false);
            }
        });
        return id;
    }


    /**
     * 播放音乐
     * @param url 音频地址
     */
    public playMusic(url) {
        let id;
        (<any>cc.AudioClip)._loadByUrl(this.getAudioUrl(url), function (err, clip) {
            if (clip) {
                id = cc.audioEngine.playMusic(clip, true);
            }
        });
        return id;
    }


    /**
     * 暂停播放的音频
     */
    public pauseAll() {
        // console.log("cc.audioEngine.pauseAll");
        cc.audioEngine.pauseAll();
    }


    /**
    * 恢复播放暂停的音频
    */
    public resumeAll() {
        // console.log("cc.audioEngine.resumeAll");
        cc.audioEngine.resumeAll();
    }


    /**
     *  定义_musicVolume的存取器
     */
    get musicVolume() {
        return this._musicVolume;
    }

    set musicVolume(volume) {
        this._musicVolume = ((volume >= 0 || volume <= 1) ? volume : this._musicVolume);
        cc.audioEngine.setMusicVolume(this._musicVolume);
        cc.sys.localStorage.setItem("musicVolume", volume);
    }


    /**
     * 定义_effectVolume的存取器
     */
    get effectVolume() {
        return this._effectVolume;
    }

    set effectVolume(volume) {
        this._effectVolume = ((volume >= 0 || volume <= 1) ? volume : this.effectVolume);
        cc.audioEngine.setEffectsVolume(this.effectVolume);
        cc.sys.localStorage.setItem("effectVolume", volume);
    }

}
