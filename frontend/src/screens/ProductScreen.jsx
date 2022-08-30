import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Row, Col, Image, ListGroup, Card, Button, ListGroupItem, Form } from "react-bootstrap";
import Rating from "../components/Rating";
import { useDispatch, useSelector } from "react-redux";
import { listProductDetails, createProductReview } from "../actions/productActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { PRODUCT_CREATE_REVIEW_RESET } from "../constants/productConstants";
import Meta from "../components/Meta";

const ProductScreen = () => {
	const [qty, setQty] = useState(1);
	const [rating, setRating] = useState(0);
	const [comment, setComment] = useState("");

	const { id } = useParams();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const productDetails = useSelector((state) => state.productDetails);
	const { loading, error, product } = productDetails;

	const productReviewCreate = useSelector((state) => state.productReviewCreate);
	const { success: successProductReview, error: errorProductReview } = productReviewCreate;

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	useEffect(() => {
		if (successProductReview) {
			alert("Review submitted");
			setRating(0);
			setComment("");
			dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
		}
		dispatch(listProductDetails(id));
	}, [dispatch, id, successProductReview]);

	const addToCartHandler = () => {
		navigate(`/cart/${id}?qty=${qty}`);
	};

	const submitHandler = (e) => {
		e.preventDefault();
		dispatch(
			createProductReview(id, {
				rating,
				comment,
			})
		);
	};

	return (
		<>
			<Link className="btn btn-light my-3" to="/">
				Go Back
			</Link>
			{loading ? (
				<Loader />
			) : error ? (
				<Message variant="danger">{error}</Message>
			) : (
				<>
				<Meta title={product.name} />
					<Row>
						<Col md={6}>
							<Image src={product.image} alt={product.name} fluid />
						</Col>
						<Col md={3}>
							<ListGroup variant="flush">
								<ListGroupItem>
									<h3>{product.name}</h3>
								</ListGroupItem>
								<ListGroupItem>
									<Rating value={product.rating} text={`${product.numReviews} reviews`} />
								</ListGroupItem>
								<ListGroupItem>Price: ${product.price}</ListGroupItem>
								<ListGroupItem>Description: ${product.description}</ListGroupItem>
							</ListGroup>
						</Col>
						<Col md={3}>
							<Card>
								<ListGroup variant="flush">
									<ListGroupItem>
										<Row>
											<Col>Price:</Col>
											<Col as="h5">
												<strong>${product.price}</strong>
											</Col>
										</Row>
									</ListGroupItem>

									<ListGroupItem>
										<Row>
											<Col>Status:</Col>
											<Col>{product.countInStock > 0 ? "In Stock" : "Out of stock"}</Col>
										</Row>
									</ListGroupItem>

									{product.countInStock > 0 && (
										<ListGroupItem>
											<Row>
												<Col>Qty</Col>
												<Col>
													<Form.Control as="select" value={qty} onChange={(e) => setQty(e.target.value)}>
														{[...Array(product.countInStock).keys()].map((x) => (
															<option key={x + 1} value={x + 1}>
																{x + 1}
															</option>
														))}
													</Form.Control>
												</Col>
											</Row>
										</ListGroupItem>
									)}

									<ListGroupItem>
										<Button
											className="btn-block"
											type="button"
											disabled={product.countInStock === 0}
											onClick={addToCartHandler}
										>
											Add To Cart
										</Button>
									</ListGroupItem>
								</ListGroup>
							</Card>
						</Col>
					</Row>
					<Row>
						<Col md={6}>
							<h2>Reviews</h2>
							{product.reviews.length === 0 && <Message>No Reviews</Message>}
							<ListGroup variant="flush">
								{product.reviews.map((review) => (
									<ListGroupItem key={review._id}>
										<strong>{review.name}</strong>
										<Rating value={review.rating} />
										<p>{review.createdAt.substring(0, 10)}</p>
										<p>{review.comment}</p>
									</ListGroupItem>
								))}
								<ListGroupItem>
									<h2>Write a Customer Review</h2>
									{errorProductReview && <Message variant="danger">{errorProductReview}</Message>}
									{userInfo ? (
										<Form onSubmit={submitHandler}>
											<Form.Group controlId="rating">
												<Form.Label>Rating</Form.Label>
												<Form.Control as="select" value={rating} onChange={(e) => setRating(e.target.value)}>
													<option value="">Select...</option>
													<option value="1">1 - Poor</option>
													<option value="2">2 - Fair</option>
													<option value="3">3 - Good</option>
													<option value="4">4 - Very Good</option>
													<option value="5">5 - Excellent</option>
												</Form.Control>
											</Form.Group>
											<Form.Group controlId="comment" className="my-3">
												<Form.Label>Comment</Form.Label>
												<Form.Control
													as="textarea"
													rows="10"
													style={{ resize: "none" }}
													placeholder="Please write your product review"
													value={comment}
													onChange={(e) => setComment(e.target.value)}
												></Form.Control>
												<Button type="submit" variant="primary" className="my-3">
													Submit
												</Button>
											</Form.Group>
										</Form>
									) : (
										<Message>
											Please <Link to="/login">Sign In</Link> to write a review{" "}
										</Message>
									)}
								</ListGroupItem>
							</ListGroup>
						</Col>
					</Row>
				</>
			)}
		</>
	);
};

export default ProductScreen;
