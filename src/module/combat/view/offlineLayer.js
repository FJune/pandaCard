
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
 var OfflineLayer = ModalDialog.extend({
    ctor:function(){
        this._super();
        this.LayerName = "OfflineLayer";
    },
    onEnter:function(){
        this._super();
    },
    initUI:function(){
        var self = this;
        this.getofflineprofit = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "role.getofflineprofit",
            callback: function(event){
                self.removeFromParent(true);
            }
        });
        cc.eventManager.addListener(this.getofflineprofit, 1);

        //
        var min = GLOBALDATA.extend.offline;

        var baseTime = min;//Math.min(min, 6 * 60);
        var monthCardTime = (GLOBALDATA.base.m_card_time == 0 || GLOBALDATA.base.m_card_time < Helper.getServerTime()) ? 0 : Math.max(0, Math.min(min - 6 * 60, 6 * 60));
        var lifeCardTime = GLOBALDATA.base.h_card_count == 0 ? 0 : Math.max(0, Math.min(min - 6 * 60 - monthCardTime, 6 * 60));

        var offlineexp = 0;
        var offlinegold = 0;
        var stage = GLOBALDATA.base.stage;
        for(var key in STAGECFG){
            if(STAGECFG[key].stageid == stage){
                offlineexp = STAGECFG[key].offlineexp;
                offlinegold = STAGECFG[key].offlinegold;
                break;
            }
        }

        var baseExp = offlineexp * baseTime;
        var baseGold = offlinegold * baseTime;

        monthCardEXp = offlineexp * 0.2 * (monthCardTime > 0 ? baseTime : 0);
        monthCardGold = offlinegold * 0.2 * (monthCardTime > 0 ? baseTime : 0);

        lifeCardEXp = offlineexp * 0.2 * (lifeCardTime > 0 ? baseTime : 0);
        lifeCardGold = offlinegold * 0.2 * (lifeCardTime > 0 ? baseTime : 0);


        this.uiOfflineLayer = ccs.load(res.uiOfflineLayer).node;
        this.addObj(this.uiOfflineLayer);

        var btnBack = ccui.helper.seekWidgetByName(this.uiOfflineLayer, "btnBack");
        btnBack.addTouchEventListener(this.onTouchEvent, this);


        offlineGet = ccui.helper.seekWidgetByName(this.uiOfflineLayer, "offlineGet");
        offlineGet.setString(StringFormat(STRINGCFG[100006].string, Helper.formatMinutes(min)));


        var initialBar = ccui.helper.seekWidgetByName(this.uiOfflineLayer, "initialBar");
        initialBar.setPercent(Math.round(baseTime * 100 / 360));

        var expIntialValue = ccui.helper.seekWidgetByName(this.uiOfflineLayer, "expIntialValue");
        expIntialValue.setString(Helper.formatNum(baseExp));

        var goldIntialValue = ccui.helper.seekWidgetByName(this.uiOfflineLayer, "goldIntialValue");
        goldIntialValue.setString(Helper.formatNum(baseGold));


        var intermediateBar = ccui.helper.seekWidgetByName(this.uiOfflineLayer, "intermediateBar");
        intermediateBar.setPercent(Math.round(monthCardTime * 100/ 360 ));

        var expintermediateValue = ccui.helper.seekWidgetByName(this.uiOfflineLayer, "expintermediateValue");
        expintermediateValue.setString(Helper.formatNum(monthCardEXp));

        var goldintermediateValue = ccui.helper.seekWidgetByName(this.uiOfflineLayer, "goldintermediateValue");
        goldintermediateValue.setString(Helper.formatNum(monthCardGold));


        var seniorBar = ccui.helper.seekWidgetByName(this.uiOfflineLayer, "seniorBar");
        seniorBar.setPercent(Math.round(lifeCardTime * 100 /  360 ));

        var expseniorValue = ccui.helper.seekWidgetByName(this.uiOfflineLayer, "expseniorValue");
        expseniorValue.setString(Helper.formatNum(lifeCardEXp));

        var goldseniorValue = ccui.helper.seekWidgetByName(this.uiOfflineLayer, "goldseniorValue");
        goldseniorValue.setString(Helper.formatNum(lifeCardGold));
    },
    onTouchEvent: function (sender, type) {
        if(ccui.Widget.TOUCH_ENDED == type){
            switch (sender.name) {
                case 'btnBack':
                    Network.getInstance().send({task:'role.getofflineprofit'});

                    break;
                default:
                    break;
            }
        }
    },
    onExit:function () {
        this._super();
        cc.eventManager.removeListener(this.getofflineprofit);
    },
});