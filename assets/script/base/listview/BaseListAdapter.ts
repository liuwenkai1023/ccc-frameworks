// 数据绑定的辅助适配器
export default abstract class BaseListAdapter {

    private dataSet: any[] = [];

    public setDataSet(data: any[]) {
        this.dataSet = data;
    }

    public getCount(): number {
        return this.dataSet.length;
    }

    public getItem(posIndex: number): any {
        return this.dataSet[posIndex];
    }

    public _getView(item: cc.Node, posIndex: number): cc.Node {
        this.updateView(item, posIndex);
        return item;
    }

    public abstract updateView(item: cc.Node, posIndex: number);
}