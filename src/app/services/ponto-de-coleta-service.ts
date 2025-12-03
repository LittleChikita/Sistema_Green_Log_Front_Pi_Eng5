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

@Injectable({
  providedIn: 'root',
})
export class PontoDeColetaService {

  private readonly baseUrl = `${environment.apiUrl}/cadastrarPontoColeta`;

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

  setCache(list: PontoDeColetaResponse[]) { this._cache$.next(list); }
  clearCache() { this._cache$.next(null); }

}
