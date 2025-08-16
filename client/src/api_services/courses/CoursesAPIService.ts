import axios from "axios";
import type { CourseDto } from "../../models/courses/CourseDto";
import type { ICoursesAPIService } from "./ICoursesAPIService";

const API_URL: string = import.meta.env.VITE_API_URL + "course";

export const coursesApi: ICoursesAPIService = {
  async getAllCourses(): Promise<CourseDto[]> {
  try {
    const res = await axios.get<CourseDto[]>(`${API_URL}s`);
    return res.data;
  } catch {
    return [];
  }
},

async enrollUser(userId: number,courseId: number, role: "student" | "professor", token: string) {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}enrollments`,
        { userId, courseId, role },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (error: any) {
      console.error("Greška pri enroll-u:", error.response?.data || error.message);
      throw error;
    }
  },
};