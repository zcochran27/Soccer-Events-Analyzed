import React from "react";
function getImageUrl(name, ext) {
  return new URL(`../assets/${name}.${ext}`, import.meta.url).href;
}
function NavbarElement({ href, children }) {
  // Determine if the link is active based on the current route
  const isActive =
    window.location.pathname === href ||
    (href === "/" && window.location.pathname.startsWith("/"));

  return (
    <a href={href} className={isActive ? "active" : ""}>
      {children}
    </a>
  );
}

function Navbar() {
  const logoUrl = getImageUrl("logo", "png");

  return (
    <div className="navbar">
      <NavbarElement href="/">Analysis</NavbarElement>
      <NavbarElement href="/about">Leaderboard</NavbarElement>
      <NavbarElement href="/about">Situations</NavbarElement>
      <NavbarElement href="/about">About</NavbarElement>
    </div>
  );
}

export default Navbar;
