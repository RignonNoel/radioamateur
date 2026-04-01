import { Component } from '@angular/core';
import { Button } from '../../shared/button/button';
import { Loader } from '../../shared/loader/loader';
import { Hero } from '../../shared/hero/hero';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Button, Loader, Hero],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}
