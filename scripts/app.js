document.addEventListener("DOMContentLoaded", () => {
    const navigateTo = url => {
        history.pushState(null, null, url);
        router();
    };

    const router = async () => {
        const routes = [
            { path: "/", view: showHome },
            { path: "/about", view: () => document.getElementById("about") },
            { path: "/contact", view: () => document.getElementById("contact") },
            { path: "/article", view: showArticleDetail }
        ];

        const potentialMatches = routes.map(route => {
            return {
                route: route,
                isMatch: location.pathname === route.path
            };
        });

        let match = potentialMatches.find(potentialMatch => potentialMatch.isMatch);

        if (!match) {
            match = {
                route: routes[0],
                isMatch: true
            };
        }

        const view = match.route.view();
        document.querySelectorAll(".view").forEach(view => view.classList.add("hidden"));
        view.classList.remove("hidden");
    };

    const showHome = () => {
        const homeView = document.getElementById("home");
        homeView.innerHTML = '';
        mockData.articles.forEach(article => {
            const articleDiv = document.createElement("div");
            articleDiv.className = "article";
            articleDiv.innerHTML = `
                <h2>${article.title}</h2>
                <img src="${article.cover_image}" alt="${article.title}">
                <p>${article.excerpt}</p>
                <p><strong>${article.author}</strong> - ${article.date}</p>
                <button onclick="navigateTo('/article?id=${article.id}')">Lire la suite</button>
            `;
            homeView.appendChild(articleDiv);
        });
        return homeView;
    };

    const showArticleDetail = () => {
        const articleId = new URLSearchParams(location.search).get('id');
        const article = mockData.articles.find(article => article.id == articleId);
        const detailView = document.getElementById("article-detail");
        detailView.innerHTML = `
            <h2>${article.title}</h2>
            <img src="${article.cover_image}" alt="${article.title}">
            <p>${article.content}</p>
            <p><strong>${article.author}</strong> - ${article.date}</p>
            <h3>Commentaires</h3>
            ${article.comments.map(comment => `
                <p><strong>${comment.author}:</strong> ${comment.text}</p>
            `).join('')}
            <button onclick="navigateTo('/')">Retour</button>
        `;
        return detailView;
    };

    window.addEventListener("popstate", router);

    document.querySelectorAll('[data-link]').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            navigateTo(e.target.href);
        });
    });

    router();
});

const mockData = {
    "articles": [
        {
            "id": 1,
            "title": "Introduction to React",
            "cover_image": "https://example.com/image1.jpg",
            "excerpt": "React is a JavaScript library for building user interfaces...",
            "author": "John Doe",
            "date": "2023-01-01",
            "content": "Full content of the article goes here...",
            "comments": [
                { "author": "Jane Smith", "text": "Great article!" },
                { "author": "Bob Johnson", "text": "Very informative, thanks!" }
            ]
        },
        {
            "id": 2,
            "title": "Understanding Vue.js",
            "cover_image": "https://example.com/image2.jpg",
            "excerpt": "Vue.js is a progressive framework for building user interfaces...",
            "author": "Alice Doe",
            "date": "2023-02-01",
            "content": "Full content of the article goes here...",
            "comments": [
                { "author": "Tom White", "text": "Nice overview of Vue.js!" }
            ]
        }
    ]
};
