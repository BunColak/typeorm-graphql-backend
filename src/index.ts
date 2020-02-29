import "reflect-metadata";
import {createConnection} from "typeorm";

createConnection().then(async connection => {
    console.log('conencted to database');
    

}).catch(error => console.log(error));
