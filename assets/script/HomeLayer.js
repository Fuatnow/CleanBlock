var g_gameDataManager = require("g_gameDataManager");
cc.Class({
    extends: cc.Component,

    properties: {
        styles:cc.Node,
        gameTitle:cc.Sprite,
        titleSpriteFrameEn:cc.SpriteFrame,
    },

    // use this for initialization
    onLoad: function () {
        cc.game.addPersistRootNode(this.styles);
        this.styles.setLocalZOrder(-1);
        cc.director.setDisplayStats(true);
        let lang = cc.sys.language;
        if(lang == 'en')
        {
            this.gameTitle.spriteFrame = this.titleSpriteFrameEn;
        }
    },



    levelPageCallBack()
    {
        cc.director.loadScene('LevelPageScene');
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
