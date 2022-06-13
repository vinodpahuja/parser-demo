package com.example.parser.para;

import org.parboiled.BaseParser;
import org.parboiled.Rule;
import org.parboiled.annotations.DontLabel;
import org.parboiled.annotations.SkipNode;
import org.parboiled.matchers.Matcher;

public abstract class AbsBaseParser extends BaseParser<Object> {

	Matcher __ = (Matcher) _0n(AnyOf(" \t\r\n")).suppressNode();

	Matcher _d = (Matcher) _1n(CharRange('0', '9')).suppressSubnodes();

	Matcher _w = (Matcher) _1n(_1of(//
			CharRange('a', 'z'), //
			CharRange('A', 'Z'), //
			CharRange('0', '9') //
	)).suppressSubnodes();

	Matcher _l = (Matcher) _1of(//
			seq("'", _0n(CharRange('a', 'z')), "'"), //
			seq("\"", _0n(CharRange('a', 'z')), "\""), //
			_d //
	).suppressSubnodes();

	@DontLabel
	Matcher i(String string) {
		return (Matcher) IgnoreCase(string);
	}

	@SkipNode
	Matcher _01(Object obj) {
		return (Matcher) Optional(obj);
	}

	@SkipNode
	Matcher _0n(Object obj) {
		return (Matcher) ZeroOrMore(obj);
	}

	Matcher _1n(Object rule) {
		return (Matcher) OneOrMore(rule);
	}

	Matcher seq(Object rule1, Object rule2, Object... rules) {
		return (Matcher) Sequence(rule1, rule2, rules);
	}

	@SkipNode
	Matcher _1of(Object rule1, Object rule2, Object... rules) {
		return (Matcher) FirstOf(rule1, rule2, rules);
	}

	public abstract Rule start();

}