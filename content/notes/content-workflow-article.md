# Building My Content Creation Workflow: From Voice Notes to Published Website

*A case study in removing friction from the creative process*

---

## The Challenge

I've been sitting on a mountain of ideas for articles, projects, and various content pieces that I wanted to share with the world, but I kept running into the same problem—friction in my workflow. I needed a system that would let me:

1. Capture ideas quickly (ideally through voice)
2. Process and refine them with AI assistance
3. Store everything in a central repository
4. Edit from both mobile and desktop
5. Publish with minimal effort
6. Share easily and gather feedback

Here's the voice memo I sent to Claude when I first started tackling this problem:

> "There's a bunch of content that I wanna start publishing. I think I wanna basically develop a portfolio of just different articles, content, projects, etcetera. And I, ideally, would like to have just a simple website that kinda has all of it. Like, you know, my personal website, basically. And I can always cross post and push those to LinkedIn or to TikTok or Instagram or elsewhere or send individually. But it'd be nice just to have, like, a repository of all these things. 
> 
> Now I've also been messing with this idea of building little prototypes where I can create voice memos or just do voice input one way or another and have Claude or an LLM process that voice input and then basically write it to my little database of things. 
> 
> One of the options we talked about was using Obsidian or something like Obsidian where it basically uses markdown and that can translate to a website that we can host. But, yeah, basically, I just want this link between Claude, Obsidian Publishing, and my own voice notes, and then obviously also a way to edit on a computer. I'll take a voice note, but then I'd wanna be able to edit on a computer.
> 
> I guess I'm getting stuck on what the right stack should be, how everything should hook together. So do you have any suggestions on what we could do that would basically make it really easy for me to talk through things with Claude and have it generate output that I can then revise later, but basically automatically publish it and put it somewhere where I can share it easily? Maybe it's not a full publish, but maybe it's at least something that's very easy with little friction for me to share with friends and get feedback. I just need to create this sort of create-publish-share-feedback loop, I think that's a key to me doing this well and getting momentum. So let's figure out how to set this up."

## The Solution

After consulting with Claude, I settled on a streamlined workflow that combines the best of several tools:

### Core Components

1. **GitHub Repository** - The foundation of the system, storing all content and website code
2. **Obsidian** - For mobile voice capture and note organization
3. **Cursor** - Desktop editing with AI assistance
4. **GitHub Pages** - Simple, free hosting with automatic deployment
5. **Claude API** - For processing voice notes into structured content

### The Complete Workflow

![Workflow Diagram](https://via.placeholder.com/800x400?text=Content+Workflow+Diagram)

#### 1. Voice Capture → Digital Content
- Use Obsidian mobile app for voice-to-text
- Initial notes saved as markdown files
- Script processes these notes through Claude API for refinement

#### 2. Content Storage and Version Control
- All content lives in GitHub repository
- Changes tracked with version control
- Content organized in logical folders

#### 3. Editing Experience
- **Mobile**: Obsidian app for quick edits and new ideas
- **Desktop**: Cursor for deeper editing and website customization
- Cursor's AI integration helps refine and improve content

#### 4. Publishing Pipeline
- GitHub Pages automatically builds the website
- Jekyll or Next.js converts markdown to beautiful HTML
- Custom domain option for professional presentation

#### 5. Feedback Loop
- Comments through GitHub Issues or Giscus
- Analytics to track engagement
- Easily shareable links for specific content

## Implementation Details

The implementation was surprisingly straightforward:

1. Created a GitHub repository for all content
2. Set up basic Jekyll configuration for GitHub Pages
3. Configured folder structure for different content types
4. Connected Cursor to the repository for desktop editing
5. Set up Obsidian on mobile with GitHub sync
6. Created a simple script to process voice notes through Claude API

## Results and Reflections

This meta-article is actually the first piece published through this new system! The workflow drastically reduced the friction between having an idea and publishing it. Some key benefits I've noticed:

- **Capturing ideas is effortless** - Voice memos can be created anywhere
- **Version control provides peace of mind** - Nothing is ever lost
- **Multiple editing options** - I can work from any device
- **Publishing is automatic** - One git commit and it's live
- **Feedback is integrated** - Comments and suggestions feed directly back into the system

## Next Steps

As I continue to refine this system, I'm planning to:

1. Build a more sophisticated Claude processing script
2. Create custom templates for different content types
3. Add automated social sharing
4. Implement analytics to track engagement
5. Explore more interactive content options through MDX

---

*This article was created using the very workflow it describes - from voice memo to Claude processing to GitHub-based publishing.*