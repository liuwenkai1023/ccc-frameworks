// 数据绑定的辅助适配器
export default abstract class BaseListAdapter {

    private dataSet: any[] = [];

    public abstract setDataSet(data: any[]);

    public abstract getCount(): number;

    public abstract getItem(posIndex: number): any;

    public abstract _getView(item: cc.Node, posIndex: number): cc.Node;

    public abstract updateView(item: cc.Node, posIndex: number);
}