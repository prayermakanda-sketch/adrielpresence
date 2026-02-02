
export type ItemStatus = 'Available' | 'To Repair' | 'In Use' | 'Sold';

export interface CustomField {
  label: string;
  value: string;
}

export interface Attachment {
  name: string;
  url: string;
  type: 'PDF' | 'IMAGE' | 'LINK';
}

export interface MarketplaceStats {
  platform: 'Takealot' | 'Amazon' | 'Shopify';
  listingId: string;
  currentPrice: number;
  sales24h: number;
  pendingOrders: number;
  status: 'Active' | 'Paused' | 'Out of Stock';
}

export interface CategoryConfig {
  id: string;
  name: string;
  icon: string;
  color: string;
  minThreshold: number;
  dynamicFields: string[]; // Labels of fields to show for this category
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  serialNumber?: string;
  warrantyExpiry?: string;
  quantity: number;
  minThreshold: number;
  price: number;
  priceZar: number;
  category: string;
  lastUpdated: string;
  totalSold: number;
  status: ItemStatus;
  images: string[];
  customFields: CustomField[];
  manufacturer?: string;
  projectLink?: string;
  attachments: Attachment[];
  marketplace?: MarketplaceStats;
  tags?: string[];
}

export interface ActivityLog {
  id: string;
  itemId: string;
  itemName: string;
  type: 'IN' | 'OUT' | 'ADJUST' | 'CREATE' | 'DELETE' | 'MARKETPLACE_SALE' | 'SALE' | 'STATUS_CHANGE';
  delta: number;
  value: number; // Value of the transaction
  timestamp: string;
  metadata?: string;
}

export type ViewMode = 'list' | 'grid' | 'kanban' | 'spreadsheet';
export type TabType = 'dashboard' | 'items' | 'search' | 'workflows' | 'categories' | 'reports' | 'marketplaces';
