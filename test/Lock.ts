import { expect } from "chai";
import { ethers } from "hardhat";
import { ERC20Token } from "../typechain-types";

async function deployERC20TokenContract(): Promise<{ erc20TokenContract: ERC20Token & { address: string }, owner: ethers.Signer, receiver: ethers.Signer }> {
  const ERC20TokenContractFactory: ContractFactory = await ethers.getContractFactory("ERC20Token");
  const erc20TokenContract: Contract & { address: string } = await ERC20TokenContractFactory.deploy();
  await erc20TokenContract.deployed();

  const [owner, receiver] = await ethers.getSigners();

  return { erc20TokenContract: erc20TokenContract as ERC20Token & { address: string }, owner, receiver };
}

describe("ERC20Token", function () {
  async function deployERC20TokenContract() {
    const ERC20TokenContract = await ethers.getContractFactory("ERC20Token");
    const erc20TokenContract = await ERC20TokenContract.deploy();
    const [owner, receiver] = await ethers.getSigners();
    return { erc20TokenContract, owner, receiver };
  }

  beforeEach(async function () {
    await deployERC20TokenContract();
  });

  describe("Deployment", function () {
    it("Should deploy the ERC20Token contract", async function () {
      const { erc20TokenContract } = await deployERC20TokenContract();
      expect(erc20TokenContract.address).to.not.equal(0);
    });

    it("Should initialize with correct token details", async function () {
      const { erc20TokenContract, owner } = await deployERC20TokenContract();
      expect(await erc20TokenContract.tokenName()).to.equal("AdeToken");
      expect(await erc20TokenContract.tokenSymbol()).to.equal("ATK");
      expect(await erc20TokenContract.decimal()).to.equal(18);
      expect(await erc20TokenContract.TokenSupply()).to.equal(1000000 * 10 ** 18);
      expect(await erc20TokenContract.accountBalance(owner.address)).to.equal(1000000 * 10 ** 18);
    });
  });

  describe("Functionality", function () {
    it("Should emit TokenTransfer event on token transfer", async function () {
      const { erc20TokenContract, owner, receiver } = await deployERC20TokenContract();
      const amount = ethers.utils.parseUnits("100", 18);

      await expect(erc20TokenContract.connect(owner).transferTokens(receiver.address, amount))
        .to.emit(erc20TokenContract, "TokenTransfer")
        .withArgs(owner.address, receiver.address, amount);
    });

   
  });
});
