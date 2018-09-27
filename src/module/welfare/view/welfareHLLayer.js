
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 /**
 * 开服红利层的创建  喵喵商店
 */
var welfareHLLayer = ModalDialog.extend({
    LayerName:"welfareHLLayer",
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
    },
    //自定义Widget
    customWidget:function () {
        var wgtArr = [];
        wgtArr.push("btnBack");  //返回按钮
		wgtArr.push("textRedDia");  //获得钻石
		wgtArr.push("textRedHad");  //已完成标签
		wgtArr.push("ornFreeBtn");  //马上投资按钮
		wgtArr.push("diamongCos");  //花费钻石
        var uiWelfareHL = ccsTool.load(res.uiWelfareHLLayer,wgtArr);
        //控件的名字赋值给this变量
        for(var key in uiWelfareHL.wgt){
            this[key] = uiWelfareHL.wgt[key];
        }
        this.addChild(uiWelfareHL.node, 2);

        this.btnBack.addTouchEventListener(this.onTouchEvent, this);  //返回按钮
        this.ornFreeBtn.addTouchEventListener(this.getRewardEvent, this);  //购买按钮
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
        var list = ACTIVITYCONTROLCFG[8].subid;
        var info = null;
        for(var key in list){
            var id = list[key];
            var task = GLOBALDATA.activitylist[id];
            if(task != null){
                info = objClone(ACTIVITYCFG[id]);
                info.id = id;
                info.s = task.s;
                break;
            }
        }
        this.Info = info;
        var itemCfg = Helper.findItemId(info.reward[1][0]);
        this.textRedDia.setString(info.reward[1][1]+itemCfg.itemname);  //获得钻石
        this.diamongCos.setString(info.cost[1]);  //花费钻石
        if(task.s == 3){
            this.textRedHad.setVisible(true);   //已完成标签
            this.ornFreeBtn.setVisible(false);   //马上投资按钮
        }else{
            this.textRedHad.setVisible(false);   //已完成标签
            this.ornFreeBtn.setVisible(true);   //马上投资按钮
        }
        this.ornFreeBtn.setTag(info.id);
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