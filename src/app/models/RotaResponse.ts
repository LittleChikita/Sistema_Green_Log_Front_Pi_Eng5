import {CaminhaoResponse} from './CaminhaoResponse';

export interface RotaResponse{
  id: number;
  caminhao: CaminhaoResponse
  nome: string
  bairros: number[]
  arestas: number[]
  tiposResiduos: string
}
