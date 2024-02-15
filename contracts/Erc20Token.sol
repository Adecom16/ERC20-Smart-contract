// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ERC20Token {
    string public tokenName = "AdeToken";
    string public tokenSymbol = "ATK";
    uint8 public decimal = 18;
    uint256 public TokenSupply = 1000000 * 10 ** uint256(decimal);

    mapping(address => uint256) public accountBalance;

    event TokenTransfer(address indexed sender, address indexed receiver, uint256 amount);

    constructor() {
        accountBalance[msg.sender] = TokenSupply;
    }

    function transferTokens(address _receiver, uint256 _amount) public returns (bool) {
        require(_receiver != address(0), "Invalid receiver address");
        require(_amount > 0, "Transfer amount must be greater than zero");
        require(accountBalance[msg.sender] >= _amount, "Insufficient balance");

        uint256 transferFee = Fee(_amount);
        uint256 transferAmount = _amount - transferFee;

        accountBalance[msg.sender] -= _amount;
        accountBalance[_receiver] += transferAmount;

        emit TokenTransfer(msg.sender, _receiver, transferAmount);

        return true;
    }

    function Fee(uint256 _amount) internal pure returns (uint256) {
        return _amount / 10; 
    }
}
