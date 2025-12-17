import { z } from 'zod';

export const GeographicalLocationSchema = z.object({
  isDisclosed: z.boolean().default(true),
  latitude: z.number(),
  longitude: z.number(),
  altitude: z.number().optional(),
});

export type GeographicalLocationData = z.infer<
  typeof GeographicalLocationSchema
>;

export const GeographicalSizeSchema = z.object({
  width: z.number(),
  height: z.number(),
  unit: z.enum(["meters", "kilometers", "feet", "miles"]).default("meters"),
});

export type GeographicalSizeData = z.infer<typeof GeographicalSizeSchema>;

export const GeographicalOffsetSchema = z.object({
  x: z.number(),
  y: z.number(),
  z: z.number().optional(),
  rotationX: z.number().optional(),
  rotationY: z.number().optional(),
  rotationZ: z.number().optional(),
  scale: z.number().optional(),
});

export type GeographicalOffsetData = z.infer<typeof GeographicalOffsetSchema>;
