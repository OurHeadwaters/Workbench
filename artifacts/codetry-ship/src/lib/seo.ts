export type PageMetadata = {
  title: string;
  description: string;
  path: string;
  imagePath?: string;
  structuredData?: Record<string, unknown>;
};

function absoluteUrl(path: string): string {
  return new URL(path, window.location.origin).toString();
}

/**
 * Applies route-specific metadata to the shared SPA document head and restores
 * the previous values when the route unmounts.
 */
export function applyPageMetadata({
  title,
  description,
  path,
  imagePath = "/og-thumbnail.png",
  structuredData,
}: PageMetadata): () => void {
  const previousTitle = document.title;
  const previousValues: Array<{
    element: Element;
    attribute: string;
    value: string | null;
  }> = [];
  const canonicalUrl = absoluteUrl(path);
  const imageUrl = absoluteUrl(imagePath);

  const setMeta = (selector: string, attribute: string, value: string) => {
    const element = document.querySelector(selector);
    if (!element) return;
    previousValues.push({
      element,
      attribute,
      value: element.getAttribute(attribute),
    });
    element.setAttribute(attribute, value);
  };

  const canonical =
    document.querySelector('link[rel="canonical"]') ??
    document.createElement("link");
  const createdCanonical = !canonical.parentNode;
  if (createdCanonical) {
    canonical.setAttribute("rel", "canonical");
    document.head.appendChild(canonical);
  }
  previousValues.push({
    element: canonical,
    attribute: "href",
    value: canonical.getAttribute("href"),
  });

  document.title = title;
  canonical.setAttribute("href", canonicalUrl);
  setMeta('meta[name="description"]', "content", description);
  setMeta('meta[property="og:title"]', "content", title);
  setMeta('meta[property="og:description"]', "content", description);
  setMeta('meta[property="og:url"]', "content", canonicalUrl);
  setMeta('meta[property="og:image"]', "content", imageUrl);
  setMeta('meta[name="twitter:title"]', "content", title);
  setMeta('meta[name="twitter:description"]', "content", description);
  setMeta('meta[name="twitter:image"]', "content", imageUrl);

  const structuredDataScript = structuredData
    ? document.createElement("script")
    : null;
  if (structuredDataScript) {
    structuredDataScript.type = "application/ld+json";
    structuredDataScript.dataset.pageStructuredData = "true";
    structuredDataScript.textContent = JSON.stringify(structuredData);
    document.head.appendChild(structuredDataScript);
  }

  return () => {
    document.title = previousTitle;
    for (const previous of previousValues) {
      if (previous.value === null) {
        previous.element.removeAttribute(previous.attribute);
      } else {
        previous.element.setAttribute(previous.attribute, previous.value);
      }
    }
    structuredDataScript?.remove();
    if (createdCanonical) canonical.remove();
  };
}