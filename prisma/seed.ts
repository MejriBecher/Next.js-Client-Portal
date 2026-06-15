import "dotenv/config"
import { hash } from "bcryptjs"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../lib/generated/prisma/client"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const db = new PrismaClient({ adapter })

async function main() {
  const services = [
    { id: "web-design", name: "Web Design", description: "Modern, responsive websites built with care", icon: "🎨", order: 1 },
    { id: "brand-strategy", name: "Brand Strategy", description: "Identity systems that tell your story", icon: "✦", order: 2 },
    { id: "seo-audit", name: "SEO Audit", description: "Find and fix what's holding you back", icon: "📈", order: 3 },
    { id: "content-creation", name: "Content Creation", description: "Copy, visuals, and stories that connect", icon: "✏️", order: 4 },
    { id: "digital-marketing", name: "Digital Marketing", description: "Reach the right people, at the right time", icon: "📡", order: 5 },
  ]

  for (const service of services) {
    await db.service.upsert({
      where: { id: service.id },
      update: service,
      create: service,
    })
  }

  console.log("Seeded", services.length, "services")

  const demoEmail = "demo@hortensia.test"
  const existing = await db.user.findUnique({ where: { email: demoEmail } })
  if (existing) {
    console.log("Demo user already exists — skipping")
    return
  }

  const password = await hash("password123", 12)

  const user = await db.user.create({
    data: {
      email: demoEmail,
      password,
      name: "Demo Client",
    },
  })

  const requests = await db.request.createMany({
    data: [
      {
        title: "Homepage redesign",
        description: "Update the hero section and add a new portfolio grid. We have wireframes ready.",
        budget: 5000,
        status: "IN_PROGRESS",
        userId: user.id,
      },
      {
        title: "SEO keyword research",
        description: "Full keyword audit for our service pages — target 50 keywords across 5 categories.",
        budget: 1200,
        status: "PENDING",
        userId: user.id,
      },
      {
        title: "Brand guidelines PDF",
        description: "Compile logo usage, color palette, typography, and tone of voice into a brand book.",
        budget: 3000,
        status: "DONE",
        userId: user.id,
      },
      {
        title: "Social media content pack",
        description: "12 Instagram posts + 6 LinkedIn carousels for the Q3 campaign.",
        status: "PENDING",
        userId: user.id,
      },
      {
        title: "Email newsletter template",
        description: "Responsive HTML email template compatible with Mailchimp and HubSpot.",
        budget: 800,
        status: "PENDING",
        userId: user.id,
      },
    ],
  })

  console.log("Created demo user:", demoEmail, "/ password123")
  console.log("Created", requests.count, "sample requests")
}

async function seedSecondUser() {
  const email = "acme@hortensia.test"
  const existing = await db.user.findUnique({ where: { email } })
  if (existing) {
    console.log("Second user already exists — skipping")
    return
  }

  const password = await hash("acmecorp2024", 12)

  const user = await db.user.create({
    data: { email, password, name: "Acme Corp" },
  })

  const requests = await db.request.createMany({
    data: [
      {
        title: "E-commerce platform rebuild",
        description: "Full redesign and reimplementation of our WooCommerce store on Shopify. Migrate 500+ products.",
        budget: 25000,
        status: "PENDING",
        userId: user.id,
      },
      {
        title: "API integration for CRM",
        description: "Connect our HubSpot CRM with the new Shopify store — sync orders, customers, and inventory.",
        budget: 8000,
        status: "PENDING",
        userId: user.id,
      },
      {
        title: "Product photography pack",
        description: "Professional photos for 50 hero products — white background + lifestyle variants.",
        budget: 4500,
        status: "IN_PROGRESS",
        userId: user.id,
      },
    ],
  })

  console.log("Created second user:", email, "/ acmecorp2024")
  console.log("Created", requests.count, "additional requests")
}

main()
  .then(seedSecondUser)
  .catch(console.error)
  .finally(() => db.$disconnect())
