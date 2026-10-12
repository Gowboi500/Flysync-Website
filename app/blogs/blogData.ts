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
    title?: string;
    intro: string[];
    sections: Array<{
      heading: string;
      paragraphs?: string[];
      benefits?: Array<{
        title: string;
        body: string;
      }>;
      bullets?: string[];
      table?: {
        headers: string[];
        rows: string[][];
      };
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
    article: {
      intro: [
        "Series flight booking is an important concept in the travel industry, particularly for travel agencies that regularly handle group tours, holiday packages, and high-volume passenger bookings.",
        "Understanding how series flight bookings work can help travel professionals plan inventory, manage seat availability, and organize group travel more effectively.",
      ],
      sections: [
        {
          heading: "What Is Series Flight Booking?",
          paragraphs: [
            "Series flight booking refers to an arrangement in which a travel agency or tour operator secures a predetermined number of airline seats on specific routes and travel dates, often across multiple departures.",
            "These arrangements are commonly used for group tours, seasonal travel packages, and destinations with consistent passenger demand.",
          ],
        },
        {
          heading: "How Does Series Flight Booking Work?",
          benefits: [
            {
              title: "Step 1: Select the Route",
              body: "The travel agency identifies a route based on customer demand and business requirements.",
            },
            {
              title: "Step 2: Secure Seat Inventory",
              body: "The agency negotiates an arrangement with an airline or authorized supplier for a specific number of seats, subject to agreed conditions.",
            },
            {
              title: "Step 3: Manage Available Seats",
              body: "The allocated seats are organized according to departure dates, booking status, and remaining availability.",
            },
            {
              title: "Step 4: Sell Seats to Travelers",
              body: "The agency sells the available inventory to customers, partner agencies, or sub-agents.",
            },
            {
              title: "Step 5: Monitor Bookings",
              body: "As reservations are confirmed, the agency tracks seat utilization and manages the remaining inventory.",
            },
          ],
        },
        {
          heading: "Benefits of Series Flight Booking",
          bullets: [
            "Supports advance travel planning.",
            "Helps organize group travel requirements.",
            "Provides greater visibility into allocated seat inventory.",
            "Creates opportunities for planned travel packages.",
            "Helps agencies manage recurring departures.",
          ],
        },
        {
          heading: "Who Can Benefit from Series Flight Booking?",
          paragraphs: [
            "Series flight booking can be useful for tour operators, holiday package providers, group travel specialists, destination management companies, and travel agencies handling recurring passenger demand.",
          ],
        },
      ],
      conclusion: [
        "Series flight booking can help travel businesses plan group departures and manage allocated airline seats more systematically.",
        "With proper inventory planning and booking management, travel agencies can improve operational efficiency and make better use of their available seats.",
      ],
    },
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
    article: {
      title: "B2B Flight Booking vs Series Flight Booking: What's the Difference?",
      intro: [
        "Travel agencies use different booking methods depending on customer requirements, passenger volume, and travel plans.",
        "Two common approaches are regular B2B flight booking and series flight booking. Although both involve airline reservations, their purposes and workflows can be different.",
      ],
      sections: [
        {
          heading: "Understanding B2B Flight Booking",
          paragraphs: [
            "B2B flight booking allows travel agents to search for and reserve flights based on available airline or supplier inventory.",
            "It is commonly used for individual travelers, families, corporate passengers, and customers with flexible travel requirements.",
          ],
        },
        {
          heading: "Understanding Series Flight Booking",
          paragraphs: [
            "Series flight booking involves securing a predefined allocation of seats for selected flights and departure dates.",
            "It is commonly used for organized group tours, holiday packages, and recurring travel programs.",
          ],
        },
        {
          heading: "Key Differences",
          table: {
            headers: ["Feature", "B2B Flight Booking", "Series Flight Booking"],
            rows: [
              ["Booking Type", "Individual or group reservations", "Pre-arranged seat allocations"],
              ["Seat Availability", "Based on supplier availability", "Based on allocated inventory"],
              ["Travel Dates", "Customer-selected dates", "Predetermined departures"],
              ["Common Usage", "FIT, corporate, general travel", "Group tours, travel packages"],
              ["Inventory Planning", "Usually booking-based", "Advance allocation planning"],
            ],
          },
        },
        {
          heading: "Which Booking Method Is Better?",
          paragraphs: [
            "The right choice depends on the agency's business model.",
            "Regular B2B flight booking is suitable for agencies handling different customer travel requests daily.",
            "Series flight booking can be suitable for businesses that regularly organize group departures and need greater control over allocated seats.",
          ],
        },
      ],
      conclusion: [
        "Both booking methods play important roles in the travel industry. By understanding their differences, travel agencies can select the most appropriate booking approach for their customers and business operations.",
      ],
    },
  },
];

export const publishedBlogPosts = blogPosts.filter((post) => post.article);

export function getPublishedBlogPost(slug: string) {
  return publishedBlogPosts.find((post) => post.slug === slug);
}
