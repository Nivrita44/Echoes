import React, { useState } from "react";
import Navbar from "../Navbar";
import "../CreateListing/CreateListingStyle.scss";
import sweicon from "../../../src/components/Asset/sweicon.png";
import cseicon from "../../../src/components/Asset/cseicon.png";
import staticon from "../../../src/components/Asset/staticon.png";
import physicsicon from "../../../src/components/Asset/physics.png";
import pmeicon from "../../../src/components/Asset/pmeicon.png";
import chemicon from "../../../src/components/Asset/chemicon.png";
import Chemicalicon from "../../../src/components/Asset/Chemicalicon.png";
import meeicon from "../../../src/components/Asset/meeicon.png";
import biochemicon from "../../../src/components/Asset/biochemicon.png";

import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { IoIosImages } from "react-icons/io";
import { BiTrash } from "react-icons/bi";

const categories = [
  {
    label: "Software Engineering",
    icon: sweicon,
  },
  {
    label: "Computer Science Engineering",
    icon: cseicon,
  },
  {
    label: "Statistics",
    icon: staticon,
  },
  {
    label: "Physics",
    icon: physicsicon,
  },
  {
    label: "PME",
    icon: pmeicon,
  },
  {
    label: "Chemistry",
    icon: chemicon,
  },
  {
    label: "Chemical Engineering",
    icon: Chemicalicon,
  },
  {
    label: "Mechanical",
    icon: meeicon,
  },
  {
    label: "Polymer",
    icon: pmeicon,
  },
  {
    label: "BioChemistry",
    icon: biochemicon,
  },
];

const CreateListing = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);

  const toggleCategory = (label) => {
    setSelectedCategories((prevSelectedCategories) =>
      prevSelectedCategories.includes(label)
        ? prevSelectedCategories.filter((category) => category !== label)
        : [...prevSelectedCategories, label]
    );
  };

  const [formDescription, setFormDescription] = useState({
    BookTitle: "",
    AuthorName: "",
    PublishDate: "",
    Description: "",
    price: 0,
  });

  const handleChangeDescription = (e) => {
    const { name, value } = e.target;
    setFormDescription({
      ...formDescription,
      [name]: value,
    });
  };

  //   console.log(formDescription);

  /* UPLOAD, DRAG & DROP, REMOVE PHOTOS */
  const [photos, setPhotos] = useState([]);

  const handleUploadPhotos = (e) => {
    const newPhotos = e.target.files;
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

  return (
    <>
      <div>
        <Navbar />
      </div>
      <div className="create-listing">
        <h1>Sell your book</h1>
        <form>
          <div className="create-listing_step1">
            <h2>Step 1: Tell us about your Book</h2>
            <hr />
            <h3>Which of these categories best describes your Book?</h3>

            <div className="category-list">
              {categories?.map((item, index) => (
                <div
                  className={`category ${
                    selectedCategories.includes(item.label) ? "selected" : ""
                  }`}
                  key={index}
                  onClick={() => toggleCategory(item.label)}
                >
                  <div className="category_icon">
                    <img src={item.icon} alt={item.label} />
                  </div>
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
                  type="text"
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

            <h3>Add some photos of your book</h3>
            <DragDropContext onDragEnd={handleDragPhoto}>
              <Droppable droppableId="photos" direction="horizontal">
                {(provided) => (
                  <div
                    className="photos"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {photos.length < 1 && (
                      <>
                        <input
                          id="image"
                          type="file"
                          style={{ display: "none" }}
                          accept="image/*"
                          onChange={handleUploadPhotos}
                          multiple
                        />
                        <label htmlFor="image" className="alone">
                          <div className="icon">
                            <IoIosImages />
                          </div>
                          <p>Upload from your device</p>
                        </label>
                      </>
                    )}

                    {photos.length >= 1 && (
                      <>
                        {photos.map((photo, index) => {
                          return (
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
                                    src={URL.createObjectURL(photo)}
                                    alt="place"
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
                          );
                        })}
                        <input
                          id="image"
                          type="file"
                          style={{ display: "none" }}
                          accept="image/*"
                          onChange={handleUploadPhotos}
                          multiple
                        />
                        <label htmlFor="image" className="together">
                          <div className="icon">
                            <IoIosImages />
                          </div>
                          <p>Upload from your device</p>
                        </label>
                      </>
                    )}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateListing;
