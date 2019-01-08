/*
 Highcharts JS v5.0.6 (2016-12-07)

 (c) 2009-2016 Torstein Honsi

 License: www.highcharts.com/license
 */
(function (n) {
    "object" === typeof module && module.exports ? module.exports = n : n(Highcharts)
})(function (n) {
    (function (c) {
        var k = c.Axis, r = c.Chart, m = c.color, l, e = c.each, v = c.extend, w = c.isNumber, p = c.Legend, f = c.LegendSymbolMixin, x = c.noop, q = c.merge, u = c.pick, t = c.wrap;
        l = c.ColorAxis = function () {
            this.init.apply(this, arguments)
        };
        v(l.prototype, k.prototype);
        v(l.prototype, {
            defaultColorAxisOptions: {
                lineWidth: 0,
                minPadding: 0,
                maxPadding: 0,
                gridLineWidth: 1,
                tickPixelInterval: 72,
                startOnTick: !0,
                endOnTick: !0,
                offset: 0,
                marker: {
                    animation: {duration: 50},
                    width: .01, color: "#999999"
                },
                labels: {overflow: "justify"},
                minColor: "#e6ebf5",
                maxColor: "#003399",
                tickLength: 5,
                showInLegend: !0
            },
            keepProps: ["legendGroup", "legendItem", "legendSymbol"].concat(k.prototype.keepProps),
            init: function (a, b) {
                var d = "vertical" !== a.options.legend.layout, g;
                this.coll = "colorAxis";
                g = q(this.defaultColorAxisOptions, {side: d ? 2 : 1, reversed: !d}, b, {
                    opposite: !d,
                    showEmpty: !1,
                    title: null
                });
                k.prototype.init.call(this, a, g);
                b.dataClasses && this.initDataClasses(b);
                this.initStops(b);
                this.horiz = d;
                this.zoomEnabled = !1;
                this.defaultLegendLength = 200
            },
            tweenColors: function (a, b, d) {
                var g;
                b.rgba.length && a.rgba.length ? (a = a.rgba, b = b.rgba, g = 1 !== b[3] || 1 !== a[3], a = (g ? "rgba(" : "rgb(") + Math.round(b[0] + (a[0] - b[0]) * (1 - d)) + "," + Math.round(b[1] + (a[1] - b[1]) * (1 - d)) + "," + Math.round(b[2] + (a[2] - b[2]) * (1 - d)) + (g ? "," + (b[3] + (a[3] - b[3]) * (1 - d)) : "") + ")") : a = b.input || "none";
                return a
            },
            initDataClasses: function (a) {
                var b = this, d = this.chart, g, h = 0, c = d.options.chart.colorCount, y = this.options, f = a.dataClasses.length;
                this.dataClasses = g = [];
                this.legendItems =
                    [];
                e(a.dataClasses, function (a, e) {
                    a = q(a);
                    g.push(a);
                    a.color || ("category" === y.dataClassColor ? (e = d.options.colors, c = e.length, a.color = e[h], a.colorIndex = h, h++, h === c && (h = 0)) : a.color = b.tweenColors(m(y.minColor), m(y.maxColor), 2 > f ? .5 : e / (f - 1)))
                })
            },
            initStops: function (a) {
                this.stops = a.stops || [[0, this.options.minColor], [1, this.options.maxColor]];
                e(this.stops, function (a) {
                    a.color = m(a[1])
                })
            },
            setOptions: function (a) {
                k.prototype.setOptions.call(this, a);
                this.options.crosshair = this.options.marker
            },
            setAxisSize: function () {
                var a =
                    this.legendSymbol, b = this.chart, d = b.options.legend || {}, g, h;
                a ? (this.left = d = a.attr("x"), this.top = g = a.attr("y"), this.width = h = a.attr("width"), this.height = a = a.attr("height"), this.right = b.chartWidth - d - h, this.bottom = b.chartHeight - g - a, this.len = this.horiz ? h : a, this.pos = this.horiz ? d : g) : this.len = (this.horiz ? d.symbolWidth : d.symbolHeight) || this.defaultLegendLength
            },
            toColor: function (a, b) {
                var d = this.stops, g, h, c = this.dataClasses, e, f;
                if (c)for (f = c.length; f--;) {
                    if (e = c[f], g = e.from, d = e.to, (void 0 === g || a >= g) && (void 0 ===
                        d || a <= d)) {
                        h = e.color;
                        b && (b.dataClass = f, b.colorIndex = e.colorIndex);
                        break
                    }
                } else {
                    this.isLog && (a = this.val2lin(a));
                    a = 1 - (this.max - a) / (this.max - this.min || 1);
                    for (f = d.length; f-- && !(a > d[f][0]););
                    g = d[f] || d[f + 1];
                    d = d[f + 1] || g;
                    a = 1 - (d[0] - a) / (d[0] - g[0] || 1);
                    h = this.tweenColors(g.color, d.color, a)
                }
                return h
            },
            getOffset: function () {
                var a = this.legendGroup, b = this.chart.axisOffset[this.side];
                a && (this.axisParent = a, k.prototype.getOffset.call(this), this.added || (this.added = !0, this.labelLeft = 0, this.labelRight = this.width), this.chart.axisOffset[this.side] =
                    b)
            },
            setLegendColor: function () {
                var a, b = this.options, d = this.reversed;
                a = d ? 1 : 0;
                d = d ? 0 : 1;
                a = this.horiz ? [a, 0, d, 0] : [0, d, 0, a];
                this.legendColor = {
                    linearGradient: {x1: a[0], y1: a[1], x2: a[2], y2: a[3]},
                    stops: b.stops || [[0, b.minColor], [1, b.maxColor]]
                }
            },
            drawLegendSymbol: function (a, b) {
                var d = a.padding, g = a.options, h = this.horiz, c = u(g.symbolWidth, h ? this.defaultLegendLength : 12), f = u(g.symbolHeight, h ? 12 : this.defaultLegendLength), e = u(g.labelPadding, h ? 16 : 30), g = u(g.itemDistance, 10);
                this.setLegendColor();
                b.legendSymbol = this.chart.renderer.rect(0,
                    a.baseline - 11, c, f).attr({zIndex: 1}).add(b.legendGroup);
                this.legendItemWidth = c + d + (h ? g : e);
                this.legendItemHeight = f + d + (h ? e : 0)
            },
            setState: x,
            visible: !0,
            setVisible: x,
            getSeriesExtremes: function () {
                var a;
                this.series.length && (a = this.series[0], this.dataMin = a.valueMin, this.dataMax = a.valueMax)
            },
            drawCrosshair: function (a, b) {
                var d = b && b.plotX, c = b && b.plotY, h, f = this.pos, e = this.len;
                b && (h = this.toPixels(b[b.series.colorKey]), h < f ? h = f - 2 : h > f + e && (h = f + e + 2), b.plotX = h, b.plotY = this.len - h, k.prototype.drawCrosshair.call(this, a, b),
                    b.plotX = d, b.plotY = c, this.cross && (this.cross.addClass("highcharts-coloraxis-marker").add(this.legendGroup), this.cross.attr({fill: this.crosshair.color})))
            },
            getPlotLinePath: function (a, b, d, c, h) {
                return w(h) ? this.horiz ? ["M", h - 4, this.top - 6, "L", h + 4, this.top - 6, h, this.top, "Z"] : ["M", this.left, h, "L", this.left - 6, h + 6, this.left - 6, h - 6, "Z"] : k.prototype.getPlotLinePath.call(this, a, b, d, c)
            },
            update: function (a, b) {
                var d = this.chart, c = d.legend;
                e(this.series, function (a) {
                    a.isDirtyData = !0
                });
                a.dataClasses && c.allItems && (e(c.allItems,
                    function (a) {
                        a.isDataClass && a.legendGroup.destroy()
                    }), d.isDirtyLegend = !0);
                d.options[this.coll] = q(this.userOptions, a);
                k.prototype.update.call(this, a, b);
                this.legendItem && (this.setLegendColor(), c.colorizeItem(this, !0))
            },
            getDataClassLegendSymbols: function () {
                var a = this, b = this.chart, d = this.legendItems, g = b.options.legend, h = g.valueDecimals, t = g.valueSuffix || "", k;
                d.length || e(this.dataClasses, function (g, p) {
                    var l = !0, q = g.from, m = g.to;
                    k = "";
                    void 0 === q ? k = "\x3c " : void 0 === m && (k = "\x3e ");
                    void 0 !== q && (k += c.numberFormat(q,
                            h) + t);
                    void 0 !== q && void 0 !== m && (k += " - ");
                    void 0 !== m && (k += c.numberFormat(m, h) + t);
                    d.push(v({
                        chart: b,
                        name: k,
                        options: {},
                        drawLegendSymbol: f.drawRectangle,
                        visible: !0,
                        setState: x,
                        isDataClass: !0,
                        setVisible: function () {
                            l = this.visible = !l;
                            e(a.series, function (a) {
                                e(a.points, function (a) {
                                    a.dataClass === p && a.setVisible(l)
                                })
                            });
                            b.legend.colorizeItem(this, l)
                        }
                    }, g))
                });
                return d
            },
            name: ""
        });
        e(["fill", "stroke"], function (a) {
            c.Fx.prototype[a + "Setter"] = function () {
                this.elem.attr(a, l.prototype.tweenColors(m(this.start), m(this.end),
                    this.pos), null, !0)
            }
        });
        t(r.prototype, "getAxes", function (a) {
            var b = this.options.colorAxis;
            a.call(this);
            this.colorAxis = [];
            b && new l(this, b)
        });
        t(p.prototype, "getAllItems", function (a) {
            var b = [], d = this.chart.colorAxis[0];
            d && d.options && (d.options.showInLegend && (d.options.dataClasses ? b = b.concat(d.getDataClassLegendSymbols()) : b.push(d)), e(d.series, function (a) {
                a.options.showInLegend = !1
            }));
            return b.concat(a.call(this))
        });
        t(p.prototype, "colorizeItem", function (a, b, d) {
            a.call(this, b, d);
            d && b.legendColor && b.legendSymbol.attr({fill: b.legendColor})
        })
    })(n);
    (function (c) {
        var k = c.defined, r = c.each, m = c.noop, l = c.seriesTypes;
        c.colorPointMixin = {
            isValid: function () {
                return null !== this.value
            }, setVisible: function (c) {
                var e = this, k = c ? "show" : "hide";
                r(["graphic", "dataLabel"], function (c) {
                    if (e[c])e[c][k]()
                })
            }, setState: function (e) {
                c.Point.prototype.setState.call(this, e);
                this.graphic && this.graphic.attr({zIndex: "hover" === e ? 1 : 0})
            }
        };
        c.colorSeriesMixin = {
            pointArrayMap: ["value"],
            axisTypes: ["xAxis", "yAxis", "colorAxis"],
            optionalAxis: "colorAxis",
            trackerGroups: ["group", "markerGroup",
                "dataLabelsGroup"],
            getSymbol: m,
            parallelArrays: ["x", "y", "value"],
            colorKey: "value",
            pointAttribs: l.column.prototype.pointAttribs,
            translateColors: function () {
                var c = this, k = this.options.nullColor, l = this.colorAxis, m = this.colorKey;
                r(this.data, function (f) {
                    var e = f[m];
                    if (e = f.options.color || (f.isNull ? k : l && void 0 !== e ? l.toColor(e, f) : f.color || c.color))f.color = e
                })
            },
            colorAttribs: function (c) {
                var e = {};
                k(c.color) && (e[this.colorProp || "fill"] = c.color);
                return e
            }
        }
    })(n);
    (function (c) {
        var k = c.colorPointMixin, r = c.each, m = c.merge,
            l = c.noop, e = c.pick, n = c.Series, w = c.seriesType, p = c.seriesTypes;
        w("heatmap", "scatter", {
            animation: !1,
            borderWidth: 0,
            nullColor: "#f7f7f7",
            dataLabels: {
                formatter: function () {
                    return this.point.value
                }, inside: !0, verticalAlign: "middle", crop: !1, overflow: !1, padding: 0
            },
            marker: null,
            pointRange: null,
            tooltip: {pointFormat: "{point.x}, {point.y}: {point.value}\x3cbr/\x3e"},
            states: {normal: {animation: !0}, hover: {halo: !1, brightness: .2}}
        }, m(c.colorSeriesMixin, {
            pointArrayMap: ["y", "value"], hasPointSpecificOptions: !0, supportsDrilldown: !0,
            getExtremesFromAll: !0, directTouch: !0, init: function () {
                var c;
                p.scatter.prototype.init.apply(this, arguments);
                c = this.options;
                c.pointRange = e(c.pointRange, c.colsize || 1);
                this.yAxis.axisPointRange = c.rowsize || 1
            }, translate: function () {
                var c = this.options, e = this.xAxis, k = this.yAxis, l = function (c, a, b) {
                    return Math.min(Math.max(a, c), b)
                };
                this.generatePoints();
                r(this.points, function (f) {
                    var a = (c.colsize || 1) / 2, b = (c.rowsize || 1) / 2, d = l(Math.round(e.len - e.translate(f.x - a, 0, 1, 0, 1)), -e.len, 2 * e.len), a = l(Math.round(e.len - e.translate(f.x +
                            a, 0, 1, 0, 1)), -e.len, 2 * e.len), g = l(Math.round(k.translate(f.y - b, 0, 1, 0, 1)), -k.len, 2 * k.len), b = l(Math.round(k.translate(f.y + b, 0, 1, 0, 1)), -k.len, 2 * k.len);
                    f.plotX = f.clientX = (d + a) / 2;
                    f.plotY = (g + b) / 2;
                    f.shapeType = "rect";
                    f.shapeArgs = {
                        x: Math.min(d, a),
                        y: Math.min(g, b),
                        width: Math.abs(a - d),
                        height: Math.abs(b - g)
                    }
                });
                this.translateColors()
            }, drawPoints: function () {
                p.column.prototype.drawPoints.call(this);
                r(this.points, function (c) {
                    c.graphic.attr(this.colorAttribs(c))
                }, this)
            }, animate: l, getBox: l, drawLegendSymbol: c.LegendSymbolMixin.drawRectangle,
            alignDataLabel: p.column.prototype.alignDataLabel, getExtremes: function () {
                n.prototype.getExtremes.call(this, this.valueData);
                this.valueMin = this.dataMin;
                this.valueMax = this.dataMax;
                n.prototype.getExtremes.call(this)
            }
        }), k)
    })(n)
});
