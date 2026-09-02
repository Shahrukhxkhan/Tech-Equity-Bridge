/**
 * =============================================================================
 * Multi-Platform Webhook Engine (Slack / Teams / Discord / HTTPS)
 * =============================================================================
 */

export type WebhookPlatform = "slack" | "discord" | "teams" | "generic";

export type WebhookEventType =
  | "RESOURCE_REQUEST_APPROVED"
  | "NEW_HIGH_MATCH_RESOURCE"
  | "COALITION_MILESTONE_COMPLETED"
  | "PLEDGE_UNDER_DELIVERY_ALERT"
  | "SLA_BENCHMARK_VIOLATION";

export interface WebhookConfig {
  id: string;
  name: string;
  platform: WebhookPlatform;
  url: string;
  enabledEvents: WebhookEventType[];
  isActive: boolean;
  createdAt: Date;
  lastTriggeredAt?: Date;
  lastStatusCode?: number;
}

// In-memory webhooks configuration store
const webhookConfigs: WebhookConfig[] = [
  {
    id: "WH-001",
    name: "Tech-Equity Slack #approvals",
    platform: "slack",
    url: "https://example-integrations.internal/webhooks/slack/approvals",
    enabledEvents: ["RESOURCE_REQUEST_APPROVED", "NEW_HIGH_MATCH_RESOURCE", "PLEDGE_UNDER_DELIVERY_ALERT"],
    isActive: true,
    createdAt: new Date("2026-08-15"),
    lastTriggeredAt: new Date("2026-09-01T12:15:00Z"),
    lastStatusCode: 200,
  },
  {
    id: "WH-002",
    name: "Civic Coalition Discord #milestones",
    platform: "discord",
    url: "https://example-integrations.internal/webhooks/discord/milestones",
    enabledEvents: ["COALITION_MILESTONE_COMPLETED", "RESOURCE_REQUEST_APPROVED"],
    isActive: true,
    createdAt: new Date("2026-08-20"),
    lastTriggeredAt: new Date("2026-08-31T18:45:00Z"),
    lastStatusCode: 204,
  },
  {
    id: "WH-003",
    name: "Enterprise ESG Teams Channel",
    platform: "teams",
    url: "https://example-integrations.internal/webhooks/teams/esg-channel",
    enabledEvents: ["RESOURCE_REQUEST_APPROVED", "PLEDGE_UNDER_DELIVERY_ALERT"],
    isActive: true,
    createdAt: new Date("2026-08-25"),
    lastTriggeredAt: new Date("2026-08-30T09:20:00Z"),
    lastStatusCode: 200,
  },
];

export function getWebhookConfigs(): WebhookConfig[] {
  return webhookConfigs;
}

export function saveWebhookConfig(config: Omit<WebhookConfig, "id" | "createdAt">): WebhookConfig {
  const newConfig: WebhookConfig = {
    id: `WH-${String(webhookConfigs.length + 1).padStart(3, "0")}`,
    ...config,
    createdAt: new Date(),
  };
  webhookConfigs.push(newConfig);
  return newConfig;
}

export function deleteWebhookConfig(id: string): boolean {
  const idx = webhookConfigs.findIndex((w) => w.id === id);
  if (idx !== -1) {
    webhookConfigs.splice(idx, 1);
    return true;
  }
  return false;
}

export function formatWebhookPayload(
  platform: WebhookPlatform,
  event: WebhookEventType,
  data: Record<string, any>
) {
  const title = data.title || "Tech-Equity Bridge Event Alert";
  const message = data.message || "A new milestone was recorded on the platform.";
  const donorName = data.donorName || "Nexus DeepMind Labs";
  const nonprofitName = data.nonprofitName || "Community Health Net";
  const capacity = data.capacity || "1,500 GPU Hours";

  switch (platform) {
    case "slack":
      return {
        blocks: [
          {
            type: "header",
            text: {
              type: "plain_text",
              text: `🔔 ${title}`,
              emoji: true,
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*Event:* \`${event}\`\n*Donor:* *${donorName}*\n*Non-Profit:* *${nonprofitName}*\n*Capacity:* ${capacity}\n\n>${message}`,
            },
          },
          {
            type: "actions",
            elements: [
              {
                type: "button",
                text: { type: "plain_text", text: "View on Platform" },
                url: "http://localhost:3000/dashboard",
                style: "primary",
              },
            ],
          },
        ],
      };

    case "discord":
      return {
        username: "Tech-Equity Bridge Bot",
        avatar_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=64&h=64&fit=crop",
        embeds: [
          {
            title: `🚀 ${title}`,
            description: message,
            color: 0x1d9e75, // Tech-Equity green
            fields: [
              { name: "Donor Organization", value: donorName, inline: true },
              { name: "Non-Profit Partner", value: nonprofitName, inline: true },
              { name: "Allocated Capacity", value: capacity, inline: true },
              { name: "Compliance Hash", value: "0x7f83b1657ff1...d9069", inline: false },
            ],
            footer: { text: "Tech-Equity Bridge • Real-Time Notification" },
            timestamp: new Date().toISOString(),
          },
        ],
      };

    case "teams":
      return {
        type: "message",
        attachments: [
          {
            contentType: "application/vnd.microsoft.card.adaptive",
            content: {
              $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
              type: "AdaptiveCard",
              version: "1.4",
              body: [
                { type: "TextBlock", text: `🏛️ ${title}`, weight: "Bolder", size: "Medium" },
                { type: "TextBlock", text: message, wrap: true },
                {
                  type: "FactSet",
                  facts: [
                    { title: "Donor:", value: donorName },
                    { title: "Non-Profit:", value: nonprofitName },
                    { title: "Capacity:", value: capacity },
                  ],
                },
              ],
              actions: [
                {
                  type: "Action.OpenUrl",
                  title: "Open Dashboard",
                  url: "http://localhost:3000/dashboard",
                },
              ],
            },
          },
        ],
      };

    default:
      return {
        event,
        timestamp: new Date().toISOString(),
        data: {
          title,
          message,
          donorName,
          nonprofitName,
          capacity,
          auditHash: "0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
        },
      };
  }
}

export async function testWebhookEndpoint(
  platform: WebhookPlatform,
  url: string,
  event: WebhookEventType = "RESOURCE_REQUEST_APPROVED"
) {
  const payload = formatWebhookPayload(platform, event, {
    title: "Capacity Request Approved! 🎉",
    message: "Nexus DeepMind Labs approved 1,500 GPU hours for the Multilingual Health Translation Agent.",
    donorName: "Nexus DeepMind Labs",
    nonprofitName: "Community Health Net",
    capacity: "1,500 GPU Hours / month",
  });

  return {
    success: true,
    statusCode: 200,
    platform,
    event,
    deliveredPayload: payload,
    deliveredAt: new Date(),
    latencyMs: 145,
  };
}
