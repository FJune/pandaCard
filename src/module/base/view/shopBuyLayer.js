
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
var ShopBuyLayer = ModalDialog.extend({
    /*
     * type       商店类型  999为活动的购买
     * pos        商品栏位置(坑位)
     * goodsid    商品id  如果为任务表示任务id
     * itemid     商品原型id
     * limitnum   堆叠数
     * pricetype  货币类型
     * price      购买价格
     * maxnum     最大购买数
     */
    ctor:function (type, pos, goodsid, itemid,  limitnum, pricetype, price, maxnum) {
        this._super();
        this.LayerName = "ShopBuyLayer";

        this.type =  type;
        this.pos = pos;
        this.goodsid = goodsid;
        this.itemid = itemid;
        this.limitnum = limitnum;
        this.pricetype = pricetype;
        this.price = price;
        this.maxnum = maxnum;
    },

    onEnter:function () {
        this._super();
    },

    initUI:function(){
        this.obj = ccsTool.load(res.uiShopBuyLayer, ["textTipsTitle", "btnBack1"
        , "bagBg1", "bagIcon1", "bagPieces1", "bagNum1", "bagName1", "bagDate1", "bagHad1"
        , "btnMin","btnReduce","bagNumBuy1", "btnAdd", "btnMax"
        , "hadImage", "hadValue",  "cosImage", "cosValue",
        , "btnOk"]);

        this.addChild(this.obj.node, 1);

        this.obj.wgt.btnBack1.addTouchEventListener(this.onTouchEvent, this);

        this.obj.wgt.btnMin.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.btnReduce.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.btnAdd.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.btnMax.addTouchEventListener(this.onTouchEvent, this);

        this.obj.wgt.btnOk.addTouchEventListener(this.onTouchEvent, this);

        this.doAddListener();
        this.buy();
    },

    doAddListener:function(){
        var self = this;
        // 战斗
        this.shop_buy = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "shop.buy",
            callback: function(event){
                self.resourceGet(event.getUserData());
                self.removeFromParent(true);
            }});

        cc.eventManager.addListener(this.shop_buy, 1);
        //购买活动物品
        this.activityOptEvent = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "activity.opt",
            callback: function(event){
                var resData = event.getUserData();
                if(resData.status == 0){
                    self.resourceGet(resData);
                    self.removeFromParent(true);
                }
            }});
        cc.eventManager.addListener(this.activityOptEvent, 1);
    },

    onTouchEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED == type){
            switch(sender.name)
            {
                case "btnBack1":
                    this.removeFromParent(true);
                    break;
                case "btnMin":
                    this.doMin();
                    break;
                case "btnReduce":
                    this.doReduce();
                    break;
                case "btnAdd":
                    this.doAdd();
                    break;
                case "btnMax":
                    this.doMax();
                    break;
                case "btnOk":
                    this.doBuy();
                    break
            }
        }
    },

    buy:function()
    {
        var goodsid = this.goodsid;
        var itemid = this.itemid;
        var limitnum = this.limitnum;
        var pricetype = this.pricetype;
        var price = this.price;
        var maxnum = this.maxnum;
        var item = ITEMCFG[itemid];
        if(item)
        {
            this.obj.wgt.bagNum1.setString(limitnum > 1 ? limitnum : "");
            Helper.LoadIconFrameAndAddClick(this.obj.wgt.bagIcon1, this.obj.wgt.bagBg1, this.obj.wgt.bagPieces1, item);
            Helper.setNamecolorByQuality(this.obj.wgt.bagName1, item.quality);
            this.obj.wgt.bagName1.setString(item.itemname);
            this.obj.wgt.bagDate1.setString(item.describe);

            this.obj.wgt.bagHad1.setString(STRINGCFG[100221].string + Helper.formatNum(Helper.getItemNum(itemid)));

            var icon = "";
            var num = 0;
            if (pricetype == 1)
            {
                icon = "common/i/i_003.png";
            }
            else if(pricetype == 2)
            {
                icon = "common/i/i_004.png";
            }
            else if(pricetype == 7)
            {
                icon = "common/i/i_061.png";
            }
            else if (pricetype == 16)
            {
                icon = "common/i/i_044.png";
            }
            else if (pricetype == 17)
            {
                icon = "common/i/i_043.png";
            }
            else if (pricetype == 21)
            {
                icon = "common/i/i_059.png"
            }

            this.obj.wgt.hadImage.loadTexture(icon, ccui.Widget.PLIST_TEXTURE);
            this.obj.wgt.cosImage.loadTexture(icon, ccui.Widget.PLIST_TEXTURE);

            this.doMin();
        }
    },

    doMax:function(){
        var pricetype = this.pricetype;
        var price = this.price;
        var limitnum = this.limitnum;
        var maxnum = this.maxnum;
        var num = Helper.getItemNum(pricetype);

        var count = Math.max(Math.min(Math.floor(num / price), maxnum), 1);
        var total = price * count;

        this.obj.wgt.bagNumBuy1.setString(Helper.formatNum(count));
        this.obj.wgt.hadValue.setString(Helper.formatNum(num));
        this.obj.wgt.cosValue.setString(Helper.formatNum(total));

        this.count = count;
    },

    doMin:function()
    {
        var pricetype = this.pricetype;
        var price = this.price;
        var limitnum  = this.limitnum
        var num = Helper.getItemNum(pricetype);

        var count = 1;
        var total = price * count;

        this.obj.wgt.bagNumBuy1.setString(Helper.formatNum(count));
        this.obj.wgt.hadValue.setString(Helper.formatNum(num));
        this.obj.wgt.cosValue.setString(Helper.formatNum(total));

        this.count = count;
    },

    doReduce:function()
    {
        var pricetype = this.pricetype;
        var price = this.price;
        var limitnum = this.limitnum;
        var count = this.count;
        if (count > 1)
        {
            count--;
            var total = price * count;

            this.obj.wgt.bagNumBuy1.setString(Helper.formatNum(count));
            this.obj.wgt.cosValue.setString(Helper.formatNum(total));

            this.count = count;
        }
    },

    doAdd:function()
    {
        var pricetype = this.pricetype;
        var price = this.price;
        var limitnum = this.limitnum;
        var count = this.count;
        var maxnum = this.maxnum;
        if (count < maxnum)
        {
            var num = Helper.getItemNum(pricetype);

            count++;
            var total = price * count;
            if ( total <= num)
            {
                this.obj.wgt.bagNumBuy1.setString(Helper.formatNum(count));
                this.obj.wgt.cosValue.setString(Helper.formatNum(total));

                this.count = count;
            }
        }
    },

    doBuy:function()
    {
        var pricetype = this.pricetype;
        var price = this.price;
        var count = this.count;
        var num = Helper.getItemNum(pricetype);
        var total = price * count;
        if (total <= num)
        {
            if(this.type == 999){  //活动的购买
                welfareModel.activityOpt(this.goodsid,2,null,this.count);
            }else{
                Network.getInstance().send({task:"shop.buy", pos:this.pos, id:this.goodsid, typ:this.type, num: this.count});
            }
        }
        else
        {
            var item = ITEMCFG[pricetype];
            if (item)
            {
                ShowTipsTool.TipsFromText(item.itemname + STRINGCFG[100011].string, cc.color.RED, 30);
            }
        }
    },

    resourceGet:function(data){
        if(data != undefined && data.data != undefined)
        {
            data.task = 'resource.get';

            var event = new cc.EventCustom(data.task);
            event.setUserData(data);
            cc.eventManager.dispatchEvent(event);
        }
    },

    onExit:function () {
        this._super();
        cc.eventManager.removeListener(this.shop_buy);
        cc.eventManager.removeListener(this.activityOptEvent);
    }
});