import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../../shared/navbar/navbar';

@Component({
  selector: 'app-default',
  imports: [RouterOutlet, Navbar],
  templateUrl: './default.html',
  styleUrl: './default.scss',
})
export class Default {}
