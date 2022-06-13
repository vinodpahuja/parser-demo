package com.example.parser.engine;

import org.parboiled.Parboiled;
import org.parboiled.parserunners.AbstractParseRunner;
import org.parboiled.parserunners.ReportingParseRunner;
import org.parboiled.parserunners.TracingParseRunner;
import org.parboiled.support.ParsingResult;

import com.example.parser.para.AbsBaseParser;

public class ParaParserRunner {

	private AbstractParseRunner<?> runner;

	public ParaParserRunner(Class<? extends AbsBaseParser> parserClass) {
		AbsBaseParser parser = Parboiled.createParser(parserClass);
//		runner = new ReportingParseRunner<>(parser.start());
		runner = new TracingParseRunner<>(parser.start());
	}

	public ParsingResult<?> parse(String string) {
		return runner.run(string);
	}

}
