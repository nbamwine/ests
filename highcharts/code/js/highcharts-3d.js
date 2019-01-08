/*
 Highcharts JS v5.0.6 (2016-12-07)

 3D features for Highcharts JS

 @license: www.highcharts.com/license
 */
(function (t) {
    "object" === typeof module && module.exports ? module.exports = t : t(Highcharts)
})(function (t) {
    (function (b) {
        var r = b.deg2rad, g = b.pick;
        b.perspective = function (p, q, y) {
            var e = q.options.chart.options3d, h = y ? q.inverted : !1, n = q.plotWidth / 2, f = q.plotHeight / 2, d = e.depth / 2, m = g(e.depth, 1) * g(e.viewDistance, 0), c = q.scale3d || 1, a = r * e.beta * (h ? -1 : 1), e = r * e.alpha * (h ? -1 : 1), k = Math.cos(e), v = Math.cos(-a), z = Math.sin(e), A = Math.sin(-a);
            y || (n += q.plotLeft, f += q.plotTop);
            return b.map(p, function (a) {
                var b, e;
                e = (h ? a.y : a.x) - n;
                var g = (h ?
                        a.x : a.y) - f, p = (a.z || 0) - d;
                b = v * e - A * p;
                a = -z * A * e + k * g - v * z * p;
                e = k * A * e + z * g + k * v * p;
                g = 0 < m && m < Number.POSITIVE_INFINITY ? m / (e + d + m) : 1;
                b = b * g * c + n;
                a = a * g * c + f;
                return {x: h ? a : b, y: h ? b : a, z: e * c + d}
            })
        };
        b.pointCameraDistance = function (b, q) {
            var p = q.options.chart.options3d, e = q.plotWidth / 2;
            q = q.plotHeight / 2;
            p = g(p.depth, 1) * g(p.viewDistance, 0) + p.depth;
            return Math.sqrt(Math.pow(e - b.plotX, 2) + Math.pow(q - b.plotY, 2) + Math.pow(p - b.plotZ, 2))
        }
    })(t);
    (function (b) {
        function r(a) {
            var c = 0, l, b;
            for (l = 0; l < a.length; l++)b = (l + 1) % a.length, c += a[l].x * a[b].y -
                a[b].x * a[l].y;
            return c / 2
        }

        function g(a) {
            var c = 0, l;
            for (l = 0; l < a.length; l++)c += a[l].z;
            return a.length ? c / a.length : 0
        }

        function p(a, c, l, b, k, d, E, f) {
            var e = [], B = d - k;
            return d > k && d - k > Math.PI / 2 + .0001 ? (e = e.concat(p(a, c, l, b, k, k + Math.PI / 2, E, f)), e = e.concat(p(a, c, l, b, k + Math.PI / 2, d, E, f))) : d < k && k - d > Math.PI / 2 + .0001 ? (e = e.concat(p(a, c, l, b, k, k - Math.PI / 2, E, f)), e = e.concat(p(a, c, l, b, k - Math.PI / 2, d, E, f))) : ["C", a + l * Math.cos(k) - l * w * B * Math.sin(k) + E, c + b * Math.sin(k) + b * w * B * Math.cos(k) + f, a + l * Math.cos(d) + l * w * B * Math.sin(d) + E, c + b * Math.sin(d) -
            b * w * B * Math.cos(d) + f, a + l * Math.cos(d) + E, c + b * Math.sin(d) + f]
        }

        var q = Math.cos, y = Math.PI, e = Math.sin, h = b.animObject, n = b.charts, f = b.color, d = b.defined, m = b.deg2rad, c = b.each, a = b.extend, k = b.inArray, v = b.map, z = b.merge, A = b.perspective, t = b.pick, D = b.SVGElement, C = b.SVGRenderer, u = b.wrap, w = 4 * (Math.sqrt(2) - 1) / 3 / (y / 2);
        u(C.prototype, "init", function (a) {
            a.apply(this, [].slice.call(arguments, 1));
            c([{name: "darker", slope: .6}, {name: "brighter", slope: 1.4}], function (a) {
                this.definition({
                    tagName: "filter", id: "highcharts-" + a.name, children: [{
                        tagName: "feComponentTransfer",
                        children: [{tagName: "feFuncR", type: "linear", slope: a.slope}, {
                            tagName: "feFuncG",
                            type: "linear",
                            slope: a.slope
                        }, {tagName: "feFuncB", type: "linear", slope: a.slope}]
                    }]
                })
            }, this)
        });
        C.prototype.toLinePath = function (a, b) {
            var l = [];
            c(a, function (a) {
                l.push("L", a.x, a.y)
            });
            a.length && (l[0] = "M", b && l.push("Z"));
            return l
        };
        C.prototype.cuboid = function (a) {
            var c = this.g();
            a = this.cuboidPath(a);
            c.front = this.path(a[0]).attr({"class": "highcharts-3d-front", zIndex: a[3]}).add(c);
            c.top = this.path(a[1]).attr({
                "class": "highcharts-3d-top",
                zIndex: a[4]
            }).add(c);
            c.side = this.path(a[2]).attr({"class": "highcharts-3d-side", zIndex: a[5]}).add(c);
            c.fillSetter = function (a) {
                this.front.attr({fill: a});
                this.top.attr({fill: f(a).brighten(.1).get()});
                this.side.attr({fill: f(a).brighten(-.1).get()});
                this.color = a;
                return this
            };
            c.opacitySetter = function (a) {
                this.front.attr({opacity: a});
                this.top.attr({opacity: a});
                this.side.attr({opacity: a});
                return this
            };
            c.attr = function (a) {
                if (a.shapeArgs || d(a.x))a = this.renderer.cuboidPath(a.shapeArgs || a), this.front.attr({
                    d: a[0],
                    zIndex: a[3]
                }), this.top.attr({d: a[1], zIndex: a[4]}), this.side.attr({
                    d: a[2],
                    zIndex: a[5]
                }); else return b.SVGElement.prototype.attr.call(this, a);
                return this
            };
            c.animate = function (a, c, b) {
                d(a.x) && d(a.y) ? (a = this.renderer.cuboidPath(a), this.front.attr({zIndex: a[3]}).animate({d: a[0]}, c, b), this.top.attr({zIndex: a[4]}).animate({d: a[1]}, c, b), this.side.attr({zIndex: a[5]}).animate({d: a[2]}, c, b), this.attr({zIndex: -a[6]})) : a.opacity ? (this.front.animate(a, c, b), this.top.animate(a, c, b), this.side.animate(a, c, b)) : D.prototype.animate.call(this,
                    a, c, b);
                return this
            };
            c.destroy = function () {
                this.front.destroy();
                this.top.destroy();
                this.side.destroy();
                return null
            };
            c.attr({zIndex: -a[6]});
            return c
        };
        C.prototype.cuboidPath = function (a) {
            function c(a) {
                return h[a]
            }

            var b = a.x, k = a.y, d = a.z, f = a.height, e = a.width, m = a.depth, h = [{x: b, y: k, z: d}, {
                x: b + e,
                y: k,
                z: d
            }, {x: b + e, y: k + f, z: d}, {x: b, y: k + f, z: d}, {x: b, y: k + f, z: d + m}, {
                x: b + e,
                y: k + f,
                z: d + m
            }, {x: b + e, y: k, z: d + m}, {
                x: b,
                y: k,
                z: d + m
            }], h = A(h, n[this.chartIndex], a.insidePlotArea), d = function (a, b) {
                var d = [];
                a = v(a, c);
                b = v(b, c);
                0 > r(a) ? d = a : 0 > r(b) &&
                (d = b);
                return d
            };
            a = d([3, 2, 1, 0], [7, 6, 5, 4]);
            b = [4, 5, 2, 3];
            k = d([1, 6, 7, 0], b);
            d = d([1, 2, 5, 6], [0, 7, 4, 3]);
            return [this.toLinePath(a, !0), this.toLinePath(k, !0), this.toLinePath(d, !0), g(a), g(k), g(d), 9E9 * g(v(b, c))]
        };
        b.SVGRenderer.prototype.arc3d = function (b) {
            function d(a) {
                var b = !1, c = {}, d;
                for (d in a)-1 !== k(d, n) && (c[d] = a[d], delete a[d], b = !0);
                return b ? c : !1
            }

            var l = this.g(), e = l.renderer, n = "x y r innerR start end".split(" ");
            b = z(b);
            b.alpha *= m;
            b.beta *= m;
            l.top = e.path();
            l.side1 = e.path();
            l.side2 = e.path();
            l.inn = e.path();
            l.out =
                e.path();
            l.onAdd = function () {
                var a = l.parentGroup, b = l.attr("class");
                l.top.add(l);
                c(["out", "inn", "side1", "side2"], function (c) {
                    l[c].addClass(b + " highcharts-3d-side").add(a)
                })
            };
            l.setPaths = function (a) {
                var b = l.renderer.arc3dPath(a), c = 100 * b.zTop;
                l.attribs = a;
                l.top.attr({d: b.top, zIndex: b.zTop});
                l.inn.attr({d: b.inn, zIndex: b.zInn});
                l.out.attr({d: b.out, zIndex: b.zOut});
                l.side1.attr({d: b.side1, zIndex: b.zSide1});
                l.side2.attr({d: b.side2, zIndex: b.zSide2});
                l.zIndex = c;
                l.attr({zIndex: c});
                a.center && (l.top.setRadialReference(a.center),
                    delete a.center)
            };
            l.setPaths(b);
            l.fillSetter = function (a) {
                var b = f(a).brighten(-.1).get();
                this.fill = a;
                this.side1.attr({fill: b});
                this.side2.attr({fill: b});
                this.inn.attr({fill: b});
                this.out.attr({fill: b});
                this.top.attr({fill: a});
                return this
            };
            c(["opacity", "translateX", "translateY", "visibility"], function (a) {
                l[a + "Setter"] = function (a, b) {
                    l[b] = a;
                    c(["out", "inn", "side1", "side2", "top"], function (c) {
                        l[c].attr(b, a)
                    })
                }
            });
            u(l, "attr", function (b, c) {
                var k;
                "object" === typeof c && (k = d(c)) && (a(l.attribs, k), l.setPaths(l.attribs));
                return b.apply(this, [].slice.call(arguments, 1))
            });
            u(l, "animate", function (a, b, c, k) {
                var l, e = this.attribs, f;
                delete b.center;
                delete b.z;
                delete b.depth;
                delete b.alpha;
                delete b.beta;
                f = h(t(c, this.renderer.globalAnimation));
                f.duration && (b = z(b), l = d(b), b.dummy = 1, l && (f.step = function (a, b) {
                    function c(a) {
                        return e[a] + (t(l[a], e[a]) - e[a]) * b.pos
                    }

                    "dummy" === b.prop && b.elem.setPaths(z(e, {
                        x: c("x"),
                        y: c("y"),
                        r: c("r"),
                        innerR: c("innerR"),
                        start: c("start"),
                        end: c("end")
                    }))
                }), c = f);
                return a.call(this, b, c, k)
            });
            l.destroy = function () {
                this.top.destroy();
                this.out.destroy();
                this.inn.destroy();
                this.side1.destroy();
                this.side2.destroy();
                D.prototype.destroy.call(this)
            };
            l.hide = function () {
                this.top.hide();
                this.out.hide();
                this.inn.hide();
                this.side1.hide();
                this.side2.hide()
            };
            l.show = function () {
                this.top.show();
                this.out.show();
                this.inn.show();
                this.side1.show();
                this.side2.show()
            };
            return l
        };
        C.prototype.arc3dPath = function (a) {
            function b(a) {
                a %= 2 * Math.PI;
                a > Math.PI && (a = 2 * Math.PI - a);
                return a
            }

            var c = a.x, d = a.y, k = a.start, f = a.end - .00001, m = a.r, h = a.innerR, n = a.depth, g = a.alpha,
                v = a.beta, z = Math.cos(k), r = Math.sin(k);
            a = Math.cos(f);
            var A = Math.sin(f), x = m * Math.cos(v), m = m * Math.cos(g), w = h * Math.cos(v), B = h * Math.cos(g), h = n * Math.sin(v), u = n * Math.sin(g), n = ["M", c + x * z, d + m * r], n = n.concat(p(c, d, x, m, k, f, 0, 0)), n = n.concat(["L", c + w * a, d + B * A]), n = n.concat(p(c, d, w, B, f, k, 0, 0)), n = n.concat(["Z"]), C = 0 < v ? Math.PI / 2 : 0, v = 0 < g ? 0 : Math.PI / 2, C = k > -C ? k : f > -C ? -C : k, t = f < y - v ? f : k < y - v ? y - v : f, D = 2 * y - v, g = ["M", c + x * q(C), d + m * e(C)], g = g.concat(p(c, d, x, m, C, t, 0, 0));
            f > D && k < D ? (g = g.concat(["L", c + x * q(t) + h, d + m * e(t) + u]), g = g.concat(p(c,
                d, x, m, t, D, h, u)), g = g.concat(["L", c + x * q(D), d + m * e(D)]), g = g.concat(p(c, d, x, m, D, f, 0, 0)), g = g.concat(["L", c + x * q(f) + h, d + m * e(f) + u]), g = g.concat(p(c, d, x, m, f, D, h, u)), g = g.concat(["L", c + x * q(D), d + m * e(D)]), g = g.concat(p(c, d, x, m, D, t, 0, 0))) : f > y - v && k < y - v && (g = g.concat(["L", c + x * Math.cos(t) + h, d + m * Math.sin(t) + u]), g = g.concat(p(c, d, x, m, t, f, h, u)), g = g.concat(["L", c + x * Math.cos(f), d + m * Math.sin(f)]), g = g.concat(p(c, d, x, m, f, t, 0, 0)));
            g = g.concat(["L", c + x * Math.cos(t) + h, d + m * Math.sin(t) + u]);
            g = g.concat(p(c, d, x, m, t, C, h, u));
            g = g.concat(["Z"]);
            v = ["M", c + w * z, d + B * r];
            v = v.concat(p(c, d, w, B, k, f, 0, 0));
            v = v.concat(["L", c + w * Math.cos(f) + h, d + B * Math.sin(f) + u]);
            v = v.concat(p(c, d, w, B, f, k, h, u));
            v = v.concat(["Z"]);
            z = ["M", c + x * z, d + m * r, "L", c + x * z + h, d + m * r + u, "L", c + w * z + h, d + B * r + u, "L", c + w * z, d + B * r, "Z"];
            c = ["M", c + x * a, d + m * A, "L", c + x * a + h, d + m * A + u, "L", c + w * a + h, d + B * A + u, "L", c + w * a, d + B * A, "Z"];
            A = Math.atan2(u, -h);
            d = Math.abs(f + A);
            a = Math.abs(k + A);
            k = Math.abs((k + f) / 2 + A);
            d = b(d);
            a = b(a);
            k = b(k);
            k *= 1E5;
            f = 1E5 * a;
            d *= 1E5;
            return {
                top: n, zTop: 1E5 * Math.PI + 1, out: g, zOut: Math.max(k, f, d), inn: v, zInn: Math.max(k,
                    f, d), side1: z, zSide1: .99 * d, side2: c, zSide2: .99 * f
            }
        }
    })(t);
    (function (b) {
        function r(b, d) {
            var f = b.plotLeft, c = b.plotWidth + f, a = b.plotTop, k = b.plotHeight + a, e = f + b.plotWidth / 2, g = a + b.plotHeight / 2, h = Number.MAX_VALUE, n = -Number.MAX_VALUE, q = Number.MAX_VALUE, r = -Number.MAX_VALUE, u, w = 1;
            u = [{x: f, y: a, z: 0}, {x: f, y: a, z: d}];
            p([0, 1], function (a) {
                u.push({x: c, y: u[a].y, z: u[a].z})
            });
            p([0, 1, 2, 3], function (a) {
                u.push({x: u[a].x, y: k, z: u[a].z})
            });
            u = y(u, b, !1);
            p(u, function (a) {
                h = Math.min(h, a.x);
                n = Math.max(n, a.x);
                q = Math.min(q, a.y);
                r = Math.max(r,
                    a.y)
            });
            f > h && (w = Math.min(w, 1 - Math.abs((f + e) / (h + e)) % 1));
            c < n && (w = Math.min(w, (c - e) / (n - e)));
            a > q && (w = 0 > q ? Math.min(w, (a + g) / (-q + a + g)) : Math.min(w, 1 - (a + g) / (q + g) % 1));
            k < r && (w = Math.min(w, Math.abs((k - g) / (r - g))));
            return w
        }

        var g = b.Chart, p = b.each, q = b.merge, y = b.perspective, e = b.pick, h = b.wrap;
        g.prototype.is3d = function () {
            return this.options.chart.options3d && this.options.chart.options3d.enabled
        };
        g.prototype.propsRequireDirtyBox.push("chart.options3d");
        g.prototype.propsRequireUpdateSeries.push("chart.options3d");
        b.wrap(b.Chart.prototype,
            "isInsidePlot", function (b) {
                return this.is3d() || b.apply(this, [].slice.call(arguments, 1))
            });
        var n = b.getOptions();
        q(!0, n, {
            chart: {
                options3d: {
                    enabled: !1,
                    alpha: 0,
                    beta: 0,
                    depth: 100,
                    fitToPlot: !0,
                    viewDistance: 25,
                    frame: {bottom: {size: 1}, side: {size: 1}, back: {size: 1}}
                }
            }
        });
        h(g.prototype, "getContainer", function (b) {
            b.apply(this, [].slice.call(arguments, 1));
            this.renderer.definition({
                tagName: "style",
                textContent: ".highcharts-3d-top{filter: url(#highcharts-brighter)}\n.highcharts-3d-side{filter: url(#highcharts-darker)}\n"
            })
        });
        h(g.prototype, "setClassName", function (b) {
            b.apply(this, [].slice.call(arguments, 1));
            this.is3d() && (this.container.className += " highcharts-3d-chart")
        });
        b.wrap(b.Chart.prototype, "setChartSize", function (b) {
            var d = this.options.chart.options3d;
            b.apply(this, [].slice.call(arguments, 1));
            if (this.is3d()) {
                var f = this.inverted, c = this.clipBox, a = this.margin;
                c[f ? "y" : "x"] = -(a[3] || 0);
                c[f ? "x" : "y"] = -(a[0] || 0);
                c[f ? "height" : "width"] = this.chartWidth + (a[3] || 0) + (a[1] || 0);
                c[f ? "width" : "height"] = this.chartHeight + (a[0] || 0) + (a[2] ||
                    0);
                this.scale3d = 1;
                !0 === d.fitToPlot && (this.scale3d = r(this, d.depth))
            }
        });
        h(g.prototype, "redraw", function (b) {
            this.is3d() && (this.isDirtyBox = !0);
            b.apply(this, [].slice.call(arguments, 1))
        });
        h(g.prototype, "renderSeries", function (b) {
            var d = this.series.length;
            if (this.is3d())for (; d--;)b = this.series[d], b.translate(), b.render(); else b.call(this)
        });
        g.prototype.retrieveStacks = function (b) {
            var d = this.series, f = {}, c, a = 1;
            p(this.series, function (k) {
                c = e(k.options.stack, b ? 0 : d.length - 1 - k.index);
                f[c] ? f[c].series.push(k) : (f[c] =
                {series: [k], position: a}, a++)
            });
            f.totalStacks = a + 1;
            return f
        }
    })(t);
    (function (b) {
        var r, g = b.Axis, p = b.Chart, q = b.each, y = b.extend, e = b.merge, h = b.perspective, n = b.pick, f = b.splat, d = b.Tick, m = b.wrap;
        m(g.prototype, "setOptions", function (b, a) {
            b.call(this, a);
            this.chart.is3d() && (b = this.options, b.tickWidth = n(b.tickWidth, 0), b.gridLineWidth = n(b.gridLineWidth, 1))
        });
        m(g.prototype, "render", function (b) {
            b.apply(this, [].slice.call(arguments, 1));
            if (this.chart.is3d()) {
                var a = this.chart, c = a.renderer, d = a.options.chart.options3d,
                    f = d.frame, e = f.bottom, g = f.back, f = f.side, h = d.depth, m = this.height, n = this.width, p = this.left, q = this.top;
                this.isZAxis || (this.horiz ? (e = {
                    x: p,
                    y: q + (a.xAxis[0].opposite ? -e.size : m),
                    z: 0,
                    width: n,
                    height: e.size,
                    depth: h,
                    insidePlotArea: !1
                }, this.bottomFrame ? this.bottomFrame.animate(e) : this.bottomFrame = c.cuboid(e).attr({
                    "class": "highcharts-3d-frame highcharts-3d-frame-bottom",
                    zIndex: a.yAxis[0].reversed && 0 < d.alpha ? 4 : -1
                }).add()) : (d = {
                    x: p + (a.yAxis[0].opposite ? 0 : -f.size),
                    y: q + (a.xAxis[0].opposite ? -e.size : 0),
                    z: h,
                    width: n + f.size,
                    height: m + e.size,
                    depth: g.size,
                    insidePlotArea: !1
                }, this.backFrame ? this.backFrame.animate(d) : this.backFrame = c.cuboid(d).attr({
                    "class": "highcharts-3d-frame highcharts-3d-frame-back",
                    zIndex: -3
                }).add(), a = {
                    x: p + (a.yAxis[0].opposite ? n : -f.size),
                    y: q + (a.xAxis[0].opposite ? -e.size : 0),
                    z: 0,
                    width: f.size,
                    height: m + e.size,
                    depth: h,
                    insidePlotArea: !1
                }, this.sideFrame ? this.sideFrame.animate(a) : this.sideFrame = c.cuboid(a).attr({
                    "class": "highcharts-3d-frame highcharts-3d-frame-side",
                    zIndex: -2
                }).add()))
            }
        });
        m(g.prototype, "getPlotLinePath",
            function (b) {
                var a = b.apply(this, [].slice.call(arguments, 1));
                if (!this.chart.is3d() || null === a)return a;
                var c = this.chart, d = c.options.chart.options3d, c = this.isZAxis ? c.plotWidth : d.depth, d = this.opposite;
                this.horiz && (d = !d);
                a = [this.swapZ({x: a[1], y: a[2], z: d ? c : 0}), this.swapZ({
                    x: a[1],
                    y: a[2],
                    z: c
                }), this.swapZ({x: a[4], y: a[5], z: c}), this.swapZ({x: a[4], y: a[5], z: d ? 0 : c})];
                a = h(a, this.chart, !1);
                return a = this.chart.renderer.toLinePath(a, !1)
            });
        m(g.prototype, "getLinePath", function (b) {
            return this.chart.is3d() ? [] : b.apply(this,
                [].slice.call(arguments, 1))
        });
        m(g.prototype, "getPlotBandPath", function (b) {
            if (!this.chart.is3d())return b.apply(this, [].slice.call(arguments, 1));
            var a = arguments, c = a[1], a = this.getPlotLinePath(a[2]);
            (c = this.getPlotLinePath(c)) && a ? c.push("L", a[10], a[11], "L", a[7], a[8], "L", a[4], a[5], "L", a[1], a[2]) : c = null;
            return c
        });
        m(d.prototype, "getMarkPath", function (b) {
            var a = b.apply(this, [].slice.call(arguments, 1));
            if (!this.axis.chart.is3d())return a;
            a = [this.axis.swapZ({x: a[1], y: a[2], z: 0}), this.axis.swapZ({
                x: a[4], y: a[5],
                z: 0
            })];
            a = h(a, this.axis.chart, !1);
            return a = ["M", a[0].x, a[0].y, "L", a[1].x, a[1].y]
        });
        m(d.prototype, "getLabelPosition", function (b) {
            var a = b.apply(this, [].slice.call(arguments, 1));
            this.axis.chart.is3d() && (a = h([this.axis.swapZ({x: a.x, y: a.y, z: 0})], this.axis.chart, !1)[0]);
            return a
        });
        b.wrap(g.prototype, "getTitlePosition", function (b) {
            var a = this.chart.is3d(), c, d;
            a && (d = this.axisTitleMargin, this.axisTitleMargin = 0);
            c = b.apply(this, [].slice.call(arguments, 1));
            a && (c = h([this.swapZ({x: c.x, y: c.y, z: 0})], this.chart, !1)[0],
                c[this.horiz ? "y" : "x"] += (this.horiz ? 1 : -1) * (this.opposite ? -1 : 1) * d, this.axisTitleMargin = d);
            return c
        });
        m(g.prototype, "drawCrosshair", function (b) {
            var a = arguments;
            this.chart.is3d() && a[2] && (a[2] = {
                plotX: a[2].plotXold || a[2].plotX,
                plotY: a[2].plotYold || a[2].plotY
            });
            b.apply(this, [].slice.call(a, 1))
        });
        g.prototype.swapZ = function (b, a) {
            if (this.isZAxis) {
                a = a ? 0 : this.chart.plotLeft;
                var c = this.chart;
                return {x: a + (c.yAxis[0].opposite ? b.z : c.xAxis[0].width - b.z), y: b.y, z: b.x - a}
            }
            return b
        };
        r = b.ZAxis = function () {
            this.isZAxis = !0;
            this.init.apply(this, arguments)
        };
        y(r.prototype, g.prototype);
        y(r.prototype, {
            setOptions: function (b) {
                b = e({offset: 0, lineWidth: 0}, b);
                g.prototype.setOptions.call(this, b);
                this.coll = "zAxis"
            }, setAxisSize: function () {
                g.prototype.setAxisSize.call(this);
                this.width = this.len = this.chart.options.chart.options3d.depth;
                this.right = this.chart.chartWidth - this.width - this.left
            }, getSeriesExtremes: function () {
                var b = this, a = b.chart;
                b.hasVisibleSeries = !1;
                b.dataMin = b.dataMax = b.ignoreMinPadding = b.ignoreMaxPadding = null;
                b.buildStacks &&
                b.buildStacks();
                q(b.series, function (c) {
                    if (c.visible || !a.options.chart.ignoreHiddenSeries)b.hasVisibleSeries = !0, c = c.zData, c.length && (b.dataMin = Math.min(n(b.dataMin, c[0]), Math.min.apply(null, c)), b.dataMax = Math.max(n(b.dataMax, c[0]), Math.max.apply(null, c)))
                })
            }
        });
        m(p.prototype, "getAxes", function (b) {
            var a = this, c = this.options, c = c.zAxis = f(c.zAxis || {});
            b.call(this);
            a.is3d() && (this.zAxis = [], q(c, function (b, c) {
                b.index = c;
                b.isX = !0;
                (new r(a, b)).setScale()
            }))
        })
    })(t);
    (function (b) {
        function r(b) {
            if (this.chart.is3d()) {
                var f =
                    this.chart.options.plotOptions.column.grouping;
                void 0 === f || f || void 0 === this.group.zIndex || this.zIndexSet || (this.group.attr({zIndex: 10 * this.group.zIndex}), this.zIndexSet = !0)
            }
            b.apply(this, [].slice.call(arguments, 1))
        }

        var g = b.each, p = b.perspective, q = b.pick, y = b.Series, e = b.seriesTypes, h = b.svg;
        b = b.wrap;
        b(e.column.prototype, "translate", function (b) {
            b.apply(this, [].slice.call(arguments, 1));
            if (this.chart.is3d()) {
                var f = this.chart, d = this.options, e = d.depth || 25, c = (d.stacking ? d.stack || 0 : this._i) * (e + (d.groupZPadding ||
                    1));
                !1 !== d.grouping && (c = 0);
                c += d.groupZPadding || 1;
                g(this.data, function (a) {
                    if (null !== a.y) {
                        var b = a.shapeArgs, d = a.tooltipPos;
                        a.shapeType = "cuboid";
                        b.z = c;
                        b.depth = e;
                        b.insidePlotArea = !0;
                        d = p([{x: d[0], y: d[1], z: c}], f, !0)[0];
                        a.tooltipPos = [d.x, d.y]
                    }
                });
                this.z = c
            }
        });
        b(e.column.prototype, "animate", function (b) {
            if (this.chart.is3d()) {
                var f = arguments[1], d = this.yAxis, e = this, c = this.yAxis.reversed;
                h && (f ? g(e.data, function (a) {
                    null !== a.y && (a.height = a.shapeArgs.height, a.shapey = a.shapeArgs.y, a.shapeArgs.height = 1, c || (a.shapeArgs.y =
                        a.stackY ? a.plotY + d.translate(a.stackY) : a.plotY + (a.negative ? -a.height : a.height)))
                }) : (g(e.data, function (a) {
                    null !== a.y && (a.shapeArgs.height = a.height, a.shapeArgs.y = a.shapey, a.graphic && a.graphic.animate(a.shapeArgs, e.options.animation))
                }), this.drawDataLabels(), e.animate = null))
            } else b.apply(this, [].slice.call(arguments, 1))
        });
        b(e.column.prototype, "init", function (b) {
            b.apply(this, [].slice.call(arguments, 1));
            if (this.chart.is3d()) {
                var f = this.options, d = f.grouping, e = f.stacking, c = q(this.yAxis.options.reversedStacks,
                    !0), a = 0;
                if (void 0 === d || d) {
                    d = this.chart.retrieveStacks(e);
                    a = f.stack || 0;
                    for (e = 0; e < d[a].series.length && d[a].series[e] !== this; e++);
                    a = 10 * (d.totalStacks - d[a].position) + (c ? e : -e);
                    this.xAxis.reversed || (a = 10 * d.totalStacks - a)
                }
                f.zIndex = a
            }
        });
        b(y.prototype, "alignDataLabel", function (b) {
            if (this.chart.is3d() && ("column" === this.type || "columnrange" === this.type)) {
                var e = arguments[4], d = {x: e.x, y: e.y, z: this.z}, d = p([d], this.chart, !0)[0];
                e.x = d.x;
                e.y = d.y
            }
            b.apply(this, [].slice.call(arguments, 1))
        });
        e.columnrange && b(e.columnrange.prototype,
            "drawPoints", r);
        b(e.column.prototype, "drawPoints", r)
    })(t);
    (function (b) {
        var r = b.deg2rad, g = b.each, p = b.seriesTypes, q = b.svg;
        b = b.wrap;
        b(p.pie.prototype, "translate", function (b) {
            b.apply(this, [].slice.call(arguments, 1));
            if (this.chart.is3d()) {
                var e = this, h = e.options, n = h.depth || 0, f = e.chart.options.chart.options3d, d = f.alpha, m = f.beta, c = h.stacking ? (h.stack || 0) * n : e._i * n, c = c + n / 2;
                !1 !== h.grouping && (c = 0);
                g(e.data, function (a) {
                    var b = a.shapeArgs;
                    a.shapeType = "arc3d";
                    b.z = c;
                    b.depth = .75 * n;
                    b.alpha = d;
                    b.beta = m;
                    b.center = e.center;
                    b = (b.end + b.start) / 2;
                    a.slicedTranslation = {
                        translateX: Math.round(Math.cos(b) * h.slicedOffset * Math.cos(d * r)),
                        translateY: Math.round(Math.sin(b) * h.slicedOffset * Math.cos(d * r))
                    }
                })
            }
        });
        b(p.pie.prototype.pointClass.prototype, "haloPath", function (b) {
            var e = arguments;
            return this.series.chart.is3d() ? [] : b.call(this, e[1])
        });
        b(p.pie.prototype, "drawPoints", function (b) {
            b.apply(this, [].slice.call(arguments, 1));
            this.chart.is3d() && g(this.points, function (b) {
                var e = b.graphic;
                if (e)e[b.y && b.visible ? "show" : "hide"]()
            })
        });
        b(p.pie.prototype,
            "drawDataLabels", function (b) {
                if (this.chart.is3d()) {
                    var e = this.chart.options.chart.options3d;
                    g(this.data, function (b) {
                        var h = b.shapeArgs, f = h.r, d = (h.start + h.end) / 2, m = b.labelPos, c = -f * (1 - Math.cos((h.alpha || e.alpha) * r)) * Math.sin(d), a = f * (Math.cos((h.beta || e.beta) * r) - 1) * Math.cos(d);
                        g([0, 2, 4], function (b) {
                            m[b] += a;
                            m[b + 1] += c
                        })
                    })
                }
                b.apply(this, [].slice.call(arguments, 1))
            });
        b(p.pie.prototype, "addPoint", function (b) {
            b.apply(this, [].slice.call(arguments, 1));
            this.chart.is3d() && this.update(this.userOptions, !0)
        });
        b(p.pie.prototype,
            "animate", function (b) {
                if (this.chart.is3d()) {
                    var e = arguments[1], g = this.options.animation, n = this.center, f = this.group, d = this.markerGroup;
                    q && (!0 === g && (g = {}), e ? (f.oldtranslateX = f.translateX, f.oldtranslateY = f.translateY, e = {
                        translateX: n[0],
                        translateY: n[1],
                        scaleX: .001,
                        scaleY: .001
                    }, f.attr(e), d && (d.attrSetters = f.attrSetters, d.attr(e))) : (e = {
                        translateX: f.oldtranslateX,
                        translateY: f.oldtranslateY,
                        scaleX: 1,
                        scaleY: 1
                    }, f.animate(e, g), d && d.animate(e, g), this.animate = null))
                } else b.apply(this, [].slice.call(arguments, 1))
            })
    })(t);
    (function (b) {
        var r = b.perspective, g = b.pick, p = b.Point, q = b.seriesTypes, t = b.wrap;
        t(q.scatter.prototype, "translate", function (b) {
            b.apply(this, [].slice.call(arguments, 1));
            if (this.chart.is3d()) {
                var e = this.chart, n = g(this.zAxis, e.options.zAxis[0]), f = [], d, m, c;
                for (c = 0; c < this.data.length; c++)d = this.data[c], m = n.isLog && n.val2lin ? n.val2lin(d.z) : d.z, d.plotZ = n.translate(m), d.isInside = d.isInside ? m >= n.min && m <= n.max : !1, f.push({
                    x: d.plotX,
                    y: d.plotY,
                    z: d.plotZ
                });
                e = r(f, e, !0);
                for (c = 0; c < this.data.length; c++)d = this.data[c], n =
                    e[c], d.plotXold = d.plotX, d.plotYold = d.plotY, d.plotZold = d.plotZ, d.plotX = n.x, d.plotY = n.y, d.plotZ = n.z
            }
        });
        t(q.scatter.prototype, "init", function (b, g, n) {
            g.is3d() && (this.axisTypes = ["xAxis", "yAxis", "zAxis"], this.pointArrayMap = ["x", "y", "z"], this.parallelArrays = ["x", "y", "z"], this.directTouch = !0);
            b = b.apply(this, [g, n]);
            this.chart.is3d() && (this.tooltipOptions.pointFormat = this.userOptions.tooltip ? this.userOptions.tooltip.pointFormat || "x: \x3cb\x3e{point.x}\x3c/b\x3e\x3cbr/\x3ey: \x3cb\x3e{point.y}\x3c/b\x3e\x3cbr/\x3ez: \x3cb\x3e{point.z}\x3c/b\x3e\x3cbr/\x3e" :
                "x: \x3cb\x3e{point.x}\x3c/b\x3e\x3cbr/\x3ey: \x3cb\x3e{point.y}\x3c/b\x3e\x3cbr/\x3ez: \x3cb\x3e{point.z}\x3c/b\x3e\x3cbr/\x3e");
            return b
        });
        t(q.scatter.prototype, "pointAttribs", function (e, g) {
            var h = e.apply(this, [].slice.call(arguments, 1));
            this.chart.is3d() && g && (h.zIndex = b.pointCameraDistance(g, this.chart));
            return h
        });
        t(p.prototype, "applyOptions", function (b) {
            var e = b.apply(this, [].slice.call(arguments, 1));
            this.series.chart.is3d() && void 0 === e.z && (e.z = 0);
            return e
        })
    })(t)
});
