var g_gameDataManager = require("g_gameDataManager");
cc.Class({
    extends: cc.Component,

    properties: {
         touchBoard:{
          default:null,
          type:require("TouchBoard")
        },

        blockTemp: {
            default: null,
            type: cc.Prefab
        },

        blockBoard:{
            default:null,
            type:cc.Sprite
        },

        overLayer:
        {
            default:null,
            type:require("OverLayer")
        },

        itemLayerNode:
        {
            default:null,
            type:cc.Node
        },
    },

    // use this for initialization
    onLoad: function () 
    {
        console.log("onLoad");
        this.initData();
        this.initView();
        this.initListener();
    },

    initData:function()
    {
        this.blockArray = [];
        this.fallBlockArray = [];
        this.isBlockMoving = false;
        this._popingBlock = false;
    },

    initView()
    {
        this.offsetX = -240.0;
        this.offsetY = -395.0;
        this.disSpace = 96;
        var curLevel = g_gameDataManager.getLevel();
        var dataArray = g_gameDataManager.blockArrays[curLevel];
        var numArray = g_gameDataManager.numArrays[curLevel];
        var levelpage = g_gameDataManager.getLevelPage();
        //打乱numArray增加难度
        if(levelpage >= 1)
        {
            if(Math.random() > 0.5)
            {
                this.swapNumArray(numArray,0,1);
            }
            if(levelpage >= 2)
            {
                if(Math.random() > 0.5)
                {
                    this.swapNumArray(numArray,0,2);
                }
                
                if(Math.random() > 0.5)
                {
                    this.swapNumArray(numArray,1,2);
                }
            }
        }
        // g_gameDataManager.numArra
        if(dataArray == undefined)
        {
            // this.loadLevelJson();
            return;
        }
        for(var i=0;i<8;i++)
        {
            this.blockArray[i] = [];
            for(var j=0;j<6;j++)
            {
                var blockComp = null;
                var num = dataArray[i][j]
                if(num !=0 )
                {
                    var block = cc.instantiate(this.blockTemp);
                    block.parent = this.node.getChildByName("BlockBoard");
                    block.setPosition(cc.p(this.offsetX+j*this.disSpace,this.offsetY+i*this.disSpace));  
                    var Block = require("Block");
                    blockComp = block.getComponent(Block);
                    blockComp.setAttribute(i,j,num);
                }
                this.blockArray[i][j] = blockComp;
            }
        }
        for(i=8;i<10;i++)
        {
            this.blockArray[i] = [];
            for(var j=0;j<6;j++)
            {
                this.blockArray[i][j] = null;
            }
        }
        this.touchBoard.initNextBlocks(numArray,levelpage+1);
    },


    swapNumArray(numArray,left,right)
    {
        var temp1 = numArray[2*left];
        var temp2 = numArray[2*left+1];
        numArray[2*left]= numArray[2*right];
        numArray[2*left+1]= numArray[2*right+1];
        numArray[2*right] = temp1;
        numArray[2*right+1] = temp2;
    },
    
    initListener()
    {
        this.blockBoard.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            var beganPos = event.touch.getStartLocation();
            var curPos = event.touch.getLocation ();
            var disY = beganPos.y - curPos.y;
            if (disY> 0.01 * cc.winSize.height) 
            {
                this.fallBlocksFast();
            }
        }, this);
        this.blockBoard.node.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            var beganPos = event.touch.getStartLocation();
            var curPos = event.touch.getLocation ();
            var disY = beganPos.y - curPos.y;
            if (disY> 0.01 * cc.winSize.height) 
            {
                this.fallBlocksFast();
            }
        }, this);
    },

    placeBoard(rotateBoard)
    {
        var block0 = rotateBoard.blockArray[0];
        var block1 = rotateBoard.blockArray[1];
        var gBSize  = this.blockBoard.node.getContentSize();
        var bSize = block0.node.getContentSize();
        var rBoardWordPos = rotateBoard.blockNodes.convertToWorldSpaceAR(cc.p(0,0));
        var inBoardPos = this.blockBoard.node.convertToNodeSpace(rBoardWordPos);
        console.log(inBoardPos.toString());
        if(inBoardPos.x<0 || inBoardPos.y<0 || inBoardPos.x > gBSize.width || inBoardPos.y > gBSize.height+bSize.height*0.5)
        {
            return false;
        }

        this.fallBlockArray = [block0,block1];
        if (block0.node.y > block1.node.y) 
        {
            this.fallBlockArray = [block1,block0];
        }
        for(var i=0;i<this.fallBlockArray.length;i++)
        {
            var block = this.fallBlockArray[i];
            var pos = this.getInNodePos(block);
            var cood = this.getRowColByPos(pos);
            var canPlaceCood = this.canPlaceBlock(cood);
            if(canPlaceCood == false)
            {
                this.fallBlockArray = [];
                return false;
            }
        }

        for(var i=0;i<this.fallBlockArray.length;i++)
        {
            var block = this.fallBlockArray[i];
            var pos = this.getInNodePos(block);
            var cood = this.getRowColByPos(pos);
            block.node.removeFromParent();
            block.node.parent = this.blockBoard.node;
            block.node.position = this.getPosByRowCol(cood);
            block.setAttribute(cood.x,cood.y,block._num);
        }     
        this._dropingBlock = true;
        this.schedule(this.fallblocks,1,1000,0.3,false);
        // this.schedule(this.fallblocks, this,1,  -1,0.3,false);
        return true;
    },


    fallblocks(t)
    {
        if(this._popingBlock == true)
        {
            return;
        }
        
        this.moveBlocks();
        console.log("moveBlocks");
        if(this.getHaveBlockToFall() == false)
        {
            console.log("getHaveBlockToFall");
            this.unschedule(this.fallblocks);
            this.scheduleOnce(function(){
                this.moveBlocks();
                this.startPopBlocks();
            }.bind(this),0.3);
        }
    },


    fallBlocksFast()
    {
        if(this._popingBlock == true)
        {
            return;
        }

        var fallBlockLen = this.fallBlockArray.length;
        if(fallBlockLen > 0)
        {
            for(var i=0;i<this.fallBlockArray.length;i++)
            {
                var block = this.fallBlockArray[i];
                this.blockArray[block._row][block._col] = block;
            }
            this.updateBlockArray(0);
            this.unschedule(this.fallblocks);
            this.scheduleOnce(function(){
                this.startPopBlocks();
            }.bind(this),0.3);
        }
    },

    moveBlocks()
    {
        for(var i=0;i<this.fallBlockArray.length;i++)
        {
            var block = this.fallBlockArray[i];
            var aimBlockRow = block._row-1;
            if(aimBlockRow<0 || this.blockArray[aimBlockRow][block._col] != null) 
            {
                this.blockArray[block._row][block._col] = block;
                continue;
            }
            block.node.y -= this.disSpace;
            block._row = aimBlockRow;
        }
    },

    startPopBlocks()
    {
        this._dropingBlock = false;
        this.fallBlockArray = [];
        if(this._popingBlock == false)
        {
             this._popingBlock = true;
             this.popBlocks();
        }
    },

    getHaveBlockToFall()
    {
        var haveBlocktoFall = false;
        for(var i=0;i<this.fallBlockArray.length;i++)
        {
            var block = this.fallBlockArray[i];
            var aimBlockRow = block._row-1;
            if(aimBlockRow<0 || this.blockArray[aimBlockRow][block._col] != null) 
            {
                continue;
            }

            if(i == 1)
            {
                var preBlock = this.fallBlockArray[0];
                if(block._col == preBlock._col && aimBlockRow == preBlock._row)
                {
                    continue;
                }
            }

            haveBlocktoFall = true;
            break;
        }
        return haveBlocktoFall;
    },

    popBlocks()
    {
        for(var i=0;i<10;i++)
        {
            for(var j=0;j<6;j++)
            {
                var chainArray = this.getChain(this.blockArray[i][j]);
                if(chainArray.length >= 4)
                {
                    this.popChain(chainArray);
                    return;
                }
            }
        }
        this._popingBlock = false;
        this.touchBoard.activeRotateBoards(true);
        if(this.touchBoard.rotateBlockArray.length == 0)
        {
            this.scheduleOnce(function()
            {
                this.node.active = false;
                this.itemLayerNode.active = false; 
                this.overLayer.node.active = true;
                var remainNum = this.getRemainBlockNum();
                var gainStar = 0;
                if(remainNum == 0)
                {
                    gainStar = 3;
                } 
                else if(remainNum < 2)
                {
                    gainStar = 2;
                } 
                else if(remainNum < 4)
                {
                    gainStar = 1;
                } 
                this.overLayer.setStarNum(gainStar);
            
            }.bind(this),0.3);
        }
    },

    getRemainBlockNum()
    {
        var remainNum = 0;
        for(var i=0;i<10;i++)
        {
            for(var j=0;j<6;j++)
            {
                if(this.blockArray[i][j] != null)
                {
                    remainNum+=1;
                }
            }
        }
        return remainNum;
    },


    popChain(chainArray)
    {
        for(var i=0;i<chainArray.length;i++)
        {
            var block = chainArray[i];
            this.blockArray[block._row][block._col] = null;
            block.node.removeFromParent();
            //播放粒子特效 to do
            var audioNode = cc.find("AudioControl");
            audioNode.getComponent(require("AudioControl")).playEffect("merge");
        }

        var runTime = this.updateBlockArray(0.2)+0.2;
        this.scheduleOnce(function(){
            this.popBlocks();
        },runTime);
    },

    updateBlockArray(moveUnitTime)
    {
        var moveMaxTime = 0;
        for(var j=0;j<6;j++)
        {
            for(var i=0;i<10;i++)
            {
                var block = this.blockArray[i][j];
                if(block != null)
                {
                    var aimRow= this.getFirstRow_isNull_inOneCol(j);
                    if (aimRow >=0 && i > aimRow) 
                    {
                        var aimPos = this.getPosByRowCol({x:aimRow,y:j});
                        block.setAttribute(aimRow,j,block._num);
                        if(moveUnitTime>0.001)
                        {
                            var moveTime = (i - aimRow)*moveUnitTime;
                            moveMaxTime = Math.max(moveTime,moveMaxTime);
                            block.node.runAction(cc.moveTo(moveTime,aimPos));
                        }
                        else
                        {
                            block.node.position = aimPos;   
                        }
                        this.blockArray[aimRow][j] = block;
                        this.blockArray[i][j] = null;
                    }
                }
            }
        }
        return moveMaxTime;
    },

    getFirstRow_isNull_inOneCol(col)
    {
        for(var i=0;i<10;i++)
        {
            if(this.blockArray[i][col] == null)
            {
                return i;
            }
        }
        return -1;
    },


    isBlocksMoving()
    {
        return this._popingBlock || this._dropingBlock;
    },

    getChain(block)
    {
        var queue = [];
        if(block == null) return queue;
        var blockVis = [];
        var  sDir = [[0,-1],[-1,0],[0,1],[1,0]];
        for(var i=0;i<10;i++)
        {
            blockVis[i] = [];
            for(var j=0;j<6;j++)
            {
                blockVis[i][j] = false;
            }
        }

        var index = 0;
        queue[queue.length] = block;
        blockVis[block._row][block._col] = true;
        while (index < queue.length)
        {
            var block = queue[index++];
            for(var i=0;i<sDir.length;i++)
            {
                var nRow = block._row + sDir[i][0];
                var nCol = block._col + sDir[i][1];
                if(this.isOutBoard(nRow,nCol)  == false && blockVis[nRow][nCol] == false)
                {
                    var nextBlock = this.blockArray[nRow][nCol];
                    blockVis[nRow][nCol] = true;
                    if(nextBlock != null && nextBlock._num == block._num)
                    {
                        queue[queue.length] = nextBlock;
                    }
                }
            }
        }
        return queue;
    },

    isOutBoard(row ,col)
	{
		return row < 0 || row >= 10 || col < 0 || col >= 6;
	},

    getInNodePos(block)
    {
        var worldPos = block.node.convertToWorldSpaceAR(cc.p(0,0));
        return this.blockBoard.node.convertToNodeSpace(worldPos);
    },

    getRowColByPos(pos)
    {
        var col_f = pos.x / this.disSpace;
        var row_f = pos.y / this.disSpace;
        var col = parseInt(col_f < 0 ? -1 : col_f);
        var row = parseInt(row_f <0 ? -1 : row_f);
        return { x: row, y: col };
    },

    getPosByRowCol(cood)
    {
        var pos = cc.p(this.offsetX+cood.y*this.disSpace,this.offsetY+cood.x*this.disSpace);
        return pos;
    },

    getAimRowCol(cood)
    {
        for(var i=0;i<cood.x;i++)
        {
            if(this.blockArray[i][cood.y] !=null && this.blockArray[i+1][cood.y] !=null)
            {
                return {x:i+1,y:cood.y};
            }
        }
        return {x:0,y:0};
    },

    canPlaceBlock(cood)
    {
        return  (this.isOutBoard(cood.x,cood.y) == false) && (this.blockArray[cood.x][cood.y] == null);
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
