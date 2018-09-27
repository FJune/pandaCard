
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 /**
 * 对战层的创建
 */
var bothFightLayer = baseLayer.extend({
    LayerName:"bothFightLayer",
    ctor:function(){
        this._super();
        this.uiAttributeLayer.setVisible(false);
        this.ModelArray = [];
        this.delTime = 30*60;  //回复间隔时间
        this.posArray = [[23,537],[380,561],[269,370],[40,150],[372,148]];
        this.isRank = false;  //是否打开了排行榜
        this.isRankRe = false;  //是否打开了积分奖励
        this.isGongHuiRe = false;  //是否打开了公会积分排行榜
        this.myjf = 0;  //我的排名
        this.mygh = 0;  //我的公会的排名
        this.myghjf = 0; //我的公会积分
    },
    onEnter:function(){
        this._super();
        this.initCustomEvent();
    },
    //初始化ui
    initUI:function () {
        this.customWidget();  //自定义Widget
        this.SetBothNum();   //设置对战次数
        this.refreshBothList();   //刷新对战的列表
        this.updateInfo();
        this.updateTime();   //更新回复时间
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
                    if(resData.id == 7){  //对战积分排行
                        self.dealRankData(1,resData);
                    }else if(resData.id == 8){  //公会排行
                        self.dealRankData(3,resData);
                    }
                }
            }
        });
        cc.eventManager.addListener(this.networkRankEvent,1);
        //请求战斗记录
        this.networkRecordEvent = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            eventName:"both.stagelist",
            callback:function (event) {
                var resData = event.getUserData();
                if(resData.status == 0){
                    self.updateRecordList(resData.data);
                }
            }
        });
        cc.eventManager.addListener(this.networkRecordEvent,1);
        //购买对战次数
        this.networkBuyCountEvent = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            eventName:"both.buycount",
            callback:function (event) {
                var resData = event.getUserData();
                if(resData.status == 0){
                    self.SetBothNum();   //设置对战次数
                    self.updateTime();   //更新回复时间
                }
            }
        });
        cc.eventManager.addListener(this.networkBuyCountEvent,1);
        //更新both数据
        this.networkDataUpdateEvent = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            eventName:"data.update.both",
            callback:function (event) {
                var resData = event.getUserData();
                if(resData.status == 0){
                    self.SetBothNum();   //设置对战次数
                    self.updateInfo();   //更新信息
                    self.updateTime();   //更新回复时间
                }
            }
        });
        cc.eventManager.addListener(this.networkDataUpdateEvent,1);
        //请求对方的战斗信息
        this.networkBattleInfoEvent = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            eventName:"getinfo.battle",
            callback:function (event) {
                var resData = event.getUserData();
                if(resData.status == 0){
                    self.readyStartBattle(resData.data);   //准备开始战斗
                }
            }
        });
        cc.eventManager.addListener(this.networkBattleInfoEvent,1);
        //接受开始战斗的消息
        this.startBattleEvent = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            eventName:"both.stagebegin",
            callback:function (event) {
                var resData = event.getUserData();
                if(resData.status == 0){
                    self.StartBattle();   //开始战斗
                }
            }
        });
        cc.eventManager.addListener(this.startBattleEvent,1);
        //战斗场景
        this.both_combatEvent = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "both.combat",
            callback: function(event){
                var ret = event.getUserData();
                if(ret.result == 'victory'){  //战斗胜利
                    self.combatCallback(1);
                }else if(ret.result == 'defeat'){  //战斗失败
                    self.combatCallback(0);
                }else if(ret.result == 'outBoss'){  //脱离boss  可以直接认为战斗失败
                    self.combatCallback(0);
                }
            }
        });
        cc.eventManager.addListener(this.both_combatEvent,1);
        //战斗结果的返回
        this.battleResultEvent = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "both.stage",
            callback: function(event){
                var resData = event.getUserData();
                if(resData.status == 0){
                    self.showResult(resData.data);   //显示战斗结果
                }else{  //返回的数据错误
                    self.showResult();
                }
            }
        });
        cc.eventManager.addListener(this.battleResultEvent,1);
    },
    //自定义Widget
    customWidget:function(){
        var wgtArr = [];
        wgtArr.push("backBtn");  //返回按钮
		wgtArr.push("bagNuQiReward");  //当前额外收益
		wgtArr.push("bagNuQi");  //怒气值
		wgtArr.push("LoadingBar");  //怒气进度条
		wgtArr.push("bagWarNum");  //对战次数
		wgtArr.push("bagWarTimeAll");  //回复时间
		wgtArr.push("Button_AddWar");  //购买对战次数的加号
		wgtArr.push("Panel_hero");  //三个模型的节点
		wgtArr.push("fightButtonRank");  //排行榜按钮
		wgtArr.push("Panel_Ro");  //排行榜界面
		wgtArr.push("btnGXBack");  //排行榜界面的关闭按钮
		wgtArr.push("textMyRank");  //我的排名
		wgtArr.push("textMyReward");  //我的公会积分
		wgtArr.push("rankList");  //积分排行list
		wgtArr.push("rewardRaList");  //积分奖励list
		wgtArr.push("ghList");  //公会排行list
		wgtArr.push("rewardGhList");  //公会奖励list
		//排行榜界面的四个标签按钮
		for(var i=1;i<=4;i++){
			wgtArr.push("btnRank"+i); 
		}
		wgtArr.push("fightButtonJi");  //战斗记录按钮
        wgtArr.push("fightButtonShop");  //商店按钮
		wgtArr.push("Panel_Ji");  //战斗记录界面
		wgtArr.push("btnJBack");  //战斗记录界面的关闭按钮
		wgtArr.push("jiLuRoList");  //战斗记录list
		
		
        var uiVs = ccsTool.load(res.uiVsLayer,wgtArr);
        //控件的名字赋值给this变量
        for(var key in uiVs.wgt){
            this[key] = uiVs.wgt[key];
        }
        this.addChild(uiVs.node);
        //三个节点
        for(var i=0;i<3;i++){
            var HeroNode = this.Panel_hero.clone();
            var Image_hero = ccui.helper.seekWidgetByName(HeroNode, "Image_hero");  //模型的层
            var Image_herojl = ccui.helper.seekWidgetByName(HeroNode, "Image_herojl");  //奖励的图片
            Image_hero.addTouchEventListener(this.battleEvent, this);
            Image_herojl.addTouchEventListener(this.battleEvent, this);
            uiVs.node.addChild(HeroNode);
            this.ModelArray.push(HeroNode);
        }
        //返回按钮
        this.backBtn.addTouchEventListener(this.hideEvent, this);
        //排行榜按钮
        this.fightButtonRank.addTouchEventListener(this.showRankEvent, this);
        //排行榜的四个标签按钮
        for(var i=1;i<=4;i++){
            this["btnRank"+i].setTag(i);
            this["btnRank"+i].addTouchEventListener(this.changeBtnEvent,this);
        }
        //排行榜界面
        this.Panel_Ro.addTouchEventListener(this.hideEvent, this);
        this.Panel_Ro.setLocalZOrder(2);
        //排行榜界面的关闭按钮
        this.btnGXBack.addTouchEventListener(this.hideEvent, this);
        //战斗记录按钮
        this.fightButtonJi.addTouchEventListener(this.showRecordEvent, this);
        //战斗记录界面
        this.Panel_Ji.addTouchEventListener(this.hideEvent, this);
        this.Panel_Ji.setLocalZOrder(2);
        //战斗记录界面的关闭按钮
        this.btnJBack.addTouchEventListener(this.hideEvent, this);
        //购买对战次数按钮
        this.Button_AddWar.addTouchEventListener(this.buyCountEvent, this);
        //商店按钮
        this.fightButtonShop.addTouchEventListener(this.shopBuyEvent, this);
    },
    updateInfo:function () {
        //当前额外收益
        var strText = StringFormat(STRINGCFG[100182].string,GLOBALDATA.both.nq*0.5);  //100182	当前额外收益$1%
        this.bagNuQiReward.setString(strText);
        //怒气值
        this.bagNuQi.setString(GLOBALDATA.both.nq+"/150");
        //怒气进度条
        this.LoadingBar.setPercent(Math.floor(GLOBALDATA.both.nq/150*100));
        //对战次数
        var strText = STRINGCFG[100183].string+":"+this.bothNum;  //100183	掠夺次数
        this.bagWarNum.setString(strText);
        //购买对战次数的加号
        this.Button_AddWar.setTouchEnabled(true);
        //三个节点
        var posArray = this.posArray.concat();
        for(var i=0;i<3;i++){
            var HeroNode = this.ModelArray[i];
            var heroAtt = GLOBALDATA.both.list[i];
            if(heroAtt != null && heroAtt.id != null){
                var obj = ccsTool.seekWidget(HeroNode,["Image_hero","Image_herojl","Text_name","Text_gonghui"]);
                obj.wgt.Image_hero.setTag(heroAtt.id);
                obj.wgt.Image_herojl.setTag(heroAtt.id);
                obj.wgt.Text_name.setString(heroAtt.name);  //名字
                var comModle = obj.wgt.Image_hero.getChildByName("comModle");
                if(comModle != undefined) {
                    obj.wgt.Image_hero.removeChild(comModle);
                }
                var comId = heroAtt.p;
                //防止指挥官的id为空
                if(comId == null){
                    for(var key in COMMANDERCFG){
                        comId = COMMANDERCFG[key].commanderid;
                        break;
                    }
                }
                var size = obj.wgt.Image_hero.getContentSize();
                var comModle = HeroDefault.runAdle(comId,obj.wgt.Image_hero,0,0,1,3);  //指挥员的动作
                comModle.setName("comModle");
                //公会
                if(heroAtt.gh != null){
                    obj.wgt.Text_gonghui.setString(heroAtt.gh);
                }
            }
            //随机位置
            var index = Math.floor(Math.random()*posArray.length);
            HeroNode.setPosition(posArray[index][0],posArray[index][1]);
            posArray.splice(index,1);
        }
        //更新三个节点的奖励情况
        this.updateThreeAeward();
    },
    //更新三个节点的奖励情况
    updateThreeAeward:function () {
        //设置奖励
        for(var i=0;i<3;i++){
            var HeroNode = this.ModelArray[i];
            var heroAtt = GLOBALDATA.both.list[i];
            if(heroAtt != null && heroAtt.id != null){
                HeroNode.setVisible(true);
                var obj = ccsTool.seekWidget(HeroNode,["goldValue","expValue"]);
                obj.wgt.goldValue.setString(Helper.formatNum(heroAtt.money));  //金币
                obj.wgt.expValue.setString(heroAtt.exp);  //经验
            }else{
                HeroNode.setVisible(false);
            }
        }
    },
    //设置对战次数
    SetBothNum:function () {
        this.bothNum = GLOBALDATA.both.num;  //对战次数
        this.maxNum = Helper.getVipNumberByUneed(GLOBALDATA.base.vip,3);  //最大的对战次数
        this.recTime = GLOBALDATA.both.nt;   //回复时间
    },
    //更新回复时间
    updateTime:function(){
        this.unscheduleAllCallbacks();
        this.schedule(function (dt) {
            if(this.bothNum < this.maxNum){
                var nowtime = Helper.getServerTime();
                var last_time = this.recTime - nowtime;
                if(last_time>0){
                    //回复时间
                    this.bagWarTimeAll.setVisible(true);
                    var strText = STRINGCFG[100184].string+":"+Helper.formatTime(last_time);  //100184	回复时间
                    this.bagWarTimeAll.setString(strText);
                }else{
                    this.bothNum++;
                    this.recTime = this.recTime+this.delTime;
                    //对战次数
                    var strText = STRINGCFG[100183].string+":"+this.bothNum;  //100183	掠夺次数
                    this.bagWarNum.setString(strText);
                }
            }else{
                this.unscheduleAllCallbacks();
                this.bagWarTimeAll.setVisible(false);
                //购买对战次数的加号
                this.Button_AddWar.setTouchEnabled(false);
                //对战次数
                var strText = STRINGCFG[100183].string+":"+this.bothNum;  //100183	掠夺次数
                this.bagWarNum.setString(strText);
            }
        });
    },
    //刷新对战的列表
    refreshBothList:function(){
        for(var i=0;i<3;i++) {
            var heroAtt = GLOBALDATA.both.list[i];
            if(heroAtt == null || heroAtt.id == null) {
                bothFightModel.sendBothRefresh();  //刷新对战的列表
                break;
            }
        }
    },
    //显示排行榜界面的时间
    showRankEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type){
            this.Panel_Ro.setVisible(true);
            this.isRank = false;
            this.btnRank1.setBrightStyle(ccui.Widget.BRIGHT_STYLE_HIGH_LIGHT);
            this.btnRank1.setTouchEnabled(false);
            this.changeRankBtn(1);
            this.updateRankList(1);
        }
    },
    //更新排行榜list
    updateRankList:function(index){
        if(this.isRank == false){
            this.isRank = true;
            //发送网络请求
            bothFightModel.getRank(7,1,20);  //请求对战积分排行榜
            //现在没有工会 后期处理
            //bothFightModel.getRank(8,1,20);  //请求公会排行榜
        }
        this.index = index;
        if(index == 1){  //积分排行榜
            //设置list是否显示
            this.rankList.setVisible(true);
            this.rewardRaList.setVisible(false);
            this.ghList.setVisible(false);
            this.rewardGhList.setVisible(false);
        }else if(index == 2){  //积分奖励
            if(this.isRankRe == false){  //是否打开了积分奖励
                this.isRankRe = true;
                this.rewardRaList.removeAllChildren(true);
                for(var key in DUIZHANRANKCFG){
                    var wgtArr = [];
                    wgtArr.push("item");   //最大的底
                    wgtArr.push("textRankGet");   //名次
                    for(var i=1;i<=2;i++){
                        wgtArr.push("bagItemRGBg"+i);
                        wgtArr.push("bagItemRGIcon"+i);
                        wgtArr.push("textRankGet_Num"+i);
                        wgtArr.push("bagRGPieces"+i);
                    }
                    var RankItem = ccsTool.load(res.uiVsRankGetItem,wgtArr);
                    var wgt = {};
                    //控件的名字赋值给wgt变量
                    for(var k in RankItem.wgt){
                        wgt[k] = RankItem.wgt[k];
                    }
                    wgt.item.removeFromParent(false);
                    this.rewardRaList.pushBackCustomItem(wgt.item);
                    var Info = DUIZHANRANKCFG[key];
                    //名次
                    var strText = "";
                    if(Info.rank[0] == Info.rank[1]){
                        strText = StringFormat(STRINGCFG[100199].string,Info.rank[0]);  //100199	第$1名
                    }else{
                        strText = StringFormat(STRINGCFG[100199].string,Info.rank[0]+"-"+Info.rank[1]);  //100199	第$1名
                    }
                    wgt.textRankGet.setString(strText);
                    //奖励物品
                    var count = 1;
                    for(var i=0;i<2;i++){
                        var reward = Info.reward[i];
                        if(reward != null){
                            var itemCfg = Helper.findItemId(reward[0]);
                            Helper.LoadIconFrameAndAddClick(wgt["bagItemRGIcon"+(i+1)],wgt["bagItemRGBg"+(i+1)],wgt["bagRGPieces"+(i+1)],itemCfg);  //物品
                            wgt["textRankGet_Num"+(i+1)].setString(reward[1]);  //数量
                            count++;
                        }
                    }
                    for(var i=count;i<=2;i++){
                        wgt["bagItemRGBg"+i].setVisible(false);
                    }
                }
            }
            //设置list是否显示
            this.rankList.setVisible(false);
            this.rewardRaList.setVisible(true);
            this.ghList.setVisible(false);
            this.rewardGhList.setVisible(false);
        }else if(index == 3){  //公会排名
            //设置list是否显示
            this.rankList.setVisible(false);
            this.rewardRaList.setVisible(false);
            this.ghList.setVisible(true);
            this.rewardGhList.setVisible(false);
        }else if(index == 4){  //公会奖励
            if(this.isGongHuiRe == false){  //是否打开了公会积分排行榜
                this.isGongHuiRe = true;
                this.rewardGhList.removeAllChildren(true);
                for(var key in DUIZHANJUNTUANCFG){
                    var wgtArr = [];
                    wgtArr.push("item");   //最大的底
                    wgtArr.push("textRankGet");   //名次
                    for(var i=1;i<=2;i++){
                        wgtArr.push("bagItemRGBg"+i);
                        wgtArr.push("bagItemRGIcon"+i);
                        wgtArr.push("textRankGet_Num"+i);
                        wgtArr.push("bagRGPieces"+i);
                    }
                    var RankItem = ccsTool.load(res.uiVsRankGetItem,wgtArr);
                    var wgt = {};
                    //控件的名字赋值给wgt变量
                    for(var k in RankItem.wgt){
                        wgt[k] = RankItem.wgt[k];
                    }
                    wgt.item.removeFromParent(false);
                    this.rewardGhList.pushBackCustomItem(wgt.item);
                    var Info = DUIZHANJUNTUANCFG[key];
                    //名次
                    var strText = "";
                    if(Info.rank[0] == Info.rank[1]){
                        strText = StringFormat(STRINGCFG[100199].string,Info.rank[0]);  //100199	第$1名
                    }else{
                        strText = StringFormat(STRINGCFG[100199].string,Info.rank[0]+"-"+Info.rank[1]);  //100199	第$1名
                    }
                    wgt.textRankGet.setString(strText);
                    //奖励物品
                    var count = 1;
                    for(var i=0;i<2;i++){
                        var reward = Info.reward[i];
                        if(reward != null){
                            var itemCfg = Helper.findItemId(reward[0]);
                            Helper.LoadIconFrameAndAddClick(wgt["bagItemRGIcon"+(i+1)],wgt["bagItemRGBg"+(i+1)],wgt["bagRGPieces"+(i+1)],itemCfg);  //物品
                            wgt["textRankGet_Num"+(i+1)].setString(reward[1]);  //数量
                            count++;
                        }
                    }
                    for(var i=count;i<=2;i++){
                        wgt["bagItemRGBg"+i].setVisible(false);
                    }
                }
            }
            //设置list是否显示
            this.rankList.setVisible(false);
            this.rewardRaList.setVisible(false);
            this.ghList.setVisible(false);
            this.rewardGhList.setVisible(true);
        }
        this.dealMyRank();  //处理我的排名的显示
    },
    //处理排行榜的数据
    dealRankData:function(index,Listdata){
        if(index == 1){
            this.rankList.removeAllChildren(true);
            for (var i=0;i<Listdata.data.length;i++){
                var wgtArr = [];
                wgtArr.push("item");   //最大的底
                wgtArr.push("textBMFontRank");   //名次
                wgtArr.push("bagItemRBg1");   //品质边框
                wgtArr.push("bagItemRIcon1");   //icon
                wgtArr.push("itemRankName");   //名字
                wgtArr.push("itemRankWar");   //积分

                var RankItem = ccsTool.load(res.uiVsRankItem,wgtArr);
                var wgt = {};
                //控件的名字赋值给wgt变量
                for(var key in RankItem.wgt){
                    wgt[key] = RankItem.wgt[key];
                }
                wgt.item.removeFromParent(false);
                this.rankList.pushBackCustomItem(wgt.item);
                var Info = Listdata.data[i];
                wgt.textBMFontRank.setString(Info.ranking);  //名次
                /*//暂时没有icon
                var itemCfg = Helper.findItemId(Info.icon);
                Helper.LoadFrameImageWithPlist(wgt.bagItemRBg1,itemCfg.quality);  //品质边框
                Helper.LoadIcoImageWithPlist(wgt.bagItemRIcon1,itemCfg);   //icon*/
                wgt.itemRankName.setString(Info.name);  //名字
                wgt.itemRankWar.setString(STRINGCFG[100204].string +"："+Info.np);   //100204	积分
            }
            //我的排名
            this.myjf = Listdata.my || 0;
        }else if(index == 3){
            //现在没有工会 后期处理
            this.ghList.removeAllChildren(true);
            for (var i=0;i<Listdata.data.length;i++){
                var wgtArr = [];
                wgtArr.push("item");   //最大的底
                wgtArr.push("textBMFontRank");   //名次
                wgtArr.push("itemRankName");   //公会名称
                wgtArr.push("itemRankWar");   //公会等级
                wgtArr.push("itemPeople");   //公会成员
                wgtArr.push("itemRankReward");   //公会积分

                var RankItem = ccsTool.load(res.uiVsGongRankItem,wgtArr);
                var wgt = {};
                //控件的名字赋值给wgt变量
                for(var key in RankItem.wgt){
                    wgt[key] = RankItem.wgt[key];
                }
                wgt.item.removeFromParent(false);
                this.ghList.pushBackCustomItem(wgt.item);
                var Info = Listdata.data[i];
                wgt.textBMFontRank.setString(Info.ranking);  //名次
                wgt.itemRankName.setString(STRINGCFG[100196].string+"："+Info.un);   //100196	公会名称
                wgt.itemRankWar.setString(STRINGCFG[100197].string+"："+Info.unlv);   //100197	公会等级
                wgt.itemPeople.setString(STRINGCFG[100198].string+"："+Info.unnum);   //100198	公会成员
                wgt.itemRankReward.setString(STRINGCFG[100189].string+"："+Info.jf);   //100189	公会积分
            }
            //我的公会的排名
            this.mygh = Listdata.my || 0;
            //我的公会积分
            this.myghjf = Listdata.jf || 0;
        }
        this.dealMyRank();  //处理我的排名的显示
    },
    //处理我的排名的显示
    dealMyRank:function(){
        if(this.index == 1 || this.index == 2){
            //我的排名
            var strText = "";
            if(this.myjf == 0){
                strText = StringFormat(STRINGCFG[100086].string,STRINGCFG[100187].string);  //100086	我的排名：$1  100187	未上榜
            }else{
                strText = StringFormat(STRINGCFG[100086].string,this.myjf);  //100086	我的排名：$1
            }
            this.textMyRank.setString(strText);
            //我的积分
            this.textMyReward.setVisible(false);
        }else if(this.index == 3 || this.index == 4){
            //我的排名
            var strText = "";
            if(this.mygh == 0){
                strText = StringFormat(STRINGCFG[100188].string,STRINGCFG[100187].string);  //100188	我的公会排名：$1100187	未上榜
            }else{
                strText = StringFormat(STRINGCFG[100188].string,this.mygh);  //100188	我的公会排名：$1
            }
            this.textMyRank.setString(strText);
            //我的积分
            this.textMyReward.setVisible(true);
            this.textMyReward.setString(STRINGCFG[100189].string+"："+this.myghjf);  //100189	公会积分
        }
    },
    //返回按钮的事件
    hideEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type){
            switch (sender.name) {
                case 'backBtn'://大界面的返回按钮
                    this.removeFromParent(true);
                    break;
                case 'Panel_Ro'://排行榜界面
                    this.Panel_Ro.setVisible(false);
                    break;
                case 'btnGXBack'://排行榜界面的关闭按钮
                    this.Panel_Ro.setVisible(false);
                    break;
                case 'Panel_Ji'://战斗记录界面
                    this.Panel_Ji.setVisible(false);
                    break;
                case 'btnJBack'://战斗记录界面的关闭按钮
                    this.Panel_Ji.setVisible(false);
                    break;
                default:
                    break;
            }
        }
    },
    //四个标签按钮的事件
    changeBtnEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type) {
            var tag = sender.getTag();
            this.changeRankBtn(tag);
            this.updateRankList(tag);
        }
    },
    //四个标签按钮切换
    changeRankBtn:function(id){
        for(var i=1;i<=4;i++){
            if(i == id){
                this["btnRank"+i].setBrightStyle(ccui.Widget.BRIGHT_STYLE_HIGH_LIGHT);
                this["btnRank"+i].setTouchEnabled(false);
            }else{
                this["btnRank"+i].setBrightStyle(ccui.Widget.BRIGHT_STYLE_NORMAL);
                this["btnRank"+i].setTouchEnabled(true);
            }
        }
    },
    //显示战斗记录
    showRecordEvent:function(){
        this.Panel_Ji.setVisible(true);
        //发送网络消息
        bothFightModel.getRecord();
    },
    //更新战斗记录list
    updateRecordList:function(data){
        this.jiLuRoList.removeAllChildren(true);
        var compare = function (a,b) {
            if(a.ts > b.ts){
                return -1;
            }
            return 1;
        };
        data.sort(compare);
        for(var i=0;i<data.length;i++){
            var wgtArr = [];
            wgtArr.push("item");   //最大的底
            wgtArr.push("itemJiLuRes");   //成功失败
            wgtArr.push("itemRankJiFen");   //积分增减
            wgtArr.push("itemJiLuName");   //名字
            wgtArr.push("itemJiLuTime");   //时间
            wgtArr.push("itemJiLuGold");   //金币
            wgtArr.push("itemRJiLuExp");   //经验

            var RankItem = ccsTool.load(res.uiVsJiLuItem,wgtArr);
            var wgt = {};
            //控件的名字赋值给wgt变量
            for(var key in RankItem.wgt){
                wgt[key] = RankItem.wgt[key];
            }
            wgt.item.removeFromParent(false);
            this.jiLuRoList.pushBackCustomItem(wgt.item);
            var Info = data[i];
            //挑战成功失败
            if(Info.type == 1){  //挑战成功
                wgt.itemJiLuRes.setString(STRINGCFG[100200].string);  //100200	挑战成功
                wgt.itemRankJiFen.setString(STRINGCFG[100200].string +"+10");   //100204	积分
            }else if(Info.type == 2){  //挑战失败
                wgt.itemJiLuRes.setString(STRINGCFG[100201].string);  //100201	挑战失败
                wgt.itemRankJiFen.setString(STRINGCFG[100201].string +"-0");   //100204	积分
            }else if(Info.type == 3){  //防守成功
                wgt.itemJiLuRes.setString(STRINGCFG[100202].string);  //100202	防守成功
                wgt.itemRankJiFen.setString(STRINGCFG[100202].string +"+0");   //100204	积分
            }else if(Info.type == 4){  //防守失败
                wgt.itemJiLuRes.setString(STRINGCFG[100203].string);  //100203	防守失败
                wgt.itemRankJiFen.setString(STRINGCFG[100203].string +"-10");   //100204	积分
            }
            //名字
            wgt.itemJiLuName.setString(Info.name);
            //时间
            wgt.itemJiLuTime.setString(Helper.formatDate(new Date(Info.ts*1000),4));
            //金币
            if(Info.gold == 0 || Info.gold == null){
                wgt.itemJiLuGold.setVisible(false);
            }else{
                wgt.itemJiLuGold.setString(STRINGCFG[100205].string + "："+Helper.formatNum(Info.gold));  //100205	金币
            }
            //经验
            if(Info.exp == 0 || Info.exp == null){
                wgt.itemRJiLuExp.setVisible(false);
            }else{
                wgt.itemRJiLuExp.setString(STRINGCFG[100130].string + "："+Info.exp);  //100130	经验
            }
        }
    },
    //三个模型的战斗
    battleEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type){
            if(this.bothNum <= 0){  //对战次数不足
                ShowTipsTool.ErrorTipsFromStringById(100206);  //100206	对战次数不足
                return;
            }
            //时间处理
            var serverTime = Helper.getServerTime();
            var date = new Date(serverTime*1000);
            var hour = date.getHours();
            //每天10:00-21:00为对战开启时间
            if(hour>=10 && hour<21){
                var tag = sender.getTag();
                bothFightModel.getBattleInfo(tag);  //获取对方的对战信息
            }else{
                ShowTipsTool.ErrorTipsFromStringById(100207);  //100207	每天10:00-21:00为对战开启时间 其他时间为保护时间，无法开启对战
            }
        }
    },
    //准备开始战斗
    readyStartBattle:function(data){
        //发送开始战斗的消息
        this.enemyId = data.id;
        this.enemyData = data;
        bothFightModel.stagebegin(this.enemyId);
    },
    //开始战斗
    StartBattle:function(){
        //开始战斗
        this.combat = new combatLayer(3, 1000000, 'both.combat',this.enemyData);
        this.addChild(this.combat, 2);
    },
    //战斗结束
    combatCallback:function(result){
        this.result = result;
        bothFightModel.sendBattle(this.enemyId,result);  //1是胜利 0是失败
    },
    //显示战斗结果
    showResult:function(data){
        var temp = {};
        temp.itemData = data;
        if(data == null){
            temp.result = 0;  //失败
        }else{
            temp.result = this.result;
        }
        temp.jifen = GLOBALDATA.both.np;  //积分
        temp.callback = this.removeCombat;
        temp.target = this;
        var _bothResLayer = new bothResLayer(temp);
        this.addChild(_bothResLayer,20);
    },
    //移除战斗界面
    removeCombat:function(){
        this.combat.removeFromParent(true);
        this.combat = null;
    },
    //购买对战次数
    buyCountEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type){
            //弹出提示框
            var event = new cc.EventCustom("TipsLayer_show");
            var strText =  StringFormat(STRINGCFG[100209].string,30); //100209	是否花费$1钻石购买掠夺次数
            var data = {string:strText, callback:this.butCountCall, target:this};
            event.setUserData(data);
            cc.eventManager.dispatchEvent(event);
        }
    },
    //购买对战次数的回调
    butCountCall:function(ttype){
        if (ttype == 1) // 确定
        {
            if(GLOBALDATA.base.diamond < 30){  //钻石不足
                ShowTipsTool.ErrorTipsFromStringById(100208);  //100208	钻石不足
                return;
            }
            if(this.bothNum >= this.maxNum){  //已经是最大的对战次数了
                ShowTipsTool.ErrorTipsFromStringById(100210);  //100210	已经达到了掠夺次数上限
                return;
            }
            bothFightModel.buyBothCount();
        }
    },
    //商店按钮的事件
    shopBuyEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type){
            //后期处理  更换商店
            var _ShopLayer = new ShopLayer();
            this.addChild(_ShopLayer,2);
        }
    },
    onExit:function(){
        this._super();
        cc.eventManager.removeListener(this.networkRankEvent);
        cc.eventManager.removeListener(this.networkRecordEvent);
        cc.eventManager.removeListener(this.networkBuyCountEvent);
        cc.eventManager.removeListener(this.networkDataUpdateEvent);
        cc.eventManager.removeListener(this.networkBattleInfoEvent);
        cc.eventManager.removeListener(this.startBattleEvent);
        cc.eventManager.removeListener(this.both_combatEvent);
        cc.eventManager.removeListener(this.battleResultEvent);
    },
});