import {Injectable, signal} from '@angular/core';
import {environment} from '../environment/environment';
import {BehaviorSubject, map, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {CaminhaoResponse} from '../models/CaminhaoResponse';
import {ItinerarioResponse} from '../models/ItinerarioResponse';
import {ItinerarioRequest} from '../models/ItinerarioRequest';
import {RotaRequest} from '../models/RotaRequest';
import {RotaResponse} from '../models/RotaResponse';
import {BairroResponse} from '../models/BairroResponse';

@Injectable({
  providedIn: 'root',
})
export class ItinerarioService {

  private readonly baseUrl = `${environment.apiUrl}/itinerarios`;

  loading = signal(false);
  private _cache$ = new BehaviorSubject<ItinerarioResponse[] | null>(null);
  cache$ = this._cache$.asObservable();

  constructor(private http:HttpClient) {
  }

  criar(req: ItinerarioRequest): Observable<ItinerarioResponse>{
    return this.http.post<ItinerarioResponse>(this.baseUrl, req);
  }

  getCaminhao(): Observable<CaminhaoResponse[]> {
    return this.http.get<CaminhaoResponse[]>(`${environment.apiUrl}/caminhoes`);
  }

  getBairros(): Observable<BairroResponse[]> {
    return this.http.get<BairroResponse[]>(`${environment.apiUrl}/bairros`);
  }

  getRotas(): Observable<RotaResponse[]> {
    return this.http.get<RotaResponse[]>(`${environment.apiUrl}/rotas`);
  }

  setCache(list: ItinerarioResponse[]) { this._cache$.next(list); }
  clearCache() { this._cache$.next(null); }
}
