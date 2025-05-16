import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const Loading = ({ tip = "Đang tải dữ liệu..." }: { tip?: string }) => {
  return (
    <div className="flex justify-center items-center h-64">
      <Spin indicator={<LoadingOutlined/>} size="large" tip={tip} />
    </div>
  );
};

export default Loading;
