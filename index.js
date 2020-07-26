const fs = require('fs');
const readline = require('readline');

const Lexer = require('./src/lexer');
const Parser = require('./src/parser');
const Interpreter = require('./src/interpreter');
const { TokenType } = require('./src/token');

async function readFile(filename) {
  const fileStream = fs.createReadStream(filename);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let sourceCode = '';
  for await (const line of rl) {
    sourceCode += line;
    sourceCode += '\n';
  }

  return sourceCode.substr(0, sourceCode.length - 1);
}

async function main() {
  const filename = './example.pas';
  const sourceCode = await readFile(filename);

  const lexer = new Lexer(sourceCode);
  const parser = new Parser(lexer);
  const interpreter = new Interpreter(parser);

  interpreter.interpret();
  console.log('Global Scope Variables:');
  console.table(interpreter.globalScope);
}

function debugLexer(lexer) {
  let a;
  const tokens = []

  while ((a = lexer.getNextToken()).type !== TokenType.EOF) {
    tokens.push(a);
  }

  console.table(tokens);
}

function debugParser(parser) {
  const tree = parser.parse();

  console.log(JSON.stringify(tree, null, 2));
}

main();