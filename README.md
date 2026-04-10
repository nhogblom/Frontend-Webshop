# Brandname Store

Frontend – Project Assignment – (VG Level)

## Requirements Specification

This project builds on the original G-level web shop assignment and extends it with additional VG-level cart functionality.

### G-level requirements that still apply
1. A web shop that displays all products from the Fake Store API.
2. A responsive CSS layout.
3. An order form where the customer provides:
   - name
   - phone number
   - email
   - delivery address

### VG-level additions
1. The customer must be able to order multiple products.
2. A shopping cart must be implemented with its own layout and functionality.
3. The shopping cart must persist after page reload using LocalStorage.
4. The application must be published online, for example via GitHub Pages.

## Functionality

### Core functionality
1. Display all products from the Fake Store API.
2. Allow the user to order a product through an order form.
3. Validate all form fields using JavaScript.
4. Show clear validation messages when input is invalid.
5. Publish the application online.

### Shopping cart functionality
1. Add products to the cart.
2. Order multiple products at the same time.
3. Increase or decrease quantity for each product.
4. Remove a single product from the cart.
5. Remove all products from the cart.
6. Show the total price for each product.
7. Show the total sum for the entire cart.
8. Save the cart in LocalStorage so it remains after page reload.

### Additional features
1. Product filtering by category.

## Form Validation

All form fields are validated with JavaScript and provide clear error messages when invalid.

- **Name:** minimum 2 characters, maximum 50 characters
- **Email:** must contain `@`, maximum 50 characters
- **Phone number:** may contain digits, hyphens, and parentheses, maximum 20 characters
- **Street address:** minimum 2 characters, maximum 50 characters
- **Postal code:** exactly 5 digits
- **City:** minimum 2 characters, maximum 20 characters

## Technologies Used

- HTML
- CSS
- Bootstrap
- JavaScript
- Fake Store API
- LocalStorage

## Deployment

The application is deployed online using GitHub Pages.

## Purpose

The purpose of this project is to build a responsive and user-friendly web shop where users can browse products, add items to a shopping cart, manage quantities, and complete an order through a validated checkout form.
