
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 /**
 * 每日签到层的创建
 */
var WelfareSignLayer = ModalDialog.extend({
    ctor:function(){
        this._super();
        this.LayerName = "WelfareSignLayer";
    },

    onEnter:function(){
        this._super();
    },

    initUI:function(){
        this.obj = ccsTool.load(res.uiWelfareSignLayer, ["btnBack", "signList"]);
        this.addChild(this.obj.node, 2);

        this.obj.wgt.btnBack.addTouchEventListener(this.onTouchEvent, this);
        this.doAddListener();
        this.showView();
    },

    doAddListener:function(){
        var self = this;
        // 领取奖励
        this.activity_monthreward = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "activity.monthreward",
            callback: function(event){
                var resData = event.getUserData();
                if(resData.status == 0){
                    self.showView();
                }
            }});
        cc.eventManager.addListener(this.activity_monthreward, 1);
    },

    showView:function(){
        var svrTime = GLOBALDATA.svrTime * 1000 + (Date.parse(new Date()) - GLOBALDATA.loginTime);

        var max = (new Date(svrTime)).getDate();
        var msign = GLOBALDATA.base.msign || 0;
        var mreward = GLOBALDATA.base.mreward || 0;

        var itemRank = [];
        var index = -1;
        var day = 1;
        this.obj.wgt.signList.removeAllChildren();
        for (var key in MONTHSIGNCFG)
        {
            var cfg = MONTHSIGNCFG[key];

            var itemObj = ccsTool.load(res.uiWelSignItem, ["bagItem",
                 "bagItemBg", "bagItemIcon", "bagItemPieces", "bagItemNum",
                 "bagItemSupplement", "bagItemGet",
                 "textItemNum", "FileNode_Get"]);

            var item = ITEMCFG[cfg.reward[0]];
            if (item)
            {
                Helper.LoadIconFrameAndAddClick(itemObj.wgt.bagItemIcon, itemObj.wgt.bagItemBg, itemObj.wgt.bagItemPieces, item);
                itemObj.wgt.bagItemNum.setString(Helper.formatNumFloor(cfg.reward[1]));
            }

            itemObj.wgt.FileNode_Get.setVisible(false);

            if (day <= msign)  //已签到
            {
                itemObj.wgt.bagItemGet.setVisible(true);
            }
            else if(day == msign + 1 && day <= max)
            {
                if (mreward <= 0) //可签到
                {
                    var act = ccs.load(res.effEquDZItem_json).action;
                    act.play("effDzAction", true);
                    var arsenBox = ccui.helper.seekWidgetByName(itemObj.wgt.FileNode_Get, "Sprite_1");
                    arsenBox.runAction(act);
                    itemObj.wgt.FileNode_Get.setVisible(true);
                }
                else //可补签
                {
                    itemObj.wgt.bagItemSupplement.setVisible(true);
                }
            }

            itemObj.wgt.textItemNum.setString(cfg.des); //日期

            var mod = (day - 1) % 5;
            var bagItem = itemObj.wgt.bagItem;
            bagItem.setTag(day);
            bagItem.setPositionX(bagItem.getContentSize().width * mod);
            bagItem.addTouchEventListener(this.onItemTouchEvent, this);
            if (mod == 0)
            {
                index++;
                itemRank[index] = new ccui.Widget();
                itemRank[index].setContentSize(this.obj.wgt.signList.getContentSize().width, bagItem.getContentSize().height);
                itemRank[index].setAnchorPoint(0,0);
                this.obj.wgt.signList.pushBackCustomItem(itemRank[index]);
            }
            bagItem.removeFromParent(false);
            itemRank[index].addChild(bagItem);

            day++;
        }
    },

    onTouchEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED == type){
            switch(sender.name){
                case "btnBack":
                    this.removeFromParent(true);
                    break;
            }
        }
    },

    onItemTouchEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED == type){
            var day = sender.getTag();
            var svrTime = GLOBALDATA.svrTime * 1000 + (Date.parse(new Date()) - GLOBALDATA.loginTime);

            var max = (new Date(svrTime)).getDate();
            var msign = GLOBALDATA.base.msign || 0;
            var mreward = GLOBALDATA.base.mreward || 0;

            if(day == msign + 1 && day <= max)
            {
                if (mreward <= 0) //可签到
                {
                    this.buqianCallback(1);
                }
                else //可补签
                {
                    this.buqianTisps(mreward);
                }
            }
            else  // 已签到 与 不可签到
            {
                var count = 0;
                for (var key in MONTHSIGNCFG)
                {
                    count++;
                    if (count == day)
                    {
                        var cfg = MONTHSIGNCFG[key];
                        var _itemSeeLayer = new itemSeeLayer(cfg.reward[0],0);
                        this.addChild(_itemSeeLayer, 2);
                        break;
                    }
                }
            }
        }
    },

    // 补签提示
    buqianTisps:function(times){
        var event = new cc.EventCustom("TipsLayer_show");
        var data = {string:StringFormat("是否花费$1钻石补签", 30 * times), callback:this.buqianCallback, target:this};
        event.setUserData(data);
        cc.eventManager.dispatchEvent(event);
    },

    // 签到
    buqianCallback:function(ttype){
        if (ttype == 1) // 确定
        {
            welfareModel.activityMonthreward();
        }
    },

    onExit:function () {
        this._super();
        cc.eventManager.removeListener(this.activity_monthreward);
    }
});