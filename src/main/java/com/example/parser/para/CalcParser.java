package com.example.parser.para;

import org.parboiled.Rule;
import org.parboiled.annotations.BuildParseTree;

@BuildParseTree
public class CalcParser extends AbsBaseParser {

	@Override
	public Rule start() {
		return expr();
	}

	public Rule expr() {
		return seq(__, term(), __, _0n(seq(AnyOf("+-"), __, term(), __)));
	};

	Rule term() {
		return seq(factor(), __, _0n(seq(AnyOf("*/"), __, factor())));
	}

	Rule factor() {
		return _1of(_d, seq('(', expr(), ')'));
	}

}