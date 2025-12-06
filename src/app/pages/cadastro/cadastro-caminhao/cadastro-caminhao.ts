import {Component, OnInit} from '@angular/core';
import {Toast} from 'primeng/toast';
import {MessageService} from 'primeng/api';
import {CaminhaoRequest} from '../../../models/CaminhaoRequest';
import {CaminhaoService} from '../../../services/caminhao-service';
import {ButtonDirective} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {Checkbox} from 'primeng/checkbox';
import {AutoComplete} from 'primeng/autocomplete';
import {NgForOf} from '@angular/common';
import {TipoResiduo} from '../../../models/TipoResiduo';
import {MotoristaResponse} from '../../../models/MotoristaResponse';

@Component({
  selector: 'app-cadastro-caminhao',
  imports: [
    Toast,
    ButtonDirective,
    FormsModule,
    InputText,
    Checkbox,
    NgForOf,
    AutoComplete,
  ],
  providers: [MessageService],
  templateUrl: './cadastro-caminhao.html',
  styleUrl: './cadastro-caminhao.css',
})
export class CadastroCaminhao implements OnInit{

  carregando = this.service.loading;

  caminhao: CaminhaoRequest = {
    placa: '',
    motorista_id: null,
    capacidade: null,
    tiposResiduos: [] as string[]
};

  tipos: TipoResiduo[] = [];

  motoristas: MotoristaResponse[] = [];
  motoristasFiltrados: MotoristaResponse[] = [];
  motoristaSelecionado!: MotoristaResponse;

  constructor(
    private service: CaminhaoService,
    private msg: MessageService
  ) {
  }

  ngOnInit(){
    this.service.getTiposResiduo().subscribe(lista =>{
      this.tipos = lista;
    })
    this.service.getMotoristas().subscribe({
      next: (mot) => {
        console.log(mot);
        this.motoristas = mot;
      }
    })
  }

  filtrarMotoristas(event: any) {
    const query = event.query.toLowerCase();
    this.motoristasFiltrados = this.motoristas.filter(m =>
      m.nome.toLowerCase().includes(query)
    );
  }

  cadastrar(){
    this.caminhao.motorista_id = this.motoristaSelecionado.id;
    this.service.criar(this.caminhao).subscribe();
    console.log(this.caminhao);
  }

}
