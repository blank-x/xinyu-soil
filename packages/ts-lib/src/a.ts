import { name, getName, Animal, Directions, Options } from './b';

let myName = getName();
let cat = new Animal('Tom');
let directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right];
let options: Options = {
  data: {
    name: 'foo'
  }
};
