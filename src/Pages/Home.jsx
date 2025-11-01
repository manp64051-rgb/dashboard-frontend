// import React from 'react'
 import Header from '../components/Header'
import "./Home.css";

export default function Home() {
  return (
    <div>
      <Header/>
    <div className="main">
      <div className="right">
<h1>Welcome to <span>Home</span> Page</h1>
<p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nobis,<span className='text'> doloremque? Obcaecati ab vel officia</span> dignissimos consequatur 
  possimus aperiam. Sit commodi quod enim similique fugiat dolorum vitae qui reprehenderit quas voluptate.</p>
  </div>
  <div className="left" >
    <img src= "images/Home.png" />
  </div>
    </div>
    </div>
  )
}


