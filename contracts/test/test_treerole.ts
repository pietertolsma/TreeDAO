import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber, Contract } from "ethers";
import { soliditySha256 } from "ethers/lib/utils";
import { ethers, network, upgrades, waffle } from "hardhat";

const parseCallData = (functionName : string, signature : string, parameters : any[]) : string => {
    let abiCode = [signature]
    let iface = new ethers.utils.Interface(abiCode);
    return iface.encodeFunctionData(functionName, parameters);
}

const toBig = (val : string) : BigNumber => {
    return ethers.utils.parseEther(val);
}

const bigToNum = (big : BigNumber) : number => {
    return parseFloat(ethers.utils.formatEther(big));
}

describe("TreeRole", function () {
    let treerole : Contract;
    let owner : SignerWithAddress;
    let addr1 : SignerWithAddress;
    let addr2 : SignerWithAddress;

    beforeEach(async () => {
        [owner, addr1, addr2] = await ethers.getSigners();

        const Treerole = await ethers.getContractFactory("TreeRole");
        treerole = await upgrades.deployProxy(Treerole, []);
        await treerole.deployed();
    });

    it("Should succesfully mint a membership role", async () => {
        expect(await treerole.mintMembership()).to.emit(treerole, "MembershipMinted");
        expect(await treerole.balanceOf(owner.address, 0)).to.equal(1);

        await expect(treerole.mintMembership()).to.be.revertedWith('TreeRole::mintMembership: minter is already a member');
    });
});