import { W, H, VGA_PALETTE, RGBA } from "./constants";

export class VGARenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  // Index buffer: each pixel is 0..15
  public fb = new Uint8Array(W * H);

  // Palette: 16 RGBA colors
  public palette: RGBA[] = [...VGA_PALETTE];

  private imageData: ImageData;
  private rgba: Uint8ClampedArray;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("2D context not available");
    this.ctx = ctx;

    // Internal resolution always 320x200
    this.imageData = this.ctx.createImageData(W, H);
    this.rgba = this.imageData.data;

    // Crisp pixels
    this.ctx.imageSmoothingEnabled = false;

    this.resizeToDevice();
    window.addEventListener("resize", () => this.resizeToDevice());
  }

  resizeToDevice() {
    // Integer scaling: choose biggest integer scale that fits
    // This ensures pixel-perfect scaling (no blurry pixels)
    const scale = Math.max(
      1,
      Math.floor(Math.min(window.innerWidth / W, window.innerHeight / H))
    );

    // Calculate scaled dimensions
    const scaledWidth = W * scale;
    const scaledHeight = H * scale;

    // Set actual canvas resolution (always 320x200 internally)
    // We use CSS to scale it up
    this.canvas.width = W;
    this.canvas.height = H;
    
    // Scale via CSS for crisp pixels
    this.canvas.style.width = scaledWidth + "px";
    this.canvas.style.height = scaledHeight + "px";

    // Reset transform (draw at 1:1 to canvas buffer)
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.imageSmoothingEnabled = false;
  }

  clear(colorIndex = 1) {
    this.fb.fill(colorIndex);
  }

  // Convert indexed fb -> RGBA ImageData and blit
  present() {
    // Map each index to RGBA
    for (let i = 0, p = 0; i < this.fb.length; i++, p += 4) {
      const idx = this.fb[i] & 15;
      const [r, g, b, a] = this.palette[idx];
      this.rgba[p] = r;
      this.rgba[p + 1] = g;
      this.rgba[p + 2] = b;
      this.rgba[p + 3] = a;
    }
    this.ctx.putImageData(this.imageData, 0, 0);
  }
}

