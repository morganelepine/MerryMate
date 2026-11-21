export const formatIdeaCount = (count) =>
    `${count} ${count > 1 ? "idées" : "idée"}`;

export const NO_BRAND = "Sans marque";

// Keeps the incoming order.
export function groupByBrand(ideas) {
    const groups = new Map();

    for (const { brand, ...idea } of ideas) {
        if (!groups.has(brand)) groups.set(brand, { brand, ideas: [] });
        groups.get(brand).ideas.push(idea);
    }

    return [...groups.values()];
}

// The link field is free text: only treat it as a URL when it parses to a real domain.
export function parseLink(link) {
    if (!link) return null;
    try {
        const url = new URL(
            /^https?:\/\//i.test(link) ? link : `https://${link}`,
        );
        if (!url.hostname.includes(".")) return null;
        return { href: url.href, host: url.hostname.replace(/^www\./, "") };
    } catch {
        return null;
    }
}

export const getIdeaTitle = (idea) =>
    idea.idea || parseLink(idea.link)?.host || idea.link;

// No name but a web link: the link pill itself stands as the title (shown once).
export const linkIsTitle = (idea) =>
    !idea.idea && Boolean(parseLink(idea.link));
