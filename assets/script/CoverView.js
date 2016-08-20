cc.Class({
    extends: cc.Component,

    properties: {
        horizontal:
        {
            default:true,
        },
        distance:
        {
            default:0.0,
            type: cc.Float,
        },
        disscale:
        {
            default:0.0,
            type: cc.Float,
        },
        content:cc.Node,
        _cardArray:[cc.Node],
        _offsetPosition:cc.p(0,0),
        selCallBacks:{
            default:[],
            type:cc.Component.EventHandler
        }
    },

    // use this for initialization
    onLoad: function () {
        this.initData();
        this.initListener();
    },

    initData()
    {

    },

    initListener()
    {
        this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchBegan, this, true);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMoved, this, true);
        this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this, true);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancelled, this, true);
    },


    // touch event handler
    _onTouchBegan: function(event) {
        var touch = event.touch;
        if (this.content) 
        {
            this.content.stopAllActions();
            for(var i=0;i<this._cardArray.length;i++)
            {
                this._cardArray[i].stopAllActions();
            }
            this._handlePressLogic(touch);
        }
        this._touchMoved = false;
    },

    _onTouchMoved: function(event) {

        var touch = event.touch;
        if (this.content) {
            this._handleMoveLogic(touch);
        }
        var deltaMove = cc.pSub(touch.getStartLocation(),touch.getLocation());
        //FIXME: touch move delta should be calculated by DPI.
        if (cc.pLength(deltaMove) > 7) {
            this._touchMoved = true;
            var buttonComponent = event.target.getComponent(cc.Button);
            if (buttonComponent) {
                buttonComponent._onTouchCancel();
            }
        }
        // TODO: detect move distance, if distance greater than a seuil, then stop propagation.
        event.stopPropagation();
    },

    _onTouchEnded: function(event) {

        var touch = event.touch;
        if (this.content) {
            this._handleReleaseLogic(touch);
        }
        if (this._touchMoved) {
            event.stopPropagation();
        }
    },
    _onTouchCancelled: function(event) {

        var touch = event.touch;
        if(this.content){
            this._handleReleaseLogic(touch);
        }
    },

    _handlePressLogic: function() {

    },

    _handleMoveLogic: function(touch) {
        var deltaMove = touch.getDelta();
        this._processDeltaMove(deltaMove);
    },

    _processDeltaMove: function(deltaMove) {
        this._scrollChildren(deltaMove);
    },

    _handleReleaseLogic: function(touch) {
        var deltaMove = touch.getDelta();
        this._endMoveScaleCards(deltaMove);
    },

    _scrollChildren: function(deltaMove) 
    {
        if(this.horizontal == true)
        {
            deltaMove.y = 0;
        }
        else
        {
            deltaMove.x = 0;
        }
        this._moveContent(deltaMove);
        this._scaleCards(deltaMove);
    },

    _moveContent: function(deltaMove) 
    {
        var newPosition = cc.pAdd(this.content.getPosition(), deltaMove);
        this.content.setPosition(newPosition);
    },

    _scaleCards:function(deltaMove)
    {
      var offset = this.content.getPosition();
      var viewWordPos = this.content.parent.convertToWorldSpaceAR(cc.p(0,0));
        for (var i = 0; i < this._cardArray.length; i++) {
            var card = this._cardArray[i];
            var cardWordPos = card.convertToWorldSpaceAR(cc.p(0,0));
            var disMid = 0;
            if(this.horizontal)
            {
               disMid = Math.abs(cardWordPos.x - viewWordPos.x);
            }
            else
            {
                disMid = Math.abs(cardWordPos.y - viewWordPos.y);
            }
            var toScale = 1 - disMid / this.distance * this.disscale;
            var zOr = 1000 - disMid * 0.1;
            card.setScale(toScale);
            card.setLocalZOrder(zOr);
        }
    },

    _endMoveScaleCards:function(deltaMove)
    {
        var minLen = Number.MAX_VALUE;
        var midPos = this.content.parent.convertToWorldSpaceAR(cc.p(0,0));
        var midCard = null;
        for (var i = 0; i < this._cardArray.length; i++)
        {
            var card = this._cardArray[i];
            var cardWordPos = card.convertToWorldSpaceAR(cc.p(0,0));
            var disMid = (this.horizontal ? midPos.x - cardWordPos.x : midPos.y - cardWordPos.y);
            if(Math.abs(disMid)<Math.abs(minLen))
            {
                minLen = disMid;
                midCard = card;
            } 
        }

        for (var i = 0; i < this._cardArray.length; i++)
        {
            var card = this._cardArray[i];
            var cardWordPos = card.convertToWorldSpaceAR(cc.p(0,0));
            var disMid = (this.horizontal ? midPos.x - cardWordPos.x : midPos.y - cardWordPos.y);
            var toScale = 1 - Math.abs(disMid - minLen)/ this.distance * this.disscale;
            card.runAction(cc.ScaleTo(0.2,toScale));
            var zOr = 1000 - disMid*0.1;
            card.setLocalZOrder(zOr);
        }
        var moveByPos = (this.horizontal?cc.p(minLen,0) : cc.p(0,minLen));
        var seq = cc.Sequence(cc.MoveBy(0.2, moveByPos),cc.CallFunc(function(){
            // cc.log("moveEnd");
            if (this.selCallBacks != null)  
            {  
                cc.Component.EventHandler.emitEvents(this.selCallBacks, midCard);
            }  
        }.bind(this),midCard));
        this.content.runAction(seq);  
    },

    addCard(card)  
    {  
        var cardNum  = this._cardArray.length;
        var zOrder = 1000 - cardNum; 
        var positionX = this._offsetPosition.x;
        var positionY = this._offsetPosition.y;
        if(this.horizontal)  
        {  
            positionX += this.distance*cardNum;  
        }  
        else  
        {  
            positionY += this.distance*cardNum;
        }  
        var scale = 1 - this.disscale*cardNum; 
        card.position = cc.p(positionX, positionY);
        card.setScale(scale);  
        this._cardArray[cardNum] = card;
        card.parent = this.content;
    },

   startMiddleIndex: function startMiddleIndex(index) {
        var cardsCount = this._cardArray.length;
        if (index < 0 || index > cardsCount - 1) return;
        var newoffsetPosition = cc.pAdd(this._offsetPosition,cc.p(0, -this.distance * index));
        if (this.horizontal) {
            newoffsetPosition = cc.pAdd(this._offsetPosition,cc.p(-this.distance * index, 0));
        }
        this._setOffsetPosition(newoffsetPosition);
    },

    _setOffsetPosition: function _setOffsetPosition(pos) {
        this.offsetPosition = pos;
        for (var i = 0; i < this._cardArray.length; i++) {
            var aimPos = cc.p(0, 0);
            if (this.horizontal) {
                aimPos = cc.pAdd(pos, cc.p(this.distance * i, 0));
            } else {
                aimPos = cc.pAdd(pos, cc.p(0, this.distance * i));
            }
            this._cardArray[i].position = aimPos;
        }
        this._scaleCards(cc.p(0, 0));
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
