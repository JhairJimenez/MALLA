export interface Note {
  id: string;
  content: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  credits: number;
  semester: number;
  completed: boolean;
  prerequisites?: string[];
  color?: string;
  notes?: Note[];
}