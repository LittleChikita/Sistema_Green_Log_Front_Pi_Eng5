import {Injectable, signal} from '@angular/core';
import {UsuarioCadastroRequest} from '../models/UsuarioCadastroRequest';
import {BehaviorSubject, Observable} from 'rxjs';
import {UsuarioResponse} from '../models/UsuarioResponse';
import {HttpClient} from '@angular/common/http';
import {environment} from "../environment/environment";

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {

  private readonly baseUrl = `${environment.apiUrl}/cadastrar`;

  loading = signal(false);
  private _cache$ = new BehaviorSubject<UsuarioResponse[] | null>(null);
  cache$ = this._cache$.asObservable();

  constructor(private http:HttpClient) {
  }

  criar(req: UsuarioCadastroRequest): Observable<UsuarioResponse>{
    return this.http.post<UsuarioResponse>(this.baseUrl, req);
  }

  setCache(list: UsuarioResponse[]) { this._cache$.next(list); }
  clearCache() { this._cache$.next(null); }
}
