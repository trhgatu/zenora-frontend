import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { ReactNode } from "react";

type PageLoaderWrapperProps = {
  loading: boolean;
  tip?: string;
  children: ReactNode;
};

const PageLoaderWrapper = ({ loading, tip = "Đang tải dữ liệu...", children }: PageLoaderWrapperProps) => {
  return (
    <Spin indicator={<LoadingOutlined/>} spinning={loading} tip={tip} size="large">
      <div className={loading ? "opacity-60 pointer-events-none select-none" : ""}>
        {children}
      </div>
    </Spin>
  );
};

export default PageLoaderWrapper;
