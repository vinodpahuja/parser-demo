package com.example.parser.engine;

public interface ParserEngine {

	Object getParser() throws Exception;

	Object parse(String input) throws Exception;

}
