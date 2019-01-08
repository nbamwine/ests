/*
 Highcharts JS v5.0.6 (2016-12-07)

 (c) 2014 Highsoft AS
 Authors: Jon Arild Nygard / Oystein Moseng

 License: www.highcharts.com/license
 */
(function (p) {
    "object" === typeof module && module.exports ? module.exports = p : p(Highcharts)
})(function (p) {
    (function (g) {
        var p = g.seriesType, t = g.seriesTypes, D = g.map, w = g.merge, z = g.extend, A = g.noop, m = g.each, y = g.grep, E = g.isNumber, k = g.pick, u = g.Series, F = g.stableSort, G = function (a, b, c) {
            var e;
            c = c || this;
            for (e in a)a.hasOwnProperty(e) && b.call(c, a[e], e, a)
        }, B = function (a, b, c, e) {
            e = e || this;
            a = a || [];
            m(a, function (d, f) {
                c = b.call(e, c, d, f, a)
            });
            return c
        }, x = function (a, b, c) {
            c = c || this;
            a = b.call(c, a);
            !1 !== a && x(a, b, c)
        };
        p("treemap", "scatter",
            {
                showInLegend: !1,
                marker: !1,
                dataLabels: {
                    enabled: !0, defer: !1, verticalAlign: "middle", formatter: function () {
                        return this.point.name || this.point.id
                    }, inside: !0
                },
                tooltip: {
                    headerFormat: "",
                    pointFormat: "\x3cb\x3e{point.name}\x3c/b\x3e: {point.value}\x3c/b\x3e\x3cbr/\x3e"
                },
                layoutAlgorithm: "sliceAndDice",
                layoutStartingDirection: "vertical",
                alternateStartingDirection: !1,
                levelIsConstant: !0,
                drillUpButton: {position: {align: "right", x: -10, y: 10}}
            }, {
                pointArrayMap: ["value"],
                axisTypes: t.heatmap ? ["xAxis", "yAxis", "colorAxis"] :
                    ["xAxis", "yAxis"],
                optionalAxis: "colorAxis",
                getSymbol: A,
                parallelArrays: ["x", "y", "value", "colorValue"],
                colorKey: "colorValue",
                translateColors: t.heatmap && t.heatmap.prototype.translateColors,
                trackerGroups: ["group", "dataLabelsGroup"],
                getListOfParents: function (a, b) {
                    a = B(a, function (a, b, d) {
                        b = k(b.parent, "");
                        void 0 === a[b] && (a[b] = []);
                        a[b].push(d);
                        return a
                    }, {});
                    G(a, function (a, e, d) {
                        "" !== e && -1 === g.inArray(e, b) && (m(a, function (a) {
                            d[""].push(a)
                        }), delete d[e])
                    });
                    return a
                },
                getTree: function () {
                    var a, b = this;
                    a = D(this.data,
                        function (a) {
                            return a.id
                        });
                    a = b.getListOfParents(this.data, a);
                    b.nodeMap = [];
                    a = b.buildNode("", -1, 0, a, null);
                    x(this.nodeMap[this.rootNode], function (a) {
                        var c = !1, d = a.parent;
                        a.visible = !0;
                        if (d || "" === d)c = b.nodeMap[d];
                        return c
                    });
                    x(this.nodeMap[this.rootNode].children, function (a) {
                        var b = !1;
                        m(a, function (a) {
                            a.visible = !0;
                            a.children.length && (b = (b || []).concat(a.children))
                        });
                        return b
                    });
                    this.setTreeValues(a);
                    return a
                },
                init: function (a, b) {
                    u.prototype.init.call(this, a, b);
                    this.options.allowDrillToNode && this.drillTo()
                },
                buildNode: function (a,
                                     b, c, e, d) {
                    var f = this, h = [], C = f.points[b], v;
                    m(e[a] || [], function (b) {
                        v = f.buildNode(f.points[b].id, b, c + 1, e, a);
                        h.push(v)
                    });
                    b = {id: a, i: b, children: h, level: c, parent: d, visible: !1};
                    f.nodeMap[b.id] = b;
                    C && (C.node = b);
                    return b
                },
                setTreeValues: function (a) {
                    var b = this, c = b.options, e = 0, d = [], f, h = b.points[a.i];
                    m(a.children, function (a) {
                        a = b.setTreeValues(a);
                        d.push(a);
                        a.ignore ? x(a.children, function (a) {
                            var b = !1;
                            m(a, function (a) {
                                z(a, {ignore: !0, isLeaf: !1, visible: !1});
                                a.children.length && (b = (b || []).concat(a.children))
                            });
                            return b
                        }) :
                            e += a.val
                    });
                    F(d, function (a, b) {
                        return a.sortIndex - b.sortIndex
                    });
                    f = k(h && h.options.value, e);
                    h && (h.value = f);
                    z(a, {
                        children: d,
                        childrenTotal: e,
                        ignore: !(k(h && h.visible, !0) && 0 < f),
                        isLeaf: a.visible && !e,
                        levelDynamic: c.levelIsConstant ? a.level : a.level - b.nodeMap[b.rootNode].level,
                        name: k(h && h.name, ""),
                        sortIndex: k(h && h.sortIndex, -f),
                        val: f
                    });
                    return a
                },
                calculateChildrenAreas: function (a, b) {
                    var c = this, e = c.options, d = this.levelMap[a.levelDynamic + 1], f = k(c[d && d.layoutAlgorithm] && d.layoutAlgorithm, e.layoutAlgorithm), h = e.alternateStartingDirection,
                        g = [];
                    a = y(a.children, function (a) {
                        return !a.ignore
                    });
                    d && d.layoutStartingDirection && (b.direction = "vertical" === d.layoutStartingDirection ? 0 : 1);
                    g = c[f](b, a);
                    m(a, function (a, d) {
                        d = g[d];
                        a.values = w(d, {val: a.childrenTotal, direction: h ? 1 - b.direction : b.direction});
                        a.pointValues = w(d, {x: d.x / c.axisRatio, width: d.width / c.axisRatio});
                        a.children.length && c.calculateChildrenAreas(a, a.values)
                    })
                },
                setPointValues: function () {
                    var a = this.xAxis, b = this.yAxis;
                    m(this.points, function (c) {
                        var e = c.node, d = e.pointValues, f, h;
                        d && e.visible ? (e =
                            Math.round(a.translate(d.x, 0, 0, 0, 1)) - .5, f = Math.round(a.translate(d.x + d.width, 0, 0, 0, 1)) - .5, h = Math.round(b.translate(d.y, 0, 0, 0, 1)) - .5, d = Math.round(b.translate(d.y + d.height, 0, 0, 0, 1)) - .5, c.shapeType = "rect", c.shapeArgs = {
                            x: Math.min(e, f),
                            y: Math.min(h, d),
                            width: Math.abs(f - e),
                            height: Math.abs(d - h)
                        }, c.plotX = c.shapeArgs.x + c.shapeArgs.width / 2, c.plotY = c.shapeArgs.y + c.shapeArgs.height / 2) : (delete c.plotX, delete c.plotY)
                    })
                },
                setColorRecursive: function (a, b, c) {
                    var e = this, d, f;
                    a && (d = e.points[a.i], f = e.levelMap[a.levelDynamic],
                        b = k(d && d.options.color, f && f.color, b), c = k(d && d.options.colorIndex, f && f.colorIndex, c), d && (d.color = b, d.colorIndex = c), a.children.length && m(a.children, function (a) {
                        e.setColorRecursive(a, b, c)
                    }))
                },
                algorithmGroup: function (a, b, c, e) {
                    this.height = a;
                    this.width = b;
                    this.plot = e;
                    this.startDirection = this.direction = c;
                    this.lH = this.nH = this.lW = this.nW = this.total = 0;
                    this.elArr = [];
                    this.lP = {
                        total: 0, lH: 0, nH: 0, lW: 0, nW: 0, nR: 0, lR: 0, aspectRatio: function (a, b) {
                            return Math.max(a / b, b / a)
                        }
                    };
                    this.addElement = function (a) {
                        this.lP.total = this.elArr[this.elArr.length -
                        1];
                        this.total += a;
                        0 === this.direction ? (this.lW = this.nW, this.lP.lH = this.lP.total / this.lW, this.lP.lR = this.lP.aspectRatio(this.lW, this.lP.lH), this.nW = this.total / this.height, this.lP.nH = this.lP.total / this.nW, this.lP.nR = this.lP.aspectRatio(this.nW, this.lP.nH)) : (this.lH = this.nH, this.lP.lW = this.lP.total / this.lH, this.lP.lR = this.lP.aspectRatio(this.lP.lW, this.lH), this.nH = this.total / this.width, this.lP.nW = this.lP.total / this.nH, this.lP.nR = this.lP.aspectRatio(this.lP.nW, this.nH));
                        this.elArr.push(a)
                    };
                    this.reset = function () {
                        this.lW =
                            this.nW = 0;
                        this.elArr = [];
                        this.total = 0
                    }
                },
                algorithmCalcPoints: function (a, b, c, e) {
                    var d, f, h, g, v = c.lW, n = c.lH, l = c.plot, k, q = 0, r = c.elArr.length - 1;
                    b ? (v = c.nW, n = c.nH) : k = c.elArr[c.elArr.length - 1];
                    m(c.elArr, function (a) {
                        if (b || q < r)0 === c.direction ? (d = l.x, f = l.y, h = v, g = a / h) : (d = l.x, f = l.y, g = n, h = a / g), e.push({
                            x: d,
                            y: f,
                            width: h,
                            height: g
                        }), 0 === c.direction ? l.y += g : l.x += h;
                        q += 1
                    });
                    c.reset();
                    0 === c.direction ? c.width -= v : c.height -= n;
                    l.y = l.parent.y + (l.parent.height - c.height);
                    l.x = l.parent.x + (l.parent.width - c.width);
                    a && (c.direction = 1 - c.direction);
                    b || c.addElement(k)
                },
                algorithmLowAspectRatio: function (a, b, c) {
                    var e = [], d = this, f, h = {
                        x: b.x,
                        y: b.y,
                        parent: b
                    }, g = 0, k = c.length - 1, n = new this.algorithmGroup(b.height, b.width, b.direction, h);
                    m(c, function (c) {
                        f = c.val / b.val * b.height * b.width;
                        n.addElement(f);
                        n.lP.nR > n.lP.lR && d.algorithmCalcPoints(a, !1, n, e, h);
                        g === k && d.algorithmCalcPoints(a, !0, n, e, h);
                        g += 1
                    });
                    return e
                },
                algorithmFill: function (a, b, c) {
                    var e = [], d, f = b.direction, h = b.x, g = b.y, k = b.width, n = b.height, l, p, q, r;
                    m(c, function (c) {
                        d = c.val / b.val * b.height * b.width;
                        l = h;
                        p = g;
                        0 === f ? (r = n, q = d / r, k -= q, h += q) : (q = k, r = d / q, n -= r, g += r);
                        e.push({x: l, y: p, width: q, height: r});
                        a && (f = 1 - f)
                    });
                    return e
                },
                strip: function (a, b) {
                    return this.algorithmLowAspectRatio(!1, a, b)
                },
                squarified: function (a, b) {
                    return this.algorithmLowAspectRatio(!0, a, b)
                },
                sliceAndDice: function (a, b) {
                    return this.algorithmFill(!0, a, b)
                },
                stripes: function (a, b) {
                    return this.algorithmFill(!1, a, b)
                },
                translate: function () {
                    var a, b;
                    u.prototype.translate.call(this);
                    this.rootNode = k(this.options.rootId, "");
                    this.levelMap = B(this.options.levels, function (a,
                                                                     b) {
                        a[b.level] = b;
                        return a
                    }, {});
                    b = this.tree = this.getTree();
                    this.axisRatio = this.xAxis.len / this.yAxis.len;
                    this.nodeMap[""].pointValues = a = {x: 0, y: 0, width: 100, height: 100};
                    this.nodeMap[""].values = a = w(a, {
                        width: a.width * this.axisRatio,
                        direction: "vertical" === this.options.layoutStartingDirection ? 0 : 1,
                        val: b.val
                    });
                    this.calculateChildrenAreas(b, a);
                    this.colorAxis ? this.translateColors() : this.options.colorByPoint || this.setColorRecursive(this.tree);
                    this.options.allowDrillToNode && (b = this.nodeMap[this.rootNode].pointValues,
                        this.xAxis.setExtremes(b.x, b.x + b.width, !1), this.yAxis.setExtremes(b.y, b.y + b.height, !1), this.xAxis.setScale(), this.yAxis.setScale());
                    this.setPointValues()
                },
                drawDataLabels: function () {
                    var a = this, b = y(a.points, function (a) {
                        return a.node.visible
                    }), c, e;
                    m(b, function (b) {
                        e = a.levelMap[b.node.levelDynamic];
                        c = {style: {}};
                        b.node.isLeaf || (c.enabled = !1);
                        e && e.dataLabels && (c = w(c, e.dataLabels), a._hasPointLabels = !0);
                        b.shapeArgs && (c.style.width = b.shapeArgs.width, b.dataLabel && b.dataLabel.css({width: b.shapeArgs.width + "px"}));
                        b.dlOptions = w(c, b.options.dataLabels)
                    });
                    u.prototype.drawDataLabels.call(this)
                },
                alignDataLabel: function (a) {
                    t.column.prototype.alignDataLabel.apply(this, arguments);
                    a.dataLabel && a.dataLabel.attr({zIndex: a.node.zIndex + 1})
                },
                drawPoints: function () {
                    var a = this, b = y(a.points, function (a) {
                        return a.node.visible
                    });
                    m(b, function (b) {
                        var c = "levelGroup-" + b.node.levelDynamic;
                        a[c] || (a[c] = a.chart.renderer.g(c).attr({zIndex: 1E3 - b.node.levelDynamic}).add(a.group));
                        b.group = a[c]
                    });
                    t.column.prototype.drawPoints.call(this);
                    a.options.allowDrillToNode &&
                    m(b, function (b) {
                        b.graphic && (b.drillId = a.options.interactByLeaf ? a.drillToByLeaf(b) : a.drillToByGroup(b))
                    })
                },
                drillTo: function () {
                    var a = this;
                    g.addEvent(a, "click", function (b) {
                        b = b.point;
                        var c = b.drillId, e;
                        c && (e = a.nodeMap[a.rootNode].name || a.rootNode, b.setState(""), a.drillToNode(c), a.showDrillUpButton(e))
                    })
                },
                drillToByGroup: function (a) {
                    var b = !1;
                    1 !== a.node.level - this.nodeMap[this.rootNode].level || a.node.isLeaf || (b = a.id);
                    return b
                },
                drillToByLeaf: function (a) {
                    var b = !1;
                    if (a.node.parent !== this.rootNode && a.node.isLeaf)for (a =
                                                                                  a.node; !b;)a = this.nodeMap[a.parent], a.parent === this.rootNode && (b = a.id);
                    return b
                },
                drillUp: function () {
                    var a = null;
                    this.rootNode && (a = this.nodeMap[this.rootNode], a = null !== a.parent ? this.nodeMap[a.parent] : this.nodeMap[""]);
                    null !== a && (this.drillToNode(a.id), "" === a.id ? this.drillUpButton = this.drillUpButton.destroy() : (a = this.nodeMap[a.parent], this.showDrillUpButton(a.name || a.id)))
                },
                drillToNode: function (a) {
                    this.options.rootId = a;
                    this.isDirty = !0;
                    this.chart.redraw()
                },
                showDrillUpButton: function (a) {
                    var b = this;
                    a = a ||
                        "\x3c Back";
                    var c = b.options.drillUpButton, e, d;
                    c.text && (a = c.text);
                    this.drillUpButton ? this.drillUpButton.attr({text: a}).align() : (d = (e = c.theme) && e.states, this.drillUpButton = this.chart.renderer.button(a, null, null, function () {
                        b.drillUp()
                    }, e, d && d.hover, d && d.select).attr({
                        align: c.position.align,
                        zIndex: 7
                    }).add().align(c.position, !1, c.relativeTo || "plotBox"))
                },
                buildKDTree: A,
                drawLegendSymbol: g.LegendSymbolMixin.drawRectangle,
                getExtremes: function () {
                    u.prototype.getExtremes.call(this, this.colorValueData);
                    this.valueMin =
                        this.dataMin;
                    this.valueMax = this.dataMax;
                    u.prototype.getExtremes.call(this)
                },
                getExtremesFromAll: !0,
                bindAxes: function () {
                    var a = {
                        endOnTick: !1,
                        gridLineWidth: 0,
                        lineWidth: 0,
                        min: 0,
                        dataMin: 0,
                        minPadding: 0,
                        max: 100,
                        dataMax: 100,
                        maxPadding: 0,
                        startOnTick: !1,
                        title: null,
                        tickPositions: []
                    };
                    u.prototype.bindAxes.call(this);
                    g.extend(this.yAxis.options, a);
                    g.extend(this.xAxis.options, a)
                }
            }, {
                getClassName: function () {
                    var a = g.Point.prototype.getClassName.call(this), b = this.series, c = b.options;
                    this.node.level <= b.nodeMap[b.rootNode].level ?
                        a += " highcharts-above-level" : this.node.isLeaf || k(c.interactByLeaf, !c.allowDrillToNode) ? this.node.isLeaf || (a += " highcharts-internal-node") : a += " highcharts-internal-node-interactive";
                    return a
                }, isValid: function () {
                    return E(this.value)
                }, setState: function (a) {
                    g.Point.prototype.setState.call(this, a);
                    this.graphic.attr({zIndex: "hover" === a ? 1 : 0})
                }, setVisible: t.pie.prototype.pointClass.prototype.setVisible
            })
    })(p)
});
