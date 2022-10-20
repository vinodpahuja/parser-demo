package com.example.parser.parboiled;

import org.parboiled.Action;
import org.parboiled.Rule;
import org.parboiled.annotations.BuildParseTree;
import org.parboiled.annotations.DontLabel;
import org.parboiled.annotations.SkipNode;

@BuildParseTree
public class SQLParser extends AbsBaseParser {

	Rule tableName = _w;

	Rule columnName = _w;
	Rule columnNames = seq(columnName, __, _0n(seq(__, sep(','), __, columnName, __))).suppressNode();

	Rule expr = _1of(columnName, _l).suppressNode();

	Action<String> nowhere = (Action<String>) context -> !context.getMatch().equalsIgnoreCase("where");

	@Override
	public Rule start() {
		return sql_stmt();
	}

	public Rule sql_stmt() {
		return seq(__, _1of(select_stmt(), insert_stmt(), create_stmt()), __);
	};

	// Skip Mains

	@SkipNode
	Rule select_stmt() {
		return seq(__, v(i("select")), __, _1of(sc("*"), columnNames), __ //
				, kw(i("from")), __, select_expr(), __ //
				, _01(seq(_01(kw(i("as"))), __//
						, o(tableName), nowhere, __).skipNode()),
				__ //
				, _01(seq(kw(i("where")), __, expr, __, op(), __, expr, __).skipNode()), __//
		);
	}

	@SkipNode
	Rule select_expr() {
		return _1of(o(tableName), seq(sep('('), select_stmt(), sep(')')).skipNode());
	}

	@SkipNode
	Rule insert_stmt() {
		return seq(__, v(i("insert")), __, kw(i("into")), __, o(tableName), __//
				, _01(seq(sep('('), __, columnNames, __, sep(')')).skipNode()), __ //
				, _01(select_stmt()), __ //
		);
	}

	@SkipNode
	Rule create_stmt() {
		return seq(__, v(seq(kw(i("create")), __, kw(i("table")))), __ //
				, _01(kw(seq(i("if"), __, i("not"), __, i("exists")))).suppressNode(), __ //
				, o(tableName), __ //
				, _01(seq(kw(i("as")), __, select_stmt()).skipNode()), __//
		);
	}

	// Skips

	@SkipNode
	Rule op() {
		return AnyOf("<>=").label("spec_chars:op");
	}

	@SkipNode
	Rule sep(Object obj) {
		return toRule(obj).label("spec_chars:sep");
	}

	@SkipNode
	Rule sc(Object obj) {
		return toRule(obj).label("spec_chars");
	}

	@SkipNode
	Rule kw(Object obj) {
		return toRule(obj).label("keyword");
	}

	// Labels

	@DontLabel
	Rule v(Object obj) {
		return toRule(obj).label("verb");
	}

	@DontLabel
	Rule o(Object obj) {
		return toRule(obj).label("object");
	}

}