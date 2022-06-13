package com.example.parser.engine;

import java.io.BufferedReader;
import java.io.InputStreamReader;

import com.eclipsesource.v8.V8;
import com.eclipsesource.v8.V8Object;

public class V8Parser implements ParserEngine {

	private V8 runtime;
	
	public V8Parser(String parserScript) throws Exception {
		runEngine(parserScript);
	}

	private void runEngine(String parserScript) throws Exception {
		runtime = V8.createV8Runtime();
		BufferedReader parserReader = new BufferedReader(new InputStreamReader(
				V8Parser.class.getClassLoader().getResourceAsStream(parserScript)));
		StringBuilder parserjs = new StringBuilder();
		parserReader.lines().forEach(line -> parserjs.append(line).append("\n"));
		runtime.executeScript(parserjs.toString());
	}

	public V8Object parse(String sql) {

		V8Object parser = ((V8Object) getParser());
		V8Object stmt = (V8Object) parser.executeJSFunction("parse", sql);

//		tableList.release();
//		columnList.release();
//		stmt.release();
		parser.release();

		return stmt;

	}

	public Object getParser() {
		return runtime.get("PegParser");
	}

}
