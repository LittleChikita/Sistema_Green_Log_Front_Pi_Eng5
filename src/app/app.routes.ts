import { Routes } from '@angular/router';
import {Grafo} from './grafo/grafo';
import {Itinerario} from './pages/principal/itinerario/itinerario';
import {Caminhao} from './pages/principal/caminhao/caminhao';
import {Rotas} from './pages/principal/rotas/rotas';
import {Motorista} from './pages/principal/motorista/motorista';
import {Bairro} from './pages/principal/bairro/bairro';
import {Rua} from './pages/principal/rua/rua';
import {PontoDeColeta} from './pages/principal/ponto-de-coleta/ponto-de-coleta';
import {Usuario} from './pages/principal/usuario/usuario';
import {Login} from './pages/principal/login/login';
import {authGuard} from './auth/auth-guard';
import {Home} from './pages/principal/home/home';

export const routes: Routes = [
  {path: 'usuarios',
  title: 'Usuarios',
    component: Usuario,
    canActivate: [authGuard]
  },
  {path: 'motoristas',
    title: 'Cadastro Motorista',
    component: Motorista,
    canActivate: [authGuard]
  },
  {path: 'pontosdecoleta',
    title: 'Pontos de Coleta',
    component: PontoDeColeta,
    canActivate: [authGuard]
  },
  {path: 'home',
    title: 'Inicio',
    component: Home,
    canActivate: [authGuard]
  },
  {path: 'ruas',
    title: 'Ruas',
    component: Rua,
    canActivate: [authGuard]
  },
  {path: 'rotas',
    title: 'Cadastro Rota',
    component: Rotas,
    canActivate: [authGuard]
  },
  {path: 'itinerarios',
    title: 'itinerario',
    component: Itinerario,
    canActivate: [authGuard]
  },
  {path: 'caminhoes',
    title: 'Caminhões',
    component: Caminhao,
    canActivate: [authGuard]
  },
  {path: 'bairros',
    title: 'Bairros',
    component: Bairro,
    canActivate: [authGuard]
  },
  {path: 'login',
    title: 'Login',
    component: Login
  }
];
