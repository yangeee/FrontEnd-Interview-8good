let data:number[] = [1,2]
console.log(data)

enum Color {Red = 1, Green, Blue}
let colorName: string = Color[1];

console.log(colorName);

let prettySure: Object = 4;

interface Person {
  name: string;
  age?: number;
  [propName: string]: string | number;
}

let tom: Person = {
  name: 'Tom',
  age: 25,
  gender: 'male'
};

// 函数重载，优先把精确的定义写在前面
function reverse(x: number): number;
function reverse(x: string): string;
function reverse(x: number | string): number | string | void {
  if (typeof x === 'number') {
    return Number(x.toString().split('').reverse().join(''));
  } else if (typeof x === 'string') {
    return x.split('').reverse().join('');
  }
}

console.log(reverse(123))

let toms!: [string, number];
toms = ['Jack',18];
toms[0] = 'Tom';
toms[1] = 25;

toms[0].slice(1);
toms[1].toFixed(2);


class Animal {
  public name: string;
  constructor(name: string) {
    this.name = name;
  }
  sayHi(): string {
    return `My name is ${this.name}`;
  }
}

let a: Animal = new Animal('Jack');
console.log(a.sayHi()); // My name is Jack

interface Lengthwise {
  length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}

loggingIdentity([1,2,3]);

interface SearchFunc {
  (source: string, subString: string): boolean;
}

let mySearch: SearchFunc;
mySearch = function(source, subString) {
  return source.search(subString) !== -1;
}


interface CreateArrayFunc {
  <T>(length: number, value: T): Array<T>;
}

let createArray: CreateArrayFunc;
createArray = function<T>(length: number, value: T): Array<T> {
  let result: T[] = [];
  for (let i = 0; i < length; i++) {
    result[i] = value;
  }
  return result;
}

createArray(3, 'x'); // ['x', 'x', 'x']

class GenericNumber<T> {
  zeroValue: T;
  add: (x: T, y: T) => T;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function(x, y) { return x + y; };
console.log(myGenericNumber.add(1,5))