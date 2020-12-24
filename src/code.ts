import { ProgramAst, parse } from './space-lang/parser';

export enum CodeComponent {
  Chip1 = "Chip 1",
  Chip2 = "Chip 2"
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
