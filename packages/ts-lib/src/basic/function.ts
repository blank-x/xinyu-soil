// 四种函数定义
function add1(x: number, y: number) {
    return x + y
}
// 变量定义函数类型
let add: Add = (a: number, b: number) => a + b
// 类型别名定义函数类型
type Add = (x: number, y: number) => number

type add3 = (x: number, y: number) => number
// 接口定义函数类型
interface add4 {
    (x: number, y: number): number
}


// 必须参数
// 不能在可选参数之后
/* function add1(x?:number,y:number){
    return x+y
}*/

// 剩余参数
function add2(x?:number,...res:number[]){
    return x + res.reduce((pre,cur)=>pre+cur)
}



// 函数重载

function add3(x:string):string;
function add3(x:number):number;
function add3(x:any):any{
    if(typeof x === 'string'){
        return x
    }
    if(typeof x === 'number'){
        return x
    }
}
// add3(true)
add3(1)
