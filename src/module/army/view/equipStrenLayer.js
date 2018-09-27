
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 /**
 * 装备强化层的创建
 */

var equipStrenLayer = baseLayer.extend({
    LayerName:"equipStrenLayer",
    totalEq:0,
    ctor:function(equipId){
        this._super();
        this.equipId = equipId;
        this.eqArr = [];
        this.posArr = [];
        this.index = 0;
        this.strenlv = 0;
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
        //装备强化处理
        var self = this;
        this.evneqStrenUp = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "depot.strengthen",
            callback: function(event){
                var resData = event.getUserData();
                if(resData.status == 0){//强化成功
                    //弹出提示
                    var eqInfo = GLOBALDATA.depot[self.eqArr[self.index]];
                    var equItem = new equAttr(eqInfo.p, eqInfo.s, 0, 0);
                    var nextInfo = equItem.getStrengthAttrForShow();
                    if (self.strenlv != eqInfo.s)
                    {
                        if(self.nowInfo.length == 0){
                            for(var j in nextInfo){
                                ShowTipsTool.TipsFromText(nextInfo[j].name+"+"+nextInfo[j].value,cc.color.GREEN,30);
                            }
                        }else{
                            for(var i in self.nowInfo){
                                for(var j in nextInfo){
                                    if(self.nowInfo[i].name == nextInfo[j].name){
                                        ShowTipsTool.TipsFromText(self.nowInfo[i].name+"+"+Helper.CalcDiff(self.nowInfo[i].value,nextInfo[j].value),cc.color.GREEN,30);
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
        cc.eventManager.addListener(this.evneqStrenUp, 1);
    },
    //自定义Widget
    customWidget:function(){
        var wgtArr = [];
        wgtArr.push("strengthBtn");   //强化标签
		wgtArr.push("refineBtn");   //精炼标签
		wgtArr.push("backBtn");   //返回按钮
		wgtArr.push("equipStrenPageView");   //翻页容器
		wgtArr.push("leftBtn");   //向左的按钮
		wgtArr.push("rightBtn");   //向右的按钮
		wgtArr.push("equipName");   //装备名称
		wgtArr.push("curLevel");   //当前强化等级
		wgtArr.push("nextLev");   //下一强化等级
		wgtArr.push("critCurrent");   //当前属性
		wgtArr.push("critNext");   //下一属性
		wgtArr.push("strenGold");   //强化一次消耗金币
		wgtArr.push("conStrenGold");   //强化5次消耗金币
		wgtArr.push("strenBtn");   //强化一次按钮
		wgtArr.push("conStrenBtn");   //强化5次按钮
		wgtArr.push("equipArmy");  //装备的士兵
        var uiStrenLayer = ccsTool.load(res.uiEquipStrenLayer,wgtArr);
        //控件的名字赋值给this变量
        for(var key in uiStrenLayer.wgt){
            this[key] = uiStrenLayer.wgt[key];
        }
        //uiStrenLayer.node.setPosition(cc.p(0, 105));
        this.addChild(uiStrenLayer.node);

        //强化标签
        this.strengthBtn.setBrightStyle(ccui.Widget.BRIGHT_STYLE_HIGH_LIGHT);
        this.strengthBtn.setTouchEnabled(false);
        //精炼标签
        this.refineBtn.addTouchEventListener(this.equipStrenLayerEvent, this);
        //返回按钮
        this.backBtn.addTouchEventListener(this.equipStrenLayerEvent, this);


        //翻页容器
        for(var i = 0;i<GLOBALDATA.army.equips.length;i++){
            for(var j = 0;j<4;j++){
                var eqId = GLOBALDATA.army.equips[i][j+2];
                if(eqId!=0){
                    var layout = new ccui.Layout();
                    var Contentsize = this.equipStrenPageView.getContentSize();
                    layout.setContentSize(Contentsize);
                    //装备图片
                    var eqItem = new EquipItem(eqId);
                    layout.addChild(eqItem,10);
                    eqItem.setPosition(cc.p(320,100));
                    this.equipStrenPageView.addPage(layout);
                    this.eqArr.push(eqId);
                    this.posArr.push(i);
                    if(eqId==this.equipId){
                        this.index = this.totalEq;
                    }
                    this.totalEq++;
                }
            }
        }
        this.equipStrenPageView.setCurrentPageIndex(this.index);
        this.equipStrenPageView.setTouchEnabled(false);
        var self = this;
        /*this.equipStrenPageView.addEventListener(function (sender, type) {
            self.index = sender.getCurPageIndex().valueOf();
            self.updateInfo();
        }, this);*/

        //强化一次按钮
        this.strenBtn.addTouchEventListener(this.eqStrength, this);
        //强化5次按钮
        this.conStrenBtn.addTouchEventListener(this.eqStrength, this);
        //向左按钮
        this.leftBtn.addTouchEventListener(this.leftEvent, this);
        //向右按钮
        this.rightBtn.addTouchEventListener(this.rightEvent, this);

    },
    eqStrength:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type){
            switch (sender.name) {
                case 'strenBtn'://
                    var sj = this.beforeError(1);
                    if(sj != -1){
                        armyModel.eqStrengthen(this.eqArr[this.index],sj);
                    }
                    break;
                case 'conStrenBtn'://
                    var sj = this.beforeError(5);
                    if(sj != -1){
                        armyModel.eqStrengthen(this.eqArr[this.index],sj);
                    }
                    break;
                default:
                    break;
            }
        }
    },
    //预先错误显示
    beforeError:function(num){
        //判断是否到当前等级上限
        var maxlevel = MAXEQULEVEL;
        if(GLOBALDATA.base.lev * 2 <= maxlevel){
            maxlevel = GLOBALDATA.base.lev * 2;
        }
        var eqInfo = GLOBALDATA.depot[this.eqArr[this.index]];
        var strenlv = eqInfo.s;
        if(strenlv >= maxlevel){
            ShowTipsTool.ErrorTipsFromStringById(100231);   //100231	已达到等级上限
            return -1;
        }
        //强化一次金币
        var itemCfg = Helper.findItemId(eqInfo.p);
        var lvCfg = EQUIPQIANGHUACFG[eqInfo.s] || {};
        var gold = lvCfg["cost"+itemCfg.quality] || 0;
        if(gold > GLOBALDATA.base.money){
            ShowTipsTool.ErrorTipsFromStringById(100010);   //显示错误的tips 100010 金币不足
            return -1;
        }
        if(num == 5){
            var js = 0;
            var sheng = GLOBALDATA.base.money;
            for(var i=0,j=eqInfo.s;i<5;i++,j++){
                var lvCfgs = EQUIPQIANGHUACFG[j] || {};
                var golds = lvCfgs["cost"+itemCfg.quality] || 0;
                if(sheng >= golds && j<maxlevel){
                    sheng = sheng - golds;
                    js++;
                }
            }
            return js;
        }else{
            return 1;
        }
    },
    updateInfo:function () {

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
    updateEquip:function(){
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
        this.strenlv = eqInfo.s;
        var itemCfg = Helper.findItemId(eqInfo.p);
        //装备名称
        this.equipName.setString(itemCfg.itemname);
        Helper.setNamecolorByQuality(this.equipName,itemCfg.quality);
        this.curLevel.setString(eqInfo.s);  //当前强化等级
        var equItem = new equAttr(eqInfo.p, eqInfo.s, 0, 0);
        this.nowInfo = equItem.getStrengthAttrForShow();
        var strAttr = '';
        for(var attr in this.nowInfo){
            strAttr =strAttr + this.nowInfo[attr].name+'+'+ this.nowInfo[attr].value+'\n';
        }
        this.critCurrent.setString(strAttr);  //当前属性
        if(eqInfo.s >= MAXEQULEVEL) {  //下一级大于了最大的强化等级
            this.nextLev.setString("MAX");  //下一强化等级
            this.critNext.setString("MAX");  //下一属性
            this.strenGold.setString("MAX"); //强化一次消耗金币
            this.strenGold.setColor(cc.color(255,255,255));
            this.conStrenGold.setString("MAX"); //强化5次消耗金币
            this.conStrenGold.setColor(cc.color(255,255,255));
            this.strenBtn.setVisible(false);   //强化一次按钮
            this.conStrenBtn.setVisible(false);   //强化5次按钮
        }else{
            this.nextLev.setString(eqInfo.s+1);  //下一强化等级
            var equItem = new equAttr(eqInfo.p, eqInfo.s + 1, 0, 0);
            var nextInfo = equItem.getStrengthAttrForShow();  //下一精炼等级的信息
            var strAttr = '';
            for(var attr in nextInfo){
                strAttr =strAttr + nextInfo[attr].name+'+'+ nextInfo[attr].value+'\n';
            }
            this.critNext.setString(strAttr);  //下一属性
            //强化一次金币
            var lvCfg = EQUIPQIANGHUACFG[eqInfo.s] || {};
            var gold = lvCfg["cost"+itemCfg.quality] || 0;
            this.strenGold.setString(Helper.formatNum(gold));
            //判断金币是否够
            if(gold > GLOBALDATA.base.money){
                this.strenGold.setColor(cc.color(255,0,0));
            }else {
                this.strenGold.setColor(cc.color(255,255,255));
            }
            //强化5次金币
            var totalGold = 0;
            for(var i=0,j=eqInfo.s;i<5;i++,j++){
                var lvCfg = EQUIPQIANGHUACFG[j] || {};
                totalGold += lvCfg["cost"+itemCfg.quality] || 0;
            }
            this.conStrenGold.setString(Helper.formatNum(totalGold));
            if(totalGold > GLOBALDATA.base.money){
                this.conStrenGold.setColor(cc.color(255,0,0));
            }else {
                this.conStrenGold.setColor(cc.color(255,255,255));
            }
            this.strenBtn.setVisible(true);   //强化一次按钮
            this.conStrenBtn.setVisible(true);   //强化5次按钮
            if(eqInfo.s > MAXEQULEVEL-5){  //不能够一次性强化5次了
                this.conStrenBtn.setVisible(false);   //强化5次按钮
            }
        }
    },
    equipStrenLayerEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type){
            switch (sender.name){
                case 'backBtn':
                    if(this.eqDetail){
                        this.eqDetail.setLocalZOrder(2);
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
                case 'refineBtn':
                    var _equipRefineLayer = new equipRefineLayer(this.eqArr[this.index]);
                    if(this.eqDetail){
                        _equipRefineLayer.eqDetail = this.eqDetail;
                    }
                    this.getParent().addChild(_equipRefineLayer, 2);
                    this.removeFromParent();
                    break;
                default:
                    break;
            }
        }
    },
    //更新当前的装备图片信息
    updateEquBg:function(){
        var layout = this.equipStrenPageView.getPage(this.index);
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
            this.equipStrenPageView.setCurrentPageIndex(this.index);
            this.updateInfo();
        }
    },
    //右切换按钮事件
    rightEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type){
            this.index++;
            this.equipStrenPageView.setCurrentPageIndex(this.index);
            this.updateInfo();
        }
    },
    onExit:function(){
        this._super();
        cc.log('equipStrenLayer onExit');
        cc.eventManager.removeListener(this.evneqStrenUp);
    }
});