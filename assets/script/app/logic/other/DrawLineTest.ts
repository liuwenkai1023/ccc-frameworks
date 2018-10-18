const { ccclass, executeInEditMode, requireComponent, property } = cc._decorator;

@ccclass
@requireComponent(cc.Graphics)
export default class DrawLineTest extends cc.Component {
    private _graphics: cc.Graphics = null;
    private _pots: cc.Vec2[] = [];
    private _lastPot: cc.Vec2 = cc.v2(-999, -999);

    onLoad() {
        this._graphics = this.getComponent(cc.Graphics);
        let phyMgr = cc.director.getPhysicsManager();
        phyMgr.gravity = cc.v2(0, -100);
        phyMgr.enabledAccumulator = true;
        phyMgr.enabled = true;
        phyMgr.debugDrawFlags = 1;
        let oCollisionMgr = cc.director.getCollisionManager();
        oCollisionMgr.enabled = true;
        oCollisionMgr.enabledDebugDraw = true;
    }

    start() {
        this.node.on(cc.Node.EventType.TOUCH_START, (tEvt: cc.Event.EventTouch) => {
            this._pots = [];
        });
        this.node.on(cc.Node.EventType.TOUCH_MOVE, (tEvt: cc.Event.EventTouch) => {
            let tTouch = this.node.convertToNodeSpaceAR(tEvt.getLocation());
            if (tTouch == null || tTouch.x == undefined || tTouch.y == undefined) {
                return;
            }
            if (tTouch.sub(this._lastPot).mag() <= 8) {
                return;
            }
            this._pots.push(tTouch);
            this.DrawPreviews(this._pots);
            this._lastPot = tTouch;
        });
        this.node.on(cc.Node.EventType.TOUCH_END, (tEvt: cc.Event.EventTouch) => {
            this._graphics.clear();
            this.DrawAllLines(this._pots);
        });
    }

    public DrawAllLines(tPots: cc.Vec2[]) {
        if (tPots.length <= 3) {
            return;
        }
        let tLineNormals = this.GetLineNormals(tPots);
        let tVecNormals = this.GetVecNormals(tLineNormals);
        let newRootNode = new cc.Node();
        let nSegments = Math.floor(tPots.length - 1);
        newRootNode.addComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic;
        for (let i = 0; i < nSegments; ++i) {
            let tPts: cc.Vec2[] = [];
            let tPoly: cc.Vec2[] = [];
            for (let j = 0; j < 2; ++j) {
                tPts.push(tPots[i + j]);
            }
            tPoly[0] = tPts[0].add(tVecNormals[i].mul(2));
            tPoly[1] = tPts[0].add(tVecNormals[i].mul(-2));
            tPoly[2] = tPts[1].add(tVecNormals[i + 1].mul(-2));
            tPoly[3] = tPts[1].add(tVecNormals[i + 1].mul(2));
           
            let collider = newRootNode.addComponent("cc.PhysicsPolygonCollider").points = tPoly;

        }
        this.node.addChild(newRootNode);
    }

    public GetPolys(pots: cc.Vec2[], vetexNormals: cc.Vec2[]): cc.Vec2[] {
        let polys: cc.Vec2[] = [];
        for (let i = 0; i < pots.length; ++i) {
            let tNor = vetexNormals[i];
            let tNewPot = pots[i].add(tNor.mul(2));
            polys.push(tNewPot);
        }
        for (let i = pots.length - 1; i >= 0; --i) {
            let tNor = vetexNormals[i];
            let tNewPot = pots[i].add(tNor.mul(-2));
            polys.push(tNewPot);
        }
        return polys;
    }

    public GetLineNormals(pots: cc.Vec2[]) {
        let lineNormals: cc.Vec2[] = [];
        for (let i = 0; i < pots.length - 1; ++i) {
            let vec1 = pots[i].sub(pots[i + 1]);
            let temp1 = cc.v2(vec1.y, -vec1.x).normalize();
            lineNormals.push(temp1);
        }
        return lineNormals;
    }

    public GetVecNormals(lineNormals: cc.Vec2[]) {
        let vecNormals: cc.Vec2[] = [];
        vecNormals.push(lineNormals[0]);
        for (let i = 0; i < lineNormals.length - 1; ++i) {
            let normal = lineNormals[i].add(lineNormals[i + 1])
            vecNormals.push(normal.normalize());
        }
        vecNormals.push(lineNormals[lineNormals.length - 1]);
        return vecNormals;
    }

    public DrawPreviews(pots) {
        if (pots.length <= 3) {
            return;
        }
        let graphic = this._graphics;
        let tLineNormals = this.GetLineNormals(pots);
        let tVecNormals = this.GetVecNormals(tLineNormals);
        let tPoly = this.GetPolys(pots, tVecNormals);
        graphic.strokeColor = cc.color(0, 255, 0, 255);
        graphic.clear();
        for (let i = 0; i < pots.length; i++) {
            let pot = pots[i];
            let normalVec = pot.add(tVecNormals[i].mul(2));
            graphic.lineTo(pot.x, pot.y);
            graphic.circle(pot.x, pot.y, 3);
            graphic.moveTo(pot.x, pot.y);
            graphic.lineTo(normalVec.x, normalVec.y);
            graphic.moveTo(pot.x, pot.y);
        };

        for (let i = 0; i < tPoly.length; i++) {
            let pot = tPoly[i];
            //let normalVec = pot.add(tVecNormals[i].mul(5));
            graphic.lineTo(pot.x, pot.y);
            // graphic.circle(pot.x,pot.y,3);
            // graphic.moveTo(pot.x,pot.y);
            // graphic.lineTo(normalVec.x,normalVec.y);
            graphic.moveTo(pot.x, pot.y);
        };
        graphic.moveTo(0, 0);
        graphic.stroke();

    }

    public DrawLines(pots) {
        if (pots.length <= 3) {
            return;
        }
        let newNode = new cc.Node();
        let graphic = newNode.addComponent(cc.Graphics);
        let tLineNormals = this.GetLineNormals(pots);
        let tVecNormals = this.GetVecNormals(tLineNormals);
        let tPoly = this.GetPolys(pots, tVecNormals);

        newNode.addComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic;
        newNode.addComponent(cc.PolygonCollider).points = tPoly;
        newNode.addComponent("cc.PhysicsPolygonCollider").points = tPoly;
        newNode.getComponent("cc.PhysicsPolygonCollider").enabled = true;

        this.node.addChild(newNode);
        graphic.strokeColor = cc.color(0, 255, 0, 255);
        graphic.clear();
        for (let i = 0; i < pots.length; i++) {
            let pot = pots[i];
            graphic.lineTo(pot.x, pot.y);
            graphic.moveTo(pot.x, pot.y);
        };
        graphic.moveTo(0, 0);
        graphic.stroke();
    }
}
