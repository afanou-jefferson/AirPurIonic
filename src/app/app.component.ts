import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    // { title: 'Map', url: '/home/map', icon: 'locate' }
    { title: 'Map', url: '/home/map', icon: 'locate' },
    { title: 'Archived', url: '/folder/Archived', icon: 'archive' },
    { title: 'Favoris', url: '/folder/Trash', icon: 'star' },
    { title: 'Spam', url: '/folder/Spam', icon: 'warning' },
  ];
  constructor() { }
}
