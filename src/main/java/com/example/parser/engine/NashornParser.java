package com.example.parser.engine;

import java.io.InputStreamReader;
import java.util.Map;

import javax.script.Invocable;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;

public class NashornParser implements ParserEngine {

	private static ScriptEngineManager manager = new ScriptEngineManager();
	private ScriptEngine engine;

	public NashornParser(String parserScript) throws Exception {
		runEngine(parserScript);
	}

	private void runEngine(String parserScript) throws Exception {
		engine = manager.getEngineByName("nashorn");
		engine.eval(new InputStreamReader(NashornParser.class.getClassLoader().getResourceAsStream("core.min.js")));
		engine.eval(new InputStreamReader(NashornParser.class.getClassLoader().getResourceAsStream(parserScript)));
	}

	public Map<?, ?> parse(String sql) throws Exception {
		Map<?, ?> stmt = (Map<?, ?>) ((Invocable) engine).invokeMethod(getParser(), "parse", sql);
		return stmt;
	}

	public Object getParser() {
		return engine.get("PegParser");
	}

}
