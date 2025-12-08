import {RotaResponse} from './RotaResponse';
import {CaminhaoResponse} from './CaminhaoResponse';

export interface ItinerarioResponse{
  id:number
  rota: RotaResponse
  dia: string
  ativo: boolean
}
