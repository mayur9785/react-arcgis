import React from "react";
import PropTypes from "prop-types";

IrisIcon.prototype = {
  src: PropTypes.string.isRequired,
  size: PropTypes.number,
  alt: PropTypes.string,
};

IrisIcon.defaultProps = {
  src: "baidu.com",
  size: 25,
  alt: "Iris_Custom_Icon",
};

export function IrisIcon({ src, size, alt }) {
  return <img src={src} width={size} alt={alt} />;
}
