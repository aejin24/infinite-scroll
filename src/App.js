import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function App() {
  const [posts, setPosts] = useState([]);
  const [hasNextPage, setHasNextPage] = useState(true);
  const page = useRef(1);
  const observerTargetEl = useRef(null);
  const navigate = useNavigate();

  const onClickHandler = (id) => {
    sessionStorage.setItem("pages", page.current - 1);
    sessionStorage.setItem("posts", JSON.stringify(posts));
    sessionStorage.setItem("pos", window.screenY);
    navigate(`/${id}`);
  }

  const fetch = useCallback(async () => {
    if (sessionStorage.getItem("posts")) {
      const data = JSON.parse(sessionStorage.getItem("posts"));

      setPosts(data);

      if (data.length) {
        page.current = Number(sessionStorage.getItem("pages")) + 1;
        window.scrollTo(0, Number(sessionStorage.getItem("pos")));
      }

      sessionStorage.removeItem("pos");
      sessionStorage.removeItem("posts");
      sessionStorage.removeItem("pages");

      return;
    }

    try {
      const { data } = await axios.get(
        `http://localhost:5000/posts?_limit=10&_page=${page.current}`
      );
      setPosts((prevPosts) => [...prevPosts, ...data]);
      setHasNextPage(data.length === 10);
      if (data.length) {
        page.current += 1;
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    if (!observerTargetEl.current || !hasNextPage) return;

    const io = new IntersectionObserver((entries, observer) => {
      if (entries[0].isIntersecting) {
        fetch();
      }
    });
    io.observe(observerTargetEl.current);

    return () => {
      io.disconnect();
    };
  }, [fetch, hasNextPage]);

  return (
    <div>
        {posts?.map((post) => (
          <div
            key={post.id}
            style={{
              display: "block",
              textDecoration: "none",
              color: "black",
              marginBottom: '1rem',
              border: '1px solid #000',
              padding: '8px',
              background: post.id % 10 === 0 ? 'skyblue' : '',
            }}
            onClick={() => { onClickHandler(post.id) }}
          >
            <div>userId: {post.userId}</div>
            <div>id: {post.id}</div>
            <div>title: {post.title}</div>
            <div>body: {post.body}</div>
          </div>
        ))}
        <div ref={observerTargetEl} />
      </div>
  );
}


export default App;