import { CategorySpec } from '../types';

export const CATEGORY_SPECS: CategorySpec[] = [
  {
    category: 'Real Estate',
    fields: [
      { name: 'bedrooms', label: 'Number of Bedrooms', type: 'number', placeholder: 'Enter number of bedrooms', required: true },
      { name: 'bathrooms', label: 'Number of Bathrooms', type: 'number', placeholder: 'Enter number of bathrooms', required: true },
      { name: 'squareMeters', label: 'Square Meters', type: 'number', placeholder: 'Enter property size', required: true },
      { name: 'propertyType', label: 'Property Type', type: 'text', placeholder: 'e.g., Apartment, Villa, Townhouse', required: true },
      { name: 'amenities', label: 'Amenities', type: 'text', placeholder: 'e.g., Pool, Gym, Parking', required: false },
    ]
  },
  {
    category: 'Electronics',
    fields: [
      { name: 'brand', label: 'Brand', type: 'text', placeholder: 'Enter brand name', required: true },
      { name: 'model', label: 'Model', type: 'text', placeholder: 'Enter model name/number', required: true },
      { name: 'condition', label: 'Condition', type: 'text', placeholder: 'e.g., New, Used, Like New', required: true },
      { name: 'warranty', label: 'Warranty Information', type: 'text', placeholder: 'Enter warranty details', required: false },
    ]
  },
  {
    category: 'Smartphones',
    fields: [
      { name: 'brand', label: 'Brand', type: 'text', placeholder: 'e.g., Apple, Samsung, Huawei', required: true },
      { name: 'model', label: 'Model', type: 'text', placeholder: 'e.g., iPhone 13 Pro, Galaxy S21', required: true },
      { name: 'storage', label: 'Storage (GB)', type: 'number', placeholder: 'Enter storage capacity', required: true },
      { name: 'ram', label: 'RAM (GB)', type: 'number', placeholder: 'Enter RAM size', required: true },
      { name: 'camera', label: 'Main Camera (MP)', type: 'number', placeholder: 'Enter camera megapixels', required: true },
      { name: 'batteryCapacity', label: 'Battery Capacity (mAh)', type: 'number', placeholder: 'Enter battery capacity', required: true },
    ]
  },
  {
    category: 'Vehicles',
    fields: [
      { name: 'make', label: 'Make', type: 'text', placeholder: 'e.g., Toyota, BMW, Honda', required: true },
      { name: 'model', label: 'Model', type: 'text', placeholder: 'Enter model name', required: true },
      { name: 'year', label: 'Year', type: 'number', placeholder: 'Enter manufacturing year', required: true },
      { name: 'mileage', label: 'Mileage (km)', type: 'number', placeholder: 'Enter vehicle mileage', required: true },
      { name: 'transmission', label: 'Transmission', type: 'text', placeholder: 'e.g., Automatic, Manual', required: true },
      { name: 'fuelType', label: 'Fuel Type', type: 'text', placeholder: 'e.g., Petrol, Diesel, Electric', required: true },
    ]
  },
  {
    category: 'Furniture',
    fields: [
      { name: 'material', label: 'Material', type: 'text', placeholder: 'e.g., Wood, Metal, Glass', required: true },
      { name: 'dimensions', label: 'Dimensions', type: 'text', placeholder: 'e.g., 120x80x75 cm', required: true },
      { name: 'condition', label: 'Condition', type: 'text', placeholder: 'e.g., New, Used, Like New', required: true },
      { name: 'style', label: 'Style', type: 'text', placeholder: 'e.g., Modern, Classic, Industrial', required: false },
    ]
  }
];