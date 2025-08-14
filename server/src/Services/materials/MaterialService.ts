import { IMaterialService } from "../../Domain/services/materials/IMaterialService";
import { MaterialRepository } from "../../Database/repositories/materials/MaterialRepository";
import { MaterialDto } from "../../Domain/DTOs/materials/MaterialDto";
import { Material } from "../../Domain/models/Material";

export class MaterialService implements IMaterialService {
  constructor(private materialRepository: MaterialRepository) {}

  async getByCourse(courseId: number): Promise<MaterialDto[]> {
    const materials = await this.materialRepository.getByCourse(courseId);
    return materials.map(m => new MaterialDto(m.id, m.courseId,m.authorId, m.title, m.description, m.filePath,m.createdAt));
  }

  async createMaterial(m: Material): Promise<MaterialDto> {
    const newM = await this.materialRepository.create(m);
    return new MaterialDto(newM.id, newM.courseId,newM.authorId, newM.title, newM.description, newM.filePath, newM.createdAt);
  }

  async deleteMaterial(id: number): Promise<boolean> {
    return this.materialRepository.delete(id);
  }
}