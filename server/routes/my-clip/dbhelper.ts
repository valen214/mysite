

import { ITEM_TABLE_NAME } from "./constants";
import { getConnection } from "../../dbconfig";

const oracledb = require("oracledb");

async function execute(cmd){
  let conn = await getConnection();
  if(!conn) return;

  return conn.execute(
    cmd,
    {}, {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    }
  );
}

export async function createItemTable(){
  console.log("creating clip item table");
  return await execute(
    `CREATE TABLE ${ITEM_TABLE_NAME} (
        id NUMBER GENERATED ALWAYS as IDENTITY(START with 1 INCREMENT by 1),
        type VARCHAR2(20),
        parent NUMBER,
        data VARCHAR2(20)
    )`
  ).catch((e: any) => {
    if(e.errorNum === 955){
      // table already exists
    } else{
      console.log("item table creation failed:", e);
    }
  });
}

export async function createItem(item: any){
  console.log("creating clip item table");
  let [ columns, values ] = [
    "type", "parent", "data"
  ].reduce(([ columns, values ], r) => {
    if(item.hasOwnProperty(r)){
      columns.push(r);
      values.push(item[r]);
    }
    return [ columns, values ];
  }, [ [], [] ]);

  return await execute(
    `INSERT INTO ${ITEM_TABLE_NAME} (
      ${columns.join(", ")}
    ) VALUES (
      ${values.join(", ")}
    )`
  ).catch((e: any) => {
    console.log("item creation failed:", e);
  })
}

export async function getItem(){
  let conn = await getConnection();
  if(!conn) return;
  
  let result = await conn.execute(
    `SELECT id FROM ${ITEM_TABLE_NAME}`
  ).catch((e: any) => {
    console.log(e);
  });
  console.log("clip item table content:", result);
}

