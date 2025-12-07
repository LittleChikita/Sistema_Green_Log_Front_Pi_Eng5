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
    { label: 'Início', icon: 'pi pi-home', routerLink: '' },
    { label: 'Rotas', icon: 'pi pi-map', routerLink: '/rotas' },
    { label: 'Caminhões', icon: 'pi caminhao-icon', routerLink: '/caminhoes' },
  ];
}
