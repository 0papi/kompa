
# Task List

## Server
- [x] Create a store for all table names in the config directory (`server/src/config/tables.ts`)
- [x] Refactor all repeated actions such as create, read, delete and update so that we pass in tableName and whatever is required so that we dont have to keep repeated all those actions rewriting the same logic over and over (`server/src/services/base.service.ts`)
- [x] Update listing model to use Firebase UID (text) instead of UUID for userId field
- [x] Implement soft delete for listings with deletedAt timestamp
- [x] Add restore endpoint for soft-deleted listings
- [x] Add status update endpoint (PATCH /listings/:id/status) for publish/unpublish/archive/unarchive

## Frontend - Listings
- [x] Implement frontend listing creation with React Query mutations
- [x] Implement frontend listing table with filters pagination using url search params
- [x] Revamp listing table filters so that we dont just use one big search item but we have multiple individual search items. Build a world class search experience because that is the sort of product we are building here.
- [x] Add layout controller (grid/list toggle) using Zustand with localStorage persistence
- [x] Add smooth animations for layout transitions using framer-motion
- [x] Fix listing card height consistency issue
- [x] Create dynamic listing actions dropdown component with status-based actions
- [x] Implement publish/unpublish/archive/unarchive functionality
- [x] Add duplicate listing functionality
- [x] Integrate Firebase authentication tokens with API client

## Frontend - Auth & General
- [x] Update API client to use Firebase auth tokens instead of localStorage
- [x] Use shadcn Select component with react-hook-form Controller pattern
- [x] Add theme toggle to dashboard header
- [x] Implement hierarchical property type selection (category → type)
- [x] Make listing features dynamic (add/remove) with chip/tag UI

## Frontend - Marketplace (Optional auth)
- [x] Implement marketplace listings page (shows only published listings) perhaps with infinite scrolling so that users can see all listings
- [ ] Implement comprehensive serverside search on marketplace listing page
- [x] Implement a dynamic marketplace header component that will show that user is logged in when they are browsing marketpace while logged in. otherwise it would show a sign in button
- [x] Implement marketplace listing detail page (url should be marketplace?listingId=<id>)
- [x] Implement a feature where on the marketing listing details when the user clicks bookmark we check if the user is logged in and add to bookmarks (check the server i have added the bookmarks table) and implement the full seamless bookmarking experience

## Pending Tasks
- [ ] Apply database migrations to production
- [ ] Implement listing edit page
- [ ] Implement listing detail/view page
- [ ] Add image upload functionality for listings
- [ ] Add loading states for all mutations
- [ ] Implement optimistic updates for status changes

## Infra, Logging Etc
- [ ] Implement slack logging for all server actions
- [ ] Set up error monitoring (e.g., Sentry)
- [ ] Add API rate limiting
- [ ] Set up CI/CD pipeline

## Known Issues
- Database migration blocked by existing user_roles enum (needs manual resolution)
