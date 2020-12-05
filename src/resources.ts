import * as ex from "excalibur";

const bg = require('../assets/sprites/space/BlueNebulae.png');
const largeAsteroid = require('../assets/sprites/planets/Asteroids/large_brown.png');
const smallAsteroid1 = require('../assets/sprites/planets/Asteroids/small_brown_1.png');
const smallAsteroid2 = require('../assets/sprites/planets/Asteroids/small_brown_2.png');

const Images: { [key: string]: ex.Texture } = {
  bg: new ex.Texture(bg),
  largeAsteroid: new ex.Texture(largeAsteroid),
  smallAsteroid1: new ex.Texture(smallAsteroid1),
  smallAsteroid2: new ex.Texture(smallAsteroid2),
};

const loader = new ex.Loader();
const allResources = {...Images, };
for (const res in allResources) {
  loader.addResource(allResources[res]);
}

export { Images, loader };
