/**
 * Created by gd on 2017/8/9/009.
 */
var Main = cc.Layer.extend({
    backgroundLayer: null,
    ctor: function () {
        this._super()
        this.loadBackgroundLayer()
        this.loadMainLayer()
    },
    loadBackgroundLayer: function () {
        this.backgroundLayer = new BackgroundLayer()
        this.addChild(this.backgroundLayer)
    },
    loadMainLayer: function () {
        var mainLayer = new MainLayer()
        this.addChild(mainLayer)
    }
})