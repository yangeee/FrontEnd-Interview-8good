const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
// 由于 traverse 采用的 ES Module 导出，我们通过 require 引入的话就加个 .default
const babel = require("@babel/core");

let moduleId = 0; // 区分

const createAssets = filename => {
  const content = fs.readFileSync(filename, "utf-8"); // 根据文件名，同步读取文件流

  // 将读取文件流 buffer 转换为 AST
  const ast = parser.parse(content, {
    sourceType: "module" // 指定源码类型
  })

  const dependencies = []; // 用于收集文件依赖的路径

  // 通过 traverse 提供的操作 AST 的方法，获取每个节点的依赖路径
  traverse(ast, {
    ImportDeclaration: ({node}) => {
      dependencies.push(node.source.value);
    }
  });

  // 将 AST 转换为浏览器可运行代码
  const {code} = babel.transformFromAstSync(ast, null, {
    presets: ["@babel/preset-env"]
  });
  let id = moduleId++; // 设置当前处理的模块ID
  return {
    id,
    filename,
    code,
    dependencies
  }
}

/**
 * 递归所有依赖模块，循环分析每个依赖模块的依赖，生成一份依赖图谱
 * @param entry
 * @returns {[{filename: string, code: string, id: number, dependencies: []}]}
 */
function createGraph(entry) {
  const mainAsset = createAssets(entry); // 获取入口文件下的内容
  const queue = [mainAsset]; // 入口文件的结果作为第一项
  for(const asset of queue){
    const dirname = path.dirname(asset.filename);
    asset.mapping = {};
    asset.dependencies.forEach(relativePath => {
      const absolutePath = path.join(dirname, relativePath); // 转换文件路径为绝对路径
      const child = createAssets(absolutePath);
      asset.mapping[relativePath] = child.id; // 相对路径作为key，保存模块ID
      queue.push(child); // 递归去遍历所有子节点的文件
    })
  }
  return queue;
}



/**
 * 输出编译后的结果
 * @param graph 依赖图谱
 */
function bundle(graph) {
  let modules = "";
  graph.forEach(item => {
    modules += `
            ${item.id}: [
                function (require, module, exports){
                    ${item.code}
                },
                ${JSON.stringify(item.mapping)}
            ],
        `
  })
  return `
        (function(modules){
            function require(id){
                const [fn, mapping] = modules[id];
                function localRequire(relativePath){
                    return require(mapping[relativePath]);
                }
 
                const module = {
                    exports: {}
                }

                fn(localRequire, module, module.exports);

                return module.exports;
            }
            require(0);
        })({${modules}})
    `
}

let graph = createGraph('./src/index.js');
const result = bundle(graph);
eval(result)