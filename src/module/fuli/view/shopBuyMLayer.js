
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 /**
 * 一次购买多个物品的创建
 */
var shopBuyMLayer = ModalDialog.extend({
    /*
     * type       类型  999为活动的购买
     * id         如果为任务表示任务id
     * itemidTab  商品原型id的数组
     * limitnumTab   堆叠数的数组
     * pricetype  货币类型
     * price      购买价格
     * maxnum     最大购买数
     */
    ctor:function (type, id, itemidTab, limitnumTab, pricetype, price, maxnum) {
        this._super();
        this.LayerName = "shopBuyMLayer";

        this.type =  type;
        this.id = id;
        this.itemidTab = itemidTab;
        this.limitnumTab = limitnumTab;
        this.pricetype = pricetype;
        this.price = price;
        this.maxnum = maxnum;
    },

    onEnter:function () {
        this._super();
    },

    initUI:function(){
        this.customWidget(); //自定义Widget
        this.initCustomEvent();
        this.showPanle();  //显示界面
    },
    //自定义事件
    initCustomEvent:function(){
        var self = this;
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
    //自定义Widget
    customWidget:function () {
        var wgtArr = [];
        wgtArr.push("btnBack1");  //返回按钮
        wgtArr.push("btnMin");  //最小按钮
        wgtArr.push("btnReduce");  //减少按钮
        wgtArr.push("btnAdd");  //增加按钮
        wgtArr.push("btnMax");  //最大按钮
        wgtArr.push("btnOk");  //确定按钮
		wgtArr.push("bagNumBuy1");  //购买数量
		wgtArr.push("hadImage");  //拥有的图片
		wgtArr.push("cosImage");  //花费的图片
		wgtArr.push("hadValue");  //拥有的数量
		wgtArr.push("cosValue");  //花费的数量
		//四种物品
		for(var i=1;i<=4;i++){
			wgtArr.push("bagBg"+i);
			wgtArr.push("bagIcon"+i);
			wgtArr.push("bagPieces"+i);
			wgtArr.push("bagName"+i);
			wgtArr.push("bagNum"+i);
		}
		
        var uiShopBuyM = ccsTool.load(res.uiShopBuyMLayer,wgtArr);
        //控件的名字赋值给this变量
        for(var key in uiShopBuyM.wgt){
            this[key] = uiShopBuyM.wgt[key];
        }
        this.addChild(uiShopBuyM.node, 2);

        this.btnBack1.addTouchEventListener(this.onTouchEvent, this);  //返回按钮
        this.btnMin.addTouchEventListener(this.onTouchEvent, this);  //最小按钮
        this.btnReduce.addTouchEventListener(this.onTouchEvent, this);  //减少按钮
        this.btnAdd.addTouchEventListener(this.onTouchEvent, this);  //增加按钮
        this.btnMax.addTouchEventListener(this.onTouchEvent, this);  //最大按钮
        this.btnOk.addTouchEventListener(this.onTouchEvent, this); //确定按钮
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
    //显示界面
    showPanle:function()
    {
        var count = 1;
        for(var i=1;i<=4;i++){
            var id = this.itemidTab[i-1];
            var num = this.limitnumTab[i-1];
            var itemCfg = Helper.findItemId(id);
            if(itemCfg != null){
                Helper.LoadIconFrameAndAddClick(this["bagIcon"+i],this["bagBg"+i],this["bagPieces"+i],itemCfg);  //物品
                this["bagNum"+i].setString(Helper.formatNum(num));  //数量
                this["bagName"+i].setString(itemCfg.itemname);
                Helper.setNamecolorByQuality(this["bagName"+i],itemCfg.quality);
                count++;
            }
        }
        for(var i=count;i<=4;i++){
            this["bagBg"+i].setVisible(false);
        }
        var pricetype = this.pricetype;
        var icon = "";
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

        this.hadImage.loadTexture(icon, ccui.Widget.PLIST_TEXTURE);
        this.cosImage.loadTexture(icon, ccui.Widget.PLIST_TEXTURE);

        this.doMin();
    },

    doMax:function(){
        var pricetype = this.pricetype;
        var price = this.price;
        var maxnum = this.maxnum;
        var num = Helper.getItemNum(pricetype);

        var count = Math.max(Math.min(Math.floor(num / price), maxnum), 1);
        var total = price * count;

        this.bagNumBuy1.setString(Helper.formatNum(count));
        this.hadValue.setString(Helper.formatNum(num));
        this.cosValue.setString(Helper.formatNum(total));

        this.count = count;
    },

    doMin:function()
    {
        var pricetype = this.pricetype;
        var price = this.price;
        var num = Helper.getItemNum(pricetype);

        var count = 1;
        var total = price * count;

        this.bagNumBuy1.setString(Helper.formatNum(count));
        this.hadValue.setString(Helper.formatNum(num));
        this.cosValue.setString(Helper.formatNum(total));

        this.count = count;
    },

    doReduce:function()
    {
        var price = this.price;
        var count = this.count;
        if (count > 1)
        {
            count--;
            var total = price * count;

            this.bagNumBuy1.setString(Helper.formatNum(count));
            this.cosValue.setString(Helper.formatNum(total));

            this.count = count;
        }
    },

    doAdd:function()
    {
        var pricetype = this.pricetype;
        var price = this.price;
        var count = this.count;
        var maxnum = this.maxnum;
        if (count < maxnum)
        {
            var num = Helper.getItemNum(pricetype);

            count++;
            var total = price * count;
            if ( total <= num)
            {
                this.bagNumBuy1.setString(Helper.formatNum(count));
                this.cosValue.setString(Helper.formatNum(total));

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
                welfareModel.activityOpt(this.id,2,null,this.count);
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
        cc.eventManager.removeListener(this.activityOptEvent);
    }
});