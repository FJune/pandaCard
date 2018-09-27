
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 /**
 * 超级福利层的创建
 */
var WelfareLayer = ModalDialog.extend({
    ctor:function(){
        this._super();
        this.LayerName = "WelfareLayer";
        this.btnTabs = [];
    },

    onEnter:function(){
        this._super();
    },

    initUI:function(){
        this.obj = ccsTool.load(res.uiWelfareLayer, ["btnBack", "dayButton", "dayTips"]);
        this.addChild(this.obj.node, 2);

        this.obj.wgt.btnBack.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.dayButton.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.dayButton.setTag(2);

        this.obj.wgt.dayTips.setVisible(false);

        this.btnTabs.push(this.obj.wgt.dayButton);

        this.sendRefresh();  //发送刷新的请求
        this.doAddListener();
        this.showView();
    },

    doAddListener:function(){
        var self = this;
        // 领取奖励
        this.activity_finish = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "activity.finish",
            callback: function(event){
                var resData = event.getUserData();
                if(resData.status == 0){
                    self.showView();
                    self.resourceGet(event.getUserData());
                }
            }});
        cc.eventManager.addListener(this.activity_finish, 1);
        // 领取奖励
        this.activity_monthreward = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "activity.monthreward",
            callback: function(event){
                var resData = event.getUserData();
                if(resData.status == 0){
                    self.showView();
                    self.resourceGet(event.getUserData());
                }
            }});
        cc.eventManager.addListener(this.activity_monthreward, 1);
        //购买商品
        this.activityOptEvent = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "activity.opt",
            callback: function(event){
                var resData = event.getUserData();
                if(resData.status == 0){
                    self.showView();
                }
            }});
        cc.eventManager.addListener(this.activityOptEvent, 1);
        //领取基金奖励
        this.activityFundrewardEvent = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "activity.fundreward",
            callback: function(event){
                var resData = event.getUserData();
                if(resData.status == 0){
                    self.showView();
                    self.resourceGet(event.getUserData());
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
                    self.showView();
                }
            }});
        cc.eventManager.addListener(this.activityRefreshEvent, 1);
    },
    //发送刷新的请求
    sendRefresh:function () {
        welfareModel.activityRefresh();
    },
    showView:function(){
        for (var len = this.btnTabs.length; len > 0; len-- )
        {
            var button = this.btnTabs.pop();
            button.removeFromParent(true);
        }

        // 签到的提示
        var svrTime = GLOBALDATA.svrTime * 1000 + (Date.parse(new Date()) - GLOBALDATA.loginTime) ;
        var max = (new Date(svrTime)).getDate();
        var msign = GLOBALDATA.base.msign || 0;
        var mreward = GLOBALDATA.base.mreward || 0;
        this.obj.wgt.dayTips.setVisible(msign < max && mreward == 0);


        var activitylist = GLOBALDATA.activitylist || {};
        var plist = activitylist.p || [];
        for (var key in plist)
        {
            var id = plist[key];
            var cfg = ACTIVITYCONTROLCFG[id];
            if (cfg && cfg.type == 5 && id != 10)  //10为vip每周礼包和9使用同一个
            {
                var button = this.obj.wgt.dayButton.clone();
                var path = "common/c1/" + cfg.icon;
                button.loadTextures(path, path, path, ccui.Widget.PLIST_TEXTURE);
                button.setTag(cfg.ID);
                var dayTips = ccui.helper.seekWidgetByName(button, "dayTips");
                dayTips.setVisible(false);
                var Text_time = ccui.helper.seekWidgetByName(button, "Text_time");
                Text_time.setVisible(false);
                this.dealTime(id,Text_time);  //处理时间
                this.obj.node.addChild(button);
                this.btnTabs.push(button);
            }
        }

        var count = 0;
        for (var key in this.btnTabs)
        {
            this.btnTabs[key].setPosition(141 + (count % 4) * 120, 626 + Math.floor(count / 4) * (-130));
            count ++;
        }
        //处理红点
        this.dealRedPoint();
    },

    //处理时间
    dealTime:function(id,node){
        if(id == 3 || id == 7 || id == 8){ //3 等级特惠礼包  7 开服特惠礼包 8 开服红利
            var time = 0;
            var list = ACTIVITYCONTROLCFG[id].subid;
            for(var key in list){
                var id = list[key];
                var task = GLOBALDATA.activitylist[id];
                if(task != null){
                    time = task.et;
                    break;
                }
            };
            var self = this;
            var refreshTime = function () {
                var nowtime = Helper.getServerTime();
                var last_time = time - nowtime;
                if(last_time>0){
                    node.setVisible(true);
                    node.setString(Helper.formatTime(last_time));
                }else{
                    node.setVisible(false);
                    self.unschedule(refreshTime);
                }
            };
            refreshTime();
            this.schedule(refreshTime,1,cc.REPEAT_FOREVER);
        }else if(id == 4){  //在线奖励
            var list = ACTIVITYCONTROLCFG[id].subid;
            var nowtime = Helper.getServerTime();
            var taskArray = {};
            for(var key in list){
                var id = list[key];
                var task = GLOBALDATA.activitylist[id];
                var info = ACTIVITYCFG[id];
                if(task != null){
                    if(task.jstime == null){
                        task.jstime = nowtime + info.mb[0][1] - task.g;
                    }
                    taskArray[id] = task;
                }
            }
            var self = this;
            var refreshTime = function(){
                var isDo = false;
                var nowtime = Helper.getServerTime();
                for(var key in taskArray){
                    var task = taskArray[key];
                    var last_time = task.jstime - nowtime;
                    if(isDo == false && last_time > 0){
                        isDo = true;
                        node.setVisible(true);
                        node.setString(Helper.formatTime(last_time));
                    }
                }
                if(isDo == false){
                    node.setVisible(false);
                    self.unschedule(refreshTime);
                }
            };
            refreshTime(0);
            this.schedule(refreshTime,1,cc.REPEAT_FOREVER);
        }else if(id == 6) {  //开服在线礼包
            var time = 0;
            var list = ACTIVITYCONTROLCFG[id].subid;
            var nowtime = Helper.getServerTime();
            for(var key in list){
                var id = list[key];
                var task = GLOBALDATA.activitylist[id];
                var info = ACTIVITYCFG[id];
                if(task != null){
                    if(task.jstime == null){
                        task.jstime = nowtime + info.mb[0][1] - task.g;
                    }
                    time = task.jstime;
                    break;
                }
            }
            var self = this;
            var refreshTime = function () {
                var nowtime = Helper.getServerTime();
                var last_time = time - nowtime;
                if(last_time>0){
                    node.setVisible(true);
                    node.setString(Helper.formatTime(last_time));
                }else{
                    node.setVisible(false);
                    self.unschedule(refreshTime);
                }
            };
            refreshTime();
            this.schedule(refreshTime,1,cc.REPEAT_FOREVER);
        }
    },
    onTouchEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED == type){
            switch(sender.name)
            {
            case "btnBack":
                this.removeFromParent(true);
                break;
            case "dayButton":
                var subtype = sender.getTag();
                switch(subtype)
                {
                case 1:  //开服七天乐
                    var welfareSevenLayer = new WelfareSevenLayer();
                    this.addChild(welfareSevenLayer, 2);

                    break;
                case 2:  // 签到
                    var welfareSignLayer = new WelfareSignLayer();
                    this.addChild(welfareSignLayer, 2);
                    break;
                case 3:  //等级特惠礼包
                    var _welfareLvLayer = new welfareLvLayer();
                    this.addChild(_welfareLvLayer, 2);
                    break;
                case 4:  //在线奖励
                    var _welfareOnLineLayer = new welfareOnLineLayer();
                    this.addChild(_welfareOnLineLayer, 2);
                    break;
                case 5:  //成长基金
                    var _welfareChengZLayer = new welfareChengZLayer();
                    this.addChild(_welfareChengZLayer, 2);
                    break;
                case 6:  //开服在线礼包
                    var _welfareSOnLineLayer = new welfareSOnLineLayer();
                    this.addChild(_welfareSOnLineLayer, 2);
                    break;
                case 7:  //开服特惠礼包
                    var _welfareSLvLayer = new welfareSLvLayer();
                    this.addChild(_welfareSLvLayer, 2);
                    break;
                case 8:  //开服红利
                    var _welfareHLLayer = new welfareHLLayer();
                    this.addChild(_welfareHLLayer, 2);
                    break;
                case 9:  //VIP福利
                    var _welfareVipLayer = new welfareVipLayer();
                    this.addChild(_welfareVipLayer, 2);
                    break;
                }
            }
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
    //处理红点
    dealRedPoint:function(data){
        var redInfo = welfareRedPoint.dayWelfarePanleRedPoint(data);
        if(redInfo != null){
            for(var key in this.btnTabs){
                var node = this.btnTabs[key];
                var dayTips = ccui.helper.seekWidgetByName(node, "dayTips");
                var tag = node.getTag();
                if(redInfo[tag] != null){
                    if(redInfo[tag].isRed == true){
                        dayTips.setVisible(true);
                    }else{
                        dayTips.setVisible(false);
                    }
                }
            }
        }
    },
    onExit:function () {
        this._super();
        cc.eventManager.removeListener(this.activity_finish);
        cc.eventManager.removeListener(this.activity_monthreward);
        cc.eventManager.removeListener(this.activityOptEvent);
        cc.eventManager.removeListener(this.activityFundrewardEvent);
        cc.eventManager.removeListener(this.activityRefreshEvent);
    }
});