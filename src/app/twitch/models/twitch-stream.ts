export interface TwitchStream {
  game_id: string;
  id: string;
  language: string;
  started_at: Date;
  tag_ids: string[];
  thumbnail_url: string;
  title: string;
  type: 'live' | '';
  user_id: string;
  user_name: string;
  viewer_count: number;
}
