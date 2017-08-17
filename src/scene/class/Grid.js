/**
 * Created by gd on 2017/8/16/016.
 */

/*
 *  网格类
 * */
var Grid = cc.Class.extend({
    ctor: function () {
        this.size = 4
        this.cells = this.empty() // 二维数组，模拟4x4的方格
    }
})

// 二位数组，保存每个方格的位置
Grid.positionPool = [[], [], [], []]

Grid.prototype.empty = function () {
    var cells = [],
        row;
    for (var x = 0; x < this.size; x++) {
        row = cells[x] = [];

        for (var y = 0; y < this.size; y++) {
            row.push(null);
        }
    }
    return cells;
};

// 找到cells中所有的空格子
Grid.prototype.findEmptyCells = function () {
    var cells = []
    this.eachCells(function (x, y, tile) {
        if (!tile) {
            cells.push({x: x, y: y})
        }
    })
    return cells
}

// 随机的从cells中找一个空位
Grid.prototype.findRandowEmptyCell = function () {
    var cells = this.findEmptyCells()
    if (cells.length) {
        return cells[Math.floor(Math.random() * cells.length)]
    }
}

// 是否还有空格
Grid.prototype.HasEmptyCell = function () {
    return !!this.findEmptyCells().length
}

// 指定格子是否为空
Grid.prototype.cellIsEmpty = function (tile) {
    return !this.cells[tile.x][tile.y]
}

Grid.prototype.cellContent = function (tile) {
    if (this.isInGrid(tile)) {
        return this.cells[tile.x][tile.y]
    } else {
        return null
    }
}

Grid.prototype.insertTile = function (tile) {
    this.cells[tile.x][tile.y] = tile
}

Grid.prototype.removeTile = function (tile) {
    this.cells[tile.x][tile.y] = null
}

Grid.prototype.isInGrid = function (tile) {
    return (tile.x >= 0 && tile.x < this.size) && (tile.y >= 0 && tile.y < this.size)
}

Grid.prototype.eachCells = function (callBack) {
    for (var x = 0; x < this.size; x++) {
        for (var y = 0; y < this.size; y++) {
            callBack(x, y, this.cells[x][y])
        }
    }
}