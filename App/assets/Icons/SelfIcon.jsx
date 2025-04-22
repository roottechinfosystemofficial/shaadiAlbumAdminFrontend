import * as React from "react";
import Svg, { Path } from "react-native-svg";

const SelfIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <Path
      d="M256 0C114.836 0 0 114.836 0 256s114.836 256 256 256 256-114.836 256-256S397.164 0 256 0Zm0 482C132.288 482 30 379.712 30 256S132.288 30 256 30s226 102.288 226 226-102.288 226-226 226Z"
      fill={props.color || "currentColor"}
    />
    <Path
      d="M256 106c-41.421 0-75 33.579-75 75s33.579 75 75 75 75-33.579 75-75-33.579-75-75-75Zm0 120c-24.853 0-45-20.147-45-45s20.147-45 45-45 45 20.147 45 45-20.147 45-45 45Zm0 30c-41.421 0-125 20.579-125 62v34h250v-34c0-41.421-83.579-62-125-62Zm95.402 66H160.598c10.23-15.745 65.947-32 95.402-32 29.455 0 85.172 16.255 95.402 32Z"
      fill={props.color || "currentColor"}
    />
  </Svg>
);

export default SelfIcon;
