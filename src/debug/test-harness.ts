import { Actor, Color, Engine, Font, FontUnit, Keys, Rectangle, Text, TextAlign, vec } from 'excalibur';
import { Slime } from '../actors/slime';
import { SlimeDNA } from '../genetics/slime-dna';

/**
 * Debug test harness for visualizing and testing slime genetics
 * Can be toggled with the 'T' key in the game
 */
export class SlimeTestHarness {
  // Z-index layers for proper rendering
  private static readonly Z_LAYERS = {
    BACKGROUND: 100,
    GRID: 105,
    UI: 110,
    SLIME: 120
  };
  
  // Background color for test mode
  private static readonly BG_COLOR = new Color(20, 20, 40, 0.95);
  private static readonly GRID_COLOR = new Color(70, 70, 100, 0.3);
  private static readonly VERSION = '1.0.0';
  
  private isActive = false;
  private engine: Engine;
  private testSlimes: Slime[] = [];
  private infoLabels: Actor[] = [];
  private background: Actor | null = null;
  private gridLines: Actor[] = [];
  
  // Test DNA presets for comparing traits
  private dnaPresets = {
    'speed-min': new SlimeDNA({ speed: { name: 'Speed', value: 0.1, min: 0.1, max: 1.5 } }),
    'speed-max': new SlimeDNA({ speed: { name: 'Speed', value: 1.5, min: 0.1, max: 1.5 } }),
    'size-min': new SlimeDNA({ size: { name: 'Size', value: 0.5, min: 0.5, max: 2.0 } }),
    'size-max': new SlimeDNA({ size: { name: 'Size', value: 2.0, min: 0.5, max: 2.0 } }),
    'color-red': new SlimeDNA({ color: { name: 'Color', value: 0, min: 0, max: 1 } }),
    'color-green': new SlimeDNA({ color: { name: 'Color', value: 0.33, min: 0, max: 1 } }),
    'color-blue': new SlimeDNA({ color: { name: 'Color', value: 0.66, min: 0, max: 1 } }),
    'energy-min': new SlimeDNA({ energyEfficiency: { name: 'Energy Efficiency', value: 0.5, min: 0.5, max: 1.5 } }),
    'energy-max': new SlimeDNA({ energyEfficiency: { name: 'Energy Efficiency', value: 1.5, min: 0.5, max: 1.5 } }),
  };
  
  constructor(engine: Engine) {
    this.engine = engine;
    
    // Add keyboard handler to toggle test harness
    engine.input.keyboard.on('press', (evt) => {
      if (evt.key === Keys.T) {
        this.toggleTestHarness();
      }
    });
  }
  
  private toggleTestHarness() {
    this.isActive = !this.isActive;
    
    if (this.isActive) {
      this.activateTestHarness();
    } else {
      this.deactivateTestHarness();
    }
  }
  
  private activateTestHarness() {
    // Clear previous test slimes if any
    this.clearTestHarness();
    
    // Create an opaque background to hide normal gameplay
    this.createBackground();
    
    // Create test slimes with various DNA traits
    this.createTestSlimes();
    
    // Add information labels
    this.createInfoLabels();
  }
  
  private deactivateTestHarness() {
    // Remove all test slimes and labels
    this.clearTestHarness();
  }
  
  private createBackground() {
    // Create a dark, semi-transparent background that covers the entire screen
    const bgWidth = this.engine.drawWidth;
    const bgHeight = this.engine.drawHeight;
    
    this.background = new Actor({
      pos: vec(bgWidth / 2, bgHeight / 2),
      width: bgWidth,
      height: bgHeight,
      z: SlimeTestHarness.Z_LAYERS.BACKGROUND,
      name: "Test Harness Background"
    });
    
    // Create and attach a rectangle graphic with the proper color
    const bgRect = new Rectangle({
      width: bgWidth,
      height: bgHeight,
      color: SlimeTestHarness.BG_COLOR
    });
    
    this.background.graphics.use(bgRect);
    this.engine.add(this.background);
    this.infoLabels.push(this.background);
    
    // Add grid lines for visual reference
    this.createGridLines();
    
    // Add version info
    const versionLabel = new Text({
      text: `DNA Test Harness v${SlimeTestHarness.VERSION}`,
      font: new Font({
        family: 'Arial',
        size: 10,
        unit: FontUnit.Px,
        textAlign: TextAlign.Right
      }),
      color: new Color(200, 200, 255, 0.5)
    });
    const versionActor = new Actor({
      pos: vec(this.engine.drawWidth - 10, this.engine.drawHeight - 10),
      z: SlimeTestHarness.Z_LAYERS.UI
    });
    versionActor.graphics.use(versionLabel);
    this.engine.add(versionActor);
    this.infoLabels.push(versionActor);
  }
  
  private createGridLines() {
    const gridSpacing = 50;
    
    // Horizontal lines
    for (let y = gridSpacing; y < this.engine.drawHeight; y += gridSpacing) {
      const line = new Actor({
        pos: vec(this.engine.drawWidth / 2, y),
        width: this.engine.drawWidth,
        height: 1,
        z: SlimeTestHarness.Z_LAYERS.GRID
      });
      
      // Create and attach a rectangle graphic for the grid line
      const lineRect = new Rectangle({
        width: this.engine.drawWidth,
        height: 1,
        color: SlimeTestHarness.GRID_COLOR
      });
      
      line.graphics.use(lineRect);
      this.engine.add(line);
      this.gridLines.push(line);
    }
    
    // Vertical lines
    for (let x = gridSpacing; x < this.engine.drawWidth; x += gridSpacing) {
      const line = new Actor({
        pos: vec(x, this.engine.drawHeight / 2),
        width: 1,
        height: this.engine.drawHeight,
        z: SlimeTestHarness.Z_LAYERS.GRID
      });
      
      // Create and attach a rectangle graphic for the grid line
      const lineRect = new Rectangle({
        width: 1,
        height: this.engine.drawHeight,
        color: SlimeTestHarness.GRID_COLOR
      });
      
      line.graphics.use(lineRect);
      this.engine.add(line);
      this.gridLines.push(line);
    }
  }
  
  private clearTestHarness() {
    // Remove slimes
    for (const slime of this.testSlimes) {
      slime.kill();
    }
    this.testSlimes = [];
    
    // Remove labels and background
    for (const label of this.infoLabels) {
      label.kill();
    }
    this.infoLabels = [];
    
    // Remove grid lines
    for (const line of this.gridLines) {
      line.kill();
    }
    this.gridLines = [];
    
    this.background = null;
  }
  
  private createTestSlimes() {
    // Title label
    const titleLabel = new Text({
      text: 'SLIME DNA TEST HARNESS',
      font: new Font({
        family: 'Arial',
        size: 20,
        unit: FontUnit.Px,
        textAlign: TextAlign.Center
      }),
      color: Color.White
    });
    const titleActor = new Actor({
      pos: vec(this.engine.drawWidth / 2, 30),
      z: SlimeTestHarness.Z_LAYERS.UI
    });
    titleActor.graphics.use(titleLabel);
    this.engine.add(titleActor);
    this.infoLabels.push(titleActor);
    
    // Instructions label
    const instructionsLabel = new Text({
      text: 'Press T to toggle test mode',
      font: new Font({
        family: 'Arial',
        size: 14,
        unit: FontUnit.Px,
        textAlign: TextAlign.Center
      }),
      color: Color.White
    });
    const instructionsActor = new Actor({
      pos: vec(this.engine.drawWidth / 2, 60),
      z: SlimeTestHarness.Z_LAYERS.UI
    });
    instructionsActor.graphics.use(instructionsLabel);
    this.engine.add(instructionsActor);
    this.infoLabels.push(instructionsActor);
    
    // Create a grid of slimes to compare traits
    const startX = 100;
    const startY = 120;
    const spacingX = 150;
    const spacingY = 120;
    
    let row = 0;
    let col = 0;
    
    // Speed test slimes (row 0)
    this.addTestSlime('Min Speed', this.dnaPresets['speed-min'], startX + col * spacingX, startY + row * spacingY);
    col++;
    this.addTestSlime('Max Speed', this.dnaPresets['speed-max'], startX + col * spacingX, startY + row * spacingY);
    col = 0;
    row++;
    
    // Size test slimes (row 1)
    this.addTestSlime('Min Size', this.dnaPresets['size-min'], startX + col * spacingX, startY + row * spacingY);
    col++;
    this.addTestSlime('Max Size', this.dnaPresets['size-max'], startX + col * spacingX, startY + row * spacingY);
    col = 0;
    row++;
    
    // Color test slimes (row 2)
    this.addTestSlime('Red Hue', this.dnaPresets['color-red'], startX + col * spacingX, startY + row * spacingY);
    col++;
    this.addTestSlime('Green Hue', this.dnaPresets['color-green'], startX + col * spacingX, startY + row * spacingY);
    col++;
    this.addTestSlime('Blue Hue', this.dnaPresets['color-blue'], startX + col * spacingX, startY + row * spacingY);
    col = 0;
    row++;
    
    // Energy efficiency test slimes (row 3)
    this.addTestSlime('Min Energy', this.dnaPresets['energy-min'], startX + col * spacingX, startY + row * spacingY);
    col++;
    this.addTestSlime('Max Energy', this.dnaPresets['energy-max'], startX + col * spacingX, startY + row * spacingY);
    
    // Make one of the slimes move to demonstrate speed differences
    if (this.testSlimes.length >= 2) {
      this.testSlimes[0].moveInDirection(1); // Move right
      this.testSlimes[1].moveInDirection(1); // Move right
    }
  }
  
  private addTestSlime(label: string, dna: SlimeDNA, x: number, y: number) {
    // Create slime
    const slime = new Slime(dna);
    slime.pos = vec(x, y);
    slime.z = SlimeTestHarness.Z_LAYERS.SLIME;
    
    // Add label
    const textLabel = new Text({
      text: label,
      font: new Font({
        family: 'Arial',
        size: 12,
        unit: FontUnit.Px,
        textAlign: TextAlign.Center
      }),
      color: Color.White
    });
    const labelActor = new Actor({
      pos: vec(x, y - 30),
      z: SlimeTestHarness.Z_LAYERS.SLIME
    });
    labelActor.graphics.use(textLabel);
    
    // Add to scene
    this.engine.add(slime);
    this.engine.add(labelActor);
    
    // Track for cleanup
    this.testSlimes.push(slime);
    this.infoLabels.push(labelActor);
    
    // Add DNA info
    const dnaInfoText = new Text({
      text: this.formatDnaInfo(dna),
      font: new Font({
        family: 'Arial',
        size: 8,
        unit: FontUnit.Px,
        textAlign: TextAlign.Center
      }),
      color: Color.White
    });
    const dnaInfoActor = new Actor({
      pos: vec(x, y + 30),
      z: SlimeTestHarness.Z_LAYERS.SLIME
    });
    dnaInfoActor.graphics.use(dnaInfoText);
    this.engine.add(dnaInfoActor);
    this.infoLabels.push(dnaInfoActor);
    
    return slime;
  }
  
  private formatDnaInfo(dna: SlimeDNA): string {
    return `Speed: ${dna.getGeneValue('speed').toFixed(1)}
Size: ${dna.getGeneValue('size').toFixed(1)}
Energy: ${dna.getGeneValue('energyEfficiency').toFixed(1)}
Sense: ${dna.getGeneValue('senseRadius').toFixed(0)}`;
  }
  
  private createInfoLabels() {
    // Add info about test controls and trait visualization
    const helpText = new Text({
      text: 'This test harness shows slimes with different traits for visual verification.\nObserve differences in size, color, and movement speed.',
      font: new Font({
        family: 'Arial',
        size: 12,
        unit: FontUnit.Px,
        textAlign: TextAlign.Center
      }),
      color: Color.White
    });
    const helpActor = new Actor({
      pos: vec(this.engine.drawWidth / 2, this.engine.drawHeight - 40),
      z: SlimeTestHarness.Z_LAYERS.UI
    });
    helpActor.graphics.use(helpText);
    this.engine.add(helpActor);
    this.infoLabels.push(helpActor);
  }
} 