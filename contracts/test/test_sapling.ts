import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";

describe("Sapling", function () {
  it("Should give the creator the full market cap", async function () {
    const [owner, addr1] = await ethers.getSigners();

    const Sapling = await ethers.getContractFactory("Sapling");
    const sapling = await Sapling.deploy(owner.address);
    await sapling.deployed();

    const totalSupply = await sapling.totalSupply();

    expect(await sapling.totalSupply()).to.equal(await sapling.balanceOf(owner.address));

    await sapling.transfer(addr1.address, totalSupply.div(2));

    expect(await sapling.balanceOf(owner.address)).to.equal(totalSupply.div(2));
  });

  it("Should behave correctly when transferring Sapling", async function () {
    const [owner, addr1] = await ethers.getSigners();

    const Sapling = await ethers.getContractFactory("Sapling");
    const sapling = await Sapling.deploy(owner.address);
    await sapling.deployed();

    const totalSupply = await sapling.totalSupply();

    await sapling.transfer(addr1.address, totalSupply.div(2));

    expect(await sapling.balanceOf(owner.address)).to.equal(totalSupply.div(2));
    expect(await sapling.balanceOf(addr1.address)).to.equal(totalSupply.div(2));

    await expect(sapling.transfer(addr1.address, totalSupply))
        .to.be.revertedWith('Sapling::_transferTokens: transfer amount exceeds balance')

    await sapling.approve(addr1.address, BigNumber.from(100));

    await expect(sapling.connect(addr1).transferFrom(owner.address, addr1.address, 101))
        .to.be.revertedWith('Sapling::transferFrom: transfer amount exceeds spender allowance');

    await sapling.connect(addr1).transferFrom(owner.address, addr1.address, 100);

    expect(await sapling.balanceOf(addr1.address)).to.equal(totalSupply.div(2).add(BigNumber.from(100)));

    await expect(sapling.connect(addr1).transferFrom(owner.address, addr1.address, 1))
        .to.be.revertedWith('Sapling::transferFrom: transfer amount exceeds spender allowance');

  });
});
