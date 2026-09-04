import { Column } from "./column";

export interface Board {
  id: string;
  name: string;
  ownerId: string;
}

export interface BoardDetail extends Board {
  columns: Column[];
}

export interface BoardMember {
  id: string;
  boardId: string;
  userId: string;
  role: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}
