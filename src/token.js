class Token {
  constructor(type, value, line, col) {
    this.type = type;
    this.value = value;
    this.line = line;
    this.col = col;
  }
}

const TokenType = {
  TOKEN_INTEGER: 'TOKEN_INTEGER',
  TOKEN_EOF: 'TOKEN_EOF',
  TOKEN_OPERATOR_ADD: 'TOKEN_OPERATOR_ADD',
  TOKEN_OPERATOR_SUB: 'TOKEN_OPERATOR_SUB',
  TOKEN_OPERATOR_MUL: 'TOKEN_OPERATOR_MUL',
  TOKEN_OPERATOR_DIV: 'TOKEN_OPERATOR_DIV',
  TOKEN_OPEN_PARENTHESIS: 'TOKEN_OPEN_PARENTHESIS',
  TOKEN_CLOSE_PARENTHESIS: 'TOKEN_CLOSE_PARENTHESIS',
  TOKEN_DOT: 'TOKEN_DOT',
  TOKEN_SEMI: 'TOKEN_SEMI',
  TOKEN_BEGIN: 'TOKEN_BEGIN',
  TOKEN_END: 'TOKEN_END',
  TOKEN_ID: 'TOKEN_ID',
  TOKEN_ASSIGN: 'TOKEN_ASSIGN',
};

const Operator = {
  '+': TokenType.TOKEN_OPERATOR_ADD,
  '-': TokenType.TOKEN_OPERATOR_SUB,
  '*': TokenType.TOKEN_OPERATOR_MUL,
  '/': TokenType.TOKEN_OPERATOR_DIV,
  '(': TokenType.TOKEN_OPEN_PARENTHESIS,
  ')': TokenType.TOKEN_CLOSE_PARENTHESIS,
  '.': TokenType.TOKEN_DOT,
  ';': TokenType.TOKEN_SEMI,
};

const Keywords = {
  BEGIN: TokenType.TOKEN_BEGIN,
  END: TokenType.TOKEN_END,
};

module.exports = {
  Token, TokenType, Operator, Keywords,
};
