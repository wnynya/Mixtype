import Mixtype from '../mixtype.js';

const mixtype = new Mixtype({
  name: 'fontname',
  styles: [
    {
      name: 'latin',
      matcher: Mixtype.Preset.LATIN,
      font: `"Suisse Intl"`,
      size: 0.98,
      offset: -0.07,
    },
    {
      name: 'number',
      matcher: Mixtype.Preset.NUMBER,
      font: `"Bodoni 72"`,
      size: 1.0,
      offset: -0.07,
      width: 2.0,
    },
    {
      name: 'hangul',
      matcher: Mixtype.Preset.HANGUL,
      font: `"OnulDamso"`,
      weight: 500,
      size: 1.0,
      offset: 0,
    },
    {
      name: 'brakets',
      matcher: /[()]/,
      font: `"Pretendard"`,
      weight: 300,
      size: 1.0,
      offset: -0.01,
    },
  ],
});

document.querySelector('#sample').addEventListener('keyup', () => {
  update();
});
document.querySelector('#sample').addEventListener('keydown', () => {
  update();
});
document.querySelector('#font-size').addEventListener('input', () => {
  update();
});
document.querySelector('#line-height').addEventListener('input', () => {
  update();
});

for (let i = 0; i < 20; i++) {
  const baseline = document.createElement('div');
  baseline.classList.add('line');
  document.querySelector('.guide.baseline').appendChild(baseline);
  const lineheight = document.createElement('div');
  lineheight.classList.add('line');
  document.querySelector('.guide.lineheight').appendChild(lineheight);
}

function update() {
  const fs = document.querySelector('#font-size > input').value;
  document.querySelector('#font-size > .value').innerHTML = `${fs}pt`;
  const lh = document.querySelector('#line-height > input').value;
  document.querySelector('#line-height > .value').innerHTML = `${lh}%`;

  let fsp = fs * 1.3333343412075;
  let fsph = fsp / 2;
  let lhp = fsp * (lh / 100);
  for (const line of document.querySelectorAll('.guide.baseline > .line')) {
    line.style.height = `${lhp * 0.5 + fsph}px`;
    line.style.marginBottom = `${lhp * 0.5 - fsph}px`;
  }
  for (const line of document.querySelectorAll('.guide.lineheight > .line')) {
    line.style.height = `${lhp}px`;
  }

  const dt = document.querySelector('#display-text');

  dt.style.fontSize = `${fs}pt`;
  dt.style.lineHeight = `${lh}%`;
  let sample = document.querySelector('#sample').value;
  sample = sample.replace(/\n/g, '<br />');
  dt.innerHTML = sample;

  mixtype.apply(dt);
}
update();

window.mixtype = mixtype;
