import { Image, Empty } from "antd";
import { useFetchImage } from "../../api/product/queries";

const ImageCard = ({ id }: { id: any }) => {
  const { data: getImageData } = useFetchImage(Number(id));
  console.log(getImageData);

  return (
    <>
      {!getImageData ? (
        <Empty description="" imageStyle={{ width: 40, height: 40 }} />
      ) : (
        <Image width={50} height={40} src={getImageData} />
      )}
    </>
  );
};

export default ImageCard;
