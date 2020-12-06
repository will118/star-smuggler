import { ProgramAst, parse } from './space-lang/parser';

export enum Component {
  LaserGun
}

class Code {
  private _componentScripts: Map<Component, string>;

  constructor() {
    this._componentScripts = new Map<Component, string>();
  }

  updateScript(component: Component, script: string) {
    this._componentScripts.set(component, script);
  }

  getScript(component: Component): string {
    const code = this._componentScripts.get(component);
    return code || '';
  }

  getParsed(component: Component): ProgramAst {
    return parse(this.getScript(component));
  }
}

const code = new Code();

export { code };
