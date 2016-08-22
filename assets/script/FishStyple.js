cc.Class({
    extends: cc.Component,

    properties: 
    {
        objsTempArr:[cc.Prefab],
        objsParentArr:[cc.Node],
    },

    // use this for initialization
    onLoad: function () 
    {
        this._maxObjsNumArr = [3,2,2,3,4,5];
        this._intervalArr = [0,0,0,0,0,0];
        this._standIntervalArr = [6,7,9,2,2,2];
        this._standAniSpeedArr = [0.2,0.22,0.24,0.65,0.7,0.8];
        this._waitTimeArr = [0,0,0,0,0,0];
        this._poolArray = [new cc.NodePool(),new cc.NodePool(),new cc.NodePool(),
            new cc.NodePool(),new cc.NodePool(),new cc.NodePool()];
        this.schedule(this.generateFish1,0);
        this.schedule(this.generateFish2,0);
        this.schedule(this.generateFish3,0);
        this.schedule(this.generateBubble1,0);
        this.schedule(this.generateBubble2,0);
        this.schedule(this.generateBubble3,0);
    },


    generateFish1(dt)
    {
        this.generateObj(dt,0,'fish');
    },

    generateFish2(dt) 
    {
        this.generateObj(dt,1,'fish');   
    },

    generateFish3(dt)
    {
        this.generateObj(dt,2,'fish');
    },

    generateBubble1(dt)
    {
        this.generateObj(dt,3,'bubble');
    },

    generateBubble2(dt)
    {
        this.generateObj(dt,4,'bubble');
    },

    generateBubble3(dt)
    {
        this.generateObj(dt,5,'bubble');
    },

    generateObj(dt,index,type)
    {
        var childArray  = this.objsParentArr[index].children;
        var childCount = childArray.length;
        // console.log("generateFish1--->"+ this._maxObjsNumArr[index] + '     '+ childCount+'   '+this._poolArray[index].size() );
        if(this._waitTimeArr[index] > this._intervalArr[index])
        {
            if(childCount ==  this._maxObjsNumArr[index])
            {
                for(var i=0 ;i<childCount;i++)
                {
                    var obj = childArray[i];
                    var aniNode =  obj.getChildByName("aniNode");
                    var animCtrl = aniNode.getComponent(cc.Animation);
                    var animState = animCtrl.getAnimationState(animCtrl.aniname);
                    if(animState == null)
                    {
                        this._poolArray[index].put(obj);
                        break;
                    }
                    else if(animState.isPlaying == false)
                    {
                        this._poolArray[index].put(obj);
                        break;
                    }
                }
            }
            else if(childCount< this._maxObjsNumArr[index])
            {
                var obj = null;
                if(this._poolArray[index].size() > 0)
                {
                    obj = this._poolArray[index].get();
                }
                else
                {
                    obj = cc.instantiate(this.objsTempArr[index]);
                }
                obj.parent = this.objsParentArr[index];
                this.randomObjData(obj,index,type);
                var randNum = Math.random()*2 - 1;
                this._intervalArr[index] = this._standIntervalArr[index] + randNum;
                this._waitTimeArr[index] = 0;
            }
            else
            {
                this._waitTimeArr[index] = 0;
            }
        }
        this._waitTimeArr[index] += dt;
    },

    randomObjData(obj,index,type)
    {
        // console.log('randomObjData');
        var aniNode =  obj.getChildByName("aniNode");
        var animCtrl = aniNode.getComponent(cc.Animation);
        if(type == 'fish')
        {
            var posY = Math.random()*1000 - 630;
            obj.position = cc.p(0,posY);
            
            var aniName = "leftToRight";
            if(Math.random() > 0.5)
            {
                aniName = "rightToLeft";
            }
            animCtrl.play(aniName);
            animCtrl.aniname = aniName;
            var aniSpeed = this._standAniSpeedArr[index] + (Math.random()*0.1 - 0.05);
            animCtrl.currentClip.speed = aniSpeed;
        }
        else
        {
            var posX = Math.random()*940 - 470;
            obj.position = cc.p(posX,0);

            var aniName = "bottomToUp";
            animCtrl.play(aniName);
            animCtrl.aniname = aniName;
            var aniSpeed = this._standAniSpeedArr[index] + (Math.random()*0.5 - 0.25);
            animCtrl.currentClip.speed = aniSpeed;
        }
        obj.opacity = 0;
        obj.runAction(cc.fadeIn(0));
    },
});
