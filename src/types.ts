export type MCQ = {
  q: string;
  options: string[];
  answer: number;
};

export type AIResponse = {
  questions: MCQ[];
};
