# 工程化

# 1、模块化机制

## 一、模块化的理解

### 什么是模块

* 复杂的程序依据规则封装成几个块，组合在一起
* 块的内部数据与实现是私有的, 只是向外部暴露一些接口通信

### 模块化的进化过程

* 全局 function 模式 : 将不同的功能封装成不同的全局函数

  缺点：污染全局命名空间，模块成员之间看不出直接关系
* namespace 模式 : 简单对象封装

  缺点：数据不安全，可以直接被外部修改
* IIFE 模式：匿名函数自调用（闭包)

  好处：数据私有

  缺点：当前模块无法引用其他模块
* IIFE 模式增强 ：引入依赖（现代模块实现的基石）

  比原始 IIFE 多了一步，要引入的模块先放入参数中，html 引入文件时注意顺序

```javascript
// module.js文件
(function(window, $) {
  let data = 'yang.plus'
  //操作数据的函数
  function foo() {
    $('body').css('background', 'red')
  }
  function bar() {
    otherFun() //内部调用
  }
  //内部私有的函数
  function otherFun() {
    console.log('otherFun()')
  }
  //暴露行为
  window.myModule = { foo, bar }
})(window, jQuery) // 直接引入需要的模块
```

### 模块化的好处

* 避免命名冲突(减少命名空间污染)
* 更好的分离, 按需加载
* 高复用性
* 高可维护性

### 引入多个 <script> 后出现的问题

* 请求过多
* 依赖模糊（不知道具体的依赖关系，所以引入顺序容易弄混）
* 难以维护（模块多了容易乱）

所以需要模块化规范解决这些问题

## 二、模块化规范

### CommonJS

1）概述

每个文件就是一个模块，有自己的作用域。

在服务器端，模块的加载是运行时同步加载的。

在浏览器端，模块需要提前编译打包处理

2）特点

* 所有代码都运行在模块作用域，不会污染全局作用域。
* 模块可以多次加载，但是只会在第一次加载时运行一次，然后运行结果就被缓存，以后加载直接读取缓存结果。要想让模块再次运行，必须清除缓存。
* 模块加载的顺序，按照其在代码中出现的顺序。

3）基本语法

* 暴露模块：module.exports = value  或 exports.xxx = value
* 引入模块：require(xxx)。如果是第三方模块，xxx为模块名。如果是自定义模块，xxx为模块文件路径
* 加载某个模块，其实就是加载模块的 module.exports 属性

4）模块的加载机制

输入的是被输出的值的拷贝，一旦输出一个值，模块内部的变化影响不到这个值

### AMD

CommonJS 规范加载模块是同步的，浏览器端一般采用AMD规范（依赖注入思想）。

通过 requireJS 库来实现 AMD 规范（已不维护）

```javascript
// 定义有依赖的模块，数组注入，回调中传入参数
define(['dataService'], function(dataService) {
  let name = 'Tom'
  function showMsg() {
    alert(dataService.getMsg() + ', ' + name)
  }
  // 暴露模块
  return { showMsg }
})
```

```html
<body>
    <!-- 引入require.js 并指定 js 主文件的入口 -->
    <script data-main="js/main" src="js/libs/require.js"></script>
</body>
```

### CMD

专门用于浏览器端，模块的加载是异步的，模块使用时才会加载执行，整合了CommonJS和AMD规范的特点

sea.js库（已不维护）

### ES6 模块化

静态化，编译时就能确定模块的依赖关系，以及输入和输出的变量

1）ES6模块化语法

具名引入、导出，引入时有多个需要花括号

```javascript
/** 定义模块 math.js **/
var basicNum = 0;
var add = function (a, b) {return a + b;};
export { basicNum, add };
/** 引用模块 **/
import { basicNum, add } from './math';
function test(ele) {ele.textContent = add(99 + basicNum);}
```

默认引入、导出，引入时可以随意取名

```javascript
// export-default.js
export default function () {console.log('foo');}
// import-default.js
import customName from './export-default';
customName(); // 'foo'
```

2）ES6 模块与 CommonJS 模块的差异

① CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。

② CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。

> 因为 module.exports 属性只有在脚本运行完才会生成。ES6 模块则不是，对外接口是一种静态定义，解析阶段生成

## 三、总结

* CommonJS 规范主要用于服务端编程，加载模块是同步的，不适合在浏览器环境。因为同步意味着阻塞加载，浏览器资源是异步加载的，因此有了 AMD CMD 解决方案。
* AMD 规范在浏览器环境中异步加载模块，而且可以并行加载多个模块。不过，AMD 规范开发成本高，代码的阅读和书写比较困难，模块定义方式的语义不顺畅。
* CMD 规范与 AMD 规范很相似，都用于浏览器编程，依赖就近，延迟执行，可以很容易在Node.js 中运行。不过，依赖 SPM 打包（压缩、简单化命名），模块的加载逻辑偏重
* ES6 在语言标准的层面上，实现了模块功能，而且实现得相当简单，完全可以取代 CommonJS 和 AMD 规范，成为浏览器和服务器通用的模块解决方案。

# 2、Tree-Shaking

基于 ES6 模块的静态分析机制，传统的 DCE 消灭不可能执行的代码，Tree-shaking 更关注消除没有用到的代码，uglify 完成了 javascript 的 DCE

#### sideEffects

`package.json` 中添加 `sideEffects` 属性，将其值设置为 false。告知 webpack，项目中都是 ”pure“(纯正 ES6 模块)，可以安全地删除未用到的 export。

通过把值设置为包含路径的数组，告诉 webpack 哪些不能优化

#### usedExports

也是告诉 webpack 开启 tree shaking，没有 sideEffects 好，因为后者允许跳过整个模块

# 3、uglify 原理

JS 的代码压缩原理：

1. 将 code 转换成AST 
2. 将 AST 进行优化，生成一个更小的 AST 
3.  将新生成的 AST 再转化成 code

babel，eslint，v8 的逻辑均与此类似

astexplorer 可以看具体的 ast 树内容

```javascript
var UglifyJS = require('uglify-js'); // 2.x 版本
// 原始代码
var code = `var a;
var x = { b: 123 };
a = 123,
delete x`;
// 通过 UglifyJS 把代码解析为 AST
var ast = UglifyJS.parse(code);
ast.figure_out_scope();
// 转化为一颗更小的 AST 树
compressor = UglifyJS.Compressor();
ast = ast.transform(compressor);
// 再把 AST 转化为代码
code = ast.print_to_string();
// var a,x={b:123};a=123,delete x;
```

表达式有值，语句一般无值

# 4、Babel 原理

### Babel 的处理流程

![](https://content.markdowner.net/pub/1ma7rm-BgeazLE)

#### 词法解析(Lexical Analysis)

将字符串形式的代码转换为 Tokens(令牌)，Tokens 可以视作是一些语法片段组成的数组。

 例如 for (const item of items) {} 的词法解析结果（[AST、syntax、tokens网站](https://esprima.org/)）

![](https://content.markdowner.net/pub/enP7gg-dEjOWm5)

还可以选择加入location（位置）、行号列号等信息

#### 语法解析(Syntactic Analysis)

解析器 (Parser) 会把 Tokens 转换为抽象语法树 (Abstract Syntax Tree，AST)

console.log('hello world') 会解析为

![](https://content.markdowner.net/pub/WXa28v-0M0YjrV)

Program、CallExpression、Identifier 这些都是节点的类型，每个节点都是一个有意义的语法单元。 这些节点类型定义了一些属性来描述节点的信息

AST 是 Babel 转译的核心数据结构，后续的操作都依赖于 AST

#### 转换(Transform)

转换阶段会对 AST 进行遍历，在这个过程中对节点进行增删查改。Babel 所有插件都是在这个阶段工作, 比如语法转换、代码压缩。

#### 代码生成（Generator）

把 AST 转换回字符串形式的 Javascript，同时这个阶段还会生成 Source Map。

### Babel 的架构

Babel 和 Webpack 为了适应复杂的定制需求和频繁的功能变化，都使用了微内核 的架构风格。它们的核心非常小，大部分功能都是通过插件扩展实现的

![](https://content.markdowner.net/pub/Gv5n87-d6YQkx9)