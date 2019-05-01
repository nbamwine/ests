/*
 Highcharts JS v5.0.6 (2016-12-07)

 (c) 2009-2016 Torstein Honsi

 License: www.highcharts.com/license
 */
(function (h) {
    "object" === typeof module && module.exports ? module.exports = h : h(Highcharts)
})(function (h) {
    (function (g) {
        function h() {
            return Array.prototype.slice.call(arguments, 1)
        }

        function u(c) {
            c.apply(this);
            this.drawBreaks(this.xAxis, ["x"]);
            this.drawBreaks(this.yAxis, r(this.pointArrayMap, ["y"]))
        }

        var r = g.pick, p = g.wrap, t = g.each, x = g.extend, v = g.fireEvent, q = g.Axis, y = g.Series;
        x(q.prototype, {
            isInBreak: function (c, d) {
                var f = c.repeat || Infinity, b = c.from, a = c.to - c.from;
                d = d >= b ? (d - b) % f : f - (b - d) % f;
                return c.inclusive ? d <= a :
                d < a && 0 !== d
            }, isInAnyBreak: function (c, d) {
                var f = this.options.breaks, b = f && f.length, a, e, m;
                if (b) {
                    for (; b--;)this.isInBreak(f[b], c) && (a = !0, e || (e = r(f[b].showPoints, this.isXAxis ? !1 : !0)));
                    m = a && d ? a && !e : a
                }
                return m
            }
        });
        p(q.prototype, "setTickPositions", function (c) {
            c.apply(this, Array.prototype.slice.call(arguments, 1));
            if (this.options.breaks) {
                var d = this.tickPositions, f = this.tickPositions.info, b = [], a;
                for (a = 0; a < d.length; a++)this.isInAnyBreak(d[a]) || b.push(d[a]);
                this.tickPositions = b;
                this.tickPositions.info = f
            }
        });
        p(q.prototype,
            "init", function (c, d, f) {
                f.breaks && f.breaks.length && (f.ordinal = !1);
                c.call(this, d, f);
                if (this.options.breaks) {
                    var b = this;
                    b.isBroken = !0;
                    this.val2lin = function (a) {
                        var e = a, m, c;
                        for (c = 0; c < b.breakArray.length; c++)if (m = b.breakArray[c], m.to <= a)e -= m.len; else if (m.from >= a)break; else if (b.isInBreak(m, a)) {
                            e -= a - m.from;
                            break
                        }
                        return e
                    };
                    this.lin2val = function (a) {
                        var e, c;
                        for (c = 0; c < b.breakArray.length && !(e = b.breakArray[c], e.from >= a); c++)e.to < a ? a += e.len : b.isInBreak(e, a) && (a += e.len);
                        return a
                    };
                    this.setExtremes = function (a, b,
                                                 c, f, d) {
                        for (; this.isInAnyBreak(a);)a -= this.closestPointRange;
                        for (; this.isInAnyBreak(b);)b -= this.closestPointRange;
                        q.prototype.setExtremes.call(this, a, b, c, f, d)
                    };
                    this.setAxisTranslation = function (a) {
                        q.prototype.setAxisTranslation.call(this, a);
                        var e = b.options.breaks;
                        a = [];
                        var c = [], f = 0, d, k, n = b.userMin || b.min, g = b.userMax || b.max, l, h;
                        for (h in e)k = e[h], d = k.repeat || Infinity, b.isInBreak(k, n) && (n += k.to % d - n % d), b.isInBreak(k, g) && (g -= g % d - k.from % d);
                        for (h in e) {
                            k = e[h];
                            l = k.from;
                            for (d = k.repeat || Infinity; l - d > n;)l -= d;
                            for (; l <
                                   n;)l += d;
                            for (; l < g; l += d)a.push({value: l, move: "in"}), a.push({
                                value: l + (k.to - k.from),
                                move: "out",
                                size: k.breakSize
                            })
                        }
                        a.sort(function (a, b) {
                            return a.value === b.value ? ("in" === a.move ? 0 : 1) - ("in" === b.move ? 0 : 1) : a.value - b.value
                        });
                        e = 0;
                        l = n;
                        for (h in a)k = a[h], e += "in" === k.move ? 1 : -1, 1 === e && "in" === k.move && (l = k.value), 0 === e && (c.push({
                            from: l,
                            to: k.value,
                            len: k.value - l - (k.size || 0)
                        }), f += k.value - l - (k.size || 0));
                        b.breakArray = c;
                        v(b, "afterBreaks");
                        b.transA *= (g - b.min) / (g - n - f);
                        b.min = n;
                        b.max = g
                    }
                }
            });
        p(y.prototype, "generatePoints", function (c) {
            c.apply(this,
                h(arguments));
            var d = this.xAxis, f = this.yAxis, b = this.points, a, e = b.length, g = this.options.connectNulls, w;
            if (d && f && (d.options.breaks || f.options.breaks))for (; e--;)a = b[e], w = null === a.y && !1 === g, w || !d.isInAnyBreak(a.x, !0) && !f.isInAnyBreak(a.y, !0) || (b.splice(e, 1), this.data[e] && this.data[e].destroyElements())
        });
        g.Series.prototype.drawBreaks = function (c, d) {
            var f = this, b = f.points, a, e, g, h;
            c && t(d, function (d) {
                a = c.breakArray || [];
                e = c.isXAxis ? c.min : r(f.options.threshold, c.min);
                t(b, function (b) {
                    h = r(b["stack" + d.toUpperCase()],
                        b[d]);
                    t(a, function (a) {
                        g = !1;
                        if (e < a.from && h > a.to || e > a.from && h < a.from)g = "pointBreak"; else if (e < a.from && h > a.from && h < a.to || e > a.from && h > a.to && h < a.from)g = "pointInBreak";
                        g && v(c, g, {point: b, brk: a})
                    })
                })
            })
        };
        p(g.seriesTypes.column.prototype, "drawPoints", u);
        p(g.Series.prototype, "drawPoints", u)
    })(h)
});