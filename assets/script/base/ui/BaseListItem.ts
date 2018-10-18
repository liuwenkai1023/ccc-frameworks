import extend = cc.js.extend;
import ccclass = cc._decorator.ccclass;
import property = cc._decorator.property;

@ccclass
export default abstract class BaseListItem extends cc.Component {
    abstract setData(data: any);
}