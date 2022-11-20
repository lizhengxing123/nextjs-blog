---
title: 'Chainlink产品之DataFeed的使用'
excerpt: '学习Chainlink DataFeed的使用'
coverImage: '/assets/blog/chainlink/df-0.png'
date: '2022-11-17 10:57:29'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/chainlink/df-0.png'
type: 'Chainlink'
---

## 学习

- [bilibili 视频](https://www.bilibili.com/video/BV1ed4y1N7Uv?p=2&vd_source=97e4871747b6e43793eaa0ddb1bb5191)
- [官方文档](https://docs.chain.link/data-feeds)

## 业务流程

有两个参与方

- 数据提供商：提供数据给预言机节点
- 预言机网络：预言机网络会整合所有的节点，然后将数据发送到部署在链上的合约是

![业务流程](/assets/blog/chainlink/df-1.png)

## 技术架构

- 用户合约
- 代理合约
- 聚合合约

![技术架构](/assets/blog/chainlink/df-1.png)

## 代码实现

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract DataFeedDemo {
    AggregatorV3Interface public priceFeed;

    constructor() {
        priceFeed = AggregatorV3Interface(0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e);
    }

    function getPrice() public view returns(int256 answer) {
        (,answer,,,) = priceFeed.latestRoundData();
    }
}
```