function _createForOfIteratorHelper(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
    if (!it) {
        if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
            if (it)
                o = it;
            var i = 0;
            var F = function F() {};
            return {
                s: F,
                n: function n() {
                    if (i >= o.length)
                        return {
                            done: true
                        };
                    return {
                        done: false,
                        value: o[i++]
                    };
                },
                e: function e(_e) {
                    throw _e;
                },
                f: F
            };
        }
        throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var normalCompletion = true, didErr = false, err;
    return {
        s: function s() {
            it = it.call(o);
        },
        n: function n() {
            var step = it.next();
            normalCompletion = step.done;
            return step;
        },
        e: function e(_e2) {
            didErr = true;
            err = _e2;
        },
        f: function f() {
            try {
                if (!normalCompletion && it["return"] != null)
                    it["return"]();
            } finally {
                if (didErr)
                    throw err;
            }
        }
    };
}
function _unsupportedIterableToArray(o, minLen) {
    if (!o)
        return;
    if (typeof o === "string")
        return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor)
        n = o.constructor.name;
    if (n === "Map" || n === "Set")
        return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
        return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length)
        len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) {
        arr2[i] = arr[i];
    }
    return arr2;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        enumerableOnly && (symbols = symbols.filter(function(sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        })),
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = null != arguments[i] ? arguments[i] : {};
        i % 2 ? ownKeys(Object(source), !0).forEach(function(key) {
            _defineProperty(target, key, source[key]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
PegParser = function() {
    "use strict";
    function peg$subclass(child, parent) {
        function ctor() {
            this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
    }
    function peg$SyntaxError(message, expected, found, location) {
        this.message = message;
        this.expected = expected;
        this.found = found;
        this.location = location;
        this.name = "SyntaxError";
        if (typeof Error.captureStackTrace === "function") {
            Error.captureStackTrace(this, peg$SyntaxError);
        }
    }
    peg$subclass(peg$SyntaxError, Error);
    peg$SyntaxError.buildMessage = function(expected, found) {
        var DESCRIBE_EXPECTATION_FNS = {
            literal: function literal(expectation) {
                return "\"" + literalEscape(expectation.text) + "\"";
            },
            "class": function _class(expectation) {
                var escapedParts = "", i;
                for (i = 0; i < expectation.parts.length; i++) {
                    escapedParts += expectation.parts[i]instanceof Array ? classEscape(expectation.parts[i][0]) + "-" + classEscape(expectation.parts[i][1]) : classEscape(expectation.parts[i]);
                }
                return "[" + (expectation.inverted ? "^" : "") + escapedParts + "]";
            },
            any: function any(expectation) {
                return "any character";
            },
            end: function end(expectation) {
                return "end of input";
            },
            other: function other(expectation) {
                return expectation.description;
            }
        };
        function hex(ch) {
            return ch.charCodeAt(0).toString(16).toUpperCase();
        }
        function literalEscape(s) {
            return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\0/g, '\\0').replace(/\t/g, '\\t').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/[\x00-\x0F]/g, function(ch) {
                return '\\x0' + hex(ch);
            }).replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) {
                return '\\x' + hex(ch);
            });
        }
        function classEscape(s) {
            return s.replace(/\\/g, '\\\\').replace(/\]/g, '\\]').replace(/\^/g, '\\^').replace(/-/g, '\\-').replace(/\0/g, '\\0').replace(/\t/g, '\\t').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/[\x00-\x0F]/g, function(ch) {
                return '\\x0' + hex(ch);
            }).replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) {
                return '\\x' + hex(ch);
            });
        }
        function describeExpectation(expectation) {
            return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation);
        }
        function describeExpected(expected) {
            var descriptions = new Array(expected.length), i, j;
            for (i = 0; i < expected.length; i++) {
                descriptions[i] = describeExpectation(expected[i]);
            }
            descriptions.sort();
            if (descriptions.length > 0) {
                for (i = 1,
                j = 1; i < descriptions.length; i++) {
                    if (descriptions[i - 1] !== descriptions[i]) {
                        descriptions[j] = descriptions[i];
                        j++;
                    }
                }
                descriptions.length = j;
            }
            switch (descriptions.length) {
            case 1:
                return descriptions[0];
            case 2:
                return descriptions[0] + " or " + descriptions[1];
            default:
                return descriptions.slice(0, -1).join(", ") + ", or " + descriptions[descriptions.length - 1];
            }
        }
        function describeFound(found) {
            return found ? "\"" + literalEscape(found) + "\"" : "end of input";
        }
        return "Expected " + describeExpected(expected) + " but " + describeFound(found) + " found.";
    }
    ;
    function peg$parse(input, options) {
        options = options !== void 0 ? options : {};
        var peg$FAILED = {}, peg$startRuleFunctions = {
            start: peg$parsestart
        }, peg$startRuleFunction = peg$parsestart, peg$c0 = function peg$c0(n) {
            return n;
        }, peg$c1 = function peg$c1(head, tail) {
            var cur = [head && head.ast || head];
            for (var i = 0; i < tail.length; i++) {
                if (!tail[i][3] || tail[i][3].length === 0)
                    continue;
                cur.push(tail[i][3] && tail[i][3].ast || tail[i][3]);
            }
            return {
                tableList: Array.from(tableList),
                columnList: columnListTableAlias(columnList),
                ast: cur
            };
        }, peg$c2 = function peg$c2(t, l, w, or, lc) {
            if (t)
                t.forEach(function(tableInfo) {
                    var db = tableInfo.db
                      , as = tableInfo.as
                      , table = tableInfo.table;
                    tableList.add("update::".concat(db, "::").concat(table));
                });
            if (l) {
                l.forEach(function(col) {
                    return columnList.add("update::".concat(col.table, "::").concat(col.column));
                });
            }
            return {
                tableList: Array.from(tableList),
                columnList: columnListTableAlias(columnList),
                ast: {
                    type: 'update',
                    table: t,
                    set: l,
                    where: w,
                    orderby: or,
                    limit: lc
                }
            };
        }, peg$c3 = function peg$c3(t, f, w, or, l) {
            if (f)
                f.forEach(function(info) {
                    info.table && tableList.add("delete::".concat(info.db, "::").concat(info.table));
                    columnList.add("delete::".concat(info.table, "::(.*)"));
                });
            if (t === null && f.length === 1) {
                var tableInfo = f[0];
                t = [{
                    db: tableInfo.db,
                    table: tableInfo.table,
                    as: tableInfo.as,
                    addition: true
                }];
            }
            return {
                tableList: Array.from(tableList),
                columnList: columnListTableAlias(columnList),
                ast: {
                    type: 'delete',
                    table: t,
                    from: f,
                    where: w,
                    orderby: or,
                    limit: l
                }
            };
        }, peg$c4 = function peg$c4(ri, t, p, c, v, odp) {
            if (t) {
                tableList.add("insert::".concat(t.db, "::").concat(t.table));
                t.as = null;
            }
            if (c) {
                var table = t && t.table || null;
                if (Array.isArray(v)) {
                    v.forEach(function(row, idx) {
                        if (row.value.length != c.length) {
                            throw new Error("Error: column count doesn't match value count at row ".concat(idx + 1));
                        }
                    });
                }
                c.forEach(function(c) {
                    return columnList.add("insert::".concat(table, "::").concat(c));
                });
            }
            return {
                tableList: Array.from(tableList),
                columnList: columnListTableAlias(columnList),
                ast: {
                    type: ri,
                    table: [t],
                    columns: c,
                    values: v,
                    partition: p,
                    on_duplicate_update: odp
                }
            };
        }, peg$c5 = function peg$c5(ri, t, p, v, odp) {
            if (t) {
                tableList.add("insert::".concat(t.db, "::").concat(t.table));
                columnList.add("insert::".concat(t.table, "::(.*)"));
                t.as = null;
            }
            return {
                tableList: Array.from(tableList),
                columnList: columnListTableAlias(columnList),
                ast: {
                    type: ri,
                    table: [t],
                    columns: null,
                    values: v,
                    partition: p,
                    on_duplicate_update: odp
                }
            };
        }, peg$c6 = function peg$c6(ri, t, p, l, odp) {
            if (t) {
                tableList.add("insert::".concat(t.db, "::").concat(t.table));
                columnList.add("insert::".concat(t.table, "::(.*)"));
                t.as = null;
            }
            return {
                tableList: Array.from(tableList),
                columnList: columnListTableAlias(columnList),
                ast: {
                    type: ri,
                    table: [t],
                    columns: null,
                    partition: p,
                    set: l,
                    on_duplicate_update: odp
                }
            };
        }, peg$c7 = function peg$c7() {
            varList = [];
            return true;
        }, peg$c8 = function peg$c8(s) {
            return {
                stmt: s,
                vars: varList
            };
        }, peg$c9 = function peg$c9(va, s, e) {
            return {
                type: 'assign',
                left: va,
                symbol: s,
                right: e
            };
        }, peg$c10 = function peg$c10(e) {
            return {
                type: 'return',
                expr: e
            };
        }, peg$c11 = function peg$c11(head, tail) {
            return createBinaryExprChain(head, tail);
        }, peg$c12 = function peg$c12(lt, op, rt, expr) {
            return {
                type: 'join',
                ltable: lt,
                rtable: rt,
                op: op,
                on: expr
            };
        }, peg$c13 = function peg$c13(e) {
            e.parentheses = true;
            return e;
        }, peg$c14 = function peg$c14(name, l) {
            return {
                type: 'function',
                name: name,
                args: {
                    type: 'expr_list',
                    value: l
                }
            };
        }, peg$c15 = function peg$c15(name) {
            return {
                type: 'function',
                name: name,
                args: null
            };
        }, peg$c16 = function peg$c16(head, tail) {
            return createList(head, tail);
        }, peg$c17 = function peg$c17(l) {
            return {
                type: 'array',
                value: l
            };
        }, peg$c18 = "=", peg$c19 = peg$literalExpectation("=", false), peg$c20 = function peg$c20(tbl, c, v) {
            return {
                column: c,
                value: v,
                table: tbl && tbl[0]
            };
        }, peg$c21 = function peg$c21(tbl, c, v) {
            return {
                column: c,
                value: v,
                table: tbl && tbl[0],
                keyword: 'values'
            };
        }, peg$c22 = function peg$c22() {
            return 'insert';
        }, peg$c23 = function peg$c23() {
            return 'replace';
        }, peg$c24 = function peg$c24(head, tail) {
            return createList(head, tail);
        }, peg$c25 = function peg$c25(v) {
            return v;
        }, peg$c26 = "duplicate", peg$c27 = peg$literalExpectation("DUPLICATE", true), peg$c28 = function peg$c28(s) {
            return {
                keyword: 'on duplicate key update',
                set: s
            };
        }, peg$c29 = function peg$c29(a, t) {
            tableList.add("".concat(a, "::").concat(t.db, "::").concat(t.table));
            return {
                tableList: Array.from(tableList),
                columnList: columnListTableAlias(columnList),
                ast: {
                    type: a.toLowerCase(),
                    table: t
                }
            };
        }, peg$c30 = function peg$c30(a, db, e, as, schema) {
            return {
                tableList: Array.from(tableList),
                columnList: columnListTableAlias(columnList),
                ast: {
                    type: a.toLowerCase(),
                    database: db,
                    expr: e,
                    as: as && as[0].toLowerCase(),
                    schema: schema
                }
            };
        }, peg$c31 = function peg$c31(a, r, t) {
            if (t)
                t.forEach(function(tt) {
                    return tableList.add("".concat(a, "::").concat(tt.db, "::").concat(tt.table));
                });
            return {
                tableList: Array.from(tableList),
                columnList: columnListTableAlias(columnList),
                ast: {
                    type: a.toLowerCase(),
                    keyword: r.toLowerCase(),
                    name: t
                }
            };
        }, peg$c32 = function peg$c32(a, r, i, t, op) {
            return {
                tableList: Array.from(tableList),
                columnList: columnListTableAlias(columnList),
                ast: {
                    type: a.toLowerCase(),
                    keyword: r.toLowerCase(),
                    name: i,
                    table: t,
                    options: op
                }
            };
        }, peg$c33 = function peg$c33(a, kw, t) {
            if (t)
                t.forEach(function(tt) {
                    return tableList.add("".concat(a, "::").concat(tt.db, "::").concat(tt.table));
                });
            return {
                tableList: Array.from(tableList),
                columnList: columnListTableAlias(columnList),
                ast: {
                    type: a.toLowerCase(),
                    keyword: kw && kw.toLowerCase() || 'table',
                    name: t
                }
            };
        }, peg$c34 = function peg$c34(t) {
            t.forEach(function(tg) {
                return tg.forEach(function(dt) {
                    return dt.table && tableList.add("rename::".concat(dt.db, "::").concat(dt.table));
                });
            });
            return {
                tableList: Array.from(tableList),
                columnList: columnListTableAlias(columnList),
                ast: {
                    type: 'rename',
                    table: t
                }
            };
        }, peg$c35 = function peg$c35(e) {
            return {
                tableList: Array.from(tableList),
                columnList: columnListTableAlias(columnList),
                ast: {
                    type: 'call',
                    expr: e
                }
            };
        }, peg$c36 = function peg$c36(d) {
            tableList.add("use::".concat(d, "::null"));
            return {
                tableList: Array.from(tableList),
                columnList: columnListTableAlias(columnList),
                ast: {
                    type: 'use',
                    db: d
                }
            };
        }, peg$c37 = function peg$c37(kw, a) {
            a.keyword = kw;
            return {
                tableList: Array.from(tableList),
                columnList: columnListTableAlias(columnList),
                ast: {
                    type: 'set',
                    expr: a
                }
            };
        }, peg$c38 = function peg$c38(ltl) {
            return {
                tableList: Array.from(tableList),
                columnList: columnListTableAlias(columnList),
                ast: {
                    type: 'lock',
                    keyword: 'tables',
                    tables: ltl
                }
            };
        }, peg$c39 = function peg$c39() {
            return {
                tableList: Array.from(tableList),
                columnList: columnListTableAlias(columnList),
                ast: {
                    type: 'unlock',
                    keyword: 'tables'
                }
            };
        }, peg$c40 = "binary", peg$c41 = peg$literalExpectation("BINARY", true), peg$c42 = "master", peg$c43 = peg$literalExpectation("MASTER", true), peg$c44 = "logs", peg$c45 = peg$literalExpectation("LOGS", true), peg$c46 = function peg$c46(t) {
            return {
                tableList: Array.from(tableList),
                columnList: columnListTableAlias(columnList),
                ast: {
                    type: 'show',
                    suffix: 'logs',
                    keyword: t.toLowerCase()
                }
            };
        }, peg$c47 = "binlog", peg$c48 = peg$literalExpectation("BINLOG", true), peg$c49 = "events", peg$c50 = peg$literalExpectation("EVENTS", true), peg$c51 = function peg$c51(ins, from, limit) {
            return {
                tableList: Array.from(tableList),
                columnList: columnListTableAlias(columnList),
                ast: {
                    type: 'show',
                    suffix: 'events',
                    keyword: 'binlog',
                    "in": ins,
                    from: from,
                    limit: limit
                }
            };
        }, peg$c52 = "character", peg$c53 = peg$literalExpectation("CHARACTER", true), peg$c54 = "set", peg$c55 = peg$literalExpectation("SET", true), peg$c56 = "collation", peg$c57 = peg$literalExpectation("COLLATION", true), peg$c58 = function peg$c58(k, e) {
            var keyword = Array.isArray(k) && k || [k];
            return {
                tableList: Array.from(tableList),
                columnList: columnListTableAlias(columnList),
                ast: {
                    type: 'show',
                    suffix: keyword[2] && keyword[2].toLowerCase(),
                    keyword: keyword[0].toLowerCase(),
                    expr: e
                }
            };
        }, peg$c59 = function peg$c59(t) {
            return {
                tableList: Array.from(tableList),
                columnList: columnListTableAlias(columnList),
                ast: {
                    type: 'desc',
                    table: t
                }
            };
        }, peg$c60 = function peg$c60(p, d) {
            return _objectSpread(_objectSpread({
                type: 'var'
            }, d), {}, {
                prefix: p
            });
        }, peg$c61 = function peg$c61(name, m) {
            varList.push(name);
            return {
                type: 'var',
                name: name,
                members: m,
                prefix: null
            };
        }, peg$c62 = function peg$c62(l) {
            return l;
        }, peg$c63 = function peg$c63(l) {
            return l;
        }, peg$c64 = function peg$c64(head, tail) {
            return createList(head, tail, 1);
        }, peg$c65 = function peg$c65(a, tp, ife, t, c, con, to, ir, as, qe) {
            if (t)
                t.forEach(function(tt) {
                    return tableList.add("create::".concat(tt.db, "::").concat(tt.table));
                });
            return {
                tableList: Array.from(tableList),
                columnList: columnListTableAlias(columnList),
                ast: {
                    type: a[0].toLowerCase(),
                    keyword: 'table',
                    temporary: tp && tp[0].toLowerCase(),
                    if_not_exists: ife && ife[0].toLowerCase(),
                    table: t,
                    ignore_replace: ir && ir[0].toLowerCase(),
                    as: as && as[0].toLowerCase(),
                    query_expr: qe && qe.ast,
                    create_definitions: c,
                    constraint: con,
                    table_options: to
                }
            };
        }, peg$c66 = function peg$c66(a, tp, ife, t, lt) {
            if (t)
                t.forEach(function(tt) {
                    return tableList.add("create::".concat(tt.db, "::").concat(tt.table));
                });
            return {
                tableList: Array.from(tableList),
                columnList: columnListTableAlias(columnList),
                ast: {
                    type: a[0].toLowerCase(),
                    keyword: 'table',
                    temporary: tp && tp[0].toLowerCase(),
                    if_not_exists: ife && ife[0].toLowerCase(),
                    table: t,
                    like: lt
                }
            };
        }, peg$c67 = function peg$c67(a, k, ife, t, c) {
            return {
                tableList: Array.from(tableList),
                columnList: columnListTableAlias(columnList),
                ast: {
                    type: a[0].toLowerCase(),
                    keyword: 'database',
                    if_not_exists: ife && ife[0].toLowerCase(),
                    database: t,
                    create_definitions: c
                }
            };
        }, peg$c68 = function peg$c68(t, e) {
            if (t && t.length > 0)
                t.forEach(function(table) {
                    return tableList.add("alter::".concat(table.db, "::").concat(table.table));
                });
            return {
                tableList: Array.from(tableList),
                columnList: columnListTableAlias(columnList),
                ast: {
                    type: 'alter',
                    table: t,
                    expr: e
                }
            };
        }, peg$c69 = function peg$c69(head, tail) {
            return createList(head, tail);
        }, peg$c70 = "grants", peg$c71 = peg$literalExpectation("GRANTS", true), peg$c72 = function peg$c72(f) {
            return {
                tableList: Array.from(tableList),
                columnList: columnListTableAlias(columnList),
                ast: {
                    type: 'show',
                    keyword: 'grants',
                    "for": f
                }
            };
        }, peg$c73 = ".", peg$c74 = peg$literalExpectation(".", false), peg$c75 = function peg$c75(l) {
            var s = [];
            for (var i = 0; i < l.length; i++) {
                s.push(l[i][1]);
            }
            return s;
        }, peg$c76 = "algorithm", peg$c77 = peg$literalExpectation("ALGORITHM", true), peg$c78 = "default", peg$c79 = peg$literalExpectation("DEFAULT", true), peg$c80 = "instant", peg$c81 = peg$literalExpectation("INSTANT", true), peg$c82 = "inplace", peg$c83 = peg$literalExpectation("INPLACE", true), peg$c84 = "copy", peg$c85 = peg$literalExpectation("COPY", true), peg$c86 = function peg$c86(s, val) {
            return {
                type: 'alter',
                keyword: 'algorithm',
                resource: 'algorithm',
                symbol: s,
                algorithm: val
            };
        }, peg$c87 = "lock", peg$c88 = peg$literalExpectation("LOCK", true), peg$c89 = "none", peg$c90 = peg$literalExpectation("NONE", true), peg$c91 = "shared", peg$c92 = peg$literalExpectation("SHARED", true), peg$c93 = "exclusive", peg$c94 = peg$literalExpectation("EXCLUSIVE", true), peg$c95 = function peg$c95(s, val) {
            return {
                type: 'alter',
                keyword: 'lock',
                resource: 'lock',
                symbol: s,
                lock: val
            };
        }, peg$c96 = "auto_increment", peg$c97 = peg$literalExpectation("AUTO_INCREMENT", true), peg$c98 = "unique", peg$c99 = peg$literalExpectation("UNIQUE", true), peg$c100 = "primary", peg$c101 = peg$literalExpectation("PRIMARY", true), peg$c102 = "key", peg$c103 = peg$literalExpectation("KEY", true), peg$c104 = function peg$c104(c, d, n, df, a, u, co, ca, cf, s, re) {
            columnList.add("create::".concat(c.table, "::").concat(c.column));
            if (n && !n.value)
                n.value = 'null';
            return {
                column: c,
                definition: d,
                nullable: n,
                default_val: df,
                auto_increment: a && a.toLowerCase(),
                unique_or_primary: u && "".concat(u[0].toLowerCase(), " ").concat(u[2].toLowerCase()),
                comment: co,
                collate: ca,
                column_format: cf,
                storage: s,
                reference_definition: re,
                resource: 'column'
            };
        }, peg$c105 = function peg$c105(head, tail) {
            return createList(head, tail);
        }, peg$c106 = function peg$c106(e) {
            e.parentheses = true;
            return e;
        }, peg$c107 = function peg$c107(t, lt) {
            tableList.add("lock::".concat(t.db, "::").concat(t.table));
            return {
                table: t,
                lock_type: lt
            };
        }, peg$c108 = "for", peg$c109 = peg$literalExpectation("FOR", true), peg$c110 = function peg$c110(n, h, u) {
            return {
                user: n,
                host: h && h[2],
                role_list: u
            };
        }, peg$c111 = function peg$c111(kc, c, t, de, id) {
            return {
                index: c,
                definition: de,
                keyword: kc.toLowerCase(),
                index_type: t,
                resource: 'index',
                index_options: id
            };
        }, peg$c112 = function peg$c112(p, kc, c, de, id) {
            return {
                index: c,
                definition: de,
                keyword: kc && "".concat(p.toLowerCase(), " ").concat(kc.toLowerCase()) || p.toLowerCase(),
                index_options: id,
                resource: 'index'
            };
        }, peg$c113 = function peg$c113(ce) {
            return {
                type: 'default',
                value: ce
            };
        }, peg$c114 = function peg$c114(k, s, c) {
            return {
                type: k.toLowerCase(),
                keyword: k.toLowerCase(),
                symbol: s,
                value: c
            };
        }, peg$c115 = function peg$c115(s, ca) {
            return {
                type: 'collate',
                symbol: s,
                value: ca
            };
        }, peg$c116 = "column_format", peg$c117 = peg$literalExpectation("COLUMN_FORMAT", true), peg$c118 = "fixed", peg$c119 = peg$literalExpectation("FIXED", true), peg$c120 = "dynamic", peg$c121 = peg$literalExpectation("DYNAMIC", true), peg$c122 = function peg$c122(k, f) {
            return {
                type: 'column_format',
                value: f.toLowerCase()
            };
        }, peg$c123 = "storage", peg$c124 = peg$literalExpectation("STORAGE", true), peg$c125 = "disk", peg$c126 = peg$literalExpectation("DISK", true), peg$c127 = "memory", peg$c128 = peg$literalExpectation("MEMORY", true), peg$c129 = function peg$c129(k, s) {
            return {
                type: 'storage',
                value: s.toLowerCase()
            };
        }, peg$c130 = "match full", peg$c131 = peg$literalExpectation("MATCH FULL", true), peg$c132 = "match partial", peg$c133 = peg$literalExpectation("MATCH PARTIAL", true), peg$c134 = "match simple", peg$c135 = peg$literalExpectation("MATCH SIMPLE", true), peg$c136 = function peg$c136(kc, t, de, m, od, ou) {
            return {
                definition: de,
                table: t,
                keyword: kc.toLowerCase(),
                match: m && m.toLowerCase(),
                on_delete: od,
                on_update: ou
            };
        }, peg$c137 = "avg_row_length", peg$c138 = peg$literalExpectation("AVG_ROW_LENGTH", true), peg$c139 = "key_block_size", peg$c140 = peg$literalExpectation("KEY_BLOCK_SIZE", true), peg$c141 = "max_rows", peg$c142 = peg$literalExpectation("MAX_ROWS", true), peg$c143 = "min_rows", peg$c144 = peg$literalExpectation("MIN_ROWS", true), peg$c145 = "stats_sample_pages", peg$c146 = peg$literalExpectation("STATS_SAMPLE_PAGES", true), peg$c147 = function peg$c147(kw, s, v) {
            return {
                keyword: kw.toLowerCase(),
                symbol: s,
                value: v.value
            };
        }, peg$c148 = "connection", peg$c149 = peg$literalExpectation("CONNECTION", true), peg$c150 = function peg$c150(kw, s, c) {
            return {
                keyword: kw.toLowerCase(),
                symbol: s,
                value: "'".concat(c.value, "'")
            };
        }, peg$c151 = "compression", peg$c152 = peg$literalExpectation("COMPRESSION", true), peg$c153 = "'", peg$c154 = peg$literalExpectation("'", false), peg$c155 = "zlib", peg$c156 = peg$literalExpectation("ZLIB", true), peg$c157 = "lz4", peg$c158 = peg$literalExpectation("LZ4", true), peg$c159 = function peg$c159(kw, s, v) {
            return {
                keyword: kw.toLowerCase(),
                symbol: s,
                value: v.join('').toUpperCase()
            };
        }, peg$c160 = "engine", peg$c161 = peg$literalExpectation("ENGINE", true), peg$c162 = function peg$c162(kw, s, c) {
            return {
                keyword: kw.toLowerCase(),
                symbol: s,
                value: c.toUpperCase()
            };
        }, peg$c163 = function peg$c163(t) {
            return {
                type: 'like',
                table: t
            };
        }, peg$c164 = "charset", peg$c165 = peg$literalExpectation("CHARSET", true), peg$c166 = "collate", peg$c167 = peg$literalExpectation("COLLATE", true), peg$c168 = function peg$c168(kw, t, s, v) {
            return {
                keyword: kw && "".concat(kw[0].toLowerCase(), " ").concat(t.toLowerCase()) || t.toLowerCase(),
                symbol: s,
                value: v
            };
        }, peg$c169 = "read", peg$c170 = peg$literalExpectation("READ", true), peg$c171 = "local", peg$c172 = peg$literalExpectation("LOCAL", true), peg$c173 = function peg$c173(s) {
            return {
                type: 'read',
                suffix: s && 'local'
            };
        }, peg$c174 = "low_priority", peg$c175 = peg$literalExpectation("LOW_PRIORITY", true), peg$c176 = "write", peg$c177 = peg$literalExpectation("WRITE", true), peg$c178 = function peg$c178(p) {
            return {
                type: 'write',
                prefix: p && 'low_priority'
            };
        }, peg$c179 = function peg$c179(l) {
            return l;
        }, peg$c180 = function peg$c180(kc, p, t, de, id) {
            return {
                constraint: kc && kc.constraint,
                definition: de,
                constraint_type: "".concat(p[0].toLowerCase(), " ").concat(p[2].toLowerCase()),
                keyword: kc && kc.keyword,
                index_type: t,
                resource: 'constraint',
                index_options: id
            };
        }, peg$c181 = function peg$c181(kc, u, p, i, t, de, id) {
            return {
                constraint: kc && kc.constraint,
                definition: de,
                constraint_type: p && "".concat(u.toLowerCase(), " ").concat(p.toLowerCase()) || u.toLowerCase(),
                keyword: kc && kc.keyword,
                index_type: t,
                index: i,
                resource: 'constraint',
                index_options: id
            };
        }, peg$c182 = "foreign key", peg$c183 = peg$literalExpectation("FOREIGN KEY", true), peg$c184 = function peg$c184(kc, p, i, de, id) {
            return {
                constraint: kc && kc.constraint,
                definition: de,
                constraint_type: p,
                keyword: kc && kc.keyword,
                index: i,
                resource: 'constraint',
                reference_definition: id
            };
        }, peg$c185 = "check", peg$c186 = peg$literalExpectation("CHECK", true), peg$c187 = "not", peg$c188 = peg$literalExpectation("NOT", true), peg$c189 = "replication", peg$c190 = peg$literalExpectation("REPLICATION", true), peg$c191 = function peg$c191(kc, u, nfr, c) {
            return {
                constraint_type: u.toLowerCase(),
                keyword: kc && kc.keyword,
                constraint: kc && kc.constraint,
                index_type: nfr && {
                    keyword: 'not for replication'
                },
                definition: [c],
                resource: 'constraint'
            };
        }, peg$c192 = "btree", peg$c193 = peg$literalExpectation("BTREE", true), peg$c194 = "hash", peg$c195 = peg$literalExpectation("HASH", true), peg$c196 = function peg$c196(t) {
            return {
                keyword: 'using',
                type: t.toLowerCase()
            };
        }, peg$c197 = function peg$c197(head, tail) {
            var result = [head];
            for (var i = 0; i < tail.length; i++) {
                result.push(tail[i][1]);
            }
            return result;
        }, peg$c198 = function peg$c198(k, e, kbs) {
            return {
                type: k.toLowerCase(),
                symbol: e,
                expr: kbs
            };
        }, peg$c199 = "with", peg$c200 = peg$literalExpectation("WITH", true), peg$c201 = "parser", peg$c202 = peg$literalExpectation("PARSER", true), peg$c203 = function peg$c203(pn) {
            return {
                type: 'with parser',
                expr: pn
            };
        }, peg$c204 = "visible", peg$c205 = peg$literalExpectation("VISIBLE", true), peg$c206 = "invisible", peg$c207 = peg$literalExpectation("INVISIBLE", true), peg$c208 = function peg$c208(k) {
            return {
                type: k.toLowerCase(),
                expr: k.toLowerCase()
            };
        }, peg$c209 = "on", peg$c210 = peg$literalExpectation("ON", true), peg$c211 = "delete", peg$c212 = peg$literalExpectation("DELETE", true), peg$c213 = "update", peg$c214 = peg$literalExpectation("UPDATE", true), peg$c215 = function peg$c215(on_kw, kw, ro) {
            return {
                type: "".concat(on_kw.toLowerCase(), " ").concat(kw.toLowerCase()),
                value: ro
            };
        }, peg$c216 = function peg$c216() {
            return 'CHARACTER SET';
        }, peg$c217 = function peg$c217(kc, cd) {
            return _objectSpread(_objectSpread({
                action: 'add'
            }, cd), {}, {
                keyword: kc,
                resource: 'column',
                type: 'alter'
            });
        }, peg$c218 = function peg$c218(kc, c) {
            return {
                action: 'drop',
                column: c,
                keyword: kc,
                resource: 'column',
                type: 'alter'
            };
        }, peg$c219 = function peg$c219(kw, tn) {
            return {
                action: 'rename',
                type: 'alter',
                resource: 'table',
                keyword: kw && kw[0].toLowerCase(),
                table: tn
            };
        }, peg$c220 = function peg$c220(kc, c) {
            return {
                keyword: kc.toLowerCase(),
                constraint: c
            };
        }, peg$c221 = "restrict", peg$c222 = peg$literalExpectation("RESTRICT", true), peg$c223 = "cascade", peg$c224 = peg$literalExpectation("CASCADE", true), peg$c225 = "set null", peg$c226 = peg$literalExpectation("SET NULL", true), peg$c227 = "no action", peg$c228 = peg$literalExpectation("NO ACTION", true), peg$c229 = "set default", peg$c230 = peg$literalExpectation("SET DEFAULT", true), peg$c231 = function peg$c231(kc) {
            return kc.toLowerCase();
        }, peg$c232 = "create", peg$c233 = peg$literalExpectation("CREATE", true), peg$c234 = "insert", peg$c235 = peg$literalExpectation("INSERT", true), peg$c236 = ":=", peg$c237 = peg$literalExpectation(":=", false), peg$c238 = "return", peg$c239 = peg$literalExpectation("return", true), peg$c240 = "replace", peg$c241 = peg$literalExpectation("REPLACE", true), peg$c242 = "analyze", peg$c243 = peg$literalExpectation("ANALYZE", true), peg$c244 = "attach", peg$c245 = peg$literalExpectation("ATTACH", true), peg$c246 = "database", peg$c247 = peg$literalExpectation("DATABASE", true), peg$c248 = "rename", peg$c249 = peg$literalExpectation("RENAME", true), peg$c250 = "show", peg$c251 = peg$literalExpectation("SHOW", true), peg$c252 = "describe", peg$c253 = peg$literalExpectation("DESCRIBE", true), peg$c254 = "@", peg$c255 = peg$literalExpectation("@", false), peg$c256 = "@@", peg$c257 = peg$literalExpectation("@@", false), peg$c258 = "$", peg$c259 = peg$literalExpectation("$", false), peg$c260 = "temporary", peg$c261 = peg$literalExpectation("TEMPORARY", true), peg$c262 = "scheme", peg$c263 = peg$literalExpectation("SCHEME", true), peg$c264 = "alter", peg$c265 = peg$literalExpectation("ALTER", true), peg$c266 = "spatial", peg$c267 = peg$literalExpectation("SPATIAL", true), peg$c268 = "(", peg$c269 = peg$literalExpectation("(", false), peg$c270 = ")", peg$c271 = peg$literalExpectation(")", false), peg$c272 = function peg$c272(s) {
            return _objectSpread(_objectSpread({}, s[2]), {}, {
                parentheses: true
            });
        }, peg$c273 = function peg$c273(cte, s, o, l, se) {
            return {
                tableList: Array.from(tableList),
                columnList: columnListTableAlias(columnList),
                ast: {
                    type: 'bigquery',
                    "with": cte,
                    select: s && s.ast,
                    orderby: o,
                    limit: l,
                    parentheses: s && s.parentheses || false
                }
            };
        }, peg$c274 = function peg$c274(u, s) {
            return s ? "union ".concat(s.toLowerCase()) : 'union';
        }, peg$c275 = "intersect", peg$c276 = peg$literalExpectation("INTERSECT", true), peg$c277 = "except", peg$c278 = peg$literalExpectation("EXCEPT", true), peg$c279 = function peg$c279(u, s) {
            return "".concat(u.toLowerCase(), " ").concat(s.toLowerCase());
        }, peg$c280 = function peg$c280(s) {
            return _objectSpread(_objectSpread({}, s[2]), {}, {
                parentheses: true
            });
        }, peg$c281 = function peg$c281(head, tail) {
            var cur = head;
            for (var i = 0; i < tail.length; i++) {
                cur._next = tail[i][3];
                cur.union = tail[i][1];
                cur = cur._next;
            }
            return {
                tableList: Array.from(tableList),
                columnList: columnListTableAlias(columnList),
                ast: head
            };
        }, peg$c282 = function peg$c282(s) {
            return _objectSpread(_objectSpread({}, s[2]), {}, {
                parentheses_symbol: true
            });
        }, peg$c283 = function peg$c283(name, stmt) {
            if (typeof name === 'string')
                name = {
                    type: 'default',
                    value: name
                };
            return {
                name: name,
                stmt: stmt
            };
        }, peg$c284 = function peg$c284(cte, sv, d, c, f, fs, w, g, h, o, l, win) {
            if (Array.isArray(f))
                f.forEach(function(info) {
                    return info.table && tableList.add("select::".concat(info.db, "::").concat(info.table));
                });
            return {
                type: 'select',
                as_struct_val: sv,
                distinct: d,
                columns: c,
                from: f,
                for_sys_time_as_of: fs,
                where: w,
                "with": cte,
                groupby: g,
                having: h,
                orderby: o,
                limit: l,
                window: win
            };
        }, peg$c285 = "system_time", peg$c286 = peg$literalExpectation("SYSTEM_TIME", true), peg$c287 = "as", peg$c288 = peg$literalExpectation("AS", true), peg$c289 = "of", peg$c290 = peg$literalExpectation("OF", true), peg$c291 = function peg$c291(e) {
            return {
                keyword: 'for system_time as of',
                expr: e
            };
        }, peg$c292 = function peg$c292(a, k) {
            return "".concat(a[0].toLowerCase(), " ").concat(k.toLowerCase());
        }, peg$c293 = function peg$c293(e, alias) {
            return {
                expr: e,
                as: alias
            };
        }, peg$c294 = function peg$c294(k, c) {
            columnList.add('select::null::(.*)');
            return {
                expr_list: c,
                parentheses: true,
                star: '*',
                type: k.toLowerCase()
            };
        }, peg$c295 = function peg$c295(head, tail) {
            columnList.add('select::null::(.*)');
            if (tail && tail.length > 0) {
                head[0] = {
                    expr: {
                        type: 'column_ref',
                        table: null,
                        column: '*'
                    },
                    as: null
                };
                return createList(head[0], tail);
            }
            return head[0];
        }, peg$c296 = function peg$c296(c) {
            return c;
        }, peg$c297 = function peg$c297(n, t, l) {
            return {
                expr: n,
                offset: "[".concat(t, "(").concat(l.value, ")]")
            };
        }, peg$c298 = function peg$c298(tbl) {
            columnList.add('select::null::(.*)');
            return {
                expr: {
                    type: 'column_ref',
                    table: null,
                    column: '*'
                },
                as: null
            };
        }, peg$c299 = function peg$c299(tbl, pro) {
            columnList.add("select::".concat(tbl, "::(.*)"));
            var column = '*';
            var mid = pro && pro[0];
            if (typeof mid === 'string')
                column = "".concat(mid, ".*");
            if (mid && mid.expr && mid.offset)
                column = _objectSpread(_objectSpread({}, mid), {}, {
                    suffix: '.*'
                });
            return {
                expr: {
                    type: 'column_ref',
                    table: tbl,
                    column: column
                },
                as: null
            };
        }, peg$c300 = function peg$c300(c, as) {
            return {
                expr: {
                    type: 'column_ref',
                    table: null,
                    column: c
                },
                as: as
            };
        }, peg$c301 = function peg$c301(i) {
            return i;
        }, peg$c302 = "unnest", peg$c303 = peg$literalExpectation("UNNEST", true), peg$c304 = function peg$c304(a, alias, wf) {
            return {
                type: 'unnest',
                expr: a,
                parentheses: true,
                as: alias,
                with_offset: wf
            };
        }, peg$c305 = function peg$c305(l, op) {
            if (l[0])
                l[0].operator = op;
            return l;
        }, peg$c306 = function peg$c306(a, c, i, as) {
            i.operator = '=';
            return {
                'type': 'pivot',
                'expr': a,
                column: c,
                in_expr: i,
                as: as
            };
        }, peg$c307 = function peg$c307(alias) {
            return {
                keyword: 'with offset as',
                as: alias
            };
        }, peg$c308 = function peg$c308(head, tail) {
            return [head, tail];
        }, peg$c309 = function peg$c309(head, tail) {
            tail.unshift(head);
            tail.forEach(function(tableInfo) {
                var table = tableInfo.table
                  , as = tableInfo.as;
                tableAlias[table] = table;
                if (as)
                    tableAlias[as] = table;
                refreshColumnList(columnList);
            });
            return tail;
        }, peg$c310 = function peg$c310(t) {
            return t;
        }, peg$c311 = function peg$c311(op, t, head, tail) {
            t.join = op;
            t.using = createList(head, tail);
            return t;
        }, peg$c312 = function peg$c312(op, t, expr) {
            t.join = op;
            t.on = expr;
            return t;
        }, peg$c313 = function peg$c313(op, stmt, alias, expr) {
            stmt.parentheses = true;
            return {
                expr: stmt,
                as: alias,
                join: op,
                on: expr
            };
        }, peg$c314 = function peg$c314(t, alias) {
            if (t.type === 'var') {
                t.as = alias;
                return t;
            } else {
                return {
                    db: t.db,
                    table: t.table,
                    as: alias
                };
            }
        }, peg$c315 = function peg$c315(stmt, alias) {
            stmt.parentheses = true;
            return {
                expr: stmt,
                as: alias
            };
        }, peg$c316 = function peg$c316() {
            return 'LEFT JOIN';
        }, peg$c317 = function peg$c317() {
            return 'RIGHT JOIN';
        }, peg$c318 = function peg$c318() {
            return 'FULL JOIN';
        }, peg$c319 = function peg$c319(k) {
            return "".concat(k[0].toUpperCase(), " JOIN");
        }, peg$c320 = function peg$c320(k) {
            return k ? "".concat(k[0].toUpperCase(), " JOIN") : 'JOIN';
        }, peg$c321 = function peg$c321(project, dt, tail) {
            var obj = {
                db: null,
                table: project
            };
            if (tail !== null) {
                obj.db = "".concat(project, ".").concat(dt[3]);
                obj.table = tail[3];
            }
            return obj;
        }, peg$c322 = function peg$c322(dt, tail) {
            var obj = {
                db: null,
                table: dt
            };
            if (tail !== null) {
                obj.db = dt;
                obj.table = tail[3];
            }
            return obj;
        }, peg$c323 = function peg$c323(e) {
            return e;
        }, peg$c324 = function peg$c324(e) {
            return e.value;
        }, peg$c325 = function peg$c325(l) {
            return {
                keyword: 'window',
                type: 'window',
                expr: l
            };
        }, peg$c326 = function peg$c326(nw, anw) {
            return {
                name: nw,
                as_window_specification: anw
            };
        }, peg$c327 = function peg$c327(n) {
            return n;
        }, peg$c328 = function peg$c328(ws) {
            return {
                window_specification: ws,
                parentheses: true
            };
        }, peg$c329 = function peg$c329(n, bc, l, w) {
            return {
                name: n,
                partitionby: bc,
                orderby: l,
                window_frame_clause: w
            };
        }, peg$c330 = "range", peg$c331 = peg$literalExpectation("RANGE", true), peg$c332 = "unbounded", peg$c333 = peg$literalExpectation("UNBOUNDED", true), peg$c334 = "preceding", peg$c335 = peg$literalExpectation("PRECEDING", true), peg$c336 = "current", peg$c337 = peg$literalExpectation("CURRENT", true), peg$c338 = "ROW", peg$c339 = peg$literalExpectation("ROW", false), peg$c340 = function peg$c340() {
            return 'range between unbounded preceding and current row';
        }, peg$c341 = function peg$c341(kw, s) {
            return "rows ".concat(s.value);
        }, peg$c342 = function peg$c342(p, f) {
            return "rows between ".concat(p.value, " and ").concat(f.value);
        }, peg$c343 = "following", peg$c344 = peg$literalExpectation("FOLLOWING", true), peg$c345 = function peg$c345(s) {
            s.value += ' FOLLOWING';
            return s;
        }, peg$c346 = function peg$c346(s) {
            s.value += ' PRECEDING';
            return s;
        }, peg$c347 = "row", peg$c348 = peg$literalExpectation("ROW", true), peg$c349 = function peg$c349() {
            return {
                type: 'single_quote_string',
                value: 'current row'
            };
        }, peg$c350 = function peg$c350(s) {
            return {
                type: 'single_quote_string',
                value: s.toUpperCase()
            };
        }, peg$c351 = function peg$c351(bc) {
            return bc;
        }, peg$c352 = function peg$c352(e, d) {
            var obj = {
                expr: e,
                type: 'ASC'
            };
            if (d === 'DESC')
                obj.type = 'DESC';
            return obj;
        }, peg$c353 = function peg$c353(i1, tail) {
            var res = [i1];
            if (tail)
                res.push(tail[2]);
            return {
                seperator: tail && tail[0] && tail[0].toLowerCase() || '',
                value: res
            };
        }, peg$c354 = function peg$c354(head, tail) {
            var el = {
                type: 'expr_list'
            };
            el.value = createList(head, tail);
            return el;
        }, peg$c355 = function peg$c355(c) {
            return {
                array_path: c,
                type: 'array',
                keyword: '',
                parentheses: true
            };
        }, peg$c356 = function peg$c356(s, c) {
            return {
                definition: s,
                array_path: c.map(function(l) {
                    return {
                        expr: l,
                        as: null
                    };
                }),
                type: 'array',
                keyword: s && 'array',
                parentheses: true
            };
        }, peg$c357 = function peg$c357(s, c) {
            return {
                definition: s,
                expr_list: c,
                type: 'array',
                keyword: s && 'array',
                parentheses: true
            };
        }, peg$c358 = function peg$c358(s, c) {
            return {
                definition: s,
                expr_list: c,
                type: 'struct',
                keyword: s && 'struct',
                parentheses: true
            };
        }, peg$c359 = function peg$c359(head, tail) {
            return createBinaryExprChain(head, tail);
        }, peg$c360 = function peg$c360(op, tail) {
            return createUnaryExpr(op, tail[0][1]);
        }, peg$c361 = function peg$c361(head, tail) {
            var result = head;
            var seperator = '';
            for (var i = 0; i < tail.length; i++) {
                if (tail[i][1] === ',') {
                    seperator = ',';
                    if (!Array.isArray(result))
                        result = [result];
                    result.push(tail[i][3]);
                } else {
                    result = createBinaryExpr(tail[i][1], result, tail[i][3]);
                }
            }
            if (seperator === ',') {
                var el = {
                    type: 'expr_list'
                };
                el.value = result;
                return el;
            }
            return result;
        }, peg$c362 = "!", peg$c363 = peg$literalExpectation("!", false), peg$c364 = function peg$c364(expr) {
            return createUnaryExpr('NOT', expr);
        }, peg$c365 = function peg$c365(left, rh) {
            if (rh === null)
                return left;
            else if (rh.type === 'arithmetic')
                return createBinaryExprChain(left, rh.tail);
            else
                return createBinaryExpr(rh.op, left, rh.right);
        }, peg$c366 = function peg$c366(op, stmt) {
            stmt.parentheses = true;
            return createUnaryExpr(op, stmt);
        }, peg$c367 = function peg$c367(nk) {
            return nk[0] + ' ' + nk[2];
        }, peg$c368 = function peg$c368(l) {
            return {
                type: 'arithmetic',
                tail: l
            };
        }, peg$c369 = ">=", peg$c370 = peg$literalExpectation(">=", false), peg$c371 = ">", peg$c372 = peg$literalExpectation(">", false), peg$c373 = "<=", peg$c374 = peg$literalExpectation("<=", false), peg$c375 = "<>", peg$c376 = peg$literalExpectation("<>", false), peg$c377 = "<", peg$c378 = peg$literalExpectation("<", false), peg$c379 = "!=", peg$c380 = peg$literalExpectation("!=", false), peg$c381 = function peg$c381(right) {
            return {
                op: 'IS',
                right: right
            };
        }, peg$c382 = function peg$c382(right) {
            return {
                op: 'IS NOT',
                right: right
            };
        }, peg$c383 = function peg$c383(op, begin, end) {
            return {
                op: op,
                right: {
                    type: 'expr_list',
                    value: [begin, end]
                }
            };
        }, peg$c384 = function peg$c384(op, right) {
            return {
                op: op,
                right: right
            };
        }, peg$c385 = function peg$c385(op, l) {
            return {
                op: op,
                right: l
            };
        }, peg$c386 = function peg$c386(op, e) {
            return {
                op: op,
                right: e
            };
        }, peg$c387 = "+", peg$c388 = peg$literalExpectation("+", false), peg$c389 = "-", peg$c390 = peg$literalExpectation("-", false), peg$c391 = function peg$c391(head, tail) {
            return createBinaryExprChain(head, tail);
        }, peg$c392 = "*", peg$c393 = peg$literalExpectation("*", false), peg$c394 = "/", peg$c395 = peg$literalExpectation("/", false), peg$c396 = "%", peg$c397 = peg$literalExpectation("%", false), peg$c398 = function peg$c398(list) {
            list.parentheses = true;
            return list;
        }, peg$c399 = function peg$c399(e, u) {
            return {
                type: 'interval',
                expr: e,
                unit: u.toLowerCase()
            };
        }, peg$c400 = function peg$c400(condition_list, otherwise) {
            if (otherwise)
                condition_list.push(otherwise);
            return {
                type: 'case',
                expr: null,
                args: condition_list
            };
        }, peg$c401 = function peg$c401(expr, condition_list, otherwise) {
            if (otherwise)
                condition_list.push(otherwise);
            return {
                type: 'case',
                expr: expr,
                args: condition_list
            };
        }, peg$c402 = function peg$c402(condition, result) {
            return {
                type: 'when',
                cond: condition,
                result: result
            };
        }, peg$c403 = function peg$c403(result) {
            return {
                type: 'else',
                result: result
            };
        }, peg$c404 = function peg$c404(tbl, col) {
            columnList.add("select::".concat(tbl, "::").concat(col));
            return {
                type: 'column_ref',
                table: tbl,
                column: col
            };
        }, peg$c405 = function peg$c405(col) {
            columnList.add("select::null::".concat(col));
            return {
                type: 'column_ref',
                table: null,
                column: col
            };
        }, peg$c406 = function peg$c406(name) {
            return reservedMap[name.toUpperCase()] === true;
        }, peg$c407 = function peg$c407(name) {
            return name;
        }, peg$c408 = function peg$c408(name) {
            if (reservedMap[name.toUpperCase()] === true)
                throw new Error("Error: " + JSON.stringify(name) + " is a reserved word, can not as alias clause");
            return false;
        }, peg$c409 = "\"", peg$c410 = peg$literalExpectation("\"", false), peg$c411 = /^[^"]/, peg$c412 = peg$classExpectation(["\""], true, false), peg$c413 = function peg$c413(chars) {
            return chars.join('');
        }, peg$c414 = /^[^']/, peg$c415 = peg$classExpectation(["'"], true, false), peg$c416 = "`", peg$c417 = peg$literalExpectation("`", false), peg$c418 = /^[^`]/, peg$c419 = peg$classExpectation(["`"], true, false), peg$c420 = function peg$c420(chars) {
            return "`".concat(chars.join(''), "`");
        }, peg$c421 = function peg$c421(name) {
            return name;
        }, peg$c422 = function peg$c422(name) {
            return name;
        }, peg$c423 = function peg$c423(start, parts) {
            return start + parts.join('');
        }, peg$c424 = /^[A-Za-z_]/, peg$c425 = peg$classExpectation([["A", "Z"], ["a", "z"], "_"], false, false), peg$c426 = /^[A-Za-z0-9_\-]/, peg$c427 = peg$classExpectation([["A", "Z"], ["a", "z"], ["0", "9"], "_", "-"], false, false), peg$c428 = /^[A-Za-z0-9_:]/, peg$c429 = peg$classExpectation([["A", "Z"], ["a", "z"], ["0", "9"], "_", ":"], false, false), peg$c430 = ":", peg$c431 = peg$literalExpectation(":", false), peg$c432 = function peg$c432(l) {
            return {
                type: 'param',
                value: l[1]
            };
        }, peg$c433 = function peg$c433(head, as, tail) {
            var el = {
                type: 'expr_list'
            };
            el.value = createList(head, tail);
            return el;
        }, peg$c434 = function peg$c434(name, e, bc) {
            return {
                type: 'aggr_func',
                name: name,
                args: {
                    expr: e
                },
                over: bc
            };
        }, peg$c435 = function peg$c435(kw, l) {
            return {
                type: 'on update',
                keyword: kw,
                parentheses: true,
                expr: l
            };
        }, peg$c436 = function peg$c436(kw) {
            return {
                type: 'on update',
                keyword: kw
            };
        }, peg$c437 = function peg$c437(aws) {
            return {
                type: 'window',
                as_window_specification: aws
            };
        }, peg$c438 = function peg$c438(bc, l) {
            return {
                partitionby: bc,
                orderby: l
            };
        }, peg$c439 = function peg$c439(name, arg, bc) {
            return {
                type: 'aggr_func',
                name: name,
                args: arg,
                over: bc
            };
        }, peg$c440 = function peg$c440(e) {
            return {
                expr: e
            };
        }, peg$c441 = function peg$c441(d, c) {
            return {
                distinct: d,
                expr: c
            };
        }, peg$c442 = function peg$c442(d, c, or) {
            return {
                distinct: d,
                expr: c,
                orderby: or,
                parentheses: true
            };
        }, peg$c443 = function peg$c443() {
            return {
                type: 'star',
                value: '*'
            };
        }, peg$c444 = function peg$c444(name, l, bc) {
            if (l && l.type !== 'expr_list')
                l = {
                    type: 'expr_list',
                    value: [l]
                };
            return {
                type: 'function',
                name: name,
                args: l ? l : {
                    type: 'expr_list',
                    value: []
                },
                over: bc
            };
        }, peg$c445 = function peg$c445(name, l, bc) {
            return {
                type: 'function',
                name: name,
                args: l ? l : {
                    type: 'expr_list',
                    value: []
                },
                over: bc
            };
        }, peg$c446 = function peg$c446(f, up) {
            return {
                type: 'function',
                name: f,
                over: up
            };
        }, peg$c447 = function peg$c447(dt, tail) {
            var name = dt;
            if (tail !== null) {
                tail.forEach(function(t) {
                    return name = "".concat(name, ".").concat(t[3]);
                });
            }
            return name;
        }, peg$c448 = "century", peg$c449 = peg$literalExpectation("CENTURY", true), peg$c450 = "day", peg$c451 = peg$literalExpectation("DAY", true), peg$c452 = "decade", peg$c453 = peg$literalExpectation("DECADE", true), peg$c454 = "dow", peg$c455 = peg$literalExpectation("DOW", true), peg$c456 = "doy", peg$c457 = peg$literalExpectation("DOY", true), peg$c458 = "epoch", peg$c459 = peg$literalExpectation("EPOCH", true), peg$c460 = "hour", peg$c461 = peg$literalExpectation("HOUR", true), peg$c462 = "isodow", peg$c463 = peg$literalExpectation("ISODOW", true), peg$c464 = "isoyear", peg$c465 = peg$literalExpectation("ISOYEAR", true), peg$c466 = "microseconds", peg$c467 = peg$literalExpectation("MICROSECONDS", true), peg$c468 = "millennium", peg$c469 = peg$literalExpectation("MILLENNIUM", true), peg$c470 = "milliseconds", peg$c471 = peg$literalExpectation("MILLISECONDS", true), peg$c472 = "minute", peg$c473 = peg$literalExpectation("MINUTE", true), peg$c474 = "month", peg$c475 = peg$literalExpectation("MONTH", true), peg$c476 = "quarter", peg$c477 = peg$literalExpectation("QUARTER", true), peg$c478 = "second", peg$c479 = peg$literalExpectation("SECOND", true), peg$c480 = "timezone", peg$c481 = peg$literalExpectation("TIMEZONE", true), peg$c482 = "timezone_hour", peg$c483 = peg$literalExpectation("TIMEZONE_HOUR", true), peg$c484 = "timezone_minute", peg$c485 = peg$literalExpectation("TIMEZONE_MINUTE", true), peg$c486 = "week", peg$c487 = peg$literalExpectation("WEEK", true), peg$c488 = "year", peg$c489 = peg$literalExpectation("YEAR", true), peg$c490 = function peg$c490() {
            return f;
        }, peg$c491 = function peg$c491(kw, f, t, s) {
            return {
                type: kw.toLowerCase(),
                args: {
                    field: f,
                    cast_type: t,
                    source: s
                }
            };
        }, peg$c492 = function peg$c492(e, t) {
            return {
                type: 'cast',
                expr: e,
                symbol: 'as',
                target: t
            };
        }, peg$c493 = function peg$c493(e, precision) {
            return {
                type: 'cast',
                expr: e,
                symbol: 'as',
                target: {
                    dataType: 'DECIMAL(' + precision + ')'
                }
            };
        }, peg$c494 = function peg$c494(e, precision, scale) {
            return {
                type: 'cast',
                expr: e,
                symbol: 'as',
                target: {
                    dataType: 'DECIMAL(' + precision + ', ' + scale + ')'
                }
            };
        }, peg$c495 = function peg$c495(e, s, t) {
            /* MySQL cast to un-/signed integer */
            return {
                type: 'cast',
                expr: e,
                symbol: 'as',
                target: {
                    dataType: s + (t ? ' ' + t : '')
                }
            };
        }, peg$c496 = function peg$c496() {
            return {
                type: 'null',
                value: null
            };
        }, peg$c497 = function peg$c497() {
            return {
                type: 'not null',
                value: 'not null'
            };
        }, peg$c498 = function peg$c498() {
            return {
                type: 'bool',
                value: true
            };
        }, peg$c499 = function peg$c499() {
            return {
                type: 'bool',
                value: false
            };
        }, peg$c500 = "r", peg$c501 = peg$literalExpectation("R", true), peg$c502 = function peg$c502(r, ca) {
            return {
                type: r ? 'regex_string' : 'single_quote_string',
                value: ca[1].join('')
            };
        }, peg$c503 = function peg$c503(r, ca) {
            return {
                type: r ? 'regex_string' : 'string',
                value: ca[1].join('')
            };
        }, peg$c504 = function peg$c504(type, ca) {
            return {
                type: type.toLowerCase(),
                value: ca[1].join('')
            };
        }, peg$c505 = /^[^"\\\0-\x1F\x7F]/, peg$c506 = peg$classExpectation(["\"", "\\", ["\0", "\x1F"], "\x7F"], true, false), peg$c507 = /^[^'\\]/, peg$c508 = peg$classExpectation(["'", "\\"], true, false), peg$c509 = "\\'", peg$c510 = peg$literalExpectation("\\'", false), peg$c511 = function peg$c511() {
            return "\\'";
        }, peg$c512 = "\\\"", peg$c513 = peg$literalExpectation("\\\"", false), peg$c514 = function peg$c514() {
            return '\\"';
        }, peg$c515 = "\\\\", peg$c516 = peg$literalExpectation("\\\\", false), peg$c517 = function peg$c517() {
            return "\\\\";
        }, peg$c518 = "\\/", peg$c519 = peg$literalExpectation("\\/", false), peg$c520 = function peg$c520() {
            return "\\/";
        }, peg$c521 = "\\b", peg$c522 = peg$literalExpectation("\\b", false), peg$c523 = function peg$c523() {
            return "\b";
        }, peg$c524 = "\\f", peg$c525 = peg$literalExpectation("\\f", false), peg$c526 = function peg$c526() {
            return "\f";
        }, peg$c527 = "\\n", peg$c528 = peg$literalExpectation("\\n", false), peg$c529 = function peg$c529() {
            return "\n";
        }, peg$c530 = "\\r", peg$c531 = peg$literalExpectation("\\r", false), peg$c532 = function peg$c532() {
            return "\r";
        }, peg$c533 = "\\t", peg$c534 = peg$literalExpectation("\\t", false), peg$c535 = function peg$c535() {
            return "\t";
        }, peg$c536 = '\\u', peg$c537 = peg$literalExpectation('\\u', false), peg$c538 = function peg$c538(h1, h2, h3, h4) {
            return String.fromCharCode(parseInt('0x' + h1 + h2 + h3 + h4));
        }, peg$c539 = "\\", peg$c540 = peg$literalExpectation("\\", false), peg$c541 = function peg$c541() {
            return "\\";
        }, peg$c542 = /^[\n\r]/, peg$c543 = peg$classExpectation(["\n", "\r"], false, false), peg$c544 = function peg$c544(n) {
            if (n && n.type === 'bigint')
                return n;
            return {
                type: 'number',
                value: n
            };
        }, peg$c545 = function peg$c545(int_, frac, exp) {
            var numStr = int_ + frac + exp;
            return {
                type: 'bigint',
                value: numStr
            };
        }, peg$c546 = function peg$c546(int_, frac) {
            var numStr = int_ + frac;
            if (isBigInt(int_))
                return {
                    type: 'bigint',
                    value: numStr
                };
            return parseFloat(numStr);
        }, peg$c547 = function peg$c547(int_, exp) {
            var numStr = int_ + exp;
            return {
                type: 'bigint',
                value: numStr
            };
        }, peg$c548 = function peg$c548(int_) {
            if (isBigInt(int_))
                return {
                    type: 'bigint',
                    value: int_
                };
            return parseFloat(int_);
        }, peg$c549 = function peg$c549(op, digits) {
            return "-" + digits;
        }, peg$c550 = function peg$c550(op, digit) {
            return "-" + digit;
        }, peg$c551 = function peg$c551(digits) {
            return "." + digits;
        }, peg$c552 = function peg$c552(e, digits) {
            return e + digits;
        }, peg$c553 = function peg$c553(digits) {
            return digits.join("");
        }, peg$c554 = /^[0-9]/, peg$c555 = peg$classExpectation([["0", "9"]], false, false), peg$c556 = /^[0-9a-fA-F]/, peg$c557 = peg$classExpectation([["0", "9"], ["a", "f"], ["A", "F"]], false, false), peg$c558 = /^[eE]/, peg$c559 = peg$classExpectation(["e", "E"], false, false), peg$c560 = /^[+\-]/, peg$c561 = peg$classExpectation(["+", "-"], false, false), peg$c562 = function peg$c562(e, sign) {
            return e + (sign !== null ? sign : '');
        }, peg$c563 = "null", peg$c564 = peg$literalExpectation("NULL", true), peg$c565 = "not null", peg$c566 = peg$literalExpectation("NOT NULL", true), peg$c567 = "true", peg$c568 = peg$literalExpectation("TRUE", true), peg$c569 = "to", peg$c570 = peg$literalExpectation("TO", true), peg$c571 = "false", peg$c572 = peg$literalExpectation("FALSE", true), peg$c573 = "drop", peg$c574 = peg$literalExpectation("DROP", true), peg$c575 = function peg$c575() {
            return 'DROP';
        }, peg$c576 = "use", peg$c577 = peg$literalExpectation("USE", true), peg$c578 = "select", peg$c579 = peg$literalExpectation("SELECT", true), peg$c580 = "if not exists", peg$c581 = peg$literalExpectation("IF NOT EXISTS", true), peg$c582 = "RECURSIVE", peg$c583 = peg$literalExpectation("RECURSIVE", false), peg$c584 = "ignore", peg$c585 = peg$literalExpectation("IGNORE", true), peg$c586 = "explain", peg$c587 = peg$literalExpectation("EXPLAIN", true), peg$c588 = "partition", peg$c589 = peg$literalExpectation("PARTITION", true), peg$c590 = function peg$c590() {
            return 'PARTITION';
        }, peg$c591 = "into", peg$c592 = peg$literalExpectation("INTO", true), peg$c593 = "from", peg$c594 = peg$literalExpectation("FROM", true), peg$c595 = "unlock", peg$c596 = peg$literalExpectation("UNLOCK", true), peg$c597 = "table", peg$c598 = peg$literalExpectation("TABLE", true), peg$c599 = function peg$c599() {
            return 'TABLE';
        }, peg$c600 = "tables", peg$c601 = peg$literalExpectation("TABLES", true), peg$c602 = function peg$c602() {
            return 'TABLES';
        }, peg$c603 = function peg$c603() {
            return 'COLLATE';
        }, peg$c604 = "left", peg$c605 = peg$literalExpectation("LEFT", true), peg$c606 = "right", peg$c607 = peg$literalExpectation("RIGHT", true), peg$c608 = "full", peg$c609 = peg$literalExpectation("FULL", true), peg$c610 = "inner", peg$c611 = peg$literalExpectation("INNER", true), peg$c612 = "cross", peg$c613 = peg$literalExpectation("CROSS", true), peg$c614 = "join", peg$c615 = peg$literalExpectation("JOIN", true), peg$c616 = "outer", peg$c617 = peg$literalExpectation("OUTER", true), peg$c618 = "over", peg$c619 = peg$literalExpectation("OVER", true), peg$c620 = "union", peg$c621 = peg$literalExpectation("UNION", true), peg$c622 = "value", peg$c623 = peg$literalExpectation("VALUE", true), peg$c624 = function peg$c624() {
            return 'VALUE';
        }, peg$c625 = "values", peg$c626 = peg$literalExpectation("VALUES", true), peg$c627 = "using", peg$c628 = peg$literalExpectation("USING", true), peg$c629 = "where", peg$c630 = peg$literalExpectation("WHERE", true), peg$c631 = "group", peg$c632 = peg$literalExpectation("GROUP", true), peg$c633 = "by", peg$c634 = peg$literalExpectation("BY", true), peg$c635 = "order", peg$c636 = peg$literalExpectation("ORDER", true), peg$c637 = "having", peg$c638 = peg$literalExpectation("HAVING", true), peg$c639 = "window", peg$c640 = peg$literalExpectation("WINDOW", true), peg$c641 = "ordinal", peg$c642 = peg$literalExpectation("ORDINAL", true), peg$c643 = function peg$c643() {
            return 'ORDINAL';
        }, peg$c644 = "limit", peg$c645 = peg$literalExpectation("LIMIT", true), peg$c646 = "offset", peg$c647 = peg$literalExpectation("OFFSET", true), peg$c648 = function peg$c648() {
            return 'OFFSET';
        }, peg$c649 = "asc", peg$c650 = peg$literalExpectation("ASC", true), peg$c651 = function peg$c651() {
            return 'ASC';
        }, peg$c652 = "desc", peg$c653 = peg$literalExpectation("DESC", true), peg$c654 = function peg$c654() {
            return 'DESC';
        }, peg$c655 = "all", peg$c656 = peg$literalExpectation("ALL", true), peg$c657 = function peg$c657() {
            return 'ALL';
        }, peg$c658 = "distinct", peg$c659 = peg$literalExpectation("DISTINCT", true), peg$c660 = function peg$c660() {
            return 'DISTINCT';
        }, peg$c661 = "between", peg$c662 = peg$literalExpectation("BETWEEN", true), peg$c663 = function peg$c663() {
            return 'BETWEEN';
        }, peg$c664 = "in", peg$c665 = peg$literalExpectation("IN", true), peg$c666 = function peg$c666() {
            return 'IN';
        }, peg$c667 = "is", peg$c668 = peg$literalExpectation("IS", true), peg$c669 = function peg$c669() {
            return 'IS';
        }, peg$c670 = "like", peg$c671 = peg$literalExpectation("LIKE", true), peg$c672 = function peg$c672() {
            return 'LIKE';
        }, peg$c673 = "exists", peg$c674 = peg$literalExpectation("EXISTS", true), peg$c675 = function peg$c675() {
            return 'EXISTS';
        }, peg$c676 = function peg$c676() {
            return 'NOT';
        }, peg$c677 = "and", peg$c678 = peg$literalExpectation("AND", true), peg$c679 = function peg$c679() {
            return 'AND';
        }, peg$c680 = "or", peg$c681 = peg$literalExpectation("OR", true), peg$c682 = function peg$c682() {
            return 'OR';
        }, peg$c683 = "count", peg$c684 = peg$literalExpectation("COUNT", true), peg$c685 = function peg$c685() {
            return 'COUNT';
        }, peg$c686 = "max", peg$c687 = peg$literalExpectation("MAX", true), peg$c688 = function peg$c688() {
            return 'MAX';
        }, peg$c689 = "min", peg$c690 = peg$literalExpectation("MIN", true), peg$c691 = function peg$c691() {
            return 'MIN';
        }, peg$c692 = "sum", peg$c693 = peg$literalExpectation("SUM", true), peg$c694 = function peg$c694() {
            return 'SUM';
        }, peg$c695 = "avg", peg$c696 = peg$literalExpectation("AVG", true), peg$c697 = function peg$c697() {
            return 'AVG';
        }, peg$c698 = "extract", peg$c699 = peg$literalExpectation("EXTRACT", true), peg$c700 = function peg$c700() {
            return 'EXTRACT';
        }, peg$c701 = "call", peg$c702 = peg$literalExpectation("CALL", true), peg$c703 = function peg$c703() {
            return 'CALL';
        }, peg$c704 = "case", peg$c705 = peg$literalExpectation("CASE", true), peg$c706 = "when", peg$c707 = peg$literalExpectation("WHEN", true), peg$c708 = "then", peg$c709 = peg$literalExpectation("THEN", true), peg$c710 = "else", peg$c711 = peg$literalExpectation("ELSE", true), peg$c712 = "end", peg$c713 = peg$literalExpectation("END", true), peg$c714 = "cast", peg$c715 = peg$literalExpectation("CAST", true), peg$c716 = "array", peg$c717 = peg$literalExpectation("ARRAY", true), peg$c718 = function peg$c718() {
            return 'ARRAY';
        }, peg$c719 = "bytes", peg$c720 = peg$literalExpectation("BYTES", true), peg$c721 = function peg$c721() {
            return 'BYTES';
        }, peg$c722 = "bool", peg$c723 = peg$literalExpectation("BOOL", true), peg$c724 = function peg$c724() {
            return 'BOOL';
        }, peg$c725 = "char", peg$c726 = peg$literalExpectation("CHAR", true), peg$c727 = function peg$c727() {
            return 'CHAR';
        }, peg$c728 = "geography", peg$c729 = peg$literalExpectation("GEOGRAPHY", true), peg$c730 = function peg$c730() {
            return 'GEOGRAPHY';
        }, peg$c731 = "varchar", peg$c732 = peg$literalExpectation("VARCHAR", true), peg$c733 = function peg$c733() {
            return 'VARCHAR';
        }, peg$c734 = "numeric", peg$c735 = peg$literalExpectation("NUMERIC", true), peg$c736 = function peg$c736() {
            return 'NUMERIC';
        }, peg$c737 = "decimal", peg$c738 = peg$literalExpectation("DECIMAL", true), peg$c739 = function peg$c739() {
            return 'DECIMAL';
        }, peg$c740 = "signed", peg$c741 = peg$literalExpectation("SIGNED", true), peg$c742 = function peg$c742() {
            return 'SIGNED';
        }, peg$c743 = "unsigned", peg$c744 = peg$literalExpectation("UNSIGNED", true), peg$c745 = function peg$c745() {
            return 'UNSIGNED';
        }, peg$c746 = "int64", peg$c747 = peg$literalExpectation("INT64", true), peg$c748 = function peg$c748() {
            return 'INT64';
        }, peg$c749 = "zerofill", peg$c750 = peg$literalExpectation("ZEROFILL", true), peg$c751 = function peg$c751() {
            return 'ZEROFILL';
        }, peg$c752 = "integer", peg$c753 = peg$literalExpectation("INTEGER", true), peg$c754 = function peg$c754() {
            return 'INTEGER';
        }, peg$c755 = "json", peg$c756 = peg$literalExpectation("JSON", true), peg$c757 = function peg$c757() {
            return 'JSON';
        }, peg$c758 = "smallint", peg$c759 = peg$literalExpectation("SMALLINT", true), peg$c760 = function peg$c760() {
            return 'SMALLINT';
        }, peg$c761 = "string", peg$c762 = peg$literalExpectation("STRING", true), peg$c763 = function peg$c763() {
            return 'STRING';
        }, peg$c764 = "struct", peg$c765 = peg$literalExpectation("STRUCT", true), peg$c766 = function peg$c766() {
            return 'STRUCT';
        }, peg$c767 = "tinyint", peg$c768 = peg$literalExpectation("TINYINT", true), peg$c769 = function peg$c769() {
            return 'TINYINT';
        }, peg$c770 = "tinytext", peg$c771 = peg$literalExpectation("TINYTEXT", true), peg$c772 = function peg$c772() {
            return 'TINYTEXT';
        }, peg$c773 = "text", peg$c774 = peg$literalExpectation("TEXT", true), peg$c775 = function peg$c775() {
            return 'TEXT';
        }, peg$c776 = "mediumtext", peg$c777 = peg$literalExpectation("MEDIUMTEXT", true), peg$c778 = function peg$c778() {
            return 'MEDIUMTEXT';
        }, peg$c779 = "longtext", peg$c780 = peg$literalExpectation("LONGTEXT", true), peg$c781 = function peg$c781() {
            return 'LONGTEXT';
        }, peg$c782 = "bigint", peg$c783 = peg$literalExpectation("BIGINT", true), peg$c784 = function peg$c784() {
            return 'BIGINT';
        }, peg$c785 = "float64", peg$c786 = peg$literalExpectation("FLOAT64", true), peg$c787 = function peg$c787() {
            return 'FLOAT64';
        }, peg$c788 = "double", peg$c789 = peg$literalExpectation("DOUBLE", true), peg$c790 = function peg$c790() {
            return 'DOUBLE';
        }, peg$c791 = "date", peg$c792 = peg$literalExpectation("DATE", true), peg$c793 = function peg$c793() {
            return 'DATE';
        }, peg$c794 = "datetime", peg$c795 = peg$literalExpectation("DATETIME", true), peg$c796 = function peg$c796() {
            return 'DATETIME';
        }, peg$c797 = "rows", peg$c798 = peg$literalExpectation("ROWS", true), peg$c799 = function peg$c799() {
            return 'ROWS';
        }, peg$c800 = "time", peg$c801 = peg$literalExpectation("TIME", true), peg$c802 = function peg$c802() {
            return 'TIME';
        }, peg$c803 = "timestamp", peg$c804 = peg$literalExpectation("TIMESTAMP", true), peg$c805 = function peg$c805() {
            return 'TIMESTAMP';
        }, peg$c806 = "truncate", peg$c807 = peg$literalExpectation("TRUNCATE", true), peg$c808 = function peg$c808() {
            return 'TRUNCATE';
        }, peg$c809 = "user", peg$c810 = peg$literalExpectation("USER", true), peg$c811 = function peg$c811() {
            return 'USER';
        }, peg$c812 = "current_date", peg$c813 = peg$literalExpectation("CURRENT_DATE", true), peg$c814 = function peg$c814() {
            return 'CURRENT_DATE';
        }, peg$c815 = "adddate", peg$c816 = peg$literalExpectation("ADDDATE", true), peg$c817 = function peg$c817() {
            return 'ADDDATE';
        }, peg$c818 = "interval", peg$c819 = peg$literalExpectation("INTERVAL", true), peg$c820 = function peg$c820() {
            return 'INTERVAL';
        }, peg$c821 = function peg$c821() {
            return 'YEAR';
        }, peg$c822 = function peg$c822() {
            return 'MONTH';
        }, peg$c823 = function peg$c823() {
            return 'DAY';
        }, peg$c824 = function peg$c824() {
            return 'HOUR';
        }, peg$c825 = function peg$c825() {
            return 'MINUTE';
        }, peg$c826 = function peg$c826() {
            return 'SECOND';
        }, peg$c827 = "current_time", peg$c828 = peg$literalExpectation("CURRENT_TIME", true), peg$c829 = function peg$c829() {
            return 'CURRENT_TIME';
        }, peg$c830 = "current_timestamp", peg$c831 = peg$literalExpectation("CURRENT_TIMESTAMP", true), peg$c832 = function peg$c832() {
            return 'CURRENT_TIMESTAMP';
        }, peg$c833 = "session_user", peg$c834 = peg$literalExpectation("SESSION_USER", true), peg$c835 = function peg$c835() {
            return 'SESSION_USER';
        }, peg$c836 = "global", peg$c837 = peg$literalExpectation("GLOBAL", true), peg$c838 = function peg$c838() {
            return 'GLOBAL';
        }, peg$c839 = "session", peg$c840 = peg$literalExpectation("SESSION", true), peg$c841 = function peg$c841() {
            return 'SESSION';
        }, peg$c842 = function peg$c842() {
            return 'LOCAL';
        }, peg$c843 = "pivot", peg$c844 = peg$literalExpectation("PIVOT", true), peg$c845 = function peg$c845() {
            return 'PIVOT';
        }, peg$c846 = "persist", peg$c847 = peg$literalExpectation("PERSIST", true), peg$c848 = function peg$c848() {
            return 'PERSIST';
        }, peg$c849 = "persist_only", peg$c850 = peg$literalExpectation("PERSIST_ONLY", true), peg$c851 = function peg$c851() {
            return 'PERSIST_ONLY';
        }, peg$c852 = "add", peg$c853 = peg$literalExpectation("ADD", true), peg$c854 = function peg$c854() {
            return 'ADD';
        }, peg$c855 = "column", peg$c856 = peg$literalExpectation("COLUMN", true), peg$c857 = function peg$c857() {
            return 'COLUMN';
        }, peg$c858 = "index", peg$c859 = peg$literalExpectation("INDEX", true), peg$c860 = function peg$c860() {
            return 'INDEX';
        }, peg$c861 = function peg$c861() {
            return 'KEY';
        }, peg$c862 = "fulltext", peg$c863 = peg$literalExpectation("FULLTEXT", true), peg$c864 = function peg$c864() {
            return 'FULLTEXT';
        }, peg$c865 = function peg$c865() {
            return 'UNIQUE';
        }, peg$c866 = "comment", peg$c867 = peg$literalExpectation("COMMENT", true), peg$c868 = function peg$c868() {
            return 'COMMENT';
        }, peg$c869 = "constraint", peg$c870 = peg$literalExpectation("CONSTRAINT", true), peg$c871 = function peg$c871() {
            return 'CONSTRAINT';
        }, peg$c872 = "references", peg$c873 = peg$literalExpectation("REFERENCES", true), peg$c874 = function peg$c874() {
            return 'REFERENCES';
        }, peg$c875 = ",", peg$c876 = peg$literalExpectation(",", false), peg$c877 = "[", peg$c878 = peg$literalExpectation("[", false), peg$c879 = "]", peg$c880 = peg$literalExpectation("]", false), peg$c881 = ";", peg$c882 = peg$literalExpectation(";", false), peg$c883 = "||", peg$c884 = peg$literalExpectation("||", false), peg$c885 = "&&", peg$c886 = peg$literalExpectation("&&", false), peg$c887 = "/*", peg$c888 = peg$literalExpectation("/*", false), peg$c889 = "*/", peg$c890 = peg$literalExpectation("*/", false), peg$c891 = "--", peg$c892 = peg$literalExpectation("--", false), peg$c893 = "#", peg$c894 = peg$literalExpectation("#", false), peg$c895 = peg$anyExpectation(), peg$c896 = /^[ \t\n\r]/, peg$c897 = peg$classExpectation([" ", "\t", "\n", "\r"], false, false), peg$c898 = function peg$c898(n) {
            return DATA_TYPES[n.toUpperCase()] === true;
        }, peg$c899 = function peg$c899(n) {
            return n;
        }, peg$c900 = function peg$c900(n, t) {
            return {
                field_name: n,
                field_type: t
            };
        }, peg$c901 = function peg$c901(t, l) {
            return {
                dataType: t
            };
        }, peg$c902 = function peg$c902(t) {
            return {
                dataType: t
            };
        }, peg$c903 = function peg$c903(t, l) {
            return {
                dataType: t,
                length: parseInt(l.join(''), 10),
                parentheses: true
            };
        }, peg$c904 = "MAX", peg$c905 = peg$literalExpectation("MAX", false), peg$c906 = peg$literalExpectation("max", false), peg$c907 = function peg$c907(t, a) {
            return {
                dataType: t,
                definition: a,
                anglebracket: true
            };
        }, peg$currPos = 0, peg$savedPos = 0, peg$posDetailsCache = [{
            line: 1,
            column: 1
        }], peg$maxFailPos = 0, peg$maxFailExpected = [], peg$silentFails = 0, peg$result;
        if ("startRule"in options) {
            if (!(options.startRule in peg$startRuleFunctions)) {
                throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
            }
            peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
        }
        function text() {
            return input.substring(peg$savedPos, peg$currPos);
        }
        function location() {
            return peg$computeLocation(peg$savedPos, peg$currPos);
        }
        function expected(description, location) {
            location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos);
            throw peg$buildStructuredError([peg$otherExpectation(description)], input.substring(peg$savedPos, peg$currPos), location);
        }
        function error(message, location) {
            location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos);
            throw peg$buildSimpleError(message, location);
        }
        function peg$literalExpectation(text, ignoreCase) {
            return {
                type: "literal",
                text: text,
                ignoreCase: ignoreCase
            };
        }
        function peg$classExpectation(parts, inverted, ignoreCase) {
            return {
                type: "class",
                parts: parts,
                inverted: inverted,
                ignoreCase: ignoreCase
            };
        }
        function peg$anyExpectation() {
            return {
                type: "any"
            };
        }
        function peg$endExpectation() {
            return {
                type: "end"
            };
        }
        function peg$otherExpectation(description) {
            return {
                type: "other",
                description: description
            };
        }
        function peg$computePosDetails(pos) {
            var details = peg$posDetailsCache[pos], p;
            if (details) {
                return details;
            } else {
                p = pos - 1;
                while (!peg$posDetailsCache[p]) {
                    p--;
                }
                details = peg$posDetailsCache[p];
                details = {
                    line: details.line,
                    column: details.column
                };
                while (p < pos) {
                    if (input.charCodeAt(p) === 10) {
                        details.line++;
                        details.column = 1;
                    } else {
                        details.column++;
                    }
                    p++;
                }
                peg$posDetailsCache[pos] = details;
                return details;
            }
        }
        function peg$computeLocation(startPos, endPos) {
            var startPosDetails = peg$computePosDetails(startPos)
              , endPosDetails = peg$computePosDetails(endPos);
            return {
                start: {
                    offset: startPos,
                    line: startPosDetails.line,
                    column: startPosDetails.column
                },
                end: {
                    offset: endPos,
                    line: endPosDetails.line,
                    column: endPosDetails.column
                }
            };
        }
        function peg$fail(expected) {
            if (peg$currPos < peg$maxFailPos) {
                return;
            }
            if (peg$currPos > peg$maxFailPos) {
                peg$maxFailPos = peg$currPos;
                peg$maxFailExpected = [];
            }
            peg$maxFailExpected.push(expected);
        }
        function peg$buildSimpleError(message, location) {
            return new peg$SyntaxError(message,null,null,location);
        }
        function peg$buildStructuredError(expected, found, location) {
            return new peg$SyntaxError(peg$SyntaxError.buildMessage(expected, found),expected,found,location);
        }
        function peg$parsestart() {
            var s0, s1, s2;
            s0 = peg$currPos;
            s1 = peg$parse__();
            if (s1 !== peg$FAILED) {
                s2 = peg$parsemultiple_stmt();
                if (s2 === peg$FAILED) {
                    s2 = peg$parsequery_statement();
                    if (s2 === peg$FAILED) {
                        s2 = peg$parsecrud_stmt();
                    }
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c0(s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsemultiple_stmt() {
            var s0, s1, s2, s3, s4, s5, s6, s7;
            s0 = peg$currPos;
            s1 = peg$parsequery_statement();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                s4 = peg$parse__();
                if (s4 !== peg$FAILED) {
                    s5 = peg$parseSEMICOLON();
                    if (s5 !== peg$FAILED) {
                        s6 = peg$parse__();
                        if (s6 !== peg$FAILED) {
                            s7 = peg$parsequery_statement();
                            if (s7 !== peg$FAILED) {
                                s4 = [s4, s5, s6, s7];
                                s3 = s4;
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                if (s3 !== peg$FAILED) {
                    while (s3 !== peg$FAILED) {
                        s2.push(s3);
                        s3 = peg$currPos;
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parseSEMICOLON();
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parse__();
                                if (s6 !== peg$FAILED) {
                                    s7 = peg$parsequery_statement();
                                    if (s7 !== peg$FAILED) {
                                        s4 = [s4, s5, s6, s7];
                                        s3 = s4;
                                    } else {
                                        peg$currPos = s3;
                                        s3 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    }
                } else {
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c1(s1, s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsecrud_stmt() {
            var s0;
            s0 = peg$parseunion_stmt();
            if (s0 === peg$FAILED) {
                s0 = peg$parseupdate_stmt();
                if (s0 === peg$FAILED) {
                    s0 = peg$parsereplace_insert_stmt();
                    if (s0 === peg$FAILED) {
                        s0 = peg$parseinsert_no_columns_stmt();
                        if (s0 === peg$FAILED) {
                            s0 = peg$parseinsert_into_set();
                            if (s0 === peg$FAILED) {
                                s0 = peg$parsedelete_stmt();
                                if (s0 === peg$FAILED) {
                                    s0 = peg$parsecmd_stmt();
                                    if (s0 === peg$FAILED) {
                                        s0 = peg$parseproc_stmts();
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return s0;
        }
        function peg$parseupdate_stmt() {
            var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13;
            s0 = peg$currPos;
            s1 = peg$parseKW_UPDATE();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parsetable_ref_list();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parseKW_SET();
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parse__();
                                if (s6 !== peg$FAILED) {
                                    s7 = peg$parseset_list();
                                    if (s7 !== peg$FAILED) {
                                        s8 = peg$parse__();
                                        if (s8 !== peg$FAILED) {
                                            s9 = peg$parsewhere_clause();
                                            if (s9 === peg$FAILED) {
                                                s9 = null;
                                            }
                                            if (s9 !== peg$FAILED) {
                                                s10 = peg$parse__();
                                                if (s10 !== peg$FAILED) {
                                                    s11 = peg$parseorder_by_clause();
                                                    if (s11 === peg$FAILED) {
                                                        s11 = null;
                                                    }
                                                    if (s11 !== peg$FAILED) {
                                                        s12 = peg$parse__();
                                                        if (s12 !== peg$FAILED) {
                                                            s13 = peg$parselimit_clause();
                                                            if (s13 === peg$FAILED) {
                                                                s13 = null;
                                                            }
                                                            if (s13 !== peg$FAILED) {
                                                                peg$savedPos = s0;
                                                                s1 = peg$c2(s3, s7, s9, s11, s13);
                                                                s0 = s1;
                                                            } else {
                                                                peg$currPos = s0;
                                                                s0 = peg$FAILED;
                                                            }
                                                        } else {
                                                            peg$currPos = s0;
                                                            s0 = peg$FAILED;
                                                        }
                                                    } else {
                                                        peg$currPos = s0;
                                                        s0 = peg$FAILED;
                                                    }
                                                } else {
                                                    peg$currPos = s0;
                                                    s0 = peg$FAILED;
                                                }
                                            } else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                            }
                                        } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsedelete_stmt() {
            var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11;
            s0 = peg$currPos;
            s1 = peg$parseKW_DELETE();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parsetable_ref_list();
                    if (s3 === peg$FAILED) {
                        s3 = null;
                    }
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parsefrom_clause();
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parse__();
                                if (s6 !== peg$FAILED) {
                                    s7 = peg$parsewhere_clause();
                                    if (s7 === peg$FAILED) {
                                        s7 = null;
                                    }
                                    if (s7 !== peg$FAILED) {
                                        s8 = peg$parse__();
                                        if (s8 !== peg$FAILED) {
                                            s9 = peg$parseorder_by_clause();
                                            if (s9 === peg$FAILED) {
                                                s9 = null;
                                            }
                                            if (s9 !== peg$FAILED) {
                                                s10 = peg$parse__();
                                                if (s10 !== peg$FAILED) {
                                                    s11 = peg$parselimit_clause();
                                                    if (s11 === peg$FAILED) {
                                                        s11 = null;
                                                    }
                                                    if (s11 !== peg$FAILED) {
                                                        peg$savedPos = s0;
                                                        s1 = peg$c3(s3, s5, s7, s9, s11);
                                                        s0 = s1;
                                                    } else {
                                                        peg$currPos = s0;
                                                        s0 = peg$FAILED;
                                                    }
                                                } else {
                                                    peg$currPos = s0;
                                                    s0 = peg$FAILED;
                                                }
                                            } else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                            }
                                        } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsereplace_insert_stmt() {
            var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17;
            s0 = peg$currPos;
            s1 = peg$parsereplace_insert();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseKW_INTO();
                    if (s3 === peg$FAILED) {
                        s3 = null;
                    }
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parsetable_name();
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parse__();
                                if (s6 !== peg$FAILED) {
                                    s7 = peg$parseinsert_partition();
                                    if (s7 === peg$FAILED) {
                                        s7 = null;
                                    }
                                    if (s7 !== peg$FAILED) {
                                        s8 = peg$parse__();
                                        if (s8 !== peg$FAILED) {
                                            s9 = peg$parseLPAREN();
                                            if (s9 !== peg$FAILED) {
                                                s10 = peg$parse__();
                                                if (s10 !== peg$FAILED) {
                                                    s11 = peg$parsecolumn_list();
                                                    if (s11 !== peg$FAILED) {
                                                        s12 = peg$parse__();
                                                        if (s12 !== peg$FAILED) {
                                                            s13 = peg$parseRPAREN();
                                                            if (s13 !== peg$FAILED) {
                                                                s14 = peg$parse__();
                                                                if (s14 !== peg$FAILED) {
                                                                    s15 = peg$parseinsert_value_clause();
                                                                    if (s15 !== peg$FAILED) {
                                                                        s16 = peg$parse__();
                                                                        if (s16 !== peg$FAILED) {
                                                                            s17 = peg$parseon_duplicate_update_stmt();
                                                                            if (s17 === peg$FAILED) {
                                                                                s17 = null;
                                                                            }
                                                                            if (s17 !== peg$FAILED) {
                                                                                peg$savedPos = s0;
                                                                                s1 = peg$c4(s1, s5, s7, s11, s15, s17);
                                                                                s0 = s1;
                                                                            } else {
                                                                                peg$currPos = s0;
                                                                                s0 = peg$FAILED;
                                                                            }
                                                                        } else {
                                                                            peg$currPos = s0;
                                                                            s0 = peg$FAILED;
                                                                        }
                                                                    } else {
                                                                        peg$currPos = s0;
                                                                        s0 = peg$FAILED;
                                                                    }
                                                                } else {
                                                                    peg$currPos = s0;
                                                                    s0 = peg$FAILED;
                                                                }
                                                            } else {
                                                                peg$currPos = s0;
                                                                s0 = peg$FAILED;
                                                            }
                                                        } else {
                                                            peg$currPos = s0;
                                                            s0 = peg$FAILED;
                                                        }
                                                    } else {
                                                        peg$currPos = s0;
                                                        s0 = peg$FAILED;
                                                    }
                                                } else {
                                                    peg$currPos = s0;
                                                    s0 = peg$FAILED;
                                                }
                                            } else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                            }
                                        } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseinsert_no_columns_stmt() {
            var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11;
            s0 = peg$currPos;
            s1 = peg$parsereplace_insert();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseKW_INTO();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parsetable_name();
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parse__();
                                if (s6 !== peg$FAILED) {
                                    s7 = peg$parseinsert_partition();
                                    if (s7 === peg$FAILED) {
                                        s7 = null;
                                    }
                                    if (s7 !== peg$FAILED) {
                                        s8 = peg$parse__();
                                        if (s8 !== peg$FAILED) {
                                            s9 = peg$parseinsert_value_clause();
                                            if (s9 !== peg$FAILED) {
                                                s10 = peg$parse__();
                                                if (s10 !== peg$FAILED) {
                                                    s11 = peg$parseon_duplicate_update_stmt();
                                                    if (s11 === peg$FAILED) {
                                                        s11 = null;
                                                    }
                                                    if (s11 !== peg$FAILED) {
                                                        peg$savedPos = s0;
                                                        s1 = peg$c5(s1, s5, s7, s9, s11);
                                                        s0 = s1;
                                                    } else {
                                                        peg$currPos = s0;
                                                        s0 = peg$FAILED;
                                                    }
                                                } else {
                                                    peg$currPos = s0;
                                                    s0 = peg$FAILED;
                                                }
                                            } else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                            }
                                        } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseinsert_into_set() {
            var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13;
            s0 = peg$currPos;
            s1 = peg$parsereplace_insert();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseKW_INTO();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parsetable_name();
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parse__();
                                if (s6 !== peg$FAILED) {
                                    s7 = peg$parseinsert_partition();
                                    if (s7 === peg$FAILED) {
                                        s7 = null;
                                    }
                                    if (s7 !== peg$FAILED) {
                                        s8 = peg$parse__();
                                        if (s8 !== peg$FAILED) {
                                            s9 = peg$parseKW_SET();
                                            if (s9 !== peg$FAILED) {
                                                s10 = peg$parse__();
                                                if (s10 !== peg$FAILED) {
                                                    s11 = peg$parseset_list();
                                                    if (s11 !== peg$FAILED) {
                                                        s12 = peg$parse__();
                                                        if (s12 !== peg$FAILED) {
                                                            s13 = peg$parseon_duplicate_update_stmt();
                                                            if (s13 === peg$FAILED) {
                                                                s13 = null;
                                                            }
                                                            if (s13 !== peg$FAILED) {
                                                                peg$savedPos = s0;
                                                                s1 = peg$c6(s1, s5, s7, s11, s13);
                                                                s0 = s1;
                                                            } else {
                                                                peg$currPos = s0;
                                                                s0 = peg$FAILED;
                                                            }
                                                        } else {
                                                            peg$currPos = s0;
                                                            s0 = peg$FAILED;
                                                        }
                                                    } else {
                                                        peg$currPos = s0;
                                                        s0 = peg$FAILED;
                                                    }
                                                } else {
                                                    peg$currPos = s0;
                                                    s0 = peg$FAILED;
                                                }
                                            } else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                            }
                                        } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsecmd_stmt() {
            var s0;
            s0 = peg$parseanalyze_stmt();
            if (s0 === peg$FAILED) {
                s0 = peg$parseattach_stmt();
                if (s0 === peg$FAILED) {
                    s0 = peg$parsedrop_stmt();
                    if (s0 === peg$FAILED) {
                        s0 = peg$parsecreate_stmt();
                        if (s0 === peg$FAILED) {
                            s0 = peg$parsetruncate_stmt();
                            if (s0 === peg$FAILED) {
                                s0 = peg$parserename_stmt();
                                if (s0 === peg$FAILED) {
                                    s0 = peg$parsecall_stmt();
                                    if (s0 === peg$FAILED) {
                                        s0 = peg$parseuse_stmt();
                                        if (s0 === peg$FAILED) {
                                            s0 = peg$parsealter_table_stmt();
                                            if (s0 === peg$FAILED) {
                                                s0 = peg$parseset_stmt();
                                                if (s0 === peg$FAILED) {
                                                    s0 = peg$parselock_stmt();
                                                    if (s0 === peg$FAILED) {
                                                        s0 = peg$parseunlock_stmt();
                                                        if (s0 === peg$FAILED) {
                                                            s0 = peg$parseshow_stmt();
                                                            if (s0 === peg$FAILED) {
                                                                s0 = peg$parsedesc_stmt();
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return s0;
        }
        function peg$parseproc_stmts() {
            var s0, s1;
            s0 = [];
            s1 = peg$parseproc_stmt();
            while (s1 !== peg$FAILED) {
                s0.push(s1);
                s1 = peg$parseproc_stmt();
            }
            return s0;
        }
        function peg$parseproc_stmt() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            peg$savedPos = peg$currPos;
            s1 = peg$c7();
            if (s1) {
                s1 = void 0;
            } else {
                s1 = peg$FAILED;
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseassign_stmt();
                    if (s3 === peg$FAILED) {
                        s3 = peg$parsereturn_stmt();
                    }
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c8(s3);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseassign_stmt() {
            var s0, s1, s2, s3, s4, s5;
            s0 = peg$currPos;
            s1 = peg$parsevar_decl();
            if (s1 === peg$FAILED) {
                s1 = peg$parsewithout_prefix_var_decl();
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseKW_ASSIGN();
                    if (s3 === peg$FAILED) {
                        s3 = peg$parseKW_ASSIGIN_EQUAL();
                    }
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parseproc_expr();
                            if (s5 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c9(s1, s3, s5);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsereturn_stmt() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            s1 = peg$parseKW_RETURN();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseproc_expr();
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c10(s3);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseproc_expr() {
            var s0;
            s0 = peg$parseselect_stmt();
            if (s0 === peg$FAILED) {
                s0 = peg$parseproc_join();
                if (s0 === peg$FAILED) {
                    s0 = peg$parseproc_additive_expr();
                    if (s0 === peg$FAILED) {
                        s0 = peg$parseproc_array();
                    }
                }
            }
            return s0;
        }
        function peg$parseproc_additive_expr() {
            var s0, s1, s2, s3, s4, s5, s6, s7;
            s0 = peg$currPos;
            s1 = peg$parseproc_multiplicative_expr();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                s4 = peg$parse__();
                if (s4 !== peg$FAILED) {
                    s5 = peg$parseadditive_operator();
                    if (s5 !== peg$FAILED) {
                        s6 = peg$parse__();
                        if (s6 !== peg$FAILED) {
                            s7 = peg$parseproc_multiplicative_expr();
                            if (s7 !== peg$FAILED) {
                                s4 = [s4, s5, s6, s7];
                                s3 = s4;
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$currPos;
                    s4 = peg$parse__();
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parseadditive_operator();
                        if (s5 !== peg$FAILED) {
                            s6 = peg$parse__();
                            if (s6 !== peg$FAILED) {
                                s7 = peg$parseproc_multiplicative_expr();
                                if (s7 !== peg$FAILED) {
                                    s4 = [s4, s5, s6, s7];
                                    s3 = s4;
                                } else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c11(s1, s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseproc_multiplicative_expr() {
            var s0, s1, s2, s3, s4, s5, s6, s7;
            s0 = peg$currPos;
            s1 = peg$parseproc_primary();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                s4 = peg$parse__();
                if (s4 !== peg$FAILED) {
                    s5 = peg$parsemultiplicative_operator();
                    if (s5 !== peg$FAILED) {
                        s6 = peg$parse__();
                        if (s6 !== peg$FAILED) {
                            s7 = peg$parseproc_primary();
                            if (s7 !== peg$FAILED) {
                                s4 = [s4, s5, s6, s7];
                                s3 = s4;
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$currPos;
                    s4 = peg$parse__();
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parsemultiplicative_operator();
                        if (s5 !== peg$FAILED) {
                            s6 = peg$parse__();
                            if (s6 !== peg$FAILED) {
                                s7 = peg$parseproc_primary();
                                if (s7 !== peg$FAILED) {
                                    s4 = [s4, s5, s6, s7];
                                    s3 = s4;
                                } else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c11(s1, s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseproc_join() {
            var s0, s1, s2, s3, s4, s5, s6, s7;
            s0 = peg$currPos;
            s1 = peg$parsevar_decl();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parsejoin_op();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parsevar_decl();
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parse__();
                                if (s6 !== peg$FAILED) {
                                    s7 = peg$parseon_clause();
                                    if (s7 !== peg$FAILED) {
                                        peg$savedPos = s0;
                                        s1 = peg$c12(s1, s3, s5, s7);
                                        s0 = s1;
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseproc_primary() {
            var s0, s1, s2, s3, s4, s5;
            s0 = peg$parseliteral();
            if (s0 === peg$FAILED) {
                s0 = peg$parsevar_decl();
                if (s0 === peg$FAILED) {
                    s0 = peg$parseproc_func_call();
                    if (s0 === peg$FAILED) {
                        s0 = peg$parseparam();
                        if (s0 === peg$FAILED) {
                            s0 = peg$currPos;
                            s1 = peg$parseLPAREN();
                            if (s1 !== peg$FAILED) {
                                s2 = peg$parse__();
                                if (s2 !== peg$FAILED) {
                                    s3 = peg$parseproc_additive_expr();
                                    if (s3 !== peg$FAILED) {
                                        s4 = peg$parse__();
                                        if (s4 !== peg$FAILED) {
                                            s5 = peg$parseRPAREN();
                                            if (s5 !== peg$FAILED) {
                                                peg$savedPos = s0;
                                                s1 = peg$c13(s3);
                                                s0 = s1;
                                            } else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                            }
                                        } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        }
                    }
                }
            }
            return s0;
        }
        function peg$parseproc_func_call() {
            var s0, s1, s2, s3, s4, s5, s6, s7;
            s0 = peg$currPos;
            s1 = peg$parseproc_func_name();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseLPAREN();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parseproc_primary_list();
                            if (s5 === peg$FAILED) {
                                s5 = null;
                            }
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parse__();
                                if (s6 !== peg$FAILED) {
                                    s7 = peg$parseRPAREN();
                                    if (s7 !== peg$FAILED) {
                                        peg$savedPos = s0;
                                        s1 = peg$c14(s1, s5);
                                        s0 = s1;
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parseproc_func_name();
                if (s1 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c15(s1);
                }
                s0 = s1;
            }
            return s0;
        }
        function peg$parseproc_primary_list() {
            var s0, s1, s2, s3, s4, s5, s6, s7;
            s0 = peg$currPos;
            s1 = peg$parseproc_primary();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                s4 = peg$parse__();
                if (s4 !== peg$FAILED) {
                    s5 = peg$parseCOMMA();
                    if (s5 !== peg$FAILED) {
                        s6 = peg$parse__();
                        if (s6 !== peg$FAILED) {
                            s7 = peg$parseproc_primary();
                            if (s7 !== peg$FAILED) {
                                s4 = [s4, s5, s6, s7];
                                s3 = s4;
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$currPos;
                    s4 = peg$parse__();
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parseCOMMA();
                        if (s5 !== peg$FAILED) {
                            s6 = peg$parse__();
                            if (s6 !== peg$FAILED) {
                                s7 = peg$parseproc_primary();
                                if (s7 !== peg$FAILED) {
                                    s4 = [s4, s5, s6, s7];
                                    s3 = s4;
                                } else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c16(s1, s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseproc_array() {
            var s0, s1, s2, s3, s4, s5;
            s0 = peg$currPos;
            s1 = peg$parseLBRAKE();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseproc_primary_list();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parseRBRAKE();
                            if (s5 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c17(s3);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseset_list() {
            var s0, s1, s2, s3, s4, s5, s6, s7;
            s0 = peg$currPos;
            s1 = peg$parseset_item();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                s4 = peg$parse__();
                if (s4 !== peg$FAILED) {
                    s5 = peg$parseCOMMA();
                    if (s5 !== peg$FAILED) {
                        s6 = peg$parse__();
                        if (s6 !== peg$FAILED) {
                            s7 = peg$parseset_item();
                            if (s7 !== peg$FAILED) {
                                s4 = [s4, s5, s6, s7];
                                s3 = s4;
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$currPos;
                    s4 = peg$parse__();
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parseCOMMA();
                        if (s5 !== peg$FAILED) {
                            s6 = peg$parse__();
                            if (s6 !== peg$FAILED) {
                                s7 = peg$parseset_item();
                                if (s7 !== peg$FAILED) {
                                    s4 = [s4, s5, s6, s7];
                                    s3 = s4;
                                } else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c16(s1, s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseset_item() {
            var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13;
            s0 = peg$currPos;
            s1 = peg$currPos;
            s2 = peg$parseident();
            if (s2 !== peg$FAILED) {
                s3 = peg$parse__();
                if (s3 !== peg$FAILED) {
                    s4 = peg$parseDOT();
                    if (s4 !== peg$FAILED) {
                        s2 = [s2, s3, s4];
                        s1 = s2;
                    } else {
                        peg$currPos = s1;
                        s1 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s1;
                    s1 = peg$FAILED;
                }
            } else {
                peg$currPos = s1;
                s1 = peg$FAILED;
            }
            if (s1 === peg$FAILED) {
                s1 = null;
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parsecolumn();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            if (input.charCodeAt(peg$currPos) === 61) {
                                s5 = peg$c18;
                                peg$currPos++;
                            } else {
                                s5 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c19);
                                }
                            }
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parse__();
                                if (s6 !== peg$FAILED) {
                                    s7 = peg$parseadditive_expr();
                                    if (s7 !== peg$FAILED) {
                                        peg$savedPos = s0;
                                        s1 = peg$c20(s1, s3, s7);
                                        s0 = s1;
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$currPos;
                s2 = peg$parseident();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parse__();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parseDOT();
                        if (s4 !== peg$FAILED) {
                            s2 = [s2, s3, s4];
                            s1 = s2;
                        } else {
                            peg$currPos = s1;
                            s1 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s1;
                        s1 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s1;
                    s1 = peg$FAILED;
                }
                if (s1 === peg$FAILED) {
                    s1 = null;
                }
                if (s1 !== peg$FAILED) {
                    s2 = peg$parse__();
                    if (s2 !== peg$FAILED) {
                        s3 = peg$parsecolumn();
                        if (s3 !== peg$FAILED) {
                            s4 = peg$parse__();
                            if (s4 !== peg$FAILED) {
                                if (input.charCodeAt(peg$currPos) === 61) {
                                    s5 = peg$c18;
                                    peg$currPos++;
                                } else {
                                    s5 = peg$FAILED;
                                    if (peg$silentFails === 0) {
                                        peg$fail(peg$c19);
                                    }
                                }
                                if (s5 !== peg$FAILED) {
                                    s6 = peg$parse__();
                                    if (s6 !== peg$FAILED) {
                                        s7 = peg$parseKW_VALUES();
                                        if (s7 !== peg$FAILED) {
                                            s8 = peg$parse__();
                                            if (s8 !== peg$FAILED) {
                                                s9 = peg$parseLPAREN();
                                                if (s9 !== peg$FAILED) {
                                                    s10 = peg$parse__();
                                                    if (s10 !== peg$FAILED) {
                                                        s11 = peg$parsecolumn_ref();
                                                        if (s11 !== peg$FAILED) {
                                                            s12 = peg$parse__();
                                                            if (s12 !== peg$FAILED) {
                                                                s13 = peg$parseRPAREN();
                                                                if (s13 !== peg$FAILED) {
                                                                    peg$savedPos = s0;
                                                                    s1 = peg$c21(s1, s3, s11);
                                                                    s0 = s1;
                                                                } else {
                                                                    peg$currPos = s0;
                                                                    s0 = peg$FAILED;
                                                                }
                                                            } else {
                                                                peg$currPos = s0;
                                                                s0 = peg$FAILED;
                                                            }
                                                        } else {
                                                            peg$currPos = s0;
                                                            s0 = peg$FAILED;
                                                        }
                                                    } else {
                                                        peg$currPos = s0;
                                                        s0 = peg$FAILED;
                                                    }
                                                } else {
                                                    peg$currPos = s0;
                                                    s0 = peg$FAILED;
                                                }
                                            } else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                            }
                                        } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            return s0;
        }
        function peg$parsereplace_insert() {
            var s0, s1;
            s0 = peg$currPos;
            s1 = peg$parseKW_INSERT();
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c22();
            }
            s0 = s1;
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parseKW_REPLACE();
                if (s1 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c23();
                }
                s0 = s1;
            }
            return s0;
        }
        function peg$parseinsert_partition() {
            var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11;
            s0 = peg$currPos;
            s1 = peg$parseKW_PARTITION();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseLPAREN();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parseident_name();
                            if (s5 !== peg$FAILED) {
                                s6 = [];
                                s7 = peg$currPos;
                                s8 = peg$parse__();
                                if (s8 !== peg$FAILED) {
                                    s9 = peg$parseCOMMA();
                                    if (s9 !== peg$FAILED) {
                                        s10 = peg$parse__();
                                        if (s10 !== peg$FAILED) {
                                            s11 = peg$parseident_name();
                                            if (s11 !== peg$FAILED) {
                                                s8 = [s8, s9, s10, s11];
                                                s7 = s8;
                                            } else {
                                                peg$currPos = s7;
                                                s7 = peg$FAILED;
                                            }
                                        } else {
                                            peg$currPos = s7;
                                            s7 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s7;
                                        s7 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s7;
                                    s7 = peg$FAILED;
                                }
                                while (s7 !== peg$FAILED) {
                                    s6.push(s7);
                                    s7 = peg$currPos;
                                    s8 = peg$parse__();
                                    if (s8 !== peg$FAILED) {
                                        s9 = peg$parseCOMMA();
                                        if (s9 !== peg$FAILED) {
                                            s10 = peg$parse__();
                                            if (s10 !== peg$FAILED) {
                                                s11 = peg$parseident_name();
                                                if (s11 !== peg$FAILED) {
                                                    s8 = [s8, s9, s10, s11];
                                                    s7 = s8;
                                                } else {
                                                    peg$currPos = s7;
                                                    s7 = peg$FAILED;
                                                }
                                            } else {
                                                peg$currPos = s7;
                                                s7 = peg$FAILED;
                                            }
                                        } else {
                                            peg$currPos = s7;
                                            s7 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s7;
                                        s7 = peg$FAILED;
                                    }
                                }
                                if (s6 !== peg$FAILED) {
                                    s7 = peg$parse__();
                                    if (s7 !== peg$FAILED) {
                                        s8 = peg$parseRPAREN();
                                        if (s8 !== peg$FAILED) {
                                            peg$savedPos = s0;
                                            s1 = peg$c24(s5, s6);
                                            s0 = s1;
                                        } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parseKW_PARTITION();
                if (s1 !== peg$FAILED) {
                    s2 = peg$parse__();
                    if (s2 !== peg$FAILED) {
                        s3 = peg$parsevalue_item();
                        if (s3 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c25(s3);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            return s0;
        }
        function peg$parseinsert_value_clause() {
            var s0;
            s0 = peg$parsevalue_clause();
            if (s0 === peg$FAILED) {
                s0 = peg$parseselect_stmt_nake();
            }
            return s0;
        }
        function peg$parseon_duplicate_update_stmt() {
            var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;
            s0 = peg$currPos;
            s1 = peg$parseKW_ON();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    if (input.substr(peg$currPos, 9).toLowerCase() === peg$c26) {
                        s3 = input.substr(peg$currPos, 9);
                        peg$currPos += 9;
                    } else {
                        s3 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c27);
                        }
                    }
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parseKW_KEY();
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parse__();
                                if (s6 !== peg$FAILED) {
                                    s7 = peg$parseKW_UPDATE();
                                    if (s7 !== peg$FAILED) {
                                        s8 = peg$parse__();
                                        if (s8 !== peg$FAILED) {
                                            s9 = peg$parseset_list();
                                            if (s9 !== peg$FAILED) {
                                                peg$savedPos = s0;
                                                s1 = peg$c28(s9);
                                                s0 = s1;
                                            } else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                            }
                                        } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseanalyze_stmt() {
            var s0, s1, s2, s3, s4;
            s0 = peg$currPos;
            s1 = peg$parseKW_ANALYZE();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parsetable_name();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c29(s1, s3);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseattach_stmt() {
            var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10;
            s0 = peg$currPos;
            s1 = peg$parseKW_ATTACH();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseKW_DATABASE();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parseexpr();
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parse__();
                                if (s6 !== peg$FAILED) {
                                    s7 = peg$parseKW_AS();
                                    if (s7 !== peg$FAILED) {
                                        s8 = peg$parse__();
                                        if (s8 !== peg$FAILED) {
                                            s9 = peg$parseident();
                                            if (s9 !== peg$FAILED) {
                                                s10 = peg$parse__();
                                                if (s10 !== peg$FAILED) {
                                                    peg$savedPos = s0;
                                                    s1 = peg$c30(s1, s3, s5, s7, s9);
                                                    s0 = s1;
                                                } else {
                                                    peg$currPos = s0;
                                                    s0 = peg$FAILED;
                                                }
                                            } else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                            }
                                        } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsedrop_stmt() {
            var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12;
            s0 = peg$currPos;
            s1 = peg$parseKW_DROP();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseKW_TABLE();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parsetable_ref_list();
                            if (s5 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c31(s1, s3, s5);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parseKW_DROP();
                if (s1 !== peg$FAILED) {
                    s2 = peg$parse__();
                    if (s2 !== peg$FAILED) {
                        s3 = peg$parseKW_INDEX();
                        if (s3 !== peg$FAILED) {
                            s4 = peg$parse__();
                            if (s4 !== peg$FAILED) {
                                s5 = peg$parsecolumn_ref();
                                if (s5 !== peg$FAILED) {
                                    s6 = peg$parse__();
                                    if (s6 !== peg$FAILED) {
                                        s7 = peg$parseKW_ON();
                                        if (s7 !== peg$FAILED) {
                                            s8 = peg$parse__();
                                            if (s8 !== peg$FAILED) {
                                                s9 = peg$parsetable_name();
                                                if (s9 !== peg$FAILED) {
                                                    s10 = peg$parse__();
                                                    if (s10 !== peg$FAILED) {
                                                        s11 = peg$parsedrop_index_opt();
                                                        if (s11 === peg$FAILED) {
                                                            s11 = null;
                                                        }
                                                        if (s11 !== peg$FAILED) {
                                                            s12 = peg$parse__();
                                                            if (s12 !== peg$FAILED) {
                                                                peg$savedPos = s0;
                                                                s1 = peg$c32(s1, s3, s5, s9, s11);
                                                                s0 = s1;
                                                            } else {
                                                                peg$currPos = s0;
                                                                s0 = peg$FAILED;
                                                            }
                                                        } else {
                                                            peg$currPos = s0;
                                                            s0 = peg$FAILED;
                                                        }
                                                    } else {
                                                        peg$currPos = s0;
                                                        s0 = peg$FAILED;
                                                    }
                                                } else {
                                                    peg$currPos = s0;
                                                    s0 = peg$FAILED;
                                                }
                                            } else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                            }
                                        } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            return s0;
        }
        function peg$parsecreate_stmt() {
            var s0;
            s0 = peg$parsecreate_table_stmt();
            if (s0 === peg$FAILED) {
                s0 = peg$parsecreate_db_stmt();
            }
            return s0;
        }
        function peg$parsetruncate_stmt() {
            var s0, s1, s2, s3, s4, s5;
            s0 = peg$currPos;
            s1 = peg$parseKW_TRUNCATE();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseKW_TABLE();
                    if (s3 === peg$FAILED) {
                        s3 = null;
                    }
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parsetable_ref_list();
                            if (s5 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c33(s1, s3, s5);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parserename_stmt() {
            var s0, s1, s2, s3, s4, s5;
            s0 = peg$currPos;
            s1 = peg$parseKW_RENAME();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseKW_TABLE();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parsetable_to_list();
                            if (s5 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c34(s5);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsecall_stmt() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            s1 = peg$parseKW_CALL();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseproc_func_call();
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c35(s3);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseuse_stmt() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            s1 = peg$parseKW_USE();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseident();
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c36(s3);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseset_stmt() {
            var s0, s1, s2, s3, s4, s5;
            s0 = peg$currPos;
            s1 = peg$parseKW_SET();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseKW_GLOBAL();
                    if (s3 === peg$FAILED) {
                        s3 = peg$parseKW_SESSION();
                        if (s3 === peg$FAILED) {
                            s3 = peg$parseKW_LOCAL();
                            if (s3 === peg$FAILED) {
                                s3 = peg$parseKW_PERSIST();
                                if (s3 === peg$FAILED) {
                                    s3 = peg$parseKW_PERSIST_ONLY();
                                }
                            }
                        }
                    }
                    if (s3 === peg$FAILED) {
                        s3 = null;
                    }
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parseassign_stmt();
                            if (s5 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c37(s3, s5);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parselock_stmt() {
            var s0, s1, s2, s3, s4, s5;
            s0 = peg$currPos;
            s1 = peg$parseKW_LOCK();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseKW_TABLES();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parselock_table_list();
                            if (s5 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c38(s5);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseunlock_stmt() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            s1 = peg$parseKW_UNLOCK();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseKW_TABLES();
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c39();
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseshow_stmt() {
            var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11;
            s0 = peg$currPos;
            s1 = peg$parseKW_SHOW();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    if (input.substr(peg$currPos, 6).toLowerCase() === peg$c40) {
                        s3 = input.substr(peg$currPos, 6);
                        peg$currPos += 6;
                    } else {
                        s3 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c41);
                        }
                    }
                    if (s3 === peg$FAILED) {
                        if (input.substr(peg$currPos, 6).toLowerCase() === peg$c42) {
                            s3 = input.substr(peg$currPos, 6);
                            peg$currPos += 6;
                        } else {
                            s3 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c43);
                            }
                        }
                    }
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            if (input.substr(peg$currPos, 4).toLowerCase() === peg$c44) {
                                s5 = input.substr(peg$currPos, 4);
                                peg$currPos += 4;
                            } else {
                                s5 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c45);
                                }
                            }
                            if (s5 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c46(s3);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parseKW_SHOW();
                if (s1 !== peg$FAILED) {
                    s2 = peg$parse__();
                    if (s2 !== peg$FAILED) {
                        if (input.substr(peg$currPos, 6).toLowerCase() === peg$c47) {
                            s3 = input.substr(peg$currPos, 6);
                            peg$currPos += 6;
                        } else {
                            s3 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c48);
                            }
                        }
                        if (s3 !== peg$FAILED) {
                            s4 = peg$parse__();
                            if (s4 !== peg$FAILED) {
                                if (input.substr(peg$currPos, 6).toLowerCase() === peg$c49) {
                                    s5 = input.substr(peg$currPos, 6);
                                    peg$currPos += 6;
                                } else {
                                    s5 = peg$FAILED;
                                    if (peg$silentFails === 0) {
                                        peg$fail(peg$c50);
                                    }
                                }
                                if (s5 !== peg$FAILED) {
                                    s6 = peg$parse__();
                                    if (s6 !== peg$FAILED) {
                                        s7 = peg$parsein_op_right();
                                        if (s7 === peg$FAILED) {
                                            s7 = null;
                                        }
                                        if (s7 !== peg$FAILED) {
                                            s8 = peg$parse__();
                                            if (s8 !== peg$FAILED) {
                                                s9 = peg$parsefrom_clause();
                                                if (s9 === peg$FAILED) {
                                                    s9 = null;
                                                }
                                                if (s9 !== peg$FAILED) {
                                                    s10 = peg$parse__();
                                                    if (s10 !== peg$FAILED) {
                                                        s11 = peg$parselimit_clause();
                                                        if (s11 === peg$FAILED) {
                                                            s11 = null;
                                                        }
                                                        if (s11 !== peg$FAILED) {
                                                            peg$savedPos = s0;
                                                            s1 = peg$c51(s7, s9, s11);
                                                            s0 = s1;
                                                        } else {
                                                            peg$currPos = s0;
                                                            s0 = peg$FAILED;
                                                        }
                                                    } else {
                                                        peg$currPos = s0;
                                                        s0 = peg$FAILED;
                                                    }
                                                } else {
                                                    peg$currPos = s0;
                                                    s0 = peg$FAILED;
                                                }
                                            } else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                            }
                                        } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
                if (s0 === peg$FAILED) {
                    s0 = peg$currPos;
                    s1 = peg$parseKW_SHOW();
                    if (s1 !== peg$FAILED) {
                        s2 = peg$parse__();
                        if (s2 !== peg$FAILED) {
                            s3 = peg$currPos;
                            if (input.substr(peg$currPos, 9).toLowerCase() === peg$c52) {
                                s4 = input.substr(peg$currPos, 9);
                                peg$currPos += 9;
                            } else {
                                s4 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c53);
                                }
                            }
                            if (s4 !== peg$FAILED) {
                                s5 = peg$parse__();
                                if (s5 !== peg$FAILED) {
                                    if (input.substr(peg$currPos, 3).toLowerCase() === peg$c54) {
                                        s6 = input.substr(peg$currPos, 3);
                                        peg$currPos += 3;
                                    } else {
                                        s6 = peg$FAILED;
                                        if (peg$silentFails === 0) {
                                            peg$fail(peg$c55);
                                        }
                                    }
                                    if (s6 !== peg$FAILED) {
                                        s4 = [s4, s5, s6];
                                        s3 = s4;
                                    } else {
                                        peg$currPos = s3;
                                        s3 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                            if (s3 === peg$FAILED) {
                                if (input.substr(peg$currPos, 9).toLowerCase() === peg$c56) {
                                    s3 = input.substr(peg$currPos, 9);
                                    peg$currPos += 9;
                                } else {
                                    s3 = peg$FAILED;
                                    if (peg$silentFails === 0) {
                                        peg$fail(peg$c57);
                                    }
                                }
                            }
                            if (s3 !== peg$FAILED) {
                                s4 = peg$parse__();
                                if (s4 !== peg$FAILED) {
                                    s5 = peg$parselike_op_right();
                                    if (s5 === peg$FAILED) {
                                        s5 = peg$parsewhere_clause();
                                    }
                                    if (s5 === peg$FAILED) {
                                        s5 = null;
                                    }
                                    if (s5 !== peg$FAILED) {
                                        peg$savedPos = s0;
                                        s1 = peg$c58(s3, s5);
                                        s0 = s1;
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                    if (s0 === peg$FAILED) {
                        s0 = peg$parseshow_grant_stmt();
                    }
                }
            }
            return s0;
        }
        function peg$parsedesc_stmt() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            s1 = peg$parseKW_DESC();
            if (s1 === peg$FAILED) {
                s1 = peg$parseKW_DESCRIBE();
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseident();
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c59(s3);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsevar_decl() {
            var s0, s1, s2;
            s0 = peg$currPos;
            s1 = peg$parseKW_VAR_PRE();
            if (s1 !== peg$FAILED) {
                s2 = peg$parsewithout_prefix_var_decl();
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c60(s1, s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsewithout_prefix_var_decl() {
            var s0, s1, s2;
            s0 = peg$currPos;
            s1 = peg$parseident_name();
            if (s1 !== peg$FAILED) {
                s2 = peg$parsemem_chain();
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c61(s1, s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsevalue_item() {
            var s0, s1, s2, s3, s4, s5;
            s0 = peg$currPos;
            s1 = peg$parseLPAREN();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseexpr_list();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parseRPAREN();
                            if (s5 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c62(s3);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsevalue_clause() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            s1 = peg$parseKW_VALUES();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parsevalue_list();
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c63(s3);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsedrop_index_opt() {
            var s0, s1, s2, s3, s4, s5;
            s0 = peg$currPos;
            s1 = peg$parseALTER_ALGORITHM();
            if (s1 === peg$FAILED) {
                s1 = peg$parseALTER_LOCK();
            }
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                s4 = peg$parse__();
                if (s4 !== peg$FAILED) {
                    s5 = peg$parseALTER_ALGORITHM();
                    if (s5 === peg$FAILED) {
                        s5 = peg$parseALTER_LOCK();
                    }
                    if (s5 !== peg$FAILED) {
                        s4 = [s4, s5];
                        s3 = s4;
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$currPos;
                    s4 = peg$parse__();
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parseALTER_ALGORITHM();
                        if (s5 === peg$FAILED) {
                            s5 = peg$parseALTER_LOCK();
                        }
                        if (s5 !== peg$FAILED) {
                            s4 = [s4, s5];
                            s3 = s4;
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c64(s1, s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsecreate_table_stmt() {
            var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21;
            s0 = peg$currPos;
            s1 = peg$parseKW_CREATE();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseKW_TEMPORARY();
                    if (s3 === peg$FAILED) {
                        s3 = null;
                    }
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parseKW_TABLE();
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parse__();
                                if (s6 !== peg$FAILED) {
                                    s7 = peg$parseKW_IF_NOT_EXISTS();
                                    if (s7 === peg$FAILED) {
                                        s7 = null;
                                    }
                                    if (s7 !== peg$FAILED) {
                                        s8 = peg$parse__();
                                        if (s8 !== peg$FAILED) {
                                            s9 = peg$parsetable_ref_list();
                                            if (s9 !== peg$FAILED) {
                                                s10 = peg$parse__();
                                                if (s10 !== peg$FAILED) {
                                                    s11 = peg$parsecreate_table_definition();
                                                    if (s11 !== peg$FAILED) {
                                                        s12 = peg$parse__();
                                                        if (s12 !== peg$FAILED) {
                                                            s13 = peg$parsecreate_constraint_definition();
                                                            if (s13 !== peg$FAILED) {
                                                                s14 = peg$parse__();
                                                                if (s14 !== peg$FAILED) {
                                                                    s15 = peg$parsetable_options();
                                                                    if (s15 === peg$FAILED) {
                                                                        s15 = null;
                                                                    }
                                                                    if (s15 !== peg$FAILED) {
                                                                        s16 = peg$parse__();
                                                                        if (s16 !== peg$FAILED) {
                                                                            s17 = peg$parseKW_IGNORE();
                                                                            if (s17 === peg$FAILED) {
                                                                                s17 = peg$parseKW_REPLACE();
                                                                            }
                                                                            if (s17 === peg$FAILED) {
                                                                                s17 = null;
                                                                            }
                                                                            if (s17 !== peg$FAILED) {
                                                                                s18 = peg$parse__();
                                                                                if (s18 !== peg$FAILED) {
                                                                                    s19 = peg$parseKW_AS();
                                                                                    if (s19 === peg$FAILED) {
                                                                                        s19 = null;
                                                                                    }
                                                                                    if (s19 !== peg$FAILED) {
                                                                                        s20 = peg$parse__();
                                                                                        if (s20 !== peg$FAILED) {
                                                                                            s21 = peg$parseunion_stmt();
                                                                                            if (s21 === peg$FAILED) {
                                                                                                s21 = null;
                                                                                            }
                                                                                            if (s21 !== peg$FAILED) {
                                                                                                peg$savedPos = s0;
                                                                                                s1 = peg$c65(s1, s3, s7, s9, s11, s13, s15, s17, s19, s21);
                                                                                                s0 = s1;
                                                                                            } else {
                                                                                                peg$currPos = s0;
                                                                                                s0 = peg$FAILED;
                                                                                            }
                                                                                        } else {
                                                                                            peg$currPos = s0;
                                                                                            s0 = peg$FAILED;
                                                                                        }
                                                                                    } else {
                                                                                        peg$currPos = s0;
                                                                                        s0 = peg$FAILED;
                                                                                    }
                                                                                } else {
                                                                                    peg$currPos = s0;
                                                                                    s0 = peg$FAILED;
                                                                                }
                                                                            } else {
                                                                                peg$currPos = s0;
                                                                                s0 = peg$FAILED;
                                                                            }
                                                                        } else {
                                                                            peg$currPos = s0;
                                                                            s0 = peg$FAILED;
                                                                        }
                                                                    } else {
                                                                        peg$currPos = s0;
                                                                        s0 = peg$FAILED;
                                                                    }
                                                                } else {
                                                                    peg$currPos = s0;
                                                                    s0 = peg$FAILED;
                                                                }
                                                            } else {
                                                                peg$currPos = s0;
                                                                s0 = peg$FAILED;
                                                            }
                                                        } else {
                                                            peg$currPos = s0;
                                                            s0 = peg$FAILED;
                                                        }
                                                    } else {
                                                        peg$currPos = s0;
                                                        s0 = peg$FAILED;
                                                    }
                                                } else {
                                                    peg$currPos = s0;
                                                    s0 = peg$FAILED;
                                                }
                                            } else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                            }
                                        } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parseKW_CREATE();
                if (s1 !== peg$FAILED) {
                    s2 = peg$parse__();
                    if (s2 !== peg$FAILED) {
                        s3 = peg$parseKW_TEMPORARY();
                        if (s3 === peg$FAILED) {
                            s3 = null;
                        }
                        if (s3 !== peg$FAILED) {
                            s4 = peg$parse__();
                            if (s4 !== peg$FAILED) {
                                s5 = peg$parseKW_TABLE();
                                if (s5 !== peg$FAILED) {
                                    s6 = peg$parse__();
                                    if (s6 !== peg$FAILED) {
                                        s7 = peg$parseKW_IF_NOT_EXISTS();
                                        if (s7 === peg$FAILED) {
                                            s7 = null;
                                        }
                                        if (s7 !== peg$FAILED) {
                                            s8 = peg$parse__();
                                            if (s8 !== peg$FAILED) {
                                                s9 = peg$parsetable_ref_list();
                                                if (s9 !== peg$FAILED) {
                                                    s10 = peg$parse__();
                                                    if (s10 !== peg$FAILED) {
                                                        s11 = peg$parsecreate_like_table();
                                                        if (s11 !== peg$FAILED) {
                                                            peg$savedPos = s0;
                                                            s1 = peg$c66(s1, s3, s7, s9, s11);
                                                            s0 = s1;
                                                        } else {
                                                            peg$currPos = s0;
                                                            s0 = peg$FAILED;
                                                        }
                                                    } else {
                                                        peg$currPos = s0;
                                                        s0 = peg$FAILED;
                                                    }
                                                } else {
                                                    peg$currPos = s0;
                                                    s0 = peg$FAILED;
                                                }
                                            } else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                            }
                                        } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            return s0;
        }
        function peg$parsecreate_db_stmt() {
            var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;
            s0 = peg$currPos;
            s1 = peg$parseKW_CREATE();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseKW_DATABASE();
                    if (s3 === peg$FAILED) {
                        s3 = peg$parseKW_SCHEME();
                    }
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parseKW_IF_NOT_EXISTS();
                            if (s5 === peg$FAILED) {
                                s5 = null;
                            }
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parse__();
                                if (s6 !== peg$FAILED) {
                                    s7 = peg$parseident_name();
                                    if (s7 !== peg$FAILED) {
                                        s8 = peg$parse__();
                                        if (s8 !== peg$FAILED) {
                                            s9 = peg$parsecreate_db_definition();
                                            if (s9 === peg$FAILED) {
                                                s9 = null;
                                            }
                                            if (s9 !== peg$FAILED) {
                                                peg$savedPos = s0;
                                                s1 = peg$c67(s1, s3, s5, s7, s9);
                                                s0 = s1;
                                            } else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                            }
                                        } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsealter_table_stmt() {
            var s0, s1, s2, s3, s4, s5, s6, s7;
            s0 = peg$currPos;
            s1 = peg$parseKW_ALTER();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseKW_TABLE();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parsetable_ref_list();
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parse__();
                                if (s6 !== peg$FAILED) {
                                    s7 = peg$parsealter_action_list();
                                    if (s7 !== peg$FAILED) {
                                        peg$savedPos = s0;
                                        s1 = peg$c68(s5, s7);
                                        s0 = s1;
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parselock_table_list() {
            var s0, s1, s2, s3, s4, s5, s6, s7;
            s0 = peg$currPos;
            s1 = peg$parselock_table();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                s4 = peg$parse__();
                if (s4 !== peg$FAILED) {
                    s5 = peg$parseCOMMA();
                    if (s5 !== peg$FAILED) {
                        s6 = peg$parse__();
                        if (s6 !== peg$FAILED) {
                            s7 = peg$parselock_table();
                            if (s7 !== peg$FAILED) {
                                s4 = [s4, s5, s6, s7];
                                s3 = s4;
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$currPos;
                    s4 = peg$parse__();
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parseCOMMA();
                        if (s5 !== peg$FAILED) {
                            s6 = peg$parse__();
                            if (s6 !== peg$FAILED) {
                                s7 = peg$parselock_table();
                                if (s7 !== peg$FAILED) {
                                    s4 = [s4, s5, s6, s7];
                                    s3 = s4;
                                } else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c69(s1, s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseshow_grant_stmt() {
            var s0, s1, s2, s3, s4, s5;
            s0 = peg$currPos;
            s1 = peg$parseKW_SHOW();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    if (input.substr(peg$currPos, 6).toLowerCase() === peg$c70) {
                        s3 = input.substr(peg$currPos, 6);
                        peg$currPos += 6;
                    } else {
                        s3 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c71);
                        }
                    }
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parseshow_grant_for();
                            if (s5 === peg$FAILED) {
                                s5 = null;
                            }
                            if (s5 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c72(s5);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsemem_chain() {
            var s0, s1, s2, s3, s4;
            s0 = peg$currPos;
            s1 = [];
            s2 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 46) {
                s3 = peg$c73;
                peg$currPos++;
            } else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c74);
                }
            }
            if (s3 !== peg$FAILED) {
                s4 = peg$parseident_name();
                if (s4 !== peg$FAILED) {
                    s3 = [s3, s4];
                    s2 = s3;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
            } else {
                peg$currPos = s2;
                s2 = peg$FAILED;
            }
            while (s2 !== peg$FAILED) {
                s1.push(s2);
                s2 = peg$currPos;
                if (input.charCodeAt(peg$currPos) === 46) {
                    s3 = peg$c73;
                    peg$currPos++;
                } else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c74);
                    }
                }
                if (s3 !== peg$FAILED) {
                    s4 = peg$parseident_name();
                    if (s4 !== peg$FAILED) {
                        s3 = [s3, s4];
                        s2 = s3;
                    } else {
                        peg$currPos = s2;
                        s2 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
            }
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c75(s1);
            }
            s0 = s1;
            return s0;
        }
        function peg$parsevalue_list() {
            var s0, s1, s2, s3, s4, s5, s6, s7;
            s0 = peg$currPos;
            s1 = peg$parsevalue_item();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                s4 = peg$parse__();
                if (s4 !== peg$FAILED) {
                    s5 = peg$parseCOMMA();
                    if (s5 !== peg$FAILED) {
                        s6 = peg$parse__();
                        if (s6 !== peg$FAILED) {
                            s7 = peg$parsevalue_item();
                            if (s7 !== peg$FAILED) {
                                s4 = [s4, s5, s6, s7];
                                s3 = s4;
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$currPos;
                    s4 = peg$parse__();
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parseCOMMA();
                        if (s5 !== peg$FAILED) {
                            s6 = peg$parse__();
                            if (s6 !== peg$FAILED) {
                                s7 = peg$parsevalue_item();
                                if (s7 !== peg$FAILED) {
                                    s4 = [s4, s5, s6, s7];
                                    s3 = s4;
                                } else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c16(s1, s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseALTER_ALGORITHM() {
            var s0, s1, s2, s3, s4, s5;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 9).toLowerCase() === peg$c76) {
                s1 = input.substr(peg$currPos, 9);
                peg$currPos += 9;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c77);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseKW_ASSIGIN_EQUAL();
                    if (s3 === peg$FAILED) {
                        s3 = null;
                    }
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            if (input.substr(peg$currPos, 7).toLowerCase() === peg$c78) {
                                s5 = input.substr(peg$currPos, 7);
                                peg$currPos += 7;
                            } else {
                                s5 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c79);
                                }
                            }
                            if (s5 === peg$FAILED) {
                                if (input.substr(peg$currPos, 7).toLowerCase() === peg$c80) {
                                    s5 = input.substr(peg$currPos, 7);
                                    peg$currPos += 7;
                                } else {
                                    s5 = peg$FAILED;
                                    if (peg$silentFails === 0) {
                                        peg$fail(peg$c81);
                                    }
                                }
                                if (s5 === peg$FAILED) {
                                    if (input.substr(peg$currPos, 7).toLowerCase() === peg$c82) {
                                        s5 = input.substr(peg$currPos, 7);
                                        peg$currPos += 7;
                                    } else {
                                        s5 = peg$FAILED;
                                        if (peg$silentFails === 0) {
                                            peg$fail(peg$c83);
                                        }
                                    }
                                    if (s5 === peg$FAILED) {
                                        if (input.substr(peg$currPos, 4).toLowerCase() === peg$c84) {
                                            s5 = input.substr(peg$currPos, 4);
                                            peg$currPos += 4;
                                        } else {
                                            s5 = peg$FAILED;
                                            if (peg$silentFails === 0) {
                                                peg$fail(peg$c85);
                                            }
                                        }
                                    }
                                }
                            }
                            if (s5 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c86(s3, s5);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseALTER_LOCK() {
            var s0, s1, s2, s3, s4, s5;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 4).toLowerCase() === peg$c87) {
                s1 = input.substr(peg$currPos, 4);
                peg$currPos += 4;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c88);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseKW_ASSIGIN_EQUAL();
                    if (s3 === peg$FAILED) {
                        s3 = null;
                    }
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            if (input.substr(peg$currPos, 7).toLowerCase() === peg$c78) {
                                s5 = input.substr(peg$currPos, 7);
                                peg$currPos += 7;
                            } else {
                                s5 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c79);
                                }
                            }
                            if (s5 === peg$FAILED) {
                                if (input.substr(peg$currPos, 4).toLowerCase() === peg$c89) {
                                    s5 = input.substr(peg$currPos, 4);
                                    peg$currPos += 4;
                                } else {
                                    s5 = peg$FAILED;
                                    if (peg$silentFails === 0) {
                                        peg$fail(peg$c90);
                                    }
                                }
                                if (s5 === peg$FAILED) {
                                    if (input.substr(peg$currPos, 6).toLowerCase() === peg$c91) {
                                        s5 = input.substr(peg$currPos, 6);
                                        peg$currPos += 6;
                                    } else {
                                        s5 = peg$FAILED;
                                        if (peg$silentFails === 0) {
                                            peg$fail(peg$c92);
                                        }
                                    }
                                    if (s5 === peg$FAILED) {
                                        if (input.substr(peg$currPos, 9).toLowerCase() === peg$c93) {
                                            s5 = input.substr(peg$currPos, 9);
                                            peg$currPos += 9;
                                        } else {
                                            s5 = peg$FAILED;
                                            if (peg$silentFails === 0) {
                                                peg$fail(peg$c94);
                                            }
                                        }
                                    }
                                }
                            }
                            if (s5 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c95(s3, s5);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsecreate_table_definition() {
            var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;
            s0 = peg$currPos;
            s1 = peg$parseLPAREN();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parsecreate_definition();
                    if (s3 !== peg$FAILED) {
                        s4 = [];
                        s5 = peg$currPos;
                        s6 = peg$parse__();
                        if (s6 !== peg$FAILED) {
                            s7 = peg$parseCOMMA();
                            if (s7 !== peg$FAILED) {
                                s8 = peg$parse__();
                                if (s8 !== peg$FAILED) {
                                    s9 = peg$parsecreate_definition();
                                    if (s9 !== peg$FAILED) {
                                        s6 = [s6, s7, s8, s9];
                                        s5 = s6;
                                    } else {
                                        peg$currPos = s5;
                                        s5 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s5;
                                    s5 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s5;
                                s5 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s5;
                            s5 = peg$FAILED;
                        }
                        while (s5 !== peg$FAILED) {
                            s4.push(s5);
                            s5 = peg$currPos;
                            s6 = peg$parse__();
                            if (s6 !== peg$FAILED) {
                                s7 = peg$parseCOMMA();
                                if (s7 !== peg$FAILED) {
                                    s8 = peg$parse__();
                                    if (s8 !== peg$FAILED) {
                                        s9 = peg$parsecreate_definition();
                                        if (s9 !== peg$FAILED) {
                                            s6 = [s6, s7, s8, s9];
                                            s5 = s6;
                                        } else {
                                            peg$currPos = s5;
                                            s5 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s5;
                                        s5 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s5;
                                    s5 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s5;
                                s5 = peg$FAILED;
                            }
                        }
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parse__();
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parseRPAREN();
                                if (s6 !== peg$FAILED) {
                                    peg$savedPos = s0;
                                    s1 = peg$c16(s3, s4);
                                    s0 = s1;
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsecreate_definition() {
            var s0;
            s0 = peg$parsecreate_column_definition();
            if (s0 === peg$FAILED) {
                s0 = peg$parsecreate_index_definition();
                if (s0 === peg$FAILED) {
                    s0 = peg$parsecreate_fulltext_spatial_index_definition();
                }
            }
            return s0;
        }
        function peg$parsecreate_column_definition() {
            var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21;
            s0 = peg$currPos;
            s1 = peg$parsecolumn_ref();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parsedata_type();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parseliteral_not_null();
                            if (s5 === peg$FAILED) {
                                s5 = peg$parseliteral_null();
                            }
                            if (s5 === peg$FAILED) {
                                s5 = null;
                            }
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parse__();
                                if (s6 !== peg$FAILED) {
                                    s7 = peg$parsedefault_expr();
                                    if (s7 === peg$FAILED) {
                                        s7 = null;
                                    }
                                    if (s7 !== peg$FAILED) {
                                        s8 = peg$parse__();
                                        if (s8 !== peg$FAILED) {
                                            if (input.substr(peg$currPos, 14).toLowerCase() === peg$c96) {
                                                s9 = input.substr(peg$currPos, 14);
                                                peg$currPos += 14;
                                            } else {
                                                s9 = peg$FAILED;
                                                if (peg$silentFails === 0) {
                                                    peg$fail(peg$c97);
                                                }
                                            }
                                            if (s9 === peg$FAILED) {
                                                s9 = null;
                                            }
                                            if (s9 !== peg$FAILED) {
                                                s10 = peg$parse__();
                                                if (s10 !== peg$FAILED) {
                                                    s11 = peg$currPos;
                                                    if (input.substr(peg$currPos, 6).toLowerCase() === peg$c98) {
                                                        s12 = input.substr(peg$currPos, 6);
                                                        peg$currPos += 6;
                                                    } else {
                                                        s12 = peg$FAILED;
                                                        if (peg$silentFails === 0) {
                                                            peg$fail(peg$c99);
                                                        }
                                                    }
                                                    if (s12 === peg$FAILED) {
                                                        if (input.substr(peg$currPos, 7).toLowerCase() === peg$c100) {
                                                            s12 = input.substr(peg$currPos, 7);
                                                            peg$currPos += 7;
                                                        } else {
                                                            s12 = peg$FAILED;
                                                            if (peg$silentFails === 0) {
                                                                peg$fail(peg$c101);
                                                            }
                                                        }
                                                    }
                                                    if (s12 === peg$FAILED) {
                                                        s12 = null;
                                                    }
                                                    if (s12 !== peg$FAILED) {
                                                        s13 = peg$parse__();
                                                        if (s13 !== peg$FAILED) {
                                                            if (input.substr(peg$currPos, 3).toLowerCase() === peg$c102) {
                                                                s14 = input.substr(peg$currPos, 3);
                                                                peg$currPos += 3;
                                                            } else {
                                                                s14 = peg$FAILED;
                                                                if (peg$silentFails === 0) {
                                                                    peg$fail(peg$c103);
                                                                }
                                                            }
                                                            if (s14 !== peg$FAILED) {
                                                                s12 = [s12, s13, s14];
                                                                s11 = s12;
                                                            } else {
                                                                peg$currPos = s11;
                                                                s11 = peg$FAILED;
                                                            }
                                                        } else {
                                                            peg$currPos = s11;
                                                            s11 = peg$FAILED;
                                                        }
                                                    } else {
                                                        peg$currPos = s11;
                                                        s11 = peg$FAILED;
                                                    }
                                                    if (s11 === peg$FAILED) {
                                                        s11 = null;
                                                    }
                                                    if (s11 !== peg$FAILED) {
                                                        s12 = peg$parse__();
                                                        if (s12 !== peg$FAILED) {
                                                            s13 = peg$parsekeyword_comment();
                                                            if (s13 === peg$FAILED) {
                                                                s13 = null;
                                                            }
                                                            if (s13 !== peg$FAILED) {
                                                                s14 = peg$parse__();
                                                                if (s14 !== peg$FAILED) {
                                                                    s15 = peg$parsecollate_expr();
                                                                    if (s15 === peg$FAILED) {
                                                                        s15 = null;
                                                                    }
                                                                    if (s15 !== peg$FAILED) {
                                                                        s16 = peg$parse__();
                                                                        if (s16 !== peg$FAILED) {
                                                                            s17 = peg$parsecolumn_format();
                                                                            if (s17 === peg$FAILED) {
                                                                                s17 = null;
                                                                            }
                                                                            if (s17 !== peg$FAILED) {
                                                                                s18 = peg$parse__();
                                                                                if (s18 !== peg$FAILED) {
                                                                                    s19 = peg$parsestorage();
                                                                                    if (s19 === peg$FAILED) {
                                                                                        s19 = null;
                                                                                    }
                                                                                    if (s19 !== peg$FAILED) {
                                                                                        s20 = peg$parse__();
                                                                                        if (s20 !== peg$FAILED) {
                                                                                            s21 = peg$parsereference_definition();
                                                                                            if (s21 === peg$FAILED) {
                                                                                                s21 = null;
                                                                                            }
                                                                                            if (s21 !== peg$FAILED) {
                                                                                                peg$savedPos = s0;
                                                                                                s1 = peg$c104(s1, s3, s5, s7, s9, s11, s13, s15, s17, s19, s21);
                                                                                                s0 = s1;
                                                                                            } else {
                                                                                                peg$currPos = s0;
                                                                                                s0 = peg$FAILED;
                                                                                            }
                                                                                        } else {
                                                                                            peg$currPos = s0;
                                                                                            s0 = peg$FAILED;
                                                                                        }
                                                                                    } else {
                                                                                        peg$currPos = s0;
                                                                                        s0 = peg$FAILED;
                                                                                    }
                                                                                } else {
                                                                                    peg$currPos = s0;
                                                                                    s0 = peg$FAILED;
                                                                                }
                                                                            } else {
                                                                                peg$currPos = s0;
                                                                                s0 = peg$FAILED;
                                                                            }
                                                                        } else {
                                                                            peg$currPos = s0;
                                                                            s0 = peg$FAILED;
                                                                        }
                                                                    } else {
                                                                        peg$currPos = s0;
                                                                        s0 = peg$FAILED;
                                                                    }
                                                                } else {
                                                                    peg$currPos = s0;
                                                                    s0 = peg$FAILED;
                                                                }
                                                            } else {
                                                                peg$currPos = s0;
                                                                s0 = peg$FAILED;
                                                            }
                                                        } else {
                                                            peg$currPos = s0;
                                                            s0 = peg$FAILED;
                                                        }
                                                    } else {
                                                        peg$currPos = s0;
                                                        s0 = peg$FAILED;
                                                    }
                                                } else {
                                                    peg$currPos = s0;
                                                    s0 = peg$FAILED;
                                                }
                                            } else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                            }
                                        } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsetable_options() {
            var s0, s1, s2, s3, s4, s5, s6, s7;
            s0 = peg$currPos;
            s1 = peg$parsetable_option();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                s4 = peg$parse__();
                if (s4 !== peg$FAILED) {
                    s5 = peg$parseCOMMA();
                    if (s5 === peg$FAILED) {
                        s5 = null;
                    }
                    if (s5 !== peg$FAILED) {
                        s6 = peg$parse__();
                        if (s6 !== peg$FAILED) {
                            s7 = peg$parsetable_option();
                            if (s7 !== peg$FAILED) {
                                s4 = [s4, s5, s6, s7];
                                s3 = s4;
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$currPos;
                    s4 = peg$parse__();
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parseCOMMA();
                        if (s5 === peg$FAILED) {
                            s5 = null;
                        }
                        if (s5 !== peg$FAILED) {
                            s6 = peg$parse__();
                            if (s6 !== peg$FAILED) {
                                s7 = peg$parsetable_option();
                                if (s7 !== peg$FAILED) {
                                    s4 = [s4, s5, s6, s7];
                                    s3 = s4;
                                } else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c105(s1, s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsecreate_like_table() {
            var s0, s1, s2, s3, s4, s5;
            s0 = peg$parsecreate_like_table_simple();
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parseLPAREN();
                if (s1 !== peg$FAILED) {
                    s2 = peg$parse__();
                    if (s2 !== peg$FAILED) {
                        s3 = peg$parsecreate_like_table();
                        if (s3 !== peg$FAILED) {
                            s4 = peg$parse__();
                            if (s4 !== peg$FAILED) {
                                s5 = peg$parseRPAREN();
                                if (s5 !== peg$FAILED) {
                                    peg$savedPos = s0;
                                    s1 = peg$c106(s3);
                                    s0 = s1;
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            return s0;
        }
        function peg$parsecreate_db_definition() {
            var s0, s1, s2, s3, s4, s5;
            s0 = peg$currPos;
            s1 = peg$parsecreate_option_character_set();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                s4 = peg$parse__();
                if (s4 !== peg$FAILED) {
                    s5 = peg$parsecreate_option_character_set();
                    if (s5 !== peg$FAILED) {
                        s4 = [s4, s5];
                        s3 = s4;
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$currPos;
                    s4 = peg$parse__();
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parsecreate_option_character_set();
                        if (s5 !== peg$FAILED) {
                            s4 = [s4, s5];
                            s3 = s4;
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c64(s1, s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsealter_action_list() {
            var s0, s1, s2, s3, s4, s5, s6, s7;
            s0 = peg$currPos;
            s1 = peg$parsealter_action();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                s4 = peg$parse__();
                if (s4 !== peg$FAILED) {
                    s5 = peg$parseCOMMA();
                    if (s5 !== peg$FAILED) {
                        s6 = peg$parse__();
                        if (s6 !== peg$FAILED) {
                            s7 = peg$parsealter_action();
                            if (s7 !== peg$FAILED) {
                                s4 = [s4, s5, s6, s7];
                                s3 = s4;
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$currPos;
                    s4 = peg$parse__();
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parseCOMMA();
                        if (s5 !== peg$FAILED) {
                            s6 = peg$parse__();
                            if (s6 !== peg$FAILED) {
                                s7 = peg$parsealter_action();
                                if (s7 !== peg$FAILED) {
                                    s4 = [s4, s5, s6, s7];
                                    s3 = s4;
                                } else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c16(s1, s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parselock_table() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            s1 = peg$parsetable_base();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parselock_type();
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c107(s1, s3);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseshow_grant_for() {
            var s0, s1, s2, s3, s4, s5, s6, s7, s8;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 3).toLowerCase() === peg$c108) {
                s1 = input.substr(peg$currPos, 3);
                peg$currPos += 3;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c109);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseident();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$currPos;
                            s6 = peg$parseKW_VAR__PRE_AT();
                            if (s6 !== peg$FAILED) {
                                s7 = peg$parse__();
                                if (s7 !== peg$FAILED) {
                                    s8 = peg$parseident();
                                    if (s8 !== peg$FAILED) {
                                        s6 = [s6, s7, s8];
                                        s5 = s6;
                                    } else {
                                        peg$currPos = s5;
                                        s5 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s5;
                                    s5 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s5;
                                s5 = peg$FAILED;
                            }
                            if (s5 === peg$FAILED) {
                                s5 = null;
                            }
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parse__();
                                if (s6 !== peg$FAILED) {
                                    s7 = peg$parseshow_grant_for_using();
                                    if (s7 === peg$FAILED) {
                                        s7 = null;
                                    }
                                    if (s7 !== peg$FAILED) {
                                        peg$savedPos = s0;
                                        s1 = peg$c110(s3, s5, s7);
                                        s0 = s1;
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsecreate_constraint_definition() {
            var s0;
            s0 = peg$parsecreate_constraint_primary();
            if (s0 === peg$FAILED) {
                s0 = peg$parsecreate_constraint_unique();
                if (s0 === peg$FAILED) {
                    s0 = peg$parsecreate_constraint_foreign();
                    if (s0 === peg$FAILED) {
                        s0 = peg$parsecreate_constraint_check();
                    }
                }
            }
            return s0;
        }
        function peg$parsecreate_index_definition() {
            var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10;
            s0 = peg$currPos;
            s1 = peg$parseKW_INDEX();
            if (s1 === peg$FAILED) {
                s1 = peg$parseKW_KEY();
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parsecolumn();
                    if (s3 === peg$FAILED) {
                        s3 = null;
                    }
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parseindex_type();
                            if (s5 === peg$FAILED) {
                                s5 = null;
                            }
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parse__();
                                if (s6 !== peg$FAILED) {
                                    s7 = peg$parsecte_column_definition();
                                    if (s7 !== peg$FAILED) {
                                        s8 = peg$parse__();
                                        if (s8 !== peg$FAILED) {
                                            s9 = peg$parseindex_options();
                                            if (s9 === peg$FAILED) {
                                                s9 = null;
                                            }
                                            if (s9 !== peg$FAILED) {
                                                s10 = peg$parse__();
                                                if (s10 !== peg$FAILED) {
                                                    peg$savedPos = s0;
                                                    s1 = peg$c111(s1, s3, s5, s7, s9);
                                                    s0 = s1;
                                                } else {
                                                    peg$currPos = s0;
                                                    s0 = peg$FAILED;
                                                }
                                            } else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                            }
                                        } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsecreate_fulltext_spatial_index_definition() {
            var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10;
            s0 = peg$currPos;
            s1 = peg$parseKW_FULLTEXT();
            if (s1 === peg$FAILED) {
                s1 = peg$parseKW_SPATIAL();
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseKW_INDEX();
                    if (s3 === peg$FAILED) {
                        s3 = peg$parseKW_KEY();
                    }
                    if (s3 === peg$FAILED) {
                        s3 = null;
                    }
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parsecolumn();
                            if (s5 === peg$FAILED) {
                                s5 = null;
                            }
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parse__();
                                if (s6 !== peg$FAILED) {
                                    s7 = peg$parsecte_column_definition();
                                    if (s7 !== peg$FAILED) {
                                        s8 = peg$parse__();
                                        if (s8 !== peg$FAILED) {
                                            s9 = peg$parseindex_options();
                                            if (s9 === peg$FAILED) {
                                                s9 = null;
                                            }
                                            if (s9 !== peg$FAILED) {
                                                s10 = peg$parse__();
                                                if (s10 !== peg$FAILED) {
                                                    peg$savedPos = s0;
                                                    s1 = peg$c112(s1, s3, s5, s7, s9);
                                                    s0 = s1;
                                                } else {
                                                    peg$currPos = s0;
                                                    s0 = peg$FAILED;
                                                }
                                            } else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                            }
                                        } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsedefault_expr() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            s1 = peg$parseKW_DEFAULT();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseliteral();
                    if (s3 === peg$FAILED) {
                        s3 = peg$parseexpr();
                    }
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c113(s3);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsekeyword_comment() {
            var s0, s1, s2, s3, s4, s5;
            s0 = peg$currPos;
            s1 = peg$parseKW_COMMENT();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseKW_ASSIGIN_EQUAL();
                    if (s3 === peg$FAILED) {
                        s3 = null;
                    }
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parseliteral_string();
                            if (s5 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c114(s1, s3, s5);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsecollate_expr() {
            var s0, s1, s2, s3, s4, s5;
            s0 = peg$currPos;
            s1 = peg$parseKW_COLLATE();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseKW_ASSIGIN_EQUAL();
                    if (s3 === peg$FAILED) {
                        s3 = null;
                    }
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parseident_name();
                            if (s5 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c115(s3, s5);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsecolumn_format() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 13).toLowerCase() === peg$c116) {
                s1 = input.substr(peg$currPos, 13);
                peg$currPos += 13;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c117);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    if (input.substr(peg$currPos, 5).toLowerCase() === peg$c118) {
                        s3 = input.substr(peg$currPos, 5);
                        peg$currPos += 5;
                    } else {
                        s3 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c119);
                        }
                    }
                    if (s3 === peg$FAILED) {
                        if (input.substr(peg$currPos, 7).toLowerCase() === peg$c120) {
                            s3 = input.substr(peg$currPos, 7);
                            peg$currPos += 7;
                        } else {
                            s3 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c121);
                            }
                        }
                        if (s3 === peg$FAILED) {
                            if (input.substr(peg$currPos, 7).toLowerCase() === peg$c78) {
                                s3 = input.substr(peg$currPos, 7);
                                peg$currPos += 7;
                            } else {
                                s3 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c79);
                                }
                            }
                        }
                    }
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c122(s1, s3);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsestorage() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 7).toLowerCase() === peg$c123) {
                s1 = input.substr(peg$currPos, 7);
                peg$currPos += 7;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c124);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    if (input.substr(peg$currPos, 4).toLowerCase() === peg$c125) {
                        s3 = input.substr(peg$currPos, 4);
                        peg$currPos += 4;
                    } else {
                        s3 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c126);
                        }
                    }
                    if (s3 === peg$FAILED) {
                        if (input.substr(peg$currPos, 6).toLowerCase() === peg$c127) {
                            s3 = input.substr(peg$currPos, 6);
                            peg$currPos += 6;
                        } else {
                            s3 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c128);
                            }
                        }
                    }
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c129(s1, s3);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsereference_definition() {
            var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11;
            s0 = peg$currPos;
            s1 = peg$parseKW_REFERENCES();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parsetable_ref_list();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parsecte_column_definition();
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parse__();
                                if (s6 !== peg$FAILED) {
                                    if (input.substr(peg$currPos, 10).toLowerCase() === peg$c130) {
                                        s7 = input.substr(peg$currPos, 10);
                                        peg$currPos += 10;
                                    } else {
                                        s7 = peg$FAILED;
                                        if (peg$silentFails === 0) {
                                            peg$fail(peg$c131);
                                        }
                                    }
                                    if (s7 === peg$FAILED) {
                                        if (input.substr(peg$currPos, 13).toLowerCase() === peg$c132) {
                                            s7 = input.substr(peg$currPos, 13);
                                            peg$currPos += 13;
                                        } else {
                                            s7 = peg$FAILED;
                                            if (peg$silentFails === 0) {
                                                peg$fail(peg$c133);
                                            }
                                        }
                                        if (s7 === peg$FAILED) {
                                            if (input.substr(peg$currPos, 12).toLowerCase() === peg$c134) {
                                                s7 = input.substr(peg$currPos, 12);
                                                peg$currPos += 12;
                                            } else {
                                                s7 = peg$FAILED;
                                                if (peg$silentFails === 0) {
                                                    peg$fail(peg$c135);
                                                }
                                            }
                                        }
                                    }
                                    if (s7 === peg$FAILED) {
                                        s7 = null;
                                    }
                                    if (s7 !== peg$FAILED) {
                                        s8 = peg$parse__();
                                        if (s8 !== peg$FAILED) {
                                            s9 = peg$parseon_reference();
                                            if (s9 === peg$FAILED) {
                                                s9 = null;
                                            }
                                            if (s9 !== peg$FAILED) {
                                                s10 = peg$parse__();
                                                if (s10 !== peg$FAILED) {
                                                    s11 = peg$parseon_reference();
                                                    if (s11 === peg$FAILED) {
                                                        s11 = null;
                                                    }
                                                    if (s11 !== peg$FAILED) {
                                                        peg$savedPos = s0;
                                                        s1 = peg$c136(s1, s3, s5, s7, s9, s11);
                                                        s0 = s1;
                                                    } else {
                                                        peg$currPos = s0;
                                                        s0 = peg$FAILED;
                                                    }
                                                } else {
                                                    peg$currPos = s0;
                                                    s0 = peg$FAILED;
                                                }
                                            } else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                            }
                                        } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsetable_option() {
            var s0, s1, s2, s3, s4, s5, s6, s7, s8;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 14).toLowerCase() === peg$c96) {
                s1 = input.substr(peg$currPos, 14);
                peg$currPos += 14;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c97);
                }
            }
            if (s1 === peg$FAILED) {
                if (input.substr(peg$currPos, 14).toLowerCase() === peg$c137) {
                    s1 = input.substr(peg$currPos, 14);
                    peg$currPos += 14;
                } else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c138);
                    }
                }
                if (s1 === peg$FAILED) {
                    if (input.substr(peg$currPos, 14).toLowerCase() === peg$c139) {
                        s1 = input.substr(peg$currPos, 14);
                        peg$currPos += 14;
                    } else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c140);
                        }
                    }
                    if (s1 === peg$FAILED) {
                        if (input.substr(peg$currPos, 8).toLowerCase() === peg$c141) {
                            s1 = input.substr(peg$currPos, 8);
                            peg$currPos += 8;
                        } else {
                            s1 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c142);
                            }
                        }
                        if (s1 === peg$FAILED) {
                            if (input.substr(peg$currPos, 8).toLowerCase() === peg$c143) {
                                s1 = input.substr(peg$currPos, 8);
                                peg$currPos += 8;
                            } else {
                                s1 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c144);
                                }
                            }
                            if (s1 === peg$FAILED) {
                                if (input.substr(peg$currPos, 18).toLowerCase() === peg$c145) {
                                    s1 = input.substr(peg$currPos, 18);
                                    peg$currPos += 18;
                                } else {
                                    s1 = peg$FAILED;
                                    if (peg$silentFails === 0) {
                                        peg$fail(peg$c146);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseKW_ASSIGIN_EQUAL();
                    if (s3 === peg$FAILED) {
                        s3 = null;
                    }
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parseliteral_numeric();
                            if (s5 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c147(s1, s3, s5);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$parsecreate_option_character_set();
                if (s0 === peg$FAILED) {
                    s0 = peg$currPos;
                    s1 = peg$parseKW_COMMENT();
                    if (s1 === peg$FAILED) {
                        if (input.substr(peg$currPos, 10).toLowerCase() === peg$c148) {
                            s1 = input.substr(peg$currPos, 10);
                            peg$currPos += 10;
                        } else {
                            s1 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c149);
                            }
                        }
                    }
                    if (s1 !== peg$FAILED) {
                        s2 = peg$parse__();
                        if (s2 !== peg$FAILED) {
                            s3 = peg$parseKW_ASSIGIN_EQUAL();
                            if (s3 === peg$FAILED) {
                                s3 = null;
                            }
                            if (s3 !== peg$FAILED) {
                                s4 = peg$parse__();
                                if (s4 !== peg$FAILED) {
                                    s5 = peg$parseliteral_string();
                                    if (s5 !== peg$FAILED) {
                                        peg$savedPos = s0;
                                        s1 = peg$c150(s1, s3, s5);
                                        s0 = s1;
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                    if (s0 === peg$FAILED) {
                        s0 = peg$currPos;
                        if (input.substr(peg$currPos, 11).toLowerCase() === peg$c151) {
                            s1 = input.substr(peg$currPos, 11);
                            peg$currPos += 11;
                        } else {
                            s1 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c152);
                            }
                        }
                        if (s1 !== peg$FAILED) {
                            s2 = peg$parse__();
                            if (s2 !== peg$FAILED) {
                                s3 = peg$parseKW_ASSIGIN_EQUAL();
                                if (s3 === peg$FAILED) {
                                    s3 = null;
                                }
                                if (s3 !== peg$FAILED) {
                                    s4 = peg$parse__();
                                    if (s4 !== peg$FAILED) {
                                        s5 = peg$currPos;
                                        if (input.charCodeAt(peg$currPos) === 39) {
                                            s6 = peg$c153;
                                            peg$currPos++;
                                        } else {
                                            s6 = peg$FAILED;
                                            if (peg$silentFails === 0) {
                                                peg$fail(peg$c154);
                                            }
                                        }
                                        if (s6 !== peg$FAILED) {
                                            if (input.substr(peg$currPos, 4).toLowerCase() === peg$c155) {
                                                s7 = input.substr(peg$currPos, 4);
                                                peg$currPos += 4;
                                            } else {
                                                s7 = peg$FAILED;
                                                if (peg$silentFails === 0) {
                                                    peg$fail(peg$c156);
                                                }
                                            }
                                            if (s7 === peg$FAILED) {
                                                if (input.substr(peg$currPos, 3).toLowerCase() === peg$c157) {
                                                    s7 = input.substr(peg$currPos, 3);
                                                    peg$currPos += 3;
                                                } else {
                                                    s7 = peg$FAILED;
                                                    if (peg$silentFails === 0) {
                                                        peg$fail(peg$c158);
                                                    }
                                                }
                                                if (s7 === peg$FAILED) {
                                                    if (input.substr(peg$currPos, 4).toLowerCase() === peg$c89) {
                                                        s7 = input.substr(peg$currPos, 4);
                                                        peg$currPos += 4;
                                                    } else {
                                                        s7 = peg$FAILED;
                                                        if (peg$silentFails === 0) {
                                                            peg$fail(peg$c90);
                                                        }
                                                    }
                                                }
                                            }
                                            if (s7 !== peg$FAILED) {
                                                if (input.charCodeAt(peg$currPos) === 39) {
                                                    s8 = peg$c153;
                                                    peg$currPos++;
                                                } else {
                                                    s8 = peg$FAILED;
                                                    if (peg$silentFails === 0) {
                                                        peg$fail(peg$c154);
                                                    }
                                                }
                                                if (s8 !== peg$FAILED) {
                                                    s6 = [s6, s7, s8];
                                                    s5 = s6;
                                                } else {
                                                    peg$currPos = s5;
                                                    s5 = peg$FAILED;
                                                }
                                            } else {
                                                peg$currPos = s5;
                                                s5 = peg$FAILED;
                                            }
                                        } else {
                                            peg$currPos = s5;
                                            s5 = peg$FAILED;
                                        }
                                        if (s5 !== peg$FAILED) {
                                            peg$savedPos = s0;
                                            s1 = peg$c159(s1, s3, s5);
                                            s0 = s1;
                                        } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                        if (s0 === peg$FAILED) {
                            s0 = peg$currPos;
                            if (input.substr(peg$currPos, 6).toLowerCase() === peg$c160) {
                                s1 = input.substr(peg$currPos, 6);
                                peg$currPos += 6;
                            } else {
                                s1 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c161);
                                }
                            }
                            if (s1 !== peg$FAILED) {
                                s2 = peg$parse__();
                                if (s2 !== peg$FAILED) {
                                    s3 = peg$parseKW_ASSIGIN_EQUAL();
                                    if (s3 === peg$FAILED) {
                                        s3 = null;
                                    }
                                    if (s3 !== peg$FAILED) {
                                        s4 = peg$parse__();
                                        if (s4 !== peg$FAILED) {
                                            s5 = peg$parseident_name();
                                            if (s5 !== peg$FAILED) {
                                                peg$savedPos = s0;
                                                s1 = peg$c162(s1, s3, s5);
                                                s0 = s1;
                                            } else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                            }
                                        } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        }
                    }
                }
            }
            return s0;
        }
        function peg$parsecreate_like_table_simple() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            s1 = peg$parseKW_LIKE();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parsetable_ref_list();
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c163(s3);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsecreate_option_character_set() {
            var s0, s1, s2, s3, s4, s5, s6, s7;
            s0 = peg$currPos;
            s1 = peg$parseKW_DEFAULT();
            if (s1 === peg$FAILED) {
                s1 = null;
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parsecreate_option_character_set_kw();
                    if (s3 === peg$FAILED) {
                        if (input.substr(peg$currPos, 7).toLowerCase() === peg$c164) {
                            s3 = input.substr(peg$currPos, 7);
                            peg$currPos += 7;
                        } else {
                            s3 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c165);
                            }
                        }
                        if (s3 === peg$FAILED) {
                            if (input.substr(peg$currPos, 7).toLowerCase() === peg$c166) {
                                s3 = input.substr(peg$currPos, 7);
                                peg$currPos += 7;
                            } else {
                                s3 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c167);
                                }
                            }
                        }
                    }
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parseKW_ASSIGIN_EQUAL();
                            if (s5 === peg$FAILED) {
                                s5 = null;
                            }
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parse__();
                                if (s6 !== peg$FAILED) {
                                    s7 = peg$parseident_name();
                                    if (s7 !== peg$FAILED) {
                                        peg$savedPos = s0;
                                        s1 = peg$c168(s1, s3, s5, s7);
                                        s0 = s1;
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsealter_action() {
            var s0;
            s0 = peg$parseALTER_ADD_COLUMN();
            if (s0 === peg$FAILED) {
                s0 = peg$parseALTER_DROP_COLUMN();
                if (s0 === peg$FAILED) {
                    s0 = peg$parseALTER_RENAME_TABLE();
                }
            }
            return s0;
        }
        function peg$parselock_type() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 4).toLowerCase() === peg$c169) {
                s1 = input.substr(peg$currPos, 4);
                peg$currPos += 4;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c170);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    if (input.substr(peg$currPos, 5).toLowerCase() === peg$c171) {
                        s3 = input.substr(peg$currPos, 5);
                        peg$currPos += 5;
                    } else {
                        s3 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c172);
                        }
                    }
                    if (s3 === peg$FAILED) {
                        s3 = null;
                    }
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c173(s3);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                if (input.substr(peg$currPos, 12).toLowerCase() === peg$c174) {
                    s1 = input.substr(peg$currPos, 12);
                    peg$currPos += 12;
                } else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c175);
                    }
                }
                if (s1 === peg$FAILED) {
                    s1 = null;
                }
                if (s1 !== peg$FAILED) {
                    s2 = peg$parse__();
                    if (s2 !== peg$FAILED) {
                        if (input.substr(peg$currPos, 5).toLowerCase() === peg$c176) {
                            s3 = input.substr(peg$currPos, 5);
                            peg$currPos += 5;
                        } else {
                            s3 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c177);
                            }
                        }
                        if (s3 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c178(s1);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            return s0;
        }
        function peg$parseshow_grant_for_using() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            s1 = peg$parseKW_USING();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseshow_grant_for_using_list();
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c179(s3);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseshow_grant_for_using_list() {
            var s0, s1, s2, s3, s4, s5, s6, s7;
            s0 = peg$currPos;
            s1 = peg$parseident();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                s4 = peg$parse__();
                if (s4 !== peg$FAILED) {
                    s5 = peg$parseCOMMA();
                    if (s5 !== peg$FAILED) {
                        s6 = peg$parse__();
                        if (s6 !== peg$FAILED) {
                            s7 = peg$parseident();
                            if (s7 !== peg$FAILED) {
                                s4 = [s4, s5, s6, s7];
                                s3 = s4;
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$currPos;
                    s4 = peg$parse__();
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parseCOMMA();
                        if (s5 !== peg$FAILED) {
                            s6 = peg$parse__();
                            if (s6 !== peg$FAILED) {
                                s7 = peg$parseident();
                                if (s7 !== peg$FAILED) {
                                    s4 = [s4, s5, s6, s7];
                                    s3 = s4;
                                } else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c69(s1, s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsecreate_constraint_primary() {
            var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;
            s0 = peg$currPos;
            s1 = peg$parseconstraint_name();
            if (s1 === peg$FAILED) {
                s1 = null;
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$currPos;
                    if (input.substr(peg$currPos, 7).toLowerCase() === peg$c100) {
                        s4 = input.substr(peg$currPos, 7);
                        peg$currPos += 7;
                    } else {
                        s4 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c101);
                        }
                    }
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parse__();
                        if (s5 !== peg$FAILED) {
                            if (input.substr(peg$currPos, 3).toLowerCase() === peg$c102) {
                                s6 = input.substr(peg$currPos, 3);
                                peg$currPos += 3;
                            } else {
                                s6 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c103);
                                }
                            }
                            if (s6 !== peg$FAILED) {
                                s4 = [s4, s5, s6];
                                s3 = s4;
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parseindex_type();
                            if (s5 === peg$FAILED) {
                                s5 = null;
                            }
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parse__();
                                if (s6 !== peg$FAILED) {
                                    s7 = peg$parsecte_column_definition();
                                    if (s7 !== peg$FAILED) {
                                        s8 = peg$parse__();
                                        if (s8 !== peg$FAILED) {
                                            s9 = peg$parseindex_options();
                                            if (s9 === peg$FAILED) {
                                                s9 = null;
                                            }
                                            if (s9 !== peg$FAILED) {
                                                peg$savedPos = s0;
                                                s1 = peg$c180(s1, s3, s5, s7, s9);
                                                s0 = s1;
                                            } else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                            }
                                        } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsecreate_constraint_unique() {
            var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13;
            s0 = peg$currPos;
            s1 = peg$parseconstraint_name();
            if (s1 === peg$FAILED) {
                s1 = null;
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseKW_UNIQUE();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parseKW_INDEX();
                            if (s5 === peg$FAILED) {
                                s5 = peg$parseKW_KEY();
                            }
                            if (s5 === peg$FAILED) {
                                s5 = null;
                            }
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parse__();
                                if (s6 !== peg$FAILED) {
                                    s7 = peg$parsecolumn();
                                    if (s7 === peg$FAILED) {
                                        s7 = null;
                                    }
                                    if (s7 !== peg$FAILED) {
                                        s8 = peg$parse__();
                                        if (s8 !== peg$FAILED) {
                                            s9 = peg$parseindex_type();
                                            if (s9 === peg$FAILED) {
                                                s9 = null;
                                            }
                                            if (s9 !== peg$FAILED) {
                                                s10 = peg$parse__();
                                                if (s10 !== peg$FAILED) {
                                                    s11 = peg$parsecte_column_definition();
                                                    if (s11 !== peg$FAILED) {
                                                        s12 = peg$parse__();
                                                        if (s12 !== peg$FAILED) {
                                                            s13 = peg$parseindex_options();
                                                            if (s13 === peg$FAILED) {
                                                                s13 = null;
                                                            }
                                                            if (s13 !== peg$FAILED) {
                                                                peg$savedPos = s0;
                                                                s1 = peg$c181(s1, s3, s5, s7, s9, s11, s13);
                                                                s0 = s1;
                                                            } else {
                                                                peg$currPos = s0;
                                                                s0 = peg$FAILED;
                                                            }
                                                        } else {
                                                            peg$currPos = s0;
                                                            s0 = peg$FAILED;
                                                        }
                                                    } else {
                                                        peg$currPos = s0;
                                                        s0 = peg$FAILED;
                                                    }
                                                } else {
                                                    peg$currPos = s0;
                                                    s0 = peg$FAILED;
                                                }
                                            } else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                            }
                                        } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsecreate_constraint_foreign() {
            var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;
            s0 = peg$currPos;
            s1 = peg$parseconstraint_name();
            if (s1 === peg$FAILED) {
                s1 = null;
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    if (input.substr(peg$currPos, 11).toLowerCase() === peg$c182) {
                        s3 = input.substr(peg$currPos, 11);
                        peg$currPos += 11;
                    } else {
                        s3 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c183);
                        }
                    }
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parsecolumn();
                            if (s5 === peg$FAILED) {
                                s5 = null;
                            }
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parse__();
                                if (s6 !== peg$FAILED) {
                                    s7 = peg$parsecte_column_definition();
                                    if (s7 !== peg$FAILED) {
                                        s8 = peg$parse__();
                                        if (s8 !== peg$FAILED) {
                                            s9 = peg$parsereference_definition();
                                            if (s9 === peg$FAILED) {
                                                s9 = null;
                                            }
                                            if (s9 !== peg$FAILED) {
                                                peg$savedPos = s0;
                                                s1 = peg$c184(s1, s3, s5, s7, s9);
                                                s0 = s1;
                                            } else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                            }
                                        } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsecreate_constraint_check() {
            var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11;
            s0 = peg$currPos;
            s1 = peg$parseconstraint_name();
            if (s1 === peg$FAILED) {
                s1 = null;
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    if (input.substr(peg$currPos, 5).toLowerCase() === peg$c185) {
                        s3 = input.substr(peg$currPos, 5);
                        peg$currPos += 5;
                    } else {
                        s3 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c186);
                        }
                    }
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$currPos;
                            if (input.substr(peg$currPos, 3).toLowerCase() === peg$c187) {
                                s6 = input.substr(peg$currPos, 3);
                                peg$currPos += 3;
                            } else {
                                s6 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c188);
                                }
                            }
                            if (s6 !== peg$FAILED) {
                                s7 = peg$parse__();
                                if (s7 !== peg$FAILED) {
                                    if (input.substr(peg$currPos, 3).toLowerCase() === peg$c108) {
                                        s8 = input.substr(peg$currPos, 3);
                                        peg$currPos += 3;
                                    } else {
                                        s8 = peg$FAILED;
                                        if (peg$silentFails === 0) {
                                            peg$fail(peg$c109);
                                        }
                                    }
                                    if (s8 !== peg$FAILED) {
                                        s9 = peg$parse__();
                                        if (s9 !== peg$FAILED) {
                                            if (input.substr(peg$currPos, 11).toLowerCase() === peg$c189) {
                                                s10 = input.substr(peg$currPos, 11);
                                                peg$currPos += 11;
                                            } else {
                                                s10 = peg$FAILED;
                                                if (peg$silentFails === 0) {
                                                    peg$fail(peg$c190);
                                                }
                                            }
                                            if (s10 !== peg$FAILED) {
                                                s11 = peg$parse__();
                                                if (s11 !== peg$FAILED) {
                                                    s6 = [s6, s7, s8, s9, s10, s11];
                                                    s5 = s6;
                                                } else {
                                                    peg$currPos = s5;
                                                    s5 = peg$FAILED;
                                                }
                                            } else {
                                                peg$currPos = s5;
                                                s5 = peg$FAILED;
                                            }
                                        } else {
                                            peg$currPos = s5;
                                            s5 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s5;
                                        s5 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s5;
                                    s5 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s5;
                                s5 = peg$FAILED;
                            }
                            if (s5 === peg$FAILED) {
                                s5 = null;
                            }
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parseLPAREN();
                                if (s6 !== peg$FAILED) {
                                    s7 = peg$parse__();
                                    if (s7 !== peg$FAILED) {
                                        s8 = peg$parseexpr();
                                        if (s8 !== peg$FAILED) {
                                            s9 = peg$parse__();
                                            if (s9 !== peg$FAILED) {
                                                s10 = peg$parseRPAREN();
                                                if (s10 !== peg$FAILED) {
                                                    peg$savedPos = s0;
                                                    s1 = peg$c191(s1, s3, s5, s8);
                                                    s0 = s1;
                                                } else {
                                                    peg$currPos = s0;
                                                    s0 = peg$FAILED;
                                                }
                                            } else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                            }
                                        } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseindex_type() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            s1 = peg$parseKW_USING();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    if (input.substr(peg$currPos, 5).toLowerCase() === peg$c192) {
                        s3 = input.substr(peg$currPos, 5);
                        peg$currPos += 5;
                    } else {
                        s3 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c193);
                        }
                    }
                    if (s3 === peg$FAILED) {
                        if (input.substr(peg$currPos, 4).toLowerCase() === peg$c194) {
                            s3 = input.substr(peg$currPos, 4);
                            peg$currPos += 4;
                        } else {
                            s3 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c195);
                            }
                        }
                    }
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c196(s3);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsecte_column_definition() {
            var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;
            s0 = peg$currPos;
            s1 = peg$parseLPAREN();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parsecolumn();
                    if (s3 !== peg$FAILED) {
                        s4 = [];
                        s5 = peg$currPos;
                        s6 = peg$parse__();
                        if (s6 !== peg$FAILED) {
                            s7 = peg$parseCOMMA();
                            if (s7 !== peg$FAILED) {
                                s8 = peg$parse__();
                                if (s8 !== peg$FAILED) {
                                    s9 = peg$parsecolumn();
                                    if (s9 !== peg$FAILED) {
                                        s6 = [s6, s7, s8, s9];
                                        s5 = s6;
                                    } else {
                                        peg$currPos = s5;
                                        s5 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s5;
                                    s5 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s5;
                                s5 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s5;
                            s5 = peg$FAILED;
                        }
                        while (s5 !== peg$FAILED) {
                            s4.push(s5);
                            s5 = peg$currPos;
                            s6 = peg$parse__();
                            if (s6 !== peg$FAILED) {
                                s7 = peg$parseCOMMA();
                                if (s7 !== peg$FAILED) {
                                    s8 = peg$parse__();
                                    if (s8 !== peg$FAILED) {
                                        s9 = peg$parsecolumn();
                                        if (s9 !== peg$FAILED) {
                                            s6 = [s6, s7, s8, s9];
                                            s5 = s6;
                                        } else {
                                            peg$currPos = s5;
                                            s5 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s5;
                                        s5 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s5;
                                    s5 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s5;
                                s5 = peg$FAILED;
                            }
                        }
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parse__();
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parseRPAREN();
                                if (s6 !== peg$FAILED) {
                                    peg$savedPos = s0;
                                    s1 = peg$c16(s3, s4);
                                    s0 = s1;
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseindex_options() {
            var s0, s1, s2, s3, s4, s5;
            s0 = peg$currPos;
            s1 = peg$parseindex_option();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                s4 = peg$parse__();
                if (s4 !== peg$FAILED) {
                    s5 = peg$parseindex_option();
                    if (s5 !== peg$FAILED) {
                        s4 = [s4, s5];
                        s3 = s4;
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$currPos;
                    s4 = peg$parse__();
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parseindex_option();
                        if (s5 !== peg$FAILED) {
                            s4 = [s4, s5];
                            s3 = s4;
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c197(s1, s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseindex_option() {
            var s0, s1, s2, s3, s4, s5;
            s0 = peg$currPos;
            s1 = peg$parseKW_KEY_BLOCK_SIZE();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseKW_ASSIGIN_EQUAL();
                    if (s3 === peg$FAILED) {
                        s3 = null;
                    }
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parseliteral_numeric();
                            if (s5 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c198(s1, s3, s5);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$parseindex_type();
                if (s0 === peg$FAILED) {
                    s0 = peg$currPos;
                    if (input.substr(peg$currPos, 4).toLowerCase() === peg$c199) {
                        s1 = input.substr(peg$currPos, 4);
                        peg$currPos += 4;
                    } else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c200);
                        }
                    }
                    if (s1 !== peg$FAILED) {
                        s2 = peg$parse__();
                        if (s2 !== peg$FAILED) {
                            if (input.substr(peg$currPos, 6).toLowerCase() === peg$c201) {
                                s3 = input.substr(peg$currPos, 6);
                                peg$currPos += 6;
                            } else {
                                s3 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c202);
                                }
                            }
                            if (s3 !== peg$FAILED) {
                                s4 = peg$parse__();
                                if (s4 !== peg$FAILED) {
                                    s5 = peg$parseident_name();
                                    if (s5 !== peg$FAILED) {
                                        peg$savedPos = s0;
                                        s1 = peg$c203(s5);
                                        s0 = s1;
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                    if (s0 === peg$FAILED) {
                        s0 = peg$currPos;
                        if (input.substr(peg$currPos, 7).toLowerCase() === peg$c204) {
                            s1 = input.substr(peg$currPos, 7);
                            peg$currPos += 7;
                        } else {
                            s1 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c205);
                            }
                        }
                        if (s1 === peg$FAILED) {
                            if (input.substr(peg$currPos, 9).toLowerCase() === peg$c206) {
                                s1 = input.substr(peg$currPos, 9);
                                peg$currPos += 9;
                            } else {
                                s1 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c207);
                                }
                            }
                        }
                        if (s1 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c208(s1);
                        }
                        s0 = s1;
                        if (s0 === peg$FAILED) {
                            s0 = peg$parsekeyword_comment();
                        }
                    }
                }
            }
            return s0;
        }
        function peg$parseon_reference() {
            var s0, s1, s2, s3, s4, s5;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 2).toLowerCase() === peg$c209) {
                s1 = input.substr(peg$currPos, 2);
                peg$currPos += 2;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c210);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    if (input.substr(peg$currPos, 6).toLowerCase() === peg$c211) {
                        s3 = input.substr(peg$currPos, 6);
                        peg$currPos += 6;
                    } else {
                        s3 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c212);
                        }
                    }
                    if (s3 === peg$FAILED) {
                        if (input.substr(peg$currPos, 6).toLowerCase() === peg$c213) {
                            s3 = input.substr(peg$currPos, 6);
                            peg$currPos += 6;
                        } else {
                            s3 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c214);
                            }
                        }
                    }
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parsereference_option();
                            if (s5 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c215(s1, s3, s5);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsecreate_option_character_set_kw() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 9).toLowerCase() === peg$c52) {
                s1 = input.substr(peg$currPos, 9);
                peg$currPos += 9;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c53);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    if (input.substr(peg$currPos, 3).toLowerCase() === peg$c54) {
                        s3 = input.substr(peg$currPos, 3);
                        peg$currPos += 3;
                    } else {
                        s3 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c55);
                        }
                    }
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c216();
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseALTER_ADD_COLUMN() {
            var s0, s1, s2, s3, s4, s5;
            s0 = peg$currPos;
            s1 = peg$parseKW_ADD();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseKW_COLUMN();
                    if (s3 === peg$FAILED) {
                        s3 = null;
                    }
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parsecreate_column_definition();
                            if (s5 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c217(s3, s5);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseALTER_DROP_COLUMN() {
            var s0, s1, s2, s3, s4, s5;
            s0 = peg$currPos;
            s1 = peg$parseKW_DROP();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseKW_COLUMN();
                    if (s3 === peg$FAILED) {
                        s3 = null;
                    }
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parsecolumn_ref();
                            if (s5 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c218(s3, s5);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseALTER_RENAME_TABLE() {
            var s0, s1, s2, s3, s4, s5;
            s0 = peg$currPos;
            s1 = peg$parseKW_RENAME();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseKW_TO();
                    if (s3 === peg$FAILED) {
                        s3 = peg$parseKW_AS();
                    }
                    if (s3 === peg$FAILED) {
                        s3 = null;
                    }
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parseident();
                            if (s5 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c219(s3, s5);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseconstraint_name() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            s1 = peg$parseKW_CONSTRAINT();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseident();
                    if (s3 === peg$FAILED) {
                        s3 = null;
                    }
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c220(s1, s3);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsereference_option() {
            var s0, s1;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 8).toLowerCase() === peg$c221) {
                s1 = input.substr(peg$currPos, 8);
                peg$currPos += 8;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c222);
                }
            }
            if (s1 === peg$FAILED) {
                if (input.substr(peg$currPos, 7).toLowerCase() === peg$c223) {
                    s1 = input.substr(peg$currPos, 7);
                    peg$currPos += 7;
                } else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c224);
                    }
                }
                if (s1 === peg$FAILED) {
                    if (input.substr(peg$currPos, 8).toLowerCase() === peg$c225) {
                        s1 = input.substr(peg$currPos, 8);
                        peg$currPos += 8;
                    } else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c226);
                        }
                    }
                    if (s1 === peg$FAILED) {
                        if (input.substr(peg$currPos, 9).toLowerCase() === peg$c227) {
                            s1 = input.substr(peg$currPos, 9);
                            peg$currPos += 9;
                        } else {
                            s1 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c228);
                            }
                        }
                        if (s1 === peg$FAILED) {
                            if (input.substr(peg$currPos, 11).toLowerCase() === peg$c229) {
                                s1 = input.substr(peg$currPos, 11);
                                peg$currPos += 11;
                            } else {
                                s1 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c230);
                                }
                            }
                        }
                    }
                }
            }
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c231(s1);
            }
            s0 = s1;
            return s0;
        }
        function peg$parseKW_UPDATE() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 6).toLowerCase() === peg$c213) {
                s1 = input.substr(peg$currPos, 6);
                peg$currPos += 6;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c214);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_CREATE() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 6).toLowerCase() === peg$c232) {
                s1 = input.substr(peg$currPos, 6);
                peg$currPos += 6;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c233);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_DELETE() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 6).toLowerCase() === peg$c211) {
                s1 = input.substr(peg$currPos, 6);
                peg$currPos += 6;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c212);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_INSERT() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 6).toLowerCase() === peg$c234) {
                s1 = input.substr(peg$currPos, 6);
                peg$currPos += 6;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c235);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_ASSIGN() {
            var s0;
            if (input.substr(peg$currPos, 2) === peg$c236) {
                s0 = peg$c236;
                peg$currPos += 2;
            } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c237);
                }
            }
            return s0;
        }
        function peg$parseKW_ASSIGIN_EQUAL() {
            var s0;
            if (input.charCodeAt(peg$currPos) === 61) {
                s0 = peg$c18;
                peg$currPos++;
            } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c19);
                }
            }
            return s0;
        }
        function peg$parseKW_RETURN() {
            var s0;
            if (input.substr(peg$currPos, 6).toLowerCase() === peg$c238) {
                s0 = input.substr(peg$currPos, 6);
                peg$currPos += 6;
            } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c239);
                }
            }
            return s0;
        }
        function peg$parseKW_REPLACE() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 7).toLowerCase() === peg$c240) {
                s1 = input.substr(peg$currPos, 7);
                peg$currPos += 7;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c241);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_ANALYZE() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 7).toLowerCase() === peg$c242) {
                s1 = input.substr(peg$currPos, 7);
                peg$currPos += 7;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c243);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_ATTACH() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 6).toLowerCase() === peg$c244) {
                s1 = input.substr(peg$currPos, 6);
                peg$currPos += 6;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c245);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_DATABASE() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 8).toLowerCase() === peg$c246) {
                s1 = input.substr(peg$currPos, 8);
                peg$currPos += 8;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c247);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_RENAME() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 6).toLowerCase() === peg$c248) {
                s1 = input.substr(peg$currPos, 6);
                peg$currPos += 6;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c249);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_SHOW() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 4).toLowerCase() === peg$c250) {
                s1 = input.substr(peg$currPos, 4);
                peg$currPos += 4;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c251);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_DESCRIBE() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 8).toLowerCase() === peg$c252) {
                s1 = input.substr(peg$currPos, 8);
                peg$currPos += 8;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c253);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_VAR__PRE_AT() {
            var s0;
            if (input.charCodeAt(peg$currPos) === 64) {
                s0 = peg$c254;
                peg$currPos++;
            } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c255);
                }
            }
            return s0;
        }
        function peg$parseKW_VAR__PRE_AT_AT() {
            var s0;
            if (input.substr(peg$currPos, 2) === peg$c256) {
                s0 = peg$c256;
                peg$currPos += 2;
            } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c257);
                }
            }
            return s0;
        }
        function peg$parseKW_VAR_PRE_DOLLAR() {
            var s0;
            if (input.charCodeAt(peg$currPos) === 36) {
                s0 = peg$c258;
                peg$currPos++;
            } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c259);
                }
            }
            return s0;
        }
        function peg$parseKW_VAR_PRE() {
            var s0;
            s0 = peg$parseKW_VAR__PRE_AT_AT();
            if (s0 === peg$FAILED) {
                s0 = peg$parseKW_VAR__PRE_AT();
                if (s0 === peg$FAILED) {
                    s0 = peg$parseKW_VAR_PRE_DOLLAR();
                }
            }
            return s0;
        }
        function peg$parseKW_TEMPORARY() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 9).toLowerCase() === peg$c260) {
                s1 = input.substr(peg$currPos, 9);
                peg$currPos += 9;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c261);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_SCHEME() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 6).toLowerCase() === peg$c262) {
                s1 = input.substr(peg$currPos, 6);
                peg$currPos += 6;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c263);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_ALTER() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 5).toLowerCase() === peg$c264) {
                s1 = input.substr(peg$currPos, 5);
                peg$currPos += 5;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c265);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_SPATIAL() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 7).toLowerCase() === peg$c266) {
                s1 = input.substr(peg$currPos, 7);
                peg$currPos += 7;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c267);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_KEY_BLOCK_SIZE() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 14).toLowerCase() === peg$c139) {
                s1 = input.substr(peg$currPos, 14);
                peg$currPos += 14;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c140);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsequery_statement() {
            var s0, s1, s2, s3, s4, s5, s6;
            s0 = peg$parsequery_expr();
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$currPos;
                if (input.charCodeAt(peg$currPos) === 40) {
                    s2 = peg$c268;
                    peg$currPos++;
                } else {
                    s2 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c269);
                    }
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parse__();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parseselect_stmt();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parse__();
                            if (s5 !== peg$FAILED) {
                                if (input.charCodeAt(peg$currPos) === 41) {
                                    s6 = peg$c270;
                                    peg$currPos++;
                                } else {
                                    s6 = peg$FAILED;
                                    if (peg$silentFails === 0) {
                                        peg$fail(peg$c271);
                                    }
                                }
                                if (s6 !== peg$FAILED) {
                                    s2 = [s2, s3, s4, s5, s6];
                                    s1 = s2;
                                } else {
                                    peg$currPos = s1;
                                    s1 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s1;
                                s1 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s1;
                            s1 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s1;
                        s1 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s1;
                    s1 = peg$FAILED;
                }
                if (s1 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c272(s1);
                }
                s0 = s1;
            }
            return s0;
        }
        function peg$parsequery_expr() {
            var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;
            s0 = peg$currPos;
            s1 = peg$parsewith_clause();
            if (s1 === peg$FAILED) {
                s1 = null;
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseunion_stmt();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parseorder_by_clause();
                            if (s5 === peg$FAILED) {
                                s5 = null;
                            }
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parse__();
                                if (s6 !== peg$FAILED) {
                                    s7 = peg$parselimit_clause();
                                    if (s7 === peg$FAILED) {
                                        s7 = null;
                                    }
                                    if (s7 !== peg$FAILED) {
                                        s8 = peg$parse__();
                                        if (s8 !== peg$FAILED) {
                                            s9 = peg$parseSEMICOLON();
                                            if (s9 === peg$FAILED) {
                                                s9 = null;
                                            }
                                            if (s9 !== peg$FAILED) {
                                                peg$savedPos = s0;
                                                s1 = peg$c273(s1, s3, s5, s7, s9);
                                                s0 = s1;
                                            } else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                            }
                                        } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseset_op() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            s1 = peg$parseKW_UNION();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseKW_ALL();
                    if (s3 === peg$FAILED) {
                        s3 = peg$parseKW_DISTINCT();
                    }
                    if (s3 === peg$FAILED) {
                        s3 = null;
                    }
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c274(s1, s3);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                if (input.substr(peg$currPos, 9).toLowerCase() === peg$c275) {
                    s1 = input.substr(peg$currPos, 9);
                    peg$currPos += 9;
                } else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c276);
                    }
                }
                if (s1 === peg$FAILED) {
                    if (input.substr(peg$currPos, 6).toLowerCase() === peg$c277) {
                        s1 = input.substr(peg$currPos, 6);
                        peg$currPos += 6;
                    } else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c278);
                        }
                    }
                }
                if (s1 !== peg$FAILED) {
                    s2 = peg$parse__();
                    if (s2 !== peg$FAILED) {
                        s3 = peg$parseKW_DISTINCT();
                        if (s3 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c279(s1, s3);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            return s0;
        }
        function peg$parseunion_stmt() {
            var s0, s1, s2, s3, s4, s5, s6;
            s0 = peg$parseunion_stmt_nake();
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$currPos;
                if (input.charCodeAt(peg$currPos) === 40) {
                    s2 = peg$c268;
                    peg$currPos++;
                } else {
                    s2 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c269);
                    }
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parse__();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parseunion_stmt_nake();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parse__();
                            if (s5 !== peg$FAILED) {
                                if (input.charCodeAt(peg$currPos) === 41) {
                                    s6 = peg$c270;
                                    peg$currPos++;
                                } else {
                                    s6 = peg$FAILED;
                                    if (peg$silentFails === 0) {
                                        peg$fail(peg$c271);
                                    }
                                }
                                if (s6 !== peg$FAILED) {
                                    s2 = [s2, s3, s4, s5, s6];
                                    s1 = s2;
                                } else {
                                    peg$currPos = s1;
                                    s1 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s1;
                                s1 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s1;
                            s1 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s1;
                        s1 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s1;
                    s1 = peg$FAILED;
                }
                if (s1 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c280(s1);
                }
                s0 = s1;
            }
            return s0;
        }
        function peg$parseunion_stmt_nake() {
            var s0, s1, s2, s3, s4, s5, s6, s7;
            s0 = peg$currPos;
            s1 = peg$parseselect_stmt();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                s4 = peg$parse__();
                if (s4 !== peg$FAILED) {
                    s5 = peg$parseset_op();
                    if (s5 === peg$FAILED) {
                        s5 = null;
                    }
                    if (s5 !== peg$FAILED) {
                        s6 = peg$parse__();
                        if (s6 !== peg$FAILED) {
                            s7 = peg$parseselect_stmt();
                            if (s7 !== peg$FAILED) {
                                s4 = [s4, s5, s6, s7];
                                s3 = s4;
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$currPos;
                    s4 = peg$parse__();
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parseset_op();
                        if (s5 === peg$FAILED) {
                            s5 = null;
                        }
                        if (s5 !== peg$FAILED) {
                            s6 = peg$parse__();
                            if (s6 !== peg$FAILED) {
                                s7 = peg$parseselect_stmt();
                                if (s7 !== peg$FAILED) {
                                    s4 = [s4, s5, s6, s7];
                                    s3 = s4;
                                } else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c281(s1, s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseselect_stmt() {
            var s0, s1, s2, s3, s4, s5, s6;
            s0 = peg$parseselect_stmt_nake();
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$currPos;
                if (input.charCodeAt(peg$currPos) === 40) {
                    s2 = peg$c268;
                    peg$currPos++;
                } else {
                    s2 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c269);
                    }
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parse__();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parseselect_stmt();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parse__();
                            if (s5 !== peg$FAILED) {
                                if (input.charCodeAt(peg$currPos) === 41) {
                                    s6 = peg$c270;
                                    peg$currPos++;
                                } else {
                                    s6 = peg$FAILED;
                                    if (peg$silentFails === 0) {
                                        peg$fail(peg$c271);
                                    }
                                }
                                if (s6 !== peg$FAILED) {
                                    s2 = [s2, s3, s4, s5, s6];
                                    s1 = s2;
                                } else {
                                    peg$currPos = s1;
                                    s1 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s1;
                                s1 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s1;
                            s1 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s1;
                        s1 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s1;
                    s1 = peg$FAILED;
                }
                if (s1 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c282(s1);
                }
                s0 = s1;
            }
            return s0;
        }
        function peg$parsewith_clause() {
            var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;
            s0 = peg$currPos;
            s1 = peg$parseKW_WITH();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parsecte_definition();
                    if (s3 !== peg$FAILED) {
                        s4 = [];
                        s5 = peg$currPos;
                        s6 = peg$parse__();
                        if (s6 !== peg$FAILED) {
                            s7 = peg$parseCOMMA();
                            if (s7 !== peg$FAILED) {
                                s8 = peg$parse__();
                                if (s8 !== peg$FAILED) {
                                    s9 = peg$parsecte_definition();
                                    if (s9 !== peg$FAILED) {
                                        s6 = [s6, s7, s8, s9];
                                        s5 = s6;
                                    } else {
                                        peg$currPos = s5;
                                        s5 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s5;
                                    s5 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s5;
                                s5 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s5;
                            s5 = peg$FAILED;
                        }
                        while (s5 !== peg$FAILED) {
                            s4.push(s5);
                            s5 = peg$currPos;
                            s6 = peg$parse__();
                            if (s6 !== peg$FAILED) {
                                s7 = peg$parseCOMMA();
                                if (s7 !== peg$FAILED) {
                                    s8 = peg$parse__();
                                    if (s8 !== peg$FAILED) {
                                        s9 = peg$parsecte_definition();
                                        if (s9 !== peg$FAILED) {
                                            s6 = [s6, s7, s8, s9];
                                            s5 = s6;
                                        } else {
                                            peg$currPos = s5;
                                            s5 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s5;
                                        s5 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s5;
                                    s5 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s5;
                                s5 = peg$FAILED;
                            }
                        }
                        if (s4 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c16(s3, s4);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsecte_definition() {
            var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;
            s0 = peg$currPos;
            s1 = peg$parseliteral_string();
            if (s1 === peg$FAILED) {
                s1 = peg$parseident_name();
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseKW_AS();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parseLPAREN();
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parse__();
                                if (s6 !== peg$FAILED) {
                                    s7 = peg$parseunion_stmt();
                                    if (s7 !== peg$FAILED) {
                                        s8 = peg$parse__();
                                        if (s8 !== peg$FAILED) {
                                            s9 = peg$parseRPAREN();
                                            if (s9 !== peg$FAILED) {
                                                peg$savedPos = s0;
                                                s1 = peg$c283(s1, s7);
                                                s0 = s1;
                                            } else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                            }
                                        } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseselect_stmt_nake() {
            var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26;
            s0 = peg$currPos;
            s1 = peg$parse__();
            if (s1 !== peg$FAILED) {
                s2 = peg$parsewith_clause();
                if (s2 === peg$FAILED) {
                    s2 = null;
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parse__();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parseKW_SELECT();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parse___();
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parsestruct_value();
                                if (s6 === peg$FAILED) {
                                    s6 = null;
                                }
                                if (s6 !== peg$FAILED) {
                                    s7 = peg$parse__();
                                    if (s7 !== peg$FAILED) {
                                        s8 = peg$parseKW_ALL();
                                        if (s8 === peg$FAILED) {
                                            s8 = peg$parseKW_DISTINCT();
                                        }
                                        if (s8 === peg$FAILED) {
                                            s8 = null;
                                        }
                                        if (s8 !== peg$FAILED) {
                                            s9 = peg$parse__();
                                            if (s9 !== peg$FAILED) {
                                                s10 = peg$parsecolumn_clause();
                                                if (s10 !== peg$FAILED) {
                                                    s11 = peg$parse__();
                                                    if (s11 !== peg$FAILED) {
                                                        s12 = peg$parsefrom_clause();
                                                        if (s12 === peg$FAILED) {
                                                            s12 = null;
                                                        }
                                                        if (s12 !== peg$FAILED) {
                                                            s13 = peg$parse__();
                                                            if (s13 !== peg$FAILED) {
                                                                s14 = peg$parsefor_sys_time_as_of();
                                                                if (s14 === peg$FAILED) {
                                                                    s14 = null;
                                                                }
                                                                if (s14 !== peg$FAILED) {
                                                                    s15 = peg$parse__();
                                                                    if (s15 !== peg$FAILED) {
                                                                        s16 = peg$parsewhere_clause();
                                                                        if (s16 === peg$FAILED) {
                                                                            s16 = null;
                                                                        }
                                                                        if (s16 !== peg$FAILED) {
                                                                            s17 = peg$parse__();
                                                                            if (s17 !== peg$FAILED) {
                                                                                s18 = peg$parsegroup_by_clause();
                                                                                if (s18 === peg$FAILED) {
                                                                                    s18 = null;
                                                                                }
                                                                                if (s18 !== peg$FAILED) {
                                                                                    s19 = peg$parse__();
                                                                                    if (s19 !== peg$FAILED) {
                                                                                        s20 = peg$parsehaving_clause();
                                                                                        if (s20 === peg$FAILED) {
                                                                                            s20 = null;
                                                                                        }
                                                                                        if (s20 !== peg$FAILED) {
                                                                                            s21 = peg$parse__();
                                                                                            if (s21 !== peg$FAILED) {
                                                                                                s22 = peg$parseorder_by_clause();
                                                                                                if (s22 === peg$FAILED) {
                                                                                                    s22 = null;
                                                                                                }
                                                                                                if (s22 !== peg$FAILED) {
                                                                                                    s23 = peg$parse__();
                                                                                                    if (s23 !== peg$FAILED) {
                                                                                                        s24 = peg$parselimit_clause();
                                                                                                        if (s24 === peg$FAILED) {
                                                                                                            s24 = null;
                                                                                                        }
                                                                                                        if (s24 !== peg$FAILED) {
                                                                                                            s25 = peg$parse__();
                                                                                                            if (s25 !== peg$FAILED) {
                                                                                                                s26 = peg$parsewindow_clause();
                                                                                                                if (s26 === peg$FAILED) {
                                                                                                                    s26 = null;
                                                                                                                }
                                                                                                                if (s26 !== peg$FAILED) {
                                                                                                                    peg$savedPos = s0;
                                                                                                                    s1 = peg$c284(s2, s6, s8, s10, s12, s14, s16, s18, s20, s22, s24, s26);
                                                                                                                    s0 = s1;
                                                                                                                } else {
                                                                                                                    peg$currPos = s0;
                                                                                                                    s0 = peg$FAILED;
                                                                                                                }
                                                                                                            } else {
                                                                                                                peg$currPos = s0;
                                                                                                                s0 = peg$FAILED;
                                                                                                            }
                                                                                                        } else {
                                                                                                            peg$currPos = s0;
                                                                                                            s0 = peg$FAILED;
                                                                                                        }
                                                                                                    } else {
                                                                                                        peg$currPos = s0;
                                                                                                        s0 = peg$FAILED;
                                                                                                    }
                                                                                                } else {
                                                                                                    peg$currPos = s0;
                                                                                                    s0 = peg$FAILED;
                                                                                                }
                                                                                            } else {
                                                                                                peg$currPos = s0;
                                                                                                s0 = peg$FAILED;
                                                                                            }
                                                                                        } else {
                                                                                            peg$currPos = s0;
                                                                                            s0 = peg$FAILED;
                                                                                        }
                                                                                    } else {
                                                                                        peg$currPos = s0;
                                                                                        s0 = peg$FAILED;
                                                                                    }
                                                                                } else {
                                                                                    peg$currPos = s0;
                                                                                    s0 = peg$FAILED;
                                                                                }
                                                                            } else {
                                                                                peg$currPos = s0;
                                                                                s0 = peg$FAILED;
                                                                            }
                                                                        } else {
                                                                            peg$currPos = s0;
                                                                            s0 = peg$FAILED;
                                                                        }
                                                                    } else {
                                                                        peg$currPos = s0;
                                                                        s0 = peg$FAILED;
                                                                    }
                                                                } else {
                                                                    peg$currPos = s0;
                                                                    s0 = peg$FAILED;
                                                                }
                                                            } else {
                                                                peg$currPos = s0;
                                                                s0 = peg$FAILED;
                                                            }
                                                        } else {
                                                            peg$currPos = s0;
                                                            s0 = peg$FAILED;
                                                        }
                                                    } else {
                                                        peg$currPos = s0;
                                                        s0 = peg$FAILED;
                                                    }
                                                } else {
                                                    peg$currPos = s0;
                                                    s0 = peg$FAILED;
                                                }
                                            } else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                            }
                                        } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsefor_sys_time_as_of() {
            var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 3).toLowerCase() === peg$c108) {
                s1 = input.substr(peg$currPos, 3);
                peg$currPos += 3;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c109);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    if (input.substr(peg$currPos, 11).toLowerCase() === peg$c285) {
                        s3 = input.substr(peg$currPos, 11);
                        peg$currPos += 11;
                    } else {
                        s3 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c286);
                        }
                    }
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            if (input.substr(peg$currPos, 2).toLowerCase() === peg$c287) {
                                s5 = input.substr(peg$currPos, 2);
                                peg$currPos += 2;
                            } else {
                                s5 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c288);
                                }
                            }
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parse__();
                                if (s6 !== peg$FAILED) {
                                    if (input.substr(peg$currPos, 2).toLowerCase() === peg$c289) {
                                        s7 = input.substr(peg$currPos, 2);
                                        peg$currPos += 2;
                                    } else {
                                        s7 = peg$FAILED;
                                        if (peg$silentFails === 0) {
                                            peg$fail(peg$c290);
                                        }
                                    }
                                    if (s7 !== peg$FAILED) {
                                        s8 = peg$parse__();
                                        if (s8 !== peg$FAILED) {
                                            s9 = peg$parseexpr();
                                            if (s9 !== peg$FAILED) {
                                                peg$savedPos = s0;
                                                s1 = peg$c291(s9);
                                                s0 = s1;
                                            } else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                            }
                                        } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsestruct_value() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            s1 = peg$parseKW_AS();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseKW_STRUCT();
                    if (s3 === peg$FAILED) {
                        s3 = peg$parseKW_VALUE();
                    }
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c292(s1, s3);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseexpr_alias() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            s1 = peg$parseexpr();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parsealias_clause();
                    if (s3 === peg$FAILED) {
                        s3 = null;
                    }
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c293(s1, s3);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsecolumn_clause() {
            var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;
            s0 = peg$currPos;
            s1 = peg$parseSTAR();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    if (input.substr(peg$currPos, 6).toLowerCase() === peg$c277) {
                        s3 = input.substr(peg$currPos, 6);
                        peg$currPos += 6;
                    } else {
                        s3 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c278);
                        }
                    }
                    if (s3 === peg$FAILED) {
                        if (input.substr(peg$currPos, 7).toLowerCase() === peg$c240) {
                            s3 = input.substr(peg$currPos, 7);
                            peg$currPos += 7;
                        } else {
                            s3 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c241);
                            }
                        }
                    }
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parseLPAREN();
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parse__();
                                if (s6 !== peg$FAILED) {
                                    s7 = peg$parsecolumns_list();
                                    if (s7 !== peg$FAILED) {
                                        s8 = peg$parse__();
                                        if (s8 !== peg$FAILED) {
                                            s9 = peg$parseRPAREN();
                                            if (s9 !== peg$FAILED) {
                                                peg$savedPos = s0;
                                                s1 = peg$c294(s3, s7);
                                                s0 = s1;
                                            } else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                            }
                                        } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parseKW_ALL();
                if (s1 === peg$FAILED) {
                    s1 = peg$currPos;
                    s2 = peg$parseSTAR();
                    if (s2 !== peg$FAILED) {
                        s3 = peg$currPos;
                        peg$silentFails++;
                        s4 = peg$parseident_start();
                        peg$silentFails--;
                        if (s4 === peg$FAILED) {
                            s3 = void 0;
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                        if (s3 !== peg$FAILED) {
                            s2 = [s2, s3];
                            s1 = s2;
                        } else {
                            peg$currPos = s1;
                            s1 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s1;
                        s1 = peg$FAILED;
                    }
                    if (s1 === peg$FAILED) {
                        s1 = peg$parseSTAR();
                    }
                }
                if (s1 !== peg$FAILED) {
                    s2 = [];
                    s3 = peg$currPos;
                    s4 = peg$parse__();
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parseCOMMA();
                        if (s5 !== peg$FAILED) {
                            s6 = peg$parse__();
                            if (s6 !== peg$FAILED) {
                                s7 = peg$parsecolumn_list_item();
                                if (s7 !== peg$FAILED) {
                                    s4 = [s4, s5, s6, s7];
                                    s3 = s4;
                                } else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                    while (s3 !== peg$FAILED) {
                        s2.push(s3);
                        s3 = peg$currPos;
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parseCOMMA();
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parse__();
                                if (s6 !== peg$FAILED) {
                                    s7 = peg$parsecolumn_list_item();
                                    if (s7 !== peg$FAILED) {
                                        s4 = [s4, s5, s6, s7];
                                        s3 = s4;
                                    } else {
                                        peg$currPos = s3;
                                        s3 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    }
                    if (s2 !== peg$FAILED) {
                        s3 = peg$parse__();
                        if (s3 !== peg$FAILED) {
                            s4 = peg$parseCOMMA();
                            if (s4 === peg$FAILED) {
                                s4 = null;
                            }
                            if (s4 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c295(s1, s2);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
                if (s0 === peg$FAILED) {
                    s0 = peg$currPos;
                    s1 = peg$parsecolumns_list();
                    if (s1 !== peg$FAILED) {
                        s2 = peg$parse__();
                        if (s2 !== peg$FAILED) {
                            s3 = peg$parseCOMMA();
                            if (s3 === peg$FAILED) {
                                s3 = null;
                            }
                            if (s3 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c296(s1);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
            }
            return s0;
        }
        function peg$parsecolumns_list() {
            var s0, s1, s2, s3, s4, s5, s6, s7;
            s0 = peg$currPos;
            s1 = peg$parsecolumn_list_item();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                s4 = peg$parse__();
                if (s4 !== peg$FAILED) {
                    s5 = peg$parseCOMMA();
                    if (s5 !== peg$FAILED) {
                        s6 = peg$parse__();
                        if (s6 !== peg$FAILED) {
                            s7 = peg$parsecolumn_list_item();
                            if (s7 !== peg$FAILED) {
                                s4 = [s4, s5, s6, s7];
                                s3 = s4;
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$currPos;
                    s4 = peg$parse__();
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parseCOMMA();
                        if (s5 !== peg$FAILED) {
                            s6 = peg$parse__();
                            if (s6 !== peg$FAILED) {
                                s7 = peg$parsecolumn_list_item();
                                if (s7 !== peg$FAILED) {
                                    s4 = [s4, s5, s6, s7];
                                    s3 = s4;
                                } else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c16(s1, s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsecolumn_offset_expr() {
            var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13;
            s0 = peg$currPos;
            s1 = peg$parseexpr();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseLBRAKE();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parseKW_OFFSET();
                            if (s5 === peg$FAILED) {
                                s5 = peg$parseKW_ORDINAL();
                            }
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parse__();
                                if (s6 !== peg$FAILED) {
                                    s7 = peg$parseLPAREN();
                                    if (s7 !== peg$FAILED) {
                                        s8 = peg$parse__();
                                        if (s8 !== peg$FAILED) {
                                            s9 = peg$parseliteral_numeric();
                                            if (s9 !== peg$FAILED) {
                                                s10 = peg$parse__();
                                                if (s10 !== peg$FAILED) {
                                                    s11 = peg$parseRPAREN();
                                                    if (s11 !== peg$FAILED) {
                                                        s12 = peg$parse__();
                                                        if (s12 !== peg$FAILED) {
                                                            s13 = peg$parseRBRAKE();
                                                            if (s13 !== peg$FAILED) {
                                                                peg$savedPos = s0;
                                                                s1 = peg$c297(s1, s5, s9);
                                                                s0 = s1;
                                                            } else {
                                                                peg$currPos = s0;
                                                                s0 = peg$FAILED;
                                                            }
                                                        } else {
                                                            peg$currPos = s0;
                                                            s0 = peg$FAILED;
                                                        }
                                                    } else {
                                                        peg$currPos = s0;
                                                        s0 = peg$FAILED;
                                                    }
                                                } else {
                                                    peg$currPos = s0;
                                                    s0 = peg$FAILED;
                                                }
                                            } else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                            }
                                        } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsecolumn_list_item() {
            var s0, s1, s2, s3, s4, s5, s6, s7;
            s0 = peg$currPos;
            s1 = peg$parseSTAR();
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c298(s1);
            }
            s0 = s1;
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parseident();
                if (s1 !== peg$FAILED) {
                    s2 = peg$parse__();
                    if (s2 !== peg$FAILED) {
                        s3 = peg$parseDOT();
                        if (s3 !== peg$FAILED) {
                            s4 = peg$currPos;
                            s5 = peg$parsecolumn_offset_expr();
                            if (s5 === peg$FAILED) {
                                s5 = peg$parseident();
                            }
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parse__();
                                if (s6 !== peg$FAILED) {
                                    s7 = peg$parseDOT();
                                    if (s7 !== peg$FAILED) {
                                        s5 = [s5, s6, s7];
                                        s4 = s5;
                                    } else {
                                        peg$currPos = s4;
                                        s4 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s4;
                                    s4 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s4;
                                s4 = peg$FAILED;
                            }
                            if (s4 === peg$FAILED) {
                                s4 = null;
                            }
                            if (s4 !== peg$FAILED) {
                                s5 = peg$parse__();
                                if (s5 !== peg$FAILED) {
                                    s6 = peg$parseSTAR();
                                    if (s6 !== peg$FAILED) {
                                        peg$savedPos = s0;
                                        s1 = peg$c299(s1, s4);
                                        s0 = s1;
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
                if (s0 === peg$FAILED) {
                    s0 = peg$currPos;
                    s1 = peg$parsecolumn_offset_expr();
                    if (s1 !== peg$FAILED) {
                        s2 = peg$parse__();
                        if (s2 !== peg$FAILED) {
                            s3 = peg$parsealias_clause();
                            if (s3 === peg$FAILED) {
                                s3 = null;
                            }
                            if (s3 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c300(s1, s3);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                    if (s0 === peg$FAILED) {
                        s0 = peg$parseexpr_alias();
                    }
                }
            }
            return s0;
        }
        function peg$parsealias_clause() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            s1 = peg$parseKW_AS();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parsealias_ident();
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c301(s3);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parseKW_AS();
                if (s1 === peg$FAILED) {
                    s1 = null;
                }
                if (s1 !== peg$FAILED) {
                    s2 = peg$parse__();
                    if (s2 !== peg$FAILED) {
                        s3 = peg$parseident();
                        if (s3 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c301(s3);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            return s0;
        }
        function peg$parsefrom_unnest_item() {
            var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 6).toLowerCase() === peg$c302) {
                s1 = input.substr(peg$currPos, 6);
                peg$currPos += 6;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c303);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseLPAREN();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parseexpr();
                            if (s5 === peg$FAILED) {
                                s5 = null;
                            }
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parse__();
                                if (s6 !== peg$FAILED) {
                                    s7 = peg$parseRPAREN();
                                    if (s7 !== peg$FAILED) {
                                        s8 = peg$parse__();
                                        if (s8 !== peg$FAILED) {
                                            s9 = peg$parsealias_clause();
                                            if (s9 === peg$FAILED) {
                                                s9 = null;
                                            }
                                            if (s9 !== peg$FAILED) {
                                                s10 = peg$parse__();
                                                if (s10 !== peg$FAILED) {
                                                    s11 = peg$parsewith_offset();
                                                    if (s11 === peg$FAILED) {
                                                        s11 = null;
                                                    }
                                                    if (s11 !== peg$FAILED) {
                                                        peg$savedPos = s0;
                                                        s1 = peg$c304(s5, s9, s11);
                                                        s0 = s1;
                                                    } else {
                                                        peg$currPos = s0;
                                                        s0 = peg$FAILED;
                                                    }
                                                } else {
                                                    peg$currPos = s0;
                                                    s0 = peg$FAILED;
                                                }
                                            } else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                            }
                                        } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsefrom_clause() {
            var s0, s1, s2, s3, s4, s5;
            s0 = peg$currPos;
            s1 = peg$parseKW_FROM();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parsetable_ref_list();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parsepivot_operator();
                            if (s5 === peg$FAILED) {
                                s5 = null;
                            }
                            if (s5 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c305(s3, s5);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsepivot_operator() {
            var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15;
            s0 = peg$currPos;
            s1 = peg$parseKW_PIVOT();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseLPAREN();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parseaggr_func_list();
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parse__();
                                if (s6 !== peg$FAILED) {
                                    if (input.substr(peg$currPos, 3).toLowerCase() === peg$c108) {
                                        s7 = input.substr(peg$currPos, 3);
                                        peg$currPos += 3;
                                    } else {
                                        s7 = peg$FAILED;
                                        if (peg$silentFails === 0) {
                                            peg$fail(peg$c109);
                                        }
                                    }
                                    if (s7 !== peg$FAILED) {
                                        s8 = peg$parse__();
                                        if (s8 !== peg$FAILED) {
                                            s9 = peg$parsecolumn_ref();
                                            if (s9 !== peg$FAILED) {
                                                s10 = peg$parse__();
                                                if (s10 !== peg$FAILED) {
                                                    s11 = peg$parsein_op_right();
                                                    if (s11 !== peg$FAILED) {
                                                        s12 = peg$parse__();
                                                        if (s12 !== peg$FAILED) {
                                                            s13 = peg$parseRPAREN();
                                                            if (s13 !== peg$FAILED) {
                                                                s14 = peg$parse__();
                                                                if (s14 !== peg$FAILED) {
                                                                    s15 = peg$parsealias_clause();
                                                                    if (s15 === peg$FAILED) {
                                                                        s15 = null;
                                                                    }
                                                                    if (s15 !== peg$FAILED) {
                                                                        peg$savedPos = s0;
                                                                        s1 = peg$c306(s5, s9, s11, s15);
                                                                        s0 = s1;
                                                                    } else {
                                                                        peg$currPos = s0;
                                                                        s0 = peg$FAILED;
                                                                    }
                                                                } else {
                                                                    peg$currPos = s0;
                                                                    s0 = peg$FAILED;
                                                                }
                                                            } else {
                                                                peg$currPos = s0;
                                                                s0 = peg$FAILED;
                                                            }
                                                        } else {
                                                            peg$currPos = s0;
                                                            s0 = peg$FAILED;
                                                        }
                                                    } else {
                                                        peg$currPos = s0;
                                                        s0 = peg$FAILED;
                                                    }
                                                } else {
                                                    peg$currPos = s0;
                                                    s0 = peg$FAILED;
                                                }
                                            } else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                            }
                                        } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsewith_offset() {
            var s0, s1, s2, s3, s4, s5;
            s0 = peg$currPos;
            s1 = peg$parseKW_WITH();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseKW_OFFSET();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parsealias_clause();
                            if (s5 === peg$FAILED) {
                                s5 = null;
                            }
                            if (s5 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c307(s5);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsetable_to_list() {
            var s0, s1, s2, s3, s4, s5, s6, s7;
            s0 = peg$currPos;
            s1 = peg$parsetable_to_item();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                s4 = peg$parse__();
                if (s4 !== peg$FAILED) {
                    s5 = peg$parseCOMMA();
                    if (s5 !== peg$FAILED) {
                        s6 = peg$parse__();
                        if (s6 !== peg$FAILED) {
                            s7 = peg$parsetable_to_item();
                            if (s7 !== peg$FAILED) {
                                s4 = [s4, s5, s6, s7];
                                s3 = s4;
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$currPos;
                    s4 = peg$parse__();
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parseCOMMA();
                        if (s5 !== peg$FAILED) {
                            s6 = peg$parse__();
                            if (s6 !== peg$FAILED) {
                                s7 = peg$parsetable_to_item();
                                if (s7 !== peg$FAILED) {
                                    s4 = [s4, s5, s6, s7];
                                    s3 = s4;
                                } else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c16(s1, s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsetable_to_item() {
            var s0, s1, s2, s3, s4, s5;
            s0 = peg$currPos;
            s1 = peg$parsetable_name();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseKW_TO();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parsetable_name();
                            if (s5 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c308(s1, s5);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsetable_ref_list() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            s1 = peg$parsetable_base();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$parsetable_ref();
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$parsetable_ref();
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c309(s1, s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsetable_ref() {
            var s0, s1, s2, s3, s4;
            s0 = peg$currPos;
            s1 = peg$parse__();
            if (s1 !== peg$FAILED) {
                s2 = peg$parseCOMMA();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parse__();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parsetable_base();
                        if (s4 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c310(s4);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parse__();
                if (s1 !== peg$FAILED) {
                    s2 = peg$parsetable_join();
                    if (s2 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c310(s2);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            return s0;
        }
        function peg$parsetable_join() {
            var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15;
            s0 = peg$currPos;
            s1 = peg$parsejoin_op();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parsetable_base();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parseKW_USING();
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parse__();
                                if (s6 !== peg$FAILED) {
                                    s7 = peg$parseLPAREN();
                                    if (s7 !== peg$FAILED) {
                                        s8 = peg$parse__();
                                        if (s8 !== peg$FAILED) {
                                            s9 = peg$parseident_name();
                                            if (s9 !== peg$FAILED) {
                                                s10 = [];
                                                s11 = peg$currPos;
                                                s12 = peg$parse__();
                                                if (s12 !== peg$FAILED) {
                                                    s13 = peg$parseCOMMA();
                                                    if (s13 !== peg$FAILED) {
                                                        s14 = peg$parse__();
                                                        if (s14 !== peg$FAILED) {
                                                            s15 = peg$parseident_name();
                                                            if (s15 !== peg$FAILED) {
                                                                s12 = [s12, s13, s14, s15];
                                                                s11 = s12;
                                                            } else {
                                                                peg$currPos = s11;
                                                                s11 = peg$FAILED;
                                                            }
                                                        } else {
                                                            peg$currPos = s11;
                                                            s11 = peg$FAILED;
                                                        }
                                                    } else {
                                                        peg$currPos = s11;
                                                        s11 = peg$FAILED;
                                                    }
                                                } else {
                                                    peg$currPos = s11;
                                                    s11 = peg$FAILED;
                                                }
                                                while (s11 !== peg$FAILED) {
                                                    s10.push(s11);
                                                    s11 = peg$currPos;
                                                    s12 = peg$parse__();
                                                    if (s12 !== peg$FAILED) {
                                                        s13 = peg$parseCOMMA();
                                                        if (s13 !== peg$FAILED) {
                                                            s14 = peg$parse__();
                                                            if (s14 !== peg$FAILED) {
                                                                s15 = peg$parseident_name();
                                                                if (s15 !== peg$FAILED) {
                                                                    s12 = [s12, s13, s14, s15];
                                                                    s11 = s12;
                                                                } else {
                                                                    peg$currPos = s11;
                                                                    s11 = peg$FAILED;
                                                                }
                                                            } else {
                                                                peg$currPos = s11;
                                                                s11 = peg$FAILED;
                                                            }
                                                        } else {
                                                            peg$currPos = s11;
                                                            s11 = peg$FAILED;
                                                        }
                                                    } else {
                                                        peg$currPos = s11;
                                                        s11 = peg$FAILED;
                                                    }
                                                }
                                                if (s10 !== peg$FAILED) {
                                                    s11 = peg$parse__();
                                                    if (s11 !== peg$FAILED) {
                                                        s12 = peg$parseRPAREN();
                                                        if (s12 !== peg$FAILED) {
                                                            peg$savedPos = s0;
                                                            s1 = peg$c311(s1, s3, s9, s10);
                                                            s0 = s1;
                                                        } else {
                                                            peg$currPos = s0;
                                                            s0 = peg$FAILED;
                                                        }
                                                    } else {
                                                        peg$currPos = s0;
                                                        s0 = peg$FAILED;
                                                    }
                                                } else {
                                                    peg$currPos = s0;
                                                    s0 = peg$FAILED;
                                                }
                                            } else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                            }
                                        } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parsejoin_op();
                if (s1 !== peg$FAILED) {
                    s2 = peg$parse__();
                    if (s2 !== peg$FAILED) {
                        s3 = peg$parsetable_base();
                        if (s3 !== peg$FAILED) {
                            s4 = peg$parse__();
                            if (s4 !== peg$FAILED) {
                                s5 = peg$parseon_clause();
                                if (s5 === peg$FAILED) {
                                    s5 = null;
                                }
                                if (s5 !== peg$FAILED) {
                                    peg$savedPos = s0;
                                    s1 = peg$c312(s1, s3, s5);
                                    s0 = s1;
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
                if (s0 === peg$FAILED) {
                    s0 = peg$currPos;
                    s1 = peg$parsejoin_op();
                    if (s1 !== peg$FAILED) {
                        s2 = peg$parse__();
                        if (s2 !== peg$FAILED) {
                            s3 = peg$parseLPAREN();
                            if (s3 !== peg$FAILED) {
                                s4 = peg$parse__();
                                if (s4 !== peg$FAILED) {
                                    s5 = peg$parseunion_stmt();
                                    if (s5 !== peg$FAILED) {
                                        s6 = peg$parse__();
                                        if (s6 !== peg$FAILED) {
                                            s7 = peg$parseRPAREN();
                                            if (s7 !== peg$FAILED) {
                                                s8 = peg$parse__();
                                                if (s8 !== peg$FAILED) {
                                                    s9 = peg$parsealias_clause();
                                                    if (s9 === peg$FAILED) {
                                                        s9 = null;
                                                    }
                                                    if (s9 !== peg$FAILED) {
                                                        s10 = peg$parse__();
                                                        if (s10 !== peg$FAILED) {
                                                            s11 = peg$parseon_clause();
                                                            if (s11 === peg$FAILED) {
                                                                s11 = null;
                                                            }
                                                            if (s11 !== peg$FAILED) {
                                                                peg$savedPos = s0;
                                                                s1 = peg$c313(s1, s5, s9, s11);
                                                                s0 = s1;
                                                            } else {
                                                                peg$currPos = s0;
                                                                s0 = peg$FAILED;
                                                            }
                                                        } else {
                                                            peg$currPos = s0;
                                                            s0 = peg$FAILED;
                                                        }
                                                    } else {
                                                        peg$currPos = s0;
                                                        s0 = peg$FAILED;
                                                    }
                                                } else {
                                                    peg$currPos = s0;
                                                    s0 = peg$FAILED;
                                                }
                                            } else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                            }
                                        } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
            }
            return s0;
        }
        function peg$parsetable_base() {
            var s0, s1, s2, s3, s4, s5, s6, s7;
            s0 = peg$currPos;
            s1 = peg$parsetable_name();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parsealias_clause();
                    if (s3 === peg$FAILED) {
                        s3 = null;
                    }
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c314(s1, s3);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parseLPAREN();
                if (s1 !== peg$FAILED) {
                    s2 = peg$parse__();
                    if (s2 !== peg$FAILED) {
                        s3 = peg$parseunion_stmt();
                        if (s3 !== peg$FAILED) {
                            s4 = peg$parse__();
                            if (s4 !== peg$FAILED) {
                                s5 = peg$parseRPAREN();
                                if (s5 !== peg$FAILED) {
                                    s6 = peg$parse__();
                                    if (s6 !== peg$FAILED) {
                                        s7 = peg$parsealias_clause();
                                        if (s7 === peg$FAILED) {
                                            s7 = null;
                                        }
                                        if (s7 !== peg$FAILED) {
                                            peg$savedPos = s0;
                                            s1 = peg$c315(s3, s7);
                                            s0 = s1;
                                        } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
                if (s0 === peg$FAILED) {
                    s0 = peg$parsefrom_unnest_item();
                }
            }
            return s0;
        }
        function peg$parsejoin_op() {
            var s0, s1, s2, s3, s4, s5;
            s0 = peg$currPos;
            s1 = peg$parseKW_LEFT();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseKW_OUTER();
                    if (s3 === peg$FAILED) {
                        s3 = null;
                    }
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parseKW_JOIN();
                            if (s5 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c316();
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parseKW_RIGHT();
                if (s1 !== peg$FAILED) {
                    s2 = peg$parse__();
                    if (s2 !== peg$FAILED) {
                        s3 = peg$parseKW_OUTER();
                        if (s3 === peg$FAILED) {
                            s3 = null;
                        }
                        if (s3 !== peg$FAILED) {
                            s4 = peg$parse__();
                            if (s4 !== peg$FAILED) {
                                s5 = peg$parseKW_JOIN();
                                if (s5 !== peg$FAILED) {
                                    peg$savedPos = s0;
                                    s1 = peg$c317();
                                    s0 = s1;
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
                if (s0 === peg$FAILED) {
                    s0 = peg$currPos;
                    s1 = peg$parseKW_FULL();
                    if (s1 !== peg$FAILED) {
                        s2 = peg$parse__();
                        if (s2 !== peg$FAILED) {
                            s3 = peg$parseKW_OUTER();
                            if (s3 === peg$FAILED) {
                                s3 = null;
                            }
                            if (s3 !== peg$FAILED) {
                                s4 = peg$parse__();
                                if (s4 !== peg$FAILED) {
                                    s5 = peg$parseKW_JOIN();
                                    if (s5 !== peg$FAILED) {
                                        peg$savedPos = s0;
                                        s1 = peg$c318();
                                        s0 = s1;
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                    if (s0 === peg$FAILED) {
                        s0 = peg$currPos;
                        s1 = peg$parseKW_CROSS();
                        if (s1 !== peg$FAILED) {
                            s2 = peg$parse__();
                            if (s2 !== peg$FAILED) {
                                s3 = peg$parseKW_JOIN();
                                if (s3 !== peg$FAILED) {
                                    peg$savedPos = s0;
                                    s1 = peg$c319(s1);
                                    s0 = s1;
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                        if (s0 === peg$FAILED) {
                            s0 = peg$currPos;
                            s1 = peg$parseKW_INNER();
                            if (s1 === peg$FAILED) {
                                s1 = null;
                            }
                            if (s1 !== peg$FAILED) {
                                s2 = peg$parse__();
                                if (s2 !== peg$FAILED) {
                                    s3 = peg$parseKW_JOIN();
                                    if (s3 !== peg$FAILED) {
                                        peg$savedPos = s0;
                                        s1 = peg$c320(s1);
                                        s0 = s1;
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        }
                    }
                }
            }
            return s0;
        }
        function peg$parsetable_name() {
            var s0, s1, s2, s3, s4, s5, s6, s7;
            s0 = peg$currPos;
            s1 = peg$parseident();
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                s3 = peg$parse__();
                if (s3 !== peg$FAILED) {
                    s4 = peg$parseDOT();
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parse__();
                        if (s5 !== peg$FAILED) {
                            s6 = peg$parseident();
                            if (s6 !== peg$FAILED) {
                                s3 = [s3, s4, s5, s6];
                                s2 = s3;
                            } else {
                                peg$currPos = s2;
                                s2 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s2;
                            s2 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s2;
                        s2 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$currPos;
                    s4 = peg$parse__();
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parseDOT();
                        if (s5 !== peg$FAILED) {
                            s6 = peg$parse__();
                            if (s6 !== peg$FAILED) {
                                s7 = peg$parseident();
                                if (s7 !== peg$FAILED) {
                                    s4 = [s4, s5, s6, s7];
                                    s3 = s4;
                                } else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c321(s1, s2, s3);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parseident();
                if (s1 !== peg$FAILED) {
                    s2 = peg$currPos;
                    s3 = peg$parse__();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parseDOT();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parse__();
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parseident();
                                if (s6 !== peg$FAILED) {
                                    s3 = [s3, s4, s5, s6];
                                    s2 = s3;
                                } else {
                                    peg$currPos = s2;
                                    s2 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s2;
                                s2 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s2;
                            s2 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s2;
                        s2 = peg$FAILED;
                    }
                    if (s2 === peg$FAILED) {
                        s2 = null;
                    }
                    if (s2 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c322(s1, s2);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            return s0;
        }
        function peg$parseon_clause() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            s1 = peg$parseKW_ON();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseor_and_where_expr();
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c323(s3);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsewhere_clause() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            s1 = peg$parseKW_WHERE();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseor_and_where_expr();
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c323(s3);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsegroup_by_clause() {
            var s0, s1, s2, s3, s4, s5;
            s0 = peg$currPos;
            s1 = peg$parseKW_GROUP();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseKW_BY();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parseexpr_list();
                            if (s5 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c324(s5);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsehaving_clause() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            s1 = peg$parseKW_HAVING();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseexpr();
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c323(s3);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsewindow_clause() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            s1 = peg$parseKW_WINDOW();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parsenamed_window_expr_list();
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c325(s3);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsenamed_window_expr_list() {
            var s0, s1, s2, s3, s4, s5, s6, s7;
            s0 = peg$currPos;
            s1 = peg$parsenamed_window_expr();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                s4 = peg$parse__();
                if (s4 !== peg$FAILED) {
                    s5 = peg$parseCOMMA();
                    if (s5 !== peg$FAILED) {
                        s6 = peg$parse__();
                        if (s6 !== peg$FAILED) {
                            s7 = peg$parsenamed_window_expr();
                            if (s7 !== peg$FAILED) {
                                s4 = [s4, s5, s6, s7];
                                s3 = s4;
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$currPos;
                    s4 = peg$parse__();
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parseCOMMA();
                        if (s5 !== peg$FAILED) {
                            s6 = peg$parse__();
                            if (s6 !== peg$FAILED) {
                                s7 = peg$parsenamed_window_expr();
                                if (s7 !== peg$FAILED) {
                                    s4 = [s4, s5, s6, s7];
                                    s3 = s4;
                                } else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c16(s1, s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsenamed_window_expr() {
            var s0, s1, s2, s3, s4, s5;
            s0 = peg$currPos;
            s1 = peg$parseident_name();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseKW_AS();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parseas_window_specification();
                            if (s5 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c326(s1, s5);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseas_window_specification() {
            var s0, s1, s2, s3, s4, s5;
            s0 = peg$currPos;
            s1 = peg$parseident_name();
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c327(s1);
            }
            s0 = s1;
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parseLPAREN();
                if (s1 !== peg$FAILED) {
                    s2 = peg$parse__();
                    if (s2 !== peg$FAILED) {
                        s3 = peg$parsewindow_specification();
                        if (s3 === peg$FAILED) {
                            s3 = null;
                        }
                        if (s3 !== peg$FAILED) {
                            s4 = peg$parse__();
                            if (s4 !== peg$FAILED) {
                                s5 = peg$parseRPAREN();
                                if (s5 !== peg$FAILED) {
                                    peg$savedPos = s0;
                                    s1 = peg$c328(s3);
                                    s0 = s1;
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            return s0;
        }
        function peg$parsewindow_specification() {
            var s0, s1, s2, s3, s4, s5, s6, s7;
            s0 = peg$currPos;
            s1 = peg$parseident();
            if (s1 === peg$FAILED) {
                s1 = null;
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parsepartition_by_clause();
                    if (s3 === peg$FAILED) {
                        s3 = null;
                    }
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parseorder_by_clause();
                            if (s5 === peg$FAILED) {
                                s5 = null;
                            }
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parse__();
                                if (s6 !== peg$FAILED) {
                                    s7 = peg$parsewindow_frame_clause();
                                    if (s7 === peg$FAILED) {
                                        s7 = null;
                                    }
                                    if (s7 !== peg$FAILED) {
                                        peg$savedPos = s0;
                                        s1 = peg$c329(s1, s3, s5, s7);
                                        s0 = s1;
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsewindow_frame_clause() {
            var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 5).toLowerCase() === peg$c330) {
                s1 = input.substr(peg$currPos, 5);
                peg$currPos += 5;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c331);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseKW_BETWEEN();
                    if (s3 !== peg$FAILED) {
                        if (input.substr(peg$currPos, 9).toLowerCase() === peg$c332) {
                            s4 = input.substr(peg$currPos, 9);
                            peg$currPos += 9;
                        } else {
                            s4 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c333);
                            }
                        }
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parse__();
                            if (s5 !== peg$FAILED) {
                                if (input.substr(peg$currPos, 9).toLowerCase() === peg$c334) {
                                    s6 = input.substr(peg$currPos, 9);
                                    peg$currPos += 9;
                                } else {
                                    s6 = peg$FAILED;
                                    if (peg$silentFails === 0) {
                                        peg$fail(peg$c335);
                                    }
                                }
                                if (s6 !== peg$FAILED) {
                                    s7 = peg$parse__();
                                    if (s7 !== peg$FAILED) {
                                        s8 = peg$parseKW_AND();
                                        if (s8 !== peg$FAILED) {
                                            s9 = peg$parse__();
                                            if (s9 !== peg$FAILED) {
                                                if (input.substr(peg$currPos, 7).toLowerCase() === peg$c336) {
                                                    s10 = input.substr(peg$currPos, 7);
                                                    peg$currPos += 7;
                                                } else {
                                                    s10 = peg$FAILED;
                                                    if (peg$silentFails === 0) {
                                                        peg$fail(peg$c337);
                                                    }
                                                }
                                                if (s10 !== peg$FAILED) {
                                                    s11 = peg$parse__();
                                                    if (s11 !== peg$FAILED) {
                                                        if (input.substr(peg$currPos, 3) === peg$c338) {
                                                            s12 = peg$c338;
                                                            peg$currPos += 3;
                                                        } else {
                                                            s12 = peg$FAILED;
                                                            if (peg$silentFails === 0) {
                                                                peg$fail(peg$c339);
                                                            }
                                                        }
                                                        if (s12 !== peg$FAILED) {
                                                            peg$savedPos = s0;
                                                            s1 = peg$c340();
                                                            s0 = s1;
                                                        } else {
                                                            peg$currPos = s0;
                                                            s0 = peg$FAILED;
                                                        }
                                                    } else {
                                                        peg$currPos = s0;
                                                        s0 = peg$FAILED;
                                                    }
                                                } else {
                                                    peg$currPos = s0;
                                                    s0 = peg$FAILED;
                                                }
                                            } else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                            }
                                        } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parseKW_ROWS();
                if (s1 !== peg$FAILED) {
                    s2 = peg$parse__();
                    if (s2 !== peg$FAILED) {
                        s3 = peg$parsewindow_frame_following();
                        if (s3 === peg$FAILED) {
                            s3 = peg$parsewindow_frame_preceding();
                        }
                        if (s3 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c341(s1, s3);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
                if (s0 === peg$FAILED) {
                    s0 = peg$currPos;
                    s1 = peg$parseKW_ROWS();
                    if (s1 !== peg$FAILED) {
                        s2 = peg$parse__();
                        if (s2 !== peg$FAILED) {
                            s3 = peg$parseKW_BETWEEN();
                            if (s3 !== peg$FAILED) {
                                s4 = peg$parse__();
                                if (s4 !== peg$FAILED) {
                                    s5 = peg$parsewindow_frame_preceding();
                                    if (s5 !== peg$FAILED) {
                                        s6 = peg$parse__();
                                        if (s6 !== peg$FAILED) {
                                            s7 = peg$parseKW_AND();
                                            if (s7 !== peg$FAILED) {
                                                s8 = peg$parse__();
                                                if (s8 !== peg$FAILED) {
                                                    s9 = peg$parsewindow_frame_following();
                                                    if (s9 !== peg$FAILED) {
                                                        peg$savedPos = s0;
                                                        s1 = peg$c342(s5, s9);
                                                        s0 = s1;
                                                    } else {
                                                        peg$currPos = s0;
                                                        s0 = peg$FAILED;
                                                    }
                                                } else {
                                                    peg$currPos = s0;
                                                    s0 = peg$FAILED;
                                                }
                                            } else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                            }
                                        } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
            }
            return s0;
        }
        function peg$parsewindow_frame_following() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            s1 = peg$parsewindow_frame_value();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    if (input.substr(peg$currPos, 9).toLowerCase() === peg$c343) {
                        s3 = input.substr(peg$currPos, 9);
                        peg$currPos += 9;
                    } else {
                        s3 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c344);
                        }
                    }
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c345(s1);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$parsewindow_frame_current_row();
            }
            return s0;
        }
        function peg$parsewindow_frame_preceding() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            s1 = peg$parsewindow_frame_value();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    if (input.substr(peg$currPos, 9).toLowerCase() === peg$c334) {
                        s3 = input.substr(peg$currPos, 9);
                        peg$currPos += 9;
                    } else {
                        s3 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c335);
                        }
                    }
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c346(s1);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$parsewindow_frame_current_row();
            }
            return s0;
        }
        function peg$parsewindow_frame_current_row() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 7).toLowerCase() === peg$c336) {
                s1 = input.substr(peg$currPos, 7);
                peg$currPos += 7;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c337);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    if (input.substr(peg$currPos, 3).toLowerCase() === peg$c347) {
                        s3 = input.substr(peg$currPos, 3);
                        peg$currPos += 3;
                    } else {
                        s3 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c348);
                        }
                    }
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c349();
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsewindow_frame_value() {
            var s0, s1;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 9).toLowerCase() === peg$c332) {
                s1 = input.substr(peg$currPos, 9);
                peg$currPos += 9;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c333);
                }
            }
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c350(s1);
            }
            s0 = s1;
            if (s0 === peg$FAILED) {
                s0 = peg$parseliteral_numeric();
            }
            return s0;
        }
        function peg$parsepartition_by_clause() {
            var s0, s1, s2, s3, s4, s5;
            s0 = peg$currPos;
            s1 = peg$parseKW_PARTITION();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseKW_BY();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parsecolumn_clause();
                            if (s5 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c351(s5);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseorder_by_clause() {
            var s0, s1, s2, s3, s4, s5;
            s0 = peg$currPos;
            s1 = peg$parseKW_ORDER();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseKW_BY();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parseorder_by_list();
                            if (s5 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c63(s5);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseorder_by_list() {
            var s0, s1, s2, s3, s4, s5, s6, s7;
            s0 = peg$currPos;
            s1 = peg$parseorder_by_element();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                s4 = peg$parse__();
                if (s4 !== peg$FAILED) {
                    s5 = peg$parseCOMMA();
                    if (s5 !== peg$FAILED) {
                        s6 = peg$parse__();
                        if (s6 !== peg$FAILED) {
                            s7 = peg$parseorder_by_element();
                            if (s7 !== peg$FAILED) {
                                s4 = [s4, s5, s6, s7];
                                s3 = s4;
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$currPos;
                    s4 = peg$parse__();
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parseCOMMA();
                        if (s5 !== peg$FAILED) {
                            s6 = peg$parse__();
                            if (s6 !== peg$FAILED) {
                                s7 = peg$parseorder_by_element();
                                if (s7 !== peg$FAILED) {
                                    s4 = [s4, s5, s6, s7];
                                    s3 = s4;
                                } else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c16(s1, s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseorder_by_element() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            s1 = peg$parseexpr();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseKW_DESC();
                    if (s3 === peg$FAILED) {
                        s3 = peg$parseKW_ASC();
                    }
                    if (s3 === peg$FAILED) {
                        s3 = null;
                    }
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c352(s1, s3);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsenumber_or_param() {
            var s0;
            s0 = peg$parseliteral_numeric();
            if (s0 === peg$FAILED) {
                s0 = peg$parseparam();
            }
            return s0;
        }
        function peg$parselimit_clause() {
            var s0, s1, s2, s3, s4, s5, s6, s7, s8;
            s0 = peg$currPos;
            s1 = peg$parseKW_LIMIT();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parsenumber_or_param();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$currPos;
                            s6 = peg$parseCOMMA();
                            if (s6 === peg$FAILED) {
                                s6 = peg$parseKW_OFFSET();
                            }
                            if (s6 !== peg$FAILED) {
                                s7 = peg$parse__();
                                if (s7 !== peg$FAILED) {
                                    s8 = peg$parsenumber_or_param();
                                    if (s8 !== peg$FAILED) {
                                        s6 = [s6, s7, s8];
                                        s5 = s6;
                                    } else {
                                        peg$currPos = s5;
                                        s5 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s5;
                                    s5 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s5;
                                s5 = peg$FAILED;
                            }
                            if (s5 === peg$FAILED) {
                                s5 = null;
                            }
                            if (s5 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c353(s3, s5);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseexpr_list() {
            var s0, s1, s2, s3, s4, s5, s6, s7;
            s0 = peg$currPos;
            s1 = peg$parseexpr();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                s4 = peg$parse__();
                if (s4 !== peg$FAILED) {
                    s5 = peg$parseCOMMA();
                    if (s5 !== peg$FAILED) {
                        s6 = peg$parse__();
                        if (s6 !== peg$FAILED) {
                            s7 = peg$parseexpr();
                            if (s7 !== peg$FAILED) {
                                s4 = [s4, s5, s6, s7];
                                s3 = s4;
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$currPos;
                    s4 = peg$parse__();
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parseCOMMA();
                        if (s5 !== peg$FAILED) {
                            s6 = peg$parse__();
                            if (s6 !== peg$FAILED) {
                                s7 = peg$parseexpr();
                                if (s7 !== peg$FAILED) {
                                    s4 = [s4, s5, s6, s7];
                                    s3 = s4;
                                } else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c354(s1, s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseexpr() {
            var s0;
            s0 = peg$parsestruct_expr();
            if (s0 === peg$FAILED) {
                s0 = peg$parselogic_operator_expr();
                if (s0 === peg$FAILED) {
                    s0 = peg$parseor_expr();
                    if (s0 === peg$FAILED) {
                        s0 = peg$parseunary_expr();
                        if (s0 === peg$FAILED) {
                            s0 = peg$parseunion_stmt();
                            if (s0 === peg$FAILED) {
                                s0 = peg$parsearray_expr();
                            }
                        }
                    }
                }
            }
            return s0;
        }
        function peg$parseparentheses_list_expr() {
            var s0, s1, s2, s3, s4, s5, s6, s7;
            s0 = peg$currPos;
            s1 = peg$parseparentheses_expr();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                s4 = peg$parse__();
                if (s4 !== peg$FAILED) {
                    s5 = peg$parseCOMMA();
                    if (s5 !== peg$FAILED) {
                        s6 = peg$parse__();
                        if (s6 !== peg$FAILED) {
                            s7 = peg$parseparentheses_expr();
                            if (s7 !== peg$FAILED) {
                                s4 = [s4, s5, s6, s7];
                                s3 = s4;
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$currPos;
                    s4 = peg$parse__();
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parseCOMMA();
                        if (s5 !== peg$FAILED) {
                            s6 = peg$parse__();
                            if (s6 !== peg$FAILED) {
                                s7 = peg$parseparentheses_expr();
                                if (s7 !== peg$FAILED) {
                                    s4 = [s4, s5, s6, s7];
                                    s3 = s4;
                                } else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c16(s1, s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseparentheses_expr() {
            var s0, s1, s2, s3, s4, s5;
            s0 = peg$currPos;
            s1 = peg$parseLPAREN();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parsecolumn_clause();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parseRPAREN();
                            if (s5 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c296(s3);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsearray_expr() {
            var s0, s1, s2, s3, s4, s5, s6, s7;
            s0 = peg$currPos;
            s1 = peg$parseLBRAKE();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parsecolumn_clause();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parseRBRAKE();
                            if (s5 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c355(s3);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parsearray_type();
                if (s1 === peg$FAILED) {
                    s1 = peg$parseKW_ARRAY();
                }
                if (s1 === peg$FAILED) {
                    s1 = null;
                }
                if (s1 !== peg$FAILED) {
                    s2 = peg$parseLBRAKE();
                    if (s2 !== peg$FAILED) {
                        s3 = peg$parse__();
                        if (s3 !== peg$FAILED) {
                            s4 = peg$parseliteral_list();
                            if (s4 !== peg$FAILED) {
                                s5 = peg$parse__();
                                if (s5 !== peg$FAILED) {
                                    s6 = peg$parseRBRAKE();
                                    if (s6 !== peg$FAILED) {
                                        peg$savedPos = s0;
                                        s1 = peg$c356(s1, s4);
                                        s0 = s1;
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
                if (s0 === peg$FAILED) {
                    s0 = peg$currPos;
                    s1 = peg$parsearray_type();
                    if (s1 === peg$FAILED) {
                        s1 = peg$parseKW_ARRAY();
                    }
                    if (s1 === peg$FAILED) {
                        s1 = null;
                    }
                    if (s1 !== peg$FAILED) {
                        s2 = peg$parse__();
                        if (s2 !== peg$FAILED) {
                            s3 = peg$parseLBRAKE();
                            if (s3 === peg$FAILED) {
                                s3 = peg$parseLPAREN();
                            }
                            if (s3 !== peg$FAILED) {
                                s4 = peg$parse__();
                                if (s4 !== peg$FAILED) {
                                    s5 = peg$parseparentheses_list_expr();
                                    if (s5 === peg$FAILED) {
                                        s5 = peg$parseexpr();
                                    }
                                    if (s5 !== peg$FAILED) {
                                        s6 = peg$parse__();
                                        if (s6 !== peg$FAILED) {
                                            s7 = peg$parseRBRAKE();
                                            if (s7 === peg$FAILED) {
                                                s7 = peg$parseRPAREN();
                                            }
                                            if (s7 !== peg$FAILED) {
                                                peg$savedPos = s0;
                                                s1 = peg$c357(s1, s5);
                                                s0 = s1;
                                            } else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                            }
                                        } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
            }
            return s0;
        }
        function peg$parsestruct_expr() {
            var s0, s1, s2, s3, s4, s5, s6, s7;
            s0 = peg$currPos;
            s1 = peg$parsestruct_type();
            if (s1 === peg$FAILED) {
                s1 = peg$parseKW_STRUCT();
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseLPAREN();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parsecolumn_clause();
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parse__();
                                if (s6 !== peg$FAILED) {
                                    s7 = peg$parseRPAREN();
                                    if (s7 !== peg$FAILED) {
                                        peg$savedPos = s0;
                                        s1 = peg$c358(s1, s5);
                                        s0 = s1;
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parselogic_operator_expr() {
            var s0, s1, s2, s3, s4, s5, s6, s7;
            s0 = peg$currPos;
            s1 = peg$parseprimary();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                s4 = peg$parse__();
                if (s4 !== peg$FAILED) {
                    s5 = peg$parseLOGIC_OPERATOR();
                    if (s5 !== peg$FAILED) {
                        s6 = peg$parse__();
                        if (s6 !== peg$FAILED) {
                            s7 = peg$parseprimary();
                            if (s7 !== peg$FAILED) {
                                s4 = [s4, s5, s6, s7];
                                s3 = s4;
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                if (s3 !== peg$FAILED) {
                    while (s3 !== peg$FAILED) {
                        s2.push(s3);
                        s3 = peg$currPos;
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parseLOGIC_OPERATOR();
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parse__();
                                if (s6 !== peg$FAILED) {
                                    s7 = peg$parseprimary();
                                    if (s7 !== peg$FAILED) {
                                        s4 = [s4, s5, s6, s7];
                                        s3 = s4;
                                    } else {
                                        peg$currPos = s3;
                                        s3 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    }
                } else {
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c359(s1, s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseunary_expr() {
            var s0, s1, s2, s3, s4, s5;
            s0 = peg$currPos;
            s1 = peg$parseadditive_operator();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                s4 = peg$parse__();
                if (s4 !== peg$FAILED) {
                    s5 = peg$parseprimary();
                    if (s5 !== peg$FAILED) {
                        s4 = [s4, s5];
                        s3 = s4;
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                if (s3 !== peg$FAILED) {
                    while (s3 !== peg$FAILED) {
                        s2.push(s3);
                        s3 = peg$currPos;
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parseprimary();
                            if (s5 !== peg$FAILED) {
                                s4 = [s4, s5];
                                s3 = s4;
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    }
                } else {
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c360(s1, s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseor_and_where_expr() {
            var s0, s1, s2, s3, s4, s5, s6, s7;
            s0 = peg$currPos;
            s1 = peg$parseexpr();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                s4 = peg$parse__();
                if (s4 !== peg$FAILED) {
                    s5 = peg$parseKW_AND();
                    if (s5 === peg$FAILED) {
                        s5 = peg$parseKW_OR();
                        if (s5 === peg$FAILED) {
                            s5 = peg$parseCOMMA();
                        }
                    }
                    if (s5 !== peg$FAILED) {
                        s6 = peg$parse__();
                        if (s6 !== peg$FAILED) {
                            s7 = peg$parseexpr();
                            if (s7 !== peg$FAILED) {
                                s4 = [s4, s5, s6, s7];
                                s3 = s4;
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$currPos;
                    s4 = peg$parse__();
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parseKW_AND();
                        if (s5 === peg$FAILED) {
                            s5 = peg$parseKW_OR();
                            if (s5 === peg$FAILED) {
                                s5 = peg$parseCOMMA();
                            }
                        }
                        if (s5 !== peg$FAILED) {
                            s6 = peg$parse__();
                            if (s6 !== peg$FAILED) {
                                s7 = peg$parseexpr();
                                if (s7 !== peg$FAILED) {
                                    s4 = [s4, s5, s6, s7];
                                    s3 = s4;
                                } else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c361(s1, s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseor_expr() {
            var s0, s1, s2, s3, s4, s5, s6, s7;
            s0 = peg$currPos;
            s1 = peg$parseand_expr();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                s4 = peg$parse___();
                if (s4 !== peg$FAILED) {
                    s5 = peg$parseKW_OR();
                    if (s5 !== peg$FAILED) {
                        s6 = peg$parse__();
                        if (s6 !== peg$FAILED) {
                            s7 = peg$parseand_expr();
                            if (s7 !== peg$FAILED) {
                                s4 = [s4, s5, s6, s7];
                                s3 = s4;
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$currPos;
                    s4 = peg$parse___();
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parseKW_OR();
                        if (s5 !== peg$FAILED) {
                            s6 = peg$parse__();
                            if (s6 !== peg$FAILED) {
                                s7 = peg$parseand_expr();
                                if (s7 !== peg$FAILED) {
                                    s4 = [s4, s5, s6, s7];
                                    s3 = s4;
                                } else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c11(s1, s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseand_expr() {
            var s0, s1, s2, s3, s4, s5, s6, s7;
            s0 = peg$currPos;
            s1 = peg$parsenot_expr();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                s4 = peg$parse___();
                if (s4 !== peg$FAILED) {
                    s5 = peg$parseKW_AND();
                    if (s5 !== peg$FAILED) {
                        s6 = peg$parse__();
                        if (s6 !== peg$FAILED) {
                            s7 = peg$parsenot_expr();
                            if (s7 !== peg$FAILED) {
                                s4 = [s4, s5, s6, s7];
                                s3 = s4;
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$currPos;
                    s4 = peg$parse___();
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parseKW_AND();
                        if (s5 !== peg$FAILED) {
                            s6 = peg$parse__();
                            if (s6 !== peg$FAILED) {
                                s7 = peg$parsenot_expr();
                                if (s7 !== peg$FAILED) {
                                    s4 = [s4, s5, s6, s7];
                                    s3 = s4;
                                } else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c11(s1, s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsenot_expr() {
            var s0, s1, s2, s3, s4;
            s0 = peg$parsecomparison_expr();
            if (s0 === peg$FAILED) {
                s0 = peg$parseexists_expr();
                if (s0 === peg$FAILED) {
                    s0 = peg$currPos;
                    s1 = peg$parseKW_NOT();
                    if (s1 === peg$FAILED) {
                        s1 = peg$currPos;
                        if (input.charCodeAt(peg$currPos) === 33) {
                            s2 = peg$c362;
                            peg$currPos++;
                        } else {
                            s2 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c363);
                            }
                        }
                        if (s2 !== peg$FAILED) {
                            s3 = peg$currPos;
                            peg$silentFails++;
                            if (input.charCodeAt(peg$currPos) === 61) {
                                s4 = peg$c18;
                                peg$currPos++;
                            } else {
                                s4 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c19);
                                }
                            }
                            peg$silentFails--;
                            if (s4 === peg$FAILED) {
                                s3 = void 0;
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                            if (s3 !== peg$FAILED) {
                                s2 = [s2, s3];
                                s1 = s2;
                            } else {
                                peg$currPos = s1;
                                s1 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s1;
                            s1 = peg$FAILED;
                        }
                    }
                    if (s1 !== peg$FAILED) {
                        s2 = peg$parse__();
                        if (s2 !== peg$FAILED) {
                            s3 = peg$parsenot_expr();
                            if (s3 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c364(s3);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
            }
            return s0;
        }
        function peg$parsecomparison_expr() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            s1 = peg$parseadditive_expr();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parsecomparison_op_right();
                    if (s3 === peg$FAILED) {
                        s3 = null;
                    }
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c365(s1, s3);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$parseliteral_string();
                if (s0 === peg$FAILED) {
                    s0 = peg$parsecolumn_ref();
                }
            }
            return s0;
        }
        function peg$parseexists_expr() {
            var s0, s1, s2, s3, s4, s5, s6, s7;
            s0 = peg$currPos;
            s1 = peg$parseexists_op();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseLPAREN();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parseunion_stmt();
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parse__();
                                if (s6 !== peg$FAILED) {
                                    s7 = peg$parseRPAREN();
                                    if (s7 !== peg$FAILED) {
                                        peg$savedPos = s0;
                                        s1 = peg$c366(s1, s5);
                                        s0 = s1;
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseexists_op() {
            var s0, s1, s2, s3, s4;
            s0 = peg$currPos;
            s1 = peg$currPos;
            s2 = peg$parseKW_NOT();
            if (s2 !== peg$FAILED) {
                s3 = peg$parse__();
                if (s3 !== peg$FAILED) {
                    s4 = peg$parseKW_EXISTS();
                    if (s4 !== peg$FAILED) {
                        s2 = [s2, s3, s4];
                        s1 = s2;
                    } else {
                        peg$currPos = s1;
                        s1 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s1;
                    s1 = peg$FAILED;
                }
            } else {
                peg$currPos = s1;
                s1 = peg$FAILED;
            }
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c367(s1);
            }
            s0 = s1;
            if (s0 === peg$FAILED) {
                s0 = peg$parseKW_EXISTS();
            }
            return s0;
        }
        function peg$parsecomparison_op_right() {
            var s0;
            s0 = peg$parsearithmetic_op_right();
            if (s0 === peg$FAILED) {
                s0 = peg$parsein_op_right();
                if (s0 === peg$FAILED) {
                    s0 = peg$parsebetween_op_right();
                    if (s0 === peg$FAILED) {
                        s0 = peg$parseis_op_right();
                        if (s0 === peg$FAILED) {
                            s0 = peg$parselike_op_right();
                        }
                    }
                }
            }
            return s0;
        }
        function peg$parsearithmetic_op_right() {
            var s0, s1, s2, s3, s4, s5, s6;
            s0 = peg$currPos;
            s1 = [];
            s2 = peg$currPos;
            s3 = peg$parse__();
            if (s3 !== peg$FAILED) {
                s4 = peg$parsearithmetic_comparison_operator();
                if (s4 !== peg$FAILED) {
                    s5 = peg$parse__();
                    if (s5 !== peg$FAILED) {
                        s6 = peg$parseadditive_expr();
                        if (s6 !== peg$FAILED) {
                            s3 = [s3, s4, s5, s6];
                            s2 = s3;
                        } else {
                            peg$currPos = s2;
                            s2 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s2;
                        s2 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
            } else {
                peg$currPos = s2;
                s2 = peg$FAILED;
            }
            if (s2 !== peg$FAILED) {
                while (s2 !== peg$FAILED) {
                    s1.push(s2);
                    s2 = peg$currPos;
                    s3 = peg$parse__();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parsearithmetic_comparison_operator();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parse__();
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parseadditive_expr();
                                if (s6 !== peg$FAILED) {
                                    s3 = [s3, s4, s5, s6];
                                    s2 = s3;
                                } else {
                                    peg$currPos = s2;
                                    s2 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s2;
                                s2 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s2;
                            s2 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s2;
                        s2 = peg$FAILED;
                    }
                }
            } else {
                s1 = peg$FAILED;
            }
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c368(s1);
            }
            s0 = s1;
            return s0;
        }
        function peg$parsearithmetic_comparison_operator() {
            var s0;
            if (input.substr(peg$currPos, 2) === peg$c369) {
                s0 = peg$c369;
                peg$currPos += 2;
            } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c370);
                }
            }
            if (s0 === peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 62) {
                    s0 = peg$c371;
                    peg$currPos++;
                } else {
                    s0 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c372);
                    }
                }
                if (s0 === peg$FAILED) {
                    if (input.substr(peg$currPos, 2) === peg$c373) {
                        s0 = peg$c373;
                        peg$currPos += 2;
                    } else {
                        s0 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c374);
                        }
                    }
                    if (s0 === peg$FAILED) {
                        if (input.substr(peg$currPos, 2) === peg$c375) {
                            s0 = peg$c375;
                            peg$currPos += 2;
                        } else {
                            s0 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c376);
                            }
                        }
                        if (s0 === peg$FAILED) {
                            if (input.charCodeAt(peg$currPos) === 60) {
                                s0 = peg$c377;
                                peg$currPos++;
                            } else {
                                s0 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c378);
                                }
                            }
                            if (s0 === peg$FAILED) {
                                if (input.charCodeAt(peg$currPos) === 61) {
                                    s0 = peg$c18;
                                    peg$currPos++;
                                } else {
                                    s0 = peg$FAILED;
                                    if (peg$silentFails === 0) {
                                        peg$fail(peg$c19);
                                    }
                                }
                                if (s0 === peg$FAILED) {
                                    if (input.substr(peg$currPos, 2) === peg$c379) {
                                        s0 = peg$c379;
                                        peg$currPos += 2;
                                    } else {
                                        s0 = peg$FAILED;
                                        if (peg$silentFails === 0) {
                                            peg$fail(peg$c380);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return s0;
        }
        function peg$parseis_op_right() {
            var s0, s1, s2, s3, s4;
            s0 = peg$currPos;
            s1 = peg$parseKW_IS();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseadditive_expr();
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c381(s3);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$currPos;
                s2 = peg$parseKW_IS();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parse__();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parseKW_NOT();
                        if (s4 !== peg$FAILED) {
                            s2 = [s2, s3, s4];
                            s1 = s2;
                        } else {
                            peg$currPos = s1;
                            s1 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s1;
                        s1 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s1;
                    s1 = peg$FAILED;
                }
                if (s1 !== peg$FAILED) {
                    s2 = peg$parse__();
                    if (s2 !== peg$FAILED) {
                        s3 = peg$parseadditive_expr();
                        if (s3 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c382(s3);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            return s0;
        }
        function peg$parsebetween_op_right() {
            var s0, s1, s2, s3, s4, s5, s6, s7;
            s0 = peg$currPos;
            s1 = peg$parsebetween_or_not_between_op();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseadditive_expr();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parseKW_AND();
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parse__();
                                if (s6 !== peg$FAILED) {
                                    s7 = peg$parseadditive_expr();
                                    if (s7 !== peg$FAILED) {
                                        peg$savedPos = s0;
                                        s1 = peg$c383(s1, s3, s7);
                                        s0 = s1;
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsebetween_or_not_between_op() {
            var s0, s1, s2, s3, s4;
            s0 = peg$currPos;
            s1 = peg$currPos;
            s2 = peg$parseKW_NOT();
            if (s2 !== peg$FAILED) {
                s3 = peg$parse__();
                if (s3 !== peg$FAILED) {
                    s4 = peg$parseKW_BETWEEN();
                    if (s4 !== peg$FAILED) {
                        s2 = [s2, s3, s4];
                        s1 = s2;
                    } else {
                        peg$currPos = s1;
                        s1 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s1;
                    s1 = peg$FAILED;
                }
            } else {
                peg$currPos = s1;
                s1 = peg$FAILED;
            }
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c367(s1);
            }
            s0 = s1;
            if (s0 === peg$FAILED) {
                s0 = peg$parseKW_BETWEEN();
            }
            return s0;
        }
        function peg$parselike_op() {
            var s0, s1, s2, s3, s4;
            s0 = peg$currPos;
            s1 = peg$currPos;
            s2 = peg$parseKW_NOT();
            if (s2 !== peg$FAILED) {
                s3 = peg$parse__();
                if (s3 !== peg$FAILED) {
                    s4 = peg$parseKW_LIKE();
                    if (s4 !== peg$FAILED) {
                        s2 = [s2, s3, s4];
                        s1 = s2;
                    } else {
                        peg$currPos = s1;
                        s1 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s1;
                    s1 = peg$FAILED;
                }
            } else {
                peg$currPos = s1;
                s1 = peg$FAILED;
            }
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c367(s1);
            }
            s0 = s1;
            if (s0 === peg$FAILED) {
                s0 = peg$parseKW_LIKE();
            }
            return s0;
        }
        function peg$parsein_op() {
            var s0, s1, s2, s3, s4;
            s0 = peg$currPos;
            s1 = peg$currPos;
            s2 = peg$parseKW_NOT();
            if (s2 !== peg$FAILED) {
                s3 = peg$parse__();
                if (s3 !== peg$FAILED) {
                    s4 = peg$parseKW_IN();
                    if (s4 !== peg$FAILED) {
                        s2 = [s2, s3, s4];
                        s1 = s2;
                    } else {
                        peg$currPos = s1;
                        s1 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s1;
                    s1 = peg$FAILED;
                }
            } else {
                peg$currPos = s1;
                s1 = peg$FAILED;
            }
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c367(s1);
            }
            s0 = s1;
            if (s0 === peg$FAILED) {
                s0 = peg$parseKW_IN();
            }
            return s0;
        }
        function peg$parselike_op_right() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            s1 = peg$parselike_op();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseliteral();
                    if (s3 === peg$FAILED) {
                        s3 = peg$parsecomparison_expr();
                    }
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c384(s1, s3);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsein_op_right() {
            var s0, s1, s2, s3, s4, s5, s6, s7;
            s0 = peg$currPos;
            s1 = peg$parsein_op();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseLPAREN();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parseexpr_list();
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parse__();
                                if (s6 !== peg$FAILED) {
                                    s7 = peg$parseRPAREN();
                                    if (s7 !== peg$FAILED) {
                                        peg$savedPos = s0;
                                        s1 = peg$c385(s1, s5);
                                        s0 = s1;
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parsein_op();
                if (s1 !== peg$FAILED) {
                    s2 = peg$parse__();
                    if (s2 !== peg$FAILED) {
                        s3 = peg$parseliteral_string();
                        if (s3 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c386(s1, s3);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            return s0;
        }
        function peg$parseadditive_expr() {
            var s0, s1, s2, s3, s4, s5, s6, s7;
            s0 = peg$currPos;
            s1 = peg$parsemultiplicative_expr();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                s4 = peg$parse__();
                if (s4 !== peg$FAILED) {
                    s5 = peg$parseadditive_operator();
                    if (s5 !== peg$FAILED) {
                        s6 = peg$parse__();
                        if (s6 !== peg$FAILED) {
                            s7 = peg$parsemultiplicative_expr();
                            if (s7 !== peg$FAILED) {
                                s4 = [s4, s5, s6, s7];
                                s3 = s4;
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$currPos;
                    s4 = peg$parse__();
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parseadditive_operator();
                        if (s5 !== peg$FAILED) {
                            s6 = peg$parse__();
                            if (s6 !== peg$FAILED) {
                                s7 = peg$parsemultiplicative_expr();
                                if (s7 !== peg$FAILED) {
                                    s4 = [s4, s5, s6, s7];
                                    s3 = s4;
                                } else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c11(s1, s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseadditive_operator() {
            var s0;
            if (input.charCodeAt(peg$currPos) === 43) {
                s0 = peg$c387;
                peg$currPos++;
            } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c388);
                }
            }
            if (s0 === peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 45) {
                    s0 = peg$c389;
                    peg$currPos++;
                } else {
                    s0 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c390);
                    }
                }
            }
            return s0;
        }
        function peg$parsemultiplicative_expr() {
            var s0, s1, s2, s3, s4, s5, s6, s7;
            s0 = peg$currPos;
            s1 = peg$parseprimary();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                s4 = peg$parse__();
                if (s4 !== peg$FAILED) {
                    s5 = peg$parsemultiplicative_operator();
                    if (s5 !== peg$FAILED) {
                        s6 = peg$parse__();
                        if (s6 !== peg$FAILED) {
                            s7 = peg$parseprimary();
                            if (s7 !== peg$FAILED) {
                                s4 = [s4, s5, s6, s7];
                                s3 = s4;
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$currPos;
                    s4 = peg$parse__();
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parsemultiplicative_operator();
                        if (s5 !== peg$FAILED) {
                            s6 = peg$parse__();
                            if (s6 !== peg$FAILED) {
                                s7 = peg$parseprimary();
                                if (s7 !== peg$FAILED) {
                                    s4 = [s4, s5, s6, s7];
                                    s3 = s4;
                                } else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c391(s1, s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsemultiplicative_operator() {
            var s0;
            if (input.charCodeAt(peg$currPos) === 42) {
                s0 = peg$c392;
                peg$currPos++;
            } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c393);
                }
            }
            if (s0 === peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 47) {
                    s0 = peg$c394;
                    peg$currPos++;
                } else {
                    s0 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c395);
                    }
                }
                if (s0 === peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 37) {
                        s0 = peg$c396;
                        peg$currPos++;
                    } else {
                        s0 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c397);
                        }
                    }
                }
            }
            return s0;
        }
        function peg$parseprimary() {
            var s0, s1, s2, s3, s4, s5;
            s0 = peg$parsearray_expr();
            if (s0 === peg$FAILED) {
                s0 = peg$parsecast_expr();
                if (s0 === peg$FAILED) {
                    s0 = peg$parseliteral();
                    if (s0 === peg$FAILED) {
                        s0 = peg$parseaggr_func();
                        if (s0 === peg$FAILED) {
                            s0 = peg$parsefunc_call();
                            if (s0 === peg$FAILED) {
                                s0 = peg$parsecase_expr();
                                if (s0 === peg$FAILED) {
                                    s0 = peg$parseinterval_expr();
                                    if (s0 === peg$FAILED) {
                                        s0 = peg$parsecolumn_ref();
                                        if (s0 === peg$FAILED) {
                                            s0 = peg$parseparam();
                                            if (s0 === peg$FAILED) {
                                                s0 = peg$currPos;
                                                s1 = peg$parseLPAREN();
                                                if (s1 !== peg$FAILED) {
                                                    s2 = peg$parse__();
                                                    if (s2 !== peg$FAILED) {
                                                        s3 = peg$parseor_and_where_expr();
                                                        if (s3 !== peg$FAILED) {
                                                            s4 = peg$parse__();
                                                            if (s4 !== peg$FAILED) {
                                                                s5 = peg$parseRPAREN();
                                                                if (s5 !== peg$FAILED) {
                                                                    peg$savedPos = s0;
                                                                    s1 = peg$c398(s3);
                                                                    s0 = s1;
                                                                } else {
                                                                    peg$currPos = s0;
                                                                    s0 = peg$FAILED;
                                                                }
                                                            } else {
                                                                peg$currPos = s0;
                                                                s0 = peg$FAILED;
                                                            }
                                                        } else {
                                                            peg$currPos = s0;
                                                            s0 = peg$FAILED;
                                                        }
                                                    } else {
                                                        peg$currPos = s0;
                                                        s0 = peg$FAILED;
                                                    }
                                                } else {
                                                    peg$currPos = s0;
                                                    s0 = peg$FAILED;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return s0;
        }
        function peg$parseinterval_expr() {
            var s0, s1, s2, s3, s4, s5;
            s0 = peg$currPos;
            s1 = peg$parseKW_INTERVAL();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseexpr();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parseinterval_unit();
                            if (s5 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c399(s3, s5);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsecase_expr() {
            var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11;
            s0 = peg$currPos;
            s1 = peg$parseKW_CASE();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = [];
                    s4 = peg$parsecase_when_then();
                    if (s4 !== peg$FAILED) {
                        while (s4 !== peg$FAILED) {
                            s3.push(s4);
                            s4 = peg$parsecase_when_then();
                        }
                    } else {
                        s3 = peg$FAILED;
                    }
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parsecase_else();
                            if (s5 === peg$FAILED) {
                                s5 = null;
                            }
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parse__();
                                if (s6 !== peg$FAILED) {
                                    s7 = peg$parseKW_END();
                                    if (s7 !== peg$FAILED) {
                                        s8 = peg$parse__();
                                        if (s8 !== peg$FAILED) {
                                            s9 = peg$parseKW_CASE();
                                            if (s9 === peg$FAILED) {
                                                s9 = null;
                                            }
                                            if (s9 !== peg$FAILED) {
                                                peg$savedPos = s0;
                                                s1 = peg$c400(s3, s5);
                                                s0 = s1;
                                            } else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                            }
                                        } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parseKW_CASE();
                if (s1 !== peg$FAILED) {
                    s2 = peg$parse__();
                    if (s2 !== peg$FAILED) {
                        s3 = peg$parseexpr();
                        if (s3 !== peg$FAILED) {
                            s4 = peg$parse__();
                            if (s4 !== peg$FAILED) {
                                s5 = [];
                                s6 = peg$parsecase_when_then();
                                if (s6 !== peg$FAILED) {
                                    while (s6 !== peg$FAILED) {
                                        s5.push(s6);
                                        s6 = peg$parsecase_when_then();
                                    }
                                } else {
                                    s5 = peg$FAILED;
                                }
                                if (s5 !== peg$FAILED) {
                                    s6 = peg$parse__();
                                    if (s6 !== peg$FAILED) {
                                        s7 = peg$parsecase_else();
                                        if (s7 === peg$FAILED) {
                                            s7 = null;
                                        }
                                        if (s7 !== peg$FAILED) {
                                            s8 = peg$parse__();
                                            if (s8 !== peg$FAILED) {
                                                s9 = peg$parseKW_END();
                                                if (s9 !== peg$FAILED) {
                                                    s10 = peg$parse__();
                                                    if (s10 !== peg$FAILED) {
                                                        s11 = peg$parseKW_CASE();
                                                        if (s11 === peg$FAILED) {
                                                            s11 = null;
                                                        }
                                                        if (s11 !== peg$FAILED) {
                                                            peg$savedPos = s0;
                                                            s1 = peg$c401(s3, s5, s7);
                                                            s0 = s1;
                                                        } else {
                                                            peg$currPos = s0;
                                                            s0 = peg$FAILED;
                                                        }
                                                    } else {
                                                        peg$currPos = s0;
                                                        s0 = peg$FAILED;
                                                    }
                                                } else {
                                                    peg$currPos = s0;
                                                    s0 = peg$FAILED;
                                                }
                                            } else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                            }
                                        } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            return s0;
        }
        function peg$parsecase_when_then() {
            var s0, s1, s2, s3, s4, s5, s6, s7;
            s0 = peg$currPos;
            s1 = peg$parseKW_WHEN();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseor_and_where_expr();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parseKW_THEN();
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parse__();
                                if (s6 !== peg$FAILED) {
                                    s7 = peg$parseexpr();
                                    if (s7 !== peg$FAILED) {
                                        peg$savedPos = s0;
                                        s1 = peg$c402(s3, s7);
                                        s0 = s1;
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsecase_else() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            s1 = peg$parseKW_ELSE();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseexpr();
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c403(s3);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsecolumn_ref() {
            var s0, s1, s2, s3, s4, s5;
            s0 = peg$currPos;
            s1 = peg$parseident();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseDOT();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parsecolumn_without_kw();
                            if (s5 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c404(s1, s5);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parsecolumn();
                if (s1 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c405(s1);
                }
                s0 = s1;
            }
            return s0;
        }
        function peg$parsecolumn_list() {
            var s0, s1, s2, s3, s4, s5, s6, s7;
            s0 = peg$currPos;
            s1 = peg$parsecolumn();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                s4 = peg$parse__();
                if (s4 !== peg$FAILED) {
                    s5 = peg$parseCOMMA();
                    if (s5 !== peg$FAILED) {
                        s6 = peg$parse__();
                        if (s6 !== peg$FAILED) {
                            s7 = peg$parsecolumn();
                            if (s7 !== peg$FAILED) {
                                s4 = [s4, s5, s6, s7];
                                s3 = s4;
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$currPos;
                    s4 = peg$parse__();
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parseCOMMA();
                        if (s5 !== peg$FAILED) {
                            s6 = peg$parse__();
                            if (s6 !== peg$FAILED) {
                                s7 = peg$parsecolumn();
                                if (s7 !== peg$FAILED) {
                                    s4 = [s4, s5, s6, s7];
                                    s3 = s4;
                                } else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c16(s1, s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseident() {
            var s0, s1, s2;
            s0 = peg$currPos;
            s1 = peg$parseident_name();
            if (s1 !== peg$FAILED) {
                peg$savedPos = peg$currPos;
                s2 = peg$c406(s1);
                if (s2) {
                    s2 = peg$FAILED;
                } else {
                    s2 = void 0;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c407(s1);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parsequoted_ident();
                if (s1 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c407(s1);
                }
                s0 = s1;
            }
            return s0;
        }
        function peg$parsealias_ident() {
            var s0, s1, s2;
            s0 = peg$currPos;
            s1 = peg$parseident_name();
            if (s1 !== peg$FAILED) {
                peg$savedPos = peg$currPos;
                s2 = peg$c408(s1);
                if (s2) {
                    s2 = peg$FAILED;
                } else {
                    s2 = void 0;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c407(s1);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parsequoted_ident();
                if (s1 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c407(s1);
                }
                s0 = s1;
            }
            return s0;
        }
        function peg$parsequoted_ident() {
            var s0;
            s0 = peg$parsedouble_quoted_ident();
            if (s0 === peg$FAILED) {
                s0 = peg$parsesingle_quoted_ident();
                if (s0 === peg$FAILED) {
                    s0 = peg$parsebackticks_quoted_ident();
                }
            }
            return s0;
        }
        function peg$parsedouble_quoted_ident() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 34) {
                s1 = peg$c409;
                peg$currPos++;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c410);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = [];
                if (peg$c411.test(input.charAt(peg$currPos))) {
                    s3 = input.charAt(peg$currPos);
                    peg$currPos++;
                } else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c412);
                    }
                }
                if (s3 !== peg$FAILED) {
                    while (s3 !== peg$FAILED) {
                        s2.push(s3);
                        if (peg$c411.test(input.charAt(peg$currPos))) {
                            s3 = input.charAt(peg$currPos);
                            peg$currPos++;
                        } else {
                            s3 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c412);
                            }
                        }
                    }
                } else {
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 34) {
                        s3 = peg$c409;
                        peg$currPos++;
                    } else {
                        s3 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c410);
                        }
                    }
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c413(s2);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsesingle_quoted_ident() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 39) {
                s1 = peg$c153;
                peg$currPos++;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c154);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = [];
                if (peg$c414.test(input.charAt(peg$currPos))) {
                    s3 = input.charAt(peg$currPos);
                    peg$currPos++;
                } else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c415);
                    }
                }
                if (s3 !== peg$FAILED) {
                    while (s3 !== peg$FAILED) {
                        s2.push(s3);
                        if (peg$c414.test(input.charAt(peg$currPos))) {
                            s3 = input.charAt(peg$currPos);
                            peg$currPos++;
                        } else {
                            s3 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c415);
                            }
                        }
                    }
                } else {
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 39) {
                        s3 = peg$c153;
                        peg$currPos++;
                    } else {
                        s3 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c154);
                        }
                    }
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c413(s2);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsebackticks_quoted_ident() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 96) {
                s1 = peg$c416;
                peg$currPos++;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c417);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = [];
                if (peg$c418.test(input.charAt(peg$currPos))) {
                    s3 = input.charAt(peg$currPos);
                    peg$currPos++;
                } else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c419);
                    }
                }
                if (s3 !== peg$FAILED) {
                    while (s3 !== peg$FAILED) {
                        s2.push(s3);
                        if (peg$c418.test(input.charAt(peg$currPos))) {
                            s3 = input.charAt(peg$currPos);
                            peg$currPos++;
                        } else {
                            s3 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c419);
                            }
                        }
                    }
                } else {
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 96) {
                        s3 = peg$c416;
                        peg$currPos++;
                    } else {
                        s3 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c417);
                        }
                    }
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c420(s2);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsecolumn_without_kw() {
            var s0, s1;
            s0 = peg$currPos;
            s1 = peg$parsecolumn_name();
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c421(s1);
            }
            s0 = s1;
            if (s0 === peg$FAILED) {
                s0 = peg$parsequoted_ident();
            }
            return s0;
        }
        function peg$parsecolumn() {
            var s0, s1, s2;
            s0 = peg$currPos;
            s1 = peg$parsecolumn_name();
            if (s1 !== peg$FAILED) {
                peg$savedPos = peg$currPos;
                s2 = peg$c406(s1);
                if (s2) {
                    s2 = peg$FAILED;
                } else {
                    s2 = void 0;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c422(s1);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$parsequoted_ident();
            }
            return s0;
        }
        function peg$parsecolumn_name() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            s1 = peg$parseident_start();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$parsecolumn_part();
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$parsecolumn_part();
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c423(s1, s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseident_name() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            s1 = peg$parseident_start();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$parseident_part();
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$parseident_part();
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c423(s1, s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseident_start() {
            var s0;
            if (peg$c424.test(input.charAt(peg$currPos))) {
                s0 = input.charAt(peg$currPos);
                peg$currPos++;
            } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c425);
                }
            }
            return s0;
        }
        function peg$parseident_part() {
            var s0;
            if (peg$c426.test(input.charAt(peg$currPos))) {
                s0 = input.charAt(peg$currPos);
                peg$currPos++;
            } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c427);
                }
            }
            return s0;
        }
        function peg$parsecolumn_part() {
            var s0;
            if (peg$c428.test(input.charAt(peg$currPos))) {
                s0 = input.charAt(peg$currPos);
                peg$currPos++;
            } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c429);
                }
            }
            return s0;
        }
        function peg$parseparam() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            s1 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 58) {
                s2 = peg$c430;
                peg$currPos++;
            } else {
                s2 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c431);
                }
            }
            if (s2 !== peg$FAILED) {
                s3 = peg$parseident_name();
                if (s3 !== peg$FAILED) {
                    s2 = [s2, s3];
                    s1 = s2;
                } else {
                    peg$currPos = s1;
                    s1 = peg$FAILED;
                }
            } else {
                peg$currPos = s1;
                s1 = peg$FAILED;
            }
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c432(s1);
            }
            s0 = s1;
            return s0;
        }
        function peg$parseaggr_func_list() {
            var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11;
            s0 = peg$currPos;
            s1 = peg$parseaggr_func();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parsealias_clause();
                    if (s3 === peg$FAILED) {
                        s3 = null;
                    }
                    if (s3 !== peg$FAILED) {
                        s4 = [];
                        s5 = peg$currPos;
                        s6 = peg$parse__();
                        if (s6 !== peg$FAILED) {
                            s7 = peg$parseCOMMA();
                            if (s7 !== peg$FAILED) {
                                s8 = peg$parse__();
                                if (s8 !== peg$FAILED) {
                                    s9 = peg$parseaggr_func();
                                    if (s9 !== peg$FAILED) {
                                        s10 = peg$parse__();
                                        if (s10 !== peg$FAILED) {
                                            s11 = peg$parsealias_clause();
                                            if (s11 === peg$FAILED) {
                                                s11 = null;
                                            }
                                            if (s11 !== peg$FAILED) {
                                                s6 = [s6, s7, s8, s9, s10, s11];
                                                s5 = s6;
                                            } else {
                                                peg$currPos = s5;
                                                s5 = peg$FAILED;
                                            }
                                        } else {
                                            peg$currPos = s5;
                                            s5 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s5;
                                        s5 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s5;
                                    s5 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s5;
                                s5 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s5;
                            s5 = peg$FAILED;
                        }
                        while (s5 !== peg$FAILED) {
                            s4.push(s5);
                            s5 = peg$currPos;
                            s6 = peg$parse__();
                            if (s6 !== peg$FAILED) {
                                s7 = peg$parseCOMMA();
                                if (s7 !== peg$FAILED) {
                                    s8 = peg$parse__();
                                    if (s8 !== peg$FAILED) {
                                        s9 = peg$parseaggr_func();
                                        if (s9 !== peg$FAILED) {
                                            s10 = peg$parse__();
                                            if (s10 !== peg$FAILED) {
                                                s11 = peg$parsealias_clause();
                                                if (s11 === peg$FAILED) {
                                                    s11 = null;
                                                }
                                                if (s11 !== peg$FAILED) {
                                                    s6 = [s6, s7, s8, s9, s10, s11];
                                                    s5 = s6;
                                                } else {
                                                    peg$currPos = s5;
                                                    s5 = peg$FAILED;
                                                }
                                            } else {
                                                peg$currPos = s5;
                                                s5 = peg$FAILED;
                                            }
                                        } else {
                                            peg$currPos = s5;
                                            s5 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s5;
                                        s5 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s5;
                                    s5 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s5;
                                s5 = peg$FAILED;
                            }
                        }
                        if (s4 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c433(s1, s3, s4);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseaggr_func() {
            var s0;
            s0 = peg$parseaggr_fun_count();
            if (s0 === peg$FAILED) {
                s0 = peg$parseaggr_fun_smma();
            }
            return s0;
        }
        function peg$parseaggr_fun_smma() {
            var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;
            s0 = peg$currPos;
            s1 = peg$parseKW_SUM_MAX_MIN_AVG();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseLPAREN();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parseadditive_expr();
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parse__();
                                if (s6 !== peg$FAILED) {
                                    s7 = peg$parseRPAREN();
                                    if (s7 !== peg$FAILED) {
                                        s8 = peg$parse__();
                                        if (s8 !== peg$FAILED) {
                                            s9 = peg$parseover_partition();
                                            if (s9 === peg$FAILED) {
                                                s9 = null;
                                            }
                                            if (s9 !== peg$FAILED) {
                                                peg$savedPos = s0;
                                                s1 = peg$c434(s1, s5, s9);
                                                s0 = s1;
                                            } else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                            }
                                        } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_SUM_MAX_MIN_AVG() {
            var s0;
            s0 = peg$parseKW_SUM();
            if (s0 === peg$FAILED) {
                s0 = peg$parseKW_MAX();
                if (s0 === peg$FAILED) {
                    s0 = peg$parseKW_MIN();
                    if (s0 === peg$FAILED) {
                        s0 = peg$parseKW_AVG();
                    }
                }
            }
            return s0;
        }
        function peg$parseon_update_current_timestamp() {
            var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11;
            s0 = peg$currPos;
            s1 = peg$parseKW_ON();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    if (input.substr(peg$currPos, 6).toLowerCase() === peg$c213) {
                        s3 = input.substr(peg$currPos, 6);
                        peg$currPos += 6;
                    } else {
                        s3 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c214);
                        }
                    }
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parseKW_CURRENT_TIMESTAMP();
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parse__();
                                if (s6 !== peg$FAILED) {
                                    s7 = peg$parseLPAREN();
                                    if (s7 !== peg$FAILED) {
                                        s8 = peg$parse__();
                                        if (s8 !== peg$FAILED) {
                                            s9 = peg$parseexpr_list();
                                            if (s9 === peg$FAILED) {
                                                s9 = null;
                                            }
                                            if (s9 !== peg$FAILED) {
                                                s10 = peg$parse__();
                                                if (s10 !== peg$FAILED) {
                                                    s11 = peg$parseRPAREN();
                                                    if (s11 !== peg$FAILED) {
                                                        peg$savedPos = s0;
                                                        s1 = peg$c435(s5, s9);
                                                        s0 = s1;
                                                    } else {
                                                        peg$currPos = s0;
                                                        s0 = peg$FAILED;
                                                    }
                                                } else {
                                                    peg$currPos = s0;
                                                    s0 = peg$FAILED;
                                                }
                                            } else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                            }
                                        } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parseKW_ON();
                if (s1 !== peg$FAILED) {
                    s2 = peg$parse__();
                    if (s2 !== peg$FAILED) {
                        if (input.substr(peg$currPos, 6).toLowerCase() === peg$c213) {
                            s3 = input.substr(peg$currPos, 6);
                            peg$currPos += 6;
                        } else {
                            s3 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c214);
                            }
                        }
                        if (s3 !== peg$FAILED) {
                            s4 = peg$parse__();
                            if (s4 !== peg$FAILED) {
                                s5 = peg$parseKW_CURRENT_TIMESTAMP();
                                if (s5 !== peg$FAILED) {
                                    peg$savedPos = s0;
                                    s1 = peg$c436(s5);
                                    s0 = s1;
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            return s0;
        }
        function peg$parseover_partition() {
            var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;
            s0 = peg$currPos;
            s1 = peg$parseKW_OVER();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseas_window_specification();
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c437(s3);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parseKW_OVER();
                if (s1 !== peg$FAILED) {
                    s2 = peg$parse__();
                    if (s2 !== peg$FAILED) {
                        s3 = peg$parseLPAREN();
                        if (s3 !== peg$FAILED) {
                            s4 = peg$parse__();
                            if (s4 !== peg$FAILED) {
                                s5 = peg$parsepartition_by_clause();
                                if (s5 !== peg$FAILED) {
                                    s6 = peg$parse__();
                                    if (s6 !== peg$FAILED) {
                                        s7 = peg$parseorder_by_clause();
                                        if (s7 === peg$FAILED) {
                                            s7 = null;
                                        }
                                        if (s7 !== peg$FAILED) {
                                            s8 = peg$parse__();
                                            if (s8 !== peg$FAILED) {
                                                s9 = peg$parseRPAREN();
                                                if (s9 !== peg$FAILED) {
                                                    peg$savedPos = s0;
                                                    s1 = peg$c438(s5, s7);
                                                    s0 = s1;
                                                } else {
                                                    peg$currPos = s0;
                                                    s0 = peg$FAILED;
                                                }
                                            } else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                            }
                                        } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
                if (s0 === peg$FAILED) {
                    s0 = peg$parseon_update_current_timestamp();
                }
            }
            return s0;
        }
        function peg$parseaggr_fun_count() {
            var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;
            s0 = peg$currPos;
            s1 = peg$parseKW_COUNT();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseLPAREN();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parsecount_arg();
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parse__();
                                if (s6 !== peg$FAILED) {
                                    s7 = peg$parseRPAREN();
                                    if (s7 !== peg$FAILED) {
                                        s8 = peg$parse__();
                                        if (s8 !== peg$FAILED) {
                                            s9 = peg$parseover_partition();
                                            if (s9 === peg$FAILED) {
                                                s9 = null;
                                            }
                                            if (s9 !== peg$FAILED) {
                                                peg$savedPos = s0;
                                                s1 = peg$c439(s1, s5, s9);
                                                s0 = s1;
                                            } else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                            }
                                        } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsecount_arg() {
            var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;
            s0 = peg$currPos;
            s1 = peg$parsestar_expr();
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c440(s1);
            }
            s0 = s1;
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parseKW_DISTINCT();
                if (s1 === peg$FAILED) {
                    s1 = null;
                }
                if (s1 !== peg$FAILED) {
                    s2 = peg$parse__();
                    if (s2 !== peg$FAILED) {
                        s3 = peg$parsecolumn_ref();
                        if (s3 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c441(s1, s3);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
                if (s0 === peg$FAILED) {
                    s0 = peg$currPos;
                    s1 = peg$parseKW_DISTINCT();
                    if (s1 === peg$FAILED) {
                        s1 = null;
                    }
                    if (s1 !== peg$FAILED) {
                        s2 = peg$parse__();
                        if (s2 !== peg$FAILED) {
                            s3 = peg$parseLPAREN();
                            if (s3 !== peg$FAILED) {
                                s4 = peg$parse__();
                                if (s4 !== peg$FAILED) {
                                    s5 = peg$parseexpr();
                                    if (s5 !== peg$FAILED) {
                                        s6 = peg$parse__();
                                        if (s6 !== peg$FAILED) {
                                            s7 = peg$parseRPAREN();
                                            if (s7 !== peg$FAILED) {
                                                s8 = peg$parse__();
                                                if (s8 !== peg$FAILED) {
                                                    s9 = peg$parseorder_by_clause();
                                                    if (s9 === peg$FAILED) {
                                                        s9 = null;
                                                    }
                                                    if (s9 !== peg$FAILED) {
                                                        peg$savedPos = s0;
                                                        s1 = peg$c442(s1, s5, s9);
                                                        s0 = s1;
                                                    } else {
                                                        peg$currPos = s0;
                                                        s0 = peg$FAILED;
                                                    }
                                                } else {
                                                    peg$currPos = s0;
                                                    s0 = peg$FAILED;
                                                }
                                            } else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                            }
                                        } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
            }
            return s0;
        }
        function peg$parsestar_expr() {
            var s0, s1;
            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 42) {
                s1 = peg$c392;
                peg$currPos++;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c393);
                }
            }
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c443();
            }
            s0 = s1;
            return s0;
        }
        function peg$parsefunc_call() {
            var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;
            s0 = peg$parseextract_func();
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parseproc_func_name();
                if (s1 !== peg$FAILED) {
                    s2 = peg$parse__();
                    if (s2 !== peg$FAILED) {
                        s3 = peg$parseLPAREN();
                        if (s3 !== peg$FAILED) {
                            s4 = peg$parse__();
                            if (s4 !== peg$FAILED) {
                                s5 = peg$parseor_and_where_expr();
                                if (s5 === peg$FAILED) {
                                    s5 = null;
                                }
                                if (s5 !== peg$FAILED) {
                                    s6 = peg$parse__();
                                    if (s6 !== peg$FAILED) {
                                        s7 = peg$parseRPAREN();
                                        if (s7 !== peg$FAILED) {
                                            s8 = peg$parse__();
                                            if (s8 !== peg$FAILED) {
                                                s9 = peg$parseover_partition();
                                                if (s9 === peg$FAILED) {
                                                    s9 = null;
                                                }
                                                if (s9 !== peg$FAILED) {
                                                    peg$savedPos = s0;
                                                    s1 = peg$c444(s1, s5, s9);
                                                    s0 = s1;
                                                } else {
                                                    peg$currPos = s0;
                                                    s0 = peg$FAILED;
                                                }
                                            } else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                            }
                                        } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
                if (s0 === peg$FAILED) {
                    s0 = peg$currPos;
                    s1 = peg$parsescalar_func();
                    if (s1 !== peg$FAILED) {
                        s2 = peg$parse__();
                        if (s2 !== peg$FAILED) {
                            s3 = peg$parseLPAREN();
                            if (s3 !== peg$FAILED) {
                                s4 = peg$parse__();
                                if (s4 !== peg$FAILED) {
                                    s5 = peg$parseexpr_list();
                                    if (s5 === peg$FAILED) {
                                        s5 = null;
                                    }
                                    if (s5 !== peg$FAILED) {
                                        s6 = peg$parse__();
                                        if (s6 !== peg$FAILED) {
                                            s7 = peg$parseRPAREN();
                                            if (s7 !== peg$FAILED) {
                                                s8 = peg$parse__();
                                                if (s8 !== peg$FAILED) {
                                                    s9 = peg$parseover_partition();
                                                    if (s9 === peg$FAILED) {
                                                        s9 = null;
                                                    }
                                                    if (s9 !== peg$FAILED) {
                                                        peg$savedPos = s0;
                                                        s1 = peg$c445(s1, s5, s9);
                                                        s0 = s1;
                                                    } else {
                                                        peg$currPos = s0;
                                                        s0 = peg$FAILED;
                                                    }
                                                } else {
                                                    peg$currPos = s0;
                                                    s0 = peg$FAILED;
                                                }
                                            } else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                            }
                                        } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                    if (s0 === peg$FAILED) {
                        s0 = peg$currPos;
                        s1 = peg$parseKW_CURRENT_TIMESTAMP();
                        if (s1 !== peg$FAILED) {
                            s2 = peg$parse__();
                            if (s2 !== peg$FAILED) {
                                s3 = peg$parseon_update_current_timestamp();
                                if (s3 === peg$FAILED) {
                                    s3 = null;
                                }
                                if (s3 !== peg$FAILED) {
                                    peg$savedPos = s0;
                                    s1 = peg$c446(s1, s3);
                                    s0 = s1;
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }
                }
            }
            return s0;
        }
        function peg$parseproc_func_name() {
            var s0, s1, s2, s3, s4, s5, s6, s7;
            s0 = peg$currPos;
            s1 = peg$parseident();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                s4 = peg$parse__();
                if (s4 !== peg$FAILED) {
                    s5 = peg$parseDOT();
                    if (s5 !== peg$FAILED) {
                        s6 = peg$parse__();
                        if (s6 !== peg$FAILED) {
                            s7 = peg$parseident();
                            if (s7 !== peg$FAILED) {
                                s4 = [s4, s5, s6, s7];
                                s3 = s4;
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$currPos;
                    s4 = peg$parse__();
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parseDOT();
                        if (s5 !== peg$FAILED) {
                            s6 = peg$parse__();
                            if (s6 !== peg$FAILED) {
                                s7 = peg$parseident();
                                if (s7 !== peg$FAILED) {
                                    s4 = [s4, s5, s6, s7];
                                    s3 = s4;
                                } else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c447(s1, s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsescalar_func() {
            var s0;
            s0 = peg$parseKW_CURRENT_DATE();
            if (s0 === peg$FAILED) {
                s0 = peg$parseKW_CURRENT_TIME();
                if (s0 === peg$FAILED) {
                    s0 = peg$parseKW_CURRENT_TIMESTAMP();
                    if (s0 === peg$FAILED) {
                        s0 = peg$parseKW_SESSION_USER();
                    }
                }
            }
            return s0;
        }
        function peg$parseextract_filed() {
            var s0, s1;
            if (input.substr(peg$currPos, 7).toLowerCase() === peg$c448) {
                s0 = input.substr(peg$currPos, 7);
                peg$currPos += 7;
            } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c449);
                }
            }
            if (s0 === peg$FAILED) {
                if (input.substr(peg$currPos, 3).toLowerCase() === peg$c450) {
                    s0 = input.substr(peg$currPos, 3);
                    peg$currPos += 3;
                } else {
                    s0 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c451);
                    }
                }
                if (s0 === peg$FAILED) {
                    if (input.substr(peg$currPos, 6).toLowerCase() === peg$c452) {
                        s0 = input.substr(peg$currPos, 6);
                        peg$currPos += 6;
                    } else {
                        s0 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c453);
                        }
                    }
                    if (s0 === peg$FAILED) {
                        if (input.substr(peg$currPos, 3).toLowerCase() === peg$c454) {
                            s0 = input.substr(peg$currPos, 3);
                            peg$currPos += 3;
                        } else {
                            s0 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c455);
                            }
                        }
                        if (s0 === peg$FAILED) {
                            if (input.substr(peg$currPos, 3).toLowerCase() === peg$c456) {
                                s0 = input.substr(peg$currPos, 3);
                                peg$currPos += 3;
                            } else {
                                s0 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c457);
                                }
                            }
                            if (s0 === peg$FAILED) {
                                if (input.substr(peg$currPos, 5).toLowerCase() === peg$c458) {
                                    s0 = input.substr(peg$currPos, 5);
                                    peg$currPos += 5;
                                } else {
                                    s0 = peg$FAILED;
                                    if (peg$silentFails === 0) {
                                        peg$fail(peg$c459);
                                    }
                                }
                                if (s0 === peg$FAILED) {
                                    if (input.substr(peg$currPos, 4).toLowerCase() === peg$c460) {
                                        s0 = input.substr(peg$currPos, 4);
                                        peg$currPos += 4;
                                    } else {
                                        s0 = peg$FAILED;
                                        if (peg$silentFails === 0) {
                                            peg$fail(peg$c461);
                                        }
                                    }
                                    if (s0 === peg$FAILED) {
                                        if (input.substr(peg$currPos, 6).toLowerCase() === peg$c462) {
                                            s0 = input.substr(peg$currPos, 6);
                                            peg$currPos += 6;
                                        } else {
                                            s0 = peg$FAILED;
                                            if (peg$silentFails === 0) {
                                                peg$fail(peg$c463);
                                            }
                                        }
                                        if (s0 === peg$FAILED) {
                                            if (input.substr(peg$currPos, 7).toLowerCase() === peg$c464) {
                                                s0 = input.substr(peg$currPos, 7);
                                                peg$currPos += 7;
                                            } else {
                                                s0 = peg$FAILED;
                                                if (peg$silentFails === 0) {
                                                    peg$fail(peg$c465);
                                                }
                                            }
                                            if (s0 === peg$FAILED) {
                                                if (input.substr(peg$currPos, 12).toLowerCase() === peg$c466) {
                                                    s0 = input.substr(peg$currPos, 12);
                                                    peg$currPos += 12;
                                                } else {
                                                    s0 = peg$FAILED;
                                                    if (peg$silentFails === 0) {
                                                        peg$fail(peg$c467);
                                                    }
                                                }
                                                if (s0 === peg$FAILED) {
                                                    if (input.substr(peg$currPos, 10).toLowerCase() === peg$c468) {
                                                        s0 = input.substr(peg$currPos, 10);
                                                        peg$currPos += 10;
                                                    } else {
                                                        s0 = peg$FAILED;
                                                        if (peg$silentFails === 0) {
                                                            peg$fail(peg$c469);
                                                        }
                                                    }
                                                    if (s0 === peg$FAILED) {
                                                        if (input.substr(peg$currPos, 12).toLowerCase() === peg$c470) {
                                                            s0 = input.substr(peg$currPos, 12);
                                                            peg$currPos += 12;
                                                        } else {
                                                            s0 = peg$FAILED;
                                                            if (peg$silentFails === 0) {
                                                                peg$fail(peg$c471);
                                                            }
                                                        }
                                                        if (s0 === peg$FAILED) {
                                                            if (input.substr(peg$currPos, 6).toLowerCase() === peg$c472) {
                                                                s0 = input.substr(peg$currPos, 6);
                                                                peg$currPos += 6;
                                                            } else {
                                                                s0 = peg$FAILED;
                                                                if (peg$silentFails === 0) {
                                                                    peg$fail(peg$c473);
                                                                }
                                                            }
                                                            if (s0 === peg$FAILED) {
                                                                if (input.substr(peg$currPos, 5).toLowerCase() === peg$c474) {
                                                                    s0 = input.substr(peg$currPos, 5);
                                                                    peg$currPos += 5;
                                                                } else {
                                                                    s0 = peg$FAILED;
                                                                    if (peg$silentFails === 0) {
                                                                        peg$fail(peg$c475);
                                                                    }
                                                                }
                                                                if (s0 === peg$FAILED) {
                                                                    if (input.substr(peg$currPos, 7).toLowerCase() === peg$c476) {
                                                                        s0 = input.substr(peg$currPos, 7);
                                                                        peg$currPos += 7;
                                                                    } else {
                                                                        s0 = peg$FAILED;
                                                                        if (peg$silentFails === 0) {
                                                                            peg$fail(peg$c477);
                                                                        }
                                                                    }
                                                                    if (s0 === peg$FAILED) {
                                                                        if (input.substr(peg$currPos, 6).toLowerCase() === peg$c478) {
                                                                            s0 = input.substr(peg$currPos, 6);
                                                                            peg$currPos += 6;
                                                                        } else {
                                                                            s0 = peg$FAILED;
                                                                            if (peg$silentFails === 0) {
                                                                                peg$fail(peg$c479);
                                                                            }
                                                                        }
                                                                        if (s0 === peg$FAILED) {
                                                                            if (input.substr(peg$currPos, 8).toLowerCase() === peg$c480) {
                                                                                s0 = input.substr(peg$currPos, 8);
                                                                                peg$currPos += 8;
                                                                            } else {
                                                                                s0 = peg$FAILED;
                                                                                if (peg$silentFails === 0) {
                                                                                    peg$fail(peg$c481);
                                                                                }
                                                                            }
                                                                            if (s0 === peg$FAILED) {
                                                                                if (input.substr(peg$currPos, 13).toLowerCase() === peg$c482) {
                                                                                    s0 = input.substr(peg$currPos, 13);
                                                                                    peg$currPos += 13;
                                                                                } else {
                                                                                    s0 = peg$FAILED;
                                                                                    if (peg$silentFails === 0) {
                                                                                        peg$fail(peg$c483);
                                                                                    }
                                                                                }
                                                                                if (s0 === peg$FAILED) {
                                                                                    if (input.substr(peg$currPos, 15).toLowerCase() === peg$c484) {
                                                                                        s0 = input.substr(peg$currPos, 15);
                                                                                        peg$currPos += 15;
                                                                                    } else {
                                                                                        s0 = peg$FAILED;
                                                                                        if (peg$silentFails === 0) {
                                                                                            peg$fail(peg$c485);
                                                                                        }
                                                                                    }
                                                                                    if (s0 === peg$FAILED) {
                                                                                        if (input.substr(peg$currPos, 4).toLowerCase() === peg$c486) {
                                                                                            s0 = input.substr(peg$currPos, 4);
                                                                                            peg$currPos += 4;
                                                                                        } else {
                                                                                            s0 = peg$FAILED;
                                                                                            if (peg$silentFails === 0) {
                                                                                                peg$fail(peg$c487);
                                                                                            }
                                                                                        }
                                                                                        if (s0 === peg$FAILED) {
                                                                                            s0 = peg$currPos;
                                                                                            if (input.substr(peg$currPos, 4).toLowerCase() === peg$c488) {
                                                                                                s1 = input.substr(peg$currPos, 4);
                                                                                                peg$currPos += 4;
                                                                                            } else {
                                                                                                s1 = peg$FAILED;
                                                                                                if (peg$silentFails === 0) {
                                                                                                    peg$fail(peg$c489);
                                                                                                }
                                                                                            }
                                                                                            if (s1 !== peg$FAILED) {
                                                                                                peg$savedPos = s0;
                                                                                                s1 = peg$c490();
                                                                                            }
                                                                                            s0 = s1;
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return s0;
        }
        function peg$parseextract_func() {
            var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13;
            s0 = peg$currPos;
            s1 = peg$parseKW_EXTRACT();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseLPAREN();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parseextract_filed();
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parse__();
                                if (s6 !== peg$FAILED) {
                                    s7 = peg$parseKW_FROM();
                                    if (s7 !== peg$FAILED) {
                                        s8 = peg$parse__();
                                        if (s8 !== peg$FAILED) {
                                            s9 = peg$parseKW_TIMESTAMP();
                                            if (s9 === peg$FAILED) {
                                                s9 = peg$parseKW_INTERVAL();
                                                if (s9 === peg$FAILED) {
                                                    s9 = peg$parseKW_TIME();
                                                    if (s9 === peg$FAILED) {
                                                        s9 = peg$parseKW_DATE();
                                                    }
                                                }
                                            }
                                            if (s9 === peg$FAILED) {
                                                s9 = null;
                                            }
                                            if (s9 !== peg$FAILED) {
                                                s10 = peg$parse__();
                                                if (s10 !== peg$FAILED) {
                                                    s11 = peg$parseexpr();
                                                    if (s11 !== peg$FAILED) {
                                                        s12 = peg$parse__();
                                                        if (s12 !== peg$FAILED) {
                                                            s13 = peg$parseRPAREN();
                                                            if (s13 !== peg$FAILED) {
                                                                peg$savedPos = s0;
                                                                s1 = peg$c491(s1, s5, s9, s11);
                                                                s0 = s1;
                                                            } else {
                                                                peg$currPos = s0;
                                                                s0 = peg$FAILED;
                                                            }
                                                        } else {
                                                            peg$currPos = s0;
                                                            s0 = peg$FAILED;
                                                        }
                                                    } else {
                                                        peg$currPos = s0;
                                                        s0 = peg$FAILED;
                                                    }
                                                } else {
                                                    peg$currPos = s0;
                                                    s0 = peg$FAILED;
                                                }
                                            } else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                            }
                                        } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsecast_expr() {
            var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21;
            s0 = peg$currPos;
            s1 = peg$parseKW_CAST();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseLPAREN();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parseexpr();
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parse__();
                                if (s6 !== peg$FAILED) {
                                    s7 = peg$parseKW_AS();
                                    if (s7 !== peg$FAILED) {
                                        s8 = peg$parse__();
                                        if (s8 !== peg$FAILED) {
                                            s9 = peg$parsedata_type();
                                            if (s9 !== peg$FAILED) {
                                                s10 = peg$parse__();
                                                if (s10 !== peg$FAILED) {
                                                    s11 = peg$parseRPAREN();
                                                    if (s11 !== peg$FAILED) {
                                                        peg$savedPos = s0;
                                                        s1 = peg$c492(s5, s9);
                                                        s0 = s1;
                                                    } else {
                                                        peg$currPos = s0;
                                                        s0 = peg$FAILED;
                                                    }
                                                } else {
                                                    peg$currPos = s0;
                                                    s0 = peg$FAILED;
                                                }
                                            } else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                            }
                                        } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parseKW_CAST();
                if (s1 !== peg$FAILED) {
                    s2 = peg$parse__();
                    if (s2 !== peg$FAILED) {
                        s3 = peg$parseLPAREN();
                        if (s3 !== peg$FAILED) {
                            s4 = peg$parse__();
                            if (s4 !== peg$FAILED) {
                                s5 = peg$parseexpr();
                                if (s5 !== peg$FAILED) {
                                    s6 = peg$parse__();
                                    if (s6 !== peg$FAILED) {
                                        s7 = peg$parseKW_AS();
                                        if (s7 !== peg$FAILED) {
                                            s8 = peg$parse__();
                                            if (s8 !== peg$FAILED) {
                                                s9 = peg$parseKW_DECIMAL();
                                                if (s9 !== peg$FAILED) {
                                                    s10 = peg$parse__();
                                                    if (s10 !== peg$FAILED) {
                                                        s11 = peg$parseLPAREN();
                                                        if (s11 !== peg$FAILED) {
                                                            s12 = peg$parse__();
                                                            if (s12 !== peg$FAILED) {
                                                                s13 = peg$parseint();
                                                                if (s13 !== peg$FAILED) {
                                                                    s14 = peg$parse__();
                                                                    if (s14 !== peg$FAILED) {
                                                                        s15 = peg$parseRPAREN();
                                                                        if (s15 !== peg$FAILED) {
                                                                            s16 = peg$parse__();
                                                                            if (s16 !== peg$FAILED) {
                                                                                s17 = peg$parseRPAREN();
                                                                                if (s17 !== peg$FAILED) {
                                                                                    peg$savedPos = s0;
                                                                                    s1 = peg$c493(s5, s13);
                                                                                    s0 = s1;
                                                                                } else {
                                                                                    peg$currPos = s0;
                                                                                    s0 = peg$FAILED;
                                                                                }
                                                                            } else {
                                                                                peg$currPos = s0;
                                                                                s0 = peg$FAILED;
                                                                            }
                                                                        } else {
                                                                            peg$currPos = s0;
                                                                            s0 = peg$FAILED;
                                                                        }
                                                                    } else {
                                                                        peg$currPos = s0;
                                                                        s0 = peg$FAILED;
                                                                    }
                                                                } else {
                                                                    peg$currPos = s0;
                                                                    s0 = peg$FAILED;
                                                                }
                                                            } else {
                                                                peg$currPos = s0;
                                                                s0 = peg$FAILED;
                                                            }
                                                        } else {
                                                            peg$currPos = s0;
                                                            s0 = peg$FAILED;
                                                        }
                                                    } else {
                                                        peg$currPos = s0;
                                                        s0 = peg$FAILED;
                                                    }
                                                } else {
                                                    peg$currPos = s0;
                                                    s0 = peg$FAILED;
                                                }
                                            } else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                            }
                                        } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
                if (s0 === peg$FAILED) {
                    s0 = peg$currPos;
                    s1 = peg$parseKW_CAST();
                    if (s1 !== peg$FAILED) {
                        s2 = peg$parse__();
                        if (s2 !== peg$FAILED) {
                            s3 = peg$parseLPAREN();
                            if (s3 !== peg$FAILED) {
                                s4 = peg$parse__();
                                if (s4 !== peg$FAILED) {
                                    s5 = peg$parseexpr();
                                    if (s5 !== peg$FAILED) {
                                        s6 = peg$parse__();
                                        if (s6 !== peg$FAILED) {
                                            s7 = peg$parseKW_AS();
                                            if (s7 !== peg$FAILED) {
                                                s8 = peg$parse__();
                                                if (s8 !== peg$FAILED) {
                                                    s9 = peg$parseKW_DECIMAL();
                                                    if (s9 !== peg$FAILED) {
                                                        s10 = peg$parse__();
                                                        if (s10 !== peg$FAILED) {
                                                            s11 = peg$parseLPAREN();
                                                            if (s11 !== peg$FAILED) {
                                                                s12 = peg$parse__();
                                                                if (s12 !== peg$FAILED) {
                                                                    s13 = peg$parseint();
                                                                    if (s13 !== peg$FAILED) {
                                                                        s14 = peg$parse__();
                                                                        if (s14 !== peg$FAILED) {
                                                                            s15 = peg$parseCOMMA();
                                                                            if (s15 !== peg$FAILED) {
                                                                                s16 = peg$parse__();
                                                                                if (s16 !== peg$FAILED) {
                                                                                    s17 = peg$parseint();
                                                                                    if (s17 !== peg$FAILED) {
                                                                                        s18 = peg$parse__();
                                                                                        if (s18 !== peg$FAILED) {
                                                                                            s19 = peg$parseRPAREN();
                                                                                            if (s19 !== peg$FAILED) {
                                                                                                s20 = peg$parse__();
                                                                                                if (s20 !== peg$FAILED) {
                                                                                                    s21 = peg$parseRPAREN();
                                                                                                    if (s21 !== peg$FAILED) {
                                                                                                        peg$savedPos = s0;
                                                                                                        s1 = peg$c494(s5, s13, s17);
                                                                                                        s0 = s1;
                                                                                                    } else {
                                                                                                        peg$currPos = s0;
                                                                                                        s0 = peg$FAILED;
                                                                                                    }
                                                                                                } else {
                                                                                                    peg$currPos = s0;
                                                                                                    s0 = peg$FAILED;
                                                                                                }
                                                                                            } else {
                                                                                                peg$currPos = s0;
                                                                                                s0 = peg$FAILED;
                                                                                            }
                                                                                        } else {
                                                                                            peg$currPos = s0;
                                                                                            s0 = peg$FAILED;
                                                                                        }
                                                                                    } else {
                                                                                        peg$currPos = s0;
                                                                                        s0 = peg$FAILED;
                                                                                    }
                                                                                } else {
                                                                                    peg$currPos = s0;
                                                                                    s0 = peg$FAILED;
                                                                                }
                                                                            } else {
                                                                                peg$currPos = s0;
                                                                                s0 = peg$FAILED;
                                                                            }
                                                                        } else {
                                                                            peg$currPos = s0;
                                                                            s0 = peg$FAILED;
                                                                        }
                                                                    } else {
                                                                        peg$currPos = s0;
                                                                        s0 = peg$FAILED;
                                                                    }
                                                                } else {
                                                                    peg$currPos = s0;
                                                                    s0 = peg$FAILED;
                                                                }
                                                            } else {
                                                                peg$currPos = s0;
                                                                s0 = peg$FAILED;
                                                            }
                                                        } else {
                                                            peg$currPos = s0;
                                                            s0 = peg$FAILED;
                                                        }
                                                    } else {
                                                        peg$currPos = s0;
                                                        s0 = peg$FAILED;
                                                    }
                                                } else {
                                                    peg$currPos = s0;
                                                    s0 = peg$FAILED;
                                                }
                                            } else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                            }
                                        } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                    if (s0 === peg$FAILED) {
                        s0 = peg$currPos;
                        s1 = peg$parseKW_CAST();
                        if (s1 !== peg$FAILED) {
                            s2 = peg$parse__();
                            if (s2 !== peg$FAILED) {
                                s3 = peg$parseLPAREN();
                                if (s3 !== peg$FAILED) {
                                    s4 = peg$parse__();
                                    if (s4 !== peg$FAILED) {
                                        s5 = peg$parseexpr();
                                        if (s5 !== peg$FAILED) {
                                            s6 = peg$parse__();
                                            if (s6 !== peg$FAILED) {
                                                s7 = peg$parseKW_AS();
                                                if (s7 !== peg$FAILED) {
                                                    s8 = peg$parse__();
                                                    if (s8 !== peg$FAILED) {
                                                        s9 = peg$parsesignedness();
                                                        if (s9 !== peg$FAILED) {
                                                            s10 = peg$parse__();
                                                            if (s10 !== peg$FAILED) {
                                                                s11 = peg$parseKW_INTEGER();
                                                                if (s11 === peg$FAILED) {
                                                                    s11 = null;
                                                                }
                                                                if (s11 !== peg$FAILED) {
                                                                    s12 = peg$parse__();
                                                                    if (s12 !== peg$FAILED) {
                                                                        s13 = peg$parseRPAREN();
                                                                        if (s13 !== peg$FAILED) {
                                                                            peg$savedPos = s0;
                                                                            s1 = peg$c495(s5, s9, s11);
                                                                            s0 = s1;
                                                                        } else {
                                                                            peg$currPos = s0;
                                                                            s0 = peg$FAILED;
                                                                        }
                                                                    } else {
                                                                        peg$currPos = s0;
                                                                        s0 = peg$FAILED;
                                                                    }
                                                                } else {
                                                                    peg$currPos = s0;
                                                                    s0 = peg$FAILED;
                                                                }
                                                            } else {
                                                                peg$currPos = s0;
                                                                s0 = peg$FAILED;
                                                            }
                                                        } else {
                                                            peg$currPos = s0;
                                                            s0 = peg$FAILED;
                                                        }
                                                    } else {
                                                        peg$currPos = s0;
                                                        s0 = peg$FAILED;
                                                    }
                                                } else {
                                                    peg$currPos = s0;
                                                    s0 = peg$FAILED;
                                                }
                                            } else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                            }
                                        } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }
                }
            }
            return s0;
        }
        function peg$parsesignedness() {
            var s0;
            s0 = peg$parseKW_SIGNED();
            if (s0 === peg$FAILED) {
                s0 = peg$parseKW_UNSIGNED();
            }
            return s0;
        }
        function peg$parseliteral() {
            var s0;
            s0 = peg$parseliteral_string();
            if (s0 === peg$FAILED) {
                s0 = peg$parseliteral_numeric();
                if (s0 === peg$FAILED) {
                    s0 = peg$parseliteral_bool();
                    if (s0 === peg$FAILED) {
                        s0 = peg$parseliteral_null();
                        if (s0 === peg$FAILED) {
                            s0 = peg$parseliteral_datetime();
                        }
                    }
                }
            }
            return s0;
        }
        function peg$parseliteral_list() {
            var s0, s1, s2, s3, s4, s5, s6, s7;
            s0 = peg$currPos;
            s1 = peg$parseliteral();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                s4 = peg$parse__();
                if (s4 !== peg$FAILED) {
                    s5 = peg$parseCOMMA();
                    if (s5 !== peg$FAILED) {
                        s6 = peg$parse__();
                        if (s6 !== peg$FAILED) {
                            s7 = peg$parseliteral();
                            if (s7 !== peg$FAILED) {
                                s4 = [s4, s5, s6, s7];
                                s3 = s4;
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$currPos;
                    s4 = peg$parse__();
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parseCOMMA();
                        if (s5 !== peg$FAILED) {
                            s6 = peg$parse__();
                            if (s6 !== peg$FAILED) {
                                s7 = peg$parseliteral();
                                if (s7 !== peg$FAILED) {
                                    s4 = [s4, s5, s6, s7];
                                    s3 = s4;
                                } else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c16(s1, s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseliteral_null() {
            var s0, s1;
            s0 = peg$currPos;
            s1 = peg$parseKW_NULL();
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c496();
            }
            s0 = s1;
            return s0;
        }
        function peg$parseliteral_not_null() {
            var s0, s1;
            s0 = peg$currPos;
            s1 = peg$parseKW_NOT_NULL();
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c497();
            }
            s0 = s1;
            return s0;
        }
        function peg$parseliteral_bool() {
            var s0, s1;
            s0 = peg$currPos;
            s1 = peg$parseKW_TRUE();
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c498();
            }
            s0 = s1;
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parseKW_FALSE();
                if (s1 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c499();
                }
                s0 = s1;
            }
            return s0;
        }
        function peg$parseliteral_string() {
            var s0, s1, s2, s3, s4, s5, s6;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 1).toLowerCase() === peg$c500) {
                s1 = input.charAt(peg$currPos);
                peg$currPos++;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c501);
                }
            }
            if (s1 === peg$FAILED) {
                s1 = null;
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$currPos;
                    if (input.charCodeAt(peg$currPos) === 39) {
                        s4 = peg$c153;
                        peg$currPos++;
                    } else {
                        s4 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c154);
                        }
                    }
                    if (s4 !== peg$FAILED) {
                        s5 = [];
                        s6 = peg$parsesingle_char();
                        while (s6 !== peg$FAILED) {
                            s5.push(s6);
                            s6 = peg$parsesingle_char();
                        }
                        if (s5 !== peg$FAILED) {
                            if (input.charCodeAt(peg$currPos) === 39) {
                                s6 = peg$c153;
                                peg$currPos++;
                            } else {
                                s6 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c154);
                                }
                            }
                            if (s6 !== peg$FAILED) {
                                s4 = [s4, s5, s6];
                                s3 = s4;
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c502(s1, s3);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                if (input.substr(peg$currPos, 1).toLowerCase() === peg$c500) {
                    s1 = input.charAt(peg$currPos);
                    peg$currPos++;
                } else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c501);
                    }
                }
                if (s1 === peg$FAILED) {
                    s1 = null;
                }
                if (s1 !== peg$FAILED) {
                    s2 = peg$parse__();
                    if (s2 !== peg$FAILED) {
                        s3 = peg$currPos;
                        if (input.charCodeAt(peg$currPos) === 34) {
                            s4 = peg$c409;
                            peg$currPos++;
                        } else {
                            s4 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c410);
                            }
                        }
                        if (s4 !== peg$FAILED) {
                            s5 = [];
                            s6 = peg$parsesingle_quote_char();
                            while (s6 !== peg$FAILED) {
                                s5.push(s6);
                                s6 = peg$parsesingle_quote_char();
                            }
                            if (s5 !== peg$FAILED) {
                                if (input.charCodeAt(peg$currPos) === 34) {
                                    s6 = peg$c409;
                                    peg$currPos++;
                                } else {
                                    s6 = peg$FAILED;
                                    if (peg$silentFails === 0) {
                                        peg$fail(peg$c410);
                                    }
                                }
                                if (s6 !== peg$FAILED) {
                                    s4 = [s4, s5, s6];
                                    s3 = s4;
                                } else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                        if (s3 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c503(s1, s3);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            return s0;
        }
        function peg$parseliteral_datetime() {
            var s0, s1, s2, s3, s4, s5, s6;
            s0 = peg$currPos;
            s1 = peg$parseKW_TIME();
            if (s1 === peg$FAILED) {
                s1 = peg$parseKW_DATE();
                if (s1 === peg$FAILED) {
                    s1 = peg$parseKW_TIMESTAMP();
                    if (s1 === peg$FAILED) {
                        s1 = peg$parseKW_DATETIME();
                    }
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$currPos;
                    if (input.charCodeAt(peg$currPos) === 39) {
                        s4 = peg$c153;
                        peg$currPos++;
                    } else {
                        s4 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c154);
                        }
                    }
                    if (s4 !== peg$FAILED) {
                        s5 = [];
                        s6 = peg$parsesingle_char();
                        while (s6 !== peg$FAILED) {
                            s5.push(s6);
                            s6 = peg$parsesingle_char();
                        }
                        if (s5 !== peg$FAILED) {
                            if (input.charCodeAt(peg$currPos) === 39) {
                                s6 = peg$c153;
                                peg$currPos++;
                            } else {
                                s6 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c154);
                                }
                            }
                            if (s6 !== peg$FAILED) {
                                s4 = [s4, s5, s6];
                                s3 = s4;
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c504(s1, s3);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parseKW_TIME();
                if (s1 === peg$FAILED) {
                    s1 = peg$parseKW_DATE();
                    if (s1 === peg$FAILED) {
                        s1 = peg$parseKW_TIMESTAMP();
                        if (s1 === peg$FAILED) {
                            s1 = peg$parseKW_DATETIME();
                        }
                    }
                }
                if (s1 !== peg$FAILED) {
                    s2 = peg$parse__();
                    if (s2 !== peg$FAILED) {
                        s3 = peg$currPos;
                        if (input.charCodeAt(peg$currPos) === 34) {
                            s4 = peg$c409;
                            peg$currPos++;
                        } else {
                            s4 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c410);
                            }
                        }
                        if (s4 !== peg$FAILED) {
                            s5 = [];
                            s6 = peg$parsesingle_quote_char();
                            while (s6 !== peg$FAILED) {
                                s5.push(s6);
                                s6 = peg$parsesingle_quote_char();
                            }
                            if (s5 !== peg$FAILED) {
                                if (input.charCodeAt(peg$currPos) === 34) {
                                    s6 = peg$c409;
                                    peg$currPos++;
                                } else {
                                    s6 = peg$FAILED;
                                    if (peg$silentFails === 0) {
                                        peg$fail(peg$c410);
                                    }
                                }
                                if (s6 !== peg$FAILED) {
                                    s4 = [s4, s5, s6];
                                    s3 = s4;
                                } else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                        if (s3 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c504(s1, s3);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            return s0;
        }
        function peg$parsesingle_quote_char() {
            var s0;
            if (peg$c505.test(input.charAt(peg$currPos))) {
                s0 = input.charAt(peg$currPos);
                peg$currPos++;
            } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c506);
                }
            }
            if (s0 === peg$FAILED) {
                s0 = peg$parseescape_char();
            }
            return s0;
        }
        function peg$parsesingle_char() {
            var s0;
            if (peg$c507.test(input.charAt(peg$currPos))) {
                s0 = input.charAt(peg$currPos);
                peg$currPos++;
            } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c508);
                }
            }
            if (s0 === peg$FAILED) {
                s0 = peg$parseescape_char();
            }
            return s0;
        }
        function peg$parseescape_char() {
            var s0, s1, s2, s3, s4, s5;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 2) === peg$c509) {
                s1 = peg$c509;
                peg$currPos += 2;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c510);
                }
            }
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c511();
            }
            s0 = s1;
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                if (input.substr(peg$currPos, 2) === peg$c512) {
                    s1 = peg$c512;
                    peg$currPos += 2;
                } else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c513);
                    }
                }
                if (s1 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c514();
                }
                s0 = s1;
                if (s0 === peg$FAILED) {
                    s0 = peg$currPos;
                    if (input.substr(peg$currPos, 2) === peg$c515) {
                        s1 = peg$c515;
                        peg$currPos += 2;
                    } else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c516);
                        }
                    }
                    if (s1 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c517();
                    }
                    s0 = s1;
                    if (s0 === peg$FAILED) {
                        s0 = peg$currPos;
                        if (input.substr(peg$currPos, 2) === peg$c518) {
                            s1 = peg$c518;
                            peg$currPos += 2;
                        } else {
                            s1 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c519);
                            }
                        }
                        if (s1 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c520();
                        }
                        s0 = s1;
                        if (s0 === peg$FAILED) {
                            s0 = peg$currPos;
                            if (input.substr(peg$currPos, 2) === peg$c521) {
                                s1 = peg$c521;
                                peg$currPos += 2;
                            } else {
                                s1 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c522);
                                }
                            }
                            if (s1 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c523();
                            }
                            s0 = s1;
                            if (s0 === peg$FAILED) {
                                s0 = peg$currPos;
                                if (input.substr(peg$currPos, 2) === peg$c524) {
                                    s1 = peg$c524;
                                    peg$currPos += 2;
                                } else {
                                    s1 = peg$FAILED;
                                    if (peg$silentFails === 0) {
                                        peg$fail(peg$c525);
                                    }
                                }
                                if (s1 !== peg$FAILED) {
                                    peg$savedPos = s0;
                                    s1 = peg$c526();
                                }
                                s0 = s1;
                                if (s0 === peg$FAILED) {
                                    s0 = peg$currPos;
                                    if (input.substr(peg$currPos, 2) === peg$c527) {
                                        s1 = peg$c527;
                                        peg$currPos += 2;
                                    } else {
                                        s1 = peg$FAILED;
                                        if (peg$silentFails === 0) {
                                            peg$fail(peg$c528);
                                        }
                                    }
                                    if (s1 !== peg$FAILED) {
                                        peg$savedPos = s0;
                                        s1 = peg$c529();
                                    }
                                    s0 = s1;
                                    if (s0 === peg$FAILED) {
                                        s0 = peg$currPos;
                                        if (input.substr(peg$currPos, 2) === peg$c530) {
                                            s1 = peg$c530;
                                            peg$currPos += 2;
                                        } else {
                                            s1 = peg$FAILED;
                                            if (peg$silentFails === 0) {
                                                peg$fail(peg$c531);
                                            }
                                        }
                                        if (s1 !== peg$FAILED) {
                                            peg$savedPos = s0;
                                            s1 = peg$c532();
                                        }
                                        s0 = s1;
                                        if (s0 === peg$FAILED) {
                                            s0 = peg$currPos;
                                            if (input.substr(peg$currPos, 2) === peg$c533) {
                                                s1 = peg$c533;
                                                peg$currPos += 2;
                                            } else {
                                                s1 = peg$FAILED;
                                                if (peg$silentFails === 0) {
                                                    peg$fail(peg$c534);
                                                }
                                            }
                                            if (s1 !== peg$FAILED) {
                                                peg$savedPos = s0;
                                                s1 = peg$c535();
                                            }
                                            s0 = s1;
                                            if (s0 === peg$FAILED) {
                                                s0 = peg$currPos;
                                                if (input.substr(peg$currPos, 2) === peg$c536) {
                                                    s1 = peg$c536;
                                                    peg$currPos += 2;
                                                } else {
                                                    s1 = peg$FAILED;
                                                    if (peg$silentFails === 0) {
                                                        peg$fail(peg$c537);
                                                    }
                                                }
                                                if (s1 !== peg$FAILED) {
                                                    s2 = peg$parsehexDigit();
                                                    if (s2 !== peg$FAILED) {
                                                        s3 = peg$parsehexDigit();
                                                        if (s3 !== peg$FAILED) {
                                                            s4 = peg$parsehexDigit();
                                                            if (s4 !== peg$FAILED) {
                                                                s5 = peg$parsehexDigit();
                                                                if (s5 !== peg$FAILED) {
                                                                    peg$savedPos = s0;
                                                                    s1 = peg$c538(s2, s3, s4, s5);
                                                                    s0 = s1;
                                                                } else {
                                                                    peg$currPos = s0;
                                                                    s0 = peg$FAILED;
                                                                }
                                                            } else {
                                                                peg$currPos = s0;
                                                                s0 = peg$FAILED;
                                                            }
                                                        } else {
                                                            peg$currPos = s0;
                                                            s0 = peg$FAILED;
                                                        }
                                                    } else {
                                                        peg$currPos = s0;
                                                        s0 = peg$FAILED;
                                                    }
                                                } else {
                                                    peg$currPos = s0;
                                                    s0 = peg$FAILED;
                                                }
                                                if (s0 === peg$FAILED) {
                                                    s0 = peg$currPos;
                                                    if (input.charCodeAt(peg$currPos) === 92) {
                                                        s1 = peg$c539;
                                                        peg$currPos++;
                                                    } else {
                                                        s1 = peg$FAILED;
                                                        if (peg$silentFails === 0) {
                                                            peg$fail(peg$c540);
                                                        }
                                                    }
                                                    if (s1 !== peg$FAILED) {
                                                        peg$savedPos = s0;
                                                        s1 = peg$c541();
                                                    }
                                                    s0 = s1;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return s0;
        }
        function peg$parseline_terminator() {
            var s0;
            if (peg$c542.test(input.charAt(peg$currPos))) {
                s0 = input.charAt(peg$currPos);
                peg$currPos++;
            } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c543);
                }
            }
            return s0;
        }
        function peg$parseliteral_numeric() {
            var s0, s1;
            s0 = peg$currPos;
            s1 = peg$parsenumber();
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c544(s1);
            }
            s0 = s1;
            return s0;
        }
        function peg$parsenumber() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            s1 = peg$parseint();
            if (s1 !== peg$FAILED) {
                s2 = peg$parsefrac();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseexp();
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c545(s1, s2, s3);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parseint();
                if (s1 !== peg$FAILED) {
                    s2 = peg$parsefrac();
                    if (s2 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c546(s1, s2);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
                if (s0 === peg$FAILED) {
                    s0 = peg$currPos;
                    s1 = peg$parseint();
                    if (s1 !== peg$FAILED) {
                        s2 = peg$parseexp();
                        if (s2 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c547(s1, s2);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                    if (s0 === peg$FAILED) {
                        s0 = peg$currPos;
                        s1 = peg$parseint();
                        if (s1 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c548(s1);
                        }
                        s0 = s1;
                    }
                }
            }
            return s0;
        }
        function peg$parseint() {
            var s0, s1, s2;
            s0 = peg$parsedigits();
            if (s0 === peg$FAILED) {
                s0 = peg$parsedigit();
                if (s0 === peg$FAILED) {
                    s0 = peg$currPos;
                    if (input.charCodeAt(peg$currPos) === 45) {
                        s1 = peg$c389;
                        peg$currPos++;
                    } else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c390);
                        }
                    }
                    if (s1 === peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 43) {
                            s1 = peg$c387;
                            peg$currPos++;
                        } else {
                            s1 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c388);
                            }
                        }
                    }
                    if (s1 !== peg$FAILED) {
                        s2 = peg$parsedigits();
                        if (s2 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c549(s1, s2);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                    if (s0 === peg$FAILED) {
                        s0 = peg$currPos;
                        if (input.charCodeAt(peg$currPos) === 45) {
                            s1 = peg$c389;
                            peg$currPos++;
                        } else {
                            s1 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c390);
                            }
                        }
                        if (s1 === peg$FAILED) {
                            if (input.charCodeAt(peg$currPos) === 43) {
                                s1 = peg$c387;
                                peg$currPos++;
                            } else {
                                s1 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c388);
                                }
                            }
                        }
                        if (s1 !== peg$FAILED) {
                            s2 = peg$parsedigit();
                            if (s2 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c550(s1, s2);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }
                }
            }
            return s0;
        }
        function peg$parsefrac() {
            var s0, s1, s2;
            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 46) {
                s1 = peg$c73;
                peg$currPos++;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c74);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parsedigits();
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c551(s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseexp() {
            var s0, s1, s2;
            s0 = peg$currPos;
            s1 = peg$parsee();
            if (s1 !== peg$FAILED) {
                s2 = peg$parsedigits();
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c552(s1, s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsedigits() {
            var s0, s1, s2;
            s0 = peg$currPos;
            s1 = [];
            s2 = peg$parsedigit();
            if (s2 !== peg$FAILED) {
                while (s2 !== peg$FAILED) {
                    s1.push(s2);
                    s2 = peg$parsedigit();
                }
            } else {
                s1 = peg$FAILED;
            }
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c553(s1);
            }
            s0 = s1;
            return s0;
        }
        function peg$parsedigit() {
            var s0;
            if (peg$c554.test(input.charAt(peg$currPos))) {
                s0 = input.charAt(peg$currPos);
                peg$currPos++;
            } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c555);
                }
            }
            return s0;
        }
        function peg$parsehexDigit() {
            var s0;
            if (peg$c556.test(input.charAt(peg$currPos))) {
                s0 = input.charAt(peg$currPos);
                peg$currPos++;
            } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c557);
                }
            }
            return s0;
        }
        function peg$parsee() {
            var s0, s1, s2;
            s0 = peg$currPos;
            if (peg$c558.test(input.charAt(peg$currPos))) {
                s1 = input.charAt(peg$currPos);
                peg$currPos++;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c559);
                }
            }
            if (s1 !== peg$FAILED) {
                if (peg$c560.test(input.charAt(peg$currPos))) {
                    s2 = input.charAt(peg$currPos);
                    peg$currPos++;
                } else {
                    s2 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c561);
                    }
                }
                if (s2 === peg$FAILED) {
                    s2 = null;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c562(s1, s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_NULL() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 4).toLowerCase() === peg$c563) {
                s1 = input.substr(peg$currPos, 4);
                peg$currPos += 4;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c564);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_DEFAULT() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 7).toLowerCase() === peg$c78) {
                s1 = input.substr(peg$currPos, 7);
                peg$currPos += 7;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c79);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_NOT_NULL() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 8).toLowerCase() === peg$c565) {
                s1 = input.substr(peg$currPos, 8);
                peg$currPos += 8;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c566);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_TRUE() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 4).toLowerCase() === peg$c567) {
                s1 = input.substr(peg$currPos, 4);
                peg$currPos += 4;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c568);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_TO() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 2).toLowerCase() === peg$c569) {
                s1 = input.substr(peg$currPos, 2);
                peg$currPos += 2;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c570);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_FALSE() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 5).toLowerCase() === peg$c571) {
                s1 = input.substr(peg$currPos, 5);
                peg$currPos += 5;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c572);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_DROP() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 4).toLowerCase() === peg$c573) {
                s1 = input.substr(peg$currPos, 4);
                peg$currPos += 4;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c574);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c575();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_USE() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 3).toLowerCase() === peg$c576) {
                s1 = input.substr(peg$currPos, 3);
                peg$currPos += 3;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c577);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_SELECT() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 6).toLowerCase() === peg$c578) {
                s1 = input.substr(peg$currPos, 6);
                peg$currPos += 6;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c579);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_IF_NOT_EXISTS() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 13).toLowerCase() === peg$c580) {
                s1 = input.substr(peg$currPos, 13);
                peg$currPos += 13;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c581);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_RECURSIVE() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 9) === peg$c582) {
                s1 = peg$c582;
                peg$currPos += 9;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c583);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_IGNORE() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 6).toLowerCase() === peg$c584) {
                s1 = input.substr(peg$currPos, 6);
                peg$currPos += 6;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c585);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_EXPLAIN() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 7).toLowerCase() === peg$c586) {
                s1 = input.substr(peg$currPos, 7);
                peg$currPos += 7;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c587);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_PARTITION() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 9).toLowerCase() === peg$c588) {
                s1 = input.substr(peg$currPos, 9);
                peg$currPos += 9;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c589);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c590();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_INTO() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 4).toLowerCase() === peg$c591) {
                s1 = input.substr(peg$currPos, 4);
                peg$currPos += 4;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c592);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_FROM() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 4).toLowerCase() === peg$c593) {
                s1 = input.substr(peg$currPos, 4);
                peg$currPos += 4;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c594);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_SET() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 3).toLowerCase() === peg$c54) {
                s1 = input.substr(peg$currPos, 3);
                peg$currPos += 3;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c55);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_UNLOCK() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 6).toLowerCase() === peg$c595) {
                s1 = input.substr(peg$currPos, 6);
                peg$currPos += 6;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c596);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_LOCK() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 4).toLowerCase() === peg$c87) {
                s1 = input.substr(peg$currPos, 4);
                peg$currPos += 4;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c88);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_AS() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 2).toLowerCase() === peg$c287) {
                s1 = input.substr(peg$currPos, 2);
                peg$currPos += 2;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c288);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_TABLE() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 5).toLowerCase() === peg$c597) {
                s1 = input.substr(peg$currPos, 5);
                peg$currPos += 5;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c598);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c599();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_TABLES() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 6).toLowerCase() === peg$c600) {
                s1 = input.substr(peg$currPos, 6);
                peg$currPos += 6;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c601);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c602();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_COLLATE() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 7).toLowerCase() === peg$c166) {
                s1 = input.substr(peg$currPos, 7);
                peg$currPos += 7;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c167);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c603();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_ON() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 2).toLowerCase() === peg$c209) {
                s1 = input.substr(peg$currPos, 2);
                peg$currPos += 2;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c210);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_LEFT() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 4).toLowerCase() === peg$c604) {
                s1 = input.substr(peg$currPos, 4);
                peg$currPos += 4;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c605);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_RIGHT() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 5).toLowerCase() === peg$c606) {
                s1 = input.substr(peg$currPos, 5);
                peg$currPos += 5;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c607);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_FULL() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 4).toLowerCase() === peg$c608) {
                s1 = input.substr(peg$currPos, 4);
                peg$currPos += 4;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c609);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_INNER() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 5).toLowerCase() === peg$c610) {
                s1 = input.substr(peg$currPos, 5);
                peg$currPos += 5;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c611);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_CROSS() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 5).toLowerCase() === peg$c612) {
                s1 = input.substr(peg$currPos, 5);
                peg$currPos += 5;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c613);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_JOIN() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 4).toLowerCase() === peg$c614) {
                s1 = input.substr(peg$currPos, 4);
                peg$currPos += 4;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c615);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_OUTER() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 5).toLowerCase() === peg$c616) {
                s1 = input.substr(peg$currPos, 5);
                peg$currPos += 5;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c617);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_OVER() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 4).toLowerCase() === peg$c618) {
                s1 = input.substr(peg$currPos, 4);
                peg$currPos += 4;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c619);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_UNION() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 5).toLowerCase() === peg$c620) {
                s1 = input.substr(peg$currPos, 5);
                peg$currPos += 5;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c621);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_VALUE() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 5).toLowerCase() === peg$c622) {
                s1 = input.substr(peg$currPos, 5);
                peg$currPos += 5;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c623);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c624();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_VALUES() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 6).toLowerCase() === peg$c625) {
                s1 = input.substr(peg$currPos, 6);
                peg$currPos += 6;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c626);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_USING() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 5).toLowerCase() === peg$c627) {
                s1 = input.substr(peg$currPos, 5);
                peg$currPos += 5;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c628);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_WHERE() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 5).toLowerCase() === peg$c629) {
                s1 = input.substr(peg$currPos, 5);
                peg$currPos += 5;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c630);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_WITH() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 4).toLowerCase() === peg$c199) {
                s1 = input.substr(peg$currPos, 4);
                peg$currPos += 4;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c200);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_GROUP() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 5).toLowerCase() === peg$c631) {
                s1 = input.substr(peg$currPos, 5);
                peg$currPos += 5;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c632);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_BY() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 2).toLowerCase() === peg$c633) {
                s1 = input.substr(peg$currPos, 2);
                peg$currPos += 2;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c634);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_ORDER() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 5).toLowerCase() === peg$c635) {
                s1 = input.substr(peg$currPos, 5);
                peg$currPos += 5;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c636);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_HAVING() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 6).toLowerCase() === peg$c637) {
                s1 = input.substr(peg$currPos, 6);
                peg$currPos += 6;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c638);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_WINDOW() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 6).toLowerCase() === peg$c639) {
                s1 = input.substr(peg$currPos, 6);
                peg$currPos += 6;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c640);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_ORDINAL() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 7).toLowerCase() === peg$c641) {
                s1 = input.substr(peg$currPos, 7);
                peg$currPos += 7;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c642);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c643();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_LIMIT() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 5).toLowerCase() === peg$c644) {
                s1 = input.substr(peg$currPos, 5);
                peg$currPos += 5;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c645);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_OFFSET() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 6).toLowerCase() === peg$c646) {
                s1 = input.substr(peg$currPos, 6);
                peg$currPos += 6;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c647);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c648();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_ASC() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 3).toLowerCase() === peg$c649) {
                s1 = input.substr(peg$currPos, 3);
                peg$currPos += 3;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c650);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c651();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_DESC() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 4).toLowerCase() === peg$c652) {
                s1 = input.substr(peg$currPos, 4);
                peg$currPos += 4;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c653);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c654();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_ALL() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 3).toLowerCase() === peg$c655) {
                s1 = input.substr(peg$currPos, 3);
                peg$currPos += 3;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c656);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c657();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_DISTINCT() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 8).toLowerCase() === peg$c658) {
                s1 = input.substr(peg$currPos, 8);
                peg$currPos += 8;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c659);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c660();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_BETWEEN() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 7).toLowerCase() === peg$c661) {
                s1 = input.substr(peg$currPos, 7);
                peg$currPos += 7;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c662);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c663();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_IN() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 2).toLowerCase() === peg$c664) {
                s1 = input.substr(peg$currPos, 2);
                peg$currPos += 2;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c665);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c666();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_IS() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 2).toLowerCase() === peg$c667) {
                s1 = input.substr(peg$currPos, 2);
                peg$currPos += 2;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c668);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c669();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_LIKE() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 4).toLowerCase() === peg$c670) {
                s1 = input.substr(peg$currPos, 4);
                peg$currPos += 4;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c671);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c672();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_EXISTS() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 6).toLowerCase() === peg$c673) {
                s1 = input.substr(peg$currPos, 6);
                peg$currPos += 6;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c674);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c675();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_NOT() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 3).toLowerCase() === peg$c187) {
                s1 = input.substr(peg$currPos, 3);
                peg$currPos += 3;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c188);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c676();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_AND() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 3).toLowerCase() === peg$c677) {
                s1 = input.substr(peg$currPos, 3);
                peg$currPos += 3;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c678);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c679();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_OR() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 2).toLowerCase() === peg$c680) {
                s1 = input.substr(peg$currPos, 2);
                peg$currPos += 2;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c681);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c682();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_COUNT() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 5).toLowerCase() === peg$c683) {
                s1 = input.substr(peg$currPos, 5);
                peg$currPos += 5;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c684);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c685();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_MAX() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 3).toLowerCase() === peg$c686) {
                s1 = input.substr(peg$currPos, 3);
                peg$currPos += 3;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c687);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c688();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_MIN() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 3).toLowerCase() === peg$c689) {
                s1 = input.substr(peg$currPos, 3);
                peg$currPos += 3;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c690);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c691();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_SUM() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 3).toLowerCase() === peg$c692) {
                s1 = input.substr(peg$currPos, 3);
                peg$currPos += 3;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c693);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c694();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_AVG() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 3).toLowerCase() === peg$c695) {
                s1 = input.substr(peg$currPos, 3);
                peg$currPos += 3;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c696);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c697();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_EXTRACT() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 7).toLowerCase() === peg$c698) {
                s1 = input.substr(peg$currPos, 7);
                peg$currPos += 7;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c699);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c700();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_CALL() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 4).toLowerCase() === peg$c701) {
                s1 = input.substr(peg$currPos, 4);
                peg$currPos += 4;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c702);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c703();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_CASE() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 4).toLowerCase() === peg$c704) {
                s1 = input.substr(peg$currPos, 4);
                peg$currPos += 4;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c705);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_WHEN() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 4).toLowerCase() === peg$c706) {
                s1 = input.substr(peg$currPos, 4);
                peg$currPos += 4;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c707);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_THEN() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 4).toLowerCase() === peg$c708) {
                s1 = input.substr(peg$currPos, 4);
                peg$currPos += 4;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c709);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_ELSE() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 4).toLowerCase() === peg$c710) {
                s1 = input.substr(peg$currPos, 4);
                peg$currPos += 4;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c711);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_END() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 3).toLowerCase() === peg$c712) {
                s1 = input.substr(peg$currPos, 3);
                peg$currPos += 3;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c713);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_CAST() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 4).toLowerCase() === peg$c714) {
                s1 = input.substr(peg$currPos, 4);
                peg$currPos += 4;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c715);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_ARRAY() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 5).toLowerCase() === peg$c716) {
                s1 = input.substr(peg$currPos, 5);
                peg$currPos += 5;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c717);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c718();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_BYTES() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 5).toLowerCase() === peg$c719) {
                s1 = input.substr(peg$currPos, 5);
                peg$currPos += 5;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c720);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c721();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_BOOL() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 4).toLowerCase() === peg$c722) {
                s1 = input.substr(peg$currPos, 4);
                peg$currPos += 4;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c723);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c724();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_CHAR() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 4).toLowerCase() === peg$c725) {
                s1 = input.substr(peg$currPos, 4);
                peg$currPos += 4;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c726);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c727();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_GEOGRAPHY() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 9).toLowerCase() === peg$c728) {
                s1 = input.substr(peg$currPos, 9);
                peg$currPos += 9;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c729);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c730();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_VARCHAR() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 7).toLowerCase() === peg$c731) {
                s1 = input.substr(peg$currPos, 7);
                peg$currPos += 7;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c732);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c733();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_NUMERIC() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 7).toLowerCase() === peg$c734) {
                s1 = input.substr(peg$currPos, 7);
                peg$currPos += 7;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c735);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c736();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_DECIMAL() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 7).toLowerCase() === peg$c737) {
                s1 = input.substr(peg$currPos, 7);
                peg$currPos += 7;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c738);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c739();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_SIGNED() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 6).toLowerCase() === peg$c740) {
                s1 = input.substr(peg$currPos, 6);
                peg$currPos += 6;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c741);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c742();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_UNSIGNED() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 8).toLowerCase() === peg$c743) {
                s1 = input.substr(peg$currPos, 8);
                peg$currPos += 8;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c744);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c745();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_INT_64() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 5).toLowerCase() === peg$c746) {
                s1 = input.substr(peg$currPos, 5);
                peg$currPos += 5;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c747);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c748();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_ZEROFILL() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 8).toLowerCase() === peg$c749) {
                s1 = input.substr(peg$currPos, 8);
                peg$currPos += 8;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c750);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c751();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_INTEGER() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 7).toLowerCase() === peg$c752) {
                s1 = input.substr(peg$currPos, 7);
                peg$currPos += 7;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c753);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c754();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_JSON() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 4).toLowerCase() === peg$c755) {
                s1 = input.substr(peg$currPos, 4);
                peg$currPos += 4;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c756);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c757();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_SMALLINT() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 8).toLowerCase() === peg$c758) {
                s1 = input.substr(peg$currPos, 8);
                peg$currPos += 8;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c759);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c760();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_STRING() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 6).toLowerCase() === peg$c761) {
                s1 = input.substr(peg$currPos, 6);
                peg$currPos += 6;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c762);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c763();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_STRUCT() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 6).toLowerCase() === peg$c764) {
                s1 = input.substr(peg$currPos, 6);
                peg$currPos += 6;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c765);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c766();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_TINYINT() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 7).toLowerCase() === peg$c767) {
                s1 = input.substr(peg$currPos, 7);
                peg$currPos += 7;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c768);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c769();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_TINYTEXT() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 8).toLowerCase() === peg$c770) {
                s1 = input.substr(peg$currPos, 8);
                peg$currPos += 8;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c771);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c772();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_TEXT() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 4).toLowerCase() === peg$c773) {
                s1 = input.substr(peg$currPos, 4);
                peg$currPos += 4;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c774);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c775();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_MEDIUMTEXT() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 10).toLowerCase() === peg$c776) {
                s1 = input.substr(peg$currPos, 10);
                peg$currPos += 10;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c777);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c778();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_LONGTEXT() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 8).toLowerCase() === peg$c779) {
                s1 = input.substr(peg$currPos, 8);
                peg$currPos += 8;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c780);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c781();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_BIGINT() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 6).toLowerCase() === peg$c782) {
                s1 = input.substr(peg$currPos, 6);
                peg$currPos += 6;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c783);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c784();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_FLOAT_64() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 7).toLowerCase() === peg$c785) {
                s1 = input.substr(peg$currPos, 7);
                peg$currPos += 7;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c786);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c787();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_DOUBLE() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 6).toLowerCase() === peg$c788) {
                s1 = input.substr(peg$currPos, 6);
                peg$currPos += 6;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c789);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c790();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_DATE() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 4).toLowerCase() === peg$c791) {
                s1 = input.substr(peg$currPos, 4);
                peg$currPos += 4;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c792);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c793();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_DATETIME() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 8).toLowerCase() === peg$c794) {
                s1 = input.substr(peg$currPos, 8);
                peg$currPos += 8;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c795);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c796();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_ROWS() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 4).toLowerCase() === peg$c797) {
                s1 = input.substr(peg$currPos, 4);
                peg$currPos += 4;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c798);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c799();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_TIME() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 4).toLowerCase() === peg$c800) {
                s1 = input.substr(peg$currPos, 4);
                peg$currPos += 4;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c801);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c802();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_TIMESTAMP() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 9).toLowerCase() === peg$c803) {
                s1 = input.substr(peg$currPos, 9);
                peg$currPos += 9;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c804);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c805();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_TRUNCATE() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 8).toLowerCase() === peg$c806) {
                s1 = input.substr(peg$currPos, 8);
                peg$currPos += 8;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c807);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c808();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_USER() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 4).toLowerCase() === peg$c809) {
                s1 = input.substr(peg$currPos, 4);
                peg$currPos += 4;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c810);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c811();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_CURRENT_DATE() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 12).toLowerCase() === peg$c812) {
                s1 = input.substr(peg$currPos, 12);
                peg$currPos += 12;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c813);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c814();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_ADD_DATE() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 7).toLowerCase() === peg$c815) {
                s1 = input.substr(peg$currPos, 7);
                peg$currPos += 7;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c816);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c817();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_INTERVAL() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 8).toLowerCase() === peg$c818) {
                s1 = input.substr(peg$currPos, 8);
                peg$currPos += 8;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c819);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c820();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_UNIT_YEAR() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 4).toLowerCase() === peg$c488) {
                s1 = input.substr(peg$currPos, 4);
                peg$currPos += 4;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c489);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c821();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_UNIT_MONTH() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 5).toLowerCase() === peg$c474) {
                s1 = input.substr(peg$currPos, 5);
                peg$currPos += 5;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c475);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c822();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_UNIT_DAY() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 3).toLowerCase() === peg$c450) {
                s1 = input.substr(peg$currPos, 3);
                peg$currPos += 3;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c451);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c823();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_UNIT_HOUR() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 4).toLowerCase() === peg$c460) {
                s1 = input.substr(peg$currPos, 4);
                peg$currPos += 4;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c461);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c824();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_UNIT_MINUTE() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 6).toLowerCase() === peg$c472) {
                s1 = input.substr(peg$currPos, 6);
                peg$currPos += 6;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c473);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c825();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_UNIT_SECOND() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 6).toLowerCase() === peg$c478) {
                s1 = input.substr(peg$currPos, 6);
                peg$currPos += 6;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c479);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c826();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_CURRENT_TIME() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 12).toLowerCase() === peg$c827) {
                s1 = input.substr(peg$currPos, 12);
                peg$currPos += 12;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c828);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c829();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_CURRENT_TIMESTAMP() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 17).toLowerCase() === peg$c830) {
                s1 = input.substr(peg$currPos, 17);
                peg$currPos += 17;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c831);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c832();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_SESSION_USER() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 12).toLowerCase() === peg$c833) {
                s1 = input.substr(peg$currPos, 12);
                peg$currPos += 12;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c834);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c835();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_GLOBAL() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 6).toLowerCase() === peg$c836) {
                s1 = input.substr(peg$currPos, 6);
                peg$currPos += 6;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c837);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c838();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_SESSION() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 7).toLowerCase() === peg$c839) {
                s1 = input.substr(peg$currPos, 7);
                peg$currPos += 7;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c840);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c841();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_LOCAL() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 5).toLowerCase() === peg$c171) {
                s1 = input.substr(peg$currPos, 5);
                peg$currPos += 5;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c172);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c842();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_PIVOT() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 5).toLowerCase() === peg$c843) {
                s1 = input.substr(peg$currPos, 5);
                peg$currPos += 5;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c844);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c845();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_PERSIST() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 7).toLowerCase() === peg$c846) {
                s1 = input.substr(peg$currPos, 7);
                peg$currPos += 7;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c847);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c848();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_PERSIST_ONLY() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 12).toLowerCase() === peg$c849) {
                s1 = input.substr(peg$currPos, 12);
                peg$currPos += 12;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c850);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c851();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_ADD() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 3).toLowerCase() === peg$c852) {
                s1 = input.substr(peg$currPos, 3);
                peg$currPos += 3;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c853);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c854();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_COLUMN() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 6).toLowerCase() === peg$c855) {
                s1 = input.substr(peg$currPos, 6);
                peg$currPos += 6;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c856);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c857();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_INDEX() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 5).toLowerCase() === peg$c858) {
                s1 = input.substr(peg$currPos, 5);
                peg$currPos += 5;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c859);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c860();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_KEY() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 3).toLowerCase() === peg$c102) {
                s1 = input.substr(peg$currPos, 3);
                peg$currPos += 3;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c103);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c861();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_FULLTEXT() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 8).toLowerCase() === peg$c862) {
                s1 = input.substr(peg$currPos, 8);
                peg$currPos += 8;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c863);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c864();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_UNIQUE() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 6).toLowerCase() === peg$c98) {
                s1 = input.substr(peg$currPos, 6);
                peg$currPos += 6;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c99);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c865();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_COMMENT() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 7).toLowerCase() === peg$c866) {
                s1 = input.substr(peg$currPos, 7);
                peg$currPos += 7;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c867);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c868();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_CONSTRAINT() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 10).toLowerCase() === peg$c869) {
                s1 = input.substr(peg$currPos, 10);
                peg$currPos += 10;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c870);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c871();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseKW_REFERENCES() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 10).toLowerCase() === peg$c872) {
                s1 = input.substr(peg$currPos, 10);
                peg$currPos += 10;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c873);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseident_start();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c874();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseDOT() {
            var s0;
            if (input.charCodeAt(peg$currPos) === 46) {
                s0 = peg$c73;
                peg$currPos++;
            } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c74);
                }
            }
            return s0;
        }
        function peg$parseCOMMA() {
            var s0;
            if (input.charCodeAt(peg$currPos) === 44) {
                s0 = peg$c875;
                peg$currPos++;
            } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c876);
                }
            }
            return s0;
        }
        function peg$parseSTAR() {
            var s0;
            if (input.charCodeAt(peg$currPos) === 42) {
                s0 = peg$c392;
                peg$currPos++;
            } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c393);
                }
            }
            return s0;
        }
        function peg$parseLPAREN() {
            var s0;
            if (input.charCodeAt(peg$currPos) === 40) {
                s0 = peg$c268;
                peg$currPos++;
            } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c269);
                }
            }
            return s0;
        }
        function peg$parseRPAREN() {
            var s0;
            if (input.charCodeAt(peg$currPos) === 41) {
                s0 = peg$c270;
                peg$currPos++;
            } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c271);
                }
            }
            return s0;
        }
        function peg$parseLANGLE() {
            var s0;
            if (input.charCodeAt(peg$currPos) === 60) {
                s0 = peg$c377;
                peg$currPos++;
            } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c378);
                }
            }
            return s0;
        }
        function peg$parseRANGLE() {
            var s0;
            if (input.charCodeAt(peg$currPos) === 62) {
                s0 = peg$c371;
                peg$currPos++;
            } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c372);
                }
            }
            return s0;
        }
        function peg$parseLBRAKE() {
            var s0;
            if (input.charCodeAt(peg$currPos) === 91) {
                s0 = peg$c877;
                peg$currPos++;
            } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c878);
                }
            }
            return s0;
        }
        function peg$parseRBRAKE() {
            var s0;
            if (input.charCodeAt(peg$currPos) === 93) {
                s0 = peg$c879;
                peg$currPos++;
            } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c880);
                }
            }
            return s0;
        }
        function peg$parseSEMICOLON() {
            var s0;
            if (input.charCodeAt(peg$currPos) === 59) {
                s0 = peg$c881;
                peg$currPos++;
            } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c882);
                }
            }
            return s0;
        }
        function peg$parseOPERATOR_CONCATENATION() {
            var s0;
            if (input.substr(peg$currPos, 2) === peg$c883) {
                s0 = peg$c883;
                peg$currPos += 2;
            } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c884);
                }
            }
            return s0;
        }
        function peg$parseOPERATOR_AND() {
            var s0;
            if (input.substr(peg$currPos, 2) === peg$c885) {
                s0 = peg$c885;
                peg$currPos += 2;
            } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c886);
                }
            }
            return s0;
        }
        function peg$parseLOGIC_OPERATOR() {
            var s0;
            s0 = peg$parseOPERATOR_CONCATENATION();
            if (s0 === peg$FAILED) {
                s0 = peg$parseOPERATOR_AND();
            }
            return s0;
        }
        function peg$parse__() {
            var s0, s1;
            s0 = [];
            s1 = peg$parsewhitespace();
            if (s1 === peg$FAILED) {
                s1 = peg$parsecomment();
            }
            while (s1 !== peg$FAILED) {
                s0.push(s1);
                s1 = peg$parsewhitespace();
                if (s1 === peg$FAILED) {
                    s1 = peg$parsecomment();
                }
            }
            return s0;
        }
        function peg$parse___() {
            var s0, s1;
            s0 = [];
            s1 = peg$parsewhitespace();
            if (s1 === peg$FAILED) {
                s1 = peg$parsecomment();
            }
            if (s1 !== peg$FAILED) {
                while (s1 !== peg$FAILED) {
                    s0.push(s1);
                    s1 = peg$parsewhitespace();
                    if (s1 === peg$FAILED) {
                        s1 = peg$parsecomment();
                    }
                }
            } else {
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsecomment() {
            var s0;
            s0 = peg$parseblock_comment();
            if (s0 === peg$FAILED) {
                s0 = peg$parseline_comment();
                if (s0 === peg$FAILED) {
                    s0 = peg$parsepound_sign_comment();
                }
            }
            return s0;
        }
        function peg$parseblock_comment() {
            var s0, s1, s2, s3, s4, s5;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 2) === peg$c887) {
                s1 = peg$c887;
                peg$currPos += 2;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c888);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                s4 = peg$currPos;
                peg$silentFails++;
                if (input.substr(peg$currPos, 2) === peg$c889) {
                    s5 = peg$c889;
                    peg$currPos += 2;
                } else {
                    s5 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c890);
                    }
                }
                peg$silentFails--;
                if (s5 === peg$FAILED) {
                    s4 = void 0;
                } else {
                    peg$currPos = s4;
                    s4 = peg$FAILED;
                }
                if (s4 !== peg$FAILED) {
                    s5 = peg$parsechar();
                    if (s5 !== peg$FAILED) {
                        s4 = [s4, s5];
                        s3 = s4;
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$currPos;
                    s4 = peg$currPos;
                    peg$silentFails++;
                    if (input.substr(peg$currPos, 2) === peg$c889) {
                        s5 = peg$c889;
                        peg$currPos += 2;
                    } else {
                        s5 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c890);
                        }
                    }
                    peg$silentFails--;
                    if (s5 === peg$FAILED) {
                        s4 = void 0;
                    } else {
                        peg$currPos = s4;
                        s4 = peg$FAILED;
                    }
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parsechar();
                        if (s5 !== peg$FAILED) {
                            s4 = [s4, s5];
                            s3 = s4;
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                if (s2 !== peg$FAILED) {
                    if (input.substr(peg$currPos, 2) === peg$c889) {
                        s3 = peg$c889;
                        peg$currPos += 2;
                    } else {
                        s3 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c890);
                        }
                    }
                    if (s3 !== peg$FAILED) {
                        s1 = [s1, s2, s3];
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parseline_comment() {
            var s0, s1, s2, s3, s4, s5;
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 2) === peg$c891) {
                s1 = peg$c891;
                peg$currPos += 2;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c892);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                s4 = peg$currPos;
                peg$silentFails++;
                s5 = peg$parseEOL();
                peg$silentFails--;
                if (s5 === peg$FAILED) {
                    s4 = void 0;
                } else {
                    peg$currPos = s4;
                    s4 = peg$FAILED;
                }
                if (s4 !== peg$FAILED) {
                    s5 = peg$parsechar();
                    if (s5 !== peg$FAILED) {
                        s4 = [s4, s5];
                        s3 = s4;
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$currPos;
                    s4 = peg$currPos;
                    peg$silentFails++;
                    s5 = peg$parseEOL();
                    peg$silentFails--;
                    if (s5 === peg$FAILED) {
                        s4 = void 0;
                    } else {
                        peg$currPos = s4;
                        s4 = peg$FAILED;
                    }
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parsechar();
                        if (s5 !== peg$FAILED) {
                            s4 = [s4, s5];
                            s3 = s4;
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsepound_sign_comment() {
            var s0, s1, s2, s3, s4, s5;
            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 35) {
                s1 = peg$c893;
                peg$currPos++;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c894);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                s4 = peg$currPos;
                peg$silentFails++;
                s5 = peg$parseEOL();
                peg$silentFails--;
                if (s5 === peg$FAILED) {
                    s4 = void 0;
                } else {
                    peg$currPos = s4;
                    s4 = peg$FAILED;
                }
                if (s4 !== peg$FAILED) {
                    s5 = peg$parsechar();
                    if (s5 !== peg$FAILED) {
                        s4 = [s4, s5];
                        s3 = s4;
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$currPos;
                    s4 = peg$currPos;
                    peg$silentFails++;
                    s5 = peg$parseEOL();
                    peg$silentFails--;
                    if (s5 === peg$FAILED) {
                        s4 = void 0;
                    } else {
                        peg$currPos = s4;
                        s4 = peg$FAILED;
                    }
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parsechar();
                        if (s5 !== peg$FAILED) {
                            s4 = [s4, s5];
                            s3 = s4;
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsechar() {
            var s0;
            if (input.length > peg$currPos) {
                s0 = input.charAt(peg$currPos);
                peg$currPos++;
            } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c895);
                }
            }
            return s0;
        }
        function peg$parseinterval_unit() {
            var s0;
            s0 = peg$parseKW_UNIT_YEAR();
            if (s0 === peg$FAILED) {
                s0 = peg$parseKW_UNIT_MONTH();
                if (s0 === peg$FAILED) {
                    s0 = peg$parseKW_UNIT_DAY();
                    if (s0 === peg$FAILED) {
                        s0 = peg$parseKW_UNIT_HOUR();
                        if (s0 === peg$FAILED) {
                            s0 = peg$parseKW_UNIT_MINUTE();
                            if (s0 === peg$FAILED) {
                                s0 = peg$parseKW_UNIT_SECOND();
                            }
                        }
                    }
                }
            }
            return s0;
        }
        function peg$parsewhitespace() {
            var s0;
            if (peg$c896.test(input.charAt(peg$currPos))) {
                s0 = input.charAt(peg$currPos);
                peg$currPos++;
            } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c897);
                }
            }
            return s0;
        }
        function peg$parseEOL() {
            var s0, s1;
            s0 = peg$parseEOF();
            if (s0 === peg$FAILED) {
                s0 = [];
                if (peg$c542.test(input.charAt(peg$currPos))) {
                    s1 = input.charAt(peg$currPos);
                    peg$currPos++;
                } else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c543);
                    }
                }
                if (s1 !== peg$FAILED) {
                    while (s1 !== peg$FAILED) {
                        s0.push(s1);
                        if (peg$c542.test(input.charAt(peg$currPos))) {
                            s1 = input.charAt(peg$currPos);
                            peg$currPos++;
                        } else {
                            s1 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c543);
                            }
                        }
                    }
                } else {
                    s0 = peg$FAILED;
                }
            }
            return s0;
        }
        function peg$parseEOF() {
            var s0, s1;
            s0 = peg$currPos;
            peg$silentFails++;
            if (input.length > peg$currPos) {
                s1 = input.charAt(peg$currPos);
                peg$currPos++;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c895);
                }
            }
            peg$silentFails--;
            if (s1 === peg$FAILED) {
                s0 = void 0;
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsedata_type_list() {
            var s0, s1, s2, s3, s4, s5, s6, s7;
            s0 = peg$currPos;
            s1 = peg$parsedata_type_alias();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                s4 = peg$parse__();
                if (s4 !== peg$FAILED) {
                    s5 = peg$parseCOMMA();
                    if (s5 !== peg$FAILED) {
                        s6 = peg$parse__();
                        if (s6 !== peg$FAILED) {
                            s7 = peg$parsedata_type_alias();
                            if (s7 !== peg$FAILED) {
                                s4 = [s4, s5, s6, s7];
                                s3 = s4;
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$currPos;
                    s4 = peg$parse__();
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parseCOMMA();
                        if (s5 !== peg$FAILED) {
                            s6 = peg$parse__();
                            if (s6 !== peg$FAILED) {
                                s7 = peg$parsedata_type_alias();
                                if (s7 !== peg$FAILED) {
                                    s4 = [s4, s5, s6, s7];
                                    s3 = s4;
                                } else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c16(s1, s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsedata_type_alias() {
            var s0, s1, s2, s3;
            s0 = peg$currPos;
            s1 = peg$currPos;
            s2 = peg$parseident_name();
            if (s2 !== peg$FAILED) {
                peg$savedPos = peg$currPos;
                s3 = peg$c898(s2);
                if (s3) {
                    s3 = peg$FAILED;
                } else {
                    s3 = void 0;
                }
                if (s3 !== peg$FAILED) {
                    peg$savedPos = s1;
                    s2 = peg$c899(s2);
                    s1 = s2;
                } else {
                    peg$currPos = s1;
                    s1 = peg$FAILED;
                }
            } else {
                peg$currPos = s1;
                s1 = peg$FAILED;
            }
            if (s1 === peg$FAILED) {
                s1 = null;
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parsedata_type();
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c900(s1, s3);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsedata_type() {
            var s0;
            s0 = peg$parsestruct_type();
            if (s0 === peg$FAILED) {
                s0 = peg$parsearray_type();
                if (s0 === peg$FAILED) {
                    s0 = peg$parsecharacter_string_type();
                    if (s0 === peg$FAILED) {
                        s0 = peg$parsenumeric_type();
                        if (s0 === peg$FAILED) {
                            s0 = peg$parsedatetime_type();
                            if (s0 === peg$FAILED) {
                                s0 = peg$parsebool_byte_geography_type();
                            }
                        }
                    }
                }
            }
            return s0;
        }
        function peg$parsecharacter_string_type() {
            var s0, s1, s2, s3, s4, s5, s6, s7;
            s0 = peg$currPos;
            s1 = peg$parseKW_STRING();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseLPAREN();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = [];
                            if (peg$c554.test(input.charAt(peg$currPos))) {
                                s6 = input.charAt(peg$currPos);
                                peg$currPos++;
                            } else {
                                s6 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c555);
                                }
                            }
                            if (s6 !== peg$FAILED) {
                                while (s6 !== peg$FAILED) {
                                    s5.push(s6);
                                    if (peg$c554.test(input.charAt(peg$currPos))) {
                                        s6 = input.charAt(peg$currPos);
                                        peg$currPos++;
                                    } else {
                                        s6 = peg$FAILED;
                                        if (peg$silentFails === 0) {
                                            peg$fail(peg$c555);
                                        }
                                    }
                                }
                            } else {
                                s5 = peg$FAILED;
                            }
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parse__();
                                if (s6 !== peg$FAILED) {
                                    s7 = peg$parseRPAREN();
                                    if (s7 !== peg$FAILED) {
                                        peg$savedPos = s0;
                                        s1 = peg$c901(s1, s5);
                                        s0 = s1;
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsenumeric_type() {
            var s0, s1;
            s0 = peg$currPos;
            s1 = peg$parseKW_NUMERIC();
            if (s1 === peg$FAILED) {
                s1 = peg$parseKW_INT_64();
                if (s1 === peg$FAILED) {
                    s1 = peg$parseKW_FLOAT_64();
                }
            }
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c902(s1);
            }
            s0 = s1;
            return s0;
        }
        function peg$parsedatetime_type() {
            var s0, s1, s2, s3, s4, s5, s6, s7;
            s0 = peg$currPos;
            s1 = peg$parseKW_DATE();
            if (s1 === peg$FAILED) {
                s1 = peg$parseKW_DATETIME();
                if (s1 === peg$FAILED) {
                    s1 = peg$parseKW_TIME();
                    if (s1 === peg$FAILED) {
                        s1 = peg$parseKW_TIMESTAMP();
                    }
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseLPAREN();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = [];
                            if (peg$c554.test(input.charAt(peg$currPos))) {
                                s6 = input.charAt(peg$currPos);
                                peg$currPos++;
                            } else {
                                s6 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c555);
                                }
                            }
                            if (s6 !== peg$FAILED) {
                                while (s6 !== peg$FAILED) {
                                    s5.push(s6);
                                    if (peg$c554.test(input.charAt(peg$currPos))) {
                                        s6 = input.charAt(peg$currPos);
                                        peg$currPos++;
                                    } else {
                                        s6 = peg$FAILED;
                                        if (peg$silentFails === 0) {
                                            peg$fail(peg$c555);
                                        }
                                    }
                                }
                            } else {
                                s5 = peg$FAILED;
                            }
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parse__();
                                if (s6 !== peg$FAILED) {
                                    s7 = peg$parseRPAREN();
                                    if (s7 !== peg$FAILED) {
                                        peg$savedPos = s0;
                                        s1 = peg$c903(s1, s5);
                                        s0 = s1;
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parseKW_DATE();
                if (s1 === peg$FAILED) {
                    s1 = peg$parseKW_DATETIME();
                    if (s1 === peg$FAILED) {
                        s1 = peg$parseKW_TIME();
                        if (s1 === peg$FAILED) {
                            s1 = peg$parseKW_TIMESTAMP();
                        }
                    }
                }
                if (s1 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c902(s1);
                }
                s0 = s1;
            }
            return s0;
        }
        function peg$parsebool_byte_geography_type() {
            var s0, s1, s2, s3, s4, s5, s6, s7;
            s0 = peg$currPos;
            s1 = peg$currPos;
            s2 = peg$parseKW_BYTES();
            if (s2 !== peg$FAILED) {
                s3 = peg$parseLPAREN();
                if (s3 !== peg$FAILED) {
                    s4 = peg$parse__();
                    if (s4 !== peg$FAILED) {
                        s5 = [];
                        if (peg$c554.test(input.charAt(peg$currPos))) {
                            s6 = input.charAt(peg$currPos);
                            peg$currPos++;
                        } else {
                            s6 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c555);
                            }
                        }
                        if (s6 !== peg$FAILED) {
                            while (s6 !== peg$FAILED) {
                                s5.push(s6);
                                if (peg$c554.test(input.charAt(peg$currPos))) {
                                    s6 = input.charAt(peg$currPos);
                                    peg$currPos++;
                                } else {
                                    s6 = peg$FAILED;
                                    if (peg$silentFails === 0) {
                                        peg$fail(peg$c555);
                                    }
                                }
                            }
                        } else {
                            s5 = peg$FAILED;
                        }
                        if (s5 === peg$FAILED) {
                            if (input.substr(peg$currPos, 3) === peg$c904) {
                                s5 = peg$c904;
                                peg$currPos += 3;
                            } else {
                                s5 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c905);
                                }
                            }
                            if (s5 === peg$FAILED) {
                                if (input.substr(peg$currPos, 3) === peg$c686) {
                                    s5 = peg$c686;
                                    peg$currPos += 3;
                                } else {
                                    s5 = peg$FAILED;
                                    if (peg$silentFails === 0) {
                                        peg$fail(peg$c906);
                                    }
                                }
                            }
                        }
                        if (s5 !== peg$FAILED) {
                            s6 = peg$parse__();
                            if (s6 !== peg$FAILED) {
                                s7 = peg$parseRPAREN();
                                if (s7 !== peg$FAILED) {
                                    s2 = [s2, s3, s4, s5, s6, s7];
                                    s1 = s2;
                                } else {
                                    peg$currPos = s1;
                                    s1 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s1;
                                s1 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s1;
                            s1 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s1;
                        s1 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s1;
                    s1 = peg$FAILED;
                }
            } else {
                peg$currPos = s1;
                s1 = peg$FAILED;
            }
            if (s1 === peg$FAILED) {
                s1 = peg$parseKW_BOOL();
                if (s1 === peg$FAILED) {
                    s1 = peg$parseKW_GEOGRAPHY();
                }
            }
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c902(s1);
            }
            s0 = s1;
            return s0;
        }
        function peg$parsearray_type() {
            var s0, s1, s2, s3, s4, s5, s6, s7;
            s0 = peg$currPos;
            s1 = peg$parseKW_ARRAY();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseLANGLE();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parsedata_type_list();
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parse__();
                                if (s6 !== peg$FAILED) {
                                    s7 = peg$parseRANGLE();
                                    if (s7 !== peg$FAILED) {
                                        peg$savedPos = s0;
                                        s1 = peg$c907(s1, s5);
                                        s0 = s1;
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        function peg$parsestruct_type() {
            var s0, s1, s2, s3, s4, s5, s6, s7;
            s0 = peg$currPos;
            s1 = peg$parseKW_STRUCT();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse__();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseLANGLE();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse__();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parsedata_type_list();
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parse__();
                                if (s6 !== peg$FAILED) {
                                    s7 = peg$parseRANGLE();
                                    if (s7 !== peg$FAILED) {
                                        peg$savedPos = s0;
                                        s1 = peg$c907(s1, s5);
                                        s0 = s1;
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            return s0;
        }
        var reservedMap = {
            'ARRAY': true,
            'ALTER': true,
            'ALL': true,
            'ADD': true,
            'AND': true,
            'AS': true,
            'ASC': true,
            'BETWEEN': true,
            'BY': true,
            'CALL': true,
            'CASE': true,
            'CREATE': true,
            'CROSS': true,
            'CONTAINS': true,
            'CURRENT_DATE': true,
            'CURRENT_TIME': true,
            'CURRENT_TIMESTAMP': true,
            'CURRENT_USER': true,
            'DELETE': true,
            'DESC': true,
            'DISTINCT': true,
            'DROP': true,
            'ELSE': true,
            'END': true,
            'EXISTS': true,
            'EXPLAIN': true,
            'FALSE': true,
            'FROM': true,
            'FULL': true,
            'FOR': true,
            'GROUP': true,
            'HAVING': true,
            'IN': true,
            'INNER': true,
            'INSERT': true,
            'INTO': true,
            'IS': true,
            'JOIN': true,
            'JSON': true,
            'KEY': true,
            'LEFT': true,
            'LIKE': true,
            'LIMIT': true,
            'LOW_PRIORITY': true,
            'NOT': true,
            'NULL': true,
            'ON': true,
            'OR': true,
            'ORDER': true,
            'OUTER': true,
            'PARTITION': true,
            'PIVOT': true,
            'RECURSIVE': true,
            'RENAME': true,
            'READ': true,
            'RIGHT': true,
            'SELECT': true,
            'SESSION_USER': true,
            'SET': true,
            'SHOW': true,
            'SYSTEM_USER': true,
            'TABLE': true,
            'THEN': true,
            'TRUE': true,
            'TRUNCATE': true,
            'TYPE': true,
            'UNION': true,
            'UPDATE': true,
            'USING': true,
            'VALUES': true,
            'WINDOW': true,
            'WITH': true,
            'WHEN': true,
            'WHERE': true,
            'WRITE': true,
            'GLOBAL': true,
            'SESSION': true,
            'LOCAL': true,
            'PERSIST': true,
            'PERSIST_ONLY': true,
            'UNNEST': true
        };
        var DATA_TYPES = {
            'BOOL': true,
            'BYTE': true,
            'DATE': true,
            'DATETIME': true,
            'FLOAT64': true,
            'INT64': true,
            'NUMERIC': true,
            'STRING': true,
            'TIME': true,
            'TIMESTAMP': true,
            'ARRAY': true,
            'STRUCT': true
        };
        function createUnaryExpr(op, e) {
            return {
                type: 'unary_expr',
                operator: op,
                expr: e
            };
        }
        function createBinaryExpr(op, left, right) {
            return {
                type: 'binary_expr',
                operator: op,
                left: left,
                right: right
            };
        }
        function isBigInt(numberStr) {
            var previousMaxSafe = Number.MAX_SAFE_INTEGER;
            var num = Number(numberStr);
            if (num < previousMaxSafe)
                return false;
            return true;
        }
        function createList(head, tail) {
            var po = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 3;
            var result = [head];
            for (var i = 0; i < tail.length; i++) {
                delete tail[i][po].tableList;
                delete tail[i][po].columnList;
                result.push(tail[i][po]);
            }
            return result;
        }
        function createBinaryExprChain(head, tail) {
            var result = head;
            for (var i = 0; i < tail.length; i++) {
                result = createBinaryExpr(tail[i][1], result, tail[i][3]);
            }
            return result;
        }
        function queryTableAlias(tableName) {
            var alias = tableAlias[tableName];
            if (alias)
                return alias;
            if (tableName)
                return tableName;
            return null;
        }
        function columnListTableAlias(columnList) {
            var newColumnsList = new Set();
            var symbolChar = '::';
            var _iterator = _createForOfIteratorHelper(columnList.keys()), _step;
            try {
                for (_iterator.s(); !(_step = _iterator.n()).done; ) {
                    var column = _step.value;
                    var columnInfo = column.split(symbolChar);
                    if (!columnInfo) {
                        newColumnsList.add(column);
                        break;
                    }
                    if (columnInfo && columnInfo[1])
                        columnInfo[1] = queryTableAlias(columnInfo[1]);
                    newColumnsList.add(columnInfo.join(symbolChar));
                }
            } catch (err) {
                _iterator.e(err);
            } finally {
                _iterator.f();
            }
            return Array.from(newColumnsList);
        }
        function refreshColumnList(columnList) {
            var columns = columnListTableAlias(columnList);
            columnList.clear();
            columns.forEach(function(col) {
                return columnList.add(col);
            });
        }
        var cmpPrefixMap = {
            '+': true,
            '-': true,
            '*': true,
            '/': true,
            '>': true,
            '<': true,
            '!': true,
            '=': true,
            'B': true,
            'b': true,
            'I': true,
            'i': true,
            'L': true,
            'l': true,
            'N': true,
            'n': true
        };
        var varList = [];
        var tableList = new Set();
        var columnList = new Set();
        var tableAlias = {};
        peg$result = peg$startRuleFunction();
        if (peg$result !== peg$FAILED && peg$currPos === input.length) {
            return peg$result;
        } else {
            if (peg$result !== peg$FAILED && peg$currPos < input.length) {
                peg$fail(peg$endExpectation());
            }
            throw peg$buildStructuredError(peg$maxFailExpected, peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null, peg$maxFailPos < input.length ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1) : peg$computeLocation(peg$maxFailPos, peg$maxFailPos));
        }
    }
    return {
        SyntaxError: peg$SyntaxError,
        parse: peg$parse
    };
}();