import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, inject } from '@angular/core';
import { Game } from '../../models/game';
import { PlayerComponent } from "../player/player.component";
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { MatDialogModule } from '@angular/material/dialog';
import { GameInfoComponent } from "../game-info/game-info.component"; 
import { Firestore, collection, collectionData, addDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, PlayerComponent, MatButtonModule, MatDividerModule, MatIconModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatDialogModule, GameInfoComponent, AsyncPipe],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent implements OnInit {
  items$: Observable<any[]>; // Typisiere hier entsprechend deiner Bedürfnisse
  pickCardAnimation:boolean = false;
  game: Game = new Game();
  itemsCollection:any;
  currentCard: string = '';

  constructor(public firestore: Firestore, public dialog: MatDialog) {
    const itemsCollection = collection(this.firestore, 'games');
    this.items$ = collectionData(itemsCollection);
  }

  ngOnInit(): void {
    this.newGame();
    this.openDialog();

    this.itemsCollection = collection(this.firestore, 'games'); // Bestimme die Collection hier
    this.items$ = collectionData(this.itemsCollection); // Verknüpfe die Observable mit der Collection

    this.items$.subscribe(data => {
      console.log('Game update', data)
    });
  }

  newGame() {
    this.game;
  }


  takeCard() {
    if (!this.pickCardAnimation) {
      if (this.game.stack.length > 0) {
        const drawnCard = this.game.stack.pop();
  
        if (drawnCard !== undefined) {
          this.currentCard = drawnCard;
          this.pickCardAnimation = true;
  
          setTimeout(() => {
            this.pickCardAnimation = false;
            this.game.playedCards.push(this.currentCard);

            if(this.game.currentPlayer+1 >= this.game.players.length) {
              this.game.currentPlayer = 0;
            }
            else {
              this.game.currentPlayer++;
            }
          }, 1000);
        }
      }
      else {
        console.log("Spiel beendet!");
      }
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe(playerName => {
      if(playerName) {
        this.game.players.push(playerName)
      }
      if(this.game.players.length < 2) {
        this.openDialog(); }
    });

}
}