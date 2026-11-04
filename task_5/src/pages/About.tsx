import { Link } from "react-router";

interface HighlightItem {
  title: string;
  body: string;
}

const HIGHLIGHTS: HighlightItem[] = [
  {
    title: "Catalog",
    body: "Lorem ipsum dolor ...",
  },
  {
    title: "Routing",
    body: "Lorem ipsum dolor ...",
  },
  {
    title: "Dashboard",
    body: "Lorem ipsum dolor ...",
  },
  {
    title: "Performance",
    body: "Lorem ipsum dolor ...",
  },
];

export const About = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          About
        </h1>
      </div>

      <div className="bg-white border border-gray-200 p-6 space-y-4">
        <ul className="space-y-3 text-sm text-gray-700">
          {HIGHLIGHTS.map((highlight) => (
            <li key={highlight.title} className="flex items-start gap-2">
              <span>
                <strong>{highlight.title}:</strong> {highlight.body}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="pt-2 flex items-center gap-4">
        <Link
          to="/products"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-4 py-2 transition-colors"
        >
          Explore Catalog
        </Link>
        <Link
          to="/dashboard"
          className="border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium text-sm px-4 py-2 transition-colors"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default About;
