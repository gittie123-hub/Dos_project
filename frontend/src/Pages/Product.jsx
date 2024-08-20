import React, {useContext} from 'react';
import { ShopContext } from '../Context/ShopContext';
import { useParams } from 'react-router-dom';
import Breadcrum from '../Components/Breadcrums/Breadcrum';
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay';
import DescriptionBox from '../Components/DescriptionBox/DescriptionBox';
import RelatedProducts from '../Components/RelatedProducts/RelatedProducts';

const Product = () => {
  const {all_product} = useContext(ShopContext);
  const {productId} = useParams();
  /* Using productid we find the product in all-product data and assign a variable  */
  const product = all_product.find((e)=> e.id === Number(productId));
  /* changing the string to number */

  return (
    <div>
      <Breadcrum product = {product}/>
      <ProductDisplay product ={product}/>
      <DescriptionBox/>
      <RelatedProducts/>
    </div>
  )
}

export default Product