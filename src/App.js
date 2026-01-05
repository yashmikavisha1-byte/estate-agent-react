import React, { useState, useMemo } from "react";

/* ================= UI WIDGETS ================= */
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import propertiesData from "./data/properties.json";
import { Home, Bed, MapPin, Calendar } from "lucide-react";
import "./App.css";

function App() {
  /* ================= SEARCH STATE ================= */
  const [search, setSearch] = useState({
    type: null,
    minPrice: "",
    maxPrice: "",
    minBedrooms: "",
    maxBedrooms: "",
    postcode: "",
    dateAfter: null
  });

  const [selectedProperty, setSelectedProperty] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const [selectedImage, setSelectedImage] = useState(0);

  /* ================= FAVOURITES ================= */
  const [favourites, setFavourites] = useState([]);
  const [draggedProperty, setDraggedProperty] = useState(null);

  /* ================= FILTER LOGIC (UNCHANGED) ================= */
  const filteredProperties = useMemo(() => {
    return propertiesData.filter((p) => {
      if (search.type && p.type !== search.type.value) return false;
      if (search.minPrice && p.price < Number(search.minPrice)) return false;
      if (search.maxPrice && p.price > Number(search.maxPrice)) return false;
      if (search.minBedrooms && p.bedrooms < Number(search.minBedrooms)) return false;
      if (search.maxBedrooms && p.bedrooms > Number(search.maxBedrooms)) return false;
      if (
        search.postcode &&
        !p.postcode.toLowerCase().startsWith(search.postcode.toLowerCase())
      )
        return false;
      if (search.dateAfter && new Date(p.dateAdded) < search.dateAfter)
        return false;
      return true;
    });
  }, [search]);

  const handleChange = (e) => {
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

  /* REMOVE ALL FAVOURITES  */
  const clearFavourites = () => setFavourites([]);

  /* ================= DRAG & DROP ================= */
  const handleDragStart = (property) => setDraggedProperty(property);

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

  /* ================= DETAILS PAGE ================= */
  if (selectedProperty) {
    return (
      <div className="container">
        <button onClick={() => setSelectedProperty(null)}>
          ← Back to Search
        </button>

        <h1>{selectedProperty.description}</h1>

        <img
          src={selectedProperty.images[selectedImage]}
          className="main-image"
          alt="Property"
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

        {/*  DATE SHOWN HERE */}
        <p><MapPin /> {selectedProperty.location}</p>
        <p><Bed /> {selectedProperty.bedrooms} bedrooms</p>
        <p><Calendar /> Added: {selectedProperty.dateAdded}</p>
        <p>£{selectedProperty.price.toLocaleString()}</p>

        {/* TABS */}
        <div className="tabs">
          <button
            className={activeTab === "description" ? "active" : ""}
            onClick={() => setActiveTab("description")}
          >
            Description
          </button>

          <button
            className={activeTab === "floor" ? "active" : ""}
            onClick={() => setActiveTab("floor")}
          >
            Floor Plan
          </button>

          <button
            className={activeTab === "map" ? "active" : ""}
            onClick={() => setActiveTab("map")}
          >
            Map
          </button>
        </div>

        {activeTab === "description" && (
          <p>{selectedProperty.longDescription}</p>
        )}

        {/*  FLOOR IMAGE SIZE  */}
        {activeTab === "floor" && (
          <img
            src={selectedProperty.floorPlan}
            className="floor"
            alt="Floor plan"
          />
        )}

        {activeTab === "map" && (
          <iframe
            title="map"
            className="map"
            src={`https://www.google.com/maps?q=${encodeURIComponent(
              selectedProperty.location
            )}&output=embed`}
            loading="lazy"
          />
        )}
      </div>
    );
  }

  /* ================= SEARCH PAGE ================= */
  return (
    <div className="container">
      <h1><Home /> Estate Agent Property Search</h1>

      <div className="search-box">
        <Select
          options={[
            { value: "house", label: "House" },
            { value: "flat", label: "Flat" }
          ]}
          placeholder="Property Type"
          value={search.type}
          onChange={(value) => setSearch({ ...search, type: value })}
        />

        <input name="minPrice" type="number" placeholder="Min Price" onChange={handleChange} />
        <input name="maxPrice" type="number" placeholder="Max Price" onChange={handleChange} />
        <input name="minBedrooms" type="number" placeholder="Min Bedrooms" onChange={handleChange} />
        <input name="maxBedrooms" type="number" placeholder="Max Bedrooms" onChange={handleChange} />
        <input name="postcode" placeholder="Postcode (BR1)" onChange={handleChange} />

        <DatePicker
          selected={search.dateAfter}
          onChange={(date) => setSearch({ ...search, dateAfter: date })}
          placeholderText="Date Added After"
        />
      </div>

      {/* RESULTS */}
      <h2>All Properties</h2>
      <div className="grid" onDragOver={(e) => e.preventDefault()} onDrop={handleDropToResults}>
        {filteredProperties.map((p) => (
          <div
            className="card"
            key={p.id}
            draggable
            onDragStart={() => handleDragStart(p)}
          >
            <img
              src={p.images[0]}
              alt="Property"
              onClick={() => setSelectedProperty(p)}
            />

            <h3>{p.description}</h3>
            <p><MapPin size={14} /> {p.location}</p>
            <p><Calendar size={14} /> {p.dateAdded}</p> {/* DATE  */}
            <p>£{p.price.toLocaleString()}</p>

            <button
              className={isFavourite(p.id) ? "fav-btn active" : "fav-btn"}
              onClick={() => toggleFavourite(p)}
            >
              {isFavourite(p.id) ? "Remove from favourites" : "Add to favourites"}
            </button>
          </div>
        ))}
      </div>

      {/* ================= FAVOURITES ================= */}
      <h2>Favourite Properties</h2>

      {/* REMOVE ALL BUTTON  */}
      {favourites.length > 0 && (
        <button className="clear-btn" onClick={clearFavourites}>
          Remove All Favourites
        </button>
      )}

      <div className="grid" onDragOver={(e) => e.preventDefault()} onDrop={handleDropToFavourites}>
        {favourites.length === 0 && (
          <p style={{ gridColumn: "1 / -1", textAlign: "center" }}>
            No favourite properties added yet.
          </p>
        )}

        {favourites.map((f) => (
          <div className="card" key={f.id}>
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
