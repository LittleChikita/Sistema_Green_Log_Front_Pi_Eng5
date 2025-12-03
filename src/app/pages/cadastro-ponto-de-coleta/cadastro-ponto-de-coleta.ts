import {Component, OnInit} from '@angular/core';
import {MessageService} from 'primeng/api';
import {PontoDeColetaService} from '../../services/ponto-de-coleta-service';
import {PontoDeColetaRequest} from '../../models/PontoDeColetaRequest';
import {Toast} from 'primeng/toast';
import {ButtonDirective} from 'primeng/button';
import {Checkbox} from 'primeng/checkbox';
import {InputText} from 'primeng/inputtext';
import {NgForOf} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TipoResiduo} from '../../models/TipoResiduo';
import {AutoComplete} from 'primeng/autocomplete';
import {BairroResponse} from '../../models/BairroResponse';
import {ClassNames} from 'primeng/classnames';

@Component({
  selector: 'app-cadastro-ponto-de-coleta',
  imports: [
    Toast,
    ButtonDirective,
    Checkbox,
    InputText,
    NgForOf,
    ReactiveFormsModule,
    FormsModule,
    AutoComplete,
    ClassNames
  ],
  providers: [MessageService],
  templateUrl: './cadastro-ponto-de-coleta.html',
  styleUrl: './cadastro-ponto-de-coleta.css',
})
export class CadastroPontoDeColeta implements OnInit{

  carregando = this.service.loading;

  pontoDeColeta : PontoDeColetaRequest = {
    bairroId: null,
    nome: '',
    responsavel: '',
    telefoneResponsavel: '',
    emailResponsavel: '',
    endereco: '',
    tiposResiduos: [] as string[],
};

  tipos: TipoResiduo[] = [];

  bairros: BairroResponse[] = [];
  bairrosFiltrados: BairroResponse[] = [];
  bairroSelecionado!: BairroResponse;

  constructor(
    private service: PontoDeColetaService,
    private msg: MessageService
  ) {
  }

  ngOnInit(){
    this.service.getTiposResiduo().subscribe(lista =>{
      this.tipos = lista;
    })
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
    this.pontoDeColeta.bairroId = this.bairroSelecionado.id;
    this.service.criar(this.pontoDeColeta).subscribe();
    console.log(this.pontoDeColeta)
  }
}
