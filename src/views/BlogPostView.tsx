import React, {useEffect, useState} from "react"
import {StringKeyToString} from "../Utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./BlogPostView.scss"
import {useNavigate} from "react-router-dom";

/**
 * The BlogPostView properties.
 */
export interface BlogPostViewProps {
    postTextMap: StringKeyToString | undefined
}

/**
 * Render a blog post.
 * @param props - The BlogPostView properties.
 * @constructor
 */
export const BlogPostView = (props: BlogPostViewProps) => {
    // Get the expected post name.
    const expectedPostName = window.location.pathname.slice(1)

    return <div className={"blog-post"}>
        {props.postTextMap === undefined ? <p>Loading...</p> : expectedPostName in props.postTextMap ?
            <ReactMarkdown children={props.postTextMap[expectedPostName]} remarkPlugins={[remarkGfm]}/> :
            <p>not found</p>}
    </div>
}

export default BlogPostView