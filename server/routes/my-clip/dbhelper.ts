

import { ITEM_TABLE_NAME } from "./constants";
import { ITEM_TABLE_DEFINITIONS } from "./table_definitions";
import { execute } from "../../dbconfig";
import { filterObjectByKeys } from "../../util/obj_util";

import type OracleDB from "oracledb";
const oracledb: typeof OracleDB = require("oracledb");

export async function createItem(item: any){
  console.log("creating clip item table");

  let obj = filterObjectByKeys(item, [
    "type", "parent", "data", "owner",
  ]);

  // need escape
  let columns = Object.keys(obj);
  let values = Object.values(obj).map(s => `'${s}'`);

  let command = `INSERT INTO ${ITEM_TABLE_NAME} (
    ${columns.join(", ")}
  ) VALUES (
    ${values.join(", ")}
  )`;

  console.log("createItem command:", command);

  return await execute(
    command
  ).catch((e: any) => {
    console.log("item creation failed:", e);
  });
}

export async function getItem(id: number){
  let result = await execute(
    `SELECT * FROM ${ITEM_TABLE_NAME} WHERE id=${id}`
  ).catch((e: any) => {
    console.log(e);
  });
  console.log("clip item table content:", result);
  return result;
}

/**
 * 
 * this function directly modifies database
 * please check for input authority
 */
export async function saveItem(item: any){
  let userModifyableKeys = Object.keys(ITEM_TABLE_DEFINITIONS).filter(c => c !== "id");

  let values = Object.entries(filterObjectByKeys(
    item,
    userModifyableKeys
  )).map(([ key, value ]) => `${key}='${value}'`
  ).join(",");

  let command = `UPDATE ${ITEM_TABLE_NAME}
  SET
    ${values}
  WHERE id=${item.id}`;
  console.log(command);
  
  let result = await execute(
    command
  ).catch((e: any) => {
    console.log(e);
  });
  console.log("clip item table content:", result);
  return result;
}