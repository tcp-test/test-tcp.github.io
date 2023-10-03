import { Types } from "connectkit";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";

const MyCustomAvatar = ({ address, ensImage, ensName, size, radius }: Types.CustomAvatarProps) => {
  return (
    <Jazzicon diameter={size} seed={jsNumberForAddress(address)} />
  );
};

export default MyCustomAvatar;