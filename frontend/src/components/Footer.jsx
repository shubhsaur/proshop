import { Container, Row, Col} from "react-bootstrap";

const Footer = () => {
  return (
    <footer>
        <Container>
            <Row>
                <Col className="text-center py-3"></Col>
                Copyright &copy; 2022
            </Row>
        </Container>
    </footer>
  )
}

export default Footer