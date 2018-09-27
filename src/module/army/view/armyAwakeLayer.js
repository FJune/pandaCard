
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 /**
 * 士兵觉醒层的创建
 */
var armyAwakeLayer = baseLayer.extend({
    LayerName:"armyAwakeLayer",
    totalRole:0,
    nowIndex:0,  //翻页的索引
    equPosId:0,   //查看的觉醒材料位置的id
    nowGetId:0,   //现在准备获取的id
    ctor:function(index){
        this._super();
        this.index = index;
        this.armyIndexArr = [];
        this.getArray = [];
        this.activityPos = [[510,780],[510,600],[510,420],[510,240]];  //跳转到精英副本的指示特效的位置
    },

    onEnter:function(){
        this._super();
        var self = this;
        this.armyEvolutionEvent = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            eventName: "soldier.awaken",
            callback:function(event){
                var resData = event.getUserData();
                if(resData.status == 0){
                    //现在的属性
                    var solId = GLOBALDATA.army.battle[self.index];
                    var soldier = GLOBALDATA.soldiers[solId];
                    var equlist = GLOBALDATA.army.equips[self.index];

                    var depotData = GLOBALDATA.depot;
                    var commanderData = GLOBALDATA.commanders[GLOBALDATA.army.commander];
                    var teamlist = GLOBALDATA.army.battle.concat(GLOBALDATA.army.companion);
                    var attr = new heroAttr(soldier.p, soldier.l, soldier.q, soldier.m, soldier.w, soldier.sq, soldier.eq, equlist, depotData, commanderData, teamlist);

                    var nextInfo = {};  //现在的信息
                    nextInfo.Atk = attr.getAtk();  //攻击
                    nextInfo.Hp = attr.getHp();   //生命
                    nextInfo.Def = attr.getDef();  //防御
                    //觉醒成功的提示
                    ShowTipsTool.TipsFromText(STRINGCFG[100089].string+(nextInfo.Hp-self.nowInfo.Hp),cc.color.GREEN,30);  //100089  生命增加
                    ShowTipsTool.TipsFromText(STRINGCFG[100090].string+(nextInfo.Atk-self.nowInfo.Atk),cc.color.GREEN,30); //100090  攻击增加
                    ShowTipsTool.TipsFromText(STRINGCFG[100091].string+(nextInfo.Def-self.nowInfo.Def),cc.color.GREEN,30);  //100091 防御增加

                    self.initArmyData(solId);
                }
            }
        });
        cc.eventManager.addListener(this.armyEvolutionEvent, this);

        this.wearEvent = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            eventName: "soldier.wear",
            callback:function(event){
                var resData = event.getUserData();
                if(resData.status == 0){
                    //现在的属性
                    var solId = GLOBALDATA.army.battle[self.index];
                    var soldier = GLOBALDATA.soldiers[solId];
                    var equlist = GLOBALDATA.army.equips[self.index];

                    var depotData = GLOBALDATA.depot;
                    var commanderData = GLOBALDATA.commanders[GLOBALDATA.army.commander];
                    var teamlist = GLOBALDATA.army.battle.concat(GLOBALDATA.army.companion);
                    var attr = new heroAttr(soldier.p, soldier.l, soldier.q, soldier.m, soldier.w, soldier.sq, soldier.eq, equlist, depotData, commanderData, teamlist);
                    var nextInfo = {};  //现在的信息
                    nextInfo.Atk = attr.getAtk();  //攻击
                    nextInfo.Hp = attr.getHp();   //生命
                    nextInfo.Def = attr.getDef();  //防御
                    //觉醒成功的提示
                    ShowTipsTool.TipsFromText(STRINGCFG[100089].string+(nextInfo.Hp-self.nowInfo.Hp),cc.color.GREEN,30);  //100089  生命增加
                    ShowTipsTool.TipsFromText(STRINGCFG[100090].string+(nextInfo.Atk-self.nowInfo.Atk),cc.color.GREEN,30); //100090  攻击增加
                    ShowTipsTool.TipsFromText(STRINGCFG[100091].string+(nextInfo.Def-self.nowInfo.Def),cc.color.GREEN,30);  //100091 防御增加

                    self.initArmyData(solId);
                    self.layoutEqu.setVisible(false);
                }
            }
        });
        cc.eventManager.addListener(this.wearEvent, this);

        this.composeEvent = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            eventName: "soldier.compose",
            callback:function(event){
                var resData = event.getUserData();
                if(resData.status == 0){
                    var solId = GLOBALDATA.army.battle[self.index];
                    self.initArmyData(solId);
                    self.layoutEqu.setVisible(false);
                }
            }
        });
        cc.eventManager.addListener(this.composeEvent, this);

    },
    //初始化ui
    initUI:function () {
        this.customWidget();  //自定义Widget
        this.updateInfo();
    },
    //自定义Widget
    customWidget:function(){
        var wgtArr = [];
        wgtArr.push("B_prompt");   //当前觉醒阶段
        wgtArr.push("B_talent");   //觉醒至几星几阶
        //觉醒的星星
        for(var i=1;i<=6;i++){
            wgtArr.push("Image_starDi"+i);
            wgtArr.push("Image_star"+i);
        }
        wgtArr.push("B_talentDescribe");  //整星描述
        for(var i=1;i<=4;i++){
            wgtArr.push("equipButton_"+i);   //觉醒材料的button
            wgtArr.push("addAttIconBg"+i);  //觉醒材料背景
            wgtArr.push("addAttIcon"+i);   //觉醒材料icon
            wgtArr.push("addBlack"+i);    //蒙灰层
            wgtArr.push("noText"+i);   //无道具文字
            wgtArr.push("addAttImage"+i);  //加号
            wgtArr.push("B_talent"+i);  //可装备或可合成的描述
        }
        wgtArr.push("B_gold");  //金币
        //其它的消耗
        for(var i=1;i<=2;i++){
            wgtArr.push("itemBg_"+i);
            wgtArr.push("itemIcon_"+i);
            wgtArr.push("itemPieces_"+i);
            wgtArr.push("itemNum_"+i);
        }
        wgtArr.push("btnBack");  //返回按钮
        wgtArr.push("btnUpLevel");  //升级标签
        wgtArr.push("btnAdvanced");  //进阶标签
        wgtArr.push("btnAwake");  //觉醒标签
        wgtArr.push("btnBreak");  //突破标签
        wgtArr.push("btnReform");  //改造标签
        wgtArr.push("B_leftBtn");  //向左的按钮
        wgtArr.push("B_rightBtn");  //向右的按钮
        wgtArr.push("armyBreakShow");  //士兵的模型翻页容器
        wgtArr.push("B_upRankBtn");  //觉醒按钮
        wgtArr.push("btnhSee");  //觉醒预览按钮
        wgtArr.push("layoutSee");  //觉醒的预览界面
        wgtArr.push("ListView_See");  //觉醒预览的list
		//觉醒材料的显示层
		wgtArr.push("layoutEqu");
		wgtArr.push("Node_Get");
		wgtArr.push("Node_hecheng");
		wgtArr.push("bagBg");
		wgtArr.push("bagIcon");
		wgtArr.push("bagPieces");
		wgtArr.push("bagNameN");  //名称
		wgtArr.push("bagNum");  //拥有数量
		wgtArr.push("bagState");  //描述
		//属性描述
		for(var i=1;i<=3;i++){
			wgtArr.push("attText"+i);
		}
		wgtArr.push("btnconfirm");  //确定按钮
		wgtArr.push("btnEqu");  //装备按钮
		wgtArr.push("btnHeCheng");   //描述界面的直接合成
		wgtArr.push("btnToGet");  //描述界面的获取
		wgtArr.push("btnToHe");  //描述界面的合成跳转
		//获取和合成顶部的物品信息
		for(var i=1;i<=6;i++){
			wgtArr.push("bagHBg"+i);
			wgtArr.push("bagHIcon"+i);
			wgtArr.push("bagHPieces"+i);
		}
		for(var i=1;i<=5;i++){
			wgtArr.push("bagHR"+i);
		}
		wgtArr.push("Node_compo");  //合成界面
		wgtArr.push("Node_get");  //获取界面
		//获取界面的物品
		wgtArr.push("bagHHBg");
		wgtArr.push("bagHHIcon");
		wgtArr.push("bagHHPieces");
		wgtArr.push("bagHHName");
		wgtArr.push("ListView_HGet");  //获取的滚动条
		//合成后的物品
		wgtArr.push("bagFBg");
		wgtArr.push("bagFIcon");
		wgtArr.push("bagFPieces");
		wgtArr.push("bagName");
		wgtArr.push("he_gold");  //合成消耗的金币
		//合成消耗的其它材料
		for(var i = 1;i<=3;i++){
			wgtArr.push("bagBBg"+i);
			wgtArr.push("bagBIcon"+i);
			wgtArr.push("bagBPieces"+i);
			wgtArr.push("bagBNum"+i);
		}
		wgtArr.push("btnCHe");   //合成界面的合成按钮
		wgtArr.push("btnYhe");   //合成界面的一键合成按钮
        //红点
        for(var i=1;i<=5;i++){
            wgtArr.push("tipsImageG"+i);
        }

        var uiArmyAwake = ccsTool.load(res.uiArmyAwakeLayer,wgtArr);
        //控件的名字赋值给this变量
        for(var key in uiArmyAwake.wgt){
            this[key] = uiArmyAwake.wgt[key];
        }
        uiArmyAwake.node.setPosition(cc.p(0, 105));
        this.addChild(uiArmyAwake.node);

        //返回按钮
        this.btnBack.addTouchEventListener(this.backEvent, this);
        //升级标签
        this.btnUpLevel.addTouchEventListener(this.levelUpEvent, this);
        //进阶标签
        this.btnAdvanced.addTouchEventListener(this.AdvancedEvent, this);
        //觉醒标签
        this.btnAwake.setBrightStyle(ccui.Widget.BRIGHT_STYLE_HIGH_LIGHT);//控件高亮
        this.btnAwake.setTouchEnabled(false);
        //突破标签
        this.btnBreak.addTouchEventListener(this.breakEvent, this);
        //改造标签
        this.btnReform.addTouchEventListener(this.reformEvent, this);
        //向左的按钮
        this.B_leftBtn.addTouchEventListener(this.leftEvent, this);
        //向右的按钮
        this.B_rightBtn.addTouchEventListener(this.rightEvent, this);
        //觉醒按钮
        this.B_upRankBtn.addTouchEventListener(this.upAwakeEvent, this);
        //觉醒预览按钮
        this.btnhSee.addTouchEventListener(this.previewSeeEvent, this);
        //觉醒预览层
        this.layoutSee.addTouchEventListener(this.layoutSeeEvent, this);
        //觉醒材料的按钮
        for(var i=1;i<=4;i++){
            this["equipButton_"+i].addTouchEventListener(this.equipButtonEvent, this);
        }
        //觉醒材料层
        this.layoutEqu.addTouchEventListener(this.HidelayoutEquEvent, this);
        //确定按钮
        this.btnconfirm.addTouchEventListener(this.HidelayoutEquEvent, this);
        //装备按钮
        this.btnEqu.addTouchEventListener(this.wearEquEvent, this);
        //描述界面的直接合成
        this.btnHeCheng.addTouchEventListener(this.upHechengEvent, this);
        //描述界面的获取
        this.btnToGet.addTouchEventListener(this.GetButtonEvent, this);
        //描述界面的合成跳转
        this.btnToHe.addTouchEventListener(this.GotoHeEvent, this);
        //材料1
        this.itemBg_1.addTouchEventListener(this.onTouchEvent, this);
        //材料2
        this.itemBg_2.addTouchEventListener(this.onTouchEvent, this);

        //合成界面的物品点击
        for(var i = 1;i<=6;i++){
            this["bagHBg"+i].addTouchEventListener(this.ClickItemEvent, this);
        }
        for(var i = 1;i<=3;i++){
            this["bagBBg"+i].addTouchEventListener(this.ClickItemEvent, this);
        }
        //合成界面的合成按钮
        this.btnCHe.addTouchEventListener(this.upHechengEvent, this);
        //合成界面的一键合成按钮
        this.btnYhe.addTouchEventListener(this.upHechengEvent, this);


        //士兵的模型翻页容器
        for(var i=0;i<GLOBALDATA.army.battle.length;i++){
            if (GLOBALDATA.army.battle[i]!=0&&GLOBALDATA.army.battle[i]!=-1){
                var armyId = GLOBALDATA.army.battle[i];
                var soldier = GLOBALDATA.soldiers[armyId];
                if(soldier.l >= INTERFACECFG[8].level){  //50级开启觉醒
                    var layout = new ccui.Layout();
                    var Contentsize = this.armyBreakShow.getContentSize();
                    layout.setContentSize(Contentsize);
                    if(soldier.m > 0){ //突破过
                        var qhero = Helper.findHeroById(armyId);
                        armyId = qhero.breakid || armyId;
                    }
                    if(soldier.sq == 10){  //已经进行了终极改造
                        var reformAtt = Helper.findHeroById(armyId);
                        armyId = reformAtt.reform || armyId;
                    }
                    HeroDefault.runAdle(armyId,layout,320,0,1,1);  //英雄的原地动作
                    this.armyBreakShow.addPage(layout);
                    this.armyIndexArr.push(i);
                    this.totalRole++;
                }
            }
        }
        var self = this;
        this.nowIndex = this.getPageIndex(this.index);
        this.armyBreakShow.setCurrentPageIndex(this.nowIndex);
        this.armyBreakShow.setTouchEnabled(false);
        /*this.armyBreakShow.addEventListener(function (sender, type) {
         this.nowIndex = sender.getCurPageIndex().valueOf();
         self.index = this.armyIndexArr[this.nowIndex];
         self.updateInfo();
         }, this);*/
    },
    //士兵数据显示函数
    initArmyData:function(solId){
        var tsolid = solId;
        var soldier = GLOBALDATA.soldiers[solId];
        if(soldier.m > 0){ //突破过
            var qhero = Helper.findHeroById(tsolid);
            tsolid = qhero.breakid || tsolid;
        }
        if(soldier.sq == 10){  //已经进行了终极改造
            var reformAtt = Helper.findHeroById(tsolid);
            tsolid = reformAtt.reform || tsolid;
        }
        var starNum = Math.floor(soldier.w/10);  //星数
        var stageNum = soldier.w%10;  //阶数
        var awakeAtt = Helper.findArmyAwake(soldier.w+1);
        var str = StringFormat(STRINGCFG[100111].string,[starNum,stageNum]);  //100111	$1星$1阶
        this.B_prompt.setString(str);   //当前觉醒阶段
        if(starNum >= 6){
            var str = StringFormat(STRINGCFG[100112].string,[6,0]);  //100112	觉醒至$1星$1阶
            this.B_talent.setString(str);  //觉醒至几星几阶
            var awAtt = Helper.findArmyAwake(60);
            this.B_talentDescribe.setString(awAtt.des);   //整星描述
            this.B_upRankBtn.setVisible(false);     //觉醒按钮
        }else{
            var nextNum = 0;
            var ades = null;
            for(var i = soldier.w+1;i<=60;i++){
                if(ARMYAWAKECFG[i].des != null){
                    nextNum = i;
                    ades = ARMYAWAKECFG[i].des;
                    break;
                }
            }
            var str = StringFormat(STRINGCFG[100112].string,[Math.floor(nextNum/10),nextNum%10]);   //100112	觉醒至$1星$1阶
            this.B_talent.setString(str);  //觉醒至几星几阶
            this.B_talentDescribe.setString(ades);  //整星描述
        }
        //觉醒的星星
        for(var i = 1;i<=starNum;i++){
            this["Image_starDi"+i].setVisible(false);
            this["Image_star"+i].setVisible(true);
        }
        //觉醒材料
        if(starNum >= 6){
            for(var i=1;i<=4;i++){
                this["equipButton_"+i].setVisible(false);  //觉醒材料的button
            }
        }else{
            for(var i=1;i<=4;i++){
                if(soldier.eq[i-1] == 0){
                    this["addAttIconBg"+i].setVisible(false);  //装备的背景
                    this["addBlack"+i].setVisible(true);  //蒙灰层
                    //getAeakeMaterialState 获取觉醒装备的状态  //返回值：1可装备  2 可合成  3没有满足(有获取和合成选项) 4没有满足(只有获取选项)
                    var result = this.getAeakeMaterialState(awakeAtt.equcost[i-1]);
                    if(result == 1) {  //可装备
                        this["noText" + i].setVisible(false);  //无道具文字
                        this["addAttImage" + i].setVisible(true);  //加号
                        this["B_talent" + i].setString(STRINGCFG[100113].string);  //100113	可装备
                        this["B_talent" + i].setColor(cc.color(255,255,0));
                    }else if(result == 2){  //可合成
                        this["noText" + i].setVisible(false);  //无道具文字
                        this["addAttImage" + i].setVisible(true);  //加号
                        this["B_talent" + i].setString(STRINGCFG[100114].string);   //100114	可合成
                        this["B_talent" + i].setColor(cc.color(0,225,0));
                    }else{
                        this["noText" + i].setVisible(true);  //无道具文字
                        this["addAttImage" + i].setVisible(false);  //加号
                    }
                }else{
                    this["addBlack"+i].setVisible(false);  //蒙灰层
                    this["noText"+i].setVisible(false);  //无道具文字
                    this["addAttImage"+i].setVisible(false);  //加号
                }
                var itemCfg = Helper.findItemId(awakeAtt.equcost[i-1]);
                Helper.LoadFrameImageWithPlist(this["addAttIconBg"+i],itemCfg.quality);  //品质边框
                Helper.LoadIcoImageWithPlist(this["addAttIcon"+i],itemCfg);  //icon
            }
        }

        //其它材料
        if(starNum >= 6){
            this.B_gold.setString("MAX");  //金币
            //其它
            this.itemBg_1.setVisible(false);
            this.itemBg_2.setVisible(false);
        }else{
            //金币
            this.B_gold.setString(Helper.formatNum(awakeAtt.otcost[0][1]));
            if(awakeAtt.otcost[0][1] > GLOBALDATA.base.money){  //进阶的钱不够
                this.B_gold.setColor(cc.color(255,0,0));
            }else{
                this.B_gold.setColor(cc.color(255,255,255));
            }
            //其它
            var count = 1;
            for(var i=1;i<=2;i++){
                if(awakeAtt.otcost[i] != null){
                    var itemid = awakeAtt.otcost[i][0];
                    if(itemid == -1){  //本体卡
                        itemid = solId;
                    }
                    var itemCon = Helper.findItemId(itemid);
                    Helper.LoadIconFrameAndAddClick(this["itemIcon_"+i],this["itemBg_"+i],this["itemPieces_"+i],itemCon);  //物品
                    var haveNum = Helper.getItemNum(itemid);
                    this["itemNum_"+i].setString(haveNum+"/"+awakeAtt.otcost[i][1]);  //数量
                    if(awakeAtt.otcost[i][1] > haveNum){
                        this["itemNum_"+i].setColor(cc.color(255,0,0));
                    }else{
                        this["itemNum_"+i].setColor(cc.color(255,255,255));
                    }
                    this["itemBg_"+i].setTag(itemid);
                    count++;
                }
            }
            for(var i=count;i<=2;i++){
                this["itemBg_"+i].setVisible(false);
            }
        }
        //现在的属性
        var equlist = [];
        for (var idx = 0; idx < GLOBALDATA.army.battle.length; idx++)
        {
            if (solId == GLOBALDATA.army.battle[idx])
            {
                equlist = GLOBALDATA.army.equips[idx];
                break;
            }
        }
        var depotData = GLOBALDATA.depot;
        var commanderData = GLOBALDATA.commanders[GLOBALDATA.army.commander];
        var teamlist = GLOBALDATA.army.battle.concat(GLOBALDATA.army.companion);
        var attr = new heroAttr(soldier.p, soldier.l, soldier.q, soldier.m, soldier.w, soldier.sq, soldier.eq, equlist, depotData, commanderData, teamlist);

        this.nowInfo = {};  //现在的信息
        this.nowInfo.Atk = attr.getAtk();  //攻击
        this.nowInfo.Hp = attr.getHp();   //生命
        this.nowInfo.Def = attr.getDef();  //防御
    },
    //获取觉醒装备的状态  //返回值：1可装备  2 可合成  3没有满足(有获取和合成选项) 4没有满足(只有获取选项)
    getAeakeMaterialState:function(id){
        var itemCfg = Helper.findItemId(id);
        if(itemCfg.quality == 1){  //品质为1的
            if(Helper.getItemNum(id)>=1){  //有装备
                return 1;
            }else{
                return 4;
            }
        }else{
            if(Helper.getItemNum(id)>=1){  //有装备
                return 1;
            }else{
                //是否满足合成的装备
                var comineAtt = COMBINECFG[id];
                if(comineAtt != null && comineAtt.ctype == 1){
                    var isAll = true;  //所有的都满足
                    for(var key in comineAtt.material){
                        if(Helper.getItemNum(comineAtt.material[key][0])<comineAtt.material[key][1]){
                            isAll = false;
                            break;
                        }
                    }
                    if(isAll){  //可合成
                        return 2;
                    }else{
                        return 3;
                    }
                }
            }
        }
        return 4;
    },
    //觉醒预览按钮
    previewSeeEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type){
            this.showPreviewSee();
        }
    },
    //显示觉醒预览层
    showPreviewSee:function(){
        this.layoutSee.setVisible(true);  //觉醒的预览界面
        this.ListView_See.removeAllChildren(true);  //觉醒预览的list
        var ItemArray = [];
        var solId = GLOBALDATA.army.battle[this.index];
        var soldier = GLOBALDATA.soldiers[solId];
        for(var i = soldier.w+1;i<=Math.floor(soldier.w/10)*10+9;i++){
            var temp = {};
            temp.w = i;
            temp.equcost = Helper.findArmyAwake(i).equcost;
            ItemArray.push(temp);
        }
        //处理list
        for (var i=0;i<ItemArray.length;i++){
            var wgtArr = [];
            wgtArr.push("awakeItem");   //最大的背景
            wgtArr.push("textTipsTitle");   //几阶几星
            for(var j=1;j<=4;j++){
                wgtArr.push("bagQBg"+j);
                wgtArr.push("bagQIcon"+j);
                wgtArr.push("bagQPieces"+j);
                wgtArr.push("bagQNum"+j);
                wgtArr.push("bagBlack"+j);
            }
            var AwakeItem = ccsTool.load(res.uiArmyAwakeItem,wgtArr);
            var wgt = {};
            //控件的名字赋值给wgt变量
            for(var key in AwakeItem.wgt){
                wgt[key] = AwakeItem.wgt[key];
            }
			wgt.awakeItem.removeFromParent(false);
            this.ListView_See.pushBackCustomItem(wgt.awakeItem);
            var str = StringFormat(STRINGCFG[100111].string,[Math.floor(ItemArray[i].w/10),ItemArray[i].w%10]);  //100111	$1星$1阶
            wgt.textTipsTitle.setString(str);
            for(var j = 1;j<=4;j++){
                var itemId = ItemArray[i].equcost[j-1];
                if(itemId != null){
                    var ItemCfg = Helper.findItemId(itemId);
                    Helper.LoadIconFrameAndAddClick(wgt["bagQIcon"+j],wgt["bagQBg"+j],wgt["bagQPieces"+j],ItemCfg);
                    var num = Helper.getItemNum(itemId);
                    if(num > 0){
                        wgt["bagBlack"+j].setVisible(false);
                    }
                    wgt["bagQNum"+j].setString(ItemCfg.itemname+":"+num);
                    wgt["bagQNum"+j].ignoreContentAdaptWithSize(true);
                }else{
                    wgt["bagQBg"+j].setVisible(false);
                }
            }
        }
    },
    //觉醒预览层的事件
    layoutSeeEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type){
            this.layoutSee.setVisible(false);  //觉醒的预览界面
        }
    },
    //觉醒材料的按钮的事件
    equipButtonEvent:function(sender, type) {
        if(ccui.Widget.TOUCH_ENDED == type){
            switch (sender.name) {
                case 'equipButton_1'://觉醒材料的按钮
                    this.equipButtonDeal(1);
                    break;
                case 'equipButton_2'://觉醒材料的按钮
                    this.equipButtonDeal(2);
                    break;
                case 'equipButton_3'://觉醒材料的按钮
                    this.equipButtonDeal(3);
                    break;
                case 'equipButton_4'://觉醒材料的按钮
                    this.equipButtonDeal(4);
                    break;
                default:
                    break;
            }
        }
    },
    //觉醒材料的按钮
    equipButtonDeal:function(id){
        this.equPosId = id;
        this.getArray = [];
        var solId = GLOBALDATA.army.battle[this.index];
        var soldier = GLOBALDATA.soldiers[solId];
        var awakeAtt = Helper.findArmyAwake(soldier.w+1);
        this.showEquip(awakeAtt.equcost[id-1]);
        this.nowGetId = awakeAtt.equcost[id-1];
        this.btnconfirm.setVisible(false);  //确定按钮
        this.btnEqu.setVisible(false);  //装备按钮
        this.btnHeCheng.setVisible(false);  //描述界面的直接合成
        this.btnToGet.setVisible(false);  //描述界面的获取
        this.btnToHe.setVisible(false);  //描述界面的合成跳转
        //确定按钮的位置
        if(!this.PosX1){
            this.PosX1 = this.btnconfirm.getPositionX();
        }
        //获取按钮的位置
        if(!this.PosX2){
            this.PosX2 = this.btnToGet.getPositionX();
        }
        //合成跳转按钮的位置
        if(!this.PosX3){
            this.PosX3 = this.btnToHe.getPositionX();
        }
        if(soldier.eq[id-1] == 0){
            //getAeakeMaterialState 获取觉醒装备的状态  //返回值：1可装备  2 可合成  3没有满足(有获取和合成选项) 4没有满足(只有获取选项)
            var result = this.getAeakeMaterialState(awakeAtt.equcost[id-1]);
            if(result == 1){  //可装备
                this.btnEqu.setVisible(true);  //装备按钮
            }else if(result == 2){  //可合成
                this.btnHeCheng.setVisible(true);  //描述界面的直接合成
            }else if(result == 3){  //没有满足(有获取和合成选项)
                this.btnToGet.setVisible(true);  //描述界面的获取
                this.btnToHe.setVisible(true);  //描述界面的合成跳转
                this.btnToGet.setPositionX(this.PosX2);
                this.btnToHe.setPositionX(this.PosX3);
            }else if(result == 4){  //没有满足(只有获取选项)
                this.btnToGet.setVisible(true);  //描述界面的获取
                this.btnToGet.setPositionX(this.PosX1);
            }
        }else{
            this.btnconfirm.setVisible(true);  //确定按钮
        }
    },
    //显示觉醒材料的信息
    showEquip:function(id){
        this.layoutEqu.setVisible(true);  //觉醒材料的显示层
        this.Node_Get.setVisible(true);
        this.Node_hecheng.setVisible(false);
        var itemCfg = Helper.findItemId(id);
        Helper.LoadIconFrameAndAddClick(this.bagIcon,this.bagBg,this.bagPieces,itemCfg);  //物品
        this.bagNameN.setString(itemCfg.itemname);  //名称
        Helper.setNamecolorByQuality(this.bagNameN,itemCfg.quality);
        var num = Helper.getItemNum(id);
        this.bagNum.setString(num);  //拥有数量
        this.bagState.setString(itemCfg.describe);  //描述
        var attribute = AWAKEMATERIALCFG[id].attribute;
        var attr = [];
        for (var i=0;i<attribute.length;i++){
            var baseItem = attribute[i];
            var item ={};
            item.name = ATTRIBUTEIDCFG[baseItem[0]].describe;
            var val = null;
            if(baseItem[1] == 2){
                val = (baseItem[2]/100)+"%";
            }else{
                val = baseItem[2];
            }
            item.value = val;
            attr.push(item);
        }
        for(var i = 1;i<=3;i++){
            if(attr[i-1] != null){
                this["attText"+i].setVisible(true);
                var str = attr[i-1].name + "+" + attr[i-1].value;
                this["attText"+i].setString(str);
            }else{
                this["attText"+i].setVisible(false);
            }
        }
    },
    //隐藏觉醒材料
    HidelayoutEquEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type){
            this.layoutEqu.setVisible(false);  //觉醒材料界面
        }
    },
    //觉醒合成界面物品的点击事件
    ClickItemEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type){
            this.nowGetId = sender.getTag();
            this.showGotoHe(this.nowGetId);
        }
    },
    //合成跳转
    GotoHeEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type){
            this.showGotoHe(this.nowGetId);
        }
    },
    //合成界面
    showGotoHe:function(id){
        this.layoutEqu.setVisible(true);  //觉醒材料界面
        this.Node_Get.setVisible(false);
        this.Node_hecheng.setVisible(true);
        var index = this.getArray.indexOf(id);
        if(index >=0 ){
            this.getArray.splice(index+1,6);
        }else{
            this.getArray.push(id);
        }
        //处理上面的物品
        this.dealUpItem();
        var itemCfg = Helper.findItemId(id);
        if(itemCfg.quality > 1){
            this.Node_compo.setVisible(true);  //合成界面
            this.Node_get.setVisible(false);  //获取界面
            var itemCfg = Helper.findItemId(id);
            Helper.LoadIconFrameAndAddClick(this.bagFIcon,this.bagFBg,this.bagFPieces,itemCfg);  //物品
            this.bagName.setString(itemCfg.itemname);  //名称
            Helper.setNamecolorByQuality(this.bagName,itemCfg.quality);
            var material = COMBINECFG[id].material;
            //合成消耗的金币
            this.he_gold.setString(Helper.formatNum(material[0][1]));
            //判断金币是否够
            if(material[0][1]>GLOBALDATA.base.money){
                this.he_gold.setColor(cc.color(255,0,0));
            }else{
                this.he_gold.setColor(cc.color(255,255,255));
            }
            //合成需要的材料
            var count = 1;
            for(var i=1;i<=3;i++){
                if(material[i] != null){
                    var itemCon = Helper.findItemId(material[i][0]);
                    Helper.LoadIconFrameAndAddClick(this["bagBIcon"+i],this["bagBBg"+i],this["bagBPieces"+i],itemCon);  //物品
                    this["bagBBg"+i].setTag(material[i][0]);
                    var haveNum = Helper.getItemNum(material[i][0]);
                    this["bagBNum"+i].setString(haveNum+"/"+material[i][1]);  //数量
                    if(material[i][1] > haveNum){
                        this["bagBNum"+i].setColor(cc.color(255,0,0));
                    }else{
                        this["bagBNum"+i].setColor(cc.color(255,255,255));
                    }
                    count++;
                }
            }
            for(var i=count;i<=3;i++){
                this["bagBBg"+i].setVisible(false);
            }
        }else{
            this.showGetNode(id);
        }
    },
    //处理合成和获取的上面物品框
    dealUpItem:function(){
        var count = this.getArray.length;
        for(var i=1;i<count;i++){
            this["bagHR"+i].setVisible(true);
        }
        for(var i=count;i<=5;i++){
            this["bagHR"+i].setVisible(false);
        }
        for(var i=1;i<=count;i++){
            var itemCfg = Helper.findItemId(this.getArray[i-1]);
            Helper.LoadIconFrameAndAddClick(this["bagHIcon"+i],this["bagHBg"+i],this["bagHPieces"+i],itemCfg);  //物品
            this["bagHBg"+i].setTag(this.getArray[i-1]);
            if(i != count){
                this["bagHBg"+i].setTouchEnabled(true);
            }else{
                this["bagHBg"+i].setTouchEnabled(false);
            }
        }
        for(var i=count+1;i<=6;i++){
            this["bagHBg"+i].setVisible(false);
        }
    },
    //描述界面的获取按钮
    GetButtonEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type){
            this.getArray.push(this.nowGetId);
            //处理上面的物品
            this.dealUpItem();
            //显示获取界面
            this.showGetNode(this.nowGetId);
        }
    },
    //显示获取界面
    showGetNode:function(id){
        this.layoutEqu.setVisible(true);  //觉醒材料界面
        this.Node_Get.setVisible(false);
        this.Node_hecheng.setVisible(true);
        this.Node_compo.setVisible(false);  //合成界面
        this.Node_get.setVisible(true);  //获取界面
        var itemCfg = Helper.findItemId(id);
        Helper.LoadIconFrameAndAddClick(this.bagHHIcon,this.bagHHBg,this.bagHHPieces,itemCfg);  //物品
        this.bagHHName.setString(itemCfg.itemname);  //名称
        Helper.setNamecolorByQuality(this.bagHHName,itemCfg.quality);
        //跳转的list
        this.ListView_HGet.removeAllChildren(true);
        for(var key in itemCfg.jump){
            var Info = itemCfg.jump[key];
            var jumpInfo = JUMPINFOCFG[Info[0]];
            if(jumpInfo != null){
                var AwakeItem = ccsTool.load(res.uiArmyAwakeItem1,["item","bagItemName","bagItemDate","btnItemGet"]);
                var wgt = {};
                //控件的名字赋值给wgt变量
                for(var k in AwakeItem.wgt){
                    wgt[k] = AwakeItem.wgt[k];
                }
				wgt.item.removeFromParent(false);
                this.ListView_HGet.pushBackCustomItem(wgt.item);
                //去获取按钮
                wgt.btnItemGet.addTouchEventListener(this.jumpGoToEvent, this);
                //根据不同的情况进行区分
                if(jumpInfo.id == 1){  //觉醒商店
                    wgt.bagItemName.setString(jumpInfo.name);  //名字
                    wgt.bagItemDate.setVisible(false);  //进度
                    var temp = {};
                    temp.id = Info[0];
                    wgt.btnItemGet.setUserData(temp);
                }else if(jumpInfo.id == 2 && Info[1] && Info[2]){  //详细的精英军事活动
                    var jyInfo = COUNTERSTAGECFG[Info[1]];
                    if(jyInfo != null){
                        var di = 1;
                        var isHave = false;
                        for(var key in jyInfo.stage){
                            if(jyInfo.stage[key] == Info[2]){
                                isHave = true;
                                break;
                            }
                            di++;
                        }
                        if(isHave){
                            var strText = StringFormat(jumpInfo.name,jyInfo.lx+"-"+di);
                            wgt.bagItemName.setString(strText);  //名字
                            var sy = GLOBALDATA.replica.hlist[jyInfo.lx-1].ns[di-1];  //剩余次数
                            wgt.bagItemDate.setString(sy+"/5");  //进度
                            //判断上一关是否通关
                            var isPass = true;
                            var lastPassInfo = GLOBALDATA.replica.hlist[jyInfo.lx-2];  //上一关的信息
                            if(lastPassInfo != null){
                                for(var key in lastPassInfo.ps){
                                    if(lastPassInfo.ps[key] == 0){
                                        isPass = false;
                                        break;
                                    }
                                }
                            }
                            var temp = {};
                            temp.id = Info[0];
                            temp.fPass = Info[1];
                            temp.pos = di;
                            wgt.btnItemGet.setUserData(temp);
                            if(!isPass){  //前一关 没有通关
                                //去获取按钮，置灰禁用
                                wgt.btnItemGet.setBright(false);
                                wgt.btnItemGet.setTouchEnabled(false);
                            }
                        }
                    }
                }
            }
        }
    },
    //去获取的按钮事件
    jumpGoToEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type){
            var data = sender.getUserData();
            if(data.id == 1){ //觉醒商店
                var _ShopLayer = new ShopLayer();
                this.addChild(_ShopLayer,2);
            }else if(data.id == 2){  //详细的精英军事活动
                var _ActivityLayer = new ActivityLayer(1,data.fPass);
                this.getParent().myLayer.addChild(_ActivityLayer,2);
                //增加指示位置的特效
                var act = ccs.load(res.uiJumpFindLayer);
                act.action.play("action1", true);
                act.node.runAction(act.action);
                act.node.setPosition(this.activityPos[data.pos-1][0],this.activityPos[data.pos-1][1]);
                var showFind = function () {
                    _ActivityLayer.addChild(act.node,20);
                };
                var hideFind = function () {
                    act.node.removeFromParent(true);
                };
                var seq = cc.sequence(cc.callFunc(showFind,this),cc.delayTime(2),cc.callFunc(hideFind,this));
                this.runAction(seq);
            }
        }
    },
    //返回按钮事件
    backEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type){
            var evn = new cc.EventCustom('updateUI');
            evn.setUserData(this.index);
            cc.eventManager.dispatchEvent(evn);
            this.removeFromParent(true);
        }
    },
    //升级按钮事件
    levelUpEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type){
            var levelUpLayer = new armyLevelUpLayer(this.index);
            this.getParent().addChild(levelUpLayer,2);
            this.removeFromParent(true);
        }
    },
    //进阶标签的事件
    AdvancedEvent:function(sender,type){
        if(ccui.Widget.TOUCH_ENDED==type){
            var breakLayer = new armyEvolutionLayer(this.index);
            this.getParent().addChild(breakLayer,2);
            this.removeFromParent(true);
        }
    },
    //突破标签的事件
    breakEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type){
            var EvolutionLayer = new armyBreakLayer(this.index);
            this.getParent().addChild(EvolutionLayer,2);
            this.removeFromParent(true);
        }
    },
    //改造标签的事件
    reformEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type){
            var ReformLayer = new armyReformLayer(this.index);
            this.getParent().addChild(ReformLayer,2);
            this.removeFromParent(true);
        }
    },
    //左切换按钮事件
    leftEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type){
            this.nowIndex--;
            this.armyBreakShow.setCurrentPageIndex(this.nowIndex);
            this.updateInfo();
        }
    },
    //右切换按钮事件
    rightEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type){
            this.nowIndex++;
            this.armyBreakShow.setCurrentPageIndex(this.nowIndex);
            this.updateInfo();
        }
    },

    upAwakeEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type){
            //	首先判断觉醒是否已经满级，如果已满级，则在点击觉醒时提示：当前已满级
            //觉醒的装备是否不足
            //	觉醒需要一定的道具，兵种及金币，如道具不足，则弹出提示：对应的道具名称不足
            //	如果兵种不足，则弹出提示：对应的兵种不足
            //	如金币不足，则弹出提示：金币不足
            //	如上面皆足够则突破成功,并更新数据
            var solId = GLOBALDATA.army.battle[this.index];
            var soldier = GLOBALDATA.soldiers[solId];
            var armyAwakeLev = soldier.w;
            var armyAwakeAtt = Helper.findArmyAwake(armyAwakeLev+1);
            if(armyAwakeLev >= 60){  //觉醒已经满级
                ShowTipsTool.ErrorTipsFromStringById(100109);   //100109	士兵觉醒已经达到最高阶段
                return;
            }
            //判断觉醒材料是否都穿戴
            for(var key in soldier.eq){
                if(soldier.eq[key] == 0){
                    ShowTipsTool.ErrorTipsFromStringById(100110);   //100110	觉醒材料不足
                    return;
                }
            }
            //判断需要的材料是否足够
            for(var key in armyAwakeAtt.otcost){
                var itemNeed = armyAwakeAtt.otcost[key];
                var itemId = itemNeed[0];
                if(itemId == -1){  //本体卡
                    itemId = solId;
                }
                if(itemNeed[1] > Helper.getItemNum(itemId)){
                    var itemInfo = Helper.findItemId(itemId);
                    if(itemId == 1){  //金币
                        //跳转到金币兑换界面
                        var _buyGoldLayer = new buyGoldLayer();
                        this.addChild(_buyGoldLayer,3);
                    }else{
                        ShowTipsTool.TipsFromText(itemInfo.itemname+STRINGCFG[100011].string,cc.color.RED,30);   //显示tips  //100011 不足
                    }
                    return;
                }
            }
            armyModel.awake(solId);
        }
    },
    //穿戴装备的按钮
    wearEquEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type){
            var solId = GLOBALDATA.army.battle[this.index];
            armyModel.wear(solId,this.equPosId);
        }
    },
    //觉醒装备的合成
    upHechengEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type){
            var num = 0;
            var comineAtt = COMBINECFG[this.nowGetId];
            if(comineAtt != null && comineAtt.ctype == 1){
                for(var key in comineAtt.material){
                    var itemNeed = comineAtt.material[key];
                    var itemId = itemNeed[0];
                    var have = Helper.getItemNum(itemId);
                    if(itemNeed[1] > have){
                        var itemInfo = Helper.findItemId(itemId);
                        ShowTipsTool.TipsFromText(itemInfo.itemname+STRINGCFG[100011].string,cc.color.RED,30);   //显示tips  //100011 不足
                        return;
                    }else{
                        var he = Math.floor(have/itemNeed[1]);
                        if(num == 0){
                            num = he;
                        }
                        if(he < num){
                            num = he;
                        }
                    }
                }
            }
            switch (sender.name) {
                case 'btnHeCheng'://描述界面的直接合成
                    armyModel.compose(this.nowGetId,1);
                    break;
                case 'btnCHe'://合成界面的合成按钮
                    armyModel.compose(this.nowGetId,1);
                    break;
                case 'btnYhe'://合成界面的一键合成按钮
                    armyModel.compose(this.nowGetId,num);
                    break;
                default:
                    break;
            }

        }
    },

    onTouchEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type){
            switch (sender.name) {
                case "itemBg_1":
                case "itemBg_2":
                    var itemid = sender.getTag();
                    var itemJumpLayer = new ItemJumpLayer(itemid);
                    this.addChild(itemJumpLayer,2);
                    break;
            }
        }
    },

    updateInfo:function () {
        //控制左右按钮显示隐藏以及士兵数据的更新
        if(this.nowIndex==0){
            this.B_leftBtn.setVisible(false);
        }else {
            this.B_leftBtn.setVisible(true);
        }
        if(this.nowIndex==this.totalRole-1){
            this.B_rightBtn.setVisible(false);
        }else {
            this.B_rightBtn.setVisible(true);
        }
        this.index = this.armyIndexArr[this.nowIndex];
        //处理五个标签按钮的状态
        this.DealButtonState();
        //士兵数据显示函数
        var solId = GLOBALDATA.army.battle[this.index];
        this.initArmyData(solId);
        //处理红点
        this.dealRedPoint();
    },
    //处理五个标签按钮的状态
    DealButtonState:function(){
        var ButtonArray = [];
        ButtonArray.push(this.btnUpLevel);
        ButtonArray.push(this.btnAdvanced);
        ButtonArray.push(this.btnAwake);
        ButtonArray.push(this.btnBreak);
        ButtonArray.push(this.btnReform);
        var solId = GLOBALDATA.army.battle[this.index];
        var soldier = GLOBALDATA.soldiers[solId];
        //是否显示觉醒按钮
        if(soldier.l >= INTERFACECFG[8].level){  //50级开启觉醒
            this.btnAwake.setVisible(true);
        }else{
            this.btnAwake.setVisible(false);
        }
        //是否显示突破按钮
        if(soldier.m > 0){ //突破过
            var qhero = Helper.findHeroById(solId);
            solId = qhero.breakid || solId;
        }
        var hero = Helper.findHeroById(solId);
        if(hero.breakid == null || hero.breakid == 0){
            this.btnBreak.setVisible(false);
        }else{
            this.btnBreak.setVisible(true);
        }
        //是否显示改造
        if(hero.reform != 0 && soldier.l >= INTERFACECFG[9].level && soldier.sq < 10){  //55级开启改造
            this.btnReform.setVisible(true);
        }else{
            this.btnReform.setVisible(false);
        }
        var posx = this.btnUpLevel.getPositionX();
        var posy = this.btnUpLevel.getPositionY();
        var width = 0;
        for(var i = 0;i<ButtonArray.length;i++){
            if(ButtonArray[i].isVisible()){
                ButtonArray[i].setPosition(posx+width,posy);
                width = width + 120;
            }
        }
    },
    //获取页面的索引
    getPageIndex:function(id){
        for(var i = 0;i<this.armyIndexArr.length;i++){
            if(this.armyIndexArr[i] == id){
                return i;
            }
        }
        return 0;
    },
    //处理红点
    dealRedPoint:function(data){
        var redInfo = armyRedPoint.armyOperationRedPoint(this.index,data);
        if(redInfo != null){
            for(var i=1;i<=5;i++){
                this["tipsImageG"+i].setVisible(false);
            }
            for(var i=0;i<redInfo.length;i++) {
                this["tipsImageG" + redInfo[i]].setVisible(true);
            }
        }
    },
    onExit:function () {
        this._super();
        cc.eventManager.removeListener(this.armyEvolutionEvent);
        cc.eventManager.removeListener(this.wearEvent);
        cc.eventManager.removeListener(this.composeEvent);
        cc.log('armyAwakeLayer onExit');
    }
});