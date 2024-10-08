import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
    const [credentials, setCredentials] = useState({ name: "", email: "", password: "" });
    let navigate  = useNavigate();

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
           
            const response = await fetch("http://localhost:4000/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name: credentials.name, email: credentials.email, password: credentials.password })
            });
          
            const data = await response.json();
            console.log("subscribe response: "+ data);
            localStorage.setItem('token' , data.token);
            alert("Registered Successfully");
            navigate('/')

        } catch (error) {
            console.error("Error:", error); // Log any errors
        }
    };

    return (
        <div className='container my-3'>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Full Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        onChange={onChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        aria-describedby="emailHelp"
                        onChange={onChange}
                    />
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        onChange={onChange}
                    />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
}
