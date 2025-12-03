import {Injectable, signal} from '@angular/core';
import {environment} from '../environment/environment';
import {HttpClient} from '@angular/common/http';
import {MotoristaRequest} from '../models/MotoristaRequest';
import {Observable} from 'rxjs';
import {MotoristaResponse} from '../models/MotoristaResponse';
import {RuaRequest} from '../models/RuaRequest';
import {RuaResponse} from '../models/RuaResponse';
import {BairroResponse} from '../models/BairroResponse';

@Injectable({
  providedIn: 'root',
})
export class RuaService {

  private readonly baseUrl = `${environment.apiUrl}/ruas_conexao`;

  loading = signal(false);

  constructor(private http:HttpClient) {
  }

  criar(req: RuaRequest): Observable<RuaResponse>{
    return this.http.post<RuaResponse>(this.baseUrl, req);
  }

  getBairros(): Observable<BairroResponse[]> {
    return this.http.get<BairroResponse[]>(`${environment.apiUrl}/bairros`);
  }


}
