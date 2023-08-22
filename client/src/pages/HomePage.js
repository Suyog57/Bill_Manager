import React, { useState, useEffect } from "react";
import { Form, Input, message, Modal, Select, Table, DatePicker } from "antd";
import {
  UnorderedListOutlined,
  AreaChartOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import Spinner from "./../components/Spinner";
import moment from "moment";
import Analytics from "../components/Analytics";
import '../styles/HeaderStyles.css'
const { RangePicker } = DatePicker;

const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allTransection, setAllTransection] = useState([]);
  const [frequency, setFrequency] = useState("7");
  const [selectedDate, setSelectedate] = useState([]);
  const [type, setType] = useState("all");
  const [viewData, setViewData] = useState("table");
  const [editable, setEditable] = useState(null);

  //table data
  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      render: (text) => <span>{moment(text).format("YYYY-MM-DD")}</span>,
    },
    {
      title: "Amount",
      dataIndex: "amount",
    },
    {
      title: "Product",
      dataIndex: "product",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Invoice",
      dataIndex: "invoice",
    },
    {
      title: "Cheque Number",
      dataIndex: "description",
    },
    {
      title: "Cheque Date",
      dataIndex: "category",
    },
    {
      title: "Actions",
      render: (text, record) => (
        <div>
          <EditOutlined
            onClick={() => {
              setEditable(record);
              setShowModal(true);
            }}
          />
          <DeleteOutlined
            className="mx-2"
            onClick={() => {
              handleDelete(record);
            }}
          />
        </div>
      ),
    },
  ];

  //getall transactions

  //useEffect Hook
  useEffect(() => {
    const getAllTransactions = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        console.log("user is :"+ JSON.stringify( user));
        // console.log({userid: user._id,
        //   frequency,
        //   selectedDate,
        //   type,});
        setLoading(true);
        const token = localStorage.getItem("token");
        // console.log("Here it is "+token);
        // const config = {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // };
        const payload = {
          frequency,
          selectedDate,
          status: type === "all" ? "" : type.toLowerCase(),
        };
        console.log(payload);
        const res = await axios.post(
          `${process.env.REACT_APP_URL}/api/v1/transections/get-transection`,
          payload
        );
        setAllTransection(res.data);
        setLoading(false);
      } catch (error) {
        message.error("Fetch Issue With Tranction");
        console.log(error);
      }
    };
    getAllTransactions();
  }, [frequency, selectedDate, type, setAllTransection]);

  //delete handler
  const handleDelete = async (record) => {
    try {
      setLoading(true);
      await axios.post(`${process.env.REACT_APP_URL}/api/v1/transections/delete-transection`, {
        transacationId: record._id,
      });
      setLoading(false);
      message.success("Transaction Deleted!");
    } catch (error) {
      setLoading(false);
      console.log(error);
      message.error("unable to delete");
    }
  };

  // form handling
  const handleSubmit = async (values) => {
    console.log("Hande submit: "+JSON.stringify(values));
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      console.log(user);
      setLoading(true);
      if (editable) {
        await axios.post(`${process.env.REACT_APP_URL}/api/v1/transections/edit-transection`, {
          payload: {
            ...values
          },
          transacationId: editable._id,
        });
        setLoading(false);
        message.success("Transaction Updated Successfully");
      } else {
        await axios.post(`${process.env.REACT_APP_URL}/api/v1/transections/add-transection`, {
          ...values
        });
        setLoading(false);
        console.log({
          ...values
        });
        message.success("Transaction Added Successfully");
      }
      setShowModal(false);
      setEditable(null);
    } catch (error) {
      setLoading(false);
      console.log(error);
      message.error("please fill all fields");
    }
  };

  return (
    <Layout>
      {loading && <Spinner />}
      <div className="filters">
        <div>
          <h6>Select Frequency</h6>
          <Select value={frequency} onChange={(values) => setFrequency(values)}>
            <Select.Option value="7">Last 1 Week</Select.Option>
            <Select.Option value="30">Last 1 Month</Select.Option>
            <Select.Option value="365">Last 1 year</Select.Option>
            <Select.Option value="custom">custom</Select.Option>
          </Select>
          {frequency === "custom" && (
            <RangePicker
              value={selectedDate}
              onChange={(values) => setSelectedate(values)}
            />
          )}
        </div>
        <div className="filter-tab ">
          <h6>Select Type</h6>
          <Select value={type} onChange={(values) => setType(values)}>
            <Select.Option value="all">ALL</Select.Option>
            <Select.Option value="Paid">Paid</Select.Option>
            <Select.Option value="Unpaid">Unpaid</Select.Option>
          </Select>
        </div>
        <div className="switch-icons">
          <UnorderedListOutlined
            className={`mx-2 ${
              viewData === "table" ? "active-icon" : "inactive-icon"
            }`}
            onClick={() => setViewData("table")}
          />
          <AreaChartOutlined
            className={`mx-2 ${
              viewData === "analytics" ? "active-icon" : "inactive-icon"
            }`}
            onClick={() => setViewData("analytics")}
          />
        </div>
        <div>
          <button
            className="btn3"
            onClick={() => setShowModal(true)}
          >
            Add New
          </button>
        </div>
      </div>
      <div className="content">
        {viewData === "table" ? (
          <Table columns={columns} dataSource={allTransection} />
        ) : (
          <Analytics allTransection={allTransection} />
        )}
      </div>
      <Modal
        title={editable ? "Edit Transaction" : "Add Transection"}
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={false}
      >
        <Form
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={editable}
        >
        <Form.Item label="Product" name="product">
            <Input type="text" required />
          </Form.Item>
          <Form.Item label="Quantity" name="quantity">
            <Input type="text" required />
          </Form.Item>
          <Form.Item label="Amount" name="amount">
            <Input type="text" required />
          </Form.Item>
          <Form.Item label="Status" name="status">
            <Select>
              <Select.Option value="paid">Paid</Select.Option>
              <Select.Option value="unpaid">Unpaid</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Date" name="date">
            <Input type="date" />
          </Form.Item>
          <Form.Item label="Invoice" name="invoice">
            <Input type="text" required />
          </Form.Item>
          <Form.Item label="Cheque number (if paid by cheque)" name="description">
            <Input type="text"/>
          </Form.Item>
          <Form.Item label="Cheque date" name="category">
            {/* <Select>
              <Select.Option value="salary">Salary</Select.Option>
              <Select.Option value="project">Project</Select.Option>
              <Select.Option value="bills">Bills</Select.Option>
              <Select.Option value="medical">Medical</Select.Option>
              <Select.Option value="fee">Fee</Select.Option>
              <Select.Option value="tax">TAX</Select.Option>
              <Select.Option value="Others">Others</Select.Option>
            </Select> */}
            <Input type="text" required />
          </Form.Item>
          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-primary">
              {" "}
              SAVE
            </button>
          </div>
        </Form>
      </Modal>
    </Layout>
  );
};

export default HomePage;
