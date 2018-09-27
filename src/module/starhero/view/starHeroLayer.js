
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 /**
 * 名将录层的创建
 */
var starHeroLayer = baseLayer.extend({
    LayerName:"starHeroLayer",
    ctor:function(){
        this._super();
        this.uiAttributeLayer.setVisible(false);
        this.isRed = false;  //是否打开过橙红list
        this.isGai = false;  //是否打开过改造list
    },
    onEnter:function(){
        this._super();
        this.initCustomEvent();
    },
    //初始化ui
    initUI:function () {
        this.customWidget();  //自定义Widget
    },
    initCustomEvent:function () {
        var self = this;
        //请求排行榜
        this.networkRankEvent = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            eventName:"rank.getinfo",
            callback:function (event) {
                var resData = event.getUserData();
                if(resData.status == 0){
                    if(resData.id == "soldier_"+self.index){  //名将录排行
                        self.updateRank(resData);
                    }
                }
            }
        });
        cc.eventManager.addListener(this.networkRankEvent,1);
        //请求录入记录
        this.networkGetRecordEvent = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            eventName:"general.getinfo",
            callback:function (event) {
                var resData = event.getUserData();
                if(resData.status == 0){
                    self.updateRecord(resData.data);
                }
            }
        });
        cc.eventManager.addListener(this.networkGetRecordEvent,1);
        //录入士兵
        this.networkSendRecordEvent = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            eventName:"general.record",
            callback:function (event) {
                var resData = event.getUserData();
                if(resData.status == 0){
                    //获得的物品
                    var task = 'resource.get';
                    var event = new cc.EventCustom(task);
                    var temp ={};
                    temp.data = resData.profit;
                    event.setUserData(temp);
                    cc.eventManager.dispatchEvent(event);

                    self.updateRecord(resData.data);
                }
            }
        });
        cc.eventManager.addListener(this.networkSendRecordEvent,1);
    },
    //自定义Widget
    customWidget:function(){
        var wgtArr = [];
        wgtArr.push("btnBack");  //返回按钮
		wgtArr.push("btnRed");  //橙红的标签
		wgtArr.push("btnGai");  //改造的标签
		wgtArr.push("starListRed");  //橙红的list
		wgtArr.push("starListReform");  //改造的list
		wgtArr.push("Image_heroDi");  //英雄的模型的item
		wgtArr.push("Panel_ComBoss");  //详细界面
		wgtArr.push("btnBackDet");  //详细界面的返回按钮
		wgtArr.push("Panel_HeroDet");  //详细界面的模型
		wgtArr.push("Text_heroDet");  //士兵的名字
		//五个名次
		for(var i=1;i<=5;i++){
			wgtArr.push("Text_playerName"+i); 
		}
		wgtArr.push("textMyRank");  //我的排名
		//三个录入情况
		for(var i=1;i<=3;i++){
			wgtArr.push("btnLuRu"+i); 
			wgtArr.push("textLuRu"+i); 
			wgtArr.push("textLuRuName"+i); 
			wgtArr.push("Text_RankReward"+i); 
		}
		wgtArr.push("btnReward");  //奖励查询的按钮
		wgtArr.push("Panel_Reward");  //奖励界面
		wgtArr.push("btnBackRe");  //奖励界面的返回按钮
		wgtArr.push("starRewardList");  //奖励list
		wgtArr.push("Panel_ReItem");  //奖励的item
		
		
        var uiStarHero = ccsTool.load(res.uiStarHeroLayer,wgtArr);
        //控件的名字赋值给this变量
        for(var key in uiStarHero.wgt){
            this[key] = uiStarHero.wgt[key];
        }
        this.addChild(uiStarHero.node);
        
        //返回按钮
        this.btnBack.addTouchEventListener(this.hideEvent, this);
        //橙红的标签
        this.btnRed.addTouchEventListener(this.changeBtnEvent,this);
        this.btnRed.setTag(1);
        this.btnRed.setBrightStyle(ccui.Widget.BRIGHT_STYLE_HIGH_LIGHT);
        this.btnRed.setTouchEnabled(false);
        //改造的标签
        this.btnGai.addTouchEventListener(this.changeBtnEvent,this);
        this.btnGai.setTag(2);
        //显示第一个list里面的内容
        this.updateRankList(1);
        //详细界面
        this.Panel_ComBoss.addTouchEventListener(this.hideEvent, this);
        //详细界面的返回按钮
        this.btnBackDet.addTouchEventListener(this.hideEvent, this);
		//三个录入的按钮
		for(var i =1;i<=3;i++){
			this["btnLuRu"+i].addTouchEventListener(this.recordEvent, this);
		}
        //奖励查询的按钮
        this.btnReward.addTouchEventListener(this.showRewardEvent, this);
        //奖励界面
        this.Panel_Reward.addTouchEventListener(this.hideEvent, this);
        //奖励界面的返回按钮
        this.btnBackRe.addTouchEventListener(this.hideEvent, this);
    },
    //显示详细界面的事件
    showDetailedEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type){
            var tag = sender.getTag();
            this.index = tag;
            //显示详细的界面
            this.showDetailedPanle(tag);
            //发送网络消息
            starHeroModel.getRank("soldier_"+tag,1,5);
            starHeroModel.getRecordInfo(tag);
        }
    },
    //显示详细界面
    showDetailedPanle:function(id){
        this.Panel_ComBoss.setVisible(true);
        var heroInfo = HEROCFG[id];
        var itemInfo = Helper.findItemId(heroInfo.armyid);
        //模型
        this.Panel_HeroDet.removeAllChildren(true);
        var size = this.Panel_HeroDet.getContentSize();
        HeroDefault.runAdle(heroInfo.armyid,this.Panel_HeroDet,size.width/2,0,1,1);  //英雄的原地动作
        //士兵的名字
        this.Text_heroDet.setString(itemInfo.itemname);
        Helper.setNamecolorByQuality(this.Text_heroDet,itemInfo.quality);
        //五个名次
        for(var i=1;i<=5;i++){
            this["Text_playerName"+i].setVisible(false);
        }
        //我的排名
        var strText = StringFormat(STRINGCFG[100086].string,STRINGCFG[100187].string);  //100086	我的排名：$1  100187	未上榜
        this.textMyRank.setString(strText);
        //三个录入情况
        for(var i=1;i<=3;i++){
            this["btnLuRu"+i].setTouchEnabled(true);
            this["textLuRu"+i].setVisible(true);
            this["textLuRuName"+i].setVisible(false);
            this["Text_RankReward"+i].setVisible(true);
        }
    },
    //更新排行
    updateRank:function(Listdata){
        //五个名次
        for(var i=1;i<=5;i++){
            if(!isEmptyObject(Listdata.data) && Listdata.data[i-1] != null && Listdata.data[i-1].id){
                this["Text_playerName"+i].setVisible(true);
                this["Text_playerName"+i].setString(Listdata.data[i-1].name);
            }
        }
        //我的排名
        var mypm = Listdata.my || 0;
        if(mypm != 0){
            var strText = StringFormat(STRINGCFG[100086].string,mypm);  //100086	我的排名：$1
            this.textMyRank.setString(strText);
        }
    },
    //更新录入
    updateRecord:function(data){
        var nameArr = [];
        nameArr.push(data.first);
        nameArr.push(data.second);
        nameArr.push(data.third);
        //三个录入情况
        for(var i=1;i<=3;i++){
            if(nameArr[i-1] != null && nameArr[i-1] != ""){
                this["btnLuRu"+i].setTouchEnabled(false);
                this["textLuRu"+i].setVisible(false);
                this["textLuRuName"+i].setVisible(true);
                this["textLuRuName"+i].setString(nameArr[i-1]);
                this["Text_RankReward"+i].setVisible(false);
            }
        }
    },
    //更新排行榜list
    updateRankList:function(index){
        if(index == 1){  //橙红
            if(this.isRed == false){ //是否打开过橙红list
                this.isRed = true;
                this.starListRed.removeAllChildren(true);
                var dataArray = [];
                for(var key in HEROCFG){
                    var heroInfo = HEROCFG[key];
                    var itemInfo = Helper.findItemId(heroInfo.armyid);
                    //红橙色 并且不是改造的
                    if(heroInfo.use == 1 && itemInfo.quality >= 5 && (heroInfo.herotype == 1 || heroInfo.herotype == 2)){
                        var temp = objClone(heroInfo);
                        temp.itemname = itemInfo.itemname;
                        temp.quality = itemInfo.quality;
                        dataArray.push(temp);
                    }
                }
                dataArray.sort(this.compare);
                var itemArray = [];
                var count = 0;
                var index = -1;
                for(var i = 0;i<dataArray.length;i++){
                    var heroInfo = dataArray[i];
                    var HeroNode = this.Image_heroDi.clone();
                    var obj = ccsTool.seekWidget(HeroNode,["Panel_ImageHero","Text_heroNmae"]);
                    var size = obj.wgt.Panel_ImageHero.getContentSize();
                    HeroDefault.runAdle(heroInfo.armyid,obj.wgt.Panel_ImageHero,size.width/2,0,1,1);  //英雄的原地动作
                    //名字
                    obj.wgt.Text_heroNmae.setString(heroInfo.itemname);
                    Helper.setNamecolorByQuality(obj.wgt.Text_heroNmae,heroInfo.quality);

                    var mod = count % 3;
                    HeroNode.setAnchorPoint(0,0);
                    HeroNode.setPosition(HeroNode.getContentSize().width*HeroNode.getScaleX()* mod,0);
                    HeroNode.setTag(heroInfo.armyid);
                    HeroNode.addTouchEventListener(this.showDetailedEvent, this);

                    if (mod == 0)
                    {
                        index++;
                        itemArray[index] = new ccui.Widget();
                        var heroheight = HeroNode.getContentSize().height*HeroNode.getScaleY();
                        itemArray[index].setContentSize(this.starListRed.getContentSize().width,heroheight);
                        itemArray[index].setAnchorPoint(0,0);
                        this.starListRed.pushBackCustomItem(itemArray[index]);
                    }
                    HeroNode.removeFromParent(false);
                    itemArray[index].addChild(HeroNode);
                    count++;
                }
            }
            //设置list是否显示
            this.starListRed.setVisible(true);
            this.starListReform.setVisible(false);
        }else if(index == 2){  //改造list
            if(this.isGai == false){ //是否打开过改造list
                this.isGai = true;
                this.starListReform.removeAllChildren(true);
                var dataArray = [];
                for(var key in HEROCFG){
                    var heroInfo = HEROCFG[key];
                    var itemInfo = Helper.findItemId(heroInfo.armyid);
                    //是终极改造的
                    if(heroInfo.herotype == 3 && heroInfo.use == 1){
                        var temp = objClone(heroInfo);
                        temp.itemname = itemInfo.itemname;
                        temp.quality = itemInfo.quality;
                        dataArray.push(temp);
                    }
                }
                dataArray.sort(this.compare);
                var itemArray = [];
                var count = 0;
                var index = -1;
                for(var i = 0;i<dataArray.length;i++){
                    var heroInfo = dataArray[i];
                    var HeroNode = this.Image_heroDi.clone();

                    var obj = ccsTool.seekWidget(HeroNode,["Panel_ImageHero","Text_heroNmae"]);
                    var size = obj.wgt.Panel_ImageHero.getContentSize();
                    HeroDefault.runAdle(heroInfo.armyid,obj.wgt.Panel_ImageHero,size.width/2,0,1,1);  //英雄的原地动作
                    //名字
                    obj.wgt.Text_heroNmae.setString(heroInfo.itemname);
                    Helper.setNamecolorByQuality(obj.wgt.Text_heroNmae,heroInfo.quality);

                    var mod = count % 3;
                    HeroNode.setAnchorPoint(0,0);
                    HeroNode.setPosition(HeroNode.getContentSize().width*HeroNode.getScaleX()* mod,0);
                    HeroNode.setTag(heroInfo.armyid);
                    HeroNode.addTouchEventListener(this.showDetailedEvent, this);

                    if (mod == 0)
                    {
                        index++;
                        itemArray[index] = new ccui.Widget();
                        var heroheight = HeroNode.getContentSize().height*HeroNode.getScaleY();
                        itemArray[index].setContentSize(this.starListReform.getContentSize().width,heroheight);
                        itemArray[index].setAnchorPoint(0,0);
                        this.starListReform.pushBackCustomItem(itemArray[index]);
                    }
                    HeroNode.removeFromParent(false);
                    itemArray[index].addChild(HeroNode);
                    count++;
                }
            }
            //设置list是否显示
            this.starListRed.setVisible(false);
            this.starListReform.setVisible(true);
        }
    },
    //排序函数
    compare:function(a,b){
        //排序
        if(a.quality < b.quality){
            return -1;
        }else if(a.quality == b.quality){
            if(a.armyid < b.armyid){
                return -1;
            }
        }
        return 1;
    },
    //返回按钮的事件
    hideEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type){
            switch (sender.name) {
                case 'btnBack'://大界面的返回按钮
                    this.removeFromParent(true);
                    break;
                case 'Panel_ComBoss'://详细界面
                    this.Panel_ComBoss.setVisible(false);
                    break;
                case 'btnBackDet'://详细界面的返回按钮
                    this.Panel_ComBoss.setVisible(false);
                    break;
                case 'Panel_Reward'://奖励界面
                    this.Panel_Reward.setVisible(false);
                    break;
                case 'btnBackRe'://奖励界面的返回按钮
                    this.Panel_Reward.setVisible(false);
                    break;
                default:
                    break;
            }
        }
    },
    //两个标签按钮的事件
    changeBtnEvent:function(sender,type){
        if(ccui.Widget.TOUCH_ENDED==type) {
            switch (sender.name) {
                case 'btnRed'://橙红的标签
                    this.btnRed.setBrightStyle(ccui.Widget.BRIGHT_STYLE_HIGH_LIGHT);
                    this.btnRed.setTouchEnabled(false);
                    this.btnGai.setBrightStyle(ccui.Widget.BRIGHT_STYLE_NORMAL);
                    this.btnGai.setTouchEnabled(true);
                    break;
                case 'btnGai'://改造的标签
                    this.btnGai.setBrightStyle(ccui.Widget.BRIGHT_STYLE_HIGH_LIGHT);
                    this.btnGai.setTouchEnabled(false);
                    this.btnRed.setBrightStyle(ccui.Widget.BRIGHT_STYLE_NORMAL);
                    this.btnRed.setTouchEnabled(true);
                    break;
                default:
                    break;
            }
            var tag = sender.getTag();
            this.updateRankList(tag);
        }
    },
    //录入的按钮事件
    recordEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type){
            var heroInfo = Helper.findHeroById(this.index);
            //改造后的士兵
            if(heroInfo.herotype == 3){
                var soldInfo = GLOBALDATA.soldiers[heroInfo.initid];
                if(soldInfo == null || soldInfo.sq < 10){
                    ShowTipsTool.ErrorTipsFromStringById(100211);   //100211	还未获得该士兵
                    return;
                }
            }
            //为突破的士兵
            if(heroInfo.herotype == 2){
                var soldInfo = GLOBALDATA.soldiers[heroInfo.initid];
                if(soldInfo == null || soldInfo.m < 1){
                    ShowTipsTool.ErrorTipsFromStringById(100211);   //100211	还未获得该士兵
                    return;
                }
            }
            //一般的士兵
            if(heroInfo.herotype == 1 && GLOBALDATA.soldiers[this.index] == null){
                ShowTipsTool.ErrorTipsFromStringById(100211);   //100211	还未获得该士兵
                return;
            }
            var event = new cc.EventCustom("TipsLayer_show");
            //100212	是否录入该士兵？
            var data = {string:STRINGCFG[100212].string, callback:this.recordCall, target:this};
            event.setUserData(data);
            cc.eventManager.dispatchEvent(event);
        }
    },
    //录入的回调
    recordCall:function(ttype){
        if (ttype == 1) // 确定
        {
            starHeroModel.sendRecord(this.index);
        }
    },
    //查询奖励的按钮的时间
    showRewardEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type){
            this.Panel_Reward.setVisible(true);
            //奖励的list
            this.starRewardList.removeAllChildren(true);
            for(var key in RECORDRANKCFG){
                var ItemNode = this.Panel_ReItem.clone();
                this.starRewardList.pushBackCustomItem(ItemNode);
                var obj = ccsTool.seekWidget(ItemNode,["Text_RewardXh","Text_Rewardstr"]);
                var Info = RECORDRANKCFG[key];
                //名次
                var strText = "";
                if(Info.rank[0] == Info.rank[1]){
                    strText = StringFormat(STRINGCFG[100199].string,Info.rank[0]);  //100199	第$1名
                }else{
                    strText = StringFormat(STRINGCFG[100199].string,Info.rank[0]+"-"+Info.rank[1]);  //100199	第$1名
                }
                obj.wgt.Text_RewardXh.setString(strText);
                //奖励
                obj.wgt.Text_Rewardstr.setString(Info.item[1]);
            }
        }
    },
    onExit:function(){
        this._super();
        cc.eventManager.removeListener(this.networkRankEvent);
        cc.eventManager.removeListener(this.networkGetRecordEvent);
        cc.eventManager.removeListener(this.networkSendRecordEvent);
    },
});