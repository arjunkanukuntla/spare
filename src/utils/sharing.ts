import { Listing, RequestItem } from '../types';

export function getShareMessageForListing(listing: Listing): string {
  return `📦 *${listing.title}*\nCategory: ${listing.category} (${listing.condition})\nLocation: ${listing.approximateLocation}\nStatus: Available on SPARE (100% Free Transfer)\n\nClaim it here: ${window.location.origin}/?listing=${listing.id}`;
}

export function getShareMessageForRequest(request: RequestItem): string {
  return `🔍 *Looking for: ${request.title}*\nCategory: ${request.category}\nLocation: ${request.location}\nUrgency: ${request.urgency}\n\nHave a spare? Respond here on SPARE: ${window.location.origin}/?request=${request.id}`;
}

export function openWhatsAppShare(text: string) {
  const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}

export function openTelegramShare(text: string, url: string) {
  const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
  window.open(tgUrl, '_blank');
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    return false;
  }
}
