module.exports = {
  meta: {
    // problem: 这条规则识别的代码可能会导致错误或让人迷惑。应该优先解决这个问题
    // suggestion: 这条规则识别的代码不会导致错误，但是建议用更好的方式
    // layout: 表示这条规则主要关心像空格、分号等这种问题
    type: 'problem',
    // 一般用不着
    docs: {},
  // 标识这条规则是否可以修复，假如没有这属性，即使你在下面那个create方法里实现了fix功能，eslint也不会帮你修复
    fixable: "code", // or "code" or "whitespace"
    // 这里定义了这条规则需要的参数
    // 比如我们是这样使用带参数的rule的时候，rules: { myRule: ['error', param1, param2....]}
    // error后面的就是参数，而参数就是在这里定义的
    schema: [], // or schema: [ { enum: ['always', 'never'] } ]
    // 用于定义错误信息， messageId
    messages: {
      someMessageId: 'Some error message, {{ notBar }}',
    },
  },
  create: function (context) {

    return {
      Program(node) {
        const sourceCode = context.sourceCode
        const scope = sourceCode.getScope(node)
        // console.log(scope)
        // strict =
        //   scope.isStrict ||
        //   node.sourceType === "module" ||
        //   (features.globalReturn && scope.childScopes[0].isStrict),
        // scope.variables.filter(item=>item.name === 'global').forEach(item=>{
        //   console.log(item)
        // })
      },
      VariableDeclarator(node) {

        console.log(node.id.name);
        // Check if a `const` variable declaration
        if (node.parent.kind === "const") {

          // Check if variable name is `foo`
          if (node.id.type === "Identifier" && node.id.name === "foo") {

            // Check if value of variable is "bar"
            if (node.init && node.init.type === "Literal" && node.init.value !== "bar") {

              /*
               * Report error to ESLint. Error message uses
               * a message placeholder to include the incorrect value
               * in the error message.
               * Also includes a `fix(fixer)` function that replaces
               * any values assigned to `const foo` with "bar".
               */

            }
          }
        }
      }
    }
  }
};


// context.report({
//   node,
//   messageId: 'someMessageId',
//   data: {
//     notBar: node.init.value
//   },
//   fix(fixer) {
//     return fixer.replaceText(node.init, '"bar"');
//   }
// });
