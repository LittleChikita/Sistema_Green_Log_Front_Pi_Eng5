import {Component, OnInit} from '@angular/core';
import {MessageService} from 'primeng/api';
import {RuaService} from '../../../services/rua-service';
import {RuaRequest} from '../../../models/RuaRequest';
import {BairroResponse} from '../../../models/BairroResponse';
import {Toast} from 'primeng/toast';
import {AutoComplete} from 'primeng/autocomplete';
import {ButtonDirective} from 'primeng/button';
import {InputText} from 'primeng/inputtext';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ClassNames} from 'primeng/classnames';

@Component({
  selector: 'app-cadastro-rua',
  imports: [
    Toast,
    AutoComplete,
    ButtonDirective,
    InputText,
    ReactiveFormsModule,
    FormsModule,
    ClassNames
  ],
  providers: [MessageService],
  templateUrl: './cadastro-rua.html',
  styleUrl: './cadastro-rua.css',
})
export class CadastroRua implements OnInit{

  carregando = this.service.loading;

  rua: RuaRequest = {
    destinoId: null,
    origemId: null,
    distancia: null
  };

  bairros: BairroResponse[] = [];

  bairrosFiltrados: BairroResponse[] = [];

  bairroOrigemSelecionado!: BairroResponse;
  bairroDestinoSelecionado!: BairroResponse;

  constructor(
    private service: RuaService,
    private msg: MessageService
  ) {
  }

  ngOnInit() {
    this.service.getBairros().subscribe({
      next: (bar) => {
        console.log(bar);
        this.bairros = bar;
      }
    })
  }

  filtrarBairros(event: any) {
    const query = event.query.toLowerCase();
    this.bairrosFiltrados = this.bairros.filter(m =>
      m.nome.toLowerCase().includes(query)
    );
  }

  cadastrar(){
    this.rua.origemId = this.bairroOrigemSelecionado.id;
    this.rua.destinoId = this.bairroDestinoSelecionado.id;
    this.service.criar(this.rua).subscribe();
    console.log(this.rua)
  }

}
