---
title: 'Typescript 类型'
excerpt: '学习 Typescript 类型'
coverImage: '/assets/blog/javascript/ts.png'
date: '2022-11-24 11:32:19'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/javascript/ts.png'
type: 'Javascript'
---

## 基础类型

- `boolean`：布尔值
- `number`：数值
- `string`：字符串
- 数组：使用 `Type[]` 或者 `Array<Type>`
- 元组：已知元素数量和类型的数组
  - 例如 `let x:[string, number]`，访问越界的元素会报错，在这个类型中就不能访问 `x[3]`
- 枚举：`enum Color {Red, Green, Orange}`
  - 可以使用`Color.Green`和`Color[0]`
- `unknown`：不知道类型
- `any`：任何类型
- `void`：没有任何类型，例如函数没有返回值就是`void`
- `null`
- `undefined`
- `never`：永不存在值的类型，例如抛出错误的函数或者陷入死循环的函数
- `object`：非原始类型，除 `number`、`string`、`boolean`、`bigint`、`symbol`、 `null` 或 `undefined` 之外的类型
- `Object`：可以是任何类型，具有 `Object` 接口，只能访问 `Object` 接口里的东西
- `{}`：可以是任何类型，与 `Object` 相同

## 高级类型

### 类型守卫

```ts
interface Bird {
    fly():void;
    layEggs():void;
}

interface Fish {
    swim():void;
    layEggs():void;
}
// pet is Fish 是类型谓词
function isFish(pet: Bird | Fish): pet is Fish {
    return (pet as Fish).swim !== undefined
}
```

### 索引类型

- `keyof T` - 索引类型查询操作符
- `T[K]` - 索引访问操作符

```ts
function pluck<T, K extends keyof T>(o: T, propertyNames: K[]): T[K][] {
    return propertyNames.map(name => o[name])
}

interface Car {
    name: string
    price: number
}

const car:Car = {
    name: "dz",
    price: 100000
}

// names 的类型为 (string | number)[]
// 返回值为 ["dz", 100000]
const names = pluck(car, ['name', 'price'])
```

#### 索引签名

```ts
interface Dictionary<T> {
    [key: string]: T
}

// keys 的类型是 string | number
// 因为访问的时候数字可以转换成字符转访问
type keys = keyof Dictionary<number>


interface Dictionary<T> {
    [key: number]: T
}

// keys 的类型是 number
type keys = keyof Dictionary<number>
```

### 映射类型

将已知的类型都转换为可选的或者可读的

```ts
interface Person {
    name: string
    age: number
    hasFriend: boolean
}
// 转换为只读的
type Readonly<T> = {
    readonly [K in keyof T]: T[K]
}
// 转换为可选的
type Partial<T> = {
    [K in keyof T]?: T[K]
}
// 转换为含有 null 的
type Nullable<T> = {
    [K in keyof T]: T[K] | null;
}
// 使用
type ReadonlyPerson = Readonly<Person>
type PartialPerson = Partial<Person>
```

需要注意的是这个语法描述的是类型而非成员，如果要增加成员，就要使用交叉类型

```ts
// 合适
type PartialWithNewMember<T> = {
    [K in keyof T]?: T[K]
} & { newMember: string[] }

// 下面的会报错
// 映射的类型可能不声明属性或方法。ts(7061)
type PartialWithNewMember<T> = {
    [P in keyof T]?: T[P];
    newMember: boolean
};
```

Picked 和 Record

```ts
type Pick<T, K extends keyof T> = {
    [P in K]: T[P]
}
type Record<K extends keyof any, T> = {
    [P in K]: T
}
type Omit<T>
// 使用 => { name: string; age: number }
// 去除掉了hasFriend
type PickPerson = Pick<Person, 'name' | 'age'>
// 将属性都设置为 string => { prop1: string; prop2: string }
type RecordString = Record<'prop1' | 'prop2', string>
```

### 有条件类型

- `Exclude<T, U>` -- 从 T 中剔除可以赋值给 U 的类型, 与 Diff 一样
- `Extract<T, U>` -- 提取 T 中可以赋值给 U 的类型，与 Filter 一样
- `NonNullable<T>` -- 从 T 中剔除 null 和 undefined 。
- `ReturnType<T>` -- 获取函数返回值类型。
- `InstanceType<T>` -- 获取构造函数类型的实例类型。

```ts
// 筛选出 T 中存在， U 中不存在的类型
type Diff<T, U> = T extends U ? never : T; 
// 筛选出 T 和 U 中都存在的类型
type Filter<T, U> = T extends U ? T : never; 
// 筛选掉 null 和 undefined
type NonNullable<T> = Diff<T, null | undefined>

// 使用
type T01 = Diff<"a" | "b" | "c" | "d", "a" | "c" | "f">;  // "b" | "d"
type T02 = Filter<"a" | "b" | "c" | "d", "a" | "c" | "f">;  // "a" | "c"

type T03 = Exclude<"a" | "b" | "c" | "d", "a" | "c" | "f">;  // "b" | "d"
type T04 = Extract<"a" | "b" | "c" | "d", "a" | "c" | "f">;  // "a" | "c"

type T05 = Diff<string | number | (() => void), Function>;  // string | number
type T06 = Filter<string | number | (() => void), Function>;  // () => void

type T07 = Exclude<string | number | (() => void), Function>;  // string | number
type T08 = Extract<string | number | (() => void), Function>;  // () => void

type T09 = NonNullable<string | number | undefined>;  // string | number
type T10 = NonNullable<string | string[] | null | undefined>;  // string | string[]

function f1(s: string) {
    return { a: 1, b: s };
}

class C {
    x = 0;
    y = 0;
}

type T10 = ReturnType<() => string>;  // string
type T11 = ReturnType<(s: string) => void>;  // void
type T12 = ReturnType<(<T>() => T)>;  // {}
type T13 = ReturnType<(<T extends U, U extends number[]>() => T)>;  // number[]
type T14 = ReturnType<typeof f1>;  // { a: number, b: string }
type T15 = ReturnType<any>;  // any
type T16 = ReturnType<never>;  // never
type T17 = ReturnType<string>;  // Error
type T18 = ReturnType<Function>;  // Error

type T20 = InstanceType<typeof C>;  // C
type T21 = InstanceType<any>;  // any
type T22 = InstanceType<never>;  // never
type T23 = InstanceType<string>;  // Error
type T24 = InstanceType<Function>;  // Error
```

### 工具类型总结

- `Partial<Type>` - 将 Type 中所有属性设置为可选的
- `Required<Type>` - 将 Type 中所有属性设置为 required 
- `Readonly<Type>` - 将 Type 中所有属性设置为只读的
- `Record<Keys, Type>` - 将所有的 Keys 设置为Type
- `Pick<Type, Keys>` - 从 Type 中筛选出 Keys
- `Omit<Type, Keys>` - 从 Type 中剔除 Keys
- `Exclude<Type, ExcludedUnion>` - 从 Type 中剔除所有 ExcludedUnion 中包含的属性
- `Extract<Type, Union>` - 从 Type 中提取所有可以赋值给 Union 中的属性
- `NonNullable<Type>` - 从 Type 中剔除 null 和 undefined
- `Parameters<Type>` - 由函数类型 Type 的参数类型构造出来的一个元组
- `ConstructorParameters<Type>` - 由构造函数类型来构建出一个元组类型或数组类型
- `ReturnType<Type>` - 由函数类型 Type 的返回值类型构建一个新类型
- `InstanceType<Type>` - 由构造函数类型 Type 的实例类型来构建一个新类型
- `ThisParameterType<Type>` - 从函数类型中提取 this 参数的类型。 若函数类型不包含 this 参数，则返回 unknown 类型
- `OmitThisParameter<Type>` - 从 Type 类型中剔除 this 参数。 若未声明 this 参数，则结果类型为 Type 。 否则，由 Type 类型来构建一个不带 this 参数的类型。 泛型会被忽略，并且只有最后的重载签名会被采用


```ts
type Partial<T> = {
    [P in keyof T]: T[P];
}

type Required<T> = {
    [P in keyof T]-?: T[P];
}

type Readonly<T> = {
    readonly [P in keyof T]: T[P];
};

type Record<K extends keyof any, T> = {
    [P in K]: T;
}

type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
}

type Omit<T, K extends keyof any> = {
    [P in Exclude<keyof T, K>]: T[P]
    // 相当于
    // Pick<T, Exclude<keyof T, K>>
}

type Exclude<T, U> = T extends U ? never : T;

type Extract<T, U> = T extends U ? T : never;

type NonNullable<T> = Exclude<T, null | undefined>;
```