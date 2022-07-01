import React from 'react';
import './Footer.css'

export default function Footer() {
  return (
    <footer>
        <p className="footer-text">2022 Krista Strucke</p>
        <div id="social-links">
            <a href="https://github.com/kurikurichan">
                <i className="fa-brands fa-github-alt"></i>
            </a>
            <a href="https://www.linkedin.com/in/krista-strucke-044b3369/">
                <i className="fa-brands fa-linkedin-in"></i>
            </a>
        </div>
    </footer>
  )
}
