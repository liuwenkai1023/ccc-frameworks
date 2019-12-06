/**
 * BezierMaker
 * N阶贝塞尔曲线
 * git clone https://github.com/Aaaaaaaty/bezierMaker.js.git
 */
export default class BezierMaker {

    private _bezierArr: Array<Point>;

    private _bezierCtrlNodesArr: Array<Point>;


    /**
     * @param bezierCtrlNodesArr 控制点数组，包含x，y坐标
     */
    constructor(bezierCtrlNodesArr?: Array<Point>) {
        this._bezierArr = [];
        this._bezierCtrlNodesArr = bezierCtrlNodesArr ? bezierCtrlNodesArr : [];
    }


    /**
     * 贝塞尔公式调用
     * @param t 尔函数涉及的占比比例，0<=t<=1
     */
    public bezier(t) {
        let x = 0;
        let y = 0;
        let bezierCtrlNodesArr = this._bezierCtrlNodesArr;
        let n = bezierCtrlNodesArr.length - 1;
        bezierCtrlNodesArr.forEach((item, index) => {
            if (!index) {
                x += item.x * Math.pow((1 - t), n - index) * Math.pow(t, index);
                y += item.y * Math.pow((1 - t), n - index) * Math.pow(t, index);
            } else {
                x += this.factorial(n) / this.factorial(index) / this.factorial(n - index) * item.x * Math.pow((1 - t), n - index) * Math.pow(t, index);
                y += this.factorial(n) / this.factorial(index) / this.factorial(n - index) * item.y * Math.pow((1 - t), n - index) * Math.pow(t, index);
            }
        });
        return { x: x, y: y };
    }


    /**
     * 得到当前贝塞尔曲线上的点
     *  @param count 需要获得的点个数
     */
    public getBezierArr(count: number = 100) {
        let bezierArr = [];
        for (let i = 0; i < 1; i += 1 / count) {
            bezierArr.push(this.bezier(i));
        }
        return bezierArr;
    }


    /**
     * 递归阶乘
     */
    private factorial(num: number) {
        if (num <= 1) {
            return 1;
        } else {
            return num * this.factorial(num - 1);
        }
    }


    /**
     * 当前贝塞尔曲线上的点get(默认100个)
     */
    get bezierArr() {
        if (!this._bezierArr.length) {
            this._bezierArr = this.getBezierArr();
        }
        return this._bezierArr;
    }


    /**
     * 贝塞尔曲线控制点数组get
     */
    get bezierCtrlNodesArr() {
        return this._bezierCtrlNodesArr;
    }


    /**
     * 贝塞尔曲线控制点数组set
     */
    set bezierCtrlNodesArr(bezierCtrlNodesArr: Array<Point>) {
        bezierCtrlNodesArr.length < 2 && console.error("贝塞尔：至少传入两个点坐标");
        this._bezierArr = [];
        this._bezierCtrlNodesArr = bezierCtrlNodesArr;
    }

}

/**
 * 坐标点
 */
export interface Point {
    x: number,
    y: number
}