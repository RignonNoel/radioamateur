import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [MatSnackBarModule, MatIconModule, MatButtonModule],
  templateUrl: './snackbar.html',
  styleUrls: ['./snackbar.scss'],
})
export class Snackbar implements OnInit {
  constructor(
    public sbRef: MatSnackBarRef<Snackbar>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any,
  ) {}
  ngOnInit() {}
}
