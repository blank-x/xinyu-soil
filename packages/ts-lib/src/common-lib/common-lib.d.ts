// declare 为外部变量提供全局声明
// 否则 调用doSomeSth的时候会提示ts 错误
declare function moduleLib(options: Options):void;
interface Options {
    [key: string]: any
}
declare namespace moduleLib{
    const version: string;
    function add():void;
    interface Options {
        [key: string]:any
    }
}
// 需要导出
// esModuleInterop:true
export = moduleLib
