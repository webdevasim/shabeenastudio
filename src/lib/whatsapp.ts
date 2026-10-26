import type { CartItem, Product } from '../types';
const phone = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '').replace(/\D/g, '');
export function openWhatsApp(message: string): boolean {
  if (!/^\d{10,15}$/.test(phone)) {
    alert('WhatsApp ordering is not configured yet. Please set NEXT_PUBLIC_WHATSAPP_NUMBER in .env.local.');
    return false;
  }
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  return true;
}
export function productWhatsApp(p: Product, color: string, size: string, quantity: number) {
  return openWhatsApp(`Hello Shabeena Studio! I would like to enquire about ordering:\nProduct: ${p.title}\nProduct ID: ${p.id}\nColor: ${color}\nSize: ${size}\nQuality: ${p.gsm} / ${p.fabric}\nQuantity: ${quantity}\nEstimated subtotal: ₹${(p.price * quantity).toLocaleString('en-IN')}\nProduct link: ${window.location.origin}/shop/${p.slug}\nPlease confirm availability, final price and delivery.`);
}
export function cartWhatsApp(items: CartItem[]) {
  if (!items.length) return false;
  const lines = items.map((i, n) => `${n+1}. ${i.title}\nProduct ID: ${i.productId || 'Custom item'}\nSize: ${i.size} | Color: ${i.colorName}\nQuantity: ${i.quantity} | Estimated price: ₹${(i.price * i.quantity).toLocaleString('en-IN')}\n${i.isCustom ? `Custom design: ${i.customDetails?.textSummary || 'Please request my design preview separately'}; Back print: ${i.customDetails?.backPrintIncluded ? 'Yes' : 'No'}` : `Specs: ${i.specsSummary || 'Not specified'}`}`);
  return openWhatsApp(`Hello Shabeena Studio! Please confirm availability and final pricing for my cart:\n\n${lines.join('\n\n')}\n\nEstimated item subtotal: ₹${items.reduce((sum,i)=>sum+i.price*i.quantity,0).toLocaleString('en-IN')}\nShipping and discounts to be confirmed. This message is an enquiry, not a paid order.\n${items.some(i=>i.isCustom) ? 'I will attach my custom design preview separately.' : ''}`);
}
