import {Injectable, signal} from '@angular/core';
import {environment} from '../environment/environment';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {PontoDeColetaResponse} from '../models/PontoDeColetaResponse';
import {PontoDeColetaRequest} from '../models/PontoDeColetaRequest';
import {TipoResiduo} from '../models/TipoResiduo';
import {MotoristaResponse} from '../models/MotoristaResponse';
import {BairroRequest} from '../models/BairroRequest';
import {BairroResponse} from '../models/BairroResponse';
import {RotaResponse} from '../models/RotaResponse';
import {RotaRequest} from '../models/RotaRequest';

@Injectable({
  providedIn: 'root',
})
export class PontoDeColetaService {

  private readonly baseUrl = `${environment.apiUrl}/pontos-coleta`;

  loading = signal(false);
  private _cache$ = new BehaviorSubject<PontoDeColetaResponse[] | null>(null);
  cache$ = this._cache$.asObservable();

  constructor(private http:HttpClient) {
  }

  criar(req: PontoDeColetaRequest): Observable<PontoDeColetaResponse>{
    return this.http.post<PontoDeColetaResponse>(this.baseUrl, req);
  }

  getTiposResiduo(): Observable<TipoResiduo[]> {
    return this.http.get<TipoResiduo[]>(`${this.baseUrl}/tipos_residuo`);
  }

  getBairros(): Observable<BairroResponse[]> {
    return this.http.get<BairroResponse[]>(`${environment.apiUrl}/bairros`);
  }

  getPontos(): Observable<PontoDeColetaResponse[]> {
    return this.http.get<PontoDeColetaResponse[]>(`${environment.apiUrl}/pontos-coleta`);
  }

  deletar(id: number): Observable<PontoDeColetaResponse> {
    return this.http.delete<PontoDeColetaResponse>(`${this.baseUrl}/${id}`, {});
  }

  inativar(id: number): Observable<PontoDeColetaResponse> {
    return this.http.patch<PontoDeColetaResponse>(`${this.baseUrl}/status/${id}`, {});
  }

  atualizar(id: number, req: PontoDeColetaRequest): Observable<PontoDeColetaResponse> {
    return this.http.put<PontoDeColetaResponse>(`${this.baseUrl}/${id}`, req);
  }

  setCache(list: PontoDeColetaResponse[]) { this._cache$.next(list); }
  clearCache() { this._cache$.next(null); }

}
