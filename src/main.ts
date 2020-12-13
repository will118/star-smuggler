import * as ex from 'excalibur';
import { loader } from './resources';
import { Container } from './container';
import Config from './config';

const game = new ex.Engine({
  canvasElementId: 'game',
  pointerScope: ex.Input.PointerScope.Canvas,
  height: Config.height,
  width: Config.width
});

const container = new Container(game);

game.addScene('container', container);
game.goToScene('container');

game.start(loader).then(() => {
  // game.isDebug = true;
})
