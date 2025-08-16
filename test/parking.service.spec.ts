import { Test, TestingModule } from '@nestjs/testing';
import { ParkingService } from '../src/parking/parking.service';

describe('ParkingService', () => {
  let service: ParkingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParkingService],
    }).compile();

    service = module.get<ParkingService>(ParkingService);  // ✅ FIXED
  });

  it('should create a parking lot', () => {
    const res = service.createParkingLot(3);
    expect(res).toEqual({ total_slot: 3 });
  });

  it('should allocate nearest available slots', () => {
    service.createParkingLot(2);
    const car1 = service.parkCar('KA-01', 'White');
    const car2 = service.parkCar('KA-02', 'Black');
    expect(car1).toEqual({ allocated_slot_number: 1 });
    expect(car2).toEqual({ allocated_slot_number: 2 });
  });

  it('should free a slot and reuse it', () => {
    service.createParkingLot(2);
    service.parkCar('X1', 'Blue');  // slot 1
    service.parkCar('X2', 'Red');   // slot 2
    const freed = service.clear(1, undefined);
    expect(freed).toEqual({ freed_slot_number: 1 });
    const newCar = service.parkCar('X3', 'Green');
    expect(newCar).toEqual({ allocated_slot_number: 1 });
  });

  it('should return occupied slots', () => {
    service.createParkingLot(2);
    service.parkCar('A1', 'Red');
    service.parkCar('A2', 'Blue');
    const status = service.status();
    expect(status.length).toBe(2);
  });

  it('should filter cars by color', () => {
    service.createParkingLot(3);
    service.parkCar('C1', 'Red');
    service.parkCar('C2', 'RED');
    const result = service.getRegistrationNumbersByColor('red');
    expect(result.sort()).toEqual(['C1', 'C2']);
  });

  it('should get slot by registration number', () => {
    service.createParkingLot(1);
    service.parkCar('D1', 'Black');
    const result = service.getSlotByRegistration('D1');
    expect(result).toEqual({ slot_number: 1 });
  });
});
