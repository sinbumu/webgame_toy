/**
 * @class BrainrotMonster
 * Represents a monster in the game with health, attack power, and moves.
 */
class BrainrotMonster {
    /**
     * Creates an instance of BrainrotMonster.
     * @param {string} name - The name of the monster.
     * @param {number} health - The initial and maximum health of the monster.
     * @param {number} attackPower - The base attack power of the monster.
     */
    constructor(name, health, attackPower) {
        this.name = name;
        this.health = health;
        this.attackPower = attackPower;
        this.maxHealth = health;
        this.moves = []; // Stores the moves this monster can use
    }

    /**
     * Adds a new move to the monster's repertoire.
     * @param {string} moveName - The name of the move.
     * @param {number} movePower - The power rating of the move.
     */
    addMove(moveName, movePower) {
        this.moves.push({ name: moveName, power: movePower });
    }
}

/**
 * Updates the health display text for both player and opponent monsters.
 * This function is bound to the scene's context in `create()`.
 */
function updateHealthDisplays() {
    if (this.playerHealthText) {
        this.playerHealthText.setText(`${this.playerMonster.name} Health: ${this.playerMonster.health} / ${this.playerMonster.maxHealth}`);
    }
    if (this.opponentHealthText) {
        this.opponentHealthText.setText(`${this.opponentMonster.name} Health: ${this.opponentMonster.health} / ${this.opponentMonster.maxHealth}`);
    }
}

/**
 * Handles an attack from one monster to another.
 * Calculates damage, updates health, triggers animations, and manages turn switching.
 * This function is bound to the scene's context in `create()`.
 * @param {BrainrotMonster} attacker - The monster performing the attack.
 * @param {BrainrotMonster} target - The monster receiving the attack.
 * @param {number} moveIndex - The index of the move being used from the attacker's move list.
 * @param {Phaser.GameObjects.Sprite} attackerSprite - The sprite of the attacking monster.
 * @param {Phaser.GameObjects.Sprite} targetSprite - The sprite of the target monster.
 */
function handleAttack(attacker, target, moveIndex, attackerSprite, targetSprite) {
    if (this.gameOver) return; // Stop attacks if game is over

    if (!attacker.moves || moveIndex < 0 || moveIndex >= attacker.moves.length) {
        console.error(`${attacker.name} has no moves or invalid move index ${moveIndex} selected.`);
        return;
    }

    const move = attacker.moves[moveIndex];
    // For now, simple damage calculation
    const damage = attacker.attackPower + move.power;
    target.health -= damage;
    if (target.health < 0) {
        target.health = 0;
    }

    console.log(`${attacker.name} used ${move.name} on ${target.name} for ${damage} damage. ${target.name} health is now ${target.health}.`);

    if (target.health === 0) {
        console.log(`${target.name} has been defeated!`);
        // Future: Trigger win/loss state
    }

    // Switch turns
    this.isPlayerTurn = !this.isPlayerTurn;

    // Update health display after attack
    this.updateHealthDisplays();

    // Simple attack animation for the target
    if (targetSprite) {
        this.tweens.add({
            targets: targetSprite,
            alpha: 0.5,
            duration: 100,
            yoyo: true,
            ease: 'Power1' // Phaser.Math.Easing.Power1 (if using class based)
        });
    }
    
    if (target.health === 0) {
        console.log(`${target.name} has been defeated!`);
        this.gameOver = true; // Set game over flag
        
        let resultText = (this.playerMonster.health === 0) ? 'Game Over! You were defeated.' : 'Congratulations! You defeated the opponent.';
        let resultColor = (this.playerMonster.health === 0) ? '#ff0000' : '#00ff00';
        this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, resultText, { 
            fontSize: '32px', 
            fill: resultColor, 
            backgroundColor: 'rgba(0,0,0,0.7)', 
            padding: { x: 20, y: 10 } 
        }).setOrigin(0.5);
        
        // Make move texts non-interactive
        if (this.playerMonsterMoveTexts) {
            this.playerMonsterMoveTexts.forEach(text => text.disableInteractive());
        }
        return; // Stop further processing like opponent's turn
    }
    
    if (target.health > 0 && !this.gameOver) { 
        console.log("It's now " + (this.isPlayerTurn ? "Player's" : "Opponent's") + " turn.");
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800, // Game canvas width in pixels
    height: 600, // Game canvas height in pixels
    parent: 'phaser-game', // ID of the HTML element to render the game in
    scene: {
        preload: preload, // Function to run for preloading assets
        create: create,   // Function to run once assets are loaded, for setting up the game
        update: update    // Function to run every frame (game loop)
        // Note: handleAttack and updateHealthDisplays are bound to the scene context in create()
    }
};

// Initialize the Phaser Game instance
const game = new Phaser.Game(config);

/**
 * Phaser Scene Method: preload
 * This function is called first by Phaser. It's used to load assets like images, audio, etc.
 * In this game, it's also used to dynamically generate textures for monster placeholders.
 */
function preload() {
    // Generate placeholder textures for monsters
    this.textures.generate('playerMonsterPlaceholder', { data: ['#0000FF'], pixelWidth: 64, pixelHeight: 64 }); // Blue square for player
    this.textures.generate('opponentMonsterPlaceholder', { data: ['#FF0000'], pixelWidth: 64, pixelHeight: 64 }); // Red square for opponent
}

/**
 * Phaser Scene Method: create
 * This function is called after `preload` has completed. It's used to set up the game scene,
 * create game objects (sprites, text, etc.), and initialize game state.
 */
function create() {
    // --- Game State Variables ---
    this.isPlayerTurn = true;  // Boolean to track whose turn it is
    this.gameOver = false;     // Boolean to track if the game has ended

    // --- Monster Initialization ---
    // Create instances of BrainrotMonster for the player and opponent
    this.playerMonster = new BrainrotMonster('Player Brainrot', 100, 25); // Key property for player's monster
    this.opponentMonster = new BrainrotMonster('Enemy Brainrot', 120, 20); // Key property for opponent's monster

    // Add moves to the monsters
    this.playerMonster.addMove('Meme Beam', 30);
    this.playerMonster.addMove('Logic Bomb', 35);
    this.opponentMonster.addMove('Confuse Ray', 25);
    this.opponentMonster.addMove('Distraction Dance', 20);

    // Turn Management Variable
    this.isPlayerTurn = true;

    // Bind helper functions to the scene's context so `this` refers to the scene inside them
    this.handleAttack = handleAttack.bind(this);
    this.updateHealthDisplays = updateHealthDisplays.bind(this);

    // --- Visual Setup (Sprites & UI Text) ---
    // Display Monster Sprites (placeholders)
    this.playerMonsterSprite = this.add.sprite(150, 250, 'playerMonsterPlaceholder');
    this.opponentMonsterSprite = this.add.sprite(650, 250, 'opponentMonsterPlaceholder');

    // UI Text for Monster Information (Health)
    this.playerHealthText = this.add.text(this.playerMonsterSprite.x, this.playerMonsterSprite.y - 50, '', { 
        fontSize: '20px', fill: '#fff', backgroundColor: 'rgba(0,0,0,0.5)' 
    }).setOrigin(0.5);
    this.opponentHealthText = this.add.text(this.opponentMonsterSprite.x, this.opponentMonsterSprite.y - 50, '', { 
        fontSize: '20px', fill: '#fff', backgroundColor: 'rgba(0,0,0,0.5)' 
    }).setOrigin(0.5);
    
    // Initialize health display
    this.updateHealthDisplays();

    // UI Text for Player's Moves (Clickable)
    const movePanelX = this.cameras.main.centerX; // Horizontal center of the game camera
    const movePanelY = this.cameras.main.height - 100; // 100px from the bottom
    this.playerMonsterMoveTexts = []; // Store move texts to disable them later if game over

    this.playerMonster.moves.forEach((move, index) => {
        const moveText = this.add.text(movePanelX, movePanelY + (index * 40), `${move.name} (Power: ${move.power})`, { 
            fontSize: '20px', 
            fill: '#00ff00', 
            backgroundColor: '#333333',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        
        this.playerMonsterMoveTexts.push(moveText);

        moveText.on('pointerdown', () => {
            if (this.gameOver || !this.isPlayerTurn) return; // Check if it's player's turn
            
            console.log(`Player clicked ${move.name}`);
            // Pass sprites to handleAttack for animation
            this.handleAttack(this.playerMonster, this.opponentMonster, index, this.playerMonsterSprite, this.opponentMonsterSprite);

            // Check if opponent is defeated before counter-attacking
            if (this.opponentMonster.health > 0 && !this.gameOver) {
                // Simple delay for opponent's turn using Phaser's timer
                this.time.delayedCall(1000, () => {
                    if (this.gameOver) return; // Check again in case player won on their last hit
                    console.log("Opponent's turn (automatic)");
                    // Opponent uses its first move, pass sprites for animation
                    this.handleAttack(this.opponentMonster, this.playerMonster, 0, this.opponentMonsterSprite, this.playerMonsterSprite);
                }, [], this);
            }
        });

        moveText.on('pointerover', () => { 
            if (!this.gameOver && this.isPlayerTurn) moveText.setStyle({ fill: '#ffff00' }); 
        });
        moveText.on('pointerout', () => { 
            if (!this.gameOver && this.isPlayerTurn) moveText.setStyle({ fill: '#00ff00' }); 
        });
    });
    
    // Initial State Log (console)
    console.log("Initial Stats:");
    console.log(`Player: ${this.playerMonster.name} | HP: ${this.playerMonster.health}/${this.playerMonster.maxHealth} | Attack Power: ${this.playerMonster.attackPower}`);
    this.playerMonster.moves.forEach(m => console.log(`- Move: ${m.name}, Power: ${m.power}`));
    
    console.log(`Opponent: ${this.opponentMonster.name} | HP: ${this.opponentMonster.health}/${this.opponentMonster.maxHealth} | Attack Power: ${this.opponentMonster.attackPower}`);
    this.opponentMonster.moves.forEach(m => console.log(`- Move: ${m.name}, Power: ${m.power}`));

    console.log("Battle Start! It's " + (this.isPlayerTurn ? "Player's" : "Opponent's") + " turn.");
}

function update() {
    // Game loop logic can be added here if needed, e.g., continuous effects or checks.
    // For this turn-based game, most logic is event-driven from player input.
}

/*
Deployment Instructions:

To deploy this game, you typically need to:
1. Ensure both `index.html` and `game.js` are in the same directory.
2. Upload this directory (containing both files) to any static web hosting service
   (e.g., GitHub Pages, Netlify, Vercel, or a simple web server like Python's http.server).
3. Access the `index.html` file through the web host's URL (e.g., https://yourusername.github.io/your-repo-name/).

No build step is strictly necessary for this simple version because:
- Phaser 3 is loaded from a CDN (Content Delivery Network).
- Visual assets (monster placeholders) are currently generated procedurally by the code.

If you were to add external image or audio assets (e.g., .png or .mp3 files):
- You would place them in an `assets` subdirectory (conventionally).
- You would load them in the `preload()` function using `this.load.image()` or `this.load.audio()`.
- Ensure these asset files and their directory structure are uploaded to your web host along with
  `index.html` and `game.js`. The paths used in your `preload()` calls must match the paths
  on the server.

Example of serving locally for testing (requires Python 3):
1. Open a terminal in the directory containing `index.html` and `game.js`.
2. Run the command: `python -m http.server`
3. Open your web browser and go to `http://localhost:8000` (or the port shown in the terminal).
*/
