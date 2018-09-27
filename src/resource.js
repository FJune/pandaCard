
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 //资源配置表
var resRaw = {
    commonRes:{
        //机枪
        com_arc001_png:"res/hero/com_arc001.png",
        com_arc001_plist:"res/hero/com_arc001.plist",
        heroicon_plist:"res/hero/heroicon.plist",
        heroicon_png:"res/hero/heroicon.png",
        ico_equ_plist:"res/icon/ico_equ.plist",
        ico_equ_png:"res/icon/ico_equ.png",
        ico_acy_plist:"res/icon/ico_acy.plist",
        ico_acy_png:"res/icon/ico_acy.png",
        ico_item_plist:"res/icon/ico_item.plist",
        ico_item_png:"res/icon/ico_item.png",
        // boom01_plist:"res/effect/boom01.plist",
        // boom01_png:"res/effect/boom01.png",
        dgYellow_fnt:'res/font/dgyellow.fnt',
        dgYellow_png:'res/font/dgyellow.png',
        dgRed_fnt:'res/font/dgred.fnt',
        dgRed_png:'res/font/dgred.png',
        dgBlue_fnt:'res/font/dgblue.fnt',
        dgBlue_png:'res/font/dgblue.png',
        dgGreen_fnt:'res/font/dggreen.fnt',
        dgGreen_png:'res/font/dggreen.png',
        numbergray_fnt:'res/font/numgray.fnt',
        numbergray_png:'res/font/numgray.png',
        bloodfront_png:'res/common/xuetiaofront.png',
        bloodBackground_png:'res/common/xuetiaobg.png',
        // ui_box_plist:'res/common/a/box.plist',
        // ui_box_png:'res/common/a/box.png',
        // ui_bar_plist:'res/common/b/bar.plist',
        // ui_bar_png:'res/common/b/bar.png',
        // ui_button_plist:'res/common/c/button.plist',
        // ui_button_png:'res/common/c/button.png',
        // ui_avatar_plist:'res/common/t/avatar.plist',
        // ui_avatar_png:'res/common/t/avatar.png',
        // ui_art_plist:'res/common/d/artFont.plist',
        // ui_art_png:'res/common/d/artFont.png',
        // ui_icon_plist:'res/common/i/icon.plist',
        // ui_icon_png:'res/common/i/icon.png',
        ui_skill_plist:'res/common/j/skill.plist',
        ui_skill_png:'res/common/j/skill.png',
        ui_navBottom:'res/navBottom.json',
        uiBuyBaseLayer:'res/buyBaseLayer.json',
        uiAttributeLayer:'res/AttributeLayer.json',
        //uiArmyChoiseLayer:'res/armyChoiseLayer.json',
        //uiIntoBattleLayer:'res/intoBattleLayer.json',
        //uiEmbattleLayer:'res/embattleLayer.json',
        uiArmyRankLayer:'res/armyDistinyLayer.json',

        uiEquipItem:'res/equipItem.json',
        //uiRecruitLayer:'res/recruitLayer.json',
        //uiPartnerLayer:'res/partnerLayer.json',
        //uiPartmerShowLayer:'res/partmerShowLayer.json',
        //uiPartmerShowLayer1:'res/partmerShowLayer1.json',

        // uiEmailItem:"res/emailItem.json",
        // uiEmailLayer:"res/emailLayer.json",
        // uiQuickFightLayer:"res/fastWarLayer.json",
        //基地
        //uiCityLayer:"res/cityLayer.json",
        //uicityShopLayer:"res/cityShopLayer.json",
        uiTipsLayer:"res/TipsLayer.json",
        //uiCarLayer:"res/carLayer.json",
        //uiSeeItem:"res/carSeeItem.json",
        //uiCarDetailsLayer:"res/carDetailsLayer.json",
        //
        //uiOfflineLayer:"res/offlineLayer.json",
        //uiWelfareLayer:"res/welfareLayer.json",
        //uiWelSignItem:"res/welSignItem.json",
        //uiWelfareSignLayer:"res/welfareSignLayer.json",
        //uiWelSevenItem:"res/welSevenItem.json",
        //uiWelfareSevenLayer:"res/welfareSevenLayer.json",

        uiItemGetItem:"res/itemGetLayer.json",
        //uiArsenItem:"res/arsenItem.json",
        //uiArsenLayer:"res/arsenLayer.json",
        //uiSweepLayer:"res/sweepLayer.json",
        //uiExploreLayer:"res/exploreLayer.json",
        //uiActivityLayer:"res/activityLayer.json",
        //uiActivityOneItem:"res/activityOneItem.json",
        //uiActivityTwoItem:"res/activityTwoItem.json",
        //uiShopLayer:"res/shopLayer.json",
        //uiShopItem:"res/shopItem.json",
        //uiShopBuyLayer:"res/shopBuyLayer.json",
        //uiShopHeroLayer:"res/shopHeroLayer.json",
        //uiShopEquLayer:"res/shopEquLayer.json",
        //uiShopEquItem:"res/shopEquItem.json",
        //uiShopCarLayer:"res/shopCarLayer.json",
        //uiShopCarItem:"res/shopCarItem.json",
        //uiShopAreLayer:"res/shopAreLayer.json",

        //弹幕item
        uiBarrageLayer:"res/barrageLayer.json",

        //购买物品通用数量框
        //uiBuyNumLayer:"res/buyNumLayer.json",
        //uiBuyBoxLayer:"res/buyBoxLayer.json",

        //uiNickNameChangeLayer:'res/heroDateLayer.json', //昵称更改
        //uidateLayer:'res/dateLayer.json',

//    技能特效
//     effDefBuff_plist:"res/effect/defbuff.plist",
//     effDefBuff_png:"res/effect/defbuff.png",
//         effDefBuff_json:"res/effdefbuff.json",
        // effAtkBuff_plist:"res/effect/atkbuff.plist",
        // effAtkBuff_png:"res/effect/atkbuff.png",
        // effAtkBuff_json:"res/effatkbuff.json",
        // effSpeedBuff_plist:"res/effect/speedbuff.plist",
        // effSpeedBuff_png:"res/effect/speedbuff.png",
        // effSpeedBuff_json:"res/speedbuff.json",
        // effaim_plist:"res/effect/shellaim.plist",
        // effaim_png:"res/effect/shellaim.png",
        // effexplode_plist:"res/effect/shellexplode.plist",
        // effexplode_png:"res/effect/shellexplode.png",
        // effwarhead_plist:"res/effect/shelleffwarhead.plist",
        // effwarhead_png:"res/effect/shelleffwarhead.png",
        effshell_json:"res/effShell.json",
        //
        // effcardanger_plist:"res/effect/cardanger.plist",
        // effcardanger_png:"res/effect/cardanger.png",
        // effcarhurt_plist:"res/effect/carhurt.plist",
        // effcarhurt_png:"res/effect/carhurt.png",
        // effnpchurt_plist:"res/effect/npchurt.plist",
        // effnpchurt_png:"res/effect/npchurt.png",
        // effHurt_json:"res/effHurt.json",
        effLogin_json:"res/effLogin.json",
        effSupplyBox:"res/effBoxLayer.json",
        effFontLayer_json:"res/effFontLayer.json",
        effatkboss_json:"res/effatkboss.json",
        winLayer_json:"res/winLayer.json",
        effGlodLayer_json:"res/effGlodLayer.json",
        effAppear_json:"res/effAppear.json",
        effWarLayer_json:"res/effWarLayer.json",
        effRecruit_json:"res/effRecruit.json",
        effArsenBox_json:"res/effArsenBox.json",
        effEquDZItem_json:"res/effEquDZItem.json",
        ger_arc002_png:"res/hero/ger_arc002.png",
        ger_arc002_plist:"res/hero/ger_arc002.plist",
    },
    effect:{
        com_rif_bic01_png:"res/skill/com_rif_bic01.png",
        com_rif_bic01_plist:"res/skill/com_rif_bic01.plist",
        amm_rif_bic01_png:"res/skill/amm_rif_bic01.png",
        amm_rif_bic01_plist:"res/skill/amm_rif_bic01.plist",
        amm_rif_bic02_png:"res/skill/amm_rif_bic02.png",
        amm_rif_bic02_plist:"res/skill/amm_rif_bic02.plist",
        amm_rpg_bic01_png:"res/skill/amm_rpg_bic01.png",
        amm_rpg_bic01_plist:"res/skill/amm_rpg_bic01.plist",
        amm_rpg_bic02_png:"res/skill/amm_rpg_bic02.png",
        amm_rpg_bic02_plist:"res/skill/amm_rpg_bic02.plist",
        amm_rpg_bic03_png:"res/skill/amm_rpg_bic03.png",
        amm_rpg_bic03_plist:"res/skill/amm_rpg_bic03.plist",
        amm_mis_bic01_png:"res/skill/amm_mis_bic01.png",
        amm_mis_bic01_plist:"res/skill/amm_mis_bic01.plist",
        amm_mis_bic02_png:"res/skill/amm_mis_bic02.png",
        amm_mis_bic02_plist:"res/skill/amm_mis_bic02.plist",
        amm_mis_bic03_png:"res/skill/amm_mis_bic03.png",
        amm_mis_bic03_plist:"res/skill/amm_mis_bic03.plist",
        amm_art_bic01_png:"res/skill/amm_art_bic01.png",
        amm_art_bic01_plist:"res/skill/amm_art_bic01.plist",
        amm_cru_bic01_png:"res/skill/amm_cru_bic01.png",
        amm_cru_bic01_plist:"res/skill/amm_cru_bic01.plist",
        amm_fire_bic01_png:"res/skill/amm_fire_bic01.png",
        amm_fire_bic01_plist:"res/skill/amm_fire_bic01.plist",

        amm_mis_pli01_png:"res/skill/amm_mis-pli01.png",
        amm_mis_pli01_plist:"res/skill/amm_mis-pli01.plist",

        com_start01_png:"res/skill/com_start01.png",
        com_start01_plist:"res/skill/com_start01.plist",
        amm_rif_ski01_png:"res/skill/amm_rif_ski01.png",
        amm_rif_ski01_plist:"res/skill/amm_rif_ski01.plist",
        amm_rif_ski02_png:"res/skill/amm_rif_ski02.png",
        amm_rif_ski02_plist:"res/skill/amm_rif_ski02.plist",
        amm_art_ski01_png:"res/skill/amm_art_ski01.png",
        amm_art_ski01_plist:"res/skill/amm_art_ski01.plist",
        amm_art_ski02_png:"res/skill/amm_art_ski02.png",
        amm_art_ski02_plist:"res/skill/amm_art_ski02.plist",
        amm_bom_ski01_png:"res/skill/amm_bom_ski01.png",
        amm_bom_ski01_plist:"res/skill/amm_bom_ski01.plist",
        amm_bom_ski02_png:"res/skill/amm_bom_ski02.png",
        amm_bom_ski02_plist:"res/skill/amm_bom_ski02.plist",
        amm_mis_ski01_png:"res/skill/amm_mis_ski01.png",
        amm_mis_ski01_plist:"res/skill/amm_mis_ski01.plist",
        amm_mis_ski02_png:"res/skill/amm_mis_ski02.png",
        amm_mis_ski02_plist:"res/skill/amm_mis_ski02.plist",
        amm_rpg_ski01_png:"res/skill/amm_rpg_ski01.png",
        amm_rpg_ski01_plist:"res/skill/amm_rpg_ski01.plist",
        amm_rpg_ski02_png:"res/skill/amm_rpg_ski02.png",
        amm_rpg_ski02_plist:"res/skill/amm_rpg_ski02.plist",
        amm_sni_ski01_png:"res/skill/amm_sni_ski01.png",
        amm_sni_ski01_plist:"res/skill/amm_sni_ski01.plist",
        amm_cru_ski01_png:"res/skill/amm_cru_ski01.png",
        amm_cru_ski01_plist:"res/skill/amm_cru_ski01.plist",
        amm_fire_ski01_png:"res/skill/amm_fire_ski01.png",
        amm_fire_ski01_plist:"res/skill/amm_fire_ski01.plist",
        eff_sing01_png:"res/skill/eff_sing01.png",
        eff_sing01_plist:"res/skill/eff_sing01.plist",
        eff_sing02_png:"res/skill/eff_sing02.png",
        eff_sing02_plist:"res/skill/eff_sing02.plist",
        eff_die01_png:"res/skill/eff_die01.png",
        eff_die01_plist:"res/skill/eff_die01.plist",
        buff_def01_png:"res/skill/buff_def01.png",
        buff_def01_plist:"res/skill/buff_def01.plist",
        buff_def02_png:"res/skill/buff_def02.png",
        buff_def02_plist:"res/skill/buff_def02.plist",
        buff_def03_png:"res/skill/buff_def03.png",
        buff_def03_plist:"res/skill/buff_def03.plist",
        buff_spe01_png:"res/skill/buff_spe01.png",
        buff_spe01_plist:"res/skill/buff_spe01.plist",
        buff_cri01_png:"res/skill/buff_cri01.png",
        buff_cri01_plist:"res/skill/buff_cri01.plist",
        buff_ice01_png:"res/skill/buff_ice01.png",
        buff_ice01_plist:"res/skill/buff_ice01.plist",
        buff_rep01_png:"res/skill/buff_rep01.png",
        buff_rep01_plist:"res/skill/buff_rep01.plist",
        buff_sil01_png:"res/skill/buff_sil01.png",
        buff_sil01_plist:"res/skill/buff_sil01.plist",
        buff_ver01_png:"res/skill/buff_ver01.png",
        buff_ver01_plist:"res/skill/buff_ver01.plist",


    },
    roleModle:{
        com_npc001_png:"res/hero/com_npc001.png",
        com_npc001_plist:"res/hero/com_npc001.plist",
        com_npc002_png:"res/hero/com_npc002.png",
        com_npc002_plist:"res/hero/com_npc002.plist",
        com_npc003_png:"res/hero/com_npc003.png",
        com_npc003_plist:"res/hero/com_npc003.plist",
        ame_car001_png:"res/hero/ame_car001.png",
        ame_car001_plist:"res/hero/ame_car001.plist",
        ame_car002_png:"res/hero/ame_car002.png",
        ame_car002_plist:"res/hero/ame_car002.plist",
        ame_car003_png:"res/hero/ame_car003.png",
        ame_car003_plist:"res/hero/ame_car003.plist",
        ame_car004_png:"res/hero/ame_car004.png",
        ame_car004_plist:"res/hero/ame_car004.plist",
        ame_car005_png:"res/hero/ame_car005.png",
        ame_car005_plist:"res/hero/ame_car005.plist",
        ame_car006_png:"res/hero/ame_car006.png",
        ame_car006_plist:"res/hero/ame_car006.plist",
        ame_car007_png:"res/hero/ame_car007.png",
        ame_car007_plist:"res/hero/ame_car007.plist",
        ame_car008_png:"res/hero/ame_car008.png",
        ame_car008_plist:"res/hero/ame_car008.plist",
        ame_car009_png:"res/hero/ame_car009.png",
        ame_car009_plist:"res/hero/ame_car009.plist",
        ame_car010_png:"res/hero/ame_car010.png",
        ame_car010_plist:"res/hero/ame_car010.plist",
        ame_car011_png:"res/hero/ame_car011.png",
        ame_car011_plist:"res/hero/ame_car011.plist",
        ame_car012_png:"res/hero/ame_car012.png",
        ame_car012_plist:"res/hero/ame_car012.plist",
        ame_car013_png:"res/hero/ame_car013.png",
        ame_car013_plist:"res/hero/ame_car013.plist",
        ame_car014_png:"res/hero/ame_car014.png",
        ame_car014_plist:"res/hero/ame_car014.plist",
        ame_car015_png:"res/hero/ame_car015.png",
        ame_car015_plist:"res/hero/ame_car015.plist",
        ame_car018_png:"res/hero/ame_car018.png",
        ame_car018_plist:"res/hero/ame_car018.plist",
        ame_car019_png:"res/hero/ame_car019.png",
        ame_car019_plist:"res/hero/ame_car019.plist",
        ame_car020_png:"res/hero/ame_car020.png",
        ame_car020_plist:"res/hero/ame_car020.plist",
        ame_car021_png:"res/hero/ame_car021.png",
        ame_car021_plist:"res/hero/ame_car021.plist",
        ame_car022_png:"res/hero/ame_car022.png",
        ame_car022_plist:"res/hero/ame_car022.plist",
        ame_car024_png:"res/hero/ame_car024.png",
        ame_car024_plist:"res/hero/ame_car024.plist",
        ame_npc001_png:"res/hero/ame_npc001.png",
        ame_npc001_plist:"res/hero/ame_npc001.plist",
        ame_npc002_png:"res/hero/ame_npc002.png",
        ame_npc002_plist:"res/hero/ame_npc002.plist",
        ame_npc003_png:"res/hero/ame_npc003.png",
        ame_npc003_plist:"res/hero/ame_npc003.plist",
        ame_npc004_png:"res/hero/ame_npc004.png",
        ame_npc004_plist:"res/hero/ame_npc004.plist",
        ame_npc005_png:"res/hero/ame_npc005.png",
        ame_npc005_plist:"res/hero/ame_npc005.plist",
        ame_npc006_png:"res/hero/ame_npc006.png",
        ame_npc006_plist:"res/hero/ame_npc006.plist",
        gbr_npc001_png:"res/hero/gbr_npc001.png",
        gbr_npc001_plist:"res/hero/gbr_npc001.plist",
        gbr_npc002_png:"res/hero/gbr_npc002.png",
        gbr_npc002_plist:"res/hero/gbr_npc002.plist",
        gbr_npc003_png:"res/hero/gbr_npc003.png",
        gbr_npc003_plist:"res/hero/gbr_npc003.plist",
        gbr_npc004_png:"res/hero/gbr_npc004.png",
        gbr_npc004_plist:"res/hero/gbr_npc004.plist",
        gbr_npc005_png:"res/hero/gbr_npc005.png",
        gbr_npc005_plist:"res/hero/gbr_npc005.plist",
        gbr_npc006_png:"res/hero/gbr_npc006.png",
        gbr_npc006_plist:"res/hero/gbr_npc006.plist",
        gbr_car006_png:"res/hero/gbr_car006.png",
        gbr_car006_plist:"res/hero/gbr_car006.plist",
        gbr_car007_png:"res/hero/gbr_car007.png",
        gbr_car007_plist:"res/hero/gbr_car007.plist",
        gbr_car008_png:"res/hero/gbr_car008.png",
        gbr_car008_plist:"res/hero/gbr_car008.plist",
        gbr_car009_png:"res/hero/gbr_car009.png",
        gbr_car009_plist:"res/hero/gbr_car009.plist",
        gbr_car010_png:"res/hero/gbr_car010.png",
        gbr_car010_plist:"res/hero/gbr_car010.plist",
        gbr_car011_png:"res/hero/gbr_car011.png",
        gbr_car011_plist:"res/hero/gbr_car011.plist",
        gbr_car012_png:"res/hero/gbr_car012.png",
        gbr_car012_plist:"res/hero/gbr_car012.plist",
        gbr_car013_png:"res/hero/gbr_car013.png",
        gbr_car013_plist:"res/hero/gbr_car013.plist",
        gbr_car014_png:"res/hero/gbr_car014.png",
        gbr_car014_plist:"res/hero/gbr_car014.plist",
        gbr_car015_png:"res/hero/gbr_car015.png",
        gbr_car015_plist:"res/hero/gbr_car015.plist",
        uss_npc001_png:"res/hero/uss_npc001.png",
        uss_npc001_plist:"res/hero/uss_npc001.plist",
        uss_npc002_png:"res/hero/uss_npc002.png",
        uss_npc002_plist:"res/hero/uss_npc002.plist",
        uss_npc003_png:"res/hero/uss_npc003.png",
        uss_npc003_plist:"res/hero/uss_npc003.plist",
        uss_npc004_png:"res/hero/uss_npc004.png",
        uss_npc004_plist:"res/hero/uss_npc004.plist",
        uss_npc005_png:"res/hero/uss_npc005.png",
        uss_npc005_plist:"res/hero/uss_npc005.plist",
        uss_npc006_png:"res/hero/uss_npc006.png",
        uss_npc006_plist:"res/hero/uss_npc006.plist",
        uss_car001_png:"res/hero/uss_car001.png",
        uss_car001_plist:"res/hero/uss_car001.plist",
        uss_car002_png:"res/hero/uss_car002.png",
        uss_car002_plist:"res/hero/uss_car002.plist",
        uss_car004_png:"res/hero/uss_car004.png",
        uss_car004_plist:"res/hero/uss_car004.plist",
        uss_car007_png:"res/hero/uss_car007.png",
        uss_car007_plist:"res/hero/uss_car007.plist",
        uss_car010_png:"res/hero/uss_car010.png",
        uss_car010_plist:"res/hero/uss_car010.plist",
        uss_car011_png:"res/hero/uss_car011.png",
        uss_car011_plist:"res/hero/uss_car011.plist",
        uss_car014_png:"res/hero/uss_car014.png",
        uss_car014_plist:"res/hero/uss_car014.plist",
        uss_car016_png:"res/hero/uss_car016.png",
        uss_car016_plist:"res/hero/uss_car016.plist",
        uss_car019_png:"res/hero/uss_car019.png",
        uss_car019_plist:"res/hero/uss_car019.plist",
        uss_car020_png:"res/hero/uss_car020.png",
        uss_car020_plist:"res/hero/uss_car020.plist",
        uss_car021_png:"res/hero/uss_car021.png",
        uss_car021_plist:"res/hero/uss_car021.plist",
        uss_car024_png:"res/hero/uss_car024.png",
        uss_car024_plist:"res/hero/uss_car024.plist",
        ger_car001_png:"res/hero/ger_car001.png",
        ger_car001_plist:"res/hero/ger_car001.plist",
        ger_car002_png:"res/hero/ger_car002.png",
        ger_car002_plist:"res/hero/ger_car002.plist",
        ger_car003_png:"res/hero/ger_car003.png",
        ger_car003_plist:"res/hero/ger_car003.plist",
        ger_car004_png:"res/hero/ger_car004.png",
        ger_car004_plist:"res/hero/ger_car004.plist",
        ger_car005_png:"res/hero/ger_car005.png",
        ger_car005_plist:"res/hero/ger_car005.plist",
        ger_car006_png:"res/hero/ger_car006.png",
        ger_car006_plist:"res/hero/ger_car006.plist",
        ger_car007_png:"res/hero/ger_car007.png",
        ger_car007_plist:"res/hero/ger_car007.plist",
        ger_car015_png:"res/hero/ger_car015.png",
        ger_car015_plist:"res/hero/ger_car015.plist",
        ger_car017_png:"res/hero/ger_car017.png",
        ger_car017_plist:"res/hero/ger_car017.plist",
        ger_car019_png:"res/hero/ger_car019.png",
        ger_car019_plist:"res/hero/ger_car019.plist",
        ger_npc001_png:"res/hero/ger_npc001.png",
        ger_npc001_plist:"res/hero/ger_npc001.plist",
        ger_npc002_png:"res/hero/ger_npc002.png",
        ger_npc002_plist:"res/hero/ger_npc002.plist",
        ger_npc003_png:"res/hero/ger_npc003.png",
        ger_npc003_plist:"res/hero/ger_npc003.plist",
        ger_npc004_png:"res/hero/ger_npc004.png",
        ger_npc004_plist:"res/hero/ger_npc004.plist",
        ger_npc005_png:"res/hero/ger_npc005.png",
        ger_npc005_plist:"res/hero/ger_npc005.plist",
        ger_npc006_png:"res/hero/ger_npc006.png",
        ger_npc006_plist:"res/hero/ger_npc006.plist",
        ger_npc007_png:"res/hero/ger_npc007.png",
        ger_npc007_plist:"res/hero/ger_npc007.plist",
        ger_acr001_png:"res/hero/ger_acr001.png",
        ger_acr001_plist:"res/hero/ger_acr001.plist",
        ger_acr002_png:"res/hero/ger_acr002.png",
        ger_acr002_plist:"res/hero/ger_acr002.plist",
        uss_npc002_png:"res/hero/uss_npc002.png",
        uss_npc002_plist:"res/hero/uss_npc002.plist",
        lta_npc001_png:"res/hero/lta_npc001.png",
        lta_npc001_plist:"res/hero/lta_npc001.plist",
        lta_npc002_png:"res/hero/lta_npc002.png",
        lta_npc002_plist:"res/hero/lta_npc002.plist",
        lta_npc003_png:"res/hero/lta_npc003.png",
        lta_npc003_plist:"res/hero/lta_npc003.plist",
        lta_npc004_png:"res/hero/lta_npc004.png",
        lta_npc004_plist:"res/hero/lta_npc004.plist",
        lta_npc005_png:"res/hero/lta_npc005.png",
        lta_npc005_plist:"res/hero/lta_npc005.plist",
        jpn_npc001_png:"res/hero/jpn_npc001.png",
        jpn_npc001_plist:"res/hero/jpn_npc001.plist",
        jpn_npc002_png:"res/hero/jpn_npc002.png",
        jpn_npc002_plist:"res/hero/jpn_npc002.plist",
        jpn_npc003_png:"res/hero/jpn_npc003.png",
        jpn_npc003_plist:"res/hero/jpn_npc003.plist",
        jpn_npc004_png:"res/hero/jpn_npc004.png",
        jpn_npc004_plist:"res/hero/jpn_npc004.plist",
        jpn_npc005_png:"res/hero/jpn_npc005.png",
        jpn_npc005_plist:"res/hero/jpn_npc005.plist",
        jpn_npc006_png:"res/hero/jpn_npc006.png",
        jpn_npc006_plist:"res/hero/jpn_npc006.plist",
        jpn_car008_png:"res/hero/jpn_car008.png",
        jpn_car008_plist:"res/hero/jpn_car008.plist",
        jpn_car009_png:"res/hero/jpn_car009.png",
        jpn_car009_plist:"res/hero/jpn_car009.plist",
    },
    ServerLayer:{
        uiServerLayer:"res/serverLayer.json",
        uiServerItem:"res/serverItem.json",
    },
    sevGuideLayer:{
        uiSevGuideLayer:"res/sevGuideLayer.json",
    },
    CreateRoleLayer:{
        uiCreateRoleLayer:"res/createRoleLayer.json",
    },

    loginLayer:{
        login_json:"res/LoginLayer.json",
    },
    combatLayer:{
        bg_stage001:"res/bg/bg_stage001.jpg",
        bg_stage003:"res/bg/bg_stage003.png",
        ui_fightBottom:'res/fightBottom.json',
        ui_fightTop:'res/fightTop1.json',
        uiArenaFightLayer:"res/arenaFightLayer.json",
        sandbags:"res/bg/sandbags.png",
        stone:"res/bg/stone.png",
    },
    loseLayer:{
        uiloseLayer:'res/loseLayer.json',
    },
    OfflineLayer:{
        uiOfflineLayer:"res/offlineLayer.json",
    },
    WelfareLayer:{
        uiWelfareLayer:"res/welfareLayer.json",
    },
    WelfareSignLayer:{
        uiWelfareSignLayer:"res/welfareSignLayer.json",
        uiWelSignItem:"res/welSignItem.json",
    },
    WelfareSevenLayer:{
        uiWelfareSevenLayer:"res/welfareSevenLayer.json",
        uiWelSevenItem:"res/welSevenItem.json",
    },
    welfareLvLayer:{  //等级特惠礼包
        uiWelfareLvLayer:"res/welfareLvLayer.json",
    },
    welfareOnLineLayer:{  //在线奖励
        uiWelfareOnLineLayer:"res/welfareOnLineLayer.json",
        uiWelOnLineItem:"res/welOnLineItem.json",
    },
    welfareChengZLayer:{  //成长基金
        uiWelfareChengZLayer:"res/welfareChengZLayer.json",
        uiWelChengZItem:"res/welChengZItem.json",
    },
    welfareSOnLineLayer:{  //开服在线礼包
        uiWelfareSOnLineLayer:"res/welfareSOnLineLayer.json",
    },
    welfareSLvLayer:{  //开服特惠礼包
        uiWelfareSLvLayer:"res/welfareSLvLayer.json",
    },
    welfareHLLayer:{  //开服红利
        uiWelfareHLLayer:"res/welfareHLLayer.json",
    },
    welfareVipLayer:{  //VIP福利
        uiWelfareVipLayer:"res/welfareVipLayer.json",
        uiWelVipItem:"res/welVipItem.json",
    },
    welfareSCLayer:{  //首充礼包
        uiWelfareSCLayer:"res/welfareSCLayer.json",
    },
    welfareYKLayer:{  //月卡礼包
        uiWelfareYKLayer:"res/welfareYKLayer.json",
    },
    welfareZZKLayer:{  //终身卡礼包
        uiWelfareZZKLayer:"res/welfareZZKLayer.json",
    },
    RecruitLayer:{
        uiRecruitLayer:'res/recruitLayer.json',
    },
    //基地
    CityLayer:{
        uiCityLayer:"res/cityLayer.json",
    },
    CityShopLayer:{
        uicityShopLayer:"res/cityShopLayer.json",
    },
    CarLayer:{
        uiCarLayer:"res/carLayer.json",
    },
    ArsenLayer:{
        uiArsenItem:"res/arsenItem.json",
        uiArsenLayer:"res/arsenLayer.json",
    },
    BuyNumLayer:{
        uiBuyNumLayer:"res/buyNumLayer.json",
    },
    SweepLayer:{
        uiSweepLayer:"res/sweepLayer.json",
    },
    ExploreLayer:{
        uiExploreLayer:"res/exploreLayer.json",
    },
    ActivityLayer:{
        uiActivityLayer:"res/activityLayer.json",
        uiActivityOneItem:"res/activityOneItem.json",
        uiActivityTwoItem:"res/activityTwoItem.json",
    },
    BuyBoxLayer:{
        uiBuyBoxLayer:"res/buyBoxLayer.json",
    },
    ShopLayer:{
        uiShopLayer:"res/shopLayer.json",
        uiShopItem:"res/shopItem.json",
    },
    ShopHeroLayer:{
        uiShopHeroLayer:"res/shopHeroLayer.json",
        uiShopItem:"res/shopItem.json",
    },
    ShopAreLayer:{
        uiShopAreLayer:"res/shopAreLayer.json",
        uiShopItem:"res/shopItem.json",
    },
    ShopEquLayer:{
        uiShopEquLayer:"res/shopEquLayer.json",
        uiShopEquItem:"res/shopEquItem.json",
    },
    ShopCarLayer:{
        uiShopCarLayer:"res/shopCarLayer.json",
        uiShopCarItem:"res/shopCarItem.json",
    },
    ShopBuyLayer:{
        uiShopBuyLayer:"res/shopBuyLayer.json",
    },

    ItemJumpLayer:{
        uiItemJumpLayer:"res/itemJumpLayer.json",
        uiItemJumpItem:"res/itemJumpItem.json",
    },
    //回收
    recoverLayer:{
        uiRecoverLayer:"res/recoverLayer.json",
        uiRecoverItem:"res/recoverItem.json",
        uiRecoverGetItem:"res/recoverGetItem.json",
        uiRecoverEffbreak1:"res/effBreakItem1.json",
        uiRecoverEffbreak2:"res/effBreakItem2.json",
    },
    bossFightLayer:{
        //boss战
        uiBossLayer:"res/bossLayer.json",
        uiBossRankItem:"res/bossRankItem.json",
        uiBossRewordItem:"res/bossRewardItem.json",
        uiBossRankGetItem:"res/bossRankGetItem.json",
        uiBossResLayer:"res/bossResLayer.json",
        uiBuyNumLayer:"res/buyNumLayer.json",
        uiBuyBoxLayer:"res/buyBoxLayer.json",
    },
    arenaLayer:{
        //竞技场
        uiArenaLayer:"res/arenaLayer.json",
        uiArenaItem:"res/arenaItem.json",
        uiArenaRankItem:"res/arenaRankItem.json",
        uiArenaResLayer:"res/arenaResLayer.json",
    },
    resourceFightLayer:{
        //资源掠夺
        uiResourceFightLayer:"res/warThereLayer.json",
        uiWarResLayer:"res/warResLayer.json",
    },
    friendLayer:{
        //好友
        uiFriendLayer:"res/friendLayer.json",
        uiFriendItem:"res/friendItem.json",
    },
    rankWarLayer:{
        //王牌雕像
        uiRankWarLayer:"res/RankWarLayer.json",
        uiRankWarItem:"res/rankWarItem.json",
    },
    emailLayer:{
        //邮件
        uiEmailItem:"res/emailItem.json",
        uiEmailLayer:"res/emailLayer.json",
    },
    quickFightLayer:{
        uiQuickFightLayer:"res/fastWarLayer.json",
    },
    chatLayer:{
        //聊天
        uiChatLayer:"res/chatLayer.json",
        uiChatItem:"res/chatItem.json",
    },
    //士兵界面
    armyLayer:{
        uiArmyChangeLayer:'res/armChangeLayer.json',
    },
    //士兵属性
    armyAttriLayer:{
        uiArmyAttributeLayer:'res/armyAttributeLayer.json',
    },
    //更换配饰
    accChangeLayer:{
        uiAccChangeLayer:'res/accChangeLayer.json',
        uiAccShowLayer:'res/accShowLayer.json',
    },
    //配饰属性
    accDetailsLayer:{
        uiAccDetailsLayer:'res/accDetailsLayer.json',
    },
    //配饰精炼
    accRefineLayer:{
        uiAccRefineLayer:'res/accRefineLayer.json',
    },
    //配饰强化
    accStrenLayer:{
        uiAccStrenLayer:'res/accStrenLayer.json',
    },
    //士兵觉醒
    armyAwakeLayer:{
        uiArmyAwakeLayer:'res/armyAwakeLayer.json',
        uiArmyAwakeItem:'res/armyAwakeItem.json',
        uiArmyAwakeItem1:'res/armyAwakeItem1.json',
        uiJumpFindLayer:'res/jumpFindLayer.json',
    },
    //士兵突破
    armyBreakLayer:{
        uiArmyBreakLayer:'res/armyBreakLayer.json',
    },
    //士兵进阶
    armyEvolutionLayer:{
        uiArmyEvolutionLayer:'res/armyEvolutionLayer.json',
    },
    //士兵升级
    armyLevelUpLayer:{
        uiArmyUpLevelLayer:'res/armyUpGradeLayer.json',
    },
    //士兵改造
    armyReformLayer:{
        uiArmyReformLayer:'res/armyReformLayer.json',
    },
    //更换装备
    equipChangeLayer:{
        uiEquipChangeLayer:'res/equipChangeLayer.json',
        uiEquipShowLayer:'res/equipShowLayer.json',
    },
    //装备属性
    equipDetailsLayer:{
        uiEquipDetailsLayer:'res/equipDetailsLayer.json',
    },
    //装备锻造
    equipForginLayer:{
        uiEquipForginLayer:'res/equipForginLayer.json',
    },
    //强化大师
    equipMasterLayer:{
        uiEquipMasterLayer:'res/equipMasterLayer.json',
    },
    //装备精炼
    equipRefineLayer:{
        uiEquipRefineLayer:'res/equipRefineLayer.json',
    },
    //装备强化
    equipStrenLayer:{
        uiEquipStrenLayer:'res/equipStrenLayer.json',
    },
    //背包
    bagLayer:{
        uiBagLayer:'res/BagLayer.json',
        uiBagItem:'res/BagItem.json',
    },
    //金币兑换
    buyGoldLayer:{
        uiBuyGoldLayer:"res/buyGoldLayer.json",
    },
    //物品合成
    itemHeCLayer:{
        uiItemHeCLayer:'res/itemHeCLayer.json',
    },
    //物品查看
    itemSeeLayer:{
        uiItemSeeLayer:'res/itemSeeLayer.json',
    },
    //物品使用
    itemUseLayer:{
        uiItemUseLayer:"res/buyBoxLayer.json",
    },
    //物品选择
    itemChooseLayer:{
        uiItemChooseLayer:"res/itemChooseLayer.json",
    },
    //物品分解
    itemBreakLayer:{
        uiItemBreakLayer:"res/itemBreakLayer.json",
    },
    //军神争霸
    bothFightLayer:{
        uiVsLayer:"res/vsLayer.json",
        uiVsRankItem:"res/vsRankItem.json",
        uiVsGongRankItem:"res/vsGongRankItem.json",
        uiVsRankGetItem:"res/vsRankGetItem.json",
        uiVsJiLuItem:"res/vsJiLuItem.json",
    },
    //军神争霸战斗结果
    bothResLayer:{
        uiVsResLayer:"res/vsResLayer.json",
    },
    //日常任务
    dayWorkLayer:{
        uiDayWorkLayer:"res/dayWorkLayer.json",
        uiDayWorkItem:"res/dayWorkItem.json",
    },
    //名将录
    starHeroLayer:{
        uiStarHeroLayer:"res/starHeroLayer.json",
    },
    //新手引导
    newGuideLayer:{
        uiNewGuideLayer:"res/NewGuideLayer.json",
    },
    DateLayer:{//乱世佳人
        uidateLayer:'res/dateLayer.json',
    },
    navarchyLayer:{//指挥官
        uiNavarchyLayer:'res/navarchyLayer.json',
        uiNavarchySkillLayer:'res/navarchySkillLayer.json',
        uiNaVehicleItem:'res/navarchyCarryItem.json',
        uiFightNumLayer:'res/fightNumLayer.json',
        // uiMilitaryRankLayer:'res/militaryRankLayer.json',
    },
    armyChoiseLayer:{//士兵上阵
        uiArmyChoiseLayer:'res/armyChoiseLayer.json',
        uiIntoBattleLayer:'res/intoBattleLayer.json',
    },
    partnerLayer:{//协同作战
        uiPartnerLayer:'res/partnerLayer.json',
        uiPartmerShowLayer:'res/partmerShowLayer.json',
        uiPartmerShowLayer1:'res/partmerShowLayer1.json',
        uiFightNumLayer:'res/fightNumLayer.json',
    },
    carLayer:{//座驾
        uiCarLayer:"res/carLayer.json",
        uiSeeItem:"res/carSeeItem.json",
    },
    CarDdtailsLayer:{//座驾详情
        uiCarDetailsLayer:"res/carDetailsLayer.json",
    },
    nickNameChangeLayer:{//昵称修改
        uiNickNameChangeLayer:'res/heroDateLayer.json', //昵称更改
    },
    embattleLayer:{//布阵
        uiEmbattleLayer:'res/embattleLayer.json',
    },
    vipFreedomLayer:{ //vip特权
        uiVipFreedomLayer:"res/vipLayer.json",
        uiVipItem:"res/vipItem.json",
    },
    fuLiLayer:{//活动中心
        uiFuLiLayer:'res/fuLiLayer.json',
        uiFuLiDRItem:'res/fuLiDRItem.json',
        uiFuLiDRItem2:'res/fuLiDRItem2.json',
        uiFuLiBJItem2:'res/fuLiBJItem2.json',
        uiFuLiFLItem:'res/fuLiFLItem.json',
    },
    shopBuyMLayer:{
        uiShopBuyMLayer:"res/shopBuyMLayer.json",
    },
    luckIntoLayer:{
        uiArmyChoiseLayer:'res/armyChoiseLayer.json',
        uiIntoBattleLayer:'res/intoBattleLayer.json',
    }
};

var g_resources = {};
var res = {};
var firstLoadRes = [];
for (var key in resRaw) {
    g_resources[key] = [];
    for (var i in resRaw[key]) {
        g_resources[key].push(resRaw[key][i]);
        if(key=='commonRes'||key=='combatLayer'||key=='CityLayer'||key=='armyLayer'||key=='recoverLayer'||key=='RecruitLayer'||key=='effect'){
            firstLoadRes.push(resRaw[key][i]);
        }
        res[i] = resRaw[key][i];
    }
}
//脚本支援