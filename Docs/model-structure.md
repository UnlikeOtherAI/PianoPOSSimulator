# Piano POS Simulator Model Structure

This document summarizes the OpenAPI model shapes defined in `Docs/piano.api.json`.

## Overview

- Schemas are grouped by auth, pairing, orders, inventory, and documents.
- Collection wrappers: `OrdersDto`, `DocumentsDto`, `PairingResponseDto`.
- Event metadata (`EventDetailDto`) is reused across orders, order items, and payments.

## Auth Models

### TokenRequestDto

- required: `grant_type`, `client_id`, `client_secret`
- optional: `code`, `redirect_uri`, `code_verifier`, `scope`, `refresh_token`
- notes: `grant_type` is typed as `object` in the OpenAPI spec (example is a string).

### TokenResponseDto

- required: `access_token`, `token_type`, `expires_in`
- optional: `refresh_token`, `scope`

### LoginDto

- optional: `clientId`, `clientSecret`, `email`, `token`, `password`
- notes: multiple auth styles are implied (client credentials vs email/password vs token).

### LoginResponseDto

- required: `access_token`

### WhoAmIResponseDto

- required: `accountId`, `type`, `tenantPermissions`, `establishmentPermissions`
- optional: `email`
- enums: `type` is `USER` or `APPLICATION`
- notes: `tenantPermissions` and `establishmentPermissions` are free-form objects.

## Pairing Models

### EstablishmentAddressDto

- optional: `street`, `number`, `zip`, `city`, `district`, `region`, `country`

### EstablishmentDto

- required: `sourceId`, `name`
- optional: `address` (EstablishmentAddressDto)

### PairingRequestDto

- required: `email`, `pin`, `sourceSystem`, `establishments`
- `establishments`: array of EstablishmentDto

### EstablishmentCredentialsDto

- required: `sourceId`, `clientId`, `clientSecret`

### PairingResponseDto

- required: `credentials`
- `credentials`: array of EstablishmentCredentialsDto

## Orders Models

### TableDto

- required: `key`
- optional: `name`, `areaKey`, `areaName`

### CustomerDto

- required: `type`
- optional: `id`, `customerNumber`, `name`, `email`, `phone`, `cardNumber`
- enums: `type` is `vip`, `regular`, `guest`, or `employee`

### EventDetailDto

- required: `timestamp`
- optional: `username`, `fullName`, `stationKey`, `stationName`

### OrderItemDto

- required: `id`, `name`, `quantity`, `unit`, `fiscalDate`, `created`
- optional: `productId`, `state`, `stockPrice`, `basePriceInclVat`, `netPrice`,
  `totalNetPrice`, `grossPrice`, `totalGrossPrice`, `vatRate`, `productionArea`,
  `categories`
- enums: `state` is `active`, `voided`, or `damaged`
- relationships: `created` is EventDetailDto
- `categories`: array of string

### PaymentDto

- required: `method`, `fiscalDate`, `amount`, `created`
- optional: `tipAmount`
- enums: `method` is `cash`, `card`, `invoice`, `customer_balance`, `qerko`,
  `meal_voucher`, `voucher`, `bank_transfer`, `hotel_account`, or `other`
- relationships: `created` is EventDetailDto

### OrderDto

- required: `globalId`, `status`, `created`
- optional: `fiscalDate`, `table`, `guestCount`, `currency`, `customer`, `items`,
  `payments`, `meta`, `closed`
- enums: `status` is `open`, `closed`, `voided`, or `replaced`
- relationships:
  - `table` is TableDto
  - `customer` is CustomerDto
  - `items` is array of OrderItemDto
  - `payments` is array of PaymentDto
  - `created` and `closed` are EventDetailDto
- `meta`: free-form object

### OrdersDto

- required: `orders`
- `orders`: array of OrderDto

## Inventory Models

### InventoryItemDto

- required: `name`
- optional: `amount`, `unit`, `unitPrice`, `alert`

### StorageDto

- required: `id`, `name`, `items`
- `items`: array of InventoryItemDto

### InventoryStateDto

- required: `storages`, `lastUpdated`
- `storages`: array of StorageDto
- `lastUpdated`: date-time string

## Document Models

### VendorDto

- required: `id`, `name`
- optional: `email`, `phone`

### DocumentDto

- required: `id`, `type`, `createdAt`
- optional: `name`, `origin`, `vendor`, `netAmount`, `grossAmount`, `currency`,
  `documentDate`, `meta`
- enums:
  - `type` is `invoice`, `delivery_note`, or `other`
  - `origin` is `received` or `issued`
- relationships: `vendor` is VendorDto
- `meta`: free-form object

### DocumentsDto

- required: `documents`
- `documents`: array of DocumentDto
