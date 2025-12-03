export interface CaminhaoRequest {
  placa: string;
  motorista_id: number | null;
  capacidade: number | null;
  tiposResiduos: string[];
}
