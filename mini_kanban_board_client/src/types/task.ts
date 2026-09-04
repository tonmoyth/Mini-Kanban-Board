export interface Task {
  id: string;
  title: string;
  description: string | null;
  position: number;
  columnId: string;
}

export interface MoveTaskPayload {
  targetColumnId: string;
  position: number;
}
