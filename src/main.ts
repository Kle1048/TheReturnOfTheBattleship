import { VGARenderer } from "./engine/render/renderer";
import { GameLoop } from "./engine/loop";
import { InputManager } from "./engine/input";
import { AudioEngine } from "./engine/audio";
import { Game, GameState } from "./game/game";
import { GameRenderer } from "./game/renderer";
import { assets } from "./assets/assets";
import { MobileControls } from "./ui/mobile-controls";

const canvas = document.getElementById("screen") as HTMLCanvasElement;
if (!canvas) throw new Error("Canvas not found");

const renderer = new VGARenderer(canvas);
const input = new InputManager();
const audio = new AudioEngine();
const mobileControls = new MobileControls();

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

// Autofire toggle state
let autofireEnabled = false;

// Input handling
function getInput() {
  const mobileState = mobileControls.getState();
  const isMobile = mobileControls.isMobile();
  
  // Movement - Desktop oder Mobile Joystick
  let moveUp = input.isKeyDown("KeyW") || input.isKeyDown("ArrowUp");
  let moveDown = input.isKeyDown("KeyS") || input.isKeyDown("ArrowDown");
  let moveLeft = input.isKeyDown("KeyA") || input.isKeyDown("ArrowLeft");
  let moveRight = input.isKeyDown("KeyD") || input.isKeyDown("ArrowRight");
  
  // Mobile Joystick (wenn aktiv, überschreibt Desktop-Input)
  // Y-Achse invertiert: nach oben ziehen = nach unten bewegen
  if (isMobile && mobileState.joystickActive) {
    const deadzone = 0.2;
    if (Math.abs(mobileState.joystickY) > deadzone) {
      moveUp = mobileState.joystickY > deadzone;  // Invertiert: positiver Wert = nach oben
      moveDown = mobileState.joystickY < -deadzone;  // Invertiert: negativer Wert = nach unten
    }
    if (Math.abs(mobileState.joystickX) > deadzone) {
      moveLeft = mobileState.joystickX < -deadzone;
      moveRight = mobileState.joystickX > deadzone;
    }
  }
  
  // Fire - Desktop oder Mobile Button (oder Autofire wenn aktiviert)
  const fire = autofireEnabled || input.isKeyDown("Space") || input.isMouseDown(0) || mobileState.fire;
  
  // Railgun - Desktop oder Mobile Button
  const railgun = input.isKeyDown("KeyR") || input.isMouseDown(2) || mobileState.railgun;
  
  // Laser - Once per press (Desktop oder Mobile)
  const laser = input.isKeyPressed("KeyE") || mobileState.laserPressed;
  
  // SAM - Once per press (Desktop oder Mobile)
  const sam = input.isKeyPressed("KeyF") || mobileState.samPressed;
  
  // SSM - Once per press (Desktop oder Mobile)
  const ssm = input.isKeyPressed("KeyT") || mobileState.ssmPressed;
  
  // Prompt Strike - Desktop oder Mobile Button
  const promptStrike = input.isKeyDown("KeyQ") || mobileState.promptStrike;
  
  return {
    moveUp,
    moveDown,
    moveLeft,
    moveRight,
    fire,
    railgun,
    laser,
    sam,
    ssm,
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
    } else if (game.state === GameState.HELP) {
      // H-Taste zum Zurückkehren zum Spiel
      if (input.isKeyPressed("KeyH")) {
        game.state = GameState.RUNNING;
      }
    } else if (game && game.state === GameState.RUNNING) {
      // Toggle Help/Pause mit H-Taste
      if (input.isKeyPressed("KeyH")) {
        game.state = GameState.HELP;
      }
      
      // Toggle Autofire mit X-Taste
      if (input.isKeyPressed("KeyX")) {
        autofireEnabled = !autofireEnabled;
      }
      
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
    mobileControls.update();
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
                     game.state === GameState.GAME_OVER ? "gameover" :
                     game.state === GameState.HELP ? "help" :
                     game.state === GameState.PAUSE ? "pause" : "running";
    
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
      game.state === GameState.RUNNING ? game.getSAMTarget() : null,
      game.state === GameState.RUNNING ? game.getFlashTime() : 0,
      lastDt // Delta time für Animation
    );
    
    renderer.present();
  }
);

// Loop wird gestartet nach init() (siehe oben)

