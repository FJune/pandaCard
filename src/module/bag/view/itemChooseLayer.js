
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 
var itemChooseLayer = ModalDialog.extend({
    LayerName:"itemChooseLayer",
    ctor:function(type,itemid,itemInfo){
        this._super();
        this.type = type;  //1 使用物品 2 活动购买物品
        this.itemid = itemid;
        this.itemInfo = itemInfo;  //活动购买物品 直接传进来的对象
        this.choose_num = 1;
        this.check_position = -1;
    },
    onEnter:function(){
        this._super();

        var self = this;
        this.useThingEvent = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "knapsack.use",
            callback: function(event){
                var resData = event.getUserData();
                if(resData.status == 0){
                    //获得的物品
                    self.resourceGet(resData);
                    //移除界面
                    self.removeFromParent(true);
                    //更新背包
                    var evn = new cc.EventCustom('updateUI.bag');
                    cc.eventManager.dispatchEvent(evn);
                }
            }
        });
        cc.eventManager.addListener(this.useThingEvent,this);
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
    //初始化ui
    initUI:function () {
        this.itemChooseLayerNode = ccsTool.load(res.uiItemChooseLayer,["btnBack1","btnMin","btnMax","btnReduce","btnAdd","btnOk","textMakeNum","bagBg1","bagIcon1","bagName1","bagNum1","levelUp1","Image1","bagPieces1","bagBg2","bagIcon2","bagName2","bagNum2","levelUp2","Image2","bagPieces2",
            "bagBg3","bagIcon3","bagName3","bagNum3","levelUp3","Image3","bagPieces3","bagBg4","bagIcon4","bagName4","bagNum4","levelUp4","Image4","bagPieces4",
            "HadImageBg","hadImage","hadValue","cosImageBg","cosImage","cosValue"]);
        this.addChild(this.itemChooseLayerNode.node);
        this.choose_array = [[this.itemChooseLayerNode.wgt.bagBg1,this.itemChooseLayerNode.wgt.bagIcon1,this.itemChooseLayerNode.wgt.bagName1,this.itemChooseLayerNode.wgt.bagNum1,this.itemChooseLayerNode.wgt.levelUp1,this.itemChooseLayerNode.wgt.Image1,this.itemChooseLayerNode.wgt.bagPieces1],
        [this.itemChooseLayerNode.wgt.bagBg2,this.itemChooseLayerNode.wgt.bagIcon2,this.itemChooseLayerNode.wgt.bagName2,this.itemChooseLayerNode.wgt.bagNum2,this.itemChooseLayerNode.wgt.levelUp2,this.itemChooseLayerNode.wgt.Image2,this.itemChooseLayerNode.wgt.bagPieces2],
        [this.itemChooseLayerNode.wgt.bagBg3,this.itemChooseLayerNode.wgt.bagIcon3,this.itemChooseLayerNode.wgt.bagName3,this.itemChooseLayerNode.wgt.bagNum3,this.itemChooseLayerNode.wgt.levelUp3,this.itemChooseLayerNode.wgt.Image3,this.itemChooseLayerNode.wgt.bagPieces3],
            [this.itemChooseLayerNode.wgt.bagBg4,this.itemChooseLayerNode.wgt.bagIcon4,this.itemChooseLayerNode.wgt.bagName4,this.itemChooseLayerNode.wgt.bagNum4,this.itemChooseLayerNode.wgt.levelUp4,this.itemChooseLayerNode.wgt.Image4,this.itemChooseLayerNode.wgt.bagPieces4]];
        for(var j=0;j<this.choose_array.length;j++){
            this.choose_array[j][5].setVisible(false);
        }
        var goods_array = [];
        if(this.type == 1){ //物品使用
            goods_array = ITEMUSECFG[this.itemid].goods;
        }else if(this.type == 2){  //活动购买物品
            var itemidTab = this.itemInfo.itemidTab;
            var itemnumTab = this.itemInfo.itemnumTab;
            for(var i = 0;i<itemidTab.length;i++){
                var temp = [];
                if(itemidTab[i] != null && itemnumTab[i] != null){
                    temp[0] = itemidTab[i];
                    temp[1] = itemnumTab[i];
                }
                goods_array.push(temp);
            }
        }
        for(var i=0;i<goods_array.length;i++){
            this.choose_array[i][5].setVisible(true);
            var thing = Helper.findItemId(goods_array[i][0]);
            Helper.LoadIcoImageWithPlist(this.choose_array[i][1],thing);
            Helper.LoadFrameImageWithPlist(this.choose_array[i][0],thing.quality);
            this.choose_array[i][2].setString(thing.itemname);
            this.choose_array[i][3].setString(goods_array[i][1]);
            this.choose_array[i][4].addEventListener(this.checkevent,this);
            if(thing.maintype==3||thing.maintype==8||thing.maintype==9){//碎片
                this.choose_array[i][6].setVisible(true);
            }
        }
        this.itemChooseLayerNode.wgt.textMakeNum.setString(this.choose_num);

        if(this.type == 2){
            this.showCostInfo();  //显示花费情况
        }

        this.itemChooseLayerNode.wgt.btnMin.addTouchEventListener(this.touchEvent,this);
        this.itemChooseLayerNode.wgt.btnMax.addTouchEventListener(this.touchEvent,this);
        this.itemChooseLayerNode.wgt.btnReduce.addTouchEventListener(this.touchEvent,this);
        this.itemChooseLayerNode.wgt.btnAdd.addTouchEventListener(this.touchEvent,this);
        this.itemChooseLayerNode.wgt.btnOk.addTouchEventListener(this.touchEvent,this);
        this.itemChooseLayerNode.wgt.btnBack1.addTouchEventListener(this.touchEvent,this);
        //计算最大值
        this.calculatedMax();
    },
    //计算最大值
    calculatedMax:function(){
        if(this.type == 1){  //1 使用物品
            if(Helper.getItemNum(this.itemid)-ITEMUSECFG[this.itemid].maxuse>0){
                this.max = ITEMUSECFG[this.itemid].maxuse;
                this.tip_type = 1;
            }else{
                this.max = Helper.getItemNum(this.itemid);
                this.tip_type = 2;
            }
        }else if(this.type == 2){ //2 活动购买物品
            var pricetype = this.itemInfo.pricetype;
            var price = this.itemInfo.price;
            var maxnum = this.itemInfo.maxnum;
            var num = Helper.getItemNum(pricetype);
            this.max = Math.max(Math.min(Math.floor(num / price), maxnum), 1);
        }
    },
    //显示花费情况
    showCostInfo:function(){
        this.itemChooseLayerNode.wgt.cosImageBg.setVisible(true);
        this.itemChooseLayerNode.wgt.HadImageBg.setVisible(true);
        var pricetype = this.itemInfo.pricetype;
        var price = this.itemInfo.price;
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
        this.itemChooseLayerNode.wgt.hadImage.loadTexture(icon, ccui.Widget.PLIST_TEXTURE);
        this.itemChooseLayerNode.wgt.cosImage.loadTexture(icon, ccui.Widget.PLIST_TEXTURE);
        var num = Helper.getItemNum(pricetype);
        this.itemChooseLayerNode.wgt.hadValue.setString(Helper.formatNum(num));
        this.itemChooseLayerNode.wgt.cosValue.setString(Helper.formatNum(this.choose_num*price));
    },
    touchEvent:function (sender,type) {
        if(ccui.Widget.TOUCH_ENDED==type){
            switch(sender.name){
                case "btnMin":
                    if(this.choose_num==1){
                        ShowTipsTool.ErrorTipsFromStringById(100303);  //100303	已是最小值
                    }else{
                        this.choose_num = 1;
                        this.showNowCost();    //显示现在的花费
                    }
                    break;
                case "btnMax":
                    if(this.choose_num==this.max){
                        ShowTipsTool.ErrorTipsFromStringById(100304);  //100304	已是最大值
                    }else{
                        this.choose_num = this.max;
                        this.showNowCost();    //显示现在的花费
                    }
                    break;
                case "btnReduce":
                    if(this.choose_num>1){
                        this.choose_num = this.choose_num-1;
                        this.showNowCost();    //显示现在的花费
                    }else{
                        ShowTipsTool.ErrorTipsFromStringById(100303);  //100303	已是最小值
                    }
                    break;
                case "btnAdd":
                    if(this.choose_num<this.max){
                        if(this.type == 1){
                            this.choose_num = this.choose_num+1;
                        }else if(this.type == 2){
                            var pricetype = this.itemInfo.pricetype;
                            var price = this.itemInfo.price;
                            var num = Helper.getItemNum(pricetype);
                            var count = this.choose_num + 1;
                            var total = price * count;
                            if ( total <= num)
                            {
                                this.choose_num = count;
                            }
                        }
                        this.showNowCost();    //显示现在的花费
                    }else{
                        ShowTipsTool.ErrorTipsFromStringById(100304);  //100304	已是最大值
                    }
                    break;
                case "btnOk":
                    if(this.check_position != -1){
                        this.confirmThing();   //确认
                    }else{
                        ShowTipsTool.ErrorTipsFromStringById(100305);  //100305	请选择一项奖励
                    }
                    break;
                case "btnBack1":
                    this.removeFromParent();
                    break;
                default:
                    break;
            }
        }
    },
    //显示现在的花费
    showNowCost:function(){
        this.itemChooseLayerNode.wgt.textMakeNum.setString(this.choose_num);
        if(this.type == 2){
            var price = this.itemInfo.price;
            this.itemChooseLayerNode.wgt.cosValue.setString(Helper.formatNum(this.choose_num*price));
        }
    },
    //确认
    confirmThing:function(){
        if(this.type == 1){
            bagModel.useThing(parseInt(this.itemid),this.choose_num,this.check_position+1);
        }else if(this.type == 2){
            welfareModel.activityOpt(this.itemInfo.id,2,this.check_position+1,this.choose_num);
        }
    },
    resourceGet:function(data){
        if(data != undefined && data.data != undefined)
        {
            var task = 'resource.get';
            var event = new cc.EventCustom(task);
            event.setUserData(data);
            cc.eventManager.dispatchEvent(event);
        }
    },
    checkevent:function (sender,type) {
        if(type == ccui.CheckBox.EVENT_SELECTED){
            switch(sender.name){
                case "levelUp1":
                    if(this.check_position==-1){
                        this.check_position = 0;
                        this.choose_array[this.check_position][4].setSelected(true);
                    }else{
                        this.choose_array[this.check_position][4].setSelected(false);
                        this.check_position = 0;
                    }
                    break;
                case "levelUp2":
                    if(this.check_position==-1){
                        this.check_position = 1;
                        this.choose_array[this.check_position][4].setSelected(true);
                    }else{
                        this.choose_array[this.check_position][4].setSelected(false);
                        this.check_position = 1;
                    }
                    break;
                case "levelUp3":
                    if(this.check_position==-1){
                        this.check_position = 2;
                        this.choose_array[this.check_position][4].setSelected(true);
                    }else{
                        this.choose_array[this.check_position][4].setSelected(false);
                        this.check_position = 2;
                    }
                    break;
                case "levelUp4":
                    if(this.check_position==-1){
                        this.check_position = 3;
                        this.choose_array[this.check_position][4].setSelected(true);
                    }else{
                        this.choose_array[this.check_position][4].setSelected(false);
                        this.check_position = 3;
                    }
                    break;
                default:
                    break;
            }
        }
        else if(type==ccui.CheckBox.EVENT_UNSELECTED){

            switch(sender.name){
                case "levelUp1":
                    this.check_position = -1;
                    break;
                case "levelUp2":
                    this.check_position = -1;
                    break;
                case "levelUp3":
                    this.check_position = -1;
                    break;
                case "levelUp4":
                    this.check_position = -1;
                    break;
                default:
                    break;
            }
        }
    },
    onExit:function(){
        this._super();
        cc.eventManager.removeListener(this.useThingEvent);
    }
});