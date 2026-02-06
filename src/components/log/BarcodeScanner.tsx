'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Camera, Loader2, AlertCircle, Check } from 'lucide-react'
import { Html5Qrcode } from 'html5-qrcode'
import { Button } from '@/components/ui/Button'
import { searchByBarcode, SearchFood } from '@/services/foodApi'
import { cn } from '@/lib/utils'

interface BarcodeScannerProps {
  isOpen: boolean
  onClose: () => void
  onFoodFound: (food: SearchFood) => void
}

type ScanState = 'scanning' | 'loading' | 'found' | 'not_found' | 'error'

export function BarcodeScanner({ isOpen, onClose, onFoodFound }: BarcodeScannerProps) {
  const [scanState, setScanState] = useState<ScanState>('scanning')
  const [scannedCode, setScannedCode] = useState<string | null>(null)
  const [foundFood, setFoundFood] = useState<SearchFood | null>(null)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    let mounted = true

    const startScanner = async () => {
      try {
        // Wait for DOM to be ready
        await new Promise(resolve => setTimeout(resolve, 100))

        if (!mounted) return

        const scanner = new Html5Qrcode('barcode-reader')
        scannerRef.current = scanner

        await scanner.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 250, height: 150 },
            aspectRatio: 1.777,
          },
          async (decodedText) => {
            // Barcode detected
            if (scanState !== 'scanning') return

            setScannedCode(decodedText)
            setScanState('loading')

            // Stop scanner while looking up
            try {
              await scanner.stop()
            } catch (e) {
              // Ignore stop errors
            }

            // Look up the barcode
            const food = await searchByBarcode(decodedText)

            if (!mounted) return

            if (food) {
              setFoundFood(food)
              setScanState('found')
            } else {
              setScanState('not_found')
            }
          },
          () => {
            // Ignore scan errors (no barcode in frame)
          }
        )
      } catch (err: any) {
        console.error('Scanner error:', err)
        if (mounted) {
          setErrorMessage(err?.message || 'Could not access camera')
          setScanState('error')
        }
      }
    }

    startScanner()

    return () => {
      mounted = false
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {})
        scannerRef.current = null
      }
    }
  }, [isOpen])

  const handleClose = () => {
    if (scannerRef.current) {
      scannerRef.current.stop().catch(() => {})
      scannerRef.current = null
    }
    setScanState('scanning')
    setScannedCode(null)
    setFoundFood(null)
    setErrorMessage('')
    onClose()
  }

  const handleAddFood = () => {
    if (foundFood) {
      onFoodFound(foundFood)
      handleClose()
    }
  }

  const handleRetry = async () => {
    setScanState('scanning')
    setScannedCode(null)
    setFoundFood(null)

    // Restart scanner
    try {
      const scanner = new Html5Qrcode('barcode-reader')
      scannerRef.current = scanner

      await scanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 150 },
          aspectRatio: 1.777,
        },
        async (decodedText) => {
          if (scanState !== 'scanning') return

          setScannedCode(decodedText)
          setScanState('loading')

          try {
            await scanner.stop()
          } catch (e) {}

          const food = await searchByBarcode(decodedText)

          if (food) {
            setFoundFood(food)
            setScanState('found')
          } else {
            setScanState('not_found')
          }
        },
        () => {}
      )
    } catch (err) {
      console.error('Retry error:', err)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/80 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Scanner Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex flex-col"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-black/50 backdrop-blur">
              <h2 className="text-white font-semibold">Scan Barcode</h2>
              <button
                onClick={handleClose}
                className="p-2 text-white/80 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Scanner Area */}
            <div className="flex-1 flex flex-col items-center justify-center p-4">
              {scanState === 'scanning' && (
                <>
                  <div
                    id="barcode-reader"
                    ref={containerRef}
                    className="w-full max-w-md rounded-2xl overflow-hidden"
                  />
                  <p className="text-white/60 text-sm mt-4 text-center">
                    Point your camera at a barcode
                  </p>
                </>
              )}

              {scanState === 'loading' && (
                <div className="text-center">
                  <Loader2 className="w-12 h-12 text-sage-400 animate-spin mx-auto mb-4" />
                  <p className="text-white font-medium">Looking up barcode...</p>
                  <p className="text-white/60 text-sm mt-1">{scannedCode}</p>
                </div>
              )}

              {scanState === 'found' && foundFood && (
                <motion.div
                  className="w-full max-w-sm bg-white rounded-2xl p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center">
                      <Check className="w-6 h-6 text-sage-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-charcoal">Found it!</p>
                      <p className="text-xs text-gray-400">{scannedCode}</p>
                    </div>
                  </div>

                  <div className="bg-sage-50 rounded-xl p-4 mb-4">
                    <h3 className="font-medium text-charcoal mb-1">{foundFood.name}</h3>
                    <p className="text-xs text-gray-500 mb-3">{foundFood.brand}</p>

                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div>
                        <p className="text-lg font-semibold text-sage-600">{foundFood.calories}</p>
                        <p className="text-[10px] text-gray-400">cal</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-charcoal">{foundFood.protein}g</p>
                        <p className="text-[10px] text-gray-400">protein</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-charcoal">{foundFood.carbs}g</p>
                        <p className="text-[10px] text-gray-400">carbs</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-charcoal">{foundFood.fat}g</p>
                        <p className="text-[10px] text-gray-400">fat</p>
                      </div>
                    </div>

                    <p className="text-xs text-gray-400 mt-2 text-center">
                      Per {foundFood.servingSize} {foundFood.servingUnit}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="ghost" className="flex-1" onClick={handleRetry}>
                      Scan Again
                    </Button>
                    <Button className="flex-1" onClick={handleAddFood}>
                      Add Food
                    </Button>
                  </div>
                </motion.div>
              )}

              {scanState === 'not_found' && (
                <motion.div
                  className="w-full max-w-sm bg-white rounded-2xl p-6 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-6 h-6 text-amber-600" />
                  </div>
                  <h3 className="font-semibold text-charcoal mb-1">Product Not Found</h3>
                  <p className="text-sm text-gray-500 mb-2">
                    Barcode: {scannedCode}
                  </p>
                  <p className="text-xs text-gray-400 mb-4">
                    This product wasn't found in our databases. Try searching by name instead.
                  </p>
                  <div className="flex gap-3">
                    <Button variant="ghost" className="flex-1" onClick={handleClose}>
                      Search Instead
                    </Button>
                    <Button className="flex-1" onClick={handleRetry}>
                      Scan Again
                    </Button>
                  </div>
                </motion.div>
              )}

              {scanState === 'error' && (
                <motion.div
                  className="w-full max-w-sm bg-white rounded-2xl p-6 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="w-12 h-12 bg-terracotta-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Camera className="w-6 h-6 text-terracotta-600" />
                  </div>
                  <h3 className="font-semibold text-charcoal mb-1">Camera Access Required</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {errorMessage || 'Please allow camera access to scan barcodes.'}
                  </p>
                  <Button onClick={handleClose}>
                    Close
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
