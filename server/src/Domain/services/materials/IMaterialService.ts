import { MaterialDto } from "../../DTOs/materials/MaterialDto";
import { Material } from "../../models/Material";

export interface IMaterialService {
  getByCourse(courseId: number): Promise<MaterialDto[]>;
  createMaterial(m: Material): Promise<MaterialDto>;
  deleteMaterial(id: number): Promise<boolean>;
}