export class InputManager {
  private keys = new Map<string, boolean>();
  private keysPressed = new Map<string, boolean>();
  private mouseButtons = new Map<number, boolean>();
  private mouseButtonsPressed = new Map<number, boolean>();

  // Touch controls for mobile
  private touchStartX = 0;
  private touchStartY = 0;
  private touchX = 0;
  private touchY = 0;
  private isTouching = false;

  constructor() {
    window.addEventListener("keydown", (e) => {
      if (!this.keys.get(e.code)) {
        this.keysPressed.set(e.code, true);
      }
      this.keys.set(e.code, true);
      e.preventDefault();
    });

    window.addEventListener("keyup", (e) => {
      this.keys.set(e.code, false);
      e.preventDefault();
    });

    window.addEventListener("mousedown", (e) => {
      if (!this.mouseButtons.get(e.button)) {
        this.mouseButtonsPressed.set(e.button, true);
      }
      this.mouseButtons.set(e.button, true);
    });

    window.addEventListener("mouseup", (e) => {
      this.mouseButtons.set(e.button, false);
    });

    window.addEventListener("touchstart", (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        this.touchStartX = touch.clientX - rect.left;
        this.touchStartY = touch.clientY - rect.top;
        this.touchX = this.touchStartX;
        this.touchY = this.touchStartY;
        this.isTouching = true;
      }
      e.preventDefault();
    });

    window.addEventListener("touchmove", (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        this.touchX = touch.clientX - rect.left;
        this.touchY = touch.clientY - rect.top;
      }
      e.preventDefault();
    });

    window.addEventListener("touchend", (e) => {
      this.isTouching = false;
      e.preventDefault();
    });
  }

  // Call at end of frame to clear pressed states
  update() {
    this.keysPressed.clear();
    this.mouseButtonsPressed.clear();
  }

  isKeyDown(code: string): boolean {
    return this.keys.get(code) ?? false;
  }

  isKeyPressed(code: string): boolean {
    return this.keysPressed.get(code) ?? false;
  }

  isMouseDown(button: number): boolean {
    return this.mouseButtons.get(button) ?? false;
  }

  isMousePressed(button: number): boolean {
    return this.mouseButtonsPressed.get(button) ?? false;
  }

  // Touch input (for mobile virtual stick)
  getTouchDelta(): { x: number; y: number } {
    if (!this.isTouching) return { x: 0, y: 0 };
    const dx = this.touchX - this.touchStartX;
    const dy = this.touchY - this.touchStartY;
    return { x: dx, y: dy };
  }

  isTouchingScreen(): boolean {
    return this.isTouching;
  }
}

