---
title: '字符串'
excerpt: '字符串'
coverImage: '/assets/blog/go/basicDataType.webp'
date: '2023-07-04 09:10:49'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/go/basicDataType.webp'
type: 'Go'
---

## 字符串

字符串是一个不可改变的字节序列。字符串可以包含任意的数据。文本字符串通常被解释为采用 `UTF8` 编码的 `Unicode` 码点（`rune`）序列。

`len` 函数返回字节数量，不是 `rune` 字符数量。

索引操作返回第 `i` 个字节的字节值，`0 <= i < len(s)`

```go
s1 := "李正星"
s2 := "lzx"

fmt.Println(len(s1), len(s2)) // 9 3
fmt.Println(s1[1], s2[1]) // 157 122

// 超出范围会报错
// panic: runtime error: index out of range [10] with length 9
fmt.Println(s1[10])
```

`s[i:j]` 基于原始字符串生成新的字符串，`i` 默认值是 0，`j` 默认值是 `len(s)`

```go
s := "hello world"

fmt.Println(s[2:5]) // llo
fmt.Println(s[:5])  // hello
fmt.Println(s[6:])  // world
fmt.Println(s[:])   // hello world
```

使用 `+` 可以将两个字符串连接构成一个新的字符串

```go
fmt.Println(s[:5] + s[6:]) // helloworld
```

字符串可以使用 `==`、`<`、`>` 等进行比较。比较通过逐个字节比较完成，因此比较的结果是字符串自然编码的顺序

```go
s3 := "abc"
s4 := "acb"

fmt.Println(s3 > s4, s3 < s4) // false true
```

字符串的值是不可变的，通过索引修改里面的数据也是被禁止的

```go
l := "left"
l2 := l
l += " right"

fmt.Println(l)  // left right
fmt.Println(l2) // left

l[2] = 's' // cannot assign to l[2]
```

### 字符串面值

字符串不变性意味着如果两个字符串共享相同的底层数据的话也是安全的，这使得复制任何长度的字符串代价是低廉的。同样，一个字符串 `s` 和对应的子字符串切片 `s[7:]` 的操作也可以安全的共享相同的内存，因此字符串切片操作代价也是低廉的。在这两种情况下，都没必要分配新的内存

```go
s := "hello world"
hello := s[:5]
world := s[6:]

/**
| ... | h | e | l | l | o |   | w | o | r | l | d | ... |
        ^                       ^
        |______ s  len: 11      |______ world  len: 5
        |
        |______ hello  len: 5
*/
```

在一个双引号包含的字符串面值中，可以用 `\` 开头的转义序列插入任意的数据。

```go
/**
* \a    响铃
* \b    退格
* \f    换页
* \n    换行
* \r    回车
* \t    制表符
* \v    垂直制表符
* \'    单引号
* \"    双引号
* \\    反斜杠
* \xhh  十六进制，hh是两个十六进制数字
* \ooo  ooo是三个八进制数字，不能超过 \377 (十进制是255)
*/
```

原生的字符串面值形式是使用反引号代替双引号。在原生的字符串面值中，没有转义操作，全部的内容都是字面意思。

在原生字符串内部无法使用反引号，可以用八进制、十六进制转义或者使用 `+` 连接反引号。

特殊处理是会删除回车，保证所有平台上的值是相同的。

```go
const GoUsage = `Go is a tool for managing Go source code.

Usage:
    go command [arguments]
...`
```

### Unicode

[Unicode](https://home.unicode.org/) 收集了世界上所有的符号系统，每个符号都分配一个唯一的 `Unicode` 码点，对应 `rune` 整数类型，等价于 `int32`

### UTF-8

`UTF-8` 是一个将 `Unicode` 码点编码为字节序列的变长编码，现已经是 `Unicode` 的标准。

`UTF-8` 编码使用 1 到 4 个字节来表示每个 `Unicode` 码点。

每个符号编码后的第一个字节的高位 `bit` 位用于表示总共有多少编码个字节。高位 `bit` 位为 0，表示对应 7 `bit` 的 `ASCII` 字符；高位 `bit` 位为 110，说明需要两个字节，后续每个高位 `bit` 位都以 10 开头。

```go
/**
0xxxxxxx                             runes 0-127    (ASCII)
110xxxxx 10xxxxxx                    128-2047       (值 <128 不使用)
1110xxxx 10xxxxxx 10xxxxxx           2048-65535     (值 <2048 不使用)
11110xxx 10xxxxxx 10xxxxxx 10xxxxxx  65536-0x10ffff (其他值不适应)
*/
```

字符串面值中的 `Unicode` 转义字符可以让我们通过 `Unicode` 码点输入特殊字符。`\uhhhh` 对应16位的码点，`\Uhhhhhhhh` 对应32位的码点。

下面的字符串面值都表示相同的值

```go
/** 
字符串面值       "世界"
十六进制转义     "\xe4\xb8\x96\xe7\x95\x8c"
16位Unicode    "\u4e16\u754c"
32位Unicode    "\U00004e16\U0000754c"
*/
```

测试一个字符串是否是另一个字符串的前缀

```go
func HasPrefix(s, prefix string) bool {
  return len(s) >= len(prefix) && s[:len(prefix)] == prefix
}
```

测试一个字符串是否是另一个字符串的后缀

```go
func HasSuffix(s, suffix string) bool {
	return len(s) >= len(suffix) && s[len(s)-len(suffix):] == suffix
}
```

包含子串测试

```go
func Contains(s, substr string) bool {
	for i := 0; i < len(s); i++ {
		if HasPrefix(s[i:], substr) {
			return true
		}
	}
	return false
}
```

获取字符串中的 `Unicode` 字符个数

```go
s := "Hello, 世界"

fmt.Println(len(s))                    // "13"
fmt.Println(utf8.RuneCountInString(s)) // "9"
```

`range` 在处理字符串的时候，会自动隐式解码 `UTF-8` 字符串

```go
s := "Hello, 世界"

for i, r := range "Hello, 世界" {
  fmt.Printf("%d\t%q\t%d\n", i, r, r)
}
/**
| ... | H | e | l | l | o | , |   | E4 | B8 | 96 | E7 | 95 | 8C | ... |
        ^                         |_____ 世 _____||_____ 界 ____|
        |____s len=13
*/
// 0       'H'     72
// 1       'e'     101
// 2       'l'     108
// 3       'l'     108
// 4       'o'     111
// 5       ','     44
// 6       ' '     32
// 7       '世'    19990
// 10      '界'    30028
```

我们可以使用简单的循环来统计字符串中字符的个数

```go
n := 0

for _, _ = range s {
  n++
}
```

可以忽略不需要的变量

```go
n := 0

for range s {
  n++
}
```

将 `[]rune` 类型转换应用到 `UTF8` 编码的字符串，将返回字符串编码的 `Unicode` 码点序列

```go
s := "举头望明月"

// % x 表示在每个十六进制数字前插入一个空格
fmt.Printf("% x\n", s)
//e4 b8 be e5 a4 b4 e6 9c 9b e6 98 8e e6 9c 88

r := []rune(s)
fmt.Printf("%x\n", r)
//[4e3e 5934 671b 660e 6708]
```

如果将一个 `[]rune` 类型的 `Unicode` 字符切片或数组转为 `string`，则对它们进行 `UTF8` 编码

```go
fmt.Println(string(r)) // 举头望明月
```

将一个整数转型为字符串意味着生成对应 `Unicode` 码点字符的UTF8字符串

```go
fmt.Println(string(65))     // A
fmt.Println(string(0x4eac)) // 京
```

如果对应码点的字符是无效的，则用 `\uFFFD` 无效字符代替

```go
fmt.Println(string(1234567)) // �
fmt.Println("\uFFFD")        // �
```

### 字符串和 Byte 切片

标准库中有四个包对字符串处理尤为重要

- `strings`

提供了许多如字符串的查询、替换、比较、截断、拆分和合并等功能。`ToUpper` 和 `ToLower` 用于将原始字符串的每个字符都做相应的转换，然后返回新的字符串

- `bytes`

也提供了很多类似功能的函数，但是针对和字符串有着相同结构的 `[]byte` 类型

- `strconv`

提供了布尔型、整型数、浮点数和对应字符串的相互转换，还提供了双引号转义的相关函数

- `unicode`

提供了 `IsDigit`、`IsLetter`、`IsUpper` 和 `IsLower` 等类似功能，它们用于给字符分类。每个函数有一个单一的 `rune` 类型的参数，然后返回一个布尔值。而像 `ToUpper` 和 `ToLower` 之类的转换函数，用于将 `rune` 字符大小写转换

不使用任何库，实现 `basename` 函数

```go
func basename(s string) string {
	// 找到最后的一个 / ，并保留 / 之后的字符串
	for i := len(s) - 1; i >= 0; i-- {
		if s[i] == '/' {
			s = s[i+1:]
			break
		}
	}

	// 找到最后一个 . ，并保留 . 之前的字符串
	for i := len(s) - 1; i >= 0; i-- {
		if s[i] == '.' {
			s = s[:i]
			break
		}
	}

	return s
}

fmt.Println(basename("a/b/c.go")) // "c"
fmt.Println(basename("c.d.go"))   // "c.d"
fmt.Println(basename("abc"))      // "abc"
```

使用 `strings.LastIndex`

```go
func basename(s string) string {
	// 找到最后的一个 / 的 index，并保留 / 之后的字符串
	// 没找到的话是 -1
	slash := strings.LastIndex(s, "/")
	s = s[slash+1:]
  
	// 找到最后一个 . 的 index，并保留 . 之前的字符串
	// 没找到的话是 -1
	if dot := strings.LastIndex(s, "."); dot >= 0 {
		s = s[:dot]
	}

	return s
}
```

将一个表示整值的字符串，每隔三个字符插入一个逗号分隔符

```go
func comma(s string) string {
	n := len(s)

	if n <= 3 {
		return s
	}

	return comma(s[:n-3]) + "," + s[n-3:]
}
```

### 字符串和数字的转换

将整数转换为字符串

```go
x := 123
y := fmt.Sprintf("%d\n", x)
fmt.Println(y, strconv.Itoa(x)) // 123 123
```

`FormatInt` 和 `FormatUint` 函数可以用不同的进制来格式化数字

```go
fmt.Println(strconv.FormatInt(int64(x), 2)) // "1111011"
```

将字符串解析为整数

```go
x, err := strconv.Atoi("123")             // x is an int
y, err := strconv.ParseInt("123", 10, 64) // base 10, up to 64 bits
```