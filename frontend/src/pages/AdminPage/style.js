import styled from "styled-components";

export const AdminContainer = styled.div`
  display: flex;
  overflow-x: hidden;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

export const MenuWrapper = styled.div`
  width: 280px;
  background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.15);
  min-height: 100vh;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  }
`;

export const MenuHeader = styled.div`
  padding: 30px 20px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  h2 {
    color: #fff;
    font-size: 24px;
    font-weight: bold;
    margin: 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  p {
    color: rgba(255, 255, 255, 0.6);
    font-size: 12px;
    margin: 5px 0 0 0;
    text-transform: uppercase;
    letter-spacing: 2px;
  }
`;

export const MenuItem = styled.div`
  display: flex;
  align-items: center;
  padding: 18px 25px;
  margin: 8px 15px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  background: ${(props) =>
        props.active
            ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            : "transparent"};

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
    opacity: ${(props) => (props.active ? "1" : "0")};
    transition: opacity 0.3s ease;
  }

  &:hover {
    background: ${(props) =>
        props.active
            ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            : "rgba(102, 126, 234, 0.1)"};
    transform: translateX(5px);

    &::before {
      opacity: 1;
    }
  }

  .icon {
    font-size: 22px;
    color: ${(props) => (props.active ? "#fff" : "rgba(255, 255, 255, 0.7)")};
    margin-right: 15px;
    transition: all 0.3s ease;
  }

  .label {
    font-size: 16px;
    font-weight: ${(props) => (props.active ? "600" : "500")};
    color: ${(props) => (props.active ? "#fff" : "rgba(255, 255, 255, 0.8)")};
    transition: all 0.3s ease;
  }

  &:hover .icon,
  &:hover .label {
    color: #fff;
  }
`;

export const ContentWrapper = styled.div`
  flex: 1;
  padding: 30px;
  overflow-y: auto;
  background: transparent;
`;
