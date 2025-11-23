const { expect } = require("chai");
const hre = require("hardhat");

describe("AccessControlSecurity – Deployment & Roles", function () {
    let deployer;
    let user1;
    let user2;
    let contract;

    let PAUSER_ROLE;
    let FREEZER_ROLE;
    let BLACKLISTER_ROLE;
    let DEFAULT_ADMIN_ROLE;

    before(async () => {
        const accounts = await hre.network.provider.send("eth_accounts");
        deployer = accounts[0];
        user1 = accounts[1];
        user2 = accounts[2];
    });

    beforeEach(async () => {
        const factory = await hre.ethers.getContractFactory("AccessControlSecurity");
        contract = await factory.deploy();
        await contract.waitForDeployment();

        PAUSER_ROLE = await contract.PAUSER_ROLE();
        FREEZER_ROLE = await contract.FREEZER_ROLE();
        BLACKLISTER_ROLE = await contract.BLACKLISTER_ROLE();
        DEFAULT_ADMIN_ROLE = await contract.DEFAULT_ADMIN_ROLE();
    });

    it("Should deploy and set DEFAULT_ADMIN_ROLE on deployer", async () => {
        const hasAdmin = await contract.hasRole(DEFAULT_ADMIN_ROLE, deployer);
        expect(hasAdmin).to.equal(true);
    });

    it("Should have valid role identifiers", async () => {
        expect(PAUSER_ROLE).to.be.a("string");
        expect(FREEZER_ROLE).to.be.a("string");
        expect(BLACKLISTER_ROLE).to.be.a("string");
        expect(DEFAULT_ADMIN_ROLE).to.be.a("string");

        expect(PAUSER_ROLE.length).to.equal(66);
    });

    it("Admin should be able to grant PAUSER_ROLE", async () => {
        const admin = contract.connect(await hre.ethers.getSigner(deployer));
        await admin.grantRole(PAUSER_ROLE, user1);
        expect(await contract.hasRole(PAUSER_ROLE, user1)).to.equal(true);
    });

    it("Non-admin should NOT be able to grant roles", async () => {
        const user = contract.connect(await hre.ethers.getSigner(user1));
        await expect(user.grantRole(PAUSER_ROLE, user2)).to.be.rejected;
    });

    it("Admin should be able to revoke PAUSER_ROLE", async () => {
        const admin = contract.connect(await hre.ethers.getSigner(deployer));
        await admin.grantRole(PAUSER_ROLE, user1);
        expect(await contract.hasRole(PAUSER_ROLE, user1)).to.equal(true);

        await admin.revokeRole(PAUSER_ROLE, user1);
        expect(await contract.hasRole(PAUSER_ROLE, user1)).to.equal(false);
    });

    it("Non-admin should NOT be able to revoke roles", async () => {
        const admin = contract.connect(await hre.ethers.getSigner(deployer));
        const user = contract.connect(await hre.ethers.getSigner(user1));

        await admin.grantRole(PAUSER_ROLE, user2);
        await expect(user.revokeRole(PAUSER_ROLE, user2)).to.be.rejected;
    });
});
