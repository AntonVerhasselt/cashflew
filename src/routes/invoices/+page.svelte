<script lang="ts">
  import { onMount } from 'svelte';
  import { sessionStore, setTokens } from '$lib/auth/sessionStore';

  let invoices: any[] = [];
  let error: string | null = null;

  function isTokenExpired(expiresAt: number | null): boolean {
    if (!expiresAt) return true;
    return Date.now() >= expiresAt;
  }

  async function refreshToken() {
    const { refreshToken } = $sessionStore;
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch('/api/exact/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to refresh token: ${errorData.error_description || response.statusText}`);
    }

    const data = await response.json();
    if (!data.access_token || !data.refresh_token) {
      throw new Error('Invalid token response');
    }

    setTokens(data.access_token, data.refresh_token);
    return data.access_token;
  }

  async function getValidAccessToken(): Promise<string> {
    const { accessToken, expiresAt } = $sessionStore;
    if (!accessToken || isTokenExpired(expiresAt)) {
      console.log('Access token expired or not available, refreshing...');
      return await refreshToken();
    }
    return accessToken;
  }

  async function fetchInvoices() {
    try {
      console.log('Fetching invoices...');
      const accessToken = await getValidAccessToken();
      console.log('Access token obtained');

      const response = await fetch('/api/exact/invoices', {
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response body:', errorData);
        throw new Error(errorData.error || `Failed to fetch invoices: ${response.status}`);
      }

      const data = await response.json();
      console.log('Invoices data received:', data);
      invoices = data.d.results;
      console.log('Invoices processed:', invoices.length);
    } catch (err) {
      console.error('Error in fetchInvoices:', err);
      error = (err as Error).message;
    }
  }

  onMount(async () => {
    try {
      await fetchInvoices();
    } catch (err) {
      console.error('Error in onMount:', err);
      error = (err as Error).message;
    }
  });
</script>

<h1>Invoices</h1>

{#if error}
  <p class="error">{error}</p>
{:else if invoices.length === 0}
  <p>No invoices found</p>
{:else}
  <table>
    <thead>
      <tr>
        <th>Invoice ID</th>
        <th>Invoice Number</th>
        <th>Invoice Date</th>
        <th>Amount</th>
      </tr>
    </thead>
    <tbody>
      {#each invoices as invoice}
        <tr>
          <td>{invoice.InvoiceID}</td>
          <td>{invoice.InvoiceNumber}</td>
          <td>{new Date(invoice.InvoiceDate).toLocaleDateString()}</td>
          <td>{invoice.AmountFC}</td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}

<style>
  .error {
    color: red;
  }
  table {
    border-collapse: collapse;
    width: 100%;
  }
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }
  th {
    background-color: #f2f2f2;
  }
</style>
