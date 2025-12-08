import {Injectable, signal} from '@angular/core';
import {environment} from '../environment/environment';
import {HttpClient} from '@angular/common/http';
import {BairroRequest} from '../models/BairroRequest';
import {Observable} from 'rxjs';
import {BairroResponse} from '../models/BairroResponse';

@Injectable({
  providedIn: 'root',
})
export class BairroService {

  private readonly baseUrl = `${environment.apiUrl}/bairros`;

  loading = signal(false);

  constructor(private http:HttpClient) {
  }

  criar(req: BairroRequest): Observable<BairroResponse>{
    return this.http.post<BairroResponse>(this.baseUrl, req);
  }

  atualizar(id: number, req: BairroRequest): Observable<BairroResponse> {
    return this.http.put<BairroResponse>(`${this.baseUrl}/${id}`, req);
  }

  getBairros(): Observable<BairroResponse[]> {
    return this.http.get<BairroResponse[]>(`${this.baseUrl}`);
  }


  deletar(id: number): Observable<BairroResponse> {
    return this.http.delete<BairroResponse>(`${this.baseUrl}/${id}`, {});
  }

}
