import Phaser from "phaser";
import spritesheet from "../public/whale.png";
import background from "../public/water.png";

class GameScene extends Phaser.Scene {
  private background!: Phaser.GameObjects.TileSprite;
  private sprite!: Phaser.GameObjects.Sprite;

  constructor() {
    super({ key: "GameScene" });
  }

  preload() {
    // Load your game assets here
    this.load.spritesheet("mySprite", spritesheet, {
      frameWidth: 115,
      frameHeight: 44,
    });

    this.load.image("background", background);
  }

  create() {
    const gameWidth = this.game.config.width as number;
    const gameHeight = this.game.config.height as number;

    this.background = this.add.tileSprite(
      0,
      0,
      gameWidth,
      gameHeight,
      "background"
    );
    this.background.setOrigin(0, 0);

    this.sprite = this.add.sprite(25, 300, "mySprite", 0);
    // Additional configuration and customization of the sprite

    // Define the animation frames
    const config = {
      key: "myAnimation", // Unique key for the animation
      frames: this.anims.generateFrameNumbers("mySprite", {
        start: 0,
        end: 7,
      }), // Frame indexes in the sprite sheet
      frameRate: 10, // Number of frames per second
      repeat: -1, // Repeat indefinitely (-1) or specify a number of repetitions
    };

    // Create the animation
    this.anims.create(config);

    // Set the anchor to the center of the sprite and play the animation
    this.sprite.setOrigin(0.5, 0.5);
    this.sprite.setScale(-1, 1);
    this.sprite.play("myAnimation");

    // Set initial camera position to match the sprite
    // this.cameras.main.startFollow(this.sprite);
  }

  update() {
    const speedX = 0.5;
    // const speedY = 0.2;

    this.background.tilePositionX += speedX;
    // this.background.tilePositionY += speedY;
  }
}

const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [GameScene],
  backgroundColor: "#ADD8E6",
};

new Phaser.Game(gameConfig);
