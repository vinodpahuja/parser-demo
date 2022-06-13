//package com.example.parser;
//
//import java.util.HashMap;
//import java.util.Map;
//
//import net.sf.jsqlparser.expression.Expression;
//import net.sf.jsqlparser.parser.CCJSqlParserUtil;
//import net.sf.jsqlparser.statement.select.PlainSelect;
//import net.sf.jsqlparser.statement.select.Select;
//import net.sf.jsqlparser.statement.select.SelectExpressionItem;
//import net.sf.jsqlparser.statement.select.SelectItem;
//import net.sf.jsqlparser.statement.select.SelectItemVisitorAdapter;
//
//public class JSQLParserDemo {
//
//	public static void main(String[] args) throws Exception {
//		testParser();
//	}
//
//	private static void parseSQL(String sql) throws Exception {
//
//		Select stmt = (Select) CCJSqlParserUtil.parse(sql);
//
//		Map<String, Expression> map = new HashMap<>();
//		for (SelectItem selectItem : ((PlainSelect) stmt.getSelectBody()).getSelectItems()) {
//			selectItem.accept(new SelectItemVisitorAdapter() {
//				@Override
//				public void visit(SelectExpressionItem item) {
//					map.put(item.getAlias().getName(), item.getExpression());
//				}
//			});
//		}
//
//		System.out.println("map " + map);
//
//	}
//
//	private static void testParser() throws Exception {
//
//		parseSQL("select * from Employee");
//		parseSQL("SELECT col1 AS a, col2 AS b, col3 AS c FROM table WHERE col1 = 10 AND col2 = 20 AND col3 = 30");
//
//	}
//
//}
