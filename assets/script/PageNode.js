var g_gameDataManager = require("g_gameDataManager");
cc.Class({
    extends: cc.Component,

    properties: {
        levelPageNodeTmp:
        {
            default:null,
            type:cc.Prefab
        },
        coverView:
        {
            default:null,
            type:require('CoverView')
        },

        unLockLabelTip:cc.Label,
        unlockNameLabel:cc.Label,
        starNumLabel:cc.Label,
    },

    // use this for initialization
    onLoad: function () {
        this.selCardIndex = 0;
        for(var i=0;i<4;i++)
        {
            var card = cc.instantiate(this.levelPageNodeTmp);
            card.tag = i;
            this.coverView.addCard(card);
            this.coverView.startMiddleIndex(this.selCardIndex);
            var eventHandler = new cc.Component.EventHandler();
            eventHandler.target = this.node;
            eventHandler.component = this.__proto__.__classname__ ;
            eventHandler.handler = 'levelPageCallBack';
            card.getComponent(cc.Button).clickEvents.push(eventHandler);
            card.getComponent(require('LevelPageNode')).setPageNum(i);
        }
        this.starNumLabel.string = g_gameDataManager.getTotalStar()+'/300';
        let lang = cc.sys.language;
        if(lang == 'en')
        {
            this.unlockNameLabel.node.position = cc.p(75,0);
        }
    },


    levelPageCallBack(event)
    {
        var tag = event.target.tag;
        if(tag == this.selCardIndex)
        {
           cc.log("levelPageCallBack");
           var isUnlock = g_gameDataManager.isPageUnLock(tag);
           if(isUnlock == true)
           {
               g_gameDataManager.setLevelPage(tag);
               cc.director.loadScene('LevelSelectScene');
               event.target.active = false;
           }
           else
           {
               this.unLockLabelTip.node.active = true;
               var animCtrl  = this.unLockLabelTip.node.getComponent(cc.Animation);
               animCtrl.play("unlockPage");
               this.unlockNameLabel.string = ''+g_gameDataManager.getPageUnlockNeedStar(tag);
           }
        }
    },

    selCradCallBack(cardNode)
    {
        this.selCardIndex = cardNode.tag;
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
