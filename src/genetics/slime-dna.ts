import { Color } from 'excalibur';
import { Random } from '../utils/random';

export interface SlimeGene {
  name: string;
  value: number;
  min: number;
  max: number;
}

export interface SlimeGeneMap {
  speed: SlimeGene;
  size: SlimeGene;
  energyEfficiency: SlimeGene;
  color: SlimeGene;
  senseRadius: SlimeGene;
}

export class SlimeDNA {
  private genes: SlimeGeneMap;
  
  constructor(genes?: Partial<SlimeGeneMap>) {
    this.genes = {
      speed: {
        name: 'Speed',
        value: genes?.speed?.value ?? this.randomGeneValue(0.5, 0.3, 0.1, 1.5),
        min: 0.1,
        max: 1.5
      },
      size: {
        name: 'Size',
        value: genes?.size?.value ?? this.randomGeneValue(1.0, 0.3, 0.5, 2.0),
        min: 0.5,
        max: 2.0
      },
      energyEfficiency: {
        name: 'Energy Efficiency',
        value: genes?.energyEfficiency?.value ?? this.randomGeneValue(1.0, 0.2, 0.5, 1.5),
        min: 0.5,
        max: 1.5
      },
      color: {
        name: 'Color',
        value: genes?.color?.value ?? this.randomGeneValue(0.5, 0.5, 0, 1),
        min: 0,
        max: 1
      },
      senseRadius: {
        name: 'Sense Radius',
        value: genes?.senseRadius?.value ?? this.randomGeneValue(100, 30, 50, 200),
        min: 50,
        max: 200
      }
    };
  }

  private randomGeneValue(mean: number, stdDev: number, min: number, max: number): number {
    // Use the seeded random generator for normal distribution
    return Random.randomNormal(mean, stdDev, min, max);
  }

  public static createRandom(): SlimeDNA {
    return new SlimeDNA();
  }

  // Get a specific gene
  public getGene(geneName: keyof SlimeGeneMap): SlimeGene {
    return this.genes[geneName];
  }

  // Get a specific gene value
  public getGeneValue(geneName: keyof SlimeGeneMap): number {
    return this.genes[geneName].value;
  }

  // Combine two DNAs to create offspring DNA (for reproduction)
  public static combine(dna1: SlimeDNA, dna2: SlimeDNA, mutationRate: number = 0.05): SlimeDNA {
    const newGenes: Partial<SlimeGeneMap> = {};
    
    // For each gene, inherit from either parent with possible mutation
    (Object.keys(dna1.genes) as Array<keyof SlimeGeneMap>).forEach(geneName => {
      const gene1 = dna1.genes[geneName];
      const gene2 = dna2.genes[geneName];
      
      // Randomly choose from which parent to inherit
      const parentGene = Random.random() < 0.5 ? gene1 : gene2;
      
      // Apply mutation based on mutation rate
      let value = parentGene.value;
      if (Random.random() < mutationRate) {
        // Random mutation within a small range
        const mutationAmount = (parentGene.max - parentGene.min) * 0.1 * (Random.random() * 2 - 1);
        value = Math.max(parentGene.min, Math.min(parentGene.max, value + mutationAmount));
      }
      
      newGenes[geneName] = {
        ...parentGene,
        value
      };
    });
    
    return new SlimeDNA(newGenes);
  }

  // Get color based on genes
  public getColor(): Color {
    // Convert the color gene to an RGB color
    // Using HSL model for more visually distinct colors
    const h = this.genes.color.value * 360; // Hue (0-360)
    const s = 1.0; // Full saturation for bright colors
    const l = 0.7; // Higher lightness for brighter colors
    
    // Convert HSL to RGB
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    
    let r = 0, g = 0, b = 0;
    
    if (h < 60) { r = c; g = x; b = 0; }
    else if (h < 120) { r = x; g = c; b = 0; }
    else if (h < 180) { r = 0; g = c; b = x; }
    else if (h < 240) { r = 0; g = x; b = c; }
    else if (h < 300) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }
    
    // Convert to 0-255 range for Excalibur
    return new Color(
      Math.round((r + m) * 255),
      Math.round((g + m) * 255),
      Math.round((b + m) * 255),
      1
    );
  }

  // Serialize DNA for saving
  public serialize(): object {
    return {
      genes: this.genes
    };
  }

  // Deserialize DNA from saved data
  public static deserialize(data: any): SlimeDNA {
    return new SlimeDNA(data.genes);
  }
} 