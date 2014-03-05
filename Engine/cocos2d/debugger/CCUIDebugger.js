/**
 * Created by wzm on 14-3-3.
 */
    var tempddd = null;
var UIDEBUGGER_NODE_TAG = 9999;
cc.UIDebugger = cc.Class.extend({
    _NodeArray: [],
    _tmpNodeArray: [],
    draw: null,
    scene: null,
    _nodePosition: null,//用于记录node临时坐标
    ctor: function () {
        this.init();
    },
    init: function () {
        this.scene = cc.Director.getInstance().getRunningScene();
    },
    getCurrentSceneTree: function () {
        var draw = this.scene.getChildByTag(UIDEBUGGER_NODE_TAG);
        if(draw){
            draw.removeFromParent(true);
        }
        var sceneChildren = this.scene.getChildren();
        this._tmpNodeArray = [];
        this._NodeArray = [];
        this._parseSceneJson(sceneChildren);
        for (var i = 0; i < this._tmpNodeArray.length; i++) {
            data = this._tmpNodeArray[i];
            for (var j = 0; j < this._tmpNodeArray.length; j++) {
                var sdata = this._tmpNodeArray[j];
                if (data.parentId == sdata.id) {
                    sdata.children.push(data);
                    data.isadd = true;
                }
            }
        }
        for (var i = 0; i < this._tmpNodeArray.length; i++) {
            var data = this._tmpNodeArray[i];
            if (!data.isadd) {
                this._NodeArray.push(data);
            }
        }
        var draw = this.scene.getChildByTag(UIDEBUGGER_NODE_TAG);
        if (!draw) {
            this.draw = cc.DrawNode.create();
            this.draw.setTag(UIDEBUGGER_NODE_TAG);
            this.scene.addChild(this.draw, 1000000);
        }
        var self = this;
        $("#temp").tree({
            data: this._NodeArray,
            onClick: function (node) {
                self.showNodeLocation(node.node);
            }
        });
    },
    _parseSceneJson: function (dataList) {
        if (dataList instanceof Array) {
            for (var i = 0; i < dataList.length; i++) {
                var data = dataList[i];
                if (data.getChildren().length > 0) {
                    var clame = this.checkTreeClass(data);
                    var a = {"id": data.__instanceId, "parentId": data.getParent().__instanceId, "node": data, "children": [], "isadd": false, "text": clame.toString()};
                    this._tmpNodeArray.push(a);
                    this._parseSceneJson(data.getChildren());
                } else {
                    var clame = this.checkTreeClass(data);
                    var a = {"id": data.__instanceId, "node": data, "parentId": data.getParent().__instanceId, "isadd": false, "text": clame.toString()};
                    this._tmpNodeArray.push(a);
                }
            }
        }
    },
    checkTreeClass: function (node) {
        var cla = [cc.Sprite, cc.Layer, cc.Menu, cc.LabelTTF, cc.MenuItem];
        var cla2 = ["Sprite", "Layer", "Menu", "LabelTTF", "MenuItem"];
        for (var i = 0; i < cla.length; i++) {
            if (node instanceof cla[i]) {
                return cla2[i];
            }
        }
        return "Node";
    },
    showNodeLocation: function (node) {
        if (node instanceof  cc.Node) {
            this.draw.clear();
            var rect = node.getBoundingBox();
            var nodePoint = cc.p(rect.x, rect.y);
            var startPoint = this.getWorldPosition(node);
            var endPoint = cc.p(startPoint.x + rect.width, startPoint.y + rect.height);
            this.draw.drawRect(startPoint, endPoint, cc.c4f(0, 1, 1, 0.2), 1, cc.c4f(1, 0, 1, 1));
            this._showNodeInfo(node,startPoint);
        }
    },
    _showNodeInfo:function(node,worldpos){
        tempddd = node;
        var self = this;
        $('#positionX').numberspinner({
            value: node.getPositionX(),
            onChange:function(val){
                node.setPositionX(parseFloat(val));
                self.showNodeLocation(node);
            }
        });
        $('#positionY').numberspinner({
            value: node.getPositionY(),
            onChange:function(val){
                node.setPositionY(parseFloat(val));
                self.showNodeLocation(node);
            }
        });
    },
    getWorldPosition: function (node) {
        var bx =  node.getBoundingBox();
        this._nodePosition = cc.p(bx.x,bx.y);
        this._getRelativePosition(node);
        return this._nodePosition;
    },
    _getRelativePosition: function (node) {
        if (node.getParent()) {
            this._nodePosition = node.getParent().convertToWorldSpace(this._nodePosition);
            this._getRelativePosition(node.getParent());
        } else {
            return this._nodePosition;
        }
    }
});
cc.UIDebugger._instance = null;
cc.UIDebugger.getInstance = function () {
    if (!cc.UIDebugger._instance) {
        cc.UIDebugger._instance = new cc.UIDebugger();
    }
    return cc.UIDebugger._instance;
}