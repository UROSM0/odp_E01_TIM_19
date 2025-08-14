export class EnrollmentDto {
  constructor(
    public userId: number = 0,
    public courseId: number = 0,
    public role: "student" | "professor" = "student"
  ) {}
}