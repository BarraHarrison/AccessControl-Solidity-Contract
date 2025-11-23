// @ts-ignore
import { ethers } from "hardhat";

async function main() {
    const AccessControlSecurity = await ethers.getContractFactory("AccessControlSecurity");
    const contract = await AccessControlSecurity.deploy();

    await contract.deployed();

    console.log("AccessControlSecurity deployed at:", contract.address);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
