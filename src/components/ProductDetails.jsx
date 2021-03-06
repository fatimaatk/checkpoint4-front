import { useEffect, useState } from "react";
import { useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
// import { AiOutlineArrowLeft } from "react-icons/ai";
import { FaStar } from "react-icons/fa";
import PanierContext from '../contexts/PanierContext';
import "./../styles/details.css";

const ProductDetails = () => {
  const params = useParams();
  const [product, setProduct] = useState([]);
  const [comments, setComments] = useState([]);
  const [rates, setRates] = useState([]);
  const { cartItems, onAdd } = useContext(PanierContext);


  useEffect(() => {
    getProduct();
    getComments();
    getRates();
  }, [params.id]);


  console.log('panier', cartItems)

  const getProduct = () => {
    axios
      .get(`http://localhost:8000/products/${params.id}`)
      .then((response) => { 
        setProduct(response.data);
      });
  };

  const getComments = () => {
    axios
      .get(`http://localhost:8000/comments/${params.id}`)
      .then((response) => {
        setComments(response.data);
      });
  };

  const getRates = () => {
    axios
      .get(`http://localhost:8000/comments/rates/${params.id}`)
      .then((response) => {
        setRates(response.data);
      });
  };

  console.log(cartItems)

  return (
    <div className="mainProduct">
      <div className="backProducts">
        <Link to="/products">
          <p>Revenir à la page produits</p>
        </Link>
      </div>
      <div className="detailGlobal">
        <div className="detailImage">
          <div className="productImage">
            <div className="autreImage">
              <img
                src={product.image2}
                alt={product.title}
                className={product.image3 ? "image2 w-32" : "image2 w-44"}
              />
              {product.image3 ? (
                <img
                  src={product.image3}
                  alt={product.title}
                  className="image3 w-32"
                />
              ) : null}
            </div>
            <img src={product.image1} alt={product.title} className="image1" />
          </div>

          <div className="detailProduct">
            <h1 className="detailTitle">{product.title}</h1>
            <p className="detailCategory">{product.category}</p>
            <p className="detailDescription">{product.description}</p>
            <p className="detailContenance">
              Contenance : <br /> {product.contenance}
            </p>
            <div className="stars mt-2">
              <p>
                Note clients : <br />
                {rates
                  ? rates.map((rate) => <p>{rate.rate_id}/5</p>)
                  : "Loading..."}
              </p>
            </div>
            <button className="addCart" onClick={() => onAdd(product)}>AJOUTER AU PANIER</button>
          </div>
        </div>
      </div>
      <div className="ingredientsContainer">
        <div className="ingredientsdetails">
          <p className="font-semibold">Ingrédients :</p>
          <p>{product.ingrédients}</p>
        </div>
      </div>
      <div className="listeCommentaire">
        <div className="commentaires">
          <p className="font-semibold">Avis Clients :</p>
          {comments
            ? comments.map((comment) => <p>Client : {comment.comment}</p>)
            : "Loading..."}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
