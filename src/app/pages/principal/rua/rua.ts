import {Component, OnInit} from '@angular/core';
import {Toast} from 'primeng/toast';
import {ConfirmationService, MessageService} from 'primeng/api';
import {Button} from 'primeng/button';
import {ConfirmDialog} from 'primeng/confirmdialog';
import {Dialog} from 'primeng/dialog';
import {FormsModule} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {NgForOf, NgIf} from '@angular/common';
import {TableModule} from 'primeng/table';
import {Toolbar} from 'primeng/toolbar';
import {AutoComplete, AutoCompleteSelectEvent} from 'primeng/autocomplete';
import {RuaResponse} from '../../../models/RuaResponse';
import {BairroResponse} from '../../../models/BairroResponse';
import {BairroService} from '../../../services/bairro-service';
import {RuaService} from '../../../services/rua-service';
import {RuaRequest} from '../../../models/RuaRequest';

@Component({
  selector: 'app-rua',
  imports: [
    Toast,
    Button,
    ConfirmDialog,
    Dialog,
    FormsModule,
    InputText,
    NgIf,
    TableModule,
    Toolbar,
    AutoComplete,
  ],
  providers: [
    MessageService,
    ConfirmationService
  ],
  templateUrl: './rua.html',
  styleUrl: './rua.scss',
})
export class Rua implements OnInit{

  ruaForm:any ={
    origemId: null,
    nome: '',
    destinoId: null,
    distancia: null
  }

  ruaDialog: boolean = false;
  enviado: boolean = false;

  ruas: RuaResponse[]=[]
  ruaSelecionada: RuaResponse | null = null

  bairros:BairroResponse[]=[]
  bairroOrigemSelecionado: BairroResponse | null = null
  bairroDestinoSelecionado: BairroResponse | null = null
  bairroDestinoFiltrados: BairroResponse[]=[]
  bairrosOrigemFiltrados: BairroResponse[]=[]

  constructor(
    private service: RuaService,
    private msg: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.carregarRuas()
    this.carregarBairros()
  }

  openNovo() {
    this.ruaForm = { nome: '', origemId: null, destinoId: null, distancia: null };
    this.ruaSelecionada = null;
    this.enviado = false;
    this.bairroOrigemSelecionado = null;
    this.bairroDestinoSelecionado = null;
    this.bairrosOrigemFiltrados = [];
    this.bairroDestinoFiltrados = [];
    this.ruaDialog = true;
  }

  carregarRuas() {
    this.service.getRuas().subscribe({
      next: (lista) => this.ruas = lista,
      error: (err) => console.error(err)
    });
  }

  carregarBairros() {
    this.service.getBairros().subscribe({
      next: (lista) => {
        this.bairros = lista;
      },
      error: (err) => {
        console.error(err);
        this.msg.add({
          severity: "error",
          summary: "Erro",
          detail: "Falha ao carregar Bairros."
        });
      }
    });
  }

  onSelectBairroOrigem(event: AutoCompleteSelectEvent) {
    const bairro = event.value as BairroResponse;
    this.ruaForm.origemId = bairro.id;
  }

  onSelectBairroDestino(event: AutoCompleteSelectEvent) {
    const bairro = event.value as BairroResponse;
    this.ruaForm.destinoId = bairro.id;
  }


  salvar() {
    this.enviado = true;

    if (!this.ruaForm.nome || !this.ruaForm.origemId || !this.ruaForm.destinoId || !this.ruaForm.distancia) {
      this.msg.add({ severity: 'error', summary: 'Erro', detail: 'Preencha todos os campos obrigatórios.' });
      return;
    }

    const request: RuaRequest = {
      nome: this.ruaForm.nome,
      origemId: this.ruaForm.origemId,
      destinoId: this.ruaForm.destinoId,
      distancia: this.ruaForm.distancia
    };

    if (this.ruaSelecionada) {
      this.service.atualizar(this.ruaSelecionada.id, request).subscribe({
        next: () => {
          this.msg.add({ severity: 'success', summary: 'Atualizado', detail: 'Rua atualizada com sucesso!' });
          this.ruaDialog = false;
          this.carregarRuas();
        },
        error: (err) => this.msg.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao atualizar.' })
      });
    } else {
      this.service.criar(request).subscribe({
        next: () => {
          this.msg.add({ severity: 'success', summary: 'Criado', detail: 'Rua criada com sucesso!' });
          this.ruaDialog = false;
          this.carregarRuas();
        },
        error: (err) => this.msg.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao criar rua.' })
      });
    }
  }

  deletarRua(rua:any){
    if (!rua) return;

    this.confirmationService.confirm({
      message: `Deseja realmente deletar o Bairro ${rua.nome}?`,
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',

      accept: () => {
        this.service.deletar(rua.id).subscribe({
          next: () => {
            this.msg.add({
              severity: 'success',
              summary: 'Deletado',
              detail: 'Bairro removido com sucesso!'
            });

            this.carregarRuas();
            this.ruaSelecionada = null;
          },

          error: (err) => {
            console.error(err);
            this.msg.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Não foi possível deletar o Bairro.'
            });
          }
        });
      }
    });
  }

  editarRua(rua: RuaResponse) {
    this.ruaDialog = true;
    this.enviado = false;
    this.ruaSelecionada = rua;

    this.ruaForm = {
      nome: rua.nome,
      origemId: rua.idBairroOrigem,
      destinoId: rua.idBairroDestino,
      distancia: rua.distancia
    };

    this.bairroOrigemSelecionado = this.bairros.find(b => b.id === rua.idBairroOrigem) || null;
    this.bairroDestinoSelecionado = this.bairros.find(b => b.id === rua.idBairroDestino) || null;
  }

  fecharDialog() {
    this.ruaDialog = false;
    this.enviado = false;
    this.ruaForm = {nome: '', origemId: null, destinoId: null, distancia: null };
    this.ruaSelecionada = null;
  }

  filtrarBairrosOrigem(event: any) {
    const query = event.query.toLowerCase();
    this.bairrosOrigemFiltrados = this.bairros.filter(m =>
      m.nome.toLowerCase().includes(query)
    );
  }

  filtrarBairrosDestino(event: any) {
    const query = event.query.toLowerCase();
    this.bairroDestinoFiltrados = this.bairros.filter(m =>
      m.nome.toLowerCase().includes(query)
    );
  }

  getNomeBairro(id: number): string {
    const bairro = this.bairros.find(b => b.id === id);
    return bairro ? bairro.nome : 'Bairro não encontrado';
  }

}
