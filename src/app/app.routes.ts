import { Routes } from '@angular/router';
import {CadastroUsuario} from './pages/cadastro-usuario/cadastro-usuario';
import {CadastroMotorista} from './pages/cadastro-motorista/cadastro-motorista';
import {CadastroCaminhao} from './pages/cadastro-caminhao/cadastro-caminhao';
import {CadastroPontoDeColeta} from './pages/cadastro-ponto-de-coleta/cadastro-ponto-de-coleta';
import {CadastroRua} from './pages/cadastro-rua/cadastro-rua';
import {CadastroRota} from './pages/cadastro-rota/cadastro-rota';

export const routes: Routes = [
  {path: 'cadastro',
  title: 'Cadastro Usuario',
    component: CadastroUsuario
  },
  {path: 'cadastromotorista',
    title: 'Cadastro Motorista',
    component: CadastroMotorista
  },
  {path: 'cadastrocaminhao',
    title: 'Cadastro Caminhao',
    component: CadastroCaminhao
  },
  {path: 'cadastropontocoleta',
    title: 'Cadastro Ponto de Coleta',
    component: CadastroPontoDeColeta
  },
  {path: 'cadastrorua',
    title: 'Cadastro Rua',
    component: CadastroRua
  },
  {path: 'cadastrorota',
    title: 'Cadastro Rota',
    component: CadastroRota
  }
];
