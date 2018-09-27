
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 /**
 */
var Helper ={
    //根据id查找士兵
    findHeroById:function (id) {
        return HEROCFG[id];
    },

    findMonsterById:function (id) {
        return MONSTERCFG[id];
    },

    findCommanderById:function (id) {
        return COMMANDERCFG[id];
    },

    findSkillById:function (id) {
        return SKILLCFG[id];
    },
    findCmdRankById:function (id) {
        return COMMANDERRANKCFG[id];
    },
    findArmyRankById:function (id) {
        return ARMYRANKCFG[id];
    },
    findLvCfgByLv:function (id) {
        return UPGRADECFG[id];
    },
    findHeroPromoteById:function(id) {
        var list = [];
        for (var key in ARMYPROMOTECFG){
            if(ARMYPROMOTECFG[key].armyid == id){
                list[ARMYPROMOTECFG[key].promotelv] = ARMYPROMOTECFG[key];
            }
        }
        return list;
    },
    findArmyPmt:function (armyid,lv) {

        for (var key in ARMYPROMOTECFG){
            if(ARMYPROMOTECFG[key].promotelv == lv&&ARMYPROMOTECFG[key].armyid == armyid){
                return ARMYPROMOTECFG[key];
            }
        }
        return null;
    },
    findEqById:function (id) {
        return EQUIPSHUXINGCFG[id];
    },
    findItemId:function (id) {
        return ITEMCFG[id];
    },
    findArmyBreakById:function (id) {
        return ARMYBREAKCFG[id];
    },
    findArmyAwake:function(id){
        return ARMYAWAKECFG[id];
    },
    findHeroReformById:function(id) {
        var list = [];
        for (var key in ARMYREFORMCFG){
            if(ARMYREFORMCFG[key].armyid == id){
                list[ARMYREFORMCFG[key].reformtimes] = ARMYREFORMCFG[key];
            }
        }
        return list;
    },
    findArmyReform:function (armyid,reformtimes) {

        for (var key in ARMYREFORMCFG){
            if(ARMYREFORMCFG[key].reformtimes == reformtimes && ARMYREFORMCFG[key].armyid == armyid){
                return ARMYREFORMCFG[key];
            }
        }
        return null;
    },
    findAccJinglian:function(accid,lv){
        for (var key in ACCJINGLIANCFG){
            if(ACCJINGLIANCFG[key].accid == accid && ACCJINGLIANCFG[key].level == lv){
                return ACCJINGLIANCFG[key];
            }
        }
        return null;
    },
    getStageTotalLevel:function (stage) {

    },
    formatNum:function (num) {
        var afterNum ;
        if(num>=100000000){
            afterNum = (num/100000000).toFixed(2)+'亿';
        }else if(num>=10000){
            afterNum = (num/10000).toFixed(2)+'万';
        }else{
            afterNum = num;
        }
        return afterNum;
    },
    formatNumFloor:function(num){
        var afterNum ;
        if(num>=100000000){
            afterNum = Math.floor(num/100000000)+'亿';
        }else if(num>=10000){
            afterNum = Math.floor(num/10000)+'万';
        }else{
            afterNum = num;
        }
        return afterNum;
    },
    //判断物品是否达到上限  参数1：物品id  参数2：增加的数量
    //返回值  true将会超过上限 false不会超过上限
    isItemReachLimit:function (id,num) {
        var thingAtt = this.findItemId(id);
        if(thingAtt != null){
            if(thingAtt.limitnum != 0 && thingAtt.limitnum != -1){  //-1为无限 0为不可叠加
                var nowNum = GLOBALDATA.knapsack[id];
                if(nowNum != null && nowNum+num > thingAtt.limitnum){
                    return true;
                }
            }
        }
        return false;
    },
    //获取物品的原始库存数量(不包含突破，升级之后的，不包含上阵和装备的)
    getItemNum:function(id){
        var num = 0;
        if(id == 1){  //金币
            num = GLOBALDATA.base.money;
        }else if(id == 2){  //钻石
            num = GLOBALDATA.base.diamond;
        }else{
            var itemConfig = this.findItemId(id) || {};
            if (itemConfig.maintype ==  1){ //虚拟物品
                 num = GLOBALDATA.virtual[id] || 0;
            }else if(itemConfig.maintype == 2){  //士兵
                var soldier = GLOBALDATA.soldiers[id];
                if(soldier != null){
                    if (soldier.j == 1){  //上阵
                        num = soldier.n - 1;   //数量(去除掉已经上阵的那个)
                    }
                    if(soldier.j == 0){  //没有上阵
                        //等级为1 进化等级为0
                        if(soldier.l == 1 && soldier.q == 0){  //全部是初始兵
                            num = soldier.n;
                        }else{  //有不是初始兵的
                            num = soldier.n - 1;   //数量(去除掉不是初始的那个)
                        }
                    }
                }
            }else if(itemConfig.maintype == 4){  //装备
                for(var key in GLOBALDATA.depot){
                    if(GLOBALDATA.depot[key].p == id){
                        var equipAttr = Helper.findEqById(GLOBALDATA.depot[key].p);
                        //没有装备的装备  强化等级为1 精炼等级为0 锻造等级为0
                        if(equipAttr != null && (equipAttr.type == 3 || equipAttr.type == 4 || equipAttr.type == 5 || equipAttr.type == 6)
                            && GLOBALDATA.depot[key].u == 0 && GLOBALDATA.depot[key].s == 1 && GLOBALDATA.depot[key].r == 0 && GLOBALDATA.depot[key].d == 0) {
                            num++;
                        }
                    }
                }
            }else if(itemConfig.maintype == 5){  //宝物
                for(var key in GLOBALDATA.depot){
                    if(GLOBALDATA.depot[key].p == id){
                        var equipAttr = Helper.findEqById(GLOBALDATA.depot[key].p);
                        //没有装备的宝物  强化等级为1 精炼等级为0 锻造等级为0
                        if(equipAttr != null && (equipAttr.type == 1 || equipAttr.type == 2)
                            && GLOBALDATA.depot[key].u == 0 && GLOBALDATA.depot[key].s == 1 && GLOBALDATA.depot[key].r == 0 && GLOBALDATA.depot[key].d == 0) {
                            num++;
                        }
                    }
                }
            }else{
                num = GLOBALDATA.knapsack[id] || 0;
            }
        }
        return num;
    },
    //获取服务器时间
    getServerTime:function(){
        var nowTime = Date.parse(new Date())/1000;
        return (nowTime - GLOBALDATA.localTime) + GLOBALDATA.serverTime;
    },
    formatDate:function (time,type) {
        Date.prototype.format = function(format) {
            var date = {
                "M+": this.getMonth() + 1,
                "d+": this.getDate(),
                "h+": this.getHours(),
                "m+": this.getMinutes(),
                "s+": this.getSeconds(),
                "q+": Math.floor((this.getMonth() + 3) / 3),
                "S+": this.getMilliseconds()
            };
            if (/(y+)/i.test(format)) {
                format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
            }
            for (var k in date) {
                if (new RegExp("(" + k + ")").test(format)) {
                    format = format.replace(RegExp.$1, RegExp.$1.length == 1
                        ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
                }
            }
            return format;
        }
        if(type ==1){
            return time.format('yyyy-MM-dd h:m:s');
        }else if(type == 2){
            return time.format('h:m:s');
        }else if(type == 3){
            return time.format('hh:mm');
        }else if(type == 4){
            return time.format('yyyy-MM-dd hh:mm:ss');
        }
    },
    formatTime:function(seconds){
        var str = ((seconds < 36000) ? "0" : "") + Math.floor(seconds / 3600) + ':';

        var m = seconds % 3600;

        str = str + ((m < 600) ? "0" : "") + Math.floor(m / 60) + ':';

        m = seconds % 60;

        str = str + ((m < 10) ? "0" : "") +  m;

        return str;
    },
    formatOfflineTime:function (seconds) {
        var str = "离线: ";
        var day = Math.floor(seconds / (3600*24));
        if(day>=1){
            str = str+day+"天";
        }else{
            var h = Math.floor(seconds / 3600);
            if(h>=1){
                str = str+h+"小时";
            }else{
                var m = Math.floor(seconds / 60);
                if(m>=1){
                    str = str+m+"分钟";
                }else{
                    str = str+"未满一分钟";
                }
            }
        }
        return str;
    },
    formatMinutes:function (minutes) {
        var str = "";
        if(minutes>=60){
            str = Math.floor(minutes/60)+'小时';
        }

        if(minutes % 60 > 0){
            str = str + (minutes % 60) + '分钟';
        }

        return str;
    },
    //计算属性差值  before以前的属性  after之后的属性
    CalcDiff:function(before,after){
        var result = null;
        if(!isNaN(before) && !isNaN(after)){
            result = after - before;
        }else if(before.indexOf("%") != -1){
            before.replace("%","");
            after.replace("%","");
            var cha = parseFloat(after)-parseFloat(before);
            result = ( Math.round(cha*100)/100 )+"%";
        }
        return result;
    },
    //物品名字按品质颜色设置的方法
    setNamecolorByQuality:function(text,quality){
        if(text != undefined && quality != undefined){
            switch (quality) {
                case 1:  //品质1 白色
                    text.setColor(cc.color(255,255,255));
                    break;
                case 2:  //品质2 绿色
                    text.setColor(cc.color(0,255,0));
                    break;
                case 3:  //品质3 蓝色
                    text.setColor(cc.color(0,255,246));
                    break;
                case 4:  //品质4 紫色
                    text.setColor(cc.color(228,0,255));
                    break;
                case 5:  //品质5 橙色
                    text.setColor(cc.color(255,126,0));
                    break;
                case 6:  //品质6 红色
                    text.setColor(cc.color(255,0,0));
                    break;
                default:
                    text.setColor(cc.color(255,255,255));
                    break;
            }
        }
    },
    //品质边框  参数：ImageView 品质
    LoadFrameImageWithPlist:function (image_frame,quality) {
        if(quality != undefined){
            image_frame.setVisible(true);
            image_frame.loadTexture("common/c/c_037_"+quality+".png", ccui.Widget.PLIST_TEXTURE);
        }
    },
    //icon 参数：ImageView  物品class
    LoadIcoImageWithPlist:function (image_ico,thing) {
        if(thing != undefined){
            image_ico.setVisible(true);
            if(thing.maintype == 2 || thing.maintype == 3){  //2为士兵 3为士兵碎片
                cc.spriteFrameCache.addSpriteFrames(res.heroicon_plist);
            }else if(thing.maintype == 4 || thing.maintype == 8){  //4为装备 8为装备碎片
                cc.spriteFrameCache.addSpriteFrames(res.ico_equ_plist);
            }else if(thing.maintype == 5 || thing.maintype == 9){  //5为配饰  9为配饰碎片
                cc.spriteFrameCache.addSpriteFrames(res.ico_acy_plist);
            }else{
                cc.spriteFrameCache.addSpriteFrames(res.ico_item_plist);
            }
            if(cc.spriteFrameCache.getSpriteFrame(thing.icon)){
                image_ico.loadTexture(thing.icon, ccui.Widget.PLIST_TEXTURE);
            }else{
                cc.spriteFrameCache.addSpriteFrames(res.ico_item_plist);
                image_ico.loadTexture("item_01.png", ccui.Widget.PLIST_TEXTURE);
            }
        }
    },
    //物品 参数：icon 品质边框 碎片框 物品class
    LoadIconFrameAndAddClick:function (image_ico,image_frame,Image_pieces,thing) {
        if(image_ico != undefined && thing != null){
            this.LoadIcoImageWithPlist(image_ico,thing);
        }
        if(image_frame != undefined && thing != null){
            this.LoadFrameImageWithPlist(image_frame,thing.quality);
        }
        if(Image_pieces != undefined && thing != null){
            var maintype = thing.maintype;
            if(maintype == 3 || maintype == 8 || maintype == 9){ //3为士兵碎片 8为装备碎片 9为配饰碎片
                Image_pieces.setVisible(true)
            }else{
                Image_pieces.setVisible(false)
            }
        }
    },

    //取得vip表里对应的功能次数
    getVipNumberByUneed:function(viplv,type){
        //1 侦查次数上限 2 兵工厂最大挑战次数 3 军神争霸挑战次数上限 4 可购买军团跨服boss挑战次数上限 5 每日购买跨服比武挑战次数 6 每日可快速战斗次数
        //7 侦查次数可购买上限 8 金币最大兑换次数 9 士兵商店最大刷新次数 10 每日可刷新觉醒商店次数 11 每日可刷新图鉴商店次数 12 每日可购买boss入侵挑战入场卷次数
        //13 每日可重置最强兵王次数 14 每日可购买兵工厂门票次数 15 每日可重置竞技场次数 16 军团副本挑战次数购买上限
        var need_num = null;
        if(VIPCFG[viplv] == null){
            return need_num;
        }
        if(viplv<=15){
            if(type==1){
                need_num =  VIPCFG[viplv].spirit_max;
            }else if(type == 2){
                need_num =  VIPCFG[viplv].arsen_max_n_num;
            }else if(type == 3){
                need_num =  VIPCFG[viplv].battle_max;
            }else if(type==4){
                need_num =  VIPCFG[viplv].buylegionboss_num;
            }else if(type == 5){
                need_num =  VIPCFG[viplv].buyserbat_unm;
            }else if(type==6){
                need_num =  VIPCFG[viplv].quickbattle_num;
            }else if(type == 7){
                need_num =  VIPCFG[viplv].buyspirit_num;
            }else if(type==8){
                need_num =  VIPCFG[viplv].buygold_num;
            }else if(type==9){
                need_num =  VIPCFG[viplv].heroshop_max_r_num;
            }else if(type == 10){
                need_num =  VIPCFG[viplv].awakeshop_num;
            }else if(type == 11){
                need_num =  VIPCFG[viplv].pokedexshop_num;
            }else if(type==12){
                need_num =  VIPCFG[viplv].dekaron_num;
            }else if(type==13){
                need_num =  VIPCFG[viplv].bw_num;
            }else if(type==14){
                need_num =  VIPCFG[viplv].arsen_max_b_mum;
            }else if(type==15){
                need_num =  VIPCFG[viplv].arena_num;
            }else if(type==16){
                need_num =  VIPCFG[viplv].dungeons_num;
            }
        }
        return need_num;
    },
    findCmdSkillConsume:function(skillId,lv){
        for (var key in COMDERSKILLCONSUMECFG){
            if(COMDERSKILLCONSUMECFG[key].pos == skillId && COMDERSKILLCONSUMECFG[key].lev == lv){
                return COMDERSKILLCONSUMECFG[key];
            }
        }
        return null;
    },
};