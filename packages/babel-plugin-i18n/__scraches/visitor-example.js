const t = require("@babel/types")
const { default: generate } = require("@babel/generator")

function createImport(a,b,source){
  let ast = t.importDeclaration(
    [t.importSpecifier(t.identifier(a), t.identifier(b))],
    t.stringLiteral(source),
  )
  var result = generate(ast)
  return result.code
}

var res = createImport('name','name2','react')
console.log(res);

function createDefaultImport(a,b,source){
  let ast = t.importDeclaration(
    [t.importNamespaceSpecifier(t.identifier(a))],
    t.stringLiteral(source),
  )
  var result = generate(ast)
  return result.code
}

console.log(createDefaultImport('a','b','c'));

function createDefaultImport2(a,source){
  let ast = t.importDeclaration(
    [t.importDefaultSpecifier(t.identifier(a))],
    t.stringLiteral(source),
  )
  var result = generate(ast)
  return result.code
}
console.log(createDefaultImport2('a','c'));

function iterStatement() {
  console.log(
    generate(t.variableDeclaration('const',[t.variableDeclarator(t.identifier('name'),t.stringLiteral('2'))])).code
  );
  console.log(
    generate(t.variableDeclaration('const',[t.variableDeclarator(t.identifier('name'),t.objectExpression([t.objectProperty( t.identifier('name'), t.stringLiteral('Steven'), false, false, null)]))])).code
  );

}
iterStatement()


function makeCallExpression() {
    console.log(generate(t.callExpression(t.identifier('aa'), [t.stringLiteral('s')])).code);
}
makeCallExpression()
