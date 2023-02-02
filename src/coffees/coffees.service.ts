import { Injectable, NotFoundException } from "@nestjs/common";
import { Coffee } from "./entities/coffee.entoty";

@Injectable()
export class CoffeesService {
  private coffees: Coffee[] = [
    {
      id: 1,
      name: 'Shipwreck Roast',
      brand: 'Buddy Brew',
      flavors: ['chocolate', 'vanilla']
    }
  ];

  findAll() {
    return this.coffees;
  }

  findOne(id: string) {
    const coffee = this.coffees.find(item => item.id === +id);

    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }

    return coffee;
  }

  create(dto: any) {
    this.coffees.push(dto);
    return dto
  }

  update(id: string, dto: any) {
    const exists = this.findOne(id);

    if (exists) {
      // update
    }
  }

  remove(id: string) {
    const index = this.coffees.findIndex(item => item.id === +id);

    if (index >= 0) {
      this.coffees.splice(index, 1);
    }
  }
}
