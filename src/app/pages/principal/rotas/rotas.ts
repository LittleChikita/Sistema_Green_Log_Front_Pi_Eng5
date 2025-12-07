import {Component, OnInit} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {RotaService} from '../../../services/rota-service';
import {TipoResiduo} from '../../../models/TipoResiduo';
import {PontoDeColetaResponse} from '../../../models/PontoDeColetaResponse';
import {BairroResponse} from '../../../models/BairroResponse';
import {CaminhaoResponse} from '../../../models/CaminhaoResponse';
import {AutoComplete} from 'primeng/autocomplete';
import {Button} from 'primeng/button';
import {Checkbox} from 'primeng/checkbox';
import {ConfirmDialog} from 'primeng/confirmdialog';
import {Dialog} from 'primeng/dialog';
import {FormsModule} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {NgForOf, NgIf} from '@angular/common';
import {TableModule} from 'primeng/table';
import {Toast} from 'primeng/toast';
import {Toolbar} from 'primeng/toolbar';
import {RotaResponse} from '../../../models/RotaResponse';
import {CaminhaoRequest} from '../../../models/CaminhaoRequest';
import {RotaRequest} from '../../../models/RotaRequest';
import {RuaResponse} from '../../../models/RuaResponse';

@Component({
  selector: 'app-rotas',
  imports: [
    AutoComplete,
    Button,
    ConfirmDialog,
    Dialog,
    FormsModule,
    InputText,
    NgIf,
    TableModule,
    Toast,
    Toolbar,
    NgForOf
  ],
  providers: [
    MessageService,
    ConfirmationService
  ],
  templateUrl: './rotas.html',
  styleUrl: './rotas.scss',
})
export class Rotas implements OnInit{

  rota: RotaRequest = {
    caminhaoId: null,
    nome: '',
    bairros: [],
    arestas: [],
    tipoResiduo: ''
  }

  rotas: RotaResponse[] = [];
  rotaSelecionada!: RotaResponse;

  tipos: TipoResiduo[] = [];
  residuoSelecionado!: TipoResiduo;
  residuoFiltrados: TipoResiduo[] =[];
  pontosSelecionados: PontoDeColetaResponse[] = [];

  pontosColeta: PontoDeColetaResponse[] = [];
  pontosFiltrados: PontoDeColetaResponse[] = [];

  bairros: BairroResponse[] = [];
  arestas: RuaResponse[] = [];

  caminhoes: CaminhaoResponse[] = [];
  caminhoesFiltrados: CaminhaoResponse[] = [];
  caminhaoSelecionado: CaminhaoResponse | null = null;

  rotaDialog: boolean = false;
  enviado: boolean = false;

  constructor(
    private service: RotaService,
    private msg: MessageService,
    private confirmationService: ConfirmationService
  ) {}


  ngOnInit() {
    this.service.getBairros().subscribe({
      next: (bar) => {
        this.bairros = bar;
        console.log(this.bairros)
      }
    });

    this.service.getRuas().subscribe({
      next: (rua) => {
        this.arestas = rua;
        console.log(this.arestas)
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

    this.service.getTiposResiduo().subscribe(lista =>{
      this.tipos = lista;
    })

    this.service.getRotas().subscribe({
      next: (rot) => {
        this.rotas = rot;
        console.log("Rotas recebidos:", rot);
      },
    });

  }


  openNovo(){
    this.rotaDialog = true;
  }

  fecharDialog() {
    this.rotaDialog = false;
    this.enviado = false;
  }

  cadastrar(){
    this.enviado = true;

    this.rota.caminhaoId = this.caminhaoSelecionado!.id;

    if (!this.pontosSelecionados.length) {
      this.msg.add({
        severity: 'warn',
        summary: 'Aviso',
        detail: 'Selecione ao menos um ponto de coleta.'
      });
      return;
    }

    if (!this.rota.caminhaoId || !this.rota.nome || !this.rota.tipoResiduo) {
      console.log(this.rota)
      this.msg.add({
        severity: "error",
        summary: "Erro",
        detail: "Preencha todos os campos obrigatórios."
      });
      return;
    }

    this.rota.tipoResiduo = this.residuoSelecionado.nome;

    const bairrosSelecionados = this.pontosSelecionados.map(p => p.bairro.id);

    this.service.calcularRota(bairrosSelecionados).subscribe({
      next: (res) => {

        console.log("📌 Resultado do cálculo:", res);

        this.rota.bairros = res.caminhos.map((b: any) => b.id);
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

  deletarCaminhao(r: RotaResponse){
    this.confirmationService.confirm({
      message: 'Você tem certeza que deseja deletar o caminhão? ' + r.nome + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Não',
        severity: 'secondary',
        variant: 'text'
      },
      acceptButtonProps: {
        severity: 'danger',
        label: 'Sim'
      },
      accept: () => {
        this.service.inativar(r.id).subscribe({
          next: () => {
            this.rotas = this.rotas.filter(x => x.id !== r.id);

            this.msg.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Caminhão deletado!',
              life: 3000
            });
          },
          error: () => {
            this.msg.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Falha ao deletar o caminhão.',
              life: 3000
            });
          }
        });
      }
    })
  }

  inativarRota(rota: RotaRequest){

  }

  editarRota(rota: RotaRequest){

  }

  filtrarResiduos(event: any) {
    const query = event.query.toLowerCase();
    this.residuoFiltrados = this.tipos.filter(t =>
      t.nome.toLowerCase().includes(query)
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

  filtrarCaminhoesPorResiduo() {
    if (!this.residuoSelecionado) {
      this.caminhoesFiltrados = [];
      return;
    }

    this.caminhoesFiltrados = this.caminhoes.filter(c =>
      c.tiposResiduos.includes(this.residuoSelecionado.nome)
    );
  }

  selecionarResiduo(event: any) {
    this.residuoSelecionado = this.residuoSelecionado.nome;
    this.filtrarPontos();
    this.filtrarCaminhoesPorResiduo();
  }



  getNomeBairro(id: number): string {
    const bairro = this.bairros.find(b => b.id === id);
    return bairro ? bairro.nome : 'Bairro não encontrado';
  }

  getNomeRuas(id: number): string {
    const aresta = this.arestas.find(b => b.id === id);
    return aresta ? aresta.nome : 'Rua não encontrado';
  }

}
