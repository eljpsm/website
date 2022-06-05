import React from "react"
import {formatDate, StringKeyToString} from "../Utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./BlogPostView.scss"
import Loading from "../shared/Loading";
import Fuse from "fuse.js";
import {Link} from "react-router-dom";
import SyntaxHighlighter from "react-syntax-highlighter/dist/cjs/prism";
import {solarizedlight} from "react-syntax-highlighter/dist/esm/styles/prism";
import {BlogPost} from "../assets";
import remarkGemoji from "remark-gemoji";


/**
 * The BlogPostView properties.
 */
export interface BlogPostViewProps {
    blogPostNames: string[]
    blogPosts: BlogPost[]
    postTextMap: StringKeyToString | undefined
    isLoadingPosts: boolean
    updateTitle: (title: string) => void
}

/**
 * Render a blog post.
 * @param props - The BlogPostView properties.
 * @constructor
 */
export const BlogPostView = (props: BlogPostViewProps) => {
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

    const expectedPostName = window.location.pathname.slice(1)
    let currentBlogPost: BlogPost | undefined

    // Get the current blog post.
    for (let i = 0; i < props.blogPosts.length; i++) {
        if (props.blogPosts[i].name === expectedPostName) {
            currentBlogPost = props.blogPosts[i]
            break
        }
    }

    const unknownBlogPostTitle = "Could not find blog post :("
    if (currentBlogPost) {
        // If a blog post is found, update the title accordingly.
        props.updateTitle(currentBlogPost.safeName ?? currentBlogPost.name)
    } else {
        props.updateTitle(unknownBlogPostTitle)
    }

    const similarNames = findSimilarNames(expectedPostName)

    return <div className={"blog-post"}>
        {(props.postTextMap === undefined || props.isLoadingPosts) ?
            <Loading/> : (expectedPostName in props.postTextMap && currentBlogPost) ? <>
                <p className={"blog-info-date"}>{formatDate(currentBlogPost?.date)}</p>
                <ReactMarkdown children={props.postTextMap[expectedPostName]}
                               remarkPlugins={[remarkGfm, remarkGemoji]}
                               components={{
                                   // Fix image scaling on small devices and really large images.
                                   // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                   img: ({node, ...props}) => <img
                                       className={"markdown-image"} {...props} alt={props.alt}/>,

                                   // Format code using SyntaxHighlighter.
                                   // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                   code({node, inline, className, children, ...props}) {
                                       const match = /language-(\w+)/.exec(className || '')
                                       return !inline && match ? (<SyntaxHighlighter
                                           children={String(children).replace(/\n$/, '')}
                                           /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
                                           // @ts-ignore
                                           style={solarizedlight}
                                           language={match[1]}
                                           PreTag="div"
                                           showLineNumbers={true}
                                           showInlineLineNumbers={true}
                                           wrapLines={true}
                                           wrapLongLines={true}
                                           {...props}
                                       />) : (<code{...props}>
                                           {children}
                                       </code>)
                                   }
                               }}
                />
            </> : <div>
                <h1>{unknownBlogPostTitle}</h1>
                {(similarNames && similarNames.length > 0) && <span>Similar post names: {similarNames.map((result) => {
                    return <Link className={"similar-post-name"}
                                 to={`/${result.item}`}>{result.item}</Link>
                })}</span>}
            </div>}
        <Link className={"return-link"} to={"/"}>{"<- return to home"}</Link>
    </div>
}

export default BlogPostView