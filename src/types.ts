
export type ViewType = 'Home' | 'History' | 'Blogs' | 'Game' | 'Setting' | 'Grid';

export interface ProxyInfo {
  id: number;
  ip: string;
  location: string;
  latency: string;
  status: string;
}

export interface HistoryItem {
  id: string;
  url: string;
  count: number;
  timestamp: number;
}
