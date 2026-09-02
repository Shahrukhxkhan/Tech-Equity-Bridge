/**
 * =============================================================================
 * Offline-First Edge Compute Mesh & P2P CRDT Sync Engine
 * =============================================================================
 */

export interface QuantizedEdgeModel {
  id: string;
  name: string;
  domain: "medical_triage" | "multilingual_translation" | "speech_to_text" | "client_intake";
  quantization: "INT4" | "INT8" | "FP16";
  memoryFootprintMb: number;
  diskSizeMb: number;
  minDeviceRamGb: number;
  avgInferenceLatencyMs: number;
  targetHardware: string[];
  description: string;
}

export interface EdgeNodeDevice {
  id: string;
  deviceName: string;
  clinicLocation: string;
  deviceType: "tablet" | "raspberry_pi" | "rugged_laptop" | "edge_server";
  ramGb: number;
  installedModels: string[];
  connectionStatus: "online" | "satellite_intermittent" | "airgapped_offline";
  lastMeshSyncAt: Date;
  pendingCrdtRecordsCount: number;
  batteryLevelPct?: number;
}

export interface CrdtIntakeRecord {
  id: string;
  nodeId: string;
  patientHash: string; // Cryptographic de-identified patient hash
  triageCategory: "Urgent Care" | "Routine Checkup" | "Prescription Refill" | "Social Services Assistance";
  primaryLanguage: string;
  translatedSummary: string;
  modelUsed: string;
  lamportTimestamp: number;
  vectorClock: Record<string, number>;
  createdAt: Date;
  syncStatus: "locally_queued" | "p2p_mesh_replicated" | "synced_to_cloud";
  reconciledAt?: Date;
}

// In-memory Edge Models Catalog
const QUANTIZED_MODELS: QuantizedEdgeModel[] = [
  {
    id: "MODEL-MEDTRIAGE-Q4",
    name: "MedTriage-Mobile-Q4",
    domain: "medical_triage",
    quantization: "INT4",
    memoryFootprintMb: 620,
    diskSizeMb: 780,
    minDeviceRamGb: 2,
    avgInferenceLatencyMs: 380,
    targetHardware: ["Raspberry Pi 4/5", "Android Tablets (4GB+)", "Chromebooks"],
    description: "4-bit quantized clinical intake & triage model capable of operating fully air-gapped on mobile health clinic tablets.",
  },
  {
    id: "MODEL-CIVICTRANSLATE-INT8",
    name: "CivicTranslate-INT8",
    domain: "multilingual_translation",
    quantization: "INT8",
    memoryFootprintMb: 850,
    diskSizeMb: 1100,
    minDeviceRamGb: 3,
    avgInferenceLatencyMs: 440,
    targetHardware: ["Raspberry Pi 5", "Ruggedized Laptops", "Community Center Desktops"],
    description: "8-bit quantized offline translation agent supporting 42 languages with localized medical terminology dictionaries.",
  },
  {
    id: "MODEL-WHISPER-TINY",
    name: "Whisper-Tiny-Edge",
    domain: "speech_to_text",
    quantization: "INT8",
    memoryFootprintMb: 390,
    diskSizeMb: 490,
    minDeviceRamGb: 2,
    avgInferenceLatencyMs: 290,
    targetHardware: ["Android Clinic Tablets", "Field Smartphones", "Raspberry Pi 4/5"],
    description: "Ultra-compact offline voice-to-text transcriber for verbal intake in remote field tents.",
  },
  {
    id: "MODEL-INTAKE-LLAMA-4BIT",
    name: "FieldIntake-Llama-4bit",
    domain: "client_intake",
    quantization: "INT4",
    memoryFootprintMb: 750,
    diskSizeMb: 920,
    minDeviceRamGb: 4,
    avgInferenceLatencyMs: 510,
    targetHardware: ["Ruggedized Field Laptops", "Edge Boxes"],
    description: "Form extraction and eligibility validator for housing, food security, and Medicaid applications.",
  },
];

// Active Rural / Remote Edge Devices
const EDGE_NODES: EdgeNodeDevice[] = [
  {
    id: "NODE-RURAL-01",
    deviceName: "Appalachian Mobile Clinic Van #3 (Samsung Active4)",
    clinicLocation: "Pineville, Kentucky (Mountain Hollow Outreach)",
    deviceType: "tablet",
    ramGb: 6,
    installedModels: ["MedTriage-Mobile-Q4", "CivicTranslate-INT8"],
    connectionStatus: "airgapped_offline",
    lastMeshSyncAt: new Date(Date.now() - 4 * 3600000), // 4 hours ago
    pendingCrdtRecordsCount: 14,
    batteryLevelPct: 88,
  },
  {
    id: "NODE-RURAL-02",
    deviceName: "Navajo Nation Health Hub Pi-5 Gateway",
    clinicLocation: "Window Rock, Arizona (Desert Outpost #12)",
    deviceType: "raspberry_pi",
    ramGb: 8,
    installedModels: ["MedTriage-Mobile-Q4", "Whisper-Tiny-Edge"],
    connectionStatus: "satellite_intermittent",
    lastMeshSyncAt: new Date(Date.now() - 1 * 3600000),
    pendingCrdtRecordsCount: 6,
    batteryLevelPct: 100,
  },
  {
    id: "NODE-RURAL-03",
    deviceName: "Delta Flood Relief Field Toughbook",
    clinicLocation: "Clarksdale, Mississippi (Emergency Shelter A)",
    deviceType: "rugged_laptop",
    ramGb: 16,
    installedModels: ["MedTriage-Mobile-Q4", "CivicTranslate-INT8", "FieldIntake-Llama-4bit"],
    connectionStatus: "online",
    lastMeshSyncAt: new Date(),
    pendingCrdtRecordsCount: 0,
    batteryLevelPct: 94,
  },
];

// Local CRDT Record Store
let crdtRecordLedger: CrdtIntakeRecord[] = [
  {
    id: "CRDT-REC-8901",
    nodeId: "NODE-RURAL-01",
    patientHash: "0x89a4...f201",
    triageCategory: "Urgent Care",
    primaryLanguage: "Spanish (Oaxaca dialect)",
    translatedSummary: "Patient reports severe respiratory wheezing for 48 hrs. Quantized edge triage recommends immediate bronchodilator & oximetry check.",
    modelUsed: "MedTriage-Mobile-Q4",
    lamportTimestamp: 104,
    vectorClock: { "NODE-RURAL-01": 14, "NODE-RURAL-02": 8 },
    createdAt: new Date(Date.now() - 2 * 3600000),
    syncStatus: "locally_queued",
  },
  {
    id: "CRDT-REC-8902",
    nodeId: "NODE-RURAL-01",
    patientHash: "0x33b1...c889",
    triageCategory: "Prescription Refill",
    primaryLanguage: "English",
    translatedSummary: "Insulin glargine maintenance refill requested. Verified adherence history on local tablet cache.",
    modelUsed: "FieldIntake-Llama-4bit",
    lamportTimestamp: 105,
    vectorClock: { "NODE-RURAL-01": 15, "NODE-RURAL-02": 8 },
    createdAt: new Date(Date.now() - 1 * 3600000),
    syncStatus: "locally_queued",
  },
  {
    id: "CRDT-REC-8903",
    nodeId: "NODE-RURAL-02",
    patientHash: "0x55c9...e112",
    triageCategory: "Routine Checkup",
    primaryLanguage: "Navajo (Diné Bizaad)",
    translatedSummary: "Prenatal wellness screening protocol completed via offline voice speech translation. Fetal heart tones recorded normal.",
    modelUsed: "Whisper-Tiny-Edge",
    lamportTimestamp: 106,
    vectorClock: { "NODE-RURAL-01": 15, "NODE-RURAL-02": 9 },
    createdAt: new Date(Date.now() - 30 * 60000),
    syncStatus: "locally_queued",
  },
];

export function getQuantizedModelsList(): QuantizedEdgeModel[] {
  return QUANTIZED_MODELS;
}

export function getEdgeNodesList(): EdgeNodeDevice[] {
  return EDGE_NODES;
}

export function getCrdtLedgerRecords(): CrdtIntakeRecord[] {
  return crdtRecordLedger;
}

/**
 * Execute quantized local edge inference (Simulated on-device Wasm/ONNX runtime)
 */
export async function runLocalEdgeInference(
  modelId: string,
  inputPrompt: string,
  nodeId: string = "NODE-RURAL-01"
) {
  const model = QUANTIZED_MODELS.find(m => m.id === modelId) || QUANTIZED_MODELS[0];
  const startTime = Date.now();

  let generatedText = "";
  if (model.domain === "medical_triage") {
    generatedText = `[Offline Edge Triage Output • ${model.name} (${model.quantization})]\n` +
      `• Primary Category: Urgent Clinical Evaluation Required\n` +
      `• Vital Sign Warnings: Elevated heart rate & low oxygen saturation\n` +
      `• Clinical Recommendation: Administer nebulized albuterol, monitor SpO2, queue patient for clinician review.\n` +
      `• Local Latency: ${model.avgInferenceLatencyMs}ms (0 bytes sent to internet)`;
  } else if (model.domain === "multilingual_translation") {
    generatedText = `[Offline Edge Translation • ${model.name}]\n` +
      `• Source Text: "${inputPrompt.substring(0, 80)}..."\n` +
      `• Translated Output: "El paciente necesita asistencia inmediata de medicamentos para la diabetes."\n` +
      `• Accuracy Confidence: 97.4% (INT8 quantization loss < 0.8%)`;
  } else {
    generatedText = `[Offline Edge Field Intake • ${model.name}]\n` +
      `• Extracted Eligibility: Verified for State Community Emergency Medical Assistance.\n` +
      `• Document Checksum: 0x9b41...7a02 (Signed on local device)`;
  }

  // Create local CRDT record
  const newLamport = Math.max(...crdtRecordLedger.map(r => r.lamportTimestamp), 100) + 1;
  const newRecord: CrdtIntakeRecord = {
    id: `CRDT-REC-${Math.floor(1000 + Math.random() * 9000)}`,
    nodeId,
    patientHash: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
    triageCategory: "Urgent Care",
    primaryLanguage: "Spanish (Medical Localized)",
    translatedSummary: generatedText,
    modelUsed: model.name,
    lamportTimestamp: newLamport,
    vectorClock: { [nodeId]: newLamport },
    createdAt: new Date(),
    syncStatus: "locally_queued",
  };

  crdtRecordLedger.unshift(newRecord);

  // Update node pending count
  const node = EDGE_NODES.find(n => n.id === nodeId);
  if (node) {
    node.pendingCrdtRecordsCount += 1;
  }

  return {
    output: generatedText,
    modelName: model.name,
    quantization: model.quantization,
    memoryUsedMb: model.memoryFootprintMb,
    executionTimeMs: model.avgInferenceLatencyMs,
    createdCrdtRecord: newRecord,
    isAirGapped: true,
  };
}

/**
 * Reconcile and synchronize offline CRDT records back to the main cloud audit ledger
 */
export async function reconcileCrdtMeshToCloud() {
  const pendingCount = crdtRecordLedger.filter(r => r.syncStatus === "locally_queued").length;

  crdtRecordLedger.forEach(record => {
    record.syncStatus = "synced_to_cloud";
    record.reconciledAt = new Date();
  });

  EDGE_NODES.forEach(node => {
    node.pendingCrdtRecordsCount = 0;
    node.lastMeshSyncAt = new Date();
  });

  const reconciliationHash = `0x${Math.random().toString(16).substring(2, 12)}${Math.random().toString(16).substring(2, 12)}`;

  return {
    success: true,
    reconciledRecordsCount: pendingCount,
    activeNodesSynced: EDGE_NODES.length,
    reconciliationHash,
    crdtConvergenceStatus: "CONVERGED_ZERO_CONFLICTS",
    syncedAt: new Date(),
  };
}
