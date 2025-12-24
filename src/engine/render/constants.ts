// Screen dimensions
export const W = 320;
export const H = 200;

// Sky/Sea boundary (top 1/3 is sky)
export const SKY_HEIGHT = 66;
export const SEA_Y = SKY_HEIGHT;
export const SEA_HEIGHT = H - SKY_HEIGHT;

// Color type
export type RGBA = [number, number, number, number]; // 0..255

// VGA 16-color palette (as specified in PRD)
export const VGA_PALETTE: RGBA[] = [
  [0, 0, 0, 0],        // 0: Transparent
  [0, 0, 0, 255],      // 1: Black
  [0, 0, 128, 255],    // 2: Dark Blue
  [0, 0, 255, 255],    // 3: Blue
  [0, 128, 0, 255],    // 4: Dark Green
  [0, 255, 0, 255],    // 5: Green
  [64, 64, 64, 255],   // 6: Dark Gray
  [128, 128, 128, 255], // 7: Gray
  [192, 192, 192, 255], // 8: Light Gray
  [255, 255, 255, 255], // 9: White
  [128, 64, 0, 255],   // 10: Brown
  [255, 128, 0, 255],  // 11: Orange
  [255, 0, 0, 255],    // 12: Red
  [255, 0, 255, 255],  // 13: Magenta
  [255, 255, 0, 255],  // 14: Yellow
  [0, 255, 255, 255]   // 15: Cyan
];

