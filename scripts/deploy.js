import hre from "hardhat";

async function main() {
    const { ethers } = hre;
    console.log("🚀 Deploying AccessControlSecurity contract...");

    const AccessControlSecurity = await ethers.getContractFactory("AccessControlSecurity");
    const contract = await AccessControlSecurity.deploy()

    console.log("⏳ Waiting for deployment confirmation...");
    await contract.waitForDeployment();

    const deployedAddress = await contract.getAddress();
    console.log(`✅ AccessControlSecurity deployed at: ${deployedAddress}`)
}

main().catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exitCode = 1;
});