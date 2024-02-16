

import { ethers } from "hardhat";
import { expect } from "chai";

describe("ERC20Token", function () {
    let ERC20Token;
    let erc20Token;
    let owner;
    let addr1;
    let addr2;

    beforeEach(async function () {
        ERC20Token = await ethers.getContractFactory("ERC20Token");
        [owner, addr1, addr2] = await ethers.getSigners();
        erc20Token = await ERC20Token.deploy();
    });

    it("Should have correct token metadata", async function () {
        expect(await erc20Token.tokenName()).to.equal("AdeToken");
        expect(await erc20Token.tokenSymbol()).to.equal("ATK");
        expect(await erc20Token.decimal()).to.equal(18);
    });

    it("Should transfer tokens", async function () {
        const initialBalanceOwner = await erc20Token.accountBalance(owner.address);
        const transferAmount = ethers.parseEther("100"); // Convert to Ether
        await erc20Token.transferTokens(addr1.address, transferAmount);
        const finalBalanceOwner = await erc20Token.accountBalance(owner.address);
        const finalBalanceAddr1 = await erc20Token.accountBalance(addr1.address);

        expect(finalBalanceOwner).to.equal(initialBalanceOwner.sub(transferAmount));
        expect(finalBalanceAddr1).to.equal(transferAmount);
    });

    it("Should deposit tokens", async function () {
        const depositAmount = ethers.parseEther("100"); // Convert to Ether
        await erc20Token.depositTokens(depositAmount);
        const finalBalanceOwner = await erc20Token.accountBalance(owner.address);

        expect(finalBalanceOwner).to.equal(depositAmount);
    });

it("Should transfer tokens", async function () {
    const initialBalanceOwner = await erc20Token.balanceOf(owner.address);
    const transferAmount = 100;
    await erc20Token.transferTokens(addr1.address, transferAmount);
    const finalBalanceOwner = await erc20Token.balanceOf(owner.address);
    const finalBalanceAddr1 = await erc20Token.balanceOf(addr1.address);

    expect(finalBalanceOwner).to.equal(initialBalanceOwner - transferAmount);
    expect(finalBalanceAddr1).to.equal(transferAmount);
});



    it("Should approve allowance", async function () {
        const approvalAmount = ethers.parseEther("100"); // Convert to Ether
        await erc20Token.approve(addr1.address, approvalAmount);
        const allowance = await erc20Token.allowances(owner.address, addr1.address);

        expect(allowance).to.equal(approvalAmount);
    });

});
