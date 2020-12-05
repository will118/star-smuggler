const Config = {
  playerBulletVelocity : -1_000,
  backgroundSpeed: 50, // 10 best for actual game
  bulletSize: 5,
  totalHp: 100,
  healthBarHeight : 25,
  healthBarWidth : 400,
  // probably not safe to change but ideally should be able to
  width: 1600,
  height: 900,
  components: {
    scanner: {
      redetectionTickCount: 1_000,
    },
  },
}

export default Config;
