
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 /**
 * 新手指引层的创建
 */
var newGuideLayer = cmLayer.extend({
    LayerName:"newGuideLayer",
    ctor:function(EventFunc){
        this._super();
        this.isWin = false;   //是否胜利了
        this.setOpacity(0);       //透明度设置
        this.EventFunc = EventFunc;
    },
    onEnter:function(){
        this._super();
    },
    //初始化ui
    initUI:function () {
        this.customWidget();  //自定义Widget
        this.initCustomEvent();
        var seq = cc.sequence(cc.delayTime(0.01),cc.callFunc(this.EventFunc,this));
        this.runAction(seq);
        //this.EventFunc();
    },
    initCustomEvent:function () {
        var self = this;
        //显示新手指引
        this.showGuideEvent = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            eventName:"show.newguide",
            callback:function (event) {
                var resData = event.getUserData();
                var ttype = resData.ttype || 0;
                var id = resData.id || 0;
                if(ttype == 1){  //登录后继续指引
                    id = NEWGUIDECFG[id].jmpid || 0;
                }else if(ttype == 3){  //前十关的特殊指引
                    for(var key in NEWGUIDECFG){
                        if(NEWGUIDECFG[key].typeid == ttype){
                            id = NEWGUIDECFG[key].id;
                            break;
                        }
                    }
                }
                self.beginShow(id);
            }
        });
        cc.eventManager.addListener(this.showGuideEvent,1);
    },
    //自定义Widget
    customWidget:function(){
        var wgtArr = [];
        wgtArr.push("Image_Cover");  //遮盖层
		wgtArr.push("Image_tips");  //小说明背景
		wgtArr.push("Node_circle");  //手的节点
		wgtArr.push("Image_dialog");  //大说明背景
		wgtArr.push("Image_guide");  //透明层
		wgtArr.push("Text_name");  //大说明昵称
		wgtArr.push("Text_dialog");  //大说明内容
		wgtArr.push("Button_go");  //继续按钮
		wgtArr.push("Text_tips");  //小说明内容
		wgtArr.push("Image_find");  //特效中点击
        var uiNewGuide = ccsTool.load(res.uiNewGuideLayer,wgtArr);
        //控件的名字赋值给this变量
        for(var key in uiNewGuide.wgt){
            this[key] = uiNewGuide.wgt[key];
        }
        this.addChild(uiNewGuide.node);

        //特效
        uiNewGuide.action.play("action",true);
        this.Node_circle.runAction(uiNewGuide.action);

        //继续按钮
        this.Button_go.addTouchEventListener(this.continueEvent,this);
        //特效中的点击
        this.Image_find.addTouchEventListener(this.nextGuidClickEvent,this);

        this.setVisible(false);
    },
    beginShow:function(id){
        if(id > 0){
            var guide = NEWGUIDECFG[id];
            this.nextid = guide.nextid || 0;
            this.id = id;
            this.typeid = guide.typeid || 0;    //引导类型
            this.sendtype = guide.sendtype || 1;
            this.tp = guide.tp || 0;
            this.delayShow = guide.delayShow || 0;
            this.delayClick = guide.delayClick || 0;
            this.saveid = guide.saveid || 0;

            //防错处理
            if(this.PreventErrorDeal()){
                return;
            }
            //发送保存点
            if(this.typeid == 1 && this.sendtype == 2){  //如果是新手指引并且显示的时候发送
                newGuideModel.setGuideId(this.id);
            }
            //显示界面
            this.showPanel();

            //特殊处理
            if(this.id == 14 || this.id == 25 || this.id == 39 || this.id == 52){  //14 25 39 52打boss
                if(GLOBALDATA.base.wins >= 3 || GLOBALDATA.base.vip>=1){  //是否能够打BOSS
                    this.endMonitorBase();
                    this.HideSomeImage();
                    this.SetZheGaiVisible(true);
                }else{
                    this.HidePanel(false);
                    this.startMonitorBase();
                    /*this.startMonitorBase();
                    this.HideSomeImage();
                    this.SetZheGaiVisible(true);*/
                    return;
                }
            }else if(this.id == 15 || this.id == 26 || this.id == 40 || this.id == 53){  //15 26 40 53战斗胜利
                if(this.isWin){  //是否胜利了
                    this.isWin = false;
                    this.endMonitorBase();
                    this.HideSomeImage();
                    this.SetZheGaiVisible(true);
                }else{
                    this.HidePanel(false);
                    this.startMonitorBase();
                    /*this.startMonitorBase();
                    this.HideSomeImage();
                    this.SetZheGaiVisible(true);*/
                    return;
                }
            }

            //处理延迟显示遮盖层
            this.jiangeShowTime = 0;
            if(this.delayShow > 0){
                this.HideSomeImage();
                this.SetZheGaiVisible(true);
                this.schedule(this.updateShow,0.1,cc.REPEAT_FOREVER);
            }else{
                this.SetZheGaiVisible(false);
                this.NowBeginShow();
            }
        }else{
            this.HidePanel(true);
        }
    },
    NowBeginShow:function () {
        var guide = NEWGUIDECFG[this.id];
        //防错处理
        if(this.PreventErrorDeal()){
            return;
        }
        //特殊处理

        //处理延迟点击遮盖层
        this.jiangeClickTime = 0;
        if(this.delayClick > 0){
            this.SetZheGaiVisible(true);
            this.schedule(this.updateClick,0.1,cc.REPEAT_FOREVER);
        }else{
            this.SetZheGaiVisible(false);
        }

        if(this.tp == 1 || this.tp == 5){  //1全屏加手(不带继续) 5全屏加手(自带继续)
            this.showDialog(guide);
        }else if(this.tp == 2 || this.tp == 6){  //2手(其它地方不能点击) 6手其它地方可以点击
            this.showCircle(guide);
        }else if(this.tp == 3){ //手加小说明
            this.showTips(guide);
        }

    },
    //检测data.update.base的事件
    startMonitorBase:function () {
        var self = this;
        if(this.MonitorBaseEvent == null){
            this.MonitorBaseEvent = cc.EventListener.create({
                event:cc.EventListener.CUSTOM,
                eventName:"data.update.base",
                callback:function (event) {
                    var resData = event.getUserData();
                    if(resData.status == 0){
                        //监听里面的vip和wins来处理是否可以挑战boss了
                        if(resData.data.data.hasOwnProperty("vip") || resData.data.data.hasOwnProperty("wins")
                            || resData.data.data.hasOwnProperty("stage")){
                            if(self.id == 14 || self.id == 25 || self.id == 39 || self.id == 52){  //14 25 39 52打boss
                                if(GLOBALDATA.base.wins >= 3 || GLOBALDATA.base.vip>=1){
                                    if(self.guideStage != GLOBALDATA.base.stage){  //当本关卡没有触发的时候才触发
                                        var evn = new cc.EventCustom('remove.Other');
                                        cc.eventManager.dispatchEvent(evn);
                                        self.guideStage = GLOBALDATA.base.stage;
                                    }
                                    self.beginShow(self.id);
                                }
                            }
                        }
                        //监听level来处理是否胜利了
                        if(resData.data.data.hasOwnProperty("lev")){
                            if(self.id == 15 || self.id == 26 || self.id == 40 || self.id == 53){  //15 26 40 53战斗胜利
                                self.isWin = true;
                                var evn = new cc.EventCustom('remove.Other');
                                cc.eventManager.dispatchEvent(evn);
                                self.beginShow(self.id);
                            }
                        }
                    }
                }
            });
            cc.eventManager.addListener(this.MonitorBaseEvent,1);
        }
    },
    //结束检测data.update.base的事件
    endMonitorBase:function () {
        if(this.MonitorBaseEvent){
            cc.eventManager.removeListener(this.MonitorBaseEvent);
            this.MonitorBaseEvent = null;
        }
    },
    //显示界面
    showPanel:function () {
        this.jiangeShowTime = 0;  //显示间隔时间
        this.jiangeClickTime = 0;  //点击间隔时间
        this.setVisible(true);
        this.Image_guide.setVisible(false);
        newGuideModel.setRunState(true);
    },
    //隐藏界面  isremove 移除该界面 isremove 不移除该界面
    HidePanel:function(isremove) {
        this.setVisible(false);
        if(isremove){
            newGuideModel.setRunState(false);
            this.removeFromParent(true);
        }
    },
    //防错处理
    PreventErrorDeal:function(){
        //后期根据实际情况处理
        return false;
    },
    //隐藏当前一些控件
    HideSomeImage:function () {
        this.Image_tips.setVisible(false);
        this.Node_circle.setVisible(false);
        this.Image_dialog.setVisible(false);
    },
    //增加遮盖层
    SetZheGaiVisible:function(visible){
        if(visible){
            this.Image_Cover.setVisible(true);
        }else{
            this.Image_Cover.setVisible(false);
        }
    },
    //延迟显示的定时器
    updateShow:function (dt) {
        this.jiangeShowTime = this.jiangeShowTime + dt;
        if(this.jiangeShowTime >= this.delayShow && this.delayShow != 0){  //延迟显示
            this.SetZheGaiVisible(false);
            this.delayShow = 0;
            this.jiangeShowTime = 0;
            this.unschedule(this.updateShow);
            this.NowBeginShow();
        }
    },
    //延迟点击的定时器
    updateClick:function(dt){
        this.jiangeClickTime = this.jiangeClickTime  + dt;
        if(this.jiangeClickTime >= this.delayClick && this.delayClick != 0){  //延迟点击
            this.SetZheGaiVisible(false);
            this.delayClick = 0;
            this.jiangeClickTime = 0;
            this.unschedule(this.updateClick);
        }
    },
    //全屏加手
    showDialog:function(guide){
        this.Image_guide.setVisible(true);
        this.Image_dialog.setVisible(true);
        this.Text_name.setString(guide.name);
        this.Text_dialog.setString(guide.dialog);
        this.Node_circle.setVisible(true);
        this.Node_circle.setPosition(guide.pos[0],guide.pos[1]);
        this.Image_dialog.setPosition(guide.d_pos[0],guide.d_pos[1]);
        this.Image_tips.setVisible(false);
        if(this.tp == 1){ //全屏加手(不带继续)
            this.Button_go.setVisible(false);
        }else if(this.tp == 5){  //全屏加手(自带继续)
            this.Button_go.setVisible(true);
        }
    },
    //手
    showCircle:function (guide) {
        this.Image_dialog.setVisible(false);
        this.Image_tips.setVisible(false);
        this.Node_circle.setVisible(true);
        this.Node_circle.setPosition(guide.pos[0],guide.pos[1]);
        if(this.tp == 2){  //手其它的位置不能点击
            this.Image_guide.setVisible(true);
        }else if(this.tp == 6){ //手其它的位置可以点击
            this.Image_guide.setVisible(false);
        }
    },
    //手加小说明
    showTips:function(guide){
        this.Image_guide.setVisible(true);
        this.Image_dialog.setVisible(false);
        this.Image_tips.setVisible(true);
        this.Text_tips.setString(guide.dialog);
        this.Node_circle.setVisible(true);
        this.Node_circle.setPosition(guide.pos[0],guide.pos[1]);
        this.Image_tips.setPosition(guide.d_pos[0],guide.d_pos[1]);
    },
    //继续的按钮的事件
    continueEvent:function (sender, type) {
        if(ccui.Widget.TOUCH_ENDED == type){
            this.endShow();
        }
    },
    //点击之后的操作
    endShow:function () {
        var guide = NEWGUIDECFG[this.id];
        //发送保存点
        if(this.typeid == 1 && this.sendtype == 1){  //如果是新手指引并且是点击之后发送
            newGuideModel.setGuideId(this.id);
        }
        //特殊处理  新手引导取消了该功能
        /*if(this.id == 501){
            var evn = new cc.EventCustom('special.NewGuid');
            var temp = {};
            temp.LayerName = guide.LayerName;
            temp.x = guide.pos[0];
            temp.y = guide.pos[1];
            evn.setUserData(temp);
            cc.eventManager.dispatchEvent(evn);
        }*/
        if(this.nextid > 0){
            this.beginShow(this.nextid);
        }else if(newGuideModel.isRunNewGuide()){  //新手引导还没有走完
            this.HidePanel(false);
            this.id = guide.conid;
            if(this.id == 14 || this.id == 25 || this.id == 39 || this.id == 52){  //14 25 39 52打boss
                this.beginShow(this.id);
            }else{
                this.startMonitorBase();
            }
        }else{
            this.HidePanel(true);
        }
    },
    //特效中的可点击的事件
    nextGuidClickEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED == type){
            var id = this.id;
            var guide = NEWGUIDECFG[id];
            if(guide.LayerName != null && guide.wigName != null){
                var evn = new cc.EventCustom('newGuide');
                var temp = {};
                temp.LayerName = guide.LayerName;
                temp.wigName = guide.wigName;
                evn.setUserData(temp);
                cc.eventManager.dispatchEvent(evn);
            }
            this.endShow();
        }
    },
    onExit:function(){
        this._super();
        cc.eventManager.removeListener(this.showGuideEvent);
    },
});