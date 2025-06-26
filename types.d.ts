export interface LinkType {
  id: string;
  slug: string;
  url: string;
  created_at: string;
  user_id: string | null;
  expiration: string | null;
  clickCount?: number;
  pinned?: boolean;
}

export interface ClickStats {
  country: string;
  count: number;
  clicks: {
    created_at: string;
  }[];
}
