import React, { useEffect, useState } from 'react'
import { getDocs, collection } from 'firebase/firestore'
import { db } from '../../config/firebase';
import {Post} from './Post';

export interface Posts {
  id: string;
  userId: string;
  title: string;
  username: string;
  description: string;
}

export const Main = () => {
  const [postsList, setPostsList] = useState<Posts[] | null>(null);
  const postRef = collection(db, "posts");
  const getPosts = async() => {
    const data = await getDocs(postRef)
    setPostsList(data.docs.map((doc) =>({...doc.data(),id: doc.id})) as Posts[])
    }

    useEffect(() => {
      getPosts();
    },[])

  return (
    <div>
     {postsList?.map((post)=> (
      <Post post={post}/>
     ))}
    </div>
  )
}

