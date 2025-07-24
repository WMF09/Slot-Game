import { SlotMachine } from './SlotMachine';
import { Reel } from './Reel';
import { AssetLoader } from '../utils/AssetLoader';
import { sound } from '../utils/sound';
import * as PIXI from 'pixi.js';
import { Spine } from 'pixi-spine';

// Mock external dependencies
jest.mock(
  './Reel',
  () => {
    const mockReelConstructor = jest.fn();
    mockReelConstructor.mockImplementation(() => ({
      container: new (jest.requireActual('pixi.js').Container)(), // Mock container
      update: jest.fn(),
      startSpin: jest.fn(),
      stopSpin: jest.fn(),
    }));
    return { Reel: mockReelConstructor };
  },
);
jest.mock('../utils/AssetLoader');
jest.mock('../utils/sound');
jest.mock('pixi.js', () => ({
  ...jest.requireActual('pixi.js'),
  Application: jest.fn(() => ({
    screen: { width: 1280, height: 800 },
    stage: new PIXI.Container(),
    ticker: { add: jest.fn(), remove: jest.fn() },
  })),
  Container: jest.fn(() => new (jest.requireActual('pixi.js').Container)()),
  Sprite: jest.fn(() => new (jest.requireActual('pixi.js').Sprite)()),
  Texture: jest.fn(() => PIXI.Texture.EMPTY),
}));
jest.mock('pixi-spine', () => ({
  Spine: jest.fn(() => ({
    state: { hasAnimation: jest.fn(), setAnimation: jest.fn() },
    visible: false,
    x: 0,
    y: 0,
  })),
}));

describe('SlotMachine', () => {
  let app: PIXI.Application;
  let slotMachine: SlotMachine;

  beforeEach(() => {
    jest.clearAllMocks();
    // Ensure PIXI.Application mock returns a new instance each time
    (PIXI.Application as unknown as jest.Mock).mockImplementation(() => ({
      screen: { width: 1280, height: 800 },
      stage: new PIXI.Container(),
      ticker: { add: jest.fn(), remove: jest.fn() },
    }));
    app = new PIXI.Application();
    slotMachine = new SlotMachine(app);
  });

  // it('should be created successfully with a PIXI.Container and reels', () => {
  //   expect(slotMachine).toBeInstanceOf(SlotMachine);
  //   expect(slotMachine.container).toBeInstanceOf(PIXI.Container);
  //   expect(slotMachine['reels'].length).toBe(4); // Default REEL_COUNT
  //   expect(Reel).toHaveBeenCalledTimes(4);
  //   expect(Reel).toHaveBeenCalledWith(5, 150); // Default SYMBOLS_PER_REEL, SYMBOL_SIZE
  // });

  it('should call update on all reels when its update method is called', () => {
    slotMachine.update(1);
    slotMachine['reels'].forEach(reel => {
      expect(reel.update).toHaveBeenCalledWith(1);
    });
  });

  it('should set the spin button', () => {
    const mockButton = new PIXI.Sprite();
    slotMachine.setSpinButton(mockButton);
    expect(slotMachine['spinButton']).toBe(mockButton);
  });
});