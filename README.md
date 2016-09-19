# Web Toolbox

A collection of utilities and calculators related to stuff I'm intersted in.

This is work in progress - first up, collating bits I had scattered on seperate sites to here.

## Hosting

I'm using GitHub Pages to run the the site directly from the GitHub repository.

How does that work? GitHub Pages basically serves whatever you commit to the repo.
For static HTML sites, that means simply adding an `index.html` to the root of the repo.

By default, GitHub will make a detached gh-pages branch (if you use the web tools to turn on pages).

GitHub now allows you to select the branch from which GitHub Pages are built.
I have configured GitHub to use the master branch, which means the pages site has direct access to all the images and data in the repo,
without needing to continually merge back to the gh-pages branch.

To host on a custom URL, just two steps:

* in DNS, configure a CNAME to point to <username>.github.io
* add a CNAME file to the repo root with the matching CNAME in DNS (GitHub does this for you automatically if you add the custom url in the web interface)
