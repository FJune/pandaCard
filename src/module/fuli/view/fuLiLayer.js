
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 /**
 * 活动中心层的创建
 */
var fuLiLayer = ModalDialog.extend({
    LayerName:"fuLiLayer",
    ctor:function(){
        this._super();
        this.btnTabs = [];
        this.index = 0;
        this.allGetId = [];  //可以一键领取的任务id
    },

    onEnter:function(){
        this._super();
    },
    //初始化ui
    initUI:function(){
        this.customWidget(); //自定义Widget
        this.initCustomEvent();
        this.sendRefresh();  //发送刷新的请求
    },
    //自定义Widget
    customWidget:function () {
        var uiFuLi = ccsTool.load(res.uiFuLiLayer, ["btnBack","Panel_day","ListView_btn","Panel_fuli"]);
        //控件的名字赋值给this变量
        for(var key in uiFuLi.wgt){
            this[key] = uiFuLi.wgt[key];
        }
        this.addChild(uiFuLi.node, 2);

        this.btnBack.addTouchEventListener(this.onTouchEvent, this);
    },
    initCustomEvent:function(){
        var self = this;
        // 领取奖励
        this.activity_finish = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "activity.finish",
            callback: function(event){
                var resData = event.getUserData();
                if(resData.status == 0){
                    self.showPanel(self.index);
                    self.resourceGet(event.getUserData());
                }
            }});
        cc.eventManager.addListener(this.activity_finish, 1);
        //购买活动物品
        this.activityOptEvent = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "activity.opt",
            callback: function(event){
                var resData = event.getUserData();
                if(resData.status == 0){
                    self.showPanel(self.index);
                }
            }});
        cc.eventManager.addListener(this.activityOptEvent, 1);
        //刷新活动数据
        this.activityRefreshEvent = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "activity.refresh",
            callback: function(event){
                var resData = event.getUserData();
                if(resData.status == 0){
                    self.showView();
                    if(self.btnTabs[0] && self.btnTabs[0].id){
                        self.showPanel(self.btnTabs[0].id);
                        self.DealButtonState(self.btnTabs[0].id);
                    }
                }
            }});
        cc.eventManager.addListener(this.activityRefreshEvent, 1);
    },
    //发送刷新的请求
    sendRefresh:function () {
        welfareModel.activityRefresh();
    },
    showView:function(){
        this.ListView_btn.removeAllChildren(true);
        this.btnTabs = [];
        var activitylist = GLOBALDATA.activitylist || {};
        var dataArray = [];
        var plist = activitylist.p || [];
        for (var key in plist)
        {
            var id = plist[key];
            var cfg = ACTIVITYCONTROLCFG[id];
            if (cfg && cfg.type == 4)
            {
                var temp ={};
                temp.id = cfg.ID;
                temp.showid = cfg.showid;
                dataArray.push(temp);
            }
        }
        var compare = function (a,b) {
            if(a.showid < b.showid){
                return -1;
            }else if(a.showid == b.showid){
                if(a.id < b.id){
                    return -1;
                }
            }
            return 1;
        };
        dataArray.sort(compare);
        for(var i=0;i<dataArray.length;i++){
            var cfg = ACTIVITYCONTROLCFG[dataArray[i].id];
            var item = this.Panel_day.clone();
            var obj = ccsTool.seekWidget(item,["dayButton","dayTips"]);
            var path = "common/c1/" + cfg.icon;
            obj.wgt.dayButton.loadTextures(path, path, path, ccui.Widget.PLIST_TEXTURE);
            item.addTouchEventListener(this.buttonEvent, this);
            item.setTag(cfg.ID);
            obj.wgt.dayTips.setVisible(false);
            this.ListView_btn.pushBackCustomItem(item);
            var temp ={};
            temp.id = cfg.ID;
            temp.showid = cfg.showid;
            temp.node = item;
            this.btnTabs.push(temp);
        }
        //处理红点
        this.dealRedPoint();
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
    //选择对应的活动的按钮
    buttonEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED == type){
            var tag = sender.getTag();
            this.showPanel(tag);
            this.DealButtonState(tag);
        }
    },
    //显示详细的活动界面
    showPanel:function(id){
        this.index = id;
        this.allGetId = [];  //可以一键领取的任务id
        var mainCfg = ACTIVITYCONTROLCFG[id];
        this.Panel_fuli.removeAllChildren(true);
        if(mainCfg.subtype == 3){  //登录送壕礼
            var obj = ccsTool.load(res.uiFuLiDRItem,["textTime","textDes","ListView_dr","btnGo"]);
            obj.node.removeFromParent(false);
            this.Panel_fuli.addChild(obj.node,1);
            var str = this.formatTime(mainCfg.st)+"-"+this.formatTime(mainCfg.et);
            obj.wgt.textTime.setString(str);  //活动时间
            var sublist = mainCfg.subid;
            var cfgArray = [];
            for(var key in sublist){
                var list = sublist[key];
                if(list instanceof Array){
                    for(var k in list){
                        var cfg = ACTIVITYCFG[list[k]];
                        cfgArray.push(cfg);
                    }
                }else{
                    var cfg = ACTIVITYCFG[sublist[key]];
                    cfgArray.push(cfg);
                }
            }
            if(cfgArray[0] != null){
                obj.wgt.textDes.setString(cfgArray[0].des);  //活动内容
            }
            //一键领取按钮
            obj.wgt.btnGo.setVisible(true);
            obj.wgt.btnGo.addTouchEventListener(this.getAllRewardEvent, this);
            //生成数据
            var dataArray = [];
            var minid = cfgArray[cfgArray.length-1].id;
            var jindu = 0;
            for(var i=0;i<cfgArray.length;i++){
                var cfg = cfgArray[i];
                var task = GLOBALDATA.activitylist[cfg.id];
                var temp = {};
                temp.id = cfg.id;
                temp.cfg = cfg;
                temp.degree = cfg.tc[0][1] + 1;
                if(task == null){
                    if(cfg.id < minid){
                        temp.g = cfg.tc[0][1]+1;
                        temp.s = 3;
                    }else if(cfg.id > minid){
                        temp.g = jindu;
                        temp.s = 1;
                    }
                }else{
                    minid = cfg.id;
                    if(task.s == 1){
                        jindu = cfg.tc[0][1];
                    }else{
                        jindu = cfg.tc[0][1]+1;
                    }
                    temp.g = jindu;
                    temp.s = task.s;
                    if(task.s == 2){
                        this.allGetId.push(temp.id);
                    }
                }
                dataArray.push(temp);
            }
            var sortArray = this.dealTaskData(dataArray);
            //显示领取类型的list
            this.showGetList(obj.wgt.ListView_dr,sortArray);
        }else if(mainCfg.subtype == 10 || mainCfg.subtype == 12){ //10 七日半价礼包 12 折扣礼包
            var obj = ccsTool.load(res.uiFuLiDRItem,["textTime","textDes","ListView_dr","btnGo"]);
            obj.node.removeFromParent(false);
            this.Panel_fuli.addChild(obj.node,1);
            var str = this.formatTime(mainCfg.st)+"-"+this.formatTime(mainCfg.et);
            obj.wgt.textTime.setString(str);  //活动时间
            var sublist = mainCfg.subid;
            var cfgArray = [];
            for(var key in sublist){
                var list = sublist[key];
                if(list instanceof Array){
                    for(var k in list){
                        var cfg = ACTIVITYCFG[list[k]];
                        cfgArray.push(cfg);
                    }
                }else{
                    var cfg = ACTIVITYCFG[sublist[key]];
                    cfgArray.push(cfg);
                }
            }
            if(cfgArray[0] != null){
                obj.wgt.textDes.setString(cfgArray[0].des);  //活动内容
            }
            //一键领取按钮
            obj.wgt.btnGo.setVisible(false);
            //生成数据
            var dataArray = [];
            for(var i=0;i<cfgArray.length;i++){
                var cfg = cfgArray[i];
                var task = GLOBALDATA.activitylist[cfg.id];
                if(task != null){
                    var temp = {};
                    temp.id = cfg.id;
                    temp.cfg = cfg;
                    temp.degree = cfg.num;
                    temp.g = task.g;
                    temp.s = task.s;
                    dataArray.push(temp);
                }
            }
            //显示购买类型的list
            this.showBuyList(obj.wgt.ListView_dr,dataArray);
        }else if(mainCfg.subtype == 13 || mainCfg.subtype == 14 || mainCfg.subtype == 15 || mainCfg.subtype == 16 || mainCfg.subtype == 19) {
            //13 金币兑换 14 征服工厂 15 竞技挑战 16 军神争霸 19 累计充值
            var obj = ccsTool.load(res.uiFuLiDRItem, ["textTime", "textDes", "ListView_dr", "btnGo"]);
            obj.node.removeFromParent(false);
            this.Panel_fuli.addChild(obj.node, 1);
            var str = this.formatTime(mainCfg.st) + "-" + this.formatTime(mainCfg.et);
            obj.wgt.textTime.setString(str);  //活动时间
            var sublist = mainCfg.subid;
            var cfgArray = [];
            for (var key in sublist) {
                var list = sublist[key];
                if (list instanceof Array) {
                    for (var k in list) {
                        var cfg = ACTIVITYCFG[list[k]];
                        cfgArray.push(cfg);
                    }
                } else {
                    var cfg = ACTIVITYCFG[sublist[key]];
                    cfgArray.push(cfg);
                }
            }
            if (cfgArray[0] != null) {
                obj.wgt.textDes.setString(cfgArray[0].des);  //活动内容
            }
            //一键领取按钮
            obj.wgt.btnGo.setVisible(true);
            obj.wgt.btnGo.addTouchEventListener(this.getAllRewardEvent, this);
            //生成数据
            var dataArray = [];
            for (var i = 0; i < cfgArray.length; i++) {
                var cfg = cfgArray[i];
                var task = GLOBALDATA.activitylist[cfgArray[i].id] || {};
                //因为13 金币兑换 14 征服工厂 15 竞技挑战 16 军神争霸有等级要求，所以不判断activitylist
                var temp = {};
                temp.id = cfg.id;
                temp.cfg = cfg;
                temp.degree = cfg.mb[0][1];
                temp.g = task.g || 0;
                temp.s = task.s || 1;
                dataArray.push(temp);
                if(task.s == 2){
                    this.allGetId.push(temp.id);
                }
            }
            var sortArray = this.dealTaskData(dataArray);
            //显示领取类型的list
            this.showGetList(obj.wgt.ListView_dr,sortArray);
        }else if(mainCfg.subtype == 20){  //连续充值返利
            var obj = ccsTool.load(res.uiFuLiFLItem,["Button_common1","Button_common2","Button_common3","Button_common4","Button_common5",
                "Button_common6","Button_common7","textTime","textDes"]);
            obj.node.removeFromParent(false);
            this.Panel_fuli.addChild(obj.node, 1);
            var str = this.formatTime(mainCfg.st) + "-" + this.formatTime(mainCfg.et);
            obj.wgt.textTime.setString(str);  //活动时间
            //活动内容
            obj.wgt.textDes.setString(STRINGCFG[100318].string);  //100318	活动期间，每天单笔充值30元，可获得相应奖励
            //生成数据
            var dataArray = [];
            var sublist = mainCfg.subid;
            var numDay = 0; //第几天
            var lscount = 0;
            for(var key in sublist){
                lscount++;
                var cfg = ACTIVITYCFG[sublist[key]];
                var task = GLOBALDATA.activitylist[cfg.id];
                var temp = {};
                temp.id = cfg.id;
                temp.cfg = cfg;
                if(task == null){
                    if(numDay == 0){
                        temp.s = 3;
                    }else{
                        temp.s = 1;
                    }
                }else if(task != null){
                    if(numDay == 0){
                        if(task.lt == null){
                            numDay = 1;
                        }else if(Helper.getServerTime() - task.lt < 86400){
                            numDay = lscount - 1;
                        }else{
                            numDay = lscount;
                        }
                    }
                    temp.s = task.s;
                }
                dataArray.push(temp);
            }
            //重新生成第几天
            if(numDay == dataArray.length){
                numDay = dataArray.length - 1;
            }
            //连续充值返利 显示五天的内容
            this.showFiveDayInfo(obj.node,dataArray[dataArray.length-1],mainCfg.et);
            //连续充值返利 切换第几天按钮
            this.rechargeNode = obj.node;
            this.rechargeData = dataArray;
            this.changeDayButton(numDay);
            for(var i=1;i<=7;i++){
                obj.wgt["Button_common" + i].addTouchEventListener(this.changeDayEvent, this);
            }
        }
    },
    //显示领取类型的list
    showGetList:function(ListNode,DataArray){
        ListNode.removeAllChildren(true);
        for(var i=0;i<DataArray.length;i++) {
            var task = DataArray[i];
            var wgtArr = [];
            wgtArr.push("bagItem");  //背景
            wgtArr.push("textItemDay");  //描述
            wgtArr.push("textItemDayNum");  //进度
            for (var j = 1; j <= 4; j++) {
                wgtArr.push("bagItemBg" + j);
                wgtArr.push("bagItemIcon" + j);
                wgtArr.push("bagItemPieces" + j);
                wgtArr.push("bagItemNum" + j);
            }
            wgtArr.push("textTipsHad");  //已领取
            wgtArr.push("textTipsNo");  //未完成
            wgtArr.push("btnGet");  //领取
            var item = ccsTool.load(res.uiFuLiDRItem2, wgtArr);
            item.wgt.bagItem.removeFromParent(false);
            ListNode.pushBackCustomItem(item.wgt.bagItem);
            item.wgt.textItemDay.setString(task.cfg.name);
            //进度
            var strText = "";
            var Degree = task.degree;
            if (task.g >= Degree) {
                strText = "(" + Degree + "/" + Degree + ")";
            } else {
                strText = "(" + task.g + "/" + Degree + ")";
            }
            item.wgt.textItemDayNum.setString(strText);
            //奖励
            var count = 1;
            for (var j = 1; j <= 4; j++) {
                var reward = task.cfg.reward[j - 1];
                if (reward != null) {
                    var itemCfg = Helper.findItemId(reward[0]);
                    Helper.LoadIconFrameAndAddClick(item.wgt["bagItemIcon" + j], item.wgt["bagItemBg" + j], item.wgt["bagItemPieces" + j], itemCfg);  //物品
                    item.wgt["bagItemNum" + j].setString(Helper.formatNum(reward[1]));  //数量
                    item.wgt["bagItemBg" + j].setTag(reward[0]);
                    item.wgt["bagItemBg" + j].addTouchEventListener(this.itemSeeEvent, this);
                    count++;
                }
            }
            for (var j = count; j <= 4; j++) {
                item.wgt["bagItemBg" + j].setVisible(false);
            }
            if (task.s == 3) {  //已领取
                item.wgt.textTipsHad.setVisible(true); //已领取
                item.wgt.textTipsNo.setVisible(false);  //未完成
                item.wgt.btnGet.setVisible(false);   //领取
            } else if (task.s == 2) {  //已完成
                item.wgt.textTipsHad.setVisible(false); //已领取
                item.wgt.textTipsNo.setVisible(false);  //未完成
                item.wgt.btnGet.setVisible(true);   //领取
            } else {
                item.wgt.textTipsHad.setVisible(false); //已领取
                item.wgt.textTipsNo.setVisible(true);  //未完成
                item.wgt.btnGet.setVisible(false);   //领取
            }
            item.wgt.btnGet.setTag(task.id);
            item.wgt.btnGet.addTouchEventListener(this.getRewardEvent, this);
        }
    },
    //显示购买类型的list
    showBuyList:function(ListNode,DataArray){
        ListNode.removeAllChildren(true);
        for(var i=0;i<DataArray.length;i++){
            var task = DataArray[i];
            var wgtArr = [];
            wgtArr.push("bagItem");  //背景
            wgtArr.push("textItemDay");  //描述
            wgtArr.push("textItemDayNum");  //进度
            wgtArr.push("Image_dayCos");  //花费的图片
            wgtArr.push("textItemDayCos");  //花费的额度
            for(var j=1;j<=4;j++){
                wgtArr.push("bagItemBg"+j);
                wgtArr.push("bagItemIcon"+j);
                wgtArr.push("bagItemPieces"+j);
                wgtArr.push("bagItemNum"+j);
            }
            wgtArr.push("textTipsHad");  //已购买
            wgtArr.push("btnGet");  //购买
            var item = ccsTool.load(res.uiFuLiBJItem2,wgtArr);
            item.wgt.bagItem.removeFromParent(false);
            ListNode.pushBackCustomItem(item.wgt.bagItem);
            item.wgt.textItemDay.setString(task.cfg.name);
            //进度
            var strText = "";
            var Degree = task.degree;
            if (task.g >= Degree) {
                strText = "(" + Degree + "/" + Degree + ")";
            } else {
                strText = "(" + task.g + "/" + Degree + ")";
            }
            item.wgt.textItemDayNum.setString(strText);
            //花费的图片
            var citemCfg = Helper.findItemId(task.cfg.cost[0]);
            var icon = "";
            if (citemCfg.id == 1)
            {
                icon = "common/i/i_003.png";
            }
            else if(citemCfg.id == 2)
            {
                icon = "common/i/i_004.png";
            }
            item.wgt.Image_dayCos.loadTexture(icon, ccui.Widget.PLIST_TEXTURE);
            //花费的额度
            item.wgt.textItemDayCos.setString(task.cfg.cost[1]);
            //奖励
            var count =1;
            for(var j=1;j<=4;j++){
                var reward = task.cfg.reward[j-1];
                if(reward != null){
                    var itemCfg = Helper.findItemId(reward[0]);
                    Helper.LoadIconFrameAndAddClick(item.wgt["bagItemIcon"+j],item.wgt["bagItemBg"+j],item.wgt["bagItemPieces"+j],itemCfg);  //物品
                    item.wgt["bagItemNum"+j].setString(Helper.formatNum(reward[1]));  //数量
                    item.wgt["bagItemBg"+j].setTag(reward[0]);
                    item.wgt["bagItemBg"+j].addTouchEventListener(this.itemSeeEvent, this);
                    count++;
                }
            }
            for(var j=count;j<=4;j++){
                item.wgt["bagItemBg"+j].setVisible(false);
            }
            if(task.s == 3){  //已经购买
                item.wgt.textTipsHad.setVisible(true); //已购买
                item.wgt.btnGet.setVisible(false);   //购买
            }else{
                item.wgt.textTipsHad.setVisible(false); //已购买
                item.wgt.btnGet.setVisible(true);   //购买
            }
            item.wgt.btnGet.setTag(task.id);
            item.wgt.btnGet.addTouchEventListener(this.GotoBuyRewardEvent, this);
        }
    },
    //处理按钮的选中状态
    DealButtonState:function(id){
        for(var key in this.btnTabs){
            var info = this.btnTabs[key];
            var day_xu = ccui.helper.seekWidgetByName(info.node, "day_xu");
            if(info.id == id){
                info.node.setTouchEnabled(false);
                day_xu.setVisible(true);
            }else{
                info.node.setTouchEnabled(true);
                day_xu.setVisible(false);
            }
        }
    },
    //领取奖励的领取按钮
    getRewardEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED == type){
            var id = sender.getTag(); //可领取
            fuLiModel.getActivityFinish(id);
        }
    },
    //一键领取奖励的按钮
    getAllRewardEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED == type){
            if(this.allGetId.length == 0){ //为空
                ShowTipsTool.ErrorTipsFromStringById(100294);  //100294	没有可领取的奖励
                return;
            }
            for(var key in this.allGetId){
                fuLiModel.getActivityFinish(this.allGetId[key]);
            }
        }
    },
    //购买的按钮
    GotoBuyRewardEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED == type){
            var id = sender.getTag();
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
    },
    //奖励物品的点击事件
    itemSeeEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED == type){
            var id = sender.getTag();
			showInitialItemPreview(this,id);   //初始物品的预览
        }
    },
    //处理时间
    formatTime:function(strtime){
        if(strtime != null){
            var month = strtime.substring(5,7);
            var day = strtime.substring(8,10);
            var hour = strtime.substring(11,13);
            var min = strtime.substring(14,16);
            var str = StringFormat(STRINGCFG[100293].string,[month,day,hour,min]);  //100293	$1月$1日$1:$1
            return str;
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
    //连续充值返利 显示五天的内容
    showFiveDayInfo:function(node,data,jstime){
        var obj = ccsTool.seekWidget(node,["bagItemBg2","bagItemIcon2","bagItemPieces2","bagItemNum2","bagItemNumBuy2","bagItemTime",
            "btnGet2","btnBuy2","textTipsHad2"]);
        //奖励
        var reward = data.cfg.reward[0];
        if(reward != null){
            var itemCfg = Helper.findItemId(reward[0]);
            Helper.LoadIconFrameAndAddClick(obj.wgt.bagItemIcon2,obj.wgt.bagItemBg2,obj.wgt.bagItemPieces2,itemCfg);  //物品
            obj.wgt.bagItemNum2.setString(Helper.formatNum(reward[1]));  //数量
            obj.wgt.bagItemBg2.setTag(reward[0]);
            obj.wgt.bagItemBg2.addTouchEventListener(this.itemSeeEvent, this);
        }
        //描述
        obj.wgt.bagItemNumBuy2.setString(data.cfg.des);
        //截止时间
        var strText = StringFormat(STRINGCFG[100317].string,this.formatTime(jstime));  //100317	$1截止领取
        obj.wgt.bagItemTime.setString(strText);
        if(data.s == 3){ //已领取
            obj.wgt.btnBuy2.setVisible(false);
            obj.wgt.btnGet2.setVisible(false);
            obj.wgt.textTipsHad2.setVisible(true);
        }else if(data.s == 2){  //领取按钮
            obj.wgt.btnBuy2.setVisible(false);
            obj.wgt.btnGet2.setVisible(true);
            obj.wgt.textTipsHad2.setVisible(false);
        }else{  //充值
            obj.wgt.btnBuy2.setVisible(true);
            obj.wgt.btnGet2.setVisible(false);
            obj.wgt.textTipsHad2.setVisible(false);
        }
        obj.wgt.btnGet2.setTag(data.id);
        obj.wgt.btnBuy2.addTouchEventListener(this.rechargeEvent, this);
        obj.wgt.btnGet2.addTouchEventListener(this.getRewardEvent, this);
    },
    //充值按钮的事件
    rechargeEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED == type){
            //充值按钮的事件  后期处理
        }
    },
    //连续充值返利 切换按钮的事件
    changeDayEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED == type){
            switch(sender.name) {
                case "Button_common1":
                    this.changeDayButton(1);
                    break;
                case "Button_common2":
                    this.changeDayButton(2);
                    break;
                case "Button_common3":
                    this.changeDayButton(3);
                    break;
                case "Button_common4":
                    this.changeDayButton(4);
                    break;
                case "Button_common5":
                    this.changeDayButton(5);
                    break;
                case "Button_common6":
                    this.changeDayButton(6);
                    break;
                case "Button_common7":
                    this.changeDayButton(7);
                    break;
            }
        }
    },
    //连续充值返利 切换第几天按钮
    changeDayButton:function(numDay){
        var obj = ccsTool.seekWidget(this.rechargeNode,["Button_common1","Button_common2","Button_common3","Button_common4","Button_common5",
            "Button_common6","Button_common7","bagItemBg1","bagItemIcon1","bagItemPieces1","bagItemNum1","bagItemNumBuy1",
            "btnGet1","btnBuy1","textTipsHad1"]);
        for(var i=1;i<=7;i++){
            if(i == numDay){
                obj.wgt["Button_common"+i].setBrightStyle(ccui.Widget.BRIGHT_STYLE_HIGH_LIGHT);
                obj.wgt["Button_common"+i].setTouchEnabled(false);
            }else{
                obj.wgt["Button_common"+i].setBrightStyle(ccui.Widget.BRIGHT_STYLE_NORMAL);
                obj.wgt["Button_common"+i].setTouchEnabled(true);
            }
        }
        //奖励
        var info = this.rechargeData[numDay-1];
        var reward = info.cfg.reward[0];
        if(reward != null){
            var itemCfg = Helper.findItemId(reward[0]);
            Helper.LoadIconFrameAndAddClick(obj.wgt.bagItemIcon1,obj.wgt.bagItemBg1,obj.wgt.bagItemPieces1,itemCfg);  //物品
            obj.wgt.bagItemNum1.setString(Helper.formatNum(reward[1]));  //数量
            obj.wgt.bagItemBg1.setTag(reward[0]);
            obj.wgt.bagItemBg1.addTouchEventListener(this.itemSeeEvent, this);
        }
        //描述
        obj.wgt.bagItemNumBuy1.setString(info.cfg.des);
        if(info.s == 3){ //已领取
            obj.wgt.btnBuy1.setVisible(false);
            obj.wgt.btnGet1.setVisible(false);
            obj.wgt.textTipsHad1.setVisible(true);
        }else if(info.s == 2){  //领取按钮
            obj.wgt.btnBuy1.setVisible(false);
            obj.wgt.btnGet1.setVisible(true);
            obj.wgt.textTipsHad1.setVisible(false);
        }else{  //充值
            obj.wgt.btnBuy1.setVisible(true);
            obj.wgt.btnGet1.setVisible(false);
            obj.wgt.textTipsHad1.setVisible(false);
        }
        obj.wgt.btnGet1.setTag(info.id);
        obj.wgt.btnBuy1.addTouchEventListener(this.rechargeEvent, this);
        obj.wgt.btnGet1.addTouchEventListener(this.getRewardEvent, this);
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
        var redInfo = fuliRedPoint.dayFuliPanleRedPoint(data);
        if(redInfo != null){
            for(var key in this.btnTabs){
                var node = this.btnTabs[key].node;
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
        cc.eventManager.removeListener(this.activityOptEvent);
        cc.eventManager.removeListener(this.activityRefreshEvent);
    }
});