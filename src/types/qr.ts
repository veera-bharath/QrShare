export interface QRItem {
  id: string;
  text: string;
  timestamp: number;
  title?: string;
}

export type ContentType = 'url' | 'email' | 'phone' | 'wifi' | 'text';

export interface QRStyle {
  foregroundColor: string;
  backgroundColor: string;
  dotType: 'square' | 'rounded';
  cornerType: 'square' | 'rounded';
  useCenterLogo: boolean;
}
