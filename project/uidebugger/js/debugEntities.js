/**
 * Created by wzm on 14-3-12.
 */
var nodeNumInfoText = function(id,data){
    if(data instanceof Object){
        return this.init();
    }

}
nodeNumInfoText.prototype = {
    w2filed:null,
     init:function(id,data){
        this.w2filed = $('#'+id).w2field(data);
         return this.w2filed;
     }
}