import * as React from "react";
import Svg, { Path } from "react-native-svg";

const AlbumIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <Path
      d="M12 6L12 20"
      stroke={props.color || "currentColor"}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <Path
      d="M5.98 3.29C9.32 3.92 11.31 5.25 12 6.02c.69-.77 2.68-2.1 6.02-2.73 1.69-.32 2.54-.48 3.26.14.72.62.72 1.62.72 3.63v7.21c0 1.83 0 2.75-.46 3.32-.46.57-1.48.77-3.52 1.16-1.81.35-3.22.91-4.24 1.46-1.01.55-1.51.83-1.76.83s-.75-.28-1.76-.83c-1.02-.55-2.43-1.11-4.24-1.46-2.04-.39-3.06-.59-3.52-1.16C2 16.26 2 15.34 2 13.5V6.29c0-2.01 0-3.01.72-3.63.72-.62 1.57-.46 3.26-.14Z"
      stroke={props.color || "currentColor"}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default AlbumIcon;
