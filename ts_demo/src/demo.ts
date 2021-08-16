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

