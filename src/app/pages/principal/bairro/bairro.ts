import {Component, OnInit} from '@angular/core';
import {Toast} from 'primeng/toast';
import {ConfirmationService, MessageService} from 'primeng/api';
import {BairroService} from '../../../services/bairro-service';
import {Button} from 'primeng/button';
import {ConfirmDialog} from 'primeng/confirmdialog';
import {Dialog} from 'primeng/dialog';
import {FormsModule} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {NgIf} from '@angular/common';
import {TableModule} from 'primeng/table';
import {Toolbar} from 'primeng/toolbar';
import {BairroResponse} from '../../../models/BairroResponse';
import {BairroRequest} from '../../../models/BairroRequest';


@Component({
  selector: 'app-bairro',
  imports: [
    Toast,
    Button,
    ConfirmDialog,
    Dialog,
    FormsModule,
    InputText,
    NgIf,
    TableModule,
    Toolbar
  ],
  providers: [
    MessageService,
    ConfirmationService
  ],
  templateUrl: './bairro.html',
  styleUrl: './bairro.scss',
})
export class Bairro implements OnInit{

  bairroForm: any = {
    nome: ''
  }

  bairroDialog: boolean = false;
  enviado: boolean = false;

  bairros: BairroResponse[]=[]
  bairroSelecionado: BairroResponse | null = null

  constructor(
    private service: BairroService,
    private msg: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.carregarBairros()
  }

  openNovo(){
    this.bairroForm = { nome: ''};
    this.bairroSelecionado = null;
    this.enviado = false;
    this.bairroDialog = true;
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

  salvar(){
    this.enviado = true;

    if (!this.bairroForm.nome) {
      this.msg.add({
        severity: "warn",
        summary: "Campos obrigatórios",
        detail: "Preencha nome  corretamente."
      });
      return;
    }

    if (this.bairroDuplicado()) {
      this.msg.add({
        severity: "error",
        summary: "Duplicado",
        detail: "Já existe um bairro com esse nome."
      });
      return;
    }

    const bairroRequest: BairroRequest = {
      nome: this.bairroForm.nome,
    };

    if (this.bairroSelecionado) {
      this.service.atualizar(this.bairroSelecionado.id, bairroRequest).subscribe({
        next: () => {
          this.msg.add({
            severity: "success",
            summary: "Atualizado",
            detail: "bairro atualizado com sucesso!"
          });
          this.fecharDialog();
          this.carregarBairros();
        },
        error: (err) => {
          console.error(err);
          this.msg.add({
            severity: "error",
            summary: "Erro",
            detail: "Falha ao atualizar bairro."
          });
        }
      });
      return;
    }

    this.service.criar(bairroRequest).subscribe({
      next: () => {
        this.msg.add({
          severity: "success",
          summary: "Criado",
          detail: "bairro cadastrado com sucesso!"
        });
        this.fecharDialog();
        this.carregarBairros();
      },
      error: (err) => {
        console.error(err);
        this.msg.add({
          severity: "error",
          summary: "Erro",
          detail: err.error?.message || "Falha ao cadastrar bairro."
        });
      }
    });
  }

  deletarBairro(bairro:any){
    if (!bairro) return;

    this.confirmationService.confirm({
      message: `Deseja realmente deletar o Bairro ${bairro.nome}?`,
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',

      accept: () => {
        this.service.deletar(bairro.id).subscribe({
          next: () => {
            this.msg.add({
              severity: 'success',
              summary: 'Deletado',
              detail: 'Bairro removido com sucesso!'
            });

            this.carregarBairros();
            this.bairroSelecionado = null;
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

  editarBairro(bairro:any){
    this.enviado = false;
    this.bairroDialog = true;
    this.bairroSelecionado = bairro;
    this.bairroForm = {
      nome: bairro.nome,
      cpf: bairro.cpf
    };
  }


  fecharDialog(){
    this.bairroDialog = false;
    this.enviado = false;

    this.bairroForm = {
      nome: ''
    };

    this.bairroSelecionado = null;
  }

  bairroDuplicado(): boolean {
    return this.bairros.some(m =>
      m.id !== this.bairroSelecionado?.id &&
      (m.nome === this.bairroForm.nome)
    );
  }


}
