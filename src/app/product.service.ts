import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from "./models/product.models";
import { environment } from '../environments/environment';
import { Review } from './models/review.models';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiServerUrl = environment.apiBaseUrl

  constructor(private http: HttpClient) { }

  public searchProducts(keyword: string): Observable<Product[]> {
    const params = new HttpParams().set('keyword', keyword);
    return this.http.get<Product[]>(`${this.apiServerUrl}/products/search`, { params });
  }

  public getProductReviews(id: number): Observable<Review[]> {
    const params = new HttpParams().set('id', id);
    console.log(params)
    return this.http.get<Review[]>(`${this.apiServerUrl}/products/review`, { params });
  }
}
