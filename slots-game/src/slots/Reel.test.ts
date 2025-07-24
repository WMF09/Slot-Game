import { Reel } from './Reel';
import * as PIXI from 'pixi.js';

// Mock AssetLoader as it's a dependency and we don't want to load actual assets in unit tests
jest.mock('../utils/AssetLoader', () => ({
  AssetLoader: {
    getTexture: jest.fn(() => PIXI.Texture.EMPTY), // Return a mock PIXI.Texture
    getSpine: jest.fn(() => ({ spineData: {} })), // Return a mock spineData
  },
}));

describe('Reel', () => {
  let reel: Reel;
  const symbolCount = 5;
  const symbolSize = 100;

  beforeEach(() => {
    // Reset mocks and create a new Reel instance before each test
    jest.clearAllMocks();
    reel = new Reel(symbolCount, symbolSize);
  });

  it('should be created successfully with the correct number of symbols', () => {
    expect(reel).toBeInstanceOf(Reel);
    expect(reel.container).toBeInstanceOf(PIXI.Container);
    expect(reel['symbols'].length).toBe(symbolCount);
  });

  it('should create a random symbol', () => {
    const randomSymbol = reel['createRandomSymbol']();
    expect(randomSymbol).toBeInstanceOf(PIXI.Sprite);
    expect(randomSymbol.texture).toBeInstanceOf(PIXI.Texture);
  });

  it('should start spinning when startSpin is called', () => {
    reel.startSpin();
    expect(reel['isSpinning']).toBe(true);
    expect(reel['speed']).toBeGreaterThan(0);
  });

  it('should stop spinning when stopSpin is called', () => {
    reel.startSpin(); // Start spinning first
    reel.stopSpin();
    expect(reel['isSpinning']).toBe(false);
    // Speed should gradually decrease, but not immediately 0
    expect(reel['speed']).toBeGreaterThan(0);
  });

  it('should update symbol positions during spin', () => {
    reel.startSpin();
    const initialY = reel['symbols'][0].y;
    const delta = 1; // Simulate one frame update
    reel.update(delta);
    expect(reel['symbols'][0].y).toBeGreaterThan(initialY);
  });

  it('should snap symbols to grid when speed is very low and not spinning', () => {
    reel['isSpinning'] = false;
    reel['speed'] = 0.1; // Set a very low speed
    reel['symbols'][0].y = 55; // Set an off-grid position
    reel.update(1); // Call update to trigger snapToGrid
    expect(reel['symbols'][0].y % symbolSize).toBe(0); // Should be a multiple of symbolSize
  });

  it('should loop symbols when they go off screen', () => {
    reel['isSpinning'] = true;
    reel['speed'] = 100; // High speed to ensure it goes off screen
    reel['symbols'][0].y = symbolCount * symbolSize - 10; // Near the bottom edge
    reel.update(1); // Update to push it off screen
    expect(reel['symbols'][0].y).toBeLessThan(symbolCount * symbolSize); // Should have wrapped around
  });
});
