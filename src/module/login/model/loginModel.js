
/**
 ** @Author:pandayu
 ** @Version:1.0
 ** @DateTime:2018-09-09
 ** @Project:pandaCard CardGame
 ** @Contact: QQ:815099602
 **/
var loginModel = {
    register:function () {
        
    },
    login:function (acc) {
        $.ajax({
            type: 'GET',
            url:USERSERVERURL,
            data: { type: 'self',acc:acc,pw:'123456'},
            // data: { type: 'self',acc:'test2',pw:'test2'},
            dataType: 'json',
            success: function(data){
                cc.log(data);
                if(data.status==0){
                    Network.getInstance().send({
                        task:'login',
                        uid:data.uid,
                        verify:MD5(data.uid+data.verifycode)
                    });
                }
            },
            error: function(xhr, type){
                cc.log('error')
            }
        });
    }
}