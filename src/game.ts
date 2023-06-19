import Phaser from "phaser";
import spritesheet from "../public/whale.png";
import water from "../public/water.png";
import coral from "../public/coral.png";
import rock from "../public/rocks.png";
import boat from "../public/boat.png";

class GameScene extends Phaser.Scene {
  private water!: Phaser.GameObjects.TileSprite;
  private coral!: Phaser.GameObjects.TileSprite;
  private sprite!: Phaser.GameObjects.Sprite;
  private keys!: Record<string, Phaser.Input.Keyboard.Key> | undefined;
  private obstacles!: Phaser.Physics.Arcade.Group;
  private spawnPoints: { x: number; y: number }[];
  private obstacleVelocity: number;

  private orcaText: Phaser.GameObjects.Text | undefined;

  generateRandomArrayForObstacles(
    arraySize: number,
    lower: number,
    upper: number
  ): { x: number; y: number }[] {
    const arr: { x: number; y: number }[] = [];
    for (let i = 0; i < arraySize; i++) {
      const randomNumber =
        Math.floor(Math.random() * (upper - lower + 1)) + upper;
      arr.push({ x: 780, y: randomNumber });
    }
    return arr;
  }

  constructor() {
    super({ key: "GameScene" });

    this.spawnPoints = this.generateRandomArrayForObstacles(20, 150, 250);

    this.obstacleVelocity = -200; // pixels per second
  }

  spawnObstacle() {
    const spawnPointIndex = Math.floor(Math.random() * this.spawnPoints.length);
    const spawnPoint = this.spawnPoints[spawnPointIndex];

    const obstacle = this.physics.add.sprite(
      spawnPoint.x,
      spawnPoint.y,
      "rock",
      0
    );
    this.obstacles.add(obstacle);

    this.physics.world.enable(obstacle);
    if (obstacle.body) {
      obstacle.body.velocity.x = this.obstacleVelocity;
    }
  }

  // Custom method to update the text position and content
  updateTextPosition(
    text: Phaser.GameObjects.Text,
    sprite: Phaser.GameObjects.Sprite
  ) {
    text.setPosition(sprite.x + 50, sprite.y - 230);
    text.setText(`X: ${sprite.x.toFixed(2)} Y: ${sprite.y.toFixed(2)}`);
  }

  preload() {
    // Load your game assets here
    this.load.spritesheet("orca", spritesheet, {
      frameWidth: 115,
      frameHeight: 44,
    });

    this.load.image("water", water);
    this.load.image("coral", coral);
    this.load.image("rock", rock);
    this.load.image("boat", boat);
  }

  create() {
    const gameWidth = this.game.config.width as number;
    const gameHeight = this.game.config.height as number;

    // Enable keyboard input
    this.keys = this.input.keyboard?.addKeys("W,A,S,D") as Record<
      string,
      Phaser.Input.Keyboard.Key
    >;

    this.water = this.add.tileSprite(0, 90, gameWidth, gameHeight, "water");
    this.coral = this.add.tileSprite(0, 90, gameWidth, gameHeight - 6, "coral");

    this.water.setOrigin(0, 0);
    this.water.setDepth(0);
    this.coral.setOrigin(0, 0);
    this.coral.setDepth(1);

    this.sprite = this.add.sprite(25, 400, "orca", 0);
    this.orcaText = this.add.text(
      25,
      400,
      `X: ${this.sprite.x.toFixed(2)} Y: ${this.sprite.y.toFixed(2)}`
    );

    // Start spawning obstacles
    this.obstacles = this.physics.add.group();
    this.spawnObstacle();

    // Set obstacle properties
    const obstaclesArray =
      this.obstacles.getChildren() as Phaser.Physics.Arcade.Sprite[];
    obstaclesArray.forEach((obstacle: Phaser.Physics.Arcade.Sprite) => {
      if (obstacle.body) {
        obstacle.body.velocity.x = this.obstacleVelocity;
        obstacle.setBounceX(1);
        // obstacle.setCollideWorldBounds(true);
      }
    });

    this.obstacles.runChildUpdate = true;
    this.physics.world.enable(this.obstacles);
    // NOTE: 290 for boats

    // Define the animation frames
    const config = {
      key: "myAnimation", // Unique key for the animation
      frames: this.anims.generateFrameNumbers("orca", {
        start: 0,
        end: 7,
      }), // Frame indexes in the sprite sheet
      frameRate: 10, // Number of frames per second
      repeat: -1, // Repeat indefinitely (-1) or specify a number of repetitions
    };

    // Create the animation
    this.anims.create(config);

    // Set the anchor to the center of the sprite and play the animation
    this.sprite.setOrigin(1, 5);
    this.orcaText.setOrigin(0.5, 1); // Set origin to center bottom
    this.sprite.setScale(-1, 1);
    this.sprite.play("myAnimation");

    this.updateTextPosition(this.orcaText, this.sprite);
  }

  update() {
    const speedX = 0.5;
    const speed = 5;

    // Background movement
    this.water.tilePositionX += speedX;
    this.coral.tilePositionX += speedX;

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

    // Check if any obstacle reaches the game boundaries
    const obstaclesArray =
      this.obstacles.getChildren() as Phaser.Physics.Arcade.Sprite[];
    obstaclesArray.forEach((obstacle) => {
      if (obstacle.x <= 0) {
        obstacle.destroy();
      }
    });

    // Spawn new obstacle if there are none
    if (this.obstacles.getLength() === 0) {
      this.spawnObstacle();
    }

    // Update the text position and content
    this.updateTextPosition(this.orcaText!, this.sprite);
  }
}

const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [GameScene],
  backgroundColor: "#ADD8E6",
  physics: {
    default: "arcade",
  },
};

new Phaser.Game(gameConfig);
