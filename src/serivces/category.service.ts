import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, retry, catchError, throwError } from "rxjs";
import { CategoryDto, CreateCategoryDto } from "src/models/category-models";

@Injectable({
  providedIn: "root",
})
export class CategoriesApiService {
  private apiURL = "https://localhost:7077/api/categories";

  constructor(private http: HttpClient) {}

  // Http Options
  private httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    }),
  };

  //
  // GET /api/categories
  //
  getAllCategories(): Observable<CategoryDto[]> {
    return this.http
      .get<CategoryDto[]>(this.apiURL)
      .pipe(retry(1), catchError(this.handleError));
  }

  //
  // GET /api/categories/tree
  //
  getCategoryTree(): Observable<CategoryDto[]> {
    return this.http
      .get<CategoryDto[]>(`${this.apiURL}/tree`)
      .pipe(retry(1), catchError(this.handleError));
  }

  //
  // POST /api/categories
  //
  createCategory(dto: CreateCategoryDto): Observable<CategoryDto> {
    return this.http
      .post<CategoryDto>(this.apiURL, dto, this.httpOptions)
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
