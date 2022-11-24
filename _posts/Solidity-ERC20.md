---
title: 'Solidity ERC20'
excerpt: 'Solidity ERC20'
coverImage: '/assets/blog/solidity/Erc20.png'
date: '2022-11-23 20:21:06'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/solidity/Erc20.png'
type: 'Solidity'
---

## ERC20

### ERC20 接口

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.0.0/contracts/token/ERC20/IERC20.sol
interface IERC20 {
    // 代币发行量
    function totalSupply() external view returns (uint);
    // 账户余额
    function balanceOf(address account) external view returns (uint);
    // 当前调用者给 recipient 转移 amount 个代币
    function transfer(address recipient, uint amount) external returns (bool);
    // spender 在 owner 账户中允许转移的代币数
    function allowance(address owner, address spender) external view returns (uint);
    // 当前调用者给 spender 提供 amount 哥代币
    function approve(address spender, uint amount) external returns (bool);
    // 从 sender 向 recipient 转移 amount 个代币
    function transferFrom(
        address sender,
        address recipient,
        uint amount
    ) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint value);
    event Approval(address indexed owner, address indexed spender, uint value);
}
```

### ERC20 OpenZeppelin 实现

[官方地址](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol)

将通用的 `transfer` 和 `approval` 写成单独的方法，以供调用

```solidity
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./IERC20.sol";
import "./extensions/IERC20Metadata.sol";
import "../../utils/Context.sol";

contract ERC20 is Context, IERC20, IERC20Metadata {

    // 声明为私有变量，提供 view 函数以供读取
    mapping(address => uint256) private _balances;

    mapping(address => mapping(address => uint256)) private _allowances;

    uint256 private _totalSupply;

    string private _name;
    string private _symbol;

    // _name 和 _symbol 不能在改变
    constructor(string memory name_, string memory symbol_) {
        _name = name_;
        _symbol = symbol_;
    }

    function name() public view virtual override returns (string memory) {
        return _name;
    }

    function symbol() public view virtual override returns (string memory) {
        return _symbol;
    }

    // 小数位数，与 wei 和 ether 的转换相同，都是 10**18
    // 如果要改变小数位数，可以重写这个方法
    // 建议都是 18 
    function decimals() public view virtual override returns (uint8) {
        return 18;
    }

    function totalSupply() public view virtual override returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) public view virtual override returns (uint256) {
        return _balances[account];
    }

    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    // 当前调用者给 recipient 转移 amount 个代币
    function transfer(address to, uint256 amount) public virtual override returns (bool) {
        address owner = _msgSender();
        _transfer(owner, to, amount);
        return true;
    }

    function allowance(address owner, address spender) public view virtual override returns (uint256) {
        return _allowances[owner][spender];
    }

    /**
     * @dev 当前调用者给 spender 提供代币
     *
     * 条件判断:
     *
     * - `spender` 不能是 address(0)
     */
    function approve(address spender, uint256 amount) public virtual override returns (bool) {
        address owner = _msgSender();
        _approve(owner, spender, amount);
        return true;
    }

    /**
     * 条件判断:
     *
     * - `from` 和 `to` 不能是 address(0)
     * - `from` 至少有 `amount` 的余额
     * - 调用者必须被 from 允许转移至少 amount 个币
     */
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public virtual override returns (bool) {
        address spender = _msgSender();
        _spendAllowance(from, spender, amount);
        _transfer(from, to, amount);
        return true;
    }

    /**
     * @dev 当前调用者给 spender 增加允许转移的代币数量
     *
     * 条件判断:
     *
     * - `spender` 不能是 address(0)
     */
    function increaseAllowance(address spender, uint256 addedValue) public virtual returns (bool) {
        address owner = _msgSender();
        _approve(owner, spender, allowance(owner, spender) + addedValue);
        return true;
    }

    /**
     * @dev 当前调用者给 spender 减少允许转移的代币数量
     *
     * 条件判断:
     *
     * - `spender` 不能是 address(0)
     * - `spender` 至少有 subtractedValue 数量以供减少
     */
    function decreaseAllowance(address spender, uint256 subtractedValue) public virtual returns (bool) {
        address owner = _msgSender();
        uint256 currentAllowance = allowance(owner, spender);
        require(currentAllowance >= subtractedValue, "ERC20: decreased allowance below zero");
        unchecked {
            _approve(owner, spender, currentAllowance - subtractedValue);
        }

        return true;
    }

    /**
     * @dev form 给 to 转移 amount 个代币.
     *
     * 触发 Transfer 事件.
     *
     * 条件判断:
     *
     * - `from` 不能是 address(0)
     * - `to` 不能是 address(0)
     * - `from` 的余额必须大于.
     */
    function _transfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual {
        require(from != address(0), "ERC20: transfer from the zero address");
        require(to != address(0), "ERC20: transfer to the zero address");
        // 转移之前
        _beforeTokenTransfer(from, to, amount);

        uint256 fromBalance = _balances[from];
        require(fromBalance >= amount, "ERC20: transfer amount exceeds balance");
        unchecked {
            // 不可能溢出，所有的余额总和由 totalSupply 设置上限
            _balances[from] = fromBalance - amount;
            _balances[to] += amount;
        }

        emit Transfer(from, to, amount);
        // 转移之后
        _afterTokenTransfer(from, to, amount);
    }

    /** @dev 铸币.
     *
     * 触发 Transfer 事件，from 设置为0，代表 totalSupply 增加了 amount.
     *
     * 条件判断:
     *
     * - `account` 不能为 address(0)
     */
    function _mint(address account, uint256 amount) internal virtual {
        require(account != address(0), "ERC20: mint to the zero address");

        _beforeTokenTransfer(address(0), account, amount);

        _totalSupply += amount;
        unchecked {
            _balances[account] += amount;
        }
        emit Transfer(address(0), account, amount);

        _afterTokenTransfer(address(0), account, amount);
    }

    /**
     * @dev 毁币.
     *
     * 触发 Transfer 事件，to 设置为0，代表 totalSupply 减少了 amount.
     *
     * 条件判断:
     *
     * - `account` 不能为 address(0)
     * - `account` 必须至少有 amount 个币
     */
    function _burn(address account, uint256 amount) internal virtual {
        require(account != address(0), "ERC20: burn from the zero address");

        _beforeTokenTransfer(account, address(0), amount);

        uint256 accountBalance = _balances[account];
        require(accountBalance >= amount, "ERC20: burn amount exceeds balance");
        unchecked {
            _balances[account] = accountBalance - amount;
            // amount <= accountBalance <= totalSupply.
            _totalSupply -= amount;
        }

        emit Transfer(account, address(0), amount);

        _afterTokenTransfer(account, address(0), amount);
    }

    /**
     * @dev spender 在 owner 账户中允许转移的代币数
     *
     * 触发 Approval 事件
     *
     * 条件判断:
     *
     * - `owner` 不能为 address(0)
     * - `spender` 不能为 address(0)
     */
    function _approve(
        address owner,
        address spender,
        uint256 amount
    ) internal virtual {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");

        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }

    /**
     * @dev 减少 spender 在 owner 账户中允许转移的代币数
     */
    function _spendAllowance(
        address owner,
        address spender,
        uint256 amount
    ) internal virtual {
        uint256 currentAllowance = allowance(owner, spender);
        if (currentAllowance != type(uint256).max) {
            require(currentAllowance >= amount, "ERC20: insufficient allowance");
            unchecked {
                _approve(owner, spender, currentAllowance - amount);
            }
        }
    }

    /**
     * @dev 转移之前
     *
     * - 当 from 和 to 都不为 0 时，表示转移代币
     * - 当 from 为 0 时，表示铸币
     * - 当 to 为 0 时，表示毁币
     * - `from` 和 `to` 不可能都为 0
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual {}

    /**
     * @dev 转移之后
     *
     * - 当 from 和 to 都不为 0 时，表示转移代币
     * - 当 from 为 0 时，表示铸币
     * - 当 to 为 0 时，表示毁币
     * - `from` 和 `to` 不可能都为 0
     */
    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual {}
}
```