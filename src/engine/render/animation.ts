import { Sprite } from "./blit";

/**
 * AnimatedSprite: Container für mehrere Sprite-Frames einer Animation
 */
export interface AnimatedSprite {
  frames: Sprite[];
  frameCount: number;
  frameWidth: number;
  frameHeight: number;
}

/**
 * AnimationState: Verwaltet den aktuellen Animationszustand
 */
export interface AnimationState {
  animatedSprite: AnimatedSprite;
  currentFrame: number;
  frameTime: number; // Verbleibende Zeit bis zum nächsten Frame (ms)
  frameDuration: number; // Dauer jedes Frames (ms)
  loop: boolean; // Soll die Animation loopen?
  finished: boolean; // Ist die Animation fertig?
}

/**
 * Erstellt einen AnimationState für eine AnimatedSprite
 */
export function createAnimationState(
  animatedSprite: AnimatedSprite,
  frameDuration: number = 100,
  loop: boolean = true
): AnimationState {
  return {
    animatedSprite,
    currentFrame: 0,
    frameTime: frameDuration,
    frameDuration,
    loop,
    finished: false
  };
}

/**
 * Aktualisiert einen AnimationState
 * @returns Das aktuelle Sprite-Frame
 */
export function updateAnimation(
  state: AnimationState,
  dt: number
): Sprite {
  // Animation ist fertig und looped nicht
  if (state.finished && !state.loop) {
    return state.animatedSprite.frames[state.animatedSprite.frames.length - 1];
  }

  state.frameTime -= dt;

  // Frame-Wechsel
  if (state.frameTime <= 0) {
    state.currentFrame++;
    
    // Loop oder Ende
    if (state.currentFrame >= state.animatedSprite.frames.length) {
      if (state.loop) {
        state.currentFrame = 0;
      } else {
        state.currentFrame = state.animatedSprite.frames.length - 1;
        state.finished = true;
      }
    }
    
    state.frameTime = state.frameDuration;
  }

  return state.animatedSprite.frames[state.currentFrame];
}

/**
 * Setzt eine Animation auf einen bestimmten Frame zurück
 */
export function resetAnimation(state: AnimationState, frame: number = 0) {
  state.currentFrame = Math.max(0, Math.min(frame, state.animatedSprite.frames.length - 1));
  state.frameTime = state.frameDuration;
  state.finished = false;
}

/**
 * Erstellt eine AnimatedSprite aus einem Array von Sprites
 */
export function createAnimatedSprite(frames: Sprite[]): AnimatedSprite {
  if (frames.length === 0) {
    throw new Error("AnimatedSprite benötigt mindestens einen Frame");
  }

  // Alle Frames müssen die gleiche Größe haben
  const w = frames[0].w;
  const h = frames[0].h;
  
  for (const frame of frames) {
    if (frame.w !== w || frame.h !== h) {
      throw new Error("Alle Frames müssen die gleiche Größe haben");
    }
  }

  return {
    frames,
    frameCount: frames.length,
    frameWidth: w,
    frameHeight: h
  };
}

