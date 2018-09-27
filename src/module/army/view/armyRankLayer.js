
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 /**
 * 士兵军衔层的创建
 * 这个层现在 暂时没有地方使用了
 */
var armyRankLayer = baseLayer.extend({
    totalRole:0,
    isAutoRank:false,
    ctor:function(index){
        this._super();
        this.LayerName = "armyRankLayer";
        this.index=index;
    },
    onEnter:function(){
        this._super();
        this.initUI();
        this.updateInfo();
        this.pvShowRole.setCurrentPageIndex(this.index);
        this.initCustomEvent();
    },
    initCustomEvent:function () {
        //军衔升级处理
        var self = this;
        this.evnArmyRankUp = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "soldier.evolve",
            callback: function(event){
                var resData = event.getUserData();
                if(resData.status!=0){//升级失败
                    self.isAutoRank = false;
                }else if(resData.status==0){
                    // 更新士兵信息
                    self.updateAttr();
                    if(resData.data.suc==1){//军衔进阶成功
                        self.isAutoRank = false;
                        ShowTipsTool.TipsFromText(STRINGCFG[100017].string,cc.color.ORANGE,30);   //显示tips  100017 军衔进阶成功
                    }else {//军衔添加祝福值成功
                        //提示
                        var strText = STRINGCFG[100018].string + " +" + resData.data.bless;   //100018 祝福值
                        ShowTipsTool.TipsFromText(strText,cc.color.RED,30);   //显示tips

                        if(self.isAutoRank){
                            self.scheduleOnce(function (dt) {
                                armyModel.rank(GLOBALDATA.army.battle[self.index]);
                            },0.5);
                        }
                    }
                }
            }
        });
        cc.eventManager.addListener(this.evnArmyRankUp, 1);
    },
    initUI:function(){
        this.uiArmyRankLayer = ccs.load(res.uiArmyRankLayer).node;
        this.uiArmyRankLayer.setPosition(cc.p(0, 105));
        this.addChild(this.uiArmyRankLayer);

        var B_backBtn = ccui.helper.seekWidgetByName(this.uiArmyRankLayer, "btnBack");
        B_backBtn.addTouchEventListener(this.backEvent, this);

        var btnRank = ccui.helper.seekWidgetByName(this.uiArmyRankLayer, "btnRank");
        btnRank.setBrightStyle(ccui.Widget.BRIGHT_STYLE_HIGH_LIGHT);
        btnRank.setTouchEnabled(false);

        //升级
        var breakBtn = ccui.helper.seekWidgetByName(this.uiArmyRankLayer, "btnUpLevel");
        breakBtn.addTouchEventListener(this.levelUpEvent, this);
        //突破
        var breakBtn = ccui.helper.seekWidgetByName(this.uiArmyRankLayer, "btnBreak");
        breakBtn.addTouchEventListener(this.breakEvent, this);
        //士兵展示pageView
        this.pvShowRole = ccui.helper.seekWidgetByName(this.uiArmyRankLayer, "pvShowRole");
        for (var i=0;i<9;i++){
            if (GLOBALDATA.army.battle[i]!=0&&GLOBALDATA.army.battle[i]!=-1){
                var layout = new ccui.Layout();
                layout.setContentSize(cc.size(640.0, 200.0));
                var solAttribute = Helper.findHeroById(GLOBALDATA.army.battle[i]);
                var hero = new Hero(solAttribute.armyid,0);
                hero.setScale(solAttribute.modelsize);
                layout.addChild(hero,10);
                hero.setPosition(cc.p(220,0));
                hero.actIdle();//英雄动作的创建

                this.pvShowRole.addPage(layout);
                this.totalRole++;
            }
        }
        var self = this;
        this.pvShowRole.addEventListener(function (sender, type) {
            self.index = sender.getCurPageIndex().valueOf();
            self.updateInfo();
            // cc.log('changeRole'+type+'curPageIndex=='+ sender.getCurPageIndex().valueOf()+'index='+self.index);
            // switch (type) {
            //     case ccui.PageView.EVENT_TURNING:
            //         cc.log('changeRole'+this.index);
            //         break;
            //     default:
            //         break;
            // }
        }, this);

        this.leftBtn = ccui.helper.seekWidgetByName(this.uiArmyRankLayer, "leftBtn");
        this.leftBtn.addTouchEventListener(this.leftEvent, this);

        this.rightBtn = ccui.helper.seekWidgetByName(this.uiArmyRankLayer, "rightBtn");
        this.rightBtn.addTouchEventListener(this.rightEvent, this);
        //士兵名称
        this.armyName = ccui.helper.seekWidgetByName(this.uiArmyRankLayer, "armyName");
        //军衔等级
        this.armyRankLevel = ccui.helper.seekWidgetByName(this.uiArmyRankLayer, "armyRankLevel");

        //军衔属性
        this.curRank = ccui.helper.seekWidgetByName(this.uiArmyRankLayer, "curRank");
        this.curAtk = ccui.helper.seekWidgetByName(this.uiArmyRankLayer, "curAtk");
        this.curHp = ccui.helper.seekWidgetByName(this.uiArmyRankLayer, "curHp");
        this.curDef = ccui.helper.seekWidgetByName(this.uiArmyRankLayer, "curDef");
        this.upRank = ccui.helper.seekWidgetByName(this.uiArmyRankLayer, "upRank");
        this.upAtk = ccui.helper.seekWidgetByName(this.uiArmyRankLayer, "upAtk");
        this.upHp = ccui.helper.seekWidgetByName(this.uiArmyRankLayer, "upHp");
        this.upDef = ccui.helper.seekWidgetByName(this.uiArmyRankLayer, "upDef");
        //祝福进度
        this.rankLoadingBar = ccui.helper.seekWidgetByName(this.uiArmyRankLayer, "rankLoadingBar");
        this.rankValue = ccui.helper.seekWidgetByName(this.uiArmyRankLayer, "rankValue");

        //点击进阶按钮
        this.trainBtn = ccui.helper.seekWidgetByName(this.uiArmyRankLayer, "trainBtn");
        this.trainBtn.addTouchEventListener(this.armyRank, this);
        this.autoTrainBtn = ccui.helper.seekWidgetByName(this.uiArmyRankLayer, "autoTrainBtn");
        this.autoTrainBtn.addTouchEventListener(this.armyRank, this);
        this.stopBtn = ccui.helper.seekWidgetByName(this.uiArmyRankLayer, "stopBtn");
        this.stopBtn.addTouchEventListener(this.stopEvent, this);

    },
    backEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type){
            var evn = new cc.EventCustom('updateUI');
            evn.setUserData(this.index);
            cc.eventManager.dispatchEvent(evn);
            this.removeFromParent(true);
        }
    },
    armyRank:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type){
            switch (sender.name) {
                case 'trainBtn'://
                    this.isAutoRank = false;
                    armyModel.rank(GLOBALDATA.army.battle[this.index]);
                    break;
                case 'autoTrainBtn'://
                    armyModel.rank(GLOBALDATA.army.battle[this.index]);
                    this.isAutoRank = true;
                    if(this.isAutoRank == true) {
                        this.trainBtn.setVisible(false);
                        this.autoTrainBtn.setVisible(false);
                        this.stopBtn.setVisible(true);
                    }else{
                        ShowTipsTool.TipsFromText(STRINGCFG[100019].string,cc.color.YELLOW,30);   //显示tips  100019 条件不足
                    }
                    break;
                default:
                    break;
            }
        }
    },
    stopEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED == type){//判断条件不知
            if(this.isAutoRank == true) {
                this.isAutoRank = false;
                this.trainBtn.setVisible(true);
                this.autoTrainBtn.setVisible(true);
                this.stopBtn.setVisible(false);
            }else {
                this.trainBtn.setVisible(true);
                this.autoTrainBtn.setVisible(true);
                this.stopBtn.setVisible(false);
            }
        }
    },
    levelUpEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type){
            var levelUpLayer = new armyLevelUpLayer(this.index);
            this.getParent().addChild(levelUpLayer,2);
            this.removeFromParent(true);
        }
    },
    breakEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type){
            var breakLayer = new armyBreakLayer(this.index);
            this.getParent().addChild(breakLayer,2);
            this.removeFromParent(true);
        }
    },
    //左切换按钮事件
    leftEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type){
            this.index--;
            this.pvShowRole.setCurrentPageIndex(this.index);
            this.updateInfo();
        }
    },
    //右切换按钮事件
    rightEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type){
            this.index++;
            this.pvShowRole.setCurrentPageIndex(this.index);
            this.updateInfo();
        }
    },
    updateInfo:function () {
        //控制左右按钮显示隐藏
        if(this.index==0){
            this.leftBtn.setVisible(false);
        }else {
            this.leftBtn.setVisible(true);
        }
        if(this.index==this.totalRole-1){
            this.rightBtn.setVisible(false);
        }else {
            this.rightBtn.setVisible(true);
        }

        //更新士兵名称
        var armyId = GLOBALDATA.army.battle[this.index];
        var armyInfo = GLOBALDATA.soldiers[armyId];
        var hero = Helper.findHeroById(armyId);
        this.armyName.setString(hero.armyname);
        var armyRank = Helper.findArmyRankById(armyInfo.q);
        this.armyRankLevel.setString(armyRank.armyrankname);

        // 更新属性
        this.updateAttr();
    },
    updateAttr:function () {
        var armyId = GLOBALDATA.army.battle[this.index];
        var armyInfo = GLOBALDATA.soldiers[armyId];
        var armyRank = Helper.findArmyRankById(armyInfo.q);
        var upArmyRank = Helper.findArmyRankById(armyInfo.q+1);

        this.curRank.setString(armyRank.armyrankname);
        this.curAtk.setString(STRINGCFG[100038].string+"："+this.CalcRankAdd(armyRank,2));  //100038 攻击加成
        this.curHp.setString(STRINGCFG[100037].string+"："+this.CalcRankAdd(armyRank,1));   //100037 生命加成
        this.curDef.setString(STRINGCFG[100039].string+"："+this.CalcRankAdd(armyRank,3));  //100039  防御加成
        this.upRank.setString(upArmyRank.armyrankname);
        this.upAtk.setString(STRINGCFG[100038].string+"："+this.CalcRankAdd(upArmyRank,2));  //100038 攻击加成
        this.upHp.setString(STRINGCFG[100037].string+"："+this.CalcRankAdd(upArmyRank,1));   //100037 生命加成
        this.upDef.setString(STRINGCFG[100039].string+"："+this.CalcRankAdd(upArmyRank,3));   //100039  防御加成

        this.rankValue.setString(armyInfo.qb+'/'+armyRank.mostvalue);
        this.rankLoadingBar.setPercent(Math.round(armyInfo.qb/armyRank.mostvalue*100));

    //    判断金币是否够

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
    onExit:function () {
        cc.eventManager.removeListener(this.evnArmyRankUp);
    }
});