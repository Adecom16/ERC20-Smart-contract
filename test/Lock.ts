import { expect } from "chai";
import { ethers } from "hardhat";
const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

import { ERC20Token } from "../typechain-types";

describe("ERC20Token", function () {

  
   
  async function deployERC20TokenContract() {
    const ERC20TokenContract = await ethers.getContractFactory("ERC20Token");
    const erc20TokenContract = await ERC20TokenContract.deploy();
    const [owner, receiver] = await ethers.getSigners();
    return { erc20TokenContract, owner, receiver };
  }

  beforeEach(async function () {
    await loadFixture(deployERC20TokenContract);
  });

  describe("Deployment", function () {
    it("Should deploy the ERC20Token contract", async function () {
      const { erc20TokenContract } = await loadFixture(deployERC20TokenContract);
      expect(erc20TokenContract.address).to.not.equal(0);
    });

    it("Should initialize with correct token details", async function () {
      const { erc20TokenContract } = await loadFixture(deployERC20TokenContract);
      expect(await erc20TokenContract.tokenName()).to.equal("AdeToken");
      expect(await erc20TokenContract.tokenSymbol()).to.equal("ATK");
      expect(await erc20TokenContract.decimal()).to.equal(18);
      expect(await erc20TokenContract.TokenSupply()).to.equal(1000000 * 10 ** 18);
      expect(await erc20TokenContract.accountBalance(owner.address)).to.equal(1000000 * 10 ** 18);
    });
  });

  describe("Functionality", function () {
    it("Should transfer tokens", async function () {
      const { erc20TokenContract, owner, receiver } = await loadFixture(deployERC20TokenContract);
      const initialBalanceOwner = await erc20TokenContract.accountBalance(owner.address);
      const initialBalanceReceiver = await erc20TokenContract.accountBalance(receiver.address);
      const amount = ethers.parseUnits("100", 18);

      await erc20TokenContract.connect(owner).transferTokens(receiver.address, amount);

      const finalBalanceOwner = await erc20TokenContract.accountBalance(owner.address);
      const finalBalanceReceiver = await erc20TokenContract.accountBalance(receiver.address);

      expect(finalBalanceOwner).to.equal(initialBalanceOwner.sub(amount));
      expect(finalBalanceReceiver).to.equal(initialBalanceReceiver.add(amount));
    });

    it("Should emit TokenTransfer event on token transfer", async function () {
      const { erc20TokenContract, owner, receiver } = await loadFixture(deployERC20TokenContract);
      const amount = ethers.parseUnits("100", 18);

      await expect(erc20TokenContract.connect(owner).transferTokens(receiver.address, amount))
        .to.emit(erc20TokenContract, "TokenTransfer")
        .withArgs(owner.address, receiver.address, amount);
    });

   it("Should calculate transfer fee correctly", async function () {
    const { erc20TokenContract, owner, receiver } = await deployERC20TokenContract();
    const amount = ethers.parseUnits("100", 18);

    // Set a fee rate of 5%
    await erc20TokenContract.setFeeRate(5); // Assuming you have a function to set the fee rate
    const transferFee = await erc20TokenContract.Fee(amount);

    expect(transferFee).to.equal(amount.div(20)); // 5% of the transfer amount
  });

  it("Should revert when transferring with insufficient balance", async function () {
    const { erc20TokenContract, owner, receiver } = await deployERC20TokenContract();
    const amount = ethers.parseUnits("2000000", 18); // Set an amount greater than the total supply

    await expect(erc20TokenContract.connect(owner).transferTokens(receiver.address, amount))
      .to.be.revertedWith("Insufficient balance");
  });

  it("Should revert when transferring to zero address", async function () {
    const { erc20TokenContract, owner } = await deployERC20TokenContract();
    const amount = ethers.parseUnits("100", 18);

    await expect(erc20TokenContract.connect(owner).transferTokens("0x0000000000000000000000000000000000000000", amount))
      .to.be.revertedWith("Invalid receiver address");
  });

  it("Should revert when transferring zero amount", async function () {
    const { erc20TokenContract, owner, receiver } = await deployERC20TokenContract();
    const amount = ethers.parseUnits("0", 18); // Zero amount

    await expect(erc20TokenContract.connect(owner).transferTokens(receiver.address, amount))
      .to.be.revertedWith("Transfer amount must be greater than zero");
  });

  it("Should emit TokenTransfer event on token transfer", async function () {
    const { erc20TokenContract, owner, receiver } = await deployERC20TokenContract();
    const amount = ethers.parseUnits("100", 18);

    await expect(erc20TokenContract.connect(owner).transferTokens(receiver.address, amount))
      .to.emit(erc20TokenContract, "TokenTransfer")
      .withArgs(owner.address, receiver.address, amount);
  });

  it("Should update recipient balance correctly after transfer", async function () {
    const { erc20TokenContract, owner, receiver } = await deployERC20TokenContract();
    const amount = ethers.parseUnits("100", 18);

    await erc20TokenContract.connect(owner).transferTokens(receiver.address, amount);
    const receiverBalance = await erc20TokenContract.accountBalance(receiver.address);

    expect(receiverBalance).to.equal(amount);
  });

  it("Should deduct fee from sender's balance during transfer", async function () {
    const { erc20TokenContract, owner, receiver } = await deployERC20TokenContract();
    const amount = ethers.parseUnits("100", 18);

    // Set a fee rate of 5%
    await erc20TokenContract.setFeeRate(5); // Assuming you have a function to set the fee rate
    const transferFee = await erc20TokenContract.Fee(amount);
    const initialBalance = await erc20TokenContract.accountBalance(owner.address);

    await erc20TokenContract.connect(owner).transferTokens(receiver.address, amount);
    const finalBalance = await erc20TokenContract.accountBalance(owner.address);

    expect(finalBalance).to.equal(initialBalance.sub(amount).sub(transferFee));
  });
  });
});
