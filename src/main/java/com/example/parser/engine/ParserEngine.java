package com.example.parser.engine;

public interface ParserEngine {

	Object getParser();

	Object parse(String sql) throws Exception;

}
