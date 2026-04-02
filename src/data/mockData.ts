import { Movie } from '../types/movie';

export const mockMovies: Movie[] = [
  {
    id: "1",
    title: "Stranger Things",
    description: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.",
    image: "https://occ-0-1167-300.1.nflxso.net/dnm/api/v6/6AYY36jWqAxYXZY96p69NH5meDQ/AAAABRPDUq8uJgshf8_p8u_cO2fI_e4B5O5O5O5O5O5O5O5O5O5O5O5O5O.jpg?r=2b1",
    genre: "Sci-Fi",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  },
  {
    id: "2",
    title: "Inception",
    description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    image: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg",
    genre: "Action",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
  },
  {
    id: "3",
    title: "The Dark Knight",
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    image: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg",
    genre: "Action",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
  },
  {
    id: "4",
    title: "Interstellar",
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    image: "https://occ-0-1167-300.1.nflxso.net/dnm/api/v6/6AYY36jWqAxYXZY96p69NH5meDQ/AAAABd7_JmZ6Z_H-C0p9-wD9m_9m_9m_9m_9m_9m_9m_9m_9m_9m_9m.jpg?r=7f8",
    genre: "Sci-Fi",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
  },
  {
    id: "5",
    title: "The Conjuring",
    description: "Paranormal investigators Ed and Lorraine Warren work to help a family terrorized by a dark presence in their farmhouse.",
    image: "https://occ-0-1167-300.1.nflxso.net/dnm/api/v6/6AYY36jWqAxYXZY96p69NH5meDQ/AAAABe7_JmZ6Z_H-C0p9-wD9m_9m_9m_9m_9m_9m_9m_9m_9m_9m_9m.jpg?r=172",
    genre: "Horror",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4"
  },
  {
    id: "6",
    title: "The Office",
    description: "A mockumentary on a group of typical office workers, where the workday consists of ego clashes, inappropriate behavior, and tedium.",
    image: "https://occ-0-1167-300.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABZ7_JmZ6Z_H-C0p9-wD9m_9m_9m_9m_9m_9m_9m_9m_9m_9m_9m.jpg?r=8a1",
    genre: "Comedy",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"
  }
];

export const categories = [
  { title: "Trending Now", movies: mockMovies.slice(0, 4) },
  { title: "Popular on Filamu", movies: mockMovies.slice(2, 6) },
  { title: "Action Movies", movies: mockMovies.filter(m => m.genre === "Action") },
  { title: "Sci-Fi Hits", movies: mockMovies.filter(m => m.genre === "Sci-Fi") },
  { title: "Horror Favorites", movies: mockMovies.filter(m => m.genre === "Horror") }
];
