import { BookmarkIcon, ChatBubbleLeftEllipsisIcon, EllipsisHorizontalIcon, FaceSmileIcon, HeartIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconFilled } from '@heroicons/react/24/solid'
import { addDoc, collection, deleteDoc, doc, getDoc, onSnapshot, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { db } from '../firebase';
import Moment from 'react-moment'


function PostContent({ id, username, caption, userImage, postImage }) {
  const { data: session } = useSession();
  const [commentInput, setCommentInput] = useState("");
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    onSnapshot(query(collection(db, 'posts', id, 'comments'), orderBy('timestamp', 'desc')), snapshot => {
      setComments(snapshot.docs);
    })
  }, [db, id]);

  useEffect(() => {
    onSnapshot(collection(db, 'posts', id, 'likes'), snapshot => {
      setLikes(snapshot.docs);
    })
  }, [db, id]);

  useEffect(() =>
    setHasLiked(
      likes.findIndex(
        (like) => (like.id === session?.user?.uid)
      ) !== -1),
    [likes]
  );


  const likePost = async () => {
    if (hasLiked) {
      await deleteDoc(doc(db, 'posts', id, 'likes', session.user.uid))
    } else {
      await setDoc(doc(db, 'posts', id, 'likes', session.user.uid), {
        username: session.user.username,
      })
    }

  }

  const sendComment = async (e) => {
    e.preventDefault();

    const commentToSend = commentInput;
    setCommentInput('');

    // console.log(id);

    const dbRef = collection(db, 'posts', id, 'comments');

    await addDoc(dbRef, {
      comment: commentToSend,
      username: session.user.username,
      userImage: session.user.image,
      timestamp: serverTimestamp(),
    });


  }

  return (
    <div className='bg-white my-7 border rounded-sm'>
      {/* Header */}
      <div className="flex items-center p-5">
        <img
          className='w-12 h-12 rounded-full object-cover border p-1 mr-3'
          src={userImage}
          alt="user Image"
        />
        <p className='flex-1 font-bold'>{username}</p>
        <EllipsisHorizontalIcon
          className='h-5'
        />
      </div>

      {/* PostImage */}
      <img
        src={postImage}
        alt="post Image"
        className='object-cover w-full'
      />

      {/* Button */}
      {session && (
        <div className='flex justify-between px-4 pt-4'>
          <div className='flex space-x-4'>
            {hasLiked ?
              (
                <HeartIconFilled
                  onClick={likePost}
                  className='btn text-red-500'
                />
              ) : (
                <HeartIcon
                  onClick={likePost}
                  className='btn'
                />
              )}

            <ChatBubbleLeftEllipsisIcon
              className='btn'
            />
            <PaperAirplaneIcon
              className='btn'
            />
          </div>

          <BookmarkIcon
            className='btn'
          />

        </div>
      )}

      {/* Caption */}
      <p className='p-5 truncate'>
        {likes.length > 0 && (
          <p className='mb-1 font-bold'>
            {likes.length} Likes
          </p>
        )}
        <span className='font-bold mr-1'>
          {username}:
        </span>
        {caption}
      </p>

      {/* Comments */}
      {comments.length > 0 && (
        <div className='ml-10 h-20 overflow-y-scroll scrollbar-thumb-black scrollbar-thin'>
          {comments.map(comment => (
            <div
              key={comment.id}
              className="flex items-center space-x-2 mb-3"
            >
              <img
                className='h-7 rounded-full'
                src={comment.data().userImage}
                alt="Comment_userImage"
              />
              <p className='text-sm flex-1'>
                <span className='font-bold'>
                  {comment.data().username}:
                </span>
                {" "}
                {comment.data().comment}
              </p>

              <Moment
                fromNow
                className='pr-5 text-xs'
              >
                {comment.data().timestamp?.toDate()}
              </Moment>
            </div>
          ))}
        </div>
      )}

      {/* InputBox */}
      {session && (
        <form className='flex items-center p-4'>
          <FaceSmileIcon
            className='h-7'
          />
          <input
            type="text"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder='Add a comment...'
            className='border-none flex-1 focus:ring-0'
          />
          <button
            type='submit'
            onClick={sendComment}
            disabled={!commentInput.trim()}
            className='font-semibold text-blue-400 hover:disabled:cursor-not-allowed'
          >
            Post
          </button>
        </form>
      )}

    </div>
  )
}

export default PostContent
