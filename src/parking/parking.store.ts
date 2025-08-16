import { Car } from './car.entity';
import { MinHeap } from './parking.utils';

export class ParkingStore {
  private totalSlots = 0;
  private availableSlots = new MinHeap();
  private occupiedSlots = new Map<number, Car>();
  private regToSlot = new Map<string, number>();
  private colorToRegs = new Map<string, Set<string>>();

  get isInitialized(): boolean {
    return this.totalSlots > 0;
  }

  get capacity(): number {
    return this.totalSlots;
  }

  initParkingLot(size: number) {
    this.totalSlots = size;
    this.availableSlots = new MinHeap();
    this.occupiedSlots.clear();
    this.regToSlot.clear();
    this.colorToRegs.clear();
    for (let i = 1; i <= size; i++) this.availableSlots.push(i);
  }

  expandParkingLot(increment: number) {
    const start = this.totalSlots + 1;
    this.totalSlots += increment;
    for (let i = start; i <= this.totalSlots; i++) this.availableSlots.push(i);
  }

  hasCar(regNo: string): boolean {
    return this.regToSlot.has(regNo);
  }

  allocateSlot(car: Car): number {
    const slot = this.availableSlots.pop();
    if (slot == null) throw new Error('Parking lot is full');

    this.occupiedSlots.set(slot, car);
    this.regToSlot.set(car.registrationNo, slot);

    const key = car.color.toLowerCase();
    if (!this.colorToRegs.has(key)) this.colorToRegs.set(key, new Set());
    this.colorToRegs.get(key)!.add(car.registrationNo);

    return slot;
  }

  freeBySlot(slotNumber: number): number {
    const car = this.occupiedSlots.get(slotNumber);
    if (!car) throw new Error('Slot is already free');

    this.occupiedSlots.delete(slotNumber);
    this.regToSlot.delete(car.registrationNo);

    const key = car.color.toLowerCase();
    const set = this.colorToRegs.get(key);
    if (set) {
      set.delete(car.registrationNo);
      if (set.size === 0) this.colorToRegs.delete(key);
    }

    this.availableSlots.push(slotNumber);
    return slotNumber;
  }

  freeByReg(regNo: string): number {
    const slot = this.regToSlot.get(regNo);
    if (slot == null) throw new Error('Car not found');
    return this.freeBySlot(slot);
  }

  getOccupied() {
    return [...this.occupiedSlots.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([slot, car]) => ({
        slot_no: slot,
        registration_no: car.registrationNo,
        color: car.color,
      }));
  }

  getRegNumbersByColor(color: string): string[] {
    return Array.from(this.colorToRegs.get(color.toLowerCase()) ?? []);
  }

  getSlotsByColor(color: string): number[] {
    const regs = this.getRegNumbersByColor(color);
    return regs.map(reg => this.regToSlot.get(reg)!).sort((a, b) => a - b);
  }

  getSlotByReg(regNo: string): number | undefined {
    return this.regToSlot.get(regNo);
  }
}

export const parkingStore = new ParkingStore();
