
export class CreateProductDto {
  constructor(
    public name: string,
    public description?: string,
    public sku?: string,
    public price: number = 0,
    public quantity: number = 0,
    public categoryId?: number
  ) {}
}

export class UpdateProductDto {
  constructor(
    public name?: string,
    public description?: string,
    public sku?: string,
    public price?: number,
    public quantity?: number,
    public categoryId?: number
  ) {}
}

export class ProductSearchDto {
  constructor(
    public searchTerm?: string,
    public categoryId?: number,
    public page: number = 1,
    public pageSize: number = 10,
    public sortBy: string = "name",
    public sortDirection: string = "asc"
  ) {}
}

export class ProductSearchResultDto {
  constructor(
    public products: ProductDto[],
    public searchCriteria: ProductSearchDto,
    public totalCount: number,
    public page: number,
    public pageSize: number
  ) {}
}

export class ProductDto {
  constructor(
    public id: number,
    public name: string,
    public description?: string,
    public sku?: string,
    public price: number = 0,
    public quantity: number = 0,
    public categoryId?: number,
    public createdAt?: Date
  ) {}
}
