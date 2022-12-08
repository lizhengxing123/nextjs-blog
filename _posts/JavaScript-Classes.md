---
title: '类'
excerpt: 'JavaScript 类'
coverImage: '/assets/blog/javascript/classes.png'
date: '2022-12-06 13:23:09'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/javascript/classes.png'
type: 'Javascript'
---

## 类

类是用于创建对象的模板。用代码封装数据以及处理数据。**建立在原型上。**

### 定义类

类是特殊的函数，就像可以定义函数表达式和函数声明一样，类语法也可以分为类表达式和类声明

#### 类声明

使用关键字`class`来声明类

```js
class Book {
    constructor(name) {
        this.name = name
    }
}
```
> 函数声明和类声明之间有一个重要的区别，就是**函数声明会提升，而类声明不会**。
> 只有类声明之后，才能访问

```js
const book = new Book() // 会报错

class Book {}
```

#### 类表达式

类表达式可以命名或不命名，命名类表达式的名称是该类体的局部名称，可以通过类的`name`属性来访问

```js
// 不命名
const Book = class {
    constructor(name) {
        this.name = name
    }
}
// Book.name =>  'Book'

// 命名
const Book2 = class MyBook {
    constructor(name) {
        this.name = name
    }
}
// Book.name =>  'MyBook'
```

### 类体和类成员

类体是`{}`部分，在其中定义类成员。类的主体都执行在严格模式下。

#### 构造函数

用于创建和初始化一个由`class`创建的对象。一个类只能有一个 `constructor` 构造函数。在构造函数中可以使用`super` 来调用父类构造函数。

#### 原型方法

在类中定义的方法，都在类的原型对象上

```js
class Rectangle {
    // constructor
    constructor(height, width) {
        this.height = height;
        this.width = width;
    }
    // Getter
    get area() {
        return this.calcArea()
    }
    // Method
    calcArea() {
        return this.height * this.width;
    }
}
const square = new Rectangle(10, 10);

// square.__proto__ === Rectangle.prototype
// 原型对象上有：
// area 、 get area 、 calcArea 、 constructor
```

#### 静态方法

使用 `static` 关键字来定义一个静态方法。静态方法只存在于类上，实例对象不能访问

```js
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    static displayName = "Point";

    static distance(a, b) {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        return Math.hypot(dx, dy);
    }
}
const point = new Point(12, 24)
// point.displayName => undefined
// point.distance => undefined

// Point.displayName => 'Point'
// Point.distance => 函数
```

#### 类中的 this

```js
class Animal {
  speak() {
    return this;
  }
  static eat() {
    return this;
  }
}

let obj = new Animal();
obj.speak(); // Animal {}
let speak = obj.speak;
speak(); // undefined

Animal.eat() // class Animal
let eat = Animal.eat;
eat(); // undefined
```

#### 实例属性

实例属性必须定义在类的方法里。

```js
class Rectangle {
  constructor(height, width) {
    this.height = height;
    this.width = width;
  }
}
```

静态的或原型的数据属性必须定义在类定义的外面。

```js
// 静态
Rectangle.staticWidth = 20;
// 原型
Rectangle.prototype.prototypeWidth = 25;
```

#### 字段说明

- 公有字段

```js
class Rectangle {
  // 可以预先声明字段，不需要 let、const、var
  // 可以指定默认值
  height = 0;
  // 也可以不指定默认值
  width;
  constructor(height, width) {
    this.height = height;
    this.width = width;
  }
}
```

- 私有字段：只能在类里面读取或写入，在类外面不可见

```js
class Rectangle {
  #height = 0;
  #width;
  constructor(height, width) {
    this.#height = height;
    this.#width = width;
  }
}
```

### 继承

使用 `extends` 来继承。如果在子类中使用了`constructor`，那么必须先调用`super`才能使用`this`

```js
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    console.log(`${this.name} makes a noise.`);
  }
}

class Dog extends Animal {
  constructor(name) {
    super(name); // 调用超类构造函数并传入 name 参数
  }

  speak() {
    console.log(`${this.name} barks.`);
  }
}
```

类也可以继承构造函数

```js
function Animal (name) {
  this.name = name;
}
Animal.prototype.speak = function () {
  console.log(this.name + ' makes a noise.');
}

class Dog extends Animal {
  speak() {
    super.speak();
    console.log(this.name + ' barks.');
  }
}
```

也可以使用`Object.setPrototypeOf`来实现类继承对象

```js
const Animal = {
  speak() {
    console.log(this.name + ' makes a noise.');
  }
};

class Dog {
  constructor(name) {
    this.name = name;
  }
}

Object.setPrototypeOf(Dog.prototype, Animal);
```

### 使用 super 调用父类函数

```js
class Cat {
  constructor(name) {
    this.name = name;
  }

  speak() {
    console.log(this.name + ' makes a noise.');
  }
}

class Lion extends Cat {
  speak() {
    super.speak();
    console.log(this.name + ' roars.');
  }
}
```

### 混入

一个以超类作为输入的函数和一个继承该超类的子类作为输出可以用于在 `ECMAScript` 中实现混合

```js
// Base 是超类，输出子类继承超类
var calculatorMixin = Base => class extends Base {
  calc() { }
};

var randomizerMixin = Base => class extends Base {
  randomize() { }
};
// 使用
class Foo { }
class Bar extends calculatorMixin(randomizerMixin(Foo)) { }
```