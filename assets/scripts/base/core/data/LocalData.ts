
class DataDef {
    public _sName: string = "";
    public _sType: string = "";
    public _default: any = null;
    public _bResetDaliy: boolean = false;
    public _nMin: number = -0xFFFFFF;
    public _nMax: number = 0xFFFFFF;
    constructor(sName: string, sType: string, def: any, bResetDaliy = false, nMin: number = -0xFFFFFF, nMax: number = 0xFFFFFF) {
        this._sName = sName;
        this._sType = sType;
        this._default = def;
        this._bResetDaliy = bResetDaliy;
        this._nMin = nMin;
        this._nMax = nMax;
    }
}


export class LocalData {
    private _sGameData: string;
    private _tDataDef: { [sSub: string]: DataDef } = {};
    private _tGameData: { [sPropName: string]: string | number } = {};
    private _pOnLoadedCallback: () => void = null;

    // private static _Instance: LocalData = null;

    // constructor() {
    // }

    // public static GetInstance(): LocalData {
    //     if (this._Instance == null) {
    //         this._Instance = new LocalData()
    //     }
    //     return this._Instance;
    // }

    public AddDataDef(def: DataDef) {
        if (def != null && def._sName != null) {
            this._tDataDef[def._sName] = def;
        }
    }

    public AddDataDefEx(arr: Array<any>) {
        this.AddDataDef(new DataDef(arr[0], arr[1], arr[2], arr[3], arr[4], arr[5]));
    }

    public SetDataDef(tData: Array<DataDef>) {
        for (let def of tData) {
            this._tDataDef[def._sName] = def;
        }
    }

    public SetDataDefEx(arr: Array<Array<any>>) {
        for (let i = 0; i < arr.length; ++i) {
            this.AddDataDefEx(arr[i])
        }
    }

    public SetVal(sName: string, val: any) {
        let tProp = this._tDataDef[sName];
        if (tProp != null) {
            this._tGameData[sName] = val;
        }
    }

    public GetVal(sName: string) {
        let tProp = this._tDataDef[sName];
        if (tProp != null) {
            return this._tGameData[sName];
        }
    };

    public MofidyVal(sName: string, nNum: number) {
        let tDataConf = this._tDataDef[sName];
        if (tDataConf != null && tDataConf._sType == "number") {
            let nNewVal = <number>this._tGameData[sName] + nNum;
            nNewVal = (nNewVal > tDataConf._nMax) ? tDataConf._nMax : nNewVal;
            nNewVal = (nNewVal < tDataConf._nMin) ? tDataConf._nMin : nNewVal;
            this._tGameData[sName] = nNewVal;
        }
    }

    public LoadAllData() {
        // let sGameData = <string>App.Utils.StorageManager.getObject("GameData");
        let sGameData = <string>localStorage.getItem("GameData");
        this.DecodeGameData(sGameData);
        this.ResetDaliy();
    };

    public ResetDaliy() {
        let oNowTime = new Date();
        let oTodayBeginDate = new Date();
        oTodayBeginDate.setDate(oNowTime.getDate());
        oTodayBeginDate.setHours(0, 0, 0, 0);
        let nTodayBeginTimeVal = oTodayBeginDate.getTime();
        let nLastResetTime = <number>this.GetVal("LastResetTime");
        if ((nTodayBeginTimeVal - nLastResetTime) >= 86400000) {
            let tGameData = this._tGameData;
            if (tGameData != null) {
                for (let sAttri in this._tDataDef) {
                    let tProConf = this._tDataDef[sAttri];
                    if (tProConf != null) {
                        if (tGameData[sAttri] != null && tProConf._bResetDaliy) {
                            this.SetVal(tProConf._sName, tProConf._default);
                        }
                    }
                }
            }
            this.SetVal("LastResetTime", nTodayBeginTimeVal)
        }
    }

    private DecodeGameData(sGameData: string) {
        if (sGameData == null || sGameData == "") {
            sGameData = "{}";
        }
        let tProps = JSON.parse(sGameData);
        if (tProps == null) {
            tProps = {};
        }
        for (let sAttri in this._tDataDef) {
            let tProConf = this._tDataDef[sAttri];
            if (tProConf != null) {
                if (tProps[sAttri] != null) {
                    this.SetVal(tProConf._sName, tProps[sAttri]);
                } else {
                    this.SetVal(tProConf._sName, tProConf._default);
                }
            }
        }
        if (this._pOnLoadedCallback != null) {
            this._pOnLoadedCallback();
        }
    }

    public SaveAllData() {
        let sGameDataStr = JSON.stringify(this._tGameData);
        if (sGameDataStr != null && this._sGameData != sGameDataStr) {
            this._sGameData = sGameDataStr;
            // App.Utils.StorageManager.setObject("GameData", this._tGameData);
            cc.sys.localStorage.setItem("GameData", sGameDataStr);
        }
    };

    public ClearAllData() {
        this._tGameData = {};
        this.SaveAllData();
    }

    public OnAllDataLoaded(pCallback: () => void) { this._pOnLoadedCallback = pCallback };
}