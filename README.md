<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">
  🚗 A Parking Lot Management API built with <a href="http://nestjs.com" target="_blank">NestJS</a>.
</p>


---

## 📖 Description

A simple **Parking Lot API** built with **NestJS** and TypeScript.  
It uses an **in-memory store** with a **MinHeap** to always allocate the **nearest available slot**.  

Supports:
- Creating and expanding parking lots
- Parking and clearing slots
- Querying status
- Searching cars by color or registration number
- Docker support for easy deployment

---

## 🚀 Project Setup

```bash
$ npm install
🏃 Compile & Run

# development
$ npm run start

# watch mode
$ npm run start:dev

# production
$ npm run start:prod
🧪 Run Tests

# unit tests
$ npm run test

# coverage
$ npm run test:cov
🐳 Run with Docker

# build and run
$ docker-compose up --build

# or manually
$ docker build -t parking-lot-api .
$ docker run -p 3000:3000 parking-lot-api
📡 API Endpoints
POST /parking_lot → Create parking lot

PATCH /parking_lot → Expand parking lot

POST /park → Park a car

POST /clear → Clear slot (by slot no. or registration no.)

GET /status → Get all parked cars

GET /registration_numbers/:color → Get car registrations by color

GET /slot_numbers/:color → Get slot numbers by color

GET /slot_number/:registrationNo → Get slot by registration number

📂 Project Structure

src/
 └── parking/
     ├── parking.controller.ts
     ├── parking.service.ts
     ├── parking.store.ts
     ├── parking.utils.ts
     ├── dto/
     ├── car.entity.ts
     ├── slot.entity.ts
     └── parking.module.ts
test/
Dockerfile
docker-compose.yml
package.json