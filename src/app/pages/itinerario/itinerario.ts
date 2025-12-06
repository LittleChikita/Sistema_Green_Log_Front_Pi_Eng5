import {Component, OnInit} from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, {DateClickArg} from '@fullcalendar/interaction';
import {FullCalendarModule} from '@fullcalendar/angular';
import {Toast} from 'primeng/toast';
import {FormsModule} from '@angular/forms';
import {RotaResponse} from '../../models/RotaResponse';
import {TipoResiduo} from '../../models/TipoResiduo';
import {ItinerarioRequest} from '../../models/ItinerarioRequest';
import {MessageService} from 'primeng/api';
import {ItinerarioService} from '../../services/itinerario-service';
import {Card} from 'primeng/card';
import {Chip} from 'primeng/chip';
import {NgForOf, NgIf} from '@angular/common';
import {BairroResponse} from '../../models/BairroResponse';
import {CaminhaoResponse} from '../../models/CaminhaoResponse';
import {TableModule} from 'primeng/table';
import {ButtonDirective} from 'primeng/button';


@Component({
  selector: 'app-itinerario',
  imports: [
    FullCalendarModule,
    Toast,
    FormsModule,
    Card,
    Chip,
    NgForOf,
    TableModule,
    ButtonDirective,
  ],
  providers: [MessageService],
  templateUrl: './itinerario.html',
  styleUrl: './itinerario.css',
})
export class Itinerario implements OnInit{

  carregando = this.service.loading;

  itinerario: ItinerarioRequest = {
    rotaId: null,
    dia: ''
  }

  selectedDate: string | null = null;

  rotas: RotaResponse[] =[];
  rotasFiltradas: RotaResponse[] =[];
  rotaSelecionado: RotaResponse | null = null;

  bairros: BairroResponse[] = [];
  caminhoes: CaminhaoResponse[] = [];

  residuoSelecionado!: TipoResiduo;

  residuos: TipoResiduo[] = [
    { nome: 'PLASTICO' },
    { nome: 'VIDRO' },
    { nome: 'METAL' },
    { nome: 'PAPEL' },
    { nome: 'ORGANICO' }
  ];

  constructor(
    private service: ItinerarioService,
    private msg: MessageService
  ) {}

  ngOnInit() {
    this.service.getRotas().subscribe({
      next: (rot) => {
        this.rotas = rot;
        console.log("Rotas recebidos:", rot);
      },
    });

    this.service.getBairros().subscribe({
      next: (bar) => {
        this.bairros = bar;
        console.log("Bairros recebidos:", bar);
      },
    });

    this.service.getCaminhao().subscribe({
      next: (car) => {
        this.caminhoes = car;
        console.log("Caminhoes recebidos:", car);
      },
    });
  }


  calendarOptions: any = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    dateClick: this.handleDateClick.bind(this),
    selectable: true,
    events: [],
    eventClick: (info: any) => {
      alert('Evento: ' + info.event.title);
    }
  };

  handleDateClick(arg: DateClickArg) {
    this.selectedDate = arg.dateStr; // salva a data clicada
    console.log('Data selecionada:', this.selectedDate);

  }

  filtrarRotas() {
    if (!this.residuoSelecionado) {
      this.rotasFiltradas = [...this.rotas];
      this.rotaSelecionado = null;
      return;
    }

    const tipo = this.residuoSelecionado.nome;

    this.rotasFiltradas = this.rotas.filter(c =>
      Array.isArray(c.tiposResiduos) && c.tiposResiduos.includes(tipo)
    );

    if (
      this.rotaSelecionado &&
      !this.rotaSelecionado.tiposResiduos.includes(tipo)
    ) {
      this.rotaSelecionado = null;
    }
  }

  getNomeBairro(id: number): string {
    const bairro = this.bairros.find(b => b.id === id);
    return bairro ? bairro.nome : 'Bairro não encontrado';
  }

  getCaminhao(caminhao?: CaminhaoResponse): string {
    return caminhao?.id ? caminhao.placa : '';
  }

  cadastrar() {
    if (!this.rotaSelecionado) {
      this.msg.add({
        severity: "error",
        summary: "Erro",
        detail: "Nenhuma rota selecionada."
      });
      return;
    }

    if (!this.rotaSelecionado.caminhao?.id) {
      this.msg.add({
        severity: "error",
        summary: "Erro",
        detail: "A rota selecionada não possui caminhão associado."
      });
      return;
    }

    if (!this.selectedDate) {
      this.msg.add({
        severity: "error",
        summary: "Erro",
        detail: "Nenhuma data selecionada."
      });
      return;
    }

    const itinerarioRequest: ItinerarioRequest = {
      rotaId: this.rotaSelecionado.id,
      dia: this.selectedDate
    };

    this.service.criar(itinerarioRequest).subscribe({
      next: (res) => {
        this.msg.add({
          severity: "success",
          summary: "Sucesso",
          detail: "Itinerário criado com sucesso!"
        });
      },
      error: (err) => {
        this.msg.add({
          severity: "error",
          summary: "Erro",
          detail: "Falha ao criar itinerário."
        });
      }
    });

    console.log(itinerarioRequest);
  }


}
