var g_gameDataManager = require("g_gameDataManager");
cc.Class({
    extends: cc.Component,

    properties: {
       levelLabel:cc.Label,
       starArray:
       {
          default: [],
          type:cc.Sprite,
       },
        starframeList: {
            default: [],
            type: cc.SpriteFrame
        },
        blockTemp: {
            default: null,
            type: cc.Prefab
        },
        blockBoard:cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        this._level = 0;
    },


    initData(level,dataArray,numArray)
    {
        this._level = level;
        this.levelLabel.string = this._level+1;
        // this._dataArray = dataArray;
        // this._numArray = numArray;

        // this.offsetX = -50.0;
        // this.offsetY = -80.0;
        // this.disSpaceX = 20;
        // this.disSpaceY = 21;

        // for(var i=0;i<8;i++)
        // {
        //     for(var j=0;j<6;j++)
        //     {
        //         var num = dataArray[i][j];
        //         var block = cc.instantiate(this.blockTemp);
        //         block.parent = this.blockBoard;
        //         block.setPosition(cc.p(this.offsetX+j*this.disSpaceX,this.offsetY+i*this.disSpaceY));  
        //         var Block = require("SmallBlock");
        //         var blockComp = block.getComponent(Block);
        //         blockComp.setSpriteFrameNum(num);
        //     }
        // }

        var starNum = g_gameDataManager.getLevelStarNum(level);
        for(var i=0;i<3;i++)
        {
            this.starArray[i].getComponent(cc.Sprite).spriteFrame = this.starframeList[i<starNum ? 0 : 1];
        }
    },



    clickCallBack()
    {
        cc.log(this._level);
        g_gameDataManager.setLevel(this._level);
        // //打乱numArray增加难度
        // var levelpage = g_gameDataManager.getLevelPage();
        // if(levelpage >= 2)
        // {
        //     if(Math.random() > 0.5)
        //     {
        //         this.swapNumArray(0,1);
        //     }
        //     if(levelpage >= 3)
        //     {
        //         if(Math.random() > 0.5)
        //         {
        //             this.swapNumArray(0,2);
        //         }
                
        //         if(Math.random() > 0.5)
        //         {
        //             this.swapNumArray(1,2);
        //         }
        //     }
        // }
        // g_gameDataManager.numArray = this._numArray;
        // g_gameDataManager.dataArray = this._dataArray;
        cc.director.loadScene('GameScene')
    },


    swapNumArray(left,right)
    {
        var temp1 = this._numArray[2*left];
        var temp2 = this._numArray[2*left+1];
        this._numArray[2*left]= this._numArray[2*right];
        this._numArray[2*left+1]= this._numArray[2*right+1];
        this._numArray[2*right] = temp1;
        this._numArray[2*right+1] = temp2;
    },
    

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
