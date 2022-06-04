import React from "react"
import {Badge} from "react-bootstrap";
import "./HomeView.scss"
import {BlogPost} from "../assets";
import {useNavigate} from "react-router-dom";
import {isBefore, isSameDay} from "date-fns";
import {emptyHref} from "../Utils";

/**
 * The HomeView properties.
 */
export interface HomeViewProps {
    blogPosts: BlogPost[],
}

/**
 * Render the home view.
 * @param props - The HomeView properties.
 * @constructor
 */
export const HomeView = (props: HomeViewProps) => {
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
    const navigate = useNavigate()
    const postDate = new Date(props.blogPost.date)

    const isNewPost = (postDate: Date) => {
        const current = new Date()
        return isSameDay(current, postDate) || isBefore(current, postDate)
    }

    return <div className={"blog-post-header"}>
        <span
            className={"blog-post-header-date"}
        >{postDate.toDateString()}</span>
        <a className={"blog-post-header-link"}
           href={emptyHref}
           onClick={() => navigate(`/${props.blogPost.name}`, {replace: true})}>{props.blogPost.fancyName ?? props.blogPost.name}
            {isNewPost(postDate) && <Badge className={"blog-post-header-badge"}>new</Badge>}
        </a>
    </div>
}

export default HomeView