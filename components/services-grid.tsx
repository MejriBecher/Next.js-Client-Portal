import type { Service } from "@/lib/generated/prisma/client"

export function ServicesGrid({ services }: { services: Service[] }) {
  return (
    <section id="services" className="px-8 pb-24 max-w-6xl mx-auto">
      <h2 className="text-2xl font-light text-dark mb-8 text-center">
        Our Services
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            className="rounded-lg border border-border bg-surface-alpha p-6 flex flex-col gap-3 transition-shadow hover:shadow-sm"
          >
            <span className="text-2xl" role="img" aria-hidden="true">
              {service.icon}
            </span>
            <h3 className="text-lg font-medium text-dark">
              {service.name}
            </h3>
            <p className="text-sm text-dark-60 leading-relaxed">
              {service.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
