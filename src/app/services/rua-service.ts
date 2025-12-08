import {Injectable, signal} from '@angular/core';
import {environment} from '../environment/environment';
import {HttpClient} from '@angular/common/http';
import {MotoristaRequest} from '../models/MotoristaRequest';
import {Observable} from 'rxjs';
import {MotoristaResponse} from '../models/MotoristaResponse';
import {RuaRequest} from '../models/RuaRequest';
import {RuaResponse} from '../models/RuaResponse';
import {BairroResponse} from '../models/BairroResponse';
import {BairroRequest} from '../models/BairroRequest';

@Injectable({
  providedIn: 'root',
})
export class RuaService {

  private readonly baseUrl = `${environment.apiUrl}/ruas-conexao`;

  loading = signal(false);

  constructor(private http:HttpClient) {
  }

  criar(req: RuaRequest): Observable<RuaResponse>{
    return this.http.post<RuaResponse>(this.baseUrl, req);
  }

  getBairros(): Observable<BairroResponse[]> {
    return this.http.get<BairroResponse[]>(`${environment.apiUrl}/bairros`);
  }

  atualizar(id: number, req: RuaRequest): Observable<RuaResponse> {
    return this.http.put<RuaResponse>(`${this.baseUrl}/${id}`, req);
  }

  deletar(id: number): Observable<RuaResponse> {
    return this.http.delete<RuaResponse>(`${this.baseUrl}/${id}`, {});
  }

  getRuas(): Observable<RuaResponse[]> {
    return this.http.get<RuaResponse[]>(`${environment.apiUrl}/ruas-conexao`);
  }


}
