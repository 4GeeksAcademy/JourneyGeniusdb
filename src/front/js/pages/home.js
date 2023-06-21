import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";

export const Home = () => {
	const { store, actions } = useContext(Context);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = () => {
        if (!validateEmail(email)) {
            alert("Please insert a valid e-mail.");
            return;
        }
        if (password === "") {
            alert("Please insert a password.");
            return;
        }
        actions.registerUser(email, password);
    };

    const validateEmail = email => {
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-6">
                    <h1 className="mt-5">How does it work?</h1>
                    <p className="text-wrap">A description of the app</p>
                </div>
                <div className="col-6">
                    <div className="d-flex flex-column align-items-center justify-content-center">
                        <h1 className="mt-5">REGISTER</h1>
                        <input type="email" className="form-control mt-2" placeholder="Email" onChange={e => setEmail(e.target.value)} />
                        <input type="password" className="form-control mt-2" placeholder="Password" onChange={e => setPassword(e.target.value)} />
                        <button className="btn btn-primary mt-2" onClick={handleRegister}>Submit</button>
                    </div>
                </div>
            </div>
        </div>
    );
};