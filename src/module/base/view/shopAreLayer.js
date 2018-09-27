
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
var ShopAreLayer = baseLayer.extend({
    ctor:function () {
        this._super();
        this.LayerName = "ShopAreLayer";
        this.ranklevel = 0;
        this.selectpage = 0;
    },

    onEnter:function () {
        this._super();
    },

    initUI:function(){
        this.obj = ccsTool.load(res.uiShopAreLayer, ["btnBack", "honnorValue", "duanTopValue", "btnItemShop", "btnReward", "shopAreList"]);

        this.addChild(this.obj.node, 1);

        this.obj.wgt.btnBack.addTouchEventListener(this.onTouchEvent, this);

        this.obj.wgt.btnItemShop.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.btnReward.addTouchEventListener(this.onTouchEvent, this);

        this.btnTabs = [null, this.obj.wgt.btnItemShop, this.obj.wgt.btnReward];

        this.doAddListener();

        this.switchView(1);
        Network.getInstance().send({task:"rank.getinfo", id:6, b:1, e:1});
    },

    doAddListener:function(){
        var self = this;
        // 商品购买
        this.shop_buy = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "shop.buy",
            callback: function(event){
                self.switchView(self.selectpage);
            }});

        this.rank_getinfo = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "rank.getinfo",
            callback: function(event){
                var data = event.getUserData();
                if (data.id == 6)
                {
                    self.ranklevel = data.my;
                    self.switchView(self.selectpage);
                }
            }});

        cc.eventManager.addListener(this.shop_buy, 1);
        cc.eventManager.addListener(this.rank_getinfo, 1);
    },

    onTouchEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED == type){
            switch(sender.name)
            {
                case "btnBack":
                    this.removeFromParent(true);
                    break;
                case "btnItemShop":
                    this.switchView(1);
                    break;
                case "btnReward":
                    this.switchView(2);
                    break;
            }
        }
    },

    //
    switchView:function(page){
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

        this.obj.wgt.honnorValue.setString(Helper.getItemNum(7)); //竞技点
        this.obj.wgt.duanTopValue.setString(STRINGCFG[100256].string + this.ranklevel); //竞技场排名

        var list = GLOBALDATA.shop.blist || {};
        var itemObjList = [[],[]];
        var i = 0;

        for (var key in SHOPARECFG)
        {
            var cfg = SHOPARECFG[key];
            if (page == cfg.page)
            {
                var it = list[cfg.index] || {bn:0} ;
                if (it)
                {
                    var item = ITEMCFG[cfg.id];

                    var itemObj = ccsTool.load(res.uiShopItem, ["bagItem",
                    "bagItemBg", "bagItemIcon", "bagItemPieces", "bagItemNum","bagItemName",
                    "bagItemTui", "bagItemYuan", "bagItemLine", "bagItemBuy",
                    "ImageItemIcon", "textItemValue", "textItemNum"]);

                    Helper.LoadIconFrameAndAddClick(itemObj.wgt.bagItemIcon, itemObj.wgt.bagItemBg,  itemObj.wgt.bagItemPieces, item);
                    Helper.setNamecolorByQuality(itemObj.wgt.bagItemName, item.quality);
                    itemObj.wgt.bagItemName.setString(item.itemname);

                    //货币类型
                    itemObj.wgt.ImageItemIcon.loadTexture("common/i/i_061.png", ccui.Widget.PLIST_TEXTURE);
                    //堆叠
                    itemObj.wgt.bagItemNum.setString(cfg.discount > 1 ? cfg.discount : "");

                    // 价格
                    itemObj.wgt.textItemValue.setString(cfg.pricetype[0][1]);

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
                    else if (in_array(armyid, relation_list))//(have_yuan(armyid))  // 缘分
                    {
                        itemObj.wgt.bagItemYuan.setVisible(true);
                    }

                    if (cfg.require[0] == 2 && this.ranklevel > cfg.require[1])  //排名$1解锁
                    {
                        itemObj.wgt.textItemNum.setString(StringFormat(STRINGCFG[100257].string, cfg.require[1]));
                    }
                    else if (cfg.require[0] == 1 && GLOBALDATA.base.vip < cfg.require[1])  //vip解锁
                    {
                        itemObj.wgt.textItemNum.setString(StringFormat(STRINGCFG[100219].string, cfg.require[1]));
                    }
                    else // 限购
                    {
                        itemObj.wgt.textItemNum.setString(cfg.xian > 0 ? (STRINGCFG[100214].string + "(" + it.bn  + "/" + cfg.xian + ")") : "");
                    }

                    itemObj.wgt.bagItem.setTag(key);
                    itemObj.wgt.bagItem.setUserData(i + 1);
                    itemObj.wgt.bagItem.addTouchEventListener(this.onTouchBuy,this);

                    if (cfg.only == 0 || it.bn < cfg.only)
                    {
                        itemObjList[0].push(itemObj);
                    }
                    else
                    {
                        itemObjList[1].push(itemObj);
                    }
                    i++;
                }
            }
        }
        var itemList = [];
        for (var idx = 0; idx < itemObjList[0].length; idx++)
        {
            itemList.push(itemObjList[0][idx]);
        }
        for (var idx = 0; idx < itemObjList[1].length; idx++)
        {
            itemList.push(itemObjList[1][idx]);
        }

        var itemRank = [];
        var index = -1;
        var i = 0;

        this.obj.wgt.shopAreList.removeAllChildren();
        for (var key in itemList)
        {
            var itemObj = itemList[key];
            var mod = i % 3;
            var bagItem = itemObj.wgt.bagItem;

            bagItem.setPositionX(bagItem.getContentSize().width * mod);

            if (mod == 0)
            {
                index++;
                itemRank[index] = new ccui.Widget();
                itemRank[index].setContentSize(this.obj.wgt.shopAreList.getContentSize().width, bagItem.getContentSize().height);
                itemRank[index].setAnchorPoint(0,0);
                this.obj.wgt.shopAreList.pushBackCustomItem(itemRank[index]);
            }

            bagItem.removeFromParent(false);
            itemRank[index].addChild(bagItem);

            i++;
        }
    },

    //
    onTouchBuy:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED == type){
            var key = sender.getTag();
            var pos = sender.getUserData();
            var cfg = SHOPARECFG[key];
            var it = GLOBALDATA.shop.blist[cfg.index] || {bn:0};

            if (cfg.require[0] == 2 && this.ranklevel > cfg.require[1])  //排名$1解锁
            {
                ShowTipsTool.TipsFromText(STRINGCFG[100258].string, cc.color.RED, 30);
            }
            else if (cfg.require[0] == 1 && GLOBALDATA.base.vip < cfg.require[1])  //vip解锁
            {
                ShowTipsTool.TipsFromText(STRINGCFG[100258].string, cc.color.RED, 30);
            }
            else if (cfg.xian > 0 && it.bn >= cfg.xian)
            {
                ShowTipsTool.TipsFromText(STRINGCFG[100215].string, cc.color.RED, 30);
            }
            else
            {
                var shopBuyLayer = new ShopBuyLayer(5, pos, cfg.index, cfg.id, cfg.discount, cfg.pricetype[0][0], cfg.pricetype[0][1], cfg.xian > 0 ? (cfg.xian - it.bn) : 99);
                this.addChild(shopBuyLayer,100);
            }
        }
    },
    onExit:function () {
        this._super();
        cc.eventManager.removeListener(this.shop_buy);
        cc.eventManager.removeListener(this.rank_getinfo);
    }
});