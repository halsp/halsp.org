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

### 插件

在创建过程中，需要选择插件，也可以用参数 `--plugins` 指定插件

如果选择的某个插件需要引用另一个插件，需要的插件会自动添加，即使没有选择

比如 `pipe` 依赖于 `inject`，若选择了 `pipe` 将自动加入 `inject`

## template

根据模板创建项目

该功能暂未完成

## build

用于编译项目，可以调起其他插件执行特定脚本

如 `@ipare/router` 插件创建路由映射, `@ipare/view` 自动拷贝视图到输出文件夹等等

### 使用方式

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

### 扩展编译功能

如果你需要实现一个插件，并且有以下任一需求

- 在编译过程执行特定的代码，需要扩展脚本
- 编译前动态修改配置，需要拓展配置

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

#### 扩展配置

在插件中导出 `cliConfigHook` 函数，可以扩展配置 `ipare-cli.config.ts`

注意，此操作不会更新 `ipare-cli.config.ts` 文件

可以在函数中修改当前配置对象，或返回一个新的配置对象

`cliConfigHook` 函数，有两个参数

- config: 当前的配置对象，可以修改
- options: `ConfigEnv` 类型的对象，包含以下字段
  - mode: CLI 命令传入的 mode 参数
  - command: 命令类型，`start` 或 `build`

```TS
export const cliConfigHook = (
  config: any,
  env: { mode: string; command: "start" | "build" }
) => {
  config.build = config.build ?? {};
  config.build.assets = config.build.assets ?? [];
  config.build.assets.push({
    include: "static/*",
    root: "src",
  });
};
```

插件导出上述 `cliConfigHook` 函数，即为 CLI 配置添加一个资源文件夹

即让 CLI 每次编译都拷贝 `src/static` 文件夹及其中所有文件到目标文件夹 `dist/static`

## start

用于启动并调试项目，先编译后启动，编译过程同 `build` 命令

启动项目时会在本地创建一个 http 服务，因此 serverless 项目也可以本地运行

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

`@ipare/cli` 要求必须按规范有个 src/startup.ts 文件，并导出一个默认函数，内容如下

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

## info

可以显示项目信息，主要用于排查问题

### 使用方式

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

## update

用于升级 Ipare 依赖版本

### 使用方式

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
