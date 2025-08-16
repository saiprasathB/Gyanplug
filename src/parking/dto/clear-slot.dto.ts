import { IsInt, IsOptional, IsString, ValidateIf, Min, Matches } from 'class-validator';

export class ClearSlotDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  slot_number?: number;

  @ValidateIf(o => o.slot_number == null)
  @IsString()
  @Matches(/^\S+$/, { message: 'car_registration_no must not contain spaces' })
  car_registration_no?: string;
}
