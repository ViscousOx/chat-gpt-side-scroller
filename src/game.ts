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
  private boats!: Phaser.Physics.Arcade.Group;
  private spawnPoints: { x: number; y: number }[];
  private obstacleVelocity: number;
  private boatVelocity: number;
  private gameText: Phaser.GameObjects.Text | undefined;

  private outOfBoundXSpawnPoint: number = 780;
  private orcaSpeed: number = 5;
  private backgroundSpeed: number = 0.5;
  private gamePlaying: boolean = true;
  private shouldRocksSpawn: boolean = true; //TODO: make this dynamic
  private shouldBoatsSpawn: boolean = true; //TODO: make this dynamic

  generateRandomArrayForObstacles(
    arraySize: number,
    lower: number,
    upper: number
  ): { x: number; y: number }[] {
    const arr: { x: number; y: number }[] = [];
    for (let i = 0; i < arraySize; i++) {
      const randomNumber =
        Math.floor(Math.random() * (upper - lower + 1)) + upper;
      arr.push({ x: this.outOfBoundXSpawnPoint, y: randomNumber });
    }
    return arr;
  }

  constructor() {
    super({ key: "GameScene" });

    this.spawnPoints = this.generateRandomArrayForObstacles(20, 150, 250);

    this.obstacleVelocity = -200; // pixels per second
    this.boatVelocity = -100; // pixels per second
  }

  collisionOrcaRock() {
    this.gamePlaying = false;
    this.obstacles.setVelocityX(0);
    this.boats.setVelocityX(0);
    this.gameText?.setText("game over!");

    this.keys?.SPACE.on(
      "down",
      () => {
        this.gamePlaying = true;
        this.scene.restart();
      },
      this
    );
  }

  collisionBoatRock(boat: Phaser.Physics.Arcade.Sprite) {
    boat.destroy();
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

    this.physics.add.collider(
      this.sprite,
      obstacle,
      this.collisionOrcaRock,
      undefined,
      this
    );
  }

  spawnBoat() {
    const boat = this.physics.add.sprite(
      this.outOfBoundXSpawnPoint,
      75,
      "boat",
      0
    );
    boat.setScale(-1, 1);
    this.boats.add(boat);

    this.physics.world.enable(boat);
    if (boat.body) {
      boat.body.velocity.x = this.boatVelocity;
    }

    this.physics.add.collider(
      this.sprite,
      boat,
      () => this.collisionBoatRock(boat),
      undefined,
      this
    );
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

    // Set game text
    this.gameText = this.add.text(350, 0, "wanna play?", { color: "black" });

    // Enable keyboard input
    this.keys = this.input.keyboard?.addKeys("W,A,S,D,SPACE") as Record<
      string,
      Phaser.Input.Keyboard.Key
    >;

    this.water = this.add.tileSprite(0, 90, gameWidth, gameHeight, "water");
    this.coral = this.add.tileSprite(0, 90, gameWidth, gameHeight - 6, "coral");

    this.water.setOrigin(0, 0);
    this.water.setDepth(0);
    this.coral.setOrigin(0, 0);
    this.coral.setDepth(1);

    this.sprite = this.physics.add.sprite(25, 400, "orca", 0);
    // Set the anchor to the center of the sprite and play the animation
    this.sprite.setOrigin(1, 5);
    this.sprite.setScale(-1, 1);

    // Add obstacles
    this.obstacles = this.physics.add.group();
    this.boats = this.physics.add.group();

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
    this.sprite.play("myAnimation");
  }

  update() {
    if (this.gamePlaying) {
      // Background movement
      this.water.tilePositionX += this.backgroundSpeed;
      this.coral.tilePositionX += this.backgroundSpeed;

      // Horizontal movement
      if (this.keys) {
        if (this.keys.A.isDown) {
          this.sprite.x -= this.orcaSpeed;
        } else if (this.keys.D.isDown) {
          this.sprite.x += this.orcaSpeed;
        }

        // Vertical movement
        if (this.keys.W.isDown) {
          this.sprite.y -= this.orcaSpeed;
        } else if (this.keys.S.isDown) {
          this.sprite.y += this.orcaSpeed;
        }
      }

      if (this.shouldRocksSpawn) {
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
      }

      if (this.shouldBoatsSpawn) {
        // Check if any obstacle reaches the game boundaries
        const boatsArray =
          this.boats.getChildren() as Phaser.Physics.Arcade.Sprite[];
        boatsArray.forEach((boat) => {
          if (boat.x <= 0) {
            boat.destroy();
          }
        });

        // Spawn new obstacle if there are none
        if (this.boats.getLength() === 0) {
          this.spawnBoat();
        }
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
  physics: {
    default: "arcade",
  },
};

new Phaser.Game(gameConfig);
