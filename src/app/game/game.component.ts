import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Game } from '../../models/game';
import { PlayerComponent } from "../player/player.component";
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, PlayerComponent, MatButtonModule, MatDividerModule, MatIconModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent implements OnInit {

  pickCardAnimation:boolean = false;
  game: Game = new Game();
  currentCard: string = '';

  constructor() {}

  ngOnInit(): void {
    this.newGame();
    console.log(this.game)
  }

  takeCard() {
    if (!this.pickCardAnimation) {
      if (this.game.stack.length > 0) {
        const drawnCard = this.game.stack.pop();
  
        if (drawnCard !== undefined) {
          this.currentCard = drawnCard;
          this.pickCardAnimation = true;
          console.log('Current card:',this.currentCard);
          console.log('Game:',this.game);
  
          setTimeout(() => {
            this.pickCardAnimation = false;
            this.game.playedCards.push(this.currentCard);
          }, 1000);
        }
      }
      else {
        console.log("Spiel beendet!");
      }
    }
  }

  newGame() {
    this.game;
  }

}
