import { useState, useEffect } from "react";
import API from "../config/api";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../contexts/AlertContext";

/* ================= GENRES ================= */

const genres = [
  "Fantasy",
  "Romance",
  "Science Fiction",
  "Mystery",
  "Thriller",
  "Horror",
  "Adventure",
  "Historical",
  "Biography",
  "Self Help",
];

const genreImages = {
  Fantasy: "/images/fantasy.jpeg",
  Romance: "/images/romance.jpeg",
  "Science Fiction": "/images/sciencefiction.jpeg",
  Mystery: "/images/mystery.jpeg",
  Thriller: "/images/thriller.jpeg",
  Horror: "/images/horror.jpeg",
  Biography: "/images/biography.jpeg",
  "Self Help": "/images/selfhelp.jpeg",
  Adventure: "/images/adventure.jpeg",
  Historical: "/images/historical.jpeg"
};

/* ================= MOVIE ROLL ================= */

const moviePosters = [
  // Titanic
  "https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg",
  // Interstellar
  "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
  // Knives Out
  "https://image.tmdb.org/t/p/w500/pThyQovXQrw2m0s9x82twj48Jq4.jpg",
  // The Conjuring
  "https://image.tmdb.org/t/p/w500/wVYREutTvI2tmxr6ujrHT704wGF.jpg",
  // Harry Potter
  "https://image.tmdb.org/t/p/w500/c54HpQmuwXjHq2C9wmoACjxoom3.jpg",
];

export default function Recommendations() {

  const [selectedGenre, setSelectedGenre] = useState("");
  const [books, setBooks] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [movieInput, setMovieInput] = useState("");

  const [readingBook, setReadingBook] = useState(null);
  const [reviewText, setReviewText] = useState("");

  const [sentiments, setSentiments] = useState({});
  const navigate = useNavigate(); // ✅ ADD THIS HERE
  const alert = useAlert(); // Add glass alert system

  const [showResultsModal, setShowResultsModal] = useState(false);

  useEffect(() => {
    if (books.length > 0 || clubs.length > 0) {
      setShowResultsModal(true);
    }
  }, [books, clubs]);

  /* ================= GENRE BOOKS ================= */
  const getGenreRecommendations = async () => {
  try {
    if (!selectedGenre) {
      alert.warning("Select a genre");
      return;
    }

    const res = await API.post("/recommendations/genre", {
      preferred_genres: [selectedGenre],
    });

    const booksData = res.data.recommendations || [];

    const booksWithSentiment = await Promise.all(
      booksData.map(async (book) => {
        if (book.db_id) {
          try {
            const summary = await API.get(`/reviews/${book.db_id}/summary`);
            return { ...book, sentiment: summary.data };
          } catch {
            return book;
          }
        }
        return book;
      })
    );

    setBooks(booksWithSentiment);

  } catch (err) {
    alert.error(err.response?.data?.error || "Recommendation error");
  }
};

  

  /* ================= CLUBS ================= */

  const getClubRecommendations = async () => {
  try {

    if (!selectedGenre) {
      alert.warning("Select a genre first");
      return;
    }

    const res = await API.post("/clubs/recommendations", {
      genres: [selectedGenre],   // ✅ FIX: backend expects "genres"
    });

    setClubs(res.data.recommendations || []);

  } catch (err) {
    alert.error(err.response?.data?.error || "Club recommendation error");
  }
};
const joinClub = async (clubId) => {
  try {

    await API.post(`/clubs/${clubId}/join`);

    alert.success("Joined club successfully!");

  } catch (err) {

    alert.error(err.response?.data?.error || "Failed to join club");

  }
};
  /* ================= MOVIE BOOKS ================= */

  const getMovieRecommendations = async () => {
  try {
    if (!movieInput.trim()) {
      alert.warning("Enter movie name");
      return;
    }

    const res = await API.post("/recommendations/movie", {
      favorite_movies: [movieInput],
    });

    const booksData = res.data.recommendations || [];

    const booksWithSentiment = await Promise.all(
      booksData.map(async (book) => {
        if (book.db_id) {
          try {
            const summary = await API.get(`/reviews/${book.db_id}/summary`);
            return { ...book, sentiment: summary.data };
          } catch {
            return book;
          }
        }
        return book;
      })
    );

    setBooks(booksWithSentiment);

  } catch (err) {
    alert.error(err.response?.data?.error || "Movie recommendation error");
  }
};

  /* ================= READING STATUS ================= */

  const updateReadingStatus = async (book, status) => {
    try {

      const res = await API.post("/reading", {
        book: {
          google_books_id: book.google_books_id,
          title: book.title,
          authors: book.authors,
          thumbnail: book.thumbnail,
        },
        status,
      });

      alert.info(res.data.message);

      if (status === "read") {

        const dbBookId = res.data.data.book_id;

        setReadingBook({
          ...book,
          db_id: dbBookId,
        });

      }

    } catch (err) {
      alert.error(err.response?.data?.error || "Reading update failed");
    }
  };

  const fetchSentimentForBook = async (bookId) => {
  try {
    const res = await API.get(`/reviews/${bookId}/summary`);
    return res.data;
  } catch {
    return null;
  }
};

  /* ================= REVIEW ================= */

  const submitReview = async () => {
    try {

      if (!reviewText.trim()) {
        alert.warning("Write a review first");
        return;
      }

      await API.post("/reviews", {
        book_id: readingBook.db_id,
        review_text: reviewText,
      });

      const summary = await API.get(
        `/reviews/${readingBook.db_id}/summary`
      );

      setBooks((prevBooks) =>
  prevBooks.map((book) =>
    book.google_books_id === readingBook.google_books_id
      ? { ...book, sentiment: summary.data }
      : book
  )
);

      alert.success("Review posted!");

      setReadingBook(null);
      setReviewText("");

    } catch (err) {
      alert.error(err.response?.data?.error || "Review failed");
    }
  };

  return (
    <div className="page-shell relative min-h-screen bg-[#020617] text-[#F8FAFC] px-4 py-10">
      {/* Ambient cinematic background */}
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute -top-32 -right-24 h-72 w-72 bg-gradient-to-br from-orange-500/40 via-red-500/10 to-slate-900/0 blur-3xl rounded-full" />
        <div className="absolute -bottom-40 -left-10 h-80 w-80 bg-gradient-to-tr from-slate-700/40 via-slate-900/10 to-orange-500/0 blur-3xl rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(248,250,252,0.08),_transparent_60%),radial-gradient(circle_at_bottom,_rgba(15,23,42,0.9),_transparent_55%)] mix-blend-screen" />
      </div>

      {/* Decorative Stickers */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="reading-sticker reading-sticker--bookmark top-16 left-6" />
        <div className="reading-sticker reading-sticker--openbook top-24 right-10" />
        <div className="reading-sticker reading-sticker--feather top-1/2 left-12" />
        <div className="reading-sticker reading-sticker--watch top-1/3 right-1/4" />
        <div className="reading-sticker reading-sticker--ticket bottom-16 left-1/3" />
        <div className="reading-sticker reading-sticker--note bottom-10 right-1/4" />
      </div>

      <div className="relative z-10">
        {/* Global Title – top-left */}
        <div className="app-title">
          <span className="font-lobster">Epilogue</span>
        </div>

        {/* Profile Icon */}
        <div className="flex justify-end mb-8">
          <button
            onClick={() => navigate("/profile")}
            className="btn-jelly btn-jelly-icon w-12 h-12 flex items-center justify-center p-0 text-2xl min-w-0"
          >
            👤
          </button>
        </div>

        {/* ================= GENRES ================= */}
        <section>
          <h2 className="hero-heading heading-etched text-4xl md:text-5xl font-normal text-[#F8FAFC] mb-2 text-center flex items-center justify-center gap-3">
            <span className="text-3xl md:text-4xl">📖</span>
            Pick A Plot
          </h2>
          <p className="text-base md:text-lg text-[#FFFFFF] mb-4 text-center">
            Tap a genre to tailor your book and club recommendations.
          </p>

          {/* 3D rotating genre carousel */}
          <div className="genre-carousel mt-2 flex justify-center items-center h-[520px]">
            <div className="relative w-[520px] h-[520px] animate-spin-slow [transform-style:preserve-3d] hover:[animation-play-state:paused]">
              {genres.map((genre, index) => (
                <button
                  key={genre}
                  type="button"
                  onClick={() => setSelectedGenre(genre)}
                  className={`group card-parallax absolute left-1/2 top-1/2 w-[180px] h-[240px] rounded-2xl overflow-hidden border shadow-xl cursor-pointer ${
                    selectedGenre === genre
                      ? "border-[#818CF8] shadow-[0_22px_70px_rgba(129,140,248,0.5)]"
                      : "border-slate-700/70 shadow-[0_18px_55px_rgba(0,0,0,0.95)]"
                  }`}
                  style={{
                    transform: `rotateY(${index * 36}deg) translateZ(320px) translate(-50%, -50%)`,
                  }}
                >
                  <img
                    src={genreImages[genre] || genreImages.Fantasy}
                    alt={genre}
                    className="w-full h-full object-cover brightness-75 group-hover:brightness-100 transition-[filter,transform] duration-500"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-3 flex flex-col">
                    <span className="text-[10px] uppercase tracking-[0.25em] text-[#818CF8] mb-1">
                      genre
                    </span>
                    <span className="text-sm font-semibold">
                      {genre}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ================= CENTER BUTTONS ================= */}
        <section className="mt-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
            <button
              onClick={getGenreRecommendations}
              className="btn-jelly px-8 py-3 text-sm md:text-base font-semibold tracking-wide"
            >
              Curate My Shelf
            </button>

            <button
              onClick={getClubRecommendations}
              className="btn-jelly px-8 py-3 text-sm md:text-base font-semibold tracking-wide"
            >
              Find Your Tribe
            </button>
          </div>
        </section>

        {/* ================= 3D FILM ROLL ================= */}
        <section className="mb-8">
          <div className="film-strip-wrapper glass-card rounded-3xl px-6 py-8">
            <div className="film-strip">
              <div className="film-strip-track animate-film-roll">
                {[...moviePosters, ...moviePosters].map((img, i) => (
                  <div key={i} className="film-frame">
                    <img src={img} alt="" className="film-frame-image" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ================= MOVIE SEARCH ================= */}
        <section className="mb-6 md:mb-8">
          <div className="rounded-2xl px-5 py-5 md:px-7 md:py-6 flex flex-wrap items-center gap-4 md:gap-6 glass-card">
            <div className="search-bar-wrapper flex-1 min-w-[220px]">
              <span className="search-bar-icon" aria-hidden="true">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </span>
              <input
                value={movieInput}
                onChange={(e) => setMovieInput(e.target.value)}
                placeholder="Enter a movie to match the vibe"
                className="search-bar-input"
              />
            </div>

            <button
              onClick={getMovieRecommendations}
              className="btn-jelly px-6 py-3 text-sm md:text-base font-semibold tracking-wide whitespace-nowrap"
            >
              Sync With Cinema
            </button>
          </div>
        </section>
      </div>

      {/* ================= RECOMMENDATIONS POPUP (BOOKS + CLUBS) ================= */}
      {showResultsModal && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-xl flex items-center justify-center px-3 md:px-6 py-8"
          onClick={() => setShowResultsModal(false)}
        >
          <div
  className="results-modal relative w-full max-w-6xl rounded-3xl glass-shell p-4 md:p-6 lg:p-8 overflow-y-auto overflow-x-hidden max-h-[90vh]"
  onClick={(e) => e.stopPropagation()}
>
          
            <div className="mb-4 md:mb-6">
              <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-[#818CF8] mb-2">
                Recommendations
              </p>
              <h2 className="text-2xl md:text-3xl font-semibold text-[#F8FAFC] heading-etched">
                Curated picks based on your choices
              </h2>
            </div>

            {/* Books inside popup */}
            {books.length > 0 && (
              <section>
                <h3 className="text-xl md:text-2xl font-semibold mb-4 text-[#F8FAFC] heading-etched">
                  Books For You
                </h3>
                <div className="max-h-[80vh] overflow-y-auto">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                    {books.map((book) => (
                    <div
                      key={book.google_books_id}
                      className="group card-parallax relative rounded-2xl p-3 flex flex-col glass-card"
                    >
                      <div className="relative mb-3 aspect-[2/3] w-[80%] max-w-[200px] mx-auto overflow-hidden rounded-xl">
                        <img
                          src={book.thumbnail}
                          alt={book.title}
                          className="h-full w-full object-cover max-w-full transform transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent" />
                      </div>

                      <div className="flex-1 flex flex-col">
                        <div className="space-y-1 mb-3">
                          <h4 className="text-base md:text-lg font-semibold leading-snug text-[#F8FAFC]">
                            {book.title}
                          </h4>
                          <p className="text-xs text-[#818CF8]">
                            {book.authors?.join(", ")}
                          </p>

                          {book.sentiment && (
                            <p className="inline-flex items-center rounded-full bg-[rgba(129,140,248,0.2)] text-[#818CF8] text-[11px] font-semibold px-3 py-1 mt-2">
                              Sentiment
                              <span className="ml-1 text-white">
                                {book.sentiment.sentiment_percentage}%
                              </span>
                            </p>
                          )}
                        </div>

                        <div className="mt-auto space-y-2">
                          <button
                            onClick={() =>
                              updateReadingStatus(book, "want_to_read")
                            }
                            className="btn-jelly btn-jelly-secondary w-full p-2 text-xs md:text-sm"
                          >
                            Want to Read
                          </button>

                          <button
                            onClick={() =>
                              updateReadingStatus(book, "currently_reading")
                            }
                            className="btn-jelly btn-jelly-secondary w-full p-2 text-xs md:text-sm"
                          >
                            Currently Reading
                          </button>

                          <button
                            onClick={() => updateReadingStatus(book, "read")}
                            className="btn-jelly w-full p-2 text-xs md:text-sm"
                          >
                            Read
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                </div>
              </section>
            )}

            {/* Clubs inside popup */}
            {clubs.length > 0 && (
              <section className="mt-10 pt-8 border-t border-slate-800/80">
                <h3 className="text-xl md:text-2xl font-semibold mb-4 text-[#F8FAFC] heading-etched">
                  Recommended Book Clubs
                </h3>
                <div className="grid gap-6 md:grid-cols-3">
                  {clubs.map((club) => (
                    <div
                      key={club.id}
                      className="relative card-parallax rounded-2xl p-4 flex flex-col glass-card"
                    >
                      <div className="mb-3">
                        <h4 className="text-lg font-semibold mb-1 text-[#F8FAFC]">
                          {club.name}
                        </h4>
                        <p className="text-sm text-[#818CF8]">
                          {club.description}
                        </p>
                      </div>
                      <p className="text-xs uppercase tracking-[0.25em] text-[#818CF8] mb-3">
                        Genre: {club.genre}
                      </p>
                      <button
                        onClick={() => joinClub(club.id)}
                        className="btn-jelly w-full p-2 text-sm mt-auto"
                      >
                        Join Club
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      )}

      {/* ================= REVIEW MODAL ================= */}
      {readingBook && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
          <div className="glass-shell p-6 rounded-2xl w-96 max-w-full">
            <h3 className="mb-3 text-lg font-semibold">Write Review</h3>

            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="w-full search-bar-standalone min-h-[120px] resize-none"
            />

            <button
              onClick={submitReview}
              className="btn-jelly mt-4 px-4 py-2 w-full"
            >
              Post Review
            </button>
          </div>
        </div>
      )}

      <style>{`
        /* Genre carousel */
        .genre-scroll {
          scroll-behavior: smooth;
        }
        .genre-scroll::-webkit-scrollbar {
          display: none;
        }
        .genre-scroll {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        /* 3D film strip */
        .film-strip-wrapper {
          perspective: 1400px;
          max-width: 100%;
          position: relative;
        }
        .film-strip {
          position: relative;
          overflow: hidden;
          height: 260px;
          transform-style: preserve-3d;
          box-shadow: 0 26px 80px rgba(0, 0, 0, 0.96);
        }
        .film-strip::before,
        .film-strip::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          height: 12px;
          background-image: radial-gradient(
            circle at 4px 4px,
            rgba(15, 23, 42, 0.95) 2px,
            transparent 3px
          );
          background-size: 20px 10px;
          opacity: 0.9;
        }
        .film-strip::before {
          top: 0;
          transform: translateZ(0);
        }
        .film-strip::after {
          bottom: 0;
          transform: translateZ(0);
        }
        .film-strip-track {
          display: flex;
          gap: 1.75rem;
          padding: 1.2rem 0;
          width: max-content;
          transform-style: preserve-3d;
        }
        .film-frame {
          position: relative;
          width: 170px;
          height: 250px;
          border-radius: 10px;
          overflow: hidden;
          background: linear-gradient(
            145deg,
            rgba(15, 23, 42, 0.95),
            rgba(30, 64, 175, 0.9)
          );
          box-shadow:
            0 18px 45px rgba(0, 0, 0, 0.85),
            inset 0 0 0 2px rgba(15, 23, 42, 0.9);
          transform: translateZ(0);
          transition:
            transform 220ms ease-out,
            box-shadow 220ms ease-out,
            filter 220ms ease-out;
        }
        .film-frame-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 220ms ease-out, filter 220ms ease-out;
        }
        .film-frame:hover {
          transform: translate3d(0, -6px, 0) scale(1.03) rotateX(4deg);
          box-shadow:
            0 26px 80px rgba(0, 0, 0, 0.98),
            inset 0 0 0 2px rgba(15, 23, 42, 0.9);
        }

        .film-frame:hover .film-frame-image {
          transform: scale(1.04) translateY(-2px);
          filter: brightness(1.05);
        }
        .animate-film-roll {
          animation: film-roll 40s linear infinite;
        }
        @keyframes film-roll {
          0% {
            transform: translate3d(0, 0, 0) rotateX(12deg);
          }
          100% {
            transform: translate3d(-50%, 0, 0) rotateX(12deg);
          }
        }
      `}</style>
    </div>
  );
}