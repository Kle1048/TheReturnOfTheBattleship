import { VGARenderer } from "./engine/render/renderer";
import { GameLoop } from "./engine/loop";
import { InputManager } from "./engine/input";
import { AudioEngine } from "./engine/audio";
import { Game, GameState } from "./game/game";
import { GameRenderer } from "./game/renderer";
import { assets } from "./assets/assets";

const canvas = document.getElementById("screen") as HTMLCanvasElement;
if (!canvas) throw new Error("Canvas not found");

const renderer = new VGARenderer(canvas);
const input = new InputManager();
const audio = new AudioEngine();

// Load assets before creating game
let game: Game;
let gameRenderer: GameRenderer;

async function init() {
  // Lade alle Sprites
  await assets.loadAll();
  
  // Erstelle Game mit geladenen Sprites
  const playerSprite = assets.getPlayerSprite();
  game = new Game(playerSprite);
  gameRenderer = new GameRenderer();
}

// Warte bis Assets geladen sind, dann starte Game Loop
init().then(() => {
  loop.start();
}).catch(console.error);

// Resume audio on first interaction
let audioStarted = false;
const startAudio = () => {
  if (!audioStarted) {
    audio.resume();
    audioStarted = true;
  }
};

canvas.addEventListener("click", startAudio);
canvas.addEventListener("touchstart", startAudio);
window.addEventListener("keydown", startAudio);

// Input handling
function getInput() {
  const moveUp = input.isKeyDown("KeyW") || input.isKeyDown("ArrowUp");
  const moveDown = input.isKeyDown("KeyS") || input.isKeyDown("ArrowDown");
  const moveLeft = input.isKeyDown("KeyA") || input.isKeyDown("ArrowLeft");
  const moveRight = input.isKeyDown("KeyD") || input.isKeyDown("ArrowRight");
  
  const fire = input.isKeyDown("Space") || input.isMouseDown(0);
  const railgun = input.isKeyDown("KeyR") || input.isMouseDown(2);
  const laser = input.isKeyPressed("KeyE"); // Once per press, not hold
  const promptStrike = input.isKeyDown("KeyQ");
  
  return {
    moveUp,
    moveDown,
    moveLeft,
    moveRight,
    fire,
    railgun,
    laser,
    promptStrike
  };
}

// Game loop
let lastDt = 16; // Default delta time
const loop = new GameLoop(
  (dt) => {
    lastDt = dt; // Speichere dt für Render
    // Handle state transitions
    if (!game || !gameRenderer) return; // Warte bis Assets geladen sind
    
    if (game.state === GameState.TITLE) {
      const inp = getInput();
      if (inp.fire) {
        const playerSprite = assets.getPlayerSprite();
        game.start(playerSprite);
        audio.resume();
      }
    } else if (game.state === GameState.GAME_OVER) {
      const inp = getInput();
      if (inp.fire) {
        game.state = GameState.TITLE;
      }
    } else if (game && game.state === GameState.RUNNING) {
      const inp = getInput();
      
      // Play SFX
      if (inp.fire && game.getWeapons().canFireArtillery()) {
        audio.sfxGun();
      }
      if (inp.railgun && game.getWeapons().canFireRailgun()) {
        audio.sfxRailCharge();
      }
      if (inp.promptStrike && game.getWeapons().canUsePromptStrike()) {
        audio.sfxPromptStrike();
      }
      
      game.update(dt, inp);
    }
    
    // Clear pressed states at end of frame
    input.update();
  },
  () => {
    // Render
    if (!game || !gameRenderer) {
      // Zeige Loading-Screen während Assets geladen werden
      renderer.clear(1);
      renderer.present();
      return;
    }
    
    const stateStr = game.state === GameState.TITLE ? "title" :
                     game.state === GameState.GAME_OVER ? "gameover" : "running";
    
    gameRenderer.render(
      renderer,
      stateStr,
      game.state === GameState.RUNNING ? game.getEntities() : [],
      game.getPlayer(),
      game.getWeapons(),
      game.getDirector(),
      game.score,
      game.bestScore,
      game.getScreenShake(),
      game.state === GameState.RUNNING ? game.getLaserTarget() : null,
      game.state === GameState.RUNNING ? game.getLaserBeamTarget() : null,
      game.state === GameState.RUNNING ? game.getFlashTime() : 0,
      lastDt // Delta time für Animation
    );
    
    renderer.present();
  }
);

// Loop wird gestartet nach init() (siehe oben)

