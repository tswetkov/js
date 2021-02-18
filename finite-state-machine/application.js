import { createMachine, interpret } from './machine';

//  Avaliale states:
//  1. Initial state (empty)
//  2. After click (editing)
//  3. After save (filled)
//  4. After delete (empty)

//  Transitions:
//  1. empty => editing
//  2. editing => empty
//  3. editing => filled
//  4. filled => editing

const createForm = ({ name }, callback) => {
  const form = document.createElement('form');
  const input = document.createElement('input');
  const submit = document.createElement('input');

  form.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  input.setAttribute('type', 'text');
  input.setAttribute('name', name);
  input.setAttribute('value', '');

  submit.setAttribute('type', 'submit');
  submit.value = 'Save';

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    callback(input.value);
  });

  form.appendChild(input);
  form.appendChild(submit);
  return {
    formElement: form,
    focus() {
      input.focus();
    },
  };
};

const makeElementEditable = (element) => {
  const editingMachine = createMachine({
    initial: 'empty',
    states: {
      empty: { on: { EDIT: 'editing' } },
      editing: { on: { SAVE_EMPTY: 'empty', SAVE_VALUE: 'filled' } },
      filled: { on: { EDIT: 'editing' } },
    },
  });
  const editingService = interpret(editingMachine);

  const handleSubmit = (value) =>
    value
      ? editingService.send('SAVE_VALUE', value)
      : editingService.send('SAVE_EMPTY');

  const clonedElementContent = element.firstElementChild.cloneNode(true);
  const elementName = element.getAttribute('data-editable-target');
  const form = createForm({ name: elementName }, handleSubmit);
  element.addEventListener('click', () => editingService.send('EDIT'));

  function render(node) {
    element.innerHTML = '';
    element.appendChild(node);
  }

  editingService.onTransition((state, payload) => {
    switch (state) {
      case 'empty':
        render(clonedElementContent);
        break;
      case 'editing':
        render(form.formElement);
        form.focus();
        break;
      case 'filled':
        render(document.createTextNode(payload));
        break;
      default:
        throw new Error(`Invalid state machine case: ${state}`);
    }
  });
};

const app = () => {
  const elements = document.querySelectorAll('[data-editable-target]');
  elements.forEach(makeElementEditable);
};

export default app;
