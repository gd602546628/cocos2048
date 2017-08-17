/**
 * Created by gd on 2017/8/9/009.
 */
var BackgroundLayer = cc.LayerColor.extend({
    header: null,
    gameBody: null,
    ctor: function () {
        this._super(cc.color(250, 248, 239))
        this.loadHeader()
        this.loadGameBody()
        this.loadGamePlay()
    },
    loadHeader: function () {
        var header = new cc.Sprite('res/source/menu.png')
        this.header = header
        this.addChild(this.header)
        header.setAnchorPoint(0.5, 1)
        header.setPosition(cc.winSize.width / 2, cc.winSize.height)
        cc.log(this.header)
    },
    loadGameBody: function () {
        var body = new cc.Scale9Sprite('res/source/background.png')
        this.gameBody = body
        this.addChild(body)
        body.setContentSize(cc.winSize.width - 20, cc.winSize.width - 20)
        body.setAnchorPoint(0.5, 1)
        //  body.setPosition(cc.winSize.width / 2, this.header.y - 140) // pc
        body.setPosition(cc.winSize.width / 2, this.header.y - 200)
    },
    loadGamePlay: function () {
        var size = 4 // 每行个数
        var dis = 20 // 间距
        var width = ( cc.winSize.width - 20 - 5 * dis) / size
        var gridX = 8 + dis
        // var gridY = this.header.y - 140 - dis // pc
        var gridY = this.header.y - 200 - dis
        for (var x = 0; x < size; x++) {
            for (var y = 0; y < size; y++) {
                var grid = new cc.Sprite('res/source/backtile.png')
                var posX = gridX + x * ( width + dis)
                var posY = gridY - y * ( width + dis)
                this.addChild(grid)
                grid.setAnchorPoint(0, 1)
                grid.setPosition(posX, posY)
                grid.setContentSize(( cc.winSize.width - 20 - 5 * dis) / size, ( cc.winSize.width - 20 - 5 * dis) / size)
                Grid.positionPool[x][y] = {
                    x: posX,
                    y: posY
                }
            }
        }
    }
})