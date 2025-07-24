
import { AssetLoader } from './AssetLoader';
import * as PIXI from 'pixi.js';
import { sound } from './sound';

// Mock PIXI.Assets and sound
jest.mock('pixi.js', () => ({
  ...jest.requireActual('pixi.js'),
  Assets: {
    init: jest.fn(),
    addBundle: jest.fn(),
    loadBundle: jest.fn(() => Promise.resolve({
      'symbol1.png': PIXI.Texture.EMPTY,
      'background.png': PIXI.Texture.EMPTY,
    })),
  },
  Texture: {
    EMPTY: new (jest.requireActual('pixi.js').Texture)(),
  },
}));
jest.mock('./sound', () => ({
  sound: {
    add: jest.fn(),
    play: jest.fn(),
  },
}));

describe('AssetLoader', () => {
  let assetLoader: AssetLoader;

  beforeEach(() => {
    jest.clearAllMocks();
    assetLoader = new AssetLoader();
  });

  it('should initialize PIXI.Assets with correct base path', () => {
    expect(PIXI.Assets.init).toHaveBeenCalledWith({ basePath: '' });
  });

  it('should load all assets when loadAssets is called', async () => {
    await assetLoader.loadAssets();

    expect(PIXI.Assets.addBundle).toHaveBeenCalledWith('images', expect.any(Array));
    expect(PIXI.Assets.addBundle).toHaveBeenCalledWith('spines', expect.any(Array));
    expect(PIXI.Assets.loadBundle).toHaveBeenCalledWith('images');
    expect(PIXI.Assets.loadBundle).toHaveBeenCalledWith('spines');
    expect(sound.add).toHaveBeenCalledTimes(2); // Reel spin.webm, win.webm, Spin button.webm
    expect(sound.add).toHaveBeenCalledWith('Reel spin', 'assets/sounds/Reel spin.webm');
    expect(sound.add).toHaveBeenCalledWith('win', 'assets/sounds/win.webm');
  });

  it('should return texture from cache', async () => {
    await assetLoader.loadAssets(); // Populate cache
    const texture = AssetLoader.getTexture('symbol1.png');
    expect(texture).toBe(PIXI.Texture.EMPTY);
  });

  it('should return spine data from cache', async () => {
    await assetLoader.loadAssets(); // Populate cache
    const spineData = AssetLoader.getSpine('big-boom-h.json');
    expect(spineData).toEqual({ spineData: {} });
  });
});