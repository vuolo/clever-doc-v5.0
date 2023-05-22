export interface PageMeta {
  title: string;
  description: string;
  cardImage: string;
}

export type Parser = "accounting_cs" | "quickbooks" |
  "bofa_business" | "regions_business" | "wells_fargo_business" |
  "n/a";