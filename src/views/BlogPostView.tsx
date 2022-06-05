import React from "react"
import {StringKeyToString} from "../Utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./BlogPostView.scss"
import Loading from "../shared/Loading";
import Fuse from "fuse.js";
import {Link} from "react-router-dom";

/**
 * The BlogPostView properties.
 */
export interface BlogPostViewProps {
    blogPostNames: string[]
    postTextMap: StringKeyToString | undefined
    isLoadingPosts: boolean
}

/**
 * Render a blog post.
 * @param props - The BlogPostView properties.
 * @constructor
 */
export const BlogPostView = (props: BlogPostViewProps) => {
    // Get the expected post name.
    const expectedPostName = window.location.pathname.slice(1)

    /**
     * Find similar blog post names from a given text string.
     * @param text - The text to search.
     */
    const findSimilarNames = (text: string) => {
        if (props.postTextMap) {
            const fuse = new Fuse(props.blogPostNames, {includeScore: true})

            return fuse.search(text)
        }

        return []
    }

    const similarNames = findSimilarNames(expectedPostName)

    return <div className={"blog-post"}>
        {(props.postTextMap === undefined || props.isLoadingPosts) ?
            <Loading/> : expectedPostName in props.postTextMap ?
                <ReactMarkdown children={props.postTextMap[expectedPostName]} remarkPlugins={[remarkGfm]}/> : <div>
                    <h1>{`Could not find post "${expectedPostName}" :(`}</h1>
                    {similarNames && <span>Similar post names: {similarNames.map((result) => {
                        return <Link className={"similar-post-name"}
                                     to={`/${result.item}`}>{result.item}</Link>
                    })}</span>}
                </div>}
    </div>
}

export default BlogPostView