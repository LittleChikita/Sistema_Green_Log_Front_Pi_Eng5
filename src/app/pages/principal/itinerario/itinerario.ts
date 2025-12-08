import {Component, numberAttribute, OnInit} from '@angular/core';
import {Toast} from 'primeng/toast';
import {ConfirmationService, MessageService} from 'primeng/api';
import {ItinerarioResponse} from '../../../models/ItinerarioResponse';
import {ItinerarioService} from '../../../services/itinerario-service';
import {FormsModule} from '@angular/forms';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {Button} from 'primeng/button';
import {Toolbar} from 'primeng/toolbar';
import {AutoComplete, AutoCompleteSelectEvent} from 'primeng/autocomplete';
import {ConfirmDialog} from 'primeng/confirmdialog';
import {Dialog} from 'primeng/dialog';
import {RotaResponse} from '../../../models/RotaResponse';
import {FullCalendarModule} from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';


@Component({
  selector: 'app-itinerario',
  imports: [
    Toast,
    FormsModule,
    NgIf,
    Button,
    Toolbar,
    AutoComplete,
    ConfirmDialog,
    Dialog,
    FullCalendarModule,
    DatePipe,
  ],
  providers: [
    MessageService,
    ConfirmationService
  ],
  templateUrl: './itinerario.html',
  styleUrl: './itinerario.scss',
})
export class Itinerario implements OnInit{
  itinerarioForm: any = {
    rotaId: null,
    dia: ''
  };

  itinerarioDialog: boolean = false;
  enviado: boolean = false;

  dataSelecionada!: Date;

  itinerarios: ItinerarioResponse[] = [];
  itinerarioSelecionado!: ItinerarioResponse;

  rotas: RotaResponse[] = [];
  rotasFiltradas: RotaResponse[] = [];
  rotaSelecionada!: RotaResponse;

  calendarOptions: any = {};

  constructor(
    private service: ItinerarioService,
    private msg: MessageService
  ) {}

  ngOnInit() {
    this.calendarOptions = {
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      locale: 'pt-br',

      dateClick: (info: any) => this.onClickDia(info),
      eventClick: (info: any) => this.onClickEvento(info),

      events: []
    };

    this.carregarRotas();
    this.carregarItinerarios();
  }

  carregarItinerarios() {
    this.service.getItinerarios().subscribe({
      next: (lista) => {
        this.itinerarios = lista;

        this.calendarOptions.events = lista.map(it => ({
          id: it.id,
          title: it.rota.nome,
          date: it.dia,
          backgroundColor: it.ativo ? '#16a34a' : '#dc2626'
        }));
      },
      error: () => {
        this.msg.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Falha ao carregar itinerários'
        });
      }
    });
  }

  carregarRotas() {
    this.service.getRotas().subscribe({
      next: (lista) => this.rotas = lista,
      error: () => {
        this.msg.add({
          severity: "error",
          summary: "Erro",
          detail: "Falha ao carregar rotas."
        });
      }
    });
  }


  onClickDia(info: any) {
    this.dataSelecionada = new Date(info.dateStr);
    this.itinerarioForm.dia = info.dateStr;
    this.openNovo();
  }


  openNovo() {
    this.enviado = false;
    this.itinerarioDialog = true;
  }

  fecharDialog() {
    this.itinerarioDialog = false;
    this.itinerarioForm = { rotaId: null, dia: '' };
    this.rotaSelecionada = null!;
  }

  salvar() {
    this.enviado = true;

    if (!this.itinerarioForm.rotaId || !this.itinerarioForm.dia) {
      return;
    }

    if (this.itinerarioSelecionado) {
      this.service.atualizar(this.itinerarioSelecionado.id, this.itinerarioForm).subscribe({
        next: () => {
          this.msg.add({
            severity: 'success',
            summary: 'Atualizado',
            detail: 'Itinerário atualizado!'
          });
          this.fecharDialog();
          this.carregarItinerarios();
        },
        error: () => {
          this.msg.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Falha ao atualizar itinerário.'
          });
        }
      });
      return;
    }

    this.service.criar(this.itinerarioForm).subscribe({
      next: () => {
        this.msg.add({
          severity: 'success',
          summary: 'Criado',
          detail: 'Itinerário criado com sucesso!'
        });
        this.fecharDialog();
        this.carregarItinerarios();
      },
      error: () => {
        this.msg.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Falha ao criar itinerário.'
        });
      }
    });
  }

  deletarItinerario() {
    if (!this.itinerarioSelecionado) return;

    if (confirm("Tem certeza que deseja excluir este itinerário?")) {
      this.service.deletar(this.itinerarioSelecionado.id).subscribe({
        next: () => {
          this.msg.add({
            severity: 'success',
            summary: 'Deletado',
            detail: 'Itinerário removido!'
          });
          this.itinerarioSelecionado = undefined!;
          this.carregarItinerarios();
        },
        error: () => {
          this.msg.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Falha ao deletar itinerário.'
          });
        }
      });
    }
  }


  onSelectRota(event: AutoCompleteSelectEvent) {
    const rota = event.value as RotaResponse;
    this.itinerarioForm.rotaId = rota.id;
  }

  filtrarRotas(event: any) {
    const q = event.query.toLowerCase();
    this.rotasFiltradas = this.rotas.filter(r => r.nome.toLowerCase().includes(q));
  }

  onClickEvento(info: any) {
    const id = Number(info.event.id);
    this.itinerarioSelecionado = this.itinerarios.find(i => i.id === id)!;

    this.itinerarioForm = {
      rotaId: this.itinerarioSelecionado.rota.id,
      dia: this.itinerarioSelecionado.dia
    };

    this.rotaSelecionada = this.itinerarioSelecionado.rota;

    this.dataSelecionada = new Date(this.itinerarioSelecionado.dia);

    this.itinerarioDialog = true;
  }


}
