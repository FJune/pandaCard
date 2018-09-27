
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 /**
 * 成长基金层的创建
 */
var welfareChengZLayer = ModalDialog.extend({
    LayerName:"welfareChengZLayer",
    ctor:function(){
        this._super();
    },

    onEnter:function(){
        this._super();
    },
    //初始化ui
    initUI:function(){
        this.customWidget(); //自定义Widget
        this.initCustomEvent();
        this.changeButton(1);
        this.sendActivityRefresh();  //发送刷新活动的消息
        //处理红点
        this.dealRedPoint();
    },
    //自定义Widget
    customWidget:function () {
        var wgtArr = [];
        wgtArr.push("btnBack");  //返回按钮
		wgtArr.push("Button_common");  //成长基金的按钮
		wgtArr.push("Button_elite");  //全民福利的按钮
		wgtArr.push("Node_jijin");  //成长基金的node
		wgtArr.push("Node_fuli");  //全民福利的node
		wgtArr.push("btnBuy");  //购买按钮
		wgtArr.push("textTipsHad");  //已购买标签
		wgtArr.push("textPNum");  //购买人数
		wgtArr.push("sevenList");  //list
        //三个红点
        for(var i=1;i<=3;i++){
            wgtArr.push("TipsImage"+i);
        }
		
        var uiWelfareChengZ = ccsTool.load(res.uiWelfareChengZLayer,wgtArr);
        //控件的名字赋值给this变量
        for(var key in uiWelfareChengZ.wgt){
            this[key] = uiWelfareChengZ.wgt[key];
        }
        this.addChild(uiWelfareChengZ.node, 2);

        this.btnBack.addTouchEventListener(this.onTouchEvent, this);  //返回按钮
        this.Button_common.addTouchEventListener(this.onTouchEvent, this);  //成长基金的按钮
        this.Button_elite.addTouchEventListener(this.onTouchEvent, this);  //全民福利的按钮
        this.btnBuy.addTouchEventListener(this.buyJijinEvent, this);  //购买按钮
    },
    initCustomEvent:function(){
        var self = this;
        //购买基金
        this.activityBuyfundEvent = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "activity.buyfund",
            callback: function(event){
                var resData = event.getUserData();
                if(resData.status == 0){
                    self.changeButton(self.type);
                    self.sendActivityRefresh();  //发送刷新活动的消息
                }
            }});
        cc.eventManager.addListener(this.activityBuyfundEvent, 1);
        //领取基金奖励
        this.activityFundrewardEvent = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "activity.fundreward",
            callback: function(event){
                var resData = event.getUserData();
                if(resData.status == 0){
                    self.changeButton(self.type);
                }
            }});
        cc.eventManager.addListener(this.activityFundrewardEvent, 1);
        //刷新活动数据
        this.activityRefreshEvent = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "activity.refresh",
            callback: function(event){
                var resData = event.getUserData();
                if(resData.status == 0){
                    self.changeButton(self.type);
                }
            }});
        cc.eventManager.addListener(this.activityRefreshEvent, 1);
    },
    onTouchEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED == type){
            switch(sender.name) {
                case "btnBack":  //返回按钮
                    this.removeFromParent(true);
                    break;
                case "Button_common":  //成长基金按钮
                    this.changeButton(1);
                    break;
                case "Button_elite":  //全民福利按钮
                    this.changeButton(2);
                    break;
            }
        }
    },
    //发送刷新活动的消息
    sendActivityRefresh:function(){
        welfareModel.activityRefresh();
    },
    //切换按钮
    changeButton:function(type){
        this.type = type;
        if(type == 1){
            this.showCommon();  //成长基金的按钮事件
        }else if(type == 2){
            this.showElite();   //全民福利的按钮事件
        }
    },
    //成长基金的按钮事件
    showCommon:function(){
        this.Button_common.setBrightStyle(ccui.Widget.BRIGHT_STYLE_HIGH_LIGHT);
        this.Button_common.setTouchEnabled(false);
        this.Button_elite.setBrightStyle(ccui.Widget.BRIGHT_STYLE_NORMAL);
        this.Button_elite.setTouchEnabled(true);
        this.Node_jijin.setVisible(true);
        this.Node_fuli.setVisible(false);
        this.showBuyState();    //显示购买的状态
        this.showList(this.type);  //显示list
    },
    //全民福利的按钮事件
    showElite:function(){
        this.Button_common.setBrightStyle(ccui.Widget.BRIGHT_STYLE_NORMAL);
        this.Button_common.setTouchEnabled(true);
        this.Button_elite.setBrightStyle(ccui.Widget.BRIGHT_STYLE_HIGH_LIGHT);
        this.Button_elite.setTouchEnabled(false);
        this.Node_jijin.setVisible(false);
        this.Node_fuli.setVisible(true);
        this.showBuyState();    //显示购买的状态
        //购买人数
        if(GLOBALDATA.activitylist.fundnum >= 9999){
            this.textPNum.setString(9999);
        }else{
            this.textPNum.setString(GLOBALDATA.activitylist.fundnum);
        }
        this.showList(this.type);  //显示list
    },
    //显示购买的状态
    showBuyState:function(){
        if(GLOBALDATA.base.fund == 1){  //已购买
            this.btnBuy.setVisible(false);
            this.textTipsHad.setVisible(true);
        }else{
            this.btnBuy.setVisible(true);
            this.textTipsHad.setVisible(false);
        }
    },
    //显示list
    showList:function(type){
        this.sevenList.removeAllChildren(true);
        var subtype = 0;
        var jindu = 0;
        if(type == 1){  //成长基金
            subtype = 2;
            jindu = GLOBALDATA.base.lev;
        }else if(type == 2){ //全民福利
            subtype = 3;
            jindu = GLOBALDATA.activitylist.fundnum;
        }
        //生成数据
        var dataArray = [];
        for(var key in GROWTHFUNDCFG){
            var info = GROWTHFUNDCFG[key];
            if(info.type == subtype){
                var temp = objClone(info);
                //进度和领取情况
                if(jindu >= info.num){
                    temp.jindu = info.num;
                    if(GLOBALDATA.base.fund == 1){
                        if(GLOBALDATA.base.fundreward[info.id] == null){
                            temp.s = 2;
                        }else{
                            temp.s = 3;
                        }
                    }else{
                        temp.s = 1;
                    }
                }else{
                    temp.jindu = jindu;
                    temp.s = 1;
                }
                dataArray.push(temp);
            }
        }
        var sortArray = this.dealTaskData(dataArray);  //排序
        //处理item
        for(var i=0;i<sortArray.length;i++){
            var info = sortArray[i];
            var wgtArr = [];
            wgtArr.push("bagItem");  //背景
            wgtArr.push("textItemDay");  //描述
            wgtArr.push("textItemDayNum");  //进度
            wgtArr.push("textTipsNo");  //未完成
            wgtArr.push("textTipsHad");  //已领取
            wgtArr.push("btnGet");  //领取
            //四种奖励物品
            for(var j=1;j<=4;j++){
                wgtArr.push("bagItemBg"+j);
                wgtArr.push("bagItemIcon"+j);
                wgtArr.push("bagItemPieces"+j);
                wgtArr.push("bagItemNum"+j);
            }
            var item = ccsTool.load(res.uiWelChengZItem,wgtArr);
            item.wgt.bagItem.removeFromParent(false);
            this.sevenList.pushBackCustomItem(item.wgt.bagItem);

            item.wgt.textItemDay.setString(info.des);  //描述
            item.wgt.textItemDayNum.setString("("+info.jindu+"/"+info.num+")");
            //奖励
            var count =1;
            for(var j=1;j<=4;j++){
                var reward = info.project[j-1];
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
            if(info.s == 1){  //未完成
                item.wgt.textTipsNo.setVisible(true);
                item.wgt.textTipsHad.setVisible(false);
                item.wgt.btnGet.setVisible(false);
            }else if(info.s == 2){  //领取
                item.wgt.textTipsNo.setVisible(false);
                item.wgt.textTipsHad.setVisible(false);
                item.wgt.btnGet.setVisible(true);
            }else if(info.s == 3){  //已领取
                item.wgt.textTipsNo.setVisible(false);
                item.wgt.textTipsHad.setVisible(true);
                item.wgt.btnGet.setVisible(false);
            }
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
    //购买按钮
    buyJijinEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED == type){
            var cost = 0;
            for(var key in GROWTHFUNDCFG){
                if(GROWTHFUNDCFG[key].type == 1){
                    cost = GROWTHFUNDCFG[key].num;
                    break;
                }
            }
            if(cost > GLOBALDATA.base.diamond){
                ShowTipsTool.ErrorTipsFromStringById(100079);  //100079	钻石不足
            }else{
                welfareModel.activityBuyfund();
            }
        }
    },
    //奖励物品的点击事件
    itemSeeEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED == type){
            var id = sender.getTag();
			showInitialItemPreview(this,id);   //初始物品的预览
        }
    },
    //领取按钮的事件
    getRewardEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED == type){
            var id = sender.getTag();
            welfareModel.activityFundreward(id);
        }
    },
    //处理红点
    dealRedPoint:function(data){
        var redInfo = welfareRedPoint.WelChengZPanelRedPoint(data);
        if(redInfo != null){
            for(var i=1;i<=3;i++){
                this["TipsImage"+i].setVisible(false);
            }
            for(var key in redInfo){
                var id = redInfo[key];
                this["TipsImage"+id].setVisible(true);
            }
        }
    },
    onExit:function () {
        this._super();
        cc.eventManager.removeListener(this.activityBuyfundEvent);
        cc.eventManager.removeListener(this.activityFundrewardEvent);
        cc.eventManager.removeListener(this.activityRefreshEvent);
    }
});