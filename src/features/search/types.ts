import { z } from 'zod';

export const searchQuerySchema = z.object({
  query: z
    .string()
    .trim()
    .min(1, { message: 'Search query cannot be empty' })
    .max(100, { message: 'Search query cannot exceed 100 characters' })
    .refine((val) => !/[\u0000-\u001F\u007F-\u009F]/.test(val), {
      message: 'Search query contains invalid control characters',
    }),
  limit: z
    .number()
    .int()
    .min(1)
    .max(50)
    .default(10)
    .optional(),
  categoryId: z.string().optional(),
});

export type SearchParams = z.infer<typeof searchQuerySchema>;

export type SearchMatchType =
  | 'exact_name'
  | 'exact_alias'
  | 'prefix_name'
  | 'prefix_alias'
  | 'full_text'
  | 'fuzzy';

export interface SearchResult {
  serviceId: string;
  slug: string;
  name: string;
  nameNormalized: string;
  summary?: string | null;
  categoryName: string;
  matchType: SearchMatchType;
  score: number;
  matchedAlias?: string | null;
}
