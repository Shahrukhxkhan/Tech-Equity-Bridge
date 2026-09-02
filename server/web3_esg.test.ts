import { describe, it, expect } from "vitest";
import * as web3EsgEngine from "./web3EsgEngine";

describe("Verifiable ESG, Zero-Knowledge SLA Proofs & W3C DIDs", () => {
  it("should retrieve W3C Verifiable Credentials and cryptographically verify signature", async () => {
    const creds = web3EsgEngine.getVerifiableCredentialsList();
    expect(creds.length).toBeGreaterThanOrEqual(2);

    const firstCred = creds[0];
    expect(firstCred.credentialSubject.id).toMatch(/^did:key:/);
    expect(firstCred.credentialSubject.vettedNonprofitStatus).toBe(true);

    const verification = await web3EsgEngine.verifyVerifiableCredential(firstCred.id);
    expect(verification.valid).toBe(true);
    expect(verification.cryptographicProofVerified).toBe(true);
    expect(verification.signatureType).toBe("Ed25519Signature2020");
  });

  it("should generate privacy-preserving zk-SNARK SLA compute proof without leaking server internals", async () => {
    const newProof = await web3EsgEngine.generateZkComputeProof(
      "Nexus DeepMind Labs",
      "NVIDIA A100 GPU Cluster Allocation",
      { uptimePct: 99.9, p95LatencyMs: 290, throughputTokPerSec: 180 }
    );

    expect(newProof).toBeDefined();
    expect(newProof.proofId).toMatch(/^ZK-PROOF-SLA-/);
    expect(newProof.isValid).toBe(true);
    expect(newProof.zkProofPayload.protocol).toBe("Groth16");
    expect(newProof.zkProofPayload.curve).toBe("BN254");
    expect(newProof.verificationHash).toMatch(/^0xzk_sla_/);
    expect(newProof.provenClaims.confidentialityPreserved).toBe(true);

    const circuitCheck = await web3EsgEngine.verifyZkSlaProof(newProof.proofId);
    expect(circuitCheck.verified).toBe(true);
  });

  it("should calculate clean energy equivalents and mint on-chain carbon offset receipt", async () => {
    const receipt = await web3EsgEngine.mintCarbonOffsetCertificate(
      "Nexus DeepMind Labs",
      "Community Health Net",
      1500,
      "Hydroelectric"
    );

    expect(receipt).toBeDefined();
    expect(receipt.receiptId).toMatch(/^CARBON-NFT-/);
    expect(receipt.metricTonsCo2Avoided).toBeGreaterThan(0);
    expect(receipt.cleanEnergyMwhUsed).toBeGreaterThan(0);
    expect(receipt.network).toBe("Base L2");
    expect(receipt.contractAddress).toMatch(/^0x/);
    expect(receipt.transactionHash).toMatch(/^0x/);
    expect(receipt.ipfsCertificateMetadataUri).toMatch(/^ipfs:\/\//);
  });
});
