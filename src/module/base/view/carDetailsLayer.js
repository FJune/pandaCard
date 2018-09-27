
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
var CarDdtailsLayer = ModalDialog.extend({
    carbul:false,
    bulArray:[],
    ctor:function(carid){
        this._super();
        this.LayerName = "CarDdtailsLayer";
        this.carid = carid;
    },

    onEnter:function(){
        this._super();
    },

    initUI:function(){
        this.carDetailObj = ccsTool.load(res.uiCarDetailsLayer, ["backBtn", "strenLev", "accBaseAttr1", "accBaseAttr2",
        "accBaseAttr3", "accBaseAttr4", "Image_star1", "Image_star1", "Image_star2", "Image_star3", "Image_star4",
        "Image_star5", "Image_star6", "refineLev", "Image_skill", "refineLevStren", "refineLevStren1", "refineLevStren2",
        "refineLevStren3", "refineLevStren4", "refineLevStren5", "refineLevStren6", "refineLevStren7", "refineLevStren8",
        "refineLevStren9", "refineLevStren10", "refineLevStren11", "refineLevStren12", "refineLevStren13", "refineLevStren14",
        "refineLevStren15", "bootBg1", "bootBg2", "bootBg3", "bootIcon1", "bootIcon2", "bootIcon3", "ImageBlack1", "ImageBlack2",
        "ImageBlack3", "bootTextName", "equipName", "efeectDes1", "efeectDes2", "efeectDes3", "efeectDes4","Panel_2",
            "ListView_SeeSkill", "btnSkillOk", "Image_DateSkill", "textTipsDateSkill"]);
        this.addChild(this.carDetailObj.node, 1);

        this.carDetailObj.wgt.backBtn.addTouchEventListener(this.backBtnEvent, this);
        this.carDetailObj.wgt.Image_skill.addTouchEventListener(this.skillBtnEvent, this);
        this.carDetailObj.wgt.btnSkillOk.addTouchEventListener(this.skillBtnEvent, this);
        this.carDetailObj.wgt.Panel_2.addTouchEventListener(this.skillBtnEvent, this);
        //查找上阵指挥官
        for(var comKey in GLOBALDATA.commanders){
            if(GLOBALDATA.commanders[comKey].j == 1){
                this.commandId = comKey;
                this.commanderObj = GLOBALDATA.commanders[comKey];
            }
        }
        if(this.commanderObj.car != undefined) {
            var fcarIdArray = [];//已有座驾副本数组
            for (var carKey in this.commanderObj.car) {
                fcarIdArray.push(this.commanderObj.car[carKey].id);
            }
            fcarIdArray.sort();//从小到大排序

            //判断组合属性可以激活
            this.bulArray.length = 0;
            for(var key in COMCARCOMBINATIONCFG){
                var carCount = 0;
                var caridArray = COMCARCOMBINATIONCFG[key].carid;
                for(var i=0;i<caridArray.length;i++){
                    if(fcarIdArray.indexOf(caridArray[i]) != -1){
                        carCount++;
                    }
                }
                if(caridArray.length == carCount){
                    this.bulArray.push(true);
                }else{
                    this.bulArray.push(false);
                }
            }
        }

        for(var comKey in this.commanderObj.car){
            if(this.commanderObj.car[comKey].id == this.carid){
                var comCarAttr = this.commanderObj.car[comKey];
                this.carbul = true;
            }
        }

        if(this.carbul){
            var carAttr = COMCARCFG[this.carid];
            this.carDetailObj.wgt.equipName.setString(COMCARCFG[carAttr.id].name);
            this.carDetailObj.wgt.strenLev.setString("强化等级：" + comCarAttr.st);
            //这个注释的内容还有用
            /*var _bulCount;
             if(this.commanderObj.lcar >=1 && this.commanderObj.lcar <= 3){
             _bulCount = 0;
             }else if(this.commanderObj.lcar >=4 && this.commanderObj.lcar <= 5){
             _bulCount = 1;
             }else if(this.commanderObj.lcar >=6 && this.commanderObj.lcar <= 7){
             _bulCount = 2;
             }*/
            for(var j=1;j<carAttr.attr_base.length+1;j++){
                var attr_base = carAttr.attr_base[j-1];//基础属性
                var _attr_add = carAttr.attr_add;//基础增加属性

                for(var i=0;i<_attr_add.length;i++){
                    if(_attr_add[i][0] == attr_base[0]){
                        var attr_add = carAttr.attr_add[j-1];
                    }
                }
                var carAttrValue = attr_base[2] + (attr_add[2] * comCarAttr.lv * (1 + carAttr.growthrate / 10000 * comCarAttr.star))
                    * Math.pow(1.5,comCarAttr.star);
                if(comCarAttr.st > 0){
                    //sattr_base和sattr_add数值对应顺序不同，数值计算就会出错
                    var _sattr_base = carAttr.sattr_base;
                    var _sattr_add =  carAttr.sattr_add;
                    for(var i=0;i<_sattr_base.length;i++){
                        if(attr_base[0] == _sattr_base[i][0] && attr_base[0] == _sattr_add[i][0]){
                            var sattr_base = _sattr_base[i];
                            var sattr_add = _sattr_add[i];
                            carAttrValue += (sattr_base[2] + sattr_add[2] * comCarAttr.st);
                            if(parseInt(comCarAttr.st / 10)){
                                var _talent = COMCARCFG[comCarAttr.id].talent;
                                if(attr_base[0] == _talent[0]){
                                    carAttrValue += (_talent[2] * parseInt(comCarAttr.st / 10));
                                }
                            }
                        }
                    }
                }
                //如果组合属性激活，则加入组合属性
                for(var i=0;i<3;i++){
                    if(this.bulArray[i]){
                        var combination = COMCARCOMBINATIONCFG[i+1].combination;
                        for(var x=0;x<combination.length;x++){
                            if(combination[x][0] == attr_base[0]){
                                carAttrValue += combination[x][2];
                            }
                        }
                    }
                }
                //这个注释还有用
                /*if(this.bulArray[_bulCount]){
                 var combination = COMCARCFG[carid.id].combination;
                 for(var i=0;i<combination.length;i++){
                 if(combination[i][0] == attr_base[0]){
                 carAttr += combination[i][2];
                 }
                 }
                 }*/

                var _attrName = "accBaseAttr" +j;
                var attrName = ccui.helper.seekWidgetByName(this.carDetailObj.node, _attrName);
                attrName.setString("全队生命:"+ parseInt(carAttrValue));
            }
            if(carAttr.attr_base.length < 4){
                for(var j=0; j < 4 - carAttr.attr_base.length; j++){
                    var  _attrName = "accBaseAttr" +(4-j);
                    var attrName = ccui.helper.seekWidgetByName(this.carDetailObj.node, _attrName);
                    attrName.setVisible(false);
                }
            }

            //星级显示
            for(var i=0;i<comCarAttr.star;i++){
                var _Image_star = "Image_star" + (i+1);
                var Image_star = ccui.helper.seekWidgetByName(this.carDetailObj.node, _Image_star);
                Image_star.setString(true);
            }

            //强化属性显示
            for(var i=0;i<15;i++){
                var _refineLevStren = "refineLevStren" + (i+1);
                var refineLevStren = ccui.helper.seekWidgetByName(this.carDetailObj.node, _refineLevStren);
                refineLevStren.setString("全队攻击+"+ COMCARCFG[this.carid].talent[2] + "(强化至"+10*(i+1) + "等级开启)");
            }

            //座驾图标显示
            var _bulCount;
            if(this.carid >= 101 && this.carid <= 103){
                _bulCount = 1;
            }else if(this.carid >= 104 && this.carid <= 105){
                _bulCount = 2;
            }else if(this.carid >= 106 && this.carid <= 107){
                _bulCount = 3;
            }
            this.carDetailObj.wgt.bootTextName.setString(COMCARCOMBINATIONCFG[_bulCount].name);
            var caridArray = COMCARCOMBINATIONCFG[_bulCount].carid;
            if(caridArray.length < 3){
                for(var i=0;i<caridArray.length;i++){
                    var _Imagebg = "bootBg" + (i+1);
                    var Imagebg = ccui.helper.seekWidgetByName(this.carDetailObj.node, _Imagebg);
                    Imagebg.setPosition(cc.p(Imagebg.getPositionX()+100, Imagebg.getPositionY()));
                    Helper.LoadFrameImageWithPlist(Imagebg, COMCARCFG[caridArray[i]].quality);
                    var _Image_hero = "bootIcon"+(i+1);
                    var Image_hero = ccui.helper.seekWidgetByName(this.carDetailObj.node, _Image_hero);
                    Helper.LoadIcoImageWithPlist(Image_hero, ITEMCFG[COMCARCFG[caridArray[i]].synnum[0]]);
                    var _ImageBlack = "ImageBlack" + (i+1);
                    var ImageBlack = ccui.helper.seekWidgetByName(this.carDetailObj.node, _ImageBlack);
                    if(fcarIdArray.indexOf(caridArray[i]) != -1){
                        ImageBlack.setVisible(false);
                    }
                }
                for(var j=0; j<3 - caridArray.length; j++){
                    var _Text_sDate = "bootBg"+(3-j);
                    var Text_sDate = ccui.helper.seekWidgetByName(this.carDetailObj.node, _Text_sDate);
                    Text_sDate.setVisible(false);
                }
            }else{
                for(var i=0;i<caridArray.length;i++){
                    var _Imagebg = "bootBg" + (i+1);
                    var Imagebg = ccui.helper.seekWidgetByName(this.carDetailObj.node, _Imagebg);
                    Helper.LoadFrameImageWithPlist(Imagebg, COMCARCFG[caridArray[i]].quality);
                    var _Image_hero = "bootIcon"+(i+1);
                    var Image_hero = ccui.helper.seekWidgetByName(this.carDetailObj.node, _Image_hero);
                    Helper.LoadIcoImageWithPlist(Image_hero, ITEMCFG[COMCARCFG[caridArray[i]].synnum[0]]);
                    var _ImageBlack = "ImageBlack" + (i+1);
                    var ImageBlack = ccui.helper.seekWidgetByName(this.carDetailObj.node, _ImageBlack);
                    if(fcarIdArray.indexOf(caridArray[i]) != -1){
                        ImageBlack.setVisible(false);
                    }
                }
            }

            //组合属性的显示
            var combination = COMCARCOMBINATIONCFG[_bulCount].combination;
            if(this.bulArray[_bulCount - 1]){
                for(var i=0;i<combination.length;i++){
                    var _efeectDes = "efeectDes" + (i+1);
                    var efeectDes = ccui.helper.seekWidgetByName(this.carDetailObj.node, _efeectDes);
                    if(combination[i][1] == 1){
                        efeectDes.setString("全队"+ ATTRIBUTEIDCFG[combination[i][0]].describe + "+" + combination[i][2]);
                        efeectDes.setColor(cc.color.GREEN);
                    }else if(combination[i][1] == 2){
                        efeectDes.setString("全队"+ ATTRIBUTEIDCFG[combination[i][0]].describe + "+" + combination[i][2] / 100 + "%");
                        efeectDes.setColor(cc.color.GREEN);
                    }
                }
                //去掉多余的属性
                if(combination.length < 4){
                    for(var j=0; j<4 - combination.length; j++){
                        var _Text_sDate = "efeectDes"+(4-j);
                        var Text_sDate = ccui.helper.seekWidgetByName(this.carDetailObj.node, _Text_sDate);
                        Text_sDate.setVisible(false);
                    }
                }
            }else{
                for(var i=0;i<combination.length;i++){
                    var _efeectDes = "efeectDes" + (i+1);
                    var efeectDes = ccui.helper.seekWidgetByName(this.carDetailObj.node, _efeectDes);
                    if(combination[i][1] == 1){
                        efeectDes.setString("全队"+ ATTRIBUTEIDCFG[combination[i][0]].describe + "+" + combination[i][2]);
                    }else if(combination[i][1] == 2){
                        efeectDes.setString("全队"+ ATTRIBUTEIDCFG[combination[i][0]].describe + "+" + combination[i][2] / 100 + "%");
                    }
                }
                //去掉多余的属性
                if(combination.length < 4){
                    for(var j=0; j<4 - combination.length; j++){
                        var _Text_sDate = "efeectDes"+(4-j);
                        var Text_sDate = ccui.helper.seekWidgetByName(this.carDetailObj.node, _Text_sDate);
                        Text_sDate.setVisible(false);
                    }
                }
            }
        }else{
            this.carDetailObj.wgt.strenLev.setString("强化等级：" + 0);
            var carAttr = COMCARCFG[this.carid];
            this.carDetailObj.wgt.equipName.setString(COMCARCFG[carAttr.id].name);
            for(var i = 0;i<carAttr.attr_base.length;i++){
                var _accBaseAttr = "accBaseAttr" + (i+1);
                var accBaseAttr = ccui.helper.seekWidgetByName(this.carDetailObj.node, _accBaseAttr);
                if(carAttr.attr_base[i][1] == 1){
                    accBaseAttr.setString(ATTRIBUTEIDCFG[carAttr.attr_base[i][0]].describe + ":" + carAttr.attr_base[i][2]);
                }else if(carAttr.attr_base[i][1] == 2){
                    accBaseAttr.setString(ATTRIBUTEIDCFG[carAttr.attr_base[i][0]].describe + ":" + carAttr.attr_base[i][2]/100 + "%");
                }
            }
            if(carAttr.attr_base.length < 4){
                for(var j=0; j < 4 - carAttr.attr_base.length; j++){
                    var  _attrName = "accBaseAttr" +(4-j);
                    var attrName = ccui.helper.seekWidgetByName(this.carDetailObj.node, _attrName);
                    attrName.setVisible(false);
                }
            }
            //强化属性显示
            for(var i=0;i<15;i++){
                var _refineLevStren = "refineLevStren" + (i+1);
                var refineLevStren = ccui.helper.seekWidgetByName(this.carDetailObj.node, _refineLevStren);
                refineLevStren.setString("全队攻击+"+ COMCARCFG[this.carid].talent[2] + "(强化至"+10*(i+1) + "等级开启)");
            }
            //座驾图标显示
            var _bulCount;
            if(this.carid >=101 && this.carid <= 103){
                _bulCount = 1;
            }else if(this.carid >=104 && this.carid <= 105){
                _bulCount = 2;
            }else if(this.carid >=106 && this.carid <= 107){
                _bulCount = 3;
            }
            var caridArray = COMCARCOMBINATIONCFG[_bulCount].carid;
            if(caridArray.length < 3){
                for(var i=0;i<caridArray.length;i++){
                    var _Imagebg = "bootBg" + (i+1);
                    var Imagebg = ccui.helper.seekWidgetByName(this.carDetailObj.node, _Imagebg);
                    Imagebg.setPosition(cc.p(Imagebg.getPositionX()+100, Imagebg.getPositionY()));
                    Helper.LoadFrameImageWithPlist(Imagebg, COMCARCFG[caridArray[i]].quality);
                    var _Image_hero = "bootIcon"+(i+1);
                    var Image_hero = ccui.helper.seekWidgetByName(this.carDetailObj.node, _Image_hero);
                    Helper.LoadIcoImageWithPlist(Image_hero, ITEMCFG[COMCARCFG[caridArray[i]].synnum[0]]);

                }
                for(var j=0; j<3 - caridArray.length; j++){
                    var _Text_sDate = "bootBg"+(3-j);
                    var Text_sDate = ccui.helper.seekWidgetByName(this.carDetailObj.node, _Text_sDate);
                    Text_sDate.setVisible(false);
                }
            }else{
                for(var i=0;i<caridArray.length;i++){
                    var _Imagebg = "bootBg" + (i+1);
                    var Imagebg = ccui.helper.seekWidgetByName(this.carDetailObj.node, _Imagebg);
                    Helper.LoadFrameImageWithPlist(Imagebg, COMCARCFG[caridArray[i]].quality);
                    var _Image_hero = "bootIcon"+(i+1);
                    var Image_hero = ccui.helper.seekWidgetByName(this.carDetailObj.node, _Image_hero);
                    Helper.LoadIcoImageWithPlist(Image_hero, ITEMCFG[COMCARCFG[caridArray[i]].synnum[0]]);

                }
            }

            //组合属性显示
            var combination = COMCARCOMBINATIONCFG[_bulCount].combination;
            for(var i=0;i<combination.length;i++){
                var _efeectDes = "efeectDes" + (i+1);
                var efeectDes = ccui.helper.seekWidgetByName(this.carDetailObj.node, _efeectDes);
                if(combination[i][1] == 1){
                    efeectDes.setString("全队"+ ATTRIBUTEIDCFG[combination[i][0]].describe + "+" + combination[i][2]);
                }else if(combination[i][1] == 2){
                    efeectDes.setString("全队"+ ATTRIBUTEIDCFG[combination[i][0]].describe + "+" + combination[i][2] / 100 + "%");
                }
            }
            //去掉多余的属性
            if(combination.length < 4){
                for(var j=0; j<4 - combination.length; j++){
                    var _Text_sDate = "efeectDes"+(4-j);
                    var Text_sDate = ccui.helper.seekWidgetByName(this.carDetailObj.node, _Text_sDate);
                    Text_sDate.setVisible(false);
                }
            }
        }
    },
    backBtnEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED == type){
            this.removeFromParent();
        }
    },

    skillBtnEvent:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED == type){
            switch (sender.name){
                case"Image_skill":
                    this.carDetailObj.wgt.Panel_2.setVisible(true);
                    var carSkill = COMCARCFG[this.carid].skill;
                    for(var i=0;i<carSkill.length;i++){
                        this.carDetailObj.wgt.textTipsDateSkill.setString(SKILLCFG[carSkill[i][1]].skillname + SKILLCFG[carSkill[i][1]].describe
                            + "技能CD:" + SKILLCFG[carSkill[i][1]].skillcd + "秒" + "(" + carSkill[i][0] + "星开启）");
                        var Image_DateSkill = this.carDetailObj.wgt.Image_DateSkill.clone();
                        this.carDetailObj.wgt.ListView_SeeSkill.pushBackCustomItem(Image_DateSkill);
                    }
                    break;
                case"btnSkillOk":
                    this.carDetailObj.wgt.Panel_2.setVisible(false);
                    break;
                case"Panel_2":
                    sender.setVisible(false);
                    break;
            }


        }
    },

    onExit:function(){
        this._super();
    }
});