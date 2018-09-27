
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
var ShopLayer = baseLayer.extend({
    ctor:function () {
        this._super();
        this.LayerName = "ShopLayer";
    },

    onEnter:function () {
        this._super();
    },

    initUI:function(){
        this.obj = ccsTool.load(res.uiShopLayer, ["btnBack", "diamondValue", "btnShop", "shopList"]);

        this.addChild(this.obj.node, 1);

        this.obj.wgt.btnBack.addTouchEventListener(this.onTouchEvent, this);

        this.obj.wgt.btnShop.setTouchEnabled(false);
        this.obj.wgt.btnShop.setHighlighted(true);

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

        cc.eventManager.addListener(this.shop_buy, 1);
    },

    onTouchEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED == type){
            switch(sender.name)
            {
                case "btnBack":
                    this.removeFromParent(true);
                    break;
            }
        }
    },

    //
    switchView:function(){
        this.obj.wgt.diamondValue.setString(GLOBALDATA.base.diamond); //钻石

        var list = GLOBALDATA.shop.blist || {};
        var itemRank = [];
        var index = -1;
        var i = 0;

        this.obj.wgt.shopList.removeAllChildren();
        for (var key in SHOPCOMMONCFG)
        {
            var cfg = SHOPCOMMONCFG[key];
            var it = list[cfg.index] || {bn:0} ;
            if (it)
            {
                var item = ITEMCFG[cfg.id];

                var itemObj = ccsTool.load(res.uiShopItem, ["bagItem",
                "bagItemBg", "bagItemIcon", "bagItemPieces", "bagItemNum","bagItemName",
                "bagItemTui", "bagItemYuan", "bagItemLine",
                "ImageItemIcon", "textItemValue", "textItemNum"]);

                Helper.LoadIconFrameAndAddClick(itemObj.wgt.bagItemIcon, itemObj.wgt.bagItemBg,  itemObj.wgt.bagItemPieces, item);
                Helper.setNamecolorByQuality(itemObj.wgt.bagItemName, item.quality);
                itemObj.wgt.bagItemName.setString(item.itemname);
                itemObj.wgt.bagItemNum.setString(cfg.discount > 1 ? cfg.discount : ""); //堆叠

                //货币类型
                itemObj.wgt.ImageItemIcon.loadTexture("common/i/i_00" + ((cfg.pricetype[0][0] == 1) ? "3" : "4") + ".png", ccui.Widget.PLIST_TEXTURE);

                itemObj.wgt.textItemValue.setString(cfg.pricetype[0][1]);

                itemObj.wgt.textItemNum.setString(cfg.xian > 0 ? (STRINGCFG[100214].string + "(" + it.bn  + "/" + cfg.xian + ")") : "");

                //推荐
                itemObj.wgt.bagItemTui.setVisible(cfg.mark == 1);

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
                    itemRank[index].setContentSize(this.obj.wgt.shopList.getContentSize().width, bagItem.getContentSize().height);
                    itemRank[index].setAnchorPoint(0,0);
                    this.obj.wgt.shopList.pushBackCustomItem(itemRank[index]);
                }

                bagItem.removeFromParent(false);
                itemRank[index].addChild(bagItem);

                i++;
            }
        }
    },

    //
    onTouchBuy:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED == type){
            var key = sender.getTag();
            var pos = sender.getUserData();
            var cfg = SHOPCOMMONCFG[key];
            var it = GLOBALDATA.shop.blist[cfg.index] || {bn:0};

            if (cfg.xian > 0 && it.bn >= cfg.xian)
            {
                ShowTipsTool.TipsFromText(STRINGCFG[100215].string, cc.color.RED, 30);
            }
            else
            {
                var shopBuyLayer = new ShopBuyLayer(1, pos, cfg.index, cfg.id, cfg.discount, cfg.pricetype[0][0], cfg.pricetype[0][1], cfg.xian > 0 ? (cfg.xian - it.bn) : 99);
                this.addChild(shopBuyLayer,100);
            }
        }
    },
    onExit:function () {
        this._super();
        cc.eventManager.removeListener(this.shop_buy);
    }
});