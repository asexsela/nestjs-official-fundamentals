import { DataSource } from "typeorm";
import { CoffeeRefactor1675327095370 } from "./src/migrations/1675327095370-CoffeeRefactor";
import { Coffee } from "./src/coffees/entities/coffee.entity";
import { Flavor } from "./src/coffees/entities/flavor.entity";
import { SchemaSync1675327677853 } from "./src/migrations/1675327677853-SchemaSync";

export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'pass123',
  database: 'iluvcoffee',
  entities: [Coffee, Flavor],
  migrations: [CoffeeRefactor1675327095370, SchemaSync1675327677853],
});
