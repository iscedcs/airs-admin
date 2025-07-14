"use client"

import type React from "react"

import { useState, useEffect, useTransition } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Search,
  Loader2,
  CheckCircle2,
  XCircle,
  User,
  Calendar,
  Hash,
  Sparkles,
  AlertTriangle,
  Printer,
  Shield,
  Clock,
  FileText,
  CreditCard,
  Truck,
} from "lucide-react"
import { checkPaymentStatus } from "@/actions/check-payment"

interface PaymentStatus {
  tcode: string
  amount: string
  paymentReference: string
  revenueName: string
  paymentDate: string
  customerName: string
  revenueCode: string
  // Additional fields from backend
  paymentType?: string
  transactionCategory?: string
  transactionStatus?: string
  currency?: string
}

type State = {
  data?: PaymentStatus
  error?: string
} | null

export default function PaymentStatusPage() {
  const [state, setState] = useState<State>(null)
  const [showModal, setShowModal] = useState(false)
  const [reference, setReference] = useState("")
  const [isPending, startTransition] = useTransition()

  // Show modal when we get results
  useEffect(() => {
    if (state && (state.data || state.error)) {
      setShowModal(true)
    }
  }, [state])

  const formatAmount = (amt: string, currency?: string) => {
    const currencyCode = currency === "NGR" ? "NGN" : currency || "NGN"
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: currencyCode,
    }).format(Number.parseFloat(amt))
  }

  const formatDate = (date: string) =>
    new Date(date).toLocaleString("en-NG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const ref = formData.get("reference") as string
    setReference(ref)

    startTransition(async () => {
      try {
        const result = await checkPaymentStatus(null, formData)
        setState(result)
      } catch (error) {
        setState({ error: "An unexpected error occurred. Please try again." })
      }
    })
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  const handleTryAgain = () => {
    setShowModal(false)
    setReference("")
    setState(null)
    // Clear the form
    const form = document.querySelector("form") as HTMLFormElement
    if (form) {
      form.reset()
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <>
      {/* SEO-optimized main content */}
      <main className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-primary/5 p-4">
        <div className="max-w-md mx-auto pt-8">
          {/* Animated Header with SEO content */}
          <motion.header
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <motion.div
              className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
              role="img"
              aria-label="Transpay Payment Status Checker Logo"
            >
              <Sparkles className="w-10 h-10 text-primary-foreground" />
            </motion.div>
            <motion.h1
              className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent mb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Payment Status Checker
            </motion.h1>
            <motion.p
              className="text-muted-foreground text-sm mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Transpay - Commercial Vehicle Operations Fee
            </motion.p>
            <motion.p
              className="text-xs text-muted-foreground max-w-sm mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              Instantly verify your payment status, view transaction details, and print official receipts for Anambra
              State commercial vehicle operations fees.
            </motion.p>
          </motion.header>

          {/* Features Section for SEO */}
          <motion.section
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            aria-labelledby="features-heading"
          >
            <h2 id="features-heading" className="sr-only">
              Key Features
            </h2>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground">Instant Results</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground">Secure Verification</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground">Print Receipts</p>
              </div>
            </div>
          </motion.section>

          {/* Main Form Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
            aria-labelledby="payment-form-heading"
          >
            <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle id="payment-form-heading" className="text-xl flex items-center gap-2">
                  <Search className="w-5 h-5 text-primary" />
                  Check Payment Status
                </CardTitle>
                <CardDescription>
                  Enter your payment reference number to verify your commercial vehicle operations fee payment status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6" role="search">
                  <motion.div
                    className="space-y-2"
                    whileFocus={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Label htmlFor="reference" className="text-sm font-medium">
                      Payment Reference Number
                    </Label>
                    <Input
                      name="reference"
                      id="reference"
                      type="text"
                      placeholder="FMA|Web|3FMA0001|ANIGR|240625234249|..."
                      disabled={isPending}
                      className="h-12 text-sm transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      required
                      aria-describedby="reference-help"
                      autoComplete="off"
                    />
                    <p id="reference-help" className="text-xs text-muted-foreground">
                      Enter the complete payment reference as provided during your transaction
                    </p>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: isPending ? 1 : 1.02 }}
                    whileTap={{ scale: isPending ? 1 : 0.98 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Button
                      type="submit"
                      className="w-full h-12 text-base font-medium shadow-lg"
                      disabled={isPending}
                      aria-describedby="submit-help"
                    >
                      <AnimatePresence mode="wait">
                        {isPending ? (
                          <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2"
                          >
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                            >
                              <Loader2 className="w-4 h-4" />
                            </motion.div>
                            Verifying Payment...
                          </motion.div>
                        ) : (
                          <motion.div
                            key="search"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2"
                          >
                            <Search className="w-4 h-4" />
                            Check Payment Status
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Button>
                    <p id="submit-help" className="text-xs text-muted-foreground mt-2 text-center">
                      Click to verify your payment and view transaction details
                    </p>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.section>

          {/* Footer with SEO content */}
          <motion.footer
            className="text-center mt-8 text-xs text-muted-foreground print:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <p className="font-medium">Powered by Transpay Payment Solutions</p>
            <p>Official payment verification system for Anambra State</p>
            <p className="mt-2">Secure • Fast • Reliable</p>
          </motion.footer>

          {/* Results Modal */}
          <Dialog open={showModal} onOpenChange={setShowModal}>
            <DialogContent className="max-w-sm mx-auto border-0 shadow-2xl print:shadow-none print:border print:max-w-full print:m-0">
              <DialogDescription className="sr-only">
                {state?.data ? "Payment status found successfully" : "Payment status check failed"}
              </DialogDescription>
              <AnimatePresence mode="wait">
                {state?.data ? (
                  <SuccessModal
                    key="success"
                    data={state.data}
                    reference={reference}
                    formatAmount={formatAmount}
                    formatDate={formatDate}
                    onClose={handleCloseModal}
                    onPrint={handlePrint}
                  />
                ) : state?.error ? (
                  <ErrorModal
                    key="error"
                    error={state.error}
                    reference={reference}
                    onClose={handleCloseModal}
                    onTryAgain={handleTryAgain}
                  />
                ) : null}
              </AnimatePresence>
            </DialogContent>
          </Dialog>
        </div>

        {/* Print Styles */}
        <style jsx global>{`
          @media print {
            body {
              background: white !important;
            }
            .print\\:hidden {
              display: none !important;
            }
            .print\\:block {
              display: block !important;
            }
            .print\\:shadow-none {
              box-shadow: none !important;
            }
            .print\\:border {
              border: 1px solid #000 !important;
            }
            .print\\:max-w-full {
              max-width: 100% !important;
            }
            .print\\:m-0 {
              margin: 0 !important;
            }
            .print\\:p-4 {
              padding: 1rem !important;
            }
            .print\\:text-black {
              color: black !important;
            }
            .print\\:bg-white {
              background-color: white !important;
            }
            .print\\:border-black {
              border-color: black !important;
            }
          }
        `}</style>
      </main>

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Payment Status Checker",
            description: "Check your commercial vehicle operations fee payment status with Transpay",
            url: "https://transpay-status.vercel.app",
            mainEntity: {
              "@type": "WebApplication",
              name: "Transpay Payment Status Checker",
              applicationCategory: "FinanceApplication",
              operatingSystem: "Any",
              browserRequirements: "Requires JavaScript. Requires HTML5.",
              softwareVersion: "1.0",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "NGN",
              },
            },
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: "https://transpay-status.vercel.app",
                },
              ],
            },
          }),
        }}
      />
    </>
  )
}

// Enhanced Success Modal Component with additional backend data
function SuccessModal({
  data,
  reference,
  formatAmount,
  formatDate,
  onClose,
  onPrint,
}: {
  data: PaymentStatus
  reference: string
  formatAmount: (amt: string, currency?: string) => string
  formatDate: (date: string) => string
  onClose: () => void
  onPrint: () => void
}) {
  const getPaymentTypeIcon = (type?: string) => {
    switch (type) {
      case "CVOF":
        return <Truck className="w-4 h-4" />
      default:
        return <CreditCard className="w-4 h-4" />
    }
  }

  const getStatusBadgeVariant = (status?: string) => {
    switch (status?.toUpperCase()) {
      case "SUCCESSFUL":
        return "default"
      case "PENDING":
        return "secondary"
      case "FAILED":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="print:p-4 print:bg-white print:text-black"
    >
      {/* Print Header - Only visible when printing */}
      <div className="hidden print:block print:text-center print:mb-6">
        <h1 className="text-2xl font-bold print:text-black">TRANSPAY</h1>
        <p className="text-sm print:text-black">Payment Receipt</p>
        <p className="text-xs print:text-black">Commercial Vehicle Operations Fee</p>
        <div className="border-t border-b border-black my-2 py-1">
          <p className="text-xs print:text-black">Generated on: {new Date().toLocaleString("en-NG")}</p>
        </div>
      </div>

      <DialogHeader className="text-center pb-4 print:hidden">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
          className="mx-auto mb-4"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 400 }}
            >
              <CheckCircle2 className="w-8 h-8 text-white" />
            </motion.div>
          </div>
        </motion.div>
        <DialogTitle className="text-center text-xl text-green-700">Payment Verified Successfully!</DialogTitle>
      </DialogHeader>

      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        {/* Amount - Featured */}
        <div className="text-center py-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 print:bg-white print:border-black">
          <p className="text-sm text-green-700 font-medium mb-1 print:text-black">Amount Paid</p>
          <p className="text-2xl font-bold text-green-800 print:text-black">
            {formatAmount(data.amount, data.currency)}
          </p>
          {data.transactionStatus && (
            <Badge
              variant={getStatusBadgeVariant(data.transactionStatus)}
              className="mt-2 print:bg-white print:border-black print:text-black"
            >
              {data.transactionStatus}
            </Badge>
          )}
        </div>

        <Separator className="print:border-black" />

        {/* Payment Details */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <User className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0 print:text-black" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground print:text-black">Customer</p>
              <p className="text-sm text-muted-foreground break-words print:text-black">{data.customerName}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0 print:text-black" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground print:text-black">Payment Date</p>
              <p className="text-sm text-muted-foreground print:text-black">{formatDate(data.paymentDate)}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Hash className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0 print:text-black" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground print:text-black">Transaction Code</p>
              <Badge
                variant="secondary"
                className="font-mono text-xs print:bg-white print:border-black print:text-black"
              >
                {data.tcode}
              </Badge>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Hash className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0 print:text-black" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground print:text-black">Payment Reference</p>
              <Badge
                variant="outline"
                className="font-mono text-xs break-all print:bg-white print:border-black print:text-black"
              >
                {data.paymentReference}
              </Badge>
            </div>
          </div>

          {/* Additional fields from backend */}
          {data.paymentType && (
            <div className="flex items-start gap-3">
              {getPaymentTypeIcon(data.paymentType)}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground print:text-black">Payment Type</p>
                <p className="text-sm text-muted-foreground print:text-black">{data.paymentType}</p>
              </div>
            </div>
          )}

          {data.transactionCategory && (
            <div className="flex items-start gap-3">
              <Truck className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0 print:text-black" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground print:text-black">Vehicle Category</p>
                <p className="text-sm text-muted-foreground print:text-black capitalize">
                  {data.transactionCategory.toLowerCase()}
                </p>
              </div>
            </div>
          )}
        </div>

        <Separator className="print:border-black" />

        {/* Revenue Info */}
        <div className="bg-muted/50 rounded-lg p-3 print:bg-white print:border print:border-black">
          <p className="text-sm font-medium text-foreground mb-2 print:text-black">Revenue Details</p>
          <p className="text-sm text-muted-foreground mb-1 print:text-black">{data.revenueName}</p>
          <Badge variant="outline" className="text-xs font-mono print:bg-white print:border-black print:text-black">
            {data.revenueCode}
          </Badge>
        </div>

        {/* Print Footer - Only visible when printing */}
        <div className="hidden print:block print:text-center print:mt-8 print:pt-4 print:border-t print:border-black">
          <p className="text-xs print:text-black">This is an official payment receipt from Transpay</p>
          <p className="text-xs print:text-black">For inquiries, contact Transpay support</p>
          <div className="mt-2">
            <p className="text-xs print:text-black font-mono">
              Receipt ID: TPY-{data.tcode}-{Date.now()}
            </p>
          </div>
        </div>

        {/* Action Buttons - Hidden when printing */}
        <motion.div
          className="flex gap-2 pt-2 print:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Button onClick={onPrint} variant="outline" className="flex-1" size="sm">
            <Printer className="w-4 h-4 mr-2" />
            Print Receipt
          </Button>
          <Button onClick={onClose} className="flex-1" size="sm">
            Done
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

// Error Modal Component (unchanged)
function ErrorModal({
  error,
  reference,
  onClose,
  onTryAgain,
}: {
  error: string
  reference: string
  onClose: () => void
  onTryAgain: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <DialogHeader className="text-center pb-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
          className="mx-auto mb-4"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-destructive-foreground to-red-600 rounded-full flex items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 400 }}
            >
              <XCircle className="w-8 h-8 text-white" />
            </motion.div>
          </div>
        </motion.div>
        <DialogTitle className="text-center text-xl text-destructive-foreground">Payment Not Found</DialogTitle>
      </DialogHeader>

      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <div className="bg-destructive-foreground/5 border border-destructive-foreground/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-destructive-foreground flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-destructive-foreground mb-1">Error Details</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </div>
        </div>

        {reference && (
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-sm font-medium text-foreground mb-1">Reference Searched</p>
            <Badge variant="outline" className="font-mono text-xs break-all">
              {reference}
            </Badge>
          </div>
        )}

        <div className="text-center text-sm text-muted-foreground">
          <p>Please verify your payment reference and try again</p>
        </div>

        {/* Action Buttons */}
        <motion.div
          className="flex gap-2 pt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Button onClick={onClose} variant="outline" className="flex-1">
            Close
          </Button>
          <Button onClick={onTryAgain} className="flex-1">
            Try Again
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
