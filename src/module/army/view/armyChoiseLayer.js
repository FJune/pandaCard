
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 /**
 * 打开小伙伴添加伙伴时的士兵展示排序
 */
//士兵上阵层的创建
var armyChoiseLayer = ModalDialog.extend({
    LayerName:"armyChoiseLayer",
    _item:null,
    skillItem:null,
    _skillList:null,
    _intoSoldierArray:[],//包含伙伴上阵和士兵上阵的数组
    luckArray:[],//上阵数组士兵缘分
    soldiersArray:[],//未上阵的士兵数组
    intoSoldierArray:[],//上阵的士兵，包括部队士兵和小伙伴上阵的士兵
    sortSolArray:[],//排序之后的容器数组
    soldierLuckAray:[],//存储士兵能激活缘分个数的对象数组
    sortluckSolderArray:[],//缘分排序后的士兵数组
    luckAttr:{},//记录激活缘分信息，用于伙伴上阵数值的计算
    luckAttrID:[],
    outSoldiers:[],//没突破改造的数组
    //logotype为1代表从添加士兵处进入为2代表从添加小伙伴处进入,3代表更换士兵按钮进入
    ctor:function(pos, logotype){
        this._super();
        //this.LayerName = "armyChoiseLayer";
        //加载士兵上阵层
        this.logotype = logotype;//用于判断是部队的士兵上阵还是伙伴的士兵上阵,1和3是部队的士兵上阵，2是伙伴的士兵上阵
        if(logotype == 1 || logotype == 3){
            this.pos = pos-1;
        }else{
            this.pos = pos;
        }


        return true;
    },

    onEnter:function(){
        this._super();

    },

    initUI:function(){
        this.uiArmyChoiseLayer = ccs.load(res.uiArmyChoiseLayer).node;
        this.addChild(this.uiArmyChoiseLayer);

        this._skillList = ccui.helper.seekWidgetByName(this.uiArmyChoiseLayer, 'armyChoiseList');
        var root = ccs.load(res.uiIntoBattleLayer);
        this.skillItem = ccui.helper.seekWidgetByName(root.node, 'skillItem');

        var goBack = ccui.helper.seekWidgetByName(this.uiArmyChoiseLayer, "btnBack");
        goBack.addTouchEventListener(this.backEvent, this);
        this.initControl();
    },

    initControl:function(){
        //上阵士兵数组
        this.intoSoldierArray.length = 0;
        for(var key in GLOBALDATA.army.battle){
            if(GLOBALDATA.army.battle[key] != 0 && GLOBALDATA.army.battle[key] != -1){
                this.intoSoldierArray.push(GLOBALDATA.army.battle[key]);
            }
        }
        //this._intoSoldierArray数组没有初始化为0，不知道会不会出现叠加元素的事情
        this._intoSoldierArray = this.intoSoldierArray.concat();//包含上陣士兵和上陣小伙伴的數組
        for(var key in GLOBALDATA.army.companion[key] > 0){
            this._intoSoldierArray.push( GLOBALDATA.army.companion[key]);
        }

        //未上阵士兵数组
        this.soldiersArray.length = 0;
        for(var key in GLOBALDATA.soldiers){
            if(GLOBALDATA.soldiers[key].j == 0){
                this.soldiersArray.push(parseInt(key));
            }
        }

        this.outSoldiers = [];
        this.outSoldiers = this.outSoldiers.concat(this.soldiersArray);

        if(this.soldiersArray != 0){
            //未上阵士兵数组改造和突破的判断
            for(var i=0;i<this.soldiersArray.length;i++){
                var tsolid = this.soldiersArray[i];
                var soldier = GLOBALDATA.soldiers[this.soldiersArray[i]];
                if(soldier.m > 0){
                    var qhero = Helper.findHeroById(tsolid);
                    tsolid = qhero.breakid || tsolid;
                }
                if(soldier.sq == 10){
                    var reformAtt = Helper.findHeroById(tsolid);
                    tsolid = reformAtt.reform || tsolid;
                }
                this.soldiersArray[i] = tsolid;
            }

            //根据品质把未上陣的士兵进行排序
            for(var i=0;i<this.soldiersArray.length-1;i++){
                for(var j=0;j<this.soldiersArray.length-1-i;j++){
                    if(ITEMCFG[this.soldiersArray[j]].quality < ITEMCFG[this.soldiersArray[j+1]].quality){
                        var temp = this.soldiersArray[j];
                        this.soldiersArray[j] = this.soldiersArray[j+1];
                        this.soldiersArray[j+1] = temp;
                        var outsolTemp = this.outSoldiers[j];
                        this.outSoldiers[j] = this.outSoldiers[j+1];
                        this.outSoldiers[j+1] = outsolTemp;
                    }
                }
            }
            //计算上陣的士兵和小夥伴激活了幾個緣分
            var sumluckNum = 0;
            for(var i=0;i<this.intoSoldierArray.length;i++){
                for(var key in ARMYRELATIONCFG){
                    if(this.intoSoldierArray[i] == ARMYRELATIONCFG[key].armyid ){
                        var luckSoldierArray = ARMYRELATIONCFG[key].relation_armyvalue.concat();
                        if(ITEMCFG[luckSoldierArray[0]].maintype == 2){
                            var soldierNum = 0;//计算士兵的个数是否达到缘分开启的士兵个数
                            for (var k = 0; k < luckSoldierArray.length; k++){
                                if (this._intoSoldierArray.indexOf(luckSoldierArray[k]) == -1){
                                    break;
                                }else{
                                    soldierNum++;//判断缘分数组里的士兵是否全在上阵士兵里
                                }
                                if (soldierNum == luckSoldierArray.length) {
                                    sumluckNum++;//本士兵数组可以激活缘分的个数
                                }
                            }
                        }else{
                            break;
                        }
                    }
                }
            }

            //创建士兵对应的能激活的缘分个数的数组
            this.luckArray.length = 0;
            this.luckAttr = {};
            for(var i=0;i<this.outSoldiers.length;i++){//soldiersArray是未上阵士兵，intoSoldierArray是上阵士兵
                var luckNum = 0;//计算本士兵可以开启几个缘分
                var readySol = this.outSoldiers[i];
                if(this.logotype == 1){
                    this.intoSoldierArray.push(parseInt(this.outSoldiers[i]));
                    this._intoSoldierArray.push(parseInt(this.outSoldiers[i]));
                    this.outSoldiers.splice(i, 1);//删除相应的士兵
                }else if(this.logotype == 2){
                    this._intoSoldierArray.push(parseInt(this.outSoldiers[i]));
                    this.outSoldiers.splice(i, 1);//删除相应的士兵
                }else if(this.logotype == 3){
                    this.intoSoldierArray[this.pos] = this.outSoldiers[i];
                    this._intoSoldierArray.length = 0;
                    this._intoSoldierArray = this.intoSoldierArray.concat();//包含小伙伴上阵的士兵
                    for(var key in GLOBALDATA.army.companion[key] > 0){
                        this._intoSoldierArray.push( GLOBALDATA.army.companion[key]);
                    }
                }
                this.luckAttrID = [];
                for(var j=0;j<this.intoSoldierArray.length;j++){
                    for(var key in ARMYRELATIONCFG){
                        if(this.intoSoldierArray[j] == ARMYRELATIONCFG[key].armyid ){
                            var luckSoldierArray = ARMYRELATIONCFG[key].relation_armyvalue.concat();
                            if(ITEMCFG[luckSoldierArray[0]].maintype == 2){
                                var soldierNum = 0;//计算士兵的个数是否达到缘分开启的士兵个数
                                for (var k = 0; k < luckSoldierArray.length; k++){
                                    if (this._intoSoldierArray.indexOf(luckSoldierArray[k]) == -1){
                                        break;
                                    }else{
                                        soldierNum++;//判断缘分数组里的士兵是否全在上阵士兵里
                                    }
                                    if (soldierNum == luckSoldierArray.length) {
                                        luckNum++;//缘分的个数
                                        if(luckSoldierArray.indexOf(readySol) != -1){
                                            this.luckAttrID.push(key);
                                        }
                                        //this.luckAttr[readySol] = ARMYRELATIONCFG[key].id;
                                    }
                                }
                            }else{
                                break;
                            }
                        }
                    }
                }

                if(this.logotype == 1){
                    this.outSoldiers.splice(i, 0, readySol);//把上阵的士兵再添加回来
                    this.intoSoldierArray.pop();
                    this._intoSoldierArray.pop();
                }else if(this.logotype == 2){
                    this.outSoldiers.splice(i, 0, readySol);//把上阵的士兵再添加回来
                    this._intoSoldierArray.pop();
                }
                if(luckNum - sumluckNum <= 0){
                    this.luckArray.push(0);
                }else{
                    this.luckAttr[readySol] = this.luckAttrID;
                    this.luckArray.push(luckNum - sumluckNum);//士兵缘分数组
                }
            }


            //在品质的基础上根据缘分进行排序
            this.sortSolArray.length = 0;
            this.soldierLuckAray.length = 0;
            for(var i=0;i<this.soldiersArray.length;i++){
                var qualityArray = [];//相同品质的士兵数组
                var qualuckArray = [];//同品质的缘分数组
                var num = HEROCFG[this.soldiersArray[i].toString()].armyquality;
                for(var j=i;j<this.soldiersArray.length;j++){
                    if(HEROCFG[this.soldiersArray[j].toString()].armyquality == num){
                        qualityArray.push(this.soldiersArray[j]);
                        qualuckArray.push(this.luckArray[j]);
                    }else{
                        //明天在这个位置对同品质的士兵缘分进行排序
                        for(var x=0;x<qualityArray.length-1;x++){
                            for(var y=0; y<qualityArray.length-1-x;y++){
                                if(qualuckArray[y] < qualuckArray[y+1]){
                                    var quaTemp = qualityArray [y];
                                    qualityArray[y] = qualityArray[y+1];
                                    qualityArray[y+1] = quaTemp;
                                    var luckTemp = qualuckArray[y];
                                    qualuckArray[y] = qualuckArray[y+1];
                                    qualuckArray[y+1] = luckTemp;
                                }
                            }
                        }
                        i=j-1;
                        var _qualityArray = [];
                        _qualityArray = this.sortluck(qualityArray, qualuckArray).concat();
                        this.sortSolArray.push.apply(this.sortSolArray, _qualityArray);//用另一对象替换当前对象
                        this.soldierLuckAray.push.apply(this.soldierLuckAray, qualuckArray);
                        break;
                    }
                }
                if(this.soldiersArray.length == j){//如果品质数组里的缘分全部相同则跳出该循环
                    break;
                }
            }

            if(qualityArray.length == 1){
                var _qualityArray = this.sortluck(qualityArray, qualuckArray).concat();
                this.sortSolArray.push.apply(this.sortSolArray, _qualityArray);
                this.soldierLuckAray.push.apply(this.soldierLuckAray, qualuckArray);
            }else{
                for(var x=0;x<qualityArray.length-1;x++){
                    for(var y=0; y<qualityArray.length-1-x;y++){
                        if(qualuckArray[y] < qualuckArray[y+1]){
                            var quaTemp = qualityArray [y];
                            qualityArray[y] = qualityArray[y+1];
                            qualityArray[y+1] = quaTemp;
                            var luckTemp = qualuckArray[y];
                            qualuckArray[y] = qualuckArray[y+1];
                            qualuckArray[y+1] = luckTemp;
                        }
                    }
                }
                var _qualityArray = this.sortluck(qualityArray, qualuckArray).concat();
                this.sortSolArray.push.apply(this.sortSolArray, _qualityArray);
                this.soldierLuckAray.push.apply(this.soldierLuckAray, qualuckArray);
            }

            this._skillList.removeAllItems();
            for(var i=0;i<this.sortSolArray.length;i++){
                var _item = this.skillItem.clone();
                this._skillList.pushBackCustomItem(_item);
                var _solAttribute = Helper.findHeroById(this.sortSolArray[i]);
                var solAttribute = Helper.findItemId(this.sortSolArray[i]);
                //士兵头像的获取
                var solImage = ccui.helper.seekWidgetByName(_item, "solBg");
                Helper.LoadFrameImageWithPlist(solImage, solAttribute.quality);
                var iSolHead = cc.spriteFrameCache.getSpriteFrame(ITEMCFG[this.sortSolArray[i]].icon);
                var sprite = new cc.Sprite(iSolHead);
                sprite.setPosition(solImage.getContentSize().width/2, solImage.getContentSize().height / 2);
                sprite.setScale(0.8);
                solImage.addChild(sprite);

                //士兵名称的获取
                if(_solAttribute.initid > 0){
                    if(GLOBALDATA.soldiers[_solAttribute.initid].q > 0){
                        var mastername = ccui.helper.seekWidgetByName(_item, "soldierName");
                        mastername.setString(solAttribute.itemname + " +" + GLOBALDATA.soldiers[solAttribute.itemid].q);
                    }else{
                        var mastername = ccui.helper.seekWidgetByName(_item, "soldierName");
                        mastername.setString(solAttribute.itemname);
                    }
                }else{
                    if(GLOBALDATA.soldiers[solAttribute.itemid].q > 0){
                        var mastername = ccui.helper.seekWidgetByName(_item, "soldierName");
                        mastername.setString(solAttribute.itemname + " +" + GLOBALDATA.soldiers[solAttribute.itemid].q);
                    }else{
                        var mastername = ccui.helper.seekWidgetByName(_item, "soldierName");
                        mastername.setString(solAttribute.itemname);
                    }
                }
                /*if(GLOBALDATA.soldiers[solAttribute.itemid].q > 0){
                    var mastername = ccui.helper.seekWidgetByName(_item, "soldierName");
                    mastername.setString(solAttribute.itemname + " +" + GLOBALDATA.soldiers[solAttribute.itemid].q);
                }else{
                    var mastername = ccui.helper.seekWidgetByName(_item, "soldierName");
                    mastername.setString(solAttribute.itemname);
                }*/

                Helper.setNamecolorByQuality(mastername,solAttribute.quality);  //物品名字按品质设置颜色
                var solRank = ccui.helper.seekWidgetByName(_item, "rank");
                var armyNum = ccui.helper.seekWidgetByName(_item, "armyNum");//数量
                if(_solAttribute.initid == 0 || _solAttribute.initid == null){
                    solRank.setString(GLOBALDATA.soldiers[this.sortSolArray[i]].l);
                    armyNum.setString(STRINGCFG[100044].string+":" + GLOBALDATA.soldiers[this.sortSolArray[i]].n);//100044 数量
                }else{
                    solRank.setString(GLOBALDATA.soldiers[_solAttribute.initid].l);
                    armyNum.setString(STRINGCFG[100044].string+":" + GLOBALDATA.soldiers[_solAttribute.initid].n);//100044 数量
                }

                var solAptitude = ccui.helper.seekWidgetByName(_item, "aptitude");//品质
                solAptitude.setString(_solAttribute.intelligence);
                var luck = ccui.helper.seekWidgetByName(_item, "luck");//缘分加成
                var Icon = ccui.helper.seekWidgetByName(_item, "Icon");
                var attrCfg = HEROCFG[this.sortSolArray[i]];
                Icon.loadTexture(StringFormat("common/i/i_039_$1.png", attrCfg.armytype), ccui.Widget.PLIST_TEXTURE);
                if(this.soldierLuckAray[i] > 0){
                    luck.setVisible(true);
                    luck.setString(STRINGCFG[100043].string+"+"+this.soldierLuckAray[i]);  //100043 可激活缘分
                }else{
                    luck.setVisible(false);
                }
                var intoBtn = ccui.helper.seekWidgetByName(_item, "intoButton");//上阵按钮
                if(_solAttribute.initid == 0 || _solAttribute.initid == null){
                    intoBtn.setTag(this.sortSolArray[i]);
                }else{
                    intoBtn.setTag(_solAttribute.initid);
                }
                intoBtn.setUserData("guid_armyChoiseList_intoButton"+i);
                intoBtn.addTouchEventListener(this.intoEvent, this);
                var solHead = ccui.helper.seekWidgetByName(_item, "solBg");//头像
                solHead.setTag(this.sortSolArray[i]);
                solHead.addTouchEventListener(this.solHeadEvent, this);
            }
        }
    },

    //同品质，同缘分根据等级进行排序
    sortluck:function(qualityArray, qualuckArray){
        this.sortluckSolderArray.length = 0;
        for(var i=0;i<qualuckArray.length;i++){
            var sameLuckArray = [];//同缘分数组
            var sameLuckSolArray = [];//同缘分士兵数组
            var luck = qualuckArray[i];
            for(var j=i;j<qualuckArray.length;j++){
                if(qualuckArray[j] == luck){
                    sameLuckArray.push(qualuckArray[j]);
                    sameLuckSolArray.push(qualityArray[j]);

                }else{
                        for(var x=0;x<sameLuckArray.length-1;x++){
                            for(var y=0;y<sameLuckArray.length-1-x;y++){
                                if(HEROCFG[sameLuckSolArray[y]].initid > 0){
                                    var soldierId1 = HEROCFG[sameLuckSolArray[y]].initid;
                                }else{
                                    var soldierId1 = sameLuckSolArray[y]
                                }
                                if(HEROCFG[sameLuckSolArray[y+1]].initid > 0){
                                    var soldierId2 = HEROCFG[sameLuckSolArray[y+1]].initid;
                                }else{
                                    var soldierId2 = sameLuckSolArray[y+1]
                                }
                                if(GLOBALDATA.soldiers[soldierId1].l < GLOBALDATA.soldiers[soldierId2].l){
                                    var luckTemp = sameLuckSolArray[y];
                                    sameLuckSolArray[y]=sameLuckSolArray[y+1];
                                    sameLuckSolArray[y+1]=luckTemp;
                                }
                            }
                        }
                    i=j-1;
                    this.sortluckSolderArray.push.apply(this.sortluckSolderArray, sameLuckSolArray);
                    break;
                }
            }
            if(qualuckArray.length == j){//如果qualuckArray数组里的属性全部相同则跳出本循环
                break;
            }
        }

        if(sameLuckArray.length == 1){
            this.sortluckSolderArray.push.apply(this.sortluckSolderArray, sameLuckSolArray);
            return this.sortluckSolderArray;
        }else{
            for(var x=0;x<sameLuckArray.length-1;x++){
                for(var y=0;y<sameLuckArray.length-1-x;y++){
                    if(HEROCFG[sameLuckSolArray[y]].initid > 0){
                        var soldierId1 = HEROCFG[sameLuckSolArray[y]].initid;
                    }else{
                        var soldierId1 = sameLuckSolArray[y]
                    }
                    if(HEROCFG[sameLuckSolArray[y+1]].initid > 0){
                        var soldierId2 = HEROCFG[sameLuckSolArray[y+1]].initid;
                    }else{
                        var soldierId2 = sameLuckSolArray[y+1]
                    }
                    if(GLOBALDATA.soldiers[soldierId1].l < GLOBALDATA.soldiers[soldierId2].l){
                        var luckTemp = sameLuckSolArray[y];
                        sameLuckSolArray[y]=sameLuckSolArray[y+1];
                        sameLuckSolArray[y+1]=luckTemp;
                    }
                }
            }
            this.sortluckSolderArray.push.apply(this.sortluckSolderArray, sameLuckSolArray);
            return this.sortluckSolderArray;
        }
    },

    intoEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED == type){
            if(this.logotype == 1 || this.logotype == 3){
                var solValue = parseInt(sender.getTag());
                cc.log(solValue);
                armyModel.changeBattle(solValue, this.pos+1);
            }else if(this.logotype == 2){
                var solValue = parseInt(sender.getTag());
                armyModel.partnerAdd(solValue, this.pos+1);

                if(this.luckAttr.hasOwnProperty(solValue.toString())){
                    var addAttrEvn = new cc.EventCustom('upParentData');
                    addAttrEvn.setUserData(this.luckAttr[solValue]);
                    cc.eventManager.dispatchEvent(addAttrEvn);
                }
            }
        }
    },

    solHeadEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED == type){
            var solValue = sender.getTag();
            cc.log(solValue);
            var armyAttributeLayer = new armyAttriLayer(solValue,1);
            this.addChild(armyAttributeLayer, 30);
        }
    },

    backEvent:function(sender, type){
        switch (type){
            case ccui.Widget.TOUCH_ENDED:
                this.removeFromParent(true);
                break;
            default:
                break;
        }
    },

    onExit:function () {
        this._super();
        cc.log('armyChoiseLayer onExit');
    }

    //*************************************************************************************************

});