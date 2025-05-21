# Brainrot Monster Battle Mini-Game

A simple turn-based monster battle game, inspired by Pokemon and themed around the "Brainrot" meme concept. This game is built using the Phaser 3 game engine.

## How to Play

1.  **Objective:** Defeat the opponent's Brainrot Monster before they defeat yours!
2.  **Starting the Game:** The game loads with your monster on the left and the opponent's monster on the right. Health bars are displayed above each monster.
3.  **Taking Your Turn:**
    *   Your available moves are displayed as clickable text buttons at the bottom of the screen.
    *   Click on a move name to attack the opponent.
4.  **Opponent's Turn:** After your attack, the opponent will automatically counter-attack with one of its moves.
5.  **Winning/Losing:** The game ends when one monster's health reaches zero. A message will indicate if you've won or lost.

## How to Run/Develop

### Running the Game

1.  Clone or download the project files.
2.  Ensure you have `index.html` and `game.js` in the same directory.
3.  Open the `index.html` file in a modern web browser (e.g., Chrome, Firefox, Edge).
    *   The game relies on the Phaser 3 game engine, which is loaded from a CDN, so an internet connection is required for the first load or if your browser hasn't cached it.

### Development

*   The core game logic is located in `game.js`. You can modify this file to change game behavior, add new features, or customize assets.
*   For simple local development, opening `index.html` directly in your browser is often sufficient. If you encounter issues with asset loading (especially if you add many external files), running a simple local web server might be necessary. Many code editors (like VS Code with the "Live Server" extension) or Python's `http.server` module can provide this.

## Customizing Assets (Changing Monster Graphics)

Currently, the game uses simple colored squares as placeholders for the Brainrot Monsters. You can replace these with your own images:

1.  **Prepare Your Images:**
    *   Create or obtain the image files for your monsters (e.g., `.png`, `.jpg` format).
    *   Place these image files in the same directory as `index.html` and `game.js`, or create an `assets` subdirectory and place them there (e.g., `assets/player_monster.png`).

2.  **Load Images in `game.js`:**
    *   Open `game.js`.
    *   Find the `preload()` function within the Phaser scene configuration.
    *   Instead of or in addition to the `this.textures.generate(...)` lines, load your images using `this.load.image('uniqueKeyForPlayerImage', 'path/to/your/player_monster.png');` and `this.load.image('uniqueKeyForOpponentImage', 'path/to/your/opponent_monster.png');`.
        *   Replace `'uniqueKeyForPlayerImage'` with a unique name (e.g., `'playerMonsterImg'`).
        *   Replace `'path/to/your/player_monster.png'` with the actual path to your image file (e.g., `'player_monster.png'` if it's in the same directory, or `'assets/player_monster.png'` if it's in an `assets` subfolder).

3.  **Update Sprites in `game.js`:**
    *   In the `create()` function, find the lines where `this.playerMonsterSprite` and `this.opponentMonsterSprite` are created.
    *   Change the texture key from `'playerMonsterPlaceholder'` or `'opponentMonsterPlaceholder'` to the unique keys you defined in `preload()` (e.g., `'uniqueKeyForPlayerImage'`).
    *   Example: `this.playerMonsterSprite = this.add.sprite(150, 150, 'uniqueKeyForPlayerImage');`
    *   You might need to adjust the sprite's scale or the position of UI elements if your images have different dimensions than the placeholders. You can use `this.playerMonsterSprite.setScale(factor);` to resize sprites.

By following these steps, you can personalize the game with your chosen Brainrot meme visuals!
