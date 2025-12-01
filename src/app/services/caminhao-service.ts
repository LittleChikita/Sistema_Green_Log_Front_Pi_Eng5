import {Injectable, signal} from '@angular/core';
import {environment} from '../environment/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CaminhaoRequest} from '../models/CaminhaoRequest';
import {CaminhaoResponse} from '../models/CaminhaoResponse';

@Injectable({
  providedIn: 'root',
})
export class CaminhaoService {
  private readonly baseUrl = `${environment.apiUrl}/cadastrar_caminhao`;

  loading = signal(false);

  constructor(private http:HttpClient) {
  }

  criar(req: CaminhaoRequest): Observable<CaminhaoResponse>{
    return this.http.post<CaminhaoResponse>(this.baseUrl, req);
  }
}
