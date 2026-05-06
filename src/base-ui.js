/**
 * Auto365 Base UI Controller v1.0
 * Specialized logic for general UI interactions (Sticky, Scroll, etc.)
 */
(function () {
    function initStickyHeader() {
        const header = document.querySelector(".header-main");
        if (!header) return;

        // Tạo placeholder để tránh bị "giật" trang khi header thành fixed
        let placeholder = document.querySelector(".header-placeholder");
        if (!placeholder) {
            placeholder = document.createElement("div");
            placeholder.className = "header-placeholder";
            placeholder.style.display = "none";
            header.parentNode.insertBefore(placeholder, header);
        }

        const headerHeight = header.offsetHeight;
        const stickyTrigger = header.offsetTop + headerHeight;

        window.addEventListener("scroll", () => {
            const currentScroll = window.pageYOffset;

            if (currentScroll > stickyTrigger) {
                if (!header.classList.contains("is-sticky")) {
                    header.classList.add("is-sticky");
                    placeholder.style.height = headerHeight + "px";
                    placeholder.style.display = "block";
                }
            } else {
                if (header.classList.contains("is-sticky")) {
                    header.classList.remove("is-sticky");
                    placeholder.style.display = "none";
                }
            }
        });
    }

    function initScrollToTop() {
        const btn = document.createElement("div");
        btn.id = "a365-scroll-top";
        btn.innerHTML = `
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
        `;
        document.body.appendChild(btn);

        window.addEventListener("scroll", () => {
            if (window.pageYOffset > 300) {
                btn.classList.add("visible");
            } else {
                btn.classList.remove("visible");
            }
        });

        btn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
            initStickyHeader();
            initScrollToTop();
        });
    } else {
        initStickyHeader();
        initScrollToTop();
    }
})();
