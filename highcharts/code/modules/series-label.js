/*
 Highcharts JS v5.0.6 (2016-12-07)

 (c) 2009-2016 Torstein Honsi

 License: www.highcharts.com/license
 */
(function (u) {
    "object" === typeof module && module.exports ? module.exports = u : u(Highcharts)
})(function (u) {
    (function (q) {
        function u(f, b, a, m, c, e) {
            f = (e - b) * (a - f) - (m - b) * (c - f);
            return 0 < f ? !0 : 0 > f ? !1 : !0
        }

        function v(f, b, a, m, c, e, d, l) {
            return u(f, b, c, e, d, l) !== u(a, m, c, e, d, l) && u(f, b, a, m, c, e) !== u(f, b, a, m, d, l)
        }

        function z(f, b, a, m, c, e, d, l) {
            return v(f, b, f + a, b, c, e, d, l) || v(f + a, b, f + a, b + m, c, e, d, l) || v(f, b + m, f + a, b + m, c, e, d, l) || v(f, b, f, b + m, c, e, d, l)
        }

        function A(f) {
            var b = this, a = Math.max(q.animObject(b.renderer.globalAnimation).duration,
                250), m = !b.hasRendered;
            f.apply(b, [].slice.call(arguments, 1));
            b.labelSeries = [];
            clearTimeout(b.seriesLabelTimer);
            w(b.series, function (c) {
                var e = c.labelBySeries, d = e && e.closest;
                c.options.label.enabled && c.visible && (c.graph || c.area) && (b.labelSeries.push(c), m && (a = Math.max(a, q.animObject(c.options.animation).duration)), d && (void 0 !== d[0].plotX ? e.animate({
                    x: d[0].plotX + d[1],
                    y: d[0].plotY + d[2]
                }) : e.attr({opacity: 0})))
            });
            b.seriesLabelTimer = setTimeout(function () {
                b.drawSeriesLabels()
            }, a)
        }

        var B = q.wrap, w = q.each, D = q.extend,
            x = q.isNumber, C = q.Series, E = q.SVGRenderer, y = q.Chart;
        q.setOptions({
            plotOptions: {
                series: {
                    label: {
                        enabled: !0,
                        connectorAllowed: !0,
                        connectorNeighbourDistance: 24,
                        styles: {fontWeight: "bold"}
                    }
                }
            }
        });
        E.prototype.symbols.connector = function (f, b, a, m, c) {
            var e = c && c.anchorX;
            c = c && c.anchorY;
            var d, l, h = a / 2;
            x(e) && x(c) && (d = ["M", e, c], l = b - c, 0 > l && (l = -m - l), l < a && (h = e < f + a / 2 ? l : a - l), c > b + m ? d.push("L", f + h, b + m) : c < b ? d.push("L", f + h, b) : e < f ? d.push("L", f, b + m / 2) : e > f + a && d.push("L", f + a, b + m / 2));
            return d || []
        };
        C.prototype.getPointsOnGraph = function () {
            var f =
                this.points, b, a, m = [], c, e, d, l;
            e = this.graph || this.area;
            d = e.element;
            var h = (b = this.chart.inverted) ? this.yAxis.pos : this.xAxis.pos, n = b ? this.xAxis.pos : this.yAxis.pos;
            if (this.getPointSpline && d.getPointAtLength) {
                e.toD && (a = e.attr("d"), e.attr({d: e.toD}));
                l = d.getTotalLength();
                for (c = 0; c < l; c += 16)b = d.getPointAtLength(c), m.push({
                    chartX: h + b.x,
                    chartY: n + b.y,
                    plotX: b.x,
                    plotY: b.y
                });
                a && e.attr({d: a});
                b = f[f.length - 1];
                b.chartX = h + b.plotX;
                b.chartY = n + b.plotY;
                m.push(b)
            } else for (l = f.length, c = 0; c < l; c += 1) {
                b = f[c];
                a = f[c - 1];
                b.chartX =
                    h + b.plotX;
                b.chartY = n + b.plotY;
                if (0 < c && (e = Math.abs(b.chartX - a.chartX), d = Math.abs(b.chartY - a.chartY), e = Math.max(e, d), 16 < e))for (e = Math.ceil(e / 16), d = 1; d < e; d += 1)m.push({
                    chartX: a.chartX + d / e * (b.chartX - a.chartX),
                    chartY: a.chartY + d / e * (b.chartY - a.chartY),
                    plotX: a.plotX + d / e * (b.plotX - a.plotX),
                    plotY: a.plotY + d / e * (b.plotY - a.plotY)
                });
                x(b.plotY) && m.push(b)
            }
            return m
        };
        C.prototype.checkClearPoint = function (f, b, a, m) {
            var c = Number.MAX_VALUE, e = Number.MAX_VALUE, d, l, h = this.options.label.connectorAllowed, n = this.chart, p, g, r, k;
            for (r =
                     0; r < n.boxesToAvoid.length; r += 1) {
                g = n.boxesToAvoid[r];
                k = f + a.width;
                p = b;
                var q = b + a.height;
                if (!(f > g.right || k < g.left || p > g.bottom || q < g.top))return !1
            }
            for (r = 0; r < n.series.length; r += 1)if (p = n.series[r], g = p.interpolatedPoints, p.visible && g) {
                for (k = 1; k < g.length; k += 1) {
                    if (z(f, b, a.width, a.height, g[k - 1].chartX, g[k - 1].chartY, g[k].chartX, g[k].chartY))return !1;
                    this === p && !d && m && (d = z(f - 16, b - 16, a.width + 32, a.height + 32, g[k - 1].chartX, g[k - 1].chartY, g[k].chartX, g[k].chartY));
                    this !== p && (c = Math.min(c, Math.pow(f + a.width / 2 - g[k].chartX,
                            2) + Math.pow(b + a.height / 2 - g[k].chartY, 2), Math.pow(f - g[k].chartX, 2) + Math.pow(b - g[k].chartY, 2), Math.pow(f + a.width - g[k].chartX, 2) + Math.pow(b - g[k].chartY, 2), Math.pow(f + a.width - g[k].chartX, 2) + Math.pow(b + a.height - g[k].chartY, 2), Math.pow(f - g[k].chartX, 2) + Math.pow(b + a.height - g[k].chartY, 2)))
                }
                if (h && this === p && (m && !d || c < Math.pow(this.options.label.connectorNeighbourDistance, 2))) {
                    for (k = 1; k < g.length; k += 1)d = Math.min(Math.pow(f + a.width / 2 - g[k].chartX, 2) + Math.pow(b + a.height / 2 - g[k].chartY, 2), Math.pow(f - g[k].chartX,
                            2) + Math.pow(b - g[k].chartY, 2), Math.pow(f + a.width - g[k].chartX, 2) + Math.pow(b - g[k].chartY, 2), Math.pow(f + a.width - g[k].chartX, 2) + Math.pow(b + a.height - g[k].chartY, 2), Math.pow(f - g[k].chartX, 2) + Math.pow(b + a.height - g[k].chartY, 2)), d < e && (e = d, l = g[k]);
                    d = !0
                }
            }
            return !m || d ? {x: f, y: b, weight: c - (l ? e : 0), connectorPoint: l} : !1
        };
        y.prototype.drawSeriesLabels = function () {
            var f = this, b = this.labelSeries;
            f.boxesToAvoid = [];
            w(b, function (a) {
                a.interpolatedPoints = a.getPointsOnGraph();
                w(a.options.label.boxesToAvoid || [], function (a) {
                    f.boxesToAvoid.push(a)
                })
            });
            w(f.series, function (a) {
                function b(a, b, c) {
                    return a > g && a <= g + k - c.width && b >= r && b <= r + q - c.height
                }

                var c, e, d, l = [], h, n, p = f.inverted, g = p ? a.yAxis.pos : a.xAxis.pos, r = p ? a.xAxis.pos : a.yAxis.pos, k = f.inverted ? a.yAxis.len : a.xAxis.len, q = f.inverted ? a.xAxis.len : a.yAxis.len, t = a.interpolatedPoints, p = a.labelBySeries;
                if (a.visible && t) {
                    p || (a.labelBySeries = p = f.renderer.label(a.name, 0, -9999, "connector").css(D({color: a.color}, a.options.label.styles)).attr({
                        padding: 0,
                        opacity: 0,
                        stroke: a.color,
                        "stroke-width": 1
                    }).add(a.group).animate({opacity: 1},
                        {duration: 200}));
                    c = p.getBBox();
                    c.width = Math.round(c.width);
                    for (n = t.length - 1; 0 < n; --n)e = t[n].chartX + 3, d = t[n].chartY - c.height - 3, b(e, d, c) && (h = a.checkClearPoint(e, d, c)), h && l.push(h), e = t[n].chartX + 3, d = t[n].chartY + 3, b(e, d, c) && (h = a.checkClearPoint(e, d, c)), h && l.push(h), e = t[n].chartX - c.width - 3, d = t[n].chartY + 3, b(e, d, c) && (h = a.checkClearPoint(e, d, c)), h && l.push(h), e = t[n].chartX - c.width - 3, d = t[n].chartY - c.height - 3, b(e, d, c) && (h = a.checkClearPoint(e, d, c)), h && l.push(h);
                    if (!l.length)for (e = g + k - c.width; e >= g; e -= 16)for (d =
                                                                                     r; d < r + q - c.height; d += 16)(h = a.checkClearPoint(e, d, c, !0)) && l.push(h);
                    if (l.length) {
                        if (l.sort(function (a, b) {
                                return b.weight - a.weight
                            }), h = l[0], f.boxesToAvoid.push({
                                left: h.x,
                                right: h.x + c.width,
                                top: h.y,
                                bottom: h.y + c.height
                            }), Math.round(h.x) !== Math.round(p.x) || Math.round(h.y) !== Math.round(p.y))a.labelBySeries.attr({
                            opacity: 0,
                            x: h.x - g,
                            y: h.y - r,
                            anchorX: h.connectorPoint && h.connectorPoint.plotX,
                            anchorY: h.connectorPoint && h.connectorPoint.plotY
                        }).animate({opacity: 1}), a.options.kdNow = !0, a.buildKDTree(), a = a.searchPoint({
                            chartX: h.x,
                            chartY: h.y
                        }, !0), p.closest = [a, h.x - g - a.plotX, h.y - r - a.plotY]
                    } else p && (a.labelBySeries = p.destroy())
                }
            })
        };
        B(y.prototype, "render", A);
        B(y.prototype, "redraw", A)
    })(u)
});
