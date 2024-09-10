import { getCookie } from './cookieUtils';

async function request(endpoint: string, options: RequestInit = {}) {
  console.log(`[API Request] Endpoint: ${endpoint}, Method: ${options.method || 'GET'}`);
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const config: RequestInit = {
    ...options,
    headers,
  };

  let response = await fetch(endpoint, config);

  if (!response.ok) {
    const errorData = await response.json();
    console.error('[API Error]', errorData.message || 'Unknown error');
    throw new Error(errorData.message || 'API request failed');
  }

  return response.json();
}

export async function get(endpoint: string, options: RequestInit = {}) {
  return request(endpoint, { ...options, method: 'GET' });
}

export async function post(endpoint: string, data: any, options: RequestInit = {}) {
  return request(endpoint, {
    ...options,
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function put(endpoint: string, data: any, options: RequestInit = {}) {
  return request(endpoint, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function del(endpoint: string, options: RequestInit = {}) {
  return request(endpoint, { ...options, method: 'DELETE' });
}
