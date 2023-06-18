import Phaser from "phaser";
import spritesheet from "../public/whale.png";

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }

  preload() {
    // Load your game assets here
    this.load.spritesheet("mySprite", spritesheet, {
      frameWidth: 115,
      frameHeight: 44,
    });
  }

  create() {
    const sprite = this.add.sprite(25, 300, "mySprite", 0);
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
    sprite.setOrigin(0.5, 0.5);
    sprite.setScale(-1, 1);
    sprite.play("myAnimation");

    // Set initial camera position to match the sprite
    this.cameras.main.startFollow(sprite);
  }

  update() {
    // Move the scene around the sprite
    this.cameras.main.scrollX += 1;
    this.cameras.main.scrollY += 1;
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
