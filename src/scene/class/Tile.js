/**
 * Created by gd on 2017/8/16/016.
 */

/*
 *  砖块类
 * */
var Tile = cc.Class.extend({
    ctor: function (cell, value) {
        this.x = cell.x
        this.y = cell.y
        this.value = value || 2
        this.previousPosition = null;
        this.mergedFrom = null // 记录该砖块的合并信息
    }
})

Tile.prototype.savePosition = function () {
    this.previousPosition = {x: this.x, y: this.y}
}

Tile.prototype.upDataPosition = function (position) {
    this.x = position.x
    this.y = position.y
}