
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 /**
 */
var bagLayer = baseLayer.extend({
    LayerName:"bagLayer",
    curTab:0,
    isBagInit:false,  //物品背包是否初始化
    isPiecesInit:false,  //碎片背包是否初始化

    ctor:function (index) {
        this._super();
        this.index = index;  //1为士兵 2为装备 3为配饰 4为道具
        this.BagArray = [];  //物品数组
        this.PiecesArray = [];  //碎片数组
        this.BaoxiangArray = []; //宝箱数组
        this.uiAttributeLayer.setVisible(false);
    },
    onEnter:function () {
        this._super();
        this.initCustomEvent();
    },
    //初始化ui
    initUI:function () {
        this.customWidget();  //自定义Widget
        this.initTopButton();  //初始化顶部按钮
        this.showList();  //显示list内容
        this.dealRedPoint();
    },
    initCustomEvent:function () {
        var self = this;
        this.evnUpdateUIEvent = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "updateUI.bag",
            callback: function(event){
                self.isBagInit = false;
                self.isPiecesInit = false;
                self.BagArray = [];  //物品数组
                self.PiecesArray = [];  //碎片数组
                self.showList();
            }
        });
        cc.eventManager.addListener(this.evnUpdateUIEvent, this);

    },
    //自定义Widget
    customWidget:function () {
        this.uiBagLayer = ccs.load(res.uiBagLayer).node;
        this.addChild(this.uiBagLayer);

        this.btnOne = ccui.helper.seekWidgetByName(this.uiBagLayer, "btnOne");
        this.tipsImageS1 = ccui.helper.seekWidgetByName(this.uiBagLayer, "tipsImageS1");
        this.btnOne.setTouchEnabled(false);
        this.btnOne.setBright(false);
        this.btnOne.addTouchEventListener(this.changeTabEvent,this);
        this.btnTwo = ccui.helper.seekWidgetByName(this.uiBagLayer, "btnTwo");
        this.tipsImageS2 = ccui.helper.seekWidgetByName(this.uiBagLayer, "tipsImageS2");
        this.btnTwo.addTouchEventListener(this.changeTabEvent,this);
        this.btnTabs = [this.btnOne,this.btnTwo];

        this.bagList = ccui.helper.seekWidgetByName(this.uiBagLayer, "bagList");
        this.piecesList = ccui.helper.seekWidgetByName(this.uiBagLayer, "piecesList");
    },
    //初始化顶部按钮
    initTopButton:function () {
        switch (this.index){
            case 1:  //士兵
                this.btnOne.loadTextures("common/c/c_024_2.png","common/c/c_024_1.png","common/c/c_024_1.png",ccui.Widget.PLIST_TEXTURE);  //士兵
                this.btnTwo.loadTextures("common/c/c_029_2.png","common/c/c_029_1.png","common/c/c_029_1.png",ccui.Widget.PLIST_TEXTURE);  //士兵碎片
                break;
            case 2:   //装备
                this.btnOne.loadTextures("common/c/c_025_2.png","common/c/c_025_1.png","common/c/c_025_1.png",ccui.Widget.PLIST_TEXTURE);   //装备
                this.btnTwo.loadTextures("common/c/c_030_2.png","common/c/c_030_1.png","common/c/c_030_1.png",ccui.Widget.PLIST_TEXTURE);   //装备碎片
                break;
            case 3:   //配饰
                this.btnOne.loadTextures("common/c/c_026_2.png","common/c/c_026_1.png","common/c/c_026_1.png",ccui.Widget.PLIST_TEXTURE);   //配饰
                this.btnTwo.loadTextures("common/c/c_031_2.png","common/c/c_031_1.png","common/c/c_031_1.png",ccui.Widget.PLIST_TEXTURE);   //配饰碎片
                break;
            case 4:    //道具
                this.btnOne.loadTextures("common/c/c_027_2.png","common/c/c_027_1.png","common/c/c_027_1.png",ccui.Widget.PLIST_TEXTURE);   //道具
                this.btnTwo.loadTextures("common/c/c_028_2.png","common/c/c_028_1.png","common/c/c_028_1.png",ccui.Widget.PLIST_TEXTURE);   //宝箱
                //this.btnTwo.setVisible(false);
                break;
            default:
                break;
        }
    },
    //显示list内容
    showList:function () {
        switch (this.index){
            case 1:  //士兵
                if(this.curTab == 0){ //士兵
                    //士兵背包list
                    this.showsSldierList();
                }else if(this.curTab == 1){  //士兵碎片
                    //士兵碎片背包list
                    this.showsSldierPiecesList();
                }
                break;
            case 2:   //装备
                if(this.curTab == 0){  //装备
                    //装备背包list
                    this.showEquList();
                }else if(this.curTab == 1){  //装备碎片
                    //装备碎片背包list
                    this.showEquPiecesList();
                }
                break;
            case 3:   //配饰
                if(this.curTab == 0){  //配饰
                    //配饰背包list
                    this.showAcceList();
                }else if(this.curTab == 1){  //配饰碎片
                    //配饰碎片背包list
                    this.showAccePiecesList();
                }
                break;
            case 4:    //道具
                if(this.curTab == 0){  //道具
                    //道具背包list
                    this.showGoodsList();
                }else if(this.curTab == 1){//宝箱
                    this.showBaoxiangList();
                }
                break;
            default:
                break;
        }
    },
    //士兵背包list
    showsSldierList:function () {
        if(this.isBagList() == true){  //判断是否已经初始化了背包
            return;
        }
        /*
        上阵的士兵，显示没有上阵的数量
        没有上阵的士兵，初始的和不是初始的士兵分开显示
        * */
        for(var key in GLOBALDATA.soldiers){
            var soldier = GLOBALDATA.soldiers[key];
            if (soldier.j == 1 && soldier.n > 1){  //上阵并且数量大于1
                var temp = objClone(soldier);
                temp.id = key;
                temp.num = temp.n - 1;   //数量(去除掉已经上阵的那个)
                temp.isInit = true;  //是否初始
                temp.newId = temp.p;  //新的id
                this.BagArray.push(temp);
            }
            if(soldier.j == 0){  //没有上阵
                if(soldier.l == 1 && soldier.q == 0){  //全部是初始兵
                    var temp = objClone(soldier);
                    temp.id = key;
                    temp.num = temp.n;
                    temp.isInit = true;  //是否初始
                    temp.newId = temp.p;  //新的id
                    this.BagArray.push(temp);
                }else{  //有不是初始兵的
                    var temp = objClone(soldier);
                    temp.id = key;
                    temp.num = 1;
                    temp.isInit = false;
                    temp.newId = temp.p;
                    if(soldier.m > 0){ //突破过
                        var qhero = Helper.findHeroById(temp.newId);
                        temp.newId = qhero && qhero.breakid || temp.newId;
                    }
                    if(soldier.sq == 10){  //已经进行了终极改造
                        var reformAtt = Helper.findHeroById(temp.newId);
                        temp.newId = reformAtt && reformAtt.reform || temp.newId;
                    }
                    this.BagArray.push(temp);
                    if(soldier.n > 1){  //数量大于1
                        var temp = objClone(soldier);
                        temp.id = key;
                        temp.num = temp.n - 1;   //数量(去除掉不是初始的那个)
                        temp.isInit = true;  //是否初始
                        temp.newId = temp.p;  //新的id
                        this.BagArray.push(temp);
                    }
                }
            }
        }
        var compare = function (a,b) {
            var last = Helper.findItemId(a.newId);
            var next = Helper.findItemId(b.newId);
            if(last && next && last.quality > next.quality){
                return -1;
            }else if(last.quality == next.quality){
                if(a.p < b.p){
                    return -1;
                }else if(a.p == b.p){
                    return (a.isInit == true)?-1:1;
                }
            }
            return 1;
        }
        this.BagArray.sort(compare);  //排序
        //处理list
        // this.bagList.removeAllChildren(true);
        // for (var i=0;i<this.BagArray.length;i++){
        //     var uiBagItemNode = ccs.load(res.uiBagItem).node;
        //     var _bagItem = ccui.helper.seekWidgetByName(uiBagItemNode, 'bagItem');
			// _bagItem.removeFromParent(false);
        //     this.bagList.pushBackCustomItem(_bagItem);
        //     _bagItem.setUserData(this.BagArray[i]);
        //     _bagItem.addTouchEventListener(this.clickItemEvent, this);
        //     var thingAttribute = Helper.findItemId(this.BagArray[i].newId);
        //     var bagBg = ccui.helper.seekWidgetByName(_bagItem, "bagBg");  //品质边框
        //     var bagIcon = ccui.helper.seekWidgetByName(_bagItem, "bagIcon");  //icon
        //     var bagPieces = ccui.helper.seekWidgetByName(_bagItem, "bagPieces");  //碎片图片
        //     var bag_use_btn = ccui.helper.seekWidgetByName(_bagItem, "bagUseButton");
        //     Helper.LoadIconFrameAndAddClick(bagIcon,bagBg,bagPieces,thingAttribute);  //品质边框
        //     var bagName = ccui.helper.seekWidgetByName(_bagItem, "bagName");  //名称
        //     bagName.ignoreContentAdaptWithSize(true);
        //     bagName.setString(thingAttribute.itemname);
        //     Helper.setNamecolorByQuality(bagName,thingAttribute.quality);   //颜色
        //     var bagState = ccui.helper.seekWidgetByName(_bagItem, "bagState");  //描述
        //     bagState.setString(thingAttribute.describe);
        //     var bagNum = ccui.helper.seekWidgetByName(_bagItem, "bagNum");  //数量
        //     bagNum.setString(this.BagArray[i].num);
        // }
        this.dealSomeItemContent(this.BagArray,this.bagList,1);
    },
    //士兵碎片背包list
    showsSldierPiecesList:function () {
        if(this.isPiecesList() == true){  //判断是否已经初始化了碎片背包
            return;
        }
        for(var key in GLOBALDATA.knapsack){
            var thingAttr = Helper.findItemId(key);
            if(thingAttr != null && thingAttr.maintype == 3){  //士兵碎片
                var temp = [];
                temp.id = key;
                temp.p = key;
                temp.num = GLOBALDATA.knapsack[key];
                if(temp.num>=GOODSFRAGCFG[key].usenum){
                    temp.isHe = 1;
                }else{
                    temp.isHe = 0;
                }
                this.PiecesArray.push(temp);
            }
        }
        this.PiecesArray.sort(this.compareTh);  //排序
        this.dealSomeItemContent(this.PiecesArray,this.piecesList,2);  //处理Item
    },
    //装备背包list
    showEquList:function () {
        if(this.isBagList() == true){  //判断是否已经初始化了背包
            return;
        }
        for(var key in GLOBALDATA.depot){
            var equipAttr = Helper.findEqById(GLOBALDATA.depot[key].p);
            if(equipAttr != null && (equipAttr.type == 3 || equipAttr.type == 4 || equipAttr.type == 5 || equipAttr.type == 6)
                && GLOBALDATA.depot[key].u == 0) {  //没有装备的装备
                var temp = objClone(GLOBALDATA.depot[key]);
                temp.id = key;
                temp.num = 1;
                this.BagArray.push(temp);
            }
        }
        this.BagArray.sort(this.compareEa);  //排序
        this.dealSomeItemContent(this.BagArray,this.bagList,2);  //处理Item
    },
    //装备碎片背包list
    showEquPiecesList:function () {
        if(this.isPiecesList() == true){  //判断是否已经初始化了碎片背包
            return;
        }
        for(var key in GLOBALDATA.knapsack){
            var thingAttr = Helper.findItemId(key);
            if(thingAttr != null && thingAttr.maintype == 8){  //装备碎片
                var temp = [];
                temp.id = key;
                temp.p = key;
                temp.num = GLOBALDATA.knapsack[key];
                if(temp.num>=GOODSFRAGCFG[key].usenum){
                    temp.isHe = 1;
                }else{
                    temp.isHe = 0;
                }
                this.PiecesArray.push(temp);
            }
        }
        this.PiecesArray.sort(this.compareTh);  //排序
        this.dealSomeItemContent(this.PiecesArray,this.piecesList,2);  //处理Item
    },
    showBaoxiangList:function () {
        if(this.isPiecesList() == true){  //判断是否已经初始化了碎片背包
            return;
        }
        this.BaoxiangArray = [];
        for(var key in GLOBALDATA.knapsack){
            var thingAttr = Helper.findItemId(key);
            if(thingAttr != null && thingAttr.maintype == 12){
                var temp = [];
                temp.id = key;
                temp.p = key;
                temp.num = GLOBALDATA.knapsack[key];
                this.BaoxiangArray.push(temp);
            }
        }
        this.dealSomeItemContent(this.BaoxiangArray,this.piecesList,2);  //处理Item
    },
    //配饰背包list
    showAcceList:function () {
        if(this.isBagList() == true){  //判断是否已经初始化了背包
            return;
        }
        for(var key in GLOBALDATA.depot){
            var equipAttr = Helper.findEqById(GLOBALDATA.depot[key].p);
            if(equipAttr != null && (equipAttr.type == 1 || equipAttr.type == 2)
                && GLOBALDATA.depot[key].u == 0) {  //没有装备的装备
                var temp = objClone(GLOBALDATA.depot[key]);
                temp.id = key;
                temp.num = 1;
                this.BagArray.push(temp);
            }
        }
        this.BagArray.sort(this.compareEa);  //排序
        this.dealSomeItemContent(this.BagArray,this.bagList,2);  //处理Item
    },
    //配饰碎片背包list
    showAccePiecesList:function () {
        if(this.isPiecesList() == true){  //判断是否已经初始化了碎片背包
            return;
        }
        for(var key in GLOBALDATA.knapsack){
            var thingAttr = Helper.findItemId(key);
            if(thingAttr != null && thingAttr.maintype == 9){  //配饰碎片
                var temp = [];
                temp.id = key;
                temp.p = key;
                temp.num = GLOBALDATA.knapsack[key];
                if(temp.num>=GOODSFRAGCFG[key].usenum){
                    temp.isHe = 1;
                }else{
                    temp.isHe = 0;
                }
                this.PiecesArray.push(temp);
            }
        }
        this.PiecesArray.sort(this.compareTh);  //排序
        this.dealSomeItemContent(this.PiecesArray,this.piecesList,2);  //处理Item
    },
    //道具背包list
    showGoodsList:function () {
        if(this.isBagList() == true){  //判断是否已经初始化了背包
            return;
        }
        for(var key in GLOBALDATA.knapsack){
            var thingAttr = Helper.findItemId(key);
            if(thingAttr != null && thingAttr.maintype != 3 && thingAttr.maintype != 8 && thingAttr.maintype != 9 && thingAttr.maintype != 12){
                //3为士兵碎片 8为装备碎片 9为配饰碎片
                var temp = [];
                temp.id = key;
                temp.p = key;
                temp.num = GLOBALDATA.knapsack[key];
                this.BagArray.push(temp);
            }
        }
        this.BagArray.sort(this.compareTh);  //排序
        this.dealSomeItemContent(this.BagArray,this.bagList,2);  //处理Item
    },
    //处理Item
    dealSomeItemContent:function (ItemArray,ListNode,type) { //type 1 表示士兵  2表示其它
        //处理list
        ListNode.removeAllChildren(true);
        var self = this;
        for (var i=0;i<ItemArray.length;i++){
            var thingAttribute;
            if(type==1){
                thingAttribute = Helper.findItemId(ItemArray[i].newId);
            }else{
                thingAttribute = Helper.findItemId(ItemArray[i].p);
            }
            if(thingAttribute == null){
                return;
            }
            var uiBagItemNode = ccs.load(res.uiBagItem).node;
            var _bagItem = ccui.helper.seekWidgetByName(uiBagItemNode, 'bagItem');
            _bagItem.setUserData(ItemArray[i]);
            _bagItem.addTouchEventListener(this.clickItemEvent, this);
			_bagItem.removeFromParent(false);
            ListNode.pushBackCustomItem(_bagItem);
            var bagBg = ccui.helper.seekWidgetByName(_bagItem, "bagBg");  //品质边框
            var bagIcon = ccui.helper.seekWidgetByName(_bagItem, "bagIcon");  //icon
            var bagPieces = ccui.helper.seekWidgetByName(_bagItem, "bagPieces");  //碎片图片
            var tipsImageBS = ccui.helper.seekWidgetByName(_bagItem, "tipsImageBS"); //红点图片
            Helper.LoadIconFrameAndAddClick(bagIcon,bagBg,bagPieces,thingAttribute);  //品质边框
            var bagName = ccui.helper.seekWidgetByName(_bagItem, "bagName");  //名称
            bagName.ignoreContentAdaptWithSize(true);
            bagName.setString(thingAttribute.itemname);
            Helper.setNamecolorByQuality(bagName,thingAttribute.quality);   //颜色
            var bagState = ccui.helper.seekWidgetByName(_bagItem, "bagState");  //描述
            if(thingAttribute.describe==null){
                bagState.setString("");
            }else{
                bagState.setString(thingAttribute.describe);
            }
            var bagNum = ccui.helper.seekWidgetByName(_bagItem, "bagNum");  //数量
            bagNum.setString(ItemArray[i].num);
            var bag_use_btn = ccui.helper.seekWidgetByName(_bagItem, "bagUseButton");
            var hecheng_btn = ccui.helper.seekWidgetByName(_bagItem, "bagsynButton");
            var break_btn = ccui.helper.seekWidgetByName(_bagItem, "bagBreakButton");
            if(thingAttribute.itemid==108 && GLOBALDATA.base.mchange>0){
                tipsImageBS.setVisible(true);
            }else{
                tipsImageBS.setVisible(false);
            }
            if(thingAttribute.use==1){ //可使用
                bag_use_btn.setVisible(true);
                hecheng_btn.setVisible(false);
                break_btn.setVisible(false);
                bag_use_btn.setUserData(ItemArray[i]);
                bag_use_btn.addTouchEventListener(function (sender,type) {
                    if(ccui.Widget.TOUCH_ENDED == type){
                        var userData = sender.getUserData();
                        if(ITEMUSECFG[userData.id]!=null){
                            var usertype = ITEMUSECFG[userData.id].type;
                            if(userData.id == 108){  //后期补给箱特殊处理
                                var _buyGoldLayer = new buyGoldLayer();
                                self.myLayer.addChild(_buyGoldLayer,3);
                            }else if(usertype==1||usertype==2||usertype==3||usertype==4){
                                var use_layer = new itemUseLayer(userData.id);
                                self.myLayer.addChild(use_layer,3);
                            }else if(usertype==5){
                                var itemChoose_Layer = new itemChooseLayer(1,userData.id);
                                self.myLayer.addChild(itemChoose_Layer,3);
                            }else if(usertype==6){

                            }
                        }
                    }
                });
                if(thingAttribute != null && thingAttribute.maintype == 12){
                    tipsImageBS.setVisible(true);
                }else if(thingAttribute.itemid==108 && GLOBALDATA.base.mchange>0){
                    tipsImageBS.setVisible(true);
                } else{
                    tipsImageBS.setVisible(false);
                }
            }else if(thingAttribute.use==2){ //分解
                bag_use_btn.setVisible(false);
                hecheng_btn.setVisible(false);
                break_btn.setVisible(true);
                break_btn.setUserData(ItemArray[i]);
                break_btn.addTouchEventListener(function (sender,type) {
                    if(ccui.Widget.TOUCH_ENDED == type){
                        var userData = sender.getUserData();
                        var usertype = ITEMUSECFG[userData.id].type;
                        if(usertype==1||usertype==2||usertype==3||usertype==4){
                            var break_layer = new itemBreakLayer(userData.id);
                            self.myLayer.addChild(break_layer,3);
                        }else if(usertype==5){
                          var itemChoose_Layer = new itemChooseLayer(1,userData.id);
                          self.myLayer.addChild(itemChoose_Layer,3);
                        }else if(usertype==6){

                        }
                    }
                });
            }else if(thingAttribute.use==3){ //合成
                bag_use_btn.setVisible(false);
                hecheng_btn.setVisible(true);
                break_btn.setVisible(false);
                hecheng_btn.setUserData(ItemArray[i]);
                hecheng_btn.addTouchEventListener(function (sender,type) {
                    if(ccui.Widget.TOUCH_ENDED == type){
                        if((self.index == 1 || self.index == 2 || self.index == 3) && self.curTab == 1){  //1为士兵 2为装备 3为配饰 4为道具
                            var userData = sender.getUserData();
                            var _itemHeCLayer = new itemHeCLayer(userData.id,-1);
                            self.myLayer.addChild(_itemHeCLayer,3);
                        }
                    }
                });
                if(GLOBALDATA.knapsack[thingAttribute.itemid]>=GOODSFRAGCFG[thingAttribute.itemid].usenum){
                    tipsImageBS.setVisible(true);
                }else{
                    tipsImageBS.setVisible(false);
                }
            }else if(thingAttribute.use == 0){ //只能浏览
                bag_use_btn.setVisible(false);
                hecheng_btn.setVisible(false);
                break_btn.setVisible(false);
            }
        }
    },
    //一般背包处理
    isBagList:function () {
        this.bagList.setVisible(true);
        this.piecesList.setVisible(false);
        if(this.isBagInit == true){  //判断是否已经初始化了背包
            return true;
        }else{
            this.isBagInit = true;
            return false;
        }
    },
    //碎片背包处理
    isPiecesList:function () {
        this.bagList.setVisible(false);
        this.piecesList.setVisible(true);
        if(this.isPiecesInit == true){  //判断是否已经初始化了碎片背包
            return true;
        }else{
            this.isPiecesInit = true;
            return false;
        }
    },
    //装备和配饰的排序
    /* 返回值
    * 负值，如果所传递的第一个参数比第二个参数小。
     零，如果两个参数相等。
     正值，如果第一个参数比第二个参数大。  */
    compareEa:function (a,b) {
        var last = Helper.findItemId(a.p);
        var next = Helper.findItemId(b.p);
        if(last && next && last.quality > next.quality){
            return -1;
        }else if(last.quality == next.quality){
            if(a.p < b.p){
                return -1;
            }else if(a.p == b.p){
                if(a.id < b.id){
                    return -1;
                }
            }
        }
        return 1;
    },
    //物品的排序
    compareTh:function (a,b) {
        var last = Helper.findItemId(a.p);
        var next = Helper.findItemId(b.p);
        if(a.isHe != null && b.isHe != null && a.isHe > b.isHe){
            return -1;
        }else if(a.isHe == b.isHe){
            if(last && next && last.quality > next.quality){
                return -1;
            }else if(last.quality == next.quality){
                if(a.p < b.p){
                    return -1;
                }
            }
        }
        return 1;
    },
    //点击item的事件
    clickItemEvent:function(sender,type){
        if(ccui.Widget.TOUCH_ENDED == type) {
            if(this.index == 1 && this.curTab == 0){ //1为士兵 2为装备 3为配饰 4为道具
                var userData = sender.getUserData();
                if(userData.isInit == true){
                    userData.l = 1;  //等级
                    userData.q = 0;  //进阶等级
                    userData.m = 0;  //是否已经突破
                    userData.w = 0;  //觉醒等级
                    userData.sq = 0;  //改造等级
                }
                var armyAttributeLayer = new armyAttriLayer(userData.id,2,userData);
                this.myLayer.addChild(armyAttributeLayer,3);
            }else if(this.index == 2 && this.curTab == 0){  //1为士兵 2为装备 3为配饰 4为道具
                var userData = sender.getUserData();
                var _equipDetailsLayer = new equipDetailsLayer(userData.id,-1);
                this.myLayer.addChild(_equipDetailsLayer,3);
            }else if(this.index == 3 && this.curTab == 0){  //1为士兵 2为装备 3为配饰 4为道具
                var userData = sender.getUserData();
                var _accDetailsLayer = new accDetailsLayer(userData.id,-1);
                this.myLayer.addChild(_accDetailsLayer,3);
            }else if((this.index == 1 || this.index == 2 || this.index == 3) && this.curTab == 1){  //1为士兵 2为装备 3为配饰 4为道具
                // var userData = sender.getUserData();
                // var _itemHeCLayer = new itemHeCLayer(userData.id,-1);
                // this.myLayer.addChild(_itemHeCLayer,3);
            }else {
                var userData = sender.getUserData();
                var _itemSeeLayer = new itemSeeLayer(userData.id,0);
                this.myLayer.addChild(_itemSeeLayer, 3);
            }
        }
    },
    //标签按钮的切换
    changeTabEvent:function (sender, type) {
        if(ccui.Widget.TOUCH_ENDED == type){
            switch (sender.name) {
                case 'btnOne'://第一个标签按钮
                    this.changeTabStatus(0);
                    break;
                case 'btnTwo': //第二个标签按钮
                    this.changeTabStatus(1);
                    break;
                default:
                    break;
            }
            this.showList();
        }
    },
    //标签按钮的状态
    changeTabStatus:function (idx) {
        if(idx == this.curTab){
            return;
        }
        this.btnTabs[idx].setTouchEnabled(false);
        this.btnTabs[idx].setBright(false);
        this.btnTabs[this.curTab].setTouchEnabled(true);
        this.btnTabs[this.curTab].setBright(true);
        this.curTab = idx;
    },
    onExit:function () {
        this._super();
        cc.eventManager.removeListener(this.evnUpdateUIEvent);
        cc.log('bagLayer onExit');
    },

    //处理红点
    dealRedPoint:function (data) {
        this.dealRedPointDetail(data,this.index);
    },
    dealRedPointDetail:function(data,index){
        var self = this;
        var showRed = function (index) {
            if(index==1||index==2||index==3){ //士兵 装备 饰品
            //    if(curTab==1){
                    var maintype;
                    if(index==1){
                        maintype = 3;
                    }else if(index==2){
                        maintype = 8;
                    }else if(index==3){
                        maintype = 9;
                    }
                    var isRed = false;
                    for(var key in GLOBALDATA.knapsack){
                        var thingAttr = Helper.findItemId(key);
                        if(thingAttr != null && thingAttr.maintype == maintype){
                            if(GOODSFRAGCFG[key]!=null){
                                if(GLOBALDATA.knapsack[key]>=GOODSFRAGCFG[key].usenum){
                                    isRed = true;
                                    break;
                                }
                            }
                        }
                    }
                    if(isRed){
                        self.tipsImageS2.setVisible(true);
                    }else{
                        self.tipsImageS2.setVisible(false);
                    }
            }else if(index==4){
                var maintype = 12;
                var isRed1 = false;
                var isFind1 = false;  //是否找到
                var isRed2 = false;
                for(var key in GLOBALDATA.knapsack){
                    var thingAttr = Helper.findItemId(key);
                    if(thingAttr != null && thingAttr.maintype == maintype){
                        if(thingAttr.use==1){
                            isRed2 = true;
                        }
                    }else if(thingAttr != null && thingAttr.itemid==108&&GLOBALDATA.base.mchange>0){  //金币兑换
                        isFind1 = true;
                        isRed1 = true;
                    }
                    if(isFind1 && isRed2){
                        break;
                    }
                }
                if(isRed1){
                    self.tipsImageS1.setVisible(true);
                }else{
                    self.tipsImageS1.setVisible(false);
                }
                if(isRed2){
                    self.tipsImageS2.setVisible(true);
                }else{
                    self.tipsImageS2.setVisible(false);
                }
            }
        };
        if(data != null){
            var keyArr = data.key.split('.');
            if((keyArr[0] == "knapsack")){
                showRed(index);
            }
        }else{
            showRed(index);
        }

    }
});