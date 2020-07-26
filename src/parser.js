const { TokenType, Token } = require('./token');
const {
  BinaryOperatorNode,
  NumericNode,
  UnaryOperatorNode,
  CompoundStatementNode,
  AssignNode,
  VarNode,
  NoOpNode,
} = require('./ast');

class Parser {
  constructor(lexer) {
    this.lexer = lexer;
    this.currentToken = this.lexer.getNextToken();
  }

  eat(type) {
    if (this.currentToken.type === type) {
      this.currentToken = this.lexer.getNextToken();
    } else {
      throw new Error(`Expected token '${type}', got '${this.currentToken.type}' instead at ${this.currentToken.line}, ${this.currentToken.col}}`);
    }
  }

  program() {
    const node = this.compoundStatement();
    this.eat(TokenType.TOKEN_DOT);

    return node;
  }

  compoundStatement() {
    this.eat(TokenType.TOKEN_BEGIN);
    const nodes = this.statementList();
    this.eat(TokenType.TOKEN_END);

    const root = new CompoundStatementNode();
    for (const node of nodes) {
      root.children.push(node);
    }

    return root;
  }

  statementList() {
    const node = this.statement();
    const results = [node];

    while (this.currentToken.type === TokenType.TOKEN_SEMI) {
      this.eat(TokenType.TOKEN_SEMI);
      results.push(this.statement());
    }

    if (this.currentToken.type === TokenType.TOKEN_ID) {
      throw new Error('Unexpected identifier!');
    }

    return results;
  }

  statement() {
    let node = null;
    if (this.currentToken.type === TokenType.TOKEN_BEGIN) {
      node = this.compoundStatement();
    } else if (this.currentToken.type === TokenType.TOKEN_ID) {
      node = this.assignmentStatement();
    } else {
      node = this.empty();
    }

    return node;
  }

  assignmentStatement() {
    const left = this.variable();
    const token = this.currentToken;
    this.eat(TokenType.TOKEN_ASSIGN);
    const right = this.expr();
    const node = new AssignNode(left, token, right);

    return node;
  }

  variable() {
    const node = new VarNode(this.currentToken);
    this.eat(TokenType.TOKEN_ID);

    return node;
  }

  empty() {
    return new NoOpNode();
  }

  factor() {
    const token = this.currentToken;
    if (token.type === TokenType.TOKEN_OPERATOR_ADD) {
      this.eat(TokenType.TOKEN_OPERATOR_ADD);

      return new UnaryOperatorNode(token, this.factor());
    } else if (token.type === TokenType.TOKEN_OPERATOR_SUB) {
      this.eat(TokenType.TOKEN_OPERATOR_SUB);
      
      return new UnaryOperatorNode(token, this.factor());
    } else if (token.type === TokenType.TOKEN_INTEGER) {
      this.eat(TokenType.TOKEN_INTEGER);

      return new NumericNode(token);
    } else if (token.type === TokenType.TOKEN_OPEN_PARENTHESIS) {
      this.eat(TokenType.TOKEN_OPEN_PARENTHESIS);
      const node = this.expr();
      this.eat(TokenType.TOKEN_CLOSE_PARENTHESIS);

      return node;
    } else {
      return this.variable();
    }
  }

  term() {
    let node = this.factor();

    while ([TokenType.TOKEN_OPERATOR_MUL, TokenType.TOKEN_OPERATOR_DIV].includes(this.currentToken.type)) {
      const token = this.currentToken;
      if (token.type === TokenType.TOKEN_OPERATOR_MUL) {
        this.eat(TokenType.TOKEN_OPERATOR_MUL);
      }
      else if (token.type === TokenType.TOKEN_OPERATOR_DIV) {
        this.eat(TokenType.TOKEN_OPERATOR_DIV);
      }

      node = new BinaryOperatorNode(node, token, this.factor());
    }

    return node;
  }

  expr() {
    let node = this.term();

    while ([TokenType.TOKEN_OPERATOR_ADD, TokenType.TOKEN_OPERATOR_SUB].includes(this.currentToken.type)) {
      const token = this.currentToken;
      if (token.type === TokenType.TOKEN_OPERATOR_ADD) {
        this.eat(TokenType.TOKEN_OPERATOR_ADD);
      }
      else if (token.type === TokenType.TOKEN_OPERATOR_SUB) {
        this.eat(TokenType.TOKEN_OPERATOR_SUB);
      }

      node = new BinaryOperatorNode(node, token, this.term());
    }

    return node;
  }

  parse() {
    const node = this.program();
    if (this.currentToken.type !== TokenType.TOKEN_EOF) {
      throw new Error('EOF not found!');
    }

    return node;
  }
}

module.exports = Parser;
