// export default class DataManager {
//     private static _instance: DataManager = null;
//     private _tNameDataMap: { [sSub: string]: { [key: string]: object } } = {};

//     private constructor() {
//         this.init();
//     }

//     public static instance(): DataManager {
//         if (this._instance == null) {
//             this._instance = new DataManager()
//         }
//         return this._instance;
//     }

//     public init() {
//         this._tNameDataMap = {};
//     }

//     public loadJsonData(sPath: string, sName: string, bNeedConvert: boolean = false, bIsArray: boolean = false): void {
//         cc.loader.loadRes(sPath, (error, contents) => {
//             let tDataMap: { [key: string]: object } = {};
//             let tTypes = <Array<Object>>contents.json["types"];
//             let tFields = <Array<Object>>contents.json["fields"];
//             let tValues = <Array<Object>>contents.json["values"];
//             for (let idx in tValues) {
//                 let val = tValues[idx];
//                 let tDataObject = new Object();
//                 for (let i = 0; i < tTypes.length; ++i) {
//                     let sFieldName = <string>tFields[i];
//                     let sType = <string>tTypes[i];
//                     switch (sType) {
//                         case "I":
//                             tDataObject[sFieldName] = <number>(val[i]);
//                             break;
//                         case "S":
//                             tDataObject[sFieldName] = <string>(val[i]);
//                             break;
//                     }
//                 }
//                 if (bNeedConvert == true) {
//                     let ID = <string>tDataObject["ID"];
//                     tDataMap[ID] = tDataObject;
//                 } else {
//                     tDataMap[idx] = tDataObject;
//                 }
//             }
//             this._tNameDataMap[sName] = tDataMap;
//         })
//     }

//     public getDataByName(sName: string): Object {
//         return this._tNameDataMap[sName];
//     }

//     public getDataByNameAndId(sName: string, sID: string) {
//         let tData = this._tNameDataMap[sName];
//         if (tData != null) {
//             return tData[sID];
//         }
//     }

//     public clearDataByName(sName: string): void {
//         this._tNameDataMap[sName] = null;
//     }

// }
