import { ethers } from "hardhat";

async function main() {


  const erc20token = await ethers.deployContract("ERC20Token");

  await erc20token.waitForDeployment();

  console.log(
  `Erc20 Token deployed to ${erc20token.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
