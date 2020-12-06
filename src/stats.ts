import Config from "./config";

class Stats {
  public hp: number = Config.totalHp;
  public energy: number = Config.totalEnergy / 2;
  public gameOver: boolean = false;
  public score: number = 0;
  public reset() {
    this.hp = Config.totalHp;
    this.energy = Config.totalEnergy / 2;
    this.gameOver = false;
    this.score = 0;
  }
}

const stats = new Stats()


export { stats }
