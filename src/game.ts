import Phaser from "phaser";
import spritesheet from "../public/whale.png";
import background from "../public/water.png";

class GameScene extends Phaser.Scene {
  private background!: Phaser.GameObjects.TileSprite;
  private sprite!: Phaser.GameObjects.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
  private keys!: Record<string, Phaser.Input.Keyboard.Key> | undefined;

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

    // Enable keyboard input
    this.cursors = this.input.keyboard?.createCursorKeys();
    this.keys = this.input.keyboard?.addKeys("W,A,S,D") as Record<
      string,
      Phaser.Input.Keyboard.Key
    >;

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
    const speed = 5;

    // Background movement
    this.background.tilePositionX += speedX;

    // Horizontal movement
    if (this.keys) {
      if (this.keys.A.isDown) {
        this.sprite.x -= speed;
      } else if (this.keys.D.isDown) {
        this.sprite.x += speed;
      }

      // Vertical movement
      if (this.keys.W.isDown) {
        this.sprite.y -= speed;
      } else if (this.keys.S.isDown) {
        this.sprite.y += speed;
      }
    }
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
