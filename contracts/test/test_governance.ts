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

describe("Governance", function () {
    let sapling : Contract;
    let timelock : Contract;
    let governance : Contract;
    let owner : SignerWithAddress;
    let addr1 : SignerWithAddress;
    let addr2 : SignerWithAddress;
    let now : number;

    beforeEach(async () => {
        [owner, addr1, addr2] = await ethers.getSigners();

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
        await (sapling.delegate(owner.address));
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
        expect(await waffle.provider.getBalance(timelock.address)).to.equal(ethers.utils.parseEther("0"));
        await owner.sendTransaction({
            to: timelock.address,
            value: ethers.utils.parseEther("0.5")
        });
        expect(await waffle.provider.getBalance(timelock.address)).to.equal(ethers.utils.parseEther("0.5"));

        expect(await sapling.balanceOf(owner.address)).to.equal(ethers.utils.parseEther("500000"))

        await sapling.transfer(timelock.address, ethers.utils.parseEther("10000.0"));

        now = (await ethers.provider.getBlock("latest")).timestamp;
        await ethers.provider.send("evm_mine", [now + 72*3600]);

        //address[] memory targets, uint256[] memory values, bytes[] memory calldatas, string memory description
        let targets = [sapling.address, owner.address];
        let values = [0, ethers.utils.parseEther("0.5")];
        let cd1 = parseCallData("transfer", "function transfer(address to, uint256 amount)", [owner.address, ethers.utils.parseEther("10000.0")]);
        let cd2 = parseCallData("send", "function send(uint256 amount)", [ethers.utils.parseEther("0.5")]);
        let calldatas = [cd1, cd2]
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

        // mine 5 blocks
        await network.provider.send("evm_mine");
        await network.provider.send("evm_mine");
        await network.provider.send("evm_mine");
        await network.provider.send("evm_mine");
        await network.provider.send("evm_mine");

        // Expect vote to pass (ProposalState.Succeeded = 4)
        expect(await governance.state(proposalId)).to.equal(4);

        const descHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(description));
        await governance.queue(targets, values, calldatas, descHash);

        now = (await ethers.provider.getBlock("latest")).timestamp;
        await ethers.provider.send("evm_mine", [now + 3600]);

        const ownerEth = await waffle.provider.getBalance(owner.address);

        await governance.execute(targets, values, calldatas, descHash);

        expect(await sapling.balanceOf(timelock.address)).to.equal(ethers.utils.parseEther("0"));
        expect(await waffle.provider.getBalance(timelock.address)).to.equal(ethers.utils.parseEther("0"));

        const newOwnerEth = await waffle.provider.getBalance(owner.address)
        expect(bigToNum(newOwnerEth)).to.be.greaterThan(bigToNum(ownerEth.add(toBig("0.49"))));
    });

    it("Should not allow voting, then moving tokens and voting again.", async () => {

        now = (await ethers.provider.getBlock("latest")).timestamp;
        await ethers.provider.send("evm_mine", [now + 72*3600]);

        //address[] memory targets, uint256[] memory values, bytes[] memory calldatas, string memory description
        let targets = [sapling.address];
        let values = [0];
        let cd1 = parseCallData("transfer", "function transfer(address to, uint256 amount)", [owner.address, ethers.utils.parseEther("10000.0")]);
        let calldatas = [cd1]
        let description = "Second Proposal!"
        const tx = await governance.connect(addr1).propose(targets, values, calldatas, description);
        // Fetch proposal ID
        const res = await tx.wait();
        const proposalId = res.events[0].args[0];

        // Let some time expire
        now = (await ethers.provider.getBlock("latest")).timestamp;
        await ethers.provider.send("evm_mine", [now + 1]);

        // Vote yes 50%
        await governance.castVote(proposalId, 1);
        // Now move tokens to addr2 and delegate to self
        await sapling.transfer(addr2.address, toBig("500000"));
        await sapling.connect(addr2).delegate(addr2.address);
        // Now try to vote
        await governance.connect(addr2).castVote(proposalId, 1);
        // Let addr1 vote against
        await governance.connect(addr1).castVote(proposalId, 0);

        // mine 5 blocks
        await network.provider.send("evm_mine");
        await network.provider.send("evm_mine");
        await network.provider.send("evm_mine");
        await network.provider.send("evm_mine");
        await network.provider.send("evm_mine");

        // Expect vote to fail (ProposalState.Defeated = 3)
        expect(await governance.state(proposalId)).to.equal(3);
    });
});