import { Component } from '@angular/core';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Game } from '../../models/game';

@Component({
  selector: 'app-start-screen',
  standalone: true,
  imports: [],
  templateUrl: './start-screen.component.html',
  styleUrl: './start-screen.component.scss'
})
export class StartScreenComponent {
  private game: Game;

  constructor(private firestore: Firestore, private router: Router) {
    this.game = new Game();
  }

  newGame() {
    const gameData = this.game.toJson();
    const docRef = addDoc(collection(this.firestore, "games"), gameData).then((gameInfo: any) => {
        this.router.navigateByUrl(`/game/${gameInfo.id}`);
    });
}
}
