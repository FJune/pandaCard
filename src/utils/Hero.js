
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 /**
 */
var Hero = cc.Layer.extend({
    roleType:'hero',
    atkNum:0,
    canAtk:false,
    roleAttr:null,
    soldierId:null,
    hp:0,
    totalHp:0,
    pos:null,
    atkType:'pugong',  //普工pugong,技能jineng
    canShowDanger:true,
    isRunning:false,
    ctor:function (soldierId,pos,flipx) {
        //////////////////////////////
        // 1. super init first
        // cc.log
        this._super();
        this.pos = pos;
        this.soldierId = soldierId;
        this.roleAttr = Helper.findHeroById(soldierId);
        this.setContentSize(cc.size(100,100));
        //存放buff信息
        this.buffAttr = [];
        for (var i=0;i<35;i++){
            this.buffAttr.push(0);
        }
        //渲染图像
        var self = this;
        this.model = this.roleAttr.armymodel;
        cc.loader.load([res[this.model+'_plist'],res[this.model+'_png']],function (result, count, loadedCount) {

        }, function () {
            // cc.log('loadRoleModel compelete');
            //cc.textureCache.dumpCachedTextureInfo();

            if(self.role&&self.roleSize.width==0) {
                cc.spriteFrameCache.addSpriteFrames(res[self.model+'_plist']);
                var role = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame(self.model + "-idle01_0.png"));
                self.roleSize = role.getContentSize();
                self.role.setPosition(-self.roleAttr.barpos[1][0], -(self.roleAttr.barpos[1][1]-20)/2);
                self.initAniFrame();

                if(self.isRunning){
                    self.actRun(1,true);
                }
            }
        });
        // cc.T
        cc.spriteFrameCache.addSpriteFrames(res[self.model+'_plist']);
        this.role = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame(self.model + "-idle01_0.png"));
        self.role.setAnchorPoint(cc.p(0,0));
        self.roleSize = this.role.getContentSize();
        self.role.setPosition(-self.roleAttr.barpos[1][0], -(self.roleAttr.barpos[1][1]-20)/2);
        self.addBloodBar();
        // if(flipx){
        //     this.setScaleX(-1);
        //     this.role.setPositionX(-this.roleAttr.barpos[1][0]*combatCfg.scaleRole[pos-1]-100);
        // }
        this.addChild(this.role);
        this.setOpacity(150);       //透明度设置

        // var spriteBatch = new cc.SpriteBatchNode(res[this.model+'_png']);
        // spriteBatch.addChild(this.role);
        // this.addChild(spriteBatch);
        //计算属性值
        this.calAtkAttr();
        this.initAniFrame();
        this.setScale(this.roleAttr.warsize);
        return true;
    },
    onExit:function () {
        this._super();
        this.aniAtk.release();
        this.aniSkillAtk.release();
        this.aniRun.release();
        this.aniIdle.release();
        gcRes([res[this.model+'_plist']]);
    },
    initAniFrame:function () {
        //攻击动作
        this.aniAtkNum = 0;
        var animFramesAtk = [];
        var str = "";
        for (var i = 0; i < 50; i++) {
            str = this.model+'-atk01_'+i+'.png';
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            if (frame){
                this.aniAtkNum++;
                animFramesAtk.push(frame);
            }
        }
        this.aniAtk = new cc.Animation(animFramesAtk, 0.1);
        this.aniAtk.retain();
        //技能
        this.aniSkillAtkNum = 0;
        var animFramesSkillAtk = [];
        var str = "";
        for (var i = 0; i < 50; i++) {
            str = this.model+'-ski01_'+i+'.png';
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            if (frame){
                this.aniSkillAtkNum++;
                animFramesSkillAtk.push(frame);
            }
        }
        if(animFramesSkillAtk.length<=0){
            animFramesSkillAtk = animFramesAtk;
        }
        this.aniSkillAtk = new cc.Animation(animFramesSkillAtk, 0.1);
        this.aniSkillAtk.retain();
        //跑步动作
        var animFramesRun = [];
        var str = "";
        for (var i = 0; i < 50; i++) {
            str = this.model+'-run_'+i+'.png';
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            if (frame){
                animFramesRun.push(frame);
            }
        }
        this.aniRun = new cc.Animation(animFramesRun, 0.1);
        this.aniRun.retain();

        //    站立动作
        var animFramesIdle = [];
        var str = "";
        for (var i = 0; i < 50; i++) {
            str = this.model+'-idle01_'+i+'.png';
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            if (frame){
                animFramesIdle.push(frame);
            }
        }
        this.aniIdle = new cc.Animation(animFramesIdle, 0.1);
        this.aniIdle.retain();
    },
    actAtk:function () {
        this.isRunning = false;
        var self = this;
        // this.setRoleFlip(false);
        // this.barBg.setVisible(true);
        this.role.stopAllActions();

        this.role.runAction(cc.sequence(cc.animate(this.aniAtk),cc.delayTime(0.1),cc.callFunc(function (sender) {
            self.actIdle();
        }, this)));
        // }
        //起手动作
        if(this.roleAttr.effatk!=undefined){
            var effInfo = this.roleAttr.effatk;
            this.playAtkEff(effInfo[0],effInfo[1][0],effInfo[1][1],effInfo[2]);
        }
        //技能能量
        this.atkNum++;
        // cc.log(this.soldierId+'='+this.atkNum);
        var skillId = this.roleAttr.skillid;
        var skill = Helper.findSkillById(skillId);
        if((this.atkNum%(skill.skillcd+1))==0&&this.atkNum!=0){
            this.atkType = 'jineng';
        }else {
            this.atkType = 'pugong';
        }
        // this.role.runAction(cc.sequence(cc.animate(animation),cc.callFunc(cb, combat,this),cc.delayTime(this.roleAttr.atkspeed)).repeatForever());
    },
    actSkillAtk:function () {
        this.isRunning = false;
        var self = this;
        //cc.log('actSkillAtk');
        // this.setRoleFlip(false);
        // this.barBg.setVisible(true);
        this.role.stopAllActions();

        this.role.runAction(cc.sequence(cc.animate(this.aniSkillAtk),cc.delayTime(0.1),cc.callFunc(function (sender) {
            self.actIdle();
        }, this)));
        //起手动作
        if(this.roleAttr.effski!=undefined){
            var effInfo = this.roleAttr.effski;
            this.playAtkEff(effInfo[0],effInfo[1][0],effInfo[1][1],effInfo[2]);
        }
        //技能能量
        this.atkNum++;
        var skillId = this.roleAttr.skillid;
        var skill = Helper.findSkillById(skillId);
        if((this.atkNum%(skill.skillcd+1))==0&&this.atkNum!=0){
            this.atkType = 'jineng';
        }else {
            this.atkType = 'pugong';
        }
        // this.role.runAction(cc.sequence(cc.animate(animation),cc.callFunc(cb, combat,this),cc.delayTime(this.roleAttr.atkspeed)).repeatForever());
    },
    manageAtk:function (cb,combat,isspeed) {
        var self = this;
        var actTime = this.atkType=='pugong'?0.1*this.aniAtkNum:0.1*this.aniSkillAtkNum;
        var speed =1;
        if(isspeed){
            var commander;
            for (var key in GLOBALDATA.commanders){
                //判断指挥官是否上阵
                if (GLOBALDATA.commanders[key].j==1){
                    commander = GLOBALDATA.commanders[key];
                    break;
                }
            }
            var lv = commander.s[110];
            var skill = Helper.findCmdSkillConsume(110,lv);
            speed = speed*(1+(skill.data[2]+this.buffAttr[13])/10000);
        }
        this.runAction(cc.speed( cc.sequence(cc.callFunc(cb, combat,this),cc.delayTime(this.roleAttr.atkspeed+actTime),cc.callFunc(function () {
            self.manageAtk(cb,combat,isspeed);
        },this)),speed));
    },
    actRun:function (director,repeat) {//正数 x轴正方向，
        if(this.isRunning){
            return;
        }
        this.isRunning = true;
        // if(director>=0){
        //     this.setRoleFlip(false);
        // }else {
        //     this.setRoleFlip(true);
        // }
        // this.barBg.setVisible(false);
        this.role.stopAllActions();
        // 14 frames * 1sec = 14 seconds
        if(typeof repeat !='undefined' && repeat==false){
            this.role.runAction(cc.animate(this.aniRun));
        }else {
            this.role.runAction(cc.animate(this.aniRun).repeatForever());
        }
    },
    actIdle:function () {
        this.isRunning = false;
        // this.setRoleFlip(false);
        // this.barBg.setVisible(false);
        this.role.stopAllActions();

        // 14 frames * 1sec = 14 seconds
        this.role.runAction(cc.animate(this.aniIdle).repeatForever());
    },
    setRoleFlip:function (flip) {
        this.role.setFlippedX(flip);
        if(flip){
            this.role.setAnchorPoint(cc.p(1,0));
            // this.role.setPosition(100,0);
            this.role.setPosition(this.roleAttr.barpos[1][0],-(this.roleAttr.barpos[1][1]-20)/2);
        }else {
            this.role.setAnchorPoint(cc.p(0,0));
            this.role.setPosition(-this.roleAttr.barpos[1][0],-(this.roleAttr.barpos[1][1]-20)/2);
        }
    },
    addBloodBar:function () {
        this.bar = new ccui.LoadingBar();
        this.bar.loadTexture(res.bloodfront_png);
        this.bar.setDirection(ccui.LoadingBar.TYPE_LEFT);
        this.bar.setPercent(100);
        //背景
        this.barBg = new cc.Sprite(res.bloodBackground_png);
        this.barBg.addChild(this.bar);
        // var barSize =  this.barBg.getContentSize();
        this.bar.setPosition(this.barBg.width/2,this.barBg.height/2);
        this.role.addChild(this.barBg,combatCfg.zorder.bloodBar);
        // var pos = heroBarPos[this.model];
        this.barBg.setPosition(this.roleAttr.barpos[1][0],this.roleAttr.barpos[1][1]);
        this.barBg.setScale(1/this.roleAttr.warsize);
        // this.barBg.setVisible(false);
    },
    updateBloodBar:function () {
        var percent =Math.round(this.hp/this.totalHp*100);
        this.bar.setPercent(percent);
    },
    treat:function (val) {//治疗
        //更新血量和血条
        this.hp += val;
        this.hp = this.hp>this.totalHp?this.totalHp:this.hp;
        this.updateBloodBar();
    },
    showDmg:function (type,damage,atkType,monsterId) {
        //cc.log("this.soldierId "+this.soldierId+" monsterId "+monsterId+" atkType "+atkType);
        var self = this;
        //更新血量和血条
        this.hp -= damage;
        this.hp = this.hp<0?0:this.hp;
        this.updateBloodBar();
        //加载动画
        var buff = ccs.load(res.effFontLayer_json);
        var node = buff.node;
        var action = buff.action;
        node.runAction(action);
        this.addChild(node,combatCfg.zorder.dmg);
        // var pos = heroBarPos[this.model];
        var modPosY = Math.random()*20;
        // node.setPosition(this.roleAttr.barpos[1][0],this.roleAttr.barpos[1][1]-20-modPosY);
        node.setPosition(0,(this.roleAttr.barpos[1][1]-20)/2-modPosY);
        if('miss'==type){//闪避
            // lblDmg = new cc.LabelBMFont("!",res.dgBlue_fnt);
            action.play("dodgeAction", false);
        }else if('crit'==type){//暴击
            if(atkType=='pugong'){
                var lblDmg = ccui.helper.seekWidgetByName(node, "bmFontAttack");//昵称
                lblDmg.setString("i"+damage);
                action.play("attackAction", false);
            }else {
                var lblDmg = ccui.helper.seekWidgetByName(node, "bmFontSkill");//昵称
                lblDmg.setString("i"+damage);
                action.play("skillAction", false);
            }
        }else{
            if(atkType=='pugong'){
                var lblDmg = ccui.helper.seekWidgetByName(node, "bmFontAttack");//昵称
                lblDmg.setString(""+damage);
                action.play("attackAction", false);
            }else {
                var lblDmg = ccui.helper.seekWidgetByName(node, "bmFontSkill");//昵称
                lblDmg.setString(""+damage);
                action.play("skillAction", false);
            }
        }
        action.setLastFrameCallFunc(function () {
            gcRes([res.effFontLayer_json]);
            node.removeFromParent();
        });

        // 展示受击效果
        if(damage>0){
            this.actHurt(atkType,monsterId);
        }
        if(self.hp<=0){
            self.death();
        }
        // var percent =Math.round(this.hp/this.totalHp*100);
        // if(percent<30&&this.canShowDanger&&(this.model.search('car')>0)){
        //     this.actDangerous();
        // }
    },
    actDangerous:function () {
        this.canShowDanger = false;
        var buff = ccs.load(res.effHurt_json);
        var node = buff.node;
        var action = buff.action;
        node.runAction(action);
        node.setPosition(this.roleSize.width/2,this.roleSize.height-20);
        this.role.addChild(node,combatCfg.zorder.hurtEfft);
        action.play("carDanger", true);
    },
    actHurt:function (atkType,monsterId) {
        var MonsterAtt = Helper.findMonsterById(monsterId);
        if(!MonsterAtt) MonsterAtt = Helper.findHeroById(monsterId);
        if(atkType == "jineng"){
            var roleEffInfo = this.roleAttr.effunski;
            var enEffInfo = MonsterAtt?MonsterAtt.effunski:undefined;
            if(roleEffInfo != undefined && enEffInfo != undefined && enEffInfo[0] != "null"){
                this.playAtkEff(enEffInfo[0],roleEffInfo[1][0],roleEffInfo[1][1],enEffInfo[2]);
            }
        }else if(atkType == "pugong"){
            var roleEffInfo = this.roleAttr.effunatk;
            var enEffInfo = MonsterAtt?MonsterAtt.effunatk:undefined;
            if(roleEffInfo != undefined && enEffInfo != undefined && enEffInfo[0] != "null"){
                this.playAtkEff(enEffInfo[0],roleEffInfo[1][0],roleEffInfo[1][1],enEffInfo[2]);
            }
        }
    },
    playAtkEff:function (effName,effPosx,effposy,effScale) {
        // 添加起手特效和受击特效
        var Flipped = this.role.isFlippedX();
        var size = this.role.getContentSize();
        cc.spriteFrameCache.addSpriteFrames(res[effName+"_plist"]);
        var effNode = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame(effName+'_0.png'));
        effNode.setFlippedX(Flipped);
        effNode.setAnchorPoint(0.5,0.5);
        this.role.addChild(effNode,combatCfg.zorder.hurtEfft);
        if(Flipped){
            effNode.setPosition(size.width-effPosx,effposy);
        }else{
            effNode.setPosition(effPosx,effposy);
        }
        effNode.setScale(effScale);
        var animFrames = [];
        var str = "";
        for (var i = 0; i < 20; i++) {
            str = effName+'_'+i+'.png';
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            if (frame){
                animFrames.push(frame);
            }else {
                break;
            }
        }
        var animation = new cc.Animation(animFrames, 0.1);
        effNode.runAction(cc.sequence(cc.animate(animation),cc.callFunc(function (nodeExecutingAction) {
            nodeExecutingAction.removeFromParent(true);
            gcRes([res[effName+"_plist"]]);
        },this)));
    },
    stopAni:function () {
        this.isRunning = false;
        this.stopAllActions();
        if (this.role)
        {
            this.role.stopAllActions();
        }
    },
    // setScale:function (val) {
    //     this.role.setScale(val);
    // },
    remove:function () {
        this.removeFromParent(true);
    },
    death:function () {
        this.stopAni();
        if(this.roleAttr.effdie != undefined){
            //先移除原来的，然后播放死亡特效
            var Flipped = this.role.isFlippedX();
            var size = this.role.getContentSize();
            this.role.removeFromParent(true);
            // this.role = null;
            var effInfo = this.roleAttr.effdie;
            cc.spriteFrameCache.addSpriteFrames(res[effInfo[0]+"_plist"]);
            var effNode = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame(effInfo[0]+'_0.png'));
            effNode.setFlippedX(Flipped);
            effNode.setAnchorPoint(0.5,0.5);
            this.addChild(effNode,10);
            // effNode.setPositionY(-this.roleSize.height*combatCfg.scaleRole[this.pos-1]/2);
            var modifyPos = cc.p(-this.roleAttr.barpos[1][0],-this.roleSize.height/2);
            if(Flipped){
                effNode.setPosition(size.width-effInfo[1][0],effInfo[1][1]);
            }else{
                var pos = cc.pAdd(cc.p(effInfo[1][0],effInfo[1][1]),modifyPos);
                effNode.setPosition(pos.x,pos.y);
            }
            effNode.setScale(effInfo[2]);
            var animFrames = [];
            var str = "";
            for (var i = 0; i < 20; i++) {
                str = effInfo[0]+'_'+i+'.png';
                var frame = cc.spriteFrameCache.getSpriteFrame(str);
                if (frame){
                    animFrames.push(frame);
                }else {
                    break;
                }
            }
            var animation = new cc.Animation(animFrames, 0.05);
            effNode.runAction(cc.sequence(cc.animate(animation),cc.callFunc(function (nodeExecutingAction) {
                nodeExecutingAction.removeFromParent(true);
                this.removeFromParent(true);
                gcRes([res[effInfo[0]+"_plist"]]);
            },this)));
        }else{
            this.role.removeFromParent(true);
            // this.role = null;
            this.removeFromParent(true);
        }
    },
    addBuff:function (type) {
        var effName;
        // var pos = heroBarPos[this.model];
        var posX ;
        var posY = this.roleAttr.barpos[1][1]+15;
        if(type=='def'){//暴击
            effName = 'buff_cri01';
            posX = this.roleAttr.barpos[1][0]-25;
        }else  if(type=='atk'){//攻击
            effName = 'buff_def01';
            posX = this.roleAttr.barpos[1][0];
        }else{//加速
            effName = 'buff_spe01';
            posX = this.roleAttr.barpos[1][0]+25;
        }

        cc.spriteFrameCache.addSpriteFrames(res[effName+"_plist"]);
        var effNode = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame(effName+'_0.png'));
        effNode.setName(type+'buff');
        this.role.addChild(effNode,combatCfg.zorder.hurtEfft);
        effNode.setPosition(posX,posY);
        var animFrames = [];
        var str = "";
        for (var i = 0; i < 20; i++) {
            str = effName+'_'+i+'.png';
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            if (frame){
                animFrames.push(frame);
            }else {
                break;
            }
        }
        var animation = new cc.Animation(animFrames, 0.1);
        effNode.runAction(cc.animate(animation).repeatForever());
    },
    removeBuff:function (type) {
        var buffNode = this.role?this.role.getChildByName(type+'buff'):null;
        if(buffNode){
            buffNode.removeFromParent(true);
        }
    },
    restoreStatus:function () {
        this.atkNum = 0;
        this.canAtk = false;
        this.hp = this.totalHp;
        this.atkType='pugong';
        this.canShowDanger = true;
        this.updateBloodBar();
        this.stopAni();
    },
    actShow:function () {
        var buff = ccs.load(res.effAppear_json);
        var node = buff.node;
        var action = buff.action;
        node.runAction(action);
        this.role.addChild(node);
        node.setPosition(this.roleAttr.barpos[1][0],(self.roleAttr.barpos[1][1]-20)/2);
        action.gotoFrameAndPlay(0, false);
        action.setLastFrameCallFunc(function() {
            node.removeFromParent(true);
            gcRes([res.effAppear_json]);
        });
    },
    reOrder:function () {
        this.setLocalZOrder(1136-this.y+(this.roleAttr.barpos[1][1]-20)/2);
    },
    startReOrder:function () {
        this.schedule(this.reOrder,0.5);
    },
    stopReOrder:function () {
        this.unschedule(this.reOrder);
    },
    calAtkAttr:function () {
        var soldier = GLOBALDATA.soldiers[this.soldierId];
        var equlist = [];
        for (var idx = 0; idx < GLOBALDATA.army.battle.length; idx++)
        {
            if (this.soldierId == GLOBALDATA.army.battle[idx])
            {
                equlist = GLOBALDATA.army.equips[idx];
                break;
            }
        }
        var depotData = GLOBALDATA.depot;
        var commanderData = GLOBALDATA.commanders[GLOBALDATA.army.commander];
        var teamlist = GLOBALDATA.army.battle.concat(GLOBALDATA.army.companion);
        var attr = new heroAttr(soldier.p, soldier.l, soldier.q, soldier.m, soldier.w, soldier.sq, soldier.eq, equlist, depotData, commanderData, teamlist);

        //血
        this.hp = attr.getHp();
        this.totalHp = this.hp;
        //暴击
        this.basehit = attr.getbasehit();
        this.basemiss = attr.getbasemiss();
        //效果倍率，即是否造成重伤效果，不造成重伤时效果倍率=1，造成重伤效果时倍率=攻击方重伤倍率
        this.basecrit = attr.getBaseCrit();
        this.baseuncrit = attr.getBaseunCrit();
        this.basecritvalue = attr.getBaseCritvalue();
        //技能倍率取自技能配置，每个技能和普工对应一个技能倍率
        this.pugongRatio = this.roleAttr.damage;
        var skill = Helper.findSkillById(this.roleAttr.skillid);
        this.skillRatio = skill.damagevalue/10000;
        //攻击
        this.atk = attr.getAtk();
        //防御
        this.def = attr.getDef();
        //伤害加成率=攻击方伤害-受击方免伤
        this.basedamage = attr.getbasedamage();
        this.baseinjury = attr.getbaseinjury();
    }
});

if(!cc.clone)
{
    cc.clone = function (obj) {
        var newObj = (obj.constructor) ? new obj.constructor : {};
        for (var key in obj) {
            var copy = obj[key];
            if (((typeof copy) === "object") && copy &&
                !(copy instanceof cc.Node) && !(copy instanceof HTMLElement)) {
                newObj[key] = cc.clone(copy);
            } else {
                newObj[key] = copy;
            }
        }
        return newObj;
    };
}

//获取英雄属性加成
var heroAttr =  cc.Class.extend({
    /**
     * soldierId        士兵原始id
     * level            升级等级
     * advancedLevel    进阶等级
     * breakFlag        突破标志
     * awakeLevel       觉醒等级
     * reformLevel      改造等级
     * equlist          装备列表
     * proplist         觉醒道具列表
     * commanderData    指挥官信息
     * teamlist         上阵士兵及伙伴列表
     */
    ctor:function (soldierId, level, advancedLevel, breakFlag, awakeLevel, reformLevel, proplist, equlist, depotData, commanderData, teamlist) {
        this.soldierId = soldierId;
        this.level = level || 1;                    //等级  默认1级
        this.advancedLevel = advancedLevel || 0;    //进阶等级
        this.awakeLevel = awakeLevel || 0;          //觉醒等级
        this.reformLevel = reformLevel || 0;        //改造等级
        this.proplist = proplist || [];             //觉醒道具列表
        this.depotData = depotData || {};
        this.commanderData = commanderData || {};
        this.teamlist = teamlist || [];


        this.heroId = soldierId;
        if ((breakFlag || 0) >= 1)    //已突破
        {
            var attrCfg  = Helper.findHeroById(soldierId);
            this.heroId = attrCfg.breakid;
        }

        if (this.reformLevel >= 10)     //终级改造（改造等级达到10级）
        {
            var attrCfg  = Helper.findHeroById(this.heroId);
            this.heroId =  attrCfg.reform;
        }

        // 基础配置
        this.roleAttr = Helper.findHeroById(this.heroId);
        // 进阶配置
        this.advancedAttr = Helper.findHeroPromoteById(this.soldierId);
        // 改造配置
        this.reformAttr = Helper.findHeroReformById(this.soldierId);

        this.equipmentlist = [];
        this.strenLvArray = [0,0,0,0,0,0];
        this.refineLvArray = [0,0,0,0,0,0];
        for(var idx = 0; idx < (equlist || []).length; idx++)
        {
            var equid = equlist[idx];
            if(equid > 0)
            {
                var equ = this.depotData[equid];
                this.equipmentlist.push(equ);

                this.teamlist.push(equ.p);

                this.strenLvArray[idx] = equ.s;
                this.refineLvArray[idx] = equ.r;
            }
        }

        var attr = [];

        attr = this._wakAttr(attr);
        attr = this._fateAttr(attr);
        attr = this._commanderSkillAttr(attr);
        attr = this._equAttr(attr);

        this.attr = attr;
    },

    /* 获取士兵的 血、攻、防
     * attrid  基础属性id
     * bFloor  是否向下取整
     */
    getBaseAttr:function()
    {
        var attrid = arguments[0] ? arguments[0] : 0;
        var bFloor = arguments[1] ? arguments[1] : true;

        // 基础属性及成长
        var base = [0,0,0], add = [0,0,0];

        for (var i = 0; i < 3; i++)
        {
            if (this.roleAttr.base[i][0] == attrid)
            {
                base = this.roleAttr.base[i];
            }
            if (this.roleAttr.add[i][0] == attrid)
            {
                add = this.roleAttr.add[i];
            }
        }

        //console.log(this.soldierId, this.heroId);
        // 等级
        var level = this.level;
        // 进阶属性
        var advancedAttr = this.advancedAttr;
        // 进阶等级
        var advancedLevel = this.advancedLevel;
        // 进阶成长加成率
        var addattributerate = (advancedAttr[advancedLevel] || {addattributerate:1}).addattributerate;
        // 进阶属性加成
        var promote_val = 0, promote_rate = 0;
        for (var lv = 1; lv <= advancedLevel; lv++)
        {
            for (var idx in advancedAttr[lv].promote_value)
            {
                if ( advancedAttr[lv].promote_value[idx][0] == attrid)
                {
                    if (advancedAttr[lv].promote_value[idx][1] == 1)  //固定值
                    {
                        promote_val += advancedAttr[lv].promote_value[idx][2];
                    }
                    else if ((advancedAttr[lv].promote_value[idx][1] == 2))  //百分比
                    {
                        promote_rate += advancedAttr[lv].promote_value[idx][2];
                    }
                }
            }
        }

        // 改造等级
        var reformLevel = this.reformLevel;
        //
        var reformAttr = this.reformAttr;
        //
        var resultAttributerate = (reformAttr[reformLevel] || {result:1}).result;

        //最终属性 = (士兵基础属性 + 士兵成长 *  (士兵等级 - 1)) * 进阶成长成加率 * (1 + 进阶百分比属性加成) + 进阶固定值属性加成
        var attrVal = (base[2] + add[2] * (level - 1)) * addattributerate * (1 + promote_rate/10000) *  resultAttributerate + promote_val;

        return bFloor ? Math.floor(attrVal) : attrVal;
    },

    //觉醒
    _wakAttr:function(awake_attr){
        var awakeLevel = this.awakeLevel;
        var proplist = this.proplist;

        var list = []
        for (var lv = 1; lv <= awakeLevel; lv++)
        {
            var cfg = ARMYAWAKECFG[lv];
            var attribute = cfg.attribute;
            for (var i = 0; i < attribute.length; i++)
            {
                var item = {};
                item.id = attribute[i][0];
                item.type = attribute[i][1];
                item.val = attribute[i][2];

                awake_attr.push(item);
                //去重
                for (var j=0; j < awake_attr.length - 1;j++)
                {
                    if (awake_attr[j].id == item.id && awake_attr[j].type == item.type)
                    {
                        awake_attr[j].val += item.val;
                        awake_attr.pop();
                        break;
                    }
                }
            }
            // 每5级 增加一条属性
            if (lv >= 10 && (lv % 5) == 0)
            {
                var attribute = cfg.oattribute;
                for (var i=0; i<attribute.length; i++)
                {
                    var item = {};
                    item.id = attribute[i][0];
                    item.type = attribute[i][1];
                    item.val = attribute[i][2];

                    awake_attr.push(item);
                    //去重
                    for (var j = 0; j < awake_attr.length - 1; j++)
                    {
                        if (awake_attr[j].id == item.id && awake_attr[j].type == item.type)
                        {
                            awake_attr[j].val += item.val;
                            awake_attr.pop();
                            break;
                        }
                    }
                }
            }

            // 觉醒消耗的道具
            list = list.concat(cfg.equcost);
        }

        for (var i = 0; i < proplist.length; i++)
        {
            if (proplist[i] > 0)
            {
                list.push(proplist[i]);
            }
        }

        for (var k = 0; k < list.length; k++)
        {
            var attribute = AWAKEMATERIALCFG[list[k]].attribute;
            for (var i=0; i<attribute.length; i++)
            {
                var item = {};
                item.id = attribute[i][0];
                item.type = attribute[i][1];
                item.val = attribute[i][2];

                awake_attr.push(item);
                //去重
                for (var j=0; j < awake_attr.length - 1;j++)
                {
                    if (awake_attr[j].id == item.id && awake_attr[j].type == item.type)
                    {
                        awake_attr[j].val += item.val;
                        awake_attr.pop();
                        break;
                    }
                }
            }
        }

        return awake_attr;
    },

    //缘分
    _fateAttr:function(fate_attr){
        if (this.teamlist.length > 0)
        {
            for(var key in ARMYRELATIONCFG)
            {
                var cfg = ARMYRELATIONCFG[key];
                if(cfg.armyid == this.soldierId)
                {
                    var armySolIdArray = cfg.relation_armyvalue;
                    var k = 0;
                    for(; k < armySolIdArray.length; k++)
                    {
                        var targetId = armySolIdArray[k];
                        if (this.teamlist.indexOf(targetId) == -1)
                        {
                            break;
                        }
                    }

                    if (k == armySolIdArray.length)
                    {
                        var attribute = cfg.relation_value;
                        for (var i = 0; i < attribute.length; i++)
                        {
                            var item = {};
                            item.id = attribute[i][0];
                            item.type = attribute[i][1];
                            item.val = attribute[i][2];

                            fate_attr.push(item);
                            //去重
                            for (var j=0; j < fate_attr.length - 1;j++)
                            {
                                if (fate_attr[j].id == item.id && fate_attr[j].type == item.type)
                                {
                                    fate_attr[j].val += item.val;
                                    fate_attr.pop();
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
        return fate_attr;
    },

    _commanderSkillAttr:function(skill_attr){
        var skill_list = this.commanderData.s || {};
        for (var key in skill_list)
        {
            var skill_id = key;
            var skill_lv = skill_list[key];
            if (skill_lv > 0)
            {
                var cfg = COMMANDERSKILLCFG[skill_id];
                for(var key in COMDERSKILLCONSUMECFG){
                    if(COMDERSKILLCONSUMECFG[key].pos == skill_id && COMDERSKILLCONSUMECFG[key].lev == skill_lv){
                        var attribute = COMDERSKILLCONSUMECFG[key].data;

                        //var attribute = cfg.promotevalue_base;

                        var item = {};
                        item.id  = attribute[0];
                        item.type = attribute[1];
                        item.val = attribute[2]; // * skill_lv;

                        skill_attr.push(item);
                        //去重
                        for (var j=0; j < skill_attr.length - 1;j++)
                        {
                            if (skill_attr[j].id == item.id && skill_attr[j].type == item.type)
                            {
                                skill_attr[j].val += item.val;
                                skill_attr.pop();
                                break;
                            }
                        }

                        break;
                    }
                }

            }
        }

        return skill_attr;
    },

    _equAttr:function(equ_attr){

        var equipmentlist = this.equipmentlist;
        var suit = [];
        for (var key in equipmentlist)
        {
            var equ = equipmentlist[key];
            // 装备属性
            var equAttrCalc = new equAttr(equ.p, equ.s, equ.r, equ.d);
            var attr = equAttrCalc.getAllAttr();
            for (var i = 0; i < attr.length; i++)
            {
                equ_attr.push(cc.clone(attr[i]));
                //去重
                for (var j=0; j < equ_attr.length - 1;j++)
                {
                    if (equ_attr[j].id == attr[i].id && equ_attr[j].type == attr[i].type)
                    {
                        equ_attr[j].val += attr[i].val;
                        equ_attr.pop();
                        break;
                    }
                }
            }

            // 套装信息
            var cfg = EQUIPSHUXINGCFG[equ.p];
            if (cfg && cfg.suit_id != -1)
            {
                var item = {};
                item.id = cfg.suit_id;
                item.count = 1;
                suit.push(item);

                for (var i = 0; i < suit.length - 1; i++)
                {
                    if(suit[i].id == cfg.suit_id)
                    {
                        suit[i].count++;
                        suit.pop();
                        break;
                    }
                }
            }
        }

        // 装备的最小强化&精炼等级
        var equStrenLv = Math.min.apply(null, this.strenLvArray.slice(2));
        var equRefineLv = Math.min.apply(null, this.refineLvArray.slice(2));
        var accStrenLv = Math.min.apply(null, this.strenLvArray.slice(0,2));
        var accRefineLv = Math.min.apply(null, this.refineLvArray.slice(0,2));

        //强化大师 属性
        var equStrenAttr = [];
        var equRefineAttr = [];
        var accStrenAttr = [];
        var accRefineAttr = [];
        for (var key in EQUIPDASHICFG)
        {
            var dashi = EQUIPDASHICFG[key];
            if(dashi.type1 == 1) //装备
            {
                if (dashi.type2 == 1)  //强化
                {
                    if (dashi.goal <= equStrenLv)
                    {
                        equStrenAttr = dashi.attr;
                    }
                }
                else if (dashi.type2 == 2)  //精炼
                {
                    if (dashi.goal <= equRefineLv)
                    {
                        equRefineAttr = dashi.attr;
                    }
                }
            }
            else if(dashi.type1 == 2) //配饰
            {
                if (dashi.type2 == 1)  //强化
                {
                    if (dashi.goal <= accStrenLv)
                    {
                        accStrenAttr = dashi.attr;
                    }
                }
                else if (dashi.type2 == 2)  //精炼
                {
                    if (dashi.goal <= accRefineLv)
                    {
                        accRefineAttr = dashi.attr;
                    }
                }
            }
        }

        for (var i = 0; i < equStrenAttr.length; i++)
        {
            var item = {};
            item.id = equStrenAttr[i][0];
            item.type = equStrenAttr[i][1];
            item.val = equStrenAttr[i][2];

            equ_attr.push(item);
            //去重
            for (var j=0; j < equ_attr.length - 1;j++)
            {
                if (equ_attr[j].id == item.id && equ_attr[j].type == item.type)
                {
                    equ_attr[j].val += item.val;
                    equ_attr.pop();
                    break;
                }
            }
        }
        for (var i = 0; i < equRefineAttr.length; i++)
        {
            var item = {};
            item.id = equRefineAttr[i][0];
            item.type = equRefineAttr[i][1];
            item.val = equRefineAttr[i][2];

            equ_attr.push(item);
            //去重
            for (var j=0; j < equ_attr.length - 1;j++)
            {
                if (equ_attr[j].id == item.id && equ_attr[j].type == item.type)
                {
                    equ_attr[j].val += item.val;
                    equ_attr.pop();
                    break;
                }
            }
        }
        for (var i = 0; i < accStrenAttr.length; i++)
        {
            var item = {};
            item.id = accStrenAttr[i][0];
            item.type = accStrenAttr[i][1];
            item.val = accStrenAttr[i][2];

            equ_attr.push(item);
            //去重
            for (var j=0; j < equ_attr.length - 1;j++)
            {
                if (equ_attr[j].id == item.id && equ_attr[j].type == item.type)
                {
                    equ_attr[j].val += item.val;
                    equ_attr.pop();
                    break;
                }
            }
        }
        for (var i = 0; i < accRefineAttr.length; i++)
        {
            var item = {};
            item.id = accRefineAttr[i][0];
            item.type = accRefineAttr[i][1];
            item.val = accRefineAttr[i][2];

            equ_attr.push(item);
            //去重
            for (var j=0; j < equ_attr.length - 1;j++)
            {
                if (equ_attr[j].id == item.id && equ_attr[j].type == item.type)
                {
                    equ_attr[j].val += item.val;
                    equ_attr.pop();
                    break;
                }
            }
        }

        return equ_attr;
    },

    _attr:function(baseVal, pecentVal, attrid){
        var attr = this.attr;

        for (var key in attr)
        {
            if (attr[key].id == attrid)
            {
                if (attr[key].type == 1)
                {
                    baseVal += attr[key].val;
                }
                else if (attr[key].type == 2)
                {
                    pecentVal += attr[key].val
                }
            }
        }
        var attrVal = baseVal * (pecentVal / 10000);
        return attrVal;
    },

    // 生命
    getHp:function(type){
        var baseVal = this.getBaseAttr(1, false);
        var pecentVal = 10000;
        var attrid = 1;

        return Math.floor(this._attr(baseVal, pecentVal, attrid));
    },

    // 攻击
    getAtk:function(type){
        var baseVal = this.getBaseAttr(2, false);
        var pecentVal = 10000;
        var attrid = 2;

        return Math.floor(this._attr(baseVal, pecentVal, attrid));
    },

    // 防御
    getDef:function(type){
        var baseVal = this.getBaseAttr(3, false);
        var pecentVal = 10000;
        var attrid = 3;

        return Math.floor(this._attr(baseVal, pecentVal, attrid));
    },

    // 攻击速度
    getAtkSpeed:function () {
        var baseVal = this.roleAttr.atkspeed;
        var pecentVal = 10000;
        var attrid = 13;

        return this._attr(baseVal, pecentVal, attrid);
    },

    // 重伤
    getBaseCrit:function () {
        var baseVal = this.roleAttr.basecrit;
        var pecentVal = 10000;
        var attrid = 14;

        return this._attr(baseVal, pecentVal, attrid);
    },
    // 重伤抵抗
    getBaseunCrit:function () {
        var baseVal = this.roleAttr.baseuncrit;
        var pecentVal = 10000;
        var attrid = 15;

        return this._attr(baseVal, pecentVal, attrid);
    },
    // 重伤倍率
    getBaseCritvalue:function () {
        var baseVal = this.roleAttr.basecritvalue;
        var pecentVal = 10000;
        var attrid = 16;

        return this._attr(baseVal, pecentVal, attrid);
    },
    // 命中
    getbasehit:function () {
        var baseVal = this.roleAttr.basehit;
        var pecentVal = 10000;
        var attrid = 17;

        return this._attr(baseVal, pecentVal, attrid);
    },
    // 闪避
    getbasemiss:function () {
        var baseVal = this.roleAttr.basemiss;
        var pecentVal = 10000;
        var attrid = 18;

        return this._attr(baseVal, pecentVal, attrid);
    },
    // 伤害加成
    getbasedamage:function () {
        var baseVal = this.roleAttr.basedamage;
        var pecentVal = 10000;
        var attrid = 19;

        return this._attr(baseVal, pecentVal, attrid);
    },
    // 免伤加成
    getbaseinjury:function () {
        var baseVal = this.roleAttr.baseinjury;
        var pecentVal = 10000;
        var attrid = 20;

        return this._attr(baseVal, pecentVal, attrid);
    },
    // 回复率
    getbaserestored:function () {
        var baseVal = this.roleAttr.baserestored;
        var pecentVal = 10000;
        var attrid = 21;

        return this._attr(baseVal, pecentVal, attrid);
    },
    // 被回复率
    getbaseberestored:function () {
        var baseVal = this.roleAttr.baseberestored;
        var pecentVal = 10000;
        var attrid = 22;

        return this._attr(baseVal, pecentVal, attrid);
    }
});

var equAttr = cc.Class.extend({
    /*
     * 装备原型id
     * 强化等级
     * 精炼等级
     * 锻造等级
     */
    ctor:function(sid, strenlv, refinelv, forgelv){
        this._attr_s = [];
        this._attr_r = [];
        this._attr_f = [];
        this._attr_a = [];

        this._strenlv = strenlv;
        this._refinelv = refinelv;
        this._forgelv = forgelv;

        this._cfg = Helper.findEqById(sid);

        this._strengthAttr();

        if (refinelv > 0)
        {
            this._refineAttr();
        }
        if (forgelv > 0)
        {
            this._forgeCfg = EQUIPDUANZAOCFG[sid];
            this._forgeAttr();
        }

        this._allAttr();
    },

    //是否基础属性
    _isBase:function(id){
        return (id == 1 || id == 2 || id == 3)
    },

    _formatNum:function(type, val){
        return  type == 2 ? (val/100) + '%' : Math.floor(val);
    },
    // 计算强化属性
    _strengthAttr:function(){
        var attr = [];
        var cfg = this._cfg;
        var strenlv  = this._strenlv;

        for (var i = 0; i < cfg.attr_base.length; i++)
        {
            var base = cfg.attr_base[i];
            var add = cfg.attr_add[i];

            if(base[0] == add[0] && base[1] == add[1] && (base[2] + (strenlv - 1) * add[2]) != 0)
            {
                var item = {};
                item.id = add[0];
                item.type = add[1];
                item.val = base[2] + (strenlv - 1) * add[2];
                attr.push(item);
            }
        }
        this._attr_s = attr;
    },

    // 计算精炼属性
    _refineAttr:function(refinelv){
        var attr = [];
        var cfg = this._cfg;
        var refinelv = this._refinelv;

        for (var i = 0; i < cfg.re_attr_add.length; i++)
        {
            var add = cfg.re_attr_add[i];

            if( refinelv * add[2] != 0 )
            {
                var item = {};
                item.id = add[0];
                item.type = add[1];
                item.val = refinelv * add[2];
                attr.push(item);
            }
        }
        this._attr_r = attr;
    },

    //计算锻造属性
    _forgeAttr:function(){
        var attr = [];
        var forgelv = this._forgelv;

        var attr_s = this._attr_s;
        var attr_r = this._attr_r;

        for (var i=0;i<attr_s.length;i++)
        {
            // 保留基础属性
            if( this._isBase(attr_s[i].id) )
            {
                attr.push(cc.clone(attr_s[i]));
            }
        }

        for (var i=0;i<attr_r.length;i++)
        {
            // 保留基础属性
            if( this._isBase(attr_r[i].id) )
            {
                attr.push(cc.clone(attr_r[i]));

                //去重
                for (var j=0; j<attr.length - 1;j++)
                {
                    if (attr[j].id == attr_r[i].id && attr[j].type == attr_r[i].type)
                    {
                        attr[j].val += attr_r[i].val;
                        attr.pop();
                        break;
                    }
                }
            }
        }

        var forgeCfg = this._forgeCfg;
        for (var i=0; i<attr.length;i++)
        {
            attr[i].val = attr[i].val * forgeCfg.add * forgelv;
        }

        this._attr_f = attr;
    },

    _allAttr:function(){
        var attr = [];
        var attr_s = this._attr_s;
        var attr_r = this._attr_r;
        var attr_f = this._attr_f;

        for (var i=0;i<attr_s.length;i++)
        {
            attr.push(cc.clone(attr_s[i]));
        }

        for (var i=0;i<attr_r.length;i++)
        {
            attr.push(cc.clone(attr_r[i]));

            //去重
            for (var j=0; j<attr.length - 1;j++)
            {
                if (attr[j].id == attr_r[i].id && attr[j].type == attr_r[i].type)
                {
                    attr[j].val += attr_r[i].val;
                    attr.pop();
                    break;
                }
            }
        }

        for (var i=0;i<attr_f.length;i++)
        {
            attr.push(cc.clone(attr_f[i]));

            //去重
            for (var j=0; j<attr.length - 1;j++)
            {
                if (attr[j].id == attr_f[i].id && attr[j].type == attr_f[i].type)
                {
                    attr[j].val += attr_f[i].val;
                    attr.pop();
                    break;
                }
            }
        }

        this._attr_a = attr;
    },

    _attrShow:function(attr){
        var ret = [];
        for (var i = 0; i < attr.length; i++ )
        {
            ret[i] = {};
            ret[i].name = ATTRIBUTEIDCFG[attr[i].id].describe;
            ret[i].value = this._formatNum(attr[i].type, attr[i].val);
        }
        return ret;
    },

    // 获取强化属性
    getStrengthAttr:function(){
        return this._attr_s || [];
    },

    // 获取精炼属性
    getRefineAttr:function(){
        return this._attr_r || [];
    },

    // 获取锻造属性
    getForgeAttr:function(){
        return this._attr_f || [];
    },

    // 获取锻造属性
    getAllAttr:function(){
        return this._attr_a || [];
    },

    getStrengthAttrForShow:function(){
        return this._attrShow(this._attr_s || []);
    },

    getRefineAttrForShow:function(){
        return this._attrShow(this._attr_r || []);
    },

    getForgeAttrForShow:function(){
        return this._attrShow(this._attr_f || []);
    },

    getAllAttrForShow:function(){
        return this._attrShow(this._attr_a || []);
    },
});

var getCommanderPower=function(){
//    生命战力=生命/8
//
//    防御战力=防御
//
//    攻击战力=攻击*2
//
//    重伤战力=攻击*2*（重伤几率/100）
//
//    命中战力=攻击*2*（命中几率/100）
//
//    闪避战力=（ 生命/8 + 防御 ）*（闪避几率/100）
//
//    总战力=生命战力+防御战力+攻击战力+重伤战力+命中战力+闪避战力

    var hpVal = 0, atkVal = 0, defVal = 0, baseCritVal = 0, baseHitVal = 0, baseMissVal = 0;
    for (var i = 0; i < GLOBALDATA.army.battle.length; i++)
    {
        var id = GLOBALDATA.army.battle[i];
        if( id > 0)
        {
            var soldier = GLOBALDATA.soldiers[id];
            var equlist = GLOBALDATA.army.equips[i];
            var depotData = GLOBALDATA.depot;
            var commanderData = GLOBALDATA.commanders[GLOBALDATA.army.commander];
            var teamlist = GLOBALDATA.army.battle.concat(GLOBALDATA.army.companion);
            var attr = new heroAttr(soldier.p, soldier.l, soldier.q, soldier.m, soldier.w, soldier.sq, soldier.eq, equlist, depotData, commanderData, teamlist);

            hpVal += attr.getHp();
            atkVal += attr.getAtk();
            defVal += attr.getDef();

            baseCritVal += attr.getBaseCrit();
            baseHitVal += attr.getbasehit();
            baseMissVal += attr.getbasemiss();

        }
    }
    return Math.floor(hpVal / 8 + atkVal * 2 + defVal + atkVal * 2 * (baseCritVal + baseHitVal) / 10000 / 100 + (hpVal / 8 + defVal) * baseMissVal / 10000 / 100 );
};
