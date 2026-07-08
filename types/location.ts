export interface Location {
  _id: string;
  owner: string;
  name: string;
  city: string;
  fish: string[];
  description: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  images: string[];
  type: string;

  commentsCount: number;

  likes: {
    count: number;
    users: string[];
  };
}