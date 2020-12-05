import * as ex from "excalibur";

const bgFile = require('../assets/sprites/space/BlueNebulae.png');
const bulletSheetFile = require('../assets/sprites/gameSheet.png');
const largeAsteroidFile = require('../assets/sprites/planets/Asteroids/large_brown.png');
const smallAsteroid1File = require('../assets/sprites/planets/Asteroids/small_brown_1.png');
const smallAsteroid2File = require('../assets/sprites/planets/Asteroids/small_brown_2.png');
const laserFile = require('../assets/sounds/laser.wav');

const Images: { [key: string]: ex.Texture } = {
  bg: new ex.Texture(bgFile),
  bulletSheet: new ex.Texture(bulletSheetFile),
  largeAsteroid: new ex.Texture(largeAsteroidFile),
  smallAsteroid1: new ex.Texture(smallAsteroid1File),
  smallAsteroid2: new ex.Texture(smallAsteroid2File),
};

const Sounds: { [key: string]: ex.Sound } = {
  laserSound: new ex.Sound(laserFile),
};

const bulletSheet = new ex.SpriteSheet(Images.bulletSheet, 10.0, 10.0, 32.0, 32.0);

const loader = new ex.Loader();

const allResources = {...Images, ...Sounds };
for (const res in allResources) {
  loader.addResource(allResources[res]);
}

export { Images, Sounds, loader, bulletSheet };
