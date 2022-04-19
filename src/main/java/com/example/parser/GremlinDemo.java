//package com.example.parser;
//
//import java.util.Arrays;
//import java.util.List;
//import java.util.function.Consumer;
//
//import javax.script.ScriptEngine;
//import javax.script.ScriptException;
//
//import org.apache.tinkerpop.gremlin.jsr223.GremlinLangScriptEngine;
//import org.apache.tinkerpop.gremlin.process.traversal.Step;
//import org.apache.tinkerpop.gremlin.process.traversal.Traversal;
//import org.apache.tinkerpop.gremlin.process.traversal.Traversal.Admin;
//import org.apache.tinkerpop.gremlin.process.traversal.dsl.graph.GraphTraversalSource;
//import org.apache.tinkerpop.gremlin.process.traversal.step.TraversalParent;
//import org.apache.tinkerpop.gremlin.process.traversal.step.filter.DropStep;
//import org.apache.tinkerpop.gremlin.process.traversal.step.map.AddEdgeStartStep;
//import org.apache.tinkerpop.gremlin.process.traversal.step.map.GraphStep;
//import org.apache.tinkerpop.gremlin.tinkergraph.structure.TinkerFactory;
//
//public class GremlinDemo {
//
//	public static void main(String[] args) throws Exception {
//		runGremlinEngine();
//	}
//
//	private static void runGremlinEngine() throws Exception {
//
//		ScriptEngine engine = new GremlinLangScriptEngine();
//		System.out.println("engine : " + engine);
//		engine.put("g", new GraphTraversalSource(TinkerFactory.createGratefulDead()));
//
//		testParser(engine);
//	}
//
//	private static void parse(Object engine, String script) throws ScriptException {
//		Traversal.Admin<?,?> stmt = (Traversal.Admin<?, ?>) ((ScriptEngine) engine).eval(script);
//		System.out.println("-----stm-----" + stmt);
//
//		processSteps(stmt);
//
//		System.out.println("--------end--------");
//	}
//
//	@SuppressWarnings({ "unchecked", "rawtypes" })
//	private static void processSteps(Admin trav) {
//		
//		trav.getSteps().forEach(new Consumer<Step>() {
//			public void accept(Step step) {
//				
//				System.out.println("step : " + step);
//				if (step instanceof GraphStep) {
//					Object[] ids = ((GraphStep) step).getIds();
//					System.out.println("\t ids : " + Arrays.toString(ids));
//				}
//
//				if (step instanceof AddEdgeStartStep) {
//					System.out.println("\t params : " +((AddEdgeStartStep) step).getParameters());
//				}
//
//				if (step instanceof DropStep) {
//				}
//
//				if (step instanceof TraversalParent) {
//					List<Admin<Object, Object>> globalStepTravs = ((TraversalParent) step).getGlobalChildren();
//					globalStepTravs.forEach(GremlinDemo::processSteps);
//
//					List<Admin<Object, Object>> localStepTravs = ((TraversalParent) step).getLocalChildren();
//					localStepTravs.forEach(GremlinDemo::processSteps);
//				}
//
//			}
//		});
//	}
//
//	private static void testParser(Object parser) throws Exception {
//
//		// Apache
//
//		parse(parser, "g.V().has(\"name\",\"gremlin\")");
////
////		parse(parser, "g.V(1).has(\"name\",\"gremlin\").\n" + "  out(\"knows\").values(\"name\")");
////
////		parse(parser,
////				"g.V(\"person\").\n" + "  match(as(\"a\").out(\"knows\").as(\"b\"),\n"
////						+ "    as(\"a\").out(\"created\").as(\"c\"),\n" + "    as(\"b\").out(\"created\").as(\"c\"),\n"
////						+ "    as(\"c\").in(\"created\").count().is(2)).\n" + "  select(\"c\").by(\"name\")");
////
////		parse(parser, "g.V().has(\"name\",\"gremlin\").\n"
////				+ "  repeat(in(\"manages\")).until(has(\"title\",\"ceo\")).\n" + "  path().by(\"name\")");
////
////		parse(parser, "g.V().has(\"name\",\"gremlin\").as(\"a\").\n" + "  out(\"created\").in(\"created\").\n"
////				+ "  where(neq(\"a\")).\n" + "  groupCount().by(\"title\")");
////
////		parse(parser,
////				"g.V().has(\"name\",\"gremlin\").out(\"bought\").aggregate(\"stash\").\n"
////						+ "  in(\"bought\").out(\"bought\").\n" + "  where(not(within(\"stash\"))).\n"
////						+ "  groupCount().\n" + "  order(local).by(values,desc)");
////
////		parse(parser, "g.addV(\"team\")");
//
//		// AWS
//
////		parse(parser, "g.addV('person').property('name', 'justin')");
////		parse(parser, "g.addV('person').property(id, '1').property('name', 'martin')");
////		parse(parser, "g.V('1').property(single, 'name', 'marko')");
////		parse(parser, "g.addV('person').property(id, '3').property('name', 'vadas').property('age', 27)");
////		parse(parser, "g.V('1').addE('knows').to(__.V('2')).property('weight', 0.5)");
////
////		parse(parser, "g.addE('knows').from(__.V('1')).to(__.V('4')).property('weight', 1.0).iterate()");
////		parse(parser, "g.V().has('name', 'justin').drop()");
////		parse(parser, "g.V().hasLabel('person')");
////		parse(parser, "g.V().has('name', 'marko').out('knows').valueMap()");
////		parse(parser, "g.addV(\"Label1::Label2::Label3\") ");
////		parse(parser, "g.V().property(single, 'lastUpdate', datetime('2018-01-01T00:00:00'))");
////		parse(parser, "g.V().hasLabel('person').properties('age').drop().iterate()");
//
//	}
//}
