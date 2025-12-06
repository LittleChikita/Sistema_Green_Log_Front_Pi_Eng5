import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class GrafoService {
  private baseUrl = 'http://localhost:8080/grafo';

  constructor(private http: HttpClient) {}

  getGrafo() {
    return this.http.get<{ nodes: any[], edges: any[] }>(this.baseUrl);
  }

}
