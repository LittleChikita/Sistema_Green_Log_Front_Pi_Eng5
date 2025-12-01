import { Component } from '@angular/core';
import {MotoristaService} from '../../services/motorista-service';
import {MotoristaRequest} from '../../models/MotoristaRequest';
import {Toast} from 'primeng/toast';
import {ButtonDirective} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-cadastro-motorista',
  imports: [
    Toast,
    ButtonDirective,
    FormsModule,
    InputText,
  ],
  providers: [MessageService],
  templateUrl: './cadastro-motorista.html',
  styleUrl: './cadastro-motorista.css',
})
export class CadastroMotorista {

  carregando = this.service.loading;

  motorista: MotoristaRequest = {
    nome: '',
    cpf: ''
  };

  constructor(
    private service: MotoristaService,
    private msg: MessageService
  ) {
  }

  cadastrar(){
    this.service.criar(this.motorista).subscribe();
  }

}
