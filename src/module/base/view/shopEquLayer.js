
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
var ShopEquLayer = baseLayer.extend({
    ctor:function () {
        this._super();
        this.LayerName = "ShopEquLayer";
        this.selectpage = 0;

        var stage = GLOBALDATA.base.stage;
        this.stagelevel = 0;
        for(var key in STAGECFG){
            if(STAGECFG[key].stageid == stage){
                this.stagelevel = STAGECFG[key].stagelevel;
                break;
            }
        }
    },

    onEnter:function () {
        this._super();
    },

    initUI:function(){
        this.obj = ccsTool.load(res.uiShopEquLayer, ["btnBack", "duanValue", "redValue", "shopEquList"
        , "btnEquShop", "btnEquPurple", "btnEquRed","btnEquReward"]);

        this.addChild(this.obj.node, 1);

        this.obj.wgt.btnBack.addTouchEventListener(this.onTouchEvent, this);

        this.obj.wgt.btnEquShop.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.btnEquPurple.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.btnEquRed.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.btnEquReward.addTouchEventListener(this.onTouchEvent, this);

        this.btnTabs = [null, this.obj.wgt.btnEquShop, this.obj.wgt.btnEquPurple, this.obj.wgt.btnEquRed, this.obj.wgt.btnEquReward];
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
                case "btnEquShop":
                    this.switchView(1);
                    break;
                case "btnEquPurple":
                    this.switchView(2);
                    break;
                case "btnEquRed":
                    this.switchView(3);
                    break;
                case "btnEquReward":
                    this.switchView(4);
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

        this.obj.wgt.duanValue.setString(Helper.getItemNum(16));     //军备值
        this.obj.wgt.redValue.setString(Helper.getItemNum(19));      //红色精华

        var list = GLOBALDATA.shop.blist || {};
        var idx = 0;
        var i = 0;

        this.obj.wgt.shopEquList.removeAllChildren();
        for (var key in SHOPEQUCFG)
        {
            var cfg = SHOPEQUCFG[key];
            if (page == cfg.page)
            {
                var item = ITEMCFG[cfg.id];
                var it = list[cfg.index] || {bn:0};
                if (item  && it)
                {
                    var itemObj = ccsTool.load(res.uiShopEquItem, ["bagItem",
                    "bagEquItemBg", "bagEquItemIcon", "bagEquItemPieces", "bagEquItemNum","bagEquItemName"
                    , "textEquItemNum", "textItemGuan"
                    , "textEquItemValue1", "ImageEquItemBg2", "textEquItemValue2"
                    , "buyEquButton"]);


                    Helper.LoadIconFrameAndAddClick(itemObj.wgt.bagEquItemIcon, itemObj.wgt.bagEquItemBg,  itemObj.wgt.bagEquItemPieces, item);
                    Helper.setNamecolorByQuality(itemObj.wgt.bagEquItemName, item.quality);
                    itemObj.wgt.bagEquItemName.setString(item.itemname);
                    itemObj.wgt.bagEquItemNum.setString(cfg.discount > 1 ? cfg.discount : "");

                    // 装备碎片 显示 拥有量
                    itemObj.wgt.textEquItemNum.setString(item.maintype == 8 ? Helper.formatNum(Helper.getItemNum(cfg.id)) + "/" + EQUIPFRAGCFG[cfg.id].neednum: "");

                    //第1种货币
                    itemObj.wgt.textEquItemValue1.setString(cfg.pricetype[0][1]);

                    //第2种货币
                    itemObj.wgt.ImageEquItemBg2.setVisible(cfg.pricetype.length > 1);
                    itemObj.wgt.textEquItemValue2.setString(cfg.pricetype.length > 1 ? cfg.pricetype[1][1] : cfg.pricetype[0][1]);


                    if (cfg.require[0] == 2 && this.stagelevel < cfg.require[1])
                    {
                        itemObj.wgt.textItemGuan.setString(StringFormat(STRINGCFG[100218].string, cfg.require[1]));
                        itemObj.wgt.buyEquButton.setTouchEnabled(false);
                        itemObj.wgt.buyEquButton.setBright(false);
                    }
                    else if (cfg.require[0] == 1 && GLOBALDATA.base.vip < cfg.require[1])
                    {
                        itemObj.wgt.textItemGuan.setString(StringFormat(STRINGCFG[100219].string, cfg.require[1]));
                        itemObj.wgt.buyEquButton.setTouchEnabled(false);
                        itemObj.wgt.buyEquButton.setBright(false);
                    }
                    else if (cfg.only > 0 && cfg.only > it.bn)
                    {
                        itemObj.wgt.textItemGuan.setString(StringFormat(STRINGCFG[100220].string, (cfg.only - it.bn)));
                    }
                    else
                    {
                        itemObj.wgt.textItemGuan.setString("");
                    }

                    itemObj.wgt.buyEquButton.setTag(key);
                    itemObj.wgt.buyEquButton.setUserData(i + 1);
                    itemObj.wgt.buyEquButton.addTouchEventListener(this.onTouchBuy,this);

                    var bagItem = itemObj.wgt.bagItem;
                    bagItem.removeFromParent(false);

                    //终生购买次数
                    if (cfg.only == 0 || it.bn < cfg.only)
                    {
                        this.obj.wgt.shopEquList.insertCustomItem(bagItem, idx++);
                    }
                    else
                    {
                        itemObj.wgt.buyEquButton.setTouchEnabled(false);
                        itemObj.wgt.buyEquButton.setBright(false);
                        //
                        this.obj.wgt.shopEquList.pushBackCustomItem(bagItem);
                    }

                    i++;
                }
            }
        }
        this.obj.wgt.shopEquList.jumpToTop();
    },

    //
    onTouchBuy:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED == type){
            var key = sender.getTag();
            var pos = sender.getUserData();
            var cfg = SHOPEQUCFG[key];
            var it = GLOBALDATA.shop.blist[cfg.index] || {bn:0};


            var shopBuyLayer = new ShopBuyLayer(3, pos, cfg.index, cfg.id, cfg.discount, cfg.pricetype[0][0], cfg.pricetype[0][1], cfg.xian > 0 ? cfg.xian : 99);
            this.addChild(shopBuyLayer,100);

        }
    },
    onExit:function () {
        this._super();
        cc.eventManager.removeListener(this.shop_buy);
    }
});