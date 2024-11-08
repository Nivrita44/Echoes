import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { BiTrash } from "react-icons/bi";
import { IoIosImages } from "react-icons/io";
import { useNavigate, useLocation } from "react-router-dom"; // useLocation for passing book data
import Chemicalicon from "../../../src/components/Asset/Chemicalicon.png";
import biochemicon from "../../../src/components/Asset/biochemicon.png";
import chemicon from "../../../src/components/Asset/chemicon.png";
import cseicon from "../../../src/components/Asset/cseicon.png";
import meeicon from "../../../src/components/Asset/meeicon.png";
import physicsicon from "../../../src/components/Asset/physics.png";
import pmeicon from "../../../src/components/Asset/pmeicon.png";
import staticon from "../../../src/components/Asset/staticon.png";
import stationary from "../../../src/components/Asset/stationary.png";
import sweicon from "../../../src/components/Asset/sweicon.png";
import "../CreateRentListing/CreateRentListing.scss";
import LoginNavbar from "../LoginNavbar";

const categories = [
  { label: "Software Engineering", icon: sweicon },
  { label: "Computer Science Engineering", icon: cseicon },
  { label: "Statistics", icon: staticon },
  { label: "Physics", icon: physicsicon },
  { label: "PME", icon: pmeicon },
  { label: "Chemistry", icon: chemicon },
  { label: "Chemical Engineering", icon: Chemicalicon },
  { label: "Mechanical", icon: meeicon },
  { label: "Polymer", icon: pmeicon },
  { label: "BioChemistry", icon: biochemicon },
  { label: "Stationary", icon: stationary },
];

const EditBookListing = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { book } = state || {}; // Destructure book data passed through state

  const [selectedCategories, setSelectedCategories] = useState(
    book ? book.category.split(", ") : []
  );
  const [formDescription, setFormDescription] = useState({
    BookTitle: book?.book_title || "",
    AuthorName: book?.author || "",
    PublishDate: book?.published_date || "",
    Description: book?.description || "",
    price: book?.price || "",
  });
  const [photos, setPhotos] = useState(
    book?.image_url ? JSON.parse(book.image_url) : []
  );
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await fetch("http://localhost:3002/protected", {
          credentials: "include",
        });
        const data = await response.json();
        setUserId(data.id);
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    fetchUserId();
  }, []);

  const toggleCategory = (label) => {
    setSelectedCategories((prevSelectedCategories) =>
      prevSelectedCategories.includes(label)
        ? prevSelectedCategories.filter((category) => category !== label)
        : [...prevSelectedCategories, label]
    );
  };

  const handleChangeDescription = (e) => {
    const { name, value } = e.target;
    setFormDescription((prev) => ({ ...prev, [name]: value }));
  };

  const handleUploadPhotos = (e) => {
    const newPhotos = Array.from(e.target.files);
    setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
  };

  const handleDragPhoto = (result) => {
    if (!result.destination) return;

    const items = Array.from(photos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setPhotos(items);
  };

  const handleRemovePhoto = (indexToRemove) => {
    setPhotos((prevPhotos) =>
      prevPhotos.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedCategories.length === 0) {
      alert("Please select at least one category.");
      return;
    }

    const formData = new FormData();
    formData.append("book_title", formDescription.BookTitle);
    formData.append("author", formDescription.AuthorName);
    formData.append("published_date", formDescription.PublishDate);
    formData.append("description", formDescription.Description);
    formData.append("category", selectedCategories.join(", "));
    formData.append("price", formDescription.price);
    photos.forEach((photo) => formData.append("images", photo));

    try {
      const response = await fetch(
        `http://localhost:3002/update-book-rent/${book.id}`,
        {
          method: "PUT",
          body: formData,
          credentials: "include",
        }
      );

      if (response.ok) {
        alert("Book updated successfully");
        navigate("/HomeAfterLogin");
      } else {
        alert("Error updating book");
      }
    } catch (error) {
      alert("Error updating book:", error);
    }
  };

  return (
    <>
      <LoginNavbar />
      <div className="create-listing">
        <h1>Edit your book</h1>
        <form onSubmit={handleSubmit}>
          <div className="create-listing_step1">
            <h2> Edit information about your Book</h2>
            <hr />
            <h3>Which of these categories best describes your Book?</h3>
            <div className="category-list">
              {categories.map((item, index) => (
                <div
                  key={index}
                  className={`category ${
                    selectedCategories.includes(item.label) ? "selected" : ""
                  }`}
                  onClick={() => toggleCategory(item.label)}
                >
                  <img
                    src={item.icon}
                    alt={item.label}
                    className="category_icon"
                  />
                  <p>{item.label}</p>
                </div>
              ))}
            </div>
            <div className="full">
              <div className="Description">
                <p>Book Title</p>
                <input
                  type="text"
                  placeholder="Book Title"
                  name="BookTitle"
                  value={formDescription.BookTitle}
                  onChange={handleChangeDescription}
                  required
                />
                <p>Author Name</p>
                <input
                  type="text"
                  placeholder="Author Name"
                  name="AuthorName"
                  value={formDescription.AuthorName}
                  onChange={handleChangeDescription}
                  required
                />
                <p>Publish Date</p>
                <input
                  type="date"
                  placeholder="Publish Date"
                  name="PublishDate"
                  value={formDescription.PublishDate}
                  onChange={handleChangeDescription}
                  required
                />
                <p>Description</p>
                <input
                  type="text"
                  placeholder="Description"
                  name="Description"
                  value={formDescription.Description}
                  onChange={handleChangeDescription}
                  required
                />
                <p>Now, set your PRICE (TK)</p>
                <input
                  type="number"
                  placeholder="100"
                  name="price"
                  value={formDescription.price}
                  onChange={handleChangeDescription}
                  className="price"
                  required
                />
              </div>
            </div>

            <h3>Add or rearrange photos of your book</h3>
            <DragDropContext onDragEnd={handleDragPhoto}>
              <Droppable droppableId="photos" direction="horizontal">
                {(provided) => (
                  <div
                    className="photos"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {photos.map((photo, index) => (
                      <Draggable
                        key={index}
                        draggableId={index.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            className="photo"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <img
                              src={
                                typeof photo === "string"
                                  ? `http://localhost:3002${photo}`
                                  : URL.createObjectURL(photo)
                              }
                              alt="book"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemovePhoto(index)}
                            >
                              <BiTrash />
                            </button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    <input
                      id="image"
                      type="file"
                      style={{ display: "none" }}
                      accept="image/*"
                      onChange={handleUploadPhotos}
                      multiple
                    />
                    <label htmlFor="image" className="upload-new">
                      <IoIosImages /> Upload from your device
                    </label>
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
          <button type="submit" className="submit-button">
            Update
          </button>
        </form>
      </div>
    </>
  );
};

export default EditBookListing;
