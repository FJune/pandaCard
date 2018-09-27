
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 /**
 * 子弹类
 */
var Bullet = cc.Sprite.extend({
    ctor:function (atkRole,fromPos,toPos,speed,type) {
        this._super();
        this.model = atkRole.roleAttr.effbic;
        if(type&&type=='hero'){
            var rolePos = cc.p(-atkRole.roleAttr.barpos[1][0],-(atkRole.roleAttr.barpos[1][1]-20)/2);
            var bltPos = cc.p(this.model[1][0],this.model[1][1]);
            var modPos = cc.pAdd(rolePos,bltPos);
            this.fromPos = cc.pAdd(fromPos,modPos);
            // this.toPos = cc.pSub(toPos,cc.p(50,0));
        }else {
            var rolePos = cc.p(atkRole.roleAttr.barpos[1][0],-(atkRole.roleAttr.barpos[1][1]-20)/2);
            var bltPos = cc.p(-this.model[1][0],this.model[1][1]);
            var modPos = cc.pAdd(rolePos,bltPos);
            this.fromPos = cc.pAdd(fromPos,modPos);
            // this.toPos = cc.pAdd(toPos,cc.p(50,0));
        }
        // this.fromPos = fromPos;
        this.toPos = toPos;

        this.speed = speed;
        cc.spriteFrameCache.addSpriteFrames(res[this.model[0]+'_plist']);
        this.bullet = new cc.Sprite();
        var deltaRotation = -Math.atan2(this.toPos.y-this.fromPos.y,this.toPos.x-this.fromPos.x)*180/Math.PI;
        this.bullet.setRotation(deltaRotation);
        this.bullet.setFlippedX(true);
        this.bullet.setScale(this.model[2]);
        this.addChild(this.bullet);
        this.setPosition(this.fromPos);
    },
    actMove:function (cb) {
        var animFrames = [];
        var str = "";
        for (var i = 0; i < 50; i++) {
            str = this.model[0]+'_'+i+'.png';
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            if (frame){
                animFrames.push(frame);
            }
        }
        var animation = new cc.Animation(animFrames, 1/60);
        this.bullet.runAction(cc.animate(animation).repeatForever());
        var time = cc.pDistance(this.fromPos,this.toPos)/this.speed;
        this.runAction(cc.sequence(cc.moveTo(time,this.toPos), cc.callFunc(function (nodeExecutingAction) {
            this.bullet.stopAllActions();
            this.bullet.removeFromParent();
            nodeExecutingAction.removeFromParent();
            if(cb){
                cb();
            }
        },this)));
        // this.runAction(cc.sequence(cc.callFunc(cb, combat,this),cc.delayTime(this.roleAttr.atkspeed)).repeatForever());
    }
})
var MachineGunBullett = cc.Sprite.extend({
    ctor:function (model,fromPos,toPos,speed,enemy) {
        this._super();
        this.model = model;
        this.fromPos = fromPos;
        this.toPos = toPos;
        this.speed = speed;
        this.enemy = enemy;
        cc.spriteFrameCache.addSpriteFrames(res[this.model+'_plist']);
        this.bullet = new cc.Sprite();
        var deltaRotation = -Math.atan2(this.toPos.y-this.fromPos.y,this.toPos.x-this.fromPos.x)*180/Math.PI;
        this.bullet.setRotation(deltaRotation);
        this.bullet.setFlippedX(true);
        this.addChild(this.bullet);
        this.setPosition(this.fromPos);
    },
    actMove:function (cb) {
        var animFrames = [];
        var str = "";
        for (var i = 0; i < 50; i++) {
            str = this.model+'_'+i+'.png';
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            if (frame){
                animFrames.push(frame);
            }
        }
        var animation = new cc.Animation(animFrames, 1/60);
        this.bullet.runAction(cc.animate(animation).repeatForever());
        var time = cc.pDistance(this.fromPos,this.toPos)/this.speed;
        this.runAction(cc.sequence(cc.moveTo(time,this.toPos), cc.callFunc(function (nodeExecutingAction) {
            this.removeBlt();
            if(cb){
                cb();
            }
        },this)));
        this.schedule(this.checkHurt,10/this.speed);
    },
    removeBlt:function () {
        this.bullet.stopAllActions();
        this.bullet.removeFromParent();
        this.unschedule(this.checkHurt);
        this.removeFromParent();
    },
    checkHurt:function () {
        for(var key in this.enemy){
            if(this.enemy[key]&&this.enemy[key].hp>0){
                var rect = cc.rect(this.enemy[key].x-50,this.enemy[key].y-50,100,100);
                var commander ;
                if(cc.rectContainsPoint(rect,cc.p(this.x,this.y))){
                    for (var obj in GLOBALDATA.commanders){
                        //判断指挥官是否上阵
                        if (GLOBALDATA.commanders[obj].j==1){
                            commander= GLOBALDATA.commanders[obj];
                            break;
                        }
                    }
                    var lv = commander.s[VEHICLECFG[commander.w].commanderskillid];
                    var skill = Helper.findCmdSkillConsume(VEHICLECFG[commander.w].commanderskillid,lv)
                    this.enemy[key].showDmg('normal',skill.data[2], 'jineng');
                    this.removeBlt();
                    break;
                }
            }
        }
    }
});
