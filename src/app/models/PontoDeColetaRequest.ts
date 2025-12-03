export interface PontoDeColetaRequest{
  bairroId: number | null;
  nome: string;
  responsavel: string;
  telefoneResponsavel: string;
  emailResponsavel: string;
  endereco: string;
  tiposResiduos: string[];
}
