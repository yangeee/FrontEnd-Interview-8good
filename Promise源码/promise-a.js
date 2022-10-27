// 定义Promise的三种状态常量
const PENDING = 'pending';
const FULFILLED = 'resolved';
const REJECTED = 'rejected';

function Promise(resolver) {
  // 传入的必须是函数
  if (typeof resolver !== 'function') {
    throw new TypeError('Promise resolver ' + resolver + ' is not a function');
  }

  // resolve或reject的结果值
  this._result = undefined;
  // 状态
  this._status = PENDING;
  // resolve的回调队列
  this._resolveCbs = [];
  // reject的回调队列
  this._rejectCbs = [];

  try {
    // 执行
    resolver(this._resolve.bind(this), this._reject.bind(this));
  } catch (error) {
    // 捕获错误
    this._reject(error);
  }
}

Promise.prototype._resolve = function (value) {
  setTimeout(() => {
    if (this._status !== PENDING) return;
    this._status = FULFILLED;
    this._result = value;
    this._resolveCbs.forEach((callback) => callback(value));
  });
};

Promise.prototype._reject = function (reason) {
  setTimeout(() => {
    if (this._status !== PENDING) return;
    this._status = REJECTED;
    this._result = reason;
    this._rejectCbs.forEach((callback) => callback(reason));
  });
};

function resolvePromise(promise, x, resolve, reject) {
  // 如果 promise 和 x 指向同一对象，以 TypeError 为据因拒绝执行 promise
  if (promise && x === promise) {
    return reject(new TypeError('Chaining cycle detected for promise!'));
  }
  // 用于 “优先采用首次调用并忽略剩下的调用”的标志位
  let invoked = false;
  // 尝试把 x.then 赋值给 then
  let then = undefined;
  // x 为对象或函数
  if ((x !== null && typeof x === 'object') || typeof x === 'function') {
    try {
      then = x.then;
      if (typeof then === 'function') {
        // 如果 then 是函数，将 x 作为函数的作用域 this 调用之
        then.call(
          x,
          (y) => {
            if (invoked) return;
            invoked = true;
            return resolvePromise(promise, y, resolve, reject);
          },
          (r) => {
            if (invoked) return;
            invoked = true;
            return reject(r);
          }
        );
      } else {
        // 如果 then 不是函数，以 x 为参数执行 promise
        return resolve(x);
      }
    } catch (e) {
      // 如果取 x.then 的值时抛出错误 e ，则以 e 为据因拒绝 promise
      if (invoked) return;
      invoked = true;
      return reject(e);
    }
  } else {
    // 如果 x 不为对象或者函数，以 x 为参数执行 promise
    return resolve(x);
  }
}

Promise.prototype.then = function (onFulfilled, onRejected) {
  // 保证是函数，不是函数要实现透传
  onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (v) => v;
  onRejected =
    typeof onRejected === 'function'
      ? onRejected
      : (v) => {
        throw v;
      };

  let promise = undefined;

  // 已经resolve
  if (this._status === FULFILLED) {
    return (promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          var x = onFulfilled(this._result);
          resolvePromise(promise, x, resolve, reject);
        } catch (e) {
          return reject(e);
        }
      });
    }));
  }
  // 已经reject
  if (this._status === REJECTED) {
    return (promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          var x = onRejected(this._result);
          resolvePromise(promise, x, resolve, reject);
        } catch (e) {
          return reject(e);
        }
      });
    }));
  }
  // pending时直接放入回调队列中
  if (this._status === PENDING) {
    return (promise = new Promise((resolve, reject) => {
      this._resolveCbs.push((value) => {
        try {
          var x = onFulfilled(value);
          resolvePromise(promise, x, resolve, reject);
        } catch (e) {
          return reject(e);
        }
      });
      this._rejectCbs.push((reason) => {
        try {
          var x = onRejected(reason);
          resolvePromise(promise, x, resolve, reject);
        } catch (e) {
          return reject(e);
        }
      });
    }));
  }
};

/**
 * catch()发生错误时的回调函数 .then(null, onRejected)的别名
 */
Promise.prototype.catch = function (onRejected) {
  return this.then(null, onRejected);
};

/**
 * finally()方法用于指定不管 Promise 对象最后状态如何，都会执行的操作
 */
Promise.prototype.finally = function (callback) {
  return this.then(
    (value) => Promise.resolve(callback()).then(() => value),
    (reason) =>
      Promise.resolve(callback()).then(() => {
        throw reason;
      })
  );
};

/**
 * 将现有对象转为成功的Promise对象
 */
Promise.resolve = function (value) {
  if (value instanceof Promise) {
    return value;
  }
  return new Promise(resolve => resolve(value));
};

/**
 * 将现有对象转为失败的Promise对象
 */
Promise.reject = function (reason) {
  return new Promise((_, reject) => reject(reason));
};

/**
 * Promise.all()方法用于将多个 Promise 实例，包装成一个新的 Promise 实例。
 * 只有所有实例的状态都变成fulfilled，新的实例状态才会变成fulfilled，新实例参数
 * 只要其中有一个被rejected，新的实例就变成rejected，此时第一个被reject的实例的返回值，会传递给新实例的回调函数。
 */
Promise.all = function (promises) {
  return new Promise(function (resolve, reject) {
    let resolvedCount = 0;
    let promiseCount = promises.length;
    let resolvedValues = new Array(promiseCount);
    for (let i = 0; i < promiseCount; i++) {
      Promise.resolve(promises[i]).then(
        (value) => {
          resolvedCount++;
          resolvedValues[i] = value;
          if (resolvedCount == promiseCount) {
            return resolve(resolvedValues);
          }
        },
        (reason) => {
          return reject(reason);
        }
      );
    }
  });
};

/**
 * Promise.race()方法用于将多个 Promise 实例，包装成一个新的 Promise 实例。
 * 只要其中有一个状态变更，新的实例就跟随着变更，参数会传递给新实例的回调函数。
 */
Promise.race = function (promises) {
  return new Promise((resolve, reject) => {
    for (var i = 0; i < promises.length; i++) {
      Promise.resolve(promises[i]).then(
        (value) => {
          return resolve(value);
        },
        (reason) => {
          return reject(reason);
        }
      );
    }
  });
};

// 用于测试
Promise.deferred = Promise.defer = function () {
  var dfd = {};
  dfd.promise = new Promise(function (resolve, reject) {
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
};

module.exports = Promise;