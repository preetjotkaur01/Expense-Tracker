import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

export default function Login() {
  let navigate = useNavigate();

  const[credentials , setCredentials] = useState({email:"" , password :""})

  const onChange = (e) =>{
      setCredentials({...credentials , [e.target.name]:e.target.value})
  }

  const handleSubmit = async(e)=>{
      e.preventDefault();

      try {

        const response =  await fetch("http://localhost:4000/api/auth/login" ,{
            method: "POST" , 
            headers: {
                "content-type":"application/json"
            },
            body: JSON.stringify({email:credentials.email , password : credentials.password})
            
        })
        const data = await response.json();  
        console.log(data);
              localStorage.setItem('token' , data.token);
              navigate('/')
              alert("Logined Successfully");
        
      } catch (error) {

        console.log(error.message);
        
      }
      
  }   

return (
  <div>
    <form className="container my-3" onSubmit={handleSubmit}>
      <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input type="email" className="form-control my-2"   id="email" name='email' aria-describedby="emailHelp" placeholder="Enter email" onChange={onChange}/>
          <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
      </div>
      <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" className="form-control my-2"  id="password" name='password' placeholder="Password" onChange={onChange}/>
      </div>
      
      <button type="submit" className="btn btn-primary my-2">Submit</button>
  </form>
  </div>
  )
}
