
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
var combatLayer = baseLayer.extend({
    restrainRatioTable:[[1,1.5,0.5],[0.8,1,1.5],[1.5,1.2,1]],
    skillEnable:[true,true,true,true,true],
    //技能属性数组,分别为按钮对象，技能ID，技能类型，和索引值
    skillAttrArray:[],
    skillEffect:[false,false,false,false,false],
    comactiveskill:[],//主动技能数组
    benchIdx:[5,5],//替补下标，1：我家，2：敌军
    count : 0,
    touchPos : null,
    totalAtk:0,
    fortiArr:[],
    scrollBgTurn:false,
    //LayerName:"combatLayer",
    //combatType :
    //         战斗数据来源
    //         1按照等级和倍率计算
    //         2仅读取bossrate字段数值对应为血、攻和防御
    //         3服务器传输
    //         4客户端模拟
    //         5先读表后服务器传输
    //uniqueid:  stage表的uniqueid
    //evnName:战斗成功或失败后的事件类型
    //敌军数据
    ctor:function (combatType,uniqueid,evnName,enemyData) {
        //////////////////////////////
        // 1. super init first
        this._super();
        this.LayerName = "combatLayer";
        //改变
        this.uiAttributeLayer.setVisible(false);
        this.winSize = cc.winSize;
        //总关卡数
        this.totalLevel = 3;
        // this.enemyDisposal;
        this.loseDlginView = false;

        this.enemyDisposal = new Array(8);
        this.heroDisposal=new Array(8);

        this.combatType = combatType?combatType:null;
        this.uniqueid = uniqueid?uniqueid:null;
        this.evnName = evnName?evnName:null;
        this.enemyData = enemyData?enemyData:null;
        this.firstEnterStep();

        return true;
    },
    onEnter:function () {
        this._super();
        this.doAddEventListener();
    },
    doAddEventListener:function(){
        var self = this;
        this.stagepassEvn = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "stage.pass",
            callback: function(event){
                //金币
                self.goldValue.setString(Helper.formatNum(GLOBALDATA.base.money));
                //等级
                self.rankValue.setString(GLOBALDATA.base.lev);

                //经验
                var lvCfg = Helper.findLvCfgByLv(GLOBALDATA.base.lev);
                var _percentum = Math.round(GLOBALDATA.base.exp / lvCfg.roleexp * 100);
                self._LoadingBar.setPercent(_percentum);
                var Havexp = Helper.formatNum(GLOBALDATA.base.exp);
                var sumExp = Helper.formatNum(lvCfg.roleexp);
                self.Exp.setString(Havexp + "/" + sumExp);
                //更新连胜图标
                if(GLOBALDATA.base.wins<=self.totalLevel){
                    if(GLOBALDATA.base.wins>0){
                        self.picWins[GLOBALDATA.base.wins-1].setVisible(true);
                    }
                }
                // if(GLOBALDATA.base.wins==self.totalLevel){
                //     //    显示挑战boss按钮
                //     self.challengeBoss.setVisible(true);
                // }
            }
        });
        cc.eventManager.addListener(this.stagepassEvn, 1);

        //当指挥官技能等级为零时，点击学习按钮会触发本事件，主要是为了技能的显示
        this.updataInitUIevn = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "updataCombatLayerInitUIevn",
            callback: function(event){
                var index = event.getUserData();
                var skillButton = ccui.helper.seekWidgetByName(self.fightBottomNode, "skillButton"+index);
                var skiImage = ccui.helper.seekWidgetByName(self.fightBottomNode, "skiImage"+index+1);
                skiImage.setVisible(true);
                skiImage.loadTexture("common/j/" + COMMANDERSKILLCFG[self.comactiveskill[index-1]].icon, ccui.Widget.PLIST_TEXTURE);
                skillButton.setTouchEnabled(true);
                //skillButton.addTouchEventListener(self.touchEvent,self);
                //self.skillInit();
            }
        });
        cc.eventManager.addListener(this.updataInitUIevn, 1);

        //更改昵称事件
        this.upNickNameEvn = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName:"upNickName",
            callback: function(event){
                var resData = event.getUserData();
                self.nameText.setString(GLOBALDATA.name);
            }
        });
        cc.eventManager.addListener(this.upNickNameEvn, 1);

        this.skillUpdate = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "skillUpdate",
            callback:function(event){
                self.skillInit();
            }
        });
        cc.eventManager.addListener(this.skillUpdate, 1);

        //指挥官技能cd更新
        this.skillCdDelEvn = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName:"other.costcd",
            callback:function(event){
                var resData = event.getUserData();
                if(resData.status==0){
                    self.skillInit();
                }
            }
        });
        cc.eventManager.addListener(this.skillCdDelEvn, 1);

        //领取离线奖励
        this.getofflineprofit = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "role.getofflineprofit",
            callback: function(event){
                self.offlineAwardButton.setVisible(GLOBALDATA.extend.offline > 0);
            }
        });
        cc.eventManager.addListener(this.getofflineprofit, 1);

        //监听关闭失败弹框
        this.closeDefeatLayer = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "closeDefeatLayer",
            callback: function(event){
                // self.offlineAwardButton.setVisible(GLOBALDATA.extend.offline > 0);
                self.loseDlginView = false;
            }
        });
        cc.eventManager.addListener(this.closeDefeatLayer, 1);

        //补给箱
        this.appearSupplybox = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "supplybox.appear",
            callback: function(event){
                if (self.myLayer && !self.myLayer.getParent().curModule)
                {
                    if (self.supplyBoxNode)
                    {
                        self.supplyBoxNode.removeFromParent(true);
                        self.supplyBoxNode = null;
                    }
                    var supplyBox = ccs.load(res.effSupplyBox);
                    supplyBox.node.attr({x:cc.winSize.width-50,y:400});
                    self.myLayer.addChild(supplyBox.node, 1000);

                    var list = [cc.moveTo(10, cc.p(cc.winSize.width-50, cc.winSize.height - 300 + Math.random() * 200)),
                        cc.sequence(cc.moveTo(7.5, cc.p(cc.winSize.width / 2, cc.winSize.height - 300 + Math.random() * 200)),
                                    cc.moveTo(7.5, cc.p(cc.winSize.width-50, cc.winSize.height - 300 + Math.random() * 200)))
                        ];

                    var seq = cc.sequence(cc.moveTo(15, cc.p(50, cc.winSize.height - 300 + Math.random() * 200)),
                        list[Math.round(Math.random())],
                        cc.removeSelf(true));

                    supplyBox.node.runAction(seq);

                    self.supplyBoxNode = supplyBox.node;

                    var supplyButton = ccui.helper.seekWidgetByName(supplyBox.node, "supplyButton");//
                    supplyButton.addTouchEventListener(self.touchEvent, self);

                    supplyBox.action.play("boxAction", true);
                    supplyButton.runAction(supplyBox.action);
                }
            }
        });
        cc.eventManager.addListener(this.appearSupplybox, 1);

        // this.optListener = cc.EventListener.create({
        //     event: cc.EventListener.TOUCH_ONE_BY_ONE,
        //     swallowTouches: false,
        //     onTouchBegan: function(touch, event){
        //         if( self.skillEffect[0]){
        //             var rect = cc.rect(0, yBase+20, 640, 560);
        //             if (cc.rectContainsPoint(rect, touch.getLocation())) {
        //                 self.touchPos = touch.getLocation();
        //                 return true;
        //             }
        //         }
        //         return false;
        //     },
        //     onTouchMoved: function (touch, event) {
        //         if(self.skillEffect[0]){
        //             self.touchPos = touch.getLocation();
        //         }
        //     },
        //     onTouchEnded: function (touch, event) {
        //
        //     }
        // });
        // if(this.combatType){
        //     cc.eventManager.addListener(this.optListener, -101);
        // }else {
        //     cc.eventManager.addListener(this.optListener, -100);
        //
        // }

        //处理特殊的新手指引
        this.specialNewGuidEvent = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "special.NewGuid",
            callback: function(event){
                var userdata = event.getUserData();
                if(userdata.LayerName == self.LayerName){
                    self.touchPos = {};
                    self.touchPos.x = userdata.x;
                    self.touchPos.y = userdata.y;
                }
            }
        });
        cc.eventManager.addListener(this.specialNewGuidEvent, 1);

        // this.initUI();
        //this.MonitorStartTenPass();
        // this.addHero();
        // this.addEnemy();
        // this.addCmdOpt();
        // this.scheduleOnce(function () {
        //     this.startAtk();
        // },1);
    },
	EnterStep:function () {
        this.initData();
        this.updateUI();
        var delayTime = 0.2;
        if((this.combatType)||this.isBoss!=1){
            this.addHero();
        }
    },
	firstEnterStep:function () {
        this.initData();
        // this.updateUI();
        var delayTime = 0.2;
        if((this.combatType)||this.isBoss!=1){
            this.addHero();
        }
    },
    initData:function () {
        // this.curLevel =1;//连胜关卡变量
        this.stageLevel = null;//关卡波数

        //敌军数量
        this.isDefeat = false;
        //是否胜利
        this.isWin = false;
        //是否是boss
        this.isBoss = 0;//1=boss,0=非boss
        if(this.combatType){
            this.isBoss = 1;
        }
        this.stage = GLOBALDATA.base.stage;//当前关卡
        // this.stage = 'STAGE001';
        if(this.combatType){
            this.stageLevel=objClone(STAGECFG[this.uniqueid]);
            if(this.combatType==2&&this.enemyData&&this.enemyData.hp){
                for(var key in this.stageLevel.bossrate){
                    this.stageLevel.bossrate[key].push(this.stageLevel.bossrate[key][0]);
                    this.stageLevel.bossrate[key][0] = this.enemyData.hp;
                }
            }else if(this.combatType==4){
                if(this.enemyData){
                    this.stageLevel.bossid = this.enemyData.bossid;
                    this.stageLevel.bossrate = this.enemyData.bossrate;
                }
            }
        }else {
            //初始化怪物
            for(var key in STAGECFG){
                if(STAGECFG[key].stageid == this.stage){
                    this.stageLevel = STAGECFG[key];
                    break;
                }
            }
        }

    },

    updateUI:function () {
        //更新背景
        if(this.bgImg){
            this.bgImg.removeFromParent(true);
            this.bgImgRe.removeFromParent(true);
        }
        this.bgImg = new cc.Sprite(res[this.stageLevel.mapres]);
        this.bgImg.attr({
            anchorX:0,
            anchorY:0.5,
            x:0,
            y:this.winSize.height/2
        });
        this.addChild(this.bgImg);
        this.bgImgWidth = this.bgImg.getContentSize().width;

        this.bgImgRe = new cc.Sprite(this.bgImg.getTexture());
        this.bgImgRe.attr({
            anchorX:0,
            anchorY:0.5,
            x:this.bgImgWidth - 1,
            y:this.winSize.height/2
        });
        this.addChild(this.bgImgRe);

        // this.scrollBg(this.bgImg);
        // this.scrollBg(this.bgImgRe);

        // if(this.node){
        //     this.node.removeFromParent(true);
        // }
        //
        // var bg = ccs.load(res[this.stageLevel[0].mapres]);
        // this.node = bg.node;
        // this.actRunBg = bg.action;
        // this.addChild(this.node);
        // this.node.runAction(this.actRunBg);

        //关卡数
        // this.lblCustoms.setString(this.stageLevel[0].stagename);
        this.lblCustoms.setString(GLOBALDATA.base.stage.substring(5));

        //连胜数据和当前关卡
        // this.curLevel = GLOBALDATA.base.wins % this.totalLevel+1;
        //连胜次数con
        for(var i = 1;i<=this.totalLevel;i++){
            if(i<=GLOBALDATA.base.wins){
                this.picWins[i-1].setVisible(true);
            }else{
                this.picWins[i-1].setVisible(false);
            }
        }
        //挑战boss按钮显示
        this.challengeBoss.setVisible(true);
        this.MonitorStartTenPass();  //监听前十关 进行特殊的指引处理
        //隐藏boss血条
        this.customsBg.setVisible(true);
        this.winBg.setVisible(true);
        this.bossBarBg.setVisible(false);

        //更新离线奖励
        this.textGold.setString(Helper.formatNum(this.stageLevel.offlinegold*60)+'/小时' );
        this.textExp.setString(Helper.formatNum(this.stageLevel.offlineexp*60)+'/小时' );
        // if(GLOBALDATA.base.wins>=this.totalLevel){
        //     this.challengeBoss.setVisible(true);
        // }else {
        //     this.challengeBoss.setVisible(false);
        // }
        //对战信息显示
        if((this.combatType&&this.combatType==3)||(this.combatType&&this.combatType==4)){
            this.pvpBar.wgt.MyNameText.setString(GLOBALDATA.name);
            this.pvpBar.wgt.MyLvText.setString(GLOBALDATA.base.lev);
            if(this.enemyData.name){
                this.pvpBar.wgt.enemyNameText.setString(this.enemyData.name);
            }else {
                this.pvpBar.wgt.enemyNameText.setString('无敌军团');
            }
            if(this.enemyData.base){
                this.pvpBar.wgt.enemyLvText.setString(this.enemyData.base.lev);
            }else {
                this.pvpBar.wgt.enemyLvText.setString(GLOBALDATA.base.lev);
            }
        }
    },
    _scrollBg:function () {
        if(this.bgImg&&this.bgImgRe){
            this.bgImg.stopAllActions();
            this.bgImgRe.stopAllActions();
            if (this.bgImg.getPositionX() + this.bgImg.getContentSize().width <= 5) {
                this.bgImg.setPositionX(this.bgImgRe.getPositionX() + this.bgImgRe.getContentSize().width - 20);
            }
            if(this.bgImgRe.getPositionX() + this.bgImgRe.getContentSize().width <= 5){
                this.bgImgRe.setPositionX(this.bgImg.getPositionX()+ this.bgImg.getContentSize().width - 20);
            }
            if(this.bgImg.getPositionX()<this.bgImgRe.getPositionX()){
                this.bgImgRe.setPositionX(this.bgImg.getPositionX()+ this.bgImg.getContentSize().width - 20);
            }else {
                this.bgImg.setPositionX(this.bgImgRe.getPositionX() + this.bgImgRe.getContentSize().width - 20);
            }
            var scrollAction = cc.sequence(cc.moveBy(this.bgImgWidth/combatCfg.moveSpeed,-this.bgImgWidth,0),cc.callFunc(this._scrollBg,this));
            var _scrollAction = cc.sequence(cc.moveBy(this.bgImgWidth/combatCfg.moveSpeed,-this.bgImgWidth,0),cc.callFunc(this._scrollBg,this));
            if(this.scrollBgTurn){
                this.bgImg.runAction(scrollAction);
                this.bgImgRe.runAction(_scrollAction);
                this.scrollBgTurn = false;
            }else {
                this.bgImgRe.runAction(_scrollAction);
                this.bgImg.runAction(scrollAction);
                this.scrollBgTurn = true;
            }

        }
    },
    scrollBg:function () {
        this._scrollBg();
        //移动工事
        this.scrollFortiArr();
        //this._scrollBg(this.bgImgRe);
        this.scheduleOnce(this.addEnemy, combatCfg.moveTime);
    },
    stopScrollBg:function () {
        this.bgImg.stopAllActions();
        this.bgImgRe.stopAllActions();
        this.stopFortiArr();
    },
    scrollFortiArr:function () {
        var self = this;
        for (var key in this.fortiArr){
            this.fortiArr[key].runAction(cc.sequence(cc.moveTo((this.fortiArr[key].x+10)/combatCfg.moveSpeed,-10,this.fortiArr[key].y),cc.callFunc(function (node) {
                node.removeFromParent();
                var idx = self.fortiArr.indexOf(node);
                self.fortiArr.splice(idx,1);
            },this)));
        };
    },
    stopFortiArr:function () {
        for (var key in this.fortiArr){
            this.fortiArr[key].stopAllActions();
        }
    },
    initUI:function () {

        //初始化子弹图片资源
        // cc.spriteFrameCache.addSpriteFrames(res.ui_skill_plist,res.ui_skill_png);
        // this.role = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame(this.model+"-atk01_0.png"));

        //顶部信息
        this.fightTop = ccsTool.load(res.ui_fightTop, ["OfficialPosition","lblRank","goldValue","diamongValue","lblMilitaryStre",
            "headImage","LoadingBar","lblExp","lblCustoms","emailButton","emailImage_3","inviteFriendButton","inviteFriendImage_3","unionButton","bossBarBg",
            "monCardButton","lifeCardButton","Panel_fightTop","Panel_Top","winBg","customsBg","bossHpBar","lblHp","bossTimeBar","textTime","outButton","textGold","textExp",
            "taskButton","GoldButton", "welfareButton","activeButton","VipGrade","Panel_vip", "taskImage_3","unionImage_3", "activeImage_3",
             "welfareImage_1", "monCardImage_3", "lifeCardImage_3", "inviteFriendImage_3","welfareImage_3"]);

        var fightTopNode = this.fightTop.node;
        fightTopNode.attr({
            anchorX: 0,
            anchorY: 1,
            x: 0,
            y: this.winSize.height
        });


        this.addChild(fightTopNode,1);

        this.nameText = this.fightTop.wgt.OfficialPosition;//昵称
        this.nameText.setString(GLOBALDATA.name);
        this.rankValue = this.fightTop.wgt.lblRank;//等级值
        this.goldValue = this.fightTop.wgt.goldValue;//金币值
        this.diaValue = this.fightTop.wgt.diamongValue;//砖石值
        this.mitValue = this.fightTop.wgt.lblMilitaryStre;  //军力
        this.vipGrade = this.fightTop.wgt.VipGrade;//vip
        this.vipGrade.setString(GLOBALDATA.base.vip);
        this.panel_vip = this.fightTop.wgt.Panel_vip;
        this.panel_vip.addTouchEventListener(this.touchEvent,this);

        this.headImage = this.fightTop.wgt.headImage;
        this.headImage.setTouchEnabled(true);
        this.headImage.addTouchEventListener(this.nickChangeEvent,this);//昵称更改点击事件

        this.updateTop();

        this._LoadingBar = this.fightTop.wgt.LoadingBar;//
        var lvCfg = Helper.findLvCfgByLv(GLOBALDATA.base.lev);
        var _percentum = Math.round(GLOBALDATA.base.exp / lvCfg.roleexp * 100);
        this._LoadingBar.setPercent(_percentum);
        this.Exp = this.fightTop.wgt.lblExp;//经验值
        var Havexp = Helper.formatNum(GLOBALDATA.base.exp);
        var sumExp = Helper.formatNum(lvCfg.roleexp);
        this.Exp.setString(Havexp + "/" + sumExp);
        // //关卡数
        this.lblCustoms = this.fightTop.wgt.lblCustoms;//关卡值
        // // this.lblCustoms.setString(this.stageLevel[0].stagename);
        // this.lblCustoms.setString(GLOBALDATA.base.stage.substring(4));
        //
        //更新连胜标志
        this.picWins = new Array();
        for(var i = 1;i<=this.totalLevel;i++){
            var picWin = ccui.helper.seekWidgetByName(fightTopNode, "picWin"+i);
            this.picWins.push(picWin);
        }
        //主界面下部技能加载
        this.fightBottom = ccsTool.load(res.ui_fightBottom, ["offlineAwardButton","navarchyButton","giftBagButton",
            "supplyButton","challengeButton","quickFight","ImageChat","skillButton1","skiImage11", "skillButton2","skiImage21",
            "skillButton3","skiImage31","skillButton4","skiImage41","skillButton5","skiImage51","Panel_Fight2",
            "imageTipsNav"]);
        this.fightBottomNode = this.fightBottom.node;
        this.fightBottomNode.attr({
            x: 0,
            y: 106
        });
        this.addChild(this.fightBottomNode,1136);

        this.offlineAwardButton = this.fightBottom.wgt.offlineAwardButton;//离线奖励
        this.offlineAwardButton.setVisible(GLOBALDATA.extend.offline > 0);
        this.offlineAwardButton.addTouchEventListener(this.touchEvent,this);

        var navarchyButton = this.fightBottom.wgt.navarchyButton//指挥官按钮
        navarchyButton.addTouchEventListener(this.touchEvent,this);
        // navarchyButton.setdisable

        //首充礼包按钮
        var giftBagButton = this.fightBottom.wgt.giftBagButton;
        giftBagButton.addTouchEventListener(this.touchEvent,this);
        var list = ACTIVITYCONTROLCFG[100].subid;
        var isVisible = false;
        for(var key in list){
            var id = list[key];
            var task = GLOBALDATA.activitylist[id];
            if(task != null && task.s != 3){
                isVisible = true;
                break;
            }
        }
        giftBagButton.setVisible(isVisible);

        //this.supplyBtn = this.fightBottom.wgt.supplyButton//补给箱按钮
        //this.supplyBtn.setVisible(true);
        //this.Btnaction(this.supplyBtn);

        //挑战boss按钮
        this.challengeBoss = this.fightBottom.wgt.challengeButton;
        this.challengeBoss.addTouchEventListener(this.touchEvent,this);
        //快速战斗
        this.quickFight = this.fightBottom.wgt.quickFight;
        this.quickFight.addTouchEventListener(this.touchEvent,this);
        this.ImageChat = this.fightBottom.wgt.ImageChat;
        this.ImageChat.addTouchEventListener(this.touchEvent,this);

        this.skillInit();//技能图标更新显示按钮
        //功能按钮
        //兑换金币按钮
        var GoldButton = this.fightTop.wgt.GoldButton;
        GoldButton.addTouchEventListener(this.touchEvent,this);
        //任务按钮
        var taskButton = this.fightTop.wgt.taskButton;
        taskButton.addTouchEventListener(this.touchEvent,this);
        //邮件
        var emailButton = this.fightTop.wgt.emailButton;
        emailButton.addTouchEventListener(this.touchEvent,this);
        //超级福利
        var welfareButton = this.fightTop.wgt.welfareButton;
        welfareButton.addTouchEventListener(this.touchEvent,this);
        //活动中心
        var activeButton = this.fightTop.wgt.activeButton;
        activeButton.addTouchEventListener(this.touchEvent,this);
        var friendButton = this.fightTop.wgt.inviteFriendButton;
        friendButton.addTouchEventListener(this.touchEvent,this);
        var unionButton = this.fightTop.wgt.unionButton;
        unionButton.addTouchEventListener(this.touchEvent,this);
        //月卡
        var monCardButton = this.fightTop.wgt.monCardButton;
        monCardButton.addTouchEventListener(this.touchEvent,this);
        var nowtime = Helper.getServerTime();
        if(GLOBALDATA.base.m_card_time == 0 || nowtime>GLOBALDATA.base.m_card_time){
            monCardButton.setVisible(true);
        }else{
            monCardButton.setVisible(false);
        }
        //终身卡
        var lifeCardButton = this.fightTop.wgt.lifeCardButton;
        lifeCardButton.addTouchEventListener(this.touchEvent,this);
        if(GLOBALDATA.base.h_card_count > 0){
            lifeCardButton.setVisible(false);
        }else{
            lifeCardButton.setVisible(true);
        }

        //挑战boss
        this.bossBarBg = this.fightTop.wgt.bossBarBg;
        this.winBg = this.fightTop.wgt.winBg;
        this.customsBg = this.fightTop.wgt.customsBg;
        //挑战boss血条
        this.bossHpBar = this.fightTop.wgt.bossHpBar;
        this.lblHp = this.fightTop.wgt.lblHp;
        //挑战boss血条
        this.bossTimeBar = this.fightTop.wgt.bossTimeBar;
        this.textTime = this.fightTop.wgt.textTime;
        //脱离boss战斗
        var outButton = this.fightTop.wgt.outButton;
        outButton.addTouchEventListener(this.touchEvent,this);
        //离线奖励标示
        this.textGold = this.fightTop.wgt.textGold;
        this.textExp = this.fightTop.wgt.textExp;

        //红点
        this.taskImage_3 = this.fightTop.wgt.taskImage_3;  //日常任务的红点
        this.welfareImage_3 = this.fightTop.wgt.welfareImage_3;  //超级福利的红点
        this.activeImage_3 = this.fightTop.wgt.activeImage_3;   //活动中心的红点


        //战斗类型
        if((this.combatType&&this.combatType==3)||(this.combatType&&this.combatType==4)){
            this.fightTop.wgt.Panel_fightTop.setVisible(false);
            this.fightTop.wgt.Panel_Top.setVisible(false);
            this.uiAttributeLayer.setVisible(true);
            this.fightBottomNode.setVisible(false);
            //对战血条
            this.pvpBar = ccsTool.load(res.uiArenaFightLayer, ["fntTime","MyLvText","MyNameText","enemyLvText","enemyNameText","outButton","enemyHpBar","enemylblHp","MyHpBar","MylblHp"]);
            this.pvpBar.node.attr({
                x: 0,
                y: 0
            });
            this.pvpBar.wgt.outButton.addTouchEventListener(this.touchEvent,this);
            this.addChild(this.pvpBar.node,1130);

        }else if(this.combatType){
            this.fightTop.wgt.Panel_fightTop.setVisible(false);
            this.fightBottom.wgt.Panel_Fight2.setVisible(false);
        }

        //this.dealRedPoint();
        //更新界面信息
        this.updateUI();
        //更新顶部按钮的位置
        this.updateTopButtonPos();
        //处理红点
        this.dealRedPoint();
    },
    //更新顶部按钮的位置
    updateTopButtonPos:function(){
        var topButton = [];
        //月卡
        var temp = {};
        temp.node = this.fightTop.wgt.monCardButton;
        temp.x = temp.node.getPositionX();
        temp.y = temp.node.getPositionY();
        topButton.push(temp);
        //终身卡
        var temp = {};
        temp.node = this.fightTop.wgt.lifeCardButton;
        temp.x = temp.node.getPositionX();
        temp.y = temp.node.getPositionY();
        topButton.push(temp);
        //好友
        var temp = {};
        temp.node = this.fightTop.wgt.inviteFriendButton;
        temp.x = temp.node.getPositionX();
        temp.y = temp.node.getPositionY();
        topButton.push(temp);
        var count = 0;
        for(var i=0;i<topButton.length;i++){
            if(topButton[i].node.isVisible()){
                topButton[i].node.setPosition(topButton[count].x,topButton[count].y);
                count++;
            }
        }
    },
    //处理红点
    dealRedPoint:function (data){

        //日常任务
        var redInfo = RedPoint.DealCombatJudge(data);
        if(redInfo.dayWork == 1){
            this.taskImage_3.setVisible(true);
        }else if(redInfo.dayWork == 2){
            this.taskImage_3.setVisible(false);
        }
        //超级福利
        if(redInfo.welFare == 1){
            this.welfareImage_3.setVisible(true);
        }else if(redInfo.welFare == 2){
            this.welfareImage_3.setVisible(false);
        }
        //活动中心的红点
        if(redInfo.fuli == 1){
            this.activeImage_3.setVisible(true);
        }else if(redInfo.fuli == 2){
            this.activeImage_3.setVisible(false);
        }
		//var RedPointInfo = RedPoint.DealMainJudge(data);
        if(redInfo.friend==1){
            this.fightTop.wgt.inviteFriendImage_3.setVisible(true);
        }else if(redInfo.friend==2){
            this.fightTop.wgt.inviteFriendImage_3.setVisible(false);
        }
        if(redInfo.email==1){
            this.fightTop.wgt.emailImage_3.setVisible(true);
        }else if(redInfo.email==2){
            this.fightTop.wgt.emailImage_3.setVisible(false);
        }
        //指挥官红点
        if(redInfo.navTipBool){
            this.fightBottom.wgt.imageTipsNav.setVisible(true);
        }else{
            this.fightBottom.wgt.imageTipsNav.setVisible(false);
        }
        //乱世佳人红点
        if(redInfo.dateTipBool){
            this.fightTop.wgt.unionImage_3.setVisible(true);
        }else{
            this.fightTop.wgt.unionImage_3.setVisible(false);
        }
    },

    skillInit:function(){
        //获取上阵指挥官的对象数据
        for (var key in GLOBALDATA.commanders){
            if (GLOBALDATA.commanders[key].j==1){
                this.commander = GLOBALDATA.commanders[key];
                this.commanderid = key;
                break;
            }
        }
        //获取上阵指挥官的主动技能
        for(var commanderObj in COMMANDERCFG){
            if(COMMANDERCFG[commanderObj].commanderid == this.commander.p){
                this.comactiveskill.length = 0;
                this.comactiveskill = COMMANDERCFG[commanderObj].activeskill.concat(VEHICLECFG[COMMANDERCFG[commanderObj].vehicleid].commanderskillid).sort();
            }
        }
        var skillBtnArray = [];//技能按钮数组
        var skillBtnimgArray = [];
        var timestamp = Helper.getServerTime();//获取服务器当前时间
        //var timestamp = parseInt(new Date().getTime()/1000);//获取当前时间

        var skillType = ['machinegun', 'shell', 'speed', 'def', 'atk'];
        for(var k=0;k<this.comactiveskill.length;k++){
            var btnStr = "skillButton" + (k+1);
            var skillButton = ccui.helper.seekWidgetByName(this.fightBottom.node, btnStr);
            skillBtnArray.push(skillButton);
            skillButton.addTouchEventListener(this.touchEvent,this);//技能点击按钮事件
            if(this.commander.cd[this.comactiveskill[k]] != undefined){
                var skillcd = timestamp - this.commander.cd[this.comactiveskill[k]];//获取以冷却时间
                if(this.commander.cd[this.comactiveskill[k]] != 0){
                    if(skillcd != null && skillcd < COMMANDERSKILLCFG[this.comactiveskill[k]].skillcd + COMMANDERSKILLCFG[this.comactiveskill[k]].skilltime){
                        this.skillEnable[k] = false;
                        this.skillEffect[k] = true;
                        this.showSkillCover(skillButton, this.comactiveskill[k], skillType[k], k);
                    }
                }else{
                    this.skillEnable[k] = true;
                    this.skillEffect[k] = false;
                    var str = "skillButton" + (k+1);
                    var skillButton = ccui.helper.seekWidgetByName(this.fightBottom.node, str);
                    var txt_countDown = skillButton.getChildByName('countDown');
                    txt_countDown.setVisible(false);
                    var skillCover = skillButton.getChildByName('skillCover');
                    var skill = skillCover.getParent().getChildren();
                    for(var j=0;j<skill.length;j++){
                        var name = skill[j].getName();
                        if(name == "right"){
                            skillCover.getParent().removeChild(skill[j], true);
                        }
                    }
                }
            }
            var imageStr = "skiImage" + (k+1) + 1;
            var skiImage = ccui.helper.seekWidgetByName(this.fightBottom.node, imageStr);
            skillBtnimgArray.push(skiImage);
        }

        //技能图标的显示
        for(var i=0;i<this.comactiveskill.length;i++){
            if(this.commander.s[this.comactiveskill[i]] > 0){
                skillBtnArray[i].setTouchEnabled(true);
                skillBtnimgArray[i].setVisible(true);
                skillBtnimgArray[i].loadTexture("common/j/" + COMMANDERSKILLCFG[this.comactiveskill[i]].icon, ccui.Widget.PLIST_TEXTURE);
            }else{
                skillBtnArray[i].setTouchEnabled(false);
                skillBtnimgArray[i].setVisible(false);
            }
        }
    },

    //添加指挥官
    // addCommander:function () {
    //     this.commanderModel = new Commander(this.commander.p);
    //     // this.commander.setScale(0.7);
    //     this.addChild(this.commanderModel,2);
    //     var posX = -50;
    //     this.commanderModel.setPosition(posX,this.DisposalPosYBase+336);
    //     var move = cc.moveTo((65-posX)/60,cc.p(65,this.DisposalPosYBase+336));
    //     this.commanderModel.actRun(1,true);
    //     var delayTime = 0.2;
    //     this.commanderModel.runAction(cc.sequence(move,cc.callFunc(function (node) {
    //         node.actIdle();
    //         if(this.isBoss!=1){
    //             this.addHero();
    //             this.addEnemy();
    //         }
    //     },this)));
    // },
    //添加英雄位置及视觉大小的设置
    addHero:function () {
        //移除以前的士兵
        this.removeHero();
        //初始化士兵
        for (var i = 0;i<8;i++){
            var soldierId = GLOBALDATA.army.battle[GLOBALDATA.army.em[i]-1];
            if(soldierId!=0&&soldierId!=-1&&soldierId!=undefined){
                this.heroDisposal[i] = new Hero(soldierId,i+1);
                this.heroDisposal[i].retain();
                // this.heroDisposal[i].setPosition(combatCfg.heroPos[i]);
                if(i<5){
                    this.heroDisposal[i].setPosition(combatCfg.heroPos[i].x-combatCfg.moveSpeed*combatCfg.heroRunTime,combatCfg.heroPos[i].y);
                    this.addChild(this.heroDisposal[i]);
                    this.heroDisposal[i].reOrder();
                    var move = cc.moveTo(combatCfg.heroRunTime,combatCfg.heroPos[i]);
                    this.heroDisposal[i].actRun(1,true);
                    this.heroDisposal[i].runAction(move);
                }

            }else {
                this.heroDisposal[i] = null;
            }
        }

        if(this.skillEffect[2]){
            this.addBuff('speed');
        }

        if(this.skillEffect[3]){
            this.addBuff('def');
        }

        if(this.skillEffect[4]){
            this.addBuff('atk');
        }

        this.scheduleOnce(function () {
            if(this.combatType){
                if(this.combatType==3||this.combatType==4){
                    this.addPVPEnemy();
                }else {
                    this.addEnemy();
                }

            }else {
                this.scrollBg();
            }
        }, combatCfg.heroRunTime);
    },
    addPVPEnemy:function () {
        if(this.combatType==3){
            for (var i = 0;i<8;i++){
                var soldierId = this.enemyData.army.battle[this.enemyData.army.em[i]-1];
                if(soldierId!=0&&soldierId!=-1&&soldierId!=undefined){
                    this.enemyDisposal[i] = new Monster(soldierId,1,i+1,this.enemyData,3);
                    this.enemyDisposal[i].retain();
                    if(i<5){
                        this.enemyDisposal[i].setPosition(combatCfg.pvpEnemyPos[i].x,combatCfg.pvpEnemyPos[i].y);
                        this.addChild(this.enemyDisposal[i],1136-combatCfg.pvpEnemyPos[i].y);
                        this.enemyDisposal[i].reOrder();
                    }
                }else {
                    this.enemyDisposal[i] = null;
                }
            }
        }else {
            var level = this.stageLevel;
            for (var key = 0;key<8;key++){
                if(level.bossid[key]){
                    this.enemyDisposal[key] = new Monster(level.bossid[key],level.lv,key+1,level.bossrate[key],this.combatType);
                    if(key<5){
                        this.enemyDisposal[key].setPosition(combatCfg.pvpEnemyPos[key].x,combatCfg.pvpEnemyPos[key].y);
                        this.addChild(this.enemyDisposal[key],1136-combatCfg.pvpEnemyPos[key].y);
                        this.enemyDisposal[key].reOrder();
                    }
                }else {
                    this.enemyDisposal[key] = null;
                }
            }
        }

        // var i = 0;
        // this.schedule(function () {
        //     if(this.enemyDisposal[i]){
        //         this.addChild(this.enemyDisposal[i],1136-this.enemyDisposal[i].getPositionY());
        //         this.enemyDisposal[i].actShow();
        //         i++;
        //     }
        // }, 0.2,enemyNum);
        // this.scheduleOnce(function () {
        //     this.fightBoss();
        //
        // }, 0.2*enemyNum);
        this.pvpStart();
    },
    removeEnemy:function () {
        for(var i in this.enemyDisposal){
            if (this.enemyDisposal[i]){
                this.enemyDisposal[i].stopAni();
                this.enemyDisposal[i].removeFromParent(true);
                this.enemyDisposal[i].release();
                this.enemyDisposal[i]=null;
            }
        }
    },
    removeHero:function () {
        for(var i in this.heroDisposal){
            if (this.heroDisposal[i]){
                this.heroDisposal[i].stopAni();
                this.heroDisposal[i].removeFromParent(true);
                this.heroDisposal[i].release();
                this.heroDisposal[i]=null;
            }
        }
    },
    addEnemy:function () {

        //移除以前的敌军
        this.removeEnemy();
        var level = this.stageLevel;
        //开始战斗
        if(this.isBoss ==1){
            this.stopScrollBg();
            var group = randNum(0,1);
            var enemyNum = 0;
            var monsterPos = combatCfg.enemyBossPos[group].concat();
            //添加boss
            for (var key in level.bossid){
                this.enemyDisposal[enemyNum] = new Monster(level.bossid[key],level.lv,enemyNum+1,level.bossrate[key],this.combatType);
                this.enemyDisposal[enemyNum].retain();
                this.enemyDisposal[enemyNum].isBoss = true;
                if(this.combatType){
                    // this.enemyDisposal[enemyNum].setScale(combatCfg.scaleRole[enemyNum]);
                }else {
                    this.enemyDisposal[enemyNum].setScale(combatCfg.scaleRole[enemyNum]*1.3);
                }

                if (key==0){
                    this.enemyDisposal[enemyNum].setPosition(combatCfg.bossPos[group]);
                }else {
                    this.enemyDisposal[enemyNum].setPosition(monsterPos[0]);
                    monsterPos.splice(0,1);
                }
                enemyNum++;
            }
            //添加小兵monsternumber
            if(level.monsternumber){
                var monsterNum = randNum(level.monsternumber[0],level.monsternumber[1]);
                var monsterAtr = [];
                for(var key in MONSTERCFG){
                    if(MONSTERCFG[key].type==2){
                        monsterAtr.push(MONSTERCFG[key].masterid);
                    }
                }
                for (var i=0;i<monsterNum;i++){
                    var idx = randNum(0,monsterAtr.length-1);
                    this.enemyDisposal[enemyNum] = new Monster(monsterAtr[idx],level.lv,enemyNum+1);
                    this.enemyDisposal[enemyNum].retain();
                    this.enemyDisposal[enemyNum].setPosition(monsterPos[0]);
                    monsterAtr.splice(idx,1);
                    monsterPos.splice(0,1);
                    enemyNum++;
                }
            }

            // for(var i =0;i<enemyNum;i++){
            var i = 0;
            this.schedule(function () {
                if(this.enemyDisposal[i]){
                    this.addChild(this.enemyDisposal[i],1136-this.enemyDisposal[i].getPositionY());
                    this.enemyDisposal[i].reOrder();
                    this.enemyDisposal[i].actShow();
                    i++;
                }
            }, 0.2,enemyNum);
            // }
            this.scheduleOnce(function () {
                if(this.combatType&&(this.combatType==3||this.combatType==4)){
                    this.pvpStart();
                }else{
                    this.fightBoss();
                }
            }, 0.2*(enemyNum+2));
        }else {
            //随机小怪个数
            if(!level.monsternumber) return;
            var monsterNum = randNum(level.monsternumber[0],level.monsternumber[1]);
            var monsterAtr = [];
            for(var key in MONSTERCFG){
                if(MONSTERCFG[key].type==2){
                    monsterAtr.push(MONSTERCFG[key].masterid);
                }
            }
            var monsterPos;
            if(monsterNum<=4){
                monsterPos = combatCfg.enemyPos4[randNum(0,1)].concat();
            }else {
                monsterPos = combatCfg['enemyPos'+monsterNum][randNum(0,1)].concat();
            }
            for(var i=0;i<monsterNum;i++){
                var idx = randNum(0,monsterAtr.length-1);
                this.enemyDisposal[i]= new Monster(monsterAtr[idx],level.lv,i+1);
                this.enemyDisposal[i].retain();
                this.enemyDisposal[i].actIdle();
                //     设置位置
                var posidx = randNum(0,monsterPos.length-1);
                this.enemyDisposal[i].setPosition(monsterPos[posidx].x+combatCfg.enemyRunTime*combatCfg.moveSpeed,monsterPos[posidx].y);
                var move = cc.moveTo(combatCfg.enemyRunTime,monsterPos[posidx]);
                this.enemyDisposal[i].runAction(cc.sequence(move));
                this.addChild(this.enemyDisposal[i],1136-this.enemyDisposal[i].getPositionY());
                this.enemyDisposal[i].reOrder();
                monsterAtr.splice(idx,1);
                monsterPos.splice(posidx,1);
            }
            //添加工事
            var fortifications = this.stageLevel.fortifications;
            if(fortifications&&fortifications!=0){
                var fortiType = 0;
                var fortiTotal = 0;
                for (var key in fortifications){
                    var rand = Math.random()*1000;
                    if(rand<fortifications[key][0]){//有工事
                        fortiType = fortifications[key][1];
                        var fortiNum = randNum(fortifications[key][2][0],fortifications[key][2][1]);
                        for (var i=0;i<fortiNum;i++){
                            if(fortiTotal<monsterNum){
                                var spriteFor = new cc.Sprite(res[combatCfg.fortifications[fortiType-1]]);
                                this.fortiArr.push(spriteFor);
                                spriteFor.setAnchorPoint(0.5,0.5);
                                spriteFor.setPosition(this.enemyDisposal[fortiTotal].x-combatCfg.fortiPos[0],this.enemyDisposal[fortiTotal].y+combatCfg.fortiPos[1]);
                                var zOrder = this.enemyDisposal[fortiTotal].y+combatCfg.fortiPos[1];
                                this.addChild(spriteFor,1136-zOrder+spriteFor.getContentSize().height/2);
                                spriteFor.runAction(cc.moveBy(combatCfg.enemyRunTime,-combatCfg.enemyRunTime*combatCfg.moveSpeed,0));
                                fortiTotal++;
                            }
                        }
                    }
                };

                // this.enemyDisposal[i].fortifications
            }
            this.scheduleOnce(function () {
                this.stopScrollBg();
                this.startAtk();
            }, combatCfg.enemyRunTime);
        }
    },
    startAtk:function () {
        this.isWin = false;
        this.isDefeat = false;
        this.totalAtk = 0;
        this.benchIdx = [5,5];
        //我军
        for(var key in this.heroDisposal){
            if (this.heroDisposal[key]){
                if (key<5) {
                    this.heroDisposal[key].manageAtk(this.heroAtkRes, this,this.skillEffect[2]);//攻击动画
                }
                this.heroDisposal[key].calAtkAttr();//血量计算
            }
        }
        //敌军
        for(var key in this.enemyDisposal){
            if (this.enemyDisposal[key]){
                if(this.combatType&&(this.combatType==3||this.combatType==4)){
                    if (key<5) {
                        this.enemyDisposal[key].manageAtk(this.monsterAtkRes,this,false);
                    }
                }else {
                    this.enemyDisposal[key].manageAtk(this.monsterAtkRes,this,false);
                }
                // this.enemyDisposal[key].calAtkAttr();
            }
        }
    },
    stopAtk:function () {
        //我军
        for(var key in this.heroDisposal){
            if (this.heroDisposal[key]){
                this.heroDisposal[key].stopAni();
            }
        }
        //敌军
        for(var key in this.enemyDisposal){
            if (this.enemyDisposal[key]){
                this.enemyDisposal[key].stopAni();
            }
        }
    },
    //英雄的攻击结果
    heroAtkRes:function (nodeExecutingAction,role) {//计算攻击结果
        var self = this;
        var atkTargetIndex = this.findAtkTarget(this.enemyDisposal,role);
        if(atkTargetIndex != null){//计算伤害
            var atkTarget = atkTargetIndex;
            if(!role.canAtk){//移动
                role.stopAni();
                this.movePosition(role,atkTarget,'hero');
            }else {//攻击
                role.canAtk = false;
                // if(atkTarget&&atkTarget.hp>0){
                var delaytime = 0;
                if(role.atkType=='jineng'){
                    role.actSkillAtk();
                    delaytime =  role.roleAttr.effbic&&role.roleAttr.effbic[3]?role.roleAttr.effbic[3][1]:3;
                }else {
                    role.actAtk();
                    delaytime =  role.roleAttr.effbic&&role.roleAttr.effbic[3]?role.roleAttr.effbic[3][0]:3;
                }
                //添加子弹
                this.scheduleOnce(function () {
                    this.addSoldierBlt(role,atkTarget,'hero',function (atkRole,hurtRole,atkType) {
                        if(atkRole&&atkRole.hp<=0){
                            // atkTarget.remove();
                            self.lastEnemy = hurtRole;
                        }else {
                            if(hurtRole&&hurtRole.hp>0&&atkRole) {
                                var dmg = self.calDmg(atkRole, hurtRole, atkType);
                                self.totalAtk += dmg.dmgNum;
                                hurtRole.showDmg(dmg.type, dmg.dmgNum, atkType, atkRole.soldierId);
                                if(self.combatType==3||self.combatType==4) {
                                    self.bossPvpUpdateHp();
                                    //替补上阵
                                    if(hurtRole.hp<=0){
                                        for(var i=self.benchIdx[1];i<8;i++){
                                            if(self.enemyDisposal[i]&&self.enemyDisposal[i].hp>0){
                                                self.enemyDisposal[i].setPosition(hurtRole.getPosition());
                                                self.addChild(self.enemyDisposal[i],1136-self.enemyDisposal[i].getPositionY());
                                                self.enemyDisposal[i].reOrder();
                                                self.enemyDisposal[i].manageAtk(self.monsterAtkRes,self,false);
                                                self.benchIdx[1] = i+1;
                                                break;
                                            }
                                        }
                                    }
                                }else {
                                    self.bossUpdateHp();
                                }
                            }
                        }
                    });
                },delaytime*0.1);

                // }
            }
        }else{
            role.stopAni();
            if(!this.isWin){
                this.isWin = true;
                // this.scheduleOnce(this.victory,0.5);
                this.victory();
            }
        }
    },
    movePosition:function (atkRole,atkTarget,type) {
        var self = this;

        var skillId ;
        var atkDistance = 0;
        if(atkRole.atkType=='pugong'){
            // skillId = atkRole.roleAttr.normalatkid;
            atkDistance = atkRole.roleAttr.atkrange;
        }else {
            skillId = atkRole.roleAttr.skillid;
            var skill = Helper.findSkillById(skillId);
            atkDistance = skill.skilldistance;
        }
        var atkRolePos = atkRole.getPosition();
        var atkTargetPos = atkTarget.getPosition();
        var distance = cc.pDistance(atkRolePos,atkTargetPos);
        var rawAngle = cc.pToAngle(cc.pSub(atkTargetPos,atkRolePos))*180/Math.PI;
        var angleAtk;
        if (type == 'hero'){
            angleAtk = Math.abs(rawAngle);
        }else {
            angleAtk = 180-Math.abs(rawAngle);
        }
        if(atkDistance<distance){//攻击距离
            atkRole.actRun(atkTargetPos.x-atkRolePos.x);

            var moveToPos = atkRolePos;
            if((type == 'hero'&&atkRolePos.x<=combatCfg.moveLeftBar)||(type == 'enemy'&&atkRolePos.x>=combatCfg.moveRightBar)){
                var angle = cc.pToAngle(cc.pSub(atkTargetPos,atkRolePos));
                moveToPos = cc.p(atkRolePos.x + 30*Math.cos(angle),atkRolePos.y + 30*Math.sin(angle));
            } else {
                moveToPos = cc.p(atkRolePos.x,atkRolePos.y+(atkTargetPos.y-atkRolePos.y>0?30:-30));
            }

            var actMove = cc.moveTo(30/combatCfg.moveSpeed,moveToPos);
            // var moveTime = cc.pDistance(pos,)
            atkRole.runAction(cc.sequence(actMove,cc.callFunc(function (node) {
                self.movePosition(atkRole,atkTarget,type);
                node.reOrder();
                //每隔一秒从新设定士兵的层级
            },this)));
        } else if(angleAtk>atkRole.roleAttr.atkangle){//攻击角度
            atkRole.actRun(atkTargetPos.x-atkRolePos.x);
            var dely = (atkTarget.y-atkRole.y)/Math.abs(atkTarget.y-atkRole.y)*10;
            var actMove = cc.moveBy(10/combatCfg.moveSpeed,0,dely);
            // var moveTime = cc.pDistance(pos,)
            atkRole.runAction(cc.sequence(actMove,cc.callFunc(function (node) {
                self.movePosition(atkRole,atkTarget,type);
                node.reOrder();
                //每隔一秒从新设定士兵的层级
            },this)));
        }else {
            atkRole.canAtk = true;
            if(type == 'enemy'){
                atkRole.manageAtk(this.monsterAtkRes,this,false);
            }else{
                atkRole.manageAtk(this.heroAtkRes,this,self.skillEffect[2]);
            }
        }
    },
    monsterAtkRes:function (nodeExecutingAction,role) {//计算攻击结果
        var self = this;
        var atkTargetIndex = this.findAtkTarget(this.heroDisposal,role);
        if(atkTargetIndex != null){//计算伤害
            var atkTarget = atkTargetIndex;
            if(!role.canAtk){//移动
                role.stopAni();
                this.movePosition(role,atkTarget,'enemy');
            }else {//攻击
                role.canAtk = false;
                // if(atkTarget&&atkTarget.hp>0) {
                var delaytime =0;
                if(role.atkType=='jineng'){
                    role.actSkillAtk();
                    delaytime =  role.roleAttr.effbic&&role.roleAttr.effbic[3]?role.roleAttr.effbic[3][1]:3;
                }else {
                    role.actAtk();
                    delaytime =  role.roleAttr.effbic&&role.roleAttr.effbic[3]?role.roleAttr.effbic[3][0]:3;
                }
                //添加子弹
                this.scheduleOnce(function () {
                    this.addSoldierBlt(role,atkTarget,'monster',function (atkRole,hurtRole,atkType) {
                        if(hurtRole&&hurtRole.hp>0&&atkRole) {
                            var dmg = self.calDmg(atkRole,hurtRole,atkRole.atkType);
                            hurtRole.showDmg(dmg.type,dmg.dmgNum,atkRole.atkType,atkRole.monsterId);
                            //替补上阵
                            if(hurtRole.hp<=0){
                                for(var i=self.benchIdx[0];i<8;i++){
                                    if(self.heroDisposal[i]&&self.heroDisposal[i].hp>0){
                                        self.heroDisposal[i].setPosition(hurtRole.getPosition());
                                        self.addChild(self.heroDisposal[i],1136-self.heroDisposal[i].getPositionY());
                                        self.heroDisposal[i].reOrder();
                                        self.heroDisposal[i].manageAtk(self.heroAtkRes,self,self.skillEffect[2]);
                                        self.benchIdx[0] = i+1;
                                        break;
                                    }
                                }
                            }
                        }
                    });
                },delaytime*0.1);
                // }
            }
        }else{
            role.stopAni();
            if(!this.isDefeat){
                this.isDefeat = true;
                this.defeat();
            }
        }
    },

    //计算英雄攻击
    //role 攻击者，atkTarget 被攻击者,atkType 攻击类型（普攻或技能）
    calDmg:function (role,atkTarget,atkType) {
        //判断是否命中
        var dmgObj = {};
        var hitRate = role.basehit-atkTarget.basemiss;
        if(hitRate<0){
            hitRate = 0;
        }
        var isHit = Math.random()*10000>hitRate;
        if(isHit){//未命中
            dmgObj.type = 'miss';
            dmgObj.dmgNum = 0;
            return dmgObj;
        }
        //判断是否暴击
        var critRate = 0;
        if(atkTarget.roleType=='hero'&&this.skillEffect[3]){
            var lv = this.commander.s[111];
            var skill = Helper.findCmdSkillConsume(111,lv);
            critRate = skill.data[2];
        }
        critRate = critRate + role.basecrit-atkTarget.baseuncrit;
        if(critRate<0){
            critRate = 0;
        }
        //效果倍率，即是否造成重伤效果，不造成重伤时效果倍率=1，造成重伤效果时倍率=攻击方重伤倍率
        dmgObj.type = 'normal';
        var effectRatio=1;
        if(Math.random()*10000<=critRate){//暴击
            dmgObj.type = 'crit';
            effectRatio = role.basecritvalue/10000;
        }
        //技能倍率取自技能配置，每个技能和普工对应一个技能倍率
        var skillRatio = 1;
        if(atkType=='pugong'){
            // var skill = Helper.findSkillById(role.roleAttr.normalatkid);
            skillRatio = role.pugongRatio;
        }else if(atkType=='jineng'){
            var skill = Helper.findSkillById(role.roleAttr.skillid);
            skillRatio = role.skillRatio;
        }

        //基础伤害=max[攻击方攻击*0.1，(攻击方攻击-受击方防御)]
        //攻击方攻击
        var atk = role.atk;
        if(role.roleType=='hero'&&this.skillEffect[4]){

            var lv = this.commander.s[112];
            var skill = Helper.findCmdSkillConsume(112,lv);
            atk = atk*(1+skill.data[2]/10000);
        }
        //受击方防御
        var def = atkTarget.def;
        var baseDmg1 = atk*0.1;
        var baseDmg2 = atk-def;
        var baseDmg = (baseDmg1>baseDmg2?baseDmg1:baseDmg2);

        //伤害加成率=攻击方伤害-受击方免伤
        var baseDmgRate = role.basedamage;
        var baseInjuryRate = atkTarget.baseinjury;
        var dmgRatio = (baseDmgRate - baseInjuryRate)/10000;


        //克制倍率-见克制关系表
        var row = role.roleAttr.attacktype-1;
        var col = atkTarget.roleAttr.defendtype-1;
        var restrainRatio = this.restrainRatioTable[row][col];
        // var restrainRatio =1;

        //最终伤害 = 基础伤害*技能倍率*效果倍率*（1+伤害加成率）*克制倍率
        var finalDmg = baseDmg*skillRatio*effectRatio*(1+dmgRatio)*restrainRatio;
        dmgObj.dmgNum = Math.round(finalDmg);
        return dmgObj;
    },
    findAtkTarget:function (targetArr,role) {//查找攻击对象
        var atkTargetIndex = null;
        var min = 2000;
        if(this.skillEffect[4]&&role.roleType=='monster'){//提高攻击力技能，前排嘲讽
            var prioritySet = [],noPrioritySet = [];
            for (var key in targetArr){
                if(!targetArr[key]) continue;
                if(targetArr[key].x==combatCfg.heroPos[0].x&&targetArr[key].hp>0){
                    prioritySet.push(targetArr[key]);
                }else {
                    noPrioritySet.push(targetArr[key]);
                }
            };
            if(prioritySet.length>0){
                for(var key in prioritySet){
                    if(!prioritySet[key]) continue;
                    if (prioritySet[key]&&prioritySet[key].hp>0){
                        var disY = Math.abs(prioritySet[key].y-role.y);
                        if(disY<min){
                            min = disY;
                            atkTargetIndex = prioritySet[key];
                        }
                    }
                }
            }else {
                for(var key in noPrioritySet){
                    if(!noPrioritySet[key]) continue;
                    if (noPrioritySet[key]&&noPrioritySet[key].hp>0){
                        var disY = Math.abs(noPrioritySet[key].y-role.y);
                        if(disY<min){
                            min = disY;
                            atkTargetIndex = noPrioritySet[key];
                        }
                    }
                }
            }

        }else if(this.skillEffect[3]&&role.roleType=='hero'&&role.x==combatCfg.heroPos[2].x){//暴击技能  后排士兵附带打血量最多的敌军
            var maxHp = 0;
            var prioritySet = [],noPrioritySet = [];
            for (var key in targetArr){
                if(!targetArr[key]) continue;
                if(targetArr[key].isBoss&&targetArr[key].hp>0){
                    prioritySet.push(targetArr[key]);
                }else {
                    noPrioritySet.push(targetArr[key]);
                }
            };
            if(prioritySet.length>0){
                for(var key in prioritySet){
                    if(!prioritySet[key]) continue;
                    if (prioritySet[key]&&prioritySet[key].hp>0){
                        if(prioritySet[key].hp>maxHp){
                            atkTargetIndex = prioritySet[key];
                        }
                    }
                }
            }else {
                for(var key in noPrioritySet){
                    if(!noPrioritySet[key]) continue;
                    if (noPrioritySet[key]&&noPrioritySet[key].hp>0){
                        if(noPrioritySet[key].hp>maxHp){
                            atkTargetIndex = noPrioritySet[key];
                        }
                    }
                }
            }
        }else {
            for(var key in targetArr){
                if(!targetArr[key]) continue;
                if (targetArr[key]&&targetArr[key].hp>0){
                    var disY = Math.abs(targetArr[key].y-role.y);
                    if(disY<min){
                        min = disY;
                        atkTargetIndex = targetArr[key];
                    }
                }
            }
        }
        return atkTargetIndex;
    },
    victory:function () {
        // //cc.log('victory');
        if(this.isBoss==1){
            this.unschedule(this.bossCountDown);
            this.unschedule(this.pvpCountDown);
        }
        if(this.combatType){
            this.stopAtk();
            var event = new cc.EventCustom(this.evnName);
            var starVal = 1;
            var totalTime =this.stageLevel.time==-1?9999:this.stageLevel.time;
            if(totalTime-this.leftTime<=15){
                starVal++;
            }
            //初始化士兵
            var totalSoldier = 0,
                liveSoldier = 0;
            for (var i = 0;i<8;i++){
                var soldierId = GLOBALDATA.army.battle[GLOBALDATA.army.em[i]-1];
                if(soldierId!=0&&soldierId!=-1&&soldierId!=undefined){
                    totalSoldier++;
                    if(this.heroDisposal[i]&&this.heroDisposal[i].hp>0&&this.heroDisposal[i].soldierId == soldierId) {
                        liveSoldier++;
                    }
                }
            }
            if(totalSoldier==liveSoldier){
                starVal++;
            }
            event.setUserData({result:'victory',star:starVal,atkval:this.totalAtk});
            cc.eventManager.dispatchEvent(event);
            // var alarmVic = ccs.load(res.winLayer_json);
            // var alarmnodeVic = alarmVic.node;
            // var alarmActionVic = alarmVic.action;
            // alarmnodeVic.attr({
            //     x:cc.winSize.width/2,
            //     y:cc.winSize.height/2+50
            // });
            // this.addChild(alarmnodeVic,1136);
            // alarmnodeVic.runAction(alarmActionVic);
            // alarmActionVic.gotoFrameAndPlay(0, false);
            // var self = this;
            // alarmActionVic.setLastFrameCallFunc(function(){
            //     //cc.log('setLastFrameCallFunc');
            //     if(alarmnodeVic){
            //         alarmnodeVic.removeFromParent();
            //     }
            // });
            return;
        }
        // 保存胜利数据
        combatModel.stagePass(this.stage,1,this.isBoss,1);
        //播放指挥官胜利动画
        // this.commanderModel.actVictory();
        //奖励经验和金币
        if(this.lastEnemy){
            var gold = ccs.load(res.effGlodLayer_json);
            var goldnode = gold.node;
            var goldAction = gold.action;
            var bmFontGold = ccui.helper.seekWidgetByName(goldnode, "bmFontGold");//
            bmFontGold.setString('i+'+this.stageLevel.goldreward);
            // var bmFontExp = ccui.helper.seekWidgetByName(goldnode, "bmFontExp");//
            // bmFontExp.setString('i+'+this.stageLevel[this.isBoss].expreward);
            goldnode.setPosition(this.lastEnemy.getPosition());
            this.addChild(goldnode,20);
            goldnode.runAction(goldAction);
            goldAction.gotoFrameAndPlay(0, false);
            goldAction.setLastFrameCallFunc(function() {
                goldnode.removeFromParent(true);
            });
        };

        //英雄复原
        if(this.isBoss==1){
            this.isBoss = 0;
            //取消boss倒计时
            this.unschedule(this.bossCountDown);
            this.unschedule(this.pvpCountDown);
            //cc.log('挑战boss胜利');
            //隐藏boss血条
            this.customsBg.setVisible(true);
            this.winBg.setVisible(true);
            this.bossBarBg.setVisible(false);
            //指挥官移出屏幕
            //播放报警动画
            var alarm = ccs.load(res.winLayer_json);
            var alarmnode = alarm.node;
            var alarmAction = alarm.action;
            alarmnode.attr({
                x:cc.winSize.width/2,
                y:cc.winSize.height/2+50
            });
            this.addChild(alarmnode,1136);
            alarmnode.runAction(alarmAction);
            alarmAction.gotoFrameAndPlay(0, false);
            var self = this;
            alarmAction.setLastFrameCallFunc(function(){
                //cc.log('setLastFrameCallFunc');
                if(alarmnode){
                    alarmnode.removeFromParent();
                }
                //士兵移出屏幕
                for(var i in self.heroDisposal) {
                    if (self.heroDisposal[i] && self.heroDisposal[i].hp>0) {
                        self.heroDisposal[i].canAtk = false;
                        self.heroDisposal[i].restoreStatus();
                        self.heroDisposal[i].actRun(1);
                        var pos = self.heroDisposal[i].getPosition();
                        self.heroDisposal[i].runAction(cc.sequence(cc.moveTo(combatCfg.moveOutTime,
                            cc.p(pos.x+combatCfg.moveOutTime*combatCfg.moveSpeed,pos.y)),cc.callFunc(function (nodeExecutingAction) {
                            nodeExecutingAction.stopAni();
                            nodeExecutingAction.removeFromParent();
                        },this)));
                    }
                }
                //进入新的关卡
                self.scheduleOnce(function () {
                    self.EnterStep();
                },combatCfg.moveOutTime);
            });
        }else{
            //cc.log('普通胜利');
            this.scrollBg();
            this.heroRestore();
        }

    },
     heroRestore:function (cb) {
        //回血，回到原位，死亡重现，替补，更换阵容等
         var self = this;
         var maxTime = 0;
        for (var i = 0;i<8;i++){
            var soldierId = GLOBALDATA.army.battle[GLOBALDATA.army.em[i]-1];
            if(soldierId != 0 &&soldierId != -1 && soldierId!=undefined){
                if(i<5){//上阵阵容
                    if(this.heroDisposal[i] != null && this.heroDisposal[i].soldierId == soldierId && this.heroDisposal[i].hp>0){
                        this.heroDisposal[i].canAtk = false;
                        this.heroDisposal[i].restoreStatus();
                        var curPos = this.heroDisposal[i].getPosition();
                        if(!cc.pSameAs(curPos,combatCfg.heroPos[i])){
                            this.heroDisposal[i].actRun(1);
                            // var runTime = cc.pDistance(combatCfg.heroPos[i],curPos)/(combatCfg.moveSpeed);
                            // var runTime = (curPos.x-combatCfg.heroPos[i].x)/(combatCfg.moveSpeed);
                            var runTime = Math.abs(curPos.y-combatCfg.heroPos[i].y)/(combatCfg.moveSpeed);
                            if(runTime>maxTime){
                                maxTime = runTime;
                            }
                            // this.heroDisposal[i].reOrder();
                            // self.schedule(this.heroDisposal[i].reOrder,1);
                            this.heroDisposal[i].startReOrder();
                            this.heroDisposal[i].runAction(cc.sequence( cc.moveTo(runTime,combatCfg.heroPos[i]),cc.delayTime(0.1),
                                cc.callFunc(function (nodeExecutingAction) {
                                    // self.unschedule(this.heroDisposal[i].reOrder);
                                    nodeExecutingAction.stopReOrder();
                                    nodeExecutingAction.actRun(1);
                                },this)));


                        }else{
                            this.heroDisposal[i].actRun(1);
                        }
                    }else {//死亡或者替补或者更换阵容，重新出现

                        if(this.heroDisposal[i]!=null){
                            this.heroDisposal[i].removeFromParent(true);
                            this.heroDisposal[i].release();
                            this.heroDisposal[i] = null;
                        }
                        this.heroDisposal[i] = new Hero(soldierId,i+1);
                        this.heroDisposal[i].retain();
                        this.heroDisposal[i].setPosition(combatCfg.heroPos[i]);
                        this.addChild(this.heroDisposal[i],1136-combatCfg.heroPos[i].y);
                        this.heroDisposal[i].reOrder();
                        // this.heroDisposal[i].runAction(cc.blink(1, 5));
                        this.heroDisposal[i].actRun(1);

                    }
                }else {//替补阵容
                    if(this.heroDisposal[i]!=null){
                        this.heroDisposal[i].removeFromParent(true);
                    }
                    this.heroDisposal[i] = new Hero(soldierId,i+1);
                    this.heroDisposal[i].retain();
                }

            }else if(this.heroDisposal[i]!=null){//把已经上阵的移除掉
                this.heroDisposal[i].removeFromParent(true);
                this.heroDisposal[i].release();
                this.heroDisposal[i] = null;
            }
        }
         // var self = this;

         this.scheduleOnce(function (dt) {
             if(typeof cb != 'undefined'){
                 cb.call(this);
             }
         },maxTime);
    },

    defeat:function () {
        //cc.log('defeat');
        if(this.isBoss==1){
            this.unschedule(this.bossCountDown);
            this.unschedule(this.pvpCountDown);
        }

        if(this.combatType){
            this.stopAtk();
            var event = new cc.EventCustom(this.evnName);
            event.setUserData({result:'defeat',atkval:this.totalAtk});
            cc.eventManager.dispatchEvent(event);
            this.isBoss = 0;
            return;
        }
        // 保存失败数据
        combatModel.stagePass(this.stage,this.isBoss,this.isBoss,0);

        if(!this.loseDlginView){
            this.loseDlginView = true;
            var loseDlg = new loseLayer();
            this.addChild(loseDlg,combatCfg.zorder.loseDlg);
        }
        this.removeEnemy();
        this.removeHero();
        if(this.isBoss==1){
            //取消boss倒计时
            this.unschedule(this.bossCountDown);
            this.unschedule(this.pvpCountDown);
            //cc.log('挑战boss失败');
            this.isBoss = 0;
            this.challengeBoss.setVisible(true);
            //隐藏boss血条
            this.customsBg.setVisible(true);
            this.winBg.setVisible(true);
            this.bossBarBg.setVisible(false);
        }else{
            //cc.log('挑战普通关卡失败');
        }

        this.scrollBg();
        this.heroRestore();
    },
    addBlt:function(atkRole,hurtRole,fromPos,toPos,speed,type,atkType,cb) {
        if(atkRole&&atkRole.hp>0&&hurtRole&&hurtRole.hp>0) {
            var bullet = new Bullet(atkRole, fromPos, toPos, speed, type);
            this.addChild(bullet, combatCfg.zorder.bullet);
            bullet.actMove(function () {
                cb(atkRole,hurtRole,atkType);
            });
        }
    },
    addSoldierBlt:function (atkRole,hurtRole,type,cb) {

            if(atkRole.atkType=='pugong') {
                var fromPos = atkRole.getPosition();
                var toPos = hurtRole.getPosition();
                if(atkRole.roleAttr.atktype[0]==1&&atkRole.roleAttr.effbic&&typeof atkRole.roleAttr.effbic=="object"){//子弹
                    this.addBlt(atkRole,hurtRole,fromPos,toPos,atkRole.roleAttr.atktype[3],type,'pugong',cb);
                    if(atkRole.roleAttr.atktype[1]>1){
                        this.schedule(function () {
                            this.addBlt(atkRole,hurtRole,fromPos,toPos,atkRole.roleAttr.atktype[3],type,'pugong',cb);
                        },atkRole.roleAttr.atktype[2],atkRole.roleAttr.atktype[1]-2);
                    }
                }
            }else{//技能
                var skill = new Skill();
                var atkTarget ;
                if(type=='hero'){
                    atkTarget = skill.findTarget(atkRole.roleAttr.skillid,this.heroDisposal,this.enemyDisposal,atkRole,hurtRole);
                }else {
                    atkTarget = skill.findTarget(atkRole.roleAttr.skillid,this.enemyDisposal,this.heroDisposal,atkRole,hurtRole);
                }
                var objSkill = Helper.findSkillById(atkRole.roleAttr.skillid);
                if(objSkill.skilltype==1){ //伤害
                    if(objSkill.skilldisplay==0){ //无表现
                        for (var key in atkTarget){
                            cb(atkRole,atkTarget[key],'jineng');
                        }
                    }else if(objSkill.skilldisplay==1){ //子弹
                        var fromPos = atkRole.getPosition();
                        var toPos;
                        for (var key in atkTarget){
                            if(atkTarget[key]){
                                toPos = atkTarget[key].getPosition();
                                this.addBlt(atkRole,atkTarget[key],fromPos,toPos,objSkill.bulletspeed,type,'jineng',cb);
                            }
                        }
                        if(objSkill.bulletnum>1){
                            this.schedule(function () {
                                for (var key in atkTarget){
                                    toPos = atkTarget[key].getPosition()
                                    this.addBlt(atkRole,atkTarget[key],fromPos,toPos,objSkill.bulletspeed,type,'jineng',cb);
                                }
                            },objSkill.skillfrequency,objSkill.bulletnum-2);
                        }
                    }else if(objSkill.skilldisplay==2){//持续效果

                    }
                }else if(objSkill.skilltype==2){ //治疗
                    for (var key in atkTarget){
                        if(atkTarget[key]&&atkTarget[key].hp>0){
                            atkTarget[key].treat(atkRole.atk*objSkill.damagevalue/10000);
                        }
                    }
                }else if(objSkill.skilltype==3){//属性加成

                }
                //技能buff
                if(objSkill.buff){
                    for(var key in objSkill.buff){
                        var buff = objSkill.buff[key];
                        var rate = Math.random()*10000;
                        //概率判断buff是否有效
                        if(rate<buff[0]){//buff有效
                            //(heroBuff,heroData,enemyData,atkRole,hurtRole)
                            if(type=='hero'){
                                new Buff(buff,this.heroDisposal,this.enemyDisposal,atkRole,hurtRole);
                            }else {
                                new Buff(buff,this.enemyDisposal,this.heroDisposal,atkRole,hurtRole);
                            }
                        }
                    }
                }
                // if(atkRole.roleAttr.atktype[0]==1&&atkRole.roleAttr.effbic&&typeof atkRole.roleAttr.effbic=="object"){//子弹
                //     this.addBlt(atkRole,hurtRole,fromPos,toPos,atkRole.roleAttr.atktype[3],type,'jineng',cb);
                //     if(atkRole.roleAttr.atktype[1]>1){
                //         this.schedule(function () {
                //             this.addBlt(atkRole,hurtRole,fromPos,toPos,atkRole.roleAttr.atktype[3],type,'jineng',cb);
                //         },atkRole.roleAttr.atktype[2],atkRole.roleAttr.atktype[1]-1);
                //     }
                // }
            }
    },
    //添加载具技能
    addMachineGun:function () {//fromPos,toPos
        this.MachineAtkIdx = null;
        this.MachineGun = new MachineGun('com_arc001');
        this.addChild(this.MachineGun,1136);
        this.MachineGun.setPosition(combatCfg.machineGunPos[0],combatCfg.machineGunPos[1]);
        this.MachineGun.actShow();
        this.MachineGun.actAtk();

        this.schedule(this.addMachineBlt,0.1);
    },
    addMachineBlt:function () {
        var formPos =  cc.p(combatCfg.machineGunPos[2],combatCfg.machineGunPos[3]);
        if(this.MachineAtkIdx==null||(this.MachineAtkIdx&&this.MachineAtkIdx.hp<=0)){
            this.MachineAtkIdx = this.findAtkTarget(this.enemyDisposal,{y:combatCfg.machineGunPos[3]});
        }
        //滚动触摸控制子弹方向
        // var toPos = this.touchPos?this.touchPos:cc.pAdd(formPos,cc.p(640,0));
        //自动寻怪方向
        var enemy = this.MachineAtkIdx;
        var toPos = enemy?enemy.getPosition():cc.pAdd(formPos,cc.p(640,0));
        var bullet = new MachineGunBullett('com_rif_bic01',formPos , toPos, 500,this.enemyDisposal);
        this.addChild(bullet, combatCfg.zorder.bullet);
        bullet.actMove();
    },
    touchEvent: function (sender, type) {
        var self = this;
        if(ccui.Widget.TOUCH_ENDED == type){
            switch (sender.name) {
                case 'offlineAwardButton'://离线收益按钮
                    var offlineDlg = new OfflineLayer();
                    this.myLayer.addChild(offlineDlg,2);
                    break;

                case'quickFight'://快速战斗按钮
                    if(GLOBALDATA.base.lev >= INTERFACECFG[17].level){
                        var quickFightDialog = new quickFightLayer();
                        this.myLayer.addChild(quickFightDialog,2);
                    }else{
                        var describe = StringFormat(INTERFACECFG[17].name + STRINGCFG[100045].string, INTERFACECFG[17].level);
                        ShowTipsTool.TipsFromText(describe, cc.color.RED, 30);
                    }

                    break;
                case 'navarchyButton'://点击指挥官
                    var navarchyDlg = new navarchyLayer();
                    if(this.combatType){
                        this.addChild(navarchyDlg,9999);
                    }else {
                        this.myLayer.addChild(navarchyDlg,2);
                    }

                    break;
                case 'giftBagButton'://点击首充礼包
                    var _welfareSCLayer = new welfareSCLayer();
                    this.myLayer.addChild(_welfareSCLayer,2);

                    // //cc.log('giftBagButton');
            /*        for (var i =1;i<=6;i++){
                        Network.getInstance().send({"task":"gm.add_new_equipment","id":10000+i});
                    }
                    for (var i =1;i<=4;i++){
                        Network.getInstance().send({"task":"gm.add_new_equipment","id":20000+i});
                    }*/
                    break;
                case 'outButton'://脱离boss战斗
                    // //cc.log('脱离boss战斗');
                    if(newGuideModel.isRunNewGuide()){  //新手引导中不能脱离战斗
                        ShowTipsTool.ErrorTipsFromStringById(100265);  //100265	操作引导中，不能脱离战斗
                        return;
                    }
                    // 取消战斗倒计时
                    this.unschedule(this.bossCountDown);
                    this.unschedule(this.pvpCountDown);
                    this.isBoss = 0;

                    if(this.combatType){
                        var event = new cc.EventCustom(this.evnName);
                        event.setUserData({result:'outBoss',atkval:self.totalAtk});
                        cc.eventManager.dispatchEvent(event);
                        this.stopAtk();
                        return;
                    }

                    this.challengeBoss.setVisible(true);
                    //隐藏boss血条
                    this.customsBg.setVisible(true);
                    this.winBg.setVisible(true);
                    this.bossBarBg.setVisible(false);
                    //重新开始战斗
                    this.removeEnemy();
                    // this.curLevel = 1;
                    this.scrollBg();
                    this.heroRestore();
                    break;
                case 'challengeButton'://挑战boss
                    if((GLOBALDATA.base.wins<this.totalLevel&&GLOBALDATA.base.vip<=0)){
                        ShowTipsTool.TipsFromText(STRINGCFG[100057].string,cc.color.RED,18);   //显示tips
                        return;
                    }
                    //停止士兵动作
                    this.stopAtk();

                    this.stopScrollBg();

                    this.challengeBoss.setVisible(false);
                    this.removeEnemy();
                    this.isWin = true;
                    //
                    //播放报警动画
                    var alarm = ccs.load(res.effatkboss_json);
                    var alarmnode = alarm.node;
                    var alarmAction = alarm.action;
                    alarmnode.attr({
                        x:cc.winSize.width/2,
                        y:cc.winSize.height/2
                    });
                    this.addChild(alarmnode,1000);
                    alarmnode.runAction(alarmAction);
                    alarmAction.play("atkboss", false);

                    var self = this;
                    self.unschedule(self.addEnemy);
                    alarmAction.setLastFrameCallFunc(function(){
                        // //cc.log('setLastFrameCallFunc');
                        if(alarmnode){
                            alarmnode.removeFromParent();
                        }
                        self.scrollBg();
                        self.unschedule(self.addEnemy);
                        self.heroRestore(function () {
                            self.isBoss = 1;
                            self.addEnemy();
                        });
                    });

                    // this.scheduleOnce(function () {
                    //     this.addEnemy();
                    //     this.startAtk();
                    // }, 2);
                    // Network.getInstance().send({task:'army.gobattle',id:201,pos:2});
                    break;
                case 'skillButton1'://机关枪skillButton1
                    if(this.skillEnable[0]){
                        commanderModel.skillUseTime(parseInt(this.commanderid), 108);
                        this.showSkillCover(sender,108, 'machinegun',0);//参数  点击对象，技能ID，攻击类型
                        this.skillEnable[0] = false;
                        this.skillEffect[0] = true;
                    }else {
                        this.skillAttrArray = [sender,this.comactiveskill[0], 'machinegun',0];
                        this.isCoolElimi(101, 108);
                    }

                    break;
                case 'skillButton2'://导弹
                    if(this.skillEnable[1]){
                        for(var i in this.enemyDisposal){
                            if(this.enemyDisposal[i]&&this.enemyDisposal[i].hp>0){
                                var enemy = this.enemyDisposal[i];
                                var buff = ccs.load(res.effshell_json);
                                buff.node.runAction(buff.action);
                                buff.node.setPosition(enemy.getPosition());
                                this.addChild(buff.node,3);
                                buff.action.gotoFrameAndPlay(0, false);
                                buff.action.setLastFrameCallFunc(function() {
                                    buff.node.removeFromParent(true);
                                    gcRes([res.effshell_json]);
                                });
                            }
                        }
                        //计算伤害
                        this.scheduleOnce(function () {
                            for(var i in this.enemyDisposal){
                                if(this.enemyDisposal[i]&&this.enemyDisposal[i].hp>0){
                                    var lv = this.commander.s[109];
                                    var skill = Helper.findCmdSkillConsume(109,lv);
                                    this.enemyDisposal[i].showDmg('normal',skill.data[2],'jineng');
                                }
                            }
                        },1.5);
                        commanderModel.skillUseTime(parseInt(this.commanderid), 109);
                        this.showSkillCover(sender,this.comactiveskill[1], 'shell',1);
                        this.skillEnable[1] = false;
                        this.skillEffect[1] = true;

                    }else {
                        this.skillAttrArray = [sender,this.comactiveskill[1], 'shell',1];
                        this.isCoolElimi(101, 109);
                    }
                    break;
                case 'skillButton3'://速度
                    if(this.skillEnable[2]){
                        commanderModel.skillUseTime(parseInt(this.commanderid), 110);
                        this.showSkillCover(sender,this.comactiveskill[2], 'speed',2);//参数  点击对象，技能ID，攻击类型
                        this.skillEnable[2] = false;
                        this.skillEffect[2] = true;
                    }else {
                        this.skillAttrArray = [sender,this.comactiveskill[2], 'speed',2];
                        this.isCoolElimi(101, 110);
                    }
                    break;
                case 'skillButton4'://暴击
                    if(this.skillEnable[3]){
                        commanderModel.skillUseTime(parseInt(this.commanderid), 111);
                        this.showSkillCover(sender,this.comactiveskill[3], 'def',3);
                        this.skillEnable[3] = false;
                        this.skillEffect[3] = true;
                    }else {
                        this.skillAttrArray = [sender,this.comactiveskill[3], 'def',3];
                        this.isCoolElimi(101, 111);
                    }
                    break;
                case 'skillButton5'://攻击
                    if(this.skillEnable[4]){
                        commanderModel.skillUseTime(parseInt(this.commanderid), 112);
                        this.showSkillCover(sender,this.comactiveskill[4], 'atk',4);
                        this.skillEnable[4] = false;
                        this.skillEffect[4] = true;
                    }else {
                        this.skillAttrArray = [sender,this.comactiveskill[4], 'atk',4];
                        this.isCoolElimi(101, 112);
                    }
                    break;
                case "taskButton":  //任务
                    if(GLOBALDATA.base.lev >= INTERFACECFG[20].level){
                        var _dayWorkLayer = new dayWorkLayer();
                        this.myLayer.addChild(_dayWorkLayer,2);
                    }else{
                        var describe = StringFormat(STRINGCFG[100045].string, INTERFACECFG[20].level);
                        ShowTipsTool.TipsFromText(describe, cc.color.RED, 30);
                    }
                    break;
                case "welfareButton": // 超级福利
                    var welfareLayer = new WelfareLayer();
                    this.myLayer.addChild(welfareLayer,2);
                    break;
                case "activeButton":  //活动中心
                    var _fuLiLayer = new fuLiLayer();
                    this.myLayer.addChild(_fuLiLayer,2);
                    break;
                case "GoldButton":  //兑换金币
                    var _buyGoldLayer = new buyGoldLayer();
                    this.getParent().addChild(_buyGoldLayer,100);
                    break;
                case "emailButton":
                    var emailDialog = new emailLayer();
                    this.myLayer.addChild(emailDialog,2);
                    break;
                case "supplyButton":
                    this.supplyBoxNode.removeFromParent(true);
                    this.supplyBoxNode = null;
                    Network.getInstance().send({task:"battle.openbox"});
                    break;
                case "ImageChat":
                    //显示聊天界面
                    if(GLOBALDATA.base.lev >= INTERFACECFG[22].level){
                        var chatDialog = new chatLayer();
                        this.myLayer.addChild(chatDialog,2);
                    }else{
                        var describe = StringFormat(INTERFACECFG[22].name + STRINGCFG[100045].string, INTERFACECFG[22].level);
                        ShowTipsTool.TipsFromText(describe, cc.color.RED, 30);
                    }

                    break;
                case "inviteFriendButton":
                    //好友界面
                    if(GLOBALDATA.base.lev >= 12){
                        var friendLayer1 = new friendLayer();
                        this.myLayer.addChild(friendLayer1,1);
                    }else{
                        var describe = StringFormat(INTERFACECFG[23].name + STRINGCFG[100045].string, INTERFACECFG[23].level);
                        ShowTipsTool.TipsFromText(describe, cc.color.RED, 30);
                    }

                    break;
                case"unionButton":
                    var dateLayer = new DateLayer();
                    this.myLayer.addChild(dateLayer, 2);
                    break;
                case"monCardButton":  //月卡
                    var _welfareYKLayer = new welfareYKLayer();
                    this.myLayer.addChild(_welfareYKLayer, 2);
                    break;
                case"lifeCardButton":  //终身卡
                    var _welfareZZKLayer = new welfareZZKLayer();
                    this.myLayer.addChild(_welfareZZKLayer, 2);
                    break;
                case "Panel_vip":
                    var vipFreedom = new vipFreedomLayer();
                    this.getParent().addChild(vipFreedom,998);
                    break;
                default:
                    break;
            }
        }
    },

    isCoolElimi:function(type, skillId){
        var timestamp = Helper.getServerTime();//获取服务器当前时间
        //var timestamp = parseInt(new Date().getTime()/1000);//获取当前时间
        var skilltime = timestamp - this.commander.cd[skillId];//获取已冷却时间
        if(skilltime >= 0 && skilltime <= COMMANDERSKILLCFG[skillId].skilltime){
            var event = new cc.EventCustom("TipsLayer_show");
            var strText =  StringFormat(STRINGCFG[100310].string); //100178	是否确定花费$1金钱进行一键强化
            var data = {string:strText, target:this};
            event.setUserData(data);
            cc.eventManager.dispatchEvent(event);
        } else{
            if(isEmptyObject(GLOBALDATA.base.count)){
                if(GLOBALDATA.base.diamond > 20){
                    var event = new cc.EventCustom("TipsLayer_show");
                    var _strText = StringFormat(STRINGCFG[100308].string,20);
                    var strText =  StringFormat(_strText); //100178	是否确定花费$1金钱进行一键强化
                    var data = {string:strText, callback:this.coolElimiCallback, target:this};
                    event.setUserData(data);
                    cc.eventManager.dispatchEvent(event);
                }else{
                    var event = new cc.EventCustom("TipsLayer_show");
                    //var _strText = StringFormat(STRINGCFG[100309].string,attrValue);
                    var strText =  StringFormat(STRINGCFG[100309].string); //100178	是否确定花费$1金钱进行一键强化
                    var data = {string:strText, callback:this._coolElimiCallback, target:this};
                    event.setUserData(data);
                    cc.eventManager.dispatchEvent(event);
                }
            }else{
                //var cont = GLOBALDATA.base.count;
                for(var key in CONSUMECFG){
                    if(CONSUMECFG[key].type == type && CONSUMECFG[key].count == GLOBALDATA.base.count[type]){
                        var comsuAttr = CONSUMECFG[key];
                    }
                }
                if(GLOBALDATA.base.diamond > comsuAttr.price){
                    var event = new cc.EventCustom("TipsLayer_show");
                    var _strText = StringFormat(STRINGCFG[100308].string,comsuAttr.price);
                    var strText =  StringFormat(_strText); //100178	是否确定花费$1金钱进行一键强化
                    var data = {string:strText, callback:this.coolElimiCallback, target:this};
                    event.setUserData(data);
                    cc.eventManager.dispatchEvent(event);
                }else{
                    var event = new cc.EventCustom("TipsLayer_show");
                    var strText =  StringFormat(STRINGCFG[100309].string); //100178	是否确定花费$1金钱进行一键强化
                    var data = {string:strText, callback:this._coolElimiCallback, target:this};
                    event.setUserData(data);
                    cc.eventManager.dispatchEvent(event);
                }
            }
        }
    },

    coolElimiCallback:function(ttype){
        if (ttype == 1) // 确定
        {
            commanderModel.coolElimi(101, this.skillAttrArray[1], parseInt(this.commanderid));
        }
    },

    _coolElimiCallback:function(ttype){
        if (ttype == 1) // 确定
        {
            //前往充值界面函数，等以后再弄
        }
    },

    nickChangeEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED == type){
            var _nickChangeLayer = new nickNameChangeLayer();
            this.addChild(_nickChangeLayer, combatCfg.zorder.popWindows);
        }
    },

    showSkillCover:function (sender,skillId, type,skillIdex) {
        var skillCover = sender.getChildByName('skillCover');
        var txt_countDown = sender.getChildByName('countDown');

        if( this.skillEnable[skillIdex]){
            var skilltime = COMMANDERSKILLCFG[skillId].skilltime;
        }else{
            var timestamp = Helper.getServerTime();//获取服务器当前时间
            var skilltime = timestamp - this.commander.cd[skillId];//获取已冷却时间
        }

        var self = this;
        //CD时间图标变化效果
        var doSkillCD = function() {
            self.removeBuff(type);
            self.skillEffect[skillIdex] = false;
            if(skillIdex==0){
                self.unschedule(self.addMachineBlt);
                if(self.MachineGun){
                    self.MachineGun.removeFromParent();
                    self.touchPos = null;
                }
            }

            var _timeLabel = timeLabel(skillcd);
            txt_countDown.setString(_timeLabel);
            txt_countDown.setLocalZOrder(10);

            var right = new cc.ProgressTimer(skillCover);
            right.type = cc.ProgressTimer.TYPE_RADIAL;
            right.setName("right");
            right.x = skillCover.x;
            right.y = skillCover.y;
            right.setReverseDirection(true);
            var skill = skillCover.getParent().getChildren();
            for(var i=0;i<skill.length;i++){
                var name = skill[i].getName();
                if(name == "right"){
                    skillCover.getParent().removeChild(skill[i], true);
                }
            }
            skillCover.getParent().addChild(right);

            var perent = parseInt(skillcd / COMMANDERSKILLCFG[skillId].skillcd * 100);
            var to = cc.sequence(cc.progressFromTo(skillcd, perent, 0),
                cc.callFunc(function () {
                    txt_countDown.setVisible(false);
                    self.skillEnable[skillIdex] = true;
                }),
                cc.removeSelf(true));
            right.runAction(to);

            right.schedule(function () {
                skillcd--;
                if(skillcd>0){
                    var _timeLabel = timeLabel(skillcd);
                    txt_countDown.setString(_timeLabel);
                    txt_countDown.setLocalZOrder(10);
                }
            },1,skillcd);
        };

         //持续时间图标变化效果
        var doKeep = function(){
            var _skillTimeLabel = timeLabel(_skilltime);
            txt_countDown.setString(_skillTimeLabel);
            txt_countDown.setLocalZOrder(10);

            var right = new cc.ProgressTimer(skillCover);
            right.type = cc.ProgressTimer.TYPE_BAR;
            right.setName("right");
            right.x = skillCover.x;
            right.y = skillCover.y;
            right.midPoint = cc.p(1, 0);
            right.barChangeRate = cc.p(0, 1);
            var skill = skillCover.getParent().getChildren();
            for(var i=0;i<skill.length;i++){
                var name = skill[i].getName();
                if(name == "right"){
                    skillCover.getParent().removeChild(skill[i], true);
                }
            }
            skillCover.getParent().addChild(right);

            if( self.skillEnable[skillIdex]){
                var perent = parseInt((COMMANDERSKILLCFG[skillId].skilltime - skilltime) / COMMANDERSKILLCFG[skillId].skilltime * 100);
            }else{
                var perent = parseInt(skilltime / COMMANDERSKILLCFG[skillId].skilltime * 100);
            }
            var to = cc.sequence(cc.progressFromTo(_skilltime,perent,100),
                cc.callFunc(doSkillCD),
                cc.removeSelf(true));

            right.runAction(to);

            right.schedule(function () {
                _skilltime--;
                if(_skilltime>0){
                    var _skillTimeLabel = timeLabel(_skilltime);
                    txt_countDown.setString(_skillTimeLabel);
                    txt_countDown.setLocalZOrder(10);
                }
            },1,_skilltime);
        };

        //判断技能持续时间是否满足条件
        if (skilltime >= 0 && skilltime <= COMMANDERSKILLCFG[skillId].skilltime) {
            if(this.skillEnable[skillIdex]){
                var _skilltime = skilltime;
            }else{
                var _skilltime = COMMANDERSKILLCFG[skillId].skilltime - skilltime;
            }
            var skillcd = COMMANDERSKILLCFG[skillId].skillcd;
            txt_countDown.setVisible(true);
            doKeep();
            if(skillId == 108){
                if(this.MachineGun != undefined){
                    this.MachineGun.removeFromParent();
                    this.addMachineGun();
                }else{
                    this.addMachineGun();
                }
            }else{
                this.removeBuff(type);
                this.addBuff(type);
            }
        } else if(skilltime > COMMANDERSKILLCFG[skillId].skilltime && skilltime <= COMMANDERSKILLCFG[skillId].skillcd +
            COMMANDERSKILLCFG[skillId].skilltime) {
            var skillcd = COMMANDERSKILLCFG[skillId].skillcd - skilltime + COMMANDERSKILLCFG[skillId].skilltime;
            txt_countDown.setVisible(true);
            doSkillCD();
        }
    },

    addBuff:function(type){
        for(var i in this.heroDisposal){
            if(this.heroDisposal[i]){
                this.heroDisposal[i].addBuff(type);
            }
        }
    },
    removeBuff:function(type){
        for(var i in this.heroDisposal){
            if(this.heroDisposal[i]){
                this.heroDisposal[i].removeBuff(type);
            }
        }
    },

    fightBoss:function () {
        this.totalHp = 0;
        for(var i =0;i<7;i++){
            if (this.enemyDisposal[i]){
                this.totalHp += this.enemyDisposal[i].totalHp;
            }
        }
        this.bossUpdateHp();

        this.customsBg.setVisible(false);
        this.winBg.setVisible(false);
        this.bossBarBg.setVisible(true);
        this.bossTimeBar.setPercent(100);
        // this.bossHpBar.setPercent(100);
        // this.lblHp.setString('100%');
        var downtime = this.stageLevel.time==-1?9999:this.stageLevel.time-1;
        this.leftTime = downtime+1;
        if(this.stageLevel.time==-1){
            this.textTime.setString('不限时间');
        }else {
            this.textTime.setString(formatTime(this.leftTime));
        }
        this.schedule(this.bossCountDown,1,downtime);
        this.startAtk();

    },
    bossCountDown:function () {
        this.leftTime--;

        this.bossTimeBar.setPercent(Math.round(this.leftTime/30*100));

        if(this.stageLevel.time!=-1){
            this.textTime.setString(formatTime(this.leftTime));
        }
        if(this.leftTime<=0){
            this.defeat();
        }
    },
    bossUpdateHp:function(){
        var hp = 0;
        for(var i =0;i<7;i++){
            if (this.enemyDisposal[i]){
                hp += this.enemyDisposal[i].hp;
            }
        }
        if (this.totalHp > 0)
        {
            this.bossHpBar.setPercent(Math.floor(hp/this.totalHp*100));
            this.lblHp.setString(Math.floor(hp/this.totalHp*100)+'%');
        }
    },
    bossPvpUpdateHp:function(){
        //敌军血量
        var hp = 0;
        for(var i =0;i<8;i++){
            if (this.enemyDisposal[i]){
                hp += this.enemyDisposal[i].hp;
            }
        }
        this.pvpBar.wgt.enemyHpBar.setPercent(Math.floor(hp/this.totalHp*100));
        this.pvpBar.wgt.enemylblHp.setString(Math.floor(hp/this.totalHp*100)+'%');
        //我军血量
        var armyhp = 0;
        for(var i =0;i<8;i++){
            if (this.heroDisposal[i]){
                armyhp += this.heroDisposal[i].hp;
            }
        }
        this.pvpBar.wgt.MyHpBar.setPercent(Math.floor(armyhp/this.myArmyTotalHp*100));
        this.pvpBar.wgt.MylblHp.setString(Math.floor(armyhp/this.myArmyTotalHp*100)+'%');
    },
    pvpStart:function () {
        this.pvpBar.wgt.MylblHp.setString('100%');
        this.pvpBar.wgt.enemylblHp.setString('100%');
        this.totalHp = 0;
        for(var i =0;i<8;i++){
            if (this.enemyDisposal[i]){
                this.totalHp += this.enemyDisposal[i].totalHp;
            }
        }
        //我军总血量
        this.myArmyTotalHp = 0;
        for(var i =0;i<8;i++){
            if (this.heroDisposal[i]){
                this.myArmyTotalHp += this.heroDisposal[i].totalHp;
            }
        }

        var downtime = this.stageLevel.time==-1?9999:this.stageLevel.time-1;
        this.leftTime = downtime+1;
        if(this.stageLevel.time==-1){
            this.pvpBar.wgt.fntTime.setString('不限时间');
        }else {
            this.pvpBar.wgt.fntTime.setString(formatTime(this.leftTime));
        }
        this.schedule(this.pvpCountDown,1,downtime);
        this.startAtk();

    },
    pvpCountDown:function () {
        this.leftTime--;
        if(this.stageLevel.time!=-1){
            this.pvpBar.wgt.fntTime.setString(formatTime(this.leftTime));
        }
        if(this.leftTime<=0){
            this.defeat();
        }
    },
    //获取当前是第几关
    getNowStagelevel:function(){
        var stagelevel = 0;
        var stage = GLOBALDATA.base.stage;
        for(var key in STAGECFG){
            if(STAGECFG[key].stageid == stage){
                stagelevel = STAGECFG[key].stagelevel;
                break;
            }
        }
        return stagelevel;
    },
    //监听前十关 进行特殊的指引处理
    MonitorStartTenPass:function () {
        var self = this;
        if(this.getNowStagelevel() <= 10){
            if(GLOBALDATA.base.lev <= 10 && self.challengeBoss.isVisible()
                && self.combatType == null && (GLOBALDATA.base.wins >= 3 || GLOBALDATA.base.vip>=1)
                && newGuideModel.isRunNewGuide() == false && newGuideModel.getRunState() == false){
                if(self.guideStage != GLOBALDATA.base.stage){  //当本关卡没有触发的时候才触发
                    //触发特殊的引导框
                    var temp = {};
                    temp.ttype = 3;
                    newGuideModel.addNewGuideLayer(self,1150,temp);
                    self.guideStage = GLOBALDATA.base.stage;
                }
            }
            if(this.MonitorBaseEvent == null){
                this.MonitorBaseEvent = cc.EventListener.create({
                    event:cc.EventListener.CUSTOM,
                    eventName:"data.update.base",
                    callback:function (event) {
                        var resData = event.getUserData();
                        if(resData.status == 0){
                            //监听里面的vip和wins来处理是否可以挑战boss了
                            if(GLOBALDATA.base.lev <= 10 && self.challengeBoss.isVisible()
                                && self.combatType == null && (GLOBALDATA.base.wins >= 3 || GLOBALDATA.base.vip>=1)){
                                if(resData.data.data.hasOwnProperty("vip") || resData.data.data.hasOwnProperty("wins") || resData.data.data.hasOwnProperty("stage")){
                                    if(newGuideModel.isRunNewGuide() == false && newGuideModel.getRunState() == false){  //新手引导已经走完
                                        if(self.getNowStagelevel() <= 10){
                                            if(self.guideStage != GLOBALDATA.base.stage){  //当本关卡没有触发的时候才触发
                                                //触发特殊的引导框
                                                var temp = {};
                                                temp.ttype = 3;
                                                newGuideModel.addNewGuideLayer(self,1150,temp);
                                                self.guideStage = GLOBALDATA.base.stage;
                                            }
                                        }else{
                                            cc.eventManager.removeListener(self.MonitorBaseEvent);
                                            self.MonitorBaseEvent = null;
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
                cc.eventManager.addListener(this.MonitorBaseEvent,1);
            }
        }
    },

    onExit:function () {
        this._super();
        cc.eventManager.removeListener(this.skillCdDelEvn);
        cc.eventManager.removeListener(this.skillUpdate);
        cc.eventManager.removeListener(this.stagepassEvn);
        cc.eventManager.removeListener(this.updataInitUIevn);
        cc.eventManager.removeListener(this.upNickNameEvn);
        cc.eventManager.removeListener(this.getofflineprofit);
        cc.eventManager.removeListener(this.closeDefeatLayer);
        cc.eventManager.removeListener(this.appearSupplybox);
        cc.eventManager.removeListener(this.specialNewGuidEvent);
        if (this.MonitorBaseEvent)
        {
            cc.eventManager.removeListener(this.MonitorBaseEvent);
        }

		// //cc.log('combatLayer onExit');
    }
});


//指挥官技能释放时间和CD时间文本函数
function timeLabel(time){
    if(Math.floor(time/60) <= 0 ){
        return time;
    }else{
        return timeLabel(Math.floor(time/60)) + ':'+time % 60;
    }
}