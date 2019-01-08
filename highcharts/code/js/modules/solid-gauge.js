/*
 Highcharts JS v5.0.6 (2016-12-07)
 Solid angular gauge module

 (c) 2010-2016 Torstein Honsi

 License: www.highcharts.com/license
 */
(function (l) {
    "object" === typeof module && module.exports ? module.exports = l : l(Highcharts)
})(function (l) {
    (function (e) {
        var l = e.pInt, t = e.pick, m = e.each, v = e.isNumber, n;
        n = {
            initDataClasses: function (a) {
                var c = this, d = this.chart, f, u = 0, h = this.options;
                this.dataClasses = f = [];
                m(a.dataClasses, function (g, b) {
                    g = e.merge(g);
                    f.push(g);
                    g.color || ("category" === h.dataClassColor ? (b = d.options.colors, g.color = b[u++], u === b.length && (u = 0)) : g.color = c.tweenColors(e.color(h.minColor), e.color(h.maxColor), b / (a.dataClasses.length - 1)))
                })
            }, initStops: function (a) {
                this.stops =
                    a.stops || [[0, this.options.minColor], [1, this.options.maxColor]];
                m(this.stops, function (a) {
                    a.color = e.color(a[1])
                })
            }, toColor: function (a, c) {
                var d = this.stops, f, e, h = this.dataClasses, g, b;
                if (h)for (b = h.length; b--;) {
                    if (g = h[b], f = g.from, d = g.to, (void 0 === f || a >= f) && (void 0 === d || a <= d)) {
                        e = g.color;
                        c && (c.dataClass = b);
                        break
                    }
                } else {
                    this.isLog && (a = this.val2lin(a));
                    a = 1 - (this.max - a) / (this.max - this.min);
                    for (b = d.length; b-- && !(a > d[b][0]););
                    f = d[b] || d[b + 1];
                    d = d[b + 1] || f;
                    a = 1 - (d[0] - a) / (d[0] - f[0] || 1);
                    e = this.tweenColors(f.color, d.color,
                        a)
                }
                return e
            }, tweenColors: function (a, c, d) {
                var f;
                c.rgba.length && a.rgba.length ? (a = a.rgba, c = c.rgba, f = 1 !== c[3] || 1 !== a[3], a = (f ? "rgba(" : "rgb(") + Math.round(c[0] + (a[0] - c[0]) * (1 - d)) + "," + Math.round(c[1] + (a[1] - c[1]) * (1 - d)) + "," + Math.round(c[2] + (a[2] - c[2]) * (1 - d)) + (f ? "," + (c[3] + (a[3] - c[3]) * (1 - d)) : "") + ")") : a = c.input || "none";
                return a
            }
        };
        m(["fill", "stroke"], function (a) {
            e.Fx.prototype[a + "Setter"] = function () {
                this.elem.attr(a, n.tweenColors(e.color(this.start), e.color(this.end), this.pos), null, !0)
            }
        });
        e.seriesType("solidgauge",
            "gauge", {colorByPoint: !0}, {
                translate: function () {
                    var a = this.yAxis;
                    e.extend(a, n);
                    !a.dataClasses && a.options.dataClasses && a.initDataClasses(a.options);
                    a.initStops(a.options);
                    e.seriesTypes.gauge.prototype.translate.call(this)
                }, drawPoints: function () {
                    var a = this, c = a.yAxis, d = c.center, f = a.options, e = a.chart.renderer, h = f.overshoot, g = v(h) ? h / 180 * Math.PI : 0, b;
                    v(f.threshold) && (b = c.startAngleRad + c.translate(f.threshold, null, null, null, !0));
                    this.thresholdAngleRad = t(b, c.startAngleRad);
                    m(a.points, function (b) {
                        var h = b.graphic,
                            k = c.startAngleRad + c.translate(b.y, null, null, null, !0), m = l(t(b.options.radius, f.radius, 100)) * d[2] / 200, p = l(t(b.options.innerRadius, f.innerRadius, 60)) * d[2] / 200, q = c.toColor(b.y, b), r = Math.min(c.startAngleRad, c.endAngleRad), n = Math.max(c.startAngleRad, c.endAngleRad);
                        "none" === q && (q = b.color || a.color || "none");
                        "none" !== q && (b.color = q);
                        k = Math.max(r - g, Math.min(n + g, k));
                        !1 === f.wrap && (k = Math.max(r, Math.min(n, k)));
                        r = Math.min(k, a.thresholdAngleRad);
                        k = Math.max(k, a.thresholdAngleRad);
                        k - r > 2 * Math.PI && (k = r + 2 * Math.PI);
                        b.shapeArgs =
                            p = {x: d[0], y: d[1], r: m, innerR: p, start: r, end: k, fill: q};
                        b.startR = m;
                        h ? (b = p.d, h.animate(p), b && (p.d = b)) : b.graphic = e.arc(p).addClass("highcharts-point").attr({
                            fill: q,
                            "sweep-flag": 0
                        }).add(a.group)
                    })
                }, animate: function (a) {
                    a || (this.startAngleRad = this.thresholdAngleRad, e.seriesTypes.pie.prototype.animate.call(this, a))
                }
            })
    })(l)
});
