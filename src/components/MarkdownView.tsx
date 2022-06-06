import * as React from 'react'
import { MarkdownRenderer } from 'obsidian'

interface MarkdownViewParams {
    markdown: string,
    sourcePath: string,
}

export default function MarkdownView(params: MarkdownViewParams) {
    let tmpHtml = createDiv();
    MarkdownRenderer.renderMarkdown(params.markdown, tmpHtml, params.sourcePath, null);
    let htmlStr = tmpHtml.innerHTML;
    return (
        <div className="flashy-markdown" dangerouslySetInnerHTML={{__html: htmlStr}}></div>
    )
}
