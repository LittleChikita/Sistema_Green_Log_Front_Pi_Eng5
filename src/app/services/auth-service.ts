import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {LoginResponse} from '../models/LoginResponse';
import {Router} from '@angular/router';
import {LoginRequest} from '../models/LoginRequest';
import {environment} from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private usuarioLogadoSubject = new BehaviorSubject<boolean>(false);
  usuarioLogado$ = this.usuarioLogadoSubject.asObservable();  // Observer

  constructor(private http: HttpClient, private router: Router) {
    this.carregarSessao();
  }

  private carregarSessao() {
    const estado = localStorage.getItem('autenticado');
    if (estado === 'true') {
      this.usuarioLogadoSubject.next(true);
    }
  }

  login(req: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, req)
      .pipe(
        tap((res) => {
          if (res.autenticado) {
            localStorage.setItem('autenticado', 'true');
            this.usuarioLogadoSubject.next(true);
          }
        })
      );
  }

  logout() {
    localStorage.removeItem('autenticado');
    this.usuarioLogadoSubject.next(false);
    this.router.navigate(['/login']);
  }

  isLogged(): boolean {
    return this.usuarioLogadoSubject.value;
  }

}
