import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  let navigate = useNavigate();
  const handleLogout = async(e) =>{
    e.preventDefault();

    try {

      const token = localStorage.getItem('token');
     const response = await fetch('http://localhost:4000/api/auth/logout',{
      method : 'POST',
      headers : {
        "content-type":"application/json",
        "token":token
      }
     })

     const data = await response.json();
     console.log(data);
     localStorage.removeItem('token');
     navigate('/login')
      
    } catch (error) {
       console.log(error.message);
    }
     
  }

  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-body-tertiary "data-bs-theme="dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">Expense Tracker</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">  
            </ul>
             
             {!localStorage.getItem('token')?(
              <form><Link to='/login' className="btn btn-outline-success mx-2">Login</Link>
              <Link to='/signup' className="btn btn-outline-danger mx-2">Sign up</Link></form>)
              :(<button onClick={handleLogout} className='btn btn-success mx-1'>Logout</button>
            )}
            
          </div>
        </div>
      </nav>
    </div>
  )
}
