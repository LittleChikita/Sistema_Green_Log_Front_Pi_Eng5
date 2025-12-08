import {Injectable, signal} from '@angular/core';
import {UsuarioRequest} from '../models/UsuarioRequest';
import {BehaviorSubject, Observable} from 'rxjs';
import {UsuarioResponse} from '../models/UsuarioResponse';
import {HttpClient} from '@angular/common/http';
import {environment} from "../environment/environment";
import {BairroResponse} from '../models/BairroResponse';
import {BairroRequest} from '../models/BairroRequest';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {

  private readonly baseUrl = `${environment.apiUrl}/usuarios`;

  loading = signal(false);
  private _cache$ = new BehaviorSubject<UsuarioResponse[] | null>(null);
  cache$ = this._cache$.asObservable();

  constructor(private http:HttpClient) {
  }

  criar(req: UsuarioRequest): Observable<UsuarioResponse>{
    return this.http.post<UsuarioResponse>(this.baseUrl, req);
  }

  getUsuarios(): Observable<UsuarioResponse[]> {
    return this.http.get<UsuarioResponse[]>(`${this.baseUrl}`);
  }

  atualizar(id: number, req: UsuarioRequest): Observable<UsuarioResponse> {
    return this.http.put<UsuarioResponse>(`${this.baseUrl}/${id}`, req);
  }

  deletar(id: number): Observable<UsuarioResponse> {
    return this.http.delete<UsuarioResponse>(`${this.baseUrl}/${id}`, {});
  }

  setCache(list: UsuarioResponse[]) { this._cache$.next(list); }
  clearCache() { this._cache$.next(null); }
}
