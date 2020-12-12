import * as ex from 'excalibur';
import { loader } from './resources';
import { Ship } from './actors/ship';
import { Container } from './container';
import { Grid } from './actors/grid';
import { GameVm } from './game-vm';
import Config from './config';
import { eventStream } from './actors/ship-components/event-stream';

const game = new ex.Engine({
  canvasElementId: 'game',
  pointerScope: ex.Input.PointerScope.Canvas,
  height: Config.height,
  width: Config.width
});

const ship = new Ship();

const vm = new GameVm(eventStream, (x, y) => ship.fireGun(game, x, y));
console.log('Game VM started: ', vm);

const container = new Container(game, vm);

game.addScene('container', container);
game.goToScene('container');

const grid = new Grid();

game.start(loader).then(() => {
  game.add(ship);
  ship.on('pointerup', () => {
    container.openEditor(() => {
      game.remove(grid);
      game.start();
    });
    game.add(grid);
    game.stop();
  });
  // game.isDebug = true;
})
