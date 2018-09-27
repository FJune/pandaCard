
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 /**
 */
var Monster = cc.Layer.extend({
    roleType:'monster',
    atkNum:0,
    canAtk:false,
    level:1,
    isBoss:false,
    roleAttr:null,
    hp:0,
    totalHp:0,
    pos:null,
    atkType:'pugong',  //普工pugong,技能jineng
    canShowDanger:true,
    isRunning:false,
    // datasources: 战斗数据来源
    //     1按照等级和倍率计算
    //     2仅读取bossrate字段数值对应为血、攻和防御
    ctor:function (heroId,level,pos,bossrate,datasources) {
        //////////////////////////////
        // 1. super init first
        // cc.log
        this._super();
        //存放buff信息
        this.buffAttr = [];
        for (var i=0;i<35;i++){
            this.buffAttr.push(0);
        }
        this.setOpacity(150);       //透明度设置
        this.level = level;
        this.pos = pos;
        this.monsterId = heroId;
        this.bossrate = bossrate?bossrate:null;
        this.datasources = datasources?datasources:null;
        if((this.datasources&&this.datasources==4)||(this.datasources&&this.datasources==3)){
            this.roleAttr = Helper.findHeroById(heroId);
            this.model = this.roleAttr.armymodel;
        }else {
            this.roleAttr = Helper.findMonsterById(heroId);
            this.model = this.roleAttr.mastermodel;
        }
        //渲染图像
        var self = this;
        cc.loader.load([res[this.model+'_plist'],res[this.model+'_png']],function (result, count, loadedCount) {

        }, function () {
            // cc.log('loadRoleModel compelete');
            if(self.role&&self.roleSize.width==0) {
                //cc.textureCache.dumpCachedTextureInfo();
                cc.spriteFrameCache.addSpriteFrames(res[self.model+'_plist']);
                var role = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame(self.model+"-idle01_0.png"));
                self.roleSize = role.getContentSize();
                self.barBg.setPosition(self.roleSize.width-self.roleAttr.barpos[1][0],self.roleAttr.barpos[1][1]);
                self.initAniFrame();
                if(self.isRunning){
                    self.actRun(1,true);
                }
            }
        });
        cc.spriteFrameCache.addSpriteFrames(res[this.model+'_plist']);
        this.role = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame(self.model+"-idle01_0.png"));
        this.setContentSize(cc.size(100,100));
        self.roleSize = this.role.getContentSize();
        self.role.setPosition(self.roleAttr.barpos[1][0],-(self.roleAttr.barpos[1][1]-20)/2);
        this.role.setAnchorPoint(cc.p(1,0));
        self.addBloodBar();

        // this.role.setPosition(100,0);
        this.role.setFlippedX(true);
        // var spriteBatch = new cc.SpriteBatchNode(res[this.model+'_png']);
        // spriteBatch.addChild(this.role);
        // this.addChild(spriteBatch);
        this.addChild(this.role);

        this.setScale(this.roleAttr.warsize);

        this.initAniFrame();
    //计算属性值
        this.calAtkAttr();
        return true;
    },
    onExit:function () {
        this._super();

        this.aniAtk.release();
        this.aniSkillAtk.release();
        gcRes([res[this.model+'_plist']]);
    },
    initAniFrame:function () {
        //攻击动作
        this.aniAtkNum = 0;
        var animFrames = [];
        var str = "";
        for (var i = 0; i < 50; i++) {
            str = this.model+'-atk01_'+i+'.png';
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            if (frame){
                this.aniAtkNum++;
                animFrames.push(frame);
            }
        }
        this.aniAtk = new cc.Animation(animFrames, 0.1);
        this.aniAtk.retain();
        //技能
        this.aniSkillAtkNum = 0;
        var animFrames = [];
        var str = "";
        for (var i = 0; i < 50; i++) {
            str = this.model+'-ski01_'+i+'.png';
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            if (frame){
                this.aniSkillAtkNum++;
                animFrames.push(frame);
            }
        }
        this.aniSkillAtk = new cc.Animation(animFrames, 0.1);
        this.aniSkillAtk.retain();
    },
    getHp:function () {
        var hp = 1;
        if(this.bossrate&&this.bossrate!=-1){
            if((this.datasources&&this.datasources==2)||(this.datasources&&this.datasources==4)){
                hp = this.bossrate[0];
            }else {
                hp = (this.roleAttr.basehp + this.roleAttr.addhp*this.level)*this.bossrate[0];
            }
        }else {
            hp = (this.roleAttr.basehp + this.roleAttr.addhp*this.level);
        }
        return isNaN(hp)?1:hp;
    },
    getAtk:function () {
        var atk = 1;
        if(this.bossrate&&this.bossrate!=-1) {
            if((this.datasources&&this.datasources==2)||(this.datasources&&this.datasources==4)){
                atk = this.bossrate[1];
            } else {
                atk = (this.roleAttr.baseatk + this.roleAttr.addatk * this.level) * this.bossrate[1];
            }
        }else {
            atk = (this.roleAttr.baseatk + this.roleAttr.addatk * this.level) * 1;
        }
        return isNaN(atk)?1:atk;
    },
    getDef:function () {
        var def = 1;
        if(this.bossrate&&this.bossrate!=-1) {
            if((this.datasources&&this.datasources==2)||(this.datasources&&this.datasources==4)){
                def = this.bossrate[2];
            } else {
                def = (this.roleAttr.basedef + this.roleAttr.adddef * this.level) * this.bossrate[2];
            }
        }else {
            def = (this.roleAttr.basedef + this.roleAttr.adddef * this.level) * 1;
        }
        return isNaN(def)?1:def;
    },
    actAtk:function (cb,combat) {
        this.isRunning = false;
        var self = this;
        this.role.setFlippedX(true);
        // this.barBg.setVisible(true);
        this.role.stopAllActions();

        this.role.runAction(cc.sequence(cc.animate(this.aniAtk),cc.delayTime(0.1),cc.callFunc(function (sender) {
            self.actIdle();
        }, this)));
        //起手动作
        if(this.roleAttr.effatk!=undefined){
            var effInfo = this.roleAttr.effatk;
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
    actSkillAtk:function (cb,combat) {
        this.isRunning = false;
        var self = this;
        this.role.setFlippedX(true);
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
    },
    manageAtk:function (cb,combat) {
        var self = this;
        var actTime = this.atkType=='pugong'?0.1*this.aniAtkNum:0.1*this.aniSkillAtkNum;
        this.runAction(cc.sequence(cc.callFunc(cb, combat,this),cc.delayTime(this.roleAttr.atkspeed+actTime),cc.callFunc(function () {
            self.manageAtk(cb,combat);
        },this)));
    },
    actRun:function (director) {//正数 x轴正方向，
        if(this.isRunning){
            return;
        }
        this.isRunning = true;
        if(director>=0){
            this.role.setFlippedX(false);
        }else {
            this.role.setFlippedX(true);
        }
        // this.barBg.setVisible(false);
        this.role.stopAllActions();
        var animFrames = [];
        var str = "";
        for (var i = 0; i < 50; i++) {
            str = this.model+'-run_'+i+'.png';
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            if (frame){
                animFrames.push(frame);
            }
        }
        var animation = new cc.Animation(animFrames, 0.1);
        // 14 frames * 1sec = 14 seconds
        this.role.runAction(cc.animate(animation).repeatForever());
    },
    actIdle:function () {
        this.isRunning = false;
        this.role.setFlippedX(true);
        // this.barBg.setVisible(false);
        this.role.stopAllActions();
        var animFrames = [];
        var str = "";
        for (var i = 0; i < 50; i++) {
            str = this.model+'-idle01_'+i+'.png';
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            if (frame){
                animFrames.push(frame);
            }
        }
        var animation = new cc.Animation(animFrames, 0.1);
        // 14 frames * 1sec = 14 seconds
        this.role.runAction(cc.animate(animation).repeatForever());
    },
    addBloodBar:function () {
        this.bar = new ccui.LoadingBar();
        this.bar.loadTexture(res.bloodfront_png);
        this.bar.setDirection(ccui.LoadingBar.TYPE_RIGHT);
        this.bar.setPercent(100);
        //背景
        this.barBg = new cc.Sprite(res.bloodBackground_png);
        this.barBg.addChild(this.bar);
        // var barSize =  this.barBg.getContentSize();
        this.bar.setPosition(this.barBg.width/2,this.barBg.height/2);
        this.role.addChild(this.barBg,combatCfg.zorder.bloodBar);
        // var pos = heroBarPos[this.model];
        this.barBg.setPosition(this.roleSize.width-this.roleAttr.barpos[1][0],this.roleAttr.barpos[1][1]);
        // this.barBg.setVisible(false);
        this.barBg.setScale(1/this.roleAttr.warsize);
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
    showDmg:function (type,damage,atkType,heroId) {
        //cc.log("this.monsterId "+this.monsterId+" heroId "+heroId+" atkType "+atkType);
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
        // node.setPosition(this.roleSize.width-this.roleAttr.barpos[1][0],this.roleAttr.barpos[1][1]-20-modPosY);
        node.setPosition(0,(this.roleAttr.barpos[1][1]-20)/2-modPosY)

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
            node.removeFromParent();
            gcRes([res.effFontLayer_json]);
        });

        // 展示受击效果
        if(damage>0){
            this.actHurt(atkType,heroId);
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
        node.runAction(action,combatCfg.zorder.hurtEfft);
        node.setPosition(this.roleSize.width/2,this.roleSize.height-20);
        this.role.addChild(node,3);
        action.play("carDanger", true);
    },
    actHurt:function (atkType,heroId) {
        var HeroAtt = Helper.findHeroById(heroId);
        if(!HeroAtt) HeroAtt = Helper.findMonsterById(heroId);
        if(atkType == "jineng"){
            var roleEffInfo = this.roleAttr.effunski;
            var enEffInfo = HeroAtt?HeroAtt.effunski:undefined;
            if(roleEffInfo != undefined && enEffInfo != undefined && enEffInfo[0] != "null"){
                this.playAtkEff(enEffInfo[0],roleEffInfo[1][0],roleEffInfo[1][1],enEffInfo[2]);
            }
        }else if(atkType == "pugong"){
            var roleEffInfo = this.roleAttr.effunatk;
            var enEffInfo = HeroAtt?HeroAtt.effunatk:undefined;
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
            effNode.setAnchorPoint(0.5,0);
            this.addChild(effNode,10);
            // effNode.setPositionY(-this.roleSize.height*combatCfg.scaleRole[this.pos-1]/2);
            var modifyPos = cc.p(this.roleAttr.barpos[1][0],-this.roleSize.height/2);
            if(Flipped){
                var pos = cc.pAdd(cc.p(-effInfo[1][0],effInfo[1][1]),modifyPos);
                effNode.setPosition(pos.x,pos.y);
            }else{
                effNode.setPosition(effInfo[1][0],effInfo[1][1]);
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
            var animation = new cc.Animation(animFrames, 0.1);
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
    actShow:function () {
        var buff = ccs.load(res.effAppear_json);
        var node = buff.node;
        var action = buff.action;
        node.runAction(action);
        this.role.addChild(node);
        // var pos = heroBarPos[this.model];
        node.setPosition(this.roleSize.width-this.roleAttr.barpos[1][0],this.roleSize.height/2);
        action.gotoFrameAndPlay(0, false);
        action.setLastFrameCallFunc(function() {
            gcRes([res.effAppear_json]);
            node.removeFromParent(true);
        });
    },
    reOrder:function () {
        this.setLocalZOrder(1136-this.y+(this.roleAttr.barpos[1][1]-20)/2);
    },
    calAtkAttr:function () {
        //计算属性值
        if(this.datasources&&this.datasources==3){
            //血量
            var attr = new heroAttr(this.monsterId);
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
        }else {
            //血量
            this.hp = this.getHp();
            if(this.bossrate&&this.bossrate[3]){
                this.totalHp = this.bossrate[3];
            }else {
                this.totalHp = this.hp;
            }
            //暴击
            this.basehit = this.roleAttr.basehit;
            this.basemiss = this.roleAttr.basemiss;
            //效果倍率，即是否造成重伤效果，不造成重伤时效果倍率=1，造成重伤效果时倍率=攻击方重伤倍率
            this.basecrit = this.roleAttr.basecrit;
            this.baseuncrit = this.roleAttr.baseuncrit;
            this.basecritvalue = this.roleAttr.basecritvalue;
            //技能倍率取自技能配置，每个技能和普工对应一个技能倍率
            this.pugongRatio = this.roleAttr.damage;
            var skill = Helper.findSkillById(this.roleAttr.skillid);
            this.skillRatio = skill.damagevalue/10000;
            //攻击
            this.atk = this.getAtk();
            //防御
            this.def = this.getDef();
            //伤害加成率=攻击方伤害-受击方免伤
            this.basedamage = this.roleAttr.basedamage;
            this.baseinjury = this.roleAttr.baseinjury;
        }
    }
});