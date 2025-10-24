class Mixtype {
  constructor(name, options = {}) {
    this.name = name;
    this.key = this.getKey();
    this.styles = options.styles;
    this.matchers = options.matchers || {
      latin: Mixtype.Preset.LATIN,
      number: Mixtype.Preset.NUMBER,
      hangul: Mixtype.Preset.HANGUL,
      hanja: Mixtype.Preset.HANJA,
      gana: Mixtype.Preset.GANA,
    };
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

  getType(char) {
    for (const style of this.styles) {
      if (char.match(style.matcher)) {
        return style.name;
      }
    }
    return 'others';
  }

  getTextNodes(element) {
    const textNodes = [];
    for (const node of element.childNodes) {
      if (node.nodeName === '#text') {
        textNodes.push(node);
      } else {
        if (
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
    const span = document.createElement('div');
    span.setAttribute(this.keyAttr, this.key);
    span.setAttribute(this.styleAttr, type);
    const con = document.createElement('span');
    con.innerText = content;
    span.appendChild(con);
    node.parentNode.insertBefore(span, node);
  }

  apply(element) {
    element.setAttribute(`${this.typeAttribute}-key`, this.key);
    const prevStyle = element.querySelector(
      `style[${this.keyAttr}="${this.key}"]`
    );
    if (prevStyle) {
      prevStyle.remove();
    }
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
    content += `[${this.keyAttr}="${this.key}"][${this.styleAttr}] {`;
    content += `  vertical-align: top;`;
    content += `  position: relative;`;
    content += `  color: inherit;`;
    content += `  cursor: inherit;`;
    content += `  height: 1em;`;
    content += `  display: inline-block;`;
    content += `  text-decoration: inherit;`;
    content += `}`;

    content += `[${this.keyAttr}="${this.key}"][${this.styleAttr}] > span {`;
    content += `  vertical-align: top;`;
    content += `  position: relative;`;
    content += `  color: inherit;`;
    content += `  cursor: inherit;`;
    content += `  text-decoration: none;`;
    content += `  font-family: inherit;`;
    content += `  font-size: 1em;`;
    content += `  line-height: 1em;`;
    content += `}`;

    for (const style of this.styles) {
      content += `[${this.keyAttr}="${this.key}"][${this.styleAttr}="${style.name}"] > span {`;
      if (style.font !== undefined) {
        content += `  font-family: ${style.font};`;
      }
      if (style.size !== undefined) {
        content += `  font-size: ${style.size}em;`;
      }
      if (style.weight !== undefined) {
        content += `  font-weight: ${style.weight};`;
      }
      if (style.width !== undefined) {
        content += `  font-strech: ${style.width * 100}%;`;
      }
      if (style.offset !== undefined) {
        content += `  bottom: ${style.offset}em;`;
      }
      content += `}`;
    }

    const element = document.createElement('style');
    element.setAttribute(this.keyAttr, this.key);
    element.textContent = content;
    return element;
  }

  getKey() {
    let res = '';
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const l = chars.length;
    for (let i = 0; i < 6; i++) {
      res += chars.charAt(Math.floor(Math.random() * l));
    }
    return res;
  }

  static Preset = {
    LATIN: /[A-Za-zÀ-ÖØ-žſ-ʯЀ-ԯ]/,
    NUMBER: /[0-9]/,
    HANGUL: /[ㄱ-ㅎㅏ-ㅣ가-힣ㅥ-ㆎ]/,
    HANJA: /[⺀-⿕㐀-䶵一-鿦豈-龎]/,
    GANA: /[ぁ-ヿㇰ-ㇿ]/,
  };
}

export default Mixtype;
export { Mixtype };

window.Mixtype = Mixtype;
