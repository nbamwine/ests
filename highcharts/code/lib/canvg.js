/*

 canvg.js - Javascript SVG parser and renderer on Canvas
 MIT Licensed
 Gabe Lerner (gabelerner@gmail.com)
 http://code.google.com/p/canvg/

 Requires: rgbcolor.js - http://www.phpied.com/rgb-color-parser-in-javascript/
 */
(function (x, y) {
    "undefined" !== typeof define && define.amd ? define("canvgModule", ["rgbcolor", "stackblur"], y) : "undefined" !== typeof module && module.exports && (module.exports = y(require("rgbcolor"), require("stackblur")));
    x.canvg = y(x.RGBColor, x.stackBlur)
})("undefined" !== typeof window ? window : this, function (x, y) {
    function A(h) {
        var a = [0, 0, 0], l = function (c, b) {
            var e = h.match(c);
            null != e && (a[b] += e.length, h = h.replace(c, " "))
        };
        h = h.replace(/:not\(([^\)]*)\)/g, "     $1 ");
        h = h.replace(/{[^]*/gm, " ");
        l(B, 1);
        l(C, 0);
        l(D, 1);
        l(E,
            2);
        l(F, 1);
        l(G, 1);
        h = h.replace(/[\*\s\+>~]/g, " ");
        h = h.replace(/[#\.]/g, " ");
        l(H, 2);
        return a.join("")
    }

    function I(h) {
        var a = {
            opts: h, FRAMERATE: 30, MAX_VIRTUAL_PIXELS: 3E4, log: function (a) {
            }
        };
        1 == a.opts.log && "undefined" != typeof console && (a.log = function (a) {
            console.log(a)
        });
        a.init = function (c) {
            var b = 0;
            a.UniqueId = function () {
                b++;
                return "canvg" + b
            };
            a.Definitions = {};
            a.Styles = {};
            a.StylesSpecificity = {};
            a.Animations = [];
            a.Images = [];
            a.ctx = c;
            a.ViewPort = new function () {
                this.viewPorts = [];
                this.Clear = function () {
                    this.viewPorts =
                        []
                };
                this.SetCurrent = function (a, b) {
                    this.viewPorts.push({width: a, height: b})
                };
                this.RemoveCurrent = function () {
                    this.viewPorts.pop()
                };
                this.Current = function () {
                    return this.viewPorts[this.viewPorts.length - 1]
                };
                this.width = function () {
                    return this.Current().width
                };
                this.height = function () {
                    return this.Current().height
                };
                this.ComputeSize = function (a) {
                    return null != a && "number" == typeof a ? a : "x" == a ? this.width() : "y" == a ? this.height() : Math.sqrt(Math.pow(this.width(), 2) + Math.pow(this.height(), 2)) / Math.sqrt(2)
                }
            }
        };
        a.init();
        a.ImagesLoaded =
            function () {
                for (var c = 0; c < a.Images.length; c++)if (!a.Images[c].loaded)return !1;
                return !0
            };
        a.trim = function (a) {
            return a.replace(/^\s+|\s+$/g, "")
        };
        a.compressSpaces = function (a) {
            return a.replace(/[\s\r\t\n]+/gm, " ")
        };
        a.ajax = function (a) {
            var b;
            b = window.XMLHttpRequest ? new XMLHttpRequest : new ActiveXObject("Microsoft.XMLHTTP");
            b.open("GET", a, !1);
            b.send(null);
            return b.responseText
        };
        a.parseXml = function (a) {
            if ("undefined" != typeof Windows && "undefined" != typeof Windows.Data && "undefined" != typeof Windows.Data.Xml) {
                var b =
                    new Windows.Data.Xml.Dom.XmlDocument, e = new Windows.Data.Xml.Dom.XmlLoadSettings;
                e.prohibitDtd = !1;
                b.loadXml(a, e);
                return b
            }
            if (window.DOMParser)return (new DOMParser).parseFromString(a, "text/xml");
            a = a.replace(/<!DOCTYPE svg[^>]*>/, "");
            b = new ActiveXObject("Microsoft.XMLDOM");
            b.async = "false";
            b.loadXML(a);
            return b
        };
        a.Property = function (a, b) {
            this.name = a;
            this.value = b
        };
        a.Property.prototype.getValue = function () {
            return this.value
        };
        a.Property.prototype.hasValue = function () {
            return null != this.value && "" !== this.value
        };
        a.Property.prototype.numValue = function () {
            if (!this.hasValue())return 0;
            var a = parseFloat(this.value);
            (this.value + "").match(/%$/) && (a /= 100);
            return a
        };
        a.Property.prototype.valueOrDefault = function (a) {
            return this.hasValue() ? this.value : a
        };
        a.Property.prototype.numValueOrDefault = function (a) {
            return this.hasValue() ? this.numValue() : a
        };
        a.Property.prototype.addOpacity = function (c) {
            var b = this.value;
            if (null != c.value && "" != c.value && "string" == typeof this.value) {
                var e = new x(this.value);
                e.ok && (b = "rgba(" + e.r + ", " + e.g + ", " +
                    e.b + ", " + c.numValue() + ")")
            }
            return new a.Property(this.name, b)
        };
        a.Property.prototype.getDefinition = function () {
            var c = this.value.match(/#([^\)'"]+)/);
            c && (c = c[1]);
            c || (c = this.value);
            return a.Definitions[c]
        };
        a.Property.prototype.isUrlDefinition = function () {
            return 0 == this.value.indexOf("url(")
        };
        a.Property.prototype.getFillStyleDefinition = function (c, b) {
            var e = this.getDefinition();
            if (null != e && e.createGradient)return e.createGradient(a.ctx, c, b);
            if (null != e && e.createPattern) {
                if (e.getHrefAttribute().hasValue()) {
                    var d =
                        e.attribute("patternTransform"), e = e.getHrefAttribute().getDefinition();
                    d.hasValue() && (e.attribute("patternTransform", !0).value = d.value)
                }
                return e.createPattern(a.ctx, c)
            }
            return null
        };
        a.Property.prototype.getDPI = function (a) {
            return 96
        };
        a.Property.prototype.getEM = function (c) {
            var b = 12, e = new a.Property("fontSize", a.Font.Parse(a.ctx.font).fontSize);
            e.hasValue() && (b = e.toPixels(c));
            return b
        };
        a.Property.prototype.getUnits = function () {
            return (this.value + "").replace(/[0-9\.\-]/g, "")
        };
        a.Property.prototype.toPixels =
            function (c, b) {
                if (!this.hasValue())return 0;
                var e = this.value + "";
                if (e.match(/em$/))return this.numValue() * this.getEM(c);
                if (e.match(/ex$/))return this.numValue() * this.getEM(c) / 2;
                if (e.match(/px$/))return this.numValue();
                if (e.match(/pt$/))return this.numValue() * this.getDPI(c) * (1 / 72);
                if (e.match(/pc$/))return 15 * this.numValue();
                if (e.match(/cm$/))return this.numValue() * this.getDPI(c) / 2.54;
                if (e.match(/mm$/))return this.numValue() * this.getDPI(c) / 25.4;
                if (e.match(/in$/))return this.numValue() * this.getDPI(c);
                if (e.match(/%$/))return this.numValue() * a.ViewPort.ComputeSize(c);
                e = this.numValue();
                return b && 1 > e ? e * a.ViewPort.ComputeSize(c) : e
            };
        a.Property.prototype.toMilliseconds = function () {
            if (!this.hasValue())return 0;
            var a = this.value + "";
            if (a.match(/s$/))return 1E3 * this.numValue();
            a.match(/ms$/);
            return this.numValue()
        };
        a.Property.prototype.toRadians = function () {
            if (!this.hasValue())return 0;
            var a = this.value + "";
            return a.match(/deg$/) ? this.numValue() * (Math.PI / 180) : a.match(/grad$/) ? this.numValue() * (Math.PI / 200) : a.match(/rad$/) ?
                this.numValue() : this.numValue() * (Math.PI / 180)
        };
        var l = {
            baseline: "alphabetic",
            "before-edge": "top",
            "text-before-edge": "top",
            middle: "middle",
            central: "middle",
            "after-edge": "bottom",
            "text-after-edge": "bottom",
            ideographic: "ideographic",
            alphabetic: "alphabetic",
            hanging: "hanging",
            mathematical: "alphabetic"
        };
        a.Property.prototype.toTextBaseline = function () {
            return this.hasValue() ? l[this.value] : null
        };
        a.Font = new function () {
            this.Styles = "normal|italic|oblique|inherit";
            this.Variants = "normal|small-caps|inherit";
            this.Weights =
                "normal|bold|bolder|lighter|100|200|300|400|500|600|700|800|900|inherit";
            this.CreateFont = function (b, e, d, c, f, g) {
                g = null != g ? this.Parse(g) : this.CreateFont("", "", "", "", "", a.ctx.font);
                return {
                    fontFamily: f || g.fontFamily,
                    fontSize: c || g.fontSize,
                    fontStyle: b || g.fontStyle,
                    fontWeight: d || g.fontWeight,
                    fontVariant: e || g.fontVariant,
                    toString: function () {
                        return [this.fontStyle, this.fontVariant, this.fontWeight, this.fontSize, this.fontFamily].join(" ")
                    }
                }
            };
            var c = this;
            this.Parse = function (b) {
                var e = {};
                b = a.trim(a.compressSpaces(b ||
                    "")).split(" ");
                for (var d = !1, k = !1, f = !1, g = !1, m = "", n = 0; n < b.length; n++)k || -1 == c.Styles.indexOf(b[n]) ? g || -1 == c.Variants.indexOf(b[n]) ? f || -1 == c.Weights.indexOf(b[n]) ? d ? "inherit" != b[n] && (m += b[n]) : ("inherit" != b[n] && (e.fontSize = b[n].split("/")[0]), k = g = f = d = !0) : ("inherit" != b[n] && (e.fontWeight = b[n]), k = g = f = !0) : ("inherit" != b[n] && (e.fontVariant = b[n]), k = g = !0) : ("inherit" != b[n] && (e.fontStyle = b[n]), k = !0);
                "" != m && (e.fontFamily = m);
                return e
            }
        };
        a.ToNumberArray = function (c) {
            c = a.trim(a.compressSpaces((c || "").replace(/,/g, " "))).split(" ");
            for (var b = 0; b < c.length; b++)c[b] = parseFloat(c[b]);
            return c
        };
        a.Point = function (a, b) {
            this.x = a;
            this.y = b
        };
        a.Point.prototype.angleTo = function (a) {
            return Math.atan2(a.y - this.y, a.x - this.x)
        };
        a.Point.prototype.applyTransform = function (a) {
            var b = this.x * a[1] + this.y * a[3] + a[5];
            this.x = this.x * a[0] + this.y * a[2] + a[4];
            this.y = b
        };
        a.CreatePoint = function (c) {
            c = a.ToNumberArray(c);
            return new a.Point(c[0], c[1])
        };
        a.CreatePath = function (c) {
            c = a.ToNumberArray(c);
            for (var b = [], e = 0; e < c.length; e += 2)b.push(new a.Point(c[e], c[e + 1]));
            return b
        };
        a.BoundingBox = function (a, b, e, d) {
            this.y2 = this.x2 = this.y1 = this.x1 = Number.NaN;
            this.x = function () {
                return this.x1
            };
            this.y = function () {
                return this.y1
            };
            this.width = function () {
                return this.x2 - this.x1
            };
            this.height = function () {
                return this.y2 - this.y1
            };
            this.addPoint = function (a, b) {
                if (null != a) {
                    if (isNaN(this.x1) || isNaN(this.x2))this.x2 = this.x1 = a;
                    a < this.x1 && (this.x1 = a);
                    a > this.x2 && (this.x2 = a)
                }
                if (null != b) {
                    if (isNaN(this.y1) || isNaN(this.y2))this.y2 = this.y1 = b;
                    b < this.y1 && (this.y1 = b);
                    b > this.y2 && (this.y2 = b)
                }
            };
            this.addX = function (a) {
                this.addPoint(a,
                    null)
            };
            this.addY = function (a) {
                this.addPoint(null, a)
            };
            this.addBoundingBox = function (a) {
                this.addPoint(a.x1, a.y1);
                this.addPoint(a.x2, a.y2)
            };
            this.addQuadraticCurve = function (a, b, e, d, c, r) {
                e = a + 2 / 3 * (e - a);
                d = b + 2 / 3 * (d - b);
                this.addBezierCurve(a, b, e, e + 1 / 3 * (c - a), d, d + 1 / 3 * (r - b), c, r)
            };
            this.addBezierCurve = function (a, b, e, d, c, r, u, p) {
                var t = [a, b], h = [e, d], q = [c, r], l = [u, p];
                this.addPoint(t[0], t[1]);
                this.addPoint(l[0], l[1]);
                for (i = 0; 1 >= i; i++)a = function (a) {
                    return Math.pow(1 - a, 3) * t[i] + 3 * Math.pow(1 - a, 2) * a * h[i] + 3 * (1 - a) * Math.pow(a,
                            2) * q[i] + Math.pow(a, 3) * l[i]
                }, b = 6 * t[i] - 12 * h[i] + 6 * q[i], e = -3 * t[i] + 9 * h[i] - 9 * q[i] + 3 * l[i], d = 3 * h[i] - 3 * t[i], 0 == e ? 0 != b && (b = -d / b, 0 < b && 1 > b && (0 == i && this.addX(a(b)), 1 == i && this.addY(a(b)))) : (d = Math.pow(b, 2) - 4 * d * e, 0 > d || (c = (-b + Math.sqrt(d)) / (2 * e), 0 < c && 1 > c && (0 == i && this.addX(a(c)), 1 == i && this.addY(a(c))), b = (-b - Math.sqrt(d)) / (2 * e), 0 < b && 1 > b && (0 == i && this.addX(a(b)), 1 == i && this.addY(a(b)))))
            };
            this.isPointInBox = function (a, b) {
                return this.x1 <= a && a <= this.x2 && this.y1 <= b && b <= this.y2
            };
            this.addPoint(a, b);
            this.addPoint(e, d)
        };
        a.Transform =
            function (c) {
                var b = this;
                this.Type = {};
                this.Type.translate = function (b) {
                    this.p = a.CreatePoint(b);
                    this.apply = function (a) {
                        a.translate(this.p.x || 0, this.p.y || 0)
                    };
                    this.unapply = function (a) {
                        a.translate(-1 * this.p.x || 0, -1 * this.p.y || 0)
                    };
                    this.applyToPoint = function (a) {
                        a.applyTransform([1, 0, 0, 1, this.p.x || 0, this.p.y || 0])
                    }
                };
                this.Type.rotate = function (b) {
                    b = a.ToNumberArray(b);
                    this.angle = new a.Property("angle", b[0]);
                    this.cx = b[1] || 0;
                    this.cy = b[2] || 0;
                    this.apply = function (a) {
                        a.translate(this.cx, this.cy);
                        a.rotate(this.angle.toRadians());
                        a.translate(-this.cx, -this.cy)
                    };
                    this.unapply = function (a) {
                        a.translate(this.cx, this.cy);
                        a.rotate(-1 * this.angle.toRadians());
                        a.translate(-this.cx, -this.cy)
                    };
                    this.applyToPoint = function (a) {
                        var b = this.angle.toRadians();
                        a.applyTransform([1, 0, 0, 1, this.p.x || 0, this.p.y || 0]);
                        a.applyTransform([Math.cos(b), Math.sin(b), -Math.sin(b), Math.cos(b), 0, 0]);
                        a.applyTransform([1, 0, 0, 1, -this.p.x || 0, -this.p.y || 0])
                    }
                };
                this.Type.scale = function (b) {
                    this.p = a.CreatePoint(b);
                    this.apply = function (a) {
                        a.scale(this.p.x || 1, this.p.y || this.p.x ||
                            1)
                    };
                    this.unapply = function (a) {
                        a.scale(1 / this.p.x || 1, 1 / this.p.y || this.p.x || 1)
                    };
                    this.applyToPoint = function (a) {
                        a.applyTransform([this.p.x || 0, 0, 0, this.p.y || 0, 0, 0])
                    }
                };
                this.Type.matrix = function (b) {
                    this.m = a.ToNumberArray(b);
                    this.apply = function (a) {
                        a.transform(this.m[0], this.m[1], this.m[2], this.m[3], this.m[4], this.m[5])
                    };
                    this.unapply = function (a) {
                        var b = this.m[0], e = this.m[2], d = this.m[4], c = this.m[1], f = this.m[3], k = this.m[5], h = 1 / (b * (1 * f - 0 * k) - e * (1 * c - 0 * k) + d * (0 * c - 0 * f));
                        a.transform(h * (1 * f - 0 * k), h * (0 * k - 1 * c), h * (0 * d - 1 *
                            e), h * (1 * b - 0 * d), h * (e * k - d * f), h * (d * c - b * k))
                    };
                    this.applyToPoint = function (a) {
                        a.applyTransform(this.m)
                    }
                };
                this.Type.SkewBase = function (e) {
                    this.base = b.Type.matrix;
                    this.base(e);
                    this.angle = new a.Property("angle", e)
                };
                this.Type.SkewBase.prototype = new this.Type.matrix;
                this.Type.skewX = function (a) {
                    this.base = b.Type.SkewBase;
                    this.base(a);
                    this.m = [1, 0, Math.tan(this.angle.toRadians()), 1, 0, 0]
                };
                this.Type.skewX.prototype = new this.Type.SkewBase;
                this.Type.skewY = function (a) {
                    this.base = b.Type.SkewBase;
                    this.base(a);
                    this.m = [1, Math.tan(this.angle.toRadians()),
                        0, 1, 0, 0]
                };
                this.Type.skewY.prototype = new this.Type.SkewBase;
                this.transforms = [];
                this.apply = function (a) {
                    for (var b = 0; b < this.transforms.length; b++)this.transforms[b].apply(a)
                };
                this.unapply = function (a) {
                    for (var b = this.transforms.length - 1; 0 <= b; b--)this.transforms[b].unapply(a)
                };
                this.applyToPoint = function (a) {
                    for (var b = 0; b < this.transforms.length; b++)this.transforms[b].applyToPoint(a)
                };
                c = a.trim(a.compressSpaces(c)).replace(/\)([a-zA-Z])/g, ") $1").replace(/\)(\s?,\s?)/g, ") ").split(/\s(?=[a-z])/);
                for (var e = 0; e <
                c.length; e++) {
                    var d = a.trim(c[e].split("(")[0]), k = c[e].split("(")[1].replace(")", ""), k = new this.Type[d](k);
                    k.type = d;
                    this.transforms.push(k)
                }
            };
        a.AspectRatio = function (c, b, e, d, k, f, g, m, n, r) {
            b = a.compressSpaces(b);
            b = b.replace(/^defer\s/, "");
            var h = b.split(" ")[0] || "xMidYMid";
            b = b.split(" ")[1] || "meet";
            var p = e / d, t = k / f, l = Math.min(p, t), q = Math.max(p, t);
            "meet" == b && (d *= l, f *= l);
            "slice" == b && (d *= q, f *= q);
            n = new a.Property("refX", n);
            r = new a.Property("refY", r);
            n.hasValue() && r.hasValue() ? c.translate(-l * n.toPixels("x"),
                -l * r.toPixels("y")) : (h.match(/^xMid/) && ("meet" == b && l == t || "slice" == b && q == t) && c.translate(e / 2 - d / 2, 0), h.match(/YMid$/) && ("meet" == b && l == p || "slice" == b && q == p) && c.translate(0, k / 2 - f / 2), h.match(/^xMax/) && ("meet" == b && l == t || "slice" == b && q == t) && c.translate(e - d, 0), h.match(/YMax$/) && ("meet" == b && l == p || "slice" == b && q == p) && c.translate(0, k - f));
            "none" == h ? c.scale(p, t) : "meet" == b ? c.scale(l, l) : "slice" == b && c.scale(q, q);
            c.translate(null == g ? 0 : -g, null == m ? 0 : -m)
        };
        a.Element = {};
        a.EmptyProperty = new a.Property("EMPTY", "");
        a.Element.ElementBase =
            function (c) {
                this.attributes = {};
                this.styles = {};
                this.stylesSpecificity = {};
                this.children = [];
                this.attribute = function (b, e) {
                    var d = this.attributes[b];
                    if (null != d)return d;
                    1 == e && (d = new a.Property(b, ""), this.attributes[b] = d);
                    return d || a.EmptyProperty
                };
                this.getHrefAttribute = function () {
                    for (var b in this.attributes)if ("href" == b || b.match(/:href$/))return this.attributes[b];
                    return a.EmptyProperty
                };
                this.style = function (b, e, d) {
                    var c = this.styles[b];
                    if (null != c)return c;
                    var k = this.attribute(b);
                    if (null != k && k.hasValue())return this.styles[b] =
                        k;
                    if (1 != d && (d = this.parent, null != d && (d = d.style(b), null != d && d.hasValue())))return d;
                    1 == e && (c = new a.Property(b, ""), this.styles[b] = c);
                    return c || a.EmptyProperty
                };
                this.render = function (a) {
                    if ("none" != this.style("display").value && "hidden" != this.style("visibility").value) {
                        a.save();
                        if (this.style("mask").hasValue()) {
                            var b = this.style("mask").getDefinition();
                            null != b && b.apply(a, this)
                        } else this.style("filter").hasValue() ? (b = this.style("filter").getDefinition(), null != b && b.apply(a, this)) : (this.setContext(a), this.renderChildren(a),
                            this.clearContext(a));
                        a.restore()
                    }
                };
                this.setContext = function (a) {
                };
                this.clearContext = function (a) {
                };
                this.renderChildren = function (a) {
                    for (var b = 0; b < this.children.length; b++)this.children[b].render(a)
                };
                this.addChild = function (b, e) {
                    var d = b;
                    e && (d = a.CreateElement(b));
                    d.parent = this;
                    "title" != d.type && this.children.push(d)
                };
                this.addStylesFromStyleDefinition = function () {
                    for (var b in a.Styles)if ("@" != b[0] && w(c, b)) {
                        var e = a.Styles[b], d = a.StylesSpecificity[b];
                        if (null != e)for (var k in e) {
                            var r = this.stylesSpecificity[k];
                            "undefined" == typeof r && (r = "000");
                            d > r && (this.styles[k] = e[k], this.stylesSpecificity[k] = d)
                        }
                    }
                };
                if (null != c && 1 == c.nodeType) {
                    for (var b = 0; b < c.attributes.length; b++) {
                        var e = c.attributes[b];
                        this.attributes[e.nodeName] = new a.Property(e.nodeName, e.value)
                    }
                    this.addStylesFromStyleDefinition();
                    if (this.attribute("style").hasValue())for (e = this.attribute("style").value.split(";"), b = 0; b < e.length; b++)if ("" != a.trim(e[b])) {
                        var d = e[b].split(":"), k = a.trim(d[0]), d = a.trim(d[1]);
                        this.styles[k] = new a.Property(k, d)
                    }
                    this.attribute("id").hasValue() &&
                    null == a.Definitions[this.attribute("id").value] && (a.Definitions[this.attribute("id").value] = this);
                    for (b = 0; b < c.childNodes.length; b++)e = c.childNodes[b], 1 == e.nodeType && this.addChild(e, !0), !this.captureTextNodes || 3 != e.nodeType && 4 != e.nodeType || "" != a.compressSpaces(e.value || e.text || e.textContent || "") && this.addChild(new a.Element.tspan(e), !1)
                }
            };
        a.Element.RenderedElementBase = function (c) {
            this.base = a.Element.ElementBase;
            this.base(c);
            this.setContext = function (b) {
                if (this.style("fill").isUrlDefinition()) {
                    var e =
                        this.style("fill").getFillStyleDefinition(this, this.style("fill-opacity"));
                    null != e && (b.fillStyle = e)
                } else this.style("fill").hasValue() && (e = this.style("fill"), "currentColor" == e.value && (e.value = this.style("color").value), "inherit" != e.value && (b.fillStyle = "none" == e.value ? "rgba(0,0,0,0)" : e.value));
                this.style("fill-opacity").hasValue() && (e = new a.Property("fill", b.fillStyle), e = e.addOpacity(this.style("fill-opacity")), b.fillStyle = e.value);
                this.style("stroke").isUrlDefinition() ? (e = this.style("stroke").getFillStyleDefinition(this,
                    this.style("stroke-opacity")), null != e && (b.strokeStyle = e)) : this.style("stroke").hasValue() && (e = this.style("stroke"), "currentColor" == e.value && (e.value = this.style("color").value), "inherit" != e.value && (b.strokeStyle = "none" == e.value ? "rgba(0,0,0,0)" : e.value));
                this.style("stroke-opacity").hasValue() && (e = new a.Property("stroke", b.strokeStyle), e = e.addOpacity(this.style("stroke-opacity")), b.strokeStyle = e.value);
                this.style("stroke-width").hasValue() && (e = this.style("stroke-width").toPixels(), b.lineWidth = 0 == e ?
                    .001 : e);
                this.style("stroke-linecap").hasValue() && (b.lineCap = this.style("stroke-linecap").value);
                this.style("stroke-linejoin").hasValue() && (b.lineJoin = this.style("stroke-linejoin").value);
                this.style("stroke-miterlimit").hasValue() && (b.miterLimit = this.style("stroke-miterlimit").value);
                this.style("stroke-dasharray").hasValue() && "none" != this.style("stroke-dasharray").value && (e = a.ToNumberArray(this.style("stroke-dasharray").value), "undefined" != typeof b.setLineDash ? b.setLineDash(e) : "undefined" != typeof b.webkitLineDash ?
                    b.webkitLineDash = e : "undefined" == typeof b.mozDash || 1 == e.length && 0 == e[0] || (b.mozDash = e), e = this.style("stroke-dashoffset").numValueOrDefault(1), "undefined" != typeof b.lineDashOffset ? b.lineDashOffset = e : "undefined" != typeof b.webkitLineDashOffset ? b.webkitLineDashOffset = e : "undefined" != typeof b.mozDashOffset && (b.mozDashOffset = e));
                "undefined" != typeof b.font && (b.font = a.Font.CreateFont(this.style("font-style").value, this.style("font-variant").value, this.style("font-weight").value, this.style("font-size").hasValue() ?
                this.style("font-size").toPixels() + "px" : "", this.style("font-family").value).toString());
                this.style("transform", !1, !0).hasValue() && (new a.Transform(this.style("transform", !1, !0).value)).apply(b);
                this.style("clip-path", !1, !0).hasValue() && (e = this.style("clip-path", !1, !0).getDefinition(), null != e && e.apply(b));
                this.style("opacity").hasValue() && (b.globalAlpha = this.style("opacity").numValue())
            }
        };
        a.Element.RenderedElementBase.prototype = new a.Element.ElementBase;
        a.Element.PathElementBase = function (c) {
            this.base =
                a.Element.RenderedElementBase;
            this.base(c);
            this.path = function (b) {
                null != b && b.beginPath();
                return new a.BoundingBox
            };
            this.renderChildren = function (b) {
                this.path(b);
                a.Mouse.checkPath(this, b);
                "" != b.fillStyle && ("inherit" != this.style("fill-rule").valueOrDefault("inherit") ? b.fill(this.style("fill-rule").value) : b.fill());
                "" != b.strokeStyle && b.stroke();
                var e = this.getMarkers();
                if (null != e) {
                    if (this.style("marker-start").isUrlDefinition()) {
                        var d = this.style("marker-start").getDefinition();
                        d.render(b, e[0][0], e[0][1])
                    }
                    if (this.style("marker-mid").isUrlDefinition())for (var d =
                        this.style("marker-mid").getDefinition(), c = 1; c < e.length - 1; c++)d.render(b, e[c][0], e[c][1]);
                    this.style("marker-end").isUrlDefinition() && (d = this.style("marker-end").getDefinition(), d.render(b, e[e.length - 1][0], e[e.length - 1][1]))
                }
            };
            this.getBoundingBox = function () {
                return this.path()
            };
            this.getMarkers = function () {
                return null
            }
        };
        a.Element.PathElementBase.prototype = new a.Element.RenderedElementBase;
        a.Element.svg = function (c) {
            this.base = a.Element.RenderedElementBase;
            this.base(c);
            this.baseClearContext = this.clearContext;
            this.clearContext = function (b) {
                this.baseClearContext(b);
                a.ViewPort.RemoveCurrent()
            };
            this.baseSetContext = this.setContext;
            this.setContext = function (b) {
                b.strokeStyle = "rgba(0,0,0,0)";
                b.lineCap = "butt";
                b.lineJoin = "miter";
                b.miterLimit = 4;
                "undefined" != typeof b.font && "undefined" != typeof window.getComputedStyle && (b.font = window.getComputedStyle(b.canvas).getPropertyValue("font"));
                this.baseSetContext(b);
                this.attribute("x").hasValue() || (this.attribute("x", !0).value = 0);
                this.attribute("y").hasValue() || (this.attribute("y",
                    !0).value = 0);
                b.translate(this.attribute("x").toPixels("x"), this.attribute("y").toPixels("y"));
                var e = a.ViewPort.width(), d = a.ViewPort.height();
                this.attribute("width").hasValue() || (this.attribute("width", !0).value = "100%");
                this.attribute("height").hasValue() || (this.attribute("height", !0).value = "100%");
                if ("undefined" == typeof this.root) {
                    var e = this.attribute("width").toPixels("x"), d = this.attribute("height").toPixels("y"), c = 0, f = 0;
                    this.attribute("refX").hasValue() && this.attribute("refY").hasValue() && (c = -this.attribute("refX").toPixels("x"),
                        f = -this.attribute("refY").toPixels("y"));
                    "visible" != this.attribute("overflow").valueOrDefault("hidden") && (b.beginPath(), b.moveTo(c, f), b.lineTo(e, f), b.lineTo(e, d), b.lineTo(c, d), b.closePath(), b.clip())
                }
                a.ViewPort.SetCurrent(e, d);
                if (this.attribute("viewBox").hasValue()) {
                    var c = a.ToNumberArray(this.attribute("viewBox").value), f = c[0], g = c[1], e = c[2], d = c[3];
                    a.AspectRatio(b, this.attribute("preserveAspectRatio").value, a.ViewPort.width(), e, a.ViewPort.height(), d, f, g, this.attribute("refX").value, this.attribute("refY").value);
                    a.ViewPort.RemoveCurrent();
                    a.ViewPort.SetCurrent(c[2], c[3])
                }
            }
        };
        a.Element.svg.prototype = new a.Element.RenderedElementBase;
        a.Element.rect = function (c) {
            this.base = a.Element.PathElementBase;
            this.base(c);
            this.path = function (b) {
                var e = this.attribute("x").toPixels("x"), d = this.attribute("y").toPixels("y"), c = this.attribute("width").toPixels("x"), f = this.attribute("height").toPixels("y"), g = this.attribute("rx").toPixels("x"), m = this.attribute("ry").toPixels("y");
                this.attribute("rx").hasValue() && !this.attribute("ry").hasValue() &&
                (m = g);
                this.attribute("ry").hasValue() && !this.attribute("rx").hasValue() && (g = m);
                g = Math.min(g, c / 2);
                m = Math.min(m, f / 2);
                null != b && (b.beginPath(), b.moveTo(e + g, d), b.lineTo(e + c - g, d), b.quadraticCurveTo(e + c, d, e + c, d + m), b.lineTo(e + c, d + f - m), b.quadraticCurveTo(e + c, d + f, e + c - g, d + f), b.lineTo(e + g, d + f), b.quadraticCurveTo(e, d + f, e, d + f - m), b.lineTo(e, d + m), b.quadraticCurveTo(e, d, e + g, d), b.closePath());
                return new a.BoundingBox(e, d, e + c, d + f)
            }
        };
        a.Element.rect.prototype = new a.Element.PathElementBase;
        a.Element.circle = function (c) {
            this.base =
                a.Element.PathElementBase;
            this.base(c);
            this.path = function (b) {
                var e = this.attribute("cx").toPixels("x"), d = this.attribute("cy").toPixels("y"), c = this.attribute("r").toPixels();
                null != b && (b.beginPath(), b.arc(e, d, c, 0, 2 * Math.PI, !0), b.closePath());
                return new a.BoundingBox(e - c, d - c, e + c, d + c)
            }
        };
        a.Element.circle.prototype = new a.Element.PathElementBase;
        a.Element.ellipse = function (c) {
            this.base = a.Element.PathElementBase;
            this.base(c);
            this.path = function (b) {
                var e = (Math.sqrt(2) - 1) / 3 * 4, d = this.attribute("rx").toPixels("x"),
                    c = this.attribute("ry").toPixels("y"), f = this.attribute("cx").toPixels("x"), g = this.attribute("cy").toPixels("y");
                null != b && (b.beginPath(), b.moveTo(f, g - c), b.bezierCurveTo(f + e * d, g - c, f + d, g - e * c, f + d, g), b.bezierCurveTo(f + d, g + e * c, f + e * d, g + c, f, g + c), b.bezierCurveTo(f - e * d, g + c, f - d, g + e * c, f - d, g), b.bezierCurveTo(f - d, g - e * c, f - e * d, g - c, f, g - c), b.closePath());
                return new a.BoundingBox(f - d, g - c, f + d, g + c)
            }
        };
        a.Element.ellipse.prototype = new a.Element.PathElementBase;
        a.Element.line = function (c) {
            this.base = a.Element.PathElementBase;
            this.base(c);
            this.getPoints = function () {
                return [new a.Point(this.attribute("x1").toPixels("x"), this.attribute("y1").toPixels("y")), new a.Point(this.attribute("x2").toPixels("x"), this.attribute("y2").toPixels("y"))]
            };
            this.path = function (b) {
                var e = this.getPoints();
                null != b && (b.beginPath(), b.moveTo(e[0].x, e[0].y), b.lineTo(e[1].x, e[1].y));
                return new a.BoundingBox(e[0].x, e[0].y, e[1].x, e[1].y)
            };
            this.getMarkers = function () {
                var a = this.getPoints(), e = a[0].angleTo(a[1]);
                return [[a[0], e], [a[1], e]]
            }
        };
        a.Element.line.prototype =
            new a.Element.PathElementBase;
        a.Element.polyline = function (c) {
            this.base = a.Element.PathElementBase;
            this.base(c);
            this.points = a.CreatePath(this.attribute("points").value);
            this.path = function (b) {
                var e = new a.BoundingBox(this.points[0].x, this.points[0].y);
                null != b && (b.beginPath(), b.moveTo(this.points[0].x, this.points[0].y));
                for (var d = 1; d < this.points.length; d++)e.addPoint(this.points[d].x, this.points[d].y), null != b && b.lineTo(this.points[d].x, this.points[d].y);
                return e
            };
            this.getMarkers = function () {
                for (var a = [],
                         e = 0; e < this.points.length - 1; e++)a.push([this.points[e], this.points[e].angleTo(this.points[e + 1])]);
                a.push([this.points[this.points.length - 1], a[a.length - 1][1]]);
                return a
            }
        };
        a.Element.polyline.prototype = new a.Element.PathElementBase;
        a.Element.polygon = function (c) {
            this.base = a.Element.polyline;
            this.base(c);
            this.basePath = this.path;
            this.path = function (a) {
                var e = this.basePath(a);
                null != a && (a.lineTo(this.points[0].x, this.points[0].y), a.closePath());
                return e
            }
        };
        a.Element.polygon.prototype = new a.Element.polyline;
        a.Element.path =
            function (c) {
                this.base = a.Element.PathElementBase;
                this.base(c);
                c = this.attribute("d").value;
                c = c.replace(/,/gm, " ");
                for (var b = 0; 2 > b; b++)c = c.replace(/([MmZzLlHhVvCcSsQqTtAa])([^\s])/gm, "$1 $2");
                c = c.replace(/([^\s])([MmZzLlHhVvCcSsQqTtAa])/gm, "$1 $2");
                c = c.replace(/([0-9])([+\-])/gm, "$1 $2");
                for (b = 0; 2 > b; b++)c = c.replace(/(\.[0-9]*)(\.)/gm, "$1 $2");
                c = c.replace(/([Aa](\s+[0-9]+){3})\s+([01])\s*([01])/gm, "$1 $3 $4 ");
                c = a.compressSpaces(c);
                c = a.trim(c);
                this.PathParser = new function (b) {
                    this.tokens = b.split(" ");
                    this.reset = function () {
                        this.i = -1;
                        this.previousCommand = this.command = "";
                        this.start = new a.Point(0, 0);
                        this.control = new a.Point(0, 0);
                        this.current = new a.Point(0, 0);
                        this.points = [];
                        this.angles = []
                    };
                    this.isEnd = function () {
                        return this.i >= this.tokens.length - 1
                    };
                    this.isCommandOrEnd = function () {
                        return this.isEnd() ? !0 : null != this.tokens[this.i + 1].match(/^[A-Za-z]$/)
                    };
                    this.isRelativeCommand = function () {
                        switch (this.command) {
                            case "m":
                            case "l":
                            case "h":
                            case "v":
                            case "c":
                            case "s":
                            case "q":
                            case "t":
                            case "a":
                            case "z":
                                return !0
                        }
                        return !1
                    };
                    this.getToken = function () {
                        this.i++;
                        return this.tokens[this.i]
                    };
                    this.getScalar = function () {
                        return parseFloat(this.getToken())
                    };
                    this.nextCommand = function () {
                        this.previousCommand = this.command;
                        this.command = this.getToken()
                    };
                    this.getPoint = function () {
                        var b = new a.Point(this.getScalar(), this.getScalar());
                        return this.makeAbsolute(b)
                    };
                    this.getAsControlPoint = function () {
                        var a = this.getPoint();
                        return this.control = a
                    };
                    this.getAsCurrentPoint = function () {
                        var a = this.getPoint();
                        return this.current = a
                    };
                    this.getReflectedControlPoint =
                        function () {
                            return "c" != this.previousCommand.toLowerCase() && "s" != this.previousCommand.toLowerCase() && "q" != this.previousCommand.toLowerCase() && "t" != this.previousCommand.toLowerCase() ? this.current : new a.Point(2 * this.current.x - this.control.x, 2 * this.current.y - this.control.y)
                        };
                    this.makeAbsolute = function (a) {
                        this.isRelativeCommand() && (a.x += this.current.x, a.y += this.current.y);
                        return a
                    };
                    this.addMarker = function (a, b, e) {
                        null != e && 0 < this.angles.length && null == this.angles[this.angles.length - 1] && (this.angles[this.angles.length -
                        1] = this.points[this.points.length - 1].angleTo(e));
                        this.addMarkerAngle(a, null == b ? null : b.angleTo(a))
                    };
                    this.addMarkerAngle = function (a, b) {
                        this.points.push(a);
                        this.angles.push(b)
                    };
                    this.getMarkerPoints = function () {
                        return this.points
                    };
                    this.getMarkerAngles = function () {
                        for (var a = 0; a < this.angles.length; a++)if (null == this.angles[a])for (var b = a + 1; b < this.angles.length; b++)if (null != this.angles[b]) {
                            this.angles[a] = this.angles[b];
                            break
                        }
                        return this.angles
                    }
                }(c);
                this.path = function (b) {
                    var d = this.PathParser;
                    d.reset();
                    var c =
                        new a.BoundingBox;
                    for (null != b && b.beginPath(); !d.isEnd();)switch (d.nextCommand(), d.command) {
                        case "M":
                        case "m":
                            var f = d.getAsCurrentPoint();
                            d.addMarker(f);
                            c.addPoint(f.x, f.y);
                            null != b && b.moveTo(f.x, f.y);
                            for (d.start = d.current; !d.isCommandOrEnd();)f = d.getAsCurrentPoint(), d.addMarker(f, d.start), c.addPoint(f.x, f.y), null != b && b.lineTo(f.x, f.y);
                            break;
                        case "L":
                        case "l":
                            for (; !d.isCommandOrEnd();) {
                                var g = d.current, f = d.getAsCurrentPoint();
                                d.addMarker(f, g);
                                c.addPoint(f.x, f.y);
                                null != b && b.lineTo(f.x, f.y)
                            }
                            break;
                        case "H":
                        case "h":
                            for (; !d.isCommandOrEnd();)f =
                                new a.Point((d.isRelativeCommand() ? d.current.x : 0) + d.getScalar(), d.current.y), d.addMarker(f, d.current), d.current = f, c.addPoint(d.current.x, d.current.y), null != b && b.lineTo(d.current.x, d.current.y);
                            break;
                        case "V":
                        case "v":
                            for (; !d.isCommandOrEnd();)f = new a.Point(d.current.x, (d.isRelativeCommand() ? d.current.y : 0) + d.getScalar()), d.addMarker(f, d.current), d.current = f, c.addPoint(d.current.x, d.current.y), null != b && b.lineTo(d.current.x, d.current.y);
                            break;
                        case "C":
                        case "c":
                            for (; !d.isCommandOrEnd();) {
                                var m = d.current,
                                    g = d.getPoint(), n = d.getAsControlPoint(), f = d.getAsCurrentPoint();
                                d.addMarker(f, n, g);
                                c.addBezierCurve(m.x, m.y, g.x, g.y, n.x, n.y, f.x, f.y);
                                null != b && b.bezierCurveTo(g.x, g.y, n.x, n.y, f.x, f.y)
                            }
                            break;
                        case "S":
                        case "s":
                            for (; !d.isCommandOrEnd();)m = d.current, g = d.getReflectedControlPoint(), n = d.getAsControlPoint(), f = d.getAsCurrentPoint(), d.addMarker(f, n, g), c.addBezierCurve(m.x, m.y, g.x, g.y, n.x, n.y, f.x, f.y), null != b && b.bezierCurveTo(g.x, g.y, n.x, n.y, f.x, f.y);
                            break;
                        case "Q":
                        case "q":
                            for (; !d.isCommandOrEnd();)m = d.current,
                                n = d.getAsControlPoint(), f = d.getAsCurrentPoint(), d.addMarker(f, n, n), c.addQuadraticCurve(m.x, m.y, n.x, n.y, f.x, f.y), null != b && b.quadraticCurveTo(n.x, n.y, f.x, f.y);
                            break;
                        case "T":
                        case "t":
                            for (; !d.isCommandOrEnd();)m = d.current, n = d.getReflectedControlPoint(), d.control = n, f = d.getAsCurrentPoint(), d.addMarker(f, n, n), c.addQuadraticCurve(m.x, m.y, n.x, n.y, f.x, f.y), null != b && b.quadraticCurveTo(n.x, n.y, f.x, f.y);
                            break;
                        case "A":
                        case "a":
                            for (; !d.isCommandOrEnd();) {
                                var m = d.current, r = d.getScalar(), h = d.getScalar(), g = d.getScalar() *
                                    (Math.PI / 180), p = d.getScalar(), n = d.getScalar(), f = d.getAsCurrentPoint(), l = new a.Point(Math.cos(g) * (m.x - f.x) / 2 + Math.sin(g) * (m.y - f.y) / 2, -Math.sin(g) * (m.x - f.x) / 2 + Math.cos(g) * (m.y - f.y) / 2), v = Math.pow(l.x, 2) / Math.pow(r, 2) + Math.pow(l.y, 2) / Math.pow(h, 2);
                                1 < v && (r *= Math.sqrt(v), h *= Math.sqrt(v));
                                p = (p == n ? -1 : 1) * Math.sqrt((Math.pow(r, 2) * Math.pow(h, 2) - Math.pow(r, 2) * Math.pow(l.y, 2) - Math.pow(h, 2) * Math.pow(l.x, 2)) / (Math.pow(r, 2) * Math.pow(l.y, 2) + Math.pow(h, 2) * Math.pow(l.x, 2)));
                                isNaN(p) && (p = 0);
                                var q = new a.Point(p * r * l.y /
                                    h, p * -h * l.x / r), m = new a.Point((m.x + f.x) / 2 + Math.cos(g) * q.x - Math.sin(g) * q.y, (m.y + f.y) / 2 + Math.sin(g) * q.x + Math.cos(g) * q.y), w = function (a, b) {
                                    return (a[0] * b[0] + a[1] * b[1]) / (Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2)) * Math.sqrt(Math.pow(b[0], 2) + Math.pow(b[1], 2)))
                                }, x = function (a, b) {
                                    return (a[0] * b[1] < a[1] * b[0] ? -1 : 1) * Math.acos(w(a, b))
                                }, p = x([1, 0], [(l.x - q.x) / r, (l.y - q.y) / h]), v = [(l.x - q.x) / r, (l.y - q.y) / h], q = [(-l.x - q.x) / r, (-l.y - q.y) / h], l = x(v, q);
                                -1 >= w(v, q) && (l = Math.PI);
                                1 <= w(v, q) && (l = 0);
                                v = 1 - n ? 1 : -1;
                                q = p + l / 2 * v;
                                x = new a.Point(m.x +
                                    r * Math.cos(q), m.y + h * Math.sin(q));
                                d.addMarkerAngle(x, q - v * Math.PI / 2);
                                d.addMarkerAngle(f, q - v * Math.PI);
                                c.addPoint(f.x, f.y);
                                null != b && (w = r > h ? r : h, f = r > h ? 1 : r / h, r = r > h ? h / r : 1, b.translate(m.x, m.y), b.rotate(g), b.scale(f, r), b.arc(0, 0, w, p, p + l, 1 - n), b.scale(1 / f, 1 / r), b.rotate(-g), b.translate(-m.x, -m.y))
                            }
                            break;
                        case "Z":
                        case "z":
                            null != b && b.closePath(), d.current = d.start
                    }
                    return c
                };
                this.getMarkers = function () {
                    for (var a = this.PathParser.getMarkerPoints(), b = this.PathParser.getMarkerAngles(), c = [], f = 0; f < a.length; f++)c.push([a[f],
                        b[f]]);
                    return c
                }
            };
        a.Element.path.prototype = new a.Element.PathElementBase;
        a.Element.pattern = function (c) {
            this.base = a.Element.ElementBase;
            this.base(c);
            this.createPattern = function (b, e) {
                var d = this.attribute("width").toPixels("x", !0), c = this.attribute("height").toPixels("y", !0), f = new a.Element.svg;
                f.attributes.viewBox = new a.Property("viewBox", this.attribute("viewBox").value);
                f.attributes.width = new a.Property("width", d + "px");
                f.attributes.height = new a.Property("height", c + "px");
                f.attributes.transform = new a.Property("transform",
                    this.attribute("patternTransform").value);
                f.children = this.children;
                var g = document.createElement("canvas");
                g.width = d;
                g.height = c;
                d = g.getContext("2d");
                this.attribute("x").hasValue() && this.attribute("y").hasValue() && d.translate(this.attribute("x").toPixels("x", !0), this.attribute("y").toPixels("y", !0));
                for (c = -1; 1 >= c; c++)for (var m = -1; 1 >= m; m++)d.save(), f.attributes.x = new a.Property("x", c * g.width), f.attributes.y = new a.Property("y", m * g.height), f.render(d), d.restore();
                return b.createPattern(g, "repeat")
            }
        };
        a.Element.pattern.prototype =
            new a.Element.ElementBase;
        a.Element.marker = function (c) {
            this.base = a.Element.ElementBase;
            this.base(c);
            this.baseRender = this.render;
            this.render = function (b, e, d) {
                b.translate(e.x, e.y);
                "auto" == this.attribute("orient").valueOrDefault("auto") && b.rotate(d);
                "strokeWidth" == this.attribute("markerUnits").valueOrDefault("strokeWidth") && b.scale(b.lineWidth, b.lineWidth);
                b.save();
                var c = new a.Element.svg;
                c.attributes.viewBox = new a.Property("viewBox", this.attribute("viewBox").value);
                c.attributes.refX = new a.Property("refX",
                    this.attribute("refX").value);
                c.attributes.refY = new a.Property("refY", this.attribute("refY").value);
                c.attributes.width = new a.Property("width", this.attribute("markerWidth").value);
                c.attributes.height = new a.Property("height", this.attribute("markerHeight").value);
                c.attributes.fill = new a.Property("fill", this.attribute("fill").valueOrDefault("black"));
                c.attributes.stroke = new a.Property("stroke", this.attribute("stroke").valueOrDefault("none"));
                c.children = this.children;
                c.render(b);
                b.restore();
                "strokeWidth" ==
                this.attribute("markerUnits").valueOrDefault("strokeWidth") && b.scale(1 / b.lineWidth, 1 / b.lineWidth);
                "auto" == this.attribute("orient").valueOrDefault("auto") && b.rotate(-d);
                b.translate(-e.x, -e.y)
            }
        };
        a.Element.marker.prototype = new a.Element.ElementBase;
        a.Element.defs = function (c) {
            this.base = a.Element.ElementBase;
            this.base(c);
            this.render = function (a) {
            }
        };
        a.Element.defs.prototype = new a.Element.ElementBase;
        a.Element.GradientBase = function (c) {
            this.base = a.Element.ElementBase;
            this.base(c);
            this.stops = [];
            for (c = 0; c < this.children.length; c++) {
                var b =
                    this.children[c];
                "stop" == b.type && this.stops.push(b)
            }
            this.getGradient = function () {
            };
            this.gradientUnits = function () {
                return this.attribute("gradientUnits").valueOrDefault("objectBoundingBox")
            };
            this.attributesToInherit = ["gradientUnits"];
            this.inheritStopContainer = function (a) {
                for (var b = 0; b < this.attributesToInherit.length; b++) {
                    var c = this.attributesToInherit[b];
                    !this.attribute(c).hasValue() && a.attribute(c).hasValue() && (this.attribute(c, !0).value = a.attribute(c).value)
                }
            };
            this.createGradient = function (b, d, c) {
                var f =
                    this;
                this.getHrefAttribute().hasValue() && (f = this.getHrefAttribute().getDefinition(), this.inheritStopContainer(f));
                var g = function (b) {
                    return c.hasValue() ? (new a.Property("color", b)).addOpacity(c).value : b
                };
                b = this.getGradient(b, d);
                if (null == b)return g(f.stops[f.stops.length - 1].color);
                for (d = 0; d < f.stops.length; d++)b.addColorStop(f.stops[d].offset, g(f.stops[d].color));
                return this.attribute("gradientTransform").hasValue() ? (f = a.ViewPort.viewPorts[0], g = new a.Element.rect, g.attributes.x = new a.Property("x", -a.MAX_VIRTUAL_PIXELS /
                    3), g.attributes.y = new a.Property("y", -a.MAX_VIRTUAL_PIXELS / 3), g.attributes.width = new a.Property("width", a.MAX_VIRTUAL_PIXELS), g.attributes.height = new a.Property("height", a.MAX_VIRTUAL_PIXELS), d = new a.Element.g, d.attributes.transform = new a.Property("transform", this.attribute("gradientTransform").value), d.children = [g], g = new a.Element.svg, g.attributes.x = new a.Property("x", 0), g.attributes.y = new a.Property("y", 0), g.attributes.width = new a.Property("width", f.width), g.attributes.height = new a.Property("height",
                    f.height), g.children = [d], d = document.createElement("canvas"), d.width = f.width, d.height = f.height, f = d.getContext("2d"), f.fillStyle = b, g.render(f), f.createPattern(d, "no-repeat")) : b
            }
        };
        a.Element.GradientBase.prototype = new a.Element.ElementBase;
        a.Element.linearGradient = function (c) {
            this.base = a.Element.GradientBase;
            this.base(c);
            this.attributesToInherit.push("x1");
            this.attributesToInherit.push("y1");
            this.attributesToInherit.push("x2");
            this.attributesToInherit.push("y2");
            this.getGradient = function (a, e) {
                var c = "objectBoundingBox" ==
                this.gradientUnits() ? e.getBoundingBox() : null;
                this.attribute("x1").hasValue() || this.attribute("y1").hasValue() || this.attribute("x2").hasValue() || this.attribute("y2").hasValue() || (this.attribute("x1", !0).value = 0, this.attribute("y1", !0).value = 0, this.attribute("x2", !0).value = 1, this.attribute("y2", !0).value = 0);
                var k = "objectBoundingBox" == this.gradientUnits() ? c.x() + c.width() * this.attribute("x1").numValue() : this.attribute("x1").toPixels("x"), f = "objectBoundingBox" == this.gradientUnits() ? c.y() + c.height() * this.attribute("y1").numValue() :
                    this.attribute("y1").toPixels("y"), g = "objectBoundingBox" == this.gradientUnits() ? c.x() + c.width() * this.attribute("x2").numValue() : this.attribute("x2").toPixels("x"), c = "objectBoundingBox" == this.gradientUnits() ? c.y() + c.height() * this.attribute("y2").numValue() : this.attribute("y2").toPixels("y");
                return k == g && f == c ? null : a.createLinearGradient(k, f, g, c)
            }
        };
        a.Element.linearGradient.prototype = new a.Element.GradientBase;
        a.Element.radialGradient = function (c) {
            this.base = a.Element.GradientBase;
            this.base(c);
            this.attributesToInherit.push("cx");
            this.attributesToInherit.push("cy");
            this.attributesToInherit.push("r");
            this.attributesToInherit.push("fx");
            this.attributesToInherit.push("fy");
            this.getGradient = function (a, c) {
                var d = c.getBoundingBox();
                this.attribute("cx").hasValue() || (this.attribute("cx", !0).value = "50%");
                this.attribute("cy").hasValue() || (this.attribute("cy", !0).value = "50%");
                this.attribute("r").hasValue() || (this.attribute("r", !0).value = "50%");
                var k = "objectBoundingBox" == this.gradientUnits() ? d.x() + d.width() * this.attribute("cx").numValue() :
                    this.attribute("cx").toPixels("x"), f = "objectBoundingBox" == this.gradientUnits() ? d.y() + d.height() * this.attribute("cy").numValue() : this.attribute("cy").toPixels("y"), g = k, m = f;
                this.attribute("fx").hasValue() && (g = "objectBoundingBox" == this.gradientUnits() ? d.x() + d.width() * this.attribute("fx").numValue() : this.attribute("fx").toPixels("x"));
                this.attribute("fy").hasValue() && (m = "objectBoundingBox" == this.gradientUnits() ? d.y() + d.height() * this.attribute("fy").numValue() : this.attribute("fy").toPixels("y"));
                d = "objectBoundingBox" ==
                this.gradientUnits() ? (d.width() + d.height()) / 2 * this.attribute("r").numValue() : this.attribute("r").toPixels();
                return a.createRadialGradient(g, m, 0, k, f, d)
            }
        };
        a.Element.radialGradient.prototype = new a.Element.GradientBase;
        a.Element.stop = function (c) {
            this.base = a.Element.ElementBase;
            this.base(c);
            this.offset = this.attribute("offset").numValue();
            0 > this.offset && (this.offset = 0);
            1 < this.offset && (this.offset = 1);
            c = this.style("stop-color", !0);
            "" === c.value && (c.value = "#000");
            this.style("stop-opacity").hasValue() && (c = c.addOpacity(this.style("stop-opacity")));
            this.color = c.value
        };
        a.Element.stop.prototype = new a.Element.ElementBase;
        a.Element.AnimateBase = function (c) {
            this.base = a.Element.ElementBase;
            this.base(c);
            a.Animations.push(this);
            this.duration = 0;
            this.begin = this.attribute("begin").toMilliseconds();
            this.maxDuration = this.begin + this.attribute("dur").toMilliseconds();
            this.getProperty = function () {
                var a = this.attribute("attributeType").value, c = this.attribute("attributeName").value;
                return "CSS" == a ? this.parent.style(c, !0) : this.parent.attribute(c, !0)
            };
            this.initialValue =
                null;
            this.initialUnits = "";
            this.removed = !1;
            this.calcValue = function () {
                return ""
            };
            this.update = function (a) {
                null == this.initialValue && (this.initialValue = this.getProperty().value, this.initialUnits = this.getProperty().getUnits());
                if (this.duration > this.maxDuration) {
                    if ("indefinite" == this.attribute("repeatCount").value || "indefinite" == this.attribute("repeatDur").value)this.duration = 0; else if ("freeze" == this.attribute("fill").valueOrDefault("remove") && !this.frozen)this.frozen = !0, this.parent.animationFrozen = !0, this.parent.animationFrozenValue =
                        this.getProperty().value; else if ("remove" == this.attribute("fill").valueOrDefault("remove") && !this.removed)return this.removed = !0, this.getProperty().value = this.parent.animationFrozen ? this.parent.animationFrozenValue : this.initialValue, !0;
                    return !1
                }
                this.duration += a;
                a = !1;
                this.begin < this.duration && (a = this.calcValue(), this.attribute("type").hasValue() && (a = this.attribute("type").value + "(" + a + ")"), this.getProperty().value = a, a = !0);
                return a
            };
            this.from = this.attribute("from");
            this.to = this.attribute("to");
            this.values =
                this.attribute("values");
            this.values.hasValue() && (this.values.value = this.values.value.split(";"));
            this.progress = function () {
                var b = {progress: (this.duration - this.begin) / (this.maxDuration - this.begin)};
                if (this.values.hasValue()) {
                    var c = b.progress * (this.values.value.length - 1), d = Math.floor(c), k = Math.ceil(c);
                    b.from = new a.Property("from", parseFloat(this.values.value[d]));
                    b.to = new a.Property("to", parseFloat(this.values.value[k]));
                    b.progress = (c - d) / (k - d)
                } else b.from = this.from, b.to = this.to;
                return b
            }
        };
        a.Element.AnimateBase.prototype =
            new a.Element.ElementBase;
        a.Element.animate = function (c) {
            this.base = a.Element.AnimateBase;
            this.base(c);
            this.calcValue = function () {
                var a = this.progress();
                return a.from.numValue() + (a.to.numValue() - a.from.numValue()) * a.progress + this.initialUnits
            }
        };
        a.Element.animate.prototype = new a.Element.AnimateBase;
        a.Element.animateColor = function (c) {
            this.base = a.Element.AnimateBase;
            this.base(c);
            this.calcValue = function () {
                var a = this.progress(), c = new x(a.from.value), d = new x(a.to.value);
                if (c.ok && d.ok) {
                    var k = c.g + (d.g - c.g) * a.progress,
                        f = c.b + (d.b - c.b) * a.progress;
                    return "rgb(" + parseInt(c.r + (d.r - c.r) * a.progress, 10) + "," + parseInt(k, 10) + "," + parseInt(f, 10) + ")"
                }
                return this.attribute("from").value
            }
        };
        a.Element.animateColor.prototype = new a.Element.AnimateBase;
        a.Element.animateTransform = function (c) {
            this.base = a.Element.AnimateBase;
            this.base(c);
            this.calcValue = function () {
                for (var b = this.progress(), c = a.ToNumberArray(b.from.value), d = a.ToNumberArray(b.to.value), k = "", f = 0; f < c.length; f++)k += c[f] + (d[f] - c[f]) * b.progress + " ";
                return k
            }
        };
        a.Element.animateTransform.prototype =
            new a.Element.animate;
        a.Element.font = function (c) {
            this.base = a.Element.ElementBase;
            this.base(c);
            this.horizAdvX = this.attribute("horiz-adv-x").numValue();
            this.isArabic = this.isRTL = !1;
            this.missingGlyph = this.fontFace = null;
            this.glyphs = [];
            for (c = 0; c < this.children.length; c++) {
                var b = this.children[c];
                "font-face" == b.type ? (this.fontFace = b, b.style("font-family").hasValue() && (a.Definitions[b.style("font-family").value] = this)) : "missing-glyph" == b.type ? this.missingGlyph = b : "glyph" == b.type && ("" != b.arabicForm ? (this.isArabic =
                    this.isRTL = !0, "undefined" == typeof this.glyphs[b.unicode] && (this.glyphs[b.unicode] = []), this.glyphs[b.unicode][b.arabicForm] = b) : this.glyphs[b.unicode] = b)
            }
        };
        a.Element.font.prototype = new a.Element.ElementBase;
        a.Element.fontface = function (c) {
            this.base = a.Element.ElementBase;
            this.base(c);
            this.ascent = this.attribute("ascent").value;
            this.descent = this.attribute("descent").value;
            this.unitsPerEm = this.attribute("units-per-em").numValue()
        };
        a.Element.fontface.prototype = new a.Element.ElementBase;
        a.Element.missingglyph =
            function (c) {
                this.base = a.Element.path;
                this.base(c);
                this.horizAdvX = 0
            };
        a.Element.missingglyph.prototype = new a.Element.path;
        a.Element.glyph = function (c) {
            this.base = a.Element.path;
            this.base(c);
            this.horizAdvX = this.attribute("horiz-adv-x").numValue();
            this.unicode = this.attribute("unicode").value;
            this.arabicForm = this.attribute("arabic-form").value
        };
        a.Element.glyph.prototype = new a.Element.path;
        a.Element.text = function (c) {
            this.captureTextNodes = !0;
            this.base = a.Element.RenderedElementBase;
            this.base(c);
            this.baseSetContext =
                this.setContext;
            this.setContext = function (a) {
                this.baseSetContext(a);
                var c = this.style("dominant-baseline").toTextBaseline();
                null == c && (c = this.style("alignment-baseline").toTextBaseline());
                null != c && (a.textBaseline = c)
            };
            this.getBoundingBox = function () {
                var b = this.attribute("x").toPixels("x"), c = this.attribute("y").toPixels("y"), d = this.parent.style("font-size").numValueOrDefault(a.Font.Parse(a.ctx.font).fontSize);
                return new a.BoundingBox(b, c - d, b + Math.floor(2 * d / 3) * this.children[0].getText().length, c)
            };
            this.renderChildren =
                function (a) {
                    this.x = this.attribute("x").toPixels("x");
                    this.y = this.attribute("y").toPixels("y");
                    this.attribute("dx").hasValue() && (this.x += this.attribute("dx").toPixels("x"));
                    this.attribute("dy").hasValue() && (this.y += this.attribute("dy").toPixels("y"));
                    this.x += this.getAnchorDelta(a, this, 0);
                    for (var c = 0; c < this.children.length; c++)this.renderChild(a, this, c)
                };
            this.getAnchorDelta = function (a, c, d) {
                var k = this.style("text-anchor").valueOrDefault("start");
                if ("start" != k) {
                    for (var f = 0, g = d; g < c.children.length; g++) {
                        var m =
                            c.children[g];
                        if (g > d && m.attribute("x").hasValue())break;
                        f += m.measureTextRecursive(a)
                    }
                    return -1 * ("end" == k ? f : f / 2)
                }
                return 0
            };
            this.renderChild = function (a, c, d) {
                var k = c.children[d];
                k.attribute("x").hasValue() ? (k.x = k.attribute("x").toPixels("x") + c.getAnchorDelta(a, c, d), k.attribute("dx").hasValue() && (k.x += k.attribute("dx").toPixels("x"))) : (k.attribute("dx").hasValue() && (c.x += k.attribute("dx").toPixels("x")), k.x = c.x);
                c.x = k.x + k.measureText(a);
                k.attribute("y").hasValue() ? (k.y = k.attribute("y").toPixels("y"), k.attribute("dy").hasValue() &&
                (k.y += k.attribute("dy").toPixels("y"))) : (k.attribute("dy").hasValue() && (c.y += k.attribute("dy").toPixels("y")), k.y = c.y);
                c.y = k.y;
                k.render(a);
                for (d = 0; d < k.children.length; d++)c.renderChild(a, k, d)
            }
        };
        a.Element.text.prototype = new a.Element.RenderedElementBase;
        a.Element.TextElementBase = function (c) {
            this.base = a.Element.RenderedElementBase;
            this.base(c);
            this.getGlyph = function (a, c, d) {
                var k = c[d], f = null;
                if (a.isArabic) {
                    var g = "isolated";
                    (0 == d || " " == c[d - 1]) && d < c.length - 2 && " " != c[d + 1] && (g = "terminal");
                    0 < d && " " != c[d -
                    1] && d < c.length - 2 && " " != c[d + 1] && (g = "medial");
                    0 < d && " " != c[d - 1] && (d == c.length - 1 || " " == c[d + 1]) && (g = "initial");
                    "undefined" != typeof a.glyphs[k] && (f = a.glyphs[k][g], null == f && "glyph" == a.glyphs[k].type && (f = a.glyphs[k]))
                } else f = a.glyphs[k];
                null == f && (f = a.missingGlyph);
                return f
            };
            this.renderChildren = function (b) {
                var c = this.parent.style("font-family").getDefinition();
                if (null != c) {
                    var d = this.parent.style("font-size").numValueOrDefault(a.Font.Parse(a.ctx.font).fontSize), k = this.parent.style("font-style").valueOrDefault(a.Font.Parse(a.ctx.font).fontStyle),
                        f = this.getText();
                    c.isRTL && (f = f.split("").reverse().join(""));
                    for (var g = a.ToNumberArray(this.parent.attribute("dx").value), m = 0; m < f.length; m++) {
                        var n = this.getGlyph(c, f, m), h = d / c.fontFace.unitsPerEm;
                        b.translate(this.x, this.y);
                        b.scale(h, -h);
                        var l = b.lineWidth;
                        b.lineWidth = b.lineWidth * c.fontFace.unitsPerEm / d;
                        "italic" == k && b.transform(1, 0, .4, 1, 0, 0);
                        n.render(b);
                        "italic" == k && b.transform(1, 0, -.4, 1, 0, 0);
                        b.lineWidth = l;
                        b.scale(1 / h, -1 / h);
                        b.translate(-this.x, -this.y);
                        this.x += d * (n.horizAdvX || c.horizAdvX) / c.fontFace.unitsPerEm;
                        "undefined" == typeof g[m] || isNaN(g[m]) || (this.x += g[m])
                    }
                } else"" != b.fillStyle && b.fillText(a.compressSpaces(this.getText()), this.x, this.y), "" != b.strokeStyle && b.strokeText(a.compressSpaces(this.getText()), this.x, this.y)
            };
            this.getText = function () {
            };
            this.measureTextRecursive = function (a) {
                for (var c = this.measureText(a), d = 0; d < this.children.length; d++)c += this.children[d].measureTextRecursive(a);
                return c
            };
            this.measureText = function (b) {
                var c = this.parent.style("font-family").getDefinition();
                if (null != c) {
                    b = this.parent.style("font-size").numValueOrDefault(a.Font.Parse(a.ctx.font).fontSize);
                    var d = 0, k = this.getText();
                    c.isRTL && (k = k.split("").reverse().join(""));
                    for (var f = a.ToNumberArray(this.parent.attribute("dx").value), g = 0; g < k.length; g++) {
                        var m = this.getGlyph(c, k, g), d = d + (m.horizAdvX || c.horizAdvX) * b / c.fontFace.unitsPerEm;
                        "undefined" == typeof f[g] || isNaN(f[g]) || (d += f[g])
                    }
                    return d
                }
                c = a.compressSpaces(this.getText());
                if (!b.measureText)return 10 * c.length;
                b.save();
                this.setContext(b);
                c = b.measureText(c).width;
                b.restore();
                return c
            }
        };
        a.Element.TextElementBase.prototype = new a.Element.RenderedElementBase;
        a.Element.tspan = function (c) {
            this.captureTextNodes = !0;
            this.base = a.Element.TextElementBase;
            this.base(c);
            this.text = a.compressSpaces(c.value || c.text || c.textContent || "");
            this.getText = function () {
                return 0 < this.children.length ? "" : this.text
            }
        };
        a.Element.tspan.prototype = new a.Element.TextElementBase;
        a.Element.tref = function (c) {
            this.base = a.Element.TextElementBase;
            this.base(c);
            this.getText = function () {
                var a = this.getHrefAttribute().getDefinition();
                if (null != a)return a.children[0].getText()
            }
        };
        a.Element.tref.prototype =
            new a.Element.TextElementBase;
        a.Element.a = function (c) {
            this.base = a.Element.TextElementBase;
            this.base(c);
            this.hasText = 0 < c.childNodes.length;
            for (var b = 0; b < c.childNodes.length; b++)3 != c.childNodes[b].nodeType && (this.hasText = !1);
            this.text = this.hasText ? c.childNodes[0].value : "";
            this.getText = function () {
                return this.text
            };
            this.baseRenderChildren = this.renderChildren;
            this.renderChildren = function (b) {
                if (this.hasText) {
                    this.baseRenderChildren(b);
                    var c = new a.Property("fontSize", a.Font.Parse(a.ctx.font).fontSize);
                    a.Mouse.checkBoundingBox(this,
                        new a.BoundingBox(this.x, this.y - c.toPixels("y"), this.x + this.measureText(b), this.y))
                } else 0 < this.children.length && (c = new a.Element.g, c.children = this.children, c.parent = this, c.render(b))
            };
            this.onclick = function () {
                window.open(this.getHrefAttribute().value)
            };
            this.onmousemove = function () {
                a.ctx.canvas.style.cursor = "pointer"
            }
        };
        a.Element.a.prototype = new a.Element.TextElementBase;
        a.Element.image = function (c) {
            this.base = a.Element.RenderedElementBase;
            this.base(c);
            var b = this.getHrefAttribute().value;
            if ("" != b) {
                var e =
                    b.match(/\.svg$/);
                a.Images.push(this);
                this.loaded = !1;
                if (e)this.img = a.ajax(b), this.loaded = !0; else {
                    this.img = document.createElement("img");
                    1 == a.opts.useCORS && (this.img.crossOrigin = "Anonymous");
                    var d = this;
                    this.img.onload = function () {
                        d.loaded = !0
                    };
                    this.img.onerror = function () {
                        a.log('ERROR: image "' + b + '" not found');
                        d.loaded = !0
                    };
                    this.img.src = b
                }
                this.renderChildren = function (b) {
                    var c = this.attribute("x").toPixels("x"), d = this.attribute("y").toPixels("y"), m = this.attribute("width").toPixels("x"), n = this.attribute("height").toPixels("y");
                    0 != m && 0 != n && (b.save(), e ? b.drawSvg(this.img, c, d, m, n) : (b.translate(c, d), a.AspectRatio(b, this.attribute("preserveAspectRatio").value, m, this.img.width, n, this.img.height, 0, 0), b.drawImage(this.img, 0, 0)), b.restore())
                };
                this.getBoundingBox = function () {
                    var b = this.attribute("x").toPixels("x"), c = this.attribute("y").toPixels("y"), d = this.attribute("width").toPixels("x"), e = this.attribute("height").toPixels("y");
                    return new a.BoundingBox(b, c, b + d, c + e)
                }
            }
        };
        a.Element.image.prototype = new a.Element.RenderedElementBase;
        a.Element.g =
            function (c) {
                this.base = a.Element.RenderedElementBase;
                this.base(c);
                this.getBoundingBox = function () {
                    for (var b = new a.BoundingBox, c = 0; c < this.children.length; c++)b.addBoundingBox(this.children[c].getBoundingBox());
                    return b
                }
            };
        a.Element.g.prototype = new a.Element.RenderedElementBase;
        a.Element.symbol = function (c) {
            this.base = a.Element.RenderedElementBase;
            this.base(c);
            this.render = function (a) {
            }
        };
        a.Element.symbol.prototype = new a.Element.RenderedElementBase;
        a.Element.style = function (c) {
            this.base = a.Element.ElementBase;
            this.base(c);
            for (var b = "", e = 0; e < c.childNodes.length; e++)b += c.childNodes[e].data;
            b = b.replace(/(\/\*([^*]|[\r\n]|(\*+([^*\/]|[\r\n])))*\*+\/)|(^[\s]*\/\/.*)/gm, "");
            b = a.compressSpaces(b);
            c = b.split("}");
            for (e = 0; e < c.length; e++)if ("" != a.trim(c[e]))for (var d = c[e].split("{"), b = d[0].split(","), d = d[1].split(";"), k = 0; k < b.length; k++) {
                var f = a.trim(b[k]);
                if ("" != f) {
                    for (var g = a.Styles[f] || {}, m = 0; m < d.length; m++) {
                        var n = d[m].indexOf(":"), h = d[m].substr(0, n), n = d[m].substr(n + 1, d[m].length - n);
                        null != h && null != n && (g[a.trim(h)] =
                            new a.Property(a.trim(h), a.trim(n)))
                    }
                    a.Styles[f] = g;
                    a.StylesSpecificity[f] = A(f);
                    if ("@font-face" == f)for (f = g["font-family"].value.replace(/"/g, ""), g = g.src.value.split(","), m = 0; m < g.length; m++)if (0 < g[m].indexOf('format("svg")'))for (h = g[m].indexOf("url"), n = g[m].indexOf(")", h), h = g[m].substr(h + 5, n - h - 6), h = a.parseXml(a.ajax(h)).getElementsByTagName("font"), n = 0; n < h.length; n++) {
                        var l = a.CreateElement(h[n]);
                        a.Definitions[f] = l
                    }
                }
            }
        };
        a.Element.style.prototype = new a.Element.ElementBase;
        a.Element.use = function (c) {
            this.base =
                a.Element.RenderedElementBase;
            this.base(c);
            this.baseSetContext = this.setContext;
            this.setContext = function (a) {
                this.baseSetContext(a);
                this.attribute("x").hasValue() && a.translate(this.attribute("x").toPixels("x"), 0);
                this.attribute("y").hasValue() && a.translate(0, this.attribute("y").toPixels("y"))
            };
            var b = this.getHrefAttribute().getDefinition();
            this.path = function (a) {
                null != b && b.path(a)
            };
            this.getBoundingBox = function () {
                if (null != b)return b.getBoundingBox()
            };
            this.renderChildren = function (c) {
                if (null != b) {
                    var d = b;
                    "symbol" == b.type && (d = new a.Element.svg, d.type = "svg", d.attributes.viewBox = new a.Property("viewBox", b.attribute("viewBox").value), d.attributes.preserveAspectRatio = new a.Property("preserveAspectRatio", b.attribute("preserveAspectRatio").value), d.attributes.overflow = new a.Property("overflow", b.attribute("overflow").value), d.children = b.children);
                    "svg" == d.type && (this.attribute("width").hasValue() && (d.attributes.width = new a.Property("width", this.attribute("width").value)), this.attribute("height").hasValue() &&
                    (d.attributes.height = new a.Property("height", this.attribute("height").value)));
                    var k = d.parent;
                    d.parent = null;
                    d.render(c);
                    d.parent = k
                }
            }
        };
        a.Element.use.prototype = new a.Element.RenderedElementBase;
        a.Element.mask = function (c) {
            this.base = a.Element.ElementBase;
            this.base(c);
            this.apply = function (b, c) {
                var d = this.attribute("x").toPixels("x"), k = this.attribute("y").toPixels("y"), f = this.attribute("width").toPixels("x"), g = this.attribute("height").toPixels("y");
                if (0 == f && 0 == g) {
                    g = new a.BoundingBox;
                    for (d = 0; d < this.children.length; d++)g.addBoundingBox(this.children[d].getBoundingBox());
                    d = Math.floor(g.x1);
                    k = Math.floor(g.y1);
                    f = Math.floor(g.width());
                    g = Math.floor(g.height())
                }
                var m = c.attribute("mask").value;
                c.attribute("mask").value = "";
                var n = document.createElement("canvas");
                n.width = d + f;
                n.height = k + g;
                var h = n.getContext("2d");
                this.renderChildren(h);
                var l = document.createElement("canvas");
                l.width = d + f;
                l.height = k + g;
                var p = l.getContext("2d");
                c.render(p);
                p.globalCompositeOperation = "destination-in";
                p.fillStyle = h.createPattern(n, "no-repeat");
                p.fillRect(0, 0, d + f, k + g);
                b.fillStyle = p.createPattern(l,
                    "no-repeat");
                b.fillRect(0, 0, d + f, k + g);
                c.attribute("mask").value = m
            };
            this.render = function (a) {
            }
        };
        a.Element.mask.prototype = new a.Element.ElementBase;
        a.Element.clipPath = function (c) {
            this.base = a.Element.ElementBase;
            this.base(c);
            this.apply = function (b) {
                var c = CanvasRenderingContext2D.prototype.beginPath;
                CanvasRenderingContext2D.prototype.beginPath = function () {
                };
                var d = CanvasRenderingContext2D.prototype.closePath;
                CanvasRenderingContext2D.prototype.closePath = function () {
                };
                c.call(b);
                for (var k = 0; k < this.children.length; k++) {
                    var f =
                        this.children[k];
                    if ("undefined" != typeof f.path) {
                        var g = null;
                        f.style("transform", !1, !0).hasValue() && (g = new a.Transform(f.style("transform", !1, !0).value), g.apply(b));
                        f.path(b);
                        CanvasRenderingContext2D.prototype.closePath = d;
                        g && g.unapply(b)
                    }
                }
                d.call(b);
                b.clip();
                CanvasRenderingContext2D.prototype.beginPath = c;
                CanvasRenderingContext2D.prototype.closePath = d
            };
            this.render = function (a) {
            }
        };
        a.Element.clipPath.prototype = new a.Element.ElementBase;
        a.Element.filter = function (c) {
            this.base = a.Element.ElementBase;
            this.base(c);
            this.apply = function (a, c) {
                var d = c.getBoundingBox(), k = Math.floor(d.x1), f = Math.floor(d.y1), g = Math.floor(d.width()), d = Math.floor(d.height()), m = c.style("filter").value;
                c.style("filter").value = "";
                for (var h = 0, l = 0, u = 0; u < this.children.length; u++)var p = this.children[u].extraFilterDistance || 0, h = Math.max(h, p), l = Math.max(l, p);
                p = document.createElement("canvas");
                p.width = g + 2 * h;
                p.height = d + 2 * l;
                var t = p.getContext("2d");
                t.translate(-k + h, -f + l);
                c.render(t);
                for (u = 0; u < this.children.length; u++)"function" === typeof this.children[u].apply &&
                this.children[u].apply(t, 0, 0, g + 2 * h, d + 2 * l);
                a.drawImage(p, 0, 0, g + 2 * h, d + 2 * l, k - h, f - l, g + 2 * h, d + 2 * l);
                c.style("filter", !0).value = m
            };
            this.render = function (a) {
            }
        };
        a.Element.filter.prototype = new a.Element.ElementBase;
        a.Element.feMorphology = function (c) {
            this.base = a.Element.ElementBase;
            this.base(c);
            this.apply = function (a, c, d, k, f) {
            }
        };
        a.Element.feMorphology.prototype = new a.Element.ElementBase;
        a.Element.feComposite = function (c) {
            this.base = a.Element.ElementBase;
            this.base(c);
            this.apply = function (a, c, d, k, f) {
            }
        };
        a.Element.feComposite.prototype =
            new a.Element.ElementBase;
        a.Element.feColorMatrix = function (c) {
            function b(a, b) {
                var c = e[a];
                return c * (0 > c ? b - 255 : b)
            }

            this.base = a.Element.ElementBase;
            this.base(c);
            var e = a.ToNumberArray(this.attribute("values").value);
            switch (this.attribute("type").valueOrDefault("matrix")) {
                case "saturate":
                    c = e[0];
                    e = [.213 + .787 * c, .715 - .715 * c, .072 - .072 * c, 0, 0, .213 - .213 * c, .715 + .285 * c, .072 - .072 * c, 0, 0, .213 - .213 * c, .715 - .715 * c, .072 + .928 * c, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1];
                    break;
                case "hueRotate":
                    var d = e[0] * Math.PI / 180;
                    c = function (a, b, c) {
                        return a +
                            Math.cos(d) * b + Math.sin(d) * c
                    };
                    e = [c(.213, .787, -.213), c(.715, -.715, -.715), c(.072, -.072, .928), 0, 0, c(.213, -.213, .143), c(.715, .285, .14), c(.072, -.072, -.283), 0, 0, c(.213, -.213, -.787), c(.715, -.715, .715), c(.072, .928, .072), 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1];
                    break;
                case "luminanceToAlpha":
                    e = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, .2125, .7154, .0721, 0, 0, 0, 0, 0, 0, 1]
            }
            this.apply = function (a, c, d, e, h) {
                var l = a.getImageData(0, 0, e, h);
                for (d = 0; d < h; d++)for (c = 0; c < e; c++) {
                    var u = l.data[d * e * 4 + 4 * c + 0], p = l.data[d * e * 4 + 4 * c + 1], t = l.data[d * e * 4 + 4 * c + 2], v = l.data[d *
                    e * 4 + 4 * c + 3], q = b(0, u) + b(1, p) + b(2, t) + b(3, v) + b(4, 1);
                    l.data[d * e * 4 + 4 * c + 0] = q;
                    q = b(5, u) + b(6, p) + b(7, t) + b(8, v) + b(9, 1);
                    l.data[d * e * 4 + 4 * c + 1] = q;
                    q = b(10, u) + b(11, p) + b(12, t) + b(13, v) + b(14, 1);
                    l.data[d * e * 4 + 4 * c + 2] = q;
                    u = b(15, u) + b(16, p) + b(17, t) + b(18, v) + b(19, 1);
                    l.data[d * e * 4 + 4 * c + 3] = u
                }
                a.clearRect(0, 0, e, h);
                a.putImageData(l, 0, 0)
            }
        };
        a.Element.feColorMatrix.prototype = new a.Element.ElementBase;
        a.Element.feGaussianBlur = function (c) {
            this.base = a.Element.ElementBase;
            this.base(c);
            this.extraFilterDistance = this.blurRadius = Math.floor(this.attribute("stdDeviation").numValue());
            this.apply = function (b, c, d, k, f) {
                "undefined" == typeof y.canvasRGBA ? a.log("ERROR: StackBlur.js must be included for blur to work") : (b.canvas.id = a.UniqueId(), b.canvas.style.display = "none", document.body.appendChild(b.canvas), y.canvasRGBA(b.canvas.id, c, d, k, f, this.blurRadius), document.body.removeChild(b.canvas))
            }
        };
        a.Element.feGaussianBlur.prototype = new a.Element.ElementBase;
        a.Element.title = function (a) {
        };
        a.Element.title.prototype = new a.Element.ElementBase;
        a.Element.desc = function (a) {
        };
        a.Element.desc.prototype =
            new a.Element.ElementBase;
        a.Element.MISSING = function (c) {
            a.log("ERROR: Element '" + c.nodeName + "' not yet implemented.")
        };
        a.Element.MISSING.prototype = new a.Element.ElementBase;
        a.CreateElement = function (c) {
            var b = c.nodeName.replace(/^[^:]+:/, ""), b = b.replace(/\-/g, ""), b = "undefined" != typeof a.Element[b] ? new a.Element[b](c) : new a.Element.MISSING(c);
            b.type = c.nodeName;
            return b
        };
        a.load = function (c, b) {
            a.loadXml(c, a.ajax(b))
        };
        a.loadXml = function (c, b) {
            a.loadXmlDoc(c, a.parseXml(b))
        };
        a.loadXmlDoc = function (c, b) {
            a.init(c);
            var e = function (a) {
                for (var b = c.canvas; b;)a.x -= b.offsetLeft, a.y -= b.offsetTop, b = b.offsetParent;
                window.scrollX && (a.x += window.scrollX);
                window.scrollY && (a.y += window.scrollY);
                return a
            };
            1 != a.opts.ignoreMouse && (c.canvas.onclick = function (b) {
                b = e(new a.Point(null != b ? b.clientX : event.clientX, null != b ? b.clientY : event.clientY));
                a.Mouse.onclick(b.x, b.y)
            }, c.canvas.onmousemove = function (b) {
                b = e(new a.Point(null != b ? b.clientX : event.clientX, null != b ? b.clientY : event.clientY));
                a.Mouse.onmousemove(b.x, b.y)
            });
            var d = a.CreateElement(b.documentElement);
            d.root = !0;
            d.addStylesFromStyleDefinition();
            var k = !0, f = function () {
                a.ViewPort.Clear();
                c.canvas.parentNode && a.ViewPort.SetCurrent(c.canvas.parentNode.clientWidth, c.canvas.parentNode.clientHeight);
                1 != a.opts.ignoreDimensions && (d.style("width").hasValue() && (c.canvas.width = d.style("width").toPixels("x"), c.canvas.style.width = c.canvas.width + "px"), d.style("height").hasValue() && (c.canvas.height = d.style("height").toPixels("y"), c.canvas.style.height = c.canvas.height + "px"));
                var e = c.canvas.clientWidth || c.canvas.width,
                    f = c.canvas.clientHeight || c.canvas.height;
                1 == a.opts.ignoreDimensions && d.style("width").hasValue() && d.style("height").hasValue() && (e = d.style("width").toPixels("x"), f = d.style("height").toPixels("y"));
                a.ViewPort.SetCurrent(e, f);
                null != a.opts.offsetX && (d.attribute("x", !0).value = a.opts.offsetX);
                null != a.opts.offsetY && (d.attribute("y", !0).value = a.opts.offsetY);
                if (null != a.opts.scaleWidth || null != a.opts.scaleHeight) {
                    var g = null, h = null, l = a.ToNumberArray(d.attribute("viewBox").value);
                    null != a.opts.scaleWidth && (d.attribute("width").hasValue() ?
                        g = d.attribute("width").toPixels("x") / a.opts.scaleWidth : isNaN(l[2]) || (g = l[2] / a.opts.scaleWidth));
                    null != a.opts.scaleHeight && (d.attribute("height").hasValue() ? h = d.attribute("height").toPixels("y") / a.opts.scaleHeight : isNaN(l[3]) || (h = l[3] / a.opts.scaleHeight));
                    null == g && (g = h);
                    null == h && (h = g);
                    d.attribute("width", !0).value = a.opts.scaleWidth;
                    d.attribute("height", !0).value = a.opts.scaleHeight;
                    d.style("transform", !0, !0).value += " scale(" + 1 / g + "," + 1 / h + ")"
                }
                1 != a.opts.ignoreClear && c.clearRect(0, 0, e, f);
                d.render(c);
                k &&
                (k = !1, "function" == typeof a.opts.renderCallback && a.opts.renderCallback(b))
            }, g = !0;
            a.ImagesLoaded() && (g = !1, f());
            a.intervalID = setInterval(function () {
                var b = !1;
                g && a.ImagesLoaded() && (g = !1, b = !0);
                1 != a.opts.ignoreMouse && (b |= a.Mouse.hasEvents());
                if (1 != a.opts.ignoreAnimation)for (var c = 0; c < a.Animations.length; c++)b |= a.Animations[c].update(1E3 / a.FRAMERATE);
                "function" == typeof a.opts.forceRedraw && 1 == a.opts.forceRedraw() && (b = !0);
                b && (f(), a.Mouse.runEvents())
            }, 1E3 / a.FRAMERATE)
        };
        a.stop = function () {
            a.intervalID && clearInterval(a.intervalID)
        };
        a.Mouse = new function () {
            this.events = [];
            this.hasEvents = function () {
                return 0 != this.events.length
            };
            this.onclick = function (a, b) {
                this.events.push({
                    type: "onclick", x: a, y: b, run: function (a) {
                        if (a.onclick)a.onclick()
                    }
                })
            };
            this.onmousemove = function (a, b) {
                this.events.push({
                    type: "onmousemove", x: a, y: b, run: function (a) {
                        if (a.onmousemove)a.onmousemove()
                    }
                })
            };
            this.eventElements = [];
            this.checkPath = function (a, b) {
                for (var e = 0; e < this.events.length; e++) {
                    var d = this.events[e];
                    b.isPointInPath && b.isPointInPath(d.x, d.y) && (this.eventElements[e] =
                        a)
                }
            };
            this.checkBoundingBox = function (a, b) {
                for (var e = 0; e < this.events.length; e++) {
                    var d = this.events[e];
                    b.isPointInBox(d.x, d.y) && (this.eventElements[e] = a)
                }
            };
            this.runEvents = function () {
                a.ctx.canvas.style.cursor = "";
                for (var c = 0; c < this.events.length; c++)for (var b = this.events[c], e = this.eventElements[c]; e;)b.run(e), e = e.parent;
                this.events = [];
                this.eventElements = []
            }
        };
        return a
    }

    var z = function (h, a, l) {
        if (null == h && null == a && null == l)for (a = document.querySelectorAll("svg"), h = 0; h < a.length; h++) {
            l = a[h];
            var c = document.createElement("canvas");
            c.width = l.clientWidth;
            c.height = l.clientHeight;
            l.parentNode.insertBefore(c, l);
            l.parentNode.removeChild(l);
            var b = document.createElement("div");
            b.appendChild(l);
            z(c, b.innerHTML)
        } else {
            "string" == typeof h && (h = document.getElementById(h));
            null != h.svg && h.svg.stop();
            l = I(l || {});
            if (1 != h.childNodes.length || "OBJECT" != h.childNodes[0].nodeName)h.svg = l;
            h = h.getContext("2d");
            "undefined" != typeof a.documentElement ? l.loadXmlDoc(h, a) : "<" == a.substr(0, 1) ? l.loadXml(h, a) : l.load(h, a)
        }
    }, w;
    if ("undefined" != typeof Element.prototype.matches)w =
        function (h, a) {
            return h.matches(a)
        }; else if ("undefined" != typeof Element.prototype.webkitMatchesSelector)w = function (h, a) {
        return h.webkitMatchesSelector(a)
    }; else if ("undefined" != typeof Element.prototype.mozMatchesSelector)w = function (h, a) {
        return h.mozMatchesSelector(a)
    }; else if ("undefined" != typeof Element.prototype.msMatchesSelector)w = function (h, a) {
        return h.msMatchesSelector(a)
    }; else if ("undefined" != typeof Element.prototype.oMatchesSelector)w = function (h, a) {
        return h.oMatchesSelector(a)
    }; else {
        if ("function" === typeof jQuery || "function" === typeof Zepto)w = function (h, a) {
            return $(h).is(a)
        };
        "undefined" === typeof w && (w = Sizzle.matchesSelector)
    }
    var B = /(\[[^\]]+\])/g, C = /(#[^\s\+>~\.\[:]+)/g, D = /(\.[^\s\+>~\.\[:]+)/g, E = /(::[^\s\+>~\.\[:]+|:first-line|:first-letter|:before|:after)/gi, F = /(:[\w-]+\([^\)]*\))/gi, G = /(:[^\s\+>~\.\[:]+)/g, H = /([^\s\+>~\.\[:]+)/g;
    "undefined" != typeof CanvasRenderingContext2D && (CanvasRenderingContext2D.prototype.drawSvg = function (h, a, l, c, b) {
        z(this.canvas, h, {
            ignoreMouse: !0, ignoreAnimation: !0, ignoreDimensions: !0,
            ignoreClear: !0, offsetX: a, offsetY: l, scaleWidth: c, scaleHeight: b
        })
    });
    return z
});
