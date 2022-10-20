package com.example.parser.engine;

import java.io.InputStreamReader;
import java.util.Map;

import javax.script.Invocable;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;

public class GraalParser implements ParserEngine {

	private static ScriptEngineManager manager = new ScriptEngineManager();
	private ScriptEngine engine;

	static {
		System.setProperty("polyglot.engine.WarnInterpreterOnly", "false");
	}

	public GraalParser(String parserscript) throws Exception {
		runEngine(parserscript);
	}

	private void runEngine(String parserscript) throws Exception {
		engine = manager.getEngineByName("graal.js");
		engine.eval(new InputStreamReader(GraalParser.class.getClassLoader().getResourceAsStream(parserscript)));
	}

	public Object parse(String input) throws Exception {
		Map<?, ?> stmt = (Map<?, ?>) ((Invocable) engine).invokeMethod(getParser(), "parse", input);
		return stmt;
	}

	public Object getParser() throws Exception {
		return engine.eval("PegParser");
	}

}
