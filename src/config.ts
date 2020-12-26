const Config = {
  playerBulletVelocity : -1_000,
  backgroundSpeed: 50, // 10 best for actual game
  bulletSize: 5,
  bulletSpeed: 500,
  totalHp: 100,
  totalEnergy: 1_000,
  enemyTrigger: 5, // if score goes above, spawn enemy
  enemyHealth: 100,
  shieldEnergyPerTick: 5,
  energyPerTick: 1,
  energyPerShot: 50,
  healthBarHeight : 25,
  healthBarWidth : 400,
  // probably not safe to change but ideally should be able to
  width: 1600,
  height: 900,
  components: {
    scanner: {
      redetectionTickCount: 100_000,
    },
  },
}

export default Config;
