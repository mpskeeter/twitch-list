import { TwitchChannel } from '.';

export interface TwitchStream {
  _id: number;
  average_fps: number;
  channel: TwitchChannel;
  created_at: Date;
  delay?: number;
  game: string;
  is_playlist: boolean;
  preview: {
    small: string;
    medium: string;
    large: string;
    template: string;
  };
  viewers: number;
  video_height: number;
}
