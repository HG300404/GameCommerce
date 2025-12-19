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
  
  button {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    color: white;
    font-weight: 500;
    padding: 8px 20px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }
  }
`;

export const DrawerFormWrapper = styled.div`
  .ant-form-item-label > label {
    font-weight: 600;
    color: #333;
    font-size: 14px;
  }

  .ant-input {
    border-radius: 8px;
    border: 2px solid #e0e0e0;
    padding: 10px 15px;
    transition: all 0.3s ease;

    &:hover {
      border-color: #667eea;
    }

    &:focus {
      border-color: #667eea;
      box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
    }
  }

  .ant-btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    height: 40px;
    font-weight: 600;
    border-radius: 8px;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }
  }
`;

export const AvatarPreview = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-top: 10px;

  img {
    border: 3px solid #667eea;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }
`;
