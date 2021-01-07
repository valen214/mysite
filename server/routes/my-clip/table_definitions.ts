

import { ITEM_TABLE_NAME } from "./constants";
import { execute } from "../../dbconfig";

export const ITEM_TABLE_DEFINITIONS = {
  "id":     "NUMBER GENERATED ALWAYS as IDENTITY(START with 1 INCREMENT by 1)",
  "owner":  "NUMBER",
  "type":   "VARCHAR2(20)",
  "parent": "NUMBER",
  "data":   "VARCHAR2(20)",
}
export async function createItemTable(){
  console.log("creating clip item table");
  let definitions = Object.entries(
    ITEM_TABLE_DEFINITIONS
  ).map(entry => entry.join(" ")
  ).join(",");

  try{
    return await execute(
      `CREATE TABLE ${ITEM_TABLE_NAME} ( ${definitions} )`
    );
  } catch(e){
    if(e.errorNum === 955){
      // table already exists
    } else{
      console.log("item table creation failed:", e);
    }
  }
}




export const USER_TABLE_DEFINITIONS = {
  "id": "NUMBER GENERATED ALWAYS as IDENTITY(START with 1 INCREMENT by 1)",
  "name": "VARCHAR2(20)",
  "root_item": "NUMBER",
};
export async function createUserTable(){

}