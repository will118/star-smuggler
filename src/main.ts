import * as ex from "excalibur";
import { Ship } from './ship';
import { bg, map } from './map';
import { Overlay } from './overlay';

const game = new ex.Engine({
  canvasElementId: 'game',
  pointerScope: ex.Input.PointerScope.Canvas,
  height: 900,
  width: 1600
});

const loader = new ex.Loader([bg]);

const ship = new Ship();

const overlay = new Overlay(game);

game.addScene('overlay', overlay);
game.goToScene('overlay');

game.start(loader).then(() => {
  game.addTileMap(map);
  game.add(ship);
  game.currentScene.camera.strategy.lockToActor(ship);
  ship.on('pointerup', () => {
    overlay.openEditor();
  });
})
