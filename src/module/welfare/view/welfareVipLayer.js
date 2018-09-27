
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 /**
 * VIP福利层的创建
 */
var welfareVipLayer = ModalDialog.extend({
    LayerName:"welfareVipLayer",
    ctor:function(){
        this._super();
        this.type = 1;  //分页的类型
    },

    onEnter:function(){
        this._super();
    },
    //初始化ui
    initUI:function(){
        this.customWidget(); //自定义Widget
        this.initCustomEvent();
        this.changeButton(1);
    },
    //自定义Widget
    customWidget:function () {
        var wgtArr = [];
        wgtArr.push("btnBack");  //返回按钮
		wgtArr.push("Text_day");  //每日刷新说明
		wgtArr.push("Text_week");  //每周刷新说明
		wgtArr.push("Button_common");  //每日任务按钮
        wgtArr.push("Button_elite");  //每周礼包按钮
		wgtArr.push("sevenList");  //list
        wgtArr.push("tipsImage1");  //红点
        var uiWelfareVip = ccsTool.load(res.uiWelfareVipLayer,wgtArr);
        //控件的名字赋值给this变量
        for(var key in uiWelfareVip.wgt){
            this[key] = uiWelfareVip.wgt[key];
        }
        this.addChild(uiWelfareVip.node, 2);

        this.btnBack.addTouchEventListener(this.onTouchEvent, this);  //返回按钮
        this.Button_common.addTouchEventListener(this.onTouchEvent, this);  //每日任务按钮
        this.Button_elite.addTouchEventListener(this.onTouchEvent, this);  //每周礼包按钮
    },
    initCustomEvent:function(){
        var self = this;
        //购买商品
        this.activityOptEvent = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "activity.opt",
            callback: function(event){
                var resData = event.getUserData();
                if(resData.status == 0){
                    self.changeButton(self.type);
                }
            }});
        cc.eventManager.addListener(this.activityOptEvent, 1);
        //领取奖励
        this.activityFinishEvent = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "activity.finish",
            callback: function(event){
                var resData = event.getUserData();
                if(resData.status == 0){
                    self.changeButton(self.type);
                }
            }});
        cc.eventManager.addListener(this.activityFinishEvent, 1);
    },
    onTouchEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED == type){
            switch(sender.name) {
                case "btnBack":
                    this.removeFromParent(true);
                    break;
                case "Button_common":  //每日任务按钮
                    this.changeButton(1);
                    break;
                case "Button_elite":  //每周礼包按钮
                    this.changeButton(2);
                    break;
            }
        }
    },
    //切换按钮
    changeButton:function(type){
        this.type = type;
        if(type == 1){
            this.showCommon();  //每日任务按钮
        }else if(type == 2){
            this.showElite();   //每周礼包按钮
        }
        //处理红点
        this.dealRedPoint();
    },
    //每日任务的按钮事件
    showCommon:function(){
        this.Button_common.setBrightStyle(ccui.Widget.BRIGHT_STYLE_HIGH_LIGHT);
        this.Button_common.setTouchEnabled(false);
        this.Button_elite.setBrightStyle(ccui.Widget.BRIGHT_STYLE_NORMAL);
        this.Button_elite.setTouchEnabled(true);
        this.Text_day.setVisible(true);
        this.Text_week.setVisible(false);
        this.dealList(this.type);  //生成list数据
    },
    //每周礼包的按钮事件
    showElite:function(){
        this.Button_common.setBrightStyle(ccui.Widget.BRIGHT_STYLE_NORMAL);
        this.Button_common.setTouchEnabled(true);
        this.Button_elite.setBrightStyle(ccui.Widget.BRIGHT_STYLE_HIGH_LIGHT);
        this.Button_elite.setTouchEnabled(false);
        this.Text_day.setVisible(false);
        this.Text_week.setVisible(true);
        this.dealList(this.type);  //生成list数据
    },
    //生成list数据
    dealList:function(type){
        var dataArray = [];
        if(type == 1){  //每日任务
            var list = ACTIVITYCONTROLCFG[9].subid;
            var count = 0;
            //现在的
            var nowinfo = null;
            for(var i = 0;i<list.length;i++){
                count++;
                var id = list[i];
                var task = GLOBALDATA.activitylist[id];
                var info = ACTIVITYCFG[id];
                if(task != null && info != null && info.cf[0][1] == GLOBALDATA.base.vip){
                    var temp = objClone(info);
                    temp.id = id;
                    temp.s = task.s;
                    nowinfo = temp;
                    dataArray.push(nowinfo);
                    break;
                }
            }
            //下一个的
            if(list[count] != null){
                var id = list[count];
                var temp = objClone(ACTIVITYCFG[id]);
                temp.id = id;
                temp.s = 1;
                dataArray.push(temp);
            }
            this.showList(type,dataArray);  //显示list
        }else if(type == 2){  //每周礼包
            var list = ACTIVITYCONTROLCFG[10].subid;
            for(var key in list){
                var id = list[key];
                var task = GLOBALDATA.activitylist[id] || {};
                var temp = objClone(ACTIVITYCFG[id]);
                temp.id = id;
                temp.s = task.s || 1;
                temp.g = task.g || 0;
                dataArray.push(temp);
            }
            var sortArray = this.dealTaskData(dataArray);
            this.showList(type,sortArray);  //显示list
        }
    },
    //显示list
    showList:function(type,dataArray){
        this.sevenList.removeAllChildren(true);
        //处理item
        for(var i=0;i<dataArray.length;i++){
            var info = dataArray[i];
            var wgtArr = [];
            wgtArr.push("bagItem");  //背景
            wgtArr.push("textItemDay");  //描述
            wgtArr.push("textItemDayNum");  //进度
			wgtArr.push("textItemCost");  //花费
            wgtArr.push("textTipsHad");  //已领取
            wgtArr.push("textTipsHadb");  //已购买
            wgtArr.push("btnGet");  //领取
			wgtArr.push("btnBuy");  //购买
			wgtArr.push("btnChong");  //充值
            //四种奖励物品
            for(var j=1;j<=4;j++){
                wgtArr.push("bagItemBg"+j);
                wgtArr.push("bagItemIcon"+j);
                wgtArr.push("bagItemPieces"+j);
                wgtArr.push("bagItemNum"+j);
            }
            var item = ccsTool.load(res.uiWelVipItem,wgtArr);
            item.wgt.bagItem.removeFromParent(false);
            this.sevenList.pushBackCustomItem(item.wgt.bagItem);

            item.wgt.textItemDay.setString(info.name);  //描述
            if(type == 1){
                item.wgt.textItemDayNum.setVisible(false);  //进度
                item.wgt.textItemCost.setVisible(false);  //花费
                if(info.s == 3){  //已领取
                    item.wgt.textTipsHad.setVisible(true);  //已领取
                    item.wgt.textTipsHadb.setVisible(false);  //已购买
                    item.wgt.btnGet.setVisible(false);  //领取
                    item.wgt.btnBuy.setVisible(false);   //购买
                    item.wgt.btnChong.setVisible(false);  //充值
                }else if(info.s == 2){
                    item.wgt.textTipsHad.setVisible(false);  //已领取
                    item.wgt.textTipsHadb.setVisible(false);  //已购买
                    item.wgt.btnGet.setVisible(true);  //领取
                    item.wgt.btnBuy.setVisible(false);   //购买
                    item.wgt.btnChong.setVisible(false);  //充值
                }else{
                    item.wgt.textTipsHad.setVisible(false);  //已领取
                    item.wgt.textTipsHadb.setVisible(false);  //已购买
                    item.wgt.btnGet.setVisible(false);  //领取
                    item.wgt.btnBuy.setVisible(false);   //购买
                    item.wgt.btnChong.setVisible(true);  //充值
                }
            }else if(type == 2){
                item.wgt.textItemDayNum.setString("("+info.g+"/"+info.num+")");  //进度
                item.wgt.textItemCost.setString(info.cost[1]);  //花费
                item.wgt.textItemDayNum.setVisible(true);  //进度
                item.wgt.textItemCost.setVisible(true);  //花费
                if(info.s == 3){  //已购买
                    item.wgt.textTipsHad.setVisible(false);  //已领取
                    item.wgt.textTipsHadb.setVisible(true);  //已购买
                    item.wgt.btnGet.setVisible(false);  //领取
                    item.wgt.btnBuy.setVisible(false);   //购买
                    item.wgt.btnChong.setVisible(false);  //充值
                }else{
                    item.wgt.textTipsHad.setVisible(false);  //已领取
                    item.wgt.textTipsHadb.setVisible(false);  //已购买
                    item.wgt.btnGet.setVisible(false);  //领取
                    item.wgt.btnBuy.setVisible(true);   //购买
                    item.wgt.btnChong.setVisible(false);  //充值
                }
            }
            //奖励
            var count =1;
            for(var j=1;j<=4;j++){
                var reward = info.reward[j-1];
                if(reward != null){
                    var itemCfg = Helper.findItemId(reward[0]);
                    Helper.LoadIconFrameAndAddClick(item.wgt["bagItemIcon"+j],item.wgt["bagItemBg"+j],item.wgt["bagItemPieces"+j],itemCfg);  //物品
                    item.wgt["bagItemNum"+j].setString(Helper.formatNumFloor(reward[1]));  //数量
                    item.wgt["bagItemBg"+j].setTag(reward[0]);
                    item.wgt["bagItemBg"+j].addTouchEventListener(this.itemSeeEvent, this);
                    count++;
                }
            }
            for(var j=count;j<=4;j++){
                item.wgt["bagItemBg"+j].setVisible(false);
            }
            //领取按钮的tag值
            item.wgt.btnGet.setTag(info.id);
            item.wgt.btnGet.addTouchEventListener(this.getRewardEvent, this);
            //购买按钮的tag值
            item.wgt.btnBuy.setTag(info.id);
            item.wgt.btnBuy.addTouchEventListener(this.buyRewardEvent, this);
            //充值按钮
            item.wgt.btnChong.addTouchEventListener(this.RechargeEvent, this);
        }
    },
    //处理任务数据
    dealTaskData:function(dataArray){
        var result = [];
        var wei = [];  //未完成
        var get = [];  //领取
        var yi = [];   //已领取
        for(var key in dataArray){
            if(dataArray[key].s == 3){
                yi.push(dataArray[key]);
            }else if(dataArray[key].s == 2){
                get.push(dataArray[key]);
            }else{
                wei.push(dataArray[key]);
            }
        }
        for(var key in get){
            result.push(get[key]);
        }
        for(var key in wei){
            result.push(wei[key]);
        }
        for(var key in yi){
            result.push(yi[key]);
        }
        return result;
    },
    //领取按钮
    getRewardEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED == type){
            var id = sender.getTag();
            welfareModel.activityFinish(id);
        }
    },
    //购买按钮
    buyRewardEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED == type){
            var id = sender.getTag();
            var vip = ACTIVITYCFG[id].cf[0][1];
            if(vip > GLOBALDATA.base.vip){
                ShowTipsTool.ErrorTipsFromStringById(100131);  //100131	vip等级不满足条件
            }else{
                var info = ACTIVITYCFG[id];
                var task = GLOBALDATA.activitylist[id] || {};
                var jindu = task.g || 0;
                if(info.stype == 2 && info.reward.length == 1){
                    var shopBuyLayer = new ShopBuyLayer(999,id,id,info.reward[0][0],info.reward[0][1],info.cost[0],info.cost[1],info.num - jindu);
                    this.addChild(shopBuyLayer,100);
                }else if(info.stype == 2 && info.reward.length > 1){
                    var itemIdTab = [];
                    var itemNumTab = [];
                    for(var key in info.reward){
                        var reward = info.reward[key];
                        itemIdTab.push(reward[0]);
                        itemNumTab.push(reward[1]);
                    }
                    var _shopBuyMLayer = new shopBuyMLayer(999,id,itemIdTab,itemNumTab,info.cost[0],info.cost[1],info.num - jindu);
                    this.addChild(_shopBuyMLayer,100);
                }else if(info.stype == 3){
                    var itemInfo = {};
                    itemInfo.id = id;
                    itemInfo.itemidTab = [];
                    itemInfo.itemnumTab = [];
                    for(var key in info.reward){
                        var reward = info.reward[key];
                        itemInfo.itemidTab.push(reward[0]);
                        itemInfo.itemnumTab.push(reward[1]);
                    }
                    itemInfo.pricetype = info.cost[0];
                    itemInfo.price = info.cost[1];
                    itemInfo.maxnum = info.num - jindu;
                    var _itemChooseLayer = new itemChooseLayer(2,null,itemInfo);
                    this.addChild(_itemChooseLayer,100);
                }
            }
        }
    },
    //充值按钮
    RechargeEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED == type){
            //后期处理
        }
    },
    //奖励物品的点击事件
    itemSeeEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED == type){
            var id = sender.getTag();
            showInitialItemPreview(this,id);   //初始物品的预览
        }
    },
    //处理红点
    dealRedPoint:function(data){
        var redInfo = welfareRedPoint.WelVipPanelRedPoint(data);
        if(redInfo != null){
            if(redInfo){
                this.tipsImage1.setVisible(true);
            }else{
                this.tipsImage1.setVisible(false);
            }
        }
    },
    onExit:function () {
        this._super();
        cc.eventManager.removeListener(this.activityOptEvent);
        cc.eventManager.removeListener(this.activityFinishEvent);
    }
});