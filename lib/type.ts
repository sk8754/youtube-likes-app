export interface Cardtype {
  id: number;
  thumbnail: string | null;
  user_photo: string | null;
  title: string | null;
  channel: string | null;
  watchers: number | null;
  genre: string | null;
}

export type SearchCard = {
  id: number;
  title: string | null;
  watchers: number | null;
  channel: string | null;
  thumbnail: string | null;
};
