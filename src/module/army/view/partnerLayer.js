
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 /**
 * 小伙伴层的创建
 */

var partnerLayer = baseLayer.extend({
    LayerName:"partnerLayer",
    soldierArray:[],
    oldPower:0,//记录没升级前的军力值
    armyAttr:{},//记录能激活缘分士兵的属性
    pos:0,
    ctor:function(){
        this._super();
        //this.LayerName = "partnerLayer";
    },

    onEnter:function(){
        this._super();
        //this.initUI();
        //this.initPartnerUI();
        var self = this;

        //伙伴下阵响应函数
        this.partnerLose = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            eventName: "army.lose_companion",
            callback:function(event){
                var resData = event.getUserData();
                if(resData.status == 0){
                    self.dataShow();
                    //伙伴下阵加成提示显示
                    var newPower = getCommanderPower();
                    if(self.oldPower - newPower > 0){
                        var fightNumRoot = ccsTool.load(res.uiFightNumLayer, ["Text_war", "lblMilitaryStre"]);
                        fightNumRoot.node.setPosition(cc.p(0, 200));
                        self.addChild(fightNumRoot.node);
                        fightNumRoot.wgt.Text_war.setString(Math.ceil(newPower - self.oldPower));
                        fightNumRoot.wgt.lblMilitaryStre.setString(Math.ceil(newPower));
                        var seq = cc.sequence(cc.delayTime(1),
                            cc.spawn(cc.moveBy(1, cc.p(0, 150)),
                                cc.fadeOut(1)),
                            cc.removeSelf(true));
                        fightNumRoot.node.runAction(seq);
                    }
                }
            }
        });
        cc.eventManager.addListener(this.partnerLose, this);

        //伙伴解锁响应函数
        this.PartnerDeblock = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            eventName: "army.unlock_companion",
            callback:function(event){
                var resData = event.getUserData();
                if(resData.status == 0){
                    var _armyIconBg = "armyIconBg_"+(self.pos);
                    var _lock = "lock_"+(self.pos);
                    var _partnerAdd = "partnerAdd_"+(self.pos);
                    var _Text_lv = "Text_lv"+(self.pos);
                    var _ButtonDown = "ButtonDown"+(self.pos);
                    var _heroIcon = "heroIcon_"+(self.pos);
                    var _ButtonGo = "ButtonGo"+(self.pos);
                    var _ImageTips = "ImageTips" + (self.pos);
                    var _Text_dimanod = "Text_dimanod" + (self.pos);
                    var armyIconBg = self.partnerLayer.wgt[_armyIconBg];
                    var lock = self.partnerLayer.wgt[_lock];
                    var partnerAdd = self.partnerLayer.wgt[_partnerAdd];
                    var Text_lv = self.partnerLayer.wgt[_Text_lv];
                    var ButtonDown = self.partnerLayer.wgt[_ButtonDown];
                    var hero_Icon = self.partnerLayer.wgt[_heroIcon];
                    var ButtonGo = self.partnerLayer.wgt[_ButtonGo];
                    var ImageTips = self.partnerLayer.wgt[_ImageTips];
                    var Text_dimanod = self.partnerLayer.wgt[_Text_dimanod];
                    armyIconBg.setTouchEnabled(true);
                    lock.removeFromParent();
                    partnerAdd.setVisible(true);
                    Text_lv.removeFromParent();
                    ImageTips.setVisible(false);
                    ButtonGo.setVisible(false);
                    ButtonDown.setVisible(false);
                    Text_dimanod.setVisible(false);
                    hero_Icon.setVisible(false);
                    //self.dataShow();
                }
            }
        });
        cc.eventManager.addListener(this.PartnerDeblock, this);

        //伙伴上阵响应函数
        this.PartnerInto = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            eventName: "army.add_companion",
            callback:function(event){
                var resData = event.getUserData();
                if(resData.status == 0){
                    self.dataShow();
                    var newPower = getCommanderPower();
                    if(newPower - self.oldPower > 0){
                        var fightNumRoot = ccsTool.load(res.uiFightNumLayer, ["Text_war", "lblMilitaryStre"]);
                        fightNumRoot.node.setPosition(cc.p(0, 200));
                        self.addChild(fightNumRoot.node);
                        fightNumRoot.wgt.Text_war.setString("+" + Math.ceil(newPower - self.oldPower));
                        fightNumRoot.wgt.lblMilitaryStre.setString(Math.ceil(newPower));
                        var seq = cc.sequence(cc.delayTime(1),
                            cc.spawn(cc.moveBy(1, cc.p(0, 150)),
                                cc.fadeOut(1)),
                            cc.removeSelf(true));
                        fightNumRoot.node.runAction(seq);
                    }
                }
            }
        });
        cc.eventManager.addListener(this.PartnerInto, this);

        //伙伴上阵属性加成显示
        this.upParentData = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "upParentData",
            callback: function(event){
                var comRelationId = event.getUserData();
                if(comRelationId != undefined){
                    for(var j=0;j<comRelationId.length;j++){
                        var relation_value = ARMYRELATIONCFG[comRelationId[j]].relation_value;
                        var soldier = GLOBALDATA.soldiers[ARMYRELATIONCFG[comRelationId[j]].armyid];
                        for(var k=0;k<GLOBALDATA.army.battle.length;k++){
                            if(GLOBALDATA.army.battle[key] == ARMYRELATIONCFG[comRelationId[j]].armyid){
                                var equid = k;
                                break;
                            }
                        }
                        var equlist = GLOBALDATA.army.equips[equid];
                        var depotData = GLOBALDATA.depot;
                        var commanderData = GLOBALDATA.commanders[GLOBALDATA.army.commander];
                        var teamlist = GLOBALDATA.army.battle.concat(GLOBALDATA.army.companion);
                        for(var i=0;i<relation_value.length;i++){
                            switch (relation_value[i][1]){
                                case 1:
                                    var heroAtt = new heroAttr(soldier.p, soldier.l, soldier.q, soldier.m, soldier.w, soldier.sq, soldier.eq, equlist, depotData, commanderData, teamlist);
                                    var Hp = heroAtt.getHp();  //攻击
                                    if(relation_value[i][2] == 1 || relation_value[i][2] == 3){
                                        ShowTipsTool.TipsFromText("+" + relation_value[i][2] + ATTRIBUTEIDCFG[1].describe, cc.color.GREEN, 30);
                                    }else{
                                        ShowTipsTool.TipsFromText("+" + relation_value[i][2]/10000 * Hp + ATTRIBUTEIDCFG[1].describe, cc.color.GREEN, 30);
                                    }
                                    break;
                                case 2:
                                    var heroAtt = new heroAttr(soldier.p, soldier.l, soldier.q, soldier.m, soldier.w, soldier.sq, soldier.eq, equlist, depotData, commanderData, teamlist);
                                    var atk = heroAtt.getAtk();  //攻击
                                    if(relation_value[i][2] == 1 || relation_value[i][2] == 3){
                                        ShowTipsTool.TipsFromText("+" + relation_value[i][2] + ATTRIBUTEIDCFG[2].describe, cc.color.GREEN, 30);
                                    }else{
                                        ShowTipsTool.TipsFromText("+" + relation_value[i][2]/10000 * atk + ATTRIBUTEIDCFG[2].describe, cc.color.GREEN, 30);
                                    }
                                    break;
                                case 3:
                                    var heroAtt = new heroAttr(soldier.p, soldier.l, soldier.q, soldier.m, soldier.w, soldier.sq, soldier.eq, equlist, depotData, commanderData, teamlist);
                                    var Def = heroAtt.getDef();  //攻击
                                    if(relation_value[i][2] == 1 || relation_value[i][2] == 3){
                                        ShowTipsTool.TipsFromText("+" + relation_value[i][2] + ATTRIBUTEIDCFG[3].describe, cc.color.GREEN, 30);
                                    }else{
                                        ShowTipsTool.TipsFromText("+" + relation_value[i][2]/10000 * Def + ATTRIBUTEIDCFG[3].describe, cc.color.GREEN, 30);
                                    }
                                    break;
                            }
                        }
                    }
                }
            }
        });
        cc.eventManager.addListener(this.upParentData, 1);
    },

    initUI:function() {
        this.partnerLayer = ccsTool.load(res.uiPartnerLayer, ['armyIconBg_1', 'armyIconBg_2', 'armyIconBg_3', 'armyIconBg_4', 'armyIconBg_5',
            'armyIconBg_6', 'armyIconBg_7', 'armyIconBg_8', 'partnerAdd_1', 'partnerAdd_2', 'partnerAdd_3', 'partnerAdd_4', 'partnerAdd_5',
            'partnerAdd_6', 'partnerAdd_7', 'partnerAdd_8', 'lock_1', 'lock_2', 'lock_3', 'lock_4', 'lock_5', 'lock_6', 'lock_7', 'lock_8',
            'ButtonDown1', 'ButtonDown2', 'ButtonDown3', 'ButtonDown4', 'ButtonDown5', 'ButtonDown6', 'ButtonDown7', 'ButtonDown8',
            'Text_lv1', 'Text_lv2', 'Text_lv3', 'Text_lv4', 'Text_lv5', 'Text_lv6', 'Text_lv7', 'Text_lv8','ImageTips7','ImageTips8',
            'Text_dimanod7', 'Text_dimanod8', 'backBtn', 'ListViewHero', "armyIconBg_9", "armyIconBg_10", "ImageTips9", "Text_lv9",
            "partnerAdd_9", "lock_9", "ButtonDown9", "ButtonGo9", "ImageTips10", "Text_lv10", "partnerAdd_10", "lock_10", "ButtonDown10",
            "ButtonGo10", "ButtonGo7", "ButtonGo8", "Text_dimanod9", "Text_dimanod10", "heroIcon_1", "heroIcon_2", "heroIcon_3",
        "heroIcon_4", "heroIcon_5", "heroIcon_6", "heroIcon_7", "heroIcon_8", "heroIcon_9", "heroIcon_10"]);
        this.addChild(this.partnerLayer.node);
        this.ListViewHero = this.partnerLayer.wgt.ListViewHero;
        this.partmerShowLayer = ccsTool.load(res.uiPartmerShowLayer,['Image_1','TextHeroName']);
        this.titleItem = this.partmerShowLayer.wgt.Image_1;
        this.partnerLayer.wgt.ButtonGo7.addTouchEventListener(this.gotoBattleEvent, this);
        this.partnerLayer.wgt.ButtonGo7.setTag(6);
        this.partnerLayer.wgt.ButtonGo8.addTouchEventListener(this.gotoBattleEvent, this);
        this.partnerLayer.wgt.ButtonGo8.setTag(7);
        this.partnerLayer.wgt.ButtonGo9.addTouchEventListener(this.gotoBattleEvent, this);
        this.partnerLayer.wgt.ButtonGo9.setTag(8);
        this.partnerLayer.wgt.ButtonGo10.addTouchEventListener(this.gotoBattleEvent, this);
        this.partnerLayer.wgt.ButtonGo10.setTag(9);
        //this._item = ccui.helper.seekWidgetByName(this.partmerShowLayer, "Image_1");
        this._partmerShowLayer = ccsTool.load(res.uiPartmerShowLayer1,['heroImage','TextFate','TextFateAtt','heroBg1', 'heroBg2', 'heroBg3',
            'heroBg4', 'ImageBlack1', 'ImageBlack2', 'ImageBlack3', 'ImageBlack4']);
        this.showItem = this._partmerShowLayer.wgt.heroImage;

        this.partnerLayer.wgt.backBtn.addTouchEventListener(this.BackBtnEvent, this);
        this.dataShow();
    },

    dataShow:function(){
        if(GLOBALDATA.base.vip >= 10){
            this.partnerLayer.wgt.armyIconBg_9.setVisible(true);
            this.partnerLayer.wgt.armyIconBg_10.setVisible(true);
            this.partnerLayer.wgt.ImageTips9.setVisible(true);
            this.partnerLayer.wgt.ImageTips10.setVisible(true);
        }
        for(var i=0;i<GLOBALDATA.army.companion.length;i++){
            var _armyIconBg = "armyIconBg_"+(i+1);
            var _lock = "lock_"+(i+1);
            var _partnerAdd = "partnerAdd_"+(i+1);
            var _Text_lv = "Text_lv"+(i+1);
            var _ButtonDown = "ButtonDown"+(i+1);
            var _heroIcon = "heroIcon_"+(i+1);
            var armyIconBg = this.partnerLayer.wgt[_armyIconBg];
            armyIconBg.setTag(i);
            armyIconBg.addTouchEventListener(this.gotoBattleEvent, this);
            var lock = this.partnerLayer.wgt[_lock];
            var partnerAdd = this.partnerLayer.wgt[_partnerAdd];
            var Text_lv = this.partnerLayer.wgt[_Text_lv];
            var ButtonDown = this.partnerLayer.wgt[_ButtonDown];
            var hero_Icon = this.partnerLayer.wgt[_heroIcon];
            ButtonDown.setTag(i);
            ButtonDown.addTouchEventListener(this.DownEvent, this);
            if(i==6||i==7||i==8||i==9){
                switch (i){
                    case 6:
                        if(GLOBALDATA.army.companion[i] == -1 && GLOBALDATA.base.lev >= 34){
                            armyIconBg.setTouchEnabled(true);
                            ButtonDown.setVisible(false);
                            this.partnerLayer.wgt.ImageTips7.setVisible(true);
                            this.partnerLayer.wgt.Text_dimanod7.setVisible(true);
                            this.partnerLayer.wgt.ButtonGo7.setVisible(true);
                        }else if(GLOBALDATA.army.companion[i] == 0){
                            armyIconBg.setTouchEnabled(true);
                            lock.removeFromParent();
                            partnerAdd.setVisible(true);
                            Text_lv.removeFromParent();
                            this.partnerLayer.wgt.ImageTips7.setVisible(false);
                            ButtonDown.setVisible(false);
                            this.partnerLayer.wgt.Text_dimanod7.setVisible(false);
                            hero_Icon.setVisible(false);
                            Helper.LoadFrameImageWithPlist(armyIconBg, 1);
                        }else if(GLOBALDATA.army.companion[i] > 0){
                            armyIconBg.setTouchEnabled(true);
                            lock.removeFromParent();
                            partnerAdd.setVisible(false);
                            Text_lv.removeFromParent();
                            this.partnerLayer.wgt.ImageTips7.setVisible(false);
                            ButtonDown.setVisible(true);
                            this.partnerLayer.wgt.Text_dimanod7.setVisible(false);
                            hero_Icon.setVisible(true);
                            Helper.LoadIcoImageWithPlist(hero_Icon, ITEMCFG[GLOBALDATA.army.companion[i]]);
                            Helper.LoadFrameImageWithPlist(armyIconBg, ITEMCFG[GLOBALDATA.army.companion[i]].quality);
                        }else{
                            ButtonDown.setVisible(false);
                            armyIconBg.setTouchEnabled(false);
                            this.partnerLayer.wgt.Text_dimanod7.setVisible(false);
                        }
                        break;
                    case 7:
                        if(GLOBALDATA.army.companion[i] == -1 && GLOBALDATA.base.lev >= 40){
                            var ImageTips8 = this.partnerLayer.wgt.ImageTips8;
                            var Text_dimanod8 = this.partnerLayer.wgt.Text_dimanod8;
                            this.partnerLayer.wgt.ButtonGo8.setVisible(true);
                            this.partnerLayer.wgt.ImageTips8.setVisible(true);
                            armyIconBg.setTouchEnabled(true);
                            ButtonDown.setVisible(false);
                            this.partnerLayer.wgt.Text_dimanod8.setVisible(true);
                        }else if(GLOBALDATA.army.companion[i] == 0){
                            armyIconBg.setTouchEnabled(true);
                            lock.removeFromParent();
                            partnerAdd.setVisible(true);
                            Text_lv.removeFromParent();
                            this.partnerLayer.wgt.ImageTips8.setVisible(false);
                            ButtonDown.setVisible(false);
                            this.partnerLayer.wgt.Text_dimanod8.setVisible(false);
                            hero_Icon.setVisible(false);
                            Helper.LoadFrameImageWithPlist(armyIconBg, 1);
                        }else if(GLOBALDATA.army.companion[i] > 0){
                            armyIconBg.setTouchEnabled(true);
                            lock.removeFromParent();
                            partnerAdd.setVisible(false);
                            Text_lv.removeFromParent();
                            this.partnerLayer.wgt.ImageTips8.setVisible(false);
                            ButtonDown.setVisible(true);
                            this.partnerLayer.wgt.Text_dimanod8.setVisible(false);
                            hero_Icon.setVisible(true);
                            Helper.LoadIcoImageWithPlist(hero_Icon, ITEMCFG[GLOBALDATA.army.companion[i]]);
                            Helper.LoadFrameImageWithPlist(armyIconBg, ITEMCFG[GLOBALDATA.army.companion[i]].quality);
                        }else{
                            ButtonDown.setVisible(false);
                            armyIconBg.setTouchEnabled(false);
                            this.partnerLayer.wgt.Text_dimanod8.setVisible(false);
                        }
                        break;
                    case 8:
                        if(GLOBALDATA.army.companion[i] == -1){
                            this.partnerLayer.wgt.ButtonGo9.setVisible(true);
                            this.partnerLayer.wgt.ButtonDown9.setVisible(false);
                        }else if(GLOBALDATA.army.companion[i] == 0){
                            this.partnerLayer.wgt.ButtonGo9.setVisible(false);
                            this.partnerLayer.wgt.ButtonDown9.setVisible(false);
                            this.partnerLayer.wgt.Text_dimanod9.setVisible(false);
                            this.partnerLayer.wgt.lock_9.setVisible(false);
                            this.partnerLayer.wgt.Text_lv9.setVisible(false);
                            this.partnerLayer.wgt.partnerAdd_9.setVisible(true);
                            this.partnerLayer.wgt.ImageTips9.setVisible(false);
                            hero_Icon.setVisible(false);
                            Helper.LoadFrameImageWithPlist(armyIconBg, 1);
                        }else if(GLOBALDATA.army.companion[i] > 0){
                            this.partnerLayer.wgt.ButtonGo9.setVisible(false);
                            this.partnerLayer.wgt.ButtonDown9.setVisible(true);
                            this.partnerLayer.wgt.Text_dimanod9.setVisible(false);
                            this.partnerLayer.wgt.lock_9.setVisible(false);
                            this.partnerLayer.wgt.Text_lv9.setVisible(false);
                            this.partnerLayer.wgt.partnerAdd_9.setVisible(false);
                            this.partnerLayer.wgt.ImageTips9.setVisible(false);
                            hero_Icon.setVisible(true);
                            Helper.LoadIcoImageWithPlist(hero_Icon, ITEMCFG[GLOBALDATA.army.companion[i]]);
                            Helper.LoadFrameImageWithPlist(armyIconBg, ITEMCFG[GLOBALDATA.army.companion[i]].quality);
                        }
                        break;
                    case 9:
                        if(GLOBALDATA.army.companion[i] == -1){
                            this.partnerLayer.wgt.ButtonGo10.setVisible(true);
                            this.partnerLayer.wgt.ButtonDown10.setVisible(false);
                        }else if(GLOBALDATA.army.companion[i] == 0){
                            this.partnerLayer.wgt.ButtonGo10.setVisible(false);
                            this.partnerLayer.wgt.ButtonDown10.setVisible(false);
                            this.partnerLayer.wgt.Text_dimanod10.setVisible(false);
                            this.partnerLayer.wgt.lock_10.setVisible(false);
                            this.partnerLayer.wgt.Text_lv10.setVisible(false);
                            this.partnerLayer.wgt.partnerAdd_10.setVisible(true);
                            this.partnerLayer.wgt.ImageTips10.setVisible(false);
                            Helper.LoadFrameImageWithPlist(armyIconBg, 1);
                            hero_Icon.setVisible(false);
                        }else if(GLOBALDATA.army.companion[i] > 0){
                            this.partnerLayer.wgt.ButtonGo10.setVisible(false);
                            this.partnerLayer.wgt.ButtonDown10.setVisible(true);
                            this.partnerLayer.wgt.Text_dimanod10.setVisible(false);
                            this.partnerLayer.wgt.lock_10.setVisible(false);
                            this.partnerLayer.wgt.Text_lv10.setVisible(false);
                            this.partnerLayer.wgt.partnerAdd_10.setVisible(false);
                            this.partnerLayer.wgt.ImageTips10.setVisible(false);
                            hero_Icon.setVisible(true);
                            Helper.LoadIcoImageWithPlist(hero_Icon, ITEMCFG[GLOBALDATA.army.companion[i]]);
                            Helper.LoadFrameImageWithPlist(armyIconBg, ITEMCFG[GLOBALDATA.army.companion[i]].quality);
                        }
                        break;
                }
            }else{
                if(GLOBALDATA.army.companion[i] == 0){
                    armyIconBg.setTouchEnabled(true);
                    lock.removeFromParent();
                    partnerAdd.setVisible(true);
                    Text_lv.removeFromParent();
                    ButtonDown.setVisible(false);
                    hero_Icon.setVisible(false);
                    Helper.LoadFrameImageWithPlist(armyIconBg, 1);
                }else if(GLOBALDATA.army.companion[i]>0){
                    armyIconBg.setTouchEnabled(true);
                    lock.removeFromParent();
                    partnerAdd.setVisible(false);
                    Text_lv.removeFromParent();
                    ButtonDown.setVisible(true);
                    /*var iSolHead = cc.spriteFrameCache.getSpriteFrame(ITEMCFG[GLOBALDATA.army.companion[i]].icon);
                     var sprite = new cc.Sprite(iSolHead);
                     sprite.setPosition(armyIconBg.getContentSize().width/2, armyIconBg.getContentSize().height/2);
                     sprite.setScale(0.8);
                     armyIconBg.addChild(sprite);*/
                    hero_Icon.setVisible(true);
                    Helper.LoadIcoImageWithPlist(hero_Icon, ITEMCFG[GLOBALDATA.army.companion[i]]);
                    Helper.LoadFrameImageWithPlist(armyIconBg, ITEMCFG[GLOBALDATA.army.companion[i]].quality);
                }else{
                    ButtonDown.setVisible(false);
                    armyIconBg.setTouchEnabled(false);
                }
            }
        }



        //下面两个for循环是吧小伙伴里的上阵士兵和部队里的上阵士兵合成一个数组，
        // 主要是为判断缘分的显示
        this.soldierArray.length = 0;
        for(var key in GLOBALDATA.army.battle){
            if(GLOBALDATA.army.battle[key] > 0){
                this.soldierArray.push(GLOBALDATA.army.battle[key]);
            }
        }
        for(var companionKey in GLOBALDATA.army.companion){
            if(GLOBALDATA.army.companion[companionKey] > 0){
                this.soldierArray.push( GLOBALDATA.army.companion[companionKey]);
            }
        }

        this.armyAttr = {};
        this.ListViewHero.removeAllItems();
        for (var key in GLOBALDATA.army.battle) {
            //小伙伴里的士兵标题的显示
            if (GLOBALDATA.army.battle[key] > 0) {
                for (var luck in ARMYRELATIONCFG) {
                    if (ARMYRELATIONCFG[luck].armyid == GLOBALDATA.army.battle[key]) {
                        this.partmerShowLayer.wgt.TextHeroName.setString(ARMYRELATIONCFG[luck].armyname);
                        var tittleitem = this.titleItem.clone();
                        this.ListViewHero.pushBackCustomItem(tittleitem);
                        break;
                    }
                }

                for (var luck in ARMYRELATIONCFG) {
                    if (ARMYRELATIONCFG[luck].armyid == GLOBALDATA.army.battle[key]) {
                        var count = 0;
                        var luckPetArray = ARMYRELATIONCFG[luck].relation_armyvalue.concat();
                        var attrAddArray = ARMYRELATIONCFG[luck].relation_value.concat();
                        if (luckPetArray[count] < 10000) {
                            var soldierNum = 0;
                            var showitem = this.showItem.clone();
                            this.ListViewHero.pushBackCustomItem(showitem);
                            var _partmerShowLayer = ccsTool.seekWidget(showitem,['heroImage','TextFate','TextFateAtt','heroBg1', 'heroBg2', 'heroBg3',
                                'heroBg4', 'ImageBlack1', 'ImageBlack2', 'ImageBlack3', 'ImageBlack4']);

                            var TextFateAtt = _partmerShowLayer.wgt.TextFateAtt;
                            var TextFate = _partmerShowLayer.wgt.TextFate;
                            TextFate.setString(ARMYRELATIONCFG[luck].relation_name);
                            var attrStr = "";
                            for(var j=0;j<attrAddArray.length;j++){
                                if(attrAddArray[j][1] == 1 || attrAddArray[j][1] == 3){
                                    attrStr = attrStr + ATTRIBUTEIDCFG[attrAddArray[j][1]].describe + "+" + attrAddArray[j][2];
                                }else if(attrAddArray[j][1] == 2){
                                    attrStr = attrStr + ATTRIBUTEIDCFG[attrAddArray[j][1]].describe + "+" + attrAddArray[j][2] / 100 + "%";
                                }
                            }
                            TextFateAtt.setString(attrStr);

                            for (var i = 0; i < luckPetArray.length; i++) {
                                var luckPetName = 'heroBg' + (i + 1);
                                var ImageBlack = 'ImageBlack' + (i + 1);
                                var heroIcon = 'heroIcon' + (i+1);

                                var hero = ccui.helper.seekWidgetByName(showitem, luckPetName);
                                var heroIcon = ccui.helper.seekWidgetByName(showitem, heroIcon);
                                heroIcon.setScale(0.8);
                                Helper.LoadIcoImageWithPlist(heroIcon, ITEMCFG[luckPetArray[i]]);
                                /*var iSolHead = cc.spriteFrameCache.getSpriteFrame(ITEMCFG[luckPetArray[i]].icon);
                                 var sprite = new cc.Sprite(iSolHead);
                                 sprite.setPosition(hero.getContentSize().width / 2, hero.getContentSize().height / 2);
                                 sprite.setScale(0.8);
                                 hero.addChild(sprite);
                                 hero.setVisible(true);*/

                                Helper.LoadFrameImageWithPlist(hero, HEROCFG[luckPetArray[i]].armyquality);
                                if (this.soldierArray.indexOf(luckPetArray[i]) == -1) {
                                    var _ImageBlack = hero.getChildByName(ImageBlack);
                                    _ImageBlack.setLocalZOrder(10);
                                    _ImageBlack.setVisible(true);
                                    continue;
                                } else {
                                    soldierNum++;//用于计算激活缘分士兵的个数
                                }
                                if (soldierNum == luckPetArray.length) {
                                    var TextFateAtt = _partmerShowLayer.wgt.TextFateAtt;
                                    TextFateAtt.setColor(cc.color.GREEN);
                                }
                            }
                            count++;
                        } else {
                            break;
                        }
                    }
                }
            }
        }
    },

    //返回事件
    BackBtnEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED == type){
            var evn = new cc.EventCustom('updateUI');
            cc.eventManager.dispatchEvent(evn);
            this.removeFromParent(true);
        }
    },

    //添加伙伴事件
    gotoBattleEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED == type){
            this.oldPower =  getCommanderPower();
            if(GLOBALDATA.army.companion[sender.getTag()] == 0){
                var uiarmyChoiseLayer = new luckIntoLayer(sender.getTag(), 2);
                //uiarmyChoiseLayer.setPosition(cc.p(cc.winSize.x/2, cc.winSize.y/2));
                uiarmyChoiseLayer.setAnchorPoint(cc.p(0,0));
                uiarmyChoiseLayer.setPosition(cc.p(0,-105));
                this.addChild(uiarmyChoiseLayer);
            }else if(GLOBALDATA.army.companion[sender.getTag()] == -1){
                if(GLOBALDATA.base.diamond >= 600){
                    var event = new cc.EventCustom("TipsLayer_show");
                    var _strText = StringFormat(STRINGCFG[100249].string,cc.color.WHITE,30);
                    var strText =  StringFormat(_strText);
                    var data = {string:strText, callback:this.deblockCallback, target:this};
                    event.setUserData(data);
                    cc.eventManager.dispatchEvent(event);
                    this.pos = sender.getTag() + 1;
                }else{
                    ShowTipsTool.TipsFromText(STRINGCFG[100079].string,cc.color.ORANGE,30);
                }
            }
        }
    },

    deblockCallback:function(ttype){
        if (ttype == 1) // 确定
        {
            armyModel.partnerDeblock(this.pos);
        }
    },

    //伙伴下阵事件
    DownEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type){
            this.oldPower = getCommanderPower();
            armyModel.partnerLose(sender.getTag()+1);
        }
    },

    onExit:function () {
        this._super();
        cc.eventManager.removeListener(this.partnerLose);
        cc.eventManager.removeListener(this.PartnerDeblock);
        cc.eventManager.removeListener(this.upParentData);
        cc.eventManager.removeListener(this.PartnerInto);
    }

});

/*var tipsLayer = ModalDialog.extend({
    ctor:function(pos){
        this._super();
        this.pos = pos;
    },

    onEnter:function(){
        this._super();
        this.initTpsUI();
    },

    initTpsUI: function () {
        this.tipsLayer = ccsTool.load(res.uiTipsLayer, ['textTipsDate', 'btnTipsCanel', 'btnTipsOk']);
        var tipsEffect = this.tipsLayer.node;
        var tipsAction = this.tipsLayer.action;
        this.addChild(tipsEffect, 10);
        tipsEffect.runAction(tipsAction);
        tipsAction.gotoFrameAndPlay(0, false);

        this.tipsLayer.wgt.textTipsDate.setString(STRINGCFG[100249].string);

        this.tipsLayer.wgt.btnTipsCanel.addTouchEventListener(this.touchEvent, this);
        this.tipsLayer.wgt.btnTipsOk.addTouchEventListener(this.touchEvent, this);

    },

    touchEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED==type){
            switch (sender.name){
                case "btnTipsOk":
                    if(GLOBALDATA.base.diamond >= 600){
                        armyModel.partnerDeblock(this.pos + 1);
                        this.removeFromParent(true);
                    }else{
                        ShowTipsTool.TipsFromText(STRINGCFG[100079].string,cc.color.ORANGE,30);
                    }
                    break;
                case "btnTipsCanel":
                    this.removeFromParent(true);
                    break;
            }
        }
    }
});*/