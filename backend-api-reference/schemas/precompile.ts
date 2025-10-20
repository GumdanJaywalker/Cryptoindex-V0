import { z } from './common';
import { zAddress, zUIntStr } from './common';

export const BasketPositionSchema = z.object({
  symbol: z.string(),
  sizeRaw: zUIntStr,
});

export const BasketStateSchema = z.object({
  owner: zAddress,
  assetId: z.string(),
  positions: z.array(BasketPositionSchema),
  updatedAt: z.number().int(),
});

export type BasketState = z.infer<typeof BasketStateSchema>;

