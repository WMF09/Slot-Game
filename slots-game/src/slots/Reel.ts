import * as PIXI from 'pixi.js';
import { AssetLoader } from '../utils/AssetLoader';

const SYMBOL_TEXTURES = [
    'symbol1.png',
    'symbol2.png',
    'symbol3.png',
    'symbol4.png',
    'symbol5.png',
];

const SPIN_SPEED = 50; // Pixels per frame
const SLOWDOWN_RATE = 0.95; // Rate at which the reel slows down

export class Reel {
    public container: PIXI.Container;
    private symbols: PIXI.Sprite[];
    private symbolSize: number;
    private symbolCount: number;
    private speed: number = 0;
    private isSpinning: boolean = false;

    constructor(symbolCount: number, symbolSize: number) {
        this.container = new PIXI.Container();
        this.symbols = [];
        this.symbolSize = symbolSize;
        this.symbolCount = symbolCount;

        this.createSymbols();
    }

    private createSymbols(): void {
        for (let i = 0; i < this.symbolCount; i++) {
            const symbol = this.createRandomSymbol();
            symbol.x = i * this.symbolSize;
            this.container.addChild(symbol);
            this.symbols.push(symbol);
        }
    }

    private createRandomSymbol(): PIXI.Sprite {
        const randomIndex = Math.floor(Math.random() * SYMBOL_TEXTURES.length);
        const textureName = SYMBOL_TEXTURES[randomIndex];
        const texture = AssetLoader.getTexture(textureName);
        const sprite = new PIXI.Sprite(texture);
        return sprite;
    }

    public update(delta: number): void {
        if (!this.isSpinning && this.speed === 0) return;

        for (const symbol of this.symbols) {
            symbol.y += this.speed * delta;

            // If symbol moves off screen, reset its position to the top
            if (symbol.y >= this.symbolCount * this.symbolSize) {
                symbol.y -= (this.symbolCount * this.symbolSize);
            } else if (symbol.y < -this.symbolSize) {
                symbol.y -= this.symbolCount * this.symbolSize;
            }
        }

        // If we're stopping, slow down the reel
        if (!this.isSpinning && this.speed > 0) {
            this.speed *= SLOWDOWN_RATE;

            // If speed is very low, stop completely and snap to grid
            if (this.speed < 0.5) {
                this.speed = 0;
                this.snapToGrid();
            }
        }
    }

    private snapToGrid(): void {
        for (const symbol of this.symbols) {
            // Calculate the nearest grid position
            const nearestGridY = Math.round(symbol.y / this.symbolSize) * this.symbolSize;
            symbol.y = nearestGridY % (this.symbolCount * this.symbolSize); // Ensure it snaps within the visible range
        }
    }

    public startSpin(): void {
        this.isSpinning = true;
        this.speed = SPIN_SPEED;
    }

    public stopSpin(): void {
        this.isSpinning = false;
        // The reel will gradually slow down in the update method
    }
}
