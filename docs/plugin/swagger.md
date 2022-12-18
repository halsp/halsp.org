# Swagger 文档 `(@ipare/swagger)`

安装 `@ipare/swagger` 以使用 Swagger 文档，用于生成你的 Ipare 文档

基于 [@ipare/validator](./validator) 参数校验，使用装饰器注释文档，`@ipare/validator` 中的部分装饰器会自动生成文档内容

在浏览器中使用 [swagger-ui](https://github.com/swagger-api/swagger-ui) 渲染文档

## 安装

```
npm install @ipare/swagger
```

## 快速开始

在 `startup.ts` 中

```TS
import "@ipare/swagger";

startup.useSwagger();
```

定义传输模型

```TS
import "@ipare/swagger";
import { V } from "@ipare/validator";

@V.Description("login info")
export class LoginDto {
  @V.Description("email").IsEmail()
  account!: string;

  @V.Description("password").MinLength(8).MaxLength(24)
  password!: string;
}
```

在 `Action` 中用 `@ipare/pipe` 注入请求参数

```TS
import "@ipare/swagger";
import { V } from "@ipare/validator";
import { Action } from "@ipare/core";
import { Body } from "@ipare/pipe";

@V.Tags("user").Description("Get user info")
export default class extends Action {
  @Body
  private readonly loginDto!: LoginDto;

  async invoke() {
    this.ok(this.loginDto);
  }
}
```

## 配置

`startup.useSwagger` 接收一个 `options` 参数

```TS
export interface SwaggerOptions {
  path?: string;
  builder?: SwaggerBuilder;
  html?: SwaggerHtmlOptions;
  initOAuth?: any;
  uiBundleOptions?: SwaggerUIBundleConfig;
}
```

### path

访问 swagger 页面的路径，默认为 `swagger`，即访问路径为 `/swagger`

### builder

回调函数，参数为 `OpenApiBuilder` 对象，返回值为同一个或新的 `OpenApiBuilder` 对象，也可以不返回内容

如

```TS
startup.useSwagger({
  builder: (builder) => {
    builder.addInfo({
      title: "@ipare/swagger",
      version: "0.0.1",
    });
  }
})
```

或

```TS
startup.useSwagger({
  builder: (builder) => {
    return new OpenApiBuilder();
  },
});
```

`OpenApiBuilder` 参考 [openapi3-ts](https://github.com/metadevpro/openapi3-ts)

### html

网页渲染相关参数

```TS
export interface SwaggerHtmlOptions {
  lang?: string;
  title?: string;
  removeDefaultStyle?: boolean;
  favicon?: string | string[];
  css?: string | string[];
  style?: string | string[];
  js?: string | string[];
  script?: string | string[];
}
```

#### lang

网页语言的值，如 `cn`/`en`，影响 `<html lang="en">`

#### title

网页标题，取自文档中的 info/title 值，如果没有值，则为 `Swagger UI`

#### favicon

网页图标地址

#### removeDefaultStyle

如果为 true，将移除默认样式资源，你必须添加别的样式

#### css

网页样式文件地址，可以是一个字符串，也可以是字符串数组以添加多个文件

#### style

样式代码，可以是一个字符串添加一个 `<style>`，也可以是字符串数组添加多个 `<style>`

#### js

javascript 文件地址，可以是一个字符串，也可以是字符串数组以添加多个文件

#### script

javascript 代码，可以是一个字符串添加一个 `<script>`，也可以是字符串数组添加多个 `<script>`

### initOAuth

`swagger-ui-dist` 中的 `SwaggerUIBundle.initOAuth` 参数

参考 [SwaggerUIBundle OAuth](https://swagger.io/docs/open-source-tools/swagger-ui/usage/oauth2/)

### uiBundleOptions

`swagger-ui-dist` 中的 `new SwaggerUIBundle()` 参数

参考 [SwaggerUIBundle](https://swagger.io/docs/open-source-tools/swagger-ui/usage/installation/)

`url` 和 `dom_id` 正常情况使用默认值即可

网页代码请使用 `"% code %"` 的写法，如

```TS
startup.useSwagger({
  presets:[
    "%SwaggerUIBundle.presets.apis%",
    "%SwaggerUIBundle.SwaggerUIStandalonePreset%"
  ]
})
```

在网页会生成如下代码

```JS
SwaggerUIBundle({
  url: `./index.json`,
  dom_id: "#swagger-ui",
  presets: [
    SwaggerUIBundle.presets.apis,
    SwaggerUIBundle.SwaggerUIStandalonePreset,
  ],
});
```

## 支持的装饰器

文档中很多内容是根据装饰器生成的

装饰器会影响文档的生成，包含 `@ipare/validator` 中的部分装饰器和 `@ipare/swagger` 中的全部装饰器

- `@ipare/swagger` 中的装饰器
  - Ignore
  - Tags
  - Summary
  - Description
  - ExternalDocs
  - Deprecated
  - Servers
  - Security
  - OperationId
  - Style
  - Explode
  - AllowReserved
  - Examples
  - Example
  - Discriminator
  - ReadOnly
  - WriteOnly
  - Xml
  - Format
  - Items
  - Default
  - Title
  - MaxProperties
  - MinProperties
  - Enum
  - ContentTypes
  - Response
  - ResponseHeaders
  - ResponseDescription
  - ResponseContentTypes
- `@ipare/validator` 中影响文档生成的装饰器
  - IsNotEmpty
  - IsEmpty
  - IsInt
  - IsDate
  - IsNumber
  - IsString
  - IsBoolean
  - IsObject
  - IsEmpty
  - Max
  - Min
  - MinLength
  - MaxLength
  - Matches
  - ArrayMaxSize
  - ArrayMinSize
  - ArrayUnique
  - Required
  - IsOptional

### 数组

需要注意，数组类型无法确定其元素类型，需要借助 `Items` 装饰器声明元素类型

```TS
class TestDto1 {
  readonly prop1!: number;
}

class TestDto2 {
  @V.Items(TestDto1)
  readonly prop2!: TestDto1[];
}

export default class extends Action{
  @Body
  @V.Items(TestDto2)
  private readonly dto!:TestDto2[];

  invoke(){
    this.ok(this.dto);
  }
}
```

二维数组可以这样 `.Item([TestDto2])`，三维数组 `.Item([[TestDto2]])`，更高维数组以此类推

```TS
class TestDto2 {
  @V.Items([TestDto1])
  readonly prop2!: TestDto1[][];
}

class TestDto3 {
  @V.Items([[TestDto1]])
  readonly prop3!: TestDto2[][][];
}
```

## 示例项目

- todo 一个简易的 todo 项目
  - 在线示例: https://todo.hal.wang
  - github: https://github.com/hal-wang/todo
  - swagger: https://todo-5gcg801923564f08-1253337886.ap-shanghai.app.tcloudbase.com/v2
