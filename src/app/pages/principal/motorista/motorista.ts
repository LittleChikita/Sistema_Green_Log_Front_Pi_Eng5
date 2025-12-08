import {Component, OnInit} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {MotoristaService} from '../../../services/motorista-service';
import {Toast} from 'primeng/toast';
import {Button} from 'primeng/button';
import {Toolbar} from 'primeng/toolbar';
import {ConfirmDialog} from 'primeng/confirmdialog';
import {Dialog} from 'primeng/dialog';
import {FormsModule} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {NgForOf, NgIf} from '@angular/common';
import {TableModule} from 'primeng/table';
import {MotoristaResponse} from '../../../models/MotoristaResponse';
import {InputMask} from 'primeng/inputmask';
import {MotoristaRequest} from '../../../models/MotoristaRequest';

@Component({
  selector: 'app-motorista',
  imports: [
    Toast,
    Button,
    Toolbar,
    ConfirmDialog,
    Dialog,
    FormsModule,
    InputText,
    NgIf,
    TableModule,
    InputMask
  ],
  providers: [
    MessageService,
    ConfirmationService
  ],
  templateUrl: './motorista.html',
  styleUrl: './motorista.scss',
})
export class Motorista implements OnInit{

  motoristaForm: any = {
  nome: '',
  cpf: ''
};

  motoristas: MotoristaResponse[] =[];
  motoristaSelecionado: MotoristaResponse | null = null;

  motoristaDialog: boolean = false;
  enviado: boolean = false;

  constructor(
    private service: MotoristaService,
    private msg: MessageService,
    private confirmationService: ConfirmationService
  ) {}


  ngOnInit() {
    this.carregarMotoristas()
  }

  carregarMotoristas() {
    this.service.getMotoristas().subscribe({
      next: (lista) => {
        this.motoristas = lista;
      },
      error: (err) => {
        console.error(err);
        this.msg.add({
          severity: "error",
          summary: "Erro",
          detail: "Falha ao carregar motoristas."
        });
      }
    });
  }


  openNovo(){
    this.motoristaForm = { nome: '', cpf: '' };
    this.motoristaSelecionado = null;
    this.enviado = false;
    this.motoristaDialog = true;
  }

  fecharDialog(){
    this.motoristaDialog = false;
    this.enviado = false;

    this.motoristaForm = {
      nome: '',
      cpf: ''
    };

    this.motoristaSelecionado = null;
  }

  editarMotorista(motorista:any){
    this.enviado = false;
    this.motoristaDialog = true;
    this.motoristaSelecionado = motorista;
    this.motoristaForm = {
      nome: motorista.nome,
      cpf: motorista.cpf
    };
  }


  salvar(){
    this.enviado = true;

    if (!this.motoristaForm.nome || !this.motoristaForm.cpf || !this.cpfValido()) {
      this.msg.add({
        severity: "warn",
        summary: "Campos obrigatórios",
        detail: "Preencha nome e CPF corretamente."
      });
      return;
    }

    if (this.motoristaDuplicado()) {
      this.msg.add({
        severity: "error",
        summary: "Duplicado",
        detail: "Já existe um motorista com esse CPF."
      });
      return;
    }

    const motoristaRequest: MotoristaRequest = {
      nome: this.motoristaForm.nome,
      cpf: this.motoristaForm.cpf
    };

    if (this.motoristaSelecionado) {
      this.service.atualizar(this.motoristaSelecionado.id, motoristaRequest).subscribe({
        next: () => {
          this.msg.add({
            severity: "success",
            summary: "Atualizado",
            detail: "Motorista atualizado com sucesso!"
          });
          this.fecharDialog();
          this.carregarMotoristas();
        },
        error: (err) => {
          console.error(err);
          this.msg.add({
            severity: "error",
            summary: "Erro",
            detail: "Falha ao atualizar motorista."
          });
        }
      });
      return;
    }

    this.service.criar(motoristaRequest).subscribe({
      next: () => {
        this.msg.add({
          severity: "success",
          summary: "Criado",
          detail: "Motorista cadastrado com sucesso!"
        });
        this.fecharDialog();
        this.carregarMotoristas();
      },
      error: (err) => {
        console.error(err);
        this.msg.add({
          severity: "error",
          summary: "Erro",
          detail: err.error?.message || "Falha ao cadastrar motorista."
        });
      }
    });
  }

  inativarMotorista(id:number){
    this.service.inativar(id).subscribe({
      next: () => {
        this.msg.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Motorista inativado(a)'
        });

        this.motoristas = this.motoristas.filter(r => r.id !== id);
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

  deletarMotorista(motorista:any){
    if (!motorista) return;

    this.confirmationService.confirm({
      message: `Deseja realmente deletar o motorista ${motorista.nome}?`,
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',

      accept: () => {
        this.service.deletar(motorista.id).subscribe({
          next: () => {
            this.msg.add({
              severity: 'success',
              summary: 'Deletado',
              detail: 'Motorista removido com sucesso!'
            });

            this.carregarMotoristas();
            this.motoristaSelecionado = null;
          },

          error: (err) => {
            console.error(err);
            this.msg.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Não foi possível deletar o motorista.'
            });
          }
        });
      }
    });
  }

  cpfValido() {
    return /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(this.motoristaForm.cpf || '');
  }

  motoristaDuplicado(): boolean {
    return this.motoristas.some(m =>
      m.id !== this.motoristaSelecionado?.id &&
      (m.cpf === this.motoristaForm.cpf)
    );
  }




}
