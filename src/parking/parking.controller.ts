import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ParkingService } from './parking.service';
import { CreateParkingLotDto } from './dto/create-parking-lot.dto';
import { ExpandParkingLotDto } from './dto/expand-parking-lot.dto';
import { ParkCarDto } from './dto/park-car.dto';
import { ClearSlotDto } from './dto/clear-slot.dto';

@Controller()
export class ParkingController {
  constructor(private readonly service: ParkingService) {}

  @Post('parking_lot')
  createParkingLot(@Body() dto: CreateParkingLotDto) {
    return this.service.createParkingLot(dto.no_of_slot);
  }

  @Patch('parking_lot')
  expandParkingLot(@Body() dto: ExpandParkingLotDto) {
    return this.service.expandParkingLot(dto.increment_slot);
  }

  @Post('park')
  park(@Body() dto: ParkCarDto) {
    return this.service.parkCar(dto.car_reg_no, dto.car_color);
  }

  @Post('clear')
  clear(@Body() dto: ClearSlotDto) {
    return this.service.clear(dto.slot_number, dto.car_registration_no);
  }

  @Get('status')
  status() {
    return this.service.status();
  }

  @Get('registration_numbers/:color')
  regsByColor(@Param('color') color: string) {
    return this.service.getRegistrationNumbersByColor(color);
  }

  @Get('slot_numbers/:color')
  slotsByColor(@Param('color') color: string) {
    return this.service.getSlotNumbersByColor(color);
  }

  @Get('slot_number/:registrationNo')
  slotByReg(@Param('registrationNo') registrationNo: string) {
    return this.service.getSlotByRegistration(registrationNo);
  }
}
