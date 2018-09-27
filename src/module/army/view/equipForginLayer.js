
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 /**
 * 装备锻造层的创建
 */

var equipForginLayer = baseLayer.extend({
    LayerName:"equipForginLayer",
    totalCount:0,
    nowIndex:0,  //翻页的索引
    ctor:function(index,equipType){
        this._super();
        this.index = 0;
        if(index != undefined){
            this.index = index;
        }
        this.equipPos = 0;
        if(equipType != undefined){
            this.equipPos = equipType-3;
        }
        this.armyHigh = null;  //当前选中的
        this.armyIndexArr = [];
        this.uiAttributeLayer.setVisible(false);
    },

    onEnter:function(){
        this._super();
        this.initCustomEvent();
    },
    //初始化ui
    initUI:function () {
        this.customWidget();  //自定义Widget
        this.updateInfo();
    },
    initCustomEvent:function () {
        var self = this;
        this.equipForginEvent = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "depot.forging",
            callback: function(event){
                var resData = event.getUserData();
                if(resData.status == 0){
                    //弹出提示
                    var eqArray = GLOBALDATA.army.equips[self.index];
                    if(self.nowInfo.length == 0){
                        for(var j in self.nextInfo){
                            ShowTipsTool.TipsFromText(self.nextInfo[j].name+"+"+self.nextInfo[j].value,cc.color.GREEN,30);
                        }
                    }else{
                        for(var i in self.nowInfo){
                            for(var j in self.nextInfo){
                                if(self.nowInfo[i].name == self.nextInfo[j].name){
                                    ShowTipsTool.TipsFromText(self.nowInfo[i].name+"+"+Helper.CalcDiff(self.nowInfo[i].value,self.nextInfo[j].value),cc.color.GREEN,30);
                                }
                            }
                        }
                    }
                    //更新信息
                    self.updateInfo();
                }
            }
        });
        cc.eventManager.addListener(this.equipForginEvent, this);
    },
    //自定义Widget
    customWidget:function(){
        var wgtArr = [];
        wgtArr.push("ListView_Qi");   //容纳英雄图表的list
		wgtArr.push("armyHead");   //士兵头像
		wgtArr.push("backBtn");   //返回按钮
		wgtArr.push("btnleft");   //向左的按钮
		wgtArr.push("btnright");   //向右的按钮
		//四个装备的背景
        for(var i =0;i<4;i++){
			wgtArr.push("equipBgImage"+i);
        }
		wgtArr.push("Image_forge");   //装备可改造的背景
		wgtArr.push("Text_no");   //装备不可改造的文字
		wgtArr.push("xuanBgImage");   //选中装备的背景
		wgtArr.push("textDuanLv");   //锻造等级
		wgtArr.push("textForNow");   //当前系数
		wgtArr.push("textForNext");   //下级系数
		//需求的材料
		for(var i=1;i<=2;i++){
			wgtArr.push("itemFrame"+i);
			wgtArr.push("itemPieces"+i);
			wgtArr.push("itemIcon"+i);
			wgtArr.push("itemNum"+i);
		}
		wgtArr.push("btnForgin");   //锻造按钮

        var uiForginLayer = ccsTool.load(res.uiEquipForginLayer,wgtArr);
        //控件的名字赋值给this变量
        for(var key in uiForginLayer.wgt){
            this[key] = uiForginLayer.wgt[key];
        }
        this.addChild(uiForginLayer.node);


        //士兵头像的滚动条
        this.ListView_Qi.setScrollBarEnabled(false);//滚动条
        for(var i=0; i<GLOBALDATA.army.battle.length; i++){
            if (GLOBALDATA.army.battle[i]!=0&&GLOBALDATA.army.battle[i]!=-1){
                var image = this.armyHead.clone();
                image.setTag(i);
                image.addTouchEventListener(this.armyHeadEvent,this);
                image.setTouchEnabled(true);
                image.setScale9Enabled(true);
                this.setItemInfo(image,i);
                this.ListView_Qi.pushBackCustomItem(image);
                this.armyIndexArr.push(i);
                this.totalCount++;
            }
        }
        //设置当前的选中和位置
        var itId = this.getListIndex(this.index);
        var item = this.ListView_Qi.getItem(itId);
        var harmyHeadBg = item.getChildByName("harmyHeadBg");
        this.armyHigh = harmyHeadBg;
        this.armyHigh.setVisible(true);
        if(itId<=this.totalCount/2){
            this.ListView_Qi.scrollToLeft(0.2,false);
        }else{
            this.ListView_Qi.scrollToRight(0.2,false);
        }
        //返回按钮
        this.backBtn.addTouchEventListener(this.backEvent, this);
        //向左的按钮
        this.btnleft.addTouchEventListener(this.leftMoveEvent,this);
        //向右的按钮
        this.btnright.addTouchEventListener(this.rightMoveEvent, this);
        //锻造按钮
        this.btnForgin.addTouchEventListener(this.forginEvent, this);
        //材料1
        this.itemFrame1.addTouchEventListener(this.onTouchEvent, this);
        //材料2
        this.itemFrame2.addTouchEventListener(this.onTouchEvent, this);
        //四个装备的背景
        for(var i =0;i<4;i++){
            this["equipBgImage"+i].addTouchEventListener(this.clickEquipEvent, this);
            this["equipBgImage"+i].setTag(i);
        }
    },
    //设置item的信息
    setItemInfo:function(item,index){
        var obj = ccsTool.seekWidget(item,["armyHeadBg","armyHeadIcon"]);
        var SolId = GLOBALDATA.army.battle[index];
        var tsolid = SolId;
        var soldier = GLOBALDATA.soldiers[SolId];
        if(soldier.m > 0){ //突破过
            var qhero = Helper.findHeroById(tsolid);
            tsolid = qhero.breakid || tsolid;
        }
        if(soldier.sq == 10){  //已经进行了终极改造
            var reformAtt = Helper.findHeroById(tsolid);
            tsolid = reformAtt.reform || tsolid;
        }
        var itemConfig = Helper.findItemId(tsolid);
        Helper.LoadFrameImageWithPlist(obj.wgt.armyHeadBg,itemConfig.quality);
        Helper.LoadIcoImageWithPlist(obj.wgt.armyHeadIcon,itemConfig);
    },
    updateInfo:function(){
        var eqArray = GLOBALDATA.army.equips[this.index];
        //四个装备的背景
        for(var i =0;i<4;i++){
            this["equipBgImage"+i].removeAllChildren(true);
            if(eqArray[i+2] != 0){
                var equipImage = new EquipItem(eqArray[i+2]);
                var size = this["equipBgImage"+i].getContentSize();
                equipImage.setPosition(cc.p(size.width/2, size.height/2));
                this["equipBgImage"+i].addChild(equipImage, 2);
                this["equipBgImage"+i].setTouchEnabled(true);
            }else{
                this["equipBgImage"+i].setTouchEnabled(false);
            }
        }
        //选中的装备
        var eqId = eqArray[this.equipPos+2];
        if(eqId != 0){
            var eqInfo = GLOBALDATA.depot[eqId];
            var forginAtt = EQUIPDUANZAOCFG[eqInfo.p];
            if(forginAtt != null){
                this.Image_forge.setVisible(true);  //装备可改造的背景
                this.Text_no.setVisible(false);  //装备不可改造的文字
                //选中装备的背景
                var equipImage = new EquipItem(eqId);
                var size = this.xuanBgImage.getContentSize();
                equipImage.setPosition(cc.p(size.width/2, size.height/2));
                this.xuanBgImage.addChild(equipImage, 2);
                //锻造等级
                var dzLv = eqInfo.d || 0;
                this.textDuanLv.setString(STRINGCFG[100129].string+"："+dzLv); //锻造等级 100129
                //本级属性
                var equipItem = new equAttr(eqInfo.p, eqInfo.s, eqInfo.r, eqInfo.d);
                this.nowInfo = equipItem.getForgeAttrForShow();
                //当前系数
                this.textForNow.setString(forginAtt.add*dzLv*100+"%");
                if(dzLv >= MAXEQUFPRGE){  //超过了最高锻造等级
                    this.textForNext.setString("MAX");  //下级系数
                    this.itemFrame1.setVisible(false);  //需要的材料1
                    this.itemFrame2.setVisible(false);  //需要的材料2
                    this.btnForgin.setVisible(false);   //强化按钮
                }else{
                    var equipItem = new equAttr(eqInfo.p, eqInfo.s, eqInfo.r, eqInfo.d+1);
                    this.nextInfo = equipItem.getForgeAttrForShow();
                    this.textForNext.setString(forginAtt.add*(dzLv+1)*100+"%");  //下级系数
                    //需求的材料
                    var count = 1;
                    var cost = forginAtt["cost"+(dzLv+1)];
                    for(var i=0;i<2;i++){
                        if(cost[i] != null){
                            var itemid = cost[i][0];
                            var itemCon = Helper.findItemId(itemid);
                            Helper.LoadIconFrameAndAddClick(this["itemIcon"+(i+1)],this["itemFrame"+(i+1)],this["itemPieces"+(i+1)],itemCon);  //物品
                            var haveNum = Helper.getItemNum(itemid);
                            this["itemNum"+(i+1)].setString(haveNum+"/"+cost[i][1]);  //数量
                            if(cost[i][1] > haveNum){
                                this["itemNum"+(i+1)].setColor(cc.color(255,0,0));
                            }else{
                                this["itemNum"+(i+1)].setColor(cc.color(255,255,255));
                            }
                            this["itemFrame"+(i+1)].setTag(itemid);
                            count++;
                        }
                    }
                    for(var i=count;i<=2;i++){
                        this["itemFrame"+i].setVisible(false);
                    }
                    this.btnForgin.setVisible(true);   //强化按钮
                }
            }else{
                this.Image_forge.setVisible(false);  //装备可改造的背景
                this.Text_no.setVisible(true);  //装备不可改造的文字
            }
        }else{
            this.Image_forge.setVisible(false);  //装备可改造的背景
            this.Text_no.setVisible(true);  //装备不可改造的文字
        }
    },
    //锻造按钮的事件
    forginEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type){
            var eqArray = GLOBALDATA.army.equips[this.index];
            var eqId = eqArray[this.equipPos+2];
            var eqInfo = GLOBALDATA.depot[eqId];
            var forginAtt = EQUIPDUANZAOCFG[eqInfo.p];
            //判断需要的材料是否足够
            var cost = forginAtt["cost"+(eqInfo.d+1)];
            for(var key in cost){
                var itemNeed = cost[key];
                if(itemNeed[1] > Helper.getItemNum(itemNeed[0])){
                    var itemInfo = Helper.findItemId(itemNeed[0]);
                    ShowTipsTool.TipsFromText(itemInfo.itemname+STRINGCFG[100011].string,cc.color.RED,30);   //显示tips  //100011 不足
                    return
                }
            }
            armyModel.eqForginthen(eqId);
        }
    },
    onTouchEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type){
            switch (sender.name) {
                case "itemFrame1":
                case "itemFrame2":
                    var itemid = sender.getTag();
                    var itemJumpLayer = new ItemJumpLayer(itemid);
                    this.addChild(itemJumpLayer,2);
                    break;
            }
        }
    },
    //选择士兵
    armyHeadEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type) {
            this.index = sender.getTag();
            this.equipPos = 0;
            var itId = this.getListIndex(this.index);
            var item = this.ListView_Qi.getItem(itId);
            var harmyHeadBg = item.getChildByName("harmyHeadBg");
            if(harmyHeadBg !== this.armyHigh) {
                harmyHeadBg.setVisible(true);
                this.armyHigh.setVisible(false);
                this.armyHigh = harmyHeadBg;
            }
            this.updateInfo();
        }
    },
    //点击四个装备中的一个
    clickEquipEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type) {
            this.equipPos = sender.getTag();
            this.updateInfo();
        }
    },
    //返回按钮
    backEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type) {
            this.removeFromParent(true);
        }
    },
    //左移按钮事件
    leftMoveEvent:function(sender, type){
        switch (type){
            case ccui.Widget.TOUCH_ENDED:
                //scrollToItem是滚动到具体的项目
                this.ListView_Qi.scrollToLeft(0.2);
                break;
            default:
                break;
        }
    },
    //右移按钮事件
    rightMoveEvent:function(sender, type){
        switch (type){
            case ccui.Widget.TOUCH_ENDED:
                this.ListView_Qi.scrollToRight(0.2);
                break;
            default:
                break;
        }
    },
    //获取页面的索引
    getListIndex:function(id){
        for(var i = 0;i<this.armyIndexArr.length;i++){
            if(this.armyIndexArr[i] == id){
                return i;
            }
        }
        return 0;
    },

    onExit:function(){
        this._super();
        cc.eventManager.removeListener(this.equipForginEvent);
    }
});