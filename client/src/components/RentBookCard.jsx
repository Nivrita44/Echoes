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
        style={{ marginBottom: "6rem" }}
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
                : "/path/to/default/image.jpg"; // Fallback image in case of no image URLs

            return (
              // <SwiperSlide key={book.id}>
              //   <div
              //     className="relative cursor-pointer"
              //     onClick={() => navigate(`/book-rent/${book.id}`)}
              //   >
              //     <img
              //       src={`http://localhost:3002${firstImageUrl}`}
              //       alt={book.book_title}
              //       className="book-image"
              //     />
              //   </div>
              //   <div>
              //     <div>
              //       <h3>{book.book_title}</h3>
              //       <p>{book.author}</p>
              //     </div>
              //     <div>
              //       <p>{book.price} tk</p>
              //     </div>
              //   </div>
              // </SwiperSlide>
              <SwiperSlide key={book.id}>
                <div
                  className="book-card"
                  onClick={() => navigate(`/book-rent/${book.id}`)}
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

// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import "swiper/css/pagination";
// import { Pagination } from "swiper/modules";
// import { FaCartShopping } from "react-icons/fa6";

// const BookCard = ({ headline, books }) => {
//   const navigate = useNavigate();

//   return (
//     <div className="my-16 px-4 lg:px-24">
//       <h2 className="text-5xl text-center font-bold text-black my-5">
//         {headline}
//       </h2>

//       <div>
//         <Swiper
//           slidesPerView={1}
//           spaceBetween={10}
//           pagination={{
//             clickable: true,
//           }}
//           breakpoints={{
//             640: {
//               slidesPerView: 2,
//               spaceBetween: 20,
//             },
//             768: {
//               slidesPerView: 4,
//               spaceBetween: 40,
//             },
//             1024: {
//               slidesPerView: 5,
//               spaceBetween: 50,
//             },
//           }}
//           modules={[Pagination]}
//           className="mySwiper w-full h-full"
//         >
//           {books.map((book) => {
//             let imageUrls = [];
//             try {
//               imageUrls = JSON.parse(book.image_url);
//             } catch (error) {
//               console.error("Error parsing image_url JSON:", error);
//             }
//             const firstImageUrl =
//               imageUrls.length > 0
//                 ? imageUrls[0]
//                 : "/path/to/default/image.jpg"; // Fallback image in case of no image URLs

//             return (
//               <SwiperSlide key={book.id}>
//                 <div
//                   className="relative cursor-pointer"
//                   onClick={() => navigate(`/book-sell/${book.id}`)}
//                 >
//                   <img
//                     src={`http://localhost:3002${firstImageUrl}`}
//                     alt={book.book_title}
//                   />
//                   <div className="absolute top-3 right-3 bg-blue-600 hover:bg-black p-2 rounded ">
//                     <FaCartShopping className="w-4 h-4 text-white" />
//                   </div>
//                 </div>
//                 <div>
//                   <div>
//                     <h3>{book.book_title}</h3>
//                     <p>{book.author}</p>
//                   </div>
//                   <div>
//                     <p>{book.price} tk</p>
//                   </div>
//                 </div>
//               </SwiperSlide>
//             );
//           })}
//         </Swiper>
//       </div>
//     </div>
//   );
// };

// export default BookCard;
