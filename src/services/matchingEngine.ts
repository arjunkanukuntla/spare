import { Listing, RequestItem } from '../types';

export interface MatchResult<T> {
  item: T;
  score: number; // 0-100
  reasons: string[];
}

export class MatchingEngine {
  /**
   * Deterministically find matching requests for a given listing
   */
  static findRequestsForListing(listing: Listing, requests: RequestItem[]): MatchResult<RequestItem>[] {
    const activeRequests = requests.filter(r => r.status === 'OPEN');
    const results: MatchResult<RequestItem>[] = [];

    for (const req of activeRequests) {
      let score = 0;
      const reasons: string[] = [];

      // Category match (+40)
      if (req.category === listing.category) {
        score += 40;
        reasons.push(`Same category (${listing.category})`);
      }

      // Keyword matching (+40 max)
      const listingTokens = this.tokenize(`${listing.title} ${listing.description}`);
      const requestTokens = this.tokenize(`${req.title} ${req.description}`);
      const overlap = requestTokens.filter(t => listingTokens.includes(t));

      if (overlap.length > 0) {
        const keywordScore = Math.min(40, overlap.length * 15);
        score += keywordScore;
        reasons.push(`Matching keywords: "${overlap.slice(0, 3).join(', ')}"`);
      }

      // Location proximity (+20 max)
      if (req.location.toLowerCase().includes('sr university') || listing.approximateLocation.toLowerCase().includes('sr university')) {
        score += 20;
        reasons.push('Same campus area (SR University)');
      }

      if (score >= 40) {
        results.push({ item: req, score, reasons });
      }
    }

    return results.sort((a, b) => b.score - a.score);
  }

  /**
   * Deterministically find matching listings for a given request
   */
  static findListingsForRequest(request: RequestItem, listings: Listing[]): MatchResult<Listing>[] {
    const activeListings = listings.filter(l => l.status === 'ACTIVE');
    const results: MatchResult<Listing>[] = [];

    for (const listing of activeListings) {
      let score = 0;
      const reasons: string[] = [];

      // Category match (+40)
      if (listing.category === request.category) {
        score += 40;
        reasons.push(`Same category (${request.category})`);
      }

      // Keyword matching (+40 max)
      const listingTokens = this.tokenize(`${listing.title} ${listing.description}`);
      const requestTokens = this.tokenize(`${request.title} ${request.description}`);
      const overlap = requestTokens.filter(t => listingTokens.includes(t));

      if (overlap.length > 0) {
        const keywordScore = Math.min(40, overlap.length * 15);
        score += keywordScore;
        reasons.push(`Matching keywords: "${overlap.slice(0, 3).join(', ')}"`);
      }

      // Location proximity (+20)
      if (listing.approximateLocation.toLowerCase().includes('sr university') || request.location.toLowerCase().includes('sr university')) {
        score += 20;
        reasons.push('Same campus area');
      }

      if (score >= 40) {
        results.push({ item: listing, score, reasons });
      }
    }

    return results.sort((a, b) => b.score - a.score);
  }

  private static tokenize(text: string): string[] {
    const stopWords = new Set(['a', 'an', 'the', 'and', 'or', 'for', 'in', 'on', 'to', 'with', 'is', 'are', 'need', 'looking']);
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word));
  }
}
