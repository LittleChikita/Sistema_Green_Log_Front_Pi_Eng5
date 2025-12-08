import {Component, OnInit} from '@angular/core';
import {Toast} from 'primeng/toast';
import {ConfirmationService, MessageService} from 'primeng/api';
import {TableModule} from 'primeng/table';
import {CaminhaoResponse} from '../../../models/CaminhaoResponse';
import {ItinerarioService} from '../../../services/itinerario-service';
import {CaminhaoService} from '../../../services/caminhao-service';
import {Toolbar} from 'primeng/toolbar';
import {Button} from 'primeng/button';
import {CaminhaoRequest} from '../../../models/CaminhaoRequest';
import {Dialog} from 'primeng/dialog';
import {InputText} from 'primeng/inputtext';
import {FormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {MotoristaResponse} from '../../../models/MotoristaResponse';
import {AutoComplete} from 'primeng/autocomplete';
import {Checkbox} from 'primeng/checkbox';
import {TipoResiduo} from '../../../models/TipoResiduo';
import {ConfirmDialogModule} from 'primeng/confirmdialog';

@Component({
  selector: 'app-caminhao',
  imports: [
    Toast,
    TableModule,
    Toolbar,
    Button,
    Dialog,
    InputText,
    FormsModule,
    NgIf,
    AutoComplete,
    Checkbox,
    NgForOf,
    ConfirmDialogModule
  ],
  providers: [
    MessageService,
    ConfirmationService
  ],
  templateUrl: './caminhao.html',
  styleUrl: './caminhao.scss',
})
export class Caminhao implements OnInit{

  carregando = this.service.loading;

  caminhaoDialog: boolean = false;
  enviado: boolean = false;

  caminhao: CaminhaoRequest = {
    placa: '',
    motorista_id: null,
    capacidade: null,
    tiposResiduos: [] as string[]
  };

  caminhoes: CaminhaoResponse[] =[];
  caminhaoSelecionado!: CaminhaoResponse;

  tipos: TipoResiduo[] = [];

  motoristas: MotoristaResponse[] = [];
  motoristasFiltrados: MotoristaResponse[] = [];
  motoristaSelecionado!: MotoristaResponse;

  constructor(
    private service: CaminhaoService,
    private msg: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.service.getCaminhao().subscribe({
      next: (car) => {
        this.caminhoes = car;
        console.log("Caminhoes recebidos:", car);
      },
    })

    this.service.getMotoristas().subscribe({
      next: (mot) => {
        console.log("Motoristas recebidos:", mot);
        this.motoristas = mot;
      }
    })

    this.service.getTiposResiduo().subscribe(lista =>{
      this.tipos = lista;
    })

  }

  openNovo(){
    this.caminhaoDialog = true;
  }

  fecharDialog() {
    this.caminhaoDialog = false;
    this.enviado = false;
  }

  cadastrar(){
    this.enviado = true;

    this.caminhao.motorista_id = this.motoristaSelecionado.id;

    if (!this.caminhao.placa || !this.caminhao.capacidade || !this.caminhao.motorista_id) {
      this.msg.add({
        severity: "error",
        summary: "Erro",
        detail: "Preencha todos os campos obrigatórios."
      });
      return;
    }

    this.service.criar(this.caminhao).subscribe({
      next: res => {
        this.msg.add({
          severity: "success",
          summary: "Sucesso",
          detail: "Caminhão cadastrado!"
        });
        this.fecharDialog();
      },
      error: err => {
        this.msg.add({
          severity: "error",
          summary: "Erro",
          detail: "Falha ao cadastrar caminhão."
        });
      }
    });
  }

  deletarCaminhao(c: CaminhaoResponse){
    this.confirmationService.confirm({
      message: 'Você tem certeza que deseja deletar o caminhão? ' + c.placa + '?',
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
        this.service.deletar(c.id).subscribe({
          next: () => {
            this.caminhoes = this.caminhoes.filter(x => x.id !== c.id);

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

  inativarCaminhao(c: CaminhaoResponse){
    this.confirmationService.confirm({
      message: 'Você tem certeza que deseja Inativar o caminhão? ' + c.placa + '?',
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
        this.service.inativar(c.id).subscribe({
          next: () => {
            this.caminhoes = this.caminhoes.filter(x => x.id !== c.id);

            this.msg.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Caminhão inativado!',
              life: 3000
            });
          },
          error: () => {
            this.msg.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Falha ao inativado o caminhão.',
              life: 3000
            });
          }
        });
      }
    })
  }

  editarCaminhao(caminhao: CaminhaoRequest){

  }

  filtrarMotoristas(event: any) {
    const query = event.query.toLowerCase();
    this.motoristasFiltrados = this.motoristas.filter(m =>
      m.nome.toLowerCase().includes(query)
    );
  }


}
