


const oracledb = require("oracledb");
import readline from 'readline';
const yargs = require('yargs');

async function getPassword(){
  let password = yargs.argv?.password;
  if(password) return password;

  password = process.env.OCI_DB_PASSPHRASE;
  if(password) return password;


  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise(res => {
    rl.question(
      'Enter database passphrase: ',
      (password: string) => {
        rl.close();
        res(password);
      }
    );
  });
}


try{
  oracledb.initOracleClient({
    libDir: 'D:\\software\\instantclient_19_8',
    configDir: "D:\\software\\instantclient_19_8\\network\\admin",
  });
} catch(e){
  console.log("failed to init oracle client:", e);
}

export const conn = (async() => {
  return await oracledb.getConnection({
    user: "ADMIN",
    password: await getPassword(),
    connectString: "db202010040550_low"
  });
})().catch(e => {
  console.error("failed to connect database:", e);
});

/*

https://VKV6W6LT0VNDN79-DB202010040550.adb.us-ashburn-1.oraclecloudapps.com/ords/
*/


async function start(){
  console.log("getConnection:");


  console.log("execute");
  let result = (await conn).execute(
    "CREATE TABLE test_table_2 ( id NUMBER, data VARCHAR2(20))",
    {}, {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    }
  );

  console.log(result);
}
