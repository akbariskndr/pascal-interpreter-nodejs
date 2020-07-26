const { TokenType } = require('./token');
const {
  BinaryOperatorNode,
  NumericNode,
  UnaryOperatorNode,
  CompoundStatementNode,
  AssignNode,
  VarNode,
  NoOpNode,
} = require('./ast');

class Interpreter {
  constructor(parser) {
    this.parser = parser;
    this.globalScope = {};
  }

  visit(node) {
    if (node instanceof BinaryOperatorNode) {
      return this.visitBinaryOperator(node);
    } else if (node instanceof NumericNode) {
      return this.visitNumeric(node);
    } else if (node instanceof UnaryOperatorNode) {
      return this.visitUnaryOperator(node);
    } else if (node instanceof CompoundStatementNode) {
      return this.visitCompoundStatement(node);
    } else if (node instanceof AssignNode) {
      return this.visitAssign(node);
    } else if (node instanceof VarNode) {
      return this.visitVariable(node);
    } else if (node instanceof NoOpNode) {
      return this.visitNoOp(node);
    }
  }

  visitBinaryOperator(node) {
    if (node.op.type === TokenType.TOKEN_OPERATOR_ADD) {
      return this.visit(node.left) + this.visit(node.right);
    }
    if (node.op.type === TokenType.TOKEN_OPERATOR_SUB) {
      return this.visit(node.left) - this.visit(node.right);
    }
    if (node.op.type === TokenType.TOKEN_OPERATOR_MUL) {
      return this.visit(node.left) * this.visit(node.right);
    }
    if (node.op.type === TokenType.TOKEN_OPERATOR_DIV) {
      return this.visit(node.left) / this.visit(node.right);
    }
  }

  visitNumeric(node) {
    return node.value;
  }

  visitUnaryOperator(node) {
    if (node.op.type === TokenType.TOKEN_OPERATOR_ADD) {
      return +this.visit(node.expr);
    } else if (node.op.type === TokenType.TOKEN_OPERATOR_SUB) {
      return -this.visit(node.expr);
    }
  }

  visitCompoundStatement(node) {
    for (const child of node.children) {
      this.visit(child);
    }
  }

  visitAssign(node) {
    const varName = node.left.value;
    this.globalScope[varName] = this.visit(node.right);
  }

  visitVariable(node) {
    const varName = node.value;
    const value = this.globalScope[varName];

    if (!value) {
      throw new Error('Unexpected variable!');
    }

    return value;
  }

  visitNoOp(node) {
    return;
  }


  interpret() {
    const tree = this.parser.parse();
    return this.visit(tree);
  }
}

module.exports = Interpreter;
