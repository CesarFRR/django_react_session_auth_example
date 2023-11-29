import React, { useState, useEffect } from 'react';
const BASE_URL = "http://localhost:8000/api"

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');

    useEffect(() => {
        fetch(BASE_URL+'/accounts/api/posts/')
            .then(response => response.json())
            .then(data => setPosts(data));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const newPost = {
            title,
            body,
            date: new Date().toISOString(),
        };
        fetch(BASE_URL+'/accounts/api/posts/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newPost),
        })
            .then(response => response.json())
            .then(data => {
                setPosts([...posts, data]);
                setTitle('');
                setBody('');
            });
    };

  


    return (
        <div>
            <div>
                {posts.map((post, index) => (
                    <div key={index}>
                        <h3>{post.title}</h3>
                        <p>{post.body}</p>
                        <p>{post.date}</p>
                    </div>
                ))}
            </div>
            <div>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <textarea
                        placeholder="Body"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                    ></textarea>
                    <button type="submit">Create Post</button>
                </form>
            </div>
        </div>
    );
};

export default Posts;
