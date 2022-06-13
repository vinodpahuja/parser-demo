//package com.example.parser;
//
//import javax.management.ValueExp;
//
//import org.eclipse.rdf4j.model.Value;
//import org.eclipse.rdf4j.query.algebra.ArbitraryLengthPath;
//import org.eclipse.rdf4j.query.algebra.BNodeGenerator;
//import org.eclipse.rdf4j.query.algebra.BindingSetAssignment;
//import org.eclipse.rdf4j.query.algebra.Bound;
//import org.eclipse.rdf4j.query.algebra.DeleteData;
//import org.eclipse.rdf4j.query.algebra.ExtensionElem;
//import org.eclipse.rdf4j.query.algebra.FunctionCall;
//import org.eclipse.rdf4j.query.algebra.GroupElem;
//import org.eclipse.rdf4j.query.algebra.If;
//import org.eclipse.rdf4j.query.algebra.InsertData;
//import org.eclipse.rdf4j.query.algebra.Label;
//import org.eclipse.rdf4j.query.algebra.Load;
//import org.eclipse.rdf4j.query.algebra.Projection;
//import org.eclipse.rdf4j.query.algebra.ProjectionElem;
//import org.eclipse.rdf4j.query.algebra.ProjectionElemList;
//import org.eclipse.rdf4j.query.algebra.QueryModelNode;
//import org.eclipse.rdf4j.query.algebra.SingletonSet;
//import org.eclipse.rdf4j.query.algebra.StatementPattern;
//import org.eclipse.rdf4j.query.algebra.TupleExpr;
//import org.eclipse.rdf4j.query.algebra.UpdateExpr;
//import org.eclipse.rdf4j.query.algebra.ValueConstant;
//import org.eclipse.rdf4j.query.algebra.ValueExprTripleRef;
//import org.eclipse.rdf4j.query.algebra.Var;
//import org.eclipse.rdf4j.query.algebra.ZeroLengthPath;
//import org.eclipse.rdf4j.query.algebra.helpers.AbstractQueryModelVisitor;
//import org.eclipse.rdf4j.query.parser.ParsedQuery;
//import org.eclipse.rdf4j.query.parser.ParsedUpdate;
//import org.eclipse.rdf4j.query.parser.sparql.SPARQLParser;
//
//public class SparQLDemo {
//
//	private static SPARQLParser sparqlParser = new SPARQLParser();
//
//	public static void main(String[] args) throws Exception {
//
//		testParser();
//	}
//
//	private static void testParser() throws Exception {
//
////		parseUpdate("INSERT DATA { <https://test.com/s> <https://test.com/p> <https://test.com/o> . }");
//
////		parseQuery("SELECT ?s ?p ?o WHERE { ?s ?p ?o } limit 10");
//
////		parseQuery("PREFIX soco: <http://example.org/> \n"
////				+ "SELECT ?team ?nickname ?stadium ?city ?founded\r\n"
////				+ "WHERE {\r\n"
////				+ "    ?s a soco:Team .\r\n"
////				+ "    ?s rdfs:label ?team .\r\n"
////				+ "    ?s soco:founded ?founded .\r\n"
////				+ "    ?s soco:nickname ?nickname .\r\n"
////				+ "    ?s soco:homeStadium ?hs .\r\n"
////				+ "    ?hs rdfs:label ?stadium .\r\n"
////				+ "    ?hs soco:location ?hcity .\r\n"
////				+ "    ?hcity rdfs:label ?city}\r\n"
////				+ "order by ?team");
//
////		parseQuery("PREFIX soco: <http://example.org/> \n"
////				+ "CONSTRUCT {?s ?p ?o}\r\n" 
////				+ "WHERE {\r\n" 
////				+ "  ?s ?p ?o .\r\n" 
////				+ "  ?s a soco:Team } ");
//
////		parseQuery("PREFIX soco: <http://example.org/> \n"
////				+ "SELECT ( COALESCE(?name,\"Not found\") as ?nickname)\r\n"
////				+ "WHERE {\r\n"
////				+ "    OPTIONAL {soco:Coventry soco:nickname ?name } \r\n"
////				+ "}");
//
////		parseQuery("PREFIX soco: <http://example.org/> \n" + "SELECT ?city\r\n" + "WHERE {\r\n"
////				+ "    ?s a soco:City .\r\n" + "    ?s rdfs:label ?city\r\n" + "    FILTER contains(?city,\"ou\")\r\n"
////				+ "}");
//
////		parseQuery("PREFIX soco: <http://example.org/> \n"
////				+ "SELECT ?stadium ?opened ?city\r\n"
////				+ "WHERE \r\n"
////				+ "{\r\n"
////				+ "    ?s a soco:Stadium .\r\n"
////				+ "    ?s rdfs:label ?stadium .\r\n"
////				+ "    ?s soco:opened ?opened .\r\n"
////				+ "    ?s soco:location ?loc .\r\n"
////				+ "    ?loc rdfs:label ?city\r\n"
////				+ "\r\n"
////				+ "}\r\n"
////				+ "ORDER BY ?opened");
//
////		parseQuery("PREFIX soco: <http://example.org/> \n"
////				+ "SELECT  ?year (count(?year) as ?count)\r\n"
////				+ "WHERE {\r\n"
////				+ "    ?s a soco:Team .\r\n"
////				+ "    ?s rdfs:label ?name .\r\n"
////				+ "    ?s soco:founded ?year\r\n"
////				+ "}\r\n"
////				+ "group by ?year\r\n"
////				+ "order by desc(?count)");
//
////		parseQuery("PREFIX soco: <http://example.org/> \n"
////				+ "SELECT DISTINCT ?city\r\n"
////				+ "WHERE {\r\n"
////				+ "    ?s a soco:Stadium .\r\n"
////				+ "    ?s soco:location ?c .\r\n"
////				+ "    ?c rdfs:label ?city\r\n"
////				+ "\r\n"
////				+ "}");
//
//		parseQuery("PREFIX soco: <http://example.org/> \n"
//				+ "SELECT ?s ?p ?o\r\n"
//				+ "WHERE {\r\n"
//				+ "  VALUES ?team {\"Arsenal\" \"Bournemouth\" \"Norwich City\" \"Chelsea\" \"West Ham United\"}\r\n"
//				+ "  ?s ?p ?o .\r\n"
//				+ "  ?s rdfs:label ?team .\r\n"
//				+ "  ?s a soco:Team\r\n"
//				+ "} ");
//
//	}
//
//	@SuppressWarnings({ "unchecked", "rawtypes" })
//	private static void parseUpdate(String sql) throws Exception {
//
//		ParsedUpdate u = sparqlParser.parseUpdate(sql, "http://example.org/");
//
//		System.out.println("expr: " + u.getUpdateExprs());
//	}
//
//	@SuppressWarnings({ "unchecked", "rawtypes" })
//	private static void parseQuery(String sql) throws Exception {
//
//		ParsedQuery q = sparqlParser.parseQuery(sql, "http://example.org/");
//
//		System.out.println("query.class : " + q.getClass());
//		System.out.println("query : " + q);
//		System.out.println("--------------------------");
//
////		if (q instanceof ParsedTupleQuery) {
////			ParsedTupleQuery tq = (ParsedTupleQuery) q;
//		TupleExpr te = q.getTupleExpr();
//
//		te.visit(new AbstractQueryModelVisitor() {
//
//			@Override
//			protected void meetUpdateExpr(UpdateExpr node) throws Exception {
//				System.out.println("Update : " + node.getClass());
//				super.meetUpdateExpr(node);
//			}
//
//			@Override
//			public void meet(InsertData node) throws Exception {
//				System.out.println("Insert : " + node.getClass());
//				super.meet(node);
//			}
//
//			@Override
//			public void meet(DeleteData node) throws Exception {
//				System.out.println("Delete : " + node.getClass());
//				super.meet(node);
//			}
//
//			@Override
//			public void meet(Load node) throws Exception {
//				System.out.println("Load : " + node.getClass());
//				super.meet(node);
//			}
//
//			@Override
//			public void meet(Projection node) throws Exception {
//				System.out.println("Select : " + node.getClass());
//				super.meet(node);
//			}
//
//			@Override
//			public void meet(Label node) throws Exception {
//				System.out.println("Object : " + node);
//				super.meet(node);
//			}
//
//			@Override
//			public void meet(ProjectionElem node) throws Exception {
////					System.out.println("elem : " + node);
//				super.meet(node);
//			}
//
//			@Override
//			public void meet(ProjectionElemList node) throws Exception {
////					System.out.println("elemList : " + node);
//				super.meet(node);
//			}
//
////				@Override
////				protected void meetUnaryValueOperator(UnaryValueOperator node) throws Exception {
////					super.meetUnaryValueOperator(node);
////				}
////				
////				@Override
////				protected void meetBinaryValueOperator(BinaryValueOperator node) throws Exception {
////					super.meetBinaryValueOperator(node);
////				}
////				
////				@Override
////				protected void meetUnaryTupleOperator(UnaryTupleOperator node) throws Exception {
////					super.meetUnaryTupleOperator(node);
////				}
////				
////				@Override
////				protected void meetBinaryTupleOperator(BinaryTupleOperator node) throws Exception {
////					super.meetBinaryTupleOperator(node);
////				}
////				
////				@Override
////				protected void meetNAryValueOperator(NAryValueOperator node) throws Exception {
////					super.meetNAryValueOperator(node);
////				}
////
////				@Override
////				protected void meetSubQueryValueOperator(SubQueryValueOperator node) throws Exception {
////					super.meetSubQueryValueOperator(node);
////				}
//
//			@Override
//			public void meetOther(QueryModelNode node) throws Exception {
//				if (node instanceof ValueExp) {
//
//				}
//
//				System.out.println("Other Select : " + node.getClass());
//
//				super.meetOther(node);
//			}
//
//			// value
//
//			@Override
//			public void meet(BNodeGenerator node) throws Exception {
//				super.meet(node);
//			}
//
//			@Override
//			public void meet(Bound node) throws Exception {
//				super.meet(node);
//			}
//
//			@Override
//			public void meet(FunctionCall node) throws Exception {
//				super.meet(node);
//			}
//
//			@Override
//			public void meet(If node) throws Exception {
//				super.meet(node);
//			}
//
//			@Override
//			public void meet(ValueConstant node) throws Exception {
//				super.meet(node);
//			}
//
//			@Override
//			public void meet(ValueExprTripleRef node) throws Exception {
//				super.meet(node);
//			}
//
//			@Override
//			public void meet(Var node) throws Exception {
//				Value value = node.getValue();
//				if (value != null && !value.stringValue().startsWith("http://www.w3.org/")) {
//					System.out.println("Object :  " + value);
//				}
//				super.meet(node);
//			}
//
//			//
//
//			@Override
//			public void meet(ArbitraryLengthPath node) throws Exception {
//				super.meet(node);
//			}
//
//			@Override
//			public void meet(BindingSetAssignment node) throws Exception {
//				super.meet(node);
//			}
//
//			@Override
//			public void meet(ExtensionElem node) throws Exception {
//				super.meet(node);
//			}
//
//			@Override
//			public void meet(GroupElem node) throws Exception {
//				super.meet(node);
//			}
//
//			@Override
//			public void meet(SingletonSet node) throws Exception {
//				super.meet(node);
//			}
//
//			@Override
//			public void meet(StatementPattern node) throws Exception {
//				super.meet(node);
//			}
//
//			@Override
//			public void meet(ZeroLengthPath node) throws Exception {
//				super.meet(node);
//			}
//
//		});
//
////		}
//
//	}
//
//}