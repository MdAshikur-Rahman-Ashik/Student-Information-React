import React from 'react'
import { Link } from 'react-router-dom'
import '../App.css'
export const Nav = () => {
  return ( <nav>  <ul>
      <li><Link className='style' to="/">Home</Link></li>
      <li><Link className='style' to="/list">Student List</Link></li>
      <li><Link className='style' to="/list/add">Add Student</Link></li>
  </ul>  </nav>  )
}
