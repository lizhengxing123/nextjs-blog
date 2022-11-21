---
title: 'Solidity 实现可迭代映射'
excerpt: 'Solidity 实现可迭代映射'
coverImage: '/assets/blog/solidity/itmap.png'
date: '2022-11-21 23:14:39'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/solidity/itmap.png'
type: 'Solidity'
---

## 可迭代映射

实现一个 `mapping(address => uint)` 的可迭代映射，用来表示账户的余额

```solidity
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

library IterableMapping {
    // 新的结构体类型，用来存储映射的一些信息
    struct Map {
        // 保存所有的 key
        address[] keys;
        // 保存原始的 mapping
        mapping(address => uint) values;
        // 每个 key 对应在 keys 中的 index
        mapping(address => uint) indexOf;
        // 判断 key 是否已经在映射中
        mapping(address => bool) inserted;
    }

    function set(Map storage map, address key, uint value) public {
        if (map.inserted[key]) {
            map.values[key] = value;
        } else {
            map.inserted[key] = true;
            map.values[key] = value;
            map.indexOf[key] = map.keys.length;
            map.keys.push(key);
        }
    }

    function remove(Map storage map, address key) public {
        if (!map.inserted[key]) {
            return;
        }

        delete map.inserted[key];
        delete map.values[key];

        uint index = map.indexOf[key];
        address lastKey = map.keys[map.keys.length - 1];

        // 将 key 和 lastKey 在 keys 中的位置互换
        map.keys[index] = lastKey;
        // 同时更换 indexOf 中的值
        map.indexOf[lastKey] = index;

        delete map.indexOf[key];
        map.keys.pop();
    }

    function get(Map storage map, address key) public view returns (uint) {
        return map.values[key];
    }

    function getKeyByIndex(Map storage map, uint index) public view returns (address) {
        return map.keys[index];
    }

    function size(Map storage map) public view returns (uint) {
        return map.keys.length;
    }
}

// 使用
contract Example {

    using IterableMapping for IterableMapping.Map;

    IterableMapping.Map private map;

    constructor() {
        map.set(address(0), 12);
        map.set(address(1), 32);
        map.set(address(2), 102);
    }

    function sum() public view returns (uint count) {
        uint len = map.size();
        for(uint i = 0; i < len; ++i) {
            count += map.get(map.keys[i]);
        }
    }
}
```