
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
var dayWorkLayer = baseLayer.extend({
    LayerName:"dayWorkLayer",
    ctor:function(){
        this._super();
        this.uiAttributeLayer.setVisible(false);
    },
    onEnter:function(){
        this._super();
        this.initCustomEvent();
    },
    //初始化ui
    initUI:function () {
        this.customWidget();  //自定义Widget
        this.sendRefreshTask();  //发送刷新任务的消息
        //处理红点
        this.dealRedPoint();
    },
    initCustomEvent:function () {
        var self = this;
        //领取奖励
        this.networkRewardEvent = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            eventName:"task.finish",
            callback:function (event) {
                var resData = event.getUserData();
                if(resData.status == 0){
                    //获得的物品
                    var task = 'resource.get';
                    var event = new cc.EventCustom(task);
                    event.setUserData(resData);
                    cc.eventManager.dispatchEvent(event);
                    //更新活跃度的相关信息
                    self.updateInfo();
                    //更换list
                    self.changeList(self.index);
                }
            }
        });
        cc.eventManager.addListener(this.networkRewardEvent,1);
        //刷新任务
        this.networkSendRefreshEvent = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            eventName:"task.refresh",
            callback:function (event) {
                var resData = event.getUserData();
                if(resData.status == 0){
                    //更新活跃度的相关信息
                    self.updateInfo();
                    //更换list
                    self.changeList(self.index);
                }
            }
        });
        cc.eventManager.addListener(this.networkSendRefreshEvent,1);
    },
    //自定义Widget
    customWidget:function(){
        var wgtArr = [];
        wgtArr.push("btnBack");  //返回按钮
		wgtArr.push("Button_day");  //日常标签
		wgtArr.push("Button_chengjiu");  //成就标签
		wgtArr.push("ListView_day");  //list
		wgtArr.push("textBarAll");  //活跃度
		wgtArr.push("boxBar");  //进度条
		//四个活跃度箱子
		for(var i=1;i<=4;i++){
			wgtArr.push("imageBox"+i);
			wgtArr.push("nodeBox"+i);
			wgtArr.push("textBarAll"+i);
		}
		wgtArr.push("Panel_StarSee");  //查看奖励的界面
		wgtArr.push("btnStarGet");  //领取按钮
		wgtArr.push("textGetStarSee");  //领取文字
		wgtArr.push("textAlreadyGetStarSee");  //已经领取文字
		//四个奖励物品的箱子
		for(var i=1;i<=4;i++){
			wgtArr.push("bagBgStarSee"+i);
			wgtArr.push("bagIconStarSee"+i);
			wgtArr.push("bagPiecesStarSee"+i);
			wgtArr.push("bagNameStarSee"+i);
			wgtArr.push("bagNumStarSee"+i);
		}
        //红点
        wgtArr.push("taskImage1");
        wgtArr.push("taskImage2");

        var uiDayWork = ccsTool.load(res.uiDayWorkLayer,wgtArr);
        //控件的名字赋值给this变量
        for(var key in uiDayWork.wgt){
            this[key] = uiDayWork.wgt[key];
        }
        this.addChild(uiDayWork.node);

        //返回按钮
        this.btnBack.addTouchEventListener(this.hideEvent, this);
        //日常标签
        this.Button_day.addTouchEventListener(this.changeBtnEvent,this);
        this.Button_day.setTag(1);
        this.Button_day.setBrightStyle(ccui.Widget.BRIGHT_STYLE_HIGH_LIGHT);
        this.Button_day.setTouchEnabled(false);
        //成就标签
        this.Button_chengjiu.addTouchEventListener(this.changeBtnEvent,this);
        this.Button_chengjiu.setTag(2);
        //领取活跃度奖励的按钮的事件
        this.btnStarGet.addTouchEventListener(this.getRewardEvent,this);
        //查看奖励的界面的按钮的事件
        this.Panel_StarSee.addTouchEventListener(this.hideEvent, this);
        //处理四个活跃度箱子的特效获取四个箱子的数据
        this.dealFourBox();
        //更换list
        this.changeList(1);
    },
    //发送刷新任务的消息
    sendRefreshTask:function () {
        dayWorkModel.sendRefresh();
    },
    //处理四个活跃度箱子的特效获取四个箱子的数据
    dealFourBox:function () {
        //四个活跃度箱子的数据
        this.BoxArray = [];
        var isfind = false;
        for(var key in MISSIONVITACFG){
            var Info = MISSIONVITACFG[key];
            if(Info.type == 3){
                var temp = objClone(Info);
                temp.id = Info.id;
                temp.mb = Info.mb;
                temp.reward = Info.reward;
                temp.status = 1;  //默认为未完成
                this.BoxArray.push(temp);
                isfind = true;
            }else if(isfind){
                break;
            }
        }
        for(var i=1;i<=4;i++){
            //四个活跃度箱子的特效
            var act = ccs.load(res.effArsenBox_json);
            act.action.play("arsenBoxAction", true);
            this["nodeBox"+i].runAction(act.action);
            this["nodeBox"+i].setVisible(false);
            //四个活跃度箱子的点击事件
            this["imageBox"+i].addTouchEventListener(this.showRewardPanel,this);
            this["imageBox"+i].setTag(i-1);
            //对应的活跃度数值
            this["textBarAll"+i].setString(this.BoxArray[i-1].mb[0][1]);
        }
    },
    updateInfo:function () {
        //最大的活跃度
        var maxDegree = 0;
        var mbInfo = this.BoxArray[this.BoxArray.length-1].mb;
        for(var i=0;i<mbInfo.length;i++){
            if(mbInfo[i][0] == 1){  //完成次数
                maxDegree = mbInfo[i][1];
                break;
            }
        }
        //当前的活跃度
        var ji = 0;  //第几个箱子的数据
        for(var i=0;i<this.BoxArray.length;i++){
            var task = GLOBALDATA.tasklist[this.BoxArray[i].id];
            if(task != null){
                this.BoxArray[i].status = task.s;
                this.BoxArray[i].jindu = task.g;
                ji = i;
                break;
            }
        }
        var nowInfo = this.BoxArray[ji];  //当前的信息
        if(nowInfo.jindu < maxDegree){
            this.textBarAll.setString(nowInfo.jindu+"/"+maxDegree);  //活跃度
            this.boxBar.setPercent(Math.floor(nowInfo.jindu/maxDegree*100));  //进度条
        }else{
            this.textBarAll.setString(maxDegree+"/"+maxDegree);  //活跃度
            this.boxBar.setPercent(100);  //进度条
        }
        //下面四个箱子的状态
        for(var i=0;i<4;i++){
            //前面的箱子 箱子是开的状态 并且已经领取过
            if(i<ji){
                //后期更换箱子打开的图片 this["imageBox"+i]
                this.BoxArray[i].status = 3;
                this["nodeBox"+(i+1)].setVisible(false);
            }
            //服务器传过来的箱子
            if(i == ji){
                var status = this.BoxArray[ji].status;
                if(status == 1){ //未完成
                    this["nodeBox"+(i+1)].setVisible(false);
                }else if(status == 2){  //可领取
                    //后期更换箱子打开的图片 this["imageBox"+i]
                    this["nodeBox"+(i+1)].setVisible(true);
                }else if(status == 3){  //已领取
                    //后期更换箱子打开的图片 this["imageBox"+i]
                    this["nodeBox"+(i+1)].setVisible(false);
                }
            }
            //后面的箱子  全部都显示关闭
            if(i>ji){
                this.BoxArray[i].status = 1;
                this["nodeBox"+(i+1)].setVisible(false);
            }
        }
    },
    //两个标签按钮的事件
    changeBtnEvent:function(sender,type){
        if(ccui.Widget.TOUCH_ENDED==type) {
            switch (sender.name) {
                case 'Button_day'://橙红的标签
                    this.Button_day.setBrightStyle(ccui.Widget.BRIGHT_STYLE_HIGH_LIGHT);
                    this.Button_day.setTouchEnabled(false);
                    this.Button_chengjiu.setBrightStyle(ccui.Widget.BRIGHT_STYLE_NORMAL);
                    this.Button_chengjiu.setTouchEnabled(true);
                    break;
                case 'Button_chengjiu'://改造的标签
                    this.Button_chengjiu.setBrightStyle(ccui.Widget.BRIGHT_STYLE_HIGH_LIGHT);
                    this.Button_chengjiu.setTouchEnabled(false);
                    this.Button_day.setBrightStyle(ccui.Widget.BRIGHT_STYLE_NORMAL);
                    this.Button_day.setTouchEnabled(true);
                    break;
                default:
                    break;
            }
            var tag = sender.getTag();
            this.changeList(tag);
        }
    },
    //更换list
    changeList:function(index){
        this.index = index;
        this.ListView_day.removeAllChildren(true);
        var dataArray = [];
        if(index == 1){  //日常
            for(var key in MISSIONDAYCFG){
                var Info = MISSIONDAYCFG[key];
                var task = GLOBALDATA.tasklist[key] || {};
                var status = task.s || 0;
                if(Info.type == 1 && (status == 1 || status == 2)){
                    var temp = {};
                    temp.id = Info.id;
                    temp.name = Info.des;
                    temp.reward = Info.reward;
                    temp.mb = Info.mb;
                    temp.jindu = task.g;
                    temp.status = status;
                    dataArray.push(temp);
                }
            }
        }else if(index == 2){  //成就
            for(var key in MISSIONACHCFG){
                var Info = MISSIONACHCFG[key];
                var task = GLOBALDATA.tasklist[key] || {};
                var status = task.s || 0;
                if(Info.type == 2 && (status == 1 || status == 2)){
                    var temp = {};
                    temp.id = Info.id;
                    temp.name = Info.des;
                    temp.reward = Info.reward;
                    temp.mb = Info.mb;
                    temp.jindu = task.g;
                    temp.status = status;
                    dataArray.push(temp);
                }
            }
        }
        dataArray.sort(this.compareTh);  //排序
        for(var i=0;i<dataArray.length;i++){
            var wgtArr = [];
            wgtArr.push("item");   //最大的底
            wgtArr.push("itemName");   //描述
            //两种奖励
            for(var j=1;j<=2;j++){
                wgtArr.push("rewardBg"+j);
                wgtArr.push("rewardImage"+j);
                wgtArr.push("rewardValue"+j);
            }
            wgtArr.push("itemWarJindu");   //进度
            wgtArr.push("Image_weiwancheng");   //未完成
            wgtArr.push("B_Get");   //领取
            var WorkItem = ccsTool.load(res.uiDayWorkItem,wgtArr);
            var wgt = {};
            //控件的名字赋值给wgt变量
            for(var k in WorkItem.wgt){
                wgt[k] = WorkItem.wgt[k];
            }
			wgt.item.removeFromParent(false);
            this.ListView_day.pushBackCustomItem(wgt.item);
            var Info = dataArray[i];
            wgt.itemName.setString(Info.name);   //描述
            //两种奖励
            var count = 1;
            for(var j=1;j<=2;j++){
                if(Info.reward[j-1] != null){
                    var itemCfg = Helper.findItemId(Info.reward[j-1][0]);
                    Helper.LoadIcoImageWithPlist(wgt["rewardImage"+j],itemCfg);  //奖励的图片
                    wgt["rewardValue"+j].setString(Info.reward[j-1][1]);  //奖励的数量
                    count++;
                }
            }
            for(var j=count;j<=2;j++){
                wgt["rewardBg"+j].setVisible(false);
            }
            //进度
            var strText = "";
            var Degree = 0;
            for(var j=0;j<Info.mb.length;j++){
                if(Info.mb[j][0] == 1){  //完成次数
                    Degree = Info.mb[j][1];
                    break;
                }
            }
            if(Info.jindu >= Degree){
                strText = StringFormat(STRINGCFG[100225].string,Degree+"/"+Degree);  //100225	进度：$1
            }else{
                strText = StringFormat(STRINGCFG[100225].string,Info.jindu+"/"+Degree);  //100225	进度：$1
            }
            wgt.itemWarJindu.setString(strText);
            //领取或者未完成
            if(Info.status == 1){ //未完成
                wgt.Image_weiwancheng.setVisible(true);
                wgt.B_Get.setVisible(false);
            }else if(Info.status == 2){  //领取
                wgt.Image_weiwancheng.setVisible(false);
                wgt.B_Get.setVisible(true);
            }
            //领取的按钮事件
            wgt.B_Get.setTag(Info.id);
            wgt.B_Get.setUserData("guid_ListView_day_B_Get"+i);
            wgt.B_Get.addTouchEventListener(this.getRewardEvent,this);
        }
    },
    //任务的排序
    compareTh:function (last,next) {
        if(last.status > next.status){
            return -1;
        }else if(last.status == next.status){
            if(last.id < next.id){
                return -1;
            }
        }
        return 1;
    },
    //查看四个活跃度箱子的奖励
    showRewardPanel:function(sender, type) {
        if(ccui.Widget.TOUCH_ENDED==type) {
            this.Panel_StarSee.setVisible(true);  //查看奖励的界面
            var tag = sender.getTag();
            var Info = this.BoxArray[tag];
            //四个奖励物品的箱子
            var count = 1;
            for(var i=1;i<=4;i++){
                if(Info.reward[i-1] != null){
                    var reward = Info.reward[i-1];
                    var itemCfg = Helper.findItemId(reward[0]);
                    Helper.LoadIconFrameAndAddClick(this["bagIconStarSee"+i],this["bagBgStarSee"+i],this["bagPiecesStarSee"+i],itemCfg);
                    this["bagNameStarSee"+i].setString(itemCfg.itemname);
                    Helper.setNamecolorByQuality(this["bagNameStarSee"+i],itemCfg.quality);
                    this["bagNumStarSee"+i].setString(reward[1]);
                    count++;
                }
            }
            for(var i=count;i<=4;i++){
                this["bagBgStarSee"+i].setVisible(false);
            }
            if(Info.status == 1){  //未完成
                this.btnStarGet.setBright(false);
                this.btnStarGet.setTouchEnabled(false);     //领取按钮
                this.textGetStarSee.setVisible(true);    //领取文字
                this.textAlreadyGetStarSee.setVisible(false);   //已经领取文字
            }else if(Info.status == 2){  //可领取
                this.btnStarGet.setBright(true);
                this.btnStarGet.setTouchEnabled(true);     //领取按钮
                this.textGetStarSee.setVisible(true);    //领取文字
                this.textAlreadyGetStarSee.setVisible(false);   //已经领取文字
            }else if(Info.status == 3){  //已领取
                this.btnStarGet.setBright(false);
                this.btnStarGet.setTouchEnabled(false);     //领取按钮
                this.textGetStarSee.setVisible(false);    //领取文字
                this.textAlreadyGetStarSee.setVisible(true);   //已经领取文字
            }
            this.btnStarGet.setTag(Info.id);
        }
    },
    //领取奖励的事件
    getRewardEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type) {
            var tag = sender.getTag();
            dayWorkModel.getReward(tag);
            if(sender.name == "btnStarGet"){
                this.Panel_StarSee.setVisible(false);  //查看奖励的界面
            }
        }
    },
    //返回按钮的事件
    hideEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type) {
            switch (sender.name) {
                case 'btnBack'://大界面的返回按钮
                    this.removeFromParent(true);
                    break;
                case 'Panel_StarSee'://查看奖励界面
                    this.Panel_StarSee.setVisible(false);
                    break;
                default:
                    break;
            }
        }
    },
    //处理红点
    dealRedPoint:function(data){
        var redInfo = dayWorkRedPoint.dayWorkPanleRedPoint(data);
        if(redInfo != null){
            this.taskImage1.setVisible(false);
            this.taskImage2.setVisible(false);
            for(var key in redInfo.pos){
                if(redInfo.pos[key] == 1){
                    this.taskImage1.setVisible(true);
                }else if(redInfo.pos[key] == 2){
                    this.taskImage2.setVisible(true);
                }
            }
        }
    },
    onExit:function(){
        this._super();
        cc.eventManager.removeListener(this.networkRewardEvent);
        cc.eventManager.removeListener(this.networkSendRefreshEvent);
    },
});