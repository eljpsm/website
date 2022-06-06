import React, {useEffect, useState} from "react";
import "./App.scss";
import {Alert, Container, Nav, Navbar} from "react-bootstrap";
import HomeView from "./views/HomeView";
import {Route, Routes, useNavigate} from "react-router-dom";
import BlogPostView from "./views/BlogPostView";
import {StringKeyToString} from "./Utils";
import assetMap from "./assets/index.json";
import {compareAsc} from "date-fns";
import {contactInformation, websiteInfo} from "./Info";
import "./Bootstrap.scss"

/**
 * Render the primary app.
 * @constructor
 */
const App = (): JSX.Element => {
    /**
     * Update the app title.
     * @param title - The new title.
     */
    const updateTitle = (title: string) => {
        document.title = title
    }

    const navigate = useNavigate()
    const blogPosts = assetMap.blogPosts

    // Save all the blog post names.
    //
    // This is useful for giving suggestions on page names.
    const [blogPostNames, setBlogPostNames] = useState<string[]>([])

    // Save the blog posts, where the key is the name of the blog post, and the value is the markdown file content.
    const [postTextMap, setPostTextMap] = useState<StringKeyToString>()

    // Declare whether the posts are currently being loaded.
    const [isLoadingPosts, setIsLoadingPosts] = useState<boolean>(false)

    // Display any errors.
    const [error, setError] = useState<Error | undefined | null>()

    // Order the blog posts by their date.
    //
    // This makes it easier to search them.
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
                        .catch(err => setError(err as Error))
                })
                .catch(err => setError(err as Error))
        })
        setIsLoadingPosts(false)
    }, [])

    return <div className="App">
        <Container>
            <Navbar>
                <Navbar.Brand className={"primary-header-brand"}
                              onClick={() => navigate("/")}>eljpsm<span
                    className={"primary-header-style"}>.com</span></Navbar.Brand>
                <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text>
                        email me at <a href={`mailto:${contactInformation.email}`}>eljpsm@eljpsm.com</a>
                    </Navbar.Text>
                </Navbar.Collapse>
            </Navbar>
            <div className={"content"}>
                <>
                    {error &&
                        <Alert color={"danger"} dismissible onClose={() => setError(null)}>{error.message}</Alert>}
                    <Routes>
                        <Route path={"/"} element={<HomeView blogPosts={orderedBlogPosts} updateTitle={updateTitle}/>}/>
                        <Route
                            // Catch all other paths and try and interpret them as blog posts.
                            path={"*"} element={<BlogPostView blogPostNames={blogPostNames} blogPosts={blogPosts}
                                                              postTextMap={postTextMap}
                                                              isLoadingPosts={isLoadingPosts}
                                                              updateTitle={updateTitle}/>}/>
                    </Routes>
                </>
            </div>
            <Nav className={"flex-column primary-footer"}>
                <Nav.Item className={"primary-footer-version"}>
                    <p>{`version ${websiteInfo.version}`}</p>
                </Nav.Item>
                <Nav.Item>
                    <a target={"_blank"} rel={"noopener noreferrer"} href={websiteInfo.repository}>licensed under
                        MIT</a>
                </Nav.Item>
            </Nav>
        </Container>
    </div>;
};

export default App;
