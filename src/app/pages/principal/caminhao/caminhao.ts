import {Component, OnInit} from '@angular/core';
import {Toast} from 'primeng/toast';
import {MessageService} from 'primeng/api';
import {TableModule} from 'primeng/table';
import {CaminhaoResponse} from '../../../models/CaminhaoResponse';
import {ItinerarioService} from '../../../services/itinerario-service';
import {CaminhaoService} from '../../../services/caminhao-service';

@Component({
  selector: 'app-caminhao',
  imports: [
    Toast,
    TableModule,
  ],
  providers: [MessageService],
  templateUrl: './caminhao.html',
  styleUrl: './caminhao.css',
})
export class Caminhao implements OnInit{

  carregando = this.service.loading;

  caminhoes: CaminhaoResponse[]=[];
  caminhaoSelecionado!: CaminhaoResponse;

  constructor(
    private service: CaminhaoService,
    private msg: MessageService
  ) {}

  ngOnInit() {
    this.service.getCaminhao().subscribe({
      next: (car) => {
        this.caminhoes = car;
        console.log("Caminhoes recebidos:", car);
      },
    });

  }


}
