var g_gameDataManager = require("g_gameDataManager");
cc.Class({
    extends: cc.Component,

    properties: {
       pageNum:
       {
           default:1,
           type:cc.Integer
       },
       frameList: {
            default: [],
            type: cc.SpriteFrame
        },
        starLabel:cc.Label,
        unlockSp : cc.Node,
        iconSp:cc.Sprite
    },

    // use this for initialization
    onLoad: function () {

    },

    setPageNum(pageIndex)
    {
        this.iconSp.spriteFrame = this.frameList[pageIndex];
        var pageStar = g_gameDataManager.getPageStar(pageIndex);
        this.starLabel.string = pageStar+" /75";
        var isUnlock = g_gameDataManager.isPageUnLock(pageIndex);
        this.unlockSp.active = !isUnlock;
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
