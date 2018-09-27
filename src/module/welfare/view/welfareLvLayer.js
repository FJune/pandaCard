
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 /**
 * 等级特惠礼包层的创建
 */
var welfareLvLayer = ModalDialog.extend({
    LayerName:"welfareLvLayer",
    ctor:function(){
        this._super();
        this.Info = null;  //当前的信息
    },

    onEnter:function(){
        this._super();
    },
    //初始化ui
    initUI:function(){
        this.customWidget(); //自定义Widget
        this.initCustomEvent();
        this.showPanel();
        this.updateTime();   //更新回复时间
    },
    //自定义Widget
    customWidget:function () {
        var wgtArr = [];
        wgtArr.push("btnBack");  //返回按钮
		wgtArr.push("textLv");  //标题
		for(var i=1;i<=4;i++){
			 wgtArr.push("bagItemBg"+i);
			 wgtArr.push("bagItemIcon"+i);
			 wgtArr.push("bagItemPieces"+i);
			 wgtArr.push("bagItemNum"+i);
			 wgtArr.push("textItemName"+i);
		}
		wgtArr.push("diamongValue1");  //原价
		wgtArr.push("diamongValue2");  //现价
		wgtArr.push("B_buy");  //购买按钮
        wgtArr.push("timeBg");  //时间背景
		wgtArr.push("Text_time");  //倒计时时间
        var uiWelfareLv = ccsTool.load(res.uiWelfareLvLayer,wgtArr);
        //控件的名字赋值给this变量
        for(var key in uiWelfareLv.wgt){
            this[key] = uiWelfareLv.wgt[key];
        }
        this.addChild(uiWelfareLv.node, 2);

        this.btnBack.addTouchEventListener(this.onTouchEvent, this);  //返回按钮
        this.B_buy.addTouchEventListener(this.getRewardEvent, this);  //购买按钮
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
                    self.resourceGet(event.getUserData());
                    self.removeFromParent(true);
                }
            }});
        cc.eventManager.addListener(this.activityOptEvent, 1);
    },
    //显示界面的信息
    showPanel:function(){
        var list = ACTIVITYCONTROLCFG[3].subid;
        var info = null;
        for(var key in list){
            var id = list[key];
            var task = GLOBALDATA.activitylist[id];
            if(task != null){
                info = objClone(ACTIVITYCFG[id]);
                info.id = id;
                info.s = task.s;
                info.et = task.et;
                break;
            }
        }
        this.Info = info;
        this.textLv.setString(info.name);
        //奖励
        var count =1;
        for(var i=1;i<=4;i++){
            var reward = info.reward[i-1];
            if(reward != null){
                var itemCfg = Helper.findItemId(reward[0]);
                Helper.LoadIconFrameAndAddClick(this["bagItemIcon"+i],this["bagItemBg"+i],this["bagItemPieces"+i],itemCfg);  //物品
                this["bagItemNum"+i].setString(Helper.formatNumFloor(reward[1]));  //数量
                this["textItemName"+i].setString(itemCfg.itemname);
                Helper.setNamecolorByQuality(this["textItemName"+i],itemCfg.quality);
                this["bagItemBg"+i].setTag(reward[0]);
                this["bagItemBg"+i].addTouchEventListener(this.itemSeeEvent, this);
                count++;
            }
        }
        for(var i=count;i<=4;i++){
            this["bagItemBg"+i].setVisible(false);
        }
        this.diamongValue1.setString(info.ycost[1]);   //原价
        this.diamongValue2.setString(info.cost[1]);   //现价
        if(info.s == 1){
            this.B_buy.setVisible(true);
        }else{
            this.B_buy.setVisible(false);
        }
        this.B_buy.setTag(info.id);
    },
    onTouchEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED == type){
            switch(sender.name) {
                case "btnBack":
                    this.removeFromParent(true);
                    break;
            }
        }
    },
    //更新时间
    updateTime:function(){
        this.refreshTime();
        this.schedule(this.refreshTime,1,cc.REPEAT_FOREVER);
    },
    refreshTime:function () {
        var et = this.Info.et;
        var nowtime = Helper.getServerTime();
        var last_time = et - nowtime;
        if(last_time>0){
            this.timeBg.setVisible(true);
            this.Text_time.setString(Helper.formatTime(last_time));
        }else{
            this.timeBg.setVisible(false);
            this.unschedule(this.refreshTime);
        }
    },
    //购买按钮
    getRewardEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED == type){
            var cost = this.Info.cost[1];
            if(cost > GLOBALDATA.base.diamond){
                ShowTipsTool.ErrorTipsFromStringById(100079);  //100079	钻石不足
            }else{
                var id = sender.getTag(); //购买
                welfareModel.activityOpt(id,2);
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
    resourceGet:function(data){
        if(data != undefined && data.data != undefined)
        {
            data.task = 'resource.get';

            var event = new cc.EventCustom(data.task);
            event.setUserData(data);
            cc.eventManager.dispatchEvent(event);
        }
    },
    onExit:function () {
        this._super();
        cc.eventManager.removeListener(this.activityOptEvent);
    }
});