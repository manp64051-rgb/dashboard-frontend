import React from 'react'
import {Link} from "react-router-dom";
function Header() {
  const handleLogout = () => {
    localStorage.removeItem("authToken"); // remove auth token
    window.location.href = "/"; // redirect to login page
  };
  return (
    
    <div className='header'>
    <div>
      <img src="/images/hem.jpg"></img>
     </div>
      <ul>
        <li><Link to="/Home"> Home</Link></li>
        <li><Link to="/TTS">Text To Speech</Link></li>
        <li><Link to="/STT">Speech To Text</Link></li>
        <li><Link to="/SpeechTranslate"> SpeechTranslate</Link></li>
        <button onClick={handleLogout}> Logout</button>
        <i class="ri-menu-line"></i>
      </ul>
    </div>

   
      
    

  
    
  )
}

export default Header
