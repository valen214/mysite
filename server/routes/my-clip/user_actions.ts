
import { ITEM_TABLE_NAME } from "./constants";
import { execute } from "../../dbconfig";

export async function newUser(){

}


export async function visitItem(){
  
}


export async function getItemList(){
  let user_id = 1;
  return await execute(`
    SELECT * FROM ${ITEM_TABLE_NAME}
    WHERE owner=${user_id}
  `);
}