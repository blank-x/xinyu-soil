# zli
按照这些功能开发：
https://docs.svrx.io/zh/
https://juejin.cn/post/6844904142733836302
先把这玩意儿研究透
```
const cmd = `npm install --prefix=${libPath.resolve(tmpPath)} ${packageName}@${version || 'latest'} -g ${registryCmd}`;
exec(cmd);
以次来安装包到目标目录
```
> 需要解决的问题：
>1. 命令和选项如何划分；
>2. 是否需要插件化


### 开发环境
```
npm run watch
npm install
npm link 将 zli 命令链到环境变量；
```

此时就可以使用 `zli` 命令了。

- `zli init 模板代号 [项目名字]`

使用zli config 配置命令行工具，其中的配置被写到了~/.zlirc文件中
- `zli config get`
- `zli config set type orgs`



### 发布

开发完成后，即可发布至 npm.




os.homedir()  + '.tool'  // 目录 可以作为放置配置的地方

使用exec 处理 npm install 看看会有哪些log信息回打印出；

