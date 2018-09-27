
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
var BuyNumLayer = ModalDialog.extend({
    /**
     * pricetype  货币类型
     * price      购买价格
     * currnum    当前次数
     * maxnum     最大购买数
     */
    ctor:function (pricetype, price, currnum, maxnum) {
        this._super();
        this.LayerName = "BuyNumLayer";
        this.pricetype = pricetype;
        this.price = price;
        this.currnum = currnum;
        this.maxnum = maxnum;
        this.count = 0;

        this.doAddListener();
    },

    onEnter:function () {
        this._super();

    },

    initUI:function(){
        this.obj = ccsTool.load(res.uiBuyNumLayer, ["btnBack"
        , "textNumNow", "textNumNot"
        , "btnMin","btnReduce","textNum", "btnAdd", "btnMax"
        , "cosImage", "cosValue",
        , "btnOk"]);

        this.addChild(this.obj.node, 1);

        this.obj.wgt.btnBack.addTouchEventListener(this.onTouchEvent, this);

        this.obj.wgt.btnMin.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.btnReduce.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.btnAdd.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.btnMax.addTouchEventListener(this.onTouchEvent, this);

        this.obj.wgt.btnOk.addTouchEventListener(this.onTouchEvent, this);
        this.showView();
    },

    doAddListener:function(){
        var self = this;
        // 购买挑战次数
        this.arsenal_buynum = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "arsenal.buynum",
            callback: function(event){
                self.removeFromParent(true);
            }});

        cc.eventManager.addListener(this.arsenal_buynum, 1);
    },

    showView:function()
    {
        var pricetype = this.pricetype;
        var price = this.price;
        var currnum = this.currnum;
        var maxnum = this.maxnum;

        this.obj.wgt.textNumNow.setString(StringFormat(STRINGCFG[100259].string, currnum));
        this.obj.wgt.textNumNot.setString(StringFormat(STRINGCFG[100260].string, maxnum));

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
        this.obj.wgt.cosImage.loadTexture(icon, ccui.Widget.PLIST_TEXTURE);

        this.doReduceTen();
    },

    onTouchEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED == type){
            switch(sender.name)
            {
                case "btnBack":
                    this.removeFromParent(true);
                    break;
                case "btnMin":
                    this.doReduceTen();
                    break;
                case "btnReduce":
                    this.doReduce();
                    break;
                case "btnAdd":
                    this.doAdd();
                    break;
                case "btnMax":
                    this.doAddTen();
                    break;
                case "btnOk":
                    this.doBuy();
                    break
            }
        }
    },

    doAddTen:function(){
        var pricetype = this.pricetype;
        var price = this.price;
        var maxnum = this.maxnum;

        var num = Helper.getItemNum(pricetype);

        var count = Math.max(Math.min(Math.floor(num / price), maxnum, 10), 1);
        var total = price * count;

        this.obj.wgt.textNum.setString(count);
        this.obj.wgt.cosValue.setString(Helper.formatNum(total));

        this.count = count;
    },

    doReduceTen:function()
    {
        var pricetype = this.pricetype;
        var price = this.price;
        var limitnum  = this.limitnum
        var num = Helper.getItemNum(pricetype);

        var count = Math.max(this.count - 10, 1);
        var total = price * count;

        this.obj.wgt.textNum.setString(count);
        this.obj.wgt.cosValue.setString(Helper.formatNum(total));

        this.count = count;
    },

    doReduce:function()
    {
        var pricetype = this.pricetype;
        var price = this.price;
        var count = this.count;
        if (count > 1)
        {
            count--;
            var total = price * count;

            this.obj.wgt.textNum.setString(count);
            this.obj.wgt.cosValue.setString(Helper.formatNum(total));

            this.count = count;
        }
    },

    doAdd:function()
    {
        var pricetype = this.pricetype;
        var price = this.price;
        var maxnum = this.maxnum;
        var count = this.count;
        if (count < maxnum)
        {
            count++;
            var num = Helper.getItemNum(pricetype);
            var total = price * count;
            if (total <= num)
            {
                this.obj.wgt.textNum.setString(count);
                this.obj.wgt.cosValue.setString(Helper.formatNum(total));

                this.count = count;
            }
        }
    },

    doBuy:function()
    {
        Network.getInstance().send({task:"arsenal.buynum", id:1, num:this.count});
    },

    onExit:function () {
        this._super();
        cc.eventManager.removeListener(this.arsenal_buynum);
    }
});