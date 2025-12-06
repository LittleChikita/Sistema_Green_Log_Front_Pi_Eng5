import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { RotaService } from '../../services/rota-service';

import { TipoResiduo } from '../../models/TipoResiduo';
import { BairroResponse } from '../../models/BairroResponse';
import { PontoDeColetaResponse } from '../../models/PontoDeColetaResponse';
import { RotaRequest } from '../../models/RotaRequest';

import { Toast } from 'primeng/toast';
import { ButtonDirective } from 'primeng/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { Select } from 'primeng/select';
import {CaminhaoResponse} from '../../models/CaminhaoResponse';
import {InputText} from 'primeng/inputtext';
import {AutoComplete} from 'primeng/autocomplete';

@Component({
  selector: 'app-cadastro-rota',
  imports: [
    Toast,
    ButtonDirective,
    ReactiveFormsModule,
    FormsModule,
    TableModule,
    Select,
    InputText,
    AutoComplete
  ],
  providers: [MessageService],
  templateUrl: './cadastro-rota.html',
  styleUrl: './cadastro-rota.css',
})
export class CadastroRota implements OnInit {

  carregando = this.service.loading;

  // Modelo correto da rota
  rota: RotaRequest = {
    caminhaoId: null,
    nome: '',
    bairros: [],
    arestas: [],
    tipoResiduo: ''
  };

  residuoSelecionado!: TipoResiduo;
  pontosSelecionados: PontoDeColetaResponse[] = [];

  pontosColeta: PontoDeColetaResponse[] = [];
  pontosFiltrados: PontoDeColetaResponse[] = [];

  bairros: BairroResponse[] = [];

  caminhoes: CaminhaoResponse[] = [];
  caminhoesFiltrados: CaminhaoResponse[] = [];
  caminhaoSelecionado: CaminhaoResponse | null = null;

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
  ) {}

  ngOnInit() {


    this.service.getBairros().subscribe({
      next: (bar) => {
        this.bairros = bar;
      }
    });

    this.service.getCaminhao().subscribe({
      next: (cam) => {
        this.caminhoes = cam;
        console.log("Caminhões recebidos:", cam);
      },
    });



    this.service.getPontoColeta().subscribe({
      next: (pct) => {
        this.pontosColeta = pct;
        this.pontosFiltrados = pct;
      }
    });
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

  filtrarCaminhoes() {
    if (!this.residuoSelecionado) {
      this.caminhoesFiltrados = [...this.caminhoes];
      this.caminhaoSelecionado = null;
      return;
    }

    const tipo = this.residuoSelecionado.nome;

    this.caminhoesFiltrados = this.caminhoes.filter(c =>
      Array.isArray(c.tiposResiduos) && c.tiposResiduos.includes(tipo)
    );

    if (
      this.caminhaoSelecionado &&
      !this.caminhaoSelecionado.tiposResiduos.includes(tipo)
    ) {
      this.caminhaoSelecionado = null;
    }
  }

  aoMudarResiduo() {
    this.filtrarPontos();
    this.filtrarCaminhoes();
  }


  cadastrar() {

    this.rota.caminhaoId = this.caminhaoSelecionado!.id

    if (!this.pontosSelecionados.length) {
      this.msg.add({
        severity: 'warn',
        summary: 'Aviso',
        detail: 'Selecione ao menos um ponto de coleta.'
      });
      return;
    }

    if (!this.rota.caminhaoId || !this.rota.nome || !this.residuoSelecionado) {
      console.log(this.rota);
      this.msg.add({
        severity: 'warn',
        summary: 'Aviso',
        detail: 'Preencha caminhão, nome da rota e tipo de resíduo.'
      });
      return;
    }

    this.rota.tipoResiduo = this.residuoSelecionado.nome;


    const bairrosSelecionados = this.pontosSelecionados.map(p => p.bairro.id);

    this.service.calcularRota(bairrosSelecionados).subscribe({
      next: (res) => {

        console.log("📌 Resultado do cálculo:", res);

        this.rota.bairros = res.caminho.map((b: any) => b.id);
        this.rota.arestas = res.arestas.map((a: any) => a.id);

        this.service.criar(this.rota).subscribe({
          next: () => {
            this.msg.add({
              severity: "success",
              summary: "Sucesso",
              detail: "Rota cadastrada com sucesso!"
            });
          },
          error: (err) => {
            console.error(err);
            this.msg.add({
              severity: "error",
              summary: "Erro",
              detail: "Falha ao cadastrar rota."
            });
          }
        });
      },

      error: (err) => {
        console.error(err);
        this.msg.add({
          severity: "error",
          summary: "Erro",
          detail: "Falha ao calcular rota."
        });
      }
    });

    console.log("📤 ROTA ENVIADA:", this.rota);
  }

}
