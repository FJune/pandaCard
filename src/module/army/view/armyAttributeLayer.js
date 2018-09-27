
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 /**
 * 士兵属性层的创建
 * 在部队模块，点击相应士兵的图片，显示对应士兵的详细属性
 */

var armyAttriLayer = ModalDialog.extend({
    LayerName:"armyAttriLayer",
    uiArmyAttriLayer:null,
    armyAttribute:null,
    offsetPos:0,

    ctor:function(solId,type,userdata){  //type 1为士兵的正式属性  2为背包界面进来的
        this._super();
        this.solId = solId;
        this.type = type;
        this.userdata = userdata;
        this.heightArray = [];  //高度
        this.offsetArray = [];  //偏移的位置
        this.NodeArray = [];    //节点

    },

    onEnter:function(){
        this._super();
    },
    //初始化ui
    initUI:function () {
        this.customWidget();  //自定义Widget
        this.initArmyUI();
    },
    //自定义Widget
    customWidget:function () {
        var wgtArr = [];
        wgtArr.push("armyAttrList");  //滚动条
        //士兵头像
        wgtArr.push("Panel_base");  //基础属性背景
        wgtArr.push("armyHeadBg");
        wgtArr.push("armyIcon");
        wgtArr.push("armyPieces");
        wgtArr.push("armyName");  //士兵名称
        wgtArr.push("armynameIcon");  //士兵类型
        wgtArr.push("armyLevel");  //士兵等级
        wgtArr.push("armyAptitude");  //士兵资质
        wgtArr.push("armyLife");  //士兵生命
        wgtArr.push("armyAttak");  //士兵攻击
        wgtArr.push("armyDefense");  //士兵防御
        //缘分
        wgtArr.push("Panel_luck");  //缘分背景
        for(var i = 0;i<5;i++){
            wgtArr.push("luckIntro_"+i);
        }
        //技能
        wgtArr.push("Panel_skill");  //技能背景
        wgtArr.push("skillName");  //技能名称
        wgtArr.push("skillIntro");  //技能描述
        //进阶
        wgtArr.push("Panel_break");  //进阶背景
        for(var i = 0;i<15;i++){
            wgtArr.push("break_"+i);
        }
        //觉醒属性
        wgtArr.push("Panel_awdes");  //觉醒属性背景
        wgtArr.push("lifeAdd");  //生命加成
        wgtArr.push("attackAdd");  //攻击加成
        wgtArr.push("defenseAdd");  //防御加成
        //觉醒
        wgtArr.push("Panel_awake");  //觉醒背景
        for(var i = 0;i<6;i++){
            wgtArr.push("awake_"+i);
        }
        //改造
        wgtArr.push("Panel_very");  //改造背景
        for(var i = 0;i<10;i++){
            wgtArr.push("very_"+i);
        }
        //宝物缘分
        wgtArr.push("Panel_box");  //宝物背景
        wgtArr.push("baoText");  //宝物名字
        for(var i=1;i<=3;i++){
            wgtArr.push("effect_"+i);
            wgtArr.push("effectT"+i);
            wgtArr.push("efeectDes_"+i);
            wgtArr.push("efeectKai_"+i);
        }
        wgtArr.push("saveBtn");  //关闭保存按钮




        var uiArmyAttriLayer = ccsTool.load(res.uiArmyAttributeLayer,wgtArr);
        //控件的名字赋值给this变量
        for(var key in uiArmyAttriLayer.wgt){
            this[key] = uiArmyAttriLayer.wgt[key];
        }
        this.addChild(uiArmyAttriLayer.node);
    },
    initArmyUI:function(){
        /*   士兵基础属性    */
        var solId = this.solId;
        var soldier = null;
        if(this.type == 1 || (this.type == 2 && this.userdata.isInit == false)){  //士兵的正式属性
            soldier = GLOBALDATA.soldiers[this.solId];
            if(soldier.m > 0){ //突破过
                var qhero = Helper.findHeroById(solId);
                solId = qhero.breakid || solId;
            }
            if(soldier.sq == 10){  //已经进行了终极改造
                var reformAtt = Helper.findHeroById(solId);
                solId = reformAtt.reform || solId;
            }
        }else if(this.type == 2 && this.userdata.isInit == true){  //背包查看初始
            soldier = this.userdata;
        }
        var ItemAtt = Helper.findItemId(solId);
        var HeroAtt = Helper.findHeroById(solId);
        Helper.LoadIconFrameAndAddClick(this.armyIcon,this.armyHeadBg,this.armyPieces,ItemAtt); //士兵头像
        //士兵名称
        var breakLev = soldier.q;
        //进阶前士兵名称
        if(breakLev == 0){
            this.armyName.setString(ItemAtt.itemname);
        }else{
            this.armyName.setString(ItemAtt.itemname+"+"+breakLev);
        }
        Helper.setNamecolorByQuality(this.armyName,ItemAtt.quality);
        HeroDefault.setHeroTypeImage(this.armynameIcon,HeroAtt.armytype);  //士兵类型
        this.armyLevel.setString(STRINGCFG[100031].string + "：" + soldier.l);   //100031 等级  //士兵等级
        this.armyAptitude.setString(STRINGCFG[100034].string + "：" + HeroAtt.intelligence);  //100034	资质 //士兵资质
        if(this.type == 1 || (this.type == 2 && this.userdata.isInit == false)) {  //士兵的正式属性
            var equlist = [];
            for (var idx = 0; idx < GLOBALDATA.army.battle.length; idx++)
            {
                if (solId == GLOBALDATA.army.battle[idx])
                {
                    equlist = GLOBALDATA.army.equips[idx];
                    break;
                }
            }
            var depotData = GLOBALDATA.depot;
            var commanderData = GLOBALDATA.commanders[GLOBALDATA.army.commander];
            var teamlist = GLOBALDATA.army.battle.concat(GLOBALDATA.army.companion);
            var attr = new heroAttr(soldier.p, soldier.l, soldier.q, soldier.m, soldier.w, soldier.sq, soldier.eq, equlist, depotData, commanderData, teamlist);

            this.armyLife.setString(STRINGCFG[100032].string + "：" + attr.getHp());  //100032 生命   //士兵生命
            this.armyAttak.setString(STRINGCFG[100035].string + "：" + attr.getAtk());  //100035 攻击  //士兵攻击
            this.armyDefense.setString(STRINGCFG[100033].string + "：" + attr.getDef());  //100033 防御  //士兵防御
        }else if(this.type == 2 && this.userdata.isInit == true){  //背包查看初始
            this.armyLife.setString(STRINGCFG[100032].string + "：" + HeroAtt.base[0][2]);  //100032 生命   //士兵生命
            this.armyAttak.setString(STRINGCFG[100035].string + "：" + HeroAtt.base[1][2]);  //100035 攻击  //士兵攻击
            this.armyDefense.setString(STRINGCFG[100033].string + "：" + HeroAtt.base[2][2]);  //100033 防御  //士兵防御
        }
        //基础属性背景
        this.NodeArray.push(this.Panel_base);
        var pSize = this.Panel_base.getContentSize();
        this.heightArray.push(pSize.height);
        this.offsetArray.push(0);


        /*     士兵缘分属性        */
        var count = 0;
        var lsOffset = 0;
        var isFind = false;   //已经找到
        for(var key in ARMYRELATIONCFG){
            if(ARMYRELATIONCFG[key].armyid == this.solId){
                var _luck = this["luckIntro_"+count];
                _luck.setString(ARMYRELATIONCFG[key].relation_describe);
                _luck.setColor(cc.color(225,225,225));
                count++;
                isFind = true;
                var tagether = true;  //已经激活了士兵缘分
                var isItem = true;  //已经激活了装备缘分
                var armySolIdArray = ARMYRELATIONCFG[key].relation_armyvalue;
                for(var k=0;k<armySolIdArray.length;k++){
                    if (ITEMCFG[armySolIdArray[k]].maintype == 2 && GLOBALDATA.army.battle.indexOf(armySolIdArray[k]) == -1
                        && GLOBALDATA.army.companion.indexOf(armySolIdArray[k]) == -1) { //2为士兵
                        tagether = false;  //没有相应的士兵缘分
                        break;
                    }
                    if(ITEMCFG[armySolIdArray[k]].maintype == 4 || ITEMCFG[armySolIdArray[k]].maintype == 5){  //4为装备 5为宝物
                        if(this.type != 1){  //不是正常的查看士兵的不显示激活装备缘分
                            isItem = false;
                            break;
                        }
                        var battlePos = GLOBALDATA.army.battle.indexOf(this.solId);  //士兵对应的位置
                        var equips = GLOBALDATA.army.equips[battlePos];  //士兵身上的装备
                        var isDress = false;  //是否穿戴了
                        for(var key in equips){
                            var equId = equips[key];
                            if(equId != 0 && GLOBALDATA.depot[equId].p == armySolIdArray[k]){
                                isDress = true;
                                break;
                            }
                        }
                        if(isDress == false){  //没有穿戴
                            isItem = false;
                            break;
                        }

                    }
                }
                if (tagether && isItem) {
                    _luck.setColor(cc.color(220, 20, 60));
                }
                //重新设置高度，以及计算偏移高度
                var rsize = _luck.getVirtualRendererSize();
                var csize = _luck.getContentSize();
                var nRow = Math.ceil(rsize.width/csize.width);
                _luck.setContentSize(csize.width,rsize.height*nRow);
                var posY = _luck.getPositionY();
                _luck.setPositionY(posY-lsOffset);
                lsOffset = lsOffset + (rsize.height*nRow-csize.height);
            }else if(isFind){  //当后面的不在是查找的内容的时候
                break;
            }
        }
        for(var j=count;j<5;j++){
            var _luck = this["luckIntro_"+j];
            _luck.setVisible(false);
            //计算偏移高度
            var csize = _luck.getContentSize();
            lsOffset = lsOffset - csize.height;
        }
        //缘分背景
        this.NodeArray.push(this.Panel_luck);
        var pSize = this.Panel_luck.getContentSize();
        this.heightArray.push(pSize.height);
        this.offsetArray.push(lsOffset);

        /*      士兵技能属性       */
        var skArmyId = this.solId;
        var skillId = Helper.findHeroById(skArmyId).skillid;
        if(soldier.m > 0){ //突破过
            var qhero = Helper.findHeroById(skArmyId);
            skArmyId = qhero.breakid || skArmyId;
            var nhero = Helper.findHeroById(skArmyId);
            skillId = nhero.skillid || skillId;
        }
        if(soldier.sq > 0){  //已经进行过改造
            var reformAtt = Helper.findArmyReform(this.solId,soldier.sq);
            skillId = reformAtt.newskillid || skillId;
        }
        var skillDes = Helper.findSkillById(skillId);
        this.skillName.setString("【"+skillDes.skillname+"】");  //技能名称
        this.skillIntro.setString(skillDes.describe);  //技能描述
        //重新设置高度，以及计算偏移高度
        var rsize = this.skillIntro.getVirtualRendererSize();
        var csize = this.skillIntro.getContentSize();
        var nRow = Math.ceil(rsize.width/csize.width);
        this.skillIntro.setContentSize(csize.width,rsize.height*nRow);
        var lsOffset = 0;
        lsOffset = lsOffset + (rsize.height*nRow-csize.height);
        //技能背景
        this.NodeArray.push(this.Panel_skill);
        var pSize = this.Panel_skill.getContentSize();
        this.heightArray.push(pSize.height);
        this.offsetArray.push(lsOffset);

        /*       士兵进阶属性        */
        var count = 1;
        var lsOffset = 0;
        var isFind = false;   //已经找到
        for(var key in ARMYPROMOTECFG){
            if(ARMYPROMOTECFG[key].armyid == this.solId){
                var armyBreakAttrDes = this["break_"+(count-1)];
                var strText = "【"+STRINGCFG[100036].string+count+"】"+ ARMYPROMOTECFG[key].promote_describe;  //100036 进阶
                armyBreakAttrDes.setString(strText);
                if(count<=soldier.q){
                    armyBreakAttrDes.setColor(cc.color(220,20,60));
                }
                count++;
                //重新设置高度，以及计算偏移高度
                var rsize = armyBreakAttrDes.getVirtualRendererSize();
                var csize = armyBreakAttrDes.getContentSize();
                var nRow = Math.ceil(rsize.width/csize.width);
                armyBreakAttrDes.setContentSize(csize.width,rsize.height*nRow);
                var posY = armyBreakAttrDes.getPositionY();
                armyBreakAttrDes.setPositionY(posY-lsOffset);
                lsOffset = lsOffset + (rsize.height*nRow-csize.height);
                isFind = true;
            }else if(isFind){  //当后面的不在是查找的内容的时候
                break;
            }
        }
        for(var j=count-1;j<15;j++){
            var _break = this["break_" + j];
            _break.setVisible(false);
            //计算偏移高度
            var csize = _break.getContentSize();
            lsOffset = lsOffset - csize.height;
        }
        //进阶背景
        this.NodeArray.push(this.Panel_break);
        var pSize = this.Panel_break.getContentSize();
        this.heightArray.push(pSize.height);
        this.offsetArray.push(lsOffset);

        /*      觉醒加成属性       */
        var life = 0;  //生命
        var attack = 0;  //攻击
        var defense = 0;  //防御
        for(var i =1;i<=soldier.w;i++){
            var equcost = Helper.findArmyAwake(i).equcost;
            for(var j = 0;j<equcost.length;j++){
                var attribute = AWAKEMATERIALCFG[equcost[j]].attribute;
                for(var k = 0;k<attribute.length;k++){
                    if(attribute[k][0] == 1 && attribute[k][1] == 1){
                        life = life + attribute[k][2];
                    }else if(attribute[k][0] == 2 && attribute[k][1] == 1){
                        attack = attack + attribute[k][2];
                    }else if(attribute[k][0] == 3 && attribute[k][1] == 1){
                        defense = defense + attribute[k][2];
                    }
                }
            }
        }
        for(var key in soldier.eq){
            if(soldier.eq[key] != 0){
                var attribute = AWAKEMATERIALCFG[soldier.eq[key]].attribute;
                for(var k = 0;k<attribute.length;k++){
                    if(attribute[k][0] == 1 && attribute[k][1] == 1){
                        life = life + attribute[k][2];
                    }else if(attribute[k][0] == 2 && attribute[k][1] == 1){
                        attack = attack + attribute[k][2];
                    }else if(attribute[k][0] == 3 && attribute[k][1] == 1){
                        defense = defense + attribute[k][2];
                    }
                }
            }
        }
        this.lifeAdd.setString(STRINGCFG[100032].string+"+"+ life);  //100032 生命   //生命加成
        this.attackAdd.setString(STRINGCFG[100035].string+"+" + attack);  //100035 攻击  //攻击加成
        this.defenseAdd.setString(STRINGCFG[100033].string+"+" + defense);  //100033 防御  //防御加成
        //觉醒属性背景
        this.NodeArray.push(this.Panel_awdes);
        var pSize = this.Panel_awdes.getContentSize();
        this.heightArray.push(pSize.height);
        this.offsetArray.push(0);

        /*       士兵觉醒属性        */
        var lsOffset = 0;
        for(var i = 0;i<6;i++){
            var awakeItem = this["awake_"+i];
            var str = StringFormat(STRINGCFG[100111].string,[i+1,0]);  //100111	$1星$1阶
            var des = ARMYAWAKECFG[(i+1)*10].des;
            var strText = "【"+str+"】"+ des;
            awakeItem.setString(strText);
            if(i < Math.floor(soldier.w/10)){
                awakeItem.setColor(cc.color(220,20,60));
            }
            //重新设置高度，以及计算偏移高度
            var rsize = awakeItem.getVirtualRendererSize();
            var csize = awakeItem.getContentSize();
            var nRow = Math.ceil(rsize.width/csize.width);
            awakeItem.setContentSize(csize.width,rsize.height*nRow);
            var posY = awakeItem.getPositionY();
            awakeItem.setPositionY(posY-lsOffset);
            lsOffset = lsOffset + (rsize.height*nRow-csize.height);
        }
        //觉醒背景
        this.NodeArray.push(this.Panel_awake);
        var pSize = this.Panel_awake.getContentSize();
        this.heightArray.push(pSize.height);
        this.offsetArray.push(lsOffset);

        //改造
        var reformId = this.solId;
        var qhero = Helper.findHeroById(reformId);
        reformId = qhero.breakid || reformId;
        var reform = Helper.findHeroById(reformId).reform;
        if(reform != null && reform != 0){
            /*       士兵改造属性        */
            var count = 1;
            var lsOffset = 0;
            var isFind = false;   //已经找到
            for(var key in ARMYREFORMCFG){
                if(ARMYREFORMCFG[key].armyid == this.solId){
                    var reformItem = this["very_"+(count-1)];
                    var skilldes = "";
                    if(ARMYREFORMCFG[key].skilldes != null){
                        skilldes = ARMYREFORMCFG[key].skilldes;
                    }
                    var strText = "【"+STRINGCFG[100117].string+count+"】"+ ARMYREFORMCFG[key].updes+","+skilldes;  //100117	改造
                    reformItem.setString(strText);
                    if(count<=soldier.sq){
                        reformItem.setColor(cc.color(220,20,60));
                    }
                    count++;
                    //重新设置高度，以及计算偏移高度
                    var rsize = reformItem.getVirtualRendererSize();
                    var csize = reformItem.getContentSize();
                    var nRow = Math.ceil(rsize.width/csize.width);
                    reformItem.setContentSize(csize.width,rsize.height*nRow);
                    var posY = reformItem.getPositionY();
                    reformItem.setPositionY(posY-lsOffset);
                    lsOffset = lsOffset + (rsize.height*nRow-csize.height);
                    isFind = true;
                }else if(isFind){  //当后面的不在是查找的内容的时候
                    break;
                }
            }
            for(var j=count-1;j<10;j++){
                var reformItem = this["very_" + j];
                reformItem.setVisible(false);
                //计算偏移高度
                var csize = reformItem.getContentSize();
                lsOffset = lsOffset - csize.height;
            }
            //改造背景
            this.NodeArray.push(this.Panel_very);
            var pSize = this.Panel_very.getContentSize();
            this.heightArray.push(pSize.height);
            this.offsetArray.push(lsOffset);
        }else{
            this.Panel_very.setVisible(false);
        }

        //宝物缘分
        var accId = 0;  //缘分宝物的id
        var isFind = false;   //已经找到
        var ConfigArray = [];  //缘分宝物的属性
        for(var key in ACCRELATIONCFG){
            var hero = ACCRELATIONCFG[key].hero;
            if(accId == 0){
                for(var i=0;i<hero.length;i++){
                    if(hero[i] == this.solId){
                        accId = ACCRELATIONCFG[key].accid;
                        break;
                    }
                }
            }
            if(accId != 0){
                if(ACCRELATIONCFG[key].accid == accId){
                    ConfigArray.push(ACCRELATIONCFG[key]);
                    isFind = true;
                }else if(isFind){  //当后面的不在是查找的内容的时候
                    break;
                }
            }
        }
        if(accId != 0){
            /*       宝物缘分属性        */
            //宝物名字
            var itemConfig = Helper.findItemId(accId);
            this.baoText.setString(itemConfig.itemname);
            //对应宝物的等级
            var acclv = 0;
            var armyPos = GLOBALDATA.army.battle.indexOf(this.solId);
            if(this.type == 1){  //正式查看的时候才有宝物缘分的颜色
                if(armyPos != -1){
                    for(var i =0;i<2;i++){
                        var indexId = GLOBALDATA.army.equips[armyPos][i];
                        var eqInfo = GLOBALDATA.depot[indexId];
                        if(eqInfo != null && eqInfo.p == accId){
                            acclv = eqInfo.r;
                            break;
                        }
                    }
                }
            }
            //三个阶段
            for(var i=1;i<=3;i++){
                var Config = ConfigArray[i-1];
                var strText = StringFormat(STRINGCFG[100176].string,Config.level);  //100176	精炼$1阶开启
                this["efeectKai_"+i].setString(strText);
                this["efeectDes_"+i].setString(this.getAttrDes(Config.attr));
                if(acclv >= Config.level){
                    this["effectT"+i].setColor(cc.color(255,255,0));
                    this["effect_"+i].setColor(cc.color(255,255,0));
                    this["efeectKai_"+i].setColor(cc.color(255,255,0));
                    this["efeectDes_"+i].setColor(cc.color(255,255,0));
                }else{
                    this["effectT"+i].setColor(cc.color(255,255,255));
                    this["effect_"+i].setColor(cc.color(255,255,255));
                    this["efeectKai_"+i].setColor(cc.color(255,255,255));
                    this["efeectDes_"+i].setColor(cc.color(255,255,255));
                }
            }
            //宝物缘分背景
            this.NodeArray.push(this.Panel_box);
            var pSize = this.Panel_box.getContentSize();
            this.heightArray.push(pSize.height);
            this.offsetArray.push(0);
        }else{
            this.Panel_box.setVisible(false);
        }

        var tHeight = 0;
        var num = this.heightArray.length;
        for(var i = 0;i<num;i++){
            tHeight = tHeight + this.heightArray[i]+this.offsetArray[i];
        }
        var iSize = this.armyAttrList.getInnerContainerSize();
        this.armyAttrList.setInnerContainerSize(cc.size(iSize.width,tHeight));
        var jian = 0;
        for(var i = 0;i<num;i++){
            jian = jian + this.heightArray[i];
            this.NodeArray[i].setPositionY(tHeight-jian);
            jian = jian + this.offsetArray[i];
        }


        //关闭保存按钮
        this.saveBtn.addTouchEventListener(this.closeEvent, this);
    },
    //属性说明
    getAttrDes:function(arr){
        var formatNum = function (type,val) {
            if(type == 2){
                return (val/100)+'%';
            }
            return val;
        };
        var strText = "";
        for (var i=0;i<arr.length;i++){
            var baseItem = arr[i];
            strText = strText + ATTRIBUTEIDCFG[baseItem[0]].describe;
            strText = strText + "+" + formatNum(baseItem[1],baseItem[2])+"\n";
        }
        return strText;
    },
    closeEvent:function(sender, type){
        switch (type){
            case ccui.Widget.TOUCH_ENDED:
                this.removeFromParent(true);
                break;
            default:
                break;
        }
    },
});