cc.Class({
    extends: cc.Component,

    properties: {
    musicClip: {
            default: null,
            url: cc.AudioClip
        },
        mergeClip: {
            default: null,
            url: cc.AudioClip
        },
        resetClip: {
            default: null,
            url: cc.AudioClip
        }
    },

    onLoad()
    {
        cc.game.addPersistRootNode(this.node);
        this._musicHadPlayed = false;
        var aenable = cc.sys.localStorage.getItem("audioEnable");
        if(aenable == null) aenable = "true";
        this._audioEnable = (aenable == "true");
        cc.log('onLoad'+"  "+aenable+"  "+this._audioEnable);
        if(this._audioEnable)
        {
            cc.audioEngine.playMusic(this.musicClip,true);
            this._musicHadPlayed = true;
        }
    },


    playEffect(clipName)
    {
       if(this._audioEnable == false)
       {
           return;
       }

        switch(clipName)
        {
            case 'reset':
                cc.audioEngine.playEffect(this.resetClip,false);
            break;
            case 'merge':
                cc.audioEngine.playEffect(this.mergeClip,false);
            break;
            default:
            break;
        }
    },

    setAudioEnable(enable)
    {
        cc.sys.localStorage.setItem("audioEnable",enable);
        if(enable)
        {
            if(this._musicHadPlayed)
            {
                cc.audioEngine.resumeMusic();
            }
            else
            {
                cc.audioEngine.playMusic(this.musicClip,true);
            }
            this._musicHadPlayed = true;
        }
        else
        {
            cc.audioEngine.pauseMusic();
        }
        this._audioEnable = enable;
    },


    getAudioEnable()
    {
        return this._audioEnable;
    }
});
