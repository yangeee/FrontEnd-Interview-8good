// gen$(_context)：yield 分割生成器函数的特性 而来

// context 对象用于储存函数执行上下文

// 迭代器函数返回一个对象，同时定义next()，用于执行gen$(_context)来跳到下一步

class Context {
  constructor(param) {
    this.next = 0
    this.prev = 0
    this.done = false
    this._send = param
  }
  stop() {
    this.done = true
  }
}

// 生成器
function gen$(context) {
  let xxx; // 用来保存传入的变量
  while (1) {
    switch (context.prev = context.next) {
      case 0:
        context.next = 2;
        return '第一';

      case 2:
        xxx = context._send // 假设这里传入了变量
        context.next = 4;
        return '第二';

      case 4:
        context.next = 6;
        return '第三';

      case 6:
        context.stop();
        return undefined
    }
  }
}

// 迭代器
let foo = function () {
  let context = new Context()
  return {
    next: function () {
      let value = gen$(context);
      let done = context.done
      return {
        value,
        done
      }
    }
  }
}

// 测试
const gen = foo()
console.log(gen.next())
console.log(gen.next(222))
console.log(gen.next())
console.log(gen.next())