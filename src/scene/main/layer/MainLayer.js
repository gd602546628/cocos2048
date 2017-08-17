/**
 * Created by gd on 2017/8/10/010.
 */

var MainLayer = cc.Layer.extend({
    header: null,
    resetButton: null,
    gameLayer: null,
    score: 0,
    best: 0,
    lbScore: null,
    lbBest: null,
    gameOverSprite: null,
    gameStatus: 0,
    ctor: function () {
        this._super()
        this.lastMoveTime = new Date
        this.loadGameLayer()
        this.loadResetButton()
        this.loadScore()
        this.initGame()
        this.bindEvent()
    },
    loadResetButton: function () {
        var node = new ccui.Button()
        node.setTouchEnabled(true)
        node.setPosition(cc.winSize.width - 60, cc.winSize.height - 100)
        this.addChild(node)
        node.loadTextures('res/source/resetBtn_over.png', 'res/source/resetBtn_up.png', '')
        node.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                this.initGame()
            }
        }, this)
    },
    loadScore: function () {
        this.lbBest = new ccui.Text()
        this.lbBest.attr({
            x: cc.winSize.width - 60,
            y: cc.winSize.height - 50,
            textAlign: cc.TEXT_ALIGNMENT_CENTER,
            string: this.score,
            font: "26px AmericanTypewriter"
        })
        this.lbScore = new ccui.Text()
        this.lbScore.attr({
            x: cc.winSize.width - 160,
            y: cc.winSize.height - 50,
            textAlign: cc.TEXT_ALIGNMENT_CENTER,
            string: this.score,
            font: "26px AmericanTypewriter"
        })
        this.addChild(this.lbScore)
        this.addChild(this.lbBest)
    },
    upDataScore: function (value) {
        this.score += value
        if (this.score > this.best) {
            this.best = this.score
        }
        this.lbBest.string = this.best.toString()
        this.lbScore.string = this.score.toString()
    },
    initGame: function () {
        this.grid = new Grid()
        this.gameLayer.removeAllChildren()
        for (var i = 0; i < 2; i++) {
            this.addRandowTile()
        }
        this.score = 0
        this.upDataScore(0)
        if (this.gameOverSprite) {
            this.gameOverSprite.removeFromParent()
            this.gameOverSprite = null
        }
        this.gameStatus = 0
    },
    addRandowTile: function () {
        var arr = [2, 4]
        var tile = this.grid.findRandowEmptyCell()
        this.addTileSprite(arr[Math.floor(Math.random() * 2)], tile)
    },
    addTileSprite: function (value, tile, merged) {
        var newTile = new Tile(tile, value)
        this.grid.insertTile(newTile)
        var sprite = new TileSprite(value, tile)
        var position = Grid.positionPool[tile.x][tile.y]
        sprite.x = position.x
        sprite.y = position.y
        sprite.location.x = tile.x
        sprite.location.y = tile.y
        sprite.setAnchorPoint(0, 1)
        sprite.visible = false
        this.gameLayer.addChild(sprite)
        this.scheduleOnce(function () {
            sprite.visible = true
            sprite.playScale(merged)
        }, 0.1)
    },
    // 获取方向向量
    getVector: function (direction) {
        var map = {
            0: {x: 0, y: -1}, // Up
            1: {x: 1, y: 0},  // Right
            2: {x: 0, y: 1},  // Down
            3: {x: -1, y: 0}   // Left
        };
        return map[direction];
    },
    // 根据方向向量获取迭代方式,总是从目标方向结束位置往前迭代
    getTraversals: function (vector) {
        var traversals = {x: [], y: []};

        for (var pos = 0; pos < 4; pos++) {
            traversals.x.push(pos);
            traversals.y.push(pos);
        }
        if (vector.x === 1) traversals.x = traversals.x.reverse();
        if (vector.y === 1) traversals.y = traversals.y.reverse();

        return traversals;
    },
    /**
     * 根据方向查找当前tile将要到达的最终位置
     *
     * */
    findEndPosition: function (tile, vector) {
        var farthest = null
        var next = tile
        do {
            farthest = next
            next = {x: farthest.x + vector.x, y: farthest.y + vector.y}
        } while (this.grid.isInGrid(next) && this.grid.cellIsEmpty(next))
        return {
            farthest: farthest,
            next: next
        }
    },
    loadGameLayer: function () {
        this.gameLayer = new cc.Layer()
        this.addChild(this.gameLayer)
    },
    prepareTiles: function () {
        this.grid.eachCells(function (x, y, tile) {
            if (tile) {
                tile.mergedFrom = null;
                tile.savePosition();
            }
        });
    },
    move: function (direction) {
        if ((new Date - this.lastMoveTime < 150) || this.gameStatus == 1) {
            return
        }
        var vector = this.getVector(direction)
        var traversals = this.getTraversals(vector)
        var self = this
        var moved = false
        this.lastMoveTime = new Date
        this.prepareTiles()
        traversals.x.forEach(function (x) {
            traversals.y.forEach(function (y) {
                var cell = {x: x, y: y}
                var tile = self.grid.cellContent(cell)
                var position = self.findEndPosition(cell, vector)
                if (tile) {
                    var next = self.grid.cellContent(position.next)
                    if (next && next.value == tile.value && !next.mergedFrom) { // 可以合并
                        var merged = new Tile(position.next, tile.value * 2)
                        merged.mergedFrom = [tile, next]
                        self.grid.insertTile(merged)
                        self.grid.removeTile(tile)
                        self.mergeTileSprite(merged)
                        self.upDataScore(merged.value)
                        moved = true
                    } else {
                        self.moveTile(tile, position.farthest)
                    }
                    if (!(tile.x === cell.x && tile.y === cell.y)) {
                        moved = true
                    }
                }
            })
        })

        if (moved) {
            this.addRandowTile()
            if (!this.grid.HasEmptyCell()) {
                this.gameOver(false)
            }
        }
    },
    moveTile: function (tile, cell) {
        this.grid.cells[tile.x][tile.y] = null
        this.grid.cells[cell.x][cell.y] = tile
        tile.upDataPosition(cell)
        this.moveSprite(tile)
    },
    moveSprite: function (tile) {
        var tileFrom = this.getTileSprite(tile.previousPosition.x, tile.previousPosition.y)
        if (tileFrom) {
            tileFrom.location.x = tile.x
            tileFrom.location.y = tile.y
            var position = Grid.positionPool[tile.x][tile.y]
            tileFrom.playMove(position.x, position.y)
        }
    },
    mergeTileSprite: function (tile) {
        var self = this
        var tileFrom = this.getTileSprite(tile.mergedFrom[0].x, tile.mergedFrom[0].y)
        var tileTo = this.getTileSprite(tile.x, tile.y)
        tileFrom.playMove(tileTo.x, tileTo.y, function () {
            tileTo.removeFromParent()
            tileFrom.removeFromParent()
            self.addTileSprite(tile.value, tile, true)
            if (tile.value == 2048) {
                this.gameOver(true)
            }
        })
    },
    getTileSprite: function (x, y) {
        var selChild = null
        var children = this.gameLayer.getChildren()
        for (var i in children) {
            selChild = children[i]
            if (selChild.location.x == x && selChild.location.y == y) {
                return selChild
            }
        }
        return null
    },
    bindEvent: function () {
        var self = this,
            touchStartX, touchStartY;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var pos = touch.getLocation();
                touchStartX = pos.x;
                touchStartY = pos.y;
                return true;
            },
            onTouchMoved: function (touch, event) {

            },
            onTouchEnded: function (touch, event) {
                var pos = touch.getLocation(),
                    touchEndX = pos.x,
                    touchEndY = pos.y,
                    dx = touchEndX - touchStartX,
                    absDx = Math.abs(dx),
                    dy = touchEndY - touchStartY,
                    absDy = Math.abs(dy);

                if (Math.max(absDx, absDy) > 10) {
                    self.move(absDx > absDy ? (dx > 0 ? 1 : 3) : (dy > 0 ? 0 : 2));
                }
            }
        }, this);
    },
    gameOver: function (win) {
        var imgPath = ''
        if (win) {
            imgPath = 'res/source/result_success.png'
        } else {
            imgPath = 'res/source/result_failed.png'
        }
        this.gameOverSprite = new cc.Sprite(imgPath)
        this.gameOverSprite.setPosition(cc.winSize.width / 2, cc.winSize.height / 2)
        this.addChild(this.gameOverSprite)
        this.gameStatus = 1
    },
})