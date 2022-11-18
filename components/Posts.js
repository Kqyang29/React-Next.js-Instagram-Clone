import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import PostContent from "./PostContent"


function Posts() {

  const [posts, setPosts] = useState([]);
  useEffect(() =>
    onSnapshot(query(collection(db, 'posts'), orderBy('timestamp', 'desc')), snapshot => {
      setPosts(snapshot.docs);
    }),
    [db]
  )

  console.log(posts);

  return (
    <div>
      {posts.map(post => (
        <PostContent
          key={post.id}
          id={post.id}
          username={post.data().username}
          userImage={post.data().userImage}
          postImage={post.data().postImage}
          caption={post.data().caption}
        />
      ))}
    </div>
  )
}

export default Posts
