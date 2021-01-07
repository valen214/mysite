
import type OracleDB from "oracledb";
const oracledb: typeof OracleDB = require("oracledb");

async function getPassword(){
  let password = process.env.OCI_DB_PASSPHRASE;
  if(password) return password;

  return "";
}


export async function getConnection(retries?: number): Promise<OracleDB.Connection>{

  try{
    const dir = 'D:\\software\\instantclient_19_8';
    oracledb.initOracleClient({
      libDir: dir,
      configDir: dir + "\\network\\admin",
    });
    console.log("oracle database client initialized");
  } catch(e){
    let msg: string;

    switch(typeof e){
    case "string": msg = e; break;
    case "object": msg = e.toString(); break;
    }
    if(msg?.startsWith("Error: NJS-077")){
      /*
        Error: NJS-077: Oracle Client library
        has already been initialized
      */
    } else{
      console.log("failed to init oracle client:", e);
    }
  }

  let password = await getPassword();
  if(!password){
    console.log("empty database password,",
        "won't connect to database");
    return null;
  }

  return await oracledb.getConnection({
    user: "ADMIN",
    password,
    connectString: "db202010040550_low"
  });
}


export async function execute(cmd: string){
  let conn = await getConnection();
  if(!conn) return;

  return conn.execute(
    cmd,
    {}, {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    }
  );
}


/*

https://VKV6W6LT0VNDN79-DB202010040550.adb.us-ashburn-1.oraclecloudapps.com/ords/
*/


async function test(){
  let conn;
  try{
    conn = await getConnection();
  } catch(e){
    console.log(e);
    return;
  }


  console.log("executing dbconfig.ts tests");
  let result = await conn.execute(
    "CREATE TABLE test_table_2 ( id NUMBER, data VARCHAR2(20))",
    {}, {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    }
  ).catch((e: any) => {
    if(e.errorNum === 955){

    }
  });
  console.assert(result === undefined,
      "dbconfig.ts test result:", result);

  result = await conn.execute(
    "SELECT id FROM test_table_2"
  ).catch((e: any) => {
    console.log(e);
  });
  console.log("dbconfig.ts test reuslt2:", result);
}
test();


`
SELECT owner, table_name FROM all_tables WHERE owner='ADMIN';



`;