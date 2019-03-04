import { Pool } from "pg";
import config from "./keys";
import dotenv from "dotenv";
dotenv.config();
let pool;
//@
if(process.env.NODE_ENV==="DEV"){
//@database connection
console.log(config.databaseURI);
pool = new Pool({
 connectionString:config.databaseURI
});
}
//@this runs when someone is testing app using TDD
if(process.env.NODE_ENV==="TEST"){
  //@database connection
   pool = new Pool({
   connectionString:config.dbTestURI
  });

  }
  export default pool;

