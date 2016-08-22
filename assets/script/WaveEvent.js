cc.Class({
    extends: cc.Component,

    properties: {
        waveArray:[cc.Node]
    },

    // use this for initialization
    onLoad: function () {

    },


    moveLeftCallBack(name)
    {
        console.log("moveLeftEnd");
        for(var i=0;i<this.waveArray.length;i++)
        {
            if(this.waveArray[i].name == name)
            {
                this.waveArray[i].position.x = 1287;       
            }
        }
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
