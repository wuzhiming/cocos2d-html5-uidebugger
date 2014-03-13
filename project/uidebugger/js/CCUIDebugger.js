/**
 * Created by wzm on 14-3-3.
 */
var tempddd = null;
var UIDEBUGGER_NODE_TAG = 9999;
var UIDebugger = function () {
    this.init();
};
UIDebugger.prototype = {
    _NodeArray: [],
    _tmpNodeArray: [],
    scenedraw: null,
    scene: null,
    _nodePosition: null,//用于记录node临时坐标
    _currentNode: null,
    init: function () {
        this._initNodeInfoPannel();
    },
    getCurrentSceneTree: function () {
        if(cc.director){
            this.scene = cc.director.getRunningScene();
        }else{
            alert("please wait for the engine power on");
            return;
        }
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
                    sdata.nodes.push(data);
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
        this._loadTree();
    },
    _loadTree: function () {
        var self = this;
        if (w2ui.sidebar) {
            w2ui.sidebar.destroy();
            cc.log(1);
        }
        $('#sidebar').w2sidebar({
            name: 'sidebar',
            nodes: this._NodeArray,
            onClick: function (node) {
                self._showNodeInfo(node.object.data);
            }
        });

    },
    _initNodeInfoPannel: function () {
        var self = this;
        var dataformat = {type: 'float', arrows: true};
        $('#posX').w2field($.extend(dataformat, {hasChange: function (val) {
            if (self._currentNode instanceof cc.Node) {
                self._currentNode.x = parseFloat(val);
                self.showNodeLocation(self._currentNode);
            }
        }}));
        $('#posY').w2field($.extend(dataformat, {hasChange: function (val) {
            if (self._currentNode instanceof cc.Node) {
                self._currentNode.y = parseFloat(val);
                self.showNodeLocation(self._currentNode);
            }
        }}));
        $('#rotateX').w2field($.extend(dataformat, {hasChange: function (val) {
            if (self._currentNode instanceof cc.Node) {
                self._currentNode.rotationX = parseFloat(val);
            }
        }}));
        $('#rotateY').w2field($.extend(dataformat, {hasChange: function (val) {
            if (self._currentNode instanceof cc.Node) {
                self._currentNode.rotationY = parseFloat(val);
            }
        }}));
        $('#scaleX').w2field($.extend(dataformat, {hasChange: function (val) {
            if (self._currentNode instanceof cc.Node) {
                self._currentNode.scaleX = parseFloat(val);
            }
        }}));
        $('#scaleY').w2field($.extend(dataformat, {hasChange: function (val) {
            if (self._currentNode instanceof cc.Node) {
                self._currentNode.scaleY = parseFloat(val);
            }
        }}));
        $('#skewX').w2field($.extend(dataformat, {hasChange: function (val) {
            if (self._currentNode instanceof cc.Node) {
                self._currentNode.skewX = parseFloat(val);
            }
        }}));
        $('#skewY').w2field($.extend(dataformat, {hasChange: function (val) {
            if (self._currentNode instanceof cc.Node) {
                self._currentNode.skewY = parseFloat(val);
            }
        }}));
        $('#ancpX').w2field($.extend(dataformat, {max:1,min:0,hasChange: function (val) {
            if (self._currentNode instanceof cc.Node) {
                self._currentNode.anchorX = parseFloat(val);
                self.showNodeLocation(self._currentNode);
            }
        }}));
        $('#ancpY').w2field($.extend(dataformat, {max:1,min:0,hasChange: function (val) {
            if (self._currentNode instanceof cc.Node) {
                self._currentNode.anchorY = parseFloat(val);
                self.showNodeLocation(self._currentNode);
            }
        }}));
    },
    _toggleNode: function (node, checked) {
        if (node.node instanceof cc.Node) {
            node.node.visible = checked;
        }
    },
    _parseSceneJson: function (dataList) {
        if (dataList instanceof Array) {
            for (var i = 0; i < dataList.length; i++) {
                var data = dataList[i];
                var icon = data.visible ? "icon-add" : "icon-delete";
                var clame = data._className;
                if (data.getChildren().length > 0) {
                    var a = {id: data.__instanceId, img: icon, parentId: data.getParent().__instanceId, data: data, nodes: [], isadd: false, text: clame};
                    this._tmpNodeArray.push(a);
                    this._parseSceneJson(data.getChildren());
                } else {
                    var a = {id: data.__instanceId, img: icon, data: data, parentId: data.getParent().__instanceId, isadd: false, text: clame};
                    this._tmpNodeArray.push(a);
                }
            }
        }
    },
    _showNodeInfo: function (node) {
        tempddd = node;//for  test
        if (this._currentNode) {
            this._currentNode._showNode = false;
            var parentNode = this._currentNode.getParent();
            if (parentNode) {
                parentNode._showNode = false;
            }
        }
        this._currentNode = node;
        this._currentNode._showNode = true;
        var parentNode = this._currentNode.getParent();
        if (parentNode) {
            parentNode._showNode = true;
        }
        var wpos = this.getWorldPositionWithAnchor(node);
        $("#posX").val(this._fixFloat(node.x));
        $("#posY").val(this._fixFloat(node.y));
        $("#wPosX").val(this._fixFloat(wpos.x));
        $("#wPosY").val(this._fixFloat(wpos.y));
        $("#rotateX").val(this._fixFloat(node.rotationX));
        $("#rotateY").val(this._fixFloat(node.rotationY));
        $("#scaleX").val(this._fixFloat(node.scaleX));
        $("#scaleY").val(this._fixFloat(node.scaleY));
        $("#skewX").val(this._fixFloat(node.skewX));
        $("#skewY").val(this._fixFloat(node.skewY));
        $("#ancpX").val(this._fixFloat(node.anchorX));
        $("#ancpX").val(this._fixFloat(node.anchorY));
        this.showNodeLocation(node);
    },
    _fixFloat: function (num) {
        return num.toFixed(1);
    },
    showNodeLocation: function (node) {
        if (node instanceof  cc.Node) {
            this.scenedraw.clear();
            var nodeWorldPos = this.getWorldPositionWithAnchor(node);
            var pareNode = node.getParent();
            if (pareNode) {
                var pNodeWorldPos = this.getWorldPositionBottomLeft(pareNode);
                var nodePos = pareNode.getPosition();
                var xPosLine = cc.p(nodeWorldPos.x, pNodeWorldPos.y);
                var yPosLine = cc.p(pNodeWorldPos.x, nodeWorldPos.y);
                this.scenedraw.drawSegment(xPosLine, nodeWorldPos,0.2);
                this.scenedraw.drawSegment(yPosLine, nodeWorldPos, 0.2);
                this.scenedraw.drawDot(pNodeWorldPos, 4, cc.color(255, 0, 0, 255));
                /*                var rect = pareNode.getBoundingBox();
                 var nodePoint = cc.p(rect.x, rect.y);
                 var startPoint = this.getWorldPositionBottomLeft(pareNode);
                 var endPoint = cc.p(startPoint.x + rect.width, startPoint.y + rect.height);
                 this.scenedraw.drawRect(startPoint, endPoint, cc.color(0, 255, 255, 50), 1, cc.color(255, 0, 255, 255));*/
            }
            this.scenedraw.drawDot(nodeWorldPos, 4, cc.color(255, 0, 255, 255));
        }
    },
    getWorldPositionBottomLeft: function (node) {//node's bottomleft position
        var bx = node.getBoundingBox();
        this._nodePosition = cc.p(bx.x, bx.y);
        if (node.getParent()) {
            this._nodePosition = node.getParent().convertToWorldSpace(this._nodePosition);
        } else {
            this._nodePosition = node.getPosition();
        }
        return this._nodePosition;
    },
    getWorldPositionWithAnchor: function (node) {//the real position;
        var wordpos = this.getWorldPositionBottomLeft(node);
        var wordpos2 = cc.p(wordpos.x + node.width * node.anchorX, wordpos.y + node.height * node.anchorY);
        return wordpos2;
    }
};
UIDebugger._instance = null;
UIDebugger.getInstance = function () {
    if (!UIDebugger._instance) {
        UIDebugger._instance = new UIDebugger();
    }
    return UIDebugger._instance;
}