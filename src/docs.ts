import { InstructionDocs, OperandDocs, ReadWrite, EventTypeLookup } from './space-lang/types';

const generateInstructionDocs = () => {
  const formatExamples = (examples: Array<string>) => {
    return examples.map(e => `<i>${e}</i>`).join(', ');
  };
  return Object.entries(InstructionDocs).map(([instruction, docs]) => {
    return `<p>
      <b>${instruction}</b> (e.g. ${formatExamples(docs.examples)})
      <br />
      ${docs.help}
    </p>`;
  }).join('\n');
}

const generateEventTypes = () => {
  const types = Object.entries(EventTypeLookup);

  const systemTypes = types.filter(([_key, docs]) => docs.io === ReadWrite.Read);
  const userTypes = types.filter(([_key, docs]) => docs.io !== ReadWrite.Read);

  const f = (key: string, docs: OperandDocs) => `<b>${key}</b> [${docs.args}] ${docs.help}`;
  return `<h3>System (raised by system, actioned by user)</h3>
    ${systemTypes.map(([key, docs]) => f(key, docs)).join('<br/>')}
    <h3>User (raised by user, actioned by system)</h3>
    ${userTypes.map(([key, docs]) => f(key, docs)).join('<br/>')}
  `;
}

export const generateDocs = () => `
    <h2>Instructions</h2>
    ${generateInstructionDocs()}
    <h2>Event Types</h2>
    ${generateEventTypes()}
`;
