/**
 * Product pages.
 *
 * Copy is taken verbatim from the supplied content pack:
 *   3. Products Overview.pdf
 *   4. B2B Page Structure.pdf
 *   5. Series Booking Portal Page Structure.pdf
 *   6. B2C Page Structure.pdf
 *   7. VACAY365 HOLIDAY CRM PAGE CONTENT.pdf
 *   8. Corporate Booking Portal Page Structure.pdf
 *
 * All five pages share one shape so a single template renders them.
 */

export type ProductPage = {
  slug: string;
  /** Name used in navigation and cards */
  name: string;
  /** Optional qualifier, e.g. "Fixed Departures" */
  subtitle?: string;
  icon: string;
  /** Products Overview card */
  card: { headline: string; body: string };
  hero: { headline: string; sub: string };
  /** Bullets the hero mockup is meant to show */
  heroShows: string[];
  trusted: { heading: string; body: string };
  challenges: { heading: string; items: { title: string; body: string }[] };
  solution: { heading: string; body: string };
  features: { heading: string; items: { title: string; body: string }[] };
  benefits: { heading: string; items: { title: string; body: string }[] };
  steps: { heading: string; items: string[] };
  integrations?: { heading: string; body: string };
  apiOutPartners?: { heading: string; body: string };
  /** Optional extra bands some pages carry */
  extras?: { heading: string; body: string }[];
  cta: { heading: string; body: string };
};

export const productPages: ProductPage[] = [
  /* ---------------------------------------------------------------- */
  {
    slug: "b2b-portal",
    name: "B2B Portal",
    icon: "Network",
    card: {
      headline: "Manage Your Agent Network with Ease",
      body: "A comprehensive B2B booking platform that enables travel agencies and partners to search, book and manage travel services through a single centralized system.",
    },
    hero: {
      headline: "B2B Travel Portal Software for Modern Travel Businesses",
      sub: "Transform the way you manage your travel partner network with an advanced B2B booking platform built for modern travel businesses. Enable seamless agent bookings, automate pricing and commissions, manage credit limits and distribute live travel inventory through a single, powerful system designed to improve efficiency, increase revenue and support business growth at scale.",
    },
    heroShows: [
      "Flight search",
      "Agent management",
      "Markup controls",
      "Reports & analytics",
    ],
    trusted: {
      heading: "Powering Travel Agencies Across Multiple Markets",
      body: "Travel agencies, consolidators, wholesalers, tour operators and DMCs use Flysync to streamline operations, expand distribution networks and increase booking volumes through a scalable B2B ecosystem.",
    },
    challenges: {
      heading: "Managing Agent Networks Shouldn't Be Complicated",
      items: [
        {
          title: "Manual Booking Processes",
          body: "Managing bookings across multiple agents consumes valuable time and increases operational workload.",
        },
        {
          title: "Pricing & Markup Complexity",
          body: "Handling different commissions and markups manually often leads to pricing inconsistencies.",
        },
        {
          title: "Limited Visibility",
          body: "Tracking agent performance, transactions and outstanding balances becomes difficult as networks grow.",
        },
        {
          title: "Inventory Distribution Challenges",
          body: "Sharing inventory across multiple partners without real time synchronization creates inefficiencies.",
        },
        {
          title: "Credit & Payment Management",
          body: "Managing agent credits, deposits and settlements manually can impact cash flow.",
        },
        {
          title: "Communication Gaps",
          body: "Scattered communication channels slow down booking confirmations and issue resolution.",
        },
      ],
    },
    solution: {
      heading: "One Platform to Manage Your Entire B2B Travel Network",
      body: "Flysync brings inventory distribution, agent management, bookings, payments and reporting together in a unified platform designed specifically for travel businesses.",
    },
    features: {
      heading: "Everything You Need to Run a Successful B2B Travel Business",
      items: [
        {
          title: "Agent & Sub Agent Management",
          body: "Create and manage unlimited agents, distributors and branch networks with customized access controls.",
        },
        {
          title: "Dynamic Markup Management",
          body: "Configure markups, commissions and pricing rules at agent, supplier, or product level.",
        },
        {
          title: "Real Time Inventory Access",
          body: "Provide instant access to flights, hotels, holidays and other travel products.",
        },
        {
          title: "Credit & Wallet Management",
          body: "Control agent balances, credit limits, deposits and transactions effortlessly.",
        },
        {
          title: "Booking Management",
          body: "Monitor bookings, cancellations, amendments and vouchers from a centralized dashboard.",
        },
        {
          title: "Reporting & Analytics",
          body: "Access detailed business reports, revenue insights and agent performance metrics.",
        },
        {
          title: "Supplier & API Integration",
          body: "Connect with GDSs, airlines, hotels, consolidators and third party suppliers.",
        },
        {
          title: "Automated Notifications",
          body: "Keep agents informed through booking confirmations, alerts and status updates.",
        },
      ],
    },
    benefits: {
      heading: "Why Travel Businesses Choose Flysync",
      items: [
        {
          title: "Expand Your Distribution Network",
          body: "Reach more markets by onboarding agents and partners through a scalable B2B ecosystem.",
        },
        {
          title: "Increase Revenue Opportunities",
          body: "Enable agents to sell more inventory while maintaining complete pricing control.",
        },
        {
          title: "Reduce Operational Costs",
          body: "Automate repetitive tasks and minimize manual intervention.",
        },
        {
          title: "Improve Agent Experience",
          body: "Provide a fast, self service booking platform available 24/7.",
        },
        {
          title: "Make Data Driven Decisions",
          body: "Gain complete visibility into bookings, revenue and business performance.",
        },
      ],
    },
    steps: {
      heading: "Get Started in 3 Simple Steps",
      items: [
        "Connect suppliers, APIs and inventory sources.",
        "Create agents, define markups and configure credit settings.",
        "Start accepting bookings and grow your distribution network.",
      ],
    },
    integrations: {
      heading: "Seamlessly Connect With Your Existing Travel Ecosystem",
      body: "Integrate with GDSs, airlines, hotel suppliers, payment gateways, accounting software and third party travel APIs to create a fully connected booking environment.",
    },
    cta: {
      heading: "Grow Your Travel Business with Flysync",
      body: "Empower your travel agency with a modern B2B platform built to automate operations, strengthen partner relationships and accelerate business growth.",
    },
  },

  /* ---------------------------------------------------------------- */
  {
    slug: "series-booking-portal",
    name: "Series Booking Portal",
    subtitle: "Fixed Departures",
    icon: "CalendarRange",
    card: {
      headline: "Simplify Fixed Departure Management",
      body: "Manage fixed departures, group tours and series bookings efficiently with real time availability tracking and streamlined booking workflows.",
    },
    hero: {
      headline: "Series Booking Portal Software for Fixed Departures",
      sub: "Simplify fixed departure management with a centralized series booking platform built for modern travel businesses. Create and manage departures, track real time availability, automate bookings, control pricing and distribute inventory seamlessly through a single system designed to improve efficiency, maximize occupancy and accelerate business growth.",
    },
    heroShows: [
      "Departure calendar",
      "Seat availability tracker",
      "Group booking management",
      "Booking analytics & reports",
    ],
    trusted: {
      heading: "Helping Travel Businesses Sell Fixed Departures More Efficiently",
      body: "Tour operators, travel agencies, DMCs, pilgrimage organizers and holiday providers rely on Flysync to manage fixed departures, optimize inventory utilization and streamline booking operations through a single platform.",
    },
    challenges: {
      heading: "Managing Fixed Departures Shouldn't Be Complicated",
      items: [
        {
          title: "Departure Management Complexity",
          body: "Managing multiple departures, schedules and tour packages manually often leads to operational inefficiencies.",
        },
        {
          title: "Limited Seat Visibility",
          body: "Without real time inventory tracking, monitoring available seats across departures becomes difficult.",
        },
        {
          title: "Manual Booking Operations",
          body: "Processing bookings, confirmations and passenger information manually consumes valuable time.",
        },
        {
          title: "Occupancy Management Issues",
          body: "Unfilled departures can impact profitability and overall business performance.",
        },
        {
          title: "Pricing & Availability Updates",
          body: "Keeping departure pricing and availability updated across channels can be challenging.",
        },
        {
          title: "Agent Coordination Challenges",
          body: "Managing bookings from multiple travel agents without a centralized system often creates confusion.",
        },
      ],
    },
    solution: {
      heading: "One Platform to Manage Every Fixed Departure",
      body: "Flysync's Series Booking Portal centralizes departure scheduling, seat inventory, booking management, pricing control and partner distribution in a single platform. Travel businesses can efficiently manage group tours and fixed departures while providing real time availability to agents and customers.",
    },
    features: {
      heading: "Everything You Need to Run Successful Fixed Departure Programs",
      items: [
        {
          title: "Fixed Departure Management",
          body: "Create, organize and manage multiple departures with complete scheduling control.",
        },
        {
          title: "Real Time Seat Inventory",
          body: "Monitor seat availability and occupancy levels across all departures instantly.",
        },
        {
          title: "Group Booking Management",
          body: "Handle individual, family and group reservations through a centralized system.",
        },
        {
          title: "Departure Calendar",
          body: "Provide clear visibility of upcoming departures, schedules and availability.",
        },
        {
          title: "Dynamic Pricing Controls",
          body: "Configure pricing, promotions and departure-specific rates with ease.",
        },
        {
          title: "Agent Booking Portal",
          body: "Allow travel partners to view and book departures in real time.",
        },
        {
          title: "Passenger Management",
          body: "Manage traveler details, rooming lists, documents and booking records efficiently.",
        },
        {
          title: "Reports & Analytics",
          body: "Track bookings, revenue, occupancy rates and departure performance through detailed reports.",
        },
      ],
    },
    benefits: {
      heading: "Why Travel Businesses Choose Flysync",
      items: [
        {
          title: "Maximize Departure Occupancy",
          body: "Fill more seats and improve departure profitability through better inventory visibility.",
        },
        {
          title: "Increase Booking Efficiency",
          body: "Automate booking workflows and reduce manual operational tasks.",
        },
        {
          title: "Scale Fixed Departure Programs",
          body: "Manage growing numbers of departures without increasing administrative complexity.",
        },
        {
          title: "Strengthen Agent Network Sales",
          body: "Enable travel partners to access and sell departures through a self-service platform.",
        },
        {
          title: "Improve Business Visibility",
          body: "Gain real time insights into bookings, revenue and departure performance.",
        },
      ],
    },
    steps: {
      heading: "Get Started in 3 Simple Steps",
      items: [
        "Create and publish your fixed departure schedules.",
        "Configure inventory, pricing and booking rules.",
        "Start accepting bookings from agents and customers in real time.",
      ],
    },
    integrations: {
      heading: "Seamlessly Connect With Your Existing Travel Ecosystem",
      body: "Integrate with payment gateways, CRM systems, accounting software, communication platforms and travel APIs to create a fully connected departure management environment.",
    },
    apiOutPartners: {
      heading: "API Out Partners for Series Booking",
      body: "These are outbound supplier and travel API connections used for distributing and servicing series booking inventory across 250+ places globally.",
    },
    cta: {
      heading: "Grow Your Fixed Departure Business with Flysync",
      body: "Empower your team with a modern series booking platform built to simplify departure management, improve occupancy rates and accelerate business growth through automated operations and real time inventory control.",
    },
  },

  /* ---------------------------------------------------------------- */
  {
    slug: "b2c-portal",
    name: "B2C Portal",
    icon: "Globe",
    card: {
      headline: "Deliver Seamless Online Travel Bookings",
      body: "Provide customers with a fast, secure and user-friendly booking experience for flights, hotels, holidays and other travel services.",
    },
    hero: {
      headline: "Launch Your Own Online Travel Booking Platform",
      sub: "Empower travelers to search, compare and book flights, hotels, holiday packages, activities and more through a fully branded B2C travel portal. Deliver seamless booking experiences, increase direct sales and grow your travel business with a powerful online booking solution.",
    },
    heroShows: [
      "Flight search",
      "Hotel booking",
      "Holiday packages",
      "Mobile responsive interface",
      "Secure checkout",
    ],
    trusted: {
      heading: "Helping Travel Brands Sell Directly to Customers",
      body: "Travel agencies, tour operators, OTAs, DMCs and travel startups use Flysync's B2C portal to create engaging online booking experiences, attract more customers and increase direct bookings through a centralized digital platform.",
    },
    challenges: {
      heading: "Growing Online Travel Sales Isn't Always Easy",
      items: [
        {
          title: "Limited Online Presence",
          body: "Many travel businesses struggle to offer a professional online booking experience that meets modern customer expectations.",
        },
        {
          title: "Manual Booking Management",
          body: "Handling inquiries and bookings manually leads to delays, errors and missed sales opportunities.",
        },
        {
          title: "Low Direct Bookings",
          body: "Dependence on third party marketplaces reduces profit margins and brand visibility.",
        },
        {
          title: "Poor User Experience",
          body: "Slow websites, complicated booking flows and outdated designs can result in abandoned bookings.",
        },
        {
          title: "Mobile Booking Challenges",
          body: "Customers expect seamless booking experiences across mobile, tablet and desktop devices.",
        },
        {
          title: "Payment & Conversion Issues",
          body: "Complex checkout processes often create friction and reduce booking conversions.",
        },
      ],
    },
    solution: {
      heading: "Your Complete Online Travel Booking Platform",
      body: "Flysync's B2C Portal enables travel businesses to sell travel products directly through a fully customizable online booking platform. From search and booking to payments and customer management, everything is managed through one powerful system.",
    },
    features: {
      heading: "Everything You Need to Sell Travel Online",
      items: [
        {
          title: "Branded Travel Website",
          body: "Launch a fully customized travel booking portal that reflects your brand identity.",
        },
        {
          title: "Flight Booking Engine",
          body: "Provide customers with real time flight search, pricing and instant booking capabilities.",
        },
        {
          title: "Hotel Booking System",
          body: "Offer access to extensive hotel inventory with live availability and dynamic pricing.",
        },
        {
          title: "Holiday Package Management",
          body: "Create, manage and sell customized tour packages and travel experiences.",
        },
        {
          title: "Mobile Responsive Design",
          body: "Deliver seamless booking experiences across all devices.",
        },
        {
          title: "Secure Online Payments",
          body: "Accept payments through multiple gateways with secure transaction processing.",
        },
        {
          title: "Customer Account Management",
          body: "Allow travelers to manage bookings, profiles, vouchers and travel history.",
        },
        {
          title: "Promotions & Offers",
          body: "Create discounts, promo codes, seasonal offers and marketing campaigns to drive conversions.",
        },
        {
          title: "SEO Friendly Platform",
          body: "Improve search engine visibility and attract organic traffic through optimized website architecture.",
        },
        {
          title: "Booking Management Dashboard",
          body: "Track reservations, cancellations, modifications and customer activity from a centralized system.",
        },
      ],
    },
    benefits: {
      heading: "Why Travel Businesses Choose Flysync B2C Portal",
      items: [
        {
          title: "Increase Direct Bookings",
          body: "Reduce dependency on third party platforms and sell directly to travelers.",
        },
        {
          title: "Strengthen Your Brand",
          body: "Create a consistent digital experience that builds customer trust and loyalty.",
        },
        {
          title: "Improve Customer Experience",
          body: "Provide fast, intuitive and secure booking journeys that encourage repeat business.",
        },
        {
          title: "Maximize Revenue",
          body: "Increase conversions through personalized offers, promotions and streamlined booking processes.",
        },
        {
          title: "Expand Market Reach",
          body: "Reach travelers worldwide through a scalable online booking platform available 24/7.",
        },
        {
          title: "Drive Business Growth",
          body: "Scale operations efficiently while managing bookings and customers from a single platform.",
        },
      ],
    },
    steps: {
      heading: "Launch Your Customer Booking Platform in 3 Simple Steps",
      items: [
        "Connect flights, hotels, holidays, payment gateways and supplier APIs.",
        "Customize your brand, website content, search flow, fares, offers and customer communication.",
        "Go live with your booking platform so customers can search, book and pay directly.",
      ],
    },
    integrations: {
      heading: "Connect Every Part of Your Travel Ecosystem",
      body: "Integrate with flight suppliers, hotel providers, payment gateways, CRM platforms, marketing tools and third party travel APIs to create a fully connected digital travel business.",
    },
    cta: {
      heading: "Build Your Travel Brand Online with Flysync",
      body: "Launch a powerful B2C travel booking platform that helps you attract customers, increase direct bookings, strengthen your brand and grow revenue through a seamless online travel experience.",
    },
  },

  /* ---------------------------------------------------------------- */
  {
    slug: "vacay365",
    name: "Vacay365",
    subtitle: "Holiday CRM",
    icon: "Users",
    card: {
      headline: "Turn Leads into Loyal Customers",
      body: "Manage inquiries, track leads, automate follow ups and strengthen customer relationships with a CRM built specifically for travel businesses.",
    },
    hero: {
      headline: "Holiday CRM Built for Travel Agencies & Tour Operators",
      sub: "Transform the way you manage holiday inquiries, quotations, itineraries, bookings and customer relationships. Vacay365 helps travel businesses streamline sales operations, automate follow ups, track leads and convert more inquiries into confirmed bookings from a single platform.",
    },
    heroShows: [
      "Lead Pipeline",
      "Quotation Builder",
      "Itinerary Management",
      "Follow Up Tracker",
      "Booking Dashboard",
      "Sales Reports",
    ],
    trusted: {
      heading: "Built Specifically for Travel Businesses",
      body: "Unlike generic CRM software, Vacay365 is purpose built for travel agencies, tour operators, DMCs and holiday specialists. From the moment an inquiry is received to quotation creation, itinerary planning, booking management, payment tracking and customer servicing, Vacay365 supports every stage of the holiday sales lifecycle.",
    },
    challenges: {
      heading: "Challenges Travel Businesses Face",
      items: [
        {
          title: "Scattered Customer Information",
          body: "Managing customer details across spreadsheets, emails, WhatsApp chats and multiple tools makes it difficult to deliver a seamless customer experience and maintain accurate records.",
        },
        {
          title: "Missed Follow Ups & Lost Opportunities",
          body: "Without a structured lead management process, valuable inquiries often go unattended, resulting in lost bookings and reduced conversion rates.",
        },
        {
          title: "Slow Quotation & Itinerary Creation",
          body: "Creating customized holiday quotations and itineraries manually takes time, delays customer responses and impacts sales performance.",
        },
        {
          title: "Disconnected Sales & Operations",
          body: "Sales and operations teams often work in separate systems, creating communication gaps that affect booking management and customer satisfaction.",
        },
        {
          title: "Complex Billing & Payment Tracking",
          body: "Tracking invoices, payment schedules, balances and financial records manually increases the risk of errors and operational inefficiencies.",
        },
        {
          title: "Limited Visibility into Business Performance",
          body: "Without real time reporting, travel businesses struggle to monitor lead sources, conversions, revenue trends and team productivity effectively.",
        },
      ],
    },
    solution: {
      heading: "One Ecosystem for Sales, Operations and Customers",
      body: "The platform combines sales, operations, customer management and reporting into a single ecosystem, helping travel businesses improve efficiency, increase conversions and deliver exceptional travel experiences.",
    },
    features: {
      heading: "Why Travel Agencies Choose Vacay365",
      items: [
        {
          title: "Manage Everything from One Platform",
          body: "Centralize inquiries, customer information, quotations, itineraries, bookings, payments and reports in a single system designed for travel businesses.",
        },
        {
          title: "Respond Faster to Customer Inquiries",
          body: "Create professional quotations and itineraries quickly, helping your team engage prospects faster and improve conversion opportunities.",
        },
        {
          title: "Never Miss a Follow Up",
          body: "Automated reminders and lead tracking ensure every inquiry receives timely attention throughout the sales journey.",
        },
        {
          title: "Improve Team Productivity",
          body: "Streamline workflows and reduce manual tasks, allowing teams to focus on customer engagement and business growth.",
        },
        {
          title: "Gain Real Time Business Insights",
          body: "Monitor sales performance, booking trends, conversion rates and revenue through actionable dashboards and reports.",
        },
        {
          title: "Scale Operations with Confidence",
          body: "Handle increasing inquiry volumes, bookings and customer interactions efficiently without adding operational complexity.",
        },
      ],
    },
    benefits: {
      heading: "Benefits of Using Vacay365",
      items: [
        { title: "Centralize Customer & Inquiry Management", body: "" },
        { title: "Improve Lead Conversion Rates", body: "" },
        { title: "Automate Follow Up Processes", body: "" },
        { title: "Accelerate Quotation & Itinerary Creation", body: "" },
        { title: "Streamline Booking & Operations Workflows", body: "" },
        { title: "Simplify Billing & Payment Management", body: "" },
        { title: "Gain Real Time Sales & Revenue Insights", body: "" },
        { title: "Enhance Team Collaboration", body: "" },
        { title: "Improve Customer Experience", body: "" },
        { title: "Scale Your Travel Business Efficiently", body: "" },
      ],
    },
    steps: {
      heading: "Get Started in 3 Simple Steps",
      items: [
        "Capture inquiries from every channel into one lead pipeline.",
        "Build costed quotations and itineraries, then send them branded.",
        "Automate follow ups and convert more inquiries into bookings.",
      ],
    },
    cta: {
      heading: "Ready to Simplify Holiday Sales Management?",
      body: "Empower your travel business with a CRM built specifically for the travel industry. Manage inquiries, create quotations, automate follow ups and convert more leads into bookings with Vacay365.",
    },
  },

  /* ---------------------------------------------------------------- */
  {
    slug: "corporate-booking-portal",
    name: "Corporate Booking Portal",
    icon: "Building2",
    card: {
      headline: "Corporate Travel Management Made Simple",
      body: "Simplify business travel management with employee booking workflows, policy controls, approval systems and centralized expense visibility.",
    },
    hero: {
      headline: "Corporate Travel Management Made Simple",
      sub: "Streamline business travel with a centralized corporate booking platform designed for modern organizations. Manage employee travel, automate approvals, control travel expenses, enforce company policies and provide a seamless booking experience through a single, powerful platform.",
    },
    heroShows: [
      "Flight & hotel booking",
      "Travel approval workflows",
      "Expense tracking",
      "Travel policy management",
      "Employee self-booking portal",
    ],
    trusted: {
      heading: "Helping Companies Manage Business Travel More Efficiently",
      body: "Organizations, travel management companies, corporate travel departments and business travel agencies use Flysync's Corporate Booking Portal to simplify travel planning, improve policy compliance, reduce travel costs and deliver a seamless booking experience for employees.",
    },
    challenges: {
      heading: "Managing Corporate Travel Shouldn't Be Complicated",
      items: [
        {
          title: "Manual Travel Requests",
          body: "Employees and managers spend valuable time handling travel requests through emails and spreadsheets.",
        },
        {
          title: "Lack of Policy Compliance",
          body: "Without proper controls, employees may book outside approved travel policies, increasing costs.",
        },
        {
          title: "Poor Expense Visibility",
          body: "Tracking travel spend across departments and employees becomes difficult without centralized reporting.",
        },
        {
          title: "Slow Approval Processes",
          body: "Manual approvals often delay bookings and impact employee productivity.",
        },
        {
          title: "Multiple Booking Platforms",
          body: "Using different systems for flights, hotels and travel management creates operational inefficiencies.",
        },
        {
          title: "Limited Reporting & Insights",
          body: "Businesses struggle to analyze travel expenses, booking trends and budget performance.",
        },
      ],
    },
    solution: {
      heading: "A Complete Corporate Travel Management Platform",
      body: "Flysync's Corporate Booking Portal centralizes every aspect of business travel management. From travel requests and approvals to booking, expense tracking, reporting and policy enforcement, everything is managed through one integrated platform.",
    },
    features: {
      heading: "Everything You Need to Manage Corporate Travel",
      items: [
        {
          title: "Employee Self-Booking Portal",
          body: "Enable employees to search and book approved travel options independently.",
        },
        {
          title: "Travel Policy Management",
          body: "Set company travel policies, spending limits, preferred suppliers and booking rules.",
        },
        {
          title: "Automated Approval Workflows",
          body: "Configure multi-level approval processes based on departments, budgets, or employee roles.",
        },
        {
          title: "Flight & Hotel Booking",
          body: "Access real-time inventory and booking capabilities through integrated travel suppliers.",
        },
        {
          title: "Corporate Fare Management",
          body: "Provide negotiated rates and preferred travel options for employees.",
        },
        {
          title: "Expense Tracking & Reporting",
          body: "Monitor travel expenses, budgets and spending trends in real time.",
        },
        {
          title: "Cost Center Allocation",
          body: "Assign travel expenses to departments, projects, or business units for accurate accounting.",
        },
        {
          title: "Role-Based Access Control",
          body: "Manage permissions for employees, managers, finance teams and travel administrators.",
        },
        {
          title: "Centralized Travel Dashboard",
          body: "Track bookings, approvals, cancellations, traveler activity and travel spend from one place.",
        },
        {
          title: "Mobile-Friendly Platform",
          body: "Allow travelers and approvers to manage trips anytime, anywhere.",
        },
      ],
    },
    benefits: {
      heading: "Why Businesses Choose Flysync Corporate Booking Portal",
      items: [
        {
          title: "Reduce Travel Costs",
          body: "Gain control over travel spending through policy enforcement and negotiated rates.",
        },
        {
          title: "Improve Employee Experience",
          body: "Provide a fast and convenient booking process with self-service capabilities.",
        },
        {
          title: "Faster Approvals",
          body: "Automate workflows to eliminate delays and accelerate travel planning.",
        },
        {
          title: "Better Compliance",
          body: "Ensure every booking follows company travel policies and approval requirements.",
        },
        {
          title: "Complete Visibility",
          body: "Access real-time insights into travel activity, budgets and expenses.",
        },
        {
          title: "Scale with Confidence",
          body: "Manage growing travel demands across teams, departments and locations efficiently.",
        },
      ],
    },
    steps: {
      heading: "Manage Corporate Travel in 3 Simple Steps",
      items: [
        "Configure company travel policies, approval workflows and user roles.",
        "Connect travel inventory, suppliers, negotiated rates and payment methods.",
        "Employees book travel, managers approve requests and administrators track everything through a centralized dashboard.",
      ],
    },
    integrations: {
      heading: "Connect Your Entire Corporate Travel Ecosystem",
      body: "Integrate with travel suppliers, accounting software, ERP systems, HR platforms, payment gateways, CRM solutions and reporting tools to create a seamless corporate travel management environment.",
    },
    extras: [
      {
        heading: "Maintain Control Without Slowing Down Travel",
        body: "Create custom travel policies, spending limits, approval hierarchies and preferred supplier rules to ensure compliance while providing employees with a smooth booking experience.",
      },
      {
        heading: "Make Smarter Travel Decisions with Data",
        body: "Access detailed reports on travel spend, department-wise budgets, booking trends, policy compliance, supplier performance and employee travel activity to optimize corporate travel programs.",
      },
    ],
    cta: {
      heading: "Take Control of Your Corporate Travel Operations",
      body: "Simplify business travel, reduce costs, improve compliance and provide employees with a seamless booking experience through Flysync's Corporate Booking Portal.",
    },
  },
];

export const productsOverview = {
  eyebrow: "Products Overview",
  heading: "Travel Technology Solutions Built for Growth",
  body: "Explore Flysync's suite of travel technology products designed to simplify operations, increase bookings and help travel businesses grow efficiently.",
  cta: {
    heading: "Need a Complete Travel Technology Solution?",
    body: "Whether you're looking to streamline operations, expand your distribution network, improve customer engagement, or increase bookings, Flysync has the right solution for your business.",
  },
};

export const getProduct = (slug: string) =>
  productPages.find((p) => p.slug === slug);
