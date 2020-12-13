import { ProgramAst, parse } from './space-lang/parser';

export enum Component {
  LaserGun = "LaserGun"
}

class Code {
  updateScript(component: Component, script: string) {
    window.localStorage.setItem(component, script);
  }

  getScript(component: Component): string {
    const code = window.localStorage.getItem(component);
    return code || '';
  }

  getParsed(component: Component): ProgramAst {
    return parse(this.getScript(component));
  }
}

const code = new Code();

export { code };
