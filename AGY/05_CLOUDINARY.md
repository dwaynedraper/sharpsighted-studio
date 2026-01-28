# Cloudinary Integration Rules

This document defines how images are uploaded, stored, transformed, and displayed.  
If an image-related feature violates these rules, stop and fix it before continuing.

## 1) Cloudinary role
- Cloudinary is the only image storage and delivery system.
- Do not store images in MongoDB.
- MongoDB stores only Cloudinary identifiers and metadata.

## 2) Upload strategy (required)
- Use **direct uploads from admin forms**.
- Uploads must be authenticated and authorized server-side.
- Anonymous users must never be able to upload images.
- Only users with:
  - completed onboarding
  - `admin` or `superAdmin` role  
  may upload images.

## 3) Folder structure (strict)
All uploads must follow this structure.
/sharpsighted
/blog
/hero
/inline
/episodes
/cover
/inline
/votes
/paper
/rubric-a
/rubric-b
/rubric-c
/challenges
/results
/avatars
Rules:
- Folder names are semantic, not user-generated.
- Do not create dynamic folder names per user.
- Do not upload to root.
- Do not mix unrelated content types in the same folder.

## 4) Stored data in MongoDB
For each image, store only:
- `cloudinaryPublicId`
- `alt` text (required for content images)

Never store:
- raw URLs
- transformation URLs
- signatures or secrets

## 5) Transform-on-delivery (required)
- Upload originals only.
- All resizing and optimization happens on delivery.

### Named transformations
Define and use named transformations for consistency:

- `thumb`
  - small square or constrained aspect
  - used for lists and admin tables
- `card`
  - medium size
  - used for cards and previews
- `hero`
  - large, full-bleed capable
  - used for page heroes and feature sections

Rules:
- Do not create ad-hoc transformations in components.
- Always use named transformations.
- Respect original aspect ratio unless explicitly cropped.

## 6) Responsive delivery
- Use responsive images.
- Use `sizes` and `srcset` appropriately.
- Lazy-load offscreen images.
- Always define width and height (or aspect ratio) to avoid layout shift.

## 7) Image integrity rules
- Do not apply heavy filters that alter photographic integrity.
- Minor adjustments (crop, resize, compression) are acceptable.
- Do not recolor photography based on theme or accent.

## 8) Alt text and accessibility
- All content images must include meaningful `alt` text.
- Decorative images must be explicitly marked as decorative and ignored by screen readers.
- Admin UI must require alt text input for content images before publish.

## 9) Security rules
- Use signed uploads for all admin uploads.
- Validate:
  - file type (image only)
  - file size limits
- Reject executable or non-image uploads.
- Do not expose Cloudinary API secrets to the client.

## 10) Performance rules
- Use automatic format selection (e.g. modern formats).
- Use automatic quality where possible.
- Avoid oversized hero images on mobile.
- Prefer multiple smaller images over one massive image when appropriate.

## 11) Deletion and lifecycle
- Do not delete Cloudinary assets when content is archived.
- Assets may be reused across content.
- Orphan cleanup (optional, later):
  - identify unused assets
  - manual review before deletion