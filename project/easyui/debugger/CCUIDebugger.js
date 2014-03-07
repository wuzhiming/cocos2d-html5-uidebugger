/**
 * Created by wzm on 14-3-3.
 */
var tempddd = null;
var UIDEBUGGER_NODE_TAG = 9999;
var UIDebugger = function () {
};
UIDebugger.prototype = {
    _NodeArray: [],
    _tmpNodeArray: [],
    scenedraw: null,
    scene: null,
    _nodePosition: null,//用于记录node临时坐标
    _currentNode: null,
    getCurrentSceneTree: function () {
        this.scene = cc.director.getRunningScene();
        var draw = this.scene.getChildByTag(UIDEBUGGER_NODE_TAG);
        if (draw) {
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
            this.scenedraw = cc.DrawNode.create();
            this.scenedraw.setTag(UIDEBUGGER_NODE_TAG);
            this.scene.addChild(this.scenedraw, 1000000);

        }
        var self = this;
        $("#temp").tree({
            data: this._NodeArray,
            onClick: function (node) {
                if (node) {
                    if (self._currentNode) {
                        self._currentNode._showNode = false;
                    }
                    self._currentNode = node.node;
                    self._currentNode._showNode = true;
                    self._showNodeInfo(node.node);
                }
            }
        });
    },
    _parseSceneJson: function (dataList) {
        if (dataList instanceof Array) {
            for (var i = 0; i < dataList.length; i++) {
                var data = dataList[i];
                if (data.getChildren().length > 0) {
                    var clame = data._className;
                    var a = {"id": data.__instanceId, "parentId": data.getParent().__instanceId, "node": data, "children": [], "isadd": false, "text": clame};
                    this._tmpNodeArray.push(a);
                    this._parseSceneJson(data.getChildren());
                } else {
                    var clame = data._className;
                    var a = {"id": data.__instanceId, "node": data, "parentId": data.getParent().__instanceId, "isadd": false, "text": clame};
                    this._tmpNodeArray.push(a);
                }
            }
        }
    },
    /*    showNodeLocation: function (node) {
     if (node instanceof  cc.Node) {
     this.scenedraw.clear();
     var rect = node.getBoundingBox();
     var nodePoint = cc.p(rect.x, rect.y);
     var startPoint = this.getWorldPosition(node);
     var endPoint = cc.p(startPoint.x + rect.width, startPoint.y + rect.height);
     this.scenedraw.drawRect(startPoint, endPoint, cc.color(0, 255, 255, 50), 1, cc.color(255, 0, 255, 255));
     this._showNodeInfo(node,startPoint);
     }
     },*/
    _showNodeInfo: function (node) {
        tempddd = node;//for  test
        var self = this;
        var nodePos = node.getPosition();
        if (nodePos) {// the  node  position
            $('#posX').numberspinner({
                value: nodePos.x,
                precision:1,
                onChange: function (val) {
                    node.x = parseFloat(val);
                }
            });
            $('#posY').numberspinner({
                value: nodePos.y,
                precision:1,
                onChange: function (val) {
                    node.y = parseFloat(val);
                }
            });
        }
        var worldPos = self.getWorldPosition(node);
        if (worldPos) {//the world position
            $('#wPosX').numberbox({
                value: worldPos.x
            });
            $('#wPosY').numberbox({
                value: worldPos.y
            });
        }
        $('#rotateX').numberspinner({
            value: node.rotationX,
            precision:1,
            onChange: function (val) {
                node.rotationX = parseFloat(val);
            }
        });
        $('#rotateY').numberspinner({
            value: node.rotationY,
            precision:1,
            onChange: function (val) {
                node.rotationY = parseFloat(val);
            }
        });
        $('#scaleX').numberspinner({
            value: node.scaleX,
            precision:2,
            onChange: function (val) {
                node.scaleX = parseFloat(val);
            }
        });
        $('#scaleY').numberspinner({
            value: node.scaleY,
            precision:2,
            onChange: function (val) {
                node.scaleY = parseFloat(val);
            }
        });
        $('#skewX').numberspinner({
            value: node.skewX,
            precision:2,
            onChange: function (val) {
                node.skewX = parseFloat(val);
            }
        });
        $('#skewY').numberspinner({
            value: node.skewY,
            precision:2,
            onChange: function (val) {
                node.skewY = parseFloat(val);
            }
        });
    },
    getWorldPosition: function (node) {
        var bx = node.getBoundingBox();
        this._nodePosition = cc.p(bx.x, bx.y);
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
};
UIDebugger._instance = null;
UIDebugger.getInstance = function () {
    if (!UIDebugger._instance) {
        UIDebugger._instance = new UIDebugger();
    }
    return UIDebugger._instance;
}