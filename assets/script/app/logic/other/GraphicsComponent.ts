import Base from "../../../base/Base";
import BaseComponent from "../../../base/BaseComponent";
const { ccclass, property, requireComponent, disallowMultiple } = cc._decorator;

@ccclass
@disallowMultiple
@requireComponent(cc.Graphics)
export default class GraphicsComponent extends BaseComponent {
    private graphics: cc.Graphics;

    private points: Array<cc.Vec2>;

    // private c;

    protected onLoad() {
        super.onLoad();
        this.init();
        let phyMgr = cc.director.getPhysicsManager();
        phyMgr.gravity = cc.v2(0, -320);
        phyMgr.enabledAccumulator = false;
        phyMgr.enabled = true;
        // phyMgr.debugDrawFlags = 1;
        // let oCollisionMgr = cc.director.getCollisionManager();
        // oCollisionMgr.enabled = true;
        // oCollisionMgr.enabledDebugDraw = true;
    }

    private init() {
        this.enabled = true;
        this.graphics = this.getComponent(cc.Graphics);
        this.graphics.lineWidth = 2;
        this.graphics.miterLimit = 0.1;
        this.graphics.strokeColor = cc.Color.RED;
        this.graphics.fillColor = cc.Color.BLUE;
        this.graphics.lineJoin = cc.Graphics.LineJoin.ROUND;
        this.graphics.lineCap = cc.Graphics.LineCap.ROUND;
        this.points = [];
    }

    protected start() {
        this.node.on(cc.Node.EventType.TOUCH_START, (tEvt: cc.Event.EventTouch) => {
            this.points = [];
            let point = this.getTouchOnePoint(tEvt);
            this.points.push(point);
            this.move(this.graphics, point);
        });
        this.node.on(cc.Node.EventType.TOUCH_MOVE, (tEvt: cc.Event.EventTouch) => {
            let point = this.getTouchOnePoint(tEvt)
            this.points.push(point);
            this.drawLine(this.graphics, point);
        });
        this.node.on(cc.Node.EventType.TOUCH_END, (tEvt: cc.Event.EventTouch) => {
            let point = this.getTouchOnePoint(tEvt)
            this.points.push(point);
            this.drawLine(this.graphics, point);
            this.drawLineEnd();
        });
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, (tEvt: cc.Event.EventTouch) => {
            let point = this.getTouchOnePoint(tEvt)
            this.points.push(point);
            this.drawLine(this.graphics, point);
            this.drawLineEnd();
        });
    }

    private getTouchOnePoint(event: cc.Event.EventTouch) {
        return this.node.convertToNodeSpaceAR(event["_touches"][0].getLocation());
    }

    /**
     * 开始画线，移动画笔
     * @param graphics 
     * @param point 
     */
    private move(graphics, point: cc.Vec2) {
        graphics.moveTo(point.x, point.y);
    }

    /**
     * 划线
     * @param graphics 
     * @param point 
     */
    private drawLine(graphics, point: cc.Vec2) {
        graphics.lineTo(point.x, point.y);
        graphics.stroke();
        this.move(graphics, point)
    }

    /**
     * 结束画线
     */
    private drawLineEnd() {
        this.graphics.clear();
        let node = new cc.Node();
        let vaildPoints = this.createPhysicsNode(node, this.points);
        if (vaildPoints.length >= 2) {
            let graphics = node.addComponent(cc.Graphics);
            graphics.lineWidth = 2;
            graphics.miterLimit = 0.1;
            graphics.strokeColor = cc.Color.BLUE;
            graphics.fillColor = cc.Color.RED;
            graphics.lineJoin = cc.Graphics.LineJoin.ROUND;
            graphics.lineCap = cc.Graphics.LineCap.ROUND;
            this.move(graphics, this.points[0]);
            for (const point of this.points) {
                this.drawLine(graphics, point);
            }
            graphics.stroke();
            graphics.close();
            this.node.addChild(node);
        }
    }

    /**
     * 创建对应物理节点
     * @param node 
     * @param points 
     */
    private createPhysicsNode(node: cc.Node, points: Array<cc.Vec2>) {
        let finalPoints = this.getVaildPoints(points);
        let lineNormals = this.GetLineNormals(finalPoints);
        // let c = []
        for (let i = 0; i < finalPoints.length - 1; i++) {
            let polygons = [];
            polygons[0] = finalPoints[i].add(lineNormals[i].mul(2));
            polygons[1] = finalPoints[i].add(lineNormals[i].mul(-2));
            polygons[2] = finalPoints[i + 1].add(lineNormals[i].mul(2));
            polygons[3] = finalPoints[i + 1].add(lineNormals[i].mul(-2));
            let collider = node.addComponent(cc.PhysicsPolygonCollider)
            collider.points = polygons;
            // c.push(collider);

        }
        // if (!this.c) {
        //     this.c = c;
        // }
        // for (let index = 0; index < this.c.length; index++) {
        //     if (this.c[index] && c[index]) {
        //         this.c[index].points = c[index].points;
        //     }
        // }
      
        return finalPoints;
    }

    /**
     * 得到有效点，舍弃距离太近的点
     * @param points 
     */
    private getVaildPoints(points: cc.Vec2[]): any {
        if (points.length < 2) return [];
        let finalPoints = [];
        let lastPoint = points[0];
        finalPoints[0] = lastPoint;
        for (let i = 0; i < points.length; i++) {
            let deltaLength = points[i].sub(lastPoint).mag();
            if (deltaLength > 1) {
                lastPoint = points[i]
                finalPoints.push(points[i])
            }
        }
        return finalPoints;
    }


    public GetLineNormals(pots: cc.Vec2[]) {
        let lineNormals: cc.Vec2[] = [];
        for (let i = 0; i < pots.length - 1; ++i) {
            let vec1 = pots[i].sub(pots[i + 1]);
            let temp1 = cc.v2(vec1.y, -vec1.x).normalize();
            // console.log("角度", vec1.angle(cc.v2(vec1.y, -vec1.x)) * 180 / Math.PI);
            lineNormals.push(temp1);
        }
        lineNormals.push(lineNormals[0]);
        return lineNormals;
    }

}
