import React from 'react';

const Loader: React.FC = () => {
  return (
    <div id="loader" className="loader" aria-label="Loading portfolio">
      <div className="loader__bars">
        <span></span><span></span><span></span><span></span>
      </div>
      <p className="loader__text">booting portfolio...</p>
    </div>
  );
};

export default Loader;
