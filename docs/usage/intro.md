# 介绍

<p align="center">
  <a href="https://ipare.org/" target="blank"><img src="https://ipare.org/images/logo.png" alt="Ipare Logo" width="200"/></a>
</p>

<p align="center">Ipare - 面向云的现代渐进式轻量 <a href="http://nodejs.org" target="_blank">Node.js</a> 框架</p>

<p align="center" class="tags">
    <a href="https://github.com/ipare/core/blob/main/LICENSE" target="_blank"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="GitHub license" /></a>
    <a href=""><img src="https://img.shields.io/npm/v/@ipare/core.svg" alt="npm version"></a>
    <a href=""><img src="https://badgen.net/npm/dt/@ipare/core" alt="npm downloads"></a>
    <a href="https://nodejs.org/en/about/releases/"><img src="https://img.shields.io/node/v/vite.svg" alt="node compatibility"></a>
    <a href="#"><img src="https://github.com/ipare/core/actions/workflows/test.yml/badge.svg?branch=main" alt="Build Status"></a>
    <a href="https://codecov.io/gh/ipare/core/branch/main"><img src="https://img.shields.io/codecov/c/github/ipare/core/main.svg" alt="Test Coverage"></a>
    <a href="https://github.com/ipare/core/pulls"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome"></a>
    <a href="https://gitpod.io/#https://github.com/ipare/core"><img src="https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod" alt="Gitpod Ready-to-Code"></a>
    <a href="https://paypal.me/ihalwang" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
</p>

Ipare 是一个高效可伸缩的渐进式 nodejs 框架

可以启动原生 http 服务，也可以运行于 serverless

## 优势

1. 源码完全由 TypeScript 构成，有着完善的 TypeScript 支持
2. 组件式添加功能，避免代码冗余，保持项目快速高效
3. 完善的 Ioc 容器，用依赖注入让大型项目解耦，更易读
4. 丰富的扩展能力，Ipare 核心使用了中间件模型，可扩展性强
5. 与路径相关联的路由解析，进一步解耦各模块，路由编译能够让请求更高效
6. 编译阶段扫描项目，运行阶段不再扫描模块，启动速度更快
7. 优化 serverless 请求，不会和其他框架一样把请求时间浪费在初始化上

## 环境准备

- <a href="https://nodejs.org/en/about/releases/"><img src="https://img.shields.io/node/v/vite.svg" alt="node compatibility"></a>

## 提问

- 一般性问题请使用 [Discussions](https://github.com/ipare/core/discussions)
- 其他如果是代码错误或功能建议

  - 各模块的问题在各模块的仓库中提问，如 `@ipare/inject` 的问题转至 [ipare/inject issue](https://github.com/ipare/inject/issues)
  - 若不知道是哪个模块相关，或仅与 `@ipare/core` 相关，转至 [ipare/core issue](https://github.com/ipare/core/issues)
  - 提 issue 时需选择 issue 模板，并尽量填写完整内容

## 后续教程

后续教程均使用 TS，你可以借助 Babel 编译器来使用 JS
