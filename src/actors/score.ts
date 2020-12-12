import * as ex from 'excalibur';
import { stats } from '../stats'
import { position, Horizontal, Vertical } from '../position';

export const scoreLabel = () => {
  const [x,y] = position(Vertical.Top, Horizontal.Left);
  const scoreLabel = new ex.Label('Score: ' + stats.score, x + 20, y + 50);
  scoreLabel.color = ex.Color.LightGray;
  scoreLabel.scale = new ex.Vector(3, 3);
  scoreLabel.on('preupdate', () => {
    scoreLabel.text = 'Score: ' + stats.score;
  });

  return scoreLabel;
}
