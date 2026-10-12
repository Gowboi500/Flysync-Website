export type BlogPost = {
  slug: string;
  title: string;
  category: string;
  keywords: string[];
  date: string;
  isoDate: string;
  readTime: string;
  image: string;
  imageAlt: string;
  article?: {
    intro: string[];
    sections: Array<{
      heading: string;
      paragraphs?: string[];
      benefits?: Array<{
        title: string;
        body: string;
      }>;
    }>;
    conclusion: string[];
  };
};

export const blogPosts: BlogPost[] = [
  {
    slug: "why-every-travel-agency-needs-a-b2b-flight-booking-portal",
    title: "Why Every Travel Agency Needs a B2B Flight Booking Portal",
    category: "B2B Flight Booking",
    keywords: [
      "B2B flight booking portal",
      "travel agency booking platform",
      "online flight booking for travel agents",
    ],
    date: "Oct 2026",
    isoDate: "2026-10",
    readTime: "5 min read",
    image: "/images/blogs/b2b-flight-booking-portal.webp",
    imageAlt:
      "Travel agent using an online flight booking platform in a modern agency office",
    article: {
      intro: [
        "The travel industry is becoming increasingly digital, and travel agencies need smarter solutions to manage flight bookings efficiently. A B2B flight booking portal helps travel professionals search, compare, and book flights through a centralized platform.",
      ],
      sections: [
        {
          heading: "What Is a B2B Flight Booking Portal?",
          paragraphs: [
            "A B2B flight booking portal is an online platform designed specifically for travel agencies, tour operators, and travel businesses. It allows authorized agents to access flight options, compare fares, manage reservations, and streamline booking operations.",
          ],
        },
        {
          heading: "Key Benefits of a B2B Flight Booking Portal",
          benefits: [
            {
              title: "Faster Flight Searches",
              body: "Travel agents can search for available flights, compare schedules, and explore fare options without switching between multiple systems.",
            },
            {
              title: "Simplified Booking Management",
              body: "A centralized booking platform helps agencies organize reservations, review booking details, and manage customer travel requirements.",
            },
            {
              title: "Better Operational Efficiency",
              body: "Digital booking workflows reduce repetitive manual tasks and help agents serve customers more efficiently.",
            },
            {
              title: "Access to Multiple Flight Options",
              body: "Depending on the platform's supplier integrations, agents can explore domestic and international flight options through a single interface.",
            },
            {
              title: "Business Growth Opportunities",
              body: "A streamlined booking process allows travel agencies to handle more inquiries, improve customer service, and focus on expanding their business.",
            },
          ],
        },
      ],
      conclusion: [
        "A B2B flight booking portal is more than a booking solution. It is a valuable business tool that helps travel agencies improve efficiency, organize operations, and deliver better booking experiences.",
        "As the travel industry continues to evolve, adopting the right technology can help agencies remain competitive.",
      ],
    },
  },
  {
    slug: "what-is-series-flight-booking-complete-guide-for-travel-agents",
    title: "What Is Series Flight Booking? A Complete Guide for Travel Agents",
    category: "Series Flight Booking",
    keywords: [
      "Series flight booking",
      "airline series seats",
      "group flight booking",
      "flight inventory for travel agents",
    ],
    date: "Nov 2026",
    isoDate: "2026-11",
    readTime: "6 min read",
    image: "/images/blogs/series-flight-booking-guide.jpg",
    imageAlt:
      "Passengers boarding a flight through a jet bridge at an airport gate",
  },
  {
    slug: "b2b-flight-booking-vs-series-flight-booking-whats-the-difference",
    title: "B2B Flight Booking vs Series Flight Booking \u2014 What's the Difference?",
    category: "Flight Booking Guide",
    keywords: [
      "B2B flight booking vs series booking",
      "group airline booking",
      "travel agent flight booking",
    ],
    date: "Dec 2026",
    isoDate: "2026-12",
    readTime: "5 min read",
    image: "/images/blogs/b2b-vs-series-flight-booking.jpg",
    imageAlt:
      "Travelers checking an airport departures board before their flight",
  },
];

export const publishedBlogPosts = blogPosts.filter((post) => post.article);

export function getPublishedBlogPost(slug: string) {
  return publishedBlogPosts.find((post) => post.slug === slug);
}
