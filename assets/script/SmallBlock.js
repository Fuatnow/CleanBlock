cc.Class({
    extends: cc.Component,

    properties: {
         frameList: {
            default: [],
            type: cc.SpriteFrame
        }
    },

    // use this for initialization
    onLoad: function () {
    },

    setSpriteFrameNum(num)
    {
        var sprite = this.getComponent(cc.Sprite);
        sprite.spriteFrame = this.frameList[num-1];
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
