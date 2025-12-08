import {Injectable, signal} from '@angular/core';
import {environment} from '../environment/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {MotoristaRequest} from '../models/MotoristaRequest';
import {MotoristaResponse} from '../models/MotoristaResponse';

@Injectable({
  providedIn: 'root',
})
export class MotoristaService {

  private readonly baseUrl = `${environment.apiUrl}/motoristas`;

  loading = signal(false);

  constructor(private http:HttpClient) {
  }

  criar(req: MotoristaRequest): Observable<MotoristaResponse>{
    return this.http.post<MotoristaResponse>(this.baseUrl, req);
  }

  atualizar(id: number, req: MotoristaRequest): Observable<MotoristaResponse> {
    return this.http.put<MotoristaResponse>(`${this.baseUrl}/${id}`, req);
  }

  getMotoristas(): Observable<MotoristaResponse[]> {
    return this.http.get<MotoristaResponse[]>(`${environment.apiUrl}/motoristas`);
  }

  inativar(id: number): Observable<MotoristaResponse> {
    return this.http.patch<MotoristaResponse>(`${this.baseUrl}/status/${id}`, {});
  }

  deletar(id: number): Observable<MotoristaResponse> {
    return this.http.delete<MotoristaResponse>(`${this.baseUrl}/${id}`, {});
  }
}
