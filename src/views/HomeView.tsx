import React, {useEffect} from "react"
import {Badge} from "react-bootstrap";
import "./HomeView.scss"
import {BlogPost} from "../assets";
import {Link} from "react-router-dom";
import {isBefore, isSameDay} from "date-fns";
import {websiteInfo} from "../Info";

/**
 * The HomeView properties.
 */
export interface HomeViewProps {
    blogPosts: BlogPost[]
    updateTitle: (title: string) => void
}

/**
 * Render the home view.
 * @param props - The HomeView properties.
 * @constructor
 */
export const HomeView = (props: HomeViewProps) => {
    useEffect(() => {
        props.updateTitle(websiteInfo.title)
    }, [])

    return <>
        {// Display all the possible blog posts.
            props.blogPosts.map((blogPost, index) => {
                return <BlogPostHeader key={index} blogPost={blogPost} index={index}/>
            })}
    </>
}

/**
 * The BlogPostHeader properties.
 */
interface BlogPostHeaderProps {
    blogPost: BlogPost,
    index: number
}

/**
 * Render a blog post header.
 * @param props - The BlogPostHeader properties.
 * @constructor
 */
const BlogPostHeader = (props: BlogPostHeaderProps) => {
    const isNewPost = (postDate: Date) => {
        const current = new Date()
        return isSameDay(current, postDate) || isBefore(current, new Date(postDate.getFullYear(), postDate.getMonth(), postDate.getDate() + 7))
    }

    const postDate = new Date(props.blogPost.date)

    return <div className={"blog-post-header"}>
        <span
            className={"blog-post-header-date"}
        >{postDate.toDateString().toLowerCase()}</span>
        <Link className={"blog-post-header-link"}
              to={`/${props.blogPost.name}`}>{props.blogPost.fancyName ?? props.blogPost.name}
            {isNewPost(postDate) && <Badge className={"blog-post-header-badge"}>new</Badge>}
        </Link>
    </div>
}

export default HomeView