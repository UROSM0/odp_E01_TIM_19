import type { MaterialDto } from "../../models/materials/MaterialDto";

export interface IMaterialsAPIService {
  getMaterialsByCourse(courseId: number, token: string): Promise<MaterialDto[]>;

  createMaterial(
    courseId: number,
    title: string,
    description: string | null,
    filePath: string,
    fileMime: string,
    token: string
  ): Promise<MaterialDto>;

  deleteMaterial(id: number, token: string): Promise<boolean>;
}