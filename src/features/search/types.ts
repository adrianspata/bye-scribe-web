import { z } from 'zod';

export const searchQuerySchema = z.object({
  query: z
    .string()
    .trim()
    .min(1, { message: 'Sökfrasen får inte vara tom' })
    .max(100, { message: 'Sökfrasen får max vara 100 tecken' })
    .refine((val) => !/[\u0000-\u001F\u007F-\u009F]/.test(val), {
      message: 'Sökfrasen innehåller ogiltiga kontrolltecken',
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
