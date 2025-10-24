import Mixtype from '../mixtype.js';
let MixtypeCode;
async function getMixtypeCode() {
  const res = await fetch('../mixtype.js');
  const text = await res.text();
  let lines = text.split('\n');
  let code = '';
  for (let line of lines) {
    line = line.replace(/^\s+|\s+$/, '');
    if (line.startsWith('export')) {
      continue;
    }
    code += line;
  }
  MixtypeCode = code;
}
getMixtypeCode();

let currentSetting = {
  name: '새 믹스타입',
  prestyles: [],
  styles: [
    {
      name: '로마자',
      matcher: Mixtype.Preset.LATIN,
      font: `"Suisse Intl"`,
      size: 0.98,
      offset: -0.07,
    },
    {
      name: '숫자',
      matcher: Mixtype.Preset.NUMBER,
      font: `"Bodoni 72"`,
      size: 1.0,
      offset: -0.07,
      width: 2.0,
    },
    {
      name: '한글',
      matcher: Mixtype.Preset.HANGUL,
      font: `"OnulDamso"`,
      weight: 500,
      size: 1.0,
      offset: 0,
    },
    {
      name: '괄호',
      matcher: '[()]',
      font: `"Pretendard"`,
      weight: 300,
      size: 1.0,
      offset: -0.01,
    },
  ],
};
let mixtype = new Mixtype(currentSetting);

document.querySelector(
  '#control-sample'
).value = `테스트 문구 Test 1234\n다른 줄`;

for (let i = 0; i < 20; i++) {
  const baseline = document.createElement('div');
  baseline.classList.add('line');
  document.querySelector('.guide.baseline').appendChild(baseline);
  const lineheight = document.createElement('div');
  lineheight.classList.add('line');
  document.querySelector('.guide.lineheight').appendChild(lineheight);
}

function update() {
  let preview = document.querySelector('#control-sample').value;
  preview = preview.replace(/\n/g, '<br />');

  const fontsize = document.querySelector('#font-size  input').value;
  document.querySelector('#font-size  .value').innerHTML = `${fontsize}pt`;
  const lineheight = document.querySelector('#line-height  input').value;
  document.querySelector('#line-height  .value').innerHTML = `${lineheight}%`;

  let fsp = fontsize * 1.3333343412075;
  let fsph = fsp / 2;
  let lhp = fsp * (lineheight / 100);
  for (const line of document.querySelectorAll('.guide.baseline > .line')) {
    line.style.height = `${lhp * 0.5 + fsph}px`;
    line.style.marginBottom = `${lhp * 0.5 - fsph}px`;
  }
  for (const line of document.querySelectorAll('.guide.lineheight > .line')) {
    line.style.height = `${lhp}px`;
  }

  const display = document.querySelector('#display-sample');
  display.style.fontSize = `${fontsize}pt`;
  display.style.lineHeight = `${lineheight}%`;
  display.innerHTML = preview;

  currentSetting = domToSetting();
  settingToDom(currentSetting);

  mixtype.update(currentSetting);
  mixtype.apply(display);
}

document
  .querySelector('#input-stylesets-name')
  .addEventListener('change', () => {
    update();
    document.querySelector('#input-stylesets-name').blur();
  });
document
  .querySelector('#input-stylesets-name')
  .addEventListener('focus', () => {
    document.querySelector('#input-stylesets-name').select();
  });
document.querySelector('#control-sample').addEventListener('input', () => {
  update();
});
document.querySelector('#font-size input').addEventListener('input', () => {
  update();
});
document.querySelector('#line-height input').addEventListener('input', () => {
  update();
});
document.querySelector('#prestyles').addEventListener('change', () => {
  update();
});

function getInput() {
  const input = document.createElement('input');
  input.type = 'text';
  input.size = 1;
  input.spellcheck = false;
  input.addEventListener('focus', () => input.select());
  input.addEventListener('change', () => {
    update();
    input.blur();
  });
  return input;
}
const matcherOptions = {
  로마자: Mixtype.Preset.LATIN,
  숫자: Mixtype.Preset.NUMBER,
  한글: Mixtype.Preset.HANGUL,
  한자: Mixtype.Preset.HANJA,
  가나: Mixtype.Preset.GANA,
};
function getMatcherOption(name, value, selected = false, disabled = false) {
  const option = document.createElement('option');
  option.value = value;
  option.innerText = name;
  option.disabled = disabled;
  return option;
}
function getMatcherSelect(input) {
  const select = document.createElement('select');
  select.appendChild(getMatcherOption('사용자 지정', 'custom'));
  for (const name in matcherOptions) {
    select.appendChild(getMatcherOption(name, matcherOptions[name]));
  }

  select.addEventListener('change', () => {
    if (select.value === 'custom') {
      input.disabled = false;
    } else {
      input.value = select.value?.replace(/^\[|\]$/g, '');
      input.disabled = true;
    }
    update();
  });

  return select;
}
function getCell(name, content) {
  const cell = document.createElement('div');
  cell.classList.add('cell');
  cell.classList.add(name);
  content.forEach((element) => cell.appendChild(element));
  return cell;
}
function getPercent(n) {
  n = n * 100 * 100;
  n = Math.round(n) / 100;
  return n + '%';
}
function moveStyle(key, move) {
  let keyList = [];
  for (const style of currentSetting.styles) {
    keyList.push(style.key);
  }
  let index = keyList.indexOf(key);
  let newIndex = Math.min(
    currentSetting.styles.length - 1,
    Math.max(0, index + move)
  );
  if (index > -1) {
    const [removedElement] = currentSetting.styles.splice(index, 1);
    currentSetting.styles.splice(newIndex, 0, removedElement);
  }
}
function deleteStyle(key) {
  let keyList = [];
  for (const style of currentSetting.styles) {
    keyList.push(style.key);
  }
  let index = keyList.indexOf(key);
  currentSetting.styles.splice(index, 1);
}
function getElementFromStyle(style) {
  const element = document.createElement('div');
  element.classList.add('line');
  element.classList.add('value');
  element.setAttribute('style-key', style.key || Mixtype.getKey());

  const nameInput = getInput();
  nameInput.value = style.name || '';
  const nameCell = getCell('name', [nameInput]);
  element.appendChild(nameCell);

  const matcherInput = getInput();
  const matcherSelect = getMatcherSelect(matcherInput);
  let matcherString = style.matcher || '';
  const matcherOption = matcherSelect.querySelector(
    `[value="${matcherString}"]`
  );
  matcherOption ? (matcherOption.selected = true) : null;
  matcherInput.value = matcherString?.replace(/^\[|\]$/g, '');
  const matcherCell = getCell('matcher', [matcherSelect, matcherInput]);
  element.appendChild(matcherCell);

  const fontInput = getInput();
  const fontString = style.font?.replace(/^["']|["']$/g, '') || '';
  fontInput.value = fontString;
  const fontCell = getCell('font', [fontInput]);
  element.appendChild(fontCell);

  const sizeInput = getInput();
  sizeInput.value = getPercent(style.size || 1);
  const sizeCell = getCell('size', [sizeInput]);
  element.appendChild(sizeCell);

  const offsetInput = getInput();
  offsetInput.value = getPercent(style.offset || 0);
  const offsetCell = getCell('offset', [offsetInput]);
  element.appendChild(offsetCell);

  const weightInput = getInput();
  weightInput.value = style.weight || 'inherit';
  const weightCell = getCell('weight', [weightInput]);
  element.appendChild(weightCell);

  const upButton = document.createElement('button');
  upButton.innerHTML = '↑';
  upButton.addEventListener('click', () => {
    moveStyle(style.key, -1);
    settingToDom(currentSetting);
    update();
  });
  const downButton = document.createElement('button');
  downButton.innerHTML = '↓';
  downButton.addEventListener('click', () => {
    moveStyle(style.key, +1);
    settingToDom(currentSetting);
    update();
  });
  const deleteButton = document.createElement('button');
  deleteButton.innerHTML = '✕';
  deleteButton.addEventListener('click', () => {
    deleteStyle(style.key);
    settingToDom(currentSetting);
    update();
  });
  const controlCell = getCell('control', [upButton, downButton, deleteButton]);
  element.appendChild(controlCell);

  return element;
}
function getStyleFromElement(element) {
  const key = element.getAttribute('style-key');

  let name = element.querySelector('.name input').value;
  let matcher = element.querySelector('.matcher input').value;
  matcher = `[${matcher}]`;
  let font = element.querySelector('.font input').value || '';
  font = `"${font}"`;
  let size = element.querySelector('.size input').value || '100%';
  size = (size.replace('%', '') * 1) / 100;
  let offset = element.querySelector('.offset input').value || '0%';
  offset = (offset.replace('%', '') * 1) / 100;
  let weight = element.querySelector('.weight input').value || 'inherit';

  return { name, key, matcher, font, size, offset, weight };
}
function addStyle() {
  currentSetting.styles.push({
    key: Mixtype.getKey(),
  });
  settingToDom(currentSetting);
  update();
}

function settingToDom(setting) {
  const name = setting.name;
  document.querySelector('#input-stylesets-name').value = name;

  document.querySelector('#prestyles').value = setting.prestyles.join('\n');

  const values = document.querySelector('#editor .styles .table .values');
  values.innerHTML = '';
  for (const style of setting.styles) {
    const styleElement = getElementFromStyle(style);
    values.appendChild(styleElement);
  }
  const addLine = document.createElement('div');
  addLine.classList.add('line');
  addLine.classList.add('add');
  const addButton = document.createElement('button');
  addButton.innerHTML = '새 스타일 추가';
  addButton.addEventListener('click', () => {
    addStyle();
  });
  const addCell = getCell('add', [addButton]);
  addLine.appendChild(addCell);
  values.appendChild(addLine);
}
function domToSetting() {
  const setting = {
    name: document.querySelector('#input-stylesets-name').value,
    prestyles: document.querySelector('#prestyles').value.split('\n'),
    styles: [],
  };

  for (const element of document.querySelectorAll(
    '#styleset-styles .line[style-key]'
  )) {
    setting.styles.push(getStyleFromElement(element));
  }

  return setting;
}

function getSettingsString() {
  return JSON.stringify(currentSetting);
}
function getCodeString() {
  let code = '';
  code += MixtypeCode;
  code += `const mixtype = new Mixtype(${getSettingsString()});`;
  code += `mixtype.apply(document.body);`;
  return code;
}
document.querySelector('#button-copy-code').addEventListener('click', () => {
  navigator.clipboard.writeText(getCodeString());
});
document
  .querySelector('#button-copy-settings')
  .addEventListener('click', () => {
    navigator.clipboard.writeText(getSettingsString());
  });
document
  .querySelector('#button-export-settings')
  .addEventListener('click', () => {
    const blob = new Blob([getSettingsString()], {
      type: 'text/plain;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    let filename = `${currentSetting.name}.json`;
    filename = filename.replace(/ /g, '-');
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
document
  .querySelector('#button-import-settings')
  .addEventListener('click', () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.click();
    fileInput.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();

        reader.onload = (e) => {
          try {
            const con = JSON.parse(e.target.result);
            settingToDom(con);
            update();
          } catch (error) {
            console.warn(error);
            alert('설정 파일을 읽는 중 오류가 발생하였습니다.\n' + error);
          }
        };
        reader.onerror = () => {
          alert('설정 파일을 읽는 중 오류가 발생하였습니다.');
        };
        reader.readAsText(file);
      }
    });
  });

settingToDom(currentSetting);
update();

window.mixtype = mixtype;
window.getSettingsString = getSettingsString;
window.getCodeString = getCodeString;
