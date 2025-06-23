import { faker } from '@faker-js/faker';
import { VehicleSales } from '../types';

const brands = ['Toyota', 'Honda', 'Ford', 'Chevrolet', 'BMW', 'Mercedes', 'Audi', 'Nissan', 'Hyundai', 'Volkswagen'];
const categories: Array<'Sedan' | 'SUV' | 'Truck' | 'Hatchback' | 'Electric'> = ['Sedan', 'SUV', 'Truck', 'Hatchback', 'Electric'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const getQuarter = (monthIndex: number): number => {
  return Math.floor(monthIndex / 3) + 1;
};

export const generateVehicleSalesData = (): VehicleSales[] => {
  const data: VehicleSales[] = [];
  
  // Generate data for 2022, 2023, and 2024
  for (let year = 2022; year <= 2024; year++) {
    for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
      const month = months[monthIndex];
      const quarter = getQuarter(monthIndex);
      
      // Generate 20-40 sales records per month
      const recordsCount = faker.number.int({ min: 20, max: 40 });
      
      for (let i = 0; i < recordsCount; i++) {
        const brand = faker.helpers.arrayElement(brands);
        const category = faker.helpers.arrayElement(categories);
        const unitsSold = faker.number.int({ min: 1, max: 50 });
        const basePrice = faker.number.int({ min: 20000, max: 80000 });
        const revenue = parseFloat((unitsSold * basePrice).toFixed(2));
        
        data.push({
          id: faker.string.uuid(),
          year,
          quarter,
          month,
          brand,
          model: `${brand} ${faker.vehicle.model()}`,
          unitsSold,
          revenue,
          category
        });
      }
    }
  }
  
  return data;
};

export const mockSalesData = generateVehicleSalesData();
