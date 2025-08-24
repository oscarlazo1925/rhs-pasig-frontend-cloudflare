import { Spinner } from "react-bootstrap";

function Loader() {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "200px" }}>
      <Spinner animation="grow" variant="primary" size="sm" className="mx-1" />
      <Spinner animation="grow" variant="primary" size="sm" className="mx-1" />
      <Spinner animation="grow" variant="primary" size="sm" className="mx-1" />
    </div>
  );
}

export default Loader;
