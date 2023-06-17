# CLI 脚手架 `(@halsp/cli)`

`@halsp/cli` 提供创建、编译、调试、升级等功能

## 安装

全局安装

```sh
npm install @halsp/cli -g
```

或项目中安装

```sh
npm install @halsp/cli -D
```

## 快速开始

下面列出的是常用命令

1. 创建一个项目

```sh
halsp create
```

2. 编译项目

```
halsp build
```

3. 运行项目

```
halsp start
```

## 项目配置

在项目根目录下有配置文件，用来存放 CLI 的相关配置

文件名称可以是以下其中之一

- .halsprc.ts
- .halsprc.js
- .halsprc.json
- halsp.config.ts
- halsp.config.js
- halsp.config.json

### 导出内容

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
import { defineConfig } from "@halsp/cli";

export default defineConfig({
  start: {}
});
```

#### 导出回调函数

导出回调函数可以实现动态配置，即根据不同编译条件返回不同配置

```TS
import { defineConfig } from "@halsp/cli";

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

    cacheDir?: string;
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

使用云函数环境 `@halsp/lambda` 和 `@halsp/alifc` 时，该值默认为 `true`

#### cacheDir

本地运行时，缓存文件路径

默认为 `node_modules/.halsp`

#### port

调试时启动的端口

#### binaryToRun

调试时启动的环境，默认为 `node`

#### inspect

V8 引擎的调试工具

#### startupFile

启动文件的路径，默认为 CLI 调试时生成的文件

默认按以下顺序查找

- index.ts
- main.ts
- native.ts

一般用于同时支持多种环境

## 支持的命令

执行命令 `halsp -h` 即可列出所有命令

```
Usage: halsp <command> [options]

Options:
  -v, --version, -V, -version            output the version number
  -h, --help                             display help for command

Commands:
  create|c [options] [name]              Generate Halsp application
  build|b [options] [app]                Build Halsp application
  start|s [options] [app]                Run Halsp application
  info|i [options] [app]                 Display halsp project details
  update|u [options] [app]               Update halsp dependencies
  serve [options] [app]                  Serve static web by @halsp/static and @halsp/native
  help [command]                         display help for command
```

## create

用于新建项目，可以选择插件、运行环境等

```sh
halsp create <project-name>
```

### 使用方式

命令如下

```
Usage: halsp create|c [options] [name]

Generate Halsp application

Arguments:
  name                                    Aapplication name

Options:
  -f, --force                             Force create application, delete existing files.  (default: false)
  --override                              Override existing files.  (default: false)
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
  --forceInit                             Force init scaffold
  -t, --template [url]                    Generate a project from a remote template
  -b, --branch <branch>                   The name of template repository branch
  --path <path>                           Path to template files
  --skipCheckUpdate                       Skip to check update version
  -h, --help                              display help for command
```

### 关于插件

在创建过程中，需要选择插件，也可以用参数 `--plugins` 指定插件

如果选择的某个插件需要引用另一个插件，另一个插件即使没有选择，也会自动被添加

比如 `pipe` 依赖于 `inject`，若选择了 `pipe` 将自动加入 `inject`

### 模板

参数 -t 指定模板，根据现有模板创建项目

支持官方模板库 [halsp/template](https://github.com/halsp/template) 和自定义模板

官方模板库名称为 [halsp/template](https://github.com/halsp/template) 中的文件夹名，如

```
halsp create -t start
```

```
halsp create -t grpc
```

自定义模板库可以省略 `https://github.com`，或其他完整路径，或

```
halsp create -t username/repos
```

```
halsp create -t https://gitee.com/username/repos
```

## build

用于编译项目

编译输出位置，是在 `tsconfig.json` 中配置 `compilerOptions.outDir`

:::tip
CLI 有极高的扩展性，在编译过程中可以调起其他插件执行脚本，或动态修改配置

如 `@halsp/router` 编译时创建路由映射, `@halsp/view` 编译时自动修改配置并添加 `views` 文件夹为资源文件
:::

### 使用方式

命令如下

```
Usage: halsp build|b [options] [app]

Build Halsp application

Arguments:
  app                           Where is the app

Options:
  -m, --mode <mode>             Run mode (e.g., development,production). (default: "production")
  -c, --config <path>           Path to configuration file.
  -jc, --jsonConfig <json>      Json string of Halsp configuration.
  -fc, --funcConfig <function>  Function string to build Halsp configuration.
  -tc, --tsconfigPath <path>    Path to tsconfig.json file.
  -w, --watch                   Run in watch mode (live-reload).
  -wa, --watchAssets            Watch non-ts (e.g., .views) files mode.
  --assets <assets>             Copy files to dist (e.g. views/**/*||static/**/*)
  --cacheDir <cacheDir>         Cache dir (default: /node_modules/.halsp)
  -sm, --sourceMap              Whether to generate source map files.
  -cp, --copyPackage            Copy package.json to out dir.
  --removeDevDeps               Remove devDependencies in package.json file when --copyPackage is true.
  --skipCheckUpdate             Skip to check update version
  -h, --help                    display help for command
```

### 扩展编译功能

如果你需要实现一个插件，并且有以下任一需求

- 在编译过程执行特定的代码，那么就需要扩展脚本
- 编译前动态修改配置，那么就需要拓展配置

插件命名需要满足以下任意一个条件

- 以 `@halsp/` 开头的 scope 包，属于 Halsp 官方插件
- 以 `halsp-` 开头，如 `halsp-xxx`
- 以 `@<score>/halsp-` 开头的 scope 包，如 `@my-name/halsp-xxx`

#### 插件脚本

插件脚本主要分为两种，TS 编译钩子和编译前后的脚本

##### TS 编译钩子

在插件中，导出以下脚本作用于 ts 编译的钩子

- beforeCompile
- afterCompile
- afterCompileDeclarations

##### 编译前后的脚本

在插件中，导出以下脚本，作用于编译前后运行

- postbuild 编译完成后运行
- prebuild 编译之前运行

脚本为一个函数，接收一个对象类型的参数，包含以下属性

- config 配置对象
- cacheDir 编译使用的缓存目录，所有编译文件都将输出到这里
- mode 编译命令指定的 --mode 参数，默认为 `production`
- command 命令类型，值为 build 或 start

`postbuild` 函数如果返回 false， 将终止编译

#### 动态修改配置

在插件中导出 `cliConfigHook` 函数，可以在编译阶段，动态修改配置文件中读取的配置

注意，此操作不会更新配置文件

可以在函数中修改当前配置对象，或返回一个新的配置对象

`cliConfigHook` 函数，有两个参数

- config: 当前的配置对象，可以修改
- options: `ConfigEnv` 类型的对象，包含以下字段
  - mode: CLI 命令传入的 mode 参数，默认为 `production`
  - command: 命令类型，`start` 或 `build`

```TS
import { Configuration, ConfigEnv } from "@halsp/cli";

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

### 指定目录

可以指定应用所在目录

```
halsp build path/to/project
```

## start

用于启动并调试项目，先编译后启动，编译过程同 `build` 命令

### 使用方式

```
Usage: halsp start|s [options] [app]

Run Halsp application

Arguments:
  app                           Where is the app

Options:
  -m, --mode <mode>             Run mode (e.g., development,production). (default: "development")
  -c, --config <path>           Path to configuration file.
  -jc, --jsonConfig <json>      Json string of Halsp configuration.
  -fc, --funcConfig <function>  Function string to build Halsp configuration.
  -tc, --tsconfigPath <path>    Path to tsconfig.json file.
  -w, --watch                   Run in watch mode (live-reload).
  -wa, --watchAssets            Watch non-ts (e.g., .views) files mode.
  --assets <assets>             Copy files to dist (e.g. views/**/*||static/**/*)
  --cacheDir <cacheDir>         Cache dir (default: /node_modules/.halsp)
  --startupFile <path>          The file to startup
  -b, --binaryToRun <program>   Binary to run application (e.g., node, ts-node)
  -p, --port <port>             The port on http listens
  --inspect <hostport>          Run in inspect mode
  --skipCheckUpdate             Skip to check update version
  -h, --help                    display help for command
```

### 指定目录

可以指定应用所在目录

```
halsp start path/to/project
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
Usage: halsp info|i [options] [app]

Display halsp project details

Arguments:
  app                Where is the app

Options:
  --skipCheckUpdate  Skip to check update version
  -h, --help         display help for command
```

执行结果如

```
  _   _    _    _     ____  ____   ____ _     ___
 | | | |  / \  | |   / ___||  _ \ / ___| |   |_ _|
 | |_| | / _ \ | |   \___ \| |_) | |   | |    | |
 |  _  |/ ___ \| |___ ___) |  __/| |___| |___ | |
 |_| |_/_/   \_\_____|____/|_|    \____|_____|___|


[System Information]
OS Type        : Windows_NT
OS Platform    : win32
OS Release     : 10.0.22621
NodeJS Version : v16.20.0

[Halsp CLI]
Halsp CLI Version : 0.4.4

[Halsp Packages Version]
@halsp/alifc       : ^2.1.1
@halsp/core        : ^2.1.1
@halsp/cors        : ^2.1.1
@halsp/env         : ^2.1.1
@halsp/filter      : ^2.1.1
@halsp/inject      : ^2.1.1
@halsp/jwt         : ^2.1.1
@halsp/lambda      : ^2.1.1
@halsp/logger      : ^2.1.1
@halsp/micro       : ^2.1.1
@halsp/micro-grpc  : ^2.1.1
@halsp/micro-mqtt  : ^2.1.1
@halsp/micro-nats  : ^2.1.1
@halsp/micro-redis : ^2.1.1
@halsp/micro-tcp   : ^2.1.1
@halsp/mva         : ^2.1.1
@halsp/native      : ^2.1.1
@halsp/pipe        : ^2.1.1
@halsp/router      : ^2.1.1
@halsp/static      : ^2.1.1
@halsp/swagger     : ^2.1.1
@halsp/validator   : ^2.1.1
@halsp/view        : ^2.1.1
@halsp/ws          : ^2.1.1
@halsp/cli         : ../
@halsp/native      : ^2.1.1
@halsp/testing     : ^2.1.1
@halsp/http        : ^2.1.1
@halsp/body        : ^2.1.1
```

### 指定目录

可以指定应用所在目录

```
halsp info path/to/project
```

## update

用于升级 Halsp 依赖版本

### 使用方式

命令如下

```
Usage: halsp update|u [options] [app]

Update halsp dependencies

Arguments:
  app                                    Where is the app

Options:
  -n, --name <name>                      Specify to update a package
  -a, --all                              Update all dependencies (default: false)
  -t, --tag <tag>                        Upgrade to tagged packages (latest | beta | rc | next tag) (default: "latest")
  -su, --skipUpgrade                     Display version information without upgrading (default: false)
  -si, --skipInstall                     Skip installation (default: false)
  -p, --packageManager <packageManager>  Specify package manager. (npm/yarn/pnpm/cnpm)
  --registry <url>                       Override configuration registry
  --skipCheckUpdate                      Skip to check update version
  -h, --help                             display help for command
```

### 指定目录

可以指定应用所在目录

```
halsp update path/to/project
```

## serve

用于托管静态网站，使用了 `@halsp/static` 和 `@halsp/native`

### 使用方式

命令如下

```
Usage: halsp serve [options] [app]

Serve static web by @halsp/static and @halsp/native

Arguments:
  app                    Where is the app

Options:
  -p, --port <port>      The port on http listens
  --hostname <hostname>  The hostname on http listens
  --hideDir              Do not list dir
  --exclude <files>      Exclude files, glob string, separate with space (e.g. "**/*.key secret/*.crt")
  --prefix <prefix>      File prefix
  --encoding <encoding>  Buffer encoding (e.g. utf8)
  --skipCheckUpdate      Skip to check update version
  -h, --help             display help for command
```

### 指定目录

可以指定应用所在目录

```
halsp serve path/to/project
```

## create-halsp

包 `create-halsp` 使用了 `@halsp/cli` 的能力，能够快速创建 Halsp 应用且无需安装任何包

```sh
npm init halsp
```

相当于执行

```sh
npm install @halsp/cli -g
halsp create
```
