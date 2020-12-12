import Config from "./config";

class Stats {
  public hp: number = Config.totalHp;
  public max: number = Config.totalHp;
  public energy: number = Config.totalEnergy / 2;
  public gameOver: () => boolean = () => this.hp <= 0;
  public score: number = 0;
  public reset() {
    this.hp = Config.totalHp;
    this.energy = Config.totalEnergy / 2;
    this.score = 0;
  }
}

const stats = new Stats()


export { stats }
