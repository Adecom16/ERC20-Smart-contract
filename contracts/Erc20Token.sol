// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ERC20Token {
    string public tokenName = "AdeToken";
    string public tokenSymbol = "ATK";
    uint8 public decimal = 18;
    uint256 public TokenSupply = 1000000 * 10 ** uint256(decimal);

    mapping(address => uint256) public accountBalance;
    mapping(address => mapping(address => uint256)) public allowances;

    event TokenTransfer(address indexed sender, address indexed receiver, uint256 amount);
    event Approval(address indexed owner, address indexed spender, uint256 amount);
    event TokensDeposited(address indexed account, uint256 amount);
    event TokensWithdrawn(address indexed account, uint256 amount);

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

    function depositTokens(uint256 _amount) public returns (bool) {
        require(_amount > 0, "Deposit amount must be greater than zero");
        accountBalance[msg.sender] += _amount;

        emit TokensDeposited(msg.sender, _amount);

        return true;
    }

    function withdrawTokens(uint256 _amount) public returns (bool) {
        require(_amount > 0, "Withdrawal amount must be greater than zero");
        require(accountBalance[msg.sender] >= _amount, "Insufficient balance");

        accountBalance[msg.sender] -= _amount;

        emit TokensWithdrawn(msg.sender, _amount);

        return true;
    }

    function approve(address _spender, uint256 _amount) public returns (bool) {
        require(_spender != address(0), "Invalid spender address");

        allowances[msg.sender][_spender] = _amount;

        emit Approval(msg.sender, _spender, _amount);

        return true;
    }

    function allowance(address _owner, address _spender) public view returns (uint256) {
        return allowances[_owner][_spender];
    }

    function Fee(uint256 _amount) internal pure returns (uint256) {
        return _amount / 10;
    }

    function balanceOf(address _account) public view returns (uint256) {
        return accountBalance[_account];
    }
}
