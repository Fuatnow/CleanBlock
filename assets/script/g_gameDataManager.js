var g_gameDataManager = {
    initData:function()
    {
        this._levelPage = 0;
        this._levelNum = 0;
        this.blockArrays = [];
        this.numArrays = [];
        // cc.sys.localStorage.clear();
        // this.printStorageDetail();
    },


    printStorageDetail()
    {
        console.log('printStorageDetail');
        var storage = cc.sys.localStorage;
        for(var i=0;i<storage.length;i++)
        {
            console.log(storage.key(i)+ " : " + storage.getItem(storage.key(i)) );
        }
    },
    
    getLevelPage()
    {
        return this._levelPage;
    },

    setLevelPage(val)
    {
        this._levelPage = val;
    },

    getLevel:function()
    {
        return this._levelNum;
    },

    setLevel:function(levelNum)
    {
        this._levelNum = levelNum;
    },

    getLevelStarNum(level)
    {
       var value = cc.sys.localStorage.getItem("levelStar"+level);
       if(value == null) value=0;
       return parseInt(value);
    },

    setLevelStarNum(level,starNum)
    {
        cc.sys.localStorage.setItem("levelStar"+level,starNum);
        var value = cc.sys.localStorage.getItem("levelStar" + level);
        if (value == null) value = 0;
    },

    getPageStar(page)
    {
        var value = cc.sys.localStorage.getItem("pageStar"+page);
        if(value == null) value = 0;
        return parseInt(value);
    },

    setPageStar(page,pageStarNum)
    {
        cc.sys.localStorage.setItem("pageStar"+page,pageStarNum);
    },

    getTotalStar()
    {
        var totalStarNum = 0;
        for(var i=0;i<4;i++)
        {
            totalStarNum += this.getPageStar(i);
        }
        return totalStarNum;
    },

    isPageUnLock(page)
    {
        var value = cc.sys.localStorage.getItem("unlockPage_"+page);
        if(page == 0)
        {
            value = true;
        }
        return Boolean(value);
    },

    setPageUnlock(page,unLock)
    {   
        cc.sys.localStorage.setItem("unlockPage_"+page,unLock);
    },

    canPageUnlock(page)
    {
        var totalStarNum = this.getTotalStar();
        return totalStarNum >= this.getPageUnlockNeedStar(page);
    },


    getPageUnlockNeedStar(page)
    {
        if(page == 0) return 0;
        if(page == 1) return 70;
        if(page == 2) return 145;
        if(page == 3) return 223;
        return 0;
    },
};
// GameData._instance = null;
// GameData.getInstance = function()
// {
//     if(GameData._instance == null)
//     {
//         GameData._instance = new GameData();
//         GameData._instance.initData();
//     }
//     return GameData._instance;
// };

g_gameDataManager.initData();
module.exports = g_gameDataManager;