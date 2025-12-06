import {RotaResponse} from './RotaResponse';
import {CaminhaoResponse} from './CaminhaoResponse';

export interface ItinerarioResponse{
  rota: RotaResponse
  caminhao: CaminhaoResponse
}
