---
title: "Project Recap: Building Libaraxia"
date: 2024-12-18
cover: /images/blog/libaraxiaAlpha.jpg
author: phil cifone
tags:
  - project
  - flask
  - python
  - frontend
  - backend
  - fullstack
  - development
  - selfhosted
  - linux
keywords:
  - project
  - flask
  - python
  - frontend
  - backend
  - fullstack
  - development
  - selfhosted
  - linux
showFullContent: false
readingTime: true
hideComments: false
draft: false
---
# The Inspiration

After ordering yet another book online, I finally noticed my wife and I's collection had grown into practically a mini-library. Despite its informal organization—books in the office, living room, or doubling as coffee table decor—I can inexplicably know with relative certainty where nearly any particular book we own is at any given time. How long can such a system last?

The prospect of buying duplicates or, worse, losing everything in the event of a disaster made me think: why not catalog our collection like a proper library? As an aspiring Linux system administrator and hobbyist developer, I started exploring self-hosted solutions for personal library catalogs. While a few options met my functional needs, none of the ones I came across had the clean, intuitive interface I was hoping for.

Always thinking of projects to solve a problem, the idea finally hit me: why not build my own? It was the perfect opportunity to blend my existing knowledge of Linux and programming with a chance to fill gaps in SQL, HTML, and CSS while creating something useful.

# The Process

I have to mention, this application could not have come to life without the help of AI tools, specifically ChatGPT. With its assistance, I was able to articulate my ideas in plain language and receive step-by-step guidance to build, debug, and refine my project. While I didn’t write all the code from scratch, working with and tweaking the existing code allowed me to troubleshoot and expand functionality, deepening my understanding of what’s happening under the hood as I tinkered around. AI significantly accelerated the process—what might have taken months to develop by hand came together in about a week of working on it outside of my current job. There is a lot more that goes into development other than knowing a coding language, while the little python, HTML, & CSS I knew were helpful, knowing Linux and my way around the command line were integral to the speed at which this came together. 

The app uses Flask, a web framework based on Python, with an SQLite3 database—both recommended by ChatGPT for their beginner-friendly nature. I’d have to agree; they’ve been excellent starting points to a complete novice taking on something like this. Eventually, I’d like to migrate to React and Node.js to gain experience with more industry-standard tools, but for now, Flask fits my needs perfectly.

I moved pretty quickly in learning it's display functionalities, and I almost lost an original display of the applications beginnings and it's really cool to see how far I've come. 

![beta](/images/blog/libaraxiaBeta.jpg)

Once I nailed down the basic database functionalities, I became hooked on tweaking and refining the app. Adjusting styling, adding features, and brainstorming improvements became an addictive process. Experimenting with HTML and CSS—and seeing the results of my changes almost instantly—has taught me more about front-end development in the past week than any book or online course I’ve read on the subject. So even if you have no idea what you're doing, just dive in and get started!

# The Result: Libaraxia!

The result of this journey is (until I change the name again) *Libaraxia*—a humble application that features little more than basic CRUD (Create, Read, Update, Delete) operations such as search, sort, ISBN API fetch, for instance. Although there will be more as time goes on. 

Using the common prefix "Lib-" for book, I merged it with "ataraxia"; an ancient Greek philosophical concept loosely defined as "A tranquil state of being." It is also an awesome King Gizzard & The Lizard Wizard song. Thus, I've decided that *Libaraxia* is the perfect word to describe the state of equanimity I'm in when I'm reading one of the many books I can now easily catalog from my library.

![Ataraxia](/images/blog/libaraxiaAlpha.jpg)

I’m proud of how quickly this application has become functional and user-friendly. Especially given how much paid software currently on the market is less enjoyable to use. I have worked as an archivist, and found the field severely lacking in simple open source tools like this. Why rely on tediously inputting information into an excel spreadsheet when I could automate this process with an API fetch, and input it into a portable database that's nearly universally supported? 

While not ready for prime time deployment, as being a novice has its drawbacks with a project like this. If anyone reading this decides to dive into the code, please be gentle on judging it. I've never done either front-end or back-end development like this before and I would really like an opportunity to learn industry best practices before I deploy this for open source usage. I've spent a lot of time cleaning up HTML and CSS although I know there's a ways to go. I'm sure the python could also be optimized too, but I'm hesitant to change anything because right now it works! Which is so cool. 

![Add Book Page](/images/blog/IMG_7682.jpg)

While Libaraxia lacks advanced features for now, its core functionality is solid, and I’ve met my primary goal of cataloging my personal book collection. I know there are likely optimizations, security features, and input sanitizing I need to do, but since this is not open to the wider web and a tool only for me, I'm not too worried yet. 

![Book Details Page](/images/blog/IMG_7683.jpg)

The project is far from complete, and I’m excited to see where it goes next.

### Current Features

- Add book manually or:
- ISBN Google Books API fetch 
- Upload custom cover images
- Edit and delete entries
- Tiled homepage layout
- Basic search & sort functionality
- Multi-user login and authentication

### Future Features to Explore

- Automated cover image fetching
- User rating and comment system
- User filter (books read in 2024, all sci-fi added in 2024, etc.)
- Customizable “shelves” (read, want-to-read, want-to-buy)
- Share shelves with other users
- Barcode scanning for quick entry

# In Conclusion

While Libaraxia is just a basic programming application, for me it’s also a practical exercise in taking control of the tools that are shaping modern society. Much like any DIY project; this project has been about learning skills, and building something that works for me, and anyone else who may want to use it. It’s a reminder that with curiosity, a little persistence, and the right tools, creating functional, personalized solutions to problems and goals is more accessible than ever.

[Feel free to check out and star the project on GitHub!](https://www.github.com/philcifone/ataraxia)