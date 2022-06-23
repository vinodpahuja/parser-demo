package com.example.parser;

import java.util.Map;

import com.eclipsesource.v8.V8Object;
import com.example.parser.engine.GraalParser;
import com.example.parser.engine.NashornParser;
import com.example.parser.engine.ParserEngine;
import com.example.parser.engine.V8Parser;

public class BigQueryDemo {

	public static void main(String[] args) throws Exception {
		testParser();
	}

	private static ParserEngine graal = null;
	private static ParserEngine v8 = null;
	private static ParserEngine nashorn = null;

	static {
		try {
			graal = new GraalParser("bigquery.peg-es6-v6.js");
			v8 = new V8Parser("bigquery.peg-es5-v6.js");
			nashorn = new NashornParser("bigquery.peg-es5-v6.js");
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	private static void parseSQL(String sql) throws Exception {

		System.out.println("sql : " + sql);

		System.out.println("--------------------------------------------");
		Map<?, ?> stmt = (Map<?, ?>) graal.parse(sql);

		System.out.println("stmt.tableList : " + stmt.get("tableList"));
		System.out.println("stmt.columnList : " + stmt.get("columnList"));
		System.out.println("stmt.ast : " + stmt.get("ast"));

		System.out.println("--------------------------------------------");
		V8Object stmt1 = (V8Object) v8.parse(sql);

		System.out.println("stmt1.tableList : " + stmt1.get("tableList"));
		System.out.println("stmt1.columnList : " + stmt1.get("columnList"));
		System.out.println("stmt1.ast : " + stmt1.get("ast"));

		System.out.println("--------------------------------------------");
		Map<?, ?> stmt2 = (Map<?, ?>) nashorn.parse(sql);

		System.out.println("stmt2.tableList : " + stmt2.get("tableList"));
		System.out.println("stmt2.columnList : " + stmt2.get("columnList"));
		System.out.println("stmt2.ast : " + stmt2.get("ast"));
		System.out.println("--------------------------------------------");
		
	}

	private static void testParser() throws Exception {

//		parseSQL("WITH Roster AS\n" + "(SELECT 'Adams' as LastName, 50 as SchoolID UNION ALL\n"
//				+ "SELECT 'Buchanan', 52 UNION ALL\n" + "SELECT 'Coolidge', 52 UNION ALL\n"
//				+ "SELECT 'Davis', 51 UNION ALL\n" + "SELECT 'Eisenhower', 77)\n" + "SELECT * FROM Roster");
//
//		parseSQL("SELECT * FROM (SELECT \"apple\" AS fruit, \"carrot\" AS vegetable)");
//
//		parseSQL("WITH groceries AS\n" + "(SELECT \"milk\" AS dairy,\n" + "\"eggs\" AS protein,\n"
//				+ "\"bread\" AS grain)\n" + "SELECT g.*\n" + "FROM groceries AS g");
//
//		parseSQL("WITH locations AS\n" + "(SELECT STRUCT(\"Seattle\" AS city, \"Washington\" AS state) AS location\n"
//				+ "UNION ALL\n" + "SELECT STRUCT(\"Phoenix\" AS city, \"Arizona\" AS state) AS location)\n"
//				+ "SELECT l.location.*\n" + "FROM locations l");
//
//		parseSQL(
//				"WITH locations AS\n"
//						+ "(SELECT ARRAY<STRUCT<city STRING, state STRING>>[(\"Seattle\",\"Washington\"),\n"
//						+ "(\"Phoenix\", \"Arizona\")] AS location)\n" + "SELECT l.LOCATION[offset(0)].*\n"
//						+ "FROM locations l");
//
//		parseSQL("WITH orders AS\n" + "(SELECT 5 as order_id,\n" + "\"sprocket\" as item_name,\n" + "200 as quantity)\n"
//				+ "SELECT * EXCEPT (order_id)\n" + "FROM orders");
//
//		parseSQL("WITH orders AS\n" + "(SELECT 5 as order_id,\n" + "\"sprocket\" as item_name,\n" + "200 as quantity)\n"
//				+ "SELECT * REPLACE (\"widget\" AS item_name)\n" + "FROM orders");
//
//		parseSQL("SELECT STRUCT(1, 2) FROM Users");
//
//		parseSQL("SELECT ARRAY(SELECT STRUCT(1 AS A, 2 AS B)) FROM Users");
//
//		parseSQL("SELECT ARRAY(SELECT AS STRUCT 1 AS a, 2 AS b) FROM Users");
//
//		parseSQL("SELECT ARRAY(SELECT IF(STARTS_WITH(Users.username, \"a\")," + "NULL, STRUCT(1, 2))) FROM Users");
//
//		parseSQL("SELECT Roster.LastName, TeamMascot.Mascot\n"
//				+ "FROM Roster JOIN TeamMascot ON Roster.SchoolID = TeamMascot.SchoolID");
//
//		parseSQL("SELECT Roster.LastName, TeamMascot.Mascot\n" + "FROM Roster CROSS JOIN TeamMascot");
//
//		parseSQL("SELECT Roster.LastName, TeamMascot.Mascot\n" + "FROM Roster, TeamMascot");
//
//		parseSQL("SELECT *\n" + "FROM\n" + "Roster\n" + "JOIN\n" + "UNNEST(\n" + "ARRAY(\n" + "SELECT AS STRUCT *\n"
//				+ "FROM PlayerStats\n" + "WHERE PlayerStats.OpponentID = Roster.SchoolID\n" + ")) AS PlayerMatches\n"
//				+ "ON PlayerMatches.LastName = 'Buchanan'");
//
//		parseSQL("INSERT INTO Singers (SingerId, FirstName, LastName) "
//				+ "SELECT SingerId, FirstName, LastName FROM AckworthSingers");
//
//		parseSQL("INSERT INTO Singers (SingerId, FirstName, LastName) "
//				+ "SELECT * FROM UNNEST ([(4, 'Lea', 'Martin'),(6, 'Elena', 'Campbell')])");
//
//		parseSQL("INSERT INTO Singers (SingerId, FirstName)\n"
//				+ " VALUES (4, (SELECT FirstName FROM AckworthSingers WHERE SingerId = 4))");
//
//		parseSQL("INSERT INTO Singers (SingerId, FirstName, LastName) " + "VALUES (4, "
//				+ "(SELECT FirstName FROM AckworthSingers WHERE SingerId = 4), "
//				+ "(SELECT LastName FROM AckworthSingers WHERE SingerId = 4))");
//
//		parseSQL("DELETE FROM target_name WHERE true");
//
//		parseSQL("DELETE FROM Singers WHERE FirstName = 'Alice'");
//
//		parseSQL("DELETE FROM Singers\n" + "WHERE\n FirstName NOT IN (SELECT FirstName from AckworthSingers)");
//
//		parseSQL("UPDATE Singers\n" + "SET BirthDate = '1990-10-10'\n"
//				+ "WHERE FirstName = 'Marc' AND LastName = 'Richards'");
//
//		parseSQL("UPDATE Concerts SET TicketPrices = [25, 50, 100]\n" + " WHERE VenueId = 1");
//
		
//		parseSQL("CREATE DATABASE first-db");
//		
//		parseSQL("create SCHEMA testInfo");
//
//		parseSQL("CREATE TABLE Singers (\n" + "SingerId INT64 NOT NULL,\n" + "FirstName STRING(1024),\n"
//				+ "LastName STRING(1024),\n" + "SingerInfo BYTES(MAX),\n" + "BirthDate DATE\n"
//				+ ") PRIMARY KEY(SingerId)");
//		
//		parseSQL("CREATE TABLE Singers (\n" + "SingerId INT64 NOT NULL,\n" + "FirstName STRING(1024),\n"
//				+ "LastName STRING(1024),\n" + "SingerInfo BYTES(MAX),\n" + "BirthDate DATE\n"
//				+ ")");
		
		
//		parseSQL("SELECT s.SingerId, s.FirstName, s.LastName, s.SingerInfo, c.ConcertDate\n"
//				+ "FROM Singers@{FORCE_INDEX=SingersByFirstLastName} AS s JOIN\n"
//				+ "Concerts@{FORCE_INDEX=ConcertsBySingerId} AS c ON s.SingerId = c.SingerId\n"
//				+ "WHERE s.FirstName = \"Catalina\" AND s.LastName > \"M\"");
//		
//		parseSQL("SELECT MessageId\n"
//				+ "FROM Messages TABLESAMPLE BERNOULLI (0.1 PERCENT)");
//		
//		parseSQL("SELECT Subject FROM\n"
//				+ "(SELECT MessageId, Subject FROM Messages WHERE ServerId=\"test\")\n"
//				+ "TABLESAMPLE BERNOULLI(50 PERCENT)\n"
//				+ "WHERE MessageId > 3");
//		
//		parseSQL("SELECT A.name, item, ARRAY_LENGTH(A.items) item_count_for_name\n"
//				+ "FROM\n"
//				+ "UNNEST(\n"
//				+ "[STRUCT('first' AS name, [1, 2, 3, 4] AS items),\n"
//				+ "STRUCT('second' AS name, [] AS items)]) AS A\n"
//				+ "LEFT JOIN A.items AS item");
//		
//		parseSQL("SELECT FirstName FROM Singers ORDER BY FirstName COLLATE \"en_CA\"");
//		
//		parseSQL("SELECT FirstName, LastName FROM Singers ORDER BY FirstName COLLATE \"en_US\" ASC,LastName COLLATE \"ar_EG\" DESC");
//		
//		parseSQL("SELECT LastName\n"
//				+ "FROM Roster\n"
//				+ "UNION ALL\n"
//				+ "SELECT LastName\n"
//				+ "FROM PlayerStats");
//				
////		parseSQL("SELECT LastName\n"
////				+ "FROM Roster\n"
////				+ "INTERSECT ALL\n"
////				+ "SELECT LastName\n"
////				+ "FROM PlayerStats");
////		
////		parseSQL("SELECT LastName\n"
////				+ "FROM Roster\n"
////				+ "EXCEPT DISTINCT\n"
////				+ "SELECT LastName\n"
////				+ "FROM PlayerStats");
		
		
//		parseSQL("SELECT * from 'BigQuery.order' limit 111");
//		parseSQL("create table `BigQueryE2E.Order`(id int64,name string)");
//		parseSQL("insert into BigQueryE2E.Ordered (id,name) values (101,\"sandeep\")");
		
		parseSQL("INSERT Singers "
		+ "SELECT SingerId, FirstName, LastName FROM AckworthSingers");

		parseSQL("UPDATE Singers\n" + "SET BirthDate = '1990-10-10'\n"
				+ "From Singers "
				+ "WHERE FirstName = 'Marc' AND LastName = 'Richards'");
		
		parseSQL("DELETE target_name WHERE true");


		
//		parseSQL("select * from Employee");

	}

}
