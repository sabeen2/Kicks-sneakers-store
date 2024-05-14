import { Image } from "antd";
import { useFetchImageBase } from "../api/product/queries";
import sample from "../assets/lol.png";

const ImageCard = ({ id }: { id: any }) => {
  const { data: getImageData } = useFetchImageBase(id);

  return (
    <>
      {!getImageData ? (
        <Image width={300} height={200} src={sample} />
      ) : (
        <Image
          width={300}
          height={200}
          src={`data:image/jpeg;base64,${getImageData?.data}`}
        />
      )}
    </>
  );
};

export default ImageCard;
