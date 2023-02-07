import { Column, Entity, ManyToMany, JoinTable, PrimaryGeneratedColumn } from "typeorm";
import { Flavor } from "./flavor.entity";

@Entity({
  name: 'coffees'
}) // table name is coffees
export class Coffee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({nullable: true})
  description: string;

  @Column()
  brand: string;

  @Column({default: 0})
  recommendations: number;

  @JoinTable()
  @ManyToMany(
    () => Flavor,
    flavor => flavor.coffees,
    {
      cascade: true
    }
  )
  flavors: Flavor[];
}
