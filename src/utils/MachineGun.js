
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 /**
 */
var MachineGun = cc.Layer.extend({
    ctor:function (soldierId) {
        //////////////////////////////
        // 1. super init first
        // cc.log
        this._super();
        this.model = soldierId;
        cc.spriteFrameCache.addSpriteFrames(res[soldierId+'_plist']);
        this.role = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame(this.model+'-ski01_0.png'));
        this.role.setPosition(0,0);
        this.addChild(this.role);
        this.setContentSize(this.role.getContentSize());

        return true;
    },
    actAtk:function () {
        this.role.stopAllActions();
        var self = this;
        var animFrames = [];
        var str = "";
        for (var i = 0; i < 20; i++) {
            str = this.model+'-ski01_'+i+'.png';
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            if (frame){
                animFrames.push(frame);
            }else {
                break;
            }
        }
        var animation = new cc.Animation(animFrames, 0.1);
        this.role.runAction(cc.animate(animation).repeatForever());
    },
    actShow:function () {
        var self = this;
        cc.spriteFrameCache.addSpriteFrames(res.com_start01_plist);
        var effNode = new cc.Sprite();
        this.addChild(effNode,1);
        var animFrames = [];
        var str = "";
        for (var i = 0; i < 50; i++) {
            str = 'com_start01_'+i+'.png';
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            if (frame){
                animFrames.push(frame);
            }
        }
        var animation = new cc.Animation(animFrames, 0.1);
        effNode.runAction(cc.sequence(cc.animate(animation),cc.callFunc(function (node) {
            effNode.removeFromParent();
        },this)));
    },
    actIdle:function () {
        this.role.stopAllActions();
        var animFrames = [];
        var str = "";
        for (var i = 0; i < 20; i++) {
            str = this.model+'-idle01_'+i+'.png';
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            if (frame){
                animFrames.push(frame);
            }else {
                break;
            }
        }
        var animation = new cc.Animation(animFrames, 0.1);
        // 14 frames * 1sec = 14 seconds
        this.role.runAction(cc.animate(animation).repeatForever());
    },
    stopAni:function () {
        this.stopAllActions();
        this.role.stopAllActions();
    },
    setScale:function (val) {
        this.role.setScale(val);
    },
    remove:function () {
        this.removeFromParent(true);
    }
});
