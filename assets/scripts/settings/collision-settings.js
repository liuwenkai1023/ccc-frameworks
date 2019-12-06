cc.game.on(cc.game.EVENT_ENGINE_INITED, () => {
    var manager = cc.director.getCollisionManager();
    manager.enabled = true;
    // manager.enabledDebugDraw = true;
});