
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 /**
 */

var armyLayer = baseLayer.extend({
    LayerName:"armyLayer",
    armyLayer:null,//部队层
    ArmyIndex:0,//部队士兵头像索引值
    //solIden:null,
    armyHigh:null,
    SolId:null,//士兵ID
    count:0,

    ctor:function () {
        this._super();
        // 添加头像精灵合图
        cc.spriteFrameCache.addSpriteFrames(res.heroicon_plist);
        this.levelArray = [1, 3, 4, 9, 14, 40, 50, 60];//存储开放等级的数组
    },

    onEnter:function () {
        this._super();
    },
    //初始化ui
    initUI:function () {
        this.customWidget(); //自定义Widget
        this.initArmyLayer();//初始化部队弹框界面
        this.initCustomEvent();
        this.dealRedPoint();
    },
    //自定义Widget
    customWidget:function () {
        var wgtArr = [];
        wgtArr.push("armyHeadList");   //士兵头像的滚动条
        wgtArr.push("armyHead");   //士兵头像
        //缘分
        for(var i=0;i<5;i++){
            wgtArr.push("luckText_"+i);
        }
        wgtArr.push("levelText");   //士兵等级
        wgtArr.push("nameText");   //士兵姓名
        wgtArr.push("Panel_Show");   //士兵动画
        wgtArr.push("lifeAtbValue");   //士兵生命
        wgtArr.push("attackAtbValue");   //士兵攻击
        wgtArr.push("defenseAtbValue");   //士兵防御
        //装备配饰
        for(var i=1;i<=6;i++){
            wgtArr.push("equipButton_"+i);
            wgtArr.push("addAttImage"+i);
        }
        wgtArr.push("upLeftChangeButton");   //向左的按钮
        wgtArr.push("upRightChangeButton");   //向右的按钮
        wgtArr.push("embattleButton");   //布阵的按钮
        wgtArr.push("changeButton");   //更换的按钮
        wgtArr.push("upGradeButton");   //升级的按钮
        wgtArr.push("advancedButton");   //进阶的按钮
        wgtArr.push("awakeButton");   //觉醒按钮
        wgtArr.push("breakButton");   //突破按钮
        wgtArr.push("reformButton");   //改造按钮
        wgtArr.push("strenButton");   //一键强化按钮
        wgtArr.push("refineButton");   //一键精炼按钮
        wgtArr.push("equipButton");   //一键装备按钮
        wgtArr.push("strenMasterButton");   //强化大师按钮
        wgtArr.push("emFriendButton");//协同作战
        //红点
        for(var i=1;i<=3;i++){
            wgtArr.push("tipsImage"+i);
        }
        for(var i=1;i<=6;i++){
            wgtArr.push("tipsImageH"+i);
            wgtArr.push("tipsImageE"+i);
        }


        var uiArmyLayer = ccsTool.load(res.uiArmyChangeLayer,wgtArr);
        //控件的名字赋值给this变量
        for(var key in uiArmyLayer.wgt){
            this[key] = uiArmyLayer.wgt[key];
        }
        uiArmyLayer.node.setPosition(cc.p(0, 105));
        this.addChild(uiArmyLayer.node,1);
        //设置装备配饰红点的层级
        for(var i=1;i<=6;i++){
            this["tipsImageE"+i].setLocalZOrder(3);
        }

        //士兵精灵图片点击事件的设置
        var self = this;
        this.Panel_Show.addTouchEventListener(function (sender, type){
            cc.log(type);
            switch (type){
                case ccui.Widget.TOUCH_ENDED:
                    var solId = GLOBALDATA.army.battle[self.ArmyIndex];
                    var armyAttributeLayer = new armyAttriLayer(solId,1);
                    self.myLayer.addChild(armyAttributeLayer, 30);
                    break;
                default:
                    break;
            }
        });
    },
    //自定义事件
    initCustomEvent:function () {
        var self = this;
        this.stagePassEvn = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            eventName: "army.gobattle",
            callback:function(event){
                var resData = event.getUserData();
                if(resData.status == 0) {//成功
                    self.ArmyIndex = self.uiarmyChoiseLayer.pos;
                    var solId = GLOBALDATA.army.battle[self.ArmyIndex];

                    //上阵之后或者更换之后的提示
                    self.showChangeTips(solId,self.isChange);

                    //更换信息
                    self.solAttributeInit(solId);
                    //更换头像
                    var item = self.armyHeadList.getItem(self.ArmyIndex);
                    var obj = ccsTool.seekWidget(item,["armyHeadBg","armyHeadIcon","harmyHeadBg","addArmy","lock"]);
                    self.solHeadImaInit(obj.wgt.armyHeadBg,obj.wgt.armyHeadIcon,solId);//头像的初始化函数
                    item.removeChild(obj.wgt.addArmy);
                    item.removeChild(obj.wgt.lock);

                    //装备的更新
                    var evn = new cc.EventCustom('updateUI');
                    evn.setUserData(self.ArmyIndex);
                    cc.eventManager.dispatchEvent(evn);

                    var harmyHeadBg = obj.wgt.harmyHeadBg;
                    if(harmyHeadBg!==self.armyHigh) {
                        harmyHeadBg.setVisible(true);
                        self.armyHigh.setVisible(false);
                        self.armyHigh = harmyHeadBg;
                    }
                    self.uiarmyChoiseLayer.removeFromParent(true);
                }
            }
        });
        cc.eventManager.addListener(this.stagePassEvn, this);

        //装备更新函数
        this.evnUpdateUI = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            eventName: "updateUI",
            callback:function(event){
                var index = event.getUserData();
                if(index == null){
                    index = self.ArmyIndex;
                }
                self.ArmyIndex = index;
                var solId = GLOBALDATA.army.battle[index];
                var item = self.armyHeadList.getItem(index);
                //更换头像
                var obj = ccsTool.seekWidget(item,["armyHeadBg","armyHeadIcon","harmyHeadBg","addArmy","lock"]);
                self.solHeadImaInit(obj.wgt.armyHeadBg,obj.wgt.armyHeadIcon,solId);//头像的初始化函数
                //选中的士兵
                //var harmyHeadBg = item.getChildByName("harmyHeadBg");
                if(obj.wgt.harmyHeadBg!==self.armyHigh) {
                    obj.wgt.harmyHeadBg.setVisible(true);
                    self.armyHigh.setVisible(false);
                    self.armyHigh = obj.wgt.harmyHeadBg;
                }
                //更换信息
                self.solAttributeInit(solId);
                self.equipEliminate();
                self.armyEquipInit(self.ArmyIndex);
            }
        });
        cc.eventManager.addListener(this.evnUpdateUI, this);

        //士兵装备更新触发事件
        this.equipDressDataUpdate = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            eventName: "army.wear",
            callback:function(event){
                var resData = event.getUserData();
                if(resData.status == 0){
                    var solId = GLOBALDATA.army.battle[self.ArmyIndex];
                    //装备之后的提示
                    self.showChangeTips(solId,true);
                    self.equipEliminate();
                    self.armyEquipInit(self.ArmyIndex);//this.ArmyIndex这个用的不是accChangeLayer层传回来的pos值，有一定的不稳定性
                    //更换信息
                    self.solAttributeInit(GLOBALDATA.army.battle[self.ArmyIndex]);
                }
            }
        });
        cc.eventManager.addListener(this.equipDressDataUpdate, this);

        //士兵卸下装备数据触发事件
        this.unsnatchDressEvent = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            eventName: "army.take_off",
            callback:function(event){
                var resData = event.getUserData();
                if(resData.status == 0){
                    self.equipEliminate();
                    self.armyEquipInit(self.ArmyIndex);
                    //更换信息
                    self.solAttributeInit(GLOBALDATA.army.battle[self.ArmyIndex]);
                }
            }
        });
        cc.eventManager.addListener(this.unsnatchDressEvent, this);

        //一键装备的触发事件
        this.allEquipment = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            eventName: "army.wearall",
            callback:function(event){
                var resData = event.getUserData();
                if(resData.status == 0){
                    var solId = GLOBALDATA.army.battle[self.ArmyIndex];

                    var item = self.armyHeadList.getItem(self.ArmyIndex);

                    //一键装备之后的提示
                    self.showChangeTips(solId,true);

                    //更新装备数据
                    self.equipEliminate();
                    self.armyEquipInit(self.ArmyIndex);
                    //更换信息
                    self.solAttributeInit(GLOBALDATA.army.battle[self.ArmyIndex]);
                }
            }
        });
        cc.eventManager.addListener(this.allEquipment, this);

        //一键强化的触发事件
        this.allStrengthen = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            eventName: "depot.strengthenall",
            callback:function(event){
                var resData = event.getUserData();
                if(resData.status == 0){
                    var solId = GLOBALDATA.army.battle[self.ArmyIndex];

                    var item = self.armyHeadList.getItem(self.ArmyIndex);

                    //一键强化之后的提示
                    self.showChangeTips(solId,true);

                    //更新装备数据
                    self.equipEliminate();
                    self.armyEquipInit(self.ArmyIndex);
                    //更换信息
                    self.solAttributeInit(GLOBALDATA.army.battle[self.ArmyIndex]);
                }
            }
        });
        cc.eventManager.addListener(this.allStrengthen, this);

        //一键精炼的触发事件
        this.allRefine = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            eventName: "depot.refineall",
            callback:function(event){
                var resData = event.getUserData();
                if(resData.status == 0){
                    var solId = GLOBALDATA.army.battle[self.ArmyIndex];

                    //一键强化之后的提示
                    self.showChangeTips(solId,true);

                    //更新装备数据
                    self.equipEliminate();
                    self.armyEquipInit(self.ArmyIndex);
                    //更换信息
                    self.solAttributeInit(GLOBALDATA.army.battle[self.ArmyIndex]);
                }
            }
        });
        cc.eventManager.addListener(this.allRefine, this);
    },
    //弹出的提示框
    showChangeTips:function(solId,isChange){
        var nextInfo = {};  //更换之后的信息
        var soldier = GLOBALDATA.soldiers[solId];
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
        nextInfo.Atk = attr.getAtk();  //攻击
        nextInfo.Hp = attr.getHp();  //生命
        nextInfo.Def = attr.getDef();  //防御
        if(isChange){  //是否更换
            if(nextInfo.Hp > this.nowInfo.Hp){
                ShowTipsTool.TipsFromText(STRINGCFG[100089].string+(nextInfo.Hp-this.nowInfo.Hp),cc.color.GREEN,30);  //100089  生命增加
            }
            if(nextInfo.Atk > this.nowInfo.Atk){
                ShowTipsTool.TipsFromText(STRINGCFG[100090].string+(nextInfo.Atk-this.nowInfo.Atk),cc.color.GREEN,30); //100090  攻击增加
            }
            if(nextInfo.Def > this.nowInfo.Def){
                ShowTipsTool.TipsFromText(STRINGCFG[100091].string+(nextInfo.Def-this.nowInfo.Def),cc.color.GREEN,30);  //100091 防御增加
            }
        }else{
            ShowTipsTool.TipsFromText(STRINGCFG[100089].string+(nextInfo.Hp),cc.color.GREEN,30);  //100089  生命增加
            ShowTipsTool.TipsFromText(STRINGCFG[100090].string+(nextInfo.Atk),cc.color.GREEN,30); //100090  攻击增加
            ShowTipsTool.TipsFromText(STRINGCFG[100091].string+(nextInfo.Def),cc.color.GREEN,30);  //100091 防御增加
        }
    },
    //部队弹框界面和控件的加载
    initArmyLayer:function(){
        //士兵头像的滚动条
        this.armyHeadList.setScrollBarEnabled(false);//滚动条
        for(var i=0; i<GLOBALDATA.army.battle.length; i++){
            var image = this.armyHead.clone();
            image.setTag(i);
            image.setName("armyHeadList_armyHead"+i);
            image.addTouchEventListener(this.armyHeadEvent,this);
            image.setTouchEnabled(true);
            image.setScale9Enabled(true);
            this.armyHeadList.pushBackCustomItem(image);
        }

        //第一次进入士兵界面默认初始化为第一个士兵的属性
        for(var i=0;i<GLOBALDATA.army.battle.length;i++){
            if(GLOBALDATA.army.battle[i]==0){
                var item = this.armyHeadList.getItem(i);
                var obj = ccsTool.seekWidget(item,["armyHeadIcon","lock","addArmy"]);
                obj.wgt.armyHeadIcon.setVisible(false);  //icon
                item.removeChild(obj.wgt.lock); //锁
                obj.wgt.addArmy.setVisible(true);   //加号
                cc.log(GLOBALDATA.army.battle[i]);
            }else if(GLOBALDATA.army.battle[i]==-1){
                cc.log(GLOBALDATA.army.battle[i]);
            }else{
                this.count++;
                var item = this.armyHeadList.getItem(i);
                var obj = ccsTool.seekWidget(item,["armyHeadBg","armyHeadIcon","harmyHeadBg","lock","addArmy"]);
                item.removeChild(obj.wgt.lock);
                item.removeChild(obj.wgt.addArmy);
                var SolId = GLOBALDATA.army.battle[i];
                this.solHeadImaInit(obj.wgt.armyHeadBg,obj.wgt.armyHeadIcon,SolId);//头像的初始化函数
                if (this.count == 1) {
                    obj.wgt.harmyHeadBg.setVisible(true);
                    this.armyHigh = obj.wgt.harmyHeadBg;
                    this.solAttributeInit(SolId);//士兵属性的初始化函数
                    this.equipEliminate();
                    this.armyEquipInit(i);
                }
            }
        }

        this.upLeftChangeButton.addTouchEventListener(this.leftMoveEvent,this);  //向左滑动按键
        this.upRightChangeButton.addTouchEventListener(this.rightMoveEvent, this);  //向右滑动按键
        this.embattleButton.addTouchEventListener(this.embattleEvent, this);  //布阵的按钮
        this.changeButton.addTouchEventListener(this.changeEvent, this);  //更换的按钮
        this.upGradeButton.addTouchEventListener(this.levelUpEvent, this);  //升级的按钮
        this.advancedButton.addTouchEventListener(this.AdvancedEvent, this);  //进阶的按钮
        this.awakeButton.addTouchEventListener(this.awakeEvent, this);  //觉醒按钮
        this.breakButton.addTouchEventListener(this.breakEvent, this);  //突破按钮
        this.reformButton.addTouchEventListener(this.reformEvent, this);  //改造按钮
        this.emFriendButton.addTouchEventListener(this.emFriendEvent, this);//协同作战


        //配饰添加按钮
        this.equipButton_1.setTag(1);
        this.equipButton_1.addTouchEventListener(this.addTreasureEvent, this);

        this.equipButton_2.setTag(2);
        this.equipButton_2.addTouchEventListener(this.addTreasureEvent, this);
        //装备按钮的添加
        this.equipButton_3.setTag(3);
        this.equipButton_3.addTouchEventListener(this.equipDressEvent, this);
        this.equipButton_4.setTag(4);
        this.equipButton_4.addTouchEventListener(this.equipDressEvent, this);
        this.equipButton_5.setTag(5);
        this.equipButton_5.addTouchEventListener(this.equipDressEvent, this);
        this.equipButton_6.setTag(6);
        this.equipButton_6.addTouchEventListener(this.equipDressEvent, this);

        this.strenButton.addTouchEventListener(this.strenEvent, this);  //一键强化按钮
        this.refineButton.addTouchEventListener(this.frefineEvent, this);  //一键精炼按钮
        this.equipButton.addTouchEventListener(this.equipEvent, this);  //一键装备按钮
        this.strenMasterButton.addTouchEventListener(this.strenMsterEvent, this);   //强化大师按钮
    },
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //滚动条上面的头像事件
    armyHeadEvent:function(sender, type) {
        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
                var ArmyIndex = sender.getTag();
                //士兵选择界面逻辑框
                var solValue = GLOBALDATA.army.battle[ArmyIndex];
                if(solValue == -1){
                    var strText = StringFormat(STRINGCFG[100045].string,this.levelArray[ArmyIndex]);  //100045 $1级开启
                    ShowTipsTool.TipsFromText(strText,cc.color.RED,30);
                }else if(solValue == 0){
                    this.isChange = false;  //是否更换
                    this.uiarmyChoiseLayer = new armyChoiseLayer(ArmyIndex+1,1);
                    this.getParent().curModule.addChild(this.uiarmyChoiseLayer, 10);
                    cc.log(GLOBALDATA.army.battle[ArmyIndex]);
                    //---------------------新添加士兵属性的初始化位置--------------------------//
                }else{
                    this.ArmyIndex = ArmyIndex;
                    this.SolId = GLOBALDATA.army.battle[this.ArmyIndex];
                    //this.SolId = GLOBALDATA.soldiers[solValue].p;
                    var item = this.armyHeadList.getItem(ArmyIndex);
                    var harmyHeadBg = item.getChildByName("harmyHeadBg");
                    if(harmyHeadBg !== this.armyHigh) {
                        harmyHeadBg.setVisible(true);
                        this.armyHigh.setVisible(false);
                        this.armyHigh = harmyHeadBg;
                    }
                    this.solAttributeInit(this.SolId); //士兵属性的初始化函数
                    this.equipEliminate();
                    this.armyEquipInit(ArmyIndex);
                }
                break;
            default:
                break;
        }
    },
    //初始化头像
    solHeadImaInit:function(headBg,headIcon,SolId){
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
        Helper.LoadFrameImageWithPlist(headBg,itemConfig.quality);
        Helper.LoadIcoImageWithPlist(headIcon,itemConfig);
    },

    //点击士兵图标后切换到相对应的士兵的属性
    solAttributeInit:function(solId){
        var count = 0;
        var isFind = false;   //已经找到
        for(var key in ARMYRELATIONCFG){
            if(ARMYRELATIONCFG[key].armyid == solId){
                var _luck = this["luckText_"+count];
                _luck.setString(ARMYRELATIONCFG[key].relation_name);
                _luck.setColor(cc.color(225,225,225));
                count++;
                isFind = true;
                var tagether = true;  //已经激活了士兵缘分
                var isItem = true;  //已经激活了装备缘分
                var armySolIdArray = ARMYRELATIONCFG[key].relation_armyvalue;
                for(var k=0;k<armySolIdArray.length;k++){
                    if (ITEMCFG[armySolIdArray[k]].maintype == 2 && GLOBALDATA.army.battle.indexOf(armySolIdArray[k]) == -1
                        && GLOBALDATA.army.companion.indexOf(armySolIdArray[k]) == -1) { //2为士兵
                        tagether = false;  //没有相应的士兵缘分
                        break;
                    }
                    if(ITEMCFG[armySolIdArray[k]].maintype == 4 || ITEMCFG[armySolIdArray[k]].maintype == 5){  //4为装备 5为宝物
                        var battlePos = GLOBALDATA.army.battle.indexOf(solId);  //士兵对应的位置
                        var equips = GLOBALDATA.army.equips[battlePos];  //士兵身上的装备
                        var isDress = false;  //是否穿戴了
                        for(var key in equips){
                            var equId = equips[key];
                            if(equId != 0 && GLOBALDATA.depot[equId].p == armySolIdArray[k]){
                                isDress = true;
                                break;
                            }
                        }
                        if(isDress == false){  //没有穿戴
                            isItem = false;
                            break;
                        }
                    }
                }
                if (tagether && isItem) {
                    _luck.setColor(cc.color(66, 255, 0));
                }
            }else if(isFind){  //当后面的不在是查找的内容的时候
                break;
            }
        }
        for(var j=count;j<=4;j++){
            var _luck = this["luckText_"+j];
            _luck.setString("");
        }

        //士兵的等级、名称、图片、生命值、攻击值、防御值的设置
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
        this.levelText.setString("LV:"+soldier.l);  //士兵等级
        var itemConfig = Helper.findItemId(tsolid);
        var breakLev = soldier.q;
        //进阶前士兵名称
        if(breakLev == 0){
            this.nameText.setString(itemConfig.itemname);
        }else{
            this.nameText.setString(itemConfig.itemname+"+"+breakLev);
        }
        Helper.setNamecolorByQuality(this.nameText,itemConfig.quality);  //颜色
        //this.nameText.ignoreContentAdaptWithSize(true);
        this.Panel_Show.removeAllChildren();
        var pSize = this.Panel_Show.getContentSize();
        HeroDefault.runAdle(tsolid,this.Panel_Show,pSize.width/2,0,1,1);

        //得到士兵的攻击、生命、防御值
        this.nowInfo = {};  //现在的信息
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
        this.nowInfo.Atk = attr.getAtk();  //攻击
        this.nowInfo.Hp = attr.getHp();  //生命
        this.nowInfo.Def = attr.getDef();  //防御
        this.lifeAtbValue.setString(this.nowInfo.Hp);//士兵生命
        this.attackAtbValue.setString(this.nowInfo.Atk);// 攻击
        this.defenseAtbValue.setString(this.nowInfo.Def);// 防御
        //觉醒、突破、改造按钮的状态
        this.SetButtonState(solId);
        //处理当前的士兵
        this.dealNowArmyRed();
    },
    //觉醒、突破、改造按钮的状态
    SetButtonState:function(SolId){
        var soldier = GLOBALDATA.soldiers[SolId];
        //是否显示觉醒按钮
        if(soldier.l >= (INTERFACECFG[8].level-5)){  //50级开启觉醒 提前5级显示
            this.awakeButton.setVisible(true);
        }else{
            this.awakeButton.setVisible(false);
        }
        //是否显示突破按钮
        var solId = SolId;
        if(soldier.m > 0){ //突破过
            var qhero = Helper.findHeroById(solId);
            solId = qhero.breakid || solId;
        }
        var hero = Helper.findHeroById(solId);
        if(hero.breakid == null || hero.breakid == 0){
            this.breakButton.setVisible(false);
        }else{
            this.breakButton.setVisible(true);
        }
        //是否显示改造
        if(hero.reform != 0 && soldier.l >= (INTERFACECFG[9].level-5) && soldier.sq < 10){  //55级开启改造 提前5级显示
            this.reformButton.setVisible(true);
        }else{
            this.reformButton.setVisible(false);
        }
    },
    //士兵装备的删除，equipEliminate函数与armyEquipInit函数是装备的刷新
    equipEliminate:function(){
        for(var i=1;i<7;i++){
            var eqItem = this["equipButton_"+i].getChildByName("eqItem");
            if(eqItem != undefined){
                this["equipButton_"+i].removeChild(eqItem);
                this["addAttImage"+i].setVisible(true);
            }else{
                continue;
            }
        }
    },

    armyEquipInit:function(count){
        //士兵装备的初始化
        var equipsAttr = GLOBALDATA.army.equips[count];
        for(var i=0;i<equipsAttr.length;i++){
            if(equipsAttr[i] != 0){
                var eqItem = new EquipItem(equipsAttr[i]);
                eqItem.setName("eqItem");
                switch(i){
                    case 0:
                        eqItem.setScale(0.8);
                        break;
                    case 1:
                        eqItem.setScale(0.8);
                        break;
                    case 2:
                        break;
                    case 3:
                        break;
                    case 4:
                        break;
                    case 5:
                        break;
                }
                this["addAttImage"+(i+1)].setVisible(false);
                this["equipButton_"+(i+1)].addChild(eqItem,2);
                var size = this["equipButton_"+(i+1)].getContentSize();
                eqItem.setPosition(size.width/2,size.height/2);
            }
        }
    },
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //左移按钮事件
    leftMoveEvent:function(sender, type){
        switch (type){
            case ccui.Widget.TOUCH_ENDED:
                //scrollToItem是滚动到具体的项目
                this.armyHeadList.scrollToLeft(0.2);
                break;
            default:
                break;
        }
    },
    //右移按钮事件
    rightMoveEvent:function(sender, type){
        switch (type){
            case ccui.Widget.TOUCH_ENDED:
                this.armyHeadList.scrollToRight(0.2);
                break;
            default:
                break;
        }
    },
    //布阵按钮事件
    embattleEvent:function(sender,  type){
        switch (type){
            case ccui.Widget.TOUCH_ENDED:
                var self = this;
                var armyEmbattleLayer = new embattleLayer();
                self.myLayer.addChild(armyEmbattleLayer, 30);
                break;
            default:
                break;
        }
    },

    //更换按钮事件
    changeEvent:function(sender, type){
        switch (type){
            case ccui.Widget.TOUCH_ENDED:
                var self = this;
                this.isChange = true;  //是否更换
                this.uiarmyChoiseLayer = new armyChoiseLayer(self.ArmyIndex+1,3);
                self.myLayer.addChild(this.uiarmyChoiseLayer, 20);
                break;
            default:
                break;
        }
    },

    //升级按钮事件
    levelUpEvent:function(sender, type){
        var self = this;
        switch (type){
            case ccui.Widget.TOUCH_ENDED:
                var _armyUpRankLayer = new armyLevelUpLayer(self.ArmyIndex);
                this.addChild(_armyUpRankLayer, 2);
                break;
            default:
                break;
        }
    },

    //进阶按钮事件
    AdvancedEvent:function(sender, type){
        var self = this;
        switch (type){
            case ccui.Widget.TOUCH_ENDED:
                if(GLOBALDATA.base.lev >= 5){
                    var _armyEvolutionLayer = new armyEvolutionLayer(self.ArmyIndex);
                    this.addChild(_armyEvolutionLayer, 2);
                }else{
                    var describe = StringFormat(STRINGCFG[100045].string, INTERFACECFG[11].level);
                    ShowTipsTool.TipsFromText(describe, cc.color.RED, 30);
                }

                break;
            default:
                break;
        }
    },

    //协同作战
    emFriendEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type){
            if(GLOBALDATA.base.lev >= INTERFACECFG[16].level){
                var _partnerLayer = new partnerLayer();
                _partnerLayer.setPosition(cc.p(0, 105));
                this.getParent().curModule.addChild(_partnerLayer, 10);
            }else{
                var describe = StringFormat(INTERFACECFG[16].name + STRINGCFG[100045].string, INTERFACECFG[16].level);
                ShowTipsTool.TipsFromText(describe, cc.color.RED, 30);
            }
        }
    },
    //觉醒按钮事件
    awakeEvent:function(sender,type){
        if(ccui.Widget.TOUCH_ENDED==type){
            var solId = GLOBALDATA.army.battle[this.ArmyIndex];
            var soldier = GLOBALDATA.soldiers[solId];
            if(soldier.l < INTERFACECFG[8].level){  //50级开启觉醒
                ShowTipsTool.TipsFromText(StringFormat(STRINGCFG[100045].string,INTERFACECFG[8].level), cc.color.RED, 30);
                return;
            }
            var AwakeLayer = new armyAwakeLayer(this.ArmyIndex);
            this.addChild(AwakeLayer, 2);
        }
    },
    //突破按钮事件
    breakEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type){
            var BreakLayer = new armyBreakLayer(this.ArmyIndex);
            this.addChild(BreakLayer, 2);
        }
    },
    //改造按钮事件
    reformEvent:function(sender,type){
        if(ccui.Widget.TOUCH_ENDED==type){
            var solId = GLOBALDATA.army.battle[this.ArmyIndex];
            var soldier = GLOBALDATA.soldiers[solId];
            if(soldier.l < INTERFACECFG[9].level){  //55级开启改造
                ShowTipsTool.TipsFromText(StringFormat(STRINGCFG[100045].string,INTERFACECFG[8].level), cc.color.RED, 30);
                return;
            }
            var ReformLayer = new armyReformLayer(this.ArmyIndex);
            this.addChild(ReformLayer, 2);
        }
    },
    //添加配饰按钮事件
    addTreasureEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type){
            var tag = sender.getTag();
            if(GLOBALDATA.army.equips[this.ArmyIndex][tag-1] != 0) {
                var _accDetailsLayer = new accDetailsLayer(GLOBALDATA.army.equips[this.ArmyIndex][tag-1], this.ArmyIndex);
                this.myLayer.addChild(_accDetailsLayer, 2);
            }else{//判断更换列表里是否有装备，如果有则穿戴，否则提示前往哪里获取装备
                var _accChangeLayer = new accChangeLayer(tag, this.ArmyIndex);
                this.myLayer.addChild(_accChangeLayer, 2);
            }
        }
    },

    //添加装备按钮事件
    equipDressEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type){
            var tag = sender.getTag();
            if(GLOBALDATA.army.equips[this.ArmyIndex][tag-1] != 0) {
                var _equipDetailsLayer = new equipDetailsLayer(GLOBALDATA.army.equips[this.ArmyIndex][tag-1], this.ArmyIndex);
                this.myLayer.addChild(_equipDetailsLayer, 2);
            }else{//判断更换列表里是否有装备，如果有则穿戴，否则提示前往哪里获取装备
                if(GLOBALDATA.base.lev >= 7){
                    if(isEmptyObject(GLOBALDATA.depot)){
                        //提示层
                        //提示层
                        var event = new cc.EventCustom("TipsLayer_show");
                        var strText =  STRINGCFG[100233].string;
                        var data = {string:strText, callback:this.tipsCallBack, target:this};
                        event.setUserData(data);
                        cc.eventManager.dispatchEvent(event);
                    }else{
                        var depotArray = [];
                        for(var key in GLOBALDATA.depot){
                            var equipAttr = Helper.findEqById(GLOBALDATA.depot[key].p);
                            if(equipAttr != null && equipAttr.type == tag && GLOBALDATA.depot[key].u == 0){
                                var temp = objClone(GLOBALDATA.depot[key]);
                                temp.id = key;
                                depotArray.push(temp);
                            }
                        }
                        if(depotArray.length != 0){
                            var _equipChangeLayer = new equipChangeLayer(tag, this.ArmyIndex);
                            this.myLayer.addChild(_equipChangeLayer, 2);
                        }else{
                            //提示层
                            var event = new cc.EventCustom("TipsLayer_show");
                            var strText =  STRINGCFG[100233].string;
                            var data = {string:strText, callback:this.tipsCallBack, target:this};
                            event.setUserData(data);
                            cc.eventManager.dispatchEvent(event);
                            //var tipsLayer = new TipsLayer();
                            //this.myLayer.addChild(tipsLayer, 2);
                        }
                    }
                }else{
                    var _equipChangeLayer = new equipChangeLayer(tag, this.ArmyIndex);
                    this.myLayer.addChild(_equipChangeLayer, 2);
                }
            }
        }
    },

    tipsCallBack:function(ttype){
        if (ttype == 1) // 确定
        {
            var arsenLayer = new ArsenLayer();
            this.myLayer.addChild(arsenLayer, 2);
        }
    },

    //强化按钮事件
    strenEvent:function(sender, type){
        switch (type){
            case ccui.Widget.TOUCH_ENDED:
                //如果一件装备都没有
                var eqArray = GLOBALDATA.army.equips[this.ArmyIndex];
                var isHave = false;
                var isCan = false;
                var tCost = 0;  //强化到能够强化的最高等级消耗的金币
                var minlv = MAXEQULEVEL;  //最小的强化等级
                var canLevel = MAXEQULEVEL;  //能够强化的最高等级
                if(GLOBALDATA.base.lev*2 <= canLevel){
                    canLevel = GLOBALDATA.base.lev*2;
                }
                for(var i=0;i<4;i++){
                    var eqId = eqArray[i+2];
                    if(eqId != 0){
                        isHave = true;
                        var eqInfo = GLOBALDATA.depot[eqId];
                        if(minlv > eqInfo.s){
                            minlv = eqInfo.s;
                        }
                        var itemCfg = Helper.findItemId(eqInfo.p);
                        var lvCfg = EQUIPQIANGHUACFG[eqInfo.s] || {};
                        if(!isCan){
                            //判断金币是否够
                            var gold = lvCfg["cost"+itemCfg.quality] || 0;
                            if(GLOBALDATA.base.money >= gold){
                                isCan = true;
                            }
                        }
                        var nowcost = lvCfg["tcost"+itemCfg.quality] || 0;  //现在已经消耗的
                        var canCfg = EQUIPQIANGHUACFG[canLevel] || {};
                        var cancost = canCfg["tcost"+itemCfg.quality] || 0;  //升到当前最高级的消耗
                        tCost = tCost + cancost - nowcost;
                    }
                }
                if(!isHave){  //身上没有装备
                    ShowTipsTool.ErrorTipsFromStringById(100177);  //100177	没有满足条件的装备 主城的装备塔可以获得大量的装备
                    return;
                }
                if(minlv >= canLevel){  //已经达到当前等级上限
                    ShowTipsTool.ErrorTipsFromStringById(100231);   //100231	已达到等级上限
                    return;
                }
                if(minlv >= MAXEQULEVEL){  //装备的最高等级上限
                    ShowTipsTool.ErrorTipsFromStringById(100179);  //100179	全身装备已经强化到上限
                    return;
                }
                if(!isCan){  //如果强化一级的金币都不够
                    ShowTipsTool.ErrorTipsFromStringById(100010);  //100010	金币不足
                    return;
                }
                //弹出提示框
                var money = (tCost>GLOBALDATA.base.money)?GLOBALDATA.base.money:tCost;
                var event = new cc.EventCustom("TipsLayer_show");
                var strText =  StringFormat(STRINGCFG[100178].string,money); //100178	是否确定花费$1金钱进行一键强化
                var data = {string:strText, callback:this.strengthenAllCallback, target:this};
                event.setUserData(data);
                cc.eventManager.dispatchEvent(event);
                break;
            default:
                break;
        }
    },
    //一键强化的回调
    strengthenAllCallback:function(ttype){
        if (ttype == 1) // 确定
        {
            armyModel.strengthenAll(this.ArmyIndex+1);
        }
    },
    //精炼按钮事件
    frefineEvent:function(sender, type){
        switch (type){
            case ccui.Widget.TOUCH_ENDED:
                //如果一件装备都没有
                var eqArray = GLOBALDATA.army.equips[this.ArmyIndex];
                var isHave = false;
                var isCan = false;
                var minlv = MAXEQUREFINE;
                for(var i=0;i<4;i++){
                    var eqId = eqArray[i+2];
                    if(eqId != 0){
                        isHave = true;
                        var eqInfo = GLOBALDATA.depot[eqId];
                        if(minlv > eqInfo.r){
                            minlv = eqInfo.r;
                        }
                        if(!isCan){
                            //计算能够增加的总经验
                            var haveExp = 0;
                            var idArr = [22011,22012,22013,22014];  //四种精炼石
                            for(var j = 0;j<4;j++){
                                var itemCfg = Helper.findItemId(idArr[j]) || {};
                                var exp = itemCfg.value || 0;
                                var have = Helper.getItemNum(idArr[j]);
                                haveExp = haveExp + exp*have;
                            }
                            //升一级需要的经验
                            var itemCfg = Helper.findItemId(eqInfo.p);
                            var lvCfg = EQUIPJINGLIANCFG[eqInfo.r] || {};
                            var exp = lvCfg["exp"+itemCfg.quality] || 0;
                            if(haveExp >= exp-eqInfo.e){
                                isCan = true;
                            }
                        }
                    }
                }
                if(!isHave){  //身上没有装备
                    ShowTipsTool.ErrorTipsFromStringById(100177);  //100177	没有满足条件的装备 主城的装备塔可以获得大量的装备
                    return;
                }
                if(minlv >= MAXEQUREFINE){
                    ShowTipsTool.ErrorTipsFromStringById(100180);  //100180	全身装备已经精炼到上限
                    return;
                }
                if(!isCan){  //如果精炼一级的精炼石都不够
                    ShowTipsTool.ErrorTipsFromStringById(100213);  //100213	精炼石不足
                    return;
                }
                //弹出提示框
                var event = new cc.EventCustom("TipsLayer_show");
                var strText =  StringFormat(STRINGCFG[100181].string,Math.floor(minlv/2)*2+2); //100181	是否将全身装备精炼到$1级
                var data = {string:strText, callback:this.refineAllCallback, target:this};
                event.setUserData(data);
                cc.eventManager.dispatchEvent(event);

                /*var partnerlayer = new partnerLayer();
                partnerlayer.setPosition(0,105);
                this.getParent().curModule.addChild(partnerlayer, 10);
                cc.log("没有满足条件的装备");*/
                break;
            default:
                break;
        }
    },
    //一键精炼的回调
    refineAllCallback:function(ttype){
        if (ttype == 1) // 确定
        {
            armyModel.refineAll(this.ArmyIndex+1);
        }
    },
    //装备按钮事件
    equipEvent:function(sender, type){
        switch (type){
            case ccui.Widget.TOUCH_ENDED:
                var isCan = false;  //是否能够更换
                var eqArray = GLOBALDATA.army.equips[this.ArmyIndex];
                var newEquId = [];
                for(var i=0;i<4;i++){
                    //缘分数据
                    var yuanArray = [];
                    var armyId = GLOBALDATA.army.battle[this.ArmyIndex];
                    var isFind = false;   //已经找到
                    for(var key in ARMYRELATIONCFG){
                        if(ARMYRELATIONCFG[key].armyid == armyId){
                            isFind = true;
                            var armySolIdArray = ARMYRELATIONCFG[key].relation_armyvalue;
                            for(var j=0;j<armySolIdArray.length;j++){
                                var equipAttr = Helper.findEqById(armySolIdArray[j]);
                                if(equipAttr != null && equipAttr.type == i+3){
                                    yuanArray.push(armySolIdArray[j]);
                                }
                            }
                        }else if(isFind){ //当后面的不在是查找的内容的时候
                            break;
                        }
                    }
                    //能够更换的
                    var depotArray = [];
                    for(var key in GLOBALDATA.depot){
                        var equipAttr = Helper.findEqById(GLOBALDATA.depot[key].p);
                        if(equipAttr != null && equipAttr.type == i+3 && GLOBALDATA.depot[key].u == 0){
                            var temp = objClone(GLOBALDATA.depot[key]);
                            temp.id = parseInt(key);
                            temp.yuan = 0;
                            for(var j=0;j<yuanArray.length;j++){
                                if(temp.p == yuanArray[j]){
                                    temp.yuan = 1;
                                }
                            }
                            temp.isnow = 0;
                            depotArray.push(temp);
                        }
                    }
                    //现在的
                    var eqId = eqArray[i+2];
                    if(eqId != 0){
                        var temp = objClone(GLOBALDATA.depot[eqId]);
                        temp.id = parseInt(eqId);
                        temp.yuan = 0;
                        for(var j=0;j<yuanArray.length;j++){
                            if(temp.p == yuanArray[j]){
                                temp.yuan = 1;
                            }
                        }
                        temp.isnow = 1;
                        depotArray.push(temp);
                    }
                    //排序规则
                    var compareTh = function(a,b) {
                        var last = Helper.findItemId(a.p);
                        var next = Helper.findItemId(b.p);
                        if(a.yuan > b.yuan){  //缘分
                            return -1;
                        }else if(a.yuan == b.yuan){
                            if(last.quality > next.quality){  //品质
                                return -1;
                            }else if(last.quality == next.quality){
                                if(a.d > b.d){  //锻造等级
                                    return -1;
                                }else if(a.d == b.d){
                                    if(a.s > b.s){  //强化等级
                                        return -1;
                                    }else if(a.s == b.s){
                                        if(a.r > b.r){  //精炼等级
                                            return -1;
                                        }else if(a.r == b.r){
                                            if(a.isnow > b.isnow){  //是否现在穿戴
                                                return -1;
                                            }else if(a.isnow == b.isnow){
                                                if(a.id < b.id){
                                                    return -1;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        return 1;
                    };
                    depotArray.sort(compareTh);  //排序
                    var newId = 0;
                    if(depotArray[0] != null){
                        newId = depotArray[0].id;
                        if(newId != eqId){
                            isCan = true;
                        }
                    }
                    newEquId.push(newId);
                }
                if(isCan){
                    armyModel.wearAll(this.ArmyIndex+1,newEquId);
                }else{
                    ShowTipsTool.ErrorTipsFromStringById(100177);  //100177	没有满足条件的装备 主城的装备塔可以获得大量的装备
                }
                break;
            default:
                break;
        }
    },

    //强化大师按钮事件
    strenMsterEvent:function(sender, type){
        switch (type){
            case ccui.Widget.TOUCH_ENDED:
                var _equipMasterLayer = new equipMasterLayer(this.ArmyIndex);
                this.myLayer.addChild(_equipMasterLayer, 2);
                break;
            default:
                break;
        }
    },
    //处理红点
    dealRedPoint:function(data){
        var redInfo = armyRedPoint.armyPanleRedPoint(data);
        if(redInfo != null){
            this.redInfo = redInfo;
            //list里面的
            for(var i = 0;i<redInfo.armyRed.length;i++){
                var item = this.armyHeadList.getItem(i);
                var tipsImage = ccui.helper.seekWidgetByName(item, "tipsImage");
                if(redInfo.armyRed[i].isRed == true){
                    tipsImage.setVisible(true);
                }else{
                    tipsImage.setVisible(false);
                }
            }
            this.dealNowArmyRed();  //处理当前的士兵
            //小伙伴
            if(redInfo.companion == 1){
                this.tipsImage1.setVisible(true);
            }else{
                this.tipsImage1.setVisible(false);
            }
        }
    },
    //处理当前的士兵
    dealNowArmyRed:function(){
        if(this.redInfo != null){
            //当前的士兵
            var nowRed = this.redInfo.armyRed[this.ArmyIndex];
            //先全部隐藏
            for(var i=2;i<=3;i++){
                this["tipsImage"+i].setVisible(false);
            }
            for(var i=1;i<=6;i++){
                this["tipsImageH"+i].setVisible(false);
                this["tipsImageE"+i].setVisible(false);
            }
            //更换
            if(nowRed.station == 2){
                this.tipsImageH1.setVisible(true);
            }
            //升级
            if(nowRed.lv== 1){
                this.tipsImageH2.setVisible(true);
            }
            //进阶
            if(nowRed.evo== 1){
                this.tipsImageH3.setVisible(true);
            }
            //改造
            if(nowRed.reform== 1){
                this.tipsImageH4.setVisible(true);
            }
            //突破
            if(nowRed.break== 1){
                this.tipsImageH5.setVisible(true);
            }
            //觉醒
            if(nowRed.awake== 1){
                this.tipsImageH6.setVisible(true);
            }
            //装备和配饰
            for(var i = 0;i<nowRed.equ.pos.length;i++){
                var pos = nowRed.equ.pos[i];
                if(pos == 7){  //一键装备
                    this.tipsImage2.setVisible(true);
                }else if(pos == 8){  //一键强化
                    this.tipsImage3.setVisible(true);
                }else{
                    this["tipsImageE"+pos].setVisible(true);
                }
            }
        }
    },
    onExit:function () {
        this._super();
        cc.eventManager.removeListener(this.stagePassEvn);
        cc.eventManager.removeListener(this.evnUpdateUI);
        cc.eventManager.removeListener(this.equipDressDataUpdate);
        cc.eventManager.removeListener(this.unsnatchDressEvent);
        cc.eventManager.removeListener(this.allEquipment);
        cc.eventManager.removeListener(this.allStrengthen);
        cc.eventManager.removeListener(this.allRefine);

        cc.log('armyLayer onExit');
    }
});

