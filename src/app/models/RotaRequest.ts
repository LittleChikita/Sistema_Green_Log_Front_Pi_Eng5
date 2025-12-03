export interface RotaRequest{
  caminhaoId:number | null
  nome: string
  bairros: number[]
  arestas: number[]
  tipoResiduo: string[]
}
