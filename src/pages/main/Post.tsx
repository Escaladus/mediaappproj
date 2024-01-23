import { Posts } from './Main'
import { addDoc, collection , getDocs, query, where,deleteDoc,doc} from 'firebase/firestore';
import {auth, db } from '../../config/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect, useState } from 'react';
interface Props {
    post: Posts
}

interface Like {
    userId: string;
    likeId: string;
}

export const Post = (props: Props) => {
    const { post } = props;
    const likeRef = collection(db, "likes");
    const [user] = useAuthState(auth);
    const likesDoc = query(likeRef, where("postId","==",post.id));
    const [like, setLike] = useState<Like[] | null>(null);

    const onLike =async () => {
        try {
            const newDoc = await addDoc(likeRef, {
            userId: user?.uid, 
            postId: post.id,
        })
        if(user) {

            setLike((prev) => prev ? [...prev, 
                {userId: user?.uid, likeId: newDoc.id}]:[{userId: user?.uid,likeId: newDoc.id}])
        }
        } catch (err){
            console.log(err)
        }
    }

    const getLikes = async() => {
        const data = await getDocs(likesDoc)
        setLike(data.docs.map((doc) => ({userId: doc.data().userId, likeId: doc.id})));
    }
const hasUserLiked = like?.find((item) => item.userId === user?.uid)

    useEffect(() => {
        getLikes();
    },[])




    const removeLike =async () => {
        try {
            const likeToDeleteQuery = query(likeRef,  
                where("postId", "==", post.id),
                where("userId","==",user?.uid));

            const likeToDelteData = await getDocs(likeToDeleteQuery);
            const likeId = likeToDelteData.docs[0].id
            const likeToDelete = doc(db, "likes",likeId)
             await deleteDoc(likeToDelete);
        if(user) {
            setLike((prev) => prev && prev.filter((item) => item.likeId !== likeId))
            
        }
        } catch (err){
            console.log(err)
        }
        
    }



  return (
    <div>
        <div className='title'> <h1>{post.title}</h1></div>
        <div className='body'><p>{post.description}</p></div>
        <div className='footer'>
            <p>@{post.username}</p> 
            <button onClick={hasUserLiked ?  removeLike: onLike}>
                {hasUserLiked ? <>&#128078;</> : <>&#128077;</>}
                </button>
            {like &&<p>Likes:{like?.length}</p>}
            </div>
    </div>
  )
}
