/*
 Highcharts JS v5.0.6 (2016-12-07)

 (c) 2009-2016 Torstein Honsi

 License: www.highcharts.com/license
 */
(function (w) {
    "object" === typeof module && module.exports ? module.exports = w : w(Highcharts)
})(function (w) {
    (function (a) {
        function l(a, c, d) {
            this.init(a, c, d)
        }

        var t = a.each, u = a.extend, f = a.merge, n = a.splat;
        u(l.prototype, {
            init: function (a, c, d) {
                var h = this, k = h.defaultOptions;
                h.chart = c;
                h.options = a = f(k, c.angular ? {background: {}} : void 0, a);
                (a = a.background) && t([].concat(n(a)).reverse(), function (c) {
                    var b = d.userOptions;
                    c = f(h.defaultBackgroundOptions, c);
                    d.options.plotBands.unshift(c);
                    b.plotBands = b.plotBands || [];
                    b.plotBands !==
                    d.options.plotBands && b.plotBands.unshift(c)
                })
            },
            defaultOptions: {center: ["50%", "50%"], size: "85%", startAngle: 0},
            defaultBackgroundOptions: {
                className: "highcharts-pane",
                shape: "circle",
                from: -Number.MAX_VALUE,
                innerRadius: 0,
                to: Number.MAX_VALUE,
                outerRadius: "105%"
            }
        });
        a.Pane = l
    })(w);
    (function (a) {
        var l = a.CenteredSeriesMixin, t = a.each, u = a.extend, f = a.map, n = a.merge, q = a.noop, c = a.Pane, d = a.pick, h = a.pInt, k = a.splat, p = a.wrap, b, e, m = a.Axis.prototype;
        a = a.Tick.prototype;
        b = {
            getOffset: q, redraw: function () {
                this.isDirty = !1
            }, render: function () {
                this.isDirty = !1
            }, setScale: q, setCategories: q, setTitle: q
        };
        e = {
            defaultRadialGaugeOptions: {
                labels: {align: "center", x: 0, y: null},
                minorGridLineWidth: 0,
                minorTickInterval: "auto",
                minorTickLength: 10,
                minorTickPosition: "inside",
                minorTickWidth: 1,
                tickLength: 10,
                tickPosition: "inside",
                tickWidth: 2,
                title: {rotation: 0},
                zIndex: 2
            },
            defaultRadialXOptions: {
                gridLineWidth: 1,
                labels: {align: null, distance: 15, x: 0, y: null},
                maxPadding: 0,
                minPadding: 0,
                showLastLabel: !1,
                tickLength: 0
            },
            defaultRadialYOptions: {
                gridLineInterpolation: "circle", labels: {
                    align: "right",
                    x: -3, y: -2
                }, showLastLabel: !1, title: {x: 4, text: null, rotation: 90}
            },
            setOptions: function (b) {
                b = this.options = n(this.defaultOptions, this.defaultRadialOptions, b);
                b.plotBands || (b.plotBands = [])
            },
            getOffset: function () {
                m.getOffset.call(this);
                this.chart.axisOffset[this.side] = 0;
                this.center = this.pane.center = l.getCenter.call(this.pane)
            },
            getLinePath: function (b, c) {
                b = this.center;
                var r = this.chart, g = d(c, b[2] / 2 - this.offset);
                this.isCircular || void 0 !== c ? c = this.chart.renderer.symbols.arc(this.left + b[0], this.top + b[1], g, g, {
                    start: this.startAngleRad,
                    end: this.endAngleRad, open: !0, innerR: 0
                }) : (c = this.postTranslate(this.angleRad, g), c = ["M", b[0] + r.plotLeft, b[1] + r.plotTop, "L", c.x, c.y]);
                return c
            },
            setAxisTranslation: function () {
                m.setAxisTranslation.call(this);
                this.center && (this.transA = this.isCircular ? (this.endAngleRad - this.startAngleRad) / (this.max - this.min || 1) : this.center[2] / 2 / (this.max - this.min || 1), this.minPixelPadding = this.isXAxis ? this.transA * this.minPointOffset : 0)
            },
            beforeSetTickPositions: function () {
                if (this.autoConnect = this.isCircular && void 0 === d(this.userMax,
                            this.options.max) && this.endAngleRad - this.startAngleRad === 2 * Math.PI)this.max += this.categories && 1 || this.pointRange || this.closestPointRange || 0
            },
            setAxisSize: function () {
                m.setAxisSize.call(this);
                this.isRadial && (this.center = this.pane.center = l.getCenter.call(this.pane), this.isCircular && (this.sector = this.endAngleRad - this.startAngleRad), this.len = this.width = this.height = this.center[2] * d(this.sector, 1) / 2)
            },
            getPosition: function (b, c) {
                return this.postTranslate(this.isCircular ? this.translate(b) : this.angleRad, d(this.isCircular ?
                        c : this.translate(b), this.center[2] / 2) - this.offset)
            },
            postTranslate: function (b, c) {
                var d = this.chart, g = this.center;
                b = this.startAngleRad + b;
                return {x: d.plotLeft + g[0] + Math.cos(b) * c, y: d.plotTop + g[1] + Math.sin(b) * c}
            },
            getPlotBandPath: function (b, c, e) {
                var g = this.center, r = this.startAngleRad, k = g[2] / 2, a = [d(e.outerRadius, "100%"), e.innerRadius, d(e.thickness, 10)], m = Math.min(this.offset, 0), p = /%$/, v, n = this.isCircular;
                "polygon" === this.options.gridLineInterpolation ? g = this.getPlotLinePath(b).concat(this.getPlotLinePath(c,
                    !0)) : (b = Math.max(b, this.min), c = Math.min(c, this.max), n || (a[0] = this.translate(b), a[1] = this.translate(c)), a = f(a, function (b) {
                    p.test(b) && (b = h(b, 10) * k / 100);
                    return b
                }), "circle" !== e.shape && n ? (b = r + this.translate(b), c = r + this.translate(c)) : (b = -Math.PI / 2, c = 1.5 * Math.PI, v = !0), a[0] -= m, a[2] -= m, g = this.chart.renderer.symbols.arc(this.left + g[0], this.top + g[1], a[0], a[0], {
                    start: Math.min(b, c),
                    end: Math.max(b, c),
                    innerR: d(a[1], a[0] - a[2]),
                    open: v
                }));
                return g
            },
            getPlotLinePath: function (b, c) {
                var d = this, e = d.center, g = d.chart, h = d.getPosition(b),
                    a, r, k;
                d.isCircular ? k = ["M", e[0] + g.plotLeft, e[1] + g.plotTop, "L", h.x, h.y] : "circle" === d.options.gridLineInterpolation ? (b = d.translate(b)) && (k = d.getLinePath(0, b)) : (t(g.xAxis, function (b) {
                    b.pane === d.pane && (a = b)
                }), k = [], b = d.translate(b), e = a.tickPositions, a.autoConnect && (e = e.concat([e[0]])), c && (e = [].concat(e).reverse()), t(e, function (c, d) {
                    r = a.getPosition(c, b);
                    k.push(d ? "L" : "M", r.x, r.y)
                }));
                return k
            },
            getTitlePosition: function () {
                var b = this.center, c = this.chart, d = this.options.title;
                return {
                    x: c.plotLeft + b[0] + (d.x || 0),
                    y: c.plotTop + b[1] - {high: .5, middle: .25, low: 0}[d.align] * b[2] + (d.y || 0)
                }
            }
        };
        p(m, "init", function (h, g, a) {
            var r = g.angular, m = g.polar, p = a.isX, v = r && p, f, q = g.options, l = a.pane || 0;
            if (r) {
                if (u(this, v ? b : e), f = !p)this.defaultRadialOptions = this.defaultRadialGaugeOptions
            } else m && (u(this, e), this.defaultRadialOptions = (f = p) ? this.defaultRadialXOptions : n(this.defaultYAxisOptions, this.defaultRadialYOptions));
            r || m ? (this.isRadial = !0, g.inverted = !1, q.chart.zoomType = null) : this.isRadial = !1;
            h.call(this, g, a);
            v || !r && !m || (h = this.options,
            g.panes || (g.panes = []), this.pane = g = g.panes[l] = g.panes[l] || new c(k(q.pane)[l], g, this), g = g.options, this.angleRad = (h.angle || 0) * Math.PI / 180, this.startAngleRad = (g.startAngle - 90) * Math.PI / 180, this.endAngleRad = (d(g.endAngle, g.startAngle + 360) - 90) * Math.PI / 180, this.offset = h.offset || 0, this.isCircular = f)
        });
        p(m, "autoLabelAlign", function (b) {
            if (!this.isRadial)return b.apply(this, [].slice.call(arguments, 1))
        });
        p(a, "getPosition", function (b, c, d, e, h) {
            var a = this.axis;
            return a.getPosition ? a.getPosition(d) : b.call(this, c,
                d, e, h)
        });
        p(a, "getLabelPosition", function (b, c, e, h, a, k, m, p, n) {
            var g = this.axis, r = k.y, v = 20, z = k.align, f = (g.translate(this.pos) + g.startAngleRad + Math.PI / 2) / Math.PI * 180 % 360;
            g.isRadial ? (b = g.getPosition(this.pos, g.center[2] / 2 + d(k.distance, -25)), "auto" === k.rotation ? h.attr({rotation: f}) : null === r && (r = g.chart.renderer.fontMetrics(h.styles.fontSize).b - h.getBBox().height / 2), null === z && (g.isCircular ? (this.label.getBBox().width > g.len * g.tickInterval / (g.max - g.min) && (v = 0), z = f > v && f < 180 - v ? "left" : f > 180 + v && f < 360 - v ? "right" :
                "center") : z = "center", h.attr({align: z})), b.x += k.x, b.y += r) : b = b.call(this, c, e, h, a, k, m, p, n);
            return b
        });
        p(a, "getMarkPath", function (b, c, d, e, h, a, k) {
            var g = this.axis;
            g.isRadial ? (b = g.getPosition(this.pos, g.center[2] / 2 + e), c = ["M", c, d, "L", b.x, b.y]) : c = b.call(this, c, d, e, h, a, k);
            return c
        })
    })(w);
    (function (a) {
        var l = a.each, t = a.noop, u = a.pick, f = a.Series, n = a.seriesType, q = a.seriesTypes;
        n("arearange", "area", {
            marker: null,
            threshold: null,
            tooltip: {pointFormat: '\x3cspan class\x3d"highcharts-color-{series.colorIndex}"\x3e\u25cf\x3c/span\x3e {series.name}: \x3cb\x3e{point.low}\x3c/b\x3e - \x3cb\x3e{point.high}\x3c/b\x3e\x3cbr/\x3e'},
            trackByArea: !0,
            dataLabels: {align: null, verticalAlign: null, xLow: 0, xHigh: 0, yLow: 0, yHigh: 0},
            states: {hover: {halo: !1}}
        }, {
            pointArrayMap: ["low", "high"],
            dataLabelCollections: ["dataLabel", "dataLabelUpper"],
            toYData: function (c) {
                return [c.low, c.high]
            },
            pointValKey: "low",
            deferTranslatePolar: !0,
            highToXY: function (c) {
                var d = this.chart, h = this.xAxis.postTranslate(c.rectPlotX, this.yAxis.len - c.plotHigh);
                c.plotHighX = h.x - d.plotLeft;
                c.plotHigh = h.y - d.plotTop
            },
            translate: function () {
                var c = this, d = c.yAxis, h = !!c.modifyValue;
                q.area.prototype.translate.apply(c);
                l(c.points, function (a) {
                    var k = a.low, b = a.high, e = a.plotY;
                    null === b || null === k ? a.isNull = !0 : (a.plotLow = e, a.plotHigh = d.translate(h ? c.modifyValue(b, a) : b, 0, 1, 0, 1), h && (a.yBottom = a.plotHigh))
                });
                this.chart.polar && l(this.points, function (d) {
                    c.highToXY(d)
                })
            },
            getGraphPath: function (c) {
                var d = [], a = [], k, p = q.area.prototype.getGraphPath, b, e, m;
                m = this.options;
                var r = m.step;
                c = c || this.points;
                for (k = c.length; k--;)b = c[k], b.isNull || m.connectEnds || c[k + 1] && !c[k + 1].isNull || a.push({
                    plotX: b.plotX,
                    plotY: b.plotY,
                    doCurve: !1
                }), e = {
                    polarPlotY: b.polarPlotY,
                    rectPlotX: b.rectPlotX,
                    yBottom: b.yBottom,
                    plotX: u(b.plotHighX, b.plotX),
                    plotY: b.plotHigh,
                    isNull: b.isNull
                }, a.push(e), d.push(e), b.isNull || m.connectEnds || c[k - 1] && !c[k - 1].isNull || a.push({
                    plotX: b.plotX,
                    plotY: b.plotY,
                    doCurve: !1
                });
                c = p.call(this, c);
                r && (!0 === r && (r = "left"), m.step = {left: "right", center: "center", right: "left"}[r]);
                d = p.call(this, d);
                a = p.call(this, a);
                m.step = r;
                m = [].concat(c, d);
                this.chart.polar || "M" !== a[0] || (a[0] = "L");
                this.graphPath = m;
                this.areaPath = this.areaPath.concat(c, a);
                m.isArea = !0;
                m.xMap = c.xMap;
                this.areaPath.xMap =
                    c.xMap;
                return m
            },
            drawDataLabels: function () {
                var c = this.data, d = c.length, a, k = [], p = f.prototype, b = this.options.dataLabels, e = b.align, m = b.verticalAlign, r = b.inside, g, v, n = this.chart.inverted;
                if (b.enabled || this._hasPointLabels) {
                    for (a = d; a--;)if (g = c[a])v = r ? g.plotHigh < g.plotLow : g.plotHigh > g.plotLow, g.y = g.high, g._plotY = g.plotY, g.plotY = g.plotHigh, k[a] = g.dataLabel, g.dataLabel = g.dataLabelUpper, g.below = v, n ? e || (b.align = v ? "right" : "left") : m || (b.verticalAlign = v ? "top" : "bottom"), b.x = b.xHigh, b.y = b.yHigh;
                    p.drawDataLabels &&
                    p.drawDataLabels.apply(this, arguments);
                    for (a = d; a--;)if (g = c[a])v = r ? g.plotHigh < g.plotLow : g.plotHigh > g.plotLow, g.dataLabelUpper = g.dataLabel, g.dataLabel = k[a], g.y = g.low, g.plotY = g._plotY, g.below = !v, n ? e || (b.align = v ? "left" : "right") : m || (b.verticalAlign = v ? "bottom" : "top"), b.x = b.xLow, b.y = b.yLow;
                    p.drawDataLabels && p.drawDataLabels.apply(this, arguments)
                }
                b.align = e;
                b.verticalAlign = m
            },
            alignDataLabel: function () {
                q.column.prototype.alignDataLabel.apply(this, arguments)
            },
            setStackedPoints: t,
            getSymbol: t,
            drawPoints: t
        })
    })(w);
    (function (a) {
        var l = a.seriesType;
        l("areasplinerange", "arearange", null, {getPointSpline: a.seriesTypes.spline.prototype.getPointSpline})
    })(w);
    (function (a) {
        var l = a.defaultPlotOptions, t = a.each, u = a.merge, f = a.noop, n = a.pick, q = a.seriesType, c = a.seriesTypes.column.prototype;
        q("columnrange", "arearange", u(l.column, l.arearange, {lineWidth: 1, pointRange: null}), {
            translate: function () {
                var a = this, h = a.yAxis, k = a.xAxis, p = k.startAngleRad, b, e = a.chart, m = a.xAxis.isRadial, r;
                c.translate.apply(a);
                t(a.points, function (c) {
                    var d = c.shapeArgs,
                        g = a.options.minPointLength, f, l;
                    c.plotHigh = r = h.translate(c.high, 0, 1, 0, 1);
                    c.plotLow = c.plotY;
                    l = r;
                    f = n(c.rectPlotY, c.plotY) - r;
                    Math.abs(f) < g ? (g -= f, f += g, l -= g / 2) : 0 > f && (f *= -1, l -= f);
                    m ? (b = c.barX + p, c.shapeType = "path", c.shapeArgs = {d: a.polarArc(l + f, l, b, b + c.pointWidth)}) : (d.height = f, d.y = l, c.tooltipPos = e.inverted ? [h.len + h.pos - e.plotLeft - l - f / 2, k.len + k.pos - e.plotTop - d.x - d.width / 2, f] : [k.left - e.plotLeft + d.x + d.width / 2, h.pos - e.plotTop + l + f / 2, f])
                })
            },
            directTouch: !0,
            trackerGroups: ["group", "dataLabelsGroup"],
            drawGraph: f,
            crispCol: c.crispCol,
            drawPoints: c.drawPoints,
            drawTracker: c.drawTracker,
            getColumnMetrics: c.getColumnMetrics,
            animate: function () {
                return c.animate.apply(this, arguments)
            },
            polarArc: function () {
                return c.polarArc.apply(this, arguments)
            },
            pointAttribs: c.pointAttribs
        })
    })(w);
    (function (a) {
        var l = a.each, t = a.isNumber, u = a.merge, f = a.pick, n = a.pInt, q = a.Series, c = a.seriesType, d = a.TrackerMixin;
        c("gauge", "line", {
            dataLabels: {enabled: !0, defer: !1, y: 15, borderRadius: 3, crop: !1, verticalAlign: "top", zIndex: 2},
            dial: {},
            pivot: {},
            tooltip: {headerFormat: ""},
            showInLegend: !1
        }, {
            angular: !0,
            directTouch: !0,
            drawGraph: a.noop,
            fixedBox: !0,
            forceDL: !0,
            noSharedTooltip: !0,
            trackerGroups: ["group", "dataLabelsGroup"],
            translate: function () {
                var c = this.yAxis, a = this.options, d = c.center;
                this.generatePoints();
                l(this.points, function (b) {
                    var e = u(a.dial, b.dial), h = n(f(e.radius, 80)) * d[2] / 200, k = n(f(e.baseLength, 70)) * h / 100, g = n(f(e.rearLength, 10)) * h / 100, p = e.baseWidth || 3, l = e.topWidth || 1, q = a.overshoot, x = c.startAngleRad + c.translate(b.y, null, null, null, !0);
                    t(q) ? (q = q / 180 * Math.PI, x = Math.max(c.startAngleRad -
                        q, Math.min(c.endAngleRad + q, x))) : !1 === a.wrap && (x = Math.max(c.startAngleRad, Math.min(c.endAngleRad, x)));
                    x = 180 * x / Math.PI;
                    b.shapeType = "path";
                    b.shapeArgs = {
                        d: e.path || ["M", -g, -p / 2, "L", k, -p / 2, h, -l / 2, h, l / 2, k, p / 2, -g, p / 2, "z"],
                        translateX: d[0],
                        translateY: d[1],
                        rotation: x
                    };
                    b.plotX = d[0];
                    b.plotY = d[1]
                })
            },
            drawPoints: function () {
                var c = this, a = c.yAxis.center, d = c.pivot, b = c.options, e = b.pivot, m = c.chart.renderer;
                l(c.points, function (a) {
                    var d = a.graphic, e = a.shapeArgs, h = e.d;
                    u(b.dial, a.dial);
                    d ? (d.animate(e), e.d = h) : a.graphic = m[a.shapeType](e).attr({
                        rotation: e.rotation,
                        zIndex: 1
                    }).addClass("highcharts-dial").add(c.group)
                });
                d ? d.animate({
                    translateX: a[0],
                    translateY: a[1]
                }) : c.pivot = m.circle(0, 0, f(e.radius, 5)).attr({zIndex: 2}).addClass("highcharts-pivot").translate(a[0], a[1]).add(c.group)
            },
            animate: function (c) {
                var a = this;
                c || (l(a.points, function (c) {
                    var b = c.graphic;
                    b && (b.attr({rotation: 180 * a.yAxis.startAngleRad / Math.PI}), b.animate({rotation: c.shapeArgs.rotation}, a.options.animation))
                }), a.animate = null)
            },
            render: function () {
                this.group = this.plotGroup("group", "series", this.visible ?
                    "visible" : "hidden", this.options.zIndex, this.chart.seriesGroup);
                q.prototype.render.call(this);
                this.group.clip(this.chart.clipRect)
            },
            setData: function (c, a) {
                q.prototype.setData.call(this, c, !1);
                this.processData();
                this.generatePoints();
                f(a, !0) && this.chart.redraw()
            },
            drawTracker: d && d.drawTrackerPoint
        }, {
            setState: function (c) {
                this.state = c
            }
        })
    })(w);
    (function (a) {
        var l = a.each, t = a.noop, u = a.seriesType, f = a.seriesTypes;
        u("boxplot", "column", {
            threshold: null,
            tooltip: {pointFormat: '\x3cspan class\x3d"highcharts-color-{point.colorIndex}"\x3e\u25cf\x3c/span\x3e \x3cb\x3e {series.name}\x3c/b\x3e\x3cbr/\x3eMaximum: {point.high}\x3cbr/\x3eUpper quartile: {point.q3}\x3cbr/\x3eMedian: {point.median}\x3cbr/\x3eLower quartile: {point.q1}\x3cbr/\x3eMinimum: {point.low}\x3cbr/\x3e'},
            whiskerLength: "50%"
        }, {
            pointArrayMap: ["low", "q1", "median", "q3", "high"], toYData: function (a) {
                return [a.low, a.q1, a.median, a.q3, a.high]
            }, pointValKey: "high", drawDataLabels: t, translate: function () {
                var a = this.yAxis, q = this.pointArrayMap;
                f.column.prototype.translate.apply(this);
                l(this.points, function (c) {
                    l(q, function (d) {
                        null !== c[d] && (c[d + "Plot"] = a.translate(c[d], 0, 1, 0, 1))
                    })
                })
            }, drawPoints: function () {
                var a = this, f = a.chart.renderer, c, d, h, k, p, b, e = 0, m, r, g, v, z = !1 !== a.doQuartiles, t, x = a.options.whiskerLength;
                l(a.points,
                    function (l) {
                        var n = l.graphic, q = n ? "animate" : "attr", u = l.shapeArgs;
                        void 0 !== l.plotY && (m = u.width, r = Math.floor(u.x), g = r + m, v = Math.round(m / 2), c = Math.floor(z ? l.q1Plot : l.lowPlot), d = Math.floor(z ? l.q3Plot : l.lowPlot), h = Math.floor(l.highPlot), k = Math.floor(l.lowPlot), n || (l.graphic = n = f.g("point").add(a.group), l.stem = f.path().addClass("highcharts-boxplot-stem").add(n), x && (l.whiskers = f.path().addClass("highcharts-boxplot-whisker").add(n)), z && (l.box = f.path(void 0).addClass("highcharts-boxplot-box").add(n)), l.medianShape =
                            f.path(void 0).addClass("highcharts-boxplot-median").add(n)), b = l.stem.strokeWidth() % 2 / 2, e = r + v + b, l.stem[q]({d: ["M", e, d, "L", e, h, "M", e, c, "L", e, k]}), z && (b = l.box.strokeWidth() % 2 / 2, c = Math.floor(c) + b, d = Math.floor(d) + b, r += b, g += b, l.box[q]({d: ["M", r, d, "L", r, c, "L", g, c, "L", g, d, "L", r, d, "z"]})), x && (b = l.whiskers.strokeWidth() % 2 / 2, h += b, k += b, t = /%$/.test(x) ? v * parseFloat(x) / 100 : x / 2, l.whiskers[q]({d: ["M", e - t, h, "L", e + t, h, "M", e - t, k, "L", e + t, k]})), p = Math.round(l.medianPlot), b = l.medianShape.strokeWidth() % 2 / 2, p += b, l.medianShape[q]({
                            d: ["M",
                                r, p, "L", g, p]
                        }))
                    })
            }, setStackedPoints: t
        })
    })(w);
    (function (a) {
        var l = a.each, t = a.noop, u = a.seriesType, f = a.seriesTypes;
        u("errorbar", "boxplot", {
            grouping: !1,
            linkedTo: ":previous",
            tooltip: {pointFormat: '\x3cspan style\x3d"color:{point.color}"\x3e\u25cf\x3c/span\x3e {series.name}: \x3cb\x3e{point.low}\x3c/b\x3e - \x3cb\x3e{point.high}\x3c/b\x3e\x3cbr/\x3e'},
            whiskerWidth: null
        }, {
            type: "errorbar", pointArrayMap: ["low", "high"], toYData: function (a) {
                return [a.low, a.high]
            }, pointValKey: "high", doQuartiles: !1, drawDataLabels: f.arearange ?
                function () {
                    var a = this.pointValKey;
                    f.arearange.prototype.drawDataLabels.call(this);
                    l(this.data, function (l) {
                        l.y = l[a]
                    })
                } : t, getColumnMetrics: function () {
                return this.linkedParent && this.linkedParent.columnMetrics || f.column.prototype.getColumnMetrics.call(this)
            }
        })
    })(w);
    (function (a) {
        var l = a.correctFloat, t = a.isNumber, u = a.pick, f = a.Point, n = a.Series, q = a.seriesType, c = a.seriesTypes;
        q("waterfall", "column", {dataLabels: {inside: !0}}, {
            pointValKey: "y", translate: function () {
                var a = this.options, h = this.yAxis, k, p, b, e, m, r, g,
                    f, n, q = u(a.minPointLength, 5), t = a.threshold, w = a.stacking, A = 0, y = 0, B;
                c.column.prototype.translate.apply(this);
                g = f = t;
                p = this.points;
                k = 0;
                for (a = p.length; k < a; k++)b = p[k], r = this.processedYData[k], e = b.shapeArgs, m = w && h.stacks[(this.negStacks && r < t ? "-" : "") + this.stackKey], B = this.getStackIndicator(B, b.x), n = m ? m[b.x].points[this.index + "," + k + "," + B.index] : [0, r], b.isSum ? b.y = l(r) : b.isIntermediateSum && (b.y = l(r - f)), m = Math.max(g, g + b.y) + n[0], e.y = h.toPixels(m, !0), b.isSum ? (e.y = h.toPixels(n[1], !0), e.height = Math.min(h.toPixels(n[0],
                        !0), h.len) - e.y + A + y) : b.isIntermediateSum ? (e.y = h.toPixels(n[1], !0), e.height = Math.min(h.toPixels(f, !0), h.len) - e.y + A + y, f = n[1]) : (e.height = 0 < r ? h.toPixels(g, !0) - e.y : h.toPixels(g, !0) - h.toPixels(g - r, !0), g += r), 0 > e.height && (e.y += e.height, e.height *= -1), b.plotY = e.y = Math.round(e.y) - this.borderWidth % 2 / 2, e.height = Math.max(Math.round(e.height), .001), b.yBottom = e.y + e.height, e.y -= y, e.height <= q && !b.isNull && (e.height = q, 0 > b.y ? y -= q : A += q), e.y -= A, e = b.plotY - y - A + (b.negative && 0 <= y ? e.height : 0), this.chart.inverted ? b.tooltipPos[0] =
                    h.len - e : b.tooltipPos[1] = e
            }, processData: function (c) {
                var a = this.yData, d = this.options.data, p, b = a.length, e, m, r, g, f, q;
                m = e = r = g = this.options.threshold || 0;
                for (q = 0; q < b; q++)f = a[q], p = d && d[q] ? d[q] : {}, "sum" === f || p.isSum ? a[q] = l(m) : "intermediateSum" === f || p.isIntermediateSum ? a[q] = l(e) : (m += f, e += f), r = Math.min(m, r), g = Math.max(m, g);
                n.prototype.processData.call(this, c);
                this.dataMin = r;
                this.dataMax = g
            }, toYData: function (a) {
                return a.isSum ? 0 === a.x ? null : "sum" : a.isIntermediateSum ? 0 === a.x ? null : "intermediateSum" : a.y
            }, getGraphPath: function () {
                return ["M",
                    0, 0]
            }, getCrispPath: function () {
                var a = this.data, c = a.length, k = this.graph.strokeWidth() + this.borderWidth, k = Math.round(k) % 2 / 2, p = [], b, e, m;
                for (m = 1; m < c; m++)e = a[m].shapeArgs, b = a[m - 1].shapeArgs, e = ["M", b.x + b.width, b.y + k, "L", e.x, b.y + k], 0 > a[m - 1].y && (e[2] += b.height, e[5] += b.height), p = p.concat(e);
                return p
            }, drawGraph: function () {
                n.prototype.drawGraph.call(this);
                this.graph.attr({d: this.getCrispPath()})
            }, getExtremes: a.noop
        }, {
            getClassName: function () {
                var a = f.prototype.getClassName.call(this);
                this.isSum ? a += " highcharts-sum" :
                this.isIntermediateSum && (a += " highcharts-intermediate-sum");
                return a
            }, isValid: function () {
                return t(this.y, !0) || this.isSum || this.isIntermediateSum
            }
        })
    })(w);
    (function (a) {
        var l = a.Series, t = a.seriesType, u = a.seriesTypes;
        t("polygon", "scatter", {
            marker: {enabled: !1, states: {hover: {enabled: !1}}},
            stickyTracking: !1,
            tooltip: {followPointer: !0, pointFormat: ""},
            trackByArea: !0
        }, {
            type: "polygon",
            getGraphPath: function () {
                for (var a = l.prototype.getGraphPath.call(this), n = a.length + 1; n--;)(n === a.length || "M" === a[n]) && 0 < n && a.splice(n,
                    0, "z");
                return this.areaPath = a
            },
            drawGraph: function () {
                u.area.prototype.drawGraph.call(this)
            },
            drawLegendSymbol: a.LegendSymbolMixin.drawRectangle,
            drawTracker: l.prototype.drawTracker,
            setStackedPoints: a.noop
        })
    })(w);
    (function (a) {
        var l = a.arrayMax, t = a.arrayMin, u = a.Axis, f = a.each, n = a.isNumber, q = a.noop, c = a.pick, d = a.pInt, h = a.Point, k = a.seriesType, p = a.seriesTypes;
        k("bubble", "scatter", {
                dataLabels: {
                    formatter: function () {
                        return this.point.z
                    }, inside: !0, verticalAlign: "middle"
                },
                marker: {radius: null, states: {hover: {radiusPlus: 0}}},
                minSize: 8,
                maxSize: "20%",
                softThreshold: !1,
                states: {hover: {halo: {size: 5}}},
                tooltip: {pointFormat: "({point.x}, {point.y}), Size: {point.z}"},
                turboThreshold: 0,
                zThreshold: 0,
                zoneAxis: "z"
            }, {
                pointArrayMap: ["y", "z"],
                parallelArrays: ["x", "y", "z"],
                trackerGroups: ["group", "dataLabelsGroup"],
                bubblePadding: !0,
                zoneAxis: "z",
                markerAttribs: null,
                getRadii: function (a, c, d, h) {
                    var b, e, m, k = this.zData, p = [], r = this.options, l = "width" !== r.sizeBy, f = r.zThreshold, n = c - a;
                    e = 0;
                    for (b = k.length; e < b; e++)m = k[e], r.sizeByAbsoluteValue && null !==
                    m && (m = Math.abs(m - f), c = Math.max(c - f, Math.abs(a - f)), a = 0), null === m ? m = null : m < a ? m = d / 2 - 1 : (m = 0 < n ? (m - a) / n : .5, l && 0 <= m && (m = Math.sqrt(m)), m = Math.ceil(d + m * (h - d)) / 2), p.push(m);
                    this.radii = p
                },
                animate: function (a) {
                    var b = this.options.animation;
                    a || (f(this.points, function (a) {
                        var c = a.graphic;
                        a = a.shapeArgs;
                        c && a && (c.attr("r", 1), c.animate({r: a.r}, b))
                    }), this.animate = null)
                },
                translate: function () {
                    var a, c = this.data, d, h, g = this.radii;
                    p.scatter.prototype.translate.call(this);
                    for (a = c.length; a--;)d = c[a], h = g ? g[a] : 0, n(h) && h >= this.minPxSize /
                    2 ? (d.shapeType = "circle", d.shapeArgs = {
                        x: d.plotX,
                        y: d.plotY,
                        r: h
                    }, d.dlBox = {
                        x: d.plotX - h,
                        y: d.plotY - h,
                        width: 2 * h,
                        height: 2 * h
                    }) : d.shapeArgs = d.plotY = d.dlBox = void 0
                },
                drawLegendSymbol: function (a, c) {
                    var b = this.chart.renderer, d = b.fontMetrics(a.itemStyle && a.itemStyle.fontSize, c.legendItem).f / 2;
                    c.legendSymbol = b.circle(d, a.baseline - d, d).attr({zIndex: 3}).add(c.legendGroup);
                    c.legendSymbol.isMarker = !0
                },
                drawPoints: p.column.prototype.drawPoints,
                alignDataLabel: p.column.prototype.alignDataLabel,
                buildKDTree: q,
                applyZones: q
            },
            {
                haloPath: function (a) {
                    return h.prototype.haloPath.call(this, 0 === a ? 0 : this.shapeArgs.r + a)
                }, ttBelow: !1
            });
        u.prototype.beforePadding = function () {
            var a = this, e = this.len, h = this.chart, k = 0, g = e, p = this.isXAxis, q = p ? "xData" : "yData", u = this.min, x = {}, w = Math.min(h.plotWidth, h.plotHeight), A = Number.MAX_VALUE, y = -Number.MAX_VALUE, B = this.max - u, C = e / B, D = [];
            f(this.series, function (b) {
                var e = b.options;
                !b.bubblePadding || !b.visible && h.options.chart.ignoreHiddenSeries || (a.allowZoomOutside = !0, D.push(b), p && (f(["minSize", "maxSize"],
                    function (a) {
                        var c = e[a], b = /%$/.test(c), c = d(c);
                        x[a] = b ? w * c / 100 : c
                    }), b.minPxSize = x.minSize, b.maxPxSize = Math.max(x.maxSize, x.minSize), b = b.zData, b.length && (A = c(e.zMin, Math.min(A, Math.max(t(b), !1 === e.displayNegative ? e.zThreshold : -Number.MAX_VALUE))), y = c(e.zMax, Math.max(y, l(b))))))
            });
            f(D, function (c) {
                var b = c[q], d = b.length, e;
                p && c.getRadii(A, y, c.minPxSize, c.maxPxSize);
                if (0 < B)for (; d--;)n(b[d]) && a.dataMin <= b[d] && b[d] <= a.dataMax && (e = c.radii[d], k = Math.min((b[d] - u) * C - e, k), g = Math.max((b[d] - u) * C + e, g))
            });
            D.length && 0 <
            B && !this.isLog && (g -= e, C *= (e + k - g) / e, f([["min", "userMin", k], ["max", "userMax", g]], function (b) {
                void 0 === c(a.options[b[0]], a[b[1]]) && (a[b[0]] += b[2] / C)
            }))
        }
    })(w);
    (function (a) {
        function l(a, d) {
            var c = this.chart, k = this.options.animation, p = this.group, b = this.markerGroup, e = this.xAxis.center, m = c.plotLeft, f = c.plotTop;
            c.polar ? c.renderer.isSVG && (!0 === k && (k = {}), d ? (a = {
                translateX: e[0] + m,
                translateY: e[1] + f,
                scaleX: .001,
                scaleY: .001
            }, p.attr(a), b && b.attr(a)) : (a = {
                translateX: m,
                translateY: f,
                scaleX: 1,
                scaleY: 1
            }, p.animate(a, k), b &&
            b.animate(a, k), this.animate = null)) : a.call(this, d)
        }

        var t = a.each, u = a.pick, f = a.seriesTypes, n = a.wrap, q = a.Series.prototype;
        a = a.Pointer.prototype;
        q.searchPointByAngle = function (a) {
            var c = this.chart, h = this.xAxis.pane.center;
            return this.searchKDTree({clientX: 180 + -180 / Math.PI * Math.atan2(a.chartX - h[0] - c.plotLeft, a.chartY - h[1] - c.plotTop)})
        };
        n(q, "buildKDTree", function (a) {
            this.chart.polar && (this.kdByAngle ? this.searchPoint = this.searchPointByAngle : this.kdDimensions = 2);
            a.apply(this)
        });
        q.toXY = function (a) {
            var c, h = this.chart,
                k = a.plotX;
            c = a.plotY;
            a.rectPlotX = k;
            a.rectPlotY = c;
            c = this.xAxis.postTranslate(a.plotX, this.yAxis.len - c);
            a.plotX = a.polarPlotX = c.x - h.plotLeft;
            a.plotY = a.polarPlotY = c.y - h.plotTop;
            this.kdByAngle ? (h = (k / Math.PI * 180 + this.xAxis.pane.options.startAngle) % 360, 0 > h && (h += 360), a.clientX = h) : a.clientX = a.plotX
        };
        f.spline && n(f.spline.prototype, "getPointSpline", function (a, d, h, k) {
            var c, b, e, m, f, g, l;
            this.chart.polar ? (c = h.plotX, b = h.plotY, a = d[k - 1], e = d[k + 1], this.connectEnds && (a || (a = d[d.length - 2]), e || (e = d[1])), a && e && (m = a.plotX,
                f = a.plotY, d = e.plotX, g = e.plotY, m = (1.5 * c + m) / 2.5, f = (1.5 * b + f) / 2.5, e = (1.5 * c + d) / 2.5, l = (1.5 * b + g) / 2.5, d = Math.sqrt(Math.pow(m - c, 2) + Math.pow(f - b, 2)), g = Math.sqrt(Math.pow(e - c, 2) + Math.pow(l - b, 2)), m = Math.atan2(f - b, m - c), f = Math.atan2(l - b, e - c), l = Math.PI / 2 + (m + f) / 2, Math.abs(m - l) > Math.PI / 2 && (l -= Math.PI), m = c + Math.cos(l) * d, f = b + Math.sin(l) * d, e = c + Math.cos(Math.PI + l) * g, l = b + Math.sin(Math.PI + l) * g, h.rightContX = e, h.rightContY = l), k ? (h = ["C", a.rightContX || a.plotX, a.rightContY || a.plotY, m || c, f || b, c, b], a.rightContX = a.rightContY = null) :
                h = ["M", c, b]) : h = a.call(this, d, h, k);
            return h
        });
        n(q, "translate", function (a) {
            var c = this.chart;
            a.call(this);
            if (c.polar && (this.kdByAngle = c.tooltip && c.tooltip.shared, !this.preventPostTranslate))for (a = this.points, c = a.length; c--;)this.toXY(a[c])
        });
        n(q, "getGraphPath", function (a, d) {
            var c = this, k, f;
            if (this.chart.polar) {
                d = d || this.points;
                for (k = 0; k < d.length; k++)if (!d[k].isNull) {
                    f = k;
                    break
                }
                !1 !== this.options.connectEnds && void 0 !== f && (this.connectEnds = !0, d.splice(d.length, 0, d[f]));
                t(d, function (a) {
                    void 0 === a.polarPlotY &&
                    c.toXY(a)
                })
            }
            return a.apply(this, [].slice.call(arguments, 1))
        });
        n(q, "animate", l);
        f.column && (f = f.column.prototype, f.polarArc = function (a, d, h, k) {
            var c = this.xAxis.center, b = this.yAxis.len;
            return this.chart.renderer.symbols.arc(c[0], c[1], b - d, null, {start: h, end: k, innerR: b - u(a, b)})
        }, n(f, "animate", l), n(f, "translate", function (a) {
            var c = this.xAxis, h = c.startAngleRad, k, f, b;
            this.preventPostTranslate = !0;
            a.call(this);
            if (c.isRadial)for (k = this.points, b = k.length; b--;)f = k[b], a = f.barX + h, f.shapeType = "path", f.shapeArgs = {
                d: this.polarArc(f.yBottom,
                    f.plotY, a, a + f.pointWidth)
            }, this.toXY(f), f.tooltipPos = [f.plotX, f.plotY], f.ttBelow = f.plotY > c.center[1]
        }), n(f, "alignDataLabel", function (a, d, f, k, l, b) {
            this.chart.polar ? (a = d.rectPlotX / Math.PI * 180, null === k.align && (k.align = 20 < a && 160 > a ? "left" : 200 < a && 340 > a ? "right" : "center"), null === k.verticalAlign && (k.verticalAlign = 45 > a || 315 < a ? "bottom" : 135 < a && 225 > a ? "top" : "middle"), q.alignDataLabel.call(this, d, f, k, l, b)) : a.call(this, d, f, k, l, b)
        }));
        n(a, "getCoordinates", function (a, d) {
            var c = this.chart, f = {xAxis: [], yAxis: []};
            c.polar ?
                t(c.axes, function (a) {
                    var b = a.isXAxis, e = a.center, h = d.chartX - e[0] - c.plotLeft, e = d.chartY - e[1] - c.plotTop;
                    f[b ? "xAxis" : "yAxis"].push({
                        axis: a,
                        value: a.translate(b ? Math.PI - Math.atan2(h, e) : Math.sqrt(Math.pow(h, 2) + Math.pow(e, 2)), !0)
                    })
                }) : f = a.call(this, d);
            return f
        })
    })(w)
});
