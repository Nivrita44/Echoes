import { Link } from "react-router-dom";
import { categories } from "../../data";
import "../styles/Categories.scss";

const Categories = () => {
  return (
    <div className="categories" style={{ marginTop: "20", paddingTop: "20" }}>
      <h1 style={{ marginTop: "0" }}>Explore Top Categories</h1>
      <p>
        Discover Echoes, the perfect platform for university students to buy,
        sell, and rent textbooks and study materials. Easily navigate through
        various categories, connect with fellow students, and find the resources
        you need at affordable prices. Join our community to make your academic
        journey more sustainable and budget-friendly!
      </p>

      <div className="categories_list">
        {categories?.slice(1, 7).map((category, index) => (
          <Link
            to={`/properties/category/${category.label}`}
            key={category.label}
          >
            <div className="category">
              <img src={category.img} alt={category.label} />
              <div className="overlay"></div>
              <div className="category_text">
                <div className="category_text_icon">
                  <img src={category.icon} alt={`${category.label} icon`} />
                </div>
                <p>{category.label}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Categories;
