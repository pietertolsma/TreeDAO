import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber, Contract } from "ethers";
import { soliditySha256 } from "ethers/lib/utils";
import { ethers, network, upgrades } from "hardhat";

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
        sapling = await upgrades.deployProxy(Sapling, []);
        await sapling.deployed();
    
        const Timelock = await ethers.getContractFactory('TimelockController');
        const minDelay = 3600;
        const proposers = [owner.address];
        const executors = [owner.address];
        timelock = await Timelock.deploy(minDelay, proposers, executors);
        await timelock.deployed();
    
        const Governance = await ethers.getContractFactory('TestGovernance')
        governance = await Governance.deploy(sapling.address, timelock.address);
        await governance.deployed();

        await (sapling.transfer(addr1.address, ethers.utils.parseEther("500000")));

        // Checkpoints require us to delegate to ourselves
        await (sapling.delegate(owner.address,));
        await (sapling.connect(addr1).delegate(addr1.address));

        await timelock.grantRole("0xd8aa0f3194971a2a116679f7c2090f6939c8d4e01a2a8d7e41d55e5351469e63", governance.address);
        await timelock.grantRole("0xb09aa5aeb3702cfd50b6b62bc4532604938f21248a27a1d5ca736082b6819cc1", governance.address);

        // now = (await ethers.provider.getBlock("latest")).timestamp;
        // await ethers.provider.send("evm_mine", [now + 72*3600]);
    });

    it("Should have set the total supply to 1 million", async () => {
        expect(await sapling.totalSupply()).to.equal(ethers.utils.parseEther("1000000"));
    })

    it("Should succesfully execute a passed proposal", async () => {
        expect(await sapling.balanceOf(owner.address)).to.equal(ethers.utils.parseEther("500000"))

        await sapling.transfer(timelock.address, ethers.utils.parseEther("10000.0"));

        now = (await ethers.provider.getBlock("latest")).timestamp;
        await ethers.provider.send("evm_mine", [now + 72*3600]);

        //address[] memory targets, uint256[] memory values, bytes[] memory calldatas, string memory description
        let targets = [sapling.address];
        let values = [0];
        let abiCode = ["function transfer(address to, uint256 amount)"]
        let iface = new ethers.utils.Interface(abiCode);
        let calldata = iface.encodeFunctionData("transfer", [owner.address, ethers.utils.parseEther("10000.0")]);
        let calldatas = [calldata]
        let description = "First Proposal!"
        const tx = await governance.connect(addr1).propose(targets, values, calldatas, description);
        // Fetch proposal ID
        const res = await tx.wait();
        const proposalId = res.events[0].args[0];

        // Let some time expire
        now = (await ethers.provider.getBlock("latest")).timestamp;
        await ethers.provider.send("evm_mine", [now + 1]);

        // Vote yes 100%
        await governance.castVote(proposalId, 1);
        await governance.connect(addr1).castVote(proposalId, 1);

        // mine 2 blocks
        await network.provider.send("evm_mine");
        await network.provider.send("evm_mine");

        // Expect vote to pass (ProposalState.Succeeded = 4)
        expect(await governance.state(proposalId)).to.equal(4);

        // console.log(timelock.address);
        // console.log(owner.address);
        // console.log(addr1.address);
        // console.log(governance.address);
        // now = (await ethers.provider.getBlock("latest")).timestamp;
        // await ethers.provider.send("evm_mine", [now + 3600]);

        const descHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(description));
        await governance.queue(targets, values, calldatas, descHash);

        now = (await ethers.provider.getBlock("latest")).timestamp;
        await ethers.provider.send("evm_mine", [now + 3600]);

        await governance.execute(targets, values, calldatas, descHash);
    });
});


// ======================================
// ==== OLD CODE FROM GovernorAlpha.sol ===
// ======================================
// describe("Governance", function () {

//     let sapling : Contract;
//     let timelock : Contract;
//     let governance : Contract;
//     let owner : SignerWithAddress;
//     let addr1 : SignerWithAddress;
//     let now : number;

//     beforeEach(async () => {
//         [owner, addr1] = await ethers.getSigners();

//         const Sapling = await ethers.getContractFactory("Sapling");
//         sapling = await Sapling.deploy(owner.address);
//         await sapling.deployed();
    
//         const Timelock = await ethers.getContractFactory('Timelock');
//         timelock = await Timelock.deploy(owner.address, 48*3600);
//         await timelock.deployed();
    
//         const Governance = await ethers.getContractFactory('Governance')
//         governance = await Governance.deploy(timelock.address, sapling.address, owner.address);
//         await governance.deployed();

//         now = (await ethers.provider.getBlock("latest")).timestamp;

//         await network.provider.send("evm_increaseTime", [49*3600]);
//         await network.provider.send("evm_mine");

//         now = now + 49*3600;
//         const eta = now + 100*3600;
//         let ABI = new ethers.utils.AbiCoder();
//         let calldata = ABI.encode(['address'], [governance.address]);

//         await timelock.queueTransaction(timelock.address, 0, "setPendingAdmin(address)", calldata, eta);
//         await network.provider.send("evm_increaseTime", [100*3600]);
//         await network.provider.send("evm_mine");
//         now = now + 100*3600;

//        // now = now + 52*3600
//         await timelock.executeTransaction(timelock.address, 0, "setPendingAdmin(address)", calldata, eta);

//         expect(await timelock.pendingAdmin()).to.equal(governance.address);

//         await governance.__acceptAdmin();

//         //await timelock.acceptAdmin();

//         expect(await timelock.admin()).to.equal(governance.address);

//         await sapling.transfer(addr1.address, (await sapling.totalSupply()).div(1));

//         await sapling.connect(addr1).delegate(owner.address);

//         expect(await sapling.balanceOf(addr1.address)).to.equal((await sapling.totalSupply()).div(1));

//         // // Increase block count for governance and timelock
//         // await network.provider.send("evm_increaseTime", [1*3600])
//         // await network.provider.send("evm_mine")

//         // // Now make a proposal to let governance contract become admin
//         // const targets = [timelock.address];
//         // const values = [0];
//         // const signatures = ["acceptAdmin()"];
//         // const calldatas = [0];
//         // const description = "Accept admin!";

//         // await governance.propose(targets, values, signatures, calldatas, description);
//         // expect(await governance.state(1)).to.equal(0);
//         // await network.provider.send("evm_increaseTime", [3600]);
//         // await network.provider.send("evm_mine");
//         // now = now + 3600;

//         // await expect(governance.castVote(1, true))
//         //     .to.emit(governance, 'VoteCast')
//         //     .withArgs(owner.address, 1, true, await sapling.totalSupply());

//         // await ethers.provider.send("evm_mine", [now + 72*3600]);
//         // now = now + 72*3600;

//         // expect(await governance.state(1)).to.equal(4);

//     });

//     it("Should succesfully make a proposal and execute it", async function () {

//         //sapling.connect(addr1).transfer(timelock.address, 200);
//         const startBalance = await owner.provider?.getBalance(owner.address) || BigNumber.from(0);
//         const txHash = await owner.sendTransaction({to: timelock.address, value: ethers.utils.parseEther("300")});
//         const newBalance = await owner.provider?.getBalance(owner.address) || BigNumber.from(0);
//         expect(parseInt(ethers.utils.formatEther(newBalance.toString()))).to.be.lessThan(parseInt(ethers.utils.formatEther(startBalance.toString())));

//         const targets = [owner.address];
//         const values = [ethers.utils.parseUnits("100", "ether")];
//         const signatures = ["receive()"];
//         let ABI = new ethers.utils.AbiCoder();
//         const calldatas = [ABI.encode([], [])];
//         const description = "Hello World!";

//         await governance.propose(targets, values, signatures, calldatas, description);
//         //expect(await governance.state(1)).to.equal(0);
//         await network.provider.send("evm_increaseTime", [3600])
//         await network.provider.send("evm_mine")
        
//         await expect(governance.castVote(1, true))
//             .to.emit(governance, 'VoteCast')
//             .withArgs(owner.address, 1, true, (await sapling.totalSupply()));
        
//         // Check of proposal is active
//         expect(await governance.state(1)).to.equal(1);

//         // Fast forward 72 hours
//         let now = (await ethers.provider.getBlock("latest")).timestamp;
//         await ethers.provider.send("evm_mine", [now + 72*3600]);

//         // Check if state = Succeeded
//         expect(await governance.state(1)).to.equal(4);

//         await governance.queue(1);
//         now = (await ethers.provider.getBlock("latest")).timestamp;
//         await ethers.provider.send("evm_mine", [now + 48*3600]);
//         await governance.execute(1);
//     });
// });
