import {Injectable, signal} from '@angular/core';
import {environment} from '../environment/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CaminhaoRequest} from '../models/CaminhaoRequest';
import {CaminhaoResponse} from '../models/CaminhaoResponse';
import {TipoResiduo} from '../models/TipoResiduo';
import {MotoristaResponse} from '../models/MotoristaResponse';

@Injectable({
  providedIn: 'root',
})
export class CaminhaoService {
  private readonly baseUrl = `${environment.apiUrl}/cadastrarcaminhao`;

  loading = signal(false);

  constructor(private http:HttpClient) {
  }

  getTiposResiduo(): Observable<TipoResiduo[]> {
    return this.http.get<TipoResiduo[]>(`${environment.apiUrl}/cadastrarPontoColeta/tipos_residuo`);
  }

  getMotoristas(): Observable<MotoristaResponse[]> {
    return this.http.get<MotoristaResponse[]>(`${environment.apiUrl}/motoristas`);
  }

  getCaminhao(): Observable<CaminhaoResponse[]> {
    return this.http.get<CaminhaoResponse[]>(`${environment.apiUrl}/caminhoes`);
  }

  criar(req: CaminhaoRequest): Observable<CaminhaoResponse>{
    return this.http.post<CaminhaoResponse>(this.baseUrl, req);
  }
}
