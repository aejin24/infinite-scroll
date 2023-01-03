import { Link, useParams } from "react-router-dom";

function Detail() {
  const { id } = useParams();

  return <>
    <div>{id}</div>
    <Link to="/">back</Link>
  </>
}

export default Detail;