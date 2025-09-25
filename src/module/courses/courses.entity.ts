export interface Course {
  id: string;
  title: string;
  description: string;
  image?: string;
  creatorId: string; 
  createdAt: Date;
  updatedAt: Date;
}
