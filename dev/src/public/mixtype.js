class Mixtype {
  constructor(options = {}) {
    options = JSON.parse(JSON.stringify(options));
    this.name = options.name || '';
    this.key = Mixtype.getKey();
    this.prestyles = options.prestyles || [];
    this.styles = options.styles || [];
    this.updateStyles();
    this.typeAttribute = options.typeAttribute || 'mt';
    this.keyAttr = `${this.typeAttribute}k`;
    this.styleAttr = `${this.typeAttribute}s`;
    this.ignoreTags = options.ignoreTags || [
      'HEAD',
      'META',
      'LINK',
      'SCRIPT',
      'STYLE',
      'INPUT',
      'TEXTAREA',
      'PRE',
      'CODE',
      'XML',
      'SVG',
    ];
    this.ignoreAttributes = options.ignoreAttributes || ['nomixtype'];
    this.ignoreClasses = options.ignoreClasses || ['material-symbols-outlined'];
  }

  update(options = {}) {
    options = JSON.parse(JSON.stringify(options));
    if (options.name) {
      this.name = options.name;
    }
    if (options.prestyles) {
      this.prestyles = options.prestyles;
    }
    if (options.styles) {
      this.styles = options.styles;
      this.updateStyles();
    }
  }

  updateStyles() {
    for (let i = 0; i < this.styles.length; i++) {
      this.styles[i].matcher = new RegExp(this.styles[i].matcher);
    }
  }

  getType(char) {
    for (const style of this.styles) {
      if (char.match(style.matcher)) {
        return style.key;
      }
    }
    return 'null';
  }

  getTextNodes(element) {
    const textNodes = [];
    for (const node of element.childNodes) {
      if (node.nodeName === '#text') {
        textNodes.push(node);
      } else {
        if (
          node.hasAttribute &&
          !this.ignoreTags.includes(node.nodeName) &&
          !node.hasAttribute(this.keyAttr) &&
          node
            .getAttributeNames()
            .filter((e) => new Set(this.ignoreAttributes).has(e)).length <= 0 &&
          [...node.classList].filter((e) => new Set(this.ignoreClasses).has(e))
            .length <= 0
        ) {
          textNodes.push(...this.getTextNodes(node));
        }
      }
    }
    return textNodes;
  }

  replaceNode(node, type, content) {
    const span = document.createElement('span');
    span.setAttribute(this.keyAttr, this.key);
    span.setAttribute(this.styleAttr, type);
    span.innerText = content;
    node.parentNode.insertBefore(span, node);
  }

  apply(element) {
    element.setAttribute(this.keyAttr, this.key);
    element.querySelector(`style[${this.keyAttr}="${this.key}"]`)?.remove();
    element.appendChild(this.getStyleTag());

    const textNodes = this.getTextNodes(element);
    for (const node of textNodes) {
      let value = node.nodeValue;
      value = value.replace(/\r|\n/g, '');
      if (!value.replace(/ /g, '')) {
        continue;
      }
      let bufferType = '';
      let buffer = '';
      for (let i = 0; i < value.length; i++) {
        const char = value.charAt(i);
        const type = this.getType(char);
        if (bufferType && bufferType != type) {
          this.replaceNode(node, bufferType, buffer);
          buffer = char;
        } else {
          buffer += char;
        }
        bufferType = type;
      }
      this.replaceNode(node, bufferType, buffer);
      node.parentNode.removeChild(node);
    }
  }

  getStyleTag() {
    let content = ``;

    for (const line of this.prestyles) {
      content += line;
    }

    content += `[${this.keyAttr}="${this.key}"][${this.styleAttr}] {`;
    content += `vertical-align: baseline;`;
    content += `position: relative;`;
    content += `color: inherit;`;
    content += `cursor: inherit;`;
    content += `text-decoration: none;`;
    content += `font-family: inherit;`;
    content += `font-size: 1em;`;
    content += `line-height: 1px;`;
    content += `}`;

    for (const style of this.styles) {
      content += `[${this.keyAttr}="${this.key}"][${this.styleAttr}="${style.key}"] {`;
      if (style.font !== undefined) {
        content += `font-family: ${style.font};`;
      }
      if (style.size !== undefined) {
        content += `font-size: ${style.size}em;`;
      }
      if (style.offset !== undefined) {
        content += `bottom: ${style.offset}em;`;
      }
      if (style.weight !== undefined) {
        content += `font-weight: ${style.weight};`;
      }
      if (style.width !== undefined) {
        content += `font-stretch: ${style.width * 100}%;`;
      }
      content += `}`;
    }

    const element = document.createElement('style');
    element.setAttribute(this.keyAttr, this.key);
    element.textContent = content;
    return element;
  }

  static getKey() {
    let res = '';
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const l = chars.length;
    for (let i = 0; i < 6; i++) {
      res += chars.charAt(Math.floor(Math.random() * l));
    }
    return res;
  }

  static Preset = {
    LATIN: '[A-Za-zÀ-ÖØ-žſ-ʯЀ-ԯ]',
    NUMBER: '[0-9]',
    HANGUL: '[ㄱ-ㅎㅏ-ㅣ가-힣ㅥ-ㆎ]',
    /* 작업중 */
    LATIN_PUNCT: '[?!]',
    HANGUL_PUNCT: '[.]',
    BRACKETS: '[(){}[]]',
    HANGUL_BRACKETS: '[《》〈〉「」『』【】〔〕]',
    MATH_SYMBOLS: '[+−×·<>=]',
    HANJA: '[⺀-⿕㐀-䶵一-鿦豈-龎]',
    GANA: '[ぁ-ヿㇰ-ㇿ]',
  };
}

export { Mixtype };

export default Mixtype;
