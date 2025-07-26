export interface Course {
  id: String;
  slug: string;
  name: string;
  semester: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCourseRequest {
  slug: string;
  name: string;
  semester: number;
  description?: string;
}

export interface UpdateCourseRequest {
  slug?: string;
  name?: string;
  semester?: number;
  description?: string;
}
