/**
 * Seeded random number generator for predictable randomness in testing
 * Implementation based on a simple mulberry32 algorithm
 */
export class Random {
  private static seed: number = 0;
  private static initialized: boolean = false;

  /**
   * Initialize the random number generator with a seed
   * @param seed String seed value
   */
  public static init(seed: string): void {
    // Convert string seed to a number using a simple hash function
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      const char = seed.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    this.seed = hash >>> 0; // Convert to unsigned 32-bit integer
    this.initialized = true;
  }

  /**
   * Get a random number between 0 (inclusive) and 1 (exclusive)
   * Drop-in replacement for Math.random()
   */
  public static random(): number {
    if (!this.initialized) {
      console.warn('Random generator not initialized with seed, using Math.random()');
      return Math.random();
    }
    
    // Mulberry32 algorithm
    let t = this.seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    const result = ((t ^ t >>> 14) >>> 0) / 4294967296;
    return result;
  }

  /**
   * Get a random integer between min (inclusive) and max (inclusive)
   */
  public static randomInt(min: number, max: number): number {
    return Math.floor(this.random() * (max - min + 1)) + min;
  }

  /**
   * Get a random floating point number between min (inclusive) and max (exclusive)
   */
  public static randomRange(min: number, max: number): number {
    return min + this.random() * (max - min);
  }

  /**
   * Generate a normally distributed random number using Box-Muller transform
   * @param mean The mean of the distribution
   * @param stdDev The standard deviation
   * @param min The minimum value (clamped)
   * @param max The maximum value (clamped)
   */
  public static randomNormal(mean: number, stdDev: number, min: number, max: number): number {
    // Box-Muller transform for normal distribution
    const u1 = this.random();
    const u2 = this.random();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    let value = mean + stdDev * z0;
    
    // Clamp between min and max
    return Math.max(min, Math.min(max, value));
  }
} 