
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 /**
 * 首充礼包层的创建
 */
var welfareSCLayer = ModalDialog.extend({
    LayerName:"welfareSCLayer",
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
        this.showPanel();
    },
    //自定义Widget
    customWidget:function () {
        var wgtArr = [];
        wgtArr.push("btnBack");  //返回按钮
        wgtArr.push("B_buy");  //前往充值的按钮
		for(var i=1;i<=6;i++){
			 wgtArr.push("bagItemBg"+i);
			 wgtArr.push("bagItemIcon"+i);
			 wgtArr.push("bagItemPieces"+i);
			 wgtArr.push("bagItemNum"+i);
			 wgtArr.push("textItemName"+i);
		}
        var uiWelfareSC = ccsTool.load(res.uiWelfareSCLayer,wgtArr);
        //控件的名字赋值给this变量
        for(var key in uiWelfareSC.wgt){
            this[key] = uiWelfareSC.wgt[key];
        }
        this.addChild(uiWelfareSC.node, 2);

        this.btnBack.addTouchEventListener(this.onTouchEvent, this);  //返回按钮
        this.B_buy.addTouchEventListener(this.gotoRechargeEvent, this);  //前往充值的按钮
    },
    initCustomEvent:function(){
        var self = this;
    },
    //显示界面的信息
    showPanel:function(){
        var list = ACTIVITYCONTROLCFG[100].subid;
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
        //奖励
        var count =1;
        for(var i=1;i<=6;i++){
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
        for(var i=count;i<=6;i++){
            this["bagItemBg"+i].setVisible(false);
        }
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
    //前往充值的按钮
    gotoRechargeEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED == type){
            //前往充值的功能 后期添加
        }
    },
    //奖励物品的点击事件
    itemSeeEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED == type){
            var id = sender.getTag();
            showInitialItemPreview(this,id);  //初始物品的预览
        }
    },
    onExit:function () {
        this._super();
    }
});