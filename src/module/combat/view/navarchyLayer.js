
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
var navarchyLayer = ModalDialog.extend({
    LayerName:"navarchyLayer",
    select:true,//选择框的选择状态
    index:0,//技能item的索引值
    canLevelUp:null,//用于判断指挥官能否升级
    comSkillArray:[],//载具数组
    passivityArray:[],//被动技能数组
    curTab:0,
    rankArray:[],
    commander:null,
    isRankInit:false,
    isAutoRank:false,//控制军衔界面点击自动进阶按钮时停止按钮的显示与隐藏
    vehicleArray:[],//载具数组
    useVehicleArray:[],//激活的载具数组
    skillArray:[108, 109, 110, 111, 112],
    skill:null,
    canClick:true,//判断技能升级按钮是否可以点击
    skillAttr:null,//技能属性类型
    oldPower:null,//记录没升级前的军力值
    rankColor:[cc.color.WHITE,cc.color.GREEN,cc.color.BLUE,cc.color.ORANGE,cc.color.YELLOW,cc.color.RED],
    ctor:function () {
        this._super();
        //this.LayerName = "navarchyLayer";
    },
    onEnter:function () {
        this._super();
        //this.initData();

        //this.initEvent();
        //技能升级处理
        var self = this;
        this.evnSkillLevelUp = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "commander.skillup",
            callback: function(event){
                var resData = event.getUserData();
                // 更新指挥官信息
                if(resData.status==0){//成功
                    //指挥官为零时刷新combatLayer里的initUI函数，是为了显示技能图标
                    //combatLayer层里的initUI()函数的事件派发
                    if(self.skillArray.indexOf(self.skill) != -1 && self.commander.s[self.skill] == 1){
                        var updataInitUIevn = new cc.EventCustom('updataCombatLayerInitUIevn');
                        //updataInitUIevn.setUserData();
                        updataInitUIevn.setUserData(self.skillArray.indexOf(self.skill)+1);
                        cc.eventManager.dispatchEvent(updataInitUIevn);
                    }
                    var skillItem = self.skillList.getItem(self.index);
                    if(self.comSkillArray.indexOf(self.skillAttr.commanderskillid)>=0){
                        if(self.index == 0){
                            self.updateSkillInfo();
                        }else{
                            self.initData(skillItem, self.index);
                        }
                    }else{
                        self.carryList.removeAllItems();
                        self.initVehicle();
                    }
                    self.dealRedPoint();
                    //战力显示加成判断
                    if(self.passivityArray.indexOf(self.skillAttr.commanderskillid) >= 0){
                        self.fightNumRoot.node.setPosition(cc.p(0, 200));
                        self.addChild(self.fightNumRoot.node, 10);
                        self.powerShow();
                        //self.powerGet(self.skillAttr.attributeid);
                        self.skillAttr = null;
                    }
                }
                self.canClick = true;
            }
        });
        cc.eventManager.addListener(this.evnSkillLevelUp, 1);
        //军衔升级处理
        /*this.evnRankUp = cc.EventListener.create({
         event: cc.EventListener.CUSTOM,
         eventName: "commander.mrankup",
         callback: function(event){
         var resData = event.getUserData();
         if(resData.status!=0){//升级失败
         self.isAutoRank = false;
         }else if(resData.status==0){
         // 更新指挥官信息
         for (var key in GLOBALDATA.commanders){
         if (GLOBALDATA.commanders[key].j==1){
         //渲染图像
         self.commander = GLOBALDATA.commanders[key];
         self.commanderId = key;
         //var updataInitUIevn = new cc.EventCustom('updataCombatLayerInitUIevn');
         //updataInitUIevn.setUserData();
         //cc.eventManager.dispatchEvent(updataInitUIevn);
         break;
         }
         }

         self.updateRank();
         if(resData.data.suc==1){//军衔进阶成功
         self.isAutoRank = false;
         self.advanceButton.setVisible(true);
         self.autoAdvanceButton.setVisible(true);
         self.stopBtn.setVisible(false);
         ShowTipsTool.TipsFromText(STRINGCFG[100017].string,cc.color.ORANGE,30);   //显示tips  100017 军衔进阶成功
         }else {
         //提示
         var strText = STRINGCFG[100018].string + " +" + resData.data.bless;  //100018  祝福值
         ShowTipsTool.TipsFromText(strText,cc.color.GREEN,30);   //显示tips

         if(self.isAutoRank){
         self.scheduleOnce(function (dt) {
         commanderModel.rank(parseInt(self.commanderId),0);
         },0.5);
         }
         }
         }
         }
         });
         cc.eventManager.addListener(this.evnRankUp, 1);*/
        // this.skillList.forceDoLayout();

        //载具升级处理
        this.vehiclUpEvent = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "commander.weaponup",
            callback:function(event){
                var resData = event.getUserData();
                if(resData.status == 0){
                    var tips = baseModel.NavechileTip();
                    if(tips){
                        self.commanderRoot.wgt.tipsImageG2.setVisible(true);
                    }else{
                        self.commanderRoot.wgt.tipsImageG2.setVisible(false);
                    }
                    self.carryList.removeAllItems();
                    self.initVehicle();
                }else{
                    ShowTipsTool.TipsFromText(STRINGCFG[resData.status].string,cc.color.ORANGE,30);
                }
                self.canClick = true;
            }
        });
        cc.eventManager.addListener(this.vehiclUpEvent, this);

        //载具的更换
        this.vehicleChangeEvent = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "commander.changeweapon",
            callback:function(event){
                var resData = event.getUserData();
                if(resData.status == 0){
                    self.carryList.removeAllItems();
                    self.initVehicle();
                }else{
                    ShowTipsTool.TipsFromText(STRINGCFG[resData.status].string,cc.color.ORANGE,30);
                }
                self.canClick = true;
            }
        });
        cc.eventManager.addListener(this.vehicleChangeEvent, this);
    },

    //初始化指挥官主界面UI
    initUI:function () {
        //指挥官主界面的ui资源加载
        this.commanderRoot = ccsTool.load(res.uiNavarchyLayer,['pvContent', 'skillList', 'rank', 'FileNode_2', 'carryList',
            'carryName', 'carryCheckButton', 'carryNoButton', 'btnRank', 'btnSkill', 'btnCarry', 'btnClose', 'carrying', 'skill',
            'tipsImageG1', 'tipsImageG2']);
        this.uiNavarchyLayer = this.commanderRoot.node;
        this.uiNavarchyLayer.setAnchorPoint(0.5,0.5);
        this.uiNavarchyLayer.setPosition(cc.winSize.width/2,cc.winSize.height/2);
        this.addObj(this.uiNavarchyLayer);
//指挥官技能item的加载
        this.skillRoot = ccsTool.load(res.uiNavarchySkillLayer, ['skillItem', 'upGradeButton', 'studiedButton',
            'hurtAdd', 'skillIcon', 'skillName', 'rank', 'skillState', 'nodeLevelUp', 'levelUp', 'noLevelUp',
            'activation', 'imgGold', 'goldValue', 'maxSkillButton']);//加载载具的item
        //关闭按钮事件
        this.commanderRoot.wgt.btnClose.addTouchEventListener(this.touchEvent,this);
        //技能按钮事件
        this.commanderRoot.wgt.btnSkill.addTouchEventListener(this.touchEvent,this);
        this.commanderRoot.wgt.btnSkill.setBright(false);
        //军衔按钮事件
        this.commanderRoot.wgt.btnRank.addTouchEventListener(this.touchEvent,this);
        //载具按钮事件
        this.commanderRoot.wgt.btnCarry.addTouchEventListener(this.touchEvent, this);

        this.skillList = this.commanderRoot.wgt.skillList;//指挥官列表的获取
        this.carryList = this.commanderRoot.wgt.carryList;//载具列表的获取
        this.carryList.addTouchEventListener(this.carryListEvent, this);

        //this.btnTabs = [this.commanderRoot.wgt.btnSkill,this.commanderRoot.wgt.btnRank, this.commanderRoot.wgt.btnCarry];
        this.btnTabs = [this.commanderRoot.wgt.btnSkill, this.commanderRoot.wgt.btnCarry];
        cc.spriteFrameCache.addSpriteFrames(res.ui_skill_plist);
        this.dealRedPoint();
        this.updateSkillInfo();
    },

    dealRedPoint:function(data){
        var navTips = baseModel.NavTips(data);
        if(navTips){
            this.commanderRoot.wgt.tipsImageG1.setVisible(true);
            //this.updateSkillInfo();
        }else{
            this.commanderRoot.wgt.tipsImageG1.setVisible(false);
        }
        var vecTips = baseModel.NavechileTip(data);
        if(vecTips){
            this.commanderRoot.wgt.tipsImageG2.setVisible(true);
            //this.initVehicle();
        }else{
            this.commanderRoot.wgt.tipsImageG2.setVisible(false);
        }
    },

//************************************************************************************************
    //技能界面的编码
    updateSkillInfo:function(){
        this.commanderRoot.wgt.skill.setVisible(true);
        //获取上阵指挥官的属性及ID
        for (var key in GLOBALDATA.commanders){
            if (GLOBALDATA.commanders[key].j == 1){
                this.commander = GLOBALDATA.commanders[key];
                this.commanderId = key;
                break;
            }
        }
        //var skillItem = this.skillRoot.wgt.skillItem;
        //this.skillList.setItemModel(skillItem);
        this.comSkillArray.length = 0;//指挥官技能数组
        for(var commanderObj in COMMANDERCFG){
            if(this.commander.p == commanderObj){
                //获取指挥官技能并对技能进行排序
                this.comSkillArray = COMMANDERCFG[commanderObj].asicskill.concat(COMMANDERCFG[commanderObj].activeskill,
                    COMMANDERCFG[commanderObj].passiveskill).sort();
                //需要显示增加的伤害值和战力技能数组
                this.passivityArray = COMMANDERCFG[commanderObj].asicskill.concat(COMMANDERCFG[commanderObj].passiveskill);
            }
        }
        this.skillList.removeAllItems();
        //添加技能item， 并初始化数据
        for(var i=0;i<this.comSkillArray.length;i++){
            var _skillRoot = this.skillRoot.wgt.skillItem.clone();
            //_skillRoot.setTag(i);
            this.skillList.pushBackCustomItem(_skillRoot);
            //var skillItem = this.skillList.getItem(i);
            this.initData(_skillRoot, i);
        }
    },

    initData:function (_skillRoot, i) {
        var skillRoot = ccsTool.seekWidget(_skillRoot, ['skillItem', 'upGradeButton', 'studiedButton',
            'hurtAdd', 'skillIcon', 'skillName', 'rank', 'skillState', 'nodeLevelUp', 'levelUp', 'noLevelUp',
            'activation', 'imgGold', 'goldValue', 'maxSkillButton']);
        //var skillRoot = this.skillList.getChildByTag(i);
        //技能图标
        skillRoot.wgt.skillIcon.loadTexture("common/j/" + COMMANDERSKILLCFG[this.comSkillArray[i]].icon, ccui.Widget.PLIST_TEXTURE);
        //如果是第一个技能item，则显示连加十级的提示
        this.skillArray;
        if(i == 0){
            skillRoot.wgt.nodeLevelUp.setVisible(true);
            if(this.select){
                skillRoot.wgt.levelUp.setSelected(true);
                //skillRoot.wgt.levelUp.addEventListener(this.selectEvent(), this);
            }else{
                skillRoot.wgt.levelUp.setSelected(false);
            }
        }
        //checkBox.addEventListener(this.selectedStateEvent, this);
        skillRoot.wgt.levelUp.addEventListener(this.selectEvent(), this);

        //指挥官技能描述
        skillRoot.wgt.skillName.setString(COMMANDERSKILLCFG[this.comSkillArray[i]].commanderskillname);
        //指挥官技能描述以及等级显示
        var skillState = skillRoot.wgt.skillState;
        var desc = COMMANDERSKILLCFG[this.comSkillArray[i]].describle;
        for(var key in COMDERSKILLCONSUMECFG){
            if(COMDERSKILLCONSUMECFG[key].pos == this.comSkillArray[i] && this.commander.s[this.comSkillArray[i]] ==
                COMDERSKILLCONSUMECFG[key].lev){
                var comData = COMDERSKILLCONSUMECFG[key];
                break;
            }
        }


        //当技能等级为零时的处理
        if(this.commander.s[this.comSkillArray[i]] == 0){
            //指挥官技能等级为零时初始化为1级
            skillRoot.wgt.rank.setString('LV : '+(this.commander.s[this.comSkillArray[i]]+1));//等级的显示
            if(comData.data[1] == 1 || comData.data[1] == 3){
                var attrValue = comData.data[2];
                //技能伤害的描述
                skillRoot.wgt.hurtAdd.setString("+" + comData.promote[1] + COMMANDERSKILLCFG[this.comSkillArray[i]].uidescrible);
            }else{
                var attrValue = comData.data[2]/100 +"%";
                //技能伤害的描述
                skillRoot.wgt.hurtAdd.setString("+"+comData.promote[1]/100 + "%" + COMMANDERSKILLCFG[this.comSkillArray[i]].uidescrible);
            }
        }else{
            //当技能等级不为零时的处理
            skillRoot.wgt.rank.setString('LV : '+this.commander.s[this.comSkillArray[i]]);
            if(comData.data[1] == 1 || comData.data[1] == 3){
                var attrValue = comData.data[2];
                //技能伤害的描述
                skillRoot.wgt.hurtAdd.setString("+" + comData.promote[1] + COMMANDERSKILLCFG[this.comSkillArray[i]].uidescrible);
            }else{
                var attrValue = comData.data[2]/100 + "%";
                //技能伤害的描述
                skillRoot.wgt.hurtAdd.setString("+" + comData.promote[1]/100 + "%" + COMMANDERSKILLCFG[this.comSkillArray[i]].uidescrible);
            }
        }
        desc = StringFormat(desc,attrValue);
        skillState.setString(desc); //技能效果描述


        //判断技能是否可以升级
        skillRoot.wgt.upGradeButton.addTouchEventListener(this.skillLevelUp,this);
        skillRoot.wgt.upGradeButton.setUserData("guid_skillList_upGradeButton"+i);
        skillRoot.wgt.studiedButton.addTouchEventListener(this.skillLevelUp,this);
        var curLevel = this.commander.s[this.comSkillArray[i]];
        this.canLevelUp = false;
        if(i == 0){//第一个技能特殊处理
            if(this.commander.s[this.comSkillArray[i]] >= COMMANDERSKILLCFG[this.comSkillArray[i]].mostlv){
                this.canLevelUp = false;
            }else{
                if(curLevel < (GLOBALDATA.base.lev * 10 + 1)){//可以升级
                    this.canLevelUp = true;
                    /*if(GLOBALDATA.base.lev * 10 >= COMMANDERSKILLCFG[this.comSkillArray[i]].mostlv){
                        this.canLevelUp = false;
                    }*/
                }else{//不能升级
                    this.canLevelUp = false;
                }
            }
        }else{//除第一个技能外其他技能的处理
            if(curLevel == 0){//当技能等级为零时
                this.canLevelUp = false;
            }else{//当技能等级不为零时
                if(this.commander.s[this.comSkillArray[i]] >= COMMANDERSKILLCFG[this.comSkillArray[i]].mostlv){
                    this.canLevelUp = false;
                }else{
                    //var limit = this.getLimit(this.comSkillArray[i]);
                    if(this.commander.s[comData.pos_req] >= comData.lev_req && COMMANDERSKILLCFG[this.comSkillArray[i]].mostlv >
                        this.commander.s[this.comSkillArray[i]]){//可以升级
                        this.canLevelUp = true;
                    }else{//不能升级
                        this.canLevelUp = false;
                    }
                }
            }
        }

        if(this.canLevelUp){//可以升级,判断金币
            skillRoot.wgt.upGradeButton.setVisible(true);//升级按钮显示
            skillRoot.wgt.studiedButton.setVisible(false);//学习按钮隐藏
            skillRoot.wgt.noLevelUp.setVisible(false);//条件提示隐藏
            skillRoot.wgt.imgGold.setVisible(true);//金币图标显示
            //金币消耗
            var gold = comData.money;
            if(i == 0 && this.select){//升十级
                //基础技能升十级金币消耗
                gold = 0;
                if(this.commander.s[this.comSkillArray[i]]+10 >= COMMANDERSKILLCFG[this.comSkillArray[i]].mostlv){
                    for(var k=0;k< COMMANDERSKILLCFG[this.comSkillArray[i]].mostlv - this.commander.s[this.comSkillArray[i]];k++){
                        gold += COMDERSKILLCONSUMECFG[comData.id + k].money;
                    }
                }else{
                    for(var k=0;k<10;k++){
                        gold += COMDERSKILLCONSUMECFG[comData.id + k].money;
                    }
                }
            }
            gold = Math.round(gold);//向上取整
            skillRoot.wgt.goldValue.setString(Helper.formatNum(gold));//金币数量超过10000以“1万”显示
            //判断升级所消耗的金币是否够
            if(gold > GLOBALDATA.base.money){//金币不够
                skillRoot.wgt.goldValue.setColor(cc.color(255,36,0));
            }else {
                skillRoot.wgt.goldValue.setColor(cc.color(0,254,12));
            }
        }else{//不能升级
            //当指挥官技能为零级是按钮所要显示的状态
            if(curLevel == 0){
                if(this.commander.s[comData.pos_req] >= comData.lev_req) {//可以学习
                    skillRoot.wgt.studiedButton.setVisible(true);
                    skillRoot.wgt.studiedButton.setTouchEnabled(true);
                    skillRoot.wgt.studiedButton.setBright(true);
                    skillRoot.wgt.upGradeButton.setVisible(false);
                    skillRoot.wgt.noLevelUp.setVisible(false);
                    skillRoot.wgt.imgGold.setVisible(true);
                    var gold = comData.money;
                    if (i == 0) {//升十级
                        gold = 0;
                        if(this.commander.s[this.comSkillArray[i]]+10 >= COMMANDERSKILLCFG[this.comSkillArray[i]].mostlv){
                            for(var k=0;k<COMMANDERSKILLCFG[this.comSkillArray[i]].mostlv-this.commander.s[this.comSkillArray[i]];k++){
                                gold += COMDERSKILLCONSUMECFG[comData.id+k].money;
                            }
                        }else{
                            for(var k=0;k<10;k++){
                                gold += COMDERSKILLCONSUMECFG[comData.id+k].money;
                            }
                        }
                    }
                    gold = Math.round(gold);//向上取整
                    skillRoot.wgt.goldValue.setString(Helper.formatNum(gold));
                    if (gold > GLOBALDATA.base.money) {//金币不够
                        skillRoot.wgt.goldValue.setColor(cc.color(255, 36, 0));
                    } else {
                        skillRoot.wgt.goldValue.setColor(cc.color(0, 254, 12));
                    }
                }else{//不能学习
                    skillRoot.wgt.studiedButton.setVisible(true);
                    skillRoot.wgt.studiedButton.setTouchEnabled(false);
                    skillRoot.wgt.studiedButton.setBright(false);
                    skillRoot.wgt.upGradeButton.setVisible(false);
                    skillRoot.wgt.noLevelUp.setVisible(true);
                    skillRoot.wgt.imgGold.setVisible(false);
                    if(i == 0){
                        var desc = StringFormat(STRINGCFG[100100].string, this.GLOBALDATA.base.lev+1);
                        skillRoot.wgt.noLevelUp.setString(desc);
                        //skillRoot.wgt.noLevelUp.setString("指挥官"+(this.GLOBALDATA.base.lev+1)+"级可升级");
                    }else{
                        //var limit = this.getLimit(this.comSkillArray[i]);
                        //设置为真将忽略用户定义内容的大小，这意味着小窗口大小始终等于的返回值
                        skillRoot.wgt.noLevelUp.ignoreContentAdaptWithSize(true);
                        var desc = StringFormat(STRINGCFG[100045].string, COMMANDERSKILLCFG[COMMANDERCFG[this.commander.p].asicskill[0]].
                                commanderskillname + comData.lev_req);
                        skillRoot.wgt.noLevelUp.setString(desc);
                    }
                }
            }else{
                skillRoot.wgt.upGradeButton.setTouchEnabled(false);//按钮禁用
                if(this.commander.s[this.comSkillArray[i]] >= COMMANDERSKILLCFG[this.comSkillArray[i]].mostlv){
                    skillRoot.wgt.upGradeButton.setVisible(false);
                    skillRoot.wgt.studiedButton.setVisible(false);
                    skillRoot.wgt.imgGold.setVisible(false);
                    skillRoot.wgt.maxSkillButton.setVisible(true);
                    skillRoot.wgt.noLevelUp.setVisible(false);
                }else{
                    skillRoot.wgt.upGradeButton.setBright(false);//按钮禁用状态图片显示效果
                    skillRoot.wgt.upGradeButton.setVisible(true);
                    skillRoot.wgt.studiedButton.setVisible(false);
                    skillRoot.wgt.noLevelUp.ignoreContentAdaptWithSize(true);
                    skillRoot.wgt.noLevelUp.setVisible(true);
                    skillRoot.wgt.imgGold.setVisible(false);
                    skillRoot.wgt.maxSkillButton.setVisible(false);
                    if(i == 0){
                        var desc = StringFormat(STRINGCFG[100100].string, GLOBALDATA.base.lev+1);
                        skillRoot.wgt.noLevelUp.setString(desc);
                        //skillRoot.wgt.noLevelUp.setString("指挥官"+(GLOBALDATA.base.lev+1)+"级可升级");
                    }else{
                        //var limit = this.getLimit(this.comSkillArray[i]);
                        var desc = StringFormat(STRINGCFG[100047].string, COMMANDERSKILLCFG[COMMANDERCFG[this.commander.p].asicskill[0]].
                                commanderskillname+comData.lev_req);
                        skillRoot.wgt.noLevelUp.setString(desc);
                    }
                }
            }
        }
    },


    //选择框按钮事件
    selectEvent:function(sender, type){
        var skillitem = this.skillList.getItem(0);
        this.cbLevelUp = ccui.helper.seekWidgetByName(skillitem, "levelUp");
        var goldValue = ccui.helper.seekWidgetByName(skillitem, "goldValue");
        var upGradeButton = ccui.helper.seekWidgetByName(skillitem, "upGradeButton");
        var imgGold = ccui.helper.seekWidgetByName(skillitem, "imgGold");
        var noLevelUp = ccui.helper.seekWidgetByName(skillitem, "noLevelUp");
        var curLevel = this.commander.s[this.comSkillArray[0]];

        this.cbLevelUp.addEventListener(function (sender, type) {
            //var gold = 0;
            for(var key in COMDERSKILLCONSUMECFG){
                if(COMDERSKILLCONSUMECFG[key].pos == this.comSkillArray[0] && COMDERSKILLCONSUMECFG[key].lev == this.commander.s[this.comSkillArray[0]]){
                    var selComData = COMDERSKILLCONSUMECFG[key];
                    break;
                }
            }
            switch (type) {
                case  ccui.CheckBox.EVENT_UNSELECTED:
                    this.select = false;
                    var gold = selComData.money;
                    goldValue.setString(Helper.formatNum(gold));
                    if(curLevel < GLOBALDATA.base.lev*10 + 1){
                        if(gold < GLOBALDATA.base.money){
                            goldValue.setColor(cc.color.GREEN);
                        }else{
                            goldValue.setColor(cc.color.RED);
                        }
                        noLevelUp.setVisible(false);
                        imgGold.setVisible(true);
                        upGradeButton.setTouchEnabled(true);
                        upGradeButton.setBright(true);
                        upGradeButton.setVisible(true);
                    }else{
                        //goldValue.setColor(cc.color(255,36,0));
                        noLevelUp.setVisible(true);
                        imgGold.setVisible(false);
                        upGradeButton.setTouchEnabled(false);//按钮禁用
                        upGradeButton.setBright(false);//按钮禁用状态图片显示效果
                        upGradeButton.setVisible(true);
                    }
                    break;
                case ccui.CheckBox.EVENT_SELECTED:
                    this.select = true;
                    var gold = 0;
                    for(var i=1;i<11;i++){
                        gold += COMDERSKILLCONSUMECFG[selComData.id + i].money;
                    }
                    goldValue.setString(Helper.formatNum(gold));
                    if(curLevel < GLOBALDATA.base.lev * 10 + 1){
                        upGradeButton.setTouchEnabled(true);//按钮禁用
                        upGradeButton.setBright(true);//按钮禁用状态图片显示效果
                        upGradeButton.setVisible(true);
                        if(gold < GLOBALDATA.base.money){
                            goldValue.setColor(cc.color.GREEN);
                        }else{
                            goldValue.setColor(cc.color.RED);
                        }
                    }else{
                        goldValue.setColor(cc.color.RED);
                        upGradeButton.setTouchEnabled(false);//按钮禁用
                        upGradeButton.setBright(false);//按钮禁用状态图片显示效果
                        upGradeButton.setVisible(true);
                    }
                    break;
                default:
                    break;
            };
        }, this);
    },

    //点击升级按钮
    skillLevelUp: function (sender, type) {
        if (ccui.Widget.TOUCH_ENDED == type) {
            if(!this.canClick) return;
            this.canClick = false;
            var skillId = this.comSkillArray[this.skillList.getCurSelectedIndex()];
            this.fightNumRoot = ccsTool.load(res.uiFightNumLayer, ["Text_war", "lblMilitaryStre"]);
            this.index = this.skillList.getCurSelectedIndex();
            var solNum = 0;
            //solNum是为了显示飘字效果
            for (var i = 0; i < GLOBALDATA.army.battle.length; i++) {
                if (GLOBALDATA.army.battle[i] > 0) {
                    solNum++;
                }
            }
            this.skill = skillId;
            for (var key in COMDERSKILLCONSUMECFG) {
                if (COMDERSKILLCONSUMECFG[key].pos == skillId && COMDERSKILLCONSUMECFG[key].lev ==
                    this.commander.s[skillId]) {
                    var upComData = COMDERSKILLCONSUMECFG[key];
                }
            }
            if (skillId == 101 && this.cbLevelUp.isSelected()) {
                //this.skillAttr = COMMANDERSKILLCFG[101];
                this.skillAttr = COMMANDERSKILLCFG[upComData.pos];
                if ((GLOBALDATA.base.lev * 10 + 1) - this.commander.s[skillId] >= 10) {
                    var gold = 0;
                    if(this.commander.s[skillId]+10 > COMMANDERSKILLCFG[skillId].mostlv){
                        for(var k=0;k<COMMANDERSKILLCFG[skillId].mostlv-this.commander.s[skillId];k++){
                            gold += COMDERSKILLCONSUMECFG[upComData.id + i].money;
                        }
                    }else{
                        for (var i = 0; i < 10; i++) {
                            gold += COMDERSKILLCONSUMECFG[upComData.id + i].money;
                        }
                    }
                    if (gold < GLOBALDATA.base.money) {
                        if(this.commander.s[skillId]+10 > COMMANDERSKILLCFG[skillId].mostlv){
                            var comAttr = COMDERSKILLCONSUMECFG[upComData.id + (COMMANDERSKILLCFG[skillId].mostlv-this.commander.s[skillId])].data;
                        }else{
                            var comAttr = COMDERSKILLCONSUMECFG[upComData.id + 10].data;
                        }
                        //var comAttr = COMDERSKILLCONSUMECFG[upComData.id + 10].data;
                        var atkAttr = comAttr[2] - upComData.data[2];
                        this.oldPower = getCommanderPower();
                        if(this.commander.s[skillId]+10 > COMMANDERSKILLCFG[skillId].mostlv){
                            commanderModel.sillLevelUp(parseInt(this.commanderId), skillId, 0, COMMANDERSKILLCFG[skillId].mostlv-this.commander.s[skillId]);
                        }else{
                            commanderModel.sillLevelUp(parseInt(this.commanderId), skillId, 0, 10);
                        }

                        for (var j = 0; j < solNum; j++) {
                            ShowTipsTool.TipsFromText("+" + atkAttr + COMMANDERSKILLCFG[skillId].uidescrible, cc.color.GREEN, 30);
                        }
                    } else {
                        var gold = upComData.money;
                        var levelCan = 0;
                        for (var j = 0; j < 10; j++) {
                            if (GLOBALDATA.base.money < gold) {
                                break;
                            }
                            gold += COMDERSKILLCONSUMECFG[upComData.id + j].money;
                            levelCan++;
                        }
                        if (levelCan == 0) {
                            ShowTipsTool.TipsFromText(STRINGCFG[100010].string, cc.color.RED, 30);//金币不足提示
                            this.canClick = true;
                        } else {
                            var atkAttr = COMDERSKILLCONSUMECFG[upComData.id + levelCan].data[2] - upComData.data[2];
                            this.oldPower = getCommanderPower();
                            commanderModel.sillLevelUp(parseInt(this.commanderId), skillId, 0, levelCan);
                            for (var j = 0; j < solNum; j++) {
                                ShowTipsTool.TipsFromText("+" + atkAttr + COMMANDERSKILLCFG[skillId].uidescrible, cc.color.GREEN, 30);
                            }
                        }
                    }
                } else {
                    if((GLOBALDATA.base.lev * 10 + 1)>COMMANDERSKILLCFG[skillId].mostlv){
                        var levelCan = COMMANDERSKILLCFG[skillId].mostlv - this.commander.s[skillId];
                    }else{
                        var levelCan = (GLOBALDATA.base.lev * 10 + 1) - this.commander.s[skillId];
                    }

                    var gold = 0;
                    for (var i = 0; i < levelCan; i++) {
                        gold += COMDERSKILLCONSUMECFG[upComData.id + i].money;
                    }
                    if (gold < GLOBALDATA.base.money) {
                        var atkAttr = COMDERSKILLCONSUMECFG[upComData.id + levelCan].data[2] - upComData.data[2];
                        this.oldPower = getCommanderPower();
                        commanderModel.sillLevelUp(parseInt(this.commanderId), skillId, 0, levelCan);
                        for (var j = 0; j < solNum; j++) {
                            ShowTipsTool.TipsFromText("+" + atkAttr + COMMANDERSKILLCFG[skillId].uidescrible, cc.color.GREEN, 30);
                        }
                    } else {
                        var _levelCan = 0;
                        var _gold = COMDERSKILLCONSUMECFG[upComData.id].money;
                        for (var x = 0; x < levelCan; x++) {
                            if (GLOBALDATA.base.money < _gold) {
                                break;
                            }
                            _gold += COMDERSKILLCONSUMECFG[upComData.id + x].money;
                            _levelCan++;
                        }
                        if (_levelCan == 0) {
                            ShowTipsTool.TipsFromText(STRINGCFG[100010].string, cc.color.RED, 30);//金币不足提示
                            this.canClick = true;
                        } else {
                            var atkAttr = COMDERSKILLCONSUMECFG[upComData.id + _levelCan].data[2] - upComData.data[2];
                            this.oldPower = getCommanderPower();
                            commanderModel.sillLevelUp(parseInt(this.commanderId), skillId, 0, _levelCan);
                            for (var j = 0; j < solNum; j++) {
                                ShowTipsTool.TipsFromText("+" + atkAttr + COMMANDERSKILLCFG[skillId].uidescrible, cc.color.GREEN, 30);
                            }
                        }
                    }
                }
            } else {
                var gold = upComData.money;
                if (gold < GLOBALDATA.base.money) {
                    this.oldPower = 0;
                    this.oldPower = getCommanderPower();
                    commanderModel.sillLevelUp(parseInt(this.commanderId), skillId, 0, 1);
                    //var comAttr = upComData.data;
                    if (this.passivityArray.indexOf(skillId) >= 0) {
                        //var hpVal = 0, atkVal = 0, defVal = 0, baseCritVal = 0, baseHitVal = 0, baseMissVal = 0;
                        for (var i = 0; i < GLOBALDATA.army.battle.length; i++) {
                            var _hpVal = 0, _atkVal = 0, _defVal = 0, _baseCritVal = 0, _baseHitVal = 0, _baseMissVal = 0;
                            var id = GLOBALDATA.army.battle[i];
                            if (id > 0) {
                                var soldier = GLOBALDATA.soldiers[id];
                                var equlist = GLOBALDATA.army.equips[i];
                                var depotData = GLOBALDATA.depot;
                                var commanderData = GLOBALDATA.commanders[GLOBALDATA.army.commander];
                                var teamlist = GLOBALDATA.army.battle.concat(GLOBALDATA.army.companion);
                                var attr = new heroAttr(soldier.p, soldier.l, soldier.q, soldier.m, soldier.w, soldier.sq, soldier.eq, equlist, depotData, commanderData, teamlist);

                                switch (COMMANDERSKILLCFG[upComData.pos].attributeid) {
                                    case 1:
                                        if (upComData.promote[0] == 1 || upComData.promote[0] == 3) {
                                            ShowTipsTool.TipsFromText("+" + upComData.promote[1] + COMMANDERSKILLCFG[skillId].uidescrible, cc.color.GREEN, 30);
                                        } else if (upComData.promote[0] == 2) {
                                            _hpVal += attr.getHp();
                                            var attrValue = parseInt(_hpVal * upComData.promote[1] / 10000);
                                            ShowTipsTool.TipsFromText("+" + attrValue + COMMANDERSKILLCFG[skillId].uidescrible, cc.color.GREEN, 30);
                                        }
                                        break;
                                    case 2:
                                        if (upComData.promote[0] == 1 || upComData.promote[0] == 3) {
                                            ShowTipsTool.TipsFromText("+" + upComData.promote[1] + COMMANDERSKILLCFG[skillId].uidescrible, cc.color.GREEN, 30);
                                        } else if (upComData.promote[0] == 2) {
                                            _atkVal += attr.getAtk();
                                            var attrValue = parseInt(_atkVal * upComData.promote[1] / 10000);
                                            ShowTipsTool.TipsFromText("+" + attrValue + COMMANDERSKILLCFG[skillId].uidescrible, cc.color.GREEN, 30);
                                        }
                                        break;
                                    case 3:
                                        if (upComData.promote[0] == 1 || upComData.promote[0] == 3) {
                                            ShowTipsTool.TipsFromText("+" + upComData.promote[1] + COMMANDERSKILLCFG[skillId].uidescrible, cc.color.GREEN, 30);
                                        } else if (upComData.promote[0] == 2) {
                                            _defVal += attr.getDef();
                                            var attrValue = parseInt(_defVal * upComData.promote[1] / 10000);
                                            ShowTipsTool.TipsFromText("+" + attrValue + COMMANDERSKILLCFG[skillId].uidescrible, cc.color.GREEN, 30);
                                        }
                                        break;
                                    case 14://重伤
                                        if (upComData.promote[0] == 1 || upComData.promote[0] == 3) {
                                            ShowTipsTool.TipsFromText("+" + upComData.promote[1] + COMMANDERSKILLCFG[skillId].uidescrible, cc.color.GREEN, 30);
                                        } else if (upComData.promote[0] == 2) {
                                            _baseCritVal += attr.getBaseCrit();
                                            var attrValue = parseInt(_baseCritVal * upComData.promote[1] / 10000);
                                            ShowTipsTool.TipsFromText("+" + attrValue + COMMANDERSKILLCFG[skillId].uidescrible, cc.color.GREEN, 30);
                                        }
                                        break;
                                    case 17://命中
                                        if (upComData.promote[0] == 1 || upComData.promote[0] == 3) {
                                            ShowTipsTool.TipsFromText("+" + upComData.promote[1] + COMMANDERSKILLCFG[skillId].uidescrible, cc.color.GREEN, 30);
                                        } else if (upComData.promote[0] == 2) {
                                            _baseHitVal += attr.getbasehit();
                                            var attrValue = parseInt(_baseHitVal * upComData.promote[1] / 10000);
                                            ShowTipsTool.TipsFromText("+" + attrValue + COMMANDERSKILLCFG[skillId].uidescrible, cc.color.GREEN, 30);
                                        }
                                        break;
                                    case 18://闪避
                                        if (upComData.promote[0] == 1 || upComData.promote[0] == 3) {
                                            ShowTipsTool.TipsFromText("+" + upComData.promote[1] + COMMANDERSKILLCFG[skillId].uidescrible, cc.color.GREEN, 30);
                                        } else if (upComData.promote[0] == 2) {
                                            _baseMissVal += attr.getbasemiss();
                                            var attrValue = parseInt(_baseMissVal * upComData.promote[1] / 10000);
                                            ShowTipsTool.TipsFromText("+" + attrValue + COMMANDERSKILLCFG[skillId].uidescrible, cc.color.GREEN, 30);
                                        }
                                        break;
                                    default:
                                        break;
                                }
                            }
                        }
                    }
                    this.skillAttr = COMMANDERSKILLCFG[upComData.pos];
                } else {
                    ShowTipsTool.TipsFromText(STRINGCFG[100010].string, cc.color.RED, 30);//金币不足提示
                    this.canClick = true;
                }
            }
        }
    },

    //战力加成显示函数
    powerShow:function(){
        var newPower = getCommanderPower();
        if(newPower - this.oldPower == 0){
            this.fightNumRoot.wgt.Text_war.setString("+" + Math.ceil(newPower - this.oldPower + 1));
        }else if(newPower - this.oldPower > 0){
            this.fightNumRoot.wgt.Text_war.setString("+" + Math.ceil(newPower - this.oldPower));
        }
        this.fightNumRoot.wgt.lblMilitaryStre.setString(Math.ceil(newPower));
        var seq = cc.sequence(cc.delayTime(1),
            cc.spawn(cc.moveBy(1, cc.p(0, 150)),
                cc.fadeOut(1)),
            cc.removeSelf(true));
        this.fightNumRoot.node.runAction(seq);
    },
//*****************************************************************************************************
    //军衔界面的编码
    /*updateRank:function () {
     //指挥官军衔界面ui资源的加载
     this.militaryRankLayer = ccsTool.seekWidget(this.commanderRoot.wgt.FileNode_2, ['lifeAddPercent', 'toLifeAddPercent',
     'defenseAddPercent', 'toDefenseAddPercent', 'attackAddPercent', 'toAttackAddPercent', 'blessLoadingBar',
     'blessValue', 'rankRate', 'advanceButton', 'autoAdvanceButton', 'curRank', 'toRank', 'stopBtn']);

     //获取进阶按钮，并添加触摸事件
     this.advanceButton = this.militaryRankLayer.wgt.advanceButton;
     this.advanceButton.addTouchEventListener(this.touchEvent,this);
     //获取自动进阶按钮，并添加触摸事件
     this.autoAdvanceButton = this.militaryRankLayer.wgt.autoAdvanceButton;
     this.autoAdvanceButton.addTouchEventListener(this.touchEvent,this);
     //停止按钮事件
     this.stopBtn = this.militaryRankLayer.wgt.stopBtn;
     this.stopBtn.addTouchEventListener(this.stopEvent, this);

     this.isRankInit = true;
     var rankLv = this.commander.mr;
     var curRank = Helper.findCmdRankById(rankLv);//当前等级的军衔名称
     var toRank = Helper.findCmdRankById(rankLv+1);//下一个等级的军衔名称
     //军衔名
     this.militaryRankLayer.wgt.curRank.setString(curRank.armyrankname);
     this.militaryRankLayer.wgt.toRank.setString(toRank.armyrankname);
     //当前属性加成
     this.militaryRankLayer.wgt.lifeAddPercent.setString(this.CalcRankAdd(curRank,1));
     this.militaryRankLayer.wgt.defenseAddPercent.setString(this.CalcRankAdd(curRank,3));
     this.militaryRankLayer.wgt.attackAddPercent.setString(this.CalcRankAdd(curRank,2));
     //升级后属性加成
     this.militaryRankLayer.wgt.toLifeAddPercent.setString(this.CalcRankAdd(toRank,1));
     this.militaryRankLayer.wgt.toDefenseAddPercent.setString(this.CalcRankAdd(toRank,3));
     this.militaryRankLayer.wgt.toAttackAddPercent.setString(this.CalcRankAdd(toRank,2));

     //更新进度条
     this.militaryRankLayer.wgt.blessLoadingBar.setPercent(Math.round(this.commander.mrb/curRank.mostvalue*100));
     this.militaryRankLayer.wgt.blessValue.setString(this.commander.mrb+'/'+curRank.mostvalue);


     var curStage = 1;
     for(var i=1;i<=6;i++){
     if(this.commander.mrn<curRank['stage'+i+'_num']){
     curStage = i-1;
     break;
     }
     }
     if(curStage==0){
     curStage = 1;
     }
     this.militaryRankLayer.wgt.rankRate.setString(curRank['stage'+curStage+'_describle']);
     this.militaryRankLayer.wgt.rankRate.setColor(this.rankColor[curStage-1]);
     //判断金币是否够
     },
     //计算军衔加成
     CalcRankAdd:function (armyrankAtt,attid) {
     //attid 1为生命  2为攻击 3为防御
     var str = "";
     if(armyrankAtt != null){
     for(var key in armyrankAtt.add){
     var att = armyrankAtt.add[key];
     if(att[0] == attid){
     if(att[1] == 1){  //直接增加
     str = att[2];
     }else if(att[1] == 2){  //百分比增加
     str = Math.round(att[2]/10000*100)+"%";
     }
     }
     }
     }
     return str;
     },

     //军衔界面点击自动进阶按钮时停止按钮的显示与隐藏
     stopEvent:function(sender, type){
     if(ccui.Widget.TOUCH_ENDED == type){
     if(this.isAutoRank == true){
     this.isAutoRank = false;
     this.advanceButton.setVisible(true);
     this.autoAdvanceButton.setVisible(true);
     this.stopBtn.setVisible(false);
     }else{
     this.advanceButton.setVisible(true);
     this.autoAdvanceButton.setVisible(true);
     this.stopBtn.setVisible(false);
     }
     }
     },*/

    //******************************************************************************************
    //载具界面的编码
    //载具界面的初始化及数据的显示
    initVehicle: function () {
        if (this.vehicleArray.length != 0) {//数组清空
            this.vehicleArray.length = 0;
        }
        if (this.carryList != null) {//列表清空
            this.carryList.removeAllItems();
        }

        //策划要求 此按钮暂时屏蔽
        this.commanderRoot.wgt.carryCheckButton.setVisible(true);
        this.commanderRoot.wgt.carryCheckButton.addTouchEventListener(this.carCheckEvent, this);//切换按钮事件

        this._navarVehicle = ccsTool.load(res.uiNaVehicleItem, ['carryItem', 'img_Gold', 'gold_value', 'herolev',
            'textAlready', 'upCarryButton', 'carhurtAdd', 'getCarryButton', 'textNo', 'maxCarryButton', 'textNmax',
            'useCarryButton', 'CarryIcon', 'CarryBg', 'carryName', 'carryLv', 'carryState', 'studiedButton']);//加载载具信息item节点

        for(var vehicleObj in this.commander.ws){
            var vehicleItem = this._navarVehicle.wgt.carryItem.clone();
            vehicleItem.setName(vehicleObj);
            vehicleItem.setTag(VEHICLECFG[vehicleObj].commanderskillid);
            this.carryList.pushBackCustomItem(vehicleItem);
            var navarVehicle = ccsTool.seekWidget(vehicleItem, ['carryItem', 'img_Gold', 'gold_value', 'herolev',
                'textAlready', 'upCarryButton', 'carhurtAdd', 'getCarryButton', 'textNo', 'maxCarryButton', 'textNmax',
                'useCarryButton', 'CarryIcon', 'CarryBg', 'carryName', 'carryLv', 'carryState', 'studiedButton']);//加载载具信息item节点
            if(this.commander.w == vehicleObj){
                this.commanderRoot.wgt.carryName.setString(VEHICLECFG[vehicleObj].vehiclename);
            }
            navarVehicle.wgt.studiedButton.setUserData("guid_studiedButton_"+vehicleObj);
            navarVehicle.wgt.carryName.setString(VEHICLECFG[vehicleObj].vehiclename);//载具名称
            var desc = StringFormat(STRINGCFG[100084].string, this.commander.s[VEHICLECFG[vehicleObj].commanderskillid]);
            navarVehicle.wgt.carryLv.setString(desc);
            //navarVehicle.wgt.carryLv.setString("等级：" + this.commander.ws[vehicleObj]);//载具等级
            cc.spriteFrameCache.addSpriteFrames(res.ui_skill_plist);
            //载具的图标
            navarVehicle.wgt.CarryIcon.loadTexture("common/j/"+COMMANDERSKILLCFG[VEHICLECFG[vehicleObj].commanderskillid].icon, ccui.Widget.PLIST_TEXTURE);
            //载具的描述
            for(var key in COMDERSKILLCONSUMECFG){
                if(COMDERSKILLCONSUMECFG[key].pos == VEHICLECFG[vehicleObj].commanderskillid && COMDERSKILLCONSUMECFG[key].lev
                == this.commander.s[VEHICLECFG[vehicleObj].commanderskillid]){
                    this.vehAttr = COMDERSKILLCONSUMECFG[key];
                    break;
                }
            }
            if(this.commander.s[VEHICLECFG[vehicleObj].commanderskillid]==0){
                if(this.vehAttr.data[1] == 1 || this.vehAttr.data[1] == 3){
                    var attrValue = (this.commander.ws[vehicleObj]+1)*this.vehAttr.data[2];
                    var describle = StringFormat(COMMANDERSKILLCFG[VEHICLECFG[vehicleObj].commanderskillid].describle,attrValue);
                    navarVehicle.wgt.carhurtAdd.setString('+'+this.vehAttr.promote[1]+COMMANDERSKILLCFG[VEHICLECFG[vehicleObj].commanderskillid].uidescrible);
                }else{
                    //var attrValue = (this.commander.ws[vehicleObj]+1)*promotevalue_base[2]/100+"%";
                    var attrValue = COMDERSKILLCONSUMECFG[this.vehAttr.id + 1].data[2]/100 + "%";
                    var describle = StringFormat(COMMANDERSKILLCFG[VEHICLECFG[vehicleObj].commanderskillid].describle,attrValue);
                    navarVehicle.wgt.carhurtAdd.setString('+'+ this.vehAttr.promote[1]/100+"%"+COMMANDERSKILLCFG[VEHICLECFG[vehicleObj].commanderskillid].uidescrible);
                }
            }else{
                if(this.vehAttr.data[1] == 1 || this.vehAttr.data[1] == 3){
                    //var attrValue = (this.commander.ws[vehicleObj])*promotevalue_base[2];
                    var attrValue = COMDERSKILLCONSUMECFG[this.vehAttr.id].data[2]/100 + "%";
                    var describle = StringFormat(COMMANDERSKILLCFG[VEHICLECFG[vehicleObj].commanderskillid].describle,attrValue);
                    navarVehicle.wgt.carhurtAdd.setString('+'+this.vehAttr.promote[1]+COMMANDERSKILLCFG[VEHICLECFG[vehicleObj].commanderskillid].uidescrible);
                }else{
                    //var attrValue = (this.commander.ws[vehicleObj])*promotevalue_base[2]/100+"%";
                    var attrValue = COMDERSKILLCONSUMECFG[this.vehAttr.id].data[2]/100 + "%";
                    var describle = StringFormat(COMMANDERSKILLCFG[VEHICLECFG[vehicleObj].commanderskillid].describle,attrValue);
                    navarVehicle.wgt.carhurtAdd.setString('+'+this.vehAttr.promote[1]/100 + "%"+COMMANDERSKILLCFG[VEHICLECFG[vehicleObj].commanderskillid].uidescrible);
                }
            }
            navarVehicle.wgt.carryState.setString(STRINGCFG[100004].string + COMMANDERSKILLCFG[VEHICLECFG[vehicleObj].commanderskillid].commanderskillname + describle);

            //载具按钮显示状态的判断
            if(this.commander.ws[vehicleObj] >= 0){
                if(this.commander.s[VEHICLECFG[vehicleObj].commanderskillid] == 0){
                    navarVehicle.wgt.maxCarryButton.setVisible(false);
                    navarVehicle.wgt.upCarryButton.setTouchEnabled(false);
                    navarVehicle.wgt.upCarryButton.setVisible(false);
                    navarVehicle.wgt.getCarryButton.setVisible(false);
                    navarVehicle.wgt.studiedButton.setVisible(true);
                    navarVehicle.wgt.img_Gold.setVisible(true);
                    navarVehicle.wgt.herolev.setVisible(false);
                    if(GLOBALDATA.base.money > this.vehAttr.money){
                        navarVehicle.wgt.gold_value.setString(Helper.formatNum(this.vehAttr.money));
                        navarVehicle.wgt.gold_value.setColor(cc.color.GREEN);
                    }else{
                        navarVehicle.wgt.gold_value.setString(Helper.formatNum(this.vehAttr.money));
                        navarVehicle.wgt.gold_value.setColor(cc.color.RED);
                    }
                }else{
                    if(this.commander.s[VEHICLECFG[vehicleObj].commanderskillid] >= COMMANDERSKILLCFG[VEHICLECFG[vehicleObj].commanderskillid].mostlv){
                        navarVehicle.wgt.maxCarryButton.setVisible(true);
                        navarVehicle.wgt.upCarryButton.setTouchEnabled(false);
                        navarVehicle.wgt.upCarryButton.setVisible(false);
                        navarVehicle.wgt.getCarryButton.setVisible(false);
                        navarVehicle.wgt.studiedButton.setVisible(false);
                        navarVehicle.wgt.img_Gold.setVisible(false);
                        navarVehicle.wgt.herolev.setVisible(false);
                    }else{
                        //GLOBALDATA.base.lev > this.vehAttr.lev_req/10
                        if(this.commander.s[this.vehAttr.pos_req] >= this.vehAttr.lev_req){
                            navarVehicle.wgt.img_Gold.setVisible(true);
                            navarVehicle.wgt.herolev.setVisible(false);
                            if(GLOBALDATA.base.money > this.vehAttr.money){
                                navarVehicle.wgt.gold_value.setString(Helper.formatNum(this.vehAttr.money));
                                navarVehicle.wgt.gold_value.setColor(cc.color.GREEN);
                            }else{
                                navarVehicle.wgt.gold_value.setString(Helper.formatNum(this.vehAttr.money));
                                navarVehicle.wgt.gold_value.setColor(cc.color.RED);
                            }
                            navarVehicle.wgt.upCarryButton.setVisible(true);
                            navarVehicle.wgt.upCarryButton.setTouchEnabled(true);
                            navarVehicle.wgt.upCarryButton.setBright(true);
                            navarVehicle.wgt.getCarryButton.setVisible(false);
                            navarVehicle.wgt.studiedButton.setVisible(false);
                            //navarVehicle.wgt.useCarryButton.setVisible(false);
                            navarVehicle.wgt.textNo.setVisible(false);
                        }else{
                            navarVehicle.wgt.img_Gold.setVisible(false);
                            navarVehicle.wgt.herolev.setVisible(true);
                            var desc = StringFormat(STRINGCFG[100047].string, COMMANDERSKILLCFG[this.vehAttr.pos_req].commanderskillname + this.vehAttr.lev_req);
                            navarVehicle.wgt.herolev.setString(desc);
                            //navarVehicle.wgt.herolev.
                            navarVehicle.wgt.img_Gold.setVisible(false);
                            navarVehicle.wgt.upCarryButton.setVisible(true);
                            navarVehicle.wgt.upCarryButton.setTouchEnabled(false);
                            navarVehicle.wgt.upCarryButton.setBright(false);
                            navarVehicle.wgt.getCarryButton.setVisible(false);
                            //navarVehicle.wgt.useCarryButton.setVisible(false);
                            navarVehicle.wgt.textNo.setVisible(false);
                            navarVehicle.wgt.studiedButton.setVisible(false);
                        }
                    }
                }
            }

            navarVehicle.wgt.upCarryButton.addTouchEventListener(this.vehicleEvent, this);
            navarVehicle.wgt.getCarryButton.addTouchEventListener(this.vehicleEvent, this);
            navarVehicle.wgt.maxCarryButton.addTouchEventListener(this.vehicleEvent, this);
            navarVehicle.wgt.useCarryButton.addTouchEventListener(this.vehicleEvent, this);
            navarVehicle.wgt.studiedButton.addTouchEventListener(this.vehicleEvent, this);
        }
    },

    //切换事件函数显示
    /*carCheckEvent: function (sender, type) {
        if (ccui.Widget.TOUCH_ENDED == type) {
            //var useCarryBtn = ccui.helper.seekWidgetByName(this.navarVehicleItem, "useCarryButton");
            this.commanderRoot.wgt.carryCheckButton.setVisible(false);
            this.commanderRoot.wgt.carryNoButton.setVisible(true);
            this.commanderRoot.wgt.carryNoButton.addTouchEventListener(this.cancelEvent, this);//取消按钮事件
            var cout= 0;
            for (var key in this.commander.ws) {//循环遍历载具数组
                if (this.commander.ws[key] == 0) {//筛选出未激活的载具
                    this.carryList.removeItem(this.carryList.getItem(cout));
                } else {
                    //激活按钮的状态判断
                    var vehicleItem = this.carryList.getItem(cout);
                    var navarVehicle = ccsTool.seekWidget(vehicleItem, ['carryItem', 'img_Gold', 'gold_value', 'herolev',
                        'textAlready', 'upCarryButton', 'carhurtAdd', 'getCarryButton', 'textNo', 'maxCarryButton', 'textNmax',
                        'useCarryButton', 'CarryIcon', 'CarryBg', 'carryName', 'carryLv', 'carryState', 'studiedButton']);//加载载具信息item节点
                    if (this.commander.w == key) {
                        navarVehicle.wgt.textAlready.setVisible(true);
                        navarVehicle.wgt.upCarryButton.setVisible(false);
                        navarVehicle.wgt.getCarryButton.setVisible(false);
                        navarVehicle.wgt.maxCarryButton.setVisible(false);
                        navarVehicle.wgt.useCarryButton.setVisible(false);
                    }else{
                        navarVehicle.wgt.textAlready.setVisible(false);
                        navarVehicle.wgt.upCarryButton.setVisible(false);
                        navarVehicle.wgt.getCarryButton.setVisible(false);
                        navarVehicle.wgt.maxCarryButton.setVisible(false);
                        navarVehicle.wgt.useCarryButton.setVisible(true);
                    }
                }
                cout++;
            }
        }
    },*/

    //载具的点击响应事件
    vehicleEvent: function (sender, type) {
        if (ccui.Widget.TOUCH_ENDED == type) {
            if(!this.canClick) return;
            this.canClick = false;
            switch (sender.name) {
                //载具升级
                case 'upCarryButton':
                case 'studiedButton':
                    var vehicle = this.carryList.getItem(this.carryList.getCurSelectedIndex()).getName();
                    //var promotevalue_base = COMMANDERSKILLCFG[VEHICLECFG[vehicle].commanderskillid].promotevalue_base;
                    //var vehSkillId = this.carryList.getItem(this.carryList.getCurSelectedIndex()).getTag();
                    for(var key in COMDERSKILLCONSUMECFG){
                        if(COMDERSKILLCONSUMECFG[key].pos == VEHICLECFG[vehicle].commanderskillid && COMDERSKILLCONSUMECFG[key].lev
                            == this.commander.s[VEHICLECFG[vehicle].commanderskillid]){
                            var _vehAttr = COMDERSKILLCONSUMECFG[key];
                            break;
                        }
                    }
                    if(_vehAttr.money <  GLOBALDATA.base.money){
                        this.skillAttr = COMMANDERSKILLCFG[VEHICLECFG[vehicle].commanderskillid];
                        this.skill = VEHICLECFG[vehicle].commanderskillid;
                        commanderModel.sillLevelUp(parseInt(this.commanderId), VEHICLECFG[vehicle].commanderskillid, 0, 1);
                        //commanderModel.vehicleUp(parseInt(this.commanderId), vehicle);
                        ShowTipsTool.TipsFromText(VEHICLECFG[vehicle].vehiclename + "+" + _vehAttr.promote[1] +
                            COMMANDERSKILLCFG[VEHICLECFG[vehicle].commanderskillid].uidescrible, cc.color.GREEN, 30);
                    }else{
                        ShowTipsTool.TipsFromText(STRINGCFG[100010].string, cc.color.RED, 30);//金币不足提示
                        this.canClick = true;
                    }
                    break;
                //载具获取
                case 'getCarryButton':
                    //要跳转到获取载具界面，策划暂时没有做这个系统功能

                    cc.log("nihao");
                    break;
                case 'maxCarryButton':
                    var vehicleIndex = this.carryList.getCurSelectedIndex();
                    cc.log("nihao1");
                    break;
                //载具使用
                case 'useCarryButton':
                    var vehicle = this.carryList.getItem(this.carryList.getCurSelectedIndex()).getName();
                    commanderModel.vehicleChange(parseInt(this.commanderId), vehicle);
                    break;
                default:
                    break;
            }
        }
    },

    //取消按钮事件
    /*cancelEvent: function (sender, type) {
        if (ccui.Widget.TOUCH_ENDED == type) {
            this.commanderRoot.wgt.carryCheckButton.setVisible(true);
            this.commanderRoot.wgt.carryNoButton.setVisible(false);
            this.carryList.removeAllItems();
            this.initVehicle();
        }
    },*/


//指挥官界面技能，军衔，载具界面相互切换按钮显示函数
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

    touchEvent: function (sender, type) {
        if(ccui.Widget.TOUCH_ENDED == type){
            switch (sender.name) {
                case 'btnClose'://点击关闭按钮
                    cc.log('buyBtn');
                    this.removeFromParent();
                    break;
                case 'btnSkill'://点击技能按钮
                    //this.pvContent.setCurrentPageIndex(0);
                    this.changeTabStatus(0);
                    this.commanderRoot.wgt.skill.setVisible(true);
                    this.commanderRoot.wgt.carrying.setVisible(false);
                    break;
                /*case 'btnRank'://点击军衔按钮
                 this.pvContent.setCurrentPageIndex(1);
                 this.changeTabStatus(1);
                 if(!this.isRankInit){
                 this.updateRank();
                 }
                 break;*/
                case 'btnCarry': //点击载具按钮
                    //this.pvContent.setCurPageIndex(1);
                    this.changeTabStatus(1);
                    this.commanderRoot.wgt.skill.setVisible(false);
                    this.commanderRoot.wgt.carrying.setVisible(true);
                    this.initVehicle();
                    break;
                /*case 'advanceButton'://点击军衔进阶按钮
                    //cc.log(123123);
                    this.isAutoRank = false;
                    commanderModel.rank(parseInt(this.commanderId),0);
                    break;
                case 'autoAdvanceButton'://点击军衔自动进阶按钮
                    this.isAutoRank = true;
                    if(this.isAutoRank == true){
                        this.advanceButton.setVisible(false);
                        this.autoAdvanceButton.setVisible(false);
                        this.stopBtn.setVisible(true);
                        commanderModel.rank(parseInt(this.commanderId),0);
                    }else{
                        ShowTipsTool.TipsFromText(STRINGCFG[100019].string,cc.color.RED,30);   //显示tips  100019 条件不足
                    }
                    break;*/
                default:
                    break;
            }
        }
    },


    onExit:function() {
        this._super();
        cc.eventManager.removeListener(this.evnSkillLevelUp);
        //cc.eventManager.removeListener(this.evnRankUp);
        cc.eventManager.removeListener(this.vehiclUpEvent);
        cc.eventManager.removeListener(this.vehicleChangeEvent);
    }
});