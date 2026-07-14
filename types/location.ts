export interface Location {
  _id: string;

  owner: {
    _id: string;
    username: string;
    avatar: string;
  };

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

  isLiked: boolean;
}


export interface LocationsResponse {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  locations: Location[];
}