import React from 'react';
import './Footer.css'

export default function Footer() {
  return (
    <footer>
      <div id="name">
        <p>©2022 The nerd behind the scenes:</p>
        <a href="https://krista.red/" target="_blank" rel="noopener noreferrer" className="footer-text">
          Krista Strucke
        </a>
      </div>
      <div id="social-links">
          <a href="https://github.com/kurikurichan" target="_blank" rel="noopener noreferrer">
              <i className="fa-brands fa-github-alt"></i>
          </a>
          <a href="https://www.linkedin.com/in/krista-strucke" target="_blank" rel="noopener noreferrer">
              <i className="fa-brands fa-linkedin-in"></i>
          </a>
          <a href="https://note-pile.herokuapp.com" target="_blank" rel="noopener noreferrer" title="Note Pile">
              <i className="fa-solid fa-leaf" style={{fontSize: "25px"}}></i>
          </a>
      </div>
    </footer>
  )
}
