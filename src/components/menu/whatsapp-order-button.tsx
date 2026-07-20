"use client";

import { useState } from "react";
import { MessageCircle, X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

interface CartItem {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
}

interface WhatsAppOrderButtonProps {
  cart: CartItem[];
  whatsapp: string;
  restaurantName: string;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function WhatsAppOrderButton({
  cart,
  whatsapp,
  restaurantName,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: WhatsAppOrderButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const buildWhatsAppMessage = () => {
    let message = `Hola, me gustaría hacer un pedido de *${restaurantName}*:\n\n`;

    cart.forEach((item, index) => {
      message += `${index + 1}. *${item.name}*\n   Cantidad: ${item.quantity} x ${formatPrice(item.price)} = ${formatPrice(item.price * item.quantity)}\n`;
    });

    message += `\nTotal: *${formatPrice(totalPrice)}*\n\nGracias!`;
    return encodeURIComponent(message);
  };

  const handleSendOrder = () => {
    const message = buildWhatsAppMessage();
    window.open(`https://wa.me/${whatsapp}?text=${message}`, "_blank");
  };

  return (
    <>
      {/* Cart summary overlay */}
      {isExpanded && (
        <div className="fixed inset-0 z-[60] bg-black/40" onClick={() => setIsExpanded(false)}>
          <div
            className="absolute bottom-0 left-0 right-0 bg-background rounded-t-2xl shadow-2xl max-h-[70vh] flex flex-col animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cart header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Tu Pedido</h3>
                <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                  {totalItems} {totalItems === 1 ? "item" : "items"}
                </span>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1 hover:bg-muted rounded-full"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Cart items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.map((item) => (
                <div
                  key={item.itemId}
                  className="flex items-center gap-3 p-3 rounded-lg border bg-card"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatPrice(item.price)} c/u
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onUpdateQuantity(item.itemId, item.quantity - 1)}
                      className="w-7 h-7 flex items-center justify-center rounded-full border hover:bg-muted transition-colors"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="text-sm font-semibold w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.itemId, item.quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center rounded-full border hover:bg-muted transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <p className="text-sm font-semibold w-20 text-right">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                  <button
                    onClick={() => onRemoveItem(item.itemId)}
                    className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Cart footer */}
            <div className="border-t p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="text-lg font-bold">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={onClearCart}
                  className="flex-1 py-3 rounded-xl border text-sm font-medium hover:bg-muted transition-colors"
                >
                  Vaciar
                </button>
                <button
                  onClick={handleSendOrder}
                  className="flex-[2] py-3 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors active:scale-[0.98] touch-manipulation"
                >
                  <MessageCircle className="h-4 w-4" />
                  Enviar Pedido por WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setIsExpanded(true)}
        className="fixed bottom-4 left-4 z-50 flex items-center gap-2 pl-4 pr-3 py-3 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white shadow-lg hover:shadow-xl transition-all active:scale-[0.96] touch-manipulation"
        aria-label="Ver pedido"
      >
        <ShoppingBag className="h-5 w-5" />
        <span className="text-sm font-semibold">{totalItems}</span>
        <span className="text-sm">{formatPrice(totalPrice)}</span>
      </button>
    </>
  );
}
