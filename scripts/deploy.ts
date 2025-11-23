import { ethers } from "ethers";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

const PRIVATE_KEY = process.env.LOCAL_PRIVATE_KEY;

if (!PRIVATE_KEY) {
    throw new Error("❌ LOCAL_PRIVATE_KEY missing in .env file");
}

const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

async function main() {
    console.log("🚀 Deploying AccessControlSecurity contract...");

    const artifactPath = path.join(
        __dirname,
        "..",
        "artifacts",
        "contracts",
        "AccessControlSecurity.sol",
        "AccessControlSecurity.json"
    );

    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

    const factory = new ethers.ContractFactory(
        artifact.abi,
        artifact.bytecode,
        wallet
    );

    const contract = await factory.deploy();
    await contract.waitForDeployment();

    console.log("✅ Contract deployed at:", await contract.getAddress());
}

main().catch((err) => {
    console.error("❌ Deployment failed:", err);
    process.exit(1);
});
