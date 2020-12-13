import { InstructionDocs, EventTypeLookup } from './space-lang/parser';

const generateInstructionDocs = () => {
  return Object.entries(InstructionDocs).sort().map(([instruction, docs]) => {
    return `<p>
      <b>${instruction}</b> (e.g. <i>${docs.example}</i>)
      <br/>
      ${docs.help}
    </p>`;
  }).join('\n');
}

const generateEventTypes = () => {
  return Object.entries(EventTypeLookup).sort().map(([key, docs]) => {
    return `<b>${key}</b> ${docs.help} (${docs.io}) [${docs.args}]`;
  }).join('<br/>');
}

export const generateDocs = () => `
    ${generateInstructionDocs()}
    <p>Event Types:</p>
    ${generateEventTypes()}
`;
