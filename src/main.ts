import * as ex from 'excalibur';
import { loader } from './resources';
import { Ship } from './actors/ship';
import { AsteroidField } from './actors/asteroid';
import { Container } from './container';

const game = new ex.Engine({
  canvasElementId: 'game',
  pointerScope: ex.Input.PointerScope.Canvas,
  height: 900,
  width: 1600
});

const ship = new Ship();
const asteroidField = new AsteroidField();
const container = new Container(game);

game.addScene('container', container);
game.goToScene('container');

game.start(loader).then(() => {
  game.add(ship);
  ship.on('pointerup', () => {
    container.openEditor();
    // ship.fireGun(game);
  });
  game.add(asteroidField);
  // game.isDebug = true;
})
