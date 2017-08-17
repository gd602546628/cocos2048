/**
 * Created by gd on 2017/8/14/014.
 */



var TileSprite = cc.Sprite.extend({
    ctor: function (value) {
        this._super('res/nums/' + value + '.png')
        this.value = value
        this.location = {}
    }
})

TileSprite.create = function (value) {
    return new TileSprite(value)
}

TileSprite.prototype.playMove = function (x, y, callBack) {
    var actionTo = cc.moveTo(0.1, cc.p(x, y));
    this.stopAction();
    this.runAction(cc.sequence(actionTo, cc.callFunc(function () {
        callBack && callBack();
    })));
}

TileSprite.prototype.playScale = function (merged) {
    var actionZoomIn, actionZoomOut;
    if (!merged) {
        this.scale = 0.1;
        this.runAction(cc.scaleTo(0.1, 1, 1));
    } else {
        actionZoomIn = cc.scaleTo(0.1, 1.2, 1.2);
        actionZoomOut = cc.scaleTo(0.1, 1, 1);
        this.runAction(cc.sequence(actionZoomIn, actionZoomOut));
    }
};