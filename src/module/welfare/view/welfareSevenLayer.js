
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 /**
 * 开服七天乐层的创建
 */
var WelfareSevenLayer = ModalDialog.extend({
    ctor:function(){
        this._super();
        this.LayerName = "WelfareSevenLayer";
    },

    onEnter:function(){
        this._super();
    },

    initUI:function(){
        this.obj = ccsTool.load(res.uiWelfareSevenLayer, ["btnBack", "sevenList"]);
        this.addChild(this.obj.node, 2);

        this.obj.wgt.btnBack.addTouchEventListener(this.onTouchEvent, this);

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
                }
            }});
        cc.eventManager.addListener(this.activity_finish, 1);
    },

    showView:function(){
        this.obj.wgt.sevenList.removeAllChildren();
        var list = ACTIVITYCONTROLCFG[1].subid;
        var day = 1;
        for (var key in list)
        {
            var id = list[key];
            var task = GLOBALDATA.activitylist[id] || {s:2};

            var cfg = ACTIVITYCFG[id];
            if (task && cfg)
            {
                var itemObj = ccsTool.load(res.uiWelSevenItem, ["bagItem", "textItemDay", "bagItemNo", "bagItemGet", "bagItemHad",
                     "bagItemBg1", "bagItemIcon1", "bagItemPieces1", "bagItemNum1", "textItemName1",
                     "bagItemBg2", "bagItemIcon2", "bagItemPieces2", "bagItemNum2", "textItemName2",
                     "bagItemBg3", "bagItemIcon3", "bagItemPieces3", "bagItemNum3", "textItemName3",
                     "bagItemBg4", "bagItemIcon4", "bagItemPieces4", "bagItemNum4", "textItemName4"]);

                for (var i = 1; i <= 4; i++ )
                {
                    if (i <= cfg.reward.length)
                    {
                        var item = ITEMCFG[cfg.reward[i-1][0]];
                        if (item)
                        {
                            Helper.LoadIconFrameAndAddClick(itemObj.wgt["bagItemIcon" +i], itemObj.wgt["bagItemBg" + i], itemObj.wgt["bagItemPieces" + i], item);
                            itemObj.wgt["bagItemNum" + i].setString(Helper.formatNumFloor(cfg.reward[i-1][1]));
                            itemObj.wgt["textItemName" + i].setString(Helper.formatNumFloor(item.itemname));

                            itemObj.wgt["bagItemBg" + i].setTag(cfg.reward[i-1][0]);
                            itemObj.wgt["bagItemBg" + i].addTouchEventListener(this.onItemTouchEvent, this);
                        }
                    }
                    else
                    {
                        itemObj.wgt["bagItemBg" + i].setVisible(false);
                    }
                }

                itemObj.wgt.textItemDay.setString(StringFormat("第$1天", day));

                var bagItem = itemObj.wgt.bagItem;
                if (task.s == 3)  //已领取
                {
                    itemObj.wgt.bagItemHad.setVisible(true);
                }
                else if (task.s == 2)  //可领取
                {
                    itemObj.wgt.bagItemGet.setVisible(true);

                    bagItem.setTag(id);
                    bagItem.addTouchEventListener(this.onItemTouchEvent, this);
                }
                else                // 未满足
                {
                    itemObj.wgt.bagItemNo.setVisible(true);
                }

                bagItem.removeFromParent(false);
                this.obj.wgt.sevenList.pushBackCustomItem(bagItem);

                day++;
            }
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
            switch(sender.name)
            {
            case "bagItem":
                var id = sender.getTag(); //可领取
                welfareModel.activityFinish(id);
                break;
            case "bagItemBg1":
            case "bagItemBg2":
            case "bagItemBg3":
            case "bagItemBg4":
                var id = sender.getTag();
                var _itemSeeLayer = new itemSeeLayer(id,0);
                this.addChild(_itemSeeLayer, 2);
                break;
            }
        }
    },

    onExit:function () {
        this._super();
        cc.eventManager.removeListener(this.activity_finish);
    }
});