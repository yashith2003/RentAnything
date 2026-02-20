import { z } from 'zod';

export const AddressSchema = z.object({
  id: z.number().optional().nullable(),
  address: z.string().optional().nullable(),
  lat: z.coerce.number().optional().nullable(),
  lng: z.coerce.number().optional().nullable(),
});

export const UserProfileSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  phone: z.string().optional().nullable(),
  role: z.string(),
  profileImage: z.string().optional().nullable(),
  individualUser: z.object({
    id: z.number(),
    fullName: z.string(),
    nic: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
    dateOfBirth: z.string().optional().nullable(),
    gender: z.string().optional().nullable(),
  }).optional().nullable(),
  company: z.object({
    id: z.number(),
    companyName: z.string(),
    registrationNumber: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
    contactPerson: z.string().optional().nullable(),
    industry: z.string().optional().nullable(),
  }).optional().nullable(),
});

export const UserSchema = z.object({
  id: z.number(),
  individualUser: z.object({ fullName: z.string() }).optional().nullable(),
  company: z.object({ companyName: z.string() }).optional().nullable(),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;

export const PricingSchema = z.object({
  id: z.number(),
  rateType: z.string(),
  price: z.number(),
});

export const AvailabilitySchema = z.object({
  id: z.number(),
  availableDate: z.string(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  isAvailable: z.boolean().optional(),
});

export const CategoryDetailsSchema = z.object({
  // Vehicle details
  vehicleType: z.string().optional().nullable(),
  vehicleNumber: z.string().optional().nullable(),
  seatingCapacity: z.coerce.number().optional().nullable(),
  fuelType: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  registrationDocument: z.string().optional().nullable(),
  insuranceDocument: z.string().optional().nullable(),
  revenueLicense: z.string().optional().nullable(),
  deliveryFee: z.coerce.number().optional().nullable(),
  driverAvailable: z.boolean().optional().nullable(),
  driverName: z.string().optional().nullable(),
  driverGender: z.string().optional().nullable(),
  driverLicense: z.string().optional().nullable(),
  driverFee: z.coerce.number().optional().nullable(),
  
  // Electronics details
  brand: z.string().optional().nullable(),
  model: z.string().optional().nullable(),
  warranty: z.string().optional().nullable(),
  specifications: z.string().optional().nullable(),
  
  // Home details
  propertyType: z.string().optional().nullable(),
  numberOfRooms: z.coerce.number().optional().nullable(),
  numberOfBathrooms: z.coerce.number().optional().nullable(),
  area: z.string().optional().nullable(),
  isFurnished: z.boolean().optional().nullable(),
  amenities: z.string().optional().nullable(),
  
  // Fashion details
  size: z.string().optional().nullable(),
  gender: z.string().optional().nullable(),
  material: z.string().optional().nullable(),
  
  // Sports details
  sportType: z.string().optional().nullable(),
  equipmentType: z.string().optional().nullable(),
  suitableFor: z.string().optional().nullable(),
}).catchall(z.any());

export const CategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional().nullable(),
});

export const ItemSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  condition: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  rentalTerms: z.string().optional().nullable(),
  instructions: z.string().optional().nullable(),
  securityDeposit: z.union([z.number(), z.string()]).optional().nullable(),
  imageUrl: z.string().optional().nullable(), // Removed .url() as it might be a relative path
  price: z.union([z.number(), z.string()]).optional().nullable(),
  owner: UserSchema.optional().nullable(),
  address: AddressSchema.optional().nullable(),
  category: CategorySchema.optional().nullable(),
  categoryDetails: CategoryDetailsSchema.optional().nullable(),
  pricings: z.array(z.any()).optional().nullable(),
  availabilities: z.array(z.any()).optional().nullable(),
});

export const FilterParamsSchema = z.object({
  categoryId: z.coerce.string().optional(),
  priceMin: z.coerce.number().optional(),
  priceMax: z.coerce.number().optional(),
  distance: z.string().optional(),
  minRating: z.coerce.number().optional(),
  location: z.string().optional(),
  returnTo: z.string().optional(),
}).catchall(z.any());

export type FilterParams = z.infer<typeof FilterParamsSchema>;

export const CreateItemSchema = z.object({
  title: z.string().min(3, "Item Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  phone: z.string().min(10, "Invalid phone number"),
  categoryId: z.number(),
  addressId: z.number(),
  price: z.coerce.number().min(0, "Rental fee cannot be negative"),

  imageUrl: z.string().optional().nullable(),
  condition: z.string().optional().nullable(),
  rentalTerms: z.string().optional().nullable(),
  instructions: z.string().optional().nullable(),
  securityDeposit: z.coerce.number().optional().nullable(),
  rateType: z.string().optional().nullable(),
  availabilities: z.array(z.any()).optional().nullable(),
}).passthrough();



export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    data: dataSchema,
  });

export type Item = z.infer<typeof ItemSchema>;
export type Address = z.infer<typeof AddressSchema>;
export type User = z.infer<typeof UserSchema>;
