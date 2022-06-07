

export type Patient = {
  id: number;
  name: string;
  age: number;
  weight: number;
};

export type Measurement = {
  id: number;
  ptt: number;
  rate: number;
  thrombocytes?: number;
  createdAt: string;
};


