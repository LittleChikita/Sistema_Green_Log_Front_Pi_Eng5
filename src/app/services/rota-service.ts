import {Injectable, signal} from '@angular/core';
import {environment} from '../environment/environment';
import {BehaviorSubject, map, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {RotaResponse} from '../models/RotaResponse';
import {RotaRequest} from '../models/RotaRequest';
import {TipoResiduo} from '../models/TipoResiduo';
import {BairroResponse} from '../models/BairroResponse';
import {PontoDeColetaResponse} from '../models/PontoDeColetaResponse';
import {CaminhaoResponse} from '../models/CaminhaoResponse';

@Injectable({
  providedIn: 'root',
})
export class RotaService {

  private readonly baseUrl = `${environment.apiUrl}/rotas`;

  loading = signal(false);
  private _cache$ = new BehaviorSubject<RotaResponse[] | null>(null);
  cache$ = this._cache$.asObservable();

  constructor(private http:HttpClient) {
  }

  criar(req: RotaRequest): Observable<RotaResponse>{
    return this.http.post<RotaResponse>(this.baseUrl, req);
  }

  getTiposResiduo(): Observable<TipoResiduo[]> {
    return this.http.get<string[]>(`${this.baseUrl}/tipos_residuo`).pipe(
      map(lista => lista.map(r => ({ nome: r })))
    );
  }

  getBairros(): Observable<BairroResponse[]> {
    return this.http.get<BairroResponse[]>(`${environment.apiUrl}/bairros`);
  }

  getPontoColeta(): Observable<PontoDeColetaResponse[]> {
    return this.http.get<PontoDeColetaResponse[]>(`${environment.apiUrl}/pontos_coleta`);
  }

  getCaminhao(): Observable<CaminhaoResponse[]> {
    return this.http.get<CaminhaoResponse[]>(`${environment.apiUrl}/caminhoes`);
  }

  calcularRota(bairrosSelecionados: number[]): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/auth/dijkstra/caminho_com_paradas`, bairrosSelecionados);
  }

  setCache(list: RotaResponse[]) { this._cache$.next(list); }
  clearCache() { this._cache$.next(null); }
}
