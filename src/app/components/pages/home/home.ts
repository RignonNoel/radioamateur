import { Component } from '@angular/core';
import { Button } from '../../shared/button/button';
import { Loader } from '../../shared/loader/loader';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Button, Loader],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}
