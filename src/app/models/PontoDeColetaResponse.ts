import {BairroResponse} from './BairroResponse';

export interface PontoDeColetaResponse {
  id: number;
  nomePontoDeColeta: string;
  nomeResponsavel: string;
  telefoneResponsavel: string;
  emailResponsavel: string;
  endereco: string;
  tiposResiduos: string[];
  ativo: boolean,
  bairro: BairroResponse;
}
