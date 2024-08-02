import React from "react";
import ReactDOM from "react-dom/client";
import { PokemonCollection, PokemonDetail, PokemonList } from "./pages";
import "./index.css";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";

const Navbar = () => {
  const location = useLocation();

  const getButtonStyle = (path) => ({
    backgroundColor: location.pathname === path ? "black" : "white",
    color: location.pathname === path ? "white" : "black",
    padding: "4px 16px",
    borderRadius: 8,
    cursor: "pointer",
  });

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 24,
        height: 70,
        borderBottom: "1px solid black",
        color: "black",
        fontSize: 20,
      }}
    >
      <Link to="/" style={{ textDecoration: "none" }}>
        <div style={getButtonStyle("/")}>HOME</div>
      </Link>
      <Link to="/my-pokemon" style={{ textDecoration: "none" }}>
        <div style={getButtonStyle("/my-pokemon")}>COLLECTION</div>
      </Link>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<PokemonList />} />
          <Route path="/:id" element={<PokemonDetail />} />
          <Route path="/my-pokemon" element={<PokemonCollection />} />
          <Route path="*" element={<div>Not Found</div>} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
