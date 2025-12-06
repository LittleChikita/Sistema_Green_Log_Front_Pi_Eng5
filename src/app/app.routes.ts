import { Routes } from '@angular/router';
import {CadastroUsuario} from './pages/cadastro/cadastro-usuario/cadastro-usuario';
import {CadastroMotorista} from './pages/cadastro/cadastro-motorista/cadastro-motorista';
import {CadastroCaminhao} from './pages/cadastro/cadastro-caminhao/cadastro-caminhao';
import {CadastroPontoDeColeta} from './pages/cadastro/cadastro-ponto-de-coleta/cadastro-ponto-de-coleta';
import {CadastroRua} from './pages/cadastro/cadastro-rua/cadastro-rua';
import {CadastroRota} from './pages/cadastro/cadastro-rota/cadastro-rota';
import {Grafo} from './grafo/grafo';
import {Itinerario} from './pages/itinerario/itinerario';
import {Caminhao} from './pages/principal/caminhao/caminhao';

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
  },
  {path: 'grafo',
    title: 'Grafo',
    component: Grafo
  },
  {path: 'itinerario',
    title: 'itinerario',
    component: Itinerario
  },
  {path: 'caminhao',
    title: 'Caminhões',
    component: Caminhao
  }
];
