# Mixtype Documentation

## 개요

Mixtype은 웹에서 사용하기 쉬운 **섞어짜기(합성 글꼴)** 라이브러리입니다. 한 줄의 텍스트에서 서로 다른 문자 유형(한글, 영문, 숫자, 기호 등)을 각각 다른 폰트로 렌더링하여 시각적으로 조화로운 타이포그래피를 구현할 수 있습니다.

## 주요 기능

- **다중 폰트 지원**: 한 줄에서 문자 유형별로 다른 폰트 적용
- **자동 문자 분류**: 정규식을 통한 문자 유형 자동 인식
- **유연한 스타일링**: 폰트, 크기, 굵기, 기준선 조정 등 세밀한 제어
- **DOM 기반**: 기존 HTML 요소에 쉽게 적용 가능
- **가벼움**: 의존성 없는 순수 JavaScript 라이브러리

## 설치 및 사용

### ES6 모듈 방식

```javascript
import Mixtype from './mixtype.js';
```

### 기본 사용법

```javascript
// Mixtype 인스턴스 생성
const mixtype = new Mixtype({
  name: 'My Mixtype',
  styles: [
    {
      key: 'latin',
      matcher: '[A-Za-z]',
      font: 'Inter',
      size: 1.0,
      offset: 0,
      weight: 400,
    },
    {
      key: 'hangul',
      matcher: '[가-힣]',
      font: 'Noto Sans KR',
      size: 1.0,
      offset: 0,
      weight: 400,
    },
  ],
});

// HTML 요소에 적용
const element = document.getElementById('my-text');
mixtype.apply(element);
```

## API 참조

### 생성자 (Constructor)

```javascript
new Mixtype(options);
```

#### 매개변수 (options)

| 속성               | 타입     | 기본값                          | 설명                         |
| ------------------ | -------- | ------------------------------- | ---------------------------- |
| `name`             | string   | `''`                            | Mixtype 인스턴스의 이름      |
| `prestyles`        | string[] | `[]`                            | 전처리 CSS 스타일 배열       |
| `styles`           | object[] | `[]`                            | 문자 유형별 스타일 정의 배열 |
| `typeAttribute`    | string   | `'mt'`                          | HTML 속성 접두사             |
| `ignoreTags`       | string[] | `['HEAD', 'META', ...]`         | 처리에서 제외할 HTML 태그    |
| `ignoreAttributes` | string[] | `['nomixtype']`                 | 처리에서 제외할 HTML 속성    |
| `ignoreClasses`    | string[] | `['material-symbols-outlined']` | 처리에서 제외할 CSS 클래스   |

#### 스타일 객체 (styles)

각 스타일 객체는 다음 속성을 가집니다:

| 속성      | 타입   | 필수 | 설명                           |
| --------- | ------ | ---- | ------------------------------ |
| `key`     | string | ✓    | 스타일 식별자                  |
| `matcher` | string | ✓    | 문자 매칭을 위한 정규식 문자열 |
| `font`    | string | -    | 폰트 패밀리                    |
| `size`    | number | -    | 폰트 크기 (em 단위)            |
| `offset`  | number | -    | 기준선 오프셋 (em 단위)        |
| `weight`  | number | -    | 폰트 굵기                      |
| `width`   | number | -    | 폰트 너비 (100% = 1.0)         |

### 인스턴스 메서드

#### `update(options)`

Mixtype 인스턴스의 설정을 업데이트합니다.

```javascript
mixtype.update({
  name: 'Updated Name',
  styles: [
    // 새로운 스타일 배열
  ],
});
```

#### `apply(element)`

지정된 HTML 요소에 Mixtype을 적용합니다.

```javascript
const element = document.getElementById('text');
mixtype.apply(element);
```

### 정적 속성

#### `Mixtype.Preset`

미리 정의된 문자 유형 정규식 패턴들:

```javascript
Mixtype.Preset.LATIN; // '[A-Za-zÀ-ÖØ-žſ-ʯЀ-ԯ]'
Mixtype.Preset.NUMBER; // '[0-9]'
Mixtype.Preset.HANGUL; // '[ㄱ-ㅎㅏ-ㅣ가-힣ㅥ-ㆎ]'
Mixtype.Preset.HANJA; // '[⺀-⿕㐀-䶵一-鿦豈-龎]'
Mixtype.Preset.GANA; // '[ぁ-ヿㇰ-ㇿ]'
Mixtype.Preset.LATIN_PUNCT; // '[?!]'
Mixtype.Preset.HANGUL_PUNCT; // '[.]'
Mixtype.Preset.BRACKETS; // '[(){}[]]'
Mixtype.Preset.HANGUL_BRACKETS; // '[《》〈〉「」『』【】〔〕]'
Mixtype.Preset.MATH_SYMBOLS; // '[+−×·<>=]'
```

## 사용 예제

### 기본 예제

```javascript
const mixtype = new Mixtype({
  name: 'Basic Example',
  styles: [
    {
      key: 'latin',
      matcher: Mixtype.Preset.LATIN,
      font: 'Inter',
      size: 1.0,
      weight: 400,
    },
    {
      key: 'hangul',
      matcher: Mixtype.Preset.HANGUL,
      font: 'Noto Sans KR',
      size: 1.0,
      weight: 400,
    },
    {
      key: 'number',
      matcher: Mixtype.Preset.NUMBER,
      font: 'JetBrains Mono',
      size: 0.9,
      weight: 500,
    },
  ],
});

// HTML에 적용
document.addEventListener('DOMContentLoaded', () => {
  const textElement = document.getElementById('mixed-text');
  mixtype.apply(textElement);
});
```

### 고급 예제 - 기준선 조정

```javascript
const mixtype = new Mixtype({
  name: 'Advanced Example',
  prestyles: ['/* 전처리 스타일 */', '.custom-baseline { line-height: 1.2; }'],
  styles: [
    {
      key: 'latin',
      matcher: '[A-Za-z]',
      font: 'Inter',
      size: 1.0,
      offset: 0,
      weight: 400,
    },
    {
      key: 'hangul',
      matcher: '[가-힣]',
      font: 'Noto Sans KR',
      size: 1.0,
      offset: -0.05, // 기준선을 0.05em 위로 조정
      weight: 400,
    },
    {
      key: 'number',
      matcher: '[0-9]',
      font: 'JetBrains Mono',
      size: 0.85,
      offset: 0.02, // 기준선을 0.02em 아래로 조정
      weight: 500,
    },
  ],
});
```

### HTML 예제

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Mixtype Example</title>
    <style>
      body {
        font-family: 'Inter', sans-serif;
        margin: 2rem;
      }
      .mixed-text {
        font-size: 24px;
        line-height: 1.5;
      }
    </style>
  </head>
  <body>
    <div class="mixed-text" id="text">
      안녕하세요 Hello World 1234! 한글과 영문이 섞인 텍스트입니다.
    </div>

    <script type="module">
      import Mixtype from './mixtype.js';

      const mixtype = new Mixtype({
        styles: [
          {
            key: 'latin',
            matcher: Mixtype.Preset.LATIN,
            font: 'Inter',
            size: 1.0,
            weight: 400,
          },
          {
            key: 'hangul',
            matcher: Mixtype.Preset.HANGUL,
            font: 'Noto Sans KR',
            size: 1.0,
            weight: 400,
          },
          {
            key: 'number',
            matcher: Mixtype.Preset.NUMBER,
            font: 'JetBrains Mono',
            size: 0.9,
            weight: 500,
          },
        ],
      });

      mixtype.apply(document.getElementById('text'));
    </script>
  </body>
</html>
```

## 고급 사용법

### 동적 스타일 업데이트

```javascript
// 초기 설정
const mixtype = new Mixtype({
  styles: [
    { key: 'latin', matcher: '[A-Za-z]', font: 'Inter' },
    { key: 'hangul', matcher: '[가-힣]', font: 'Noto Sans KR' },
  ],
});

// 런타임에 스타일 업데이트
mixtype.update({
  styles: [
    { key: 'latin', matcher: '[A-Za-z]', font: 'Inter', size: 1.1 },
    { key: 'hangul', matcher: '[가-힣]', font: 'Noto Sans KR', size: 1.0 },
    { key: 'number', matcher: '[0-9]', font: 'JetBrains Mono', size: 0.9 },
  ],
});
```

### 특정 요소 제외

```html
<div class="mixed-text">
  이 텍스트는 Mixtype이 적용됩니다.
  <span nomixtype>이 텍스트는 제외됩니다.</span>
  <code>이 코드 블록도 제외됩니다.</code>
</div>
```
