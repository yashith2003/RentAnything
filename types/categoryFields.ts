//types/categoryFields.ts

export interface FieldConfig {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'chips' | 'toggle' | 'upload' | 'textarea';
  required?: boolean;
  options?: any[];
  placeholder?: string;
  conditional?: {
    field: string;
    value: any;
  };
}

export interface CategoryFieldsConfig {
  categoryName: string;
  fields: FieldConfig[];
}

// Vehicle Fields Configuration
export const VehicleFieldsConfig: CategoryFieldsConfig = {
  categoryName: 'Vehicle',
  fields: [
    {
      name: 'vehicleType',
      label: 'Vehicle Type',
      type: 'select',
      required: true,
      options: ['Car', 'Bike', 'Truck', 'Van', 'SUV', 'Scooter'],
      placeholder: 'Select vehicle type',
    },
    {
      name: 'seatingCapacity',
      label: 'Seating Capacity',
      type: 'chips',
      required: true,
      options: [2, 4, 6, 8, 10],
    },
    {
      name: 'fuelType',
      label: 'Fuel Type',
      type: 'chips',
      required: true,
      options: ['Petrol', 'Diesel', 'Hybrid', 'Electric', 'Other'],
    },
    {
      name: 'color',
      label: 'Color',
      type: 'chips',
      required: false,
      options: ['White', 'Gray', 'Blue', 'Black', 'Red', 'Silver'],
    },
    {
      name: 'vehicleNumber',
      label: 'Vehicle Number',
      type: 'text',
      required: true,
      placeholder: 'Type here...',
    },
    {
      name: 'registrationDocument',
      label: 'Vehicle Registration Documents',
      type: 'upload',
      required: false,
    },
    {
      name: 'insuranceDocument',
      label: 'Proof of Insurance',
      type: 'upload',
      required: false,
    },
    {
      name: 'revenueLicense',
      label: 'Vehicle Revenue License',
      type: 'upload',
      required: false,
    },
    {
      name: 'deliveryFee',
      label: 'Delivery Fee',
      type: 'number',
      required: false,
      placeholder: 'Type here...',
    },
    {
      name: 'driverAvailable',
      label: 'Book with driver',
      type: 'toggle',
      required: false,
    },
    {
      name: 'driverName',
      label: 'Driver Name',
      type: 'text',
      required: false,
      placeholder: 'Type here...',
      conditional: { field: 'driverAvailable', value: true },
    },
    {
      name: 'driverGender',
      label: 'Driver Gender',
      type: 'chips',
      required: false,
      options: ['Male', 'Female', 'Other'],
      conditional: { field: 'driverAvailable', value: true },
    },
    {
      name: 'driverLicense',
      label: 'Driving License',
      type: 'upload',
      required: false,
      conditional: { field: 'driverAvailable', value: true },
    },
    {
      name: 'driverFee',
      label: 'Driver Fee',
      type: 'number',
      required: false,
      placeholder: 'Type here...',
      conditional: { field: 'driverAvailable', value: true },
    },
  ],
};

// Electronics Fields Configuration
export const ElectronicsFieldsConfig: CategoryFieldsConfig = {
  categoryName: 'Electronics',
  fields: [
    {
      name: 'brand',
      label: 'Brand',
      type: 'text',
      required: true,
      placeholder: 'Type here...',
    },
    {
      name: 'model',
      label: 'Model',
      type: 'text',
      required: true,
      placeholder: 'Type here...',
    },
    {
      name: 'warranty',
      label: 'Warranty',
      type: 'text',
      required: false,
      placeholder: 'e.g., 1 year manufacturer warranty',
    },
    {
      name: 'specifications',
      label: 'Specifications',
      type: 'textarea',
      required: false,
      placeholder: 'Enter detailed specifications...',
    },
  ],
};

// Home Fields Configuration
export const HomeFieldsConfig: CategoryFieldsConfig = {
  categoryName: 'Home',
  fields: [
    {
      name: 'propertyType',
      label: 'Property Type',
      type: 'select',
      required: true,
      options: ['Apartment', 'House', 'Villa', 'Studio', 'Room'],
      placeholder: 'Select property type',
    },
    {
      name: 'numberOfRooms',
      label: 'Number of Rooms',
      type: 'number',
      required: true,
      placeholder: 'Type here...',
    },
    {
      name: 'numberOfBathrooms',
      label: 'Number of Bathrooms',
      type: 'number',
      required: true,
      placeholder: 'Type here...',
    },
    {
      name: 'area',
      label: 'Area',
      type: 'text',
      required: true,
      placeholder: 'e.g., 1200 sq ft',
    },
    {
      name: 'isFurnished',
      label: 'Furnished',
      type: 'toggle',
      required: false,
    },
  ],
};

// Fashion Fields Configuration
export const FashionFieldsConfig: CategoryFieldsConfig = {
  categoryName: 'Fashion',
  fields: [
    {
      name: 'size',
      label: 'Size',
      type: 'chips',
      required: true,
      options: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    },
    {
      name: 'gender',
      label: 'Gender',
      type: 'chips',
      required: true,
      options: ['Male', 'Female', 'Unisex', 'Kids'],
    },
    {
      name: 'brand',
      label: 'Brand',
      type: 'text',
      required: false,
      placeholder: 'Type here...',
    },
    {
      name: 'material',
      label: 'Material',
      type: 'text',
      required: false,
      placeholder: 'e.g., Cotton, Polyester',
    },
  ],
};

// Sports Fields Configuration
export const SportsFieldsConfig: CategoryFieldsConfig = {
  categoryName: 'Sport',
  fields: [
    {
      name: 'sportType',
      label: 'Sport Type',
      type: 'select',
      required: true,
      options: ['Cricket', 'Football', 'Tennis', 'Badminton', 'Gym', 'Basketball'],
      placeholder: 'Select sport type',
    },
    {
      name: 'equipmentType',
      label: 'Equipment Type',
      type: 'text',
      required: false,
      placeholder: 'e.g., Bat, Ball, Racket',
    },
    {
      name: 'suitableFor',
      label: 'Suitable For',
      type: 'chips',
      required: false,
      options: ['Beginner', 'Intermediate', 'Professional', 'All Levels'],
    },
  ],
};

// Category Field Map
export const CategoryFieldMap: { [key: string]: CategoryFieldsConfig } = {
  Vehicle: VehicleFieldsConfig,
  Electronics: ElectronicsFieldsConfig,
  Home: HomeFieldsConfig,
  Fashion: FashionFieldsConfig,
  Sport: SportsFieldsConfig,
};

// Helper function to get fields for a category
export const getCategoryFields = (categoryName: string): FieldConfig[] => {
  const config = CategoryFieldMap[categoryName];
  return config ? config.fields : [];
};
