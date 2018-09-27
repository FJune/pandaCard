
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 /**
 * 装备精炼层的创建
 */

var equipRefineLayer = baseLayer.extend({
    LayerName:"equipRefineLayer",
    totalEq:0,
    ctor:function(equipId){
        this._super();
        this.equipId = equipId;
        this.index = 0;
        this.eqArr = [];
        this.posArr = [];
        this.refineLv = 0;   //当前精炼等级
        this.idArr = [22011,22012,22013,22014];  //四种精炼石
    },

    onEnter:function(){
        this._super();
        var self = this;
        this.equipRefineEvent = cc.EventListener.create({
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
                    //更新装备信息
                    self.updateEquip();
                    //更新当前的装备图片信息
                    self.updateEquBg();
                }
            }
        });
        cc.eventManager.addListener(this.equipRefineEvent, this);
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
		wgtArr.push("backBtn");   //返回标签
		wgtArr.push("equipRefinePageView");   //翻页容器
		wgtArr.push("leftBtn");   //向左按钮
		wgtArr.push("rightBtn");   //向右按钮
		wgtArr.push("equipArmy");   //装备的士兵
		wgtArr.push("equipName");   //装备名称
		wgtArr.push("equipReAttr");   //本级属性
		wgtArr.push("nextEquipReAttr");   //下级属性
		wgtArr.push("refineLev");   //精炼阶段
		wgtArr.push("percentage");   //精炼经验
		wgtArr.push("refineBar");   //精炼经验进度条
		//四种精炼石
		for(var i = 1;i<=4;i++){
			wgtArr.push("itemFrame"+i);
			wgtArr.push("itemPieces"+i);
			wgtArr.push("itemIcon"+i);
			wgtArr.push("itemNum"+i);
			wgtArr.push("itemBlack"+i);
            wgtArr.push("itemDes"+i);
		}


        var uiRefineLayer = ccsTool.load(res.uiEquipRefineLayer,wgtArr);
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
        this.strengthBtn.addTouchEventListener(this.equipRefineLayerEvent, this);
        //返回标签
        this.backBtn.addTouchEventListener(this.equipRefineLayerEvent, this);

        //翻页容器
        for(var i = 0;i<GLOBALDATA.army.equips.length;i++){
            for(var j = 0;j<4;j++){
                var eqId = GLOBALDATA.army.equips[i][j+2];
                if(eqId!=0){
                    var layout = new ccui.Layout();
                    var Contentsize = this.equipRefinePageView.getContentSize();
                    layout.setContentSize(Contentsize);
                    //装备图片
                    var eqItem = new EquipItem(eqId);
                    layout.addChild(eqItem,10);
                    eqItem.setPosition(cc.p(320,100));
                    this.equipRefinePageView.addPage(layout);
                    this.eqArr.push(eqId);
                    this.posArr.push(i);
                    if(eqId==this.equipId){
                        this.index = this.totalEq;
                    }
                    this.totalEq++;
                }
            }
        }
        this.equipRefinePageView.setCurrentPageIndex(this.index);
        this.equipRefinePageView.setTouchEnabled(false);
        var self = this;
        /*this.equipRefinePageView.addEventListener(function (sender, type) {
            self.index = sender.getCurPageIndex().valueOf();
            self.updateInfo();
        }, this);*/


        //向左按钮
        this.leftBtn.addTouchEventListener(this.leftEvent, this);
        //向右按钮
        this.rightBtn.addTouchEventListener(this.rightEvent, this);
        //四种精炼石
        for(var i = 1;i<=4;i++){
            var itemCfg = Helper.findItemId(this.idArr[i-1]);
            Helper.LoadIconFrameAndAddClick(this["itemIcon"+i],this["itemFrame"+i],this["itemPieces"+i],itemCfg);
            this["itemFrame"+i].setTag(this.idArr[i-1]);
            this["itemFrame"+i].addTouchEventListener(this.refineEquEvent, this);
            this["itemDes"+i].setString(STRINGCFG[100130].string+" +"+itemCfg.value);
        }
    },

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
        //本级属性
        var equItem = new equAttr(eqInfo.p, 0, eqInfo.r, 0);
        this.nowInfo = equItem.getRefineAttrForShow();

        var strAttr ='';
        for(var attr in this.nowInfo){
            strAttr = strAttr + this.nowInfo[attr].name+'+'+this.nowInfo[attr].value+'\n';
        }
        this.nextInfo = [];  //下一精炼等级的信息
        this.equipReAttr.setString(strAttr);
        if(eqInfo.r >= MAXEQUREFINE){  //大于最大精炼等级
            this.nextEquipReAttr.setString("MAX");  //下级属性
            this.percentage.setString("MAX");    //精炼经验
            this.refineBar.setPercent(100);  //精炼经验进度条
        }else{
            //下级属性
            equItem = new equAttr(eqInfo.p, 0, eqInfo.r + 1, 0);
            this.nextInfo = equItem.getRefineAttrForShow();
            var strAttr = '';
            for(var attr in this.nextInfo){
                strAttr = strAttr + this.nextInfo[attr].name+'+'+this.nextInfo[attr].value+'\n';
            }
            this.nextEquipReAttr.setString(strAttr);
            //精炼经验
            var jlCfg = EQUIPJINGLIANCFG[eqInfo.r] || {};
            var tExp = jlCfg["exp"+itemCfg.quality] || 0;
            var nowexp = eqInfo.e || 0;
            this.percentage.setString(nowexp+"/"+tExp);
            //精炼经验进度条
            this.refineBar.setPercent(Math.floor(nowexp/tExp*100));
        }
        //精炼阶段
        var strText = StringFormat(STRINGCFG[100030].string,eqInfo.r);  //100030 精炼阶级：$1阶
        this.refineLev.setString(strText);
        //四种精炼石
        for(var i = 1;i<=4;i++){
            var id = this.idArr[i-1];
            var have = Helper.getItemNum(id);
            this["itemNum"+i].setString(have);
            if(have<=0){
                this["itemBlack"+i].setVisible(true);
            }else{
                this["itemBlack"+i].setVisible(false);
            }
        }
    },
    equipRefineLayerEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type){
            switch (sender.name){
                case'backBtn':
                    if(this.eqDetail){
                        this.eqDetail.setLocalZOrder(2);
                    }
                    //更新配饰属性界面
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
                    var _equipStrenLayer = new equipStrenLayer(this.eqArr[this.index]);
                    if(this.eqDetail){
                        _equipStrenLayer.eqDetail = this.eqDetail;
                    }
                    this.getParent().addChild(_equipStrenLayer, 2);
                    this.removeFromParent();
                    break;
                default:
                    break;
            }
        }
    },
    //精炼装备
    refineEquEvent:function(sender, type){
        if(ccui.Widget.TOUCH_BEGAN == type){
            this.uid = sender.getTag();
            if(Helper.getItemNum(this.uid) > 0)
            {
                this.schedule(this.updateSend, 0.2, cc.REPEAT_FOREVER);
            }
        }else if(ccui.Widget.TOUCH_ENDED==type || ccui.Widget.TOUCH_CANCELED==type){
            this.updateSend();
            this.unschedule(this.updateSend);
        }
    },
    //定时发送消息
    updateSend:function(){
        var uid = this.uid;
        if(Helper.getItemNum(uid) <= 0){
            //var itemInfo = Helper.findItemId(uid);
            //ShowTipsTool.TipsFromText(itemInfo.itemname+STRINGCFG[100011].string,cc.color.RED,30);   //显示tips  //100011 不足

            var itemJumpLayer = new ItemJumpLayer(uid);
            this.addChild(itemJumpLayer,2);
            this.unschedule(this.updateSend);
            return;
        }
        var equid = this.eqArr[this.index];
        var eqInfo = GLOBALDATA.depot[equid];
        if(eqInfo.r >= MAXEQUREFINE){  //大于最大精炼等级
            ShowTipsTool.ErrorTipsFromStringById(100125);   //100125	装备精炼已经达到最高阶段
            return;
        }
        armyModel.eqRefinethen(equid,uid);
    },
    //更新当前的装备图片信息
    updateEquBg:function(){
        var layout = this.equipRefinePageView.getPage(this.index);
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
            this.equipRefinePageView.setCurrentPageIndex(this.index);
            this.updateInfo();
        }
    },
    //右切换按钮事件
    rightEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type){
            this.index++;
            this.equipRefinePageView.setCurrentPageIndex(this.index);
            this.updateInfo();
        }
    },

    onExit:function(){
        this._super();
        cc.eventManager.removeListener(this.equipRefineEvent);
    }
});