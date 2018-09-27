
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 /**
 * 物品合成层的创建
 */

var itemHeCLayer = ModalDialog.extend({
    LayerName:"itemHeCLayer",
    ctor:function(itemid){
        this._super();
        this.itemid = itemid;
        this.tNum = 0;  //碎片总数量
        this.wNum = 0;  //万能箱数量
    },

    onEnter:function(){
        this._super();
        this.initCustomEvent();
    },
    //初始化ui
    initUI:function () {
        this.customWidget();  //自定义Widget
        this.updateInfo();
    },
    initCustomEvent:function () {
        var self = this;
        this.networkComposeEvent = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "knapsack.compose",
            callback: function(event){
                var resData = event.getUserData();
                if(resData.status == 0){
                    //获得的物品
                    var task = 'resource.get';
                    var event = new cc.EventCustom(task);
                    event.setUserData(resData);
                    cc.eventManager.dispatchEvent(event);
                    //移除界面
                    self.removeFromParent(true);
                    //更新背包
                    var evn = new cc.EventCustom('updateUI.bag');
                    cc.eventManager.dispatchEvent(evn);
                }
            }
        });
        cc.eventManager.addListener(this.networkComposeEvent, this);
    },
    //自定义Widget
    customWidget:function(){
        var wgtArr = [];
        wgtArr.push("ImageFastWar");   //最大的背景
        wgtArr.push("bagBg");   //物品背景
		wgtArr.push("bagIcon");   //icon
		wgtArr.push("bagPieces");   //碎片图标
		wgtArr.push("bagName");   //名字
		wgtArr.push("bagNum");   //数量
        wgtArr.push("bagSNum");   //碎片数量
        wgtArr.push("bagXNum");   //万能箱数量
		wgtArr.push("bagDate");   //描述
		wgtArr.push("btnOk");   //合成按钮
		wgtArr.push("btnAuto");   //一键合成按钮
		
        var uiItemHe = ccsTool.load(res.uiItemHeCLayer,wgtArr);
        //控件的名字赋值给this变量
        for(var key in uiItemHe.wgt){
            this[key] = uiItemHe.wgt[key];
        }
        this.addChild(uiItemHe.node);

        //使用按钮
        this.btnOk.addTouchEventListener(this.composeEvent,this);
        //一键合成按钮
        this.btnAuto.addTouchEventListener(this.allComposeEvent,this);
    },
    updateInfo:function(){
        var itemCfg = Helper.findItemId(this.itemid);
        var fragCfg = GOODSFRAGCFG[this.itemid];
        //物品图标
        Helper.LoadIconFrameAndAddClick(this.bagIcon,this.bagBg,this.bagPieces,itemCfg);
        //物品名称
        this.bagName.setString(itemCfg.itemname);
        Helper.setNamecolorByQuality(this.bagName,itemCfg.quality);
        //描述
        this.bagDate.setString(itemCfg.describe);
        //数量
        var have = Helper.getItemNum(this.itemid);
        this.tNum = have;
        this.bagNum.setString(have);
        //碎片数量
        var strText = StringFormat(STRINGCFG[100228].string,have+"/"+fragCfg.usenum);  //100228	碎片数量：$1
        this.bagSNum.setString(strText);
        //万能箱数量
        if(fragCfg.otherid != null){
            this.bagXNum.setVisible(true);
            var oitemCfg = Helper.findItemId(fragCfg.otherid);
            var ohave = Helper.getItemNum(fragCfg.otherid);
            this.wNum = ohave;
            var strText = oitemCfg.itemname+STRINGCFG[100044].string+"："+ohave;  //100044	数量
            this.bagXNum.setString(strText);
        }else{
            this.bagXNum.setVisible(false);
        }
        //一键合成按钮
        if(this.tNum >= fragCfg.usenum*2){
            this.btnAuto.setVisible(true);
        }else{
            this.btnAuto.setVisible(false);
            this.btnOk.setPositionX(this.ImageFastWar.getContentSize().width/2);
        }
    },
    //合成按钮的事件
    composeEvent:function (sender,type) {
        if(ccui.Widget.TOUCH_ENDED==type) {
            var fragCfg = GOODSFRAGCFG[this.itemid];
            if(this.tNum + this.wNum < fragCfg.usenum){
                ShowTipsTool.ErrorTipsFromStringById(100229);   //100229	合成数量不满足条件
                return;
            }
            bagModel.sendCompose(fragCfg.purposeid,1);
        }
    },
    //一键合成按钮的事件
    allComposeEvent:function (sender,type) {
        if(ccui.Widget.TOUCH_ENDED==type) {
            var fragCfg = GOODSFRAGCFG[this.itemid];
            bagModel.sendCompose(fragCfg.purposeid,Math.floor(this.tNum/fragCfg.usenum));
        }
    },
    onExit:function(){
        this._super();
        cc.eventManager.removeListener(this.networkComposeEvent);
    }
});