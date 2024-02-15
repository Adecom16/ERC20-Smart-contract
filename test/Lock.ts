// SPDX-License-Identifier: MIT
const ERC20Token = artifacts.require("ERC20Token");
const { expect } = require("chai");

contract("ERC20Token", (accounts) => {
  let token;
  const [owner, receiver, another] = accounts;

  beforeEach(async () => {
    token = await ERC20Token.new();
  });

  it("should have the correct name, symbol, decimal and supply", async () => {
    const name = await token.tokenName();
    const symbol = await token.tokenSymbol();
    const decimal = await token.decimal();
    const supply = await token.TokenSupply();

    expect(name).to.equal("AdeToken");
    expect(symbol).to.equal("ATK");
    expect(decimal).to.be.a.bignumber.equal("18");
    expect(supply).to.be.a.bignumber.equal(web3.utils.toWei("1000000"));
  });

  it("should assign the total supply to the owner", async () => {
    const balance = await token.accountBalance(owner);

    expect(balance).to.be.a.bignumber.equal(await token.TokenSupply());
  });

  it("should transfer tokens to the receiver and deduct a fee", async () => {
    const amount = web3.utils.toWei("100");
    const fee = web3.utils.toWei("10");
    const transferAmount = web3.utils.toWei("90");

    await token.transferTokens(receiver, amount);

    const ownerBalance = await token.accountBalance(owner);
    const receiverBalance = await token.accountBalance(receiver);

    expect(ownerBalance).to.be.a.bignumber.equal(
      (await token.TokenSupply()).sub(amount)
    );
    expect(receiverBalance).to.be.a.bignumber.equal(transferAmount);
  });

  it("should emit a TokenTransfer event when tokens are transferred", async () => {
    const amount = web3.utils.toWei("100");
    const fee = web3.utils.toWei("10");
    const transferAmount = web3.utils.toWei("90");

    const receipt = await token.transferTokens(receiver, amount);

    expect(receipt.logs.length).to.equal(1);
    expect(receipt.logs[0].event).to.equal("TokenTransfer");
    expect(receipt.logs[0].args.sender).to.equal(owner);
    expect(receipt.logs[0].args.receiver).to.equal(receiver);
    expect(receipt.logs[0].args.amount).to.be.a.bignumber.equal(transferAmount);
  });

  it("should revert if the receiver address is invalid", async () => {
    const amount = web3.utils.toWei("100");

    await expect(token.transferTokens("0x0000000000000000000000000000000000000000", amount)).to.be.revertedWith(
      "Invalid receiver address"
    );
  });

  it("should revert if the transfer amount is zero", async () => {
    const amount = web3.utils.toWei("0");

    await expect(token.transferTokens(receiver, amount)).to.be.revertedWith(
      "Transfer amount must be greater than zero"
    );
  });

  it("should revert if the sender balance is insufficient", async () => {
    const amount = web3.utils.toWei("1000001");

    await expect(token.transferTokens(receiver, amount)).to.be.revertedWith(
      "Insufficient balance"
    );
  });
});
