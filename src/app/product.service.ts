import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from "./models/product.models";
import { environment } from '../environments/environment';

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
}
