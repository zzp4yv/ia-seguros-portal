export interface News {
  id: string;
  title: string;
  summary: string;
  source: string;
  category: string;
  date: string;
  url: string;
}

export interface NewsResponse {
  success: boolean;
  count: number;
  data: News[];
  error?: string;
}
