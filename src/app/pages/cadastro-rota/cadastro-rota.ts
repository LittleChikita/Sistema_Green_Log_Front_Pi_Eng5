import {Component, OnInit} from '@angular/core';
import {MessageService} from 'primeng/api';
import {RotaService} from '../../services/rota-service';
import {TipoResiduo} from '../../models/TipoResiduo';
import {BairroResponse} from '../../models/BairroResponse';
import {RotaRequest} from '../../models/RotaRequest';
import {Toast} from 'primeng/toast';
import {ButtonDirective} from 'primeng/button';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PontoDeColetaResponse} from '../../models/PontoDeColetaResponse';
import {Checkbox} from 'primeng/checkbox';
import {NgForOf} from '@angular/common';
import {TableModule} from 'primeng/table';
import {AutoComplete} from 'primeng/autocomplete';
import {ClassNames} from 'primeng/classnames';
import {Select} from 'primeng/select';

@Component({
  selector: 'app-cadastro-rota',
  imports: [
    Toast,
    ButtonDirective,
    ReactiveFormsModule,
    FormsModule,
    TableModule,
    Select
  ],
  providers: [MessageService],
  templateUrl: './cadastro-rota.html',
  styleUrl: './cadastro-rota.css',
})
export class CadastroRota implements OnInit{

  carregando = this.service.loading;

  rota : RotaRequest = {
    caminhaoId: null,
    nome: '',
    bairros: [] as number[],
    arestas: [] as number[],
    tipoResiduo: [] as string[],
  };

  tipos: TipoResiduo[] = [];

  pontosColeta: PontoDeColetaResponse[] = [];
  pontosFiltrados: PontoDeColetaResponse[] = [];
  pontosSelecionados: PontoDeColetaResponse[] = [];

  bairros: BairroResponse[] = [];
  bairrosFiltrados: BairroResponse[] = [];
  bairrosSelecionados: BairroResponse[] = [];

  residuoSelecionado!: TipoResiduo;

  residuos: TipoResiduo[] = [
    { nome: 'PLASTICO' },
    { nome: 'VIDRO' },
    { nome: 'METAL' },
    { nome: 'PAPEL' },
    { nome: 'ORGANICO' }
  ];

  constructor(
    private service: RotaService,
    private msg: MessageService
  ) {
  }

  ngOnInit(){
    this.service.getBairros().subscribe({
      next: (bar) => {
        console.log(bar);
        this.bairros = bar;
      }
    })
    this.service.getPontoColeta().subscribe({
      next: (pct) => {
        console.log(pct);
        this.pontosColeta = pct;
      }
    })
  }

  filtrarBairros(event: any) {
    const query = event.query.toLowerCase();
    this.bairrosFiltrados = this.bairros.filter(m =>
      m.nome.toLowerCase().includes(query)
    );
  }

  filtrarPontos() {
    if (!this.residuoSelecionado) {
      this.pontosFiltrados = [...this.pontosColeta];
      this.pontosSelecionados = [];
      return;
    }

    const tipo = this.residuoSelecionado.nome;

    this.pontosFiltrados = this.pontosColeta.filter(p =>
      Array.isArray(p.tiposResiduos) && p.tiposResiduos.includes(tipo)
    );

    this.pontosSelecionados = [];
  }

  cadastrar(){
    this.service.criar(this.rota).subscribe();
    console.log(this.rota)
  }

  gerarRota() {
    if (!this.pontosSelecionados.length) {
      this.msg.add({
        severity: 'warn',
        summary: 'Aviso',
        detail: 'Selecione ao menos um ponto.'
      });
      return;
    }

    console.log(this.pontosSelecionados.map(p => p.bairro.id));

    const bairrosSelecionados = this.pontosSelecionados.map(p => p.bairro.id);

    this.service.calcularRota(bairrosSelecionados).subscribe({
      next: (res) => {
        console.log('Resposta da rota:', res);

      },
      error: (err) => console.error(err)
    });
  }

}
