# 断点调试

此教程使用 vscode 断点调试 Ipare 项目

非 `@ipare/http` 项目调试，会自动使用 `@ipare/http` 模拟原生 Http 环境

## CLI 创建的项目

由 `@ipare/cli` 创建的项目已经配置好调试环境，可以用 vscode 打开项目并按下 F5 开始调试

或运行这个命令

```bash
npm start
```

## 不是 CLI 创建的项目

如果不是 `@ipare/cli` 创建的项目，并且没有调试配置，可以参考以下步骤配置

### 安装

确保已在项目内或全局安装 `@ipare/cli`

```bash
# 项目中安装
npm install @ipare/cli -D

# 或 全局安装
npm install @ipare/cli -g
```

### 创建脚本

修改 package.json 文件，添加

```JSON
  "scripts": {
    "dev": "ipare start --mode development --watch",
    "start": "npm run dev",
    "build": "ipare build"
  },
```

### 增加调试配置

在项目下创建 `.vscode/launch.json` 文件

```JSON
{
  "version": "0.2.0",
  "configurations": [
    {
      "command": "npm start",
      "name": "Ipare Http Debugger",
      "request": "launch",
      "type": "node-terminal"
    }
  ]
}
```

### 开始调试

按下 F5 即可开始断点调试
