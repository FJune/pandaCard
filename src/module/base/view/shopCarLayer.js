
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
var ShopCarLayer = baseLayer.extend({
    ctor:function () {
        this._super();
        this.LayerName = "ShopCarLayer";
        this.selectpage = 0;
    },

    onEnter:function () {
        this._super();
    },

    initUI:function(){
        this.obj = ccsTool.load(res.uiShopCarLayer, ["btnBack", "duanValue", "shopCarList"
        , "btnBlueShop", "btnYellow", "btnRed"]);

        this.addChild(this.obj.node, 1);

        this.obj.wgt.btnBack.addTouchEventListener(this.onTouchEvent, this);

        this.obj.wgt.btnBlueShop.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.btnYellow.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.btnRed.addTouchEventListener(this.onTouchEvent, this);

        this.btnTabs = [null, this.obj.wgt.btnBlueShop, this.obj.wgt.btnYellow, this.obj.wgt.btnRed];
        this.doAddListener();

        this.switchView(1);
    },

    doAddListener:function(){
        var self = this;
        // 商品购买
        this.shop_buy = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "shop.buy",
            callback: function(event){
                self.switchView(self.selectpage );
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
                case "btnBlueShop":
                    this.switchView(1);
                    break;
                case "btnYellow":
                    this.switchView(2);
                    break;
                case "btnRed":
                    this.switchView(3);
                    break;
            }
        }
    },

    // 普通/精英副本 切换
    switchView:function(page){
        var btn = this.btnTabs[this.selectpage];
        if (btn != null)
        {
            btn.setTouchEnabled(true);
            btn.setHighlighted(false);
        }
        btn = this.btnTabs[page];
        btn.setTouchEnabled(false);
        btn.setHighlighted(true);

        this.selectpage = page;

        this.obj.wgt.duanValue.setString(Helper.getItemNum(21));     //座驾原料

        var list = GLOBALDATA.shop.blist || {};
        var i = 0;

        this.obj.wgt.shopCarList.removeAllChildren();
        for (var key in SHOPCARCFG)
        {
            var cfg = SHOPCARCFG[key];
            var it = list[cfg.index] || {bn:0};
            if (it)
            {
                if (page == cfg.page)
                {
                    var item = ITEMCFG[cfg.id];

                    var itemObj = ccsTool.load(res.uiShopCarItem, ["bagItem",
                    "bagEquItemBg", "bagEquItemIcon", "bagEquItemPieces", "bagEquItemNum","bagEquItemName"
                    , "textItemGuan"
                    , "textEquItemValue1",
                    , "buyCarButton"]);


                    Helper.LoadIconFrameAndAddClick(itemObj.wgt.bagEquItemIcon, itemObj.wgt.bagEquItemBg,  itemObj.wgt.bagEquItemPieces, item);
                    Helper.setNamecolorByQuality(itemObj.wgt.bagEquItemName, item.quality);
                    itemObj.wgt.bagEquItemName.setString(item.itemname);
                    itemObj.wgt.bagEquItemNum.setString(cfg.discount > 1 ? cfg.discount : "");

                    //第1种货币
                    itemObj.wgt.textEquItemValue1.setString(cfg.pricetype[0][1]);

                    //终生购买次数
                    if (cfg.xian > 0 && cfg.xian > it.bn)
                    {
                        itemObj.wgt.textItemGuan.setString(StringFormat(STRINGCFG[100220].string, (cfg.xian - it.bn)));
                    }
                    else
                    {
                        itemObj.wgt.textItemGuan.setString("");

                        if (cfg.xian <= it.bn)
                        {
                            itemObj.wgt.buyCarButton.setTouchEnabled(false);
                            itemObj.wgt.buyCarButton.setBright(false);
                        }
                    }

                    itemObj.wgt.buyCarButton.setTag(key);
                    itemObj.wgt.buyCarButton.setUserData(i + 1);

                    itemObj.wgt.buyCarButton.addTouchEventListener(this.onTouchBuy,this);

                    var bagItem = itemObj.wgt.bagItem;
                    bagItem.removeFromParent(false);
                    this.obj.wgt.shopCarList.pushBackCustomItem(bagItem);

                    i++;
                }
            }
        }
        this.obj.wgt.shopCarList.jumpToTop();
    },

    //
    onTouchBuy:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED == type){
            var key = sender.getTag();
            var pos = sender.getUserData();
            var cfg = SHOPCARCFG[key];
            var it = GLOBALDATA.shop.blist[cfg.index] || {bn:0};

            if (cfg.xian > 0 && it.bn >= cfg.xian)
            {
                ShowTipsTool.TipsFromText(STRINGCFG[100215].string, cc.color.RED, 30);
            }
            else
            {
                var shopBuyLayer = new ShopBuyLayer(9, pos, cfg.index, cfg.id, cfg.discount, cfg.pricetype[0][0], cfg.pricetype[0][1], cfg.xian > 0 ? (cfg.xian - it.bn) : 99);
                this.addChild(shopBuyLayer,100);
            }

        }
    },
    onExit:function () {
        this._super();
        cc.eventManager.removeListener(this.shop_buy);
    }
});