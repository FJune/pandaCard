
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 /**
 * 金币兑换层的创建
 */

var buyGoldLayer = ModalDialog.extend({
    LayerName:"buyGoldLayer",
    ctor:function(){
        this._super();
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
        this.networkChangeGoldEvent = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "exchange.change",
            callback: function(event){
                var resData = event.getUserData();
                if(resData.status == 0){
                    //获得的物品
                    var task = 'resource.get';
                    var event = new cc.EventCustom(task);
                    event.setUserData(resData);
                    cc.eventManager.dispatchEvent(event);
                    //更新信息
                    self.updateInfo();
                }
            }
        });
        cc.eventManager.addListener(this.networkChangeGoldEvent, this);
        //移除自己
        this.removeOtherEvent = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "remove.Other",
            callback: function(event){
                self.removeFromParent(true);
            }
        });
        cc.eventManager.addListener(this.removeOtherEvent, this);
    },
    //自定义Widget
    customWidget:function(){
        var wgtArr = [];
        wgtArr.push("ImageFastWar");   //背景
		wgtArr.push("btnBack");   //返回按钮
		wgtArr.push("textCos");   //后勤补给箱或者钻石的数量
		wgtArr.push("imageGoldStone");   //后勤补给箱或者钻石的图片
		wgtArr.push("textGold");   //兑换金币数
		wgtArr.push("textNum");   //剩余次数
		wgtArr.push("textDate");   //下一VIP的兑换说明
		wgtArr.push("btnExchange");   //兑换按钮
		
        var uiBuyGold = ccsTool.load(res.uiBuyGoldLayer,wgtArr);
        //控件的名字赋值给this变量
        for(var key in uiBuyGold.wgt){
            this[key] = uiBuyGold.wgt[key];
        }
        this.addChild(uiBuyGold.node);

        uiBuyGold.action.play("tipsAction", false);
        this.ImageFastWar.runAction(uiBuyGold.action);
        //返回按钮
        this.btnBack.addTouchEventListener(this.backEvent, this);
        //兑换按钮
        this.btnExchange.addTouchEventListener(this.changeGoldEvent, this);
    },
    updateInfo:function(){
        var have = Helper.getItemNum(108);
        if(have>0){  //如果有后勤补给箱
            this.textCos.setString("1/"+have);  //后勤补给箱或者钻石的数量
            var itemCfg = Helper.findItemId(108);
            Helper.LoadIcoImageWithPlist(this.imageGoldStone,itemCfg);  //后勤补给箱或者钻石的图片
        }else{   //如果没有后勤补给箱
            this.textCos.setString(20);  //后勤补给箱或者钻石的数量
            this.imageGoldStone.loadTexture("common/i/i_004.png", ccui.Widget.PLIST_TEXTURE); //钻石的图片
            //var itemCfg = Helper.findItemId(2);
            //Helper.LoadIcoImageWithPlist(this.imageGoldStone,itemCfg);  //后勤补给箱或者钻石的图片
        }
        //兑换金币数
        var offlinegold = 0;
        var isfind = false;  //是否已经找到
        for(var key in STAGECFG){
            if(STAGECFG[key].stageid == GLOBALDATA.base.stage){
                if(STAGECFG[key].stagetype==2){
                    offlinegold = STAGECFG[key].offlinegold;
                    isfind = true;
                }
            }else if(isfind){
                break;
            }
        }
        this.textGold.setString(Helper.formatNum(offlinegold*60*2));
        //剩余次数
        var nowVip = Helper.getVipNumberByUneed(GLOBALDATA.base.vip,8);
        var strText = StringFormat(STRINGCFG[100222].string,GLOBALDATA.base.mchange);  //100222	剩余$1次
        this.textNum.setString(strText);
        //下一vip的提示
        var nextVip = Helper.getVipNumberByUneed(GLOBALDATA.base.vip+1,8);
        if(nextVip != null){  //还有下一级
            var strText = StringFormat(STRINGCFG[100223].string,[GLOBALDATA.base.vip+1,nextVip]);  //100223	兑换2小时离线收益（VIP特权不计算在内），VIP$1每天可兑换$1次
            this.textDate.setString(strText);  //下一VIP的兑换说明
        }else{  //没有下一级了
            var strText = StringFormat(STRINGCFG[100223].string,[GLOBALDATA.base.vip,nowVip]);  //100223	兑换2小时离线收益（VIP特权不计算在内），VIP$1每天可兑换$1次
            this.textDate.setString(strText);  //下一VIP的兑换说明
        }
    },
    //返回按钮
    backEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type) {
            this.removeFromParent(true);
        }
    },
    //兑换金币的按钮
    changeGoldEvent:function (sender, type) {
        if(ccui.Widget.TOUCH_ENDED==type) {
            //判断兑换次数时候足够
            if(GLOBALDATA.base.mchange <= 0){
                var nowVip = Helper.getVipNumberByUneed(GLOBALDATA.base.vip,8);
                if(nowVip != null){
                    //弹出提示框
                    var event = new cc.EventCustom("TipsLayer_show");
                    var strText =  StringFormat(STRINGCFG[100224].string,30); //100224	"提升VIP等级可提升次数是否前往充值"
                    var data = {string:strText, callback:this.gotoRechargeCall, target:this};
                    event.setUserData(data);
                    cc.eventManager.dispatchEvent(event);
                    return;
                }else{
                    ShowTipsTool.ErrorTipsFromStringById(100297);   //100297	次数已经用完
                    return;
                }
            }
            //如果补给箱消耗完了  判断钻石是否足够
            var have = Helper.getItemNum(108);
            if(have <= 0){
                if(GLOBALDATA.base.diamond < 20){
                    ShowTipsTool.ErrorTipsFromStringById(100208);  //100208	钻石不足
                    return;
                }
            }
            //发送兑换的消息
            if(have > 0){
                bagModel.sendBuyGold(1,1);  //有补给箱用补给箱换
            }else{
                bagModel.sendBuyGold(1,2);   //没有补给箱用钻石换
            }

        }
    },
    //跳转到充值的回调
    gotoRechargeCall:function(ttype){
        if (ttype == 1) // 确定
        {
            //后期处理 跳转到充值
        }
    },
    onExit:function(){
        this._super();
        cc.eventManager.removeListener(this.networkChangeGoldEvent);
        cc.eventManager.removeListener(this.removeOtherEvent);
        //更新背包界面
        var evn = new cc.EventCustom('updateUI.bag');
        cc.eventManager.dispatchEvent(evn);
        //更新购买金币
        var evn = new cc.EventCustom('updateUI.fromBuyGold');
        cc.eventManager.dispatchEvent(evn);
    }
});