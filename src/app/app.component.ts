import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

const DIGITS = 4;
interface Guess {
  cows: number;
  bulls: number;
  n: number
}
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'cowsBulls';
  guess = signal('');
  answer = signal<number[]>([]);
  errorText = signal('');
  guessHistory = signal<Guess[]>([]);
  message = signal('');
  gameState = signal('init')
  constructor() { 
    this.reset();
  }

  

  inputChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.guess.set(value);
  }
  guessNumber() {
    this.errorText.set('');
    if (this.guess().length !== DIGITS) {
      this.errorText.set(`you must enter ${DIGITS} uniquedigits only`);
      return;
    }

    const digits = this.guess()
      .split('')
      .map((s) => +s);
    const digitsSet = new Set(digits);
    if (digitsSet.size !== DIGITS) {
      this.errorText.set(`u must enter unique ${DIGITS} digits`);
      return;
    }
    const [bulls, cows] = this.bullsCows(digits, this.answer());
   
    this.guessHistory.update((h) => {
      h.push({n: +digits.map(n => n.toString()).join('') ,bulls, cows});
      return h;
    });
    if(bulls === DIGITS) {
      this.message.set(`you won!! num of tries = ${this.guessHistory().length} `)
    }
  }

  bullsCows(guess: number[], answer: number[]) {
    let bulls = 0;
    let cows = 0;
    const n = guess.length;
    const bullsUsed = new Set<number>();

    for (let i = 0; i < n; i++) {
      if (guess[i] === answer[i]) {
        bulls++;
        bullsUsed.add(i);
      }
    }
    for (let i = 0; i < n; i++) {
      if (!bullsUsed.has(i) && answer.includes(guess[i])) {
        cows++;
      }
    }
    return [bulls, cows];
  }

  reset() {
    this.gameState.set('init');
    this.guessHistory.set([]);
    this.errorText.set('');
    this.guess.set('');
    while (true) {
      const digits = [];
      for (let i = 0; i < DIGITS; i++) {
        digits.push(Math.floor(Math.random() * 9));
      }

      if (digits[0] === 0) {
        continue;
      }

      const digitsSet = new Set(digits);

      if (digitsSet.size === DIGITS) {
        this.answer.set(digits);    
        console.log(this.answer());
            
        break;
      }
    }
  }
}
