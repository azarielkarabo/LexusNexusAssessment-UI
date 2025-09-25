export class CategoryDto {
  constructor(
    public id: number,
    public name: string,
    public description?: string,
    public parentCategoryId?: number,
    public childCategories: CategoryDto[] = []
  ) {}
}

export class CreateCategoryDto {
  constructor(
    public name: string,
    public description?: string,
    public parentCategoryId?: number|null
  ) {}
}

export class UpdateCategoryDto {
  constructor(
    public name?: string,
    public description?: string,
    public parentCategoryId?: number
  ) {}
}
