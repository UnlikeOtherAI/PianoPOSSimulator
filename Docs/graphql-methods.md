# Piano GraphQL Methods (Reference)

Source: https://api.piano.cz/graphql (reference)

Notes:
- Introspection requires `content-type: application/json` and `apollo-require-preflight: true`.
- Generated on 2026-01-07 12:34 UTC.

## Queries

Total: 53

- `activePairings(tenantUrn: String!)` → `[Pairing!]!`
- `applicationAccountsAdmin(limit: Float, offset: Float, search: String, tenantUrn: String!)` → `[ApplicationAccountResponse!]!`
- `documents(establishmentUrn: String!, types: [DocumentTypeEnum!])` → `DocumentsResponse!`
- `establishments` → `[EstablishmentResponse!]!`
- `establishmentsAdmin(tenantUrn: String!)` → `[EstablishmentResponse!]!`
- `expenseCategories(tenantUrn: String!)` → `ExpenseCategoriesResponse!`
- `findAllExpenses(establishmentId: String!, from: DateTime, to: DateTime)` → `ExpensesResponse!`
- `findAllStorages(establishmentId: String!)` → `StoragesResponse!`
- `findAllVendors(establishmentId: String!)` → `[VendorGql!]!`
- `findChat(chatUrn: String!)` → `Chat!`
- `findOneExpense(expenseId: String!)` → `ExpenseResponse!`
- `findOneStorage(storageId: String!)` → `StorageResponse!`
- `findSimilarProducts(input: FindSimilarProductsInput!)` → `FindSimilarProductsResult!`
- `findUserChats(establishmentUrn: String!, limit: Int, offset: Int)` → `[Chat!]!`
- `getAvailableTags` → `[AvailableTagType!]!`
- `getChatAssistant(id: String!)` → `ChatAssistantGql`
- `getChatAssistants` → `[ChatAssistantGql!]!`
- `getConfigByKey(input: GetConfigByKeyInput!)` → `ConfigType`
- `getConfigs(filter: ConfigFilterInput, pagination: PaginationInput)` → `[ConfigType!]!`
- `getEmailForToken(token: String!, tokenType: AccountTokenType!)` → `GetEmailForTokenResponse!`
- `getFoodcost(dateFrom: String!, dateTo: String!, establishmentUrn: String!)` → `FoodcostOverview!`
- `getInventoryItem(productType: ProductTypeEnum!, storageUrn: String!)` → `InventoryItemType`
- `getInventoryItems(storageUrn: String!)` → `[InventoryItemType!]!`
- `getInventoryProductStates(input: GetInventoryProductStatesInput!, tenantCode: String!)` → `[InventoryProductStateType!]!`
- `getInventoryProductTypes` → `[ProductTypeEnum!]!`
- `getMappingStatistics(establishmentUrn: String!)` → `MappingStatisticsResponse!`
- `getMappings(establishmentUrn: String!, limit: Float, offset: Float, status: String)` → `OrderItemRecipeMappingsResponse!`
- `getProduct(input: GetProductInput!)` → `ProductType!`
- `getProductPriceHistory(productId: String!)` → `[ProductPriceHistoryType!]!`
- `getProducts(input: GetProductsInput)` → `[ProductType!]!`
- `getPrompts(limit: Int, offset: Int, search: String, type: PromptType)` → `[PromptGql!]!`
- `getUnmappedItems(establishmentUrn: String!)` → `UnmappedItemsResponse!`
- `globalSoldItemsStatistics(input: GlobalSoldItemsStatisticsInput!)` → `[GlobalSoldItemsStatisticsResult!]!`
- `inventory(establishmentUrn: String!)` → `InventoryResponse!`
- `licensesAdmin` → `[LicenseType!]!`
- `oauth2Client(clientId: String!)` → `OAuthClientType!`
- `oauth2Clients` → `[OAuthClientType!]!`
- `order(id: String!)` → `OrderResponse!`
- `orderEvents(orderExternalId: String!, tenantCode: Int!)` → `[OrderEventType!]!`
- `orders(establishmentId: String!, from: DateTime, to: DateTime)` → `OrderOverviewResponse!`
- `purchasedLicensesAdmin` → `[PurchasedLicenseType!]!`
- `recipe(urn: String!, validOn: String)` → `RecipeGql!`
- `recipeCategories(establishmentUrn: String!)` → `[RecipeCategoryResponse!]!`
- `recipeModifier(urn: String!, validOn: String)` → `ParsedRecipeModifierGql`
- `recipeModifierVersion(urn: String!)` → `ParsedRecipeModifierVersionGql!`
- `recipeModifierVersions(recipeModifierUrn: String!, validFrom: String, validTo: String)` → `[ParsedRecipeModifierVersionGql!]!`
- `recipes(establishmentUrn: String!)` → `[RecipeGql!]!`
- `roles` → `[RoleResponse!]!`
- `salesStatistics(query: SalesStatisticsPayload!)` → `SalesStatisticsResult!`
- `tenants` → `[TenantType!]!`
- `tenantsAdmin` → `[TenantType!]!`
- `userAccountsAdmin(limit: Float, offset: Float, search: String, tenantUrn: String)` → `[UserAccountResponse!]!`
- `whoami` → `WhoAmIResponse!`

## Mutations

Total: 85

- `approveMapping(input: ApproveMappingInput!)` → `ApproveMappingResponse!`
- `assignPermission(permission: Permission!, roleId: String!)` → `RoleResponse!`
- `assignRoles(accountUrn: String!, establishmentUrn: String, roles: [String!]!, tenantUrn: String!)` → `AssignRolesResponse!`
- `cancelPairing(tenantUrn: String!)` → `Boolean!`
  Cancel a pairing process for a tenant
- `completeRegistration(input: CompleteRegistrationInput!, token: String!)` → `RegistrationCompletedResponse!`
  Complete the registration process - create the user in Firebase Auth, set the password and return an access token
- `createApplicationAccount(input: CreateApplicationAccountInput!)` → `CreateApplicationAccountResponse!`
  Create a new application account
- `createChat(input: CreateChatInput!)` → `CreateChatResponse!`
- `createChatAssistant(input: CreateChatAssistantInput!)` → `CreateChatAssistantResponse!`
- `createChatKitSession` → `CreateChatKitSessionResponse!`
- `createChatKitSessionForAdmin` → `CreateChatKitSessionResponse!`
- `createConfig(input: CreateConfigInput!)` → `ConfigType!`
- `createEstablishment(name: String!, tenantId: String!)` → `EstablishmentResponse!`
- `createExpense(input: CreateExpenseInput!)` → `CreateExpenseResponse!`
- `createExpenseCategory(input: CreateExpenseCategoryInput!)` → `CreateExpenseCategoryResponse!`
- `createExpenseItem(input: CreateExpenseItemInput!)` → `CreateExpenseItemResponse!`
- `createInventoryItem(input: CreateInventoryItemInput!)` → `CreateInventoryItemResponse!`
- `createLicense(input: CreateLicenseInput!)` → `CreateLicenseResponse!`
- `createOAuth2Client(input: CreateOAuth2ClientInput!)` → `OAuthClientType!`
- `createProductTag(input: CreateProductTagInput!)` → `CreateProductTagResponse!`
- `createPrompt(input: CreatePromptInput!)` → `CreatePromptResponse!`
- `createPurchase(input: CreatePurchaseInput!)` → `CreatePurchaseResponse!`
- `createRecipe(input: CreateRecipeInput!)` → `CreateRecipeResponse!`
- `createRecipeCategory(input: CreateRecipeCategoryInput!)` → `CreateRecipeCategoryResponse!`
- `createRecipeModifier(input: RecipeModifierInput!, recipeUrn: String!)` → `CreateRecipeModifierResponse!`
- `createRole(description: String!, name: String!)` → `RoleResponse!`
- `createStorage(input: CreateStorageInput!)` → `CreateStorageResponse!`
- `createTenant(input: CreateTenantInput!)` → `CreateTenantResponse!`
- `createUser(input: CreateUserAccountInput!, oauth: OAuthDataInputGql)` → `CreateUserResponse!`
  Create a new user and send them an invitation email. Language of the invitation email is derived from HTTP request headers
- `createVendor(input: CreateVendorInput!, tenantUrn: String!)` → `VendorGql!`
- `deactivatePurchasedLicense(purchasedLicenseUrn: String!)` → `DeactivatePurchasedLicenseResponse!`
- `deleteChatAssistant(input: DeleteChatAssistantInput!)` → `DeleteChatAssistantResponse!`
- `deleteConfig(urn: String!)` → `Boolean!`
- `deleteEstablishment(id: String!)` → `DeleteEstablishmentResponse!`
- `deleteExpense(id: String!)` → `DeleteExpenseResponse!`
- `deleteExpenseCategory(urn: String!)` → `DeleteExpenseCategoryResponse!`
- `deleteExpenseItem(id: String!)` → `DeleteExpenseItemResponse!`
- `deleteInventoryItem(urn: String!)` → `DeleteInventoryItemResponse!`
- `deleteLicense(input: DeleteLicenseInput!)` → `DeleteLicenseResponse!`
- `deleteOAuth2Client(clientId: String!)` → `Boolean!`
- `deleteProductTag(name: String!)` → `Boolean!`
- `deletePrompt(input: DeletePromptInput!)` → `DeletePromptResponse!`
- `deleteRecipe(urn: String!)` → `DeleteRecipeResponse!`
- `deleteRecipeCategory(urn: String!)` → `DeleteRecipeCategoryResponse!`
- `deleteRecipeModifier(urn: String!)` → `DeleteRecipeModifierResponse!`
- `deleteStorage(id: String!)` → `DeleteStorageResponse!`
- `deleteTenant(input: DeleteTenantInput!)` → `DeleteTenantResponse!`
- `deleteVendor(id: String!)` → `DeleteVendorResponse!`
- `initiatePairing(tenantUrn: String!)` → `Pairing!`
  Initiate a pairing process for a tenant
- `login(input: LoginInput!)` → `AuthResponse!`
- `matchOrderItemsToRecipes(input: MatchOrderItemsToRecipesInput!)` → `MatchOrderItemsToRecipesResponse!`
- `reactivatePurchasedLicense(purchasedLicenseUrn: String!, validUntil: DateTime!)` → `ReactivatePurchasedLicenseResponse!`
- `refreshStatistics(date: String, establishmentUrns: [String!]!)` → `RefreshStatisticsResponse!`
- `regenerateOAuth2ClientSecret(clientId: String!)` → `OAuthClientType!`
- `rejectMapping(input: RejectMappingInput!)` → `RejectMappingResponse!`
- `removeApplicationAccount(establishmentUrns: [String!], id: String!, tenantUrn: String!)` → `RemoveApplicationAccountResponse!`
  Remove an application account
- `removePermission(permission: Permission!, roleId: String!)` → `RoleResponse!`
- `removeRoleFromAccount(accountUrn: String!, establishmentUrn: String, roleUrn: String!, tenantUrn: String!)` → `RemoveRoleFromAccountResponse!`
- `removeUser(establishmentUrns: [String!], id: String!, tenantUrn: String)` → `RemoveUserAccountResponse!`
  Remove all (tenant) roles from a user account
- `repeatOrderEvent(input: RepeatOrderEventInput!)` → `RepeatOrderEventResponse!`
- `resetPassword(email: String!, oauth: OAuthDataInputGql)` → `PasswordResetResponse!`
- `sendMessage(input: SendMessageInput!)` → `SendMessageResponse!`
- `setActiveChatAssistant(input: SetActiveChatAssistantInput!)` → `SetActiveChatAssistantResponse!`
- `setProductTagActive(input: SetProductTagActiveInput!)` → `Boolean!`
- `startTrial(input: StartTrialInput!)` → `StartTrialResponse!`
- `stockExpenseItem(input: StockExpenseItemInput!)` → `StockExpenseItemResponse!`
- `syncProducts` → `Boolean!`
- `updateChatAssistant(input: UpdateChatAssistantInput!)` → `UpdateChatAssistantResponse!`
- `updateConfig(input: UpdateConfigInput!, urn: String!)` → `ConfigType!`
- `updateEstablishment(input: UpdateEstablishmentInput!, urn: String!)` → `UpdateEstablishmentResponse!`
- `updateExpense(expenseId: String!, input: UpdateExpenseInput!)` → `UpdateExpenseResponse!`
- `updateExpenseCategory(input: UpdateExpenseCategoryInput!)` → `UpdateExpenseCategoryResponse!`
- `updateExpenseItem(input: UpdateExpenseItemInput!)` → `UpdateExpenseItemResponse!`
- `updateInventoryItem(input: UpdateInventoryItemInput!, urn: String!)` → `UpdateInventoryItemResponse!`
- `updateLicense(input: UpdateLicenseInput!, urn: String!)` → `UpdateLicenseResponse!`
- `updateOAuth2Client(clientId: String!, input: UpdateOAuth2ClientInput!)` → `OAuthClientType!`
- `updatePassword(password: String!, token: String!)` → `UpdatePasswordResult!`
  Update a user password
- `updateProductTag(input: UpdateProductTagInput!)` → `UpdateProductTagResponse!`
- `updatePrompt(input: UpdatePromptInput!)` → `UpdatePromptResponse!`
- `updatePurchasedLicenseValidUntil(purchasedLicenseUrn: String!, validUntil: DateTime!)` → `UpdatePurchasedLicenseValidUntilResponse!`
- `updateRecipe(input: UpdateRecipeInput!)` → `UpdateRecipeResponse!`
- `updateRecipeCategory(input: UpdateRecipeCategoryInput!, urn: String!)` → `UpdateRecipeCategoryResponse!`
- `updateRecipeModifier(input: UpdateRecipeModifierInput!, urn: String!)` → `UpdateRecipeModifierResponse!`
- `updateStorage(input: UpdateStorageInput!, urn: String!)` → `UpdateStorageResponse!`
- `updateUser(accountUrn: String!, input: UpdateUserAccountInput!)` → `UpdateUserResponse!`
  Update a user account
- `updateVendor(input: UpdateVendorInput!)` → `VendorGql!`

## Subscriptions

Total: 13

- `chatResponseGenerated(chatUrn: String!)` → `ChatResponseGeneratedSubscription!`
- `expenseCreated(expenseId: String)` → `ExpenseCreatedSubscriptionResponse!`
- `expenseDeleted(expenseId: String)` → `ExpenseDeletedSubscriptionResponse!`
- `expenseItemAdded(expenseId: String, notifyOwn: Boolean)` → `ExpenseItemAddedSubscriptionResponse!`
- `expenseItemRemoved(expenseId: String, notifyOwn: Boolean)` → `ExpenseItemRemovedSubscriptionResponse!`
- `expenseItemUpdated(expenseItemUrn: String, notifyOwn: Boolean)` → `ExpenseItemUpdatedSubscriptionResponse!`
- `expenseProcessingStatusUpdated(expenseId: String, notifyOwn: Boolean)` → `ExpenseProcessingStatusUpdateSubscriptionResponse!`
- `expenseUpdated(expenseId: String, notifyOwn: Boolean)` → `ExpenseUpdatedSubscriptionResponse!`
- `orderCreated` → `OrderCreateSubscriptionResponse!`
- `orderItemAdded(notifyOwn: Boolean, orderId: String)` → `AddOrderItemSubscriptionResponse!`
- `orderItemRemoved(notifyOwn: Boolean, orderId: String)` → `RemoveOrderItemSubscriptionResponse!`
- `orderStateUpdated(notifyOwn: Boolean, orderId: String)` → `OrderStateUpdateSubscriptionResponse!`
- `ordersOverviewUpdated(establishmentId: String!)` → `OrderOverviewResponse!`
