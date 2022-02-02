import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber, Contract } from "ethers";
import { soliditySha256 } from "ethers/lib/utils";
import { ethers, network } from "hardhat";

describe("Governance", function () {

    let sapling : Contract;
    let timelock : Contract;
    let governance : Contract;
    let owner : SignerWithAddress;
    let addr1 : SignerWithAddress;
    let now : number;

    beforeEach(async () => {
        [owner, addr1] = await ethers.getSigners();

        const Sapling = await ethers.getContractFactory("Sapling");
        sapling = await Sapling.deploy(owner.address);
        await sapling.deployed();
    
        const Timelock = await ethers.getContractFactory('Timelock');
        timelock = await Timelock.deploy(owner.address, 48*3600);
        await timelock.deployed();
    
        const Governance = await ethers.getContractFactory('Governance')
        governance = await Governance.deploy(timelock.address, sapling.address, owner.address);
        await governance.deployed();

        now = (await ethers.provider.getBlock("latest")).timestamp;

        await network.provider.send("evm_increaseTime", [49*3600]);
        await network.provider.send("evm_mine");

        now = now + 49*3600;
        const eta = now + 100*3600;
        let ABI = new ethers.utils.AbiCoder();
        let calldata = ABI.encode(['address'], [governance.address]);

        await timelock.queueTransaction(timelock.address, 0, "setPendingAdmin(address)", calldata, eta);
        await network.provider.send("evm_increaseTime", [100*3600]);
        await network.provider.send("evm_mine");
        now = now + 100*3600;

       // now = now + 52*3600
        await timelock.executeTransaction(timelock.address, 0, "setPendingAdmin(address)", calldata, eta);

        expect(await timelock.pendingAdmin()).to.equal(governance.address);

        await governance.__acceptAdmin();

        //await timelock.acceptAdmin();

        expect(await timelock.admin()).to.equal(governance.address);

        await sapling.transfer(addr1.address, (await sapling.totalSupply()).div(1));

        await sapling.connect(addr1).delegate(owner.address);

        expect(await sapling.balanceOf(addr1.address)).to.equal((await sapling.totalSupply()).div(1));

        // // Increase block count for governance and timelock
        // await network.provider.send("evm_increaseTime", [1*3600])
        // await network.provider.send("evm_mine")

        // // Now make a proposal to let governance contract become admin
        // const targets = [timelock.address];
        // const values = [0];
        // const signatures = ["acceptAdmin()"];
        // const calldatas = [0];
        // const description = "Accept admin!";

        // await governance.propose(targets, values, signatures, calldatas, description);
        // expect(await governance.state(1)).to.equal(0);
        // await network.provider.send("evm_increaseTime", [3600]);
        // await network.provider.send("evm_mine");
        // now = now + 3600;

        // await expect(governance.castVote(1, true))
        //     .to.emit(governance, 'VoteCast')
        //     .withArgs(owner.address, 1, true, await sapling.totalSupply());

        // await ethers.provider.send("evm_mine", [now + 72*3600]);
        // now = now + 72*3600;

        // expect(await governance.state(1)).to.equal(4);

    });

    it("Should succesfully make a proposal and execute it", async function () {

        //sapling.connect(addr1).transfer(timelock.address, 200);
        const startBalance = await owner.provider?.getBalance(owner.address) || BigNumber.from(0);
        console.log(startBalance);
        var options = {
            gasLimit: 150000,
            gasPrice: ethers.utils.parseUnits('10.0', 'gwei')
        };
        
        // You can also pass in one additional options to override defaults
        owner.transfer(fromAddress, toAddress, ethers.utils.bigNumberify(0), options);
        const newBalance = await owner.provider?.getBalance(owner.address) || BigNumber.from(0);
        expect(parseInt(ethers.utils.formatEther(newBalance.toString()))).to.be.greaterThan(parseInt(ethers.utils.formatEther(startBalance.toString())));

        const targets = [addr1.address];
        const values = [200];
        const signatures = [""];
        let ABI = new ethers.utils.AbiCoder();
        const calldatas = [0];
        const description = "Hello World!";

        await governance.propose(targets, values, signatures, calldatas, description);
        //expect(await governance.state(1)).to.equal(0);
        await network.provider.send("evm_increaseTime", [3600])
        await network.provider.send("evm_mine")
        
        await expect(governance.castVote(1, true))
            .to.emit(governance, 'VoteCast')
            .withArgs(owner.address, 1, true, (await sapling.totalSupply()));
        
        // Check of proposal is active
        expect(await governance.state(1)).to.equal(1);

        // Fast forward 72 hours
        let now = (await ethers.provider.getBlock("latest")).timestamp;
        await ethers.provider.send("evm_mine", [now + 72*3600]);

        // Check if state = Succeeded
        expect(await governance.state(1)).to.equal(4);

        await governance.queue(1);
        now = (await ethers.provider.getBlock("latest")).timestamp;
        await ethers.provider.send("evm_mine", [now + 48*3600]);
        await governance.execute(1);
    });
});
