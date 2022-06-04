import React, {useEffect, useState} from "react";
import "./App.scss";
import {Container, Navbar} from "react-bootstrap";
import HomeView from "./views/HomeView";
import {Route, Routes, useNavigate} from "react-router-dom";
import BlogPostView from "./views/BlogPostView";
import {StringKeyToString} from "./Utils";
import assetMap from "./assets/index.json";
import {compareAsc} from "date-fns";
import {contactInformation} from "./Info";

/**
 * Render the primary app.
 * @constructor
 */
const App = () => {
    const navigate = useNavigate()
    const blogPosts = assetMap.blogPosts

    // Save the blog posts, where the key is the name of the blog post, and the value is the markdown file content.
    const [postTextMap, setPostTextMap] = useState<StringKeyToString>()
    // TODO: Implement an error display.
    const [error, setError] = useState<unknown>()

    const orderedBlogPosts = blogPosts.sort((a, b) => {
        const dateA = new Date(a.date)
        const dateB = new Date(b.date)

        return compareAsc(dateA, dateB)
    })

    /**
     * Fetch all the blog posts.
     */
    useEffect(() => {
        if (!postTextMap || Object.keys(postTextMap).length < 1) {
            blogPosts.forEach((post) => {
                import(`./assets/${post.localPath}`)
                    .then(response => {
                        fetch(response.default)
                            .then(response => response.text())
                            .then(text => setPostTextMap({[post.name]: text, ...postTextMap}))
                            .catch(err => setError(err))
                    })
                    .catch(err => setError(err))
            })
        }
    }, [])

    return <div className="App">
        <Container>
            <div className={"Content"}>
                <Navbar>
                    <Navbar.Brand className={"primary-header"}
                                  onClick={() => navigate("/")}>eljpsm<span>.com</span></Navbar.Brand>
                    <Navbar.Collapse className="justify-content-end">
                        <Navbar.Text>
                            email me at <a href={`mailto:${contactInformation.email}`}>eljpsm@eljpsm.com</a>
                        </Navbar.Text>
                    </Navbar.Collapse>
                </Navbar>
                <Routes>
                    <Route path={"/"} element={<HomeView blogPosts={orderedBlogPosts}/>}/>
                    <Route
                        // Catch all other paths and try and interpret them as blog posts.
                        path={"*"} element={<BlogPostView postTextMap={postTextMap}/>}/>
                </Routes>
            </div>
        </Container>
    </div>;
};

export default App;
