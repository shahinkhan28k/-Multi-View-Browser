
export type ViewType = 'Home' | 'History' | 'Blogs' | 'Developer' | 'Setting' | 'Grid';

export interface SocialLinks {
  banner: string;
  name: string;
  bio: string;
  passcode: string;
  facebook: string;
  facebookPage: string;
  tiktok: string;
  telegram: string;
  youtube: string;
  instagram: string;
}

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
