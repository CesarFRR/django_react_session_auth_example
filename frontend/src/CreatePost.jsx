import React, { useState, useEffect } from 'react';
const BASE_URL = "https://api-django-react-cookies-j252.onrender.com/api"
import axios from 'axios';

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');

    useEffect(() => {
        fetch(BASE_URL + "/accounts/api/csrf/", {
            credentials: 'include'
        })
            .then(response => response.headers.get('X-CSRFToken'))
            .then(csrfToken => {
                fetch(BASE_URL + '/accounts/api/posts/', {

                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrfToken
                    },
                    credentials: 'include'

                })
                    .then(response => response.json())
                    .then(data => setPosts(data));


            })
    }


        , []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const newPost = {
            title,
            body,
            date: new Date().toISOString(),
        };

        // Primero, obtenemos el token CSRF
        axios.get(BASE_URL + "/accounts/api/csrf/", { withCredentials: true })
            .then(response => {
                const csrfToken = response.headers['x-csrftoken'];

                // Luego, hacemos la petición POST con el token CSRF
                return axios.post(BASE_URL + '/accounts/api/posts/', newPost, {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrfToken
                    },
                    withCredentials: true
                });
            })
            .then(response => {
                const data = response.data;
                setPosts([...posts, data]);
                setTitle('');
                setBody('');
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };




    return (
        <div>
            <div>
                {posts && posts[0] && posts[0].title && posts.map((post, index) => (
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
