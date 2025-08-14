export class Material {
  constructor(
    public id: number = 0,
    public courseId: number = 0,
    public authorId: number = 0,
    public title: string = '',
    public description: string | null = null,
    public filePath: string = '',
    public fileMime:string='',
    public createdAt: Date = new Date()
  ) {}
}