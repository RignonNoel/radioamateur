import { Component } from '@angular/core';
import { Button } from '../button/button';

@Component({
  selector: 'app-navbar',
  imports: [Button],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {}
