/*
 Highcharts JS v5.0.6 (2016-12-07)
 Data module

 (c) 2012-2016 Torstein Honsi

 License: www.highcharts.com/license
 */
(function (p) {
    "object" === typeof module && module.exports ? module.exports = p : p(Highcharts)
})(function (p) {
    (function (g) {
        var p = g.win.document, m = g.each, z = g.pick, w = g.inArray, x = g.isNumber, A = g.splat, n, u = function (b, a) {
            this.init(b, a)
        };
        g.extend(u.prototype, {
            init: function (b, a) {
                this.options = b;
                this.chartOptions = a;
                this.columns = b.columns || this.rowsToColumns(b.rows) || [];
                this.firstRowAsNames = z(b.firstRowAsNames, !0);
                this.decimalRegex = b.decimalPoint && new RegExp("^(-?[0-9]+)" + b.decimalPoint + "([0-9]+)$");
                this.rawColumns = [];
                this.columns.length ? this.dataFound() : (this.parseCSV(), this.parseTable(), this.parseGoogleSpreadsheet())
            }, getColumnDistribution: function () {
                var b = this.chartOptions, a = this.options, d = [], f = function (b) {
                    return (g.seriesTypes[b || "line"].prototype.pointArrayMap || [0]).length
                }, e = b && b.chart && b.chart.type, c = [], k = [], t = 0, h;
                m(b && b.series || [], function (b) {
                    c.push(f(b.type || e))
                });
                m(a && a.seriesMapping || [], function (b) {
                    d.push(b.x || 0)
                });
                0 === d.length && d.push(0);
                m(a && a.seriesMapping || [], function (a) {
                    var d = new n, r, v = c[t] || f(e),
                        q = g.seriesTypes[((b && b.series || [])[t] || {}).type || e || "line"].prototype.pointArrayMap || ["y"];
                    d.addColumnReader(a.x, "x");
                    for (r in a)a.hasOwnProperty(r) && "x" !== r && d.addColumnReader(a[r], r);
                    for (h = 0; h < v; h++)d.hasReader(q[h]) || d.addColumnReader(void 0, q[h]);
                    k.push(d);
                    t++
                });
                a = g.seriesTypes[e || "line"].prototype.pointArrayMap;
                void 0 === a && (a = ["y"]);
                this.valueCount = {global: f(e), xColumns: d, individual: c, seriesBuilders: k, globalPointArrayMap: a}
            }, dataFound: function () {
                this.options.switchRowsAndColumns && (this.columns =
                    this.rowsToColumns(this.columns));
                this.getColumnDistribution();
                this.parseTypes();
                !1 !== this.parsed() && this.complete()
            }, parseCSV: function () {
                var b = this, a = this.options, d = a.csv, f = this.columns, e = a.startRow || 0, c = a.endRow || Number.MAX_VALUE, k = a.startColumn || 0, t = a.endColumn || Number.MAX_VALUE, h, g, y = 0;
                d && (g = d.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split(a.lineDelimiter || "\n"), h = a.itemDelimiter || (-1 !== d.indexOf("\t") ? "\t" : ","), m(g, function (a, d) {
                    var g = b.trim(a), r = 0 === g.indexOf("#");
                    d >= e && d <= c && !r && "" !== g && (a =
                        a.split(h), m(a, function (b, a) {
                        a >= k && a <= t && (f[a - k] || (f[a - k] = []), f[a - k][y] = b)
                    }), y += 1)
                }), this.dataFound())
            }, parseTable: function () {
                var b = this.options, a = b.table, d = this.columns, f = b.startRow || 0, e = b.endRow || Number.MAX_VALUE, c = b.startColumn || 0, k = b.endColumn || Number.MAX_VALUE;
                a && ("string" === typeof a && (a = p.getElementById(a)), m(a.getElementsByTagName("tr"), function (b, a) {
                    a >= f && a <= e && m(b.children, function (b, e) {
                        ("TD" === b.tagName || "TH" === b.tagName) && e >= c && e <= k && (d[e - c] || (d[e - c] = []), d[e - c][a - f] = b.innerHTML)
                    })
                }), this.dataFound())
            },
            parseGoogleSpreadsheet: function () {
                var b = this, a = this.options, d = a.googleSpreadsheetKey, f = this.columns, e = a.startRow || 0, c = a.endRow || Number.MAX_VALUE, k = a.startColumn || 0, g = a.endColumn || Number.MAX_VALUE, h, v;
                d && jQuery.ajax({
                    dataType: "json",
                    url: "https://spreadsheets.google.com/feeds/cells/" + d + "/" + (a.googleSpreadsheetWorksheet || "od6") + "/public/values?alt\x3djson-in-script\x26callback\x3d?",
                    error: a.error,
                    success: function (a) {
                        a = a.feed.entry;
                        var d, t = a.length, q = 0, n = 0, l;
                        for (l = 0; l < t; l++)d = a[l], q = Math.max(q, d.gs$cell.col),
                            n = Math.max(n, d.gs$cell.row);
                        for (l = 0; l < q; l++)l >= k && l <= g && (f[l - k] = [], f[l - k].length = Math.min(n, c - e));
                        for (l = 0; l < t; l++)d = a[l], h = d.gs$cell.row - 1, v = d.gs$cell.col - 1, v >= k && v <= g && h >= e && h <= c && (f[v - k][h - e] = d.content.$t);
                        m(f, function (a) {
                            for (l = 0; l < a.length; l++)void 0 === a[l] && (a[l] = null)
                        });
                        b.dataFound()
                    }
                })
            }, trim: function (b, a) {
                "string" === typeof b && (b = b.replace(/^\s+|\s+$/g, ""), a && /^[0-9\s]+$/.test(b) && (b = b.replace(/\s/g, "")), this.decimalRegex && (b = b.replace(this.decimalRegex, "$1.$2")));
                return b
            }, parseTypes: function () {
                for (var b =
                    this.columns, a = b.length; a--;)this.parseColumn(b[a], a)
            }, parseColumn: function (b, a) {
                var d = this.rawColumns, f = this.columns, e = b.length, c, k, g, h, n = this.firstRowAsNames, m = -1 !== w(a, this.valueCount.xColumns), r = [], p = this.chartOptions, q, u = (this.options.columnTypes || [])[a], p = m && (p && p.xAxis && "category" === A(p.xAxis)[0].type || "string" === u);
                for (d[a] || (d[a] = []); e--;)c = r[e] || b[e], g = this.trim(c), h = this.trim(c, !0), k = parseFloat(h), void 0 === d[a][e] && (d[a][e] = g), p || 0 === e && n ? b[e] = g : +h === k ? (b[e] = k, 31536E6 < k && "float" !== u ? b.isDatetime = !0 : b.isNumeric = !0, void 0 !== b[e + 1] && (q = k > b[e + 1])) : (k = this.parseDate(c), m && x(k) && "float" !== u ? (r[e] = c, b[e] = k, b.isDatetime = !0, void 0 !== b[e + 1] && (c = k > b[e + 1], c !== q && void 0 !== q && (this.alternativeFormat ? (this.dateFormat = this.alternativeFormat, e = b.length, this.alternativeFormat = this.dateFormats[this.dateFormat].alternative) : b.unsorted = !0), q = c)) : (b[e] = "" === g ? null : g, 0 !== e && (b.isDatetime || b.isNumeric) && (b.mixed = !0)));
                m && b.mixed && (f[a] = d[a]);
                if (m && q && this.options.sort)for (a = 0; a < f.length; a++)f[a].reverse(), n && f[a].unshift(f[a].pop())
            },
            dateFormats: {
                "YYYY-mm-dd": {
                    regex: /^([0-9]{4})[\-\/\.]([0-9]{2})[\-\/\.]([0-9]{2})$/, parser: function (b) {
                        return Date.UTC(+b[1], b[2] - 1, +b[3])
                    }
                }, "dd/mm/YYYY": {
                    regex: /^([0-9]{1,2})[\-\/\.]([0-9]{1,2})[\-\/\.]([0-9]{4})$/, parser: function (b) {
                        return Date.UTC(+b[3], b[2] - 1, +b[1])
                    }, alternative: "mm/dd/YYYY"
                }, "mm/dd/YYYY": {
                    regex: /^([0-9]{1,2})[\-\/\.]([0-9]{1,2})[\-\/\.]([0-9]{4})$/, parser: function (b) {
                        return Date.UTC(+b[3], b[1] - 1, +b[2])
                    }
                }, "dd/mm/YY": {
                    regex: /^([0-9]{1,2})[\-\/\.]([0-9]{1,2})[\-\/\.]([0-9]{2})$/,
                    parser: function (b) {
                        return Date.UTC(+b[3] + 2E3, b[2] - 1, +b[1])
                    }, alternative: "mm/dd/YY"
                }, "mm/dd/YY": {
                    regex: /^([0-9]{1,2})[\-\/\.]([0-9]{1,2})[\-\/\.]([0-9]{2})$/, parser: function (b) {
                        return Date.UTC(+b[3] + 2E3, b[1] - 1, +b[2])
                    }
                }
            }, parseDate: function (b) {
                var a = this.options.parseDate, d, f, e = this.options.dateFormat || this.dateFormat, c;
                if (a)d = a(b); else if ("string" === typeof b) {
                    if (e)a = this.dateFormats[e], (c = b.match(a.regex)) && (d = a.parser(c)); else for (f in this.dateFormats)if (a = this.dateFormats[f], c = b.match(a.regex)) {
                        this.dateFormat =
                            f;
                        this.alternativeFormat = a.alternative;
                        d = a.parser(c);
                        break
                    }
                    c || (c = Date.parse(b), "object" === typeof c && null !== c && c.getTime ? d = c.getTime() - 6E4 * c.getTimezoneOffset() : x(c) && (d = c - 6E4 * (new Date(c)).getTimezoneOffset()))
                }
                return d
            }, rowsToColumns: function (b) {
                var a, d, f, e, c;
                if (b)for (c = [], d = b.length, a = 0; a < d; a++)for (e = b[a].length, f = 0; f < e; f++)c[f] || (c[f] = []), c[f][a] = b[a][f];
                return c
            }, parsed: function () {
                if (this.options.parsed)return this.options.parsed.call(this, this.columns)
            }, getFreeIndexes: function (b, a) {
                var d, f = [],
                    e = [], c;
                for (d = 0; d < b; d += 1)f.push(!0);
                for (b = 0; b < a.length; b += 1)for (c = a[b].getReferencedColumnIndexes(), d = 0; d < c.length; d += 1)f[c[d]] = !1;
                for (d = 0; d < f.length; d += 1)f[d] && e.push(d);
                return e
            }, complete: function () {
                var b = this.columns, a, d = this.options, f, e, c, k, g = [], h;
                if (d.complete || d.afterComplete) {
                    for (c = 0; c < b.length; c++)this.firstRowAsNames && (b[c].name = b[c].shift());
                    f = [];
                    e = this.getFreeIndexes(b.length, this.valueCount.seriesBuilders);
                    for (c = 0; c < this.valueCount.seriesBuilders.length; c++)h = this.valueCount.seriesBuilders[c],
                    h.populateColumns(e) && g.push(h);
                    for (; 0 < e.length;) {
                        h = new n;
                        h.addColumnReader(0, "x");
                        c = w(0, e);
                        -1 !== c && e.splice(c, 1);
                        for (c = 0; c < this.valueCount.global; c++)h.addColumnReader(void 0, this.valueCount.globalPointArrayMap[c]);
                        h.populateColumns(e) && g.push(h)
                    }
                    0 < g.length && 0 < g[0].readers.length && (h = b[g[0].readers[0].columnIndex], void 0 !== h && (h.isDatetime ? a = "datetime" : h.isNumeric || (a = "category")));
                    if ("category" === a)for (c = 0; c < g.length; c++)for (h = g[c], e = 0; e < h.readers.length; e++)"x" === h.readers[e].configName && (h.readers[e].configName =
                        "name");
                    for (c = 0; c < g.length; c++) {
                        h = g[c];
                        e = [];
                        for (k = 0; k < b[0].length; k++)e[k] = h.read(b, k);
                        f[c] = {data: e};
                        h.name && (f[c].name = h.name);
                        "category" === a && (f[c].turboThreshold = 0)
                    }
                    b = {series: f};
                    a && (b.xAxis = {type: a}, "category" === a && (b.xAxis.uniqueNames = !1));
                    d.complete && d.complete(b);
                    d.afterComplete && d.afterComplete(b)
                }
            }
        });
        g.Data = u;
        g.data = function (b, a) {
            return new u(b, a)
        };
        g.wrap(g.Chart.prototype, "init", function (b, a, d) {
            var f = this;
            a && a.data ? g.data(g.extend(a.data, {
                afterComplete: function (e) {
                    var c, k;
                    if (a.hasOwnProperty("series"))if ("object" === typeof a.series)for (c = Math.max(a.series.length, e.series.length); c--;)k = a.series[c] || {}, a.series[c] = g.merge(k, e.series[c]); else delete a.series;
                    a = g.merge(e, a);
                    b.call(f, a, d)
                }
            }), a) : b.call(f, a, d)
        });
        n = function () {
            this.readers = [];
            this.pointIsArray = !0
        };
        n.prototype.populateColumns = function (b) {
            var a = !0;
            m(this.readers, function (a) {
                void 0 === a.columnIndex && (a.columnIndex = b.shift())
            });
            m(this.readers, function (b) {
                void 0 === b.columnIndex && (a = !1)
            });
            return a
        };
        n.prototype.read = function (b, a) {
            var d = this.pointIsArray, f = d ?
                [] : {}, e;
            m(this.readers, function (c) {
                var e = b[c.columnIndex][a];
                d ? f.push(e) : f[c.configName] = e
            });
            void 0 === this.name && 2 <= this.readers.length && (e = this.getReferencedColumnIndexes(), 2 <= e.length && (e.shift(), e.sort(), this.name = b[e.shift()].name));
            return f
        };
        n.prototype.addColumnReader = function (b, a) {
            this.readers.push({columnIndex: b, configName: a});
            "x" !== a && "y" !== a && void 0 !== a && (this.pointIsArray = !1)
        };
        n.prototype.getReferencedColumnIndexes = function () {
            var b, a = [], d;
            for (b = 0; b < this.readers.length; b += 1)d = this.readers[b],
            void 0 !== d.columnIndex && a.push(d.columnIndex);
            return a
        };
        n.prototype.hasReader = function (b) {
            var a, d;
            for (a = 0; a < this.readers.length; a += 1)if (d = this.readers[a], d.configName === b)return !0
        }
    })(p)
});
