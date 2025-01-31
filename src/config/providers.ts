export const providers = [
    { 
        id: "aws",
        name: "Amazon Web Services", 
        keywords: ["AWS", "Amazon", "Cloud Computing"] 
    },
    { 
        id: "gcp",
        name: "Google Cloud", 
        keywords: ["GCP", "Google Cloud Platform", "Google"] 
    },
    { 
        id: "azure",
        name: "Microsoft Azure", 
        keywords: ["Azure", "Microsoft", "MS Cloud"] 
    },
    { 
        id: "digitalocean",
        name: "DigitalOcean", 
        keywords: ["Digital Ocean", "DO", "Cloud Hosting"] 
    },
] as const;

export type ProviderId = typeof providers[number]['id'];

// Type guard for provider ID validation
export function isValidProviderId(id: unknown): id is ProviderId {
    if (typeof id !== 'string') return false;
    return providers.some(p => p.id === id);
}

// Helper to get provider info
export function getProvider(id: ProviderId) {
    return providers.find(p => p.id === id);
} 