cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...

        frameList: {
            default: [],
            type: cc.SpriteFrame
        }
    },

    // use this for initialization
    onLoad: function () {
        this._row = 0;
        this._col = 0;
        this._num = -1;
    },

    setAttribute(row,col,num)
    {
        this._row = row;
        this._col = col;
        if(this._num != num)
        {
            this._num = num;
            var sprite = this.getComponent(cc.Sprite);
            sprite.spriteFrame = this.frameList[num-1];
        }
        
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
