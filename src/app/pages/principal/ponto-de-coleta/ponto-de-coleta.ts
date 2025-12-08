import {Component, OnInit} from '@angular/core';
import {ConfirmationService, MessageService, PrimeTemplate} from 'primeng/api';
import {Toast} from 'primeng/toast';
import {AutoComplete, AutoCompleteSelectEvent} from 'primeng/autocomplete';
import {Button} from 'primeng/button';
import {ConfirmDialog} from 'primeng/confirmdialog';
import {Dialog} from 'primeng/dialog';
import {FormsModule} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {NgForOf, NgIf} from '@angular/common';
import {TableModule} from 'primeng/table';
import {Toolbar} from 'primeng/toolbar';
import {PontoDeColetaService} from '../../../services/ponto-de-coleta-service';
import {PontoDeColetaResponse} from '../../../models/PontoDeColetaResponse';
import {Checkbox} from 'primeng/checkbox';
import {TipoResiduo} from '../../../models/TipoResiduo';
import {BairroResponse} from '../../../models/BairroResponse';

@Component({
  selector: 'app-ponto-de-coleta',
  imports: [
    Toast,
    Button,
    ConfirmDialog,
    Dialog,
    FormsModule,
    InputText,
    NgForOf,
    NgIf,
    TableModule,
    Toolbar,
    Checkbox,
    AutoComplete
  ],
  providers: [
    MessageService,
    ConfirmationService
  ],
  templateUrl: './ponto-de-coleta.html',
  styleUrl: './ponto-de-coleta.scss',
})
export class PontoDeColeta implements OnInit{

  pontoDeColetaForm: any = {
    bairroId: null,
    nome: '',
    responsavel: '',
    telefoneResponsavel: '',
    emailResponsavel: '',
    endereco: '',
    tiposResiduos: [] as string[],
  }

  pontoDialog: boolean = false
  enviado: boolean = false

  pontosDeColeta:PontoDeColetaResponse[]=[]
  pontoDeColetaSelecionado!: PontoDeColetaResponse

  tipos: TipoResiduo[] = [];

  bairros: BairroResponse[]=[]
  bairroSelecionado!: BairroResponse
  bairroFiltrados:  BairroResponse[]=[]

  constructor(
    private service: PontoDeColetaService,
    private msg: MessageService,
    private confirmationService: ConfirmationService
  ) {}


  ngOnInit() {
    this.getTiposResiduos()
    this.getPontos()
    this.getBairros()
  }

  getTiposResiduos(){
    this.service.getTiposResiduo().subscribe(lista =>{
      this.tipos = lista;
    })
  }

  getPontos(){
    this.service.getPontos().subscribe(lista =>{
      this.pontosDeColeta = lista;
    })
  }

  getBairros(){
    this.service.getBairros().subscribe({
      next: (bar) => {
        this.bairros = bar;
        console.log(this.bairros)
      }
    });
  }

  openNovo(){
    this.pontoDeColetaForm = {
      bairroId: null,
      nome: '',
      responsavel: '',
      telefoneResponsavel: '',
      emailResponsavel: '',
      endereco: '',
      tiposResiduos: []
    };

    this.enviado = false;
    this.pontoDialog = true;
  }

  deletarPonto(ponto:PontoDeColetaResponse){
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja deletar este ponto?',
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.service.deletar(ponto.id).subscribe({
          next: () => {
            this.msg.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Ponto deletado',
            });
            this.getPontos();
          },
          error: () => {
            this.msg.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Não foi possível deletar',
            });
          }
        });
      }
    });
  }

  inativarPonto(id:number){
    this.confirmationService.confirm({
      message: 'Deseja realmente inativar este ponto?',
      header: 'Confirmação',
      icon: 'pi pi-ban',
      accept: () => {
        this.service.inativar(id).subscribe({
          next: () => {
            this.msg.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Ponto inativado!',
            });
            this.getPontos();
          },
          error: () => {
            this.msg.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Falha ao inativar o ponto.',
            });
          }
        });
      }
    });
  }

  editarPonto(ponto:PontoDeColetaResponse){
    this.pontoDeColetaForm = {
      id: ponto.id,
      bairroId: ponto.bairro.id,
      nome: ponto.nomePontoDeColeta,
      responsavel: ponto.nomeResponsavel,
      telefoneResponsavel: ponto.telefoneResponsavel,
      emailResponsavel: ponto.emailResponsavel,
      endereco: ponto.endereco,
      tiposResiduos: [...ponto.tiposResiduos]
    };

    this.bairroSelecionado = this.bairros.find(b => b.id === ponto.bairro.id)!;

    this.pontoDialog = true;
    this.enviado = false;
  }
  salvar(){
    this.enviado = true;

    if (!this.pontoDeColetaForm.nome ||
      !this.pontoDeColetaForm.responsavel ||
      !this.pontoDeColetaForm.telefoneResponsavel ||
      !this.pontoDeColetaForm.emailResponsavel ||
      !this.pontoDeColetaForm.endereco ||
      !this.pontoDeColetaForm.bairroId ||
      !this.pontoDeColetaForm.tiposResiduos.length) {

      this.msg.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Preencha todos os campos obrigatórios.'
      });
      return;
    }

    if (this.pontoDeColetaForm.id) {
      this.service.atualizar(this.pontoDeColetaForm.id, this.pontoDeColetaForm).subscribe({
        next: () => {
          this.msg.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Ponto atualizado!'
          });
          this.getPontos();
          this.pontoDialog = false;
        },
        error: () => {
          this.msg.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Falha ao atualizar ponto.'
          });
        }
      });
    }

    else {
      this.service.criar(this.pontoDeColetaForm).subscribe({
        next: () => {
          this.msg.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Ponto criado!'
          });
          this.getPontos();
          this.pontoDialog = false;
        },
        error: () => {
          this.msg.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Falha ao criar ponto.'
          });
        }
      });
    }
  }

  fecharDialog(){
    this.pontoDialog = false;
    this.enviado = false;
  }

  filtrarBairros(event: any) {
    const query = event.query.toLowerCase();
    this.bairroFiltrados = this.bairros.filter(m =>
      m.nome.toLowerCase().includes(query)
    );
  }

  selecionarBairro(event: AutoCompleteSelectEvent) {
    const bairro = event.value as BairroResponse;
    this.pontoDeColetaForm.bairroId = bairro.id;
  }


}
