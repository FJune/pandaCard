
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 /**
 *
 */
var ShopHeroLayer = baseLayer.extend({
    ctor:function () {
        this._super();
        this.LayerName = "ShopHeroLayer";
    },

    onEnter:function () {
        this._super();
    },

    initUI:function(){
        this.obj = ccsTool.load(res.uiShopHeroLayer, ["btnBack", "JunValue", "JunButton", "btnHeroShop", "shopHeroList"
        , "textHeroFreeNum", "textHeroFreeTime", "textHeroToday", "textHeroFree", "GoldImage1","JunValue1"
        , "btnHeroRefresh"]);

        this.addChild(this.obj.node, 1);

        this.obj.wgt.btnBack.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.JunButton.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.btnHeroRefresh.addTouchEventListener(this.onTouchEvent, this);

        this.obj.wgt.btnHeroShop.setTouchEnabled(false);
        this.obj.wgt.btnHeroShop.setHighlighted(true);

        this.schedule(this.countdown, 1, cc.REPEAT_FOREVER);

        this.doAddListener();

        this.switchView();
    },

    doAddListener:function(){
        var self = this;
        // 商品购买
        this.shop_buy = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "shop.buy",
            callback: function(event){
                self.switchView();
            }});

        this.shop_refresh = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "shop.refresh",
            callback: function(event){
                self.switchView();
            }});


        cc.eventManager.addListener(this.shop_buy, 1);
        cc.eventManager.addListener(this.shop_refresh, 1);
    },

    onTouchEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED == type){
            switch(sender.name)
            {
                case "btnBack":
                    this.removeFromParent(true);
                    break;
                case "JunButton":
                    var event = new cc.EventCustom("nav#changeModule");
                    event.setUserData("recoverButton");
                    cc.eventManager.dispatchEvent(event);
                    break;
                case "btnHeroRefresh":
                    this.refreshShop();
                    break;
            }
        }
    },

    // 普通/精英副本 切换
    switchView:function(){

        var in_array = function(search,array){
            for(var i in array){
                if(array[i]==search){
                    return true;
                }
            }
            return false;
        };

        var relation_list = [];
        for (var idx in GLOBALDATA.army.battle)
        {
            var armyid = GLOBALDATA.army.battle[idx];
            if (armyid > 0)
            {
                for (var key in ARMYRELATIONCFG)
                {
                    if (ARMYRELATIONCFG[key].armyid == armyid)
                    {
                        for (var key1 in ARMYRELATIONCFG[key].relation_armyvalue)
                        {
                            relation_list.push(ARMYRELATIONCFG[key].relation_armyvalue[key1]);
                        }
                    }
                }
            }
        }

        var list = GLOBALDATA.shop.slist || {};
        var itemRank = [];
        var index = -1;
        var i = 0;

        this.obj.wgt.shopHeroList.removeAllChildren();
        for (var key in list)
        {
            var it = list[key];
            var cfg = SHOPHEROCFG[it.index];
            if (cfg)
            {
                var item = ITEMCFG[cfg.id];

                var itemObj = ccsTool.load(res.uiShopItem, ["bagItem",
                "bagItemBg", "bagItemIcon", "bagItemPieces", "bagItemNum","bagItemName",
                "bagItemTui", "bagItemYuan", "bagItemLine", "bagItemBuy",
                "ImageItemIcon", "textItemValue", "textItemNum"]);

                Helper.LoadIconFrameAndAddClick(itemObj.wgt.bagItemIcon, itemObj.wgt.bagItemBg, itemObj.wgt.bagItemPieces, item);
                Helper.setNamecolorByQuality(itemObj.wgt.bagItemName, item.quality);
                itemObj.wgt.bagItemName.setString(item.itemname);

                //堆叠
                var discount = cfg.discount * cfg.dischance[it.dn - 1][0];
                itemObj.wgt.bagItemNum.setString(discount > 0 ? discount : "");

                var pricetype = cfg.pricetype[it.hn - 1][0];
                var price = cfg.pricetype[it.hn - 1][1] * cfg.dischance[it.dn - 1][0];

                var icon;
                if (pricetype == 1)
                {
                    icon = "common/i/i_003.png";
                }
                else if(pricetype == 2)
                {
                    icon = "common/i/i_004.png";
                }
                else if (pricetype == 17)
                {
                    icon = "common/i/i_043.png";
                }

                itemObj.wgt.ImageItemIcon.loadTexture(icon, ccui.Widget.PLIST_TEXTURE);

                itemObj.wgt.textItemValue.setString(price);

                itemObj.wgt.textItemNum.setString(cfg.xian > 0 ? (STRINGCFG[100214].string + "(" + it.bn + "/" + cfg.xian + ")") : "");


                var armyid = item.itemid;
                if (item.maintype == 3)  //士兵碎片
                {
                    armyid = GOODSFRAGCFG[item.itemid].purposeid;
                }

                if (cfg.xian > 0 && it.bn >= cfg.xian) // 已购买
                {
                    itemObj.wgt.bagItemBuy.setVisible(true);
                }
                else if (in_array(armyid, GLOBALDATA.army.battle))  // 已上阵
                {
                    itemObj.wgt.bagItemLine.setVisible(true);
                }
                else if (in_array(armyid, relation_list)) //(have_yuan(armyid))  // 缘分
                {
                    itemObj.wgt.bagItemYuan.setVisible(true);
                }

                var mod = i % 3;
                var bagItem = itemObj.wgt.bagItem;

                bagItem.setPositionX(bagItem.getContentSize().width * mod);
                bagItem.setTag(key);
                bagItem.setUserData(i + 1);
                bagItem.addTouchEventListener(this.onTouchBuy,this);

                if (mod == 0)
                {
                    index++;
                    itemRank[index] = new ccui.Widget();
                    itemRank[index].setContentSize(this.obj.wgt.shopHeroList.getContentSize().width, bagItem.getContentSize().height);
                    itemRank[index].setAnchorPoint(0,0);
                    this.obj.wgt.shopHeroList.pushBackCustomItem(itemRank[index]);
                }

                bagItem.removeFromParent(false);
                itemRank[index].addChild(bagItem);

                i++;
            }
        }

        var num10 = Helper.getItemNum(10);
        var num17 = Helper.getItemNum(17);

        this.obj.wgt.JunValue.setString(num17);     //军魂数
        if (num10 > 0)
        {
            this.obj.wgt.JunValue1.setString(num10);    //刷新卷
            this.obj.wgt.GoldImage1.loadTexture("common/i/i_072.png", ccui.Widget.PLIST_TEXTURE);
        }
        else
        {
            this.obj.wgt.JunValue1.setString(num17);    //军魂数
            this.obj.wgt.GoldImage1.loadTexture("common/i/i_043.png", ccui.Widget.PLIST_TEXTURE);
        }

        this.obj.wgt.textHeroToday.setString(STRINGCFG[100217].string + (VIPCFG[GLOBALDATA.base.vip].heroshop_max_r_num - GLOBALDATA.shop.rn));

        this.countdown();
    },

    //
    onTouchBuy:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED == type){
            var key = sender.getTag();
            var pos = sender.getUserData();
            var it = GLOBALDATA.shop.slist[key];
            var cfg = SHOPHEROCFG[it.index];
            var discount = cfg.discount * cfg.dischance[it.dn - 1][0];
            var pricetype = cfg.pricetype[it.hn - 1][0];
            var price = cfg.pricetype[it.hn - 1][1] * cfg.dischance[it.dn - 1][0]


            if (cfg.xian > 0 && it.bn >= cfg.xian)
            {
                ShowTipsTool.TipsFromText(STRINGCFG[100215].string, cc.color.RED, 30);
            }
            else
            {
                var shopBuyLayer = new ShopBuyLayer(2, pos, it.index, cfg.id, discount, pricetype, price, cfg.xian > 0 ? (cfg.xian - it.bn) : 99);
                this.addChild(shopBuyLayer,100);
            }
        }
    },

    refreshShop:function(){
        if (GLOBALDATA.shop.rn < VIPCFG[GLOBALDATA.base.vip].heroshop_max_r_num)
        {
            if (Helper.getItemNum(10) + Math.floor(Helper.getItemNum(17) / 20) + GLOBALDATA.shop.fn > 0)
            {
                Network.getInstance().send({task:"shop.refresh", typ:2});
            }
            else
            {
                ShowTipsTool.TipsFromText(STRINGCFG[100299].string, cc.color.RED, 30);
            }
        }
        else
        {
            if (GLOBALDATA.base.vip < 15)  //
            {
                //弹出提示框
                var event = new cc.EventCustom("TipsLayer_show");
                var data = {string:STRINGCFG[100224].string, callback:this.gotoRechargeCallback, target:this};
                event.setUserData(data);
                cc.eventManager.dispatchEvent(event);
            }
            else
            {
                ShowTipsTool.TipsFromText(STRINGCFG[100216].string, cc.color.RED, 30);
            }
        }
    },
    //跳转到充值的回调
    gotoRechargeCallback:function(ttype){
        if (ttype == 1) // 确定
        {
            //后期处理 跳转到充值
        }
    },

    countdown:function(){
        var str = "";
        var den = 0;
        if (GLOBALDATA.shop.fn < 4)
        {
            var svrTime = GLOBALDATA.svrTime + (Date.parse(new Date()) - GLOBALDATA.loginTime) / 1000;
            var at = GLOBALDATA.shop.at;

            var lt = (at - svrTime) % (2 * 3600);
            if (lt <= 0)
            {
                lt = 0 - lt;
                den = Math.floor(lt / (2 * 3600)) + 1;
                if (GLOBALDATA.shop.fn + den < 4)
                {
                    lt =  2 * 3600 - lt % (2 * 3600);
                }
                else
                {
                    lt = 0;
                }
            }
            if (lt > 0)
            {
                str = Helper.formatTime(lt);
            }
        }

        var cur = GLOBALDATA.shop.fn + den;

        this.obj.wgt.textHeroFreeNum.setString(StringFormat(STRINGCFG[100255].string, cur))
        this.obj.wgt.textHeroFreeTime.setString(str);

        this.obj.wgt.textHeroFree.setVisible(cur > 0);
    },

    onExit:function () {
        this._super();
        cc.eventManager.removeListener(this.shop_buy);
        cc.eventManager.removeListener(this.shop_refresh);
    }
});