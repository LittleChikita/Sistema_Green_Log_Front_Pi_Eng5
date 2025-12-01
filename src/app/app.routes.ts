import { Routes } from '@angular/router';
import {CadastroUsuario} from './pages/cadastro-usuario/cadastro-usuario';
import {CadastroMotorista} from './pages/cadastro-motorista/cadastro-motorista';
import {CadastroCaminhao} from './pages/cadastro-caminhao/cadastro-caminhao';

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
  }
];
