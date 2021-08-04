HTML & 浏览器

1、行内元素、块级元素

**区别**

块级元素：

① 总是在新行上开始，占据一整行；

② 高度，行高以及外边距和内边距都可控制；

③ 不加控制的话宽度会撑满浏览器，与内容无关； 

④ 它可以容纳内联元素和其他块元素。

行内元素：

① 和其他元素都在一行上； 

② 行高及外边距和内边距部分可改变（水平方向有效，竖直方向无效）。 如果是可替换元素，比如 input ，竖直方向是有效的

③ 宽度只与内容有关； 

④ 行内元素只能容纳文本或者其他行内元素。

2、跨标签页通信

同源页面间的通信

BroadCast Channel

const page = new BroadcastChannel('channel');
page.onmessage = function (e) {
    const data = e.data;
    const text = '[receive] ' + data.msg + ' —— tab ' + data.from;
    console.log('[BroadcastChannel] receive message:', text);
};
page.postMessage(mydata);

Service Worker

本身不具备通信属性，但是可以作为后台长期运行的 worker，建立通信站

/* 页面中注册 */
navigator.serviceWorker.register('../service.js').then(function () {
    console.log('Service Worker 注册成功');
});
/* 页面中监听 */
navigator.serviceWorker.addEventListener('message', function (e) {
    const data = e.data;
});
/* 页面中发送消息 */
navigator.serviceWorker.controller.postMessage(mydata);

// service worder 代码，监听 message 事件，通过 self.clients.matchAll 获取所有注册页面，
// 然后循环将消息通过 postMessage 发送给所有页面
self.addEventListener('message', function (e) {
    console.log('service worker receive message', e.data);
    e.waitUntil(
        self.clients.matchAll().then(function (clients) {
            if (!clients || clients.length === 0) {
                return;
            }
            clients.forEach(function (client) {
                client.postMessage(e.data);
            });
        })
    );
});

LocalStorage

特性：当 LocalStorage 变化时，会触发 storage 事件

// 根据传入的 key 区分值
window.addEventListener('storage', function (e) {
    if (e.key === 'yangyi') {
        const data = JSON.parse(e.newValue);
    }
});
// 传输消息的页面，正常 setItem，加上时间戳（因为 storage 事件只在值真的改变时触发）
mydata.st = +(new Date);
window.localStorage.setItem('ctc-msg', JSON.stringify(mydata));

上面三个属于订阅发布模式，下面两个是共享存储+轮询

Shared Worker

普通的 Worker 之间独立运行、数据互不相通；而多个 Tab 注册的 Shared Worker 可以实现数据共享

缺点：无法主动通知所有页面，必须轮询

// 页面中注册，第二个参数是 Shared Worker 名称，也可以留空
const sharedWorker = new SharedWorker('../worker.js', 'worker-name');

/* Shared Worker 思路  */
1、监听 connect 事件
2、只能根据传入的数据中的字段，区分是否是获取数据还是发送数据，只有 postMessage 方法
3、每个页面需要轮询请求数据：sharedWorker.port.postMessage({get: true});

IndexDB

轮询查询指定的数据是否被更新，不是很友好

window.open

window.open 会返回打开的页面的 window 对象引用，然后通过window.opener.postMessage(mydata) 发送消息

缺点：必须通过 window.open，并且只能一个传一个

非同源页面之间的通信

![](https://content.markdowner.net/pub/kDAGdj-drnp7dA)

如上图，每个业务页面都有一个 iframe，所有 iframe 的 url 是相同的（也可以不同，同源就行），iframe 之间使用上面的同源页面的通信方式

此外还有基于服务端的：Websocket、SSE（服务端推送事件）

他俩区别：

WebSocket 很复杂, SSE 简洁轻量

WebSocket 是二进制协议，SSE 是文本协议（一般是 utf-8 编码），用 SSE 传输二进制数据时数据会变大，所以如果传输二进制数据还是 WS 厉害。

WebSocket 最大的优势在于它是双向交流的，SSE 是单向的。如果需要1次/秒以上的频率，那么选 WS

3、hash 和 history 路由模式

路由需要实现的功能

浏览器地址变化，切换页面

点击【后退】、【前进】按钮，内容可以跟随变化

刷新浏览器，也可以显示当前路由对应内容

hash 模式

原理：使用 window.location.hash 属性及窗口的 onhashchange 事件

hash 为 #号后面跟着的字符，也叫散列值。

散列值的改变不会触发浏览器请求服务器，从而导致页面重载

触发 hashchange 事件的几种情况

散列值的变化（浏览器的前进、后退，JS 修改）

URL 直接输入带哈希的链接，请求完毕之后会触发

URL 只改变哈希的值按回车

a 标签的 href 属性设置

history模式

**原理**

window.history 指向 History 对象，它表示当前窗口的浏览历史。当发生改变时，只会改变页面的路径，不会刷新页面。

浏览器工具栏的“前进”和“后退”按钮，其实就是对 History 对象进行操作

**属性**

`History.length`：当前窗口访问过的网址数量（包括当前网页）

`History.state`：History 堆栈最上层的状态值(默认为 undefined)

**方法**

History.back()：移动到上一个网址，等同于浏览器的后退键。对于第一个访问的网址，该方法无效果。

History.forward()：移动到下一个网址，等同于浏览器的前进键。对于最后一个访问的网址，该方法无效果。

History.go()：接受一个整数作为参数，以当前网址为基准，移动到参数指定的网址。如果参数超过实际存在的网址范围，该方法无效果；如果不指定参数，默认参数为0，相当于刷新当前页面。

History.pushState：在历史中添加一条记录, 不会触发页面刷新,，三个参数: `object`、`title`、`url`，分别为传递给新页面的对象、标题、新的网址（必须同域，防止恶意代码让用户以为还在同站）

注意：URL 参数设置了一个新的锚点值（即 hash），并不会触发 hashchange 事件。

History.replaceState：修改当前历史记录，参数同上

**事件  popstate**

仅仅调用 pushState() 方法或 replaceState() 方法 ，并不会触发该事件;

只有用户点击浏览器倒退按钮和前进按钮，或者使用 JavaScript 调用 History.back()、History.forward()、History.go() 方法时才会触发。

该事件只针对同一个文档，如果浏览历史的切换，导致加载不同的文档，该事件也不会触发。

页面第一次加载的时候，浏览器不会触发 popstate 事件。

回调函数的参数中的 state === 

**缺点**

改变页面地址后，强制刷新浏览器时会404，因为会触发请求，而服务器中没有这个页面，所以一般单页应用会全部重定向到 index.html 中

4、DOM 树

什么是 DOM

HTML 文件字节流无法直接被渲染引擎理解，需要转化为对 HTML 文档结构化的表述，也就是 DOM。

作用

页面的视角：DOM 是生成页面的基础数据结构。

JavaScript 脚本视角：DOM 提供给 JS 脚本操作的接口，JS 可以访问 DOM 结构，改变文档的结构、样式和内容。

安全视角：一道防线，一些不安全的内容在 DOM 解析阶段就被拒之门外了。

如何生成

渲染引擎内部，有一个叫 HTML 解析器（HTMLParser）的模块，将 HTML 字节流转换为 DOM 结构

HTML 解析器，是网络进程加载了多少数据，便解析多少数据。过程如下：

网络进程接收到响应头之后，根据响应头中的 content-type 字段来判断文件的类型，从而选择或创建一个渲染进程

渲染进程准备好之后，网络进程和渲染进程之间会建立一个共享数据的管道，网络进程接收到数据后就往这个管道里面放，而渲染进程则从管道的另外一端不断地读取数据，并同时将读取的数据“喂”给 HTML 解析器

喂给数据之后，字节流转换为 DOM 的三个阶段：

分词器做词法分析，将字节流转换为 Token

![](https://content.markdowner.net/pub/P5Nwb4-LDxL7mV)

Token 解析为 DOM 节点 3. 同时将 DOM 节点添加到 DOM 树中

三种情况：

如果入栈的是StartTag Token，HTML 解析器会为该 Token 创建一个 DOM 节点，然后将该节点加入到 DOM 树中，它的父节点就是栈中相邻的那个元素生成的节点。

如果是文本 Token，会生成一个文本节点，然后将该节点加入到 DOM 树中。文本 Token 不需要压入到栈中，它的父节点就是当前栈顶 Token 所对应的 DOM 节点。

如果是 EndTag 标签，HTML 解析器会查看 Token 栈顶的元素是否是 StartTag div，如果是，就将 StartTag div 从栈中弹出，表示该 div 元素解析完成。

简单示例图：

![](https://content.markdowner.net/pub/ww3wmn-VqEvaGk)

JavaScript 是如何影响 DOM 生成的

一、内嵌 js

<html>
<body>
    <div>1</div>
    <script>
    let div1 = document.getElementsByTagName('div')[0]
    div1.innerText = 'time.geekbang'
    </script>
    <div>test</div>
</body>
</html>

遇到 js 时，渲染引擎判断这是一段脚本，HTML 解析器就会暂停 DOM 的解析，因为接下来的 JavaScript 可能要修改当前已经生成的 DOM 结构，执行完毕之后继续解析，流程是一样的。

二、外部引入 js

<html>
<body>
    <div>1</div>
    <script type="text/javascript" src='foo.js'></script>
    <div>test</div>
</body>
</html>

chrome 有一个优化操作，当渲染引擎收到字节流之后，会开启一个预解析线程，用来分析 HTML 文件中包含的 JavaScript、CSS 等相关文件，解析到相关文件之后，预解析线程会提前下载这些文件

解析过程同上是一样的

三、JS 中有操作 css

<head>
    <style src='theme.css'></style>
</head>
<body>
    <div>1</div>
    <script>
            let div1 = document.getElementsByTagName('div')[0]
            div1.innerText = 'time.geekbang' // 需要 DOM
            div1.style.color = 'red'  // 需要 CSSOM
        </script>
    <div>test</div>
</body>
</html>

渲染引擎在遇到 JavaScript 脚本时，不管该脚本是否操纵了 CSSOM，都会执行 CSS 文件下载（因为引擎无法确定是否已下载），解析操作，再执行 JavaScript 脚本。JavaScript 脚本是依赖样式表的，这又多了一个阻塞过程。

总结：JavaScript 会阻塞 DOM 生成，而样式文件又会阻塞 JavaScript 的执行

四、优化操作

CDN 加速

压缩文件的体积

如果 JavaScript 文件中没有操作 DOM 相关代码，就可以将该 JavaScript 脚本设置为异步加载，通过 async 或 defer 来标记代码。

二者都是异步的，但使用 async 标志的脚本文件一旦加载完成，会立即执行；而使用了 defer 标记的脚本文件，需要在 DOMContentLoaded 事件之前执行。

5、事件

EventTarget 接口

addEventListener 的第三个参数默认是 false 冒泡，还可以设置为属性配置对象

capture：布尔值，是否在捕获阶段触发。

once：布尔值，监听函数是否只触发一次，然后自动移除。

passive：布尔值，表示监听函数不会调用事件的preventDefault方法。如果监听函数调用了，浏览器将忽略这个要求，并在监控台输出一行警告。

当添加多个监听时，先添加先触发

removeEventListener 没有返回值

dispatchEvent 手动触发事件，参数为某个 event, 比如 click

事件模型

三种绑定事件方法

标签上直接使用 on-xxxx，这种方式只会在冒泡阶段触发，必须加圆括号执行

元素对象使用 onclick 等事件，window.onload = doSomething，不用加圆括号

addEventListener

事件的传播

第一阶段：从 window 对象传导到目标节点（上层传到底层），称为“捕获阶段”（capture phase）。

第二阶段：在目标节点上触发，称为“目标阶段”（target phase）。

第三阶段：从目标节点传导回 window 对象（从底层传回上层），称为“冒泡阶段”（bubbling phase）。

` stopPropagation` 阻止冒泡和捕获，但不会阻止当前节点的事件触发后面的监听函数

`stopImmediatePropagation` 彻底取消当前事件，后面的监听函数也不会触发

**Event 对象**

当 Event.cancelable 属性为true时，调用 Event.preventDefault() 才可以取消这个事件，阻止浏览器对该事件的默认行为

Event.currentTarget 属性返回事件当前所在的节点

Event.target 属性返回原始触发事件的那个节点

Event.isTrusted 表示该事件是否由真实的用户行为产生

Event.composedPath() 返回一个数组，成员是事件的最底层节点和依次冒泡经过的所有上层节点。

键盘事件

mousemove：当鼠标在一个节点内部移动时触发。鼠标持续移动会连续触发。为了避免性能问题，应该做节流。

节流：每隔一段时间，只执行一次函数

防抖：在事件被触发 n 秒后再执行回调，如果在这 n 秒内又被触发，则重新计时

mouseenter：鼠标进入一个节点时触发，进入**子节点不会触发**这个事件

mouseleave：鼠标离开一个节点时触发，离开**父节点不会触发**这个事件

mouseover：鼠标进入一个节点时触发，进入子节点会**再一次触发**这个事件

mouseout：鼠标离开一个节点时触发，离开**父节点也会触发**这个事件

wheel：滚动鼠标的滚轮时触发

触发顺序：mousedown、mouseup、click、dblclick

几个计算距离的属性：clientX/Y（浏览器可视）、pageX/Y（相对文档区域左上角距离，会随着页面滚动而改变）、offsetX/Y（当前DOM）、screenX/Y（显示器）

![](https://content.markdowner.net/pub/j2xAGX-Lan0DVV)

6、缓存机制

HTTP 报文

**HTTP请求报文格式**

请求行

HTTP头(通用信息头，请求头，实体头) 

请求报文主体(只有POST才有报文主体)

![](https://content.markdowner.net/pub/eodbon-BdPaD7D)

HTTP报文格式为：

状态行

HTTP头(通用信息头，响应头，实体头) 

响应报文主体

![](https://content.markdowner.net/pub/L5NrOV-a8ozXbX)

缓存过程

浏览器每次发起请求，先在浏览器缓存中查找请求的结果以及缓存标识

浏览器每次拿到返回的请求结果，都会将该结果和缓存标识存入浏览器缓存中

浏览器是否需要向服务器重新发送 HTTP 请求，取决于 我们选择的缓存策略

强制缓存

**三种情况**：

不存在该缓存结果和缓存标识，强制缓存失效，则直接向服务器发起请求

存在该缓存结果和缓存标识，但该结果已失效，强制缓存失效，则使用**协商缓存**

存在该缓存结果和缓存标识，且该结果尚未失效，强制缓存生效，直接返回该结果

**Expires**

HTTP/1.0 的字段，值是服务器返回的过期时间。

缺点：时区不同的话，客户端和服务端有一方的时间不准确发生误差，那么强制缓存则会直接失效

Cache-Control

HTTP/1.1 的字段

public：所有内容都将被缓存（客户端和代理服务器都可缓存）

private：所有内容只有客户端可以缓存，Cache-Control 的默认取值

no-cache：客户端缓存内容，但是是否使用缓存则需要经过协商缓存来验证决定

no-store：所有内容都不会被缓存，即不使用强制缓存，也不使用协商缓存

max-age=xxx (xxx is numeric)：缓存内容将在 xxx 秒后失效

注意：

刷新：浏览器会在 js 和图片等文件解析执行后直接存入内存缓存中，刷新页面从内存缓存中读取(from memory cache)；而css文件则会存入硬盘文件中，每次渲染页面都需要从硬盘读取缓存(from disk cache)。

关闭再打开：之前的进程内存已清空，所以都是硬盘缓存

协商缓存

缓存结果失效后，根据缓存标识发送 HTTP 请求，服务器进行判断

标识

Last-Modified / If-Modified-Since

前者：响应头中，表示文件在服务器最后被修改的时间

后者：请求头，值同上，告诉服务器进行判断，文件是否改变，没变则使用缓存，变了就返回最新的

Etag / If-None-Match

前者：响应头中，表示文件在服务器中唯一标识

后者：请求头，值同上，告诉服务器进行判断，文件是否改变，没变则使用缓存，变了就返回最新的

注：Etag / If-None-Match 优先级高于 Last-Modified / If-Modified-Since，同时存在则只有Etag / If-None-Match生效。

**总结**

强制缓存优先于协商缓存进行，若强制缓存( Expires 和 Cache-Control )生效则直接使用缓存，若不生效则进行协商缓存(Last-Modified / If-Modified-Since 和 Etag / If-None-Match)

协商缓存由服务器决定是否使用缓存，若协商缓存失效，重新获取请求结果，再存入浏览器缓存中；生效则返回304，继续使用缓存

优先内存，再硬盘

7、Chrome 浏览器架构

进程、线程、协程

一个进程是应用正在运行的程序，操作系统会为进程分配私有的内存空间以供使用。

协程是运行在线程中更小的单位，async/await 就是基于协程实现的。

进程间通信（IPC）

一个进程可以让操作系统开启另一个进程处理不同的任务。进程之间要交换数据必须通过内核，在内核中开辟一块缓冲区，进程1把数据从用户空间拷到内核缓冲区，进程2再从内核缓冲区把数据读走，这就是IPC(Inter Process Communication)。

![](https://content.markdowner.net/pub/kD7p5X-dMb6vY0)

**套接字(socket)**

凭借这种机制，客户/服务器（即要进行通信的进程）系统的开发工作既可以在本地单机上进行，也可以跨网络进行

套接字的特性由3个属性确定，它们分别是：域、端口号、协议类型。

三种套接字：原始套接字可以读写内核没有处理的IP数据包，而流套接字只能读取 TCP 协议的数据，数据报套接字只能读取 UDP 协议的数据。

管道/匿名管道(pipe)

管道是半双工的，数据只能向一个方向流动；需要双方通信时，需要建立起两个管道。

只能用于父子进程或者兄弟进程之间(具有亲缘关系的进程);

单独构成一种独立的文件系统：管道对于管道两端的进程而言，就是一个文件，但它不是普通的文件，它不属于某种文件系统，而是自立门户，单独构成一种文件系统，并且只存在与内存中。

数据的读出和写入：一个进程向管道中写的内容被管道另一端的进程读出。写入的内容每次都添加在管道缓冲区的末尾，并且每次都是从缓冲区的头部读出数据（队列）。

**有名管道(FIFO)**

相比上面可以非亲缘关系

浏览器架构

一、多进程架构（每个页面都是单独的）

浏览器进程（Browser process）

管理 Chrome 应用本身，包括地址栏、书签、前进和后退按钮。同时也负责网络请求、文件访问等，也负责其他进程的调度。

渲染进程（Renderer process）

渲染进程负责站点的渲染，其中也包括 JavaScript 代码的运行，web worker 的管理等。

插件进程（Plugin process）

GPU 进程（GPU process）

GPU 进程负责提供成像的功能

**好处**

一个页面没有相应不会阻塞其他页面

借助操作系统对进程安全的控制，浏览器可以将页面放置在沙箱中，核心进程代码可以运行在隔离的环境中，保证安全。

**缺点**

相同功能无法共用，会浪费内存，比如 V8 引擎

Chrome 限制了最大进程数，为了节省内存，最大进程数取决于硬件的能力。**当使用多个页签访问相同的站点时，浏览器不会创建新的渲染进程**

二、面向服务的架构

当 Chrome 运行在拥有强大硬件的计算机上时，会将一个服务以多个进程的方式实现，提高稳定性

当计算机硬件资源紧张时，则可以将多个服务放在一个进程中节省资源。

三、iframe

出于安全考虑，从 Chrome 67 开始每个 iframe 打开的站点由独立的渲染进程处理被默认启用。

浏览器进程

包括几个线程

UI 线程负责绘制工具栏中的按钮、地址栏等。

网络线程负责从网络中获取数据。

存储线程负责文件等功能。

一次页面访问

一、输入处理

UI 线程会先判断我们输入的内容是要搜索的内容还是要访问一个站点，因为地址栏同时也是一个搜索框。

二、访问开始

按下回车访问，UI 线程将借助网络线程访问站点资源，网络线程根据适当的网络协议，例如 DNS lookup 和 TLS 为这次请求建立连接

三、处理响应数据

根据 Content-Type ，如果是 HTML ，网络线程会将数据传递给渲染进程做进一步的渲染工作。

如果数据类型是 zip 文件或者其他文件格式时，会将数据传递给下载管理器做进一步的文件预览或者下载工作

在开始渲染之前，网络线程要先检查数据的安全性。如果返回的数据来自一些恶意的站点，网络线程会显示警告的页面。同时，Cross Origin Read Blocking(CORB) 策略也会确保跨域的敏感数据不会被传递给渲染进程。

四、渲染过程

在第二步，UI 线程将请求地址传递给网络线程时，UI 线程就已经知道了要访问的站点。此时 UI 线程就同时查找或启动一个渲染进程。如果网络线程按照预期获取到数据，则渲染进程就已经可以开始渲染了，减少了等待时间。

当然，如果出现重定向的请求时，提前初始化的渲染进程可能就不会被使用，但相比正常访问站点的场景，重定向往往是少数。

五、提交访问

当数据和渲染进程后，浏览器进程通过 IPC 向渲染进程提交这次访问，同时也会保证渲染进程可以通过网络线程继续获取数据。渲染进程在所有 onload 事件都被触发后向浏览器进程发送完毕的消息，访问结束，文档渲染开始。

这时可能还有异步的 js 在加载资源

为了能恢复访问历史信息，当页签或窗口被关闭时，访问历史的信息会被存储在硬盘中。

访问不同的站点

当访问其他页面时，一个独立的渲染进程将被用于处理这个请求，为了支持像unload的事件触发，老的渲染进程需要保持住当前的状态，知道用户做出选择。

Service worker

开发者可以决定用本地存储的数据还是网络访问。当访问开始时，网络线程会根据域名检查是否有 Service worker 会处理当前地址的请求，如果有，则 UI 线程会找到对应的渲染进程去执行 Service worker 的代码。

如果 worker 决定使用网络，进程间的通信已经造成了一些延迟，这时候可以使用 Navigation Preload：sw 启动时并行网络请求，加上下面的请求头，服务器进行配合，sw 中进行开启

`await self.registration.navigationPreload.enable();`

请求头：`Service-Worker-Navigation-Preload: true`

渲染进程

渲染进程最重要的工作就是将 HTML、CSS 和 Javascript 代码转换成一个可以与用户产生交互的页面

主线程负责解析，编译或运行代码等工作，如果使用 Worker ，Worker 线程会负责运行一部分代码。合成线程和光栅线程也是运行在渲染进程中的，负责更高效和顺畅的渲染页面。

**解析过程**

DOM 的创建

主线程解析 HTML 文本字符串，并且将其转化成 Document Object Model（DOM），静默处理标签的丢失、未闭合等错误

1.额外资源的加载

当 HTML 主解析器发现了类似 img 或 link 这样的标签时，预加载扫描器（副解析器）就会启动，它会马上找出接下来即将需要获取的资源(比如样式表,脚本,图片等资源)的 URL ，然后发送请求给浏览器进程的网络线程，而不用等到主解析器恢复运行，从而提高了整体的加载时间

2.JavaScript 会阻塞转化过程

![](https://content.markdowner.net/pub/O595X8-z9DzeAy)

解析执行还是要等主线程空闲，并且只能读到 HTML 中的资源，当 HTML 分析器发现<script>标签时，会暂停接下来的 HTML 转化工作，也就是阻塞转化工作。如果 js 不需要改变 DOM 的话，可以使用 async 或 defer 属性异步加载

样式计算

主线程遍历 DOM 结构中的元素及其样式，同时创建出带有坐标和元素尺寸信息的布局树（Layout tree），只包含将会在页面中显示的元素

伪元素会出现在布局树中，不会在 DOM 树中

一、渲染过程是昂贵的

布局树改变时，绘制需要重构页面中变化的部分，数据变化会引起后续一系列的的变化

渲染操作运行在主线程中，可能被正在运行的 Javascript 代码所阻塞。可以将 Javascript 操作优化成小块，然后使用 requestAnimationFrame()

使用 setTimeout 或 setInterval 来执行动画之类的视觉变化，这种做法的问题是，回调将在帧中的某个时点运行，可能刚好在末尾，而这可能经常会使我们丢失帧，导致卡顿

二、合成（Compositing）

1）光栅化

浏览器将文档结构、每一个元素的样式，元素的几何信息，绘制的顺序等转化成屏幕上像素的过程

2）层（Layer）: 主线程遍历布局树找到 层 需要生成的部分，可以使用 css 属性 will-change、transform、Z-index 让浏览器创建层

分层优点：减少不必要的重新绘制、实现较为复杂的动画、方便实现复杂的CSS样式

3）栅格线程与合成线程

合成线程将层拆分成许多块，并决定块的优先级，发送给栅格线程。栅格线程光栅化这些块并将它们存储在 GPU 缓存中，合成线程使用 draw quads 收集这些信息并创建合成帧

4）好处

合成的好处在于其独立于主线程，不需要等待样式计算和 Javascript 代码的运行，但如果布局或者绘制需要重新计算则主线程是必须要参与的

总结

浏览器的渲染过程就是将文本转换成图像的过程

渲染进程中的主线程完成计算工作，合成线程和栅格线程完成图像的绘制工作

事件

发生交互时，浏览器进程首先接收到事件，将事件类型和位置信息等发送给负责当前页签的渲染进程，渲染进程找到事件发生的元素并且触发事件监听器。

合成线程对事件的处理

当页面被合成线程合成过，合成线程会标记那些有事件监听的区域。当事件发生在响应的区域时，合成线程就会将事件发送给主线程处理（这里会阻塞 UI 变化，详情见 passive 改善滚屏）。如果在非事件监听区域，则渲染进程直接创建新的帧而不关心主线程。

减少发送给主线程的事件数量

touchmove 这样的事件每秒向主线程发送 120 次可能会造成主线程执行时间过长而影响性能

Chrome 合并了连续的事件，类似 mousewheel，mousemove，touchmove这样的事件会被延迟到下一次 requestAnimationFrame 前触发

类似 keydown, keyup, mouseup 的离散事件会立即被发送给主线程处理。

8、浏览器工作原理

高层结构

**用户界面** - 包括地址栏、前进/后退按钮等。除了浏览器主窗口显示的请求的页面外，其他都属于用户界面。

**浏览器引擎** - 在用户界面和呈现引擎之间传送指令。

**呈现引擎（应该也叫做渲染引擎）**- 负责显示请求的内容。如果返回 HTML，它就负责解析 HTML 和 CSS 内容，显示在屏幕上。

**网络** - 用于网络调用，比如 HTTP 请求。其接口与平台无关，并为所有平台提供底层实现。

**用户界面后端** - 绘制基本的窗口小部件，比如组合框和窗口。使用与平台无关的通用接口，在底层使用操作系统的用户界面方法。

**JavaScript 解释器**。用于解析和执行 JavaScript 代码。

**数据存储**。这是持久层。浏览器需要在硬盘上保存各种数据，例如 Cookie

呈现引擎主流程

解析是什么

定义：将文档转化成为有意义的结构，称作解析树或者语法树

过程：词法分析 和 语法分析 ，迭代过程

1.词法分析器

将输入内容分解成一个个有效标记，将无关的字符（比如空格和换行符）分离出来

2.解析器

根据语言的语法规则分析文档的结构，构建解析树（由 DOM 元素和属性节点构成的树结构）。

解析器向词法分析器请求一个新标记，尝试将其与某条语法规则进行匹配。

如果发现了匹配规则，解析器会将一个对应于该标记的节点添加到解析树中，然后继续请求下一个标记。如果没有规则可以匹配，解析器就会将标记存储到内部，并继续请求标记，直至所有内部存储的标记都有对应匹配的规则。如果找不到，解析器就会引发一个异常。这意味着文档无效，包含语法错误。

HTML 解析

无法用常规的 自上而下 或 自下而上 的解析器进行解析，原因在于：

语言的宽容本质。

浏览器对一些常见的无效 HTML 用法采取包容态度。

解析过程需要不断地反复。源内容在解析过程中通常不会改变，但是在 HTML 中，js 如果包含 document.write，就会添加额外的标记，这样解析过程实际上就更改了输入内容。

所以使用专有的 **标记化算法（状态机）** 和 **树构建算法(状态机）**

标记化算法：

初始状态是数据状态

遇到字符 < 时，状态更改为“标记打开状态”

遇到标签名时，“标记名称状态”

遇到 > 标记时，会发送当前标记给构建器，状态改回“数据状态”

遇到标签中的每一个字符时，会创建发送字符标记，知道遇到下一个 <

树构建算法：根据接收的标记，创建并插入对应的 DOM 元素，改变对应的状态。

“initial mode”、“before html”、“before head” 之类的状态

CSS 解析

预加载扫描器（预解析器）会提前去请求如CSS、JavaScript和web字体。

构建 render 树（也叫呈现树、渲染树）：非可视化的 DOM 元素不会插入呈现树中，处理 html 和 body 标记就会构建呈现树根节点，对应于 CSS 规范中所说的容器 block，也是最上层的 block

浏览器利用规则树来优化构建时的样式计算，保存计算过的匹配路径重复使用

这里没有说 cssom树，其实就是把 css 解析成树的结构

布局

呈现树中的元素（也叫呈现器），并不包含位置和大小信息。计算这些值的过程称为布局或重排。

1.Dirty 位系统：浏览器给每个需要重新布局的元素进行标记

“dirty” 和 “children are dirty”一个表示自身，一个表示至少有一个子代

2.全局布局（同步）和增量布局（异步）

全局布局是指触发了整个呈现树范围的布局，触发原因可能包括：

字体大小更改。

屏幕大小调整。

增量布局：当来自网络的额外元素添加到 DOM 树之后

绘制

系统遍历呈现树，并调用呈现器的“paint”方法，将呈现器布局阶段计算的每个框转换为屏幕上的实际像素

绘制可以将布局树中的元素分解为多个层。将内容提升到GPU上的层（而不是CPU上的主线程）可以提高绘制和重新绘制性能，但会以内存管理为代价

合成

当文档的各个部分以不同的层绘制，相互重叠时，必须进行合成，以确保它们以正确的顺序绘制到屏幕上，并正确显示内容。

呈现引擎的线程

单线程，在 Firefox 和 Safari 中，该线程就是浏览器的主线程。而在 Chrome 浏览器中，该线程是标签进程的主线程

9、内存泄漏

什么是内存

由大量触发器组成，每个触发器包含几个晶体管，能够存储一个位。单个触发器可以通过唯一标识符寻址，我们可以读取和覆盖它们。

内存生命周期

内存分配 -> 内存使用 -> 内存释放

强弱引用的垃圾回收区别

const map = new Map([[obj, 'info']])
obj = null // 重写obj，obj 代表的内存不会被回收
const map = new WeakMap([[obj, 'info']])
obj = null // 重写obj，obj 代表的内存会被回收

内存泄漏的一些场景

意外的全局变量

被遗忘的计时器（vue 组件中的一定要在 beforeDestroy 时清掉）

被遗忘的事件监听器（同上）

被遗忘的订阅发布事件监听器，需要用 off 删掉（同上）

强引用中没有使用 api 释放，只是单纯删除掉变量的引用

let map = new Set();
let value = { test: 22};
map.add(value);

map.delete(value); // 有效
value = null; // 无效

被遗忘的未使用的闭包

脱离 DOM 的引用

let elements = {      

   btn: document.querySelector('#button')

 } 

document.body.removeChild(elements.btn)

// elements .btn = null 加上这一句才不泄露，因为 DOM 占用的那块内存还被对象引用

发现内存泄漏

打开谷歌开发者工具，切换至 Performance 选项，勾选 Memory 选项，点击运行按钮

![](https://content.markdowner.net/pub/34RMXp-ajooBpX) 

上图红框内就是内存变化，如果是一直递增，那基本可以确定存在泄漏

切换至 Memory 选项，点击运行获取网页快照

![](https://content.markdowner.net/pub/Wakn5V-wyweeow)

根据内存占用大小，点击左侧元素，再找到具体的文件与代码位置即可

10、性能

优化性能指标 RAIL

含义：

Response

Animation

Idle

Load

Response: 事件处理最好在 50ms 内完成

事件处理函数在 50ms 内完成，考虑到 idle task 的情况，事件会排队，等待时间大概在50ms。适用于click，toggle，starting animations 等，不适用于 drag 和 scroll 。

复杂的 js 计算尽可能放在后台，如 web worker，避免对用户输入造成阻塞

超过 50ms 的响应，一定要提供反馈，比如倒计时，进度百分比等。

Animation: 在10ms内产生一帧

为了保证浏览器60帧，每一帧的时间在16ms左右，但浏览器需要用 6ms 来渲染每一帧。

Idle: 最大化空闲时间

每一次事件循环结束时的空闲时间，完成一些延后的工作，比如加载剩余不可见页面。 requestIdleCallback API

Load: 传输内容到页面可交互的时间Time to Interactive(TTI)不超过5秒

让你的页面在一个中配的3G网络手机上打开时间不超过5秒

对于第二次打开，尽量不超过2秒

**测试与优化**

F12选用中配的3G网络（400kb/s，400ms RTT）

延后加载阻塞渲染的资源，

可以采用 lazy load，code-splitting 等 其他优化 手段，让第一次加载的资源更少

性能优化手段

从输入URL按下回车开始，每一步可以做的优化如下

一、缓存

本地数据存储

localStorage、sessionStorage、indexedDB，对于一些特殊的、轻量级的业务数据，可以考虑使用本地存储作为缓存（比如每日排行榜列表）

内存缓存（Memory）

浏览器帮我们实现的优化

Cache API

不规定该缓存什么、什么情况下需要缓存，也不必须搭配 Service Worker 。

当然 Service Worker 与 Cache API 还是一个功能非常强大的组合，能够实现堆业务的透明。

Cache API 提供的缓存可以认为是“永久性”的，关闭浏览器或离开页面之后，下次再访问仍然可以使用，每个域可以有多个不同的 Cache 对象。

navigator.storage.estimate().then(function(estimate) {
 console.log(estimate.quota)
      
});

153634836480 约等于 153GB

HTTP 缓存

如果前面的步骤都没没有命中缓存，就会到 HTTP request 的阶段

强缓存：直接读取「disk cache」，不够灵活，服务器更新资源不能及时通知

响应头：`Expires` 和 `Cache-Control`，前者设置过期时间，与本地时间对比，后者设置一个最大时间比如max-age=300，300s内走强缓存

协商缓存

最后修改时间：服务器第一次响应时返回 Last-Modified，而浏览器在后续请求时带上其值作为 If-Modified-Since（精度不够，如果时间很短）

文件标识：服务器第一次响应时返回 ETag，而浏览器在后续请求时带上其值作为 If-None-Match，一般会用文件的 MD5 作为 ETag

Push Cache

最后一个缓存检查

HTTP/2 的 Push 功能所带来的。请求一个资源的同时，服务端可以为你“推送”一些其他资源 --不久的将来会用到的一些资源。比如样式表，避免了浏览器收到响应、解析到相应位置时才会请求所带来的延后

特点：

匹配上时，并不会在额外检查资源是否过期

存活时间很短，甚至短过内存缓存（Chrome 中为 5min 左右）

只会被使用一次

HTTP/2 连接断开将导致缓存直接失效

二、请求

避免多余重定向

DNS 预解析

请求网站流程：

本地 hosts 文件中的映射

本地 DNS 缓存

在 TCP/IP 参数中设置的 DNS 查询服务器，也叫 本地 DNS

如果该服务器无法解析域名（没有缓存），且不需要转发，会向根服务器请求；

根服务器根据域名类型判断对应的顶级域名服务器（.com），返回给本地 DNS，然后重复该过程，直到找到该域名；

如果设置了转发，本地 DNS 会将请求逐级转发，直到转发服务器返回或者也不能解析。

上述服务前端不好切入，但可以通过设置属性，告诉浏览器尽快解析（并不保证，根据网络、负载等做决定）

<link rel="dns-prefetch" href="//yourwebsite.com">

预先建立连接

建立连接不仅需要 DNS 查询，还需要进行 TCP 协议握手，有些还会有 TLS/SSL 协议，这些都会导致连接的耗时

使用预连接时浏览器处理：

首先，解析 Preconnect 的 url

其次，根据当前 link 元素中的属性进行 cors 的设置

然后，默认先将 credential 设为 true，如果 cors 为 Anonymous 并且存在跨域，则将 credential 置为 false

最后，进行连接。

浏览器也不一定完成连接，视情况

<link rel="preconnect" href="//sample.com" crossorigin> 
// 值不写具体的 use-credentials 都相当于设置成 Anonymous

三、服务端响应(了解）

使用流进行响应

如果不使用 websocket ，就只能让页面加载不完，一直给页面加东西，这样就一直在传输数据（不是很好）

业务聚合

使用 BFF 层

比如第二个接口依赖第一个接口，两个接口加起来是 400ms，如果这两个请求放在 BFF 层，因为都在服务器所以离后端‘近’，两个接口只需 40 ms，再通过前端一个请求返回，加起来就是 240 ms

如果一个业务需要在前端并发三、四个请求来获取完整数据

避免代码问题

频繁地 JSON.parse 和 JSON.stringify 大对象

CPU 密集型任务导致事件循环 delay 严重 ......

四、页面解析与处理

浏览器收到请求后，做三件事：

页面 DOM 的解析

静态资源的加载

静态资源的解析与处理

先看解析部分

注意资源在页面文档中的位置

JavaScript 会阻塞 DOM 构建，而 CSSOM 的构建又会阻塞 JavaScript 的执行。

CSS 放到头部，保证了下面的 DOM 构建后，CSSOM 构建完毕。JS 放到尾部就不会被阻塞

使用 defer 和 async

如果 JS 中不影响 DOM 的话。

区别：defer 会在 HTML 解析完成后，按照脚本出现的次序再顺序执行（只是提前加载）

       async 下载完成就立即开始执行，同时阻塞页面解析，不保证脚本间的执行顺序

![](https://content.markdowner.net/pub/Bqkk91-zybBy2k)

页面文档压缩

一般 webpack 就会帮打包，同时后端 gzip 也是开启的

 DOMContentLoaded 事件何时触发

Document 正在加载时返回 "loading"

当它完成解析但仍在加载子资源时返回 "interactive"

当它加载完毕后返回 "complete "

当值发生变化时，Document 对象上的 readystatechange 事件会被触发

DOMContentLoaded 事件在所有的子资源加载完发生，在第二步之后，第三步之前

五、页面静态资源

总体原则

减少不必要的请求

TCP/IP 的拥塞控制也使其传输有慢启动（slow start）的特点，速度会慢慢变快。因此，发送过多的“小”请求可能也不是一个很好的做法

减少包体大小

降低应用资源时的消耗

一段 CPU 密集的计算，或者进行频繁的 DOM 操作

利用缓存

JavaScript

1.减少不必要的请求

1）代码拆分（code split）与按需加载

document.getElementById('btn').addEventListener('click', e => {
    // 在这里加载 chat 组件相关资源 chat.js
    const script = document.createElement('script');
    script.src = '/static/js/chat.js';
    document.getElementsByTagName('head')[0].appendChild(script);
});

比如点击之后再加载

webpack 通过 dynamic import 去做代码拆分

2）代码合并

利用打包工具，减少请求

2.减少包体大小

1）代码压缩

UglifyJS、gzip

2）Tree Shaking

与传统 DCE（dead code elimination）不太一样，传统 DCE ：不可能执行的代码

代码不会被执行，不可到达

代码执行的结果不会被用到

代码只会影响死变量（只写不读）

uglify 做 JS 的 DCE 时，更关注没有用到的代码，而这个功能依赖于 ES6 module 的静态规范，所有依赖可以在编译期确定

ES6模块 和 CommonJS 区别

CommonJS：引入基础数据类型时，属于复制该变量。引入复杂数据类型时，浅拷贝该对象。 模块默认 export 的是一个对象，即使导出的是基础数据类型

ES6：不管是基础（复杂）数据类型，都只是对该变量的动态只读引用。只读表示不能修改变量值，复杂数据类型可以添加属性方法，不允许更改内存空间

3）优化 polyfill 的使用

使用  browserslist 告诉其他插件，项目支持的浏览器兼容范围

4）webpack

npm install --save-dev webpack-bundle-analyzer

查看包的体积大小

3.解析与执行

1）解析耗时

通过删除不必要的代码也有利于解析

2） 避免 Long Task

一般认为每个任务超过50ms执行就是长任务，阻塞主线程。

解决：web worker 或者 时间分片

3）是否真的需要框架

一些落地页、静态页没必要使用框架

**4.缓存**

1）发布与部署：非覆盖式发布----文件名中包含文件内容的 Hash，内容修改后，文件名就会变化；同时，设置不对页面进行强缓存，这样静态资源由于 uri 变了，肯定不会走缓存，而没有变动的资源则仍然可以使用缓存

2）将基础库、公共库代码单独打包

基础库被单独打包，即使业务代码经常变动，也不会导致整个缓存失效

webpack v4.x中使用 `optimization.splitChunks

3）减少 webpack 编译不当带来的缓存失效

使用 Hash 来替代自增 ID

每个模块 webpack 都会分配一个唯一的模块 ID，一般情况下 webpack 会使用自增 ID

由于增/删了新的其他模块，导致后续所有的模块 ID 都变更了，文件 MD5 也就变化了

webpack 的入口文件除了包含它的 runtime、业务模块代码，同时还有一个用于异步加载的小型 manifest，任何一个模块的变化，最后必然会传导到入口文件

将 runtime chunk 单独拆分出来

通过 `optimization.runtimeChunk`  把包含 manifest 的 runtime 部分单独分离出来

使用 records

通过 recordsPath 配置让 webpack 产出一个包含模块信息记录的 JSON 文件，其中包含了一些模块标识的信息，可以用于之后的编译。尽量避免破坏缓存

// webpack.config.js
module.exports = {
  //...
  recordsPath: path.join(__dirname, 'records.json')
};

CSS

1.关键 CSS

将关键 CSS 的内容通过 <style> 标签内联到 <head> 中，然后异步加载其他非关键 CSS

骨架屏是这种思路的一个延展，先返回不包含实际功能的静态页面

2.优化资源请求

1）按需加载

2）合并文件

3）请求的优先级排序

浏览器中的各类请求是有优先级排序的

link 标签上其实有一个 media 属性来处理媒体查询下的加载优先级

<link rel="stylesheet" href="navigator.css" media="all" />
<link rel="stylesheet" href="list.css" media="all" />
<link rel="stylesheet" href="navigator.small.css" media="(max-width: 500px)" />
<link rel="stylesheet" href="list.small.css" media="(max-width: 500px)" />

页面大于 500 px 时，优先级会降低，它们也不再会阻塞页面的渲染，但不是不加载

4）慎用 @import

5）监控类脚本位置

应该放到 css 前面，否则会被 css 阻塞加载，变成串行

tips:

如果 link 标签放在 head 标签中，CSS 的加载，不会阻塞 HTML 的解析（HTML解析完会触发DOMContentLoaded 事件，所有依赖资源加载完才触发 load 事件，然后进行样式计算、布局、绘制、合成图层）

如果 link 标签放在 body 标签底部，CSS 的加载，不会阻塞页面内容的呈现，但是页面没有样式。加载完解析后会发生一次页面跳动，渲染出样式。

如果 link 标签放在 2个 div 中间，第一个 div 先展示，但是没样式。css 加载解析完之后，第二个才会出来，然后两个 div 都有了样式

3.减少包体大小

1）压缩：本地与网络

2）合适的兼容性：配合 browserslist 添加后缀

4.解析与渲染树构建

1）简化选择器

避免过多的嵌套与复杂度

2）使用先进的布局方式

新版的 flex 性能更好

5.利用缓存

使用 css-loader 和 style-loader，会导致耦合在 JavaScript 代码中，通过运行时添加 style 标签注入页面。更好的做法是使用 MiniCssExtractPlugin 插件

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = {
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[contenthash:8].css',
      chunkFilename: '[contenthash:8].css'
    }),
  ],
  module: {
    rules: [{
        test: /\.css$/,
        use: [
            MiniCssExtractPlugin.loader,
            'css-loader'
        ]
    }]
  }
};

图片

1.优化请求数

1）雪碧图

background-url 设置为统一大图，background-position 定位自己

2）懒加载

function loadIfNeeded($img) {
    const bounding = $img.getBoundingClientRect();
    if (
        getComputedStyle($img).display !== 'none'
        && bounding.top <= window.innerHeight
        && bounding.bottom >= 0
    ) {
        $img.src = $img.dataset.src;
        $img.classList.remove('lazy');
    }
}

// 这里使用了 throttle，你可以实现自己的 throttle，也可以使用 lodash
const lazy = throttle(function () {
    const $imgList = document.querySelectorAll('.lazy');
    if ($imgList.length === 0) {
        document.removeEventListener('scroll', lazy);
        window.removeEventListener('resize', lazy);
        window.removeEventListener('orientationchange', lazy);
        return;
    }
    $imgList.forEach(loadIfNeeded);
}, 200);

document.addEventListener('scroll', lazy);
window.addEventListener('resize', lazy);
window.addEventListener('orientationchange', lazy);

注意点：

设置合理的占位图，避免图片加载后的页面“抖动”。

首屏可以不需要懒加载

3） CSS 中的图片懒加载

.login {
    background-url: url(/static/img/login.png);
}

如果不应用到具体的元素，浏览器不会去下载该图片。可以通过切换 className 实现懒加载

2. 减小图片大小

1）使用 WebP，有损无损都会优于 jpeg/png，兼容性写法

<picture>
    <source type="image/webp" srcset="/static/img/perf.webp">
    <source type="image/jpeg" srcset="/static/img/perf.jpg">
    <img src="/static/img/perf.jpg">
</picture>

2）使用 SVG 应对矢量图场景，有时也会更小

3）使用 video 替代 GIF，相同效果，GIF 比视频（MPEG-4）大 5～20 倍

<video autoplay loop muted playsinline>
    <source src="video.webm" type="video/webm">
    <source src="video.mp4" type="video/mp4">
    <img src="animated.gif">
</video>

4）渐进式 JPEG

5）压缩图片（imagemin-webpack-plugin）

6）选择合适的图片（srcset、sizes）

带w的是宽度描述符，x是像素描述符，sizes只对前者有用

<img srcset="small.jpg 480w, large.jpg 1080w" sizes="50w" src="large.jpg" >

7）删除图片中的元信息

字体

1）font-display（设置 font-display: swap 防止网络加载时字体不显示FOIT (Flash of Invisible Text)，先使用默认字体）

@font-face {
    font-family: 'Samplefont';
    src: url(/static/samplefont.woff2) format('woff2'),
         url(/static/samplefont.woff) format('woff');
    font-display: swap;
}

2） Font Face Observer（利用这个库在js中加载字体）

视频

1）使用合适的视频格式（webm体积小）

2）压缩

3）移除不必要的音轨（做 gif 时）

4）使用‘流’

HLS (HTTP Live Streaming) 技术（一个 .m3u8 的索引文件和一系列包含播放内容的 .ts 分片），浏览器通过不断下载一小段的分片来进行视频播放，避免了完整视频下载的流量消耗。

5）移除不必要的视频（小屏媒体查询隐藏视频）

六、运行时

1. 注意强制同步布局

1）什么是强制同步布局

var $ele = document.getElementById('main');
$ele.classList.remove('large');
var height = $ele.offsetHeight;

移除类名之后，马上获取元素高度。浏览器为了保证高度值正确，浏览器会立即进行布局。

解决：应该交换第二、三行

2）批量化 dom 操作，有一个库 fastDom

2.长列表优化

1）虚拟列表

核心思想：只渲染可见区域附近的列表元素

好处：不会频繁的 DOM 创建与销毁，只修改内部节点与内容，利用创建合成层也可以提高性能

大致思路：

监听页面滚动（或者其他导致视口变化的事件）；

滚动时根据滚动的距离计算需要展示的列表项；

将列表项中展示的数据与组件替换成当前需要展示的内容；

修改偏移量到对应的位置。（可以修改top值或者父元素padding，方案很多）

2）原生的 Virtual Scroller（暂时不建议生产环境使用）

3. 避免 JavaScript 运行时间过长

渲染进程主线程既要负责渲染又要负责 js 解析

1）任务分解

document.body.innerHTML = '';
for(var i = 0; i < 1e9; i++) {1+1}

上述代码会被阻塞导致页面不会立马被清空

使用 requestAnimationFrame 把任务分解，每次渲染帧之前做一个子任务

document.body.innerHTML = '';

let step = 0;
function subtask() {
    if (step === 1e9) { return; }
    window.requestAnimationFrame(function () {
        for(var i = 0; i < 1e8; i++) {step++; 1+1}
        subtask();
    });
}
subtask();

2）延迟执行

使用的 requestIdleCallback ，在空闲时间执行回调函数

window.requestIdleCallback(deadline => {
    if (deadline.timeRemaining() > 100) {// 剩余的空闲时间大于 100ms
        // 一些可以等浏览器空闲了再去做的事
    }
}, {timeout: 5000}) // 超时5s强制执行

![](https://content.markdowner.net/pub/WXLOrw-Rg5Nq1A)

或者使用 setTimeout

3）并行计算

使用 Web Worker 

4. 善用 Composite

合成层的位图，会交由 GPU 合成，比 CPU 处理要快；

当需要 repaint 时，只需要 repaint 本身，不会影响到其他的层；

对于 transform 和 opacity 效果，不会触发 layout 和 paint。