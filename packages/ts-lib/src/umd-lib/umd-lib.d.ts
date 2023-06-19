// 这个类型文件需要和模块 umd-lib.js的名字一致
declare namespace umdLib {
    const version: string
    function add(name:string): void
}
// 这一行好像也不需要
// export as namespace umdLib

export = umdLib
