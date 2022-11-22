---
title: 'Solidity 实现多重签名钱包'
excerpt: 'Solidity 实现多重签名钱包'
coverImage: '/assets/blog/solidity/itmap.png'
date: '2022-11-22 23:01:03'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/solidity/itmap.png'
type: 'Solidity'
---

## 多重签名钱包

钱包的所有者可以：

- 提交交易
- 批准或撤销批准还未执行的交易
- 在有足够的所有者批准之后，可以执行交易

```solidity
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

// errors
// 需要传递 owners 参数
error MultiSigWallet__OwnersRequired();
// 无效的确认数，为 0 或者大于所有者数量
error MultiSigWallet__InvalidNumConfirmationsRequired();
// 无效的所有者地址
error MultiSigWallet__InvalidOwnerAddress();
// 不是所有者
error MultiSigWallet__NotOwner();
// 交易不存在
error MultiSigWallet__TxNotExist();
// 交易已经被执行
error MultiSigWallet__TxAlreadyExecuted();
// 交易没有被确认
error MultiSigWallet__TxNotConfirmed();
// 交易确认数不够
error MultiSigWallet__TxNumConfirmationsNotEnough();
// 交易执行失败
error MultiSigWallet__TxFailed();

/// @title 多重签名钱包
/// @author Li Zhengxing
/// @notice 需要有足够的所有者确认后才可以执行交易
contract MultiSigWallet {
    // 类型声明
    // 交易类型
    struct Transaction {
        address to; // 需要往哪发送交易
        uint256 value; // 需要发送的 Ether
        bytes data; // 发送交易携带的数据
        bool executed; // 是否已经被执行
        uint256 numConfirmations; // 已经确认的数量
    }
    // 状态变量
    // 所有的交易
    Transaction[] private s_transactions;
    // 所有者
    address[] private s_owners;
    // 是否为所有者
    mapping(address => bool) private s_isOwner;
    // 交易是否被所有者确认
    mapping(uint256 => mapping(address => bool)) private s_isConfirmed;
    // 所需要的确认数
    uint256 private immutable i_numConfirmationsRequired;

    // events
    // 提交交易
    event SubmitTransaction(
        uint256 txIndex, /* 交易 index */
        address owner, /* 提交交易的人 */
        address to, /* 发送的地址 */
        uint256 value, /* value */
        bytes data /* data */
    );
    // 确认交易
    event ConfirmTransaction(
        uint256 txIndex, /* 交易 index */
        address owner /* 确认交易的人 */
    );
    // 取消确认交易
    event RevokeTransaction(
        uint256 txIndex, /* 交易 index */
        address owner /* 取消确认交易的人 */
    );
    // 执行交易
    event ExecuteTransaction(
        uint256 txIndex, /* 交易 index */
        address owner /* 执行交易的人 */
    );
    // modifiers
    // 只有 owner 才可以执行
    modifier onlyOwner() {
        if (!s_isOwner[msg.sender]) {
            revert MultiSigWallet__NotOwner();
        }
        _;
    }
    // 只有已经存在的交易才可以执行
    modifier txExists(uint256 txIndex) {
        if (txIndex >= s_transactions.length) {
            revert MultiSigWallet__TxNotExist();
        }
        _;
    }
    // 只有还未被执行的交易才可以执行
    modifier notExecuted(uint256 txIndex) {
        if (s_transactions[txIndex].executed) {
            revert MultiSigWallet__TxAlreadyExecuted();
        }
        _;
    }
    // 只有已经确认了交易才可以操作
    modifier txConfirmed(uint256 txIndex) {
        if (!s_isConfirmed[txIndex][msg.sender]) {
            revert MultiSigWallet__TxNotConfirmed();
        }
        _;
    }
    // 只有确认数够了才可以执行
    modifier numEnough(uint256 txIndex) {
        if (
            s_transactions[txIndex].numConfirmations <
            i_numConfirmationsRequired
        ) {
            revert MultiSigWallet__TxNumConfirmationsNotEnough();
        }
        _;
    }

    // constructor
    constructor(address[] memory owners, uint256 numConfirmationsRequired) {
        // 条件判断
        if (owners.length <= 0) {
            revert MultiSigWallet__OwnersRequired();
        }
        if (
            numConfirmationsRequired <= 0 ||
            numConfirmationsRequired > owners.length
        ) {
            revert MultiSigWallet__InvalidNumConfirmationsRequired();
        }
        // 赋值
        uint256 len = owners.length;
        for (uint256 i = 0; i < len; ++i) {
            if (owners[i] == address(0)) {
                revert MultiSigWallet__InvalidOwnerAddress();
            }
            s_isOwner[owners[i]] = true;
            s_owners.push(owners[i]);
        }
        i_numConfirmationsRequired = numConfirmationsRequired;
    }

    // functions
    // 提交交易
    function submitTransaction(
        address to,
        uint256 value,
        bytes memory data
    ) public onlyOwner {
        uint256 txIndex = s_transactions.length;
        s_transactions.push(Transaction(to, value, data, false, 0));
        emit SubmitTransaction(txIndex, msg.sender, to, value, data);
    }

    // 确认交易
    function confirmTransaction(uint256 txIndex)
        public
        onlyOwner
        txExists(txIndex)
        notExecuted(txIndex)
    {
        Transaction storage transaction = s_transactions[txIndex];
        transaction.numConfirmations++;
        s_isConfirmed[txIndex][msg.sender] = true;

        emit ConfirmTransaction(txIndex, msg.sender);
    }

    // 取消确认
    function revokeTransaction(uint256 txIndex)
        public
        onlyOwner
        txExists(txIndex)
        notExecuted(txIndex)
        txConfirmed(txIndex)
    {
        Transaction storage transaction = s_transactions[txIndex];
        transaction.numConfirmations--;
        s_isConfirmed[txIndex][msg.sender] = false;

        emit RevokeTransaction(txIndex, msg.sender);
    }

    // 执行交易
    function executeTransaction(uint256 txIndex)
        public
        onlyOwner
        txExists(txIndex)
        notExecuted(txIndex)
        numEnough(txIndex)
    {
        Transaction storage transaction = s_transactions[txIndex];
        transaction.executed = true;
        (bool success, ) = transaction.to.call{value: transaction.value}(
            transaction.data
        );
        if (!success) {
            revert MultiSigWallet__TxFailed();
        }

        emit ExecuteTransaction(txIndex, msg.sender);
    }

    // 获取交易数量
    function getTransactionCount() public view returns (uint256) {
        return s_transactions.length;
    }

    // 获取指定下标的交易
    function getTransaction(uint256 index)
        public
        view
        returns (Transaction memory)
    {
        return s_transactions[index];
    }

    // 获取所有者
    function getOwner(uint256 index) public view returns (address) {
        return s_owners[index];
    }
}
```