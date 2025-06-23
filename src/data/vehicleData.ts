import { faker } from '@faker-js/faker';
import { Vehicle } from '../types';

const brands = ['Toyota', 'Honda', 'Ford', 'Chevrolet', 'BMW', 'Mercedes', 'Audi', 'Nissan', 'Hyundai', 'Volkswagen'];
const categories: Array<'Sedan' | 'SUV' | 'Truck' | 'Hatchback' | 'Electric'> = ['Sedan', 'SUV', 'Truck', 'Hatchback', 'Electric'];
const colors = ['Black', 'White', 'Silver', 'Blue', 'Red', 'Gray', 'Green', 'Brown'];
const statuses: Array<'Available' | 'Sold' | 'Reserved'> = ['Available', 'Sold', 'Reserved'];

const generateRegistrationNumber = (): string => {
  const letters = faker.string.alpha({ length: 3, casing: 'upper' });
  const numbers = faker.string.numeric(4);
  return `${letters}-${numbers}`;
};

export const generateVehicleData = (): Vehicle[] => {
  const vehicles: Vehicle[] = [];
  
  for (let i = 0; i < 150; i++) {
    const brand = faker.helpers.arrayElement(brands);
    const category = faker.helpers.arrayElement(categories);
    const baseDate = faker.date.between({ from: new Date('2020-01-01'), to: new Date() });
    
    vehicles.push({
      id: faker.string.uuid(),
      registration: generateRegistrationNumber(),
      brand,
      model: `${brand} ${faker.vehicle.model()}`,
      value: faker.number.int({ min: 15000, max: 85000 }),
      year: faker.number.int({ min: 2018, max: 2024 }),
      category,
      color: faker.helpers.arrayElement(colors),
      mileage: faker.number.int({ min: 0, max: 150000 }),
      status: faker.helpers.arrayElement(statuses),
      createdAt: baseDate,
      updatedAt: faker.date.between({ from: baseDate, to: new Date() })
    });
  }
  
  return vehicles.sort((a, b) => a.brand.localeCompare(b.brand));
};

export const mockVehicleData = generateVehicleData();
