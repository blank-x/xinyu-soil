// let useBuiltIns = false
// if(process.env.useBuiltIns){
//   useBuiltIns = process.env.useBuiltIns
// }
//
// module.exports = {
//   // 支持环境变量
//   "env": {
//     "development": {
//       "presets": ["react-app"]
//     },
//     "production": {
//       "presets": ["react-app"]
//     },
//     "publish": {
//
//       "presets": [
//
//         ["@babel/preset-env",
//           {
//             "targets": {
//               "browsers": [
//                 "last 2 versions",
//                 "ie >= 9"
//               ]
//             },
//             "loose": true
//           }
//         ],
//         "@babel/preset-react"
//       ]
//     },
//     "i18nTest": {
//       "presets": [
//         "@babel/preset-react"
//       ],
//       "plugins": ["./plugins/i18n-auto/i18n"],
//       "sourceType":"module"
//     },
//   },
//
//
//   "presets": [
//     [
//       "@babel/preset-env",
//     ]
//   ],
//   "plugins": [
//     // "@babel/plugin-transform-runtime"
//   ]
// }
//
//
//
