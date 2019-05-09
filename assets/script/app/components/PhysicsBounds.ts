
const { ccclass, property, disallowMultiple} = cc._decorator;

@ccclass
@disallowMultiple
export default class PhysicsBounds extends cc.Component {

    @property(cc.Size)
    size: cc.Size = cc.size(0, 0);

    @property(cc.Boolean)
    mouseJoint: boolean = true;

    // use this for initialization
    start() {
        this.node.children.forEach(child => {
            child.removeFromParent();
        });
        let width = this.size.width || this.node.width;
        let height = this.size.height || this.node.height;
        let node = new cc.Node();
        let body = node.addComponent(cc.RigidBody);
        body.type = cc.RigidBodyType.Static;
        if (this.mouseJoint) {
            // add mouse joint
            let joint = node.addComponent(cc.MouseJoint);
            joint.mouseRegion = this.node;
        }
        this._addBound(node, 0, height / 2, width, 20);
        this._addBound(node, 0, -height / 2, width, 20);
        this._addBound(node, -width / 2, 0, 20, height);
        this._addBound(node, width / 2, 0, 20, height);
        node.setParent(this.node);
    }

    _addBound(node, x, y, width, height) {
        let collider = node.addComponent(cc.PhysicsBoxCollider);
        collider.offset.x = x;
        collider.offset.y = y;
        collider.size.width = width;
        collider.size.height = height;
    }

}
