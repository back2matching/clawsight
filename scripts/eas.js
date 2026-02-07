require("dotenv").config();
const { ethers } = require("ethers");
const {
  EAS,
  SchemaRegistry,
  SchemaEncoder,
  NO_EXPIRATION,
} = require("@ethereum-attestation-service/eas-sdk");

const RPC_URL = "https://sepolia.base.org";
const EAS_ADDRESS = "0x4200000000000000000000000000000000000021";
const SCHEMA_REGISTRY_ADDRESS = "0x4200000000000000000000000000000000000020";

const SCHEMA =
  "string agentName, address agentWallet, uint256 reputationScore, uint256 karma, uint256 followers, string platform";

// Demo agents for attestations
const DEMO_AGENTS = [
  {
    agentName: "agent_alpha",
    reputationScore: 750,
    karma: 100,
    followers: 50,
    platform: "moltbook",
  },
  {
    agentName: "agent_beta",
    reputationScore: 420,
    karma: 60,
    followers: 30,
    platform: "moltbook",
  },
  {
    agentName: "agent_gamma",
    reputationScore: 920,
    karma: 200,
    followers: 100,
    platform: "moltbook",
  },
];

async function main() {
  // Setup provider and signer
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const signer = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY, provider);
  console.log("Using wallet:", signer.address);

  const balance = await provider.getBalance(signer.address);
  console.log("ETH balance:", ethers.formatEther(balance));

  // Step 1: Register schema
  const schemaRegistryBase = new SchemaRegistry(SCHEMA_REGISTRY_ADDRESS);
  const schemaRegistry = schemaRegistryBase.connect(signer);

  let schemaUID;
  try {
    console.log("\nRegistering EAS schema...");
    console.log("Schema:", SCHEMA);

    const tx = await schemaRegistry.register({
      schema: SCHEMA,
      resolverAddress: "0x0000000000000000000000000000000000000000",
      revocable: true,
    });
    schemaUID = await tx.wait();
    console.log("Schema registered!");
    console.log("Schema UID:", schemaUID);
  } catch (err) {
    // If schema already exists, the contract reverts.
    // We can compute the UID deterministically: keccak256(abi.encodePacked(schema, resolver, revocable))
    // However the exact encoding used by SchemaRegistry may differ.
    // A safer approach: parse the UID from the error or compute it the same way the contract does.
    console.log("Schema registration failed:", err.message?.slice(0, 200));
    console.log(
      "\nSchema may already be registered. Attempting to compute UID..."
    );

    // The SchemaRegistry computes UID as: keccak256(abi.encodePacked(schema, resolverAddress, revocable))
    // Using solidityPackedKeccak256 for the packed encoding
    schemaUID = ethers.solidityPackedKeccak256(
      ["string", "address", "bool"],
      [SCHEMA, "0x0000000000000000000000000000000000000000", true]
    );
    console.log("Computed Schema UID:", schemaUID);
  }

  console.log(
    `View schema: https://base-sepolia.easscan.org/schema/view/${schemaUID}`
  );

  // Step 2: Create attestations for demo agents
  const easBase = new EAS(EAS_ADDRESS);
  const eas = easBase.connect(signer);

  const schemaEncoder = new SchemaEncoder(SCHEMA);
  const attestationUIDs = [];

  for (const agent of DEMO_AGENTS) {
    console.log(`\nCreating attestation for ${agent.agentName}...`);
    console.log(
      `  Score: ${agent.reputationScore}, Karma: ${agent.karma}, Followers: ${agent.followers}`
    );

    const encodedData = schemaEncoder.encodeData([
      { name: "agentName", value: agent.agentName, type: "string" },
      { name: "agentWallet", value: signer.address, type: "address" },
      {
        name: "reputationScore",
        value: BigInt(agent.reputationScore),
        type: "uint256",
      },
      { name: "karma", value: BigInt(agent.karma), type: "uint256" },
      { name: "followers", value: BigInt(agent.followers), type: "uint256" },
      { name: "platform", value: agent.platform, type: "string" },
    ]);

    const tx = await eas.attest({
      schema: schemaUID,
      data: {
        recipient: signer.address,
        expirationTime: NO_EXPIRATION,
        revocable: true,
        data: encodedData,
      },
    });

    const attestationUID = await tx.wait();
    attestationUIDs.push(attestationUID);
    console.log(`  Attestation UID: ${attestationUID}`);
    console.log(
      `  https://base-sepolia.easscan.org/attestation/view/${attestationUID}`
    );

    // Delay between attestations to avoid RPC rate limiting
    if (DEMO_AGENTS.indexOf(agent) < DEMO_AGENTS.length - 1) {
      console.log("  Waiting 5s before next attestation...");
      await new Promise((r) => setTimeout(r, 5000));
    }
  }

  // Summary
  console.log("\n=== EAS Attestation Summary ===");
  console.log(`Schema UID: ${schemaUID}`);
  console.log(
    `Schema URL: https://base-sepolia.easscan.org/schema/view/${schemaUID}`
  );
  console.log(`Attestations created: ${attestationUIDs.length}`);
  for (let i = 0; i < attestationUIDs.length; i++) {
    console.log(
      `  ${DEMO_AGENTS[i].agentName}: https://base-sepolia.easscan.org/attestation/view/${attestationUIDs[i]}`
    );
  }
  console.log("\nDone!");
}

main().catch((err) => {
  console.error("Error:", err);
  process.exitCode = 1;
});
