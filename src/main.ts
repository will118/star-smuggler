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

game.addScene('container', new Container(game));
game.goToScene('container');

game.start(loader).then(() => {
  game.add(ship);
  ship.on('pointerup', () => {
    // overlay.openEditor();
    ship.fireGun(game);
  });
  game.add(asteroidField);
  // game.isDebug = true;
})
