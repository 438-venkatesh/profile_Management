export const config = {
  API_BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  ENVIRONMENT: process.env.REACT_APP_ENV || 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
};

