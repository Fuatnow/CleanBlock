cc.Class({
    extends: cc.Component,

    properties: ()=>({
      rotateBlockArray:{
          default:[],
          type:require("RotateBlock")
      },
      blockPrefab:{
          default:null,
          type:cc.Prefab
      },
      gameBoard:{
          default:null,
          type:require("GameBoard"),
      },
    }),

    _selBorad:null,

    // use this for initialization
    onLoad: function () {
        this._canRotateNum = 1;
    },

    initNextBlocks(numArray,canRotateNum)
    {
        this._canRotateNum = canRotateNum;
        for(var i=0;i<3;i++)
        {
            var startPosx = -232;
            for(var i=0;i<3;i++)
            {
                var rotateBlock = cc.instantiate(this.blockPrefab);
                rotateBlock.parent = this.node;
                rotateBlock.tag = i;
                rotateBlock.position = cc.p(startPosx*(1-i),0);
                var rotateBlockComp = rotateBlock.getComponent(require("RotateBlock"));
                rotateBlockComp._putBoardCallBack = this.putBoard.bind(this);
                rotateBlockComp._selBoardCallBack = this.selBoard.bind(this);
                rotateBlockComp.blockArray[0].setAttribute(-1,-1,numArray[i*2]);
                rotateBlockComp.blockArray[1].setAttribute(-1,-1,numArray[i*2+1]);
                rotateBlockComp.setCanRotateBoard(i+1<=canRotateNum);
                this.rotateBlockArray[i] = rotateBlockComp;
            }
        }
    },

    selBoard(rotateBoard)
    {
        cc.log("selBoard");
        this._selBorad = rotateBoard;
        this.activeRotateBoards(false);
    },

    putBoard(rotateBoard)
    {
        var placeSuc = this.gameBoard.placeBoard(rotateBoard);
        if(placeSuc == false)
        {
            cc.log("can not place");
            this.activeRotateBoards(true);

            var audioNode = cc.find("AudioControl");
            audioNode.getComponent(require("AudioControl")).playEffect("reset");
        } 
        else
        {
            cc.log("place ok");
            // this.rotateBlockArray[rotateBoard.node.tag] = null;
            this.rotateBlockArray.splice(rotateBoard.node.tag,1);
            rotateBoard.node.runAction(cc.removeSelf());
            this.activeRotateBoards(false);
        }
    },

    activeRotateBoards(enable)
    {
        cc.log("activeRotateBoards"+this.rotateBlockArray.length);
        for(var i=0;i<this.rotateBlockArray.length;i++)
        {
            var rotateBoard = this.rotateBlockArray[i];
            if(i+1<=this._canRotateNum)
            {
                rotateBoard.setCanRotateBoard(true);
            }
            rotateBoard.activeRotateBlock(enable);
            rotateBoard.node.tag = i;
        }
    },
});
