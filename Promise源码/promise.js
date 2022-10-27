const PENDING = 'PENDING';
const FULFILLED = 'FULFILLED';
const REJECTED = 'REJECTED';
/**
 * 处理then的值可能出现的各种情况。
 * @param nextPromise then 返回的新 promise
 * @param res 上一个promise处理结果或者原因
 * @param resolve // 新的 resolve 方法
 * @param reject // 新的 rej 方法
 * @returns {*}
 */
const resolvePromise = (nextPromise, res, resolve, reject) => {
  // 自己等待自己完成是错误的实现，用一个类型错误，结束掉 promise  Promise/A+ 2.3.1
  if (nextPromise === res) {
    return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
  }
  // 如果是返回值是对象或者函数
  if ((typeof res === 'object' && res != null) || typeof res === 'function') {
    // 针对 return 时调用了别家的 promise 库的情况，别家的 promise 库有可能既调 resolve 又调 reject
    // 用一个变量来标识 只能调用resolve或reject, 不能两者都调用，触发了某一个之后就返回递归
    let called = false;
    try {
      // 判断是否是 promise，有 then 的就视为 promise
      let then = res.then;
      if (typeof then === 'function') {
        // 不要写成 res.then，直接 then.call 就可以了 因为 res.then 会再次取值触发getter，Object.defineProperty
        then.call(res, val => { // 根据 promise 的状态决定是成功还是失败
          if (called) return;
          called = true;
          // 递归解析的过程（因为可能 promise 中还有 promise，直到在下面返回一个普通值）
          resolvePromise(nextPromise, val, resolve, reject); // 注意这里是val
        }, r => {
          // 只要失败就reject
          if (called) return;
          called = true;
          reject(r);
        });
      } else {
        // 如果 res.then 不是函数就直接返回 resolve 作为结果
        if (called) return;
        called = true;
        resolve(res);
      }
    } catch (e) {
      // 取值（res.then）出错
      if (called) return;
      called = true;
      reject(e)
    }
  } else {
    // 如果 res 是个普通值就直接返回 resolve 作为结果
    resolve(res)
  }
}

class Promise {
  constructor(fn) {
    this.status = PENDING;
    this.value = null;
    this.reason = null;
    this.onResolvedCallbacks = [];
    this.onRejectedCallbacks= [];
    // 在构造函数中定义并且使用箭头函数，下面try调用就不需要绑定this了
    let resolveFn = (val) => {
      if(this.status ===  PENDING) {
        this.status = FULFILLED;
        this.value = val;
        this.onResolvedCallbacks.forEach(fn=>fn());
      }
    }

    let rejectFn = (reason) => {
      if(this.status ===  PENDING) {
        this.status = REJECTED;
        this.reason = reason;
        this.onRejectedCallbacks.forEach(fn=>fn());
      }
    }

    try {
      fn(resolveFn,rejectFn)
    } catch (error) {
      rejectFn(error)
    }
  }

  then(onFulfilled, onRejected) {
    //解决 onFulfilled，onRejected 没有传值的问题，是函数就传原本的函数，否则就变为传递值的函数
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v;
    //因为错误的值要让后面访问到，所以这里也要抛出个错误，不然会在之后 then 的 resolve 中捕获
    onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err };
    // 每次调用 then 都返回一个新的 promise  Promise/A+ 2.2.7
    let nextPromise = new Promise((resolve, reject) => {
      let fulFn = ()=>{
        setTimeout(() => {
          try {
          //Promise/A+ 2.2.7.1
          let res = onFulfilled(this.value); // 计算出当前promise的值
          // x可能是一个promise
          resolvePromise(nextPromise, res, resolve, reject);
        } catch (e) {
          //Promise/A+ 2.2.7.2
          reject(e)
        }
        });
      }
      let rejFn = ()=>{
        setTimeout(() => {
          try {
            let res = onRejected(this.reason);
            resolvePromise(nextPromise, res, resolve, reject);
          } catch (e) {
            reject(e)
          }
        });
      }
      if (this.status === FULFILLED) {
        //Promise/A+ 2.2.2
        //Promise/A+ 2.2.4 --- setTimeout ,在下一次事件循环中处理（引擎实现不是这样）
          fulFn()
      }

      if (this.status === REJECTED) {
        //Promise/A+ 2.2.3
        rejFn()
      }

      // 如果是 PENDING 状态，就把延迟函数存入数组中
      if (this.status === PENDING) {
        this.onResolvedCallbacks.push(fulFn);
        this.onRejectedCallbacks.push(rejFn);
      }
    });

    return nextPromise;
  }
}

// 测试使用
Promise.deferred = function () {
  var result = {};
  result.promise = new Promise(function (resolve, reject) {
    result.resolve = resolve;
    result.reject = reject;
  });

  return result;
}
module.exports = Promise
