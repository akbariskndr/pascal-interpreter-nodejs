class AST {}

class BinaryOperatorNode extends AST {
  constructor(left, op, right) {
    super();
    this.left = left;
    this.op = op;
    this.token = op;
    this.right = right;
  }
};

class NumericNode extends AST {
  constructor(token) {
    super();
    this.token = token;
    this.value = token.value;
  }
};

class UnaryOperatorNode extends AST {
  constructor(op, expr) {
    super();
    this.token = op;
    this.op = op;
    this.expr = expr;
  }
};

class CompoundStatementNode extends AST {
  constructor() {
    super();
    this.children = [];
  }
}

class AssignNode extends AST {
  constructor(left, op, right) {
    super();
    this.left = left;
    this.op = op;
    this.token = op;
    this.right = right;
  }
}

class VarNode extends AST {
  constructor(token) {
    super();
    this.token = token;
    this.value = token.value;
  }
}

class NoOpNode extends AST {}

module.exports = {
  BinaryOperatorNode,
  NumericNode,
  UnaryOperatorNode,
  CompoundStatementNode,
  AssignNode,
  VarNode,
  NoOpNode,
};
