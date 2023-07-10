// const astUtils = require("eslint/lib/rules/utils/ast-utils.js");
function getStaticPropertyName(node) {
  let prop;

  switch (node && node.type) {
    case "ChainExpression":
      return getStaticPropertyName(node.expression);

    case "Property":
    case "PropertyDefinition":
    case "MethodDefinition":
      prop = node.key;
      break;

    case "MemberExpression":
      prop = node.property;
      break;

    // no default
  }

  if (prop) {
    if (prop.type === "Identifier" && !node.computed) {
      return prop.name;
    }

    return getStaticStringValue(prop);
  }

  return null;
}
function isNullLiteral(node) {
  return node.type === "Literal" && node.value === null && !node.regex && !node.bigint;
}
function getStaticStringValue(node) {
  switch (node.type) {
    case "Literal":
      if (node.value === null) {
        if (isNullLiteral(node)) {
          return String(node.value); // "null"
        }
        if (node.regex) {
          return `/${node.regex.pattern}/${node.regex.flags}`;
        }
        if (node.bigint) {
          return node.bigint;
        }

        // Otherwise, this is an unknown literal. The function will return null.

      } else {
        return String(node.value);
      }
      break;
    case "TemplateLiteral":
      if (node.expressions.length === 0 && node.quasis.length === 1) {
        return node.quasis[0].value.cooked;
      }
      break;

    // no default
  }

  return null;
}
const funcs = ["apply", "bind", "call"];

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
      noFunction: "禁止使用Function动态创建函数",
    },
  },
  create: function (context) {
    const sourceCode = context.sourceCode;
    return {

      'Program:exit'(node) {

        const globalScope = sourceCode.getScope(node);
        const variable = globalScope.set.get("Function");
        // variable.defs.length === 0 代表未重新定义Function
        if (variable && variable.defs.length === 0) {
          variable.references.forEach(ref => {
            const node = ref.identifier; // Function
            const parent = node.parent; // parent是 CallExpression 或者 NewExpression 或者 MemberExpression
            let evalNode;

            if (parent) {
              if (node === parent.callee && (
                parent.type === "NewExpression" || // new Function('a', 'b', 'return a + b');
                parent.type === "CallExpression" // Function('a', 'b', 'return a + b');
              )) {
                evalNode = parent;
              } else if (
                parent.type === "MemberExpression" && // Function.call(null, 'a', 'b', 'return a + b') 或者 Function.apply(null, ['a', 'b', 'return a + b']) Function.bind(null)
                node === parent.object &&
                funcs.includes(getStaticPropertyName(parent)) &&
                parent.parent.type === "CallExpression"
              ) {
                evalNode = parent.parent;
              }
            }

            if (evalNode) {
              context.report({
                node: evalNode,
                messageId: 'noFunction'
              });
            }
          });
        }
      },
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
