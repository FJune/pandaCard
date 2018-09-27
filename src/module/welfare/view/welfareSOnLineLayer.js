
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 /**
 * 开服在线礼包层的创建
 */
var welfareSOnLineLayer = ModalDialog.extend({
    LayerName:"welfareSOnLineLayer",
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
		for(var i=1;i<=4;i++){
			 wgtArr.push("bagItemBg"+i);
			 wgtArr.push("bagItemIcon"+i);
			 wgtArr.push("bagItemPieces"+i);
			 wgtArr.push("bagItemNum"+i);
			 wgtArr.push("textItemName"+i);
		}
		wgtArr.push("B_get");  //领取按钮
        wgtArr.push("timeBg");  //时间背景
		wgtArr.push("Text_time");  //倒计时时间
        var uiWelfareLv = ccsTool.load(res.uiWelfareSOnLineLayer,wgtArr);
        //控件的名字赋值给this变量
        for(var key in uiWelfareLv.wgt){
            this[key] = uiWelfareLv.wgt[key];
        }
        this.addChild(uiWelfareLv.node, 2);

        this.btnBack.addTouchEventListener(this.onTouchEvent, this);  //返回按钮
        this.B_get.addTouchEventListener(this.getRewardEvent, this);  //领取按钮
    },
    initCustomEvent:function(){
        var self = this;
        //领取奖励
        this.activityFinishEvent = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "activity.finish",
            callback: function(event){
                var resData = event.getUserData();
                if(resData.status == 0){
                    self.removeFromParent(true);
                }
            }});
        cc.eventManager.addListener(this.activityFinishEvent, 1);
    },
    //显示界面的信息
    showPanel:function(){
        var list = ACTIVITYCONTROLCFG[6].subid;
        var info = null;
        for(var key in list){
            var id = list[key];
            var task = GLOBALDATA.activitylist[id];
            if(task != null){
                info = objClone(ACTIVITYCFG[id]);
                info.id = id;
                info.s = task.s;
                info.jstime = task.jstime;
                break;
            }
        }
        this.Info = info;
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
        this.B_get.setTag(info.id);
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
        var info = this.Info;
        if(info.s == 3){
            this.B_get.setVisible(false);
            this.timeBg.setVisible(false);
            this.unschedule(this.refreshTime);
        }else if(info.s == 2){
            this.B_get.setVisible(true);
            this.B_get.setBright(true);
            this.B_get.setTouchEnabled(true);
            this.timeBg.setVisible(false);
            this.unschedule(this.refreshTime);
        }else if(info.s == 1){
            var jstime = info.jstime;
            var nowtime = Helper.getServerTime();
            var last_time = jstime - nowtime;
            if(last_time>0){
                this.B_get.setVisible(true);
                this.B_get.setBright(false);
                this.B_get.setTouchEnabled(false);
                this.timeBg.setVisible(true);
                this.Text_time.setString(Helper.formatTime(last_time));
            }else{
                this.B_get.setVisible(true);
                this.B_get.setBright(true);
                this.B_get.setTouchEnabled(true);
                this.timeBg.setVisible(false);
                this.unschedule(this.refreshTime);
            }
        }
    },
    //领取按钮
    getRewardEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED == type){
            var id = sender.getTag();
            if(GLOBALDATA.activitylist[id] != null && GLOBALDATA.activitylist[id].s != 2){
                welfareModel.activityRefresh();
            }
            welfareModel.activityFinish(id);
        }
    },
    //奖励物品的点击事件
    itemSeeEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED == type){
            var id = sender.getTag();
            showInitialItemPreview(this,id);   //初始物品的预览
        }
    },
    onExit:function () {
        this._super();
        cc.eventManager.removeListener(this.activityFinishEvent);
    }
});