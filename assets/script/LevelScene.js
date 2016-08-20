var g_gameDataManager = require("g_gameDataManager");
var Base64 = require("Base64");
cc.Class({
    extends: cc.Component,

    properties: {
        levelNodePf: {
            default: null,
            type: cc.Prefab
         },

         starNumLabel:cc.Label,
         levelBg:cc.Sprite,
    },

    // use this for initialization
    onLoad: function () {
        this.loadLevelJson();
        var curPage = g_gameDataManager.getLevelPage();
        this.starNumLabel.string = g_gameDataManager.getPageStar(curPage)+'/100';
        cc.loader.loadRes('img/pageBg'+curPage, cc.SpriteFrame, function (err, spriteFrame) {
            if (err) {
                cc.error(err.message || err);
                return;
            }
            // cc.log('Result should be a sprite frame: ' + (spriteFrame instanceof cc.SpriteFrame));
            this.levelBg.spriteFrame = spriteFrame;
        }.bind(this));
    },


    loadLevelJson: function () 
    {
        var loadCallBack = this._loadCallBack.bind(this);
        // start_time = get_time();
        cc.loader.loadRes("data/levelpage"+(g_gameDataManager.getLevelPage()+1), loadCallBack);
    },

     _loadCallBack: function (err, res)
     {
        // log("---->"+ (get_time()-start_time));
        if (err) 
        {
            cc.log('Error url [' + err + ']');
            return;
        } 

        // var test = "\"level1\":[ ";
        // var encodeStr = Base64.encode(test);
        // var decodeStr = Base64.decode(encodeStr);

        res = Base64.decode(res);
        
        // res = g_gameDataManager.jsonRes
        g_gameDataManager.blockArrays = [];
        g_gameDataManager.numArrays = [];
        var startLevel = g_gameDataManager.getLevelPage()*25;
        var jsonArray = JSON.parse(res);
        this.offsetX = -284.0;
        this.offsetY = 450.0;
        this.disSpaceX = 142;
        this.disSpaceY = 210;
        for(var r = 0; r < 5;r++)
        {
            for(var c = 0; c<5;c++)
            {
                var levelNum = startLevel + r*5+c;
                var levelNode = cc.instantiate(this.levelNodePf);
                levelNode.parent = this.node;
                var pos = cc.p(this.offsetX+c*this.disSpaceX,this.offsetY-r*this.disSpaceY);
                levelNode.setPosition(pos);  
                var lveleNodeClass = require("LevelNode");
                var levelNodeComp = levelNode.getComponent(lveleNodeClass);

                var levelArray = jsonArray["level"+(levelNum+1)];
                var blockArray = [];
                for(var i=0;i<8;i++)
                {
                    var dataArray = levelArray[i].split(",");
                    blockArray[i] = [];
                    for(var j=0;j<6;j++)
                    {
                        var num = parseInt(dataArray[j]);
                        blockArray[i][j] = num;
                    }
                }

                var numArray = levelArray[8].split(",");
                for(var j=0;j<6;j++) numArray[j] = parseInt(numArray[j]);
                levelNodeComp.initData(levelNum,blockArray,numArray);
                g_gameDataManager.blockArrays[levelNum] = blockArray;
                g_gameDataManager.numArrays[levelNum] = numArray;
            }
        }
        // var numArray = jsonArray[8].split(",");
        // for(var j=0;j<6;j++) numArray[j] = parseInt(numArray[j]);
        // this.touchBoard.initNextBlocks(numArray,1);
    },

    backCallBack:function()
    {
        // this.node.setPosition(cc.p(360,640));
        // var render = new cc.RenderTexture(720, 1280);
        // render.begin();
        // this.node._sgNode.visit();
        // render.end();
        // render.saveToFile(g_gameDataManager.getLevelPage()+".png", cc.IMAGE_FORMAT_PNG);
        cc.director.loadScene('LevelPageScene');
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
