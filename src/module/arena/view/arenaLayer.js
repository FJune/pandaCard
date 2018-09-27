
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 var arenaLayer =  baseLayer.extend({
    ctor:function (){
        this._super();
        this.LayerName = "arenaLayer";
        this.arenaid = 7;    //竞技场的货币id（声望）
        this.all_hero_array = new Array();  //英雄表所有英雄id的array
        this.uiAttributeLayer.setVisible(false);
    },
    onEnter:function (){
        this._super();
        this.saveAllHeroId(this.all_hero_array);
        var self = this;
        this.refreshEvent = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            eventName:"arena.refresh",
            callback:function (event) {
                if(event.getUserData().status==0){
                    //加载挑战列表数据
                    self.loadFirstArena(event.getUserData().data);
                }
            }
        });
        cc.eventManager.addListener(this.refreshEvent,1);

        this.arenaRankEvent = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            eventName:"rank.getinfo",
            callback:function (event) {
                if(event.getUserData().status==0){
                    //加载竞技场排行数据
                    self.loadSecondArena(event.getUserData().data);
                }
            }
        });
        cc.eventManager.addListener(this.arenaRankEvent,1);

        this.arenaBuyCountEvent = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            eventName:"arena.buycount",
            callback:function (event) {
                if(event.getUserData().status==0){
                    self.unscheduleAllCallbacks();
                    self.arenaNode.wgt.btnChange.setVisible(true);
                    self.arenaNode.wgt.btnChongZhi.setVisible(false);
                    self.loadDataOnUI();
                }else if(event.getUserData().status==100){
                    ShowTipsTool.TipsFromText(STRINGCFG[100079].string,cc.color.RED,30);
                }
            }
        });
        cc.eventManager.addListener(this.arenaBuyCountEvent,1);

        this.arenaFightEventEvent = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            eventName:"arenaFightEvent",
            callback:function (event) {
                self.victory_str = event.getUserData().result;
                if(self.victory_str=="victory"){
                    //调用战斗结束的接口方法
                    arenaModel.endFight(self.fight_pos,1,0,1);
                }else if(self.victory_str=="outBoss"||self.victory_str=="defeat"){
                    arenaModel.endFight(self.fight_pos,1,0,0);
                }
            }
        });
        cc.eventManager.addListener(this.arenaFightEventEvent,1);

        this.endFightEventEvent = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            eventName:"arena.stage",
            callback:function (event) {
                if(event.getUserData().status==0){
                    //战斗结束  获取奖励显示,更新界面
                    self.addChild(self.arenaResLayer.node,3);
                    var setPanelData = function (type) { //type 胜利还是失败 0 1
                        var touchFunction = function () {
                            if(self.jq_combatLayer!=null){
                                self.jq_combatLayer.removeFromParent();
                            }
                            if(self.pvp_combatLayer!=null){
                                self.pvp_combatLayer.removeFromParent();
                            }
                            self.arenaResLayer.node.removeFromParent();
                            self.loadDataOnUI();
                        };
                        if(type==0){
                            self.arenaResLayer.wgt.textResGold.setString("金币:"+event.getUserData().data[1]);
                            self.arenaResLayer.wgt.textResHonor.setString("声望:"+event.getUserData().data[7]);
                            self.arenaResLayer.wgt.btnResOk.addTouchEventListener(touchFunction);
                            if(self.addpos>0){
                                self.arenaResLayer.wgt.textResTop.setVisible(true);
                                self.arenaResLayer.wgt.textResTop.setString("排名:"+GLOBALDATA.arena.my+"(上升"+self.addpos+"名)");
                            }else{
                                self.arenaResLayer.wgt.textResTop.setVisible(false);
                            }
                        }
                        else{
                            self.arenaResLayer.wgt.textLoseGold.setString("金币:"+event.getUserData().data[1]);
                            self.arenaResLayer.wgt.textLoseHonor.setString("声望:"+event.getUserData().data[7]);
                            self.arenaResLayer.wgt.btnLoseOk.addTouchEventListener(touchFunction);
                        }
                    };
                    if(self.victory_str=="victory"){
                        self.arenaResLayer.wgt.ImageFastWin.setVisible(true);
                        self.arenaResLayer.wgt.ImageFastlose.setVisible(false);
                        arenaModel.refreshArena();
                        setPanelData(0);
                    }else{
                        if(event.getUserData().typ==1){ //扫荡
                            self.arenaResLayer.wgt.ImageFastWin.setVisible(true);
                            self.arenaResLayer.wgt.ImageFastlose.setVisible(false);
                            setPanelData(0);
                        }else{
                            self.arenaResLayer.wgt.ImageFastWin.setVisible(false);
                            self.arenaResLayer.wgt.ImageFastlose.setVisible(true);
                            setPanelData(1);
                        }
                    }
                }else{
                    //错误提示
                }
            }
        });
        cc.eventManager.addListener(this.endFightEventEvent,1);

        this.startFightEventEvent = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            eventName:"arena.stagebegin",
            callback:function (event) {
                if(event.getUserData().status==0){
                    self.victory_str = null;
                    //战斗开始
                    if(self.target_data.typ==1){ //走机器人流程  不通过服务器返回数据
                        var robot = self.creatRobot(self.target_data.pos);
                        var arraydata = {};
                        var bossid_array = new Array();
                        for(var t in robot.battles){
                            if(robot.battles[t]!=0&&robot.battles[t]!=-1){
                                bossid_array.push(robot.battles[t]);
                            }
                        }
                        arraydata.bossid = bossid_array;
                        var bossrate_array = new Array();
                        for(var p in robot.atkvalue){
                            if(robot.battles[p]!=0&&robot.battles[p]!=-1){
                                bossrate_array.push([robot.atkvalue[p],robot.def[p],robot.hp[p]])
                            }
                        }
                        arraydata.bossrate = bossrate_array; //攻防血
                        self.jq_combatLayer = new combatLayer(4,999999,"arenaFightEvent",arraydata);
                        self.addChild(self.jq_combatLayer,2);
                    }else{
                        arenaModel.getPlayerInfo(self.target_data.id);
                    }
                }
            }
        });
        cc.eventManager.addListener(this.startFightEventEvent,1);

        this.updataEventEvent = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            eventName:"data.update.arena",
            callback:function (event) {
                if(event.getUserData().status==0){
                    if(event.getUserData().data.data.num!=null){
                        //修改次数变化值  开启定时器
                        self.loadDataOnUI();
                        self.begainArenaSchedule();
                        //如果对战列表有扫荡项的数据 更新扫荡按钮的显示
                        if(self.saodang_item_array!=null && self.saodang_item_array.length>0){
                            for(var i=0;i<self.saodang_item_array.length;i++){
                                var item = self.saodang_item_array[i];
                                var text_sweep = ccui.helper.seekWidgetByName(item,"Text_sweep");
                                var saodangbtn = ccui.helper.seekWidgetByName(item,"sweepItemButton");
                                if(GLOBALDATA.arena.num==0){
                                    saodangbtn.setVisible(false)
                                }else{
                                    saodangbtn.setVisible(true);
                                    text_sweep.setString("扫荡"+GLOBALDATA.arena.num+"次");
                                }
                            }
                        }
                        if(self.tiaozhan_item_array!=null && self.tiaozhan_item_array.length>0){
                            for(var i=0;i<self.tiaozhan_item_array.length;i++){
                                var item = self.tiaozhan_item_array[i];
                                var tiaozhanbtn = ccui.helper.seekWidgetByName(item,"fightItemButton");
                                if(GLOBALDATA.arena.num==0){
                                    tiaozhanbtn.setVisible(false)
                                }else{
                                    tiaozhanbtn.setVisible(true);
                                }
                            }
                        }
                    }
                }
            }
        });
        cc.eventManager.addListener(this.updataEventEvent,1);

        this.getPlayerInfoEventEvent = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            eventName:"getinfo.battle",
            callback:function (event) {
                if(event.getUserData().status==0){
                    self.pvp_combatLayer = new combatLayer(3,999999,"arenaFightEvent",event.getUserData().data);
                    self.addChild(self.pvp_combatLayer,2);
                }
            }
        });
        cc.eventManager.addListener(this.getPlayerInfoEventEvent,1);
    },
    onExit:function (){
        this._super();
        cc.eventManager.removeListener(this.refreshEvent);
        cc.eventManager.removeListener(this.arenaRankEvent);
        cc.eventManager.removeListener(this.arenaBuyCountEvent);
        cc.eventManager.removeListener(this.arenaFightEventEvent);
        cc.eventManager.removeListener(this.endFightEventEvent);
        cc.eventManager.removeListener(this.startFightEventEvent);
        this.arenaResLayer.node.release();
        this.unscheduleAllCallbacks();
    },
    initUI:function () {
        this.arenaResLayer = ccsTool.load(res.uiArenaResLayer,["ImageFastlose","textLoseGold","textLoseHonor","btnLoseOk","ImageFastWin","textResTop","textResGold","textResHonor","btnResOk"]);
        this.arenaResLayer.node.retain();

        this.arenaNode = ccsTool.load(res.uiArenaLayer,["btnBack","prestigeValue","textRank","textFight","textDiamond","textRePresige","listArena","textNum","textTime","btnChange","btnRank","btnPrestige","btnChongZhi",
        "layoutRank","listRank","btnRBack","textDiaCos"]);
        this.addChild(this.arenaNode.node,1);

        this.arenaNode.wgt.btnBack.addTouchEventListener(this.touchEvent,this);
        this.arenaNode.wgt.btnChange.addTouchEventListener(this.touchEvent,this);
        this.arenaNode.wgt.btnRank.addTouchEventListener(this.touchEvent,this);
        this.arenaNode.wgt.btnRBack.addTouchEventListener(this.touchEvent,this);
        this.arenaNode.wgt.btnPrestige.addTouchEventListener(this.touchEvent,this);
        this.arenaNode.wgt.btnChongZhi.addTouchEventListener(this.touchEvent,this);

        arenaModel.refreshArena();  //进入界面取一次对战列表数据
        this.loadDataOnUI();
    },

    touchEvent:function (sender,type) {
        if(type == ccui.Widget.TOUCH_ENDED){
            switch(sender.name){
                case "btnBack":
                    this.removeFromParent();
                    break;
                case "btnRBack":
                    this.arenaNode.wgt.layoutRank.setVisible(false);
                    break;
                case "btnChange":
                    //换一批
                    arenaModel.refreshArena();
                    break;
                case "btnChongZhi":  //重置
                    //判断达到重置上限了没有
                    if(GLOBALDATA.arena.rnum==0){
                        ShowTipsTool.TipsFromText("您已达今日重置上限，请充值vip", cc.color.RED, 30);
                    }else{
                        arenaModel.buyCount();
                    }
                    break;
                case "btnRank": //排行
                    this.arenaNode.wgt.layoutRank.setVisible(true);
                    arenaModel.getArenaRank(6,1,20);
                    break;
                case "btnPrestige":  //声望商店
                    var shopAreLayer = new ShopAreLayer();
                    this.addChild(shopAreLayer, 2);
                    break;
                default:
                    break;
            }
        }
    },

    loadDataOnUI:function () {
        var myposition = GLOBALDATA.arena.my;
        //拥有竞技点
        if(GLOBALDATA.virtual[this.arenaid]==null){
            this.arenaNode.wgt.prestigeValue.setString(0);
        }else{
            this.arenaNode.wgt.prestigeValue.setString(GLOBALDATA.virtual[this.arenaid]);
        }
        // 加载基本信息条数据  包含 我的排名 战力 奖励
        this.loadBaseInfoBar(myposition);

    },
    loadBaseInfoBar:function (position) {
        if(position>=20001){
            this.arenaNode.wgt.textRank.setString("排名:未上榜");
        }else{
            this.arenaNode.wgt.textRank.setString("排名:"+position);
        }
        var myfightValue = getCommanderPower();
        this.arenaNode.wgt.textFight.setString("战力:"+myfightValue);
        for(key in ARENACFG){
            if(position>=ARENACFG[key].pm[0] && position<=ARENACFG[key].pm[1] || ARENACFG[key].pm[1]==0){  //0表示最后的无间  无限大
                //在此奖励区间内
                this.arenaNode.wgt.textDiamond.setString(ARENACFG[key].rewards[0][1]);
                this.arenaNode.wgt.textRePresige.setString(ARENACFG[key].rewards[1][1]);
                break;
            }else{
                this.arenaNode.wgt.textDiamond.setString("无");
                this.arenaNode.wgt.textRePresige.setString("无");
            }
        }
        this.arenaNode.wgt.textNum.setString("今日剩余挑战次数"+GLOBALDATA.arena.num);
        this.begainArenaSchedule();
    },
    //加载竞技场对战列表数据
    loadFirstArena:function (data) {
        var self = this;
        this.arenaNode.wgt.listArena.removeAllChildren();
        this.saodang_item_array = new Array();
        this.tiaozhan_item_array = new Array();
        for(key in data){
            var thisitem = ccsTool.load(res.uiArenaItem,["arsenItem"]).wgt.arsenItem;
            thisitem.removeFromParent(false);
            this.arenaNode.wgt.listArena.pushBackCustomItem(thisitem);
            var textBMFontItemRank = ccui.helper.seekWidgetByName(thisitem,"textBMFontItemRank");
            var heroItemName = ccui.helper.seekWidgetByName(thisitem,"heroItemName");
            var heroItemLv = ccui.helper.seekWidgetByName(thisitem,"heroItemLv");
            var heroItemComb = ccui.helper.seekWidgetByName(thisitem,"heroItemComb");
            var fightItemButton =  ccui.helper.seekWidgetByName(thisitem,"fightItemButton"); //挑战按钮
            var heroItemBg = ccui.helper.seekWidgetByName(thisitem,"heroItemBg");
            var heroItemIcon = ccui.helper.seekWidgetByName(thisitem,"heroItemIcon");
            var saodangButton = ccui.helper.seekWidgetByName(thisitem,"sweepItemButton"); //扫荡按钮
            var text_sweep = ccui.helper.seekWidgetByName(thisitem,"Text_sweep"); //扫荡按钮次数显示text
            if(GLOBALDATA.arena.num>0){
                //还有剩余挑战次数
                if(data[key].pos<GLOBALDATA.arena.my){
                    fightItemButton.setVisible(true);
                    saodangButton.setVisible(false);
                }else{
                    fightItemButton.setVisible(false);
                    saodangButton.setVisible(true);
                    text_sweep.setString("扫荡"+GLOBALDATA.arena.num+"次");
                }
            }else{
                fightItemButton.setVisible(false);
                saodangButton.setVisible(false);
            }
            if(data[key].pos<GLOBALDATA.arena.my){
                this.tiaozhan_item_array.push(thisitem);
            }else{
                //存入扫荡项，挑战次数更新时，更新扫荡按钮的字符串显示
                this.saodang_item_array.push(thisitem);
            }
            var person = null;
            if(data[key].typ==1){ //机器人
                person = this.creatRobot(data[key].pos);
                heroItemLv.setString("等级:"+person.lev);
            }else{
                person = data[key];
                heroItemLv.setString("等级:"+person.lv);
            }
            textBMFontItemRank.setString(data[key].pos);
            heroItemName.setString(person.name);
            heroItemComb.setString("战力:"+person.atk);

            fightItemButton.setTag(key);
            fightItemButton.addTouchEventListener(function (sender,type) {
                if(type == ccui.Widget.TOUCH_ENDED){
                    var key = sender.getTag();
                    //挑战
                    self.fight_pos = data[key].pos;  //战斗目标的排名
                    self.target_data = data[key];    //战斗的对象
                    arenaModel.startFight(data[key].pos);
                    self.addpos = GLOBALDATA.arena.my-data[key].pos;
                }
            });
            saodangButton.setTag(key);
            saodangButton.addTouchEventListener(function (sender,type) {
                if(type == ccui.Widget.TOUCH_ENDED){
                    var key = saodangButton.getTag();
                    if(GLOBALDATA.arena.num>0){
                        self.addpos = GLOBALDATA.arena.my-data[key].pos;
                        //调用结束战斗接口，并且刷新列表
                        arenaModel.endFight(data[key].pos,GLOBALDATA.arena.num,1,1);
                        self.loadDataOnUI()
                    }else{
                        //抱歉 挑战次数已用完 无法挑战

                    }
                }
            });
        }
    },
    //加载竞技场排行列表数据
    loadSecondArena:function (data) {
        var count = 0;
        var self = this;
        self.arenaNode.wgt.listRank.removeAllChildren();
        var loaditem = function (itemdata,position) {
            var thisitem =  ccsTool.load(res.uiArenaRankItem,["arsenItem"]).wgt.arsenItem;
            thisitem.removeFromParent(false);
            self.arenaNode.wgt.listRank.pushBackCustomItem(thisitem);
            var heroRItemName = ccui.helper.seekWidgetByName(thisitem,"heroRItemName");
            var textBMFontRItemRank = ccui.helper.seekWidgetByName(thisitem,"textBMFontRItemRank");
            var heroRItemLv = ccui.helper.seekWidgetByName(thisitem,"heroRItemLv");
            var heroRItemComb = ccui.helper.seekWidgetByName(thisitem,"heroRItemComb");
            var textRItemDiamond = ccui.helper.seekWidgetByName(thisitem,"textRItemDiamond");
            var textRItemRePresige = ccui.helper.seekWidgetByName(thisitem,"textRItemRePresige");

            heroRItemName.setString(itemdata.name);
            textBMFontRItemRank.setString(position);
            heroRItemLv.setString("等级:"+itemdata.lev);
            heroRItemComb.setString("战力:"+itemdata.atk);
            for(k in ARENACFG){
                if(position>=ARENACFG[k].pm[0] && position<=ARENACFG[k].pm[1]){
                    //在此奖励区间内
                    textRItemDiamond.setString(ARENACFG[k].rewards[0][1]);
                    textRItemRePresige.setString(ARENACFG[k].rewards[1][1]);
                    break;
                }
            }
        };
        var itemdata_array = {};
        for(key in data){
            var itemdata = null;
            if(data[key]==null){
                itemdata = this.creatRobot(key);
            }else{
                itemdata = data[key];
           }
            itemdata_array[itemdata.ranking]=itemdata;
        }
        var isHasPosition = function (position) {
            for(var j in itemdata_array){
                if(itemdata_array[j].ranking==position){
                    return true;
                }
            }
            return false;
        };
        for(var i=1;i<=20;i++){
            var data = null;
            if(isHasPosition(i)){
                data = itemdata_array[i];
            }else{
                data = this.creatRobot(i);
            }
            loaditem(data,i);
        }

    },
    begainArenaSchedule:function () {
        this.unscheduleAllCallbacks();
        this.schedule(function (dt) {
            //判断是换一批按钮 还是重置按钮
            if(GLOBALDATA.arena.num<=0){
                this.arenaNode.wgt.btnChange.setVisible(false);
                this.arenaNode.wgt.btnChongZhi.setVisible(true);
                this.arenaNode.wgt.textDiaCos.setString(50);
            }
            else{
                this.arenaNode.wgt.btnChange.setVisible(true);
                this.arenaNode.wgt.btnChongZhi.setVisible(false);
            }
            if(GLOBALDATA.arena.num<5){
                var nowtime = Date.parse(new Date());
                var last_time = 2*60*60*1000 - (nowtime-GLOBALDATA.arena.nt*1000);
                if(last_time>0){
                    this.arenaNode.wgt.textTime.setVisible(true);
                    this.arenaNode.wgt.textTime.setString("回复次数:"+Helper.formatTime(last_time/1000));
                }else{

                }
            }else{
                this.unscheduleAllCallbacks();
                this.arenaNode.wgt.textTime.setVisible(false);
            }
        });
    },
     // creatRobot:function (paiming) {
     //     var robot = {};
     //     var battle = new Array();
     //     var hp = new Array();
     //     var def = new Array();
     //     var atk = new Array();
     //     var random_num = 0;
     //     if(paiming>=1&&paiming<=99){
     //         random_num = randNum(80000,90000);
     //     }else if(paiming>=100&&paiming<=500){
     //         random_num = randNum(75000,80000);
     //     }else if(paiming>=501&&paiming<=5000){
     //         random_num = randNum(70000,75000);
     //     }else if(paiming>=5001&&paiming<=10000){
     //         random_num = randNum(60000,70000);
     //     }else if(paiming>=10001){
     //         random_num = randNum(50000,60000);
     //     }
     //     for(var j=0;j<GLOBALDATA.army.battle.length;j++){
     //         if(GLOBALDATA.army.battle[j]==0||GLOBALDATA.army.battle[j]==-1){
     //             battle[j] = GLOBALDATA.army.battle[j];
     //             hp[j] = 0;
     //             def[j] = 0;
     //             atk[j] = 0;
     //         }else{
     //             //从英雄中随机一个英雄
     //            var pos = randNum(0,this.all_hero_array.length-1);
     //            battle[j] = this.all_hero_array[pos];
     //            if(battle[j]>0){
     //                var soldier = GLOBALDATA.soldiers[GLOBALDATA.army.battle[j]];
     //                var equlist = GLOBALDATA.army.equips[j];
     //                var depotData = GLOBALDATA.depot;
     //                var commanderData = GLOBALDATA.commanders[GLOBALDATA.army.commander];
     //                var attr = new heroAttr(soldier.p, soldier.l, soldier.q, soldier.m, soldier.w, soldier.sq, soldier.eq,equlist, depotData, commanderData);
     //                hp[j] = Math.ceil(attr.getHp()*(random_num/100000));
     //                def[j] = Math.ceil(attr.getDef()*(random_num/100000));
     //                atk[j] = Math.ceil(attr.getAtk()*(random_num/100000));
     //            }
     //         }
     //     }
     //     robot["battles"] = battle;
     //     robot["hp"] = hp;
     //     robot["def"] = def;
     //     robot["atkvalue"] = atk;
     //     robot["paiming"] = paiming;
     //     robot["name"] = "防御者";
     //     robot["lev"] = GLOBALDATA.base.lev;
     //     robot["atk"] = Math.ceil(getCommanderPower()*(random_num/100000));
     //     return robot;
     // },
    creatRobot:function (paiming) {
        var robot = {};
        var battle = new Array();
        var hp = new Array();
        var def = new Array();
        var atk = new Array();
        var random_num = 0;
        if(paiming>=1&&paiming<=99){
            random_num = randNum(80000,90000);
        }else if(paiming>=100&&paiming<=500){
            random_num = randNum(75000,80000);
        }else if(paiming>=501&&paiming<=5000){
            random_num = randNum(70000,75000);
        }else if(paiming>=5001&&paiming<=10000){
            random_num = randNum(60000,70000);
        }else if(paiming>=10001){
            random_num = randNum(50000,60000);
        }
        for(var j=0;j<GLOBALDATA.army.battle.length;j++){
            if(GLOBALDATA.army.battle[j]==0||GLOBALDATA.army.battle[j]==-1){
                battle[j] = GLOBALDATA.army.battle[j];
                hp[j] = 0;
                def[j] = 0;
                atk[j] = 0;
            }else{
                //从英雄中随机一个英雄
                var pos = randNum(0,this.all_hero_array.length-1);
                battle[j] = this.all_hero_array[pos];
                if(battle[j]>0){
                    var soldier = GLOBALDATA.soldiers[GLOBALDATA.army.battle[j]];
                    var equlist = GLOBALDATA.army.equips[j];
                    var depotData = GLOBALDATA.depot;
                    var commanderData = GLOBALDATA.commanders[GLOBALDATA.army.commander];
                    var teamlist = GLOBALDATA.army.battle.concat(GLOBALDATA.army.companion);
                    var attr = new heroAttr(soldier.p, soldier.l, soldier.q, soldier.m, soldier.w, soldier.sq, soldier.eq,equlist, depotData, commanderData,teamlist);
                    hp[j] = Math.ceil(attr.getHp()*(random_num/100000));
                    def[j] = Math.ceil(attr.getDef()*(random_num/100000));
                    atk[j] = Math.ceil(attr.getAtk()*(random_num/100000));
                }
            }
        }
        robot["battles"] = battle;
        robot["hp"] = hp;
        robot["def"] = def;
        robot["atkvalue"] = atk;
        robot["paiming"] = paiming;
        robot["name"] = "防御者";
        robot["lev"] = GLOBALDATA.base.lev;
        robot["atk"] = Math.ceil(getCommanderPower()*(random_num/100000));
        return robot;
    },
    saveAllHeroId:function (result_array) {
        result_array.length = 0;
        var i = 0;
        for(var key in HEROCFG){
            if(HEROCFG[key].use==1){
                result_array[i] = key;
                i = i+1;
            }
        }
    }
});