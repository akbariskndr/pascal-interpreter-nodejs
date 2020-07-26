const { Token, TokenType, Operator, Keywords } = require('./token');

class Lexer {
  constructor(sourceCode) {
    this.sourceCode = sourceCode;
    this.position = 0;
    this.currentChar = this.sourceCode[this.position];
    this.currentLine = 1;
    this.currentCol = 1;
  }

  advance() {
    this.position += 1;
    this.currentCol += 1;

    if (this.position > this.sourceCode.length - 1) {
      this.currentChar = null;
    } else {
      this.currentChar = this.sourceCode[this.position]
    }
  }

  peek(offset = 1) {
    const next = this.position + offset;
    if (next > this.sourceCode.length - 1) {
      return null
    }

    return this.sourceCode[next];
  }

  isNumeric(char) {
    return /[0-9]/.test(char);
  }

  isDot(char) {
    return char === '.';
  }

  isHexadecimal(char) {
    return /[a-fA-F0-9]/.test(char);
  }

  isHexaIdentifier(char) {
    return char === 'x';
  }

  isWhiteSpace(char) {
    return [' ', '\t', '\n'].includes(char);
  }

  isNewLine(char) {
    return char === '\n';
  }

  isOperator(char) {
    return Object.keys(Operator).includes(char);
  }

  isAlphanum(char) {
    return /[a-zA-Z0-9]/.test(char);
  }

  isAlpha(char) {
    return /[a-zA-Z]/.test(char);
  }

  numeric() {
    let result = '';
    while (this.currentChar !== null && this.isNumeric(this.currentChar)) {
      result += this.currentChar;
      this.advance();
    }

    return new Token(
      TokenType.TOKEN_INTEGER,
      Number(result),
      this.currentLine,
      this.currentCol
    );
  }

  whiteSpace() {
    while (this.currentChar !== null && this.isWhiteSpace(this.currentChar)) {
      this.advance();
    }
  }

  operator() {
    const result = this.currentChar;
    this.advance();

    return new Token(
      Operator[result],
      result,
      this.currentLine,
      this.currentCol
    );
  }

  id() {
    let result = '';
    while (this.currentChar !== null && this.isAlphanum(this.currentChar)) {
      result += this.currentChar;
      this.advance();
    }

    const token = Object.keys(Keywords).includes(result)
      ? new Token(Keywords[result], result, 0, 0)
      : new Token(TokenType.TOKEN_ID, result, 0, 0);

    return token;
  }

  getNextToken() {
    while (this.currentChar !== null) {
      if (this.isWhiteSpace(this.currentChar)) {
        this.whiteSpace();
      }

      if (this.isAlpha(this.currentChar)) {
        return this.id();
      }

      if (this.currentChar === ':' && this.peek() === '=') {
        this.advance();
        this.advance();
        return new Token(TokenType.TOKEN_ASSIGN, ':=', 0, 0);
      }

      if (this.isOperator(this.currentChar)) {
        return this.operator();
      }

      if (this.isNumeric(this.currentChar)) {
        return this.numeric();
      }

      throw new Error(`Unidentified character '${this.currentChar}' at ${this.position + 1}`);
    }

    return new Token(
      TokenType.TOKEN_EOF,
      '<EOF>',
      this.currentLine,
      this.currentCol
    );
  }
}

module.exports = Lexer;
