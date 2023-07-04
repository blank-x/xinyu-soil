// 用来校验指定的全局变量本身和属性是否可以被修改

function findVariable(initialScope, name) {
  let scope = initialScope;
  if (typeof name !== "string") {
    return null
  }

  while (scope != null) {
    const variable = scope.set.get(name);
    if (variable != null) {
      return variable
    }
    scope = scope.upper;
  }

  return null
}


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
    // schema: [], // or schema: [ { enum: ['always', 'never'] } ]
    schema: {
      type: "array",
      items: {
        type: ['string', null]
      },
      uniqueItems: true,
      minItems: 0
    },
    // 用于定义错误信息， messageId
    messages: {
      unexpected: '{{ noModify }}的值和属性的值不允许修改',
    },
  },
  create: function (context) {
    // 记录传进来的全局变量  context.options
    // 怎么获取到都在哪里使用了这个变量呢？ 在Program中就可以获取到全局变量，然后通过变量的references属性获取使用的地方
    console.log(context.options)
    if(context.options.length === 0) {
      return {} ;
    }
    return {
      Program(node) {
        const sourceCode = context.sourceCode
        const scope = sourceCode.getScope(node)
        const variable = findVariable(scope, "__INITIAL_DATA__");
        if (!variable) {
          return;
        }
        const references = variable.references;

        for (let i = 0; i < references.length; ++i) {
          const reference = references[i];
          let identifier = reference.identifier;
          let isResign = false;
          while(identifier) {
            if(identifier.type === 'AssignmentExpression') {
              isResign = true
              break
            } else {
              identifier = identifier.parent
            }
          }
          if(isResign){
            context.report({
              node: identifier,
              loc: identifier.loc,
              messageId: "unexpected",
              data: {
                noModify: '__INITIAL_DATA__'
              },
            });
          }
        }
      },
    }
  }
};
