
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 /**
 * 配饰强化层的创建
 */

var accStrenLayer = baseLayer.extend({
    LayerName:"accStrenLayer",
    totalEq:0,
    ctor:function(equipId){
        this._super();
        this.equipId = equipId;
        this.eqArr = [];
        this.posArr = [];
        this.index = 0;
        this.idArr = [22068,22069];  //两种强化石
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
        //饰品强化处理
        var self = this;
        this.evneqStrenUp = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "depot.strengthen",
            callback: function(event){
                var resData = event.getUserData();
                if(resData.status == 0){//强化成功
                    //弹出提示
                    var eqInfo = GLOBALDATA.depot[self.eqArr[self.index]];
                    if (self.strenlv != eqInfo.s)
                    {
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
        cc.eventManager.addListener(this.evneqStrenUp, 1);
    },
    //自定义Widget
    customWidget:function(){
        var wgtArr = [];
        wgtArr.push("strengthBtn");   //强化标签
        wgtArr.push("refineBtn");   //精炼标签
        wgtArr.push("backBtn");   //返回按钮
        wgtArr.push("accStrenPageView");   //翻页容器
		wgtArr.push("equipArmy");  //装备的士兵
		wgtArr.push("equipName");   //装备名称
		wgtArr.push("accStrenAttr");   //当前强化属性
        wgtArr.push("nextAccStrenAttr");   //下一强化属性
		wgtArr.push("refineLev");   //当前等级
		wgtArr.push("percentage");   //当前经验
		wgtArr.push("refineBar");   //经验进度条
		//两种强化石
		for(var i=1;i<=2;i++){
			wgtArr.push("itemFrame"+i);
			wgtArr.push("itemPieces"+i);
			wgtArr.push("itemIcon"+i);
			wgtArr.push("itemNum"+i);
			wgtArr.push("itemName"+i);
            wgtArr.push("itemDes"+i);
		}
		wgtArr.push("leftBtn");   //向左的按钮
        wgtArr.push("rightBtn");   //向右的按钮
		wgtArr.push("accStrenBtn");   //强化1级按钮
        wgtArr.push("upLevBtn");   //强化10级按钮

        var uiStrenLayer = ccsTool.load(res.uiAccStrenLayer,wgtArr);
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
        //材料1
        this.itemFrame1.addTouchEventListener(this.onTouchEvent, this);
        //材料2
        this.itemFrame2.addTouchEventListener(this.onTouchEvent, this);
        //向左的按钮
        this.leftBtn.addTouchEventListener(this.leftEvent, this);
        //向右的按钮
        this.rightBtn.addTouchEventListener(this.rightEvent, this);
        //强化1级按钮
        this.accStrenBtn.addTouchEventListener(this.eqStrength, this);
        //强化10级按钮
        this.upLevBtn.addTouchEventListener(this.eqStrength, this);

        //翻页容器
        for(var i = 0;i<GLOBALDATA.army.equips.length;i++){
            for(var j = 0;j<2;j++){
                var eqId = GLOBALDATA.army.equips[i][j];
                if(eqId!=0){
                    var layout = new ccui.Layout();
                    var Contentsize = this.accStrenPageView.getContentSize();
                    layout.setContentSize(Contentsize);
                    //装备图片
                    var eqItem = new EquipItem(eqId);
                    layout.addChild(eqItem,10);
                    eqItem.setPosition(cc.p(320,100));
                    this.accStrenPageView.addPage(layout);
                    this.eqArr.push(eqId);
                    this.posArr.push(i);
                    if(eqId==this.equipId){
                        this.index = this.totalEq;
                    }
                    this.totalEq++;
                }
            }
        }
        this.accStrenPageView.setCurrentPageIndex(this.index);
        this.accStrenPageView.setTouchEnabled(false);
        var self = this;
        /*this.accStrenPageView.addEventListener(function (sender, type) {
         self.index = sender.getCurPageIndex().valueOf();
         self.updateInfo();
         }, this);*/
        //两种强化石
        for(var i = 1;i<=2;i++){
            var itemid = this.idArr[i-1];
            var itemCfg = Helper.findItemId(itemid);
            Helper.LoadIconFrameAndAddClick(this["itemIcon"+i],this["itemFrame"+i],this["itemPieces"+i],itemCfg);
            this["itemName"+i].setString(itemCfg.itemname);
            Helper.setNamecolorByQuality(this["itemName"+i],itemCfg.quality);  //颜色
            this["itemDes"+i].setString(STRINGCFG[100130].string+" +"+itemCfg.value);
            this["itemFrame"+i].setTag(itemid);
        }
    },
    eqStrength:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type){
            switch (sender.name) {
                case 'accStrenBtn':  //强化一级
                    var sj = this.beforeError(1);
                    if(sj != -1){
                        armyModel.eqStrengthen(this.eqArr[this.index],sj);
                    }
                    break;
                case 'upLevBtn':  //强化10级
                    var sj = this.beforeError(10);
                    if(sj != -1){
                        armyModel.eqStrengthen(this.eqArr[this.index],sj);
                    }
                    break;
            }
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
    //预先错误显示
    beforeError:function(num){
        var eqInfo = GLOBALDATA.depot[this.eqArr[this.index]];
        //判断是否到当前等级上限
        var maxlevel = MAXACCLEVEL;
        if(GLOBALDATA.base.lev <= maxlevel){
            maxlevel = GLOBALDATA.base.lev;
        }
        var strenlv = eqInfo.s;
        if(strenlv >= maxlevel){
            ShowTipsTool.ErrorTipsFromStringById(100231);   //100231	已达到等级上限
            return -1;
        }
        //判断能否升一级
        var itemCfg = Helper.findItemId(eqInfo.p);
        var qihCost = ACCQIANGHUACFG[eqInfo.s]["cost"+itemCfg.quality];
        var haveExp = 0;
        for(var i = 1;i<=2;i++){
            var id = this.idArr[i-1];
            var have = Helper.getItemNum(id);
            var itemCfgs = Helper.findItemId(id);
            haveExp = haveExp + have*itemCfgs.value;
        }
        if(qihCost > haveExp){
            ShowTipsTool.ErrorTipsFromStringById(100128);   //100128	配饰强化石不足
            return -1;
        }


        //计算实际情况
        if(num == 10){
            num = Math.floor(eqInfo.s/10)*10+10-eqInfo.s;
        }
        //判断消耗
        var totalExp = 0;
        for(var i=1,j=eqInfo.s;i<=num;i++,j++){
            var qih = ACCQIANGHUACFG[j];
            totalExp = totalExp + qih["cost"+itemCfg.quality];
        }
        //计算使用
        var useExp = 0;
        for(var i = 1;i<=2;i++){
            var id = this.idArr[i-1];
            var have = Helper.getItemNum(id);
            var itemCfgs = Helper.findItemId(id);
            var xu = Math.ceil((totalExp-useExp)/itemCfgs.value);
            if(have >= xu){
                useExp = useExp + xu*itemCfgs.value;
            }else{
                useExp = useExp + have*itemCfgs.value;
            }
        }
        //判断实际能够升几级
        var sheng = useExp;
        var sjnum = 0;
        for(var j = eqInfo.s;;j++){
            var qih = ACCQIANGHUACFG[j];
            if(qih !=null && qih["cost"+itemCfg.quality] != 0 && sheng >= qih["cost"+itemCfg.quality]){
                sheng = sheng - qih["cost"+itemCfg.quality];
                sjnum++;
            }else{
                break;
            }
        }
        return sjnum;
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
        this.refineLev.setString(eqInfo.s);   //当前等级
        //当前强化属性
        var equItem = new equAttr(eqInfo.p, eqInfo.s, 0, 0);
        this.nowInfo = equItem.getStrengthAttrForShow();
        var strAttr = '';
        for(var attr in this.nowInfo){
            strAttr =strAttr + this.nowInfo[attr].name+'+'+ this.nowInfo[attr].value+'\n';
        }
        this.accStrenAttr.setString(strAttr);  //当前强化属性
        if(eqInfo.s >= MAXACCLEVEL) {  //下一级大于了最大的强化等级
            this.nextAccStrenAttr.setString("MAX");  //下一强化属性
            this.percentage.setString("MAX");    //当前经验
            this.refineBar.setPercent(100);  //经验进度条
            this.accStrenBtn.setVisible(false);   //强化一级按钮
            this.upLevBtn.setVisible(false);   //强化10级按钮
        }else{
            equItem = new equAttr(eqInfo.p, eqInfo.s + 1, 0, 0);
            this.nextInfo = equItem.getStrengthAttrForShow();
            var strAttr = '';
            for(var attr in this.nextInfo){
                strAttr =strAttr + this.nextInfo[attr].name+'+'+ this.nextInfo[attr].value+'\n';
            }
            this.nextAccStrenAttr.setString(strAttr);  //下一强化属性
            //当前经验
            var jlCfg = ACCQIANGHUACFG[eqInfo.s] || {};
            var tExp = jlCfg["cost"+itemCfg.quality] || 0;
            var nowexp = eqInfo.e || 0;
            this.percentage.setString(nowexp+"/"+tExp);
            //经验进度条
            this.refineBar.setPercent(Math.floor(nowexp/tExp*100));
            this.accStrenBtn.setVisible(true);   //强化一级按钮
            this.upLevBtn.setVisible(true);   //强化10级按钮
            if(eqInfo.s > MAXACCLEVEL-10){  //不能够一次性强化10级了
                this.upLevBtn.setVisible(false);   //强化10级按钮
            }
        }
        //两种强化石
        for(var i = 1;i<=2;i++){
            var id = this.idArr[i-1];
            var have = Helper.getItemNum(id);
            this["itemNum"+i].setString(have);
        }
    },
    equipStrenLayerEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type){
            switch (sender.name){
                case 'backBtn':
                    if(this.accDetail){
                        this.accDetail.setLocalZOrder(2);
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
                case 'refineBtn':
                    var _accRefineLayer = new accRefineLayer(this.eqArr[this.index]);
                    if(this.accDetail){
                        _accRefineLayer.accDetail = this.accDetail;
                    }
                    this.getParent().addChild(_accRefineLayer, 2);
                    this.removeFromParent();
                    break;
                default:
                    break;
            }
        }
    },
    //更新当前的装备图片信息
    updateEquBg:function(){
        var layout = this.accStrenPageView.getPage(this.index);
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
            this.accStrenPageView.setCurrentPageIndex(this.index);
            this.updateInfo();
        }
    },
    //右切换按钮事件
    rightEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type){
            this.index++;
            this.accStrenPageView.setCurrentPageIndex(this.index);
            this.updateInfo();
        }
    },
    onExit:function(){
        this._super();
        cc.log('equipStrenLayer onExit');
        cc.eventManager.removeListener(this.evneqStrenUp);
    }
});