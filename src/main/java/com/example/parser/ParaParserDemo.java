package com.example.parser;

import org.parboiled.support.ParseTreeUtils;
import org.parboiled.support.ParsingResult;

import com.example.parser.engine.ParaParserRunner;
import com.example.parser.para.SQLParser;

public class ParaParserDemo {

//	private static ParaParserRunner parser = new ParaParserRunner(SparqlParser.class);

//	private static ParaParserRunner parser = new ParaParserRunner(CalcParser.class);

	private static ParaParserRunner parser = new ParaParserRunner(SQLParser.class);

	public static void main(String[] args) throws Exception {
		testParser();
	}

	private static void parse(String string) throws Exception {

		ParsingResult<?> result = parser.parse(string);

		System.out.println("--------------------------------------------");
		System.out.println("sql : " + string);
		System.out.println("--------------------------------------------");

//		System.out.println("result : " + result);
//		if (!result.parseErrors.isEmpty()) {
//			System.out.println("stmt.parseErrors : " + result.parseErrors.get(0).getErrorMessage());
//		}

		String parseTreePrintOut = ParseTreeUtils.printNodeTree(result);
		System.out.println("tree : " + parseTreePrintOut);

	}

	private static void testParser() throws Exception {

//		parse(" 22 + 33 ");
//		parse(" 22 + 33 * 44  ");
//		parse(" 22 + ( 33 * 44 ) ");

		parse(" select * from employee ");
//		parse(" select * from Employee1 ");		
//		parse(" Select * From Employee1 ");
//
//		parse(" Select a From employee ");
//		parse(" Select a , b From employee ");
//		parse(" Select a , b From employee worker ");
//		parse(" Select a , b , c  From employee as worker ");
//		
//		parse(" Select * from employee as toppers where rank > 4");
//		parse(" Select * from employee where rank > 4");
//		
//		parse(" select * from ( select * from employee ) ");
//		parse(" select * from ( select * from employee ) where rank > 4 ");
//		parse(" select * from ( select * from employee ) worker where rank > 4 ");
//		parse(" select * from ( select * from employee where rank < 4 )");
//		parse(" select * from ( select * from employee where rank < 4 ) toppers");
//		parse(" select * from ( select * from employee where rank < 4 ) as toppers");

//		parse(" Insert Into employee1 values ( 1 , \"ab\" ) ");
//
//		parse(" Insert Into employee2 ( a , b ) values ( 1 , \"ab\" )");
//		parse(" Insert Into toppers select * from employee where a > 3 ");
//		parse(" Insert Into toppers select * from employee where a < 3 ");
//		parse(" Insert Into toppers ( a ) select a  from employee where a > 3 ");
//		parse(" Insert Into toppers ( a , b ) select a , b from employee where a > 3 ");	

//		parse("create table test ( a int )");
//
//		parse("create table if not exists test ( a int )");
//		parse("create table test as select * from pass");

	}

}
