import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Car } from './car.entity';
import { parkingStore } from './parking.store';

@Injectable()
export class ParkingService {
  createParkingLot(size: number) {
    parkingStore.initParkingLot(size);
    return { total_slot: parkingStore.capacity };
  }

  expandParkingLot(increment: number) {
    this.ensureInitialized();
    parkingStore.expandParkingLot(increment);
    return { total_slot: parkingStore.capacity };
  }

  parkCar(regNo: string, color: string) {
    this.ensureInitialized();
    if (parkingStore.hasCar(regNo)) {
      throw new BadRequestException('Car already parked');
    }
    try {
      const slot = parkingStore.allocateSlot(new Car(regNo, color));
      return { allocated_slot_number: slot };
    } catch (e) {
      throw new BadRequestException((e as Error).message);
    }
  }

  clear(slotNumber?: number, regNo?: string) {
    this.ensureInitialized();
    if (slotNumber == null && regNo == null) {
      throw new BadRequestException('Provide slot_number or car_registration_no');
    }
    try {
      const freed = slotNumber != null
        ? parkingStore.freeBySlot(slotNumber)
        : parkingStore.freeByReg(regNo!);
      return { freed_slot_number: freed };
    } catch (e) {
      const msg = (e as Error).message;
      if (msg === 'Slot is already free') throw new BadRequestException(msg);
      if (msg === 'Car not found') throw new NotFoundException(msg);
      throw new BadRequestException(msg);
    }
  }

  status() {
    this.ensureInitialized();
    return parkingStore.getOccupied();
  }

  getRegistrationNumbersByColor(color: string) {
    this.ensureInitialized();
    return parkingStore.getRegNumbersByColor(color);
  }

  getSlotNumbersByColor(color: string) {
    this.ensureInitialized();
    return parkingStore.getSlotsByColor(color).map(String);
  }

  getSlotByRegistration(regNo: string) {
    this.ensureInitialized();
    const slot = parkingStore.getSlotByReg(regNo);
    if (slot == null) throw new NotFoundException('Car not found');
    return { slot_number: slot };
  }

  private ensureInitialized() {
    if (!parkingStore.isInitialized) {
      throw new BadRequestException('Parking lot is not initialized');
    }
  }
}
