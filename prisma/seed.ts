import "dotenv/config"
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
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect())
