const isProduction = typeof window !== 'undefined' && (
  window.location.hostname.includes('vercel.app') || window.location.hostname !== 'localhost'
);

export const API_CONFIG = {
  baseUrl: isProduction ? 'https://vexa-omega-ten.vercel.app/api/v1' : '/api/v1',
  endpoints: {
    organizations: '/organizations',
    doctors: '/doctors',
    departments: '/departments',
    services: '/services',
    appointments: '/appointments',
    aiRecommendations: '/ai/recommend'
  }
} as const;
