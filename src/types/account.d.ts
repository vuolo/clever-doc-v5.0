export type Account = {
  name: string;
  number: string;
  entries: {
    description: string;
    quantity: number;
  }[];
};
