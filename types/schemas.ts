//RentAnything/types/schemas.ts

import { z } from 'zod';

export const AddressSchema = z.object({
  id: z.number().optional().nullable(),
  address: z.string().optional().nullable(),
  lat: z.coerce.number().optional().nullable(),
  lng: z.coerce.number().optional().nullable(),
});

export const UserProfileSchema = z.object({
  id: z.union([z.number(), z.string()]),
  email: z.string(),
  phone: z.string().optional().nullable(),
  role: z.string(),
  profileImage: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
  joinedAt: z.string(),
  updatedAt: z.string().optional().nullable(),
  individualUser: z.object({
    id: z.union([z.number(), z.string()]),
    fullName: z.string(),
    avatarUrl: z.string().optional().nullable(),
    nic: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    location: z.string().optional().nullable(),
    dateOfBirth: z.string().optional().nullable(),
    gender: z.string().optional().nullable(),
  }).optional().nullable(),
  company: z.object({
    id: z.union([z.number(), z.string()]),
    companyName: z.string(),
    logoUrl: z.string().optional().nullable(),
    registrationNumber: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    location: z.string().optional().nullable(),
    contactPerson: z.string().optional().nullable(),
    industry: z.string().optional().nullable(),
  }).optional().nullable(),
});

export const UserSchema = z.object({
  id: z.union([z.number(), z.string()]),
  profileImage: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
  joinedAt: z.union([z.string(), z.date()]).optional().nullable(),
  totalListings: z.number().optional().nullable(),
  individualUser: z.object({ 
    fullName: z.string(),
    avatarUrl: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
  }).optional().nullable(),
  company: z.object({ 
    companyName: z.string(),
    logoUrl: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
  }).optional().nullable(),
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
  slug: z.string().optional().nullable(),
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
  subImages: z.array(z.string()).max(5, "Maximum 5 sub-images allowed").optional().nullable(),
  price: z.union([z.number(), z.string()]).optional().nullable(),
  owner: UserSchema.optional().nullable(),
  address: AddressSchema.optional().nullable(),
  category: CategorySchema.optional().nullable(),
  categoryDetails: CategoryDetailsSchema.optional().nullable(),
  accessibility: z.string().optional().nullable(),
  deliveryAvailable: z.boolean().optional().nullable(),
  pickupAvailable: z.boolean().optional().nullable(),
  pricings: z.array(z.any()).optional().nullable(),
  availabilities: z.array(z.any()).optional().nullable(),
  averageRating: z.number().optional().nullable(),
  reviewCount: z.number().optional().nullable(),
});

export const FilterParamsSchema = z.object({
  categoryId: z.coerce.string().optional(),
  priceMin: z.coerce.number().optional(),
  priceMax: z.coerce.number().optional(),
  distance: z.string().optional(),
  minRating: z.coerce.number().optional(),
  location: z.string().optional(),
  returnTo: z.string().optional(),
  brand: z.string().optional(),
  accessibility: z.string().optional(),
  warrantyOnly: z.coerce.boolean().optional(),
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
  subImages: z.array(z.string()).max(5, "Maximum 5 sub-images allowed").optional().nullable(),
  condition: z.string().optional().nullable(),
  rentalTerms: z.string().optional().nullable(),
  instructions: z.string().optional().nullable(),
  securityDeposit: z.coerce.number().optional().nullable(),
  rateType: z.string().optional().nullable(),
  accessibility: z.string().optional().nullable(),
  availabilities: z.array(z.any()).optional().nullable(),
}).passthrough();



export const ChatMessageSchema = z.object({
  id: z.preprocess((val: any) => (typeof val === 'string' ? parseInt(val, 10) : val), z.number()),
  content: z.string(),
  senderId: z.preprocess((val: any) => {
    if (typeof val === 'number') return val;
    if (typeof val === 'string') return parseInt(val, 10);
    if (val && typeof val === 'object' && 'id' in val) return (val as any).id;
    return val;
  }, z.number()),
  threadId: z.preprocess((val: any) => {
    if (typeof val === 'number') return val;
    if (typeof val === 'string') return parseInt(val, 10);
    if (val && typeof val === 'object' && 'id' in val) return (val as any).id;
    return val;
  }, z.number().optional()),
  createdAt: z.preprocess((val: any) => {
    if (val instanceof Date) return val.toISOString();
    return val;
  }, z.string()),
  sender: UserSchema.optional().nullable(),
  attachments: z.preprocess((val: any) => {
    if (typeof val === 'string') return val.split(',').filter(Boolean);
    return val;
  }, z.array(z.string()).optional().nullable()),
  attachmentNames: z.preprocess((val: any) => {
    if (typeof val === 'string') return val.split(',').filter(Boolean);
    return val;
  }, z.array(z.string()).optional().nullable()),
  type: z.string().optional().default('text'),
  thread: z.object({
    id: z.number(),
  }).optional().nullable(),
});

export const ChatThreadSchema = z.object({
  id: z.number(),
  itemId: z.number(),
  userOneId: z.number(),
  userTwoId: z.number(),
  createdAt: z.string(),
  lastMessage: ChatMessageSchema.optional().nullable(),
  item: z.object({
    id: z.number(),
    title: z.string(),
    imageUrl: z.string().optional().nullable(),
  }).optional().nullable(),
  userOne: UserSchema.optional().nullable(),
  userTwo: UserSchema.optional().nullable(),
  unreadCount: z.number().optional().default(0),
});

export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    data: dataSchema,
  });

export type Item = z.infer<typeof ItemSchema>;
export type Address = z.infer<typeof AddressSchema>;
export type User = z.infer<typeof UserSchema>;
export type ChatThread = z.infer<typeof ChatThreadSchema>;
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

export const KycStatusEnum = z.enum(['NOT_STARTED', 'PENDING', 'VERIFIED', 'REJECTED']);

export const KycDocumentTypeSchema = z.enum([
  'FACE_SELFIE',
  'NIC_FRONT',
  'NIC_BACK',
  'DRIVING_LICENSE',
  'PASSPORT',
  'PROOF_OF_ADDRESS',
]);

export const KycItemSchema = z.object({
  status: KycStatusEnum,
  fileUrl: z.string().optional().nullable(),
  rejectionReasons: z.array(z.string()).optional().nullable(),
});

export const KycStatusResponseSchema = z.object({
  overallStatus: KycStatusEnum,
  items: z.record(KycDocumentTypeSchema, KycItemSchema),
});

export type KycStatusResponse = z.infer<typeof KycStatusResponseSchema>;
export type KycDocumentType = z.infer<typeof KycDocumentTypeSchema>;

export const ReviewSchema = z.object({
  id: z.number(),
  rating: z.number(),
  comment: z.string().optional().nullable(),
  name: z.string(),
  image: z.string().optional().nullable(),
  createdAt: z.string(),
  itemName: z.string().optional().nullable(),
  reviewerStatus: z.string().optional().nullable(),
});

export const ReviewsResponseSchema = z.object({
  totalReviews: z.number(),
  averageRating: z.number(),
  starCounts: z.record(z.coerce.string(), z.number()),
  reviews: z.array(ReviewSchema),
});

export type Review = z.infer<typeof ReviewSchema>;
export type ReviewsResponse = z.infer<typeof ReviewsResponseSchema>;
