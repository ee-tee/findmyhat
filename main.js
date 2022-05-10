/* ---------------------------------------------------------------------------------------
JavaScript Assessment: Find Your -H̶a̶t̶  Heart Game
--------------------------------------------------------------------------------------- *//*

Description: 
This is my modded version of the Find Your Hat challenge project (JavaScript). 
I hope you will enjoy playing this! ^_^

Instructions: (IMPORTANT!)

Before we begin, please install the following npm packages for the best user experience.
These are all necessary for this JavaScript application to run properly.

1) npm install prompt-sync
2) npm install clear-screen
3) npm install --save print-message

*//* -------------------------------------------------------------------------------------
Variables, Packages and Modules
--------------------------------------------------------------------------------------- */

const prompt = require('prompt-sync')({sigint: true});
const clear = require('clear-screen');
const printMessage = require('print-message');
 
const hat = '♥';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '☻';
const row = 10;
const col = 10;

/* ---------------------------------------------------------------------------------------
Field Class
Setting up the field constructor and methods for the game to run.

generateField Method:
1) Create a 10x10 field and dig some holes at random locations.
2) Player starts at [0][0] location by default.
3) The heart(hat) will be at a random location with the exception of [0][0].

runGame Method:
1) Scenario #1 - Game over if the player went out of bounds and crashed into the wall.
2) Scenario #2 - Game over if the player fell into a hole.
3) Scenario #3 - Game completed successfully if the player found the heart(hat).
4) Update the player's current location on the map according to the player's option.
5) Display result for all three scenarios and prompt the player to restart a new game or exit the game.

print Method:
1) Clear the screen and remove all previously printed messages in the console.
2) Display field map.

askQuestion Method:
1) My version of the game is configured to the WASD keyboard keys for direction controls.
2) Controls: W (up), S (down), A (left) or D (right).
3) If the player enters an invalid key, prompt to enter WASD.
4) Player's current location on the map will be updated according to the direction entered.
5) Player's previous location will be changed back to an empty spot (fieldCharacter) for clarity.

getWall, getHole and getHat Methods:
1) Get the location value of walls, holes and heart(hat) on the current map as checkpoints for the runGame method.
--------------------------------------------------------------------------------------- */

class Field {

	constructor(field = []) {

    this.field = field;
    this.locationX = 0;
    this.locationY = 0;

		for (let a = 0; a < row; a++) {
			this.field[a] = [];
		}
		
		this.generateField();

	}
	
	generateField() {

    let holePercentage = 0.3;
    let field = [];

		for (let y = 0; y < row; y++) {
			for (let x = 0; x < col; x++) {

        //Setting up the field
				this.field[y][x] = fieldCharacter;

        //Digging holes
        const prob = Math.random();
        this.field[y][x] = prob > holePercentage ? fieldCharacter : hole;
            
			}            
		}

    //Sending player to the default starting point
    this.field[0][0] = pathCharacter;

    //Hiding the heart(hat)
    let hatY = Math.floor(Math.random() * row);
    let hatX = Math.floor(Math.random() * col);
    if (hatY == 0 && hatX == 0) {
      this.field[Math.floor(Math.random() * row)][Math.floor(Math.random() * col)] = hat;
    } else {
      this.field[hatY][hatX] = hat;
    }

    return field;

	}

	runGame() {
        
    let playing = true;
    while (playing) {

        //Update the player's current location on the map
        this.field[this.locationY][this.locationX] = pathCharacter;
        
        //Display map and ask the player for a direction
        this.print();
        this.askQuestion();

        //Scenario #1: Player hit a wall or went beyond the field boundaries -> GAME OVER!
          if (!this.getWall()) {
            printMessage(["Oops, out of bounds. GAME OVER!"]);
            const replayGame = prompt("Insert coin to play again: Y/N? -- Enter key: ").toUpperCase();
              switch (replayGame) {
              case "Y":
                startNewGame()
                break;
              case "N":
                process.exit()
                break;
              }
            playing = false;
            break;
            } 
        
        //Scenario #2: Player fell into a hole -> GAME OVER!
          else if (this.getHole()) {
            printMessage(["Sorry, you fell down a hole. GAME OVER!"]);
            const replayGame = prompt("Insert coin to play again: Y/N? -- Enter key: ").toUpperCase();
              switch (replayGame) {
              case "Y":
                startNewGame()
                break;
              case "N":
                process.exit()
                break;
              }
            playing = false;
            break;
            } 
        
        //Scenario #3: Player found the heart(hat) -> Success!
          else if (this.getHat()) {
            printMessage(["Congrats, you found love! ♥"]);
            const replayGame = prompt("Insert coin to play again: Y/N? -- Enter key: ").toUpperCase();
              switch (replayGame) {
              case "Y":
                startNewGame()
                break;
              case "N":
                process.exit()
                break;
              }
            playing = false;
            break;
          }
    }
	}

	print() {

		clear();
		const displayString = this.field.map(row => {
			return row.join('');
	    }).join('\n');
	    console.log(displayString);

	}

	askQuestion() {
	
		const answer = prompt("Which way to go? Enter direction: ").toUpperCase();

      switch (answer) {
          case "W":
            this.field[this.locationY][this.locationX] = fieldCharacter;
            this.locationY -= 1;
            break;
          case "S":
            this.field[this.locationY][this.locationX] = fieldCharacter;
            this.locationY += 1;
            break;
          case "A":
            this.field[this.locationY][this.locationX] = fieldCharacter;
            this.locationX -= 1;
            break;
          case "D":
            this.field[this.locationY][this.locationX] = fieldCharacter;
            this.locationX += 1;
            break;
          default:
            console.log("Invalid key. Please enter W (up), S (down), A (left) or D (right).");
            this.askQuestion();
            break;
        }
	}

    getWall() {
        return (
          this.locationY >= 0 &&
          this.locationX >= 0 &&
          this.locationY < this.field.length &&
          this.locationX < this.field[0].length
        );
      }

    getHat() {
      return this.field[this.locationY][this.locationX] === hat;
    }
    
    getHole() {
      return this.field[this.locationY][this.locationX] === hole;
    }

} //End of Field class

/* ---------------------------------------------------------------------------------------
TitleScreen Class
Setting up a welcome page / game title screen for players to start or exit the game.
1) If "Y" is entered, run the game.
2) If "N" is entered, exit the app.
3) If other keys are entered, refresh the game title screen and repeat the question.
--------------------------------------------------------------------------------------- */

class TitleScreen {

  newGame() {

    clear();
    printMessage([
      "            ♥ FIND YOUR HEART GAME ♥            ",
      "",
      "Poor you, so sad and lonely. Go find some love!",
      "",
      "Controls:",
      "Up = W key",
      "Down = S key",
      "Left = A key",
      "Right = D key"

    ]);

    // const newGameStart = prompt("Start a new game: Y/N? -- Enter key: ").toUpperCase();
    const newGameStart = prompt("Start a new game: Y/N? -- Enter key: ").toUpperCase();
      switch (newGameStart) {
        case "Y":
          startNewGame()
          break;
        case "N":
          process.exit()
          break;
        default:
          this.newGame();
          break;
        }

  }
  
} //End of TitleScreen Class

/* ---------------------------------------------------------------------------------------
Let the fun begin!
1) Instantiate TitleScreen class, players can choose to start or exit at the welcome page.
2) Instantiate Field class and runGame method to run the game.
--------------------------------------------------------------------------------------- */

const myTitle = new TitleScreen();
myTitle.newGame();

function startNewGame() {
  const myField = new Field();
  myField.runGame();
}

/* ---------------------------------------------------------------------------------------
The End!
--------------------------------------------------------------------------------------- */