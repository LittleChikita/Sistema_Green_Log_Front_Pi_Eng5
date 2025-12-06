import {Component, OnInit, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MenuUtils} from './utils/menu-utils/menu-utils';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MenuUtils],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('SistemaGreenLogFront');
}
