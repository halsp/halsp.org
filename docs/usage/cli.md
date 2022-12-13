# CLI 脚手架 `(@ipare/cli)`

`@ipare/cli` 提供创建、编译、调试、升级等功能

## 安装

全局安装

```sh
npm install @ipare/cli -g
```

或项目中安装

```sh
npm install @ipare/cli -D
```

## 快速开始

下面列出的是常用命令

1. 创建一个项目

```sh
ipare create
```

2. 编译项目

```
ipare build
```

3. 运行项目

```
ipare start
```

## 项目配置

项目根目录下的文件 `ipare-cli.config.ts` 用来存放 CLI 的相关配置

### 配置方式

在配置文件中，可以导出一个 json 对象，或导出一个返回 json 对象的回调函数

#### 导出 json 对象

导出 json 对象比较简单，但不够灵活，只能是固定的一种配置

```TS
export default {
  build: {},
};
```

或使用智能提示

```TS
import { defineConfig } from "@ipare/cli";

export default defineConfig({
  start: {}
});
```

#### 导出回调函数

导出回调函数可以实现动态配置，即根据不同编译条件返回不同配置

```TS
import { defineConfig } from "@ipare/cli";

export default defineConfig(({ mode }) => {
  return {
    build: {
      copyPackage: mode == "production",
    },
  };
});
```

### 配置内容

配置内容是一个 json 对象，该 json 对象目前有如下内容

```TS
export interface Configuration {
    build?: {
        prebuild?: Prebuild[];
        postbuild?: Postbuild[];
        beforeHooks?: CompilerHook<ts.SourceFile>[];
        afterHooks?: CompilerHook<ts.SourceFile>[];
        afterDeclarationsHooks?: CompilerHook<ts.SourceFile | ts.Bundle>[];
        deleteOutDir?: boolean;
        assets?: AssetConfig[];
        watch?: boolean;
        watchAssets?: boolean;
        preserveWatchOutput?: boolean;
        sourceMap?: boolean;
        copyPackage?: boolean;
        removeDevDeps?: boolean;
    };
    start?: {
        port?: number;
        binaryToRun?: string;
        inspect?: boolean | string;
        startupFile?: string;
    };
}
```

- build: 编译相关的配置
- start: 调试相关的配置，`build` 部分的配置也起作用

#### prebuild

编译前钩子

#### postbuild

编译后钩子

#### beforeHooks

ts 编译钩子

ts 代码编译前触发，可以更改编译行为

#### afterHooks

ts 编译钩子

ts 代码编译完，生成目标代码前触发，可以更改编译行为

#### afterDeclarationsHooks

ts 编译钩子

ts 类型解析后触发，可以更改编译行为

#### deleteOutDir

编译前删除目标文件夹

#### assets

资源文件，数组类型，编译时会将指定资源文件拷贝到目标文件夹

支持 glob 语法

数组元素有两种类型

```TS
export type AssetConfig =
  | {
      include: string | string[];
      exclude?: string | string[];
      outDir?: string;
      root?: string;
    }
  | string;
```

字符串表示哪些文件是资源文件

对象结构可以配置更复杂的资源文件

- include 包含哪些文件，可以是 glob 字符串，也可以是 glob 字符串数组
- exclude 排除哪些文件，是从 `include` 中的文件排除，可以是 glob 字符串，也可以是 glob 字符串数组
- outDir 目标文件夹
- root 根目录地址

root 参数用于路径提升，如以下示例：

> **目标**
>
> - 资源文件为 `src/imgs/**`，而不是 `imgs/**`
> - 编译中需要拷贝到 `dist/imgs`，而不是 `dist/src/imgs`
>
> **设置参数**
>
> 1. 设置 `include` 为 `src/imgs/**`
> 2. 设置 `root` 为 `src`

#### watch

是否开启 watch 模式

`start` 命令默认默认值为 `true`
`build` 命令默认默认值为 `false`

#### watchAssets

是否监控资源文件，监控所有 `assets` 参数指定的文件

默认值为 `false`

#### preserveWatchOutput

是否保留控制台输出

默认为取自 `tsconfig.json` 中的 `compilerOptions.preserveWatchOutput` 值

如果 `tsconfig.json` 中也没有配置，则默认值为 `false`

#### sourceMap

是否输出 map 文件

用于断点调试时定位编译后的 js 和源文件 ts 的代码

`start` 命令会忽略该配置，值始终为 `true`

#### copyPackage

值为 `true` 则拷贝 `package.json` 文件

默认为 `false`

#### removeDevDeps

如果为 `true` 则移除拷贝后 `package.json` 文件 `devDependencies` 中的依赖

使用云函数环境 `@ipare/lambda` 和 `@ipare/alifc` 时，该值默认为 `true`

#### port

调试时启动的端口

#### binaryToRun

调试时启动的环境，默认为 `node`

#### inspect

V8 引擎的调试工具

#### startupFile

启动文件的路径，默认为 CLI 调试时生成的文件

如果有其他需求，如希望使用其他运行环境调试，而不使用默认的 `@ipare/native`，可以创建一个入口文件，并通过此参数指定该文件

## 支持的命令

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

## create

用于从头新建项目，可以选择插件、运行环境等

```sh
ipare create <project-name>
```

### 使用方式

命令如下

```
Usage: ipare create|c [options] [name]

Generate ipare application

Arguments:
  name                                    Aapplication name

Options:
  -f, --force                             Force create application, delete existing files.  (default: false)
  -y, --y                                 Override existing files.  (default: false)
  -e, --env <env>                         The environment to run application. (lambda/native/azure/micro-tcp/...)
  -pm, --packageManager <packageManager>  Specify package manager. (npm/yarn/pnpm/cnpm)
  --registry <url>                        Override configuration registry
  --debug                                 Debug mode
  -ps, --plugins <plugins>                Plugins to add (e.g. view,router,inject)
  -si, --skipInstall                      Skip install project
  -se, --skipEnv                          Skip adding environment files
  -sg, --skipGit                          Skip git repository initialization
  -sp, --skipPlugins                      No plugins will be added
  -sr, --skipRun                          Skip running after completion
  --forseInit                             Forse init template
  -h, --help                              display help for command
```

### 插件

在创建过程中，需要选择插件，也可以用参数 `--plugins` 指定插件

如果选择的某个插件需要引用另一个插件，需要的插件会自动添加，即使没有选择

比如 `pipe` 依赖于 `inject`，若选择了 `pipe` 将自动加入 `inject`

## template

根据模板创建项目

该功能暂未完成

## build

用于编译项目

:::tip
CLI 支持极高的扩展性，在编译过程中可以调起其他插件执行脚本，或动态修改配置

如 `@ipare/router` 编译时创建路由映射, `@ipare/view` 编译时自动修改配置，添加 `views` 文件夹为资源文件
:::

### 使用方式

命令如下

```
Usage: ipare build|b [options]

Build ipare application

Options:
  -m, --mode <mode>             Run mode (e.g., development,production). (default: "production")
  -c, --config <path>           Path to ipare-cli configuration file. (default: "ipare-cli.config.ts")
  -jc, --jsonConfig <json>      Json string of ipare-cli configuration.
  -fc, --funcConfig <function>  Function string to build ipare-cli configuration.
  -tc, --tsconfigPath <path>    Path to tsconfig.json file.
  -w, --watch                   Run in watch mode (live-reload).
  -wa, --watchAssets            Watch non-ts (e.g., .views) files mode.
  -sm, --sourceMap              Whether to generate source map files.
  -cp, --copyPackage            Copy package.json to out dir.
  --removeDevDeps               Remove devDependencies in package.json file when --copyPackage is true.
  -h, --help                    display help for command
```

### 扩展编译功能

如果你需要实现一个插件，并且有以下任一需求

- 在编译过程执行特定的代码，需要扩展脚本
- 编译前动态修改配置，需要拓展配置

插件命名需要满足以下任意一个条件

- 以 `@ipare/` 开头的 scope 包，属于 Ipare 官方插件
- 以 `ipare-` 开头，如 `ipare-xxx`
- 以 `@<score>/ipare-` 开头的 scope 包，如 `@my-package/ipare-xxx`

#### 插件脚本

插件脚本主要分为两种，TS 编译钩子和编译前后的脚本

##### TS 编译钩子

在插件中，导出以下脚本作用于 ts 编译的钩子

- beforeCompile
- afterCompile
- afterCompileDeclarations

##### 编译前后的脚本

在插件中，导出以下脚本作用于编译前后运行

- postbuild 编译完成后运行
- prebuild 编译之前运行

脚本为回调函数

`postbuild` 回调函数如果返回 false， 将终止编译

#### 动态修改配置

在插件中导出 `cliConfigHook` 函数，可以在编译阶段动态修改 `ipare-cli.config.ts` 中所读取的配置

注意，此操作不会更新 `ipare-cli.config.ts` 文件

可以在函数中修改当前配置对象，或返回一个新的配置对象

`cliConfigHook` 函数，有两个参数

- config: 当前的配置对象，可以修改
- options: `ConfigEnv` 类型的对象，包含以下字段
  - mode: CLI 命令传入的 mode 参数
  - command: 命令类型，`start` 或 `build`

```TS
import { Configuration, ConfigEnv } from "@ipare/cli";

export const cliConfigHook = (config: Configuration, env: ConfigEnv) => {
  config.build = config.build ?? {};
  config.build.assets = config.build.assets ?? [];
  config.build.assets.push({
    include: "your-assets/*",
    root: "src",
  });
};
```

若插件导出上述 `cliConfigHook` 函数，每次 CLI 编译都会执行该函数以动态修改配置

## start

用于启动并调试项目，先编译后启动，编译过程同 `build` 命令

### 使用方式

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

### Startup 入口

入口文件默认为 `index.ts`

:::tip
如果存在 `native.ts` 文件，则入口文件优先取 `native.ts`

Serverless 环境的本地调试用到了这个特性
:::

启动项目时会在本地创建一个 http 服务，因此 serverless 项目也可以本地运行

## info

可以显示项目信息，主要用于排查问题

### 使用方式

命令如下

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
Ipare CLI Version : 0.7.0

[Ipare Packages Version]
@ipare/core   : ^3.0.0
@ipare/native   : ^3.0.0
@ipare/inject : ^3.0.0
@ipare/pipe   : ^3.0.0
```

## update

用于升级 Ipare 依赖版本

### 使用方式

命令如下

```
Usage: ipare update|u [options]

Update ipare dependencies

Options:
  -n, --name <name>                      Specify to update a package
  -a, --all                              Update all dependencies (default: false)
  -t, --tag <tag>                        Upgrade to tagged packages (latest | beta | rc | next tag) (default: "latest")
  -su, --skipUpgrade                     Display version information without upgrading (default: false)
  -si, --skipInstall                     Skip installation (default: false)
  -p, --packageManager <packageManager>  Specify package manager. (npm/yarn/pnpm/cnpm)
  --registry <url>                       Override configuration registry
  -h, --help                             display help for command
```
