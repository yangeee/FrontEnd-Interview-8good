# 一、权衡的艺术

vue 基于运行时+编译时。

两者共用：编译时将模板转换为表示虚拟dom的对象，可以分析哪些内容未来可能改变，哪些永远不会变等信息，传递给 Render 函数做运行时的优化

纯编译时：框架直接编译成可执行的 js 代码，理论上性能更好且不需要太大心智负担，但少了灵活性，用户的内容必须编译后才能用，编译也需要时间。

纯运行时：需要用户自己编写可执行的 JS 代码，心智负担大，无法分析用户提供的内容

总结：要考虑心智负担、可维护性、性能等综合要素

# 二、框架设计的核心要素

## 提升用户的开发体验

合适的警告信息：使用 console.warn()

## 控制框架代码的体积

1、区别开发环境和生产环境使用的代码

开发环境使用的代码，可以通过一个全局常量`_DEV_ `在 if 语句中做判断，开发版本中修改常量再通过摇树去除掉

2、tree shaking

js 是动态语言，有一些代码运行时才能知道是否有副作用(调用的时候会对外部产生影响)，所以可以主动指示哪些代码不会造成副作用，使用`/*#pure*/`来表示当前代码没有副作用，打包器可以放心摇树

## 框架的构建产物

vue.global.js 用于开发环境

vue.global.prod.js 用于生产环境，二者都是 IIFE 的形式

esm有两种，一种是给浏览器用的，另一种是打包工具用的。文件名带 bundler 的是给打包工具使用的 js，如果 package.json 中存在 module 字段，会优先使用这个字段的资源来代替 main 字段的资源。好处是比如上面的`_DEV_`常量，esm环境中会换成 `process.env.NODE_ENV!=='production'`，用户可以自行配置构建的目标环境

也应该支持 node 环境

上述文件都可以使用 rollup.js 的 output 对象中设置 format 字段来构建出，比如 iife、cjs、esm

## 特性开关

好处：

1、可以进行摇树去掉不需要的特性

2、便于为框架添加新的特性，不用担心体积变大。框架升级时也可以选择支持旧的 API

实现方法：利用 rollup.js 的预定义常量插件，`_VUE_OPTIONS_API_`就是是否支持 vue2 选项式 API 的开关

```json
{
  _FEATURE_OPTIONS_API_: isBundleESMBuild ? '_VUE_OPTIONS_API_' : true
}
```

代码中 if 判断中的 `_FEATURE_OPTIONS_API_`会根据是否是打包工具使用来控制开关的展示

如果是打包工具环境，可以通过自定义插件 webpack.DefinePlugin 实现开关

```javascript
new webpack.DefinePlugin({
  _VUE_OPTIONS_API_: JSON.stringify(true) // 'true'
})
```

## 错误处理

1、在工具内部定义一个外部错误处理函数的注册函数，接受用户传递的错误处理函数

2、内部封装一个统一的执行回调函数的函数，在 try catch 执行用户传入的回调函数， catch 部分执行用户注册的错误处理函数或者为空。

## TS

良好的类型支持

# 三、Vue3的设计思路

## 声明式的描述UI

vue 的模板可以声明式的描述 UI，但是没有 js 对象描述来的灵活，比如选择 h1~h6 需要穷举，js 只需更改变量值即可表达。vue 的 h 函数就是方便编写虚拟 DOM 而设计的

## 初识渲染器

假设我们虚拟 dom 的定义为：

```js
const vnode = {
    tag: 'div',
    props: {
        onClick: ()=>alert('hello')
    },
    children: 'click me'
}
```

实现渲染器 render 分三步：

1、创建元素：通过 tag

2、为元素添加属性和事件：for in 遍历 props 对象，如果以 on 开头（/^on/.text(key)）说明是事件，截取掉 on 字符放入 addEventListner 中

3、处理 children：如果是数组，就递归调用我们的 render 函数。是字符串就创建文本节点

精髓是后续的更新，也就是 diff 算法找出变更点

## 组件的本质

**组件是一组 DOM 元素的封装**

组件可以是函数返回要渲染的内容，类似上面的 vnode 结构。也可以是一个对象，有一个  render 函数返回要渲染的内容（vue 的有状态组件[不止用于显示的组件]用的这种）

渲染器渲染组件

## 模板的工作原理

编译器会把模板编译成对应的渲染函数并且添加到<script>标签块的组件对象上

```js
export default {
  data(){}
  methods:{handler: ()=>{}},
  render(){return h('div',{onClick: handler}, 'click me')}
}
```

## Vue是各个模块组成的有机整体

编译器在编译阶段可以根据模板语法，知道哪些数据是可能会发生变化的，从而帮助渲染器更好的跟踪可变量，提示性能。比如在虚拟 dom 对象上增加一个字段表示 class 是可变的

# 四、响应系统的作用与实现

## 1）响应式对象和副作用函数

后者：函数的执行会直接或间接的影响其他函数，比如修改全局变量。当我们读取一个变量时，存储这个副作用函数。当其他时候修改这个变量时，取出所有的副作用函数执行一次。

这里进行了封装，我们构造一个副作用函数构造器 effect，传入的参数是我们真正的副作用函数 fn

前者：对象中的值发生改变后，副作用函数会自动执行利用最新的值

## 2）设计一个完善的响应式系统

```
weakMap:{
  obj: Map
} 
Map: {
  key: Set
}
```

weakMap ：索引是对象，值是这个对象所有属性保存副作用函数的桶的 map。

Map：键是对象的字段，值是副作用函数桶 set

Set : 存储每个属性对应的副作用函数 ,一般叫做 deps（依赖集合）

## 3）分支切换和cleanup

假设一个副作用函数中

```js
document.querySelector('#id').innerText = obj.ok ? obj.text : 'not'
```

当 ok 发生变化时，会收集这个副作用函数进入依赖集合 Set 中，但是也会同时放入 text 的依赖集合里。但是当 ok 值为 false 时，此时不会触发 text 读取，那么已经存在的依赖应该被删除，防止遗留。

这里我们应该考虑一个问题，我们怎么知道这个副作用函数被谁依赖着呢。所以在进行依赖收集时，不仅要把函数放入 Set，同时也要把这个 Set 放入副作用函数的 deps 数组里（effect.deps），这样就有双向联系

在我们每次执行 effect 前，先把这个 effect 从它所有的依赖集合里删除，再重新进行收集它，这样就把遗留的 effect 删掉啦

## 4）副作用函数可以嵌套

组件的渲染函数 `render()` 就是一个 effect ,组件中还可以渲染子组件，此时发生了嵌套

所以一个全局的活动函数变量 activeEffect 无法满足要求，因为外层的会被内层的函数覆盖掉，需要使用 effect 栈

我们在执行 effect 前先把它压入栈，执行完后弹出，同时 activeEffect 设置成栈顶函数

## 5）避免无限递归循环

```js
effect(()=>{
obj.foo = obj.foo + 1
})
```

上述代码由于读取了 foo ，所以会触发 track 操作把副作用函数加入桶中，然后又因为设置了 foo 触发 trigger 操作，从桶里把副作用函数取出执行，导致了无限递归调用自己

解决方法：判断下 trigger 的函数和自己是否相同

```js
if(effectFn !== activeEffect){ 
//执行依赖集合中的副作用函数
}
```

## 6）调度执行

可调度性：当 trigger 动作触发副作用函数执行时，可以决定执行的时机、次数、方式

前提：为 effect 构造器扩展一个参数： options 选项，其中有一个**调度器函数** scheduler ，接受 effectFn 作为参数，在 effect 执行时把调度器挂载到每个 具体的 effectFn 上，此时不执行 effectFn，而是返回 effectFn，把控制权交给外面用户的变量控制

执行时机：调度器中可以设置 settimeout 推迟执行

次数：可以设置一个刷新队列 jobQueue: Set，一个刷新标志。连续多次 `obj.foo++` 时，会触发多次把 effectFn 放入队列，但是 Set 自动去重。通过` p = promise.resolve()` 构造 promise 实例，然后在 then 中执行我们的 effectFn，由于有刷新标志的存在，副作用函数最终只会执行一次。

调度器何时执行：在触发 trigger 函数时，如果桶中的 effectFn 有调度器属性就触发各自的调度器

> 这个功能有点类似 vue 的连续多次修改响应式数据但是只执行一次更新，vue 内部实现了一个更加完善的调度器，思路相同。
>
> 为什么这里要用微任务呢？个人理解：因为要确保所有的副作用函数执行完后才把刷新状态重置

```js
scheduler(fn){
jobQueue.add(fn)
flushJob() // 执行
}
```

在每次触发 trigger 时执行 scheduler

```js
// 来自 mini-vue，与书上代码差不多
export function triggerEffects(dep) {
// 执行收集到的所有的 effect 的 run 方法
for (const effect of dep) {
  if (effect.scheduler) {
    // scheduler 可以让用户自己选择调用的时机
    // 这样就可以灵活的控制调用了
    // 在 runtime-core 中，就是使用了 scheduler 实现了在 next ticker 中调用的逻辑
    effect.scheduler();
  } else {
    effect.run();
  }
}
}
```

## 7）计算属性 computed 和 lazy

前置：我们需要在 options 参数中增加 lazy 属性，表示 effect 的时候不马上执行 effectFn，而是延迟执行，并且在 effectFn 中返回真正的副作用函数 fn 的结果，再返回 effectFn，这样在外面我们可以手动执行 effectFn 获取真正的副作用函数 fn 的结果

> 注意，只有传入 effect 的参数 fn 才是真正的副作用函数，effectFn 是我们封装的，在里面会执行 fn() 而已

### 基础方案

```typescript
function computed(getter: Function){
const effectFn = effect(getter,{
  lazy: true
})
const obj = { // 访问器
  get value(){
    return effectFn()
  }
}
return obj
}
const sum = computed(()=> obj.foo + obj.bar)
console.log(sum.value)
```

跟目前的 computed 很像，传入一个副作用函数，然后访问 value 的时候触发 get 执行 effectFn 获取最新的值。

缺点：没有缓存，每次读取值都会重新计算

### 引入 脏检查标志 和 存储变量

我们使用 dirty 来判断是否已经计算过，并把值保存在 value 变量中，这样当 dirty 为 true 时我们直接返回结果就好。

但是这样有一个问题，我们修改了 obj.foo 的值后，sum 并没有变化，所以我们需要使用上面写的调度器选项，我们在调度器中把 dirty 重置，这样如果修改了依赖的变量 obj.foo，就会重置 dirty，然后再次读取的时候就会重新计算

### 解决嵌套 effect 中的 computed

读取计算属性的值时，手动调用 track 函数进行跟踪（此时 activeEffect 是外层的，创建了一个 WeakMap，key 是 computed 函数返回的对象 obj，值是一个 Map。Map 的 key 是 obj.value，值是 Set，里面有外层的 effect）。

当获取 value 触发执行计算函数的 effectFn 时，调度器里手动执行 trigger 函数触发响应，把外层的 effect 从 Set 拿出来也执行

## 8）wacth 的实现原理

### 基本方案

在调度器中调用我们传入的 callback 函数即可

```typescript
function watch(source: Object,cb){
effect(
  //递归的进行读取，从而触发 get 把副作用函数和数据建立响应式关系
  ()=> traverse(source),
  {
    scheduler(){
      cb()
    }
  }
)
}
// 对对象的所有属性进行监听
function traverse(value,seen=new Set()){
// 如果读取的字段是原始值，或者已读，直接返回
if(typeof value !== 'object' || value === null || seen.has(value)) return
seen.add(value)
// 递归所有字段
for(const k in value){
  traverse(value[k],seen)
}
return value 
}
```

### 函数增强版

我们不仅可以传入一个响应式数据作为监听的源，还可以传入一个 getter 函数（我现在项目里一般用的就是这种）

如果检测到参数是函数，那直接使用用户给的这个函数作为 getter 去读取数据产生联系

```js
function watch(source: Object,cb){
let getter
if(typeof source === 'function'){
  getter = source
}else {
  getter = ()=> traverse(source)
}
  effect(
    //递归的进行读取，从而触发 get 把副作用函数和数据建立响应式关系
    ()=> getter(),
    {
      scheduler(){
        cb()
      }
    }
  )
}
```

### 如何获得新旧值

需要利用 lazy（不马上执行副作用函数） 和 调度器（控制新旧值的获取）

```ts
function watch(source: Object,cb){
  let getter
  if(typeof source === 'function'){
    getter = source
  }else {
    getter = ()=> traverse(source)
  }
  let oldValue,newValue
  const effectFn = effect(
    //递归的进行读取，从而触发 get 把副作用函数和数据建立响应式关系
    ()=> getter(),
    {
      lazy: true, // 新增
      scheduler(){
        newValue = effectFn() // 新增
        cb(newValue,oldValue)
        oldValue = newValue // 用新值更新旧值
      }
    }
  )
  // 手动调用副作用函数，因为是马上第一次执行的，获取的是旧值
  // 当后面值发生变化时调度器里面执行的时候就是拿的新值
  oldValue = effectFn()
}
```

### 立即执行的 watch 和回调执行时机

watch 的本质其实是对 effect 的二次封装，想要立即执行，我们就把调度器封装成 Job 函数，在 options.immediate 为真时直接执行一次。

```js
function watch(source: Object,cb){
  let getter
  if(typeof source === 'function'){
    getter = source
  }else {
    getter = ()=> traverse(source)
  }
  let oldValue,newValue
  const job = ()=>{
    newValue = effectFn()
    cb(newValue,oldValue)
    oldValue = newValue
  }
  const effectFn = effect(
    ()=> getter(),
    {
      lazy: true, 
      scheduler: job  // 封装
    }
  )
  if(options.immediate){
    job() // 立即执行调度器
  }else {
    oldValue = effectFn()
  }
}
```

flush 功能也可以通过在调度器中进行判断从而使用 promise.then() 来指定执行时机

### 过期的副作用（竞态问题）

竞态问题：无法保证异步操作的完成会按照他们开始时同样的顺序（常见于请求）

```js
function watch(source: Object,cb){
  let getter
  if(typeof source === 'function'){
    getter = source
  }else {
    getter = ()=> traverse(source)
  }
  let oldValue,newValue
  let cleanup // 用来保存用户注册的过期回调
  function onInvalidate(fn){
    cleanup = fn
  }
  const job = ()=>{
    newValue = effectFn()
    if(cleanup){
      cb(newValue,oldValue,onInvalidate) // 将onInvalidate作为回调的第三个参数，让用户传递函数fn进来
    }
    oldValue = newValue
  }
  const effectFn = effect(
    ()=> getter(),
    {
      lazy: true,
      scheduler: ()=>{
        if(options.flush === 'post'){
          const p  = Promise.resolve()
          p.then(job)
        }else {
          job()
        }
      }
    }
  )
  if(options.immediate){
    job()
  }else {
    oldValue = effectFn()
  }
}

watch(obj, async(newValue, oldValue, onInvalidate) => {
  let expired = false // 默认为否
  onInvalidate(()=>{
    expired = true 
  })
  const res = await fetch('/request')
  
  if(!expired){ // 通过闭包，如果这个值被改变为 true，说明已经过期，有新的请求了，数据就不要了
    finalData = res
  }
})
```

在每次执行回调函数前，判断是否有之前请求的过期回调，有过期回调就调用把上一次的闭包 expired 置为 true，这样就不会保存过期数据

# 五、非原始值的响应式方案

## Proxy 是什么

Proxy 可以创建一个代理对象，能够实现对**其他对象**的代理，不能代理**非对象**

代理：拦截并重新定义一个对象的**基本操作**

基本操作：读取、设置等

复合操作（非基本操作）：上述基本操作组合起来，比如函数调用（读取get、调用apply）

## Reflect 是什么

Reflect 是一个内置的对象，它提供拦截 JavaScript 操作的方法，非构造函数不能被 new

```javascript
const obj = {foo:1}
const p = new Proxy(obj, {
  get(target,key){
    track(target,key)
    return target[key] // 1
  },
  set(target,key,newVal){
    target[key] = newVal // 2
    trigger(target,key) 
  }
})
```

上述代码是我们上节使用的追踪和触发代码，使用了最常见的对象读取设置方式

这样的代码有个问题，在下面的场景时，this 指向会错误

```js
const obj = {
foo:1,
get bar(){
  return this.foo
}
}
effect(()=>{
console.log(p.bar)
})
p.foo ++
```

此时副作用函数不会执行，因为 this 指向的是原始对象 obj，而不是使用了代理的 p。

改成下面的方案：

```js
const p = new Proxy(obj, {
  get(target,key){
    track(target,key)
    return Reflect(target,key,receiver) // 1
  }
  // 省略
})
```

receiver 表示的是我们调用这个 get 函数时候的 this。也就是在 effect 里触发追踪时，可以传入正确的 this: p，这样就可以正常触发 track 建立联系了。

## JS 对象和 Proxy 工作原理

### JS 对象

一共有两种对象：常规对象、异质对象

**内部方法**：当我们对一个对象操作时，引擎内部使用的方法，规范中用 [[fn]] 来表示。一个对象有11种必须的内部方法，还有两个额外的必要内部方法，[[Call]] 函数调用触发，[[Construct]] 构造函数调用触发

JS 中对象的实际语义是由对象的内部方法指定的，如何判断是函数还是对象？函数有独有的 [[Call]] 内部方法

内部方法有多态性：比如普通对象和 Proxy 对象都有 [[Get]] 方法，但是内部逻辑是不同的

**什么是异质对象**：

对于11种内部方法：不符合ECMA规范10.1.x给出的定义实现的

对于额外的两种内部方法：不符合ECMA规范10.2.1和10.2.2给出的定义实现的

举例 Proxy 的 [[Get]] 不符合定义，所以是异质对象

### Proxy 工作原理

每一个内部方法都有一个处理器函数一一对应，比如 get 和 [[Get]]

代理透明性质：如果我们没有指定处理器函数，那么就会使用普通对象的内部方法

> 注意：在我们的处理器函数中，要使用 Reflect.fn 才能操作代理对象，否则是操作原始对象

## 代理对象 Object

### 一个普通对象拥有的读取操作

1. 访问属性：obj.foo
2. 判断对象或原型上是否有 key：key in obj
3. for in 循环遍历对象

### 如何拦截？

1）对于第一点很简单，使用 Proxy 的 get 函数即可

2）对于 in 操作符

查阅规范可知运算结果是通过 HasProperty 的抽象方法得到的 ，而抽象方法又是通过对象的内部方法 [[HasProperty]] 得到的，而 Reflect 中就有一个 has 方法提供了这个内部方法的拦截能力

```js
const obj = {foo:1}
const p = new Proxy(obj,{
has(target,key){
  track(target,key)
  return Reflect.has(target,key)
}
})
```

3）对于 for in 循环

查阅规范可知，使用 Reflect.ownKeys(obj) 来获取只属于对象自身的键

```javascript
const obj = {foo:1}
const ITERATE_KEY = Symbol()

const p = new Proxy(obj,{
ownKeys(target){  // 不相 get/set 能拿到 key
  track(target,ITERATE_KEY)
  return Reflect.ownKeys(target)
}
})
```

但是这个方法不能跟踪到具体的属性，所以我们构造了独一的键，在触发的时候我们也需要拿出对应的副作用函数

触发 trigger 函数

```js
const p = new Proxy(obj,{
set(target,key,newVal){
  // 设置属性值
  const res = Reflect.set(target,key,newVal,receiver)
  trigger(target,key)
  return res
}
// 其他拦截函数省略
})
```

```js
function trigger(target,key){
const depsMap=  bucket.get(target)
if(!depsMap) return
// 普通key的副作用函数 
const effects = depsMap.get(key)
// 获得构造的key有联系的副作用函数
const iterateEffects = depsMap.get(ITERATE_KEY)

const effectsToRun = new Set()

// 普通key相关的副作用函数添加到执行队列
effects && effects.forEach(effectFn =>{
    if(effectFn !== activeEffect){
      effectsToRun.add(effectFn)
    }
})

// 与构造的唯一key相关的副作用函数也添加到执行队列
iterateEffects && iterateEffects.forEach(effectFn =>{
    if(effectFn !== activeEffect){
      effectsToRun.add(effectFn)
    }
})

// 执行副作用函数，有调度器就传进去让用户控制执行
effectsToRun.forEach(effectFn =>{
  if(effectFn.options.scheduler){
    effectFn.options.scheduler(effectFn)
  }else {
    effectFn()
  }
})

}
```

上述方案也有问题，就是只能跟踪新增的属性，但是如果修改之前已经有的

比如 `p.foo=2` 不会对 for..in 产生影响，这种情况是不需要触发的，所以我们要在 set 时能够区分类型

```js
// 代理函数
const p = new Proxy(obj,{
set(target,key,newVal){
  // 如果属性不存在则是 add 
  const type = Object.prototype.hasOwnProperty.call(target,key) ? 'SET' : 'ADD'
  const res = Reflect.set(target,key,newVal,receiver)
  trigger(target,key,type) // 类型传给trigger
  return res
}
// 其他拦截函数省略
})
```

```js
// trigger函数
function trigger(target,key){
//...
if(type === 'ADD'){
   const iterateEffects = depsMap.get(ITERATE_KEY)
   iterateEffects && iterateEffects.forEach(effectFn =>{
    if(effectFn !== activeEffect){
      effectsToRun.add(effectFn)
    }
   })
}
// ...
}
```

除了新增、修改，当然还有删除会影响到 for...in。通过阅读规范可知拦截 deleteProperty

```js
// 代理函数
const p = new Proxy(obj,{
deleteProperty(target,key){
  const hadKey= Object.prototype.hasOwnProperty.call(target,key)
  const res = Reflect.deleteProperty(target,key)
  // 只有当被删除属性是自己的，且成功删除时才触发更新
  if(res && hadKey){
      trigger(target,key,'DELETE') 
  }
  return res
}
// 其他拦截函数省略
})
```

```js
// trigger函数
function trigger(target,key){
//...
if(type === 'ADD' || type === 'DELETE){ // 新增'DELETE'类型
   const iterateEffects = depsMap.get(ITERATE_KEY)
   iterateEffects && iterateEffects.forEach(effectFn =>{
    if(effectFn !== activeEffect){
      effectsToRun.add(effectFn)
    }
   })
}
// ...
}
```

## 合理地触发响应

### 1）值没有变化无需响应

```javascript
// 代理函数
const p = new Proxy(obj,{
set(target,key,newVal,receiver){
  // 先获取旧值
  const oldVal = target[key]
  
  const type = Object.prototype.hasOwnProperty.call(target,key) ? 'SET' : 'ADD't
  const res = Reflect.set(target,key,newVal,receiver)
  // 比较新值与旧值，只有不全等，并且不是 NaN 的时候才触发响应
  if(oldVal !== newVal && (oldVal === oldVal || newVal === newVal))
  trigger(target,key,type)
  return res
}
// 其他拦截函数省略
})
```

### 2）原型上继承的属性不应重复响应

举个栗子：

```javascript
function reactive(obj){
   return new Proxy(obj,{
     // 省略拦截函数
   })
}

const obj = {}
const proto = {bar:1}
const child = reactive(obj)
const parent = reactive(proto)
Object.setPrototypeOf(child,parent)
effect(()=>{
  console.log(child.bar); // 值是1
})
child.bar = 2 //2 但是会触发两次副作用函数
```

由于 child 没有 bar 这个属性，所以会到原型上找，于是触发 parent 的 get 拦截，建立响应式联系。然后在我们给 child.bar 赋值时，如果 child 没有，会调用原型上 parent 的 [[Set]] 方法。而前面说了副作用函数会被 child.bar 收集，也会被 parent 收集，所以触发两次。

解决方案：利用参数中 target 会变化，但是 receiver 永远是当前代理对象的特点，当他们统一的时候，说明没有利用原型链

```js
// reactive函数
function reactive(obj){
  return new Proxy(obj,{
    get(target,key,receiver){
      // 代理对象可以通过 raw 属性获取原始数据
      if(key === 'raw'){
        return target
      }
      track(target,key)
      return Reflect.get(target,key,receiver)
    }


    // 省略拦截函数
  })
}
```

```js
// 代理对象
const p = new Proxy(obj,{
  set(target,key,newVal,receiver){

    const oldVal = target[key]
    const type = Object.prototype.hasOwnProperty.call(target,key) ? 'SET' : 'ADD't
    const res = Reflect.set(target,key,newVal,receiver)
    
    // target === receiver.raw 说明 receiver 就是target 的代理对象
    if(target === receiver.raw){
      if(oldVal !== newVal && (oldVal === oldVal || newVal === newVal)){
        trigger(target,key,type)
      }
    }
    return res
  }
// 其他拦截函数省略
})
```

## 浅响应和深响应

这节介绍 reactive 和 shallowReactive 的区别

我们当前实现的响应只能响应第一层数据，`obj.a.b` 是无法响应的，因为读取时 `obj.a` 是一个普通对象，所以我们需要包装一下。

这里添加了一个 isShallow 参数来控制浅响应，如果选了深响应，就递归的进行包装

```javascript
// createReactive函数
function createReactive(obj, isShallow = false){
  return new Proxy(obj,{
    get(target,key,receiver){
      if(key === 'raw'){
        return target
      }

      const res = Reflect.get(target,key,receiver)
      // 浅响应直接返回原始结果
      if(isShallow){
        return res
      }
      // 深响应进行追踪并递归可能的对象
      track(target,key)
      
      if(typeof res === 'object' && res !== null){
        return reactive(res) // 是对象的话包装
      }
      return res
    }
    
    // -----------省略拦截函数
  })
}
function reactive(obj){
  return createReactive(obj)
}
function shallowReactive(obj){
  return createReactive(obj,true)
}
```

## 只读和浅只读

我们希望用户尝试修改只读数据时，会出现警告

新增第三个参数，对删除和设置的拦截进行修改：

```js
// createReactive
function createReactive(obj, isShallow = false,isReadonly = false){
  return new Proxy(obj,{
    set(target,key,newVal,receiver){
      if(isReadonly){ // 新增
        console.warn(`属性${key}是只读的`)
        return true
      }
      // 省略。。。。。
    },
    deleteProperty(target,key){
      if(isReadonly){ // 新增
        console.warn(`属性${key}是只读的`)
        return true
      }
      // 省略。。。。。
    }
    
    // -----------省略拦截函数
  })
}
```

因为是只读属性，所以我们不需要对字段进行追踪，节省性能

```js
// createReactive
function createReactive(obj, isShallow = false,isReadonly = false){
  return new Proxy(obj,{
    get(target,key,receiver){
      // 非只读的时候才需要建立联系
      if(!isReadonly){
        track(target,key)
      }
      // ...省略其他，跟上面一样
    },
  })
}
```

浅只读、深只读 包装函数：

```js
// 包装函数
function readonly(obj){
  return createReactive(obj,false,true)
}
function shallowReadonly(obj){
  return createReactive(obj,true,true)
}
// createReactive
function createReactive(obj, isShallow = false,isReadonly = false){
  return new Proxy(obj,{
    get(target,key,receiver){
      if(!isReadonly){
        track(target,key)
      }

      if(typeof res === 'object' && res !== null){
        return isReadonly ? readonly(res) : reactive(res)  // 能到这一步的一定是深只读或者深响应
      }
      return res
    }
  })
}
```

## 代理数组

数组是一个异质对象，[[DefineOwnProperty]] 内部方法与常规方法不同，其他的相同

数组的读取操作：

> 索引：arr[0]
>
> 访问长度：arr.length
>
> 数组作为对象遍历 for in
>
> for of 遍历数组
>
> 数组原型方法

数组的设置操作：

> 索引修改
>
> 修改数组长度
>
> 栈方法：push、pop等
>
> 原型方法：splice fill sort

上述操作需要我们进行代理的时候做一些特殊判断

### 索引和数组长度

1、我们在副作用函数中访问length，然后通过索引赋值导致数组长度变化，需要重新执行副作用函数

2、我们修改length，那么此时 index>=length 的元素需要触发响应

下面代码实现了这两点

```js
// createReactive
function createReactive(obj, isShallow = false,isReadonly = false){
  return new Proxy(obj,{
    set(target,key,newVal,receiver){

      const oldVal = target[key]
      // 判断是添加还是设置操作
      const type = Array.isArray(target) ? Number(key) < target.length ? 'SET' : 'ADD' : Object.prototype.hasOwnProperty.call(target,key) ? 'SET' : 'ADD'
        
      const res = Reflect.set(target,key,newVal, receiver)
        
      if(target === receiver.raw){
        if(oldVal !== newVal && (oldVal === oldVal || newVal === newVal)){
          trigger(target,key,type,newVal) // 这里要传 newVal，以便跟 length 对比
        }
      }

      return res
    }
  })
}

// trigger
function trigger(target,key,type,newVal){
  const depsMap=  bucket.get(target)
  if(!depsMap) return
  // 省略其他

  // 当操作类型为 add 且是目标时数组时，取出length属性相关联的副作用函数
  if(type === 'ADD' && Array.isArray(target)){
    const lengthEffects = depsMap.get('length')
    lengthEffects && lengthEffects.forEach(effectFn => {
      if(effectFn !== activeEffect){
        effectsToRun.add(effectFn)
      }
    })
  }

  // 如果是数组且操作 length
  if(Array.isArray(target) && key === 'length'){
    // 索引大于等于新的length的元素
    // 需要把所有相关联的副作用函数取出添加到队列中等待执行
    depsMap.forEach((effects, key)=>{
      if(key >= newVal){
        effects.forEach(effectFn =>{
          if(effectFn !== activeEffect){
            effectsToRun.add(effectFn)
          }
        })
      }
    })
  }
```

### 遍历数组

添加新元素、修改 length 会影响 for...in 结果，本质上都是修改了 length

```js
// createReactive
function createReactive(obj, isShallow = false,isReadonly = false){
  return new Proxy(obj,{
    ownKeys(target) {
      // 对数组使用length建立联系
      track(target, Array.isArray(target) ? 'length' : ITERATE_KEY )
      return Reflect.ownKeys(target)
    }
  })
}
```



