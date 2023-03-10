import { Inject, Injectable, NotFoundException, Scope } from "@nestjs/common";
import { Coffee } from "./entities/coffee.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { CreateCoffeeDto } from "./dto/create-coffee.dto";
import { UpdateCoffeeDto } from "./dto/update-coffee.dto";
import { Flavor } from "./entities/flavor.entity";
import { PaginationQueryDto } from "../common/dto/pagination-query.dto";
import { Event } from "../events/entities/event.entity";
import { ConfigService, ConfigType } from "@nestjs/config";
import coffeesConfig from "./config/coffees.config";

@Injectable()
export class CoffeesService {

  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>,
    @InjectRepository(Flavor)
    private readonly flavorRepository: Repository<Flavor>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll({limit, offset}: PaginationQueryDto) {

    return this.coffeeRepository.find({
      relations: {
        flavors: true
      },
      skip: offset,
      take: limit
    });
  }

  async findOne(id: string) {
    const coffee = await this.coffeeRepository.findOne({
      where: {id: +id},
      relations: {
        flavors: true
      }
    });

    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }

    return coffee;
  }

  async create(dto: CreateCoffeeDto) {
    const flavors = await Promise.all(
      dto.flavors.map(name => this.preloadFlavorByName(name))
    )

    const coffee = this.coffeeRepository.create({
      ...dto,
      flavors
    });
    return this.coffeeRepository.save(coffee);
  }

  async update(id: string, dto: UpdateCoffeeDto) {
    const flavors = dto.flavors &&
      (await Promise.all(
        dto.flavors.map(name => this.preloadFlavorByName(name))
      ))

    const coffee = await this.coffeeRepository.preload({
      id: +id,
      ...dto,
      flavors
    });

    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }

    return this.coffeeRepository.save(coffee);
  }

  async remove(id: string) {
    const coffee = await this.findOne(id);
    return this.coffeeRepository.remove(coffee);
  }

  async recommendCoffee(coffee: Coffee) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      coffee.recommendations++;

      const recommendEvent = new Event();
      recommendEvent.name = 'recommend_coffee';
      recommendEvent.type = 'coffee';
      recommendEvent.payload = {coffeeId: coffee.id};

      await queryRunner.manager.save(coffee)
      await queryRunner.manager.save(recommendEvent)

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  private async preloadFlavorByName(name: string): Promise<Flavor> {
    const exists = await this.flavorRepository.findOne({where: {name}});
    return exists ? exists : this.flavorRepository.create({name});
  }
}
