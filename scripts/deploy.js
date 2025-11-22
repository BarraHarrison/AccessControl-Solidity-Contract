import hre from "hardhat";

async function main() {
    const { ethers } = hre;
    console.log("🚀 Deploying AccessControlSecurity contract...");

    await hre.run("compile");

    const AccessControlSecurity = await ethers.deployContract("AccessControlSecurity");
    console.log("⏳ Waiting for deployment confirmation...");
    await AccessControlSecurity.waitForDeployment();

    const deployedAddress = await AccessControlSecurity.getAddress();
    console.log(`✅ AccessControlSecurity deployed at: ${deployedAddress}`)
}

main().catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exitCode = 1;
});