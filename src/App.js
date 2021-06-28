import React, { useState } from "react";
import "./App.css";
import success from "./assets/success.png";
import "react-notifications/lib/notifications.css";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailErr, setemErr] = useState("");
  const [nameErr, setnaErr] = useState("");
  const [state, setState] = useState("none"); // none | loading | success | faliure

  const namevalid = () => {
    if (!name.length || name.length >= 60) {
      setnaErr("Name has to be between 0 and 60 characters");
      return true;
    } else {
      setnaErr("");
      return false;
    }
  };

  const emailvalid = () => {
    if (
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      setemErr("");
      return false;
    } else {
      setemErr("Invalid email");
      return true;
    }
  };

  const handleSubscribe = () => {
    const body = {
      name,
      email,
      isSubscribed: true,
    };

    let isnameValid = namevalid();
    let isemailValid = emailvalid();

    if (isnameValid || isemailValid) return;

    setState("loading");

    fetch("http://localhost:8000/users/", {
      method: "POST",
      headers: new Headers({
        "content-type": "application/json",
      }),
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.id) {
          setState("success");
          NotificationManager.success("User registered", "Success");
        } else if (data.email[0]) {
          setState("faliure");
          NotificationManager.error(data.email[0]);
        }
        console.log(data);
      })
      .catch((err) => {
        console.error(err);
        setState("faliure");
        NotificationManager.error(
          "Could not subscribe. Please try again",
          "Error"
        );
      });
  };

  return (
    <div className="App">
      <div className="container">
        {(state === "none" || state === "loading" || state === "faliure") && (
          <>
            <div className="left-text">
              <h1>Sign up for our weekly newsletter</h1>
              <p>
                to get weekly updates and news about our product.
                <br />
                And don't worry! You can unsubscribe at any point.
              </p>
            </div>
            <div className="right-form">
              <div className="form-container">
                <div>
                  <input
                    type="text"
                    name="name"
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                    disabled={state === "loading"}
                  />
                  <span className="err-msg">{nameErr}</span>
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    disabled={state === "loading"}
                  />
                  <span className="err-msg">{emailErr}</span>
                </div>
                <button
                  onClick={handleSubscribe}
                  disabled={state === "loading"}
                >
                  {state === "loading" ? "Loading..." : "Subscribe"}
                </button>
              </div>
            </div>
          </>
        )}
        {state === "success" && (
          <div className="success-box">
            <img src={success} alt="success" />
            <h1>You've registered to our newsletter.</h1>
          </div>
        )}
      </div>
      <NotificationContainer />
    </div>
  );
}

export default App;
