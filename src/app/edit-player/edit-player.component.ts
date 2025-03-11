import { Component } from '@angular/core';
import { MatDialogActions, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-edit-player',
  standalone: true,
  imports: [MatDialogActions, MatDialogClose, MatButtonModule],
  templateUrl: './edit-player.component.html',
  styleUrl: './edit-player.component.scss'
})
export class EditPlayerComponent {

  constructor(public dialogRef: MatDialogRef<EditPlayerComponent>) {}

  allProfilePictures = [
    'female_01.png',
    'male_01.png',
    'diverse_01.png',
    'female_02.png',
    'male_02.png',
    'other_01.png',
    'other_02.png',
    'other_03.png',
    'other_04.png'
  ];

}
