import * as ex from 'excalibur';
import { stats } from '../stats'

export const scoreLabel = () => {
  const scoreLabel = new ex.Label('Score: ' + stats.score, 20, 50);
  scoreLabel.color = ex.Color.LightGray;
  scoreLabel.scale = new ex.Vector(3, 3);
  scoreLabel.on('preupdate', () => {
    scoreLabel.text = 'Score: ' + stats.score;
  });

  return scoreLabel;
}
