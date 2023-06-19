setTimeout(()=>{
  console.log(a); // Uncaught ReferenceError: a is not defined
})

setTimeout(()=>{
  eval('hoo bar'); // Uncaught SyntaxError: Unexpected identifier
})

setTimeout(()=>{
  new Array(12121212121) // Uncaught RangeError: Invalid array length
})
setTimeout(()=>{
  let a;
  console.log(a.list); // Uncaught TypeError: Cannot read property 'list' of undefined
})
setTimeout(()=>{
  throw new EvalError('asfads') // EvalError
})
setTimeout(()=>{})