import React, { useState, useEffect } from "react";
import { Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../components/Spinner";
import "../styles/Loginpage.css";
const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  //from submit
  const submitHandler = async (values) => {
    console.log(values);
    try {
      setLoading(true);
      const { data } = await axios.post(`${process.env.REACT_APP_URL}/api/v1/users/login`, values);
      setLoading(false);
      message.success("login success");
      console.log("Here is data: "+JSON.stringify(data));
      localStorage.setItem(
        "user",
        JSON.stringify({ ...data.user, password: "" })
      );
      localStorage.setItem("token", data.token);
      console.log('Token:', data.token);
      
      console.log("the set user is " +JSON.stringify({ ...data.user, password: "" }));
      navigate("/");
    } catch (error) {
      setLoading(false);
      message.error("something went wrong");
    }
  };

  //prevent for login user
  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/");
    }
  }, [navigate]);
  return (
    <>
      <div className="login-page ">
        {loading && <Spinner />}
        <div className="row container">
          <div className="login-form">
            <Form layout="vertical" onFinish={submitHandler}>
              <h1>Login</h1>

              <Form.Item label="Email" name="email">
                <Input type="email" required />
              </Form.Item>
              <Form.Item label="Password" name="password">
                <Input type="password" required />
              </Form.Item>
              <div className="d-flex justify-content-between sflexx">
                <Link to="/register">
                  Not a user ? Click Here to regsiter !
                </Link>
                <button className="btn">Login</button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
