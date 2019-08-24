export interface TwitchChannel {
  _id: number;
  background?: string;
  banner?: string;
  broadcaster_language: string;
  created_at: Date;
  delay?: number;
  display_name: string;
  followers: number;
  game: string;
  language: string;
  logo: string;
  mature?: boolean;
  name: string;
  partner: boolean;
  profile_banner: string;
  profile_banner_background_color: string;
  status: string;
  updated_at: Date;
  url: string;
  video_banner: string;
  views: number;
}
