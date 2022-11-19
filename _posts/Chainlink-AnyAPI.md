---
title: 'Chainlink产品之AnyAPI的使用'
excerpt: '学习Chainlink AnyAPI的使用'
coverImage: '/assets/blog/chainlink/anyapi-1.png'
date: '2022-11-19 21:35:07'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/chainlink/anyapi-1.png'
type: 'Chainlink'
---

## 学习

- [bilibili 视频](https://www.bilibili.com/video/BV1ed4y1N7Uv?p=13&spm_id_from=pageDriver&vd_source=97e4871747b6e43793eaa0ddb1bb5191)
- [官方文档](https://docs.chain.link/any-api/introduction)

## 业务流程

有三个参与方：

- 1、数据提供商：将数据源提供到 Chainlink 节点上
- 2、链上智能合约：向 Chainlink 节点发送请求
- 3、Chainlink 节点：监听到请求，会把数据发送到链上

![业务流程](/assets/blog/chainlink/anyapi-2.png)

## 数据市场

[数据市场](https://market.link/overview)中有各种不同的数据提供商所提供的关于股票、经济、身份等数据

![数据市场](/assets/blog/chainlink/anyapi-3.png)

## 技术架构

- 需要在用户合约（我们自己的链上合约）中实现 `request` 和 `fulfill` 两个方法


![技术架构](/assets/blog/chainlink/anyapi-4.png)

## 使用场景

- 天气以及航班延误数据：为保险应用提供必要的数据参考
- 温室气体的排放数据：提供碳市场资产所需要的数据
- 选举以及体育比赛数据：预测市场以及动态 NFT
- 资产以及宏观经济数据：为资产提供更多的流动性

## Demo 演示

### 准备工作

需要在本地启动 [Chainlink 节点](/posts/Chainlink-Node)，并往节点里充入一些测试币

### 实现功能

- 请求一个比较复杂的 JSON 数据（请求地址：[https://min-api.cryptocompare.com/data/pricemultifull?fsyms=ETH&tsyms=USD](https://min-api.cryptocompare.com/data/pricemultifull?fsyms=ETH&tsyms=USD)）
- 挑选合约所需要的数据返回给合约

### 功能拆分

- 1、部署 `operator.sol` 合约
  - [官方合约地址](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.7/Operator.sol)
  - 复制合约内容，在 Remix 中部署到 Goerli 测试网
  - 构造函数参数为 [link](https://docs.chain.link/resources/link-token-contracts#goerli-testnet) 和 owner(部署合约的地址)
  - 需要调用 setAuthorizedSenders 方法传入 Chainlink 节点地址，给节点授权


- 2、在 Chainlink 节点创建一个 [Job](https://docs.chain.link/chainlink-nodes/oracle-jobs/job-types/direct_request)
  - 需要声明一个 [TOML 文件](https://docs.chain.link/chainlink-nodes/job-specs/direct-request-get-uint256/)
  - 然后在 Chainlink 节点的 ui 系统中添加新的 Job（需要把注释去掉）
  - 文件内容如下

```toml
# Job 类型
type = "directrequest"
# 版本号
schemaVersion = 1
# Job 名称 - 自定义
name = "Get > Uint256 - (TOML)"
# 当这个 Job 失败了还能运行多长时间
maxTaskDuration = "0s"
# Operator 合约的地址
contractAddress = "YOUR_ORACLE_CONTRACT_ADDRESS"
# 等待的区块
minIncomingConfirmations = 0
# 任务列表
observationSource = """
    # 解码 Event Log 里的信息
    decode_log   [type="ethabidecodelog"
                  abi="OracleRequest(bytes32 indexed specId, address requester, bytes32 requestId, uint256 payment, address callbackAddr, bytes4 callbackFunctionId, uint256 cancelExpiration, uint256 dataVersion, bytes data)"
                  data="$(jobRun.logData)"
                  topics="$(jobRun.logTopics)"]
    # 将第一个任务中拿到的用户请求数据进行解析
    decode_cbor  [type="cborparse" data="$(decode_log.data)"]
    # 拿到请求的地址，发送 Get 请求
    fetch        [type="http" method=GET url="$(decode_cbor.get)" allowUnrestrictedNetworkAccess="true"]
    # 将请求的数据进行 JSON 解析，path 也是用户请求所携带的数据
    parse        [type="jsonparse" path="$(decode_cbor.path)" data="$(fetch)"]
    # 将解析出来的数据进行乘法运算，times 是用户请求所携带的数据
    multiply     [type="multiply" input="$(parse)" times="$(decode_cbor.times)"]
    # 将数据编码
    encode_data  [type="ethabiencode" abi="(bytes32 requestId, uint256 value)" data="{ \\"requestId\\": $(decode_log.requestId), \\"value\\": $(multiply) }"]
    # 将编码的数据转成交易
    encode_tx    [type="ethabiencode"
                  abi="fulfillOracleRequest2(bytes32 requestId, uint256 payment, address callbackAddress, bytes4 callbackFunctionId, uint256 expiration, bytes calldata data)"
                  data="{\\"requestId\\": $(decode_log.requestId), \\"payment\\":   $(decode_log.payment), \\"callbackAddress\\": $(decode_log.callbackAddr), \\"callbackFunctionId\\": $(decode_log.callbackFunctionId), \\"expiration\\": $(decode_log.cancelExpiration), \\"data\\": $(encode_data)}"
                  ]
    # 向 Operator 合约提交交易
    submit_tx    [type="ethtx" to="YOUR_ORACLE_CONTRACT_ADDRESS" data="$(encode_tx)"]
    # 任务执行顺序
    decode_log -> decode_cbor -> fetch -> parse -> multiply -> encode_data -> encode_tx -> submit_tx
"""
```
- 3、部署 `consumer.sol` 合约
  - [官方合约地址](https://docs.chain.link/any-api/get-request/examples/single-word-response/#example)
  - 需要往里面充 1 LINK - 调用 LINK 合约需要花费
  - constructor 中需要修改一些数据

```solidity
// Link 地址 https://docs.chain.link/resources/link-token-contracts#goerli-testnet
setChainlinkToken(Link 地址);
// 部署的 Operator 合约地址
setChainlinkOracle(Operator.address);
// Chainlink 节点中新创建的 Job 的 External Job ID
jobId = "4a75e98d5bef4c12b72e328eb81f03ef";
```

- 4、在 `consumer.sol` 合约中调用 requestVolumeData 发送请求
  - 在 Chainlink 节点系统 RUNS 里面就会有一条数据

- 5、在 `consumer.sol` 合约中查看 volume 的值接收返回的数据