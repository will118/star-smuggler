import { ProgramAst, parse } from './space-lang/parser';

export enum CodeComponent {
  LaserGun = "Laser",
  Shield = "Shield"
}

class Code {
  updateScript(component: CodeComponent, script: string) {
    window.localStorage.setItem(component, script);
  }

  getScript(component: CodeComponent): string {
    const code = window.localStorage.getItem(component);
    return code || '';
  }

  getParsed(component: CodeComponent): ProgramAst {
    return parse(this.getScript(component));
  }
}

const code = new Code();

export { code };
