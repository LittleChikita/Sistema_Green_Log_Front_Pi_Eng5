import {Component, OnInit} from '@angular/core';
import {Toast} from 'primeng/toast';
import {MessageService} from 'primeng/api';
import {TableModule} from 'primeng/table';
import {CaminhaoResponse} from '../../../models/CaminhaoResponse';
import {ItinerarioService} from '../../../services/itinerario-service';
import {CaminhaoService} from '../../../services/caminhao-service';
import {Toolbar} from 'primeng/toolbar';
import {Button} from 'primeng/button';
import {CaminhaoRequest} from '../../../models/CaminhaoRequest';

@Component({
  selector: 'app-caminhao',
  imports: [
    Toast,
    TableModule,
    Toolbar,
    Button,
  ],
  providers: [MessageService],
  templateUrl: './caminhao.html',
  styleUrl: './caminhao.scss',
})
export class Caminhao implements OnInit{

  carregando = this.service.loading;

  caminhao: CaminhaoRequest;

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

  openNovo(){
    this.
  }

  inativarCaminhao(){

  }


}
