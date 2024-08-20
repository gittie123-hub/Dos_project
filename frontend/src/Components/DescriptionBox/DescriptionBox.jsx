import React from 'react'
import './DescriptionBox.css'

const DescriptionBox = () => {
  return (
    <div className='descriptionbox'>
        <div className="descriptionbox-navigator">
            <div className="descriptionbox-nav-box">Description</div>
            <div className="descriptionbox-nav-fade">Reviews (123)</div>
            
        </div>
        <div className="descriptionbox-description">
            <p>Introducing our innovative online platform, a dynamic space designed to showcase products, 
facilitate seamless interaction with customers, and serve as a virtual marketplace. Our platform 
provides a comprehensive solution for businesses seeking to establish a digital presence and connect
 with their audience in a meaningful way. From displaying products in captivating formats to enabling 
 real-time communication channels, we offer a holistic approach to online commerce. Through our platform,
  businesses can engage with customers, build relationships, and drive sales in an efficient and effective manner. 
  Join us in revolutionizing the online shopping experience.</p>
  <p>E-Commerce webistes typically display products or services of the detailed descriptipms, images, prices, and 
    any other available variations (e.g., sizes, colors). Each product usually has its own dedicated with relevamt information.</p>
        </div>
    </div>
  )
}

export default DescriptionBox