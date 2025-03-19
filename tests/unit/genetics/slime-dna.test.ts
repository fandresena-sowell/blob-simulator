import { SlimeDNA } from '../../../src/genetics/slime-dna';
import { Color } from 'excalibur';
import { Random } from '../../../src/utils/random';
describe('SlimeDNA', () => {
  beforeEach(() => {
    Random.init('test-seed');
  });
  // Test DNA generation
  describe('DNA Creation', () => {
    test('createRandom should generate valid SlimeDNA', () => {
      const dna = SlimeDNA.createRandom();
      
      // Check that all gene values are within their min/max ranges
      expect(dna.getGeneValue('speed')).toBeGreaterThanOrEqual(0.1);
      expect(dna.getGeneValue('speed')).toBeLessThanOrEqual(1.5);
      
      expect(dna.getGeneValue('size')).toBeGreaterThanOrEqual(0.5);
      expect(dna.getGeneValue('size')).toBeLessThanOrEqual(2.0);
      
      expect(dna.getGeneValue('energyEfficiency')).toBeGreaterThanOrEqual(0.5);
      expect(dna.getGeneValue('energyEfficiency')).toBeLessThanOrEqual(1.5);
      
      expect(dna.getGeneValue('color')).toBeGreaterThanOrEqual(0);
      expect(dna.getGeneValue('color')).toBeLessThanOrEqual(1);
      
      expect(dna.getGeneValue('senseRadius')).toBeGreaterThanOrEqual(50);
      expect(dna.getGeneValue('senseRadius')).toBeLessThanOrEqual(200);
    });
    
    test('multiple random DNAs should be different', () => {
      // Generate multiple DNAs and verify they're not identical
      const numSamples = 10;
      const dnas: SlimeDNA[] = [];
      
      for (let i = 0; i < numSamples; i++) {
        dnas.push(SlimeDNA.createRandom());
      }
      
      // Check that we have variation in the DNA (at least some genes differ)
      let allSame = true;
      const firstDna = dnas[0];
      
      for (let i = 1; i < dnas.length; i++) {
        const currentDna = dnas[i];
        const speedDiff = Math.abs(firstDna.getGeneValue('speed') - currentDna.getGeneValue('speed'));
        const sizeDiff = Math.abs(firstDna.getGeneValue('size') - currentDna.getGeneValue('size'));
        const colorDiff = Math.abs(firstDna.getGeneValue('color') - currentDna.getGeneValue('color'));
        
        // If any gene differs by more than a small amount, DNAs are not identical
        if (speedDiff > 0.01 || sizeDiff > 0.01 || colorDiff > 0.01) {
          allSame = false;
          break;
        }
      }
      
      expect(allSame).toBe(false);
    });
  });
  
  // Test color generation
  describe('Color Generation', () => {
    test('getColor should return a valid Color object', () => {
      const dna = SlimeDNA.createRandom();
      const color = dna.getColor();
      
      expect(color).toBeInstanceOf(Color);
      expect(color.r).toBeGreaterThanOrEqual(0);
      expect(color.r).toBeLessThanOrEqual(255);
      expect(color.g).toBeGreaterThanOrEqual(0);
      expect(color.g).toBeLessThanOrEqual(255);
      expect(color.b).toBeGreaterThanOrEqual(0);
      expect(color.b).toBeLessThanOrEqual(255);
      expect(color.a).toBe(1);
    });
    
    test('color gene should determine the color', () => {
      // Create two DNAs with different color genes
      const customGenes1 = {
        color: { name: 'Color', value: 0, min: 0, max: 1 }
      };
      const customGenes2 = {
        color: { name: 'Color', value: 0.5, min: 0, max: 1 }
      };
      const customGenes3 = {
        color: { name: 'Color', value: 1, min: 0, max: 1 }
      };
      
      const dna1 = new SlimeDNA(customGenes1);
      const dna2 = new SlimeDNA(customGenes2);
      const dna3 = new SlimeDNA(customGenes3);
      
      const color1 = dna1.getColor();
      const color2 = dna2.getColor();
      const color3 = dna3.getColor();
      
      // Colors should be different
      const colorsAreDifferent = 
        color1.r !== color2.r || color1.g !== color2.g || color1.b !== color2.b ||
        color1.r !== color3.r || color1.g !== color3.g || color1.b !== color3.b ||
        color2.r !== color3.r || color2.g !== color3.g || color2.b !== color3.b;
      
      expect(colorsAreDifferent).toBe(true);
    });
  });
  
  // Test DNA combination
  describe('DNA Combination', () => {
    test('combine should create child DNA from two parents', () => {
      // Create two custom parent DNAs
      const parentGenes1 = {
        speed: { name: 'Speed', value: 0.2, min: 0.1, max: 1.5 },
        size: { name: 'Size', value: 0.6, min: 0.5, max: 2.0 }
      };
      const parentGenes2 = {
        speed: { name: 'Speed', value: 1.2, min: 0.1, max: 1.5 },
        size: { name: 'Size', value: 1.8, min: 0.5, max: 2.0 }
      };
      
      const parent1 = new SlimeDNA(parentGenes1);
      const parent2 = new SlimeDNA(parentGenes2);
      
      // Force mutation rate to 0 to test inheritance only
      const child = SlimeDNA.combine(parent1, parent2, 0);
      
      // Child should inherit from either parent1 or parent2
      const childSpeedValue = child.getGeneValue('speed');
      const childSizeValue = child.getGeneValue('size');
      
      const speedFromParent1 = Math.abs(childSpeedValue - 0.2) < 0.001;
      const speedFromParent2 = Math.abs(childSpeedValue - 1.2) < 0.001;
      const sizeFromParent1 = Math.abs(childSizeValue - 0.6) < 0.001;
      const sizeFromParent2 = Math.abs(childSizeValue - 1.8) < 0.001;
      
      expect(speedFromParent1 || speedFromParent2).toBe(true);
      expect(sizeFromParent1 || sizeFromParent2).toBe(true);
    });
    
    test('mutation rate should affect child DNA variation', () => {
      // Create identical parent DNAs to isolate mutation effects
      const parentGenes = {
        speed: { name: 'Speed', value: 1.0, min: 0.1, max: 1.5 },
        size: { name: 'Size', value: 1.0, min: 0.5, max: 2.0 }
      };
      
      const parent1 = new SlimeDNA(parentGenes);
      const parent2 = new SlimeDNA(parentGenes);
      
      // Test with high mutation rate
      const mutationRate = 1.0; // 100% mutation
      const numSamples = 20;
      let mutationOccurred = false;
      
      for (let i = 0; i < numSamples; i++) {
        const child = SlimeDNA.combine(parent1, parent2, mutationRate);
        
        // If child values differ from parents, mutation occurred
        if (Math.abs(child.getGeneValue('speed') - 1.0) > 0.01 ||
            Math.abs(child.getGeneValue('size') - 1.0) > 0.01) {
          mutationOccurred = true;
          break;
        }
      }
      
      expect(mutationOccurred).toBe(true);
    });
  });
  
  // Test serialization
  describe('Serialization', () => {
    test('DNA should serialize and deserialize correctly', () => {
      const originalDna = SlimeDNA.createRandom();
      const serialized = originalDna.serialize();
      const deserialized = SlimeDNA.deserialize(serialized);
      
      // Verify all genes maintained their values
      expect(deserialized.getGeneValue('speed')).toBe(originalDna.getGeneValue('speed'));
      expect(deserialized.getGeneValue('size')).toBe(originalDna.getGeneValue('size'));
      expect(deserialized.getGeneValue('energyEfficiency')).toBe(originalDna.getGeneValue('energyEfficiency'));
      expect(deserialized.getGeneValue('color')).toBe(originalDna.getGeneValue('color'));
      expect(deserialized.getGeneValue('senseRadius')).toBe(originalDna.getGeneValue('senseRadius'));
    });
  });
}); 