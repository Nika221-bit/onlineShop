import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Page1 } from "./page1/page1";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Page1],
  templateUrl: './app.html',
  styleUrls: ['./app.sass']
})
export class App {
  protected readonly title = signal('onlineShop');



}
