/**
 * Created by wzm on 14-3-12.
 */
var Debugger;//debugger
$(function () {
    var pstyle = 'border: 1px solid #dfdfdf;';
    var canvas = '<canvas id="gameCanvas" width="320" height="480"></canvas><script src="../../cocos2d-html5/CCBoot.js"></script><script src="main.js"></script>';
    var left = '';
    $('#mainContent').w2layout({
        name: 'layout',
        panels: [
            { type: 'right', size: 500, style: pstyle},
            { type: 'main', style: pstyle, content: canvas}
        ]
    });
    w2ui['layout'].load('right', 'uidebugger/html/_LeftContent.html', null, function () {
        Debugger = UIDebugger.getInstance();
        $("#getTree").unbind("click").bind("click",function(){
            Debugger.getCurrentSceneTree();
        });
    });
});