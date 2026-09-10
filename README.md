# FÄRD — Shopify launch experiment

Created 10 September 2026 for Kristoffer. Swedish travel brand; compression packing cubes, planned three-piece terracotta set. Positioning: “Mindre packkaos. Mer resa.” Proposed test price: 399 SEK. Product and pricing are commercial hypotheses, not validated demand or supplier quotations.

## Installed Shopify resources

- Store: https://admin.shopify.com/store/j398ub-e1
- Draft theme: https://admin.shopify.com/store/j398ub-e1/themes/201188540763/editor
- Product: https://admin.shopify.com/store/j398ub-e1/products/10704314564955
- Theme role: UNPUBLISHED. Original Horizon theme preserved.
- Product variant: 54021381161307. Tracked inventory, no stock, overselling denied.
- Store currency confirmed SEK; no products existed before this experiment.
- Public storefront is password protected. Publishing and checkout setup are not complete.

## What is built

Original responsive homepage, product page, native product form, cart quantity updates/removal and checkout button, contact form, collection page, generic pages, 404 and branded password page. Swedish copy, accessible labels and focus states, native FAQ disclosure controls, image alt text and product structured data. No fabricated reviews, discounts, stock, performance percentages or shipping promises.

Theme is a self-contained custom Liquid theme installed over a duplicated Horizon draft. Repository contains the new custom theme only, on its own branch; the old branch was not changed. Shopify still retains unused inherited Horizon files in the duplicate, but the custom templates do not reference them.

## Product images

AI-generated concept images, NOT photographs of a verified supplier SKU. Inspect a sample and match or replace the images before selling.

- https://cdn.shopify.com/s/files/1/1035/7964/8347/files/fard-hero.png?v=1789022565
- https://cdn.shopify.com/s/files/1/1035/7964/8347/files/fard-lifestyle.png?v=1789023137

Images are stored in Shopify Files and associated with the product. Homepage references them through image-picker settings. On a different store, upload these images and choose them in the theme editor.

## Launch gates — must be completed before taking payments

1. Supplier: select a specific three-piece compression-cube SKU, order a sample, confirm actual material, dimensions, zipper construction, colour, branding rights, landed cost, delivery, returns and applicable product documentation. No supplier has been contracted, paid or connected.
2. Brand: FÄRD is a working name. No trademark clearance or domain registration has been completed.
3. Business: add the real seller identity, contact details, business address and return address. Replace the prelaunch information pages with complete approved policies and configure Shopify's checkout policy settings. Current pages explicitly state that orders are not open; they are not final legal policies.
4. Payments and shipping: configure and verify Shopify Payments/payment provider, tax treatment, Sweden market and shipping rates. Digital-wallet list was empty; this does not establish the status of every payment method. Do not claim that payments are verified.
5. Product: confirm the price, replace concept descriptions with verified specifications, activate real inventory at the fulfillment location and verify delivery costs.
6. Theme editor: product template has `enable_sales` false. Enable it only when ready. Then revise the static coming-soon announcement, planned-price wording and launch FAQ in the locale files. The native purchase form also requires the variant to be available.
7. QA: unlock the storefront through its normal password flow and run a full test order, confirmation email, fulfillment and refund/return exercise using the payment provider's test mode. No real test charge has been made.
8. Publish the FÄRD draft in Shopify Admin and remove storefront password when launch gates are met. The connected Shopify tool does not permit theme publishing.

## Validation completed and limits

- Shopify accepted all installed custom Liquid/JSON files after dependency-ordered uploads.
- Focused local Shopify theme-check validation: Liquid/HTML and JSON syntax, template references, image dimensions, translation keys, required layout objects, HTML nesting, HTML translations and section IDs. No errors in final run (see conversation for exact result).
- Shopify's actual password page was visually inspected and its translation escaping fixed.
- Full customer-path and mobile browser QA remain incomplete because the storefront password blocks access and the cloud browser rejects local-file preview URLs. Local preview rejection was not bypassed.
- Standard skill validator was attempted; its telemetry-enabled run was rejected by automatic review. Retried with the documented telemetry opt-out, but network-backed documentation loading failed. Used local checks without telemetry instead. No claim of a full standard validator pass.

## Commercial test hypothesis

At 399 SEK, assuming 25% VAT solely for planning, net revenue would be 319.20 SEK. Illustrative cost envelope: landed goods 90, delivery/packing 49, payment fees 12, returns reserve 15 = 166 SEK before advertising. This would leave 153.20 SEK before advertising and overhead. At 100 SEK acquisition cost, contribution would be 53.20 SEK, not net profit. All costs are placeholders to replace with actual quotes; VAT treatment needs confirmation. Do not purchase ads until the sample and end-to-end checkout are verified.

Start with Swedish creative showing pack → zip → unpack, and test “hitta allt direkt” against “mindre packkaos”. Track product views, add-to-cart, checkout initiation, completed purchases and contribution per order. No paid campaign or tracking app was installed.

Research leads, not endorsements or verified supplier agreements:
- https://www.travel-dude.com/ (existing compression-cube retail offers)
- https://eaglecreek.eu/ (established travel organiser category)
- https://www.alibaba.com/ (wholesale sourcing lead; exact SKU and economics not verified)

## Maintenance

All Swedish storefront strings are under `fard` in locales/sv.json and locales/en.default.json. HTML-bearing translations use `_html` keys. Most page layout is in sections/fard-*.liquid. Global styles are in the fard-header section. Native Shopify checkout is outside the theme.
