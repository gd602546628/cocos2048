/**
 * Created by gd on 2017/8/9/009.
 */

var MainScene = cc.Scene.extend({
    ctor: function () {
        this._super()
    },
    onEnter: function () {
        this._super()
        var layer = new Main()
        this.addChild(layer)
    }
})