export type Movie = {
    adult: boolean;
    backdrop_path: string;
    genre_ids: number[];
    id: number;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    release_date: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
};

export type MovieResponse = {
    page: number;
    results: Movie[];
    total_pages: number;
    total_results: number;
};

export interface Genre { id: number; name: string; }

export interface MovieDetails {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  runtime: number;
  tagline: string;
  poster_path: string | null;
  backdrop_path: string | null;
  genres: Genre[];
}

export interface Cast { 
    id: number; 
    name: string; 
    character: string; 
    profile_path: string | null; 
    order: number; 
}

export interface Crew { 
    id: number; 
    name: string; 
    job: string; 
    profile_path: string | null; 
}

export interface Credits { 
    cast: Cast[]; 
    crew: Crew[]; 
}