
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 var bossFightLayer = baseLayer.extend({
    ctor:function () {
        this._super();
        this.LayerName = "bossFightLayer";
        this.choose_index = 0;   //选中的boss列表中的位置
        this.paihang_tab_index = 1;   //排行界面的tab页位置
        this.Challengeid = 11;  //挑战卷id
        this.huobiid = 15;   //boss挑战对应商店货币id
    },
    onEnter:function () {
        this._super();
        var self = this;
        //注册boss信息更新事件
        this.bossChangeEvent = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            eventName:"boss.change",
            callback:function (event) {
                //刷新
                self.loadBossData(self.choose_index);
            }
        });
        cc.eventManager.addListener(this.bossChangeEvent,1);
        //获取功勋奖励回调
        this.getRewordEvent = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            eventName:"boss.getexploit",
            callback:function (event) {
                var state = event.getUserData().status;
                if(state==0){
                    self.updataGongxunReword();
                    self.resourceGet(event.getUserData());
                }
            }
        });
        cc.eventManager.addListener(this.getRewordEvent,1);
        //获取排行事件回调
        this.getRankEvent = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            eventName:"rank.getinfo",
            callback:function (event) {
                var state = event.getUserData().status;
                var id = event.getUserData().id;
                if(state==0){
                    if(id == 5){
                        self.updataGongxunRank(event.getUserData(),1);
                    }
                    if(id == 4){
                        self.updataGongxunRank(event.getUserData(),2);
                    }
                }
            }
        });
        cc.eventManager.addListener(this.getRankEvent,1);
        //开始战斗
        this.begainFigntEvent = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            eventName:"boss.begin",
            callback:function (event) {
                var state = event.getUserData().status;
                if(state==0){ //开始战斗成功
                    //进行战斗
                    var data = self.getBossListData();
                    var stage = BOSSATTRIBUTECFG[data[self.choose_index].id].stage;
                    var type = STAGECFG[stage].datasources;
                    var hpdata = {};
                    hpdata.hp = self.now_hp;
                    self.boss_combatLayer = new combatLayer(type,stage,"bossFightEvent",hpdata);
                    self.addChild(self.boss_combatLayer,2);
                    self.bossFightNode.wgt.goldValue.setString(GLOBALDATA.boss.cn);
                }
            }
        });
        cc.eventManager.addListener(this.begainFigntEvent,1);

        //结束战斗
        this.endFigntEvent = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            eventName:"boss.challenge",
            callback:function (event) {
                var state = event.getUserData().status;
                if(state==0){ //战斗结束成功  返回获取的物质
                    var data = self.getBossListData();
                    // 显示战斗结果  调用战斗结束接口
                    self.addChild(self.bossResLayer.node,2);
                    self.bossResLayer.wgt.textResTop.setString("造成伤害:"+self.thisdamage);
                    self.bossResLayer.wgt.textResGold.setString("获得功勋:"+Math.floor(20000+self.thisdamage/100000));
                    self.bossResLayer.wgt.bagBg1.setVisible(false);
                    self.bossResLayer.wgt.bagBg2.setVisible(false);
                    var bagBg_array = new Array();
                    bagBg_array.push([self.bossResLayer.wgt.bagBg1,self.bossResLayer.wgt.bagIcon1,self.bossResLayer.wgt.textNum1]);
                    bagBg_array.push([self.bossResLayer.wgt.bagBg2,self.bossResLayer.wgt.bagIcon2,self.bossResLayer.wgt.textNum2]);
                    if(data.length>0){
                        for(var i=0;i<BOSSATTRIBUTECFG[data[self.choose_index].id].drop.length;i++){
                            var thing_id = BOSSATTRIBUTECFG[data[self.choose_index].id].drop[i][0];
                            var num = BOSSATTRIBUTECFG[data[self.choose_index].id].drop[i][1];
                            bagBg_array[i][0].setVisible(true);
                            Helper.LoadFrameImageWithPlist(bagBg_array[i][0],Helper.findItemId(thing_id).quality);
                            Helper.LoadIcoImageWithPlist(bagBg_array[i][1],Helper.findItemId(thing_id));
                            bagBg_array[i][2].setString(num);
                        }
                    }
                    self.bossResLayer.wgt.btnResOk.addTouchEventListener(function (sender,type) {
                        if(ccui.Widget.TOUCH_ENDED == type){
                            self.bossResLayer.node.removeFromParent();
                            self.boss_combatLayer.removeFromParent();
                            self.loadBossData( self.choose_index);
                            if(GLOBALDATA.boss.cn<10){
                                this.unschedule(this.schedulecallback2);
                                this.schedule(this.schedulecallback2,1,null,0,null);
                            }
                        }
                    });
                    self.resourceGet(event.getUserData().data);
                }
            }
        });
        cc.eventManager.addListener(this.endFigntEvent,1);
        //接入战斗结束后的回调
        this.bossFightEvent = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            eventName:"bossFightEvent",
            callback:function (event) {
                var state = event.getUserData().result;
                var data = self.getBossListData();
                self.thisdamage = event.getUserData().atkval;
                if(data[self.choose_index].pn==GLOBALDATA.name){
                    bossFightModel.endFight(data[self.choose_index].id,event.getUserData().atkval,null,self.fight_type);
                }else{
                    bossFightModel.endFight(data[self.choose_index].id,event.getUserData().atkval,data[self.choose_index].pn,self.fight_type);
                }
            }
        });
        cc.eventManager.addListener(this.bossFightEvent,1);

        this.buyChallengeEvent = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            eventName:"boss.buychallenge",
            callback:function (event) {
                var state = event.getUserData().status;
                if(state==0){
                    //购买成功
                    self.buyNumLayerNode.node.removeFromParent();
                    self.bossFightNode.wgt.goldValue.setString(GLOBALDATA.boss.cn);
                    if(GLOBALDATA.boss.cn>=10){
                        if(this.schedulecallback2!=null){
                            this.unschedule(this.schedulecallback2);
                        }
                    }
                }
            }
        });
        cc.eventManager.addListener(this.buyChallengeEvent,1);

        this.duiHuanEvent = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            eventName:"boss.changecount",
            callback:function (event) {
                var state = event.getUserData().status;
                if(state==0){
                    //兑换成功   关闭兑换的弹框界面
                    self.buyBoxLayerNode.node.removeFromParent();
                    if(GLOBALDATA.boss.cn>=10){
                        if(this.schedulecallback2!=null){
                            this.unschedule(this.schedulecallback2);
                        }
                    }
                }
            }
        });
        cc.eventManager.addListener(this.duiHuanEvent,1);

    },
    onExit:function () {
        this._super();
        cc.eventManager.removeListener(this.bossChangeEvent);
        cc.eventManager.removeListener(this.getRewordEvent);
        cc.eventManager.removeListener(this.getRankEvent);
        cc.eventManager.removeListener(this.begainFigntEvent);
        cc.eventManager.removeListener(this.endFigntEvent);
        cc.eventManager.removeListener(this.bossFightEvent);
        cc.eventManager.removeListener(this.buyChallengeEvent);
        cc.eventManager.removeListener(this.duiHuanEvent);
        this.unscheduleAllCallbacks();
    },
    initUI:function () {
        this.bossFightNode = ccsTool.load(res.uiBossLayer,["btnBack","Node_boss","Image_flow","btnReward","btnImageSee","btnRank","btnFight","heroBossBg", "ListView_Qi","btnleft","btnright","taskImage1",
        "heroBossBg","textheroBossName","heroBossIcon","textHP","heroBossNow","Panel_hero",
            "bagHBg1","bagHIcon1","bagHPieces1","bagHBg2","bagHIcon2","bagHPieces2","bagHBg3","bagHIcon3","bagHPieces3","bagHBg4","bagHIcon4","bagHPieces4",
        "bossHpBar","lblHp","textBarName","textFaName","textFaTime","textFaTip",
        "textPowerAdd","textVip","gongValue","btnRule",
        "Panel_Wo","rewardList","btnGXGet","btnOne","btnTwo","btnThree","btnFour",
        "Panel_Ro","rewardRoList","textMyRank","textMyReward","btnGXBack",
        "Panel_Go","textName","textName1","timeGValue","textBar","goldValue","puCosValue","quCosValue","btnPuAtt","btnQuAtt","fightButton",
        "Panel_tips","btnBackTips"]);
        this.buyNumLayerNode = ccsTool.load(res.uiBuyNumLayer,["btnBack","textNumNow","textNumNot","textNum","btnMin","btnMax","btnReduce","btnAdd","cosValue","btnOk"]);
        this.buyBoxLayerNode = ccsTool.load(res.uiBuyBoxLayer,["bagBg1","bagIcon1","bagName1","bagDate1","bagNumBuy1","btnReduce","btnAdd","btnMin","btnMax","btnOk"]);
        this.bossResLayer = ccsTool.load(res.uiBossResLayer,["textTitleWin","textResTop","textResGold","bagBg1","bagIcon1","bagPieces1","bagBg2","bagIcon2","bagPieces2","btnResOk","textNum1","textNum2"]);
        this.addChild( this.bossFightNode.node,1);
        this.paihang_tab_btn_array = [this.bossFightNode.wgt.btnOne,this.bossFightNode.wgt.btnTwo,this.bossFightNode.wgt.btnThree,this.bossFightNode.wgt.btnFour];

        this.bossFightNode.wgt.btnBack.addTouchEventListener(this.touchEvent,this);
        this.bossFightNode.wgt.btnReward.addTouchEventListener(this.touchEvent,this);
        this.bossFightNode.wgt.btnImageSee.addTouchEventListener(this.touchEvent,this);
        this.bossFightNode.wgt.btnRank.addTouchEventListener(this.touchEvent,this);
        this.bossFightNode.wgt.btnFight.addTouchEventListener(this.touchEvent,this);
        this.bossFightNode.wgt.btnRule.addTouchEventListener(this.touchEvent,this);
        this.bossFightNode.wgt.btnGXGet.addTouchEventListener(this.touchEvent,this);
        this.bossFightNode.wgt.btnGXBack.addTouchEventListener(this.touchEvent,this);
        this.bossFightNode.wgt.Panel_Wo.addTouchEventListener(this.touchEvent,this);
        this.bossFightNode.wgt.Panel_Go.addTouchEventListener(this.touchEvent,this);
        this.bossFightNode.wgt.btnleft.addTouchEventListener(this.touchEvent,this);
        this.bossFightNode.wgt.btnright.addTouchEventListener(this.touchEvent,this);
        this.bossFightNode.wgt.btnOne.addTouchEventListener(this.touchEvent,this);
        this.bossFightNode.wgt.btnTwo.addTouchEventListener(this.touchEvent,this);
        this.bossFightNode.wgt.btnThree.addTouchEventListener(this.touchEvent,this);
        this.bossFightNode.wgt.btnFour.addTouchEventListener(this.touchEvent,this);
        this.bossFightNode.wgt.btnPuAtt.addTouchEventListener(this.touchEvent,this);
        this.bossFightNode.wgt.btnQuAtt.addTouchEventListener(this.touchEvent,this);
        this.bossFightNode.wgt.fightButton.addTouchEventListener(this.touchEvent,this);
        this.bossFightNode.wgt.btnBackTips.addTouchEventListener(this.touchEvent,this);
        
        //加载数据
        this.loadBossData(this.choose_index);
        this.bossFightNode.wgt.ListView_Qi.setScrollBarEnabled(false);
        this.dealRedPoint();
    },
    touchEvent:function (sender,type) {
        if(ccui.Widget.TOUCH_ENDED == type){
            switch(sender.name){
                case "btnBack":
                    this.removeFromParent();
                    break;
                case "btnReward": //功勋奖励
                    this.bossFightNode.wgt.Panel_Wo.setVisible(true);
                    this.updataGongxunReword();
                    break;
                case "btnImageSee": //图鉴商店

                    break;
                case "btnRank":  //功勋排行
                    this.bossFightNode.wgt.Panel_Ro.setVisible(true);
                    this.setTabBtnOn(1,this.paihang_tab_btn_array);
                    bossFightModel.getRankData(5,1,10);
                    break;
                case "btnFight":  //挑战按钮
                    this.bossFightNode.wgt.Panel_Go.setVisible(true);
                    //开启剩余挑战次数回复倒计时
                    this.schedulecallback2 = function () {
                        var nowtime = Date.parse(new Date());
                        var live_time = GLOBALDATA.boss.at*1000-nowtime;
                        if(live_time>=0){
                            this.bossFightNode.wgt.timeGValue.setVisible(true);
                            this.bossFightNode.wgt.timeGValue.setString("恢复时间:"+Helper.formatTime(live_time/1000));
                        }
                        else{
                            this.bossFightNode.wgt.timeGValue.setVisible(false);
                            if(this.schedulecallback2!=null){
                                this.unschedule(this.schedulecallback2);
                            }
                        }
                    };
                    if(GLOBALDATA.boss.cn<10){
                        this.bossFightNode.wgt.timeGValue.setVisible(true);
                        this.schedule(this.schedulecallback2,1,null,0,null);
                    }else{
                        this.bossFightNode.wgt.timeGValue.setVisible(false);
                    }
                    break;
                case "btnRule": //显示规则界面
                    //显示规则
                    this.bossFightNode.wgt.Panel_tips.setVisible(true);
                    break;
                case "btnBackTips":
                    this.bossFightNode.wgt.Panel_tips.setVisible(false);
                    break;
                case "btnGXGet":    //功勋奖励一键领取
                    bossFightModel.getReword(1,2);
                    break;
                case "btnGXBack":  //关闭功勋排行界面
                    this.bossFightNode.wgt.Panel_Ro.setVisible(false);
                    break;
                case "Panel_Wo":
                    this.bossFightNode.wgt.Panel_Wo.setVisible(false);
                    break;
                case "Panel_Go":
                    this.bossFightNode.wgt.Panel_Go.setVisible(false);
                    break;
                case "btnleft":
                    if(this.choose_index>0){
                        this.choose_index = this.choose_index-1;
                        this.loadBossData( this.choose_index);
                    }
                    break;
                case "btnright":
                    if(this.choose_index<this.getBossListData().length-1){
                        this.choose_index = this.choose_index+1
                        this.loadBossData( this.choose_index);
                    }
                    break;
                case "btnOne":
                    if(this.paihang_tab_index!=1){
                        this.setTabBtnOn(1,this.paihang_tab_btn_array);
                        this.paihang_tab_index = 1;
                        bossFightModel.getRankData(5,1,10);
                    }
                    break;
                case "btnTwo":
                    if(this.paihang_tab_index!=2){
                        this.setTabBtnOn(2,this.paihang_tab_btn_array);
                        this.paihang_tab_index = 2;
                        bossFightModel.getRankData(4,1,10);
                    }

                    break;
                case "btnThree":
                    if(this.paihang_tab_index!=3){
                        this.setTabBtnOn(3,this.paihang_tab_btn_array);
                        this.paihang_tab_index = 3;
                        this.updataGongxunRank(null,3);
                    }

                    break;
                case "btnFour":
                    if(this.paihang_tab_index!=4){
                        this.setTabBtnOn(4,this.paihang_tab_btn_array);
                        this.paihang_tab_index = 4;
                        this.updataGongxunRank(null,4);
                    }
                    break;
                case "btnQuAtt": //全力一击
                    if(GLOBALDATA.boss.cn>=2){
                        this.fight_type = 2;
                        var data = this.getBossListData();
                        if(data[this.choose_index].pn==GLOBALDATA.name){
                            bossFightModel.begainFight(data[this.choose_index].id,null,2);
                        }else{
                            bossFightModel.begainFight(data[this.choose_index].id,data[this.choose_index].pn,2);
                        }
                    }else{
                        ShowTipsTool.TipsFromText(STRINGCFG[100232].string,cc.color.RED,30);
                    }
                    break;
                case "btnPuAtt": //普通攻击
                    if(GLOBALDATA.boss.cn>=1){
                        this.fight_type = 1;
                        var data = this.getBossListData();
                        if(data[this.choose_index].pn==GLOBALDATA.name){
                            bossFightModel.begainFight(data[this.choose_index].id,null,1);
                        }else{
                            bossFightModel.begainFight(data[this.choose_index].id,data[this.choose_index].pn,1);
                        }
                    }else{
                        ShowTipsTool.TipsFromText(STRINGCFG[100232].string,cc.color.RED,30);
                    }
                    break;
                case "fightButton":
                    //判断有无挑战卷
                    var self = this;
                    var getCost = function (num) {
                        var getresult = function (usenum) {
                            var backresult = 0;
                            if(usenum%2==0){
                                var n = usenum/2;
                                backresult = (n*6+n*(n-1)*2/2)*2;
                            }else{
                                var n = (usenum-1)/2;
                                backresult = (n*6+n*(n-1)*2/2)*2+(6+n*2);
                            }
                            return backresult;
                        };
                        var result = 0;
                        if(num!=0){
                            var usenum = GLOBALDATA.boss.bn+num;
                            result = getresult(usenum)-getresult(GLOBALDATA.boss.bn);
                        }else{
                            result = 0;
                        }
                        return result;
                    }
                    if(GLOBALDATA.knapsack[11]!=null){
                        //有挑战卷，则使用挑战卷增加数量
                        this.addChild(this.buyBoxLayerNode.node,3);
                        this.buyBoxLayerNode.wgt.bagName1.setString("挑战卷");
                        this.buyBoxLayerNode.wgt.bagDate1.setString(GLOBALDATA.knapsack[11]);
                        Helper.LoadFrameImageWithPlist(this.buyBoxLayerNode.wgt.bagBg1,Helper.findItemId(11).quality);
                        Helper.LoadIcoImageWithPlist(this.buyBoxLayerNode.wgt.bagIcon1,Helper.findItemId(11));
                        var use_num = 0; //选择使用的挑战卷数量
                        var buy_box_touch = function (sender,type) {
                            if(ccui.Widget.TOUCH_ENDED == type){
                                switch(sender.name){
                                    case "btnReduce":
                                        if(use_num>0){
                                            use_num = use_num-1;
                                            self.buyBoxLayerNode.wgt.bagNumBuy1.setString(use_num);
                                        }
                                        break;
                                    case "btnAdd":
                                        if(use_num<GLOBALDATA.knapsack[11]){
                                            use_num = use_num+1;
                                            self.buyBoxLayerNode.wgt.bagNumBuy1.setString(use_num);
                                        }
                                        break;
                                    case "btnMin":
                                        use_num = 0;
                                        self.buyBoxLayerNode.wgt.bagNumBuy1.setString(use_num);
                                        break;
                                    case "btnMax":
                                        use_num = GLOBALDATA.knapsack[11];
                                        self.buyBoxLayerNode.wgt.bagNumBuy1.setString(use_num);
                                        break;
                                    case "btnOk":
                                        //调用跳转卷转换成挑战次数接口
                                        bossFightModel.duiHuanFightNum(use_num);
                                        break;
                                }
                            }
                        };
                        this.buyBoxLayerNode.wgt.btnReduce.addTouchEventListener(buy_box_touch);
                        this.buyBoxLayerNode.wgt.btnAdd.addTouchEventListener(buy_box_touch);
                        this.buyBoxLayerNode.wgt.btnMin.addTouchEventListener(buy_box_touch);
                        this.buyBoxLayerNode.wgt.btnMax.addTouchEventListener(buy_box_touch);
                        this.buyBoxLayerNode.wgt.btnOk.addTouchEventListener(buy_box_touch);
                    }else{
                        var buy_max = Helper.getVipNumberByUneed(GLOBALDATA.base.vip,12);
                        if(buy_max-GLOBALDATA.boss.bn>0){
                            this.addChild(this.buyNumLayerNode.node,3);
                            this.buyNumLayerNode.wgt.textNumNow.setString("当前次数:"+GLOBALDATA.boss.cn);
                            this.buyNumLayerNode.wgt.textNumNot.setString("还可购买:"+(buy_max-GLOBALDATA.boss.bn));
                            this.buyNumLayerNode.wgt.textNum.setString(0);
                            self.buyNumLayerNode.wgt.cosValue.setString(0);
                            var had_cost = 0;  //总的花费金额
                            var choose_num = 0;//购买总数
                            var buynum_touch = function (sender,type) {
                                if(ccui.Widget.TOUCH_ENDED == type){
                                    switch(sender.name){
                                        case "btnReduce":
                                            if(choose_num>0){
                                                choose_num = choose_num-1;
                                                self.buyNumLayerNode.wgt.textNum.setString(choose_num);
                                                had_cost = getCost(choose_num);
                                                self.buyNumLayerNode.wgt.cosValue.setString(had_cost);
                                            }
                                            break;
                                        case "btnAdd":
                                            if(choose_num<buy_max-GLOBALDATA.boss.bn){
                                                choose_num = choose_num+1;
                                                self.buyNumLayerNode.wgt.textNum.setString(choose_num);
                                                had_cost = getCost(choose_num);
                                                self.buyNumLayerNode.wgt.cosValue.setString(had_cost);
                                            }else{
                                                ShowTipsTool.TipsFromText(STRINGCFG[100307].string,cc.color.RED,30);
                                            }
                                            break;
                                        case "btnMin":
                                            choose_num = 0;
                                            self.buyNumLayerNode.wgt.textNum.setString(choose_num);
                                            had_cost = getCost(choose_num);
                                            self.buyNumLayerNode.wgt.cosValue.setString(had_cost);
                                            break;
                                        case "btnMax":
                                            choose_num = 10-GLOBALDATA.boss.bn;
                                            self.buyNumLayerNode.wgt.textNum.setString(choose_num);
                                            had_cost = getCost(choose_num);
                                            self.buyNumLayerNode.wgt.cosValue.setString(had_cost);
                                            break;
                                        case "btnOk": //购买挑战次数
                                            bossFightModel.buyFightNum(choose_num);
                                            break;
                                        case "btnBack":
                                            self.buyNumLayerNode.node.removeFromParent();
                                            break;
                                        default:
                                            break;
                                    }
                                }
                            };
                            this.buyNumLayerNode.wgt.btnReduce.addTouchEventListener(buynum_touch);
                            this.buyNumLayerNode.wgt.btnAdd.addTouchEventListener(buynum_touch);
                            this.buyNumLayerNode.wgt.btnMin.addTouchEventListener(buynum_touch);
                            this.buyNumLayerNode.wgt.btnMax.addTouchEventListener(buynum_touch);
                            this.buyNumLayerNode.wgt.btnOk.addTouchEventListener(buynum_touch);
                            this.buyNumLayerNode.wgt.btnBack.addTouchEventListener(buynum_touch);
                        }
                    }

                    break;
                default:
                    break;
            }
        }
    },
    
    loadBossData:function (index) {
        this.unschedule(this.schedulecallback1);
     //   this.unscheduleAllCallbacks();
        //加载底部累计伤害  功勋等信息
        this.loadBottomInfo();
        //判断有无boss
        var listdata = this.getBossListData();
        if(listdata.lenght!=0){
            this.bossFightNode.wgt.Node_boss.setVisible(true);
            this.bossFightNode.wgt.Image_flow.setVisible(false);
            //加载顶部boss列表数据
            this.loadBossList(listdata,index);
        }else{
            this.bossFightNode.wgt.Node_boss.setVisible(false);
            this.bossFightNode.wgt.Image_flow.setVisible(true);
        }
    },

    loadBossList:function (data,index) {
        this.bossFightNode.wgt.ListView_Qi.removeAllChildren();
        var nowtime = Date.parse(new Date());
        var in_list_data = new Array();
        for(var i=0;i<data.length;i++) {
            //判断boss出现时间跟当前时间是否超过一小时  超过 则不加入列表
            var begain_time = data[i].bt * 1000;
            if (nowtime - begain_time < 3600000) {
                in_list_data.push(data[i]);
            }
        }
        var hole_hp=0;
        for(var i=0;i<in_list_data.length;i++){
            var oneitem =  this.bossFightNode.wgt.heroBossBg.clone();
            this.bossFightNode.wgt.ListView_Qi.pushBackCustomItem(oneitem);
            var thisboss = BOSSATTRIBUTECFG[in_list_data[i].id];
            var thismonster = MONSTERCFG[thisboss.monsterid];

            var heroBossBg_item = ccui.helper.seekWidgetByName(oneitem,"heroBossBg");
            Helper.LoadFrameImageWithPlist(heroBossBg_item,thismonster.masterquality);
            var heroBossIcon_item = ccui.helper.seekWidgetByName(oneitem,"heroBossIcon");
            cc.spriteFrameCache.addSpriteFrames(res.heroicon_plist);
            heroBossIcon_item.loadTexture(thismonster.mastericon, ccui.Widget.PLIST_TEXTURE);
            var textheroBossName_item = ccui.helper.seekWidgetByName(oneitem,"textheroBossName");
            textheroBossName_item.setString(thismonster.mastername);
            var textHP_item = ccui.helper.seekWidgetByName(oneitem,"textHP");
            //从boss属性表里取对应id的boss的相关属性
            var now_hp=0;
            var stage = BOSSATTRIBUTECFG[in_list_data[i].id].stage;
            var datasource = STAGECFG[stage].datasources;
            if(datasource==1){ //按照等级增长值计算攻防血

            }else if(datasource==2){  //stage表里配置的固定项
                hole_hp = STAGECFG[stage].bossrate[0][0];
                if(hole_hp<=data[index].hp){
                    now_hp = 0;
                }else{
                    now_hp = hole_hp - data[index].hp;
                }
            }
         //   var boss_lv = STAGECFG[BOSSATTRIBUTECFG[in_list_data[i].id].stage].lv;
        //    var now_hp = thismonster.addhp*(boss_lv-1)+thismonster.basehp-in_list_data[i].hp;
         //   var hp_percent = Math.floor((now_hp/(thismonster.addhp*(boss_lv-1)+thismonster.basehp))*100);
            var hp_percent = Math.floor((now_hp/hole_hp)*100);
            textHP_item.setString(hp_percent+"%");
            var heroBossNow_item = ccui.helper.seekWidgetByName(oneitem,"heroBossNow");
            if(i==index){
                //显示选中状态
                heroBossNow_item.setVisible(true);
            }
            else{
                //显示未选中状态
                heroBossNow_item.setVisible(false);
            }
            heroBossIcon_item.setTag(i);
            var self = this;
            heroBossIcon_item.addTouchEventListener(function (sender,type) {
                if(ccui.Widget.TOUCH_ENDED == type){
                    self.choose_index = sender.getTag();
                    self.loadBossData(self.choose_index);
                }
            });
        }
        //加载选中项的boss信息
        this.loadBossInfo(in_list_data,index);
    },
    loadBottomInfo:function () {
        this.bossFightNode.wgt.textPowerAdd.setString("累计伤害:"+GLOBALDATA.boss.da);
        this.bossFightNode.wgt.textVip.setString("累计功勋:"+GLOBALDATA.boss.ex);
        if(GLOBALDATA.virtual[this.huobiid] == null){
            this.bossFightNode.wgt.gongValue.setString(0);
        }else{
            this.bossFightNode.wgt.gongValue.setString(GLOBALDATA.virtual[this.huobiid]);
        }
    },
    loadBossInfo:function (data,index) {
        if(data.length!=0){
            if(this.bossFightNode.wgt.ListView_Qi.getChildrenCount()!=0){
                var bossid = data[index].id;
                var stage = BOSSATTRIBUTECFG[bossid].stage;
                var datasource = STAGECFG[stage].datasources;

                var thisboss = BOSSATTRIBUTECFG[data[index].id];
                var thismonster = MONSTERCFG[thisboss.monsterid];
                //加载boss数据
                var modelShowLayout = this.bossFightNode.wgt.Panel_hero;
                modelShowLayout.removeAllChildren();
                HeroDefault.runAdle(thismonster.masterid,modelShowLayout,200,0,1,2);
                this.bossFightNode.wgt.textBarName.setString(thismonster.mastername);
             //   var boss_lv = STAGECFG[BOSSATTRIBUTECFG[data[index].id].stage].lv;
                this.now_hp;
                var hole_hp2;
                if(datasource==1){ //按照等级增长值计算攻防血

                }else if(datasource==2){  //stage表里配置的固定项
                    hole_hp2 = STAGECFG[stage].bossrate[0][0];
                    if(hole_hp2<=data[index].hp){
                        this.now_hp = 0;
                    }else{
                        this.now_hp = hole_hp2 - data[index].hp;
                    }
                }
                var hp_percent = Math.floor((this.now_hp/hole_hp2)*100);
                this.bossFightNode.wgt.lblHp.setString(hp_percent+"%");
                this.bossFightNode.wgt.bossHpBar.setPercent(hp_percent);
                this.bossFightNode.wgt.textFaName.setString("发现者:"+data[index].pn);
                //战斗panel数据加载
                this.bossFightNode.wgt.textName.setString(thismonster.mastername);
                this.bossFightNode.wgt.goldValue.setString(GLOBALDATA.boss.cn);
                this.bossFightNode.wgt.puCosValue.setString(1);
                this.bossFightNode.wgt.quCosValue.setString(2);
                this.bossFightNode.wgt.textBar.setString("生命值:"+this.now_hp+"/"+hole_hp2);

                this.showReword(data[index].id);
                this.schedulecallback1 = function () {
                    var nowtime = Date.parse(new Date());
                    var live_time = 3600000 - (nowtime-data[index].bt*1000);
                    if(live_time>0){
                        this.bossFightNode.wgt.textFaTime.setString("逃走时间:"+Helper.formatTime(live_time/1000));
                        this.bossFightNode.wgt.textName1.setString("逃走时间:"+Helper.formatTime(live_time/1000));
                    }else{
                        //怪物到时间 关闭定时器 从列表中移除此boss
                        this.bossFightNode.wgt.ListView_Qi.removeItem(index);
                        if(this.bossFightNode.wgt.ListView_Qi.getChildrenCount()>index+1){
                            this.choose_index = this.bossFightNode.wgt.ListView_Qi.getChildrenCount()-1;
                        }
                        this.bossFightNode.wgt.Panel_Go.setVisible(false);
                        if(this.schedulecallback2!=null){
                            this.unschedule(this.schedulecallback2);
                        }
                        this.loadBossData(this.choose_index);
                    }
                };
                //开启一个计时器
                this.schedule(this.schedulecallback1,1,null,0,null);
            }else{
                this.bossFightNode.wgt.Node_boss.setVisible(false);
                this.bossFightNode.wgt.Image_flow.setVisible(true);
            }
        }
        else{
            this.bossFightNode.wgt.Node_boss.setVisible(false);
            this.bossFightNode.wgt.Image_flow.setVisible(true);
        }
    },
    //显示boss击杀之后的奖励
    showReword:function (id) { //boss id
        if( BOSSATTRIBUTECFG[id]!=null && BOSSATTRIBUTECFG[id].drop.length>0){
            var bagHBg_array = [this.bossFightNode.wgt.bagHBg1,this.bossFightNode.wgt.bagHBg2,this.bossFightNode.wgt.bagHBg3,this.bossFightNode.wgt.bagHBg4];
            var bagHIcon_array = [this.bossFightNode.wgt.bagHIcon1,this.bossFightNode.wgt.bagHIcon2,this.bossFightNode.wgt.bagHIcon3,this.bossFightNode.wgt.bagHIcon4];
            var bagHPieces_array = [this.bossFightNode.wgt.bagHPieces1,this.bossFightNode.wgt.bagHPieces2,this.bossFightNode.wgt.bagHPieces3,this.bossFightNode.wgt.bagHPieces4];
            this.bossFightNode.wgt.bagHBg1.setVisible(false);
            this.bossFightNode.wgt.bagHBg2.setVisible(false);
            this.bossFightNode.wgt.bagHBg3.setVisible(false);
            this.bossFightNode.wgt.bagHBg4.setVisible(false);
            var count = 0;
            for(var i in BOSSATTRIBUTECFG[id].drop){
                bagHBg_array[count].setVisible(true);
                var thingid = BOSSATTRIBUTECFG[id].drop[i][0];
                Helper.LoadIconFrameAndAddClick(bagHIcon_array[i],bagHBg_array[i],bagHPieces_array[i],Helper.findItemId(thingid));
                count = count+1;
            }
        }
    },

    getBossListData:function () {
        var data = new Array();
        for(key in GLOBALDATA.boss.list){
            data.push(GLOBALDATA.boss.list[key]);
        }
        return data;
    },
    //更新功勋奖励界面数据
    updataGongxunReword:function () {
        var rewordData = new Array();
        var yijianlingqu = false;
        for(key in BOSSAWARDLISTCFG){
            rewordData.push(BOSSAWARDLISTCFG[key]);
        }
        rewordData.sort(this.paixu);
        this.bossFightNode.wgt.rewardList.removeAllChildren();
        for(var i=0;i<rewordData.length;i++){
            var reworditem = ccsTool.load(res.uiBossRewordItem,["item"]).wgt.item;
            reworditem.removeFromParent(false);
            this.bossFightNode.wgt.rewardList.pushBackCustomItem(reworditem);

            var itemName = ccui.helper.seekWidgetByName(reworditem,"itemName");
            var item_Lv = ccui.helper.seekWidgetByName(reworditem,"itemLv");
            //   var bag_ItemBg1 = ccui.helper.seekWidgetByName(reworditem,"bagItemBg1");
        //    var bagItem_Icon1 = ccui.helper.seekWidgetByName(reworditem,"bagItemIcon1");
         //   var bagItem_Pieces1 = ccui.helper.seekWidgetByName(reworditem,"bagItemPieces1");
            var reward_item_get = ccui.helper.seekWidgetByName(reworditem,"rewardItemGet");
            var btn_item_get = ccui.helper.seekWidgetByName(reworditem,"btnItemGet");
            itemName.setString(rewordData[i].name);
            btn_item_get.setTag(rewordData[i].ID);
            btn_item_get.addTouchEventListener(function (sender,type) {
                if(ccui.Widget.TOUCH_ENDED == type){
                    //调用领取功勋方法
                    bossFightModel.getReword(sender.getTag(),1);
                }
            });
            if(GLOBALDATA.boss.exg[rewordData[i].ID-1]==1){
                //已领取
                reward_item_get.setVisible(true);
                btn_item_get.setVisible(false);
                item_Lv.setString("进度:"+rewordData[i].endprint+"/"+rewordData[i].endprint);
            }else{
                reward_item_get.setVisible(false);
                btn_item_get.setVisible(true);
                if(GLOBALDATA.boss.ex>0){
                    if(rewordData[i].endprint<=GLOBALDATA.boss.ex){
                        //达到可领取条件
                        btn_item_get.setBright(true);
                        btn_item_get.setEnabled(true);
                        item_Lv.setString("进度:"+rewordData[i].endprint+"/"+rewordData[i].endprint);
                        yijianlingqu = true; //只要有一项达到可领取条件 一键领取按钮可点击
                    }else{
                        btn_item_get.setBright(false);
                        btn_item_get.setEnabled(false);
                        item_Lv.setString("进度:"+GLOBALDATA.boss.ex+"/"+rewordData[i].endprint);
                    }
                }else{
                    btn_item_get.setBright(false);
                    btn_item_get.setEnabled(false);
                    item_Lv.setString("进度:"+GLOBALDATA.boss.ex+"/"+rewordData[i].endprint);
                }
            }
        }
        if(yijianlingqu==true){
            this.bossFightNode.wgt.btnGXGet.setEnabled(true);
            this.bossFightNode.wgt.btnGXGet.setBright(true);
        }else{
            this.bossFightNode.wgt.btnGXGet.setEnabled(false);
            this.bossFightNode.wgt.btnGXGet.setBright(false);
        }
    },
    updataGongxunRank:function (data,tabindex) {
        var data_array = new Array();
        if(data!=null){
            var role_data = data.data;
            var myposition = data.my;
        }
        if(tabindex == 1 || tabindex == 2){
            this.bossFightNode.wgt.rewardRoList.removeAllChildren();
            //功勋排行 伤害排行
            for(key in role_data){
                data_array.push(role_data[key]);
            }
            for(var i=0;i<data_array.length;i++){
                var rank1item = ccsTool.load(res.uiBossRankItem,["item"]).wgt.item;
                rank1item.removeFromParent(false);
                this.bossFightNode.wgt.rewardRoList.pushBackCustomItem(rank1item);

                var textBMFontRank = ccui.helper.seekWidgetByName(rank1item,"textBMFontRank");
                var itemRankName = ccui.helper.seekWidgetByName(rank1item,"itemRankName");
                var itemRankWar = ccui.helper.seekWidgetByName(rank1item,"itemRankWar");
                var itemRankReward = ccui.helper.seekWidgetByName(rank1item,"itemRankReward");
                var bagItemRBg1 = ccui.helper.seekWidgetByName(rank1item,"bagItemRBg1");
                var bagItemRIcon1 = ccui.helper.seekWidgetByName(rank1item,"bagItemRIcon1");

                var this_role_simple_info = data_array[i];
                textBMFontRank.setString((i+1)+"");
                itemRankName.setString(this_role_simple_info.name);
                itemRankWar.setString("战力:"+this_role_simple_info.atk);
                itemRankReward.setString("等级:"+this_role_simple_info.lev);
                //人物头像暂时空缺
            }
            for(key in BOSSRANKLISTCFG){
                if(myposition<=BOSSRANKLISTCFG[key].rank[1]){
                    this.bossFightNode.wgt.textMyReward.setString("我的奖励:"+BOSSRANKLISTCFG[key].item[1]);
                    break;
                }
            }
            this.bossFightNode.wgt.textMyRank.setString("我的排名:"+myposition);
        }
        if(tabindex == 3 || tabindex==4){
            this.bossFightNode.wgt.rewardRoList.removeAllChildren();
            //功勋奖励 伤害奖励
            for(key in BOSSRANKLISTCFG){
                data_array.push(BOSSRANKLISTCFG[key]);
            }
            for(var i=0;i<data_array.length;i++){
                var rank1item = ccsTool.load(res.uiBossRankGetItem,["item"]).wgt.item;
                rank1item.removeFromParent(false);
                this.bossFightNode.wgt.rewardRoList.pushBackCustomItem(rank1item);

                var textRankGet =  ccui.helper.seekWidgetByName(rank1item,"textRankGet");
                var bagItemRGBg1 = ccui.helper.seekWidgetByName(rank1item,"bagItemRGBg1");
                var bagItemRGIcon1 = ccui.helper.seekWidgetByName(rank1item,"bagItemRGIcon1");
                var textRankGet_Num = ccui.helper.seekWidgetByName(rank1item,"textRankGet_Num");
                if(data_array[i].rank[0]!=data_array[i].rank[1]){
                    textRankGet.setString("第"+data_array[i].rank[0]+"~"+data_array[i].rank[1]+"名")
                }else{
                    textRankGet.setString("第"+data_array[i].rank[0]+"名");
                }
                var thisthing = Helper.findItemId(data_array[i].item[0]);
                var thisthingnum = data_array[i].item[1];
                Helper.LoadFrameImageWithPlist(bagItemRGBg1,thisthing.quality);
                Helper.LoadIcoImageWithPlist(bagItemRGIcon1,thisthing);
                textRankGet_Num.setString(thisthingnum+"");
            }
        }
    },

    //功勋列表排序
    paixu:function (a,b) {
        if(GLOBALDATA.boss.exg[a.ID-1]==1&&GLOBALDATA.boss.exg[b.ID-1]!=1){//已领取的往后放
            return 1;
        }else{
            if(GLOBALDATA.boss.ex-a.endprint<0 && GLOBALDATA.boss.ex-b.endprint>0){
                return 1;
            }else{
                if(a.endprint>b.endprint){
                    return 1;
                }else{
                    return -1;
                }
            }
        }
    },
    //设置一个tab组的tab按钮的显示情况
    setTabBtnOn:function (index,btnarray) {
        for(var i=0;i<btnarray.length;i++){
            if(i+1==index){
                btnarray[i].setBright(false);
            }else{
                btnarray[i].setBright(true);
            }
        }
    },
    resourceGet:function(data){
        if(data != undefined && data.data != undefined)
        {
            data.task = 'resource.get';

            var event = new cc.EventCustom(data.task);
            event.setUserData(data);
            cc.eventManager.dispatchEvent(event);
        }
    },
    //处理红点
    dealRedPoint:function(data){
        var redInfo = RedPoint.bossPanleRedPoint(data);
        if(redInfo!=null){
            if(redInfo.gongxun!=null){
                if(redInfo.gongxun==true){
                    //显示功勋奖励红点
                    this.bossFightNode.wgt.taskImage1.setVisible(true);
                }else{
                    this.bossFightNode.wgt.taskImage1.setVisible(false);
                }
            }
        }
    },
});