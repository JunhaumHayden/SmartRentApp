import { PropertyForm } from "@/components/property-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function EstimatorPage() {
  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="border-b border-border bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Link>
            </Button>
            <div className="text-sm text-muted-foreground">Estimador de Aluguel</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Estime o Valor do Seu Imóvel</h1>
            <p className="text-lg text-muted-foreground">
              Preencha as informações abaixo para receber uma estimativa precisa baseada em dados reais do mercado
            </p>
          </div>

          <PropertyForm />
        </div>
      </main>
    </div>
  )
}
