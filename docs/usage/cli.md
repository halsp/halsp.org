# CLI 脚手架

<p align="center">
    <a href="https://github.com/ipare/cli/blob/main/LICENSE" target="_blank"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="GitHub license" /></a>
    <a href=""><img src="https://img.shields.io/npm/v/@ipare/cli.svg" alt="npm version"></a>
    <a href=""><img src="https://badgen.net/npm/dt/@ipare/cli" alt="npm downloads"></a>
    <a href="https://nodejs.org/en/about/releases/"><img src="https://img.shields.io/node/v/@ipare/cli.svg" alt="node compatibility"></a>
    <a href="#"><img src="https://github.com/ipare/cli/actions/workflows/test.yml/badge.svg?branch=main" alt="Build Status"></a>
    <a href="https://codecov.io/gh/ipare/cli/branch/main"><img src="https://img.shields.io/codecov/c/github/ipare/cli/main.svg" alt="Test Coverage"></a>
    <a href="https://github.com/ipare/cli/pulls"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome"></a>
    <a href="https://gitpod.io/#https://github.com/ipare/cli"><img src="https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod" alt="Gitpod Ready-to-Code"></a>
    <a href="https://paypal.me/ihalwang" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
</p>

`@ipare/cli` 提供新建、编译、调试、升级等功能

## 1. 安装

```sh
npm install @ipare/cli -g
```

## 2. 支持的命令

```
Usage: ipare <command> [options]

Options:
  -V, --version                 output the version number
  -h, --help                    display help for command

Commands:
  create|c [options] [name]     Generate ipare application
  template|t <template> <name>  Generate a project from a remote template
  build|b [options]             Build ipare application
  start|s [options]             Run ipare application
  info|i                        Display ipare project details
  update|u [options]            Update ipare dependencies
  help [command]                display help for command
```

## 3. create

用于从头新建项目，可以选择插件、运行环境等

```sh
ipare create <project-name>
```

### 3.1 使用方式

```
Usage: ipare create|c [options] [name]

Generate ipare application

Arguments:
  name                                    Aapplication name

Options:
  -f, --force                             Force create application, delete existing files.  (default: false)
  -e, --env [env]                         The environment to run application
  --skipEnv                               Skip adding environment files
  -pm, --packageManager [packageManager]  Specify package manager. (npm/yarn/pnpm/cnpm)
  -cv, --cliVersion [version]             Version of @ipare/cli (default: "^0.3.1")
  -ps, --plugins [plugins]                Plugins to add (e.g. view,router,inject)
  -sg, --skipGit                          Skip git repository initialization
  -sp, --skipPlugins                      No plugins will be added
  -sr, --skipRun                          Skip running after completion
  -h, --help                              display help for command
```

### 3.2 插件

在创建过程中，需要选择插件，也可以用参数 `--plugins` 指定插件

如果选择的某个插件需要引用另一个插件，需要的插件会自动添加，即使没有选择

比如 `pipe` 依赖于 `inject`，若选择了 `pipe` 将自动加入 `inject`

## 4 template

该功能暂未完成

## 5 build

用于编译项目，可以配合其他插件执行特定脚本，如 `@ipare/router` 插件创建路由映射等

### 5.1 使用方式

```
Usage: ipare build|b [options]

Build ipare application

Options:
  -m, --mode [mode]             Run mode (e.g., development,production). (default: "production")
  -c, --config [path]           Path to ipare-cli configuration file. (default: "ipare-cli.config.ts")
  -jc, --jsonConfig [json]      Json string of ipare-cli configuration.
  -fc, --funcConfig [function]  Function string to build ipare-cli configuration.
  -tc, --tsconfigPath [path]    Path to tsconfig.json file.
  -w, --watch                   Run in watch mode (live-reload).
  -wa, --watchAssets            Watch non-ts (e.g., .views) files mode.
  -sm, --sourceMap              Whether to generate source map files.
  -cp, --copyPackage            Copy package.json to out dir.
  -h, --help                    display help for command
```

### 5.2 扩展编译功能

如果你需要实现一个插件，并且有以下任一需求

- 需要在编译过程执行特定的代码
- 提供 `ipare-cli.config.ts` 附加的默认配置

那么你需要按下面的方式添加插件的功能

#### 5.2.1 插件脚本

插件脚本主要分为两种，一种是 ts 编译钩子，一种是编译前后的脚本

##### 5.2.1.1 TS 编译的钩子

在插件中，导出以下脚本作用于 ts 编译的钩子

- beforeCompile
- afterCompile
- afterCompileDeclarations

##### 5.2.1.2 编译前后的脚本

在插件中，导出以下脚本作用于编译前后运行

- postbuild 编译完成后运行
- prebuild 编译之前运行

脚本为回调函数

`postbuild` 回调函数如果返回 false， 将终止编译

#### 5.2.2 扩展配置

在插件中导出特定内容以支持自动扩展配置 `ipare-cli.config.ts`

##### 5.2.2.1

导出 `cliConfig`，一般用于简单的配置

编译阶段会与 `ipare-cli.config.ts` 中的配置做合并操作

可以导出两种类型：

1. Configuration 对象
2. 回调函数，返回值为 Configuration 对象，参数为 `ConfigEnv` 类型的对象，有以下字段
   - mode: start/build 命令传入的 mode 参数
   - command: 命令类型

##### 5.2.2.2

导出 `cliConfigHook`，可以修改当前配置并返回新的配置

值为回调函数，有两个参数

- config: 当前的配置
- options: 与前面的导出 `cliConfig` 的回调函数参数相同

## 6. start

用于启动项目，编译过程同 `build` 命令

启动项目时会在本地创建一个 http 服务，因此 serverless 项目也可以本地运行

### 6.1 使用方式

```
Usage: ipare start|s [options]

Run ipare application

Options:
  -m, --mode [mode]             Run mode (e.g., development,production). (default: "development")
  -c, --config [path]           Path to ipare-cli configuration file. (default: "ipare-cli.config.ts")
  -jc, --jsonConfig [json]      Json string of ipare-cli configuration.
  -fc, --funcConfig [function]  Function string to build ipare-cli configuration.
  -tc, --tsconfigPath [path]    Path to tsconfig.json file.
  -w, --watch                   Run in watch mode (live-reload).
  -wa, --watchAssets            Watch non-ts (e.g., .views) files mode.
  -b, --binaryToRun [program]   Binary to run application (e.g., node, ts-node).
  -p, --port [port]             The port on http listens
  -h, --help                    display help for command
```

### 6.2 Startup 入口

`@ipare/cli` 要求必须按规范有个 src/startup.ts 文件，并导出一个默认回调函数，内容如下

```TS
// startup.ts
export default function <T extends Startup>(startup: T, mode?: string) {
  return startup
    .use(async (ctx, next) => {
      ctx.res.setHeader("mode", mode ?? "");
      await next();
    })
    .useInject()
    .useRouter();
}
```

`mode` 参数值为 `@ipare/cli` 的 `build` 或 `start` 命令传入的 `--mode` 参数，如 `development`、`production` 等

## 7. info

可以显示项目信息，主要用于排查问题

### 7.1 使用方式

```
Usage: ipare info|i [options]

Display ipare project details

Options:
  -h, --help  display help for command
```

执行结果如

```
  ___ ____   _    ____  _____ ____ _     ___
 |_ _|  _ \ / \  |  _ \| ____/ ___| |   |_ _|
  | || |_) / _ \ | |_) |  _|| |   | |    | |
  | ||  __/ ___ \|  _ <| |__| |___| |___ | |
 |___|_| /_/   \_\_| \_\_____\____|_____|___|


[System Information]
OS Type        : Windows_NT
OS Platform    : win32
OS Release     : 10.0.22000
NodeJS Version : v16.15.0

[Ipare CLI]
Ipare CLI Version : 0.3.1

[Ipare Packages Version]
@ipare/core   : ^1.6.3
@ipare/http   : ^1.2.4
@ipare/inject : ^1.2.3
@ipare/pipe   : ^1.3.5
```

## 8. update

用于升级 Ipare 依赖版本

### 7.1 使用方式

```
Usage: ipare update|u [options]

Update ipare dependencies

Options:
  -n, --name [name]                      Specify to update a package
  -a, --all                              Update all dependencies (default: false)
  -t, --tag <tag>                        Upgrade to tagged packages (latest | beta | rc | next tag) (default: "latest")
  -su, --skipUpgrade                     Display version information without upgrading (default: false)
  -p, --packageManager [packageManager]  Specify package manager. (npm/yarn/pnpm/cnpm)
  -si, --skipInstall                     Skip installation (default: false)
  -h, --help                             display help for command
```
