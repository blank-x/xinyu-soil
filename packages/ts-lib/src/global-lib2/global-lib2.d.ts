// declare 为外部变量提供全局声明
// 否则 调用doSomeSth的时候会提示ts 错误
declare function doSomeSth1(a:string):void;

declare namespace doSomeSth1{
    const version: string;
    function add():void;
    interface Options {
        [key: string]:any
    }
}
