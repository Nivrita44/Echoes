import React from "react";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "../styles/RecentlyRent.scss";

const BookCard = ({ headline, books }) => {
  const navigate = useNavigate();

  return (
    <div className="my-16 px-4 lg:px-24">
      <h2
        className="text-5xl text-center font-bold text-black my-5"
        style={{ marginBottom: "5rem" }}
      >
        {headline}
      </h2>

      <div>
        <Swiper
          slidesPerView={1}
          spaceBetween={10}
          pagination={{
            clickable: true,
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 4,
              spaceBetween: 40,
            },
            1024: {
              slidesPerView: 5,
              spaceBetween: 50,
            },
          }}
          modules={[Pagination]}
          className="mySwiper w-full h-full"
          style={{ paddingBottom: "3rem" }}
        >
          {books.map((book) => {
            const imageUrls = JSON.parse(book.image_url);
            const firstImageUrl =
              imageUrls.length > 0
                ? imageUrls[0]
                : "/path/to/default/image.jpg";

            return (
              <SwiperSlide key={book.id}>
                <div
                  className="book-card"
                  onClick={() => navigate(`/book-sell/${book.id}`)}
                >
                  <div className="book-image-container">
                    <img
                      src={`http://localhost:3002${firstImageUrl}`}
                      alt={book.book_title}
                      className="book-image"
                    />
                  </div>
                  <div className="book-details">
                    <h3 className="book-title">{book.book_title}</h3>
                    <p className="book-author">{book.author}</p>
                  </div>
                  <div>
                    <p className="book-price">{book.price} tk</p>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
};

export default BookCard;
