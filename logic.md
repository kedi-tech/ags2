# AGSS — Application Logic

## Routes

| Path | Purpose |
|------|---------|
| `/` | Landing page: hero carousel, categories, promotions, new arrivals |
| `/produit/:id` | Product details: images, variants, pricing, bundle offers |
| `/panier` | Shopping cart: item management, order summary |
| `/paiement` | Checkout: delivery info, payment method, promo codes |
| `/confirmation` | Order confirmation with delivery timeline |
| `/paiement-echoue` | Payment failure notification |
| `/compte` | User dashboard: orders, addresses, wishlist, settings |
| `/souhaits` | Saved items management |
| `/categorie/:slug` | Category products with filtering and sorting |
| `/categories` | All categories grid |
| `/legal/:slug` | Legal pages |

---

## Authentication

- **Register:** submit name, email, password, phone, address, type → receive token → auto-login
- **Login:** submit email + password → receive token + client profile → store in localStorage
- **Auto-login on app load:** if token exists in localStorage but profile is missing → fetch profile; if fetch fails → logout
- **Token storage:** `localStorage` key `auth` as `{ token, client }`
- **Logout:** clear `auth` and legacy `client` keys from localStorage
- **Guard:** checkout page requires authentication — if no token → alert + redirect to `/compte`

---

## Cart

- Adding same product increments its quantity instead of creating a duplicate entry
- Adjusting quantity to 0 removes the item entirely
- `clearCart()` is called after a successful order
- Cart is **not persisted** — lost on page refresh
- Adding an item shows a toast notification with the product name

---

## Wishlist

- Toggle per product: add if not present, remove if already present (matched by ID)
- Prevents duplicate entries
- **Not persisted** — lost on page refresh

---

## Product Browsing (Home Page)

- **New arrivals:** all products sorted by creation date descending, limited to 5
- **Promotional items:** products where `isPromotional === true` and `promotionalPrice` is set, limited to 2
- **Category icons:** mapped from the `icon` field returned by the API
- Hero section: auto-play carousel with manual prev/next navigation

---

## Product Detail

- Colors and sizes come from the API as comma-separated strings — split and trimmed for display
- First color and first size are auto-selected on load
- Variant string sent with the order: `"Color / Size"` (e.g., `"Rouge / M"`)
- **Bundle (Frequently Bought Together):** checkboxes let the user include related products; all selected items are added to cart together
- "Add to Cart" → adds item → navigates to `/panier`
- "Buy Now" → adds item → navigates to `/paiement`
- Discount % displayed as: `Math.round((1 - promotionalPrice / originalPrice) * 100)`

---

## Checkout Flow

1. **Delivery info:** user fills in name, phone, address, city, state, postal code and selects a shipping method
2. **Payment method:** user selects `cash`, `mobile`, or `card`
3. **Review:** user can apply a promo code before confirming

### Promo Code Logic
- Calls the validation API with the code and current subtotal
- Discount types:
  - `PERCENTAGE` — multiply subtotal by `(1 - rate)`
  - `FIXED` — subtract fixed amount from subtotal
- Validation times out after **10 seconds**; shows a friendly error if it does

### Order Submission

**Cash on delivery:**
```
createOrder() → clearCart() → navigate /confirmation
```

**Mobile money / card:**
```
createOrder()
  → generatePaymentLink()        (generates external provider URL + paymentId)
  → window.open(url)             (opens payment in new tab)
  → poll getPaymentStatus() every 5 seconds
      "SUCCESS"  → clearCart() → navigate /confirmation
      "FAILED"   → navigate /paiement-echoue
      other      → keep polling
```

**User cancels during payment wait:**
```
cancelOrder() → show cancellation confirmation
```

---

## Order Confirmation

- Reads order data from navigation state passed by the checkout page
- Displays order items, totals, and a 4-step delivery timeline (Commandée → En traitement → Expédiée → Livrée)
- If user is not logged in: shows a CTA to create an account
- Loads 4 product recommendations, excluding items already in the order

---

## User Account

- **Address:** editable via textarea; saved with `updateClientInfos()` API; profile updated locally on success
- **Order history:** displays orders with status badges
  - pending → amber, paid → blue, cancelled → red, delivered → green
- **Wishlist preview:** shows saved items
- **Settings:** logout button

---

## Pricing Rules

- Products can have a regular `price`, a `promotionalPrice` (sale), and an `originalPrice` (for crossed-out display)
- All prices are in **GNF (Guinean Franc)**, formatted with French locale (space thousands separator)
- Promo discount is applied to the subtotal before shipping is added

---

## Error Handling

| Scenario | Behaviour |
|----------|-----------|
| Invalid / expired token on load | Auto-logout |
| Checkout without being logged in | Alert + redirect to `/compte` |
| Order creation failure | Alert modal with error message |
| Promo code validation timeout | Show user-friendly timeout message |
| Payment polling error | Log to console; keep retrying |
| Payment fails | Redirect to `/paiement-echoue` |
