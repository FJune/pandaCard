
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
var luckIntoLayer = ModalDialog.extend({
    LayerName:"luckIntoLayer",
    //_item:null,
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
    ctor:function(pos){
        this._super();
        this.pos = pos;

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

            this.outSoldiers = [];
            this.outSoldiers = this.outSoldiers.concat(this.soldiersArray);

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
                this._intoSoldierArray.push(parseInt(this.outSoldiers[i]));
                this.outSoldiers.splice(i, 1);//删除相应的士兵
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
                this.outSoldiers.splice(i, 0, readySol);//把上阵的士兵再添加回来
                this._intoSoldierArray.pop();
                this.luckAttr[readySol] = this.luckAttrID;
                if(luckNum - sumluckNum <= 0){
                    this.luckArray.push(0)
                }else{
                    this.luckArray.push(luckNum - sumluckNum);//士兵缘分数组
                }
            }

            //根據緣分進行排序，並對士兵進行排序
            for(var i=0;i<this.luckArray.length-1;i++){
                for(var j=0;j<this.luckArray.length-i-1;j++){
                    if(this.luckArray[j]<this.luckArray[j+1]){
                        var lucktemp = this.luckArray[j];
                        this.luckArray[j] = this.luckArray[j+1];
                        this.luckArray[j+1] = lucktemp;
                        var soltemp = this.soldiersArray[j];
                        this.soldiersArray[j] = this.soldiersArray[j+1];
                        this.soldiersArray[j+1] = soltemp;
                    }
                }
            }

            //在緣分的基礎上根據品質進行排序
            this.sortSolArray.length = 0;
            //this.soldierLuckAray.length = 0;
            for(var i=0;i<this.soldiersArray.length;i++){
                var sameLuckSolArray = [];//相同緣分的士兵数组
                var luckNum = this.luckArray[i];
                for(var j=i;j<this.soldiersArray.length;j++){
                    if(this.luckArray[j] == luckNum){
                        sameLuckSolArray.push(this.soldiersArray[j]);
                    }else{
                        //相同緣分的品質進行排序
                        if(sameLuckSolArray.length > 1){
                            for(var x=0;x<sameLuckSolArray.length-1;x++){
                                for(var y=0; y<sameLuckSolArray.length-1-x;y++){
                                    if(ITEMCFG[sameLuckSolArray[y]].quality < ITEMCFG[sameLuckSolArray[y+1]].quality){
                                        var solLuckTemp = sameLuckSolArray [y];
                                        sameLuckSolArray[y] = sameLuckSolArray[y+1];
                                        sameLuckSolArray[y+1] = solLuckTemp;
                                    }
                                }
                            }
                        }
                        i=j-1;
                        if(sameLuckSolArray.length > 1){
                            var sortArray = this.qualitySort(sameLuckSolArray);
                            this.sortSolArray = this.sortSolArray.concat(sortArray);
                        }else{
                            this.sortSolArray = this.sortSolArray.concat(sameLuckSolArray);
                        }
                        break;
                    }
                }
                if(this.soldiersArray.length == j){//如果品质数组里的缘分全部相同则跳出该循环
                    break;
                }
            }

            if(sameLuckSolArray.length > 1){
                for(var x=0;x<sameLuckSolArray.length-1;x++){
                    for(var y=0; y<sameLuckSolArray.length-1-x;y++){
                        if(ITEMCFG[sameLuckSolArray[y]].quality < ITEMCFG[sameLuckSolArray[y+1]].quality){
                            var solTemp = sameLuckSolArray[y];
                            sameLuckSolArray[y] = sameLuckSolArray[y+1];
                            sameLuckSolArray[y+1] = solTemp;
                        }
                    }
                }
                var sortArray = this.qualitySort(sameLuckSolArray);
                this.sortSolArray = this.sortSolArray.concat(sortArray);
            }else{
                this.sortSolArray = this.sortSolArray.concat(sameLuckSolArray);
            }

            //士兵属性的显示
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
                if(this.luckArray[i] > 0){
                    luck.setVisible(true);
                    luck.setString(STRINGCFG[100043].string+"+"+this.luckArray[i]);  //100043 可激活缘分
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

    //品质相同的情况下根据资质进行排列
    qualitySort:function(qualityArray){
        this.sortQulityArray = [];
        //在緣分的基礎上根據品質進行排序
        for(var i=0;i<qualityArray.length;i++){
            var sameIllenSolArray = [];//相同资质的士兵数组
            var quaNum = ITEMCFG[qualityArray[i]].quality;
            for(var j = i;j<qualityArray.length;j++){
                if(ITEMCFG[qualityArray[j]].quality == quaNum){
                    sameIllenSolArray.push(qualityArray[j]);
                }else{
                    //相同緣分的品質進行排序
                    if(sameIllenSolArray.length > 1){
                        for(var x=0;x<sameIllenSolArray.length-1;x++){
                            for(var y=0; y<sameIllenSolArray.length-1-x;y++){
                                if(HEROCFG[sameIllenSolArray[y]].intelligence < HEROCFG[sameIllenSolArray[y+1]].intelligence){
                                    var solLuckTemp = sameIllenSolArray [y];
                                    sameIllenSolArray[y] = sameIllenSolArray[y+1];
                                    sameIllenSolArray[y+1] = solLuckTemp;
                                }
                            }
                        }
                    }
                    i=j-1;
                    if(sameIllenSolArray.length > 1){
                        var sortArray = this.intelligenceSort(sameIllenSolArray);
                        this.sortQulityArray = this.sortQulityArray.concat(sortArray);
                    }else{
                        this.sortQulityArray = this.sortQulityArray.concat(sameIllenSolArray);
                    }
                    break;
                }
            }
            if(qualityArray.length == j){//如果品质数组里的缘分全部相同则跳出该循环
                break;
            }
        }

        if(sameIllenSolArray.length > 1){
            for(var x=0;x<sameIllenSolArray.length-1;x++){
                for(var y=0; y<sameIllenSolArray.length-1-x;y++){
                    if(ITEMCFG[sameIllenSolArray[y]].intelligence < ITEMCFG[sameIllenSolArray[y+1]].intelligence){
                        var solTemp = sameIllenSolArray[y];
                        sameIllenSolArray[y] = sameIllenSolArray[y+1];
                        sameIllenSolArray[y+1] = solTemp;
                    }
                }
            }
            var sortArray = this.intelligenceSort(sameIllenSolArray);
            this.sortQulityArray = this.sortQulityArray.concat(sortArray);
        }else{
            this.sortQulityArray = this.sortQulityArray.concat(sameIllenSolArray);
        }
        return this.sortQulityArray;
    },

    //资质相同的情况下根据等级进行排列
    intelligenceSort:function(illengentArray){
        this.sortIllenArray = [];
        for(var i=0;i<illengentArray.length;i++){
            var sameLevSolArray = [];//相同等级的士兵数组
            if(HEROCFG[illengentArray[i]].initid > 0){
                var soldierId = HEROCFG[illengentArray[i]].initid;
                var levNum = GLOBALDATA.soldiers[HEROCFG[illengentArray[i]].initid];
            }else{
                var soldierId = illengentArray[i];
                var levNum = GLOBALDATA.soldiers[illengentArray[i]];
            }
            for(var j = i;j<illengentArray.length;j++){
                if(GLOBALDATA.soldiers[soldierId] == levNum){
                    sameLevSolArray.push(illengentArray[j]);
                }else{
                    //相同緣分的品質進行排序
                    if(sameLevSolArray.length > 1){
                        for(var x=0;x<sameLevSolArray.length-1;x++){
                            for(var y=0; y<sameLevSolArray.length-1-x;y++){
                                if(HEROCFG[sameLevSolArray[y]].initid > 0){
                                    var soldierId1 = HEROCFG[sameLevSolArray[y]].initid;
                                }else{
                                    var soldierId1 = sameLevSolArray[y]
                                }
                                if(HEROCFG[sameLevSolArray[y+1]].initid > 0){
                                    var soldierId2 = HEROCFG[sameLevSolArray[y+1]].initid;
                                }else{
                                    var soldierId2 = sameLevSolArray[y+1]
                                }
                                if(GLOBALDATA.soldiers[soldierId1].l < GLOBALDATA.soldiers[soldierId2].l){
                                    var solLevTemp = sameLevSolArray[y];
                                    sameLevSolArray[y] = sameLevSolArray[y+1];
                                    sameLevSolArray[y+1] = solLevTemp;
                                }
                            }
                        }
                    }
                    i=j-1;
                    this.sortIllenArray = this.sortIllenArray.concat(sameLevSolArray);
                    break;
                }
            }
            if(illengentArray.length == j){//如果品质数组里的缘分全部相同则跳出该循环
                break;
            }
        }

        if(sameLevSolArray.length > 1){
            for(var x=0;x<sameLevSolArray.length-1;x++){
                for(var y=0; y<sameLevSolArray.length-1-x;y++){
                    if(HEROCFG[sameLevSolArray[y]].initid > 0){
                        var soldierId1 = HEROCFG[sameLevSolArray[y]].initid;
                    }else{
                        var soldierId1 = sameLevSolArray[y]
                    }
                    if(HEROCFG[sameLevSolArray[y+1]].initid > 0){
                        var soldierId2 = HEROCFG[sameLevSolArray[y+1]].initid;
                    }else{
                        var soldierId2 = sameLevSolArray[y+1]
                    }
                    if(GLOBALDATA.soldiers[soldierId1].l < GLOBALDATA.soldiers[soldierId2].l){
                        var solTemp = sameLevSolArray[y];
                        sameLevSolArray[y] = sameLevSolArray[y+1];
                        sameLevSolArray[y+1] = solTemp;
                    }
                }
            }
            this.sortIllenArray = this.sortIllenArray.concat(sameLevSolArray);
        }else{
            this.sortIllenArray = this.sortIllenArray.concat(sameLevSolArray);
        }
        return this.sortIllenArray;
    },

    intoEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED == type){
            var solValue = parseInt(sender.getTag());
            armyModel.partnerAdd(solValue, this.pos+1);

            if(this.luckAttr.hasOwnProperty(solValue.toString())){
                var addAttrEvn = new cc.EventCustom('upParentData');
                addAttrEvn.setUserData(this.luckAttr[solValue]);
                cc.eventManager.dispatchEvent(addAttrEvn);
            }
            this.removeFromParent(true);
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