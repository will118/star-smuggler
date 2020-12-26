import { parse } from './space-lang/parser';
import { ProgramAst } from './space-lang/types';

export enum CodeComponent {
  Chip1 = "Chip 1",
  Chip2 = "Chip 2",
  Chip3 = "Chip 3",
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
