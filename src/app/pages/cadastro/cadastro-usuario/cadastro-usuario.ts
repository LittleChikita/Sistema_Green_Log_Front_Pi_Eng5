import { Component } from '@angular/core';
import {Toast} from 'primeng/toast';
import {InputText} from 'primeng/inputtext';
import {FormsModule} from '@angular/forms';
import {UsuarioCadastroRequest} from '../../../models/UsuarioCadastroRequest';
import {UsuarioService} from '../../../services/usuario-service';
import {Password} from 'primeng/password';
import {MessageService} from 'primeng/api';
import {HttpClientModule} from '@angular/common/http';
import {ButtonDirective} from 'primeng/button';

@Component({
  selector: 'app-cadastro-usuario',
  imports: [
    Toast,
    InputText,
    FormsModule,
    Password,
    HttpClientModule,
    ButtonDirective
  ],
  providers: [MessageService],
  templateUrl: './cadastro-usuario.html',
  styleUrl: './cadastro-usuario.css',
})

export class CadastroUsuario {

  carregando = this.service.loading;

  usuario: UsuarioCadastroRequest = {
    nome: '',
    email: '',
    senha: ''
  };

  constructor(
  private service: UsuarioService,
  private msg: MessageService
  ) {
  }

  cadastrar(){
    this.service.criar(this.usuario).subscribe();
  }

}
