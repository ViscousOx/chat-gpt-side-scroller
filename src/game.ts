import Phaser from "phaser";

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }

  preload() {
    // Load your game assets here
    this.load.spritesheet("mySprite", "../public/whale.png", {
      frameWidth: 32,
      frameHeight: 38,
    });
  }

  create() {
    const sprite = this.add.image(400, 300, "mySprite");
    // Additional configuration and customization of the sprite

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
};

new Phaser.Game(gameConfig);
