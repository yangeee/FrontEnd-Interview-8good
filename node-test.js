console.log('1');

setTimeout(() => {
  console.log('2');
  Promise.resolve().then(() => {
    console.log('3');
  })
  new Promise((resolve) => {
    console.log('4');
    resolve();
  }).then(() => {
    console.log('5')
  })
})

Promise.reject().then(() => {
  console.log('13');
}, () => {
  console.log('12');
})

new Promise((resolve) => {
  console.log('7');
  resolve();
}).then(() => {
  console.log('8')
})

setTimeout(() => {
  console.log('9');
  Promise.resolve().then(() => {
    console.log('10');
  })
  new Promise((resolve) => {
    console.log('11');
    resolve();
  }).then(() => {
    console.log('12')
  })
})
