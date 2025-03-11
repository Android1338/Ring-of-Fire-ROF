import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
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
import { Firestore, collection, collectionData, doc, docData, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { PlayerMobileComponent } from "../player-mobile/player-mobile.component";
import { EditPlayerComponent } from '../edit-player/edit-player.component';



@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, PlayerComponent, MatButtonModule, MatDividerModule, MatIconModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatDialogModule, GameInfoComponent, PlayerMobileComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})



export class GameComponent implements OnInit {
  game: Game = new Game();
  collectionName = "games";
  singleItems$: Observable<any[]>;
  gameId: string | undefined;
  singleDocument: any;
  public gameData: any;
  unsubGameData: any;
  gameOver = false;

  

  constructor(private route: ActivatedRoute, private firestore: Firestore, public dialog: MatDialog) {
    const collectionOfItems = collection(this.firestore, this.collectionName);
    this.singleItems$ = collectionData(collectionOfItems);
  }


  ngOnInit(): void {
    this.newGame();

    this.route.params.subscribe(params => {
      this.gameId = params['gameId'];

      if(this.gameId) {
        const docRef = doc(this.firestore,`${this.collectionName}/${this.gameId}`);

        this.unsubGameData = docData(docRef).subscribe((game:any) => {
          this.gameData = game;
          this.game.currentPlayer = game.currentPlayer;
          this.game.playedCards = game.playedCards;
          this.game.players = game.players;
          this.game.playerImages = game.playerImages;
          this.game.stack = game.stack;
          this.game.pickCardAnimation = game.pickCardAnimation;
          this.game.currentCard = game.currentCard;
        })
      }
    });
  }

  editPlayer(playerIndex:number) {
    console.log('Player', playerIndex)
    
    const dialogRef = this.dialog.open(EditPlayerComponent);

    dialogRef.afterClosed().subscribe(change => {
      if(change) {
        if(change === 'DELETE') {
          this.game.players.splice(playerIndex,1);
          this.game.playerImages.splice(playerIndex,1);
          this.saveGame();
        }
        else {
          this.game.playerImages[playerIndex] = change;
          this.saveGame();
        }
      }
    });
  }

  newGame() {
    this.game;
    this.openDialog();
  }

  async getSingleGameData() {
    if (!this.gameId) {
      console.error("Keine Game-ID gefunden!");
      return;
    }
  }


  takeCard() {
    if (!this.game.pickCardAnimation) {
      if (this.game.stack.length > 0) {
        const drawnCard = this.game.stack.pop();
  
        if (drawnCard !== undefined) {
          this.game.currentCard = drawnCard;
          this.game.pickCardAnimation = true;
          this.saveGame();
  
          setTimeout(() => {
            this.game.pickCardAnimation = false;       
            this.game.playedCards.push(this.game.currentCard);

            if(this.game.currentPlayer+1 >= this.game.players.length) {
              this.game.currentPlayer = 0;
              this.saveGame();
            }
            else {
              this.game.currentPlayer++;
              this.saveGame();
            }
          }, 1000);
        }
      }
      else {
        this.gameOver = true;
      }
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe(change => {
      if(change) {
        this.game.players.push(change);
        this.game.playerImages.push('default.png')
        this.saveGame();
      }
      if(this.game.players.length < 2) {
        this.openDialog(); }
    });
}

saveGame() {
  const gameRef = doc(this.firestore, `${this.collectionName}/${this.gameId}`);
  
  updateDoc(gameRef, this.game.toJson())
    .then(() => {
    })
    .catch((err) => {
      console.error("Fehler beim Speichern des Spiels: ", err);
    });
    
}
}
