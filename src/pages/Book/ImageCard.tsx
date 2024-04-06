import { Image, Empty } from "antd";
import { useFindBookImageById } from "../../api/book/queries";

const ImageCard = ({ id, hasImage }: { id: string; hasImage: boolean }) => {
  const { data: getImageData } = useFindBookImageById(Number(id), hasImage);

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
