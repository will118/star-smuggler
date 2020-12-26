import { InstructionDocs } from './space-lang/types';
import { OperandDocs, ReadWrite, EventTypeLookup } from './actors/ship-components/event-stream';

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

  const f = (key: string, docs: OperandDocs) => `<b>${key}</b> ${docs.io} [${docs.args}] ${docs.help}`;
  return `${systemTypes.map(([key, docs]) => f(key, docs)).join('<br/>')}
    <br />
    ${userTypes.map(([key, docs]) => f(key, docs)).join('<br/>')}`;
}

export const generateDocs = () => `
    <h2>Instructions</h2>
    ${generateInstructionDocs()}
    <h2>System Event Types</h2>
    ${generateEventTypes()}
`;
