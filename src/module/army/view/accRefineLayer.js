
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 /**
 * 配饰精炼层的创建
 */

var accRefineLayer = baseLayer.extend({
    LayerName:"accRefineLayer",
    totalEq:0,
    ctor:function(equipId){
        this._super();
        this.equipId = equipId;
        this.eqArr=[];
        this.posArr = [];
        this.index = 0;
        this.refineLv = 0;   //当前精炼等级
    },
    onEnter:function(){
        this._super();
        var self = this;
        this.accRefineEvent = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "depot.refine",
            callback: function(event){
                var resData = event.getUserData();
                if(resData.status == 0){
                    //弹出提示
                    var eqInfo = GLOBALDATA.depot[self.eqArr[self.index]];
                    if(self.refineLv != eqInfo.r){
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
                    }
                    // 更新装备信息
                    self.updateEquip();
                    //更新当前的装备图片信息
                    self.updateEquBg();
                }
            }
        });
        cc.eventManager.addListener(this.accRefineEvent, this);
    },
    //初始化ui
    initUI:function () {
        this.customWidget();  //自定义Widget
        this.updateInfo();
    },
    //自定义Widget
    customWidget:function(){
        var wgtArr = [];
        wgtArr.push("refineBtn");   //精炼标签
		wgtArr.push("strengthBtn");   //强化标签
		wgtArr.push("backBtn");   //返回按钮
		wgtArr.push("accRefinePageView");   //翻页容器
		wgtArr.push("equipArmy");   //装备的士兵
		wgtArr.push("equipName");   //装备名称
		wgtArr.push("reAttr");   //当前精炼属性
        wgtArr.push("nextReAttr");   //下一精炼属性
		wgtArr.push("refineLev");   //当前等级
		wgtArr.push("refineUpBtn");   //精炼按钮
		//需要的材料
		for(var i=1;i<=2;i++){
			wgtArr.push("itemFrame"+i);
			wgtArr.push("itemPieces"+i);
			wgtArr.push("itemIcon"+i);
			wgtArr.push("itemName"+i);
			wgtArr.push("itemNum"+i);
		}
		wgtArr.push("leftBtn");   //向左按钮
		wgtArr.push("rightBtn");   //向右按钮

        var uiRefineLayer = ccsTool.load(res.uiAccRefineLayer,wgtArr);
        //控件的名字赋值给this变量
        for(var key in uiRefineLayer.wgt){
            this[key] = uiRefineLayer.wgt[key];
        }
        //uiRefineLayer.node.setPosition(cc.p(0, 105));
        this.addChild(uiRefineLayer.node);

        //精炼标签
        this.refineBtn.setBrightStyle(ccui.Widget.BRIGHT_STYLE_HIGH_LIGHT);
        this.refineBtn.setTouchEnabled(false);
        //强化标签
        this.strengthBtn.addTouchEventListener(this.accRefineLayerEvent, this);
        //返回按钮
        this.backBtn.addTouchEventListener(this.accRefineLayerEvent, this);

        //翻页容器
        for(var i = 0;i<GLOBALDATA.army.equips.length;i++){
            for(var j = 0;j<2;j++){
                var eqId = GLOBALDATA.army.equips[i][j];
                if(eqId!=0){
                    var layout = new ccui.Layout();
                    var Contentsize = this.accRefinePageView.getContentSize();
                    layout.setContentSize(Contentsize);
                    //装备图片
                    var eqItem = new EquipItem(eqId);
                    layout.addChild(eqItem,10);
                    eqItem.setPosition(cc.p(320,100));
                    this.accRefinePageView.addPage(layout);
                    this.eqArr.push(eqId);
                    this.posArr.push(i);
                    if(eqId==this.equipId){
                        this.index = this.totalEq;
                    }
                    this.totalEq++;
                }
            }
        }
        this.accRefinePageView.setCurrentPageIndex(this.index);
        this.accRefinePageView.setTouchEnabled(false);
        var self = this;
        /*this.accRefinePageView.addEventListener(function (sender, type) {
         self.index = sender.getCurPageIndex().valueOf();
         self.updateInfo();
         }, this);*/
        //向左按钮
        this.leftBtn.addTouchEventListener(this.leftEvent, this);
        //向右按钮
        this.rightBtn.addTouchEventListener(this.rightEvent, this);
        //精炼按钮
        this.refineUpBtn.addTouchEventListener(this.accRefineLayerEvent, this);
        //材料1
        this.itemFrame1.addTouchEventListener(this.accRefineLayerEvent, this);
        //材料2
        this.itemFrame2.addTouchEventListener(this.accRefineLayerEvent, this);
    },

    //精炼层数据加载函数
    updateInfo:function(){
        //控制左右按钮显示隐藏
        if(this.index==0){
            this.leftBtn.setVisible(false);
        }else {
            this.leftBtn.setVisible(true);
        }
        if(this.index==this.totalEq-1){
            this.rightBtn.setVisible(false);
        }else {
            this.rightBtn.setVisible(true);
        }
        //更新装备信息
        this.updateEquip();
    },

    //更新装备信息
    updateEquip:function() {
        //装备的士兵
        var posId = this.posArr[this.index];
        var tsolid = GLOBALDATA.army.battle[posId];
        var soldier = GLOBALDATA.soldiers[tsolid];
        if(soldier.m > 0){ //突破过
            var qhero = Helper.findHeroById(tsolid);
            tsolid = qhero.breakid || tsolid;
        }
        if(soldier.sq == 10){  //已经进行了终极改造
            var reformAtt = Helper.findHeroById(tsolid);
            tsolid = reformAtt.reform || tsolid;
        }
        var itemConfig = Helper.findItemId(tsolid);
        this.equipArmy.setString(itemConfig.itemname);
        Helper.setNamecolorByQuality(this.equipArmy,itemConfig.quality);  //颜色
        //装备信息
        var eqInfo = GLOBALDATA.depot[this.eqArr[this.index]];
        this.refineLv = eqInfo.r;
        var itemCfg = Helper.findItemId(eqInfo.p);
        //装备名称
        this.equipName.setString(itemCfg.itemname);
        Helper.setNamecolorByQuality(this.equipName,itemCfg.quality);
        this.refineLev.setString(eqInfo.r);   //当前等级
        //当前精炼属性
        var equItem = new equAttr(eqInfo.p, 0, eqInfo.r, 0);
        this.nowInfo = equItem.getRefineAttrForShow();
        var strAttr = '';
        for(var attr in this.nowInfo){
            strAttr =strAttr + this.nowInfo[attr].name+'+'+ this.nowInfo[attr].value+'\n';
        }
        this.nextInfo = [];  //下一精炼等级的信息
        this.reAttr.setString(strAttr);  //当前精炼属性
        if(eqInfo.r >= MAXACCREFINE) {  //下一级大于了最大的精炼等级
            this.nextReAttr.setString("MAX");  //下一强化属性
            this.itemFrame1.setVisible(false);  //需求材料1
            this.itemFrame2.setVisible(false);  //需求材料2
            this.refineUpBtn.setVisible(false);  //精炼按钮
        }else{
            equItem = new equAttr(eqInfo.p, 0, eqInfo.r + 1, 0);
            this.nextInfo = equItem.getRefineAttrForShow();
            var strAttr = '';
            for(var attr in this.nextInfo){
                strAttr =strAttr + this.nextInfo[attr].name+'+'+ this.nextInfo[attr].value+'\n';
            }
            this.nextReAttr.setString(strAttr);  //下一强化属性
            this.refineUpBtn.setVisible(true);  //精炼按钮
            var accAttr = Helper.findAccJinglian(eqInfo.p,(eqInfo.r+1));
            var count = 1;
            for(var i=0;i<2;i++){
                var cost = accAttr.cost[i];
                if(cost != null){
                    var itemid = cost[0];
                    var itemCfg = Helper.findItemId(itemid);
                    Helper.LoadIconFrameAndAddClick(this["itemIcon"+(i+1)],this["itemFrame"+(i+1)],this["itemPieces"+(i+1)],itemCfg);  //物品
                    this["itemName"+(i+1)].setString(itemCfg.itemname);
                    Helper.setNamecolorByQuality(this["itemName"+(i+1)],itemCfg.quality);
                    var haveNum = Helper.getItemNum(itemid);
                    this["itemNum"+(i+1)].setString(haveNum+"/"+cost[1]);  //数量
                    if(cost[1] > haveNum){
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
        }
    },
    accRefineLayerEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type){
            switch (sender.name){
                case'backBtn':
                    if(this.accDetail){
                        this.accDetail.setLocalZOrder(2);
                    }
                    //更新装备属性界面
                    var evn = new cc.EventCustom('updateEquUI');
                    var data = {};
                    data.equipId = this.eqArr[this.index];
                    data.pos = this.posArr[this.index];
                    evn.setUserData(data);
                    cc.eventManager.dispatchEvent(evn);
                    //更新装备大师界面
                    var evn = new cc.EventCustom('updateEquMaster');
                    cc.eventManager.dispatchEvent(evn);

                    this.removeFromParent();
                    break;
                case'strengthBtn':
                    var _accStrenLayer = new accStrenLayer(this.eqArr[this.index]);
                    if(this.accDetail){
                        _accStrenLayer.accDetail = this.accDetail;
                    }
                    this.getParent().addChild(_accStrenLayer, 2);
                    this.removeFromParent();
                    break;
                case'refineUpBtn':
                    var eqInfo = GLOBALDATA.depot[this.eqArr[this.index]];
                    var accAttr = Helper.findAccJinglian(eqInfo.p,(eqInfo.r+1));
                    //判断需要的材料是否足够
                    for(var key in accAttr.cost){
                        var itemNeed = accAttr.cost[key];
                        if(itemNeed[1] > Helper.getItemNum(itemNeed[0])){
                            var itemInfo = Helper.findItemId(itemNeed[0]);
                            ShowTipsTool.TipsFromText(itemInfo.itemname+STRINGCFG[100011].string,cc.color.RED,30);   //显示tips  //100011 不足
                            return
                        }
                    }
                    armyModel.eqRefinethen(this.eqArr[this.index],0);
                    break;
                case "itemFrame1":
                case "itemFrame2":
                    var itemid = sender.getTag();
                    var itemJumpLayer = new ItemJumpLayer(itemid);
                    this.addChild(itemJumpLayer,2);
                    break;
                default:
                    break;
            }
        }
    },
    //更新当前的装备图片信息
    updateEquBg:function(){
        var layout = this.accRefinePageView.getPage(this.index);
        layout.removeAllChildren(true);
        //装备图片
        var eqItem = new EquipItem(this.eqArr[this.index]);
        layout.addChild(eqItem,10);
        eqItem.setPosition(cc.p(320,100));
    },
    //左切换按钮事件
    leftEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type){
            this.index--;
            this.accRefinePageView.setCurrentPageIndex(this.index);
            this.updateInfo();
        }
    },
    //右切换按钮事件
    rightEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type){
            this.index++;
            this.accRefinePageView.setCurrentPageIndex(this.index);
            this.updateInfo();
        }
    },


    onExit:function(){
        this._super();
        cc.eventManager.removeListener(this.accRefineEvent);
    }
});