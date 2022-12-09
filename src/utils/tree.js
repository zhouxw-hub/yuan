"use script";

/**
 * 树形节点操作
 */
(function () {

    /**
     * 子节点设置
     * @param {object} node 父节点
     * @param {object} newChildren 子节点
     */
    const nodeChildren = function (node, newChildren) {
        if (!node) {
            return null;
        }
        var key = "children";
        if (typeof newChildren !== 'undefined') {
            node[key] = newChildren;
        }
        return node[key];
    }

    /**
     * 将数组转为树形结构对象
     */
    module.exports = function (nodes) {
        var key = "id";
        var parentKey = "pid";
        var r = [];
        var tmpMap = {};
        for (i = 0, l = nodes.length; i < l; i++) {
            tmpMap[nodes[i][key]] = nodes[i];
        }
        for (i = 0, l = nodes.length; i < l; i++) {
            var p = tmpMap[nodes[i][parentKey]];
            if (p && nodes[i][key] != nodes[i][parentKey]) {
                var children = nodeChildren(p);
                if (!children) {
                    children = nodeChildren(p, []);
                }
                children.push(nodes[i]);
            } else {
                r.push(nodes[i]);
            }
        }

        return r;
    }
})();