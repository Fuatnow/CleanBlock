cc.Class({
    extends: cc.Component,

    properties: {
        blockArray:{
            default:[],
            type:require("Block")
        },
        rotateSp:{
            default:null,
            type:cc.Sprite
        },
        blockNodes:
        {
            default:null,
            type:cc.Node
        },
    },

    _selBoardCallBack:null,
    _putBoardCallBack : null,

    // use this for initialization
    onLoad: function () {
        this.initData();
        this.addListener();
        this.rotateSp.node.runAction(cc.repeatForever(cc.rotateBy(5,360)));
    },

    initData()
    {
        this._canRotateBoard = true;
        this._rotateStep = 0;
        this._blockPosArray = [
            [cc.p(0,48),cc.p(0,-48)],
            [cc.p(48,0),cc.p(-48,0)],
            [cc.p(0,-48),cc.p(0,48)],
            [cc.p(-48,0),cc.p(48,0)],
            ];
            this.gameBoard = cc.find("Canvas/GameLayer/GameBoard").getComponent(require("GameBoard"));
    },


    setCanRotateBoard(enable)
    {
        this._canRotateBoard = enable;
        this.rotateSp.node.active = enable;
        this.rotateSp.setVisible(enable);
    },

    addListener()
    {
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            this._canRespondseEvent = this.rotateSp.node.active ;
            if(this._canRespondseEvent == false) return;
            this._hasMove = false;
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            if(this._canRespondseEvent == false) return;
            if(this._hasMove == false)
            {
                var beganPos = event.touch.getStartLocation();
                var curPos = event.touch.getLocation ();
                var dis = cc.pDistance(beganPos, curPos);
                if(dis > 7)
                {
                    this._hasMove = true;
                    this.rotateSp.setVisible(false);
                    if(this._selBoardCallBack)
                    {
                        this._selBoardCallBack(this);
                    }
                }
            }
            else
            {
                var delta = event.touch.getDelta();
                this.blockNodes.x += delta.x;
                this.blockNodes.y += delta.y;
            }
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            if(this._canRespondseEvent == false) return;

            if(this._hasMove == false)
            {
                this.rotateBlockes();
            }
            else if(this._putBoardCallBack)
            {
                this._putBoardCallBack(this);
            }
            // this.rotateSp.active = true;
            this.blockNodes.position = cc.p(0,0);
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_CANCEL,function(event)
        {
            if(this._canRespondseEvent == false) return;

            if(this._putBoardCallBack)
            {
                this._putBoardCallBack(this);
            }
            // this.rotateSp.active = true;
            this.blockNodes.position = cc.p(0,0);
        },this);
    },

    rotateBlockes()
    {
        this._rotateStep++;
        this._rotateStep = (this._rotateStep == 4 ? 0 : this._rotateStep);
        this.blockArray[0].node.setPosition(this._blockPosArray[this._rotateStep][0]);
        this.blockArray[1].node.setPosition(this._blockPosArray[this._rotateStep][1]);
    },


    activeRotateBlock(enable)
    {
        if(this._canRotateBoard)
        {
            this.rotateSp.node.active = enable;
            this.rotateSp.setVisible(enable);
        } 
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {
    //     cc.log("active:"+this.rotateSp.node.active);
    //     this.activeRotateBlock(true);
    // },
});
