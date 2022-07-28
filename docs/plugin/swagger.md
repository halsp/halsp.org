# Swagger 文档

安装 `@ipare/swagger` 以使用 Swagger 文档，用于生成你的 Ipare 文档

使用装饰器注释文档

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
import { DtoDescription, DtoFormat, DtoLengthRange } from "@ipare/swagger";

@DtoDescription("login info")
export class LoginDto {
  @DtoDescription("email")
  @DtoFormat("email")
  account!: string;

  @DtoDescription("password")
  @DtoLengthRange({
    min: 8,
    max: 24,
  })
  password!: string;
}
```

在 `Action` 中用 `@ipare/pipe` 注入请求参数

```TS
import { Action } from "@ipare/core";
import { Body } from "@ipare/pipe";

@ApiTags("user")
@ApiDescription("Get user info")
export default class extends Action {
  @Body
  private readonly loginDto!: LoginDto;

  async invoke() {
    this.ok(this.loginDto);
  }
}
```

## 配置介绍

`startup.useSwagger` 接收一个 `options` 参数，包含以下字段：

- path
- builder
- customHtml

### path

访问 swagger 页面的路径，默认为 `/`

### builder

回调函数，参数为 `OpenApiBuilder` 对象，返回值为同一个或新的 `OpenApiBuilder` 对象

如

```TS
startup.useSwagger({
  builder: (builder) => {
    builder.addInfo({
      title: "@ipare/swagger",
      version: "0.0.1",
    });
    return builder;
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

### customHtml

如果默认页面不能满足需求，可以自定义 swagger html 页面

该参数传入一个回调函数，函数参数为 json 字符串，返回值为 html 字符串

json 字符串参数为生成的 swagger 文档

```TS
startup.useSwagger({
  customHtml: getHtml,
});

const getHtml = (jsonStr) => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Swagger UI</title>
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@3.50.0/swagger-ui.min.css" />
    <style>
      html
      {
        box-sizing: border-box;
        overflow: -moz-scrollbars-vertical;
        overflow-y: auth;
      }

      *,
      *:before,
      *:after
      {
        box-sizing: inherit;
      }

      body
      {
        margin:0;
        background: #fafafa;
      }
    </style>
  </head>

  <body>
    <div id="swagger-ui"></div>
    <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@3.50.0/swagger-ui-bundle.min.js" charset="UTF-8"> </script>
    <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@3.50.0/swagger-ui-standalone-preset.min.js" charset="UTF-8"> </script>
    <script>
    window.onload = function() {
      const ui = SwaggerUIBundle({
        spec: ${jsonStr},
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "StandaloneLayout",
        validatorUrl:null
      });
      window.ui = ui;
    };
  </script>
  </body>
</html>`;
```

上述 `getHtml` 为 `@ipare/swagger` 的默认实现

## 支持的装饰器

文档中大部分内容是根据装饰器生成的

### Action 类装饰器

装饰 `Action` 的装饰器，用于描述单个接口

- ApiTags
- ApiSummary
- ApiCallback
- ApiDeprecated
- ApiDescription
- ApiExternalDocs
- ApiOperationId
- ApiResponses
- ApiSecurity
- ApiServers

```TS
import { Action } from "@ipare/core";
import { Body } from "@ipare/pipe";

@ApiTags("tag")
@ApiDescription("description")
export default class extends Action {
  async invoke() {
    this.ok();
  }
}
```

### Dto 装饰器

装饰数据传输模型的装饰器，也可以装饰 `@ipare/pipe` 的具名字段

- DtoDescription
- DtoAllowEmptyValue
- DtoDeprecated
- DtoIgnore
- DtoRequired
- DtoArrayType
- DtoExample
- DtoSchema
- DtoParameterStyle
- DtoDefault
- DtoNumRange
- DtoLengthRange
- DtoPattern
- DtoPropertiesRange
- DtoReadOnly
- DtoTitle
- DtoWriteOnly
- DtoEnum
- DtoFormat
- DtoXml
- DtoExamples
- DtoType

在数据传输模型中

```TS
import { DtoDescription, DtoFormat, DtoLengthRange } from "@ipare/swagger";

@DtoDescription("login info")
export class LoginDto {
  @DtoDescription("email")
  @DtoFormat("email")
  account!: string;

  @DtoDescription("password")
  @DtoLengthRange({
    min: 8,
    max: 24,
  })
  password!: string;
}
```

或在 Action 中

```TS
import { Action } from "@ipare/core";
import { Body } from "@ipare/pipe";
import { DtoRequired, DtoDescription } from "@ipare/swagger";

export default class extends Action {
  @Body("account")
  @DtoRequired()
  @DtoDescription("email")
  private readonly account!: string;

  async invoke() {
    this.ok({ account });
  }
}
```

## 示例项目

- todo 一个简易的 todo 项目
  - 在线示例: https://todo.hal.wang
  - github: https://github.com/hal-wang/todo
  - swagger: https://todo-5gcg801923564f08-1253337886.ap-shanghai.app.tcloudbase.com/v2
