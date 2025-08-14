export class MaterialDto {
  constructor(
    public id: number = 0,
    public courseId: number = 0,
    public authorId: number = 0,
    public title: string = "",
    public description: string="",
    public filePath?: string,
    public createdAt?: Date
  ) {}
}