
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
var CityShopLayer = ModalDialog.extend({
    ctor:function () {
        this._super();
        this.LayerName = "CityShopLayer";
    },
    onEnter:function () {
        this._super();
    },

    initUI:function(){
        this.obj = ccsTool.load(res.uicityShopLayer, ["btnComShop", "btnHeroShop", "btnEquShop", "btnAreShop",
            "btnGuildShop", "btnVsShop", "btnSevShop", "btnAwakeShop",
            "btnCarShop", "btnPhotoShop","btnExploreShop", "btnHonorShop"]);

        this.addChild(this.obj.node);

        this.obj.wgt.btnComShop.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.btnHeroShop.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.btnEquShop.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.btnAreShop.addTouchEventListener(this.onTouchEvent, this);

        this.obj.wgt.btnGuildShop.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.btnVsShop.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.btnSevShop.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.btnAwakeShop.addTouchEventListener(this.onTouchEvent, this);

        this.obj.wgt.btnCarShop.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.btnPhotoShop.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.btnExploreShop.addTouchEventListener(this.onTouchEvent, this);
        this.obj.wgt.btnHonorShop.addTouchEventListener(this.onTouchEvent, this);

        var lv = GLOBALDATA.base.lev;
        if (lv >= 15)
        {
            this.obj.wgt.btnAreShop.setVisible(true);

            if (lv >= 65000)
            {
                this.obj.wgt.btnCarShop.setVisible(true);
            }
        }
    },

    onTouchEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED == type){
            switch(sender.name)
            {
                case "Panel_shop":
                    sender.removeFromParent(true);
                    break;
                case "btnComShop":   //普通商店
                    var shopLayer = new ShopLayer();
                    this.addChild(shopLayer, 2);
                    break;
                case "btnHeroShop":  //士兵商店
                    var showHeroLayer = new ShopHeroLayer();
                    this.addChild(showHeroLayer, 2);
                    break;
                case "btnEquShop":  // 装备商店
                    var shopEquLayer = new ShopEquLayer();
                    this.addChild(shopEquLayer, 2);
                    break;
                case "btnAreShop":  // 声望商店
                    var shopAreLayer = new ShopAreLayer();
                    this.addChild(shopAreLayer, 2);
                    break;
                case "btnCarShop":  // 座驾商店
                    var shopCarLayer = new ShopCarLayer();
                    this.addChild(shopCarLayer, 2);
                    break;
            }
        }
    },

    onExit:function () {
        this._super();
    }
});