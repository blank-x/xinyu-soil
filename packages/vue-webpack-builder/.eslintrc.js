// https://eslint.org/docs/user-guide/configuring
module.exports = {
    root: true,
    parserOptions: {
        sourceType: 'module'
    },
    env: {
        browser: true,
    },
  // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    extends: ['plugin:vue/recommended'],
  // required to lint *.vue files
  
  // add your custom rules here
    'rules': {
    	'no-console' :['error',{
    		'allow':["warn","log"]
		}],
    // allow paren-less arrow functions
        'arrow-parens': 0,
    // allow async-await
        'generator-star-spacing': 0,
    // 强制使用一致的换行风格
    //    'linebreak-style': ['error', 'unix'],
    /*// 空格4个
        'indent': ['error', 4, {'SwitchCase': 1}],
    // if while function 后面的{必须与if在同一行，java风格。
        'brace-style': [2, '1tbs', {'allowSingleLine': true}],
    //以方括号取对象属性时，[ 后面和 ] 前面是否需要空格, 可选参数 never, always
        'computed-property-spacing': [2, 'never'],
    // 双峰驼命名格式
        'camelcase': 2,
    //allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0*/
    }
}
