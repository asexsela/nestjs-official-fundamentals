import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCoffeeDto {
  @ApiProperty({description: "Name of a coffee."})
  @IsString()
  readonly name: string;

  @ApiProperty({
    description: "The brand of a coffee.",
    example: "Nescafe"
  })
  @IsString()
  readonly brand: string;

  @ApiProperty({examples: ['nescafe']})
  @IsString({each: true})
  readonly flavors: string[];
}
