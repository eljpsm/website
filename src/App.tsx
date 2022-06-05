import React, {useEffect, useState} from "react";
import "./App.scss";
import {Button, Container, Navbar} from "react-bootstrap";
import HomeView from "./views/HomeView";
import {Route, Routes, useNavigate} from "react-router-dom";
import BlogPostView from "./views/BlogPostView";
import {StringKeyToString} from "./Utils";
import assetMap from "./assets/index.json";
import {compareAsc} from "date-fns";
import {contactInformation, websiteInfo} from "./Info";
import "./Bootstrap.scss"
import blogPostView from "./views/BlogPostView";

/**
 * Render the primary app.
 * @constructor
 */
const App = () => {
    const navigate = useNavigate()
    const blogPosts = assetMap.blogPosts

    const [blogPostNames, setBlogPostNames] = useState<string[]>([])
    // Save the blog posts, where the key is the name of the blog post, and the value is the markdown file content.
    const [postTextMap, setPostTextMap] = useState<StringKeyToString>()

    const [isLoadingPosts, setIsLoadingPosts] = useState<boolean>(false)

    // TODO: Implement an error display.
    const [error, setError] = useState<unknown>()

    const orderedBlogPosts = blogPosts.sort((a, b) => {
        const dateA = new Date(a.date)
        const dateB = new Date(b.date)

        if (compareAsc(dateA, dateB) === 1) return 0
        return 1
    })

    /**
     * Fetch all the blog posts.
     */
    useEffect(() => {
        setIsLoadingPosts(true)
        setBlogPostNames(blogPosts.map((item) => item.name))
        blogPosts.forEach((post) => {
            import(`./assets/${post.localPath}`)
                .then(response => {
                    fetch(response.default)
                        .then(response => response.text())
                        .then(text => {
                            const newValue = {[post.name]: text}
                            setPostTextMap(postTextMap => ({
                                ...postTextMap, ...newValue
                            }))
                        })
                        .catch(err => setError(err))
                })
                .catch(err => setError(err))
        })
        setIsLoadingPosts(false)
    }, [])

    return <div className="App">
        <Container>
            <Navbar className={"primary-header"}>
                <Navbar.Brand className={"primary-header-brand"}
                              onClick={() => navigate("/")}>eljpsm<span className={"primary-header-style"}>.com</span></Navbar.Brand>
                <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text>
                        email me at <a href={`mailto:${contactInformation.email}`}>eljpsm@eljpsm.com</a>
                    </Navbar.Text>
                </Navbar.Collapse>
            </Navbar>
            <div className={"content"}>
                <Routes>
                    <Route path={"/"} element={<HomeView blogPosts={orderedBlogPosts}/>}/>
                    <Route
                        // Catch all other paths and try and interpret them as blog posts.
                        path={"*"} element={<BlogPostView blogPostNames={blogPostNames} postTextMap={postTextMap}
                                                          isLoadingPosts={isLoadingPosts}/>}/>
                </Routes>
            </div>
            <Navbar>
                <Navbar.Collapse className="justify-content-center">
                    <Navbar.Text>
                        <a target={"_blank"} rel={"noopener noreferrer"} href={websiteInfo.repository}>licensed under
                            MIT</a>
                    </Navbar.Text>
                </Navbar.Collapse>
            </Navbar>
        </Container>
    </div>;
};

export default App;
