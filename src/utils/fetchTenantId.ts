import { z } from 'zod';

const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;

const openIdConfigSchema = z.object({
  issuer: z.string(),
});

export interface TenantLookupResult {
  domain: string;
  tenantId: string | null;
  status: 'success' | 'error';
  error?: string;
}

export const normalizeDomain = (domain: string): string => {
  domain = domain.trim().toLowerCase();
  if (!domain.includes('.')) {
    domain = `${domain}.com`;
  }
  return domain;
};

export const validateDomain = (domain: string): boolean => {
  return domainRegex.test(domain);
};

export const fetchTenantId = async (domain: string): Promise<TenantLookupResult> => {
  try {
    const normalizedDomain = normalizeDomain(domain);
    
    if (!validateDomain(normalizedDomain)) {
      return {
        domain: normalizedDomain,
        tenantId: null,
        status: 'error',
        error: 'Invalid domain format',
      };
    }

    const response = await fetch(
      `https://login.microsoftonline.com/${normalizedDomain}/.well-known/openid-configuration`
    );

    if (!response.ok) {
      return {
        domain: normalizedDomain,
        tenantId: null,
        status: 'error',
        error: response.status === 404 ? 'Tenant not found' : 'Failed to fetch tenant information',
      };
    }

    const data = await response.json();
    const parsed = openIdConfigSchema.safeParse(data);

    if (!parsed.success) {
      return {
        domain: normalizedDomain,
        tenantId: null,
        status: 'error',
        error: 'Invalid response format',
      };
    }

    const tenantId = parsed.data.issuer.split('/')[3];
    return {
      domain: normalizedDomain,
      tenantId,
      status: 'success',
    };
  } catch (error) {
    return {
      domain,
      tenantId: null,
      status: 'error',
      error: 'Network error or invalid response',
    };
  }
};

export const batchFetchTenantIds = async (
  domains: string[],
  batchSize = 20,
  onProgress?: (progress: number) => void
): Promise<TenantLookupResult[]> => {
  const results: TenantLookupResult[] = [];
  const uniqueDomains = [...new Set(domains)];
  const totalDomains = uniqueDomains.length;
  let processedDomains = 0;

  for (let i = 0; i < uniqueDomains.length; i += batchSize) {
    const batch = uniqueDomains.slice(i, i + batchSize);
    const batchPromises = batch.map(domain => fetchTenantId(domain));
    
    const batchResults = await Promise.allSettled(batchPromises);
    
    batchResults.forEach((result) => {
      if (result.status === 'fulfilled') {
        results.push(result.value);
      }
      processedDomains++;
      onProgress?.(Math.round((processedDomains / totalDomains) * 100));
    });
  }

  return results;
}; 