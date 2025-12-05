import React, { useEffect, useRef, useState } from "react";
import { WrapperHeader, WrapperUploadFile } from "./style";
import { Button, Form, Modal, Select } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import TableComponent from "../TableComponent/TableComponent";

import InputComponent from "../InputComponent/InputComponent";
import { getBase64, renderOptions } from "../../utils";
import * as GameService from "../../services/GameService.js";
import { useMutationHooks } from "../../hooks/userMutationHook.js";
import Loading from "../LoadingComponent/Loading";
import * as message from "../../components/Message/Message.js";
import { useQuery } from "@tanstack/react-query";
import { DeleteOutlined, EditOutlined, Highlighter } from "@ant-design/icons";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import { useSelector } from "react-redux";
import ModalComponent from "../ModalComponent/ModalComponent";
const AdminGame = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [rowSelected, setRowSelected] = useState("");
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [typeSelect, setTypeSelect] = useState("");
  const user = useSelector((state) => state?.user);

  const [stateGame, setStateGame] = useState({
    name: "",
    type: "",
    price: "",
    platform: "",
    rating: "",
    description: "",
    discount: "",
    selled: "",
    image: "",
    newType: "",
  });
  const [stateGameDetails, setStateGameDetails] = useState({
    name: "",
    type: "",
    price: "",
    platform: "",
    rating: "",
    description: "",
    discount: "",
    selled: "",
    image: "",
  });

  const [typeGames, setTypeGames] = useState({});
  const [form] = Form.useForm();

  const mutation = useMutationHooks((data) => GameService.createGame(data));
  const { data, isLoading, isSuccess, isError } = mutation;

  const getAllGames = async () => {
    const res = await GameService.getAllGame();
    return res;
  };
  const queryGame = useQuery({
    queryKey: ["games"],
    queryFn: getAllGames,
  });

  const { isLoading: isLoadingGames, data: games } = queryGame;

  const fetchAllTypeGame = async () => {
    const res = await GameService.getAllTypeGame();
    if (res?.status === "OK") {
      setTypeGames(res?.data);
    }
    return res;
  };
  const typeGame = useQuery({
    queryKey: ["type-game"],
    queryFn: fetchAllTypeGame,
  });

  useEffect(() => {
    fetchAllTypeGame();
  }, []);

  const onUpdateGame = () => {
    mutationUpdate.mutate(
      {
        id: rowSelected,
        token: user?.access_token,
        ...stateGameDetails,
      },
      {
        onSettled: () => {
          queryGame.refetch();
        },
      }
    );
  };

  const mutationDelete = useMutationHooks(async (data) => {
    const { id, token } = data;
    const res = await GameService.deleteGame(id, token);
    return res;
  });

  const mutationDeleteMany = useMutationHooks(async (data) => {
    const { token, ...ids } = data;
    const res = await GameService.deleteManyGame(ids, token);
    return res;
  });

  const mutationUpdate = useMutationHooks(async (data) => {
    const { id, token, ...rests } = data;
    const res = await GameService.updateGame(id, token, { ...rests });
    return res;
  });

  const handleDeleteManyGames = (ids) => {
    mutationDeleteMany.mutate(
      { ids: ids, token: user?.access_token },
      {
        onSettled: () => {
          queryGame.refetch();
        },
      }
    );
  };
  const {
    data: dataDeleted,
    isLoading: isLoadingDeleted,
    isSuccess: isSuccessDeleted,
    isError: isErrorDeleted,
  } = mutationDelete;
  const {
    data: dataDeletedMany,
    isLoading: isLoadingDeletedMany,
    isSuccess: isSuccessDeletedMany,
    isError: isErrorDeletedMany,
  } = mutationDeleteMany;

  const {
    data: dataUpdated,
    isLoading: isLoadingUpdated,
    isSuccess: isSuccessUpdated,
    isError: isErrorUpdated,
  } = mutationUpdate;

  const fetchGetDetailsGame = async () => {
    const res = await GameService.getDetailsGame(rowSelected);
    if (res?.data) {
      setStateGameDetails({
        name: res?.data?.name,
        type: res?.data?.type,
        price: res?.data?.price,
        platform: res?.data?.platform,
        rating: res?.data?.rating,
        description: res?.data?.description,
        discount: res?.data?.discount,
        selled: res?.data?.selled,
        image: res?.data?.image,
      });
    }
    // setIsLoadingUpdate(false);
  };
  useEffect(() => {
    form.setFieldsValue(stateGameDetails);
  }, [form, stateGameDetails]);

  useEffect(() => {
    if (rowSelected && isOpenDrawer) {
      setIsLoadingUpdate(true);
      fetchGetDetailsGame(rowSelected);
    }
    // setIsOpenDrawer(true);
  }, [rowSelected, isOpenDrawer]);

  // Helper function to format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // Helper function to render star rating
  const renderStarRating = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <span style={{ fontSize: '16px' }}>
          {'⭐'.repeat(fullStars)}
          {hasHalfStar && '⭐'}
          {'☆'.repeat(emptyStars)}
        </span>
        <span style={{ color: '#888', fontSize: '12px' }}>({rating}/5)</span>
      </div>
    );
  };

  const renderAction = () => {
    return (
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <EditOutlined
          style={{
            color: "#1890ff",
            fontSize: "20px",
            cursor: "pointer",
            transition: 'all 0.3s'
          }}
          onClick={handleDetailsGames}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.2)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        />
        <DeleteOutlined
          style={{
            color: "#ff4d4f",
            fontSize: "20px",
            cursor: "pointer",
            transition: 'all 0.3s'
          }}
          onClick={() => setIsModalOpenDelete(true)}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.2)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        />
      </div>
    );
  };

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <InputComponent
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />

        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
          icon={<SearchOutlined />}
          size="small"
          style={{
            width: 90,
          }}
        >
          Search
        </Button>
        <Button
          onClick={() => clearFilters && handleReset(clearFilters)}
          size="small"
          style={{
            width: 90,
          }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    // render: (text) =>
    //   searchedColumn === dataIndex ? (
    // <Highlighter
    //   highlightStyle={{
    //     backgroundColor: "#ffc069",
    //     padding: 0,
    //   }}
    //   searchWords={[searchText]}
    //   autoEscape
    //   textToHighlight={text ? text.toString() : ""}
    // />
    // ) : (
    //     text
    //   ),
  });

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps("name"),
    },
    {
      title: "Price",
      dataIndex: "price",
      sorter: (a, b) => a.price - b.price,
      render: (price) => (
        <span style={{ fontWeight: '500', color: '#52c41a' }}>
          {formatPrice(price)}
        </span>
      ),
      filters: [
        {
          text: ">= 50",
          value: ">=",
        },
        {
          text: "< 50",
          value: "<=",
        },
      ],
      onFilter: (value, record) => {
        if (value === ">=") {
          return record.price >= 50;
        } else {
          return record.price < 50;
        }
      },
    },
    {
      title: "Rating",
      dataIndex: "rating",
      sorter: (a, b) => a.rating - b.rating,
      render: (rating) => renderStarRating(rating),
      filters: [
        {
          text: "> 4.5",
          value: ">",
        },
        {
          text: "3.0 - 4.5",
          value: "-",
        },
        {
          text: "< 3.0",
          value: "<",
        },
      ],
      onFilter: (value, record) => {
        if (value === ">") {
          return record.rating > 4.5;
        } else if (value === "<") {
          return record.rating < 3.0;
        } else {
          return record.rating >= 3.0 && record.rating <= 4.5;
        }
      },
    },
    {
      title: "Type",
      dataIndex: "type",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: renderAction,
      align: "center",
    },
  ];

  const dataTable =
    games?.data?.length &&
    games?.data?.map((game) => {
      return { ...game, key: game._id };
    });

  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
    setStateGameDetails({
      name: "",
      type: "",
      price: "",
      platform: "",
      rating: "",
      description: "",
      discount: "",
      selled: "",
      image: "",
    });
    form.resetFields();
  };

  useEffect(() => {
    if (isSuccess && data?.status === "OK") {
      message.success();
      handleCancel();
    } else if (isError) {
      message.error();
    }
  }, [isSuccess, isError]);

  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === "OK") {
      message.success();
      handleCloseDrawer();
    } else if (isErrorUpdated) {
      message.error();
    }
  }, [isSuccessUpdated, isErrorUpdated]);

  useEffect(() => {
    if (isSuccessDeleted && dataDeleted?.status === "OK") {
      message.success();
      handleCancelDelete();
    } else if (isErrorDeleted) {
      message.error();
    }
  }, [isSuccessDeleted, isErrorDeleted]);
  useEffect(() => {
    if (isSuccessDeletedMany && dataDeletedMany?.status === "OK") {
      message.success();
    } else if (isErrorDeletedMany) {
      message.error();
    }
  }, [isSuccessDeletedMany, isErrorDeletedMany]);
  const handleDetailsGames = () => {
    setIsOpenDrawer(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setStateGame({
      name: "",
      type: "",
      price: "",
      platform: "",
      rating: "",
      description: "",
      discount: "",
      selled: "",
      image: "",
    });
    form.resetFields();
  };
  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  };

  const handleDeleteGame = () => {
    mutationDelete.mutate(
      { id: rowSelected, token: user?.access_token },
      {
        onSettled: () => {
          queryGame.refetch();
        },
      }
    );
  };
  const onFinish = () => {
    const params = {
      name: stateGame.name,
      type: stateGame.type === "add_type" ? stateGame.newType : stateGame.type,
      price: stateGame.price,
      platform: stateGame.platform,
      rating: stateGame.rating,
      description: stateGame.description,
      discount: stateGame.discount,
      selled: stateGame.selled,
      image: stateGame.image,
    };
    mutation.mutate(params, {
      onSettled: () => {
        queryGame.refetch();
      },
    });
  };

  const handleOnchange = (e) => {
    setStateGame({
      ...stateGame,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnchangeSelect = (value) => {
    setStateGame({
      ...stateGame,
      type: value,
    });
  };

  const handleOnchangeAvatar = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    console.log("file", file.preview);
    setStateGame({
      ...stateGame,
      image: file.preview,
    });
  };

  const handleOnchangeDetails = (e) => {
    console.log("check", e.target.name, e.target.value);
    setStateGameDetails({
      ...stateGameDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnchangeAvatarDetails = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    console.log("file", file.preview);
    setStateGameDetails({
      ...stateGameDetails,
      image: file.preview,
    });
  };

  return (
    <div style={{ marginTop: "10px" }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px"
      }}>
        <WrapperHeader style={{ margin: 0 }}>Manager Games</WrapperHeader>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          style={{
            backgroundColor: "#52c41a",
            borderColor: "#52c41a",
            height: "45px",
            fontSize: "16px",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: "0 2px 8px rgba(82, 196, 26, 0.3)",
          }}
          onClick={() => setIsModalOpen(true)}
        >
          Thêm Game Mới
        </Button>
      </div>
      <div style={{ marginTop: "20px" }}>
        <TableComponent
          handleDeleteMany={handleDeleteManyGames}
          columns={columns}
          isLoading={isLoadingGames}
          data={dataTable}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                setRowSelected(record._id);
              },
            };
          }}
        />
      </div>
      <ModalComponent
        forceRender
        title="Add New Game"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        {" "}
        <Form
          name="basic"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
          form={form}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input name game!" }]}
          >
            <InputComponent
              value={stateGame.name}
              onChange={handleOnchange}
              name="name"
            />
          </Form.Item>

          <Form.Item
            label="Type"
            name="type"
            rules={[{ required: true, message: "Please input type game!" }]}
          >
            <Select
              // defaultValue="lucy"
              // style={{ width: 120 }}
              name="type"
              value={stateGame.type}
              onChange={handleOnchangeSelect}
              options={renderOptions(typeGame?.data?.data)}
            />
          </Form.Item>
          {stateGame.type === "add_type" && (
            <Form.Item
              label="New type"
              name="new_type"
              rules={[{ required: true, message: "Please input type game!" }]}
            >
              <InputComponent
                value={stateGame.newType}
                onChange={handleOnchange}
                name="newType"
              />
            </Form.Item>
          )}

          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: "Please input price game!" }]}
          >
            <InputComponent
              value={stateGame.price}
              onChange={handleOnchange}
              name="price"
            />
          </Form.Item>
          <Form.Item
            label="Platform"
            name="platform"
            rules={[{ required: true, message: "Please input platform game!" }]}
          >
            <InputComponent
              value={stateGame.platform}
              onChange={handleOnchange}
              name="platform"
            />
          </Form.Item>
          <Form.Item
            label="Rating"
            name="rating"
            rules={[{ required: true, message: "Please input rating game!" }]}
          >
            <InputComponent
              value={stateGame.rating}
              onChange={handleOnchange}
              name="rating"
            />
          </Form.Item>
          <Form.Item
            label="Discount"
            name="discount"
            rules={[{ required: true, message: "Please input discount!" }]}
          >
            <InputComponent
              value={stateGame.discount}
              onChange={handleOnchange}
              name="discount"
            />
          </Form.Item>
          <Form.Item
            label="Selled"
            name="selled"
            rules={[{ required: true, message: "Please input selled!" }]}
          >
            <InputComponent
              value={stateGame.selled}
              onChange={handleOnchange}
              name="selled"
            />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please input description!" }]}
          >
            <InputComponent
              value={stateGame.description}
              onChange={handleOnchange}
              name="description"
            />
          </Form.Item>
          <Form.Item
            label="Image"
            name="image"
            rules={[{ required: true, message: "Please input image!" }]}
          >
            <WrapperUploadFile onChange={handleOnchangeAvatar} maxCount={1}>
              <Button type="button">Select File</Button>
              {stateGame?.image && (
                <img
                  src={stateGame?.image}
                  style={{
                    height: "60px",
                    width: "60px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginLeft: "10px",
                  }}
                  alt="game"
                />
              )}
            </WrapperUploadFile>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </ModalComponent>
      <ModalComponent
        forceRender
        title="Update Game"
        open={isOpenDrawer}
        onCancel={handleCloseDrawer}
        footer={null}
        width={600}
      >
        <Form
          name="updateGame"
          layout="vertical"
          style={{ maxWidth: 600 }}
          onFinish={onUpdateGame}
          autoComplete="on"
          form={form}
        >
          <Form.Item
            label={<span>Name:</span>}
            name="name"
            rules={[{ required: true, message: "Please input name game!" }]}
          >
            <InputComponent
              value={stateGameDetails.name}
              onChange={handleOnchangeDetails}
              name="name"
            />
          </Form.Item>

          <Form.Item
            label={<span>Type:</span>}
            name="type"
            rules={[{ required: true, message: "Please input type game!" }]}
          >
            <InputComponent
              value={stateGameDetails.type}
              onChange={handleOnchangeDetails}
              name="type"
            />
          </Form.Item>
          <Form.Item
            label={<span>Price:</span>}
            name="price"
            rules={[{ required: true, message: "Please input price game!" }]}
          >
            <InputComponent
              value={stateGameDetails.price}
              onChange={handleOnchangeDetails}
              name="price"
            />
          </Form.Item>
          <Form.Item
            label={<span>Platform:</span>}
            name="platform"
            rules={[{ required: true, message: "Please input platform game!" }]}
          >
            <InputComponent
              value={stateGameDetails.platform}
              onChange={handleOnchangeDetails}
              name="platform"
            />
          </Form.Item>
          <Form.Item
            label={<span>Rating:</span>}
            name="rating"
            rules={[{ required: true, message: "Please input rating game!" }]}
          >
            <InputComponent
              value={stateGameDetails.rating}
              onChange={handleOnchangeDetails}
              name="rating"
            />
          </Form.Item>
          <Form.Item
            label={<span>Discount:</span>}
            name="discount"
            rules={[{ required: true, message: "Please input discount!" }]}
          >
            <InputComponent
              value={stateGameDetails.discount}
              onChange={handleOnchangeDetails}
              name="discount"
            />
          </Form.Item>
          <Form.Item
            label={<span>Selled:</span>}
            name="selled"
            rules={[{ required: true, message: "Please input selled!" }]}
          >
            <InputComponent
              value={stateGameDetails.selled}
              onChange={handleOnchangeDetails}
              name="selled"
            />
          </Form.Item>
          <Form.Item
            label={<span>Description:</span>}
            name="description"
            rules={[{ required: true, message: "Please input description!" }]}
          >
            <InputComponent
              value={stateGameDetails.description}
              onChange={handleOnchangeDetails}
              name="description"
            />
          </Form.Item>
          <Form.Item
            label={<span>Image:</span>}
            name="image"
            rules={[{ required: true, message: "Please input image!" }]}
          >
            <WrapperUploadFile
              onChange={handleOnchangeAvatarDetails}
              maxCount={1}
            >
              <Button type="button">Select File</Button>
              {stateGameDetails?.image && (
                <img
                  src={stateGameDetails?.image}
                  style={{
                    height: "60px",
                    width: "60px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginLeft: "10px",
                  }}
                  alt="game"
                />
              )}
            </WrapperUploadFile>
          </Form.Item>
          <Form.Item style={{ textAlign: 'center', marginTop: '20px' }}>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                backgroundColor: '#1890ff',
                borderColor: '#1890ff',
                minWidth: '120px',
                height: '40px',
                fontSize: '16px'
              }}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </ModalComponent>

      <ModalComponent
        title="Delete Game"
        open={isModalOpenDelete}
        onCancel={handleCancelDelete}
        onOk={handleDeleteGame}
      >
        <div>Are you sure delete this game?</div>
      </ModalComponent>
    </div>
  );
};

export default AdminGame;
