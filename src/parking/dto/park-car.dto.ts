import { IsString, Matches } from 'class-validator';

export class ParkCarDto {
  @IsString()
  @Matches(/^\S+$/, { message: 'car_reg_no must not contain spaces' })
  car_reg_no!: string;

  @IsString()
  car_color!: string;
}
