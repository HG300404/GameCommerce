import { Upload } from "antd";
import styled from "styled-components";

export const WrapperHeader = styled.h1`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  font-size: 32px;
  font-weight: bold;
  padding: 20px 30px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  text-align: center;
  margin-bottom: 30px;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

export const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

export const StatsCard = styled.div`
  background: linear-gradient(135deg, ${props => props.gradient || '#667eea 0%, #764ba2 100%'});
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  color: white;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
  }

  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 500;
    opacity: 0.9;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  p {
    margin: 10px 0 0 0;
    font-size: 32px;
    font-weight: bold;
  }
`;

export const DashboardRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 30px;
  margin-bottom: 30px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const ChartContainer = styled.div`
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  h2 {
    color: #333;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 2px solid #667eea;
  }
`;

export const BestSellersContainer = styled.div`
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  h2 {
    color: #333;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 2px solid #667eea;
  }
`;

export const BestSellerItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  margin-bottom: 10px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 8px;
  border-left: 4px solid ${props => props.color || '#667eea'};
  transition: transform 0.2s ease;

  &:hover {
    transform: translateX(5px);
  }

  .rank {
    font-size: 24px;
    font-weight: bold;
    color: ${props => props.color || '#667eea'};
    min-width: 40px;
  }

  .info {
    flex: 1;
    margin-left: 15px;

    .name {
      font-size: 16px;
      font-weight: bold;
      color: #333;
      margin-bottom: 5px;
    }

    .stats {
      font-size: 14px;
      color: #666;
    }
  }

  .revenue {
    font-size: 18px;
    font-weight: bold;
    color: ${props => props.color || '#667eea'};
  }
`;

export const WrapperUploadFile = styled(Upload)`
  & .ant-upload.ant-upload-select.ant-upload-select-picture-card {
    width: 60px;
    height: 60px;
    border-radius: 50%;
  }
  & .ant-upload-list-item-info {
    display: none;
  }
  & .ant-upload-list-item {
    display: none;
  }
`;
