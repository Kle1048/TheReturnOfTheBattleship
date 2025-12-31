import nipplejs from 'nipplejs';

export interface MobileControlsState {
  // Joystick movement (normalized -1 to 1)
  joystickX: number;
  joystickY: number;
  joystickActive: boolean;
  
  // Weapon buttons (held down)
  fire: boolean;
  railgun: boolean;
  promptStrike: boolean;
  
  // Weapon buttons (once per press - cleared each frame)
  firePressed: boolean;
  autofireTogglePressed: boolean; // Auto-Fire toggle trigger (wie X-Taste) - einmal pro Druck
  laserPressed: boolean;
  samPressed: boolean;
  ssmPressed: boolean;
}

export class MobileControls {
  private joystick: any = null;
  private state: MobileControlsState = {
    joystickX: 0,
    joystickY: 0,
    joystickActive: false,
    fire: false,
    railgun: false,
    promptStrike: false,
    firePressed: false,
    autofireTogglePressed: false,
    laserPressed: false,
    samPressed: false,
    ssmPressed: false
  };
  
  private buttonsPressedThisFrame = new Set<string>();

  constructor() {
    this.setupJoystick();
    this.setupButtons();
  }

  private setupJoystick() {
    const joystickZone = document.getElementById('joystick-zone');
    if (!joystickZone) return;

    // Static joystick, links unten - positioniert so dass er vollständig sichtbar ist
    // top: 80% bedeutet ~20% vom unteren Rand, was bei 100vh etwa 200px entspricht
    // left: 80px für genügend Abstand vom linken Rand (60px Radius + 20px Padding)
    this.joystick = nipplejs.create({
      zone: joystickZone,
      mode: 'static',
      position: { left: '80px', top: '80%' },
      color: 'rgba(255, 255, 255, 0.5)',
      size: 120,
      threshold: 0.1,
      fadeTime: 0
    });

    this.joystick.on('start', () => {
      this.state.joystickActive = true;
    });

    this.joystick.on('move', (evt: any, data: any) => {
      // Normalized direction (-1 to 1)
      this.state.joystickX = data.vector.x;
      this.state.joystickY = data.vector.y;
    });

    this.joystick.on('end', () => {
      this.state.joystickActive = false;
      this.state.joystickX = 0;
      this.state.joystickY = 0;
    });
  }

  private setupButtons() {
    const buttonIds = ['fire-btn', 'railgun-btn', 'laser-btn', 'sam-btn', 'ssm-btn', 'prompt-strike-btn'];
    
    buttonIds.forEach(id => {
      const btn = document.getElementById(id);
      if (!btn) return;

      // Touch start
      btn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.handleButtonDown(id);
      }, { passive: false });

      // Touch end
      btn.addEventListener('touchend', (e) => {
        e.preventDefault();
        this.handleButtonUp(id);
      }, { passive: false });

      // Mouse support for testing
      btn.addEventListener('mousedown', (e) => {
        e.preventDefault();
        this.handleButtonDown(id);
      });
      btn.addEventListener('mouseup', (e) => {
        e.preventDefault();
        this.handleButtonUp(id);
      });
      btn.addEventListener('mouseleave', (e) => {
        e.preventDefault();
        this.handleButtonUp(id);
      });
    });
  }

  private handleButtonDown(id: string) {
    if (!this.buttonsPressedThisFrame.has(id)) {
      this.buttonsPressedThisFrame.add(id);

      switch (id) {
        case 'fire-btn':
          this.state.fire = true;
          // Toggle Auto-Fire (wie X-Taste) - nur beim ersten Touch
          if (!this.state.firePressed) {
            this.state.firePressed = true;
            this.state.autofireTogglePressed = true;
          }
          break;
        case 'railgun-btn':
          this.state.railgun = true;
          break;
        case 'laser-btn':
          // Once per press - set pressed flag only on first touch
          if (!this.state.laserPressed) {
            this.state.laserPressed = true;
          }
          break;
        case 'sam-btn':
          // Once per press - set pressed flag only on first touch
          if (!this.state.samPressed) {
            this.state.samPressed = true;
          }
          break;
        case 'ssm-btn':
          // Once per press - set pressed flag only on first touch
          if (!this.state.ssmPressed) {
            this.state.ssmPressed = true;
          }
          break;
        case 'prompt-strike-btn':
          this.state.promptStrike = true;
          break;
      }
    }
  }

  private handleButtonUp(id: string) {
    switch (id) {
      case 'fire-btn':
        this.state.fire = false;
        break;
      case 'railgun-btn':
        this.state.railgun = false;
        break;
      case 'laser-btn':
        // Once per press - no action needed on release
        break;
      case 'sam-btn':
        // Once per press - no action needed on release
        break;
      case 'ssm-btn':
        // Once per press - no action needed on release
        break;
      case 'prompt-strike-btn':
        this.state.promptStrike = false;
        break;
    }
  }

  update() {
    // Clear pressed states at end of frame (for "once per press" buttons)
    // These are cleared so they only trigger once per button press
    this.state.firePressed = false;
    this.state.autofireTogglePressed = false;
    this.state.laserPressed = false;
    this.state.samPressed = false;
    this.state.ssmPressed = false;
    this.buttonsPressedThisFrame.clear();
  }

  getState(): MobileControlsState {
    return this.state;
  }

  // Check if mobile device
  isMobile(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
           ('ontouchstart' in window);
  }

  destroy() {
    if (this.joystick) {
      this.joystick.destroy();
    }
  }
}

