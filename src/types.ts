

export type Patient = {
  id: string;
  name: string;
  age: number;
  weight: number;
};

export type Measurement = {
  id: string;
  ptt: number;
  rate: number;
  thrombocytes?: number;
  createdAt: string;
};


