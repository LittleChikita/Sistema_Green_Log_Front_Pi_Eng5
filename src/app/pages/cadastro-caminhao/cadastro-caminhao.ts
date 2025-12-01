import { Component } from '@angular/core';
import {Toast} from 'primeng/toast';
import {MessageService} from 'primeng/api';
import {CaminhaoRequest} from '../../models/CaminhaoRequest';
import {CaminhaoService} from '../../services/caminhao-service';
import {ButtonDirective} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {MotoristaRequest} from '../../models/MotoristaRequest';
import {Checkbox} from 'primeng/checkbox';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-cadastro-caminhao',
  imports: [
    Toast,
    ButtonDirective,
    FormsModule,
    InputText,
    Checkbox,
    NgForOf
  ],
  providers: [MessageService],
  templateUrl: './cadastro-caminhao.html',
  styleUrl: './cadastro-caminhao.css',
})
export class CadastroCaminhao {

  carregando = this.service.loading;

  caminhao: CaminhaoRequest = {
    placa: '',
    nomeMotorista: '',
    capacidade: 0,
    tipoResiduo: []
};

  residuos = ["Plástico", "Papel", "Metal", "Orgânico"];

  motorista: MotoristaRequest = {
    nome: '',
    cpf: '',
  };


  constructor(
    private service: CaminhaoService,
    private msg: MessageService
  ) {
  }

  cadastrar(){
    this.service.criar(this.caminhao).subscribe();
  }

}
