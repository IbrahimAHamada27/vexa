export const API_CONFIG = {
  baseUrl: '/api/v1',
  endpoints: {
    organizations: '/organizations',
    doctors: '/doctors',
    departments: '/departments',
    services: '/services',
    appointments: '/appointments',
    aiRecommendations: '/ai/recommend'
  }
} as const;
