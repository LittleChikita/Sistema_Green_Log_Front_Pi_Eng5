import { Component } from '@angular/core';
import {Menubar} from 'primeng/menubar';

@Component({
  selector: 'app-menu-utils',
  imports: [
    Menubar
  ],
  templateUrl: './menu-utils.html',
  styleUrl: './menu-utils.css',
})
export class MenuUtils {
  items = [
    { label: 'Início', icon: 'pi pi-home', routerLink: '/home' },
    { label: 'Usuários', icon: 'pi pi-users', routerLink: '/usuarios' },
    { label: 'Rotas', icon: 'pi pi-map', routerLink: '/rotas' },
    { label: 'Caminhões', icon: 'pi pi-truck', routerLink: '/caminhoes' },
    { label: 'Motoristas', icon: 'pi pi-user', routerLink: '/motoristas' },
    { label: 'Bairros', icon: 'pi pi-warehouse', routerLink: '/bairros' },
    { label: 'Ruas', icon: 'pi pi-arrow-circle-up', routerLink: '/ruas' },
    { label: 'Pontos de Coleta', icon: 'pi pi-flag', routerLink: '/pontosdecoleta' },
    { label: 'Pontos de Coleta', icon: 'pi pi-flag', routerLink: '/itinerarios' },
  ];
}
