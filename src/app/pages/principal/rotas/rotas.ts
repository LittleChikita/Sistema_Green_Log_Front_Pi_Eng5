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

  rotaForm: any = {
    id: null,
    caminhaoId: null,
    nome: '',
    tipoResiduo: '',
    bairros: [],
    arestas: []
  };

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

  salvar() {

    this.enviado = true;

    this.rotaForm.caminhaoId = this.caminhaoSelecionado?.id ?? null;
    this.rotaForm.tipoResiduo = this.residuoSelecionado?.nome ?? '';

    if (!this.rotaForm.nome || !this.rotaForm.tipoResiduo || !this.rotaForm.caminhaoId) {
      this.msg.add({
        severity: "error",
        summary: "Erro",
        detail: "Preencha todos os campos obrigatórios."
      });
      return;
    }

    if (!this.pontosSelecionados.length) {
      this.msg.add({
        severity: 'warn',
        summary: 'Aviso',
        detail: 'Selecione ao menos um ponto de coleta.'
      });
      return;
    }

    const bairrosSelecionados = this.pontosSelecionados.map(p => p.bairro.id);

    this.service.calcularRota(bairrosSelecionados).subscribe({

      next: (res) => {

        const rotaRequest = {
          nome: this.rotaForm.nome,
          caminhaoId: this.rotaForm.caminhaoId,
          tipoResiduo: this.rotaForm.tipoResiduo,
          bairros: res.bairros.map((b: any) => b.id),
          arestas: res.arestas.map((a: any) => a.id)
        };

        if (this.rotaForm.id) {

          this.service.atualizar(this.rotaForm.id, rotaRequest).subscribe({
            next: () => {
              this.msg.add({
                severity: "success",
                summary: "Sucesso",
                detail: "Rota atualizada com sucesso!"
              });
              this.rotaDialog = false;
            },
            error: () => {
              this.msg.add({
                severity: "error",
                summary: "Erro",
                detail: "Falha ao atualizar rota."
              });
            }
          });

        }

        else {

          this.service.criar(rotaRequest).subscribe({
            next: () => {
              this.msg.add({
                severity: "success",
                summary: "Sucesso",
                detail: "Rota criada com sucesso!"
              });
              this.rotaDialog = false;
            },
            error: () => {
              this.msg.add({
                severity: "error",
                summary: "Erro",
                detail: "Falha ao cadastrar rota."
              });
            }
          });

        }
      },

      error: () => {
        this.msg.add({
          severity: "error",
          summary: "Erro",
          detail: "Falha ao calcular rota."
        });
      }
    });
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

  inativarRota(id:number){
    this.service.inativar(id).subscribe({
      next: () => {
        this.msg.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Rota inativada'
        });

        this.rotas = this.rotas.filter(r => r.id !== id);
      },
      error: () => {
        this.msg.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível inativar'
        });
      }
    });
  }

  editarRota(rotaSelecionada: RotaResponse) {

    this.rotaForm = {
      id: rotaSelecionada.id,
      nome: rotaSelecionada.nome,
      tipoResiduo: rotaSelecionada.tiposResiduos,
      caminhaoId: rotaSelecionada.caminhao.id,
      bairros: [...rotaSelecionada.bairros],
      arestas: [...rotaSelecionada.arestas]
    };

    this.residuoSelecionado = this.tipos.find(t =>
      t.nome === rotaSelecionada.tiposResiduos
    )!;

    this.caminhaoSelecionado = this.caminhoes.find(c =>
      c.id === rotaSelecionada.caminhao.id
    )!;

    this.rotaDialog = true;

    setTimeout(() => {

      this.filtrarPontos();

      this.pontosSelecionados = this.pontosColeta.filter(p =>
        rotaSelecionada.bairros.includes(p.bairro.id)
      );

      this.filtrarCaminhoesPorResiduo();

    }, 0);
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
    const tipo = this.residuoSelecionado
      ? (typeof this.residuoSelecionado === 'string' ? this.residuoSelecionado : this.residuoSelecionado.nome)
      : null;

    if (!tipo) {
      this.caminhoesFiltrados = [...this.caminhoes];
      if (this.caminhaoSelecionado && !this.caminhoesFiltrados.some(c => c.id === this.caminhaoSelecionado!.id)) {
        this.caminhaoSelecionado = null;
      }
      return;
    }

    const tipoLower = tipo.toString().toLowerCase();

    this.caminhoesFiltrados = this.caminhoes.filter(c => {
      if (!c.tiposResiduos) return false;

      return c.tiposResiduos.some((tr: any) => {
        if (!tr) return false;
        if (typeof tr === 'string') {
          return tr.toLowerCase() === tipoLower;
        }
        if (typeof tr === 'object') {
          const candidate = (tr.nome ?? tr).toString().toLowerCase();
          return candidate === tipoLower;
        }
        return false;
      });
    });

    if (this.caminhaoSelecionado && !this.caminhoesFiltrados.find(c => c.id === this.caminhaoSelecionado!.id)) {
      this.caminhaoSelecionado = null;
    }
  }

  selecionarResiduo(event: any) {
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
