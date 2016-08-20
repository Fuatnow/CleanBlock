var g_gameDataManager = require("g_gameDataManager");
cc.Class({
    extends: cc.Component,

    properties: {
       btnArray:[cc.Node],
       itemNodes:cc.Node,
       btnPause:cc.Sprite,
       btnMusic:cc.Sprite,
       gameLayer:cc.Node,
       helpLayer:cc.Node,
       btn_helpClose:cc.Node,
       frameList: {
            default: [],
            type: cc.SpriteFrame
        },
    },

    // use this for initialization
    onLoad: function () {
        this.itemNodes.active = false;
        this.isShowItems = false;
        var curPos = this.btn_helpClose.position;
        this.btn_helpClose.position = cc.p(cc.winSize.width*0.48,curPos.y);
    },

    pauseCallBack(event)
    {
        var frameIndex = this.isShowItems ? 0 : 1;
        this.btnPause.spriteFrame = this.frameList[frameIndex];
        this.itemNodes.active = !this.isShowItems;
        if(this.itemNodes.active == true)
        {
            var startY = 594.0;
            var startScale = 0.0;
            var disY = -110;
            var childeren = this.itemNodes.children;
            for(var i=0 ; i<childeren.length;i++)
            {
                var node = childeren[i];
                var aimPos = cc.p(298,startY+(i+1)*disY);
                node.setScale(startScale);
                node.position = cc.p(298,startY);
                node.runAction(cc.ScaleTo(0.2,1.0));
                node.runAction(cc.MoveTo(0.2,aimPos));
             }
            
            var audioNode = cc.find("AudioControl");
            var isEnableMusic = audioNode.getComponent(require("AudioControl")).getAudioEnable();
            var musicIndex = (isEnableMusic ? 2 : 3);
            this.btnMusic.spriteFrame = this.frameList[musicIndex];
        }
        this.isShowItems = !this.isShowItems;
    },

    restartCallBack()
    {
        cc.log("restartCallBack");
        cc.director.loadScene('GameScene');
    },

    homeCallBack()
    {
        cc.log("homeCallBack");
        cc.director.loadScene('LevelSelectScene');
    },

    musicCallBack()
    {
         cc.log("musicCallBack");
         var audioCtrl = cc.find("AudioControl").getComponent(require("AudioControl"));
         var isEnableMusic = audioCtrl.getAudioEnable();
         audioCtrl.setAudioEnable(!isEnableMusic);

         isEnableMusic = !isEnableMusic;
         var musicIndex = (isEnableMusic ? 2 : 3);
         this.btnMusic.spriteFrame = this.frameList[musicIndex];
    },

    rateCallBack()
    {
        cc.log("rateCallBack");
        
    },

    helpCallBack()
    {
        this.helpLayer.active = true;
        this.gameLayer.active = false;
        this.node.active = false;
    },

    helpCloseCallBack()
    {
        cc.log("helpCloseCallBack");
        this.helpLayer.active = false;
        this.gameLayer.active = true;
        this.node.active = true;
    },

});
