import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, retry, catchError, throwError } from "rxjs";
import {
  ProductDto,
  CreateProductDto,
  UpdateProductDto,
  ProductSearchResultDto,
} from "src/models/product-models";

@Injectable({
  providedIn: "root",
})
export class ProductsApiService {
  private apiURL = "https://localhost:7077/api/products";

  constructor(private http: HttpClient) {}

  // Http Options
  private httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    }),
  };

  //
  // GET /api/products
  //
  getProducts(params: {
    searchTerm?: string;
    categoryId?: number;
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortDirection?: string;
  }): Observable<ProductSearchResultDto> {
    return this.http
      .get<ProductSearchResultDto>(this.apiURL, {
        params: {
          searchTerm: params.searchTerm ?? "",
          categoryId: params.categoryId?.toString() ?? "",
          page: (params.page ?? 1).toString(),
          pageSize: (params.pageSize ?? 10).toString(),
          sortBy: params.sortBy ?? "name",
          sortDirection: params.sortDirection ?? "asc",
        },
      })
      .pipe(retry(1), catchError(this.handleError));
  }

  //
  // GET /api/products/{id}
  //
  getProductById(id: number): Observable<ProductDto> {
    return this.http
      .get<ProductDto>(`${this.apiURL}/${id}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  //
  // POST /api/products
  //
  createProduct(dto: CreateProductDto): Observable<ProductDto> {
    return this.http
      .post<ProductDto>(this.apiURL, dto, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  //
  // PUT /api/products/{id}
  //
  updateProduct(id: number, dto: UpdateProductDto): Observable<ProductDto> {
    return this.http
      .put<ProductDto>(`${this.apiURL}/${id}`, dto, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  //
  // DELETE /api/products/{id}
  //
  deleteProduct(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiURL}/${id}`, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  //
  // Error handling
  //
  private handleError(error: any) {
    let errorMessage = "";
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(() => errorMessage);
  }
}
