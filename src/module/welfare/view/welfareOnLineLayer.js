
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 /**
 * 在线奖励层的创建
 */
var welfareOnLineLayer = ModalDialog.extend({
    LayerName:"welfareOnLineLayer",
    ctor:function(){
        this._super();
        this.InfoTab = {};
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
		wgtArr.push("sevenList");  //list

        var uiWelfareOnLine = ccsTool.load(res.uiWelfareOnLineLayer,wgtArr);
        //控件的名字赋值给this变量
        for(var key in uiWelfareOnLine.wgt){
            this[key] = uiWelfareOnLine.wgt[key];
        }
        this.addChild(uiWelfareOnLine.node, 2);

        this.btnBack.addTouchEventListener(this.onTouchEvent, this);  //返回按钮
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
                    self.showPanel();
                }
            }});
        cc.eventManager.addListener(this.activityFinishEvent, 1);
    },
    //显示界面的信息
    showPanel:function(){
        var list = ACTIVITYCONTROLCFG[4].subid;
        var dataArray = [];
        for(var key in list){
            var id = list[key];
            var task = GLOBALDATA.activitylist[id];
            if(task != null){
                var info = objClone(ACTIVITYCFG[id]);
                info.id = id;
                info.s = task.s;
                info.jstime = task.jstime;
                dataArray.push(info);
            }
        }
        this.sevenList.removeAllChildren(true);
        var sortArray = this.dealOnLineData(dataArray);
        for(var i=0;i<sortArray.length;i++){
            var info = sortArray[i];
            var wgtArr = [];
            wgtArr.push("bagItem");  //背景
            wgtArr.push("textItemDay");  //名称
            for(var j=1;j<=4;j++){
                wgtArr.push("bagItemBg"+j);
                wgtArr.push("bagItemIcon"+j);
                wgtArr.push("bagItemPieces"+j);
                wgtArr.push("bagItemNum"+j);
            }
            wgtArr.push("btnGet");  //领取按钮
            var item = ccsTool.load(res.uiWelOnLineItem,wgtArr);
            item.wgt.bagItem.removeFromParent(false);
            this.sevenList.pushBackCustomItem(item.wgt.bagItem);
            item.wgt.textItemDay.setString(info.name);  //名称
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
            item.wgt.btnGet.setTag(info.id);
            item.wgt.btnGet.addTouchEventListener(this.getRewardEvent, this);
            var temp = {};
            temp.info = info;
            temp.node = item.wgt.bagItem;
            this.InfoTab[info.id] = temp;
        }
        this.refreshTime(0);
    },
    //处理在线奖励的数据
    dealOnLineData:function(dataArray){
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
        this.schedule(this.refreshTime,1,cc.REPEAT_FOREVER);
    },
    refreshTime:function(dt){
        var isWan = true;  //已经全部完成
        var nowtime = Helper.getServerTime();
        for(var key in this.InfoTab){
            var info = this.InfoTab[key].info;
            var node = this.InfoTab[key].node;
            var obj = ccsTool.seekWidget(node,["textTipsHad","btnGet","btnNo","textTimeGet"]);
            if(info.s == 3){ //已领取
                obj.wgt.textTipsHad.setVisible(true);  //已领取
                obj.wgt.btnGet.setVisible(false);  //可领取
                obj.wgt.btnNo.setVisible(false); //未完成
            }else if(info.s == 2){  //可领取
                obj.wgt.textTipsHad.setVisible(false);  //已领取
                obj.wgt.btnGet.setVisible(true);  //可领取
                obj.wgt.btnNo.setVisible(false);  //未完成
            }else{
                var last_time = info.jstime - nowtime;
                if(last_time <= 0){  //已经可以领取了
                    obj.wgt.textTipsHad.setVisible(false);  //已领取
                    obj.wgt.btnGet.setVisible(true);  //可领取
                    obj.wgt.btnNo.setVisible(false);  //未完成
                }else{
                    isWan = false;
                    obj.wgt.textTipsHad.setVisible(false);  //已领取
                    obj.wgt.btnGet.setVisible(false);  //可领取
                    obj.wgt.btnNo.setVisible(true);  //未完成
                    var strText = StringFormat(STRINGCFG[100295].string,Helper.formatTime(last_time));  //100295	$1后可领取
                    obj.wgt.textTimeGet.setString(strText);
                }
            }
        }
        if(isWan){
            this.unschedule(this.refreshTime);
        }
    },
    //领取奖励的按钮
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