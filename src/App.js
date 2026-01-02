import React, { useState, useMemo } from "react";
import propertiesData from "./data/properties.json";
import { Home, Bed, MapPin } from "lucide-react";
import "./App.css";


function App() {
  /*===========SEARCH STATE===============*/
  const [search, setSearch] = useState({
    type: "",
    minPrice: "",
    maxPrice: "",
    minBedrooms: "",
    maxBedrooms: "",
    postcode: "",
    dateAfter: ""
  });

  const [selectedProperty, setSelectedProperty] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const [selectedImage, setSelectedImage] = useState(0);

   /* ================= FAVOURITES STATE ================= */
  const [favourites, setFavourites] = useState([]);
  const [draggedProperty, setDraggedProperty] = useState(null);

   /* ================= FILTER LOGIC ================= */
  const filteredProperties = useMemo(() => {
    return propertiesData.filter(p => {
      if (search.type && p.type !== search.type) return false;
      if (search.minPrice && p.price < search.minPrice) return false;
      if (search.maxPrice && p.price > search.maxPrice) return false;
      if (search.minBedrooms && p.bedrooms < search.minBedrooms) return false;
      if (search.maxBedrooms && p.bedrooms > search.maxBedrooms) return false;
      if (search.postcode && !p.postcode.toLowerCase().startsWith(search.postcode.toLowerCase())) return false;
      if (search.dateAfter && new Date(p.dateAdded) < new Date(search.dateAfter)) return false;
        
      return true;
    });
  }, [search]);

  const handleChange = e => {
    setSearch({ ...search, [e.target.name]: e.target.value });
  };
   /* ================= FAVOURITES FUNCTIONS ================= */
   const toggleFavourite = (property) => {
    const exists = favourites.find((f) => f.id === property.id);

    if (exists) {
      setFavourites(favourites.filter((f) => f.id !== property.id));
    } else {
      setFavourites([...favourites, property]);
    }
  };

  const isFavourite = (id) => favourites.some((f) => f.id === id);

  const clearFavourites = () => {
    setFavourites([]);
  };
    /* ================= DRAG & DROP ================= */
  const handleDragStart = (property) => {
    setDraggedProperty(property);
  };

  const handleDropToFavourites = () => {
    if (!draggedProperty) return;
    if (!isFavourite(draggedProperty.id)) {
      setFavourites([...favourites, draggedProperty]);
    }
    setDraggedProperty(null);
  };

  const handleDropToResults = () => {
    if (!draggedProperty) return;
    setFavourites(favourites.filter((f) => f.id !== draggedProperty.id));
    setDraggedProperty(null);
  };

  /* ================= PROPERTY DETAILS PAGE ================= */
  if (selectedProperty) {
    return (
      <div className="container">
        <button onClick={() => setSelectedProperty(null)}>← Back to Search</button>

        <h1>{selectedProperty.description}</h1>

        <img
          src={selectedProperty.images[selectedImage]}
          className="main-image"
          alt=""
        />

        <div className="thumbs">
          {selectedProperty.images.map((img, i) => (
            <img
              key={i}
              src={img}
              className={selectedImage === i ? "thumb active" : "thumb"}
              onClick={() => setSelectedImage(i)}
              alt="Thumbnail"
            />
          ))}
        </div>

        <p><MapPin /> {selectedProperty.location}</p>
        <p><Bed /> {selectedProperty.bedrooms} bedrooms</p>
        <p>£{selectedProperty.price}</p>

        <div className="tabs">
          <button onClick={() => setActiveTab("description")}>Description</button>
          <button onClick={() => setActiveTab("floor")}>Floor Plan</button>
          <button onClick={() => setActiveTab("map")}>Map</button>
        </div>

        {activeTab === "description" && (
          <p>{selectedProperty.longDescription}</p>
        )}

        {activeTab === "floor" && (
          <img src={selectedProperty.floorPlan} className="floor" alt="" />
        )}

        {activeTab === "map" && (
          <div className="map-box">
            Google Map for {selectedProperty.location}
          </div>
        )}
      </div>
    );
  }

  /* ================= SEARCH PAGE ================= */
  return (
    <div className="container">
      <h1><Home /> Estate Agent Search</h1>

      <div className="search-box">
        <select name="type" onChange={handleChange}>
          <option value="">Any Type</option>
          <option value="house">House</option>
          <option value="flat">Flat</option>
        </select>

        <input name="minPrice" type="number" placeholder="Min Price" onChange={handleChange} />
        <input name="maxPrice" type="number" placeholder="Max Price" onChange={handleChange} />
        <input name="minBedrooms" type="number" placeholder="Min Bedrooms" onChange={handleChange} />
        <input name="maxBedrooms" type="number" placeholder="Max Bedrooms" onChange={handleChange} />
        <input name="postcode" placeholder="Postcode (BR1)" onChange={handleChange} />
        <input type="date" name="dateAfter" value={search.dateAfter} onChange={handleChange} />
      </div>

      {/* ===== RESULTS ===== */}
      <h2>All Properties </h2>
      <div
        className="grid"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDropToResults}
      >
        {filteredProperties.map((p) => (
          <div
            className="card"
            key={p.id}
            draggable
            onDragStart={() => handleDragStart(p)}
          >
            <img src={p.images[0]} alt="Property" onClick={() => setSelectedProperty(p)} />
            <h3>{p.description}</h3>
            <p>{p.location}</p>
            <p>£{p.price.toLocaleString()}</p>

            <button
              className={isFavourite(p.id) ? "fav-btn active" : "fav-btn"}
              onClick={() => toggleFavourite(p)}
            >
              {isFavourite(p.id) ? " Remove from favourites" : " Add to favourites"}
            </button>
          </div>
        ))}
      </div>

      {/* ===== FAVOURITES ===== */}
      <h2> Favourite Properties</h2>

      {favourites.length > 0 && (
        <button className="clear-btn" onClick={clearFavourites}>
          Clear All Favourites
        </button>
      )}

      <div
        className="grid"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDropToFavourites}
      >
        {favourites.length === 0 && (
          <p style={{ gridColumn: "1 / -1", textAlign: "center", color: "#666" }}>
            No favourite properties added yet. Drag a property here or click
            <strong> “Add to favourites” </strong>
          </p>
        )}

        {favourites.map((f) => (
          <div
            className="card"
            key={f.id}
            draggable
            onDragStart={() => handleDragStart(f)}
          >
            <img src={f.images[0]} alt="Favourite" />
            <h3>{f.description}</h3>

            <button className="fav-btn active" onClick={() => toggleFavourite(f)}>
               Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
     