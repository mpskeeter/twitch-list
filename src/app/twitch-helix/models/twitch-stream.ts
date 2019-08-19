export interface TwitchStream {
  id: string;
  user_id: string;
  user_name: string;
  game_id: string;
  community_ids: string[];
  type: 'live' | '';
  title: string;
  viewer_count: number;
  started_at: Date;
  language: string;
  thumbnail_url: string;
  tag_ids: string[];
}
