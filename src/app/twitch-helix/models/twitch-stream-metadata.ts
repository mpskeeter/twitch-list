export interface TwitchStreamMetadata {
  user_id: string;
  user_name: string;
  game_id: string;
  overwatch: {
    broadcaster: {
      hero: {
        role: string;
        name: string;
        ability: string;
      }
    }
  };
  hearthstone: string;
}
