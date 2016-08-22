var g_gameDataManager = require("g_gameDataManager");

cc.Class({
    extends: cc.Component,

    properties: {
        overLabel:cc.Label,
        startLabel:cc.Label,
        btn_next:cc.Node,
        btn_info:cc.Node,
        unLockLabelTip:cc.Node,
        unlockNameLabel:require('LabelLocalized')
    },

    // use this for initialization
    onLoad: function () {

        let lang = cc.sys.language;
        if(lang == 'en')
        {
            this.unLockLabelTip.position = cc.p(-123,-520);
            this.unlockNameLabel.node.position = cc.p(334,0);
        }
    },

    setStarNum(starNum)
    {
        if(starNum < 1)
        {
            this.overLabel.textKey = "Failure";
            // this.btn_restart.position = this.btn_next.position;
            this.btn_next.active = false; 
            this.btn_info.active = true;
        }
        else
        {
            var curLavel = g_gameDataManager.getLevel();
            var preLevelStar = g_gameDataManager.getLevelStarNum(curLavel);
            var disStar = starNum - preLevelStar;
            if(disStar > 0)
            {
                 var curPage = g_gameDataManager.getLevelPage();
                 var prePageStar = g_gameDataManager.getPageStar(curPage);
                 var totalStar = prePageStar+disStar;
                 g_gameDataManager.setLevelStarNum(curLavel,starNum);
                 g_gameDataManager.setPageStar(curPage,totalStar);
                for(var i=0;i<4;i++)
                {
                     var isUnlock = g_gameDataManager.isPageUnLock(i);
                     if(isUnlock == false)
                     {
                         var canUnlockPage = g_gameDataManager.canPageUnlock(i);
                         if(canUnlockPage == true)
                         {
                             console.log(i+"-----");
                             g_gameDataManager.setPageUnlock(i,true);
                             this.showUnLockTip(i);
                             break;
                         }
                     }
                }
            }
        }
        this.startLabel.string = "x"+starNum;
    },

    restartCallBack()
    {
        console.log("restartCallBack");
        cc.director.loadScene('GameScene');
    },

    homeCallBack()
    {
        console.log("homeCallBack");
        cc.director.loadScene('LevelSelectScene');
    },

    nextCallBack()
    {
        console.log("nextCallBack");
        var curLevel = g_gameDataManager.getLevel();
        if((curLevel+1)%25 == 0)
        {
            cc.director.loadScene('LevelPageScene');
        }
        else
        {
            g_gameDataManager.setLevel(curLevel+1);
            cc.director.loadScene('GameScene')
        }
    },

    infoCallBack()
    {
        console.log("infoCallBack");
    },

    showUnLockTip(pageIndex)
    {
        this.unLockLabelTip.active = true;
        this.unlockNameLabel.textKey = "PuKe_LvName_"+pageIndex;
    },
});
