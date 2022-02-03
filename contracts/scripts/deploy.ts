// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers, upgrades } from "hardhat";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  const [deployer] = await ethers.getSigners();

  // We get the contract to deploy
  const Sapling = await ethers.getContractFactory("Sapling");
  const sapling = await upgrades.deployProxy(Sapling, []);
  await sapling.deployed();
    
  const Timelock = await ethers.getContractFactory('TimelockController');
  const minDelay = 3600;
  const proposers = [deployer.address];
  const executors = [deployer.address];
  const timelock = await Timelock.deploy(minDelay, proposers, executors);
  await timelock.deployed();
    
  const Governance = await ethers.getContractFactory('Governance')
  const governance = await Governance.deploy(sapling.address, timelock.address);
  await governance.deployed();

  const TreeRole = await ethers.getContractFactory('TreeRole')
  const treerole = await upgrades.deployProxy(TreeRole, []);
  await treerole.deployed();

  console.log("Sapling deployed to:", sapling.address);
  console.log("Governance deployed to:", governance.address);
  console.log("Timelock deployed to:", timelock.address);
  console.log("Treerole deployed to:", treerole.address);

  await timelock.grantRole("0xd8aa0f3194971a2a116679f7c2090f6939c8d4e01a2a8d7e41d55e5351469e63", governance.address);
  await timelock.grantRole("0xb09aa5aeb3702cfd50b6b62bc4532604938f21248a27a1d5ca736082b6819cc1", governance.address);
  await (sapling.delegate(deployer.address));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
