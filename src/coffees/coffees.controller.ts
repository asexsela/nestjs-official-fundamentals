import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus, Inject,
  Param,
  Patch,
  Post, Query, SetMetadata, UsePipes, ValidationPipe
} from "@nestjs/common";
import { CoffeesService } from "./coffees.service";
import { CreateCoffeeDto } from "./dto/create-coffee.dto";
import { UpdateCoffeeDto } from "./dto/update-coffee.dto";
import { PaginationQueryDto } from "../common/dto/pagination-query.dto";
import { REQUEST } from "@nestjs/core";
import { Request } from 'express';
import { Public } from "../common/decorators/public.decorator";
import { ParseIntPipe } from "../common/pipes/parse-int/parse-int.pipe";
import { Protocol } from "../common/decorators/protocol.decorator";
import { ApiResponse, ApiTags } from "@nestjs/swagger";


@ApiTags('Coffee')
@Controller('/coffees')
export class CoffeesController {

  constructor(
    private readonly coffeeService: CoffeesService
  ) {}

  @Get()
  @Public()
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async getProducts(@Query() query: PaginationQueryDto) {
    return this.coffeeService.findAll(query);
  }

  @Get(':id')
  findOne(@Protocol('https') protocol: any, @Param('id', ParseIntPipe) id: string) {
    console.log(protocol);
    return this.coffeeService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateCoffeeDto) {
    return this.coffeeService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body(ValidationPipe) dto: UpdateCoffeeDto) {
    return this.coffeeService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coffeeService.remove(id);
  }
}
