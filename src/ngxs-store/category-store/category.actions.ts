
//
// GET /api/categories

import { CategoryDto, CreateCategoryDto } from "src/models/category-models";

//
export class LoadAllCategoriesAction {
  static readonly type = "[Categories] Load All";
}

export class LoadAllCategoriesSuccessAction {
  static readonly type = "[Categories] Load All Success";
  constructor(public payload: { response: CategoryDto[] }) {}
}

export class LoadAllCategoriesFailAction {
  static readonly type = "[Categories] Load All Fail";
}

//
// GET /api/categories/tree
//
export class LoadCategoriesTreeAction {
  static readonly type = "[Categories] Load Tree";
}

export class LoadCategoriesTreeSuccessAction {
  static readonly type = "[Categories] Load Tree Success";
  constructor(public payload: { response: CategoryDto[] }) {}
}

export class LoadCategoriesTreeFailAction {
  static readonly type = "[Categories] Load Tree Fail";
}

//
// POST /api/categories
//
export class CreateCategoryAction {
  static readonly type = "[Categories] Create";
  constructor(public payload: { dto: CreateCategoryDto }) {}
}

export class CreateCategorySuccessAction {
  static readonly type = "[Categories] Create Success";
  constructor(public payload: { response: CategoryDto }) {}
}

export class CreateCategoryFailAction {
  static readonly type = "[Categories] Create Fail";
}
