import { Material } from "../../models/Material";

export interface IMaterialRepository {
  create(material: Material): Promise<Material>;
  getByCourse(courseId: number): Promise<Material[]>;
  delete(id: number): Promise<boolean>;
}