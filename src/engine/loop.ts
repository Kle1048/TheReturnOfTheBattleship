export class GameLoop {
  private running = false;
  private lastTime = 0;
  private accumulatedTime = 0;
  private readonly FIXED_DT = 1000 / 60; // 60 FPS
  private readonly MAX_FRAME_TIME = 250; // Prevent spiral of death

  constructor(
    private update: (dt: number) => void,
    private render: () => void
  ) {}

  start() {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.tick();
  }

  stop() {
    this.running = false;
  }

  private tick = (currentTime: number = performance.now()) => {
    if (!this.running) return;

    let deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    // Cap delta time to prevent spiral of death
    if (deltaTime > this.MAX_FRAME_TIME) {
      deltaTime = this.MAX_FRAME_TIME;
    }

    this.accumulatedTime += deltaTime;

    // Fixed timestep updates
    while (this.accumulatedTime >= this.FIXED_DT) {
      this.update(this.FIXED_DT);
      this.accumulatedTime -= this.FIXED_DT;
    }

    // Render (with interpolation if needed)
    this.render();

    requestAnimationFrame(this.tick);
  };
}

